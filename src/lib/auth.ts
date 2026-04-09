import { type RequestEventBase } from "@builder.io/qwik-city";
import { compareSync } from "bcryptjs";
import { getDb } from "~/db/client";
import { users } from "~/db/schema";
import { eq } from "drizzle-orm";

const SESSION_COOKIE = "redimed_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Very simple session management via a signed cookie.
 * In production, replace with a proper JWT or Auth.js setup.
 */

export async function authenticateUser(email: string, password: string, env: any) {
  if (typeof email !== "string" || typeof password !== "string") return null;

  const db = getDb(env);
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  if (!user) return null;
  if (!compareSync(password, user.passwordHash)) return null;

  return { id: user.id, email: user.email, name: user.name };
}

export function createSession(
  event: RequestEventBase,
  user: { id: number; email: string; name: string },
) {
  // Store a simple JSON payload in a signed, httpOnly cookie
  const payload = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  // Base64 encode + a simple HMAC-like signature using the secret
  const encoded = Buffer.from(payload).toString("base64url");
  const secret = event.env.get("ADMIN_SESSION_SECRET") ?? "dev-secret";
  const signature = simpleSign(encoded, secret);

  event.cookie.set(SESSION_COOKIE, `${encoded}.${signature}`, {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
  });
}

export function validateSession(event: RequestEventBase) {
  const raw = event.cookie.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const [encoded, signature] = raw.split(".");
  if (!encoded || !signature) return null;

  const secret = event.env.get("ADMIN_SESSION_SECRET") ?? "dev-secret";
  if (simpleSign(encoded, secret) !== signature) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
    return payload as { id: number; email: string; name: string };
  } catch {
    return null;
  }
}

export function destroySession(event: RequestEventBase) {
  event.cookie.delete(SESSION_COOKIE, { path: "/" });
}

// Simple HMAC-like signing (for dev — in production use crypto.createHmac)
function simpleSign(data: string, secret: string): string {
  let hash = 0;
  const combined = data + secret;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

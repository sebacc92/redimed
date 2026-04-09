import { type RequestHandler } from "@builder.io/qwik-city";
import { validateSession } from "~/lib/auth";

export const onRequest: RequestHandler = async (event) => {
  // Skip auth check for the login page
  if (event.url.pathname === "/admin/login/") {
    return;
  }

  const session = validateSession(event);
  if (!session) {
    throw event.redirect(302, "/admin/login/");
  }

  // Make session data available to all admin routes
  event.sharedMap.set("session", session);
};

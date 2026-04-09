import { component$ } from "@builder.io/qwik";
import { routeAction$, Form, type DocumentHead } from "@builder.io/qwik-city";
import { authenticateUser, createSession } from "~/lib/auth";
import { Button } from "~/components/ui";

export const useLoginAction = routeAction$(async (data, event) => {
  const email = String(data.email ?? "").trim();
  const password = String(data.password ?? "");

  if (!email || !password) {
    return { success: false, error: "Email y contraseña son obligatorios." };
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return { success: false, error: "Credenciales inválidas." };
  }

  createSession(event, user);
  throw event.redirect(302, "/admin/");
});

export default component$(() => {
  const loginAction = useLoginAction();

  return (
    <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div class="w-full max-w-md">
        {/* Logo */}
        <div class="mb-8 text-center">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-foreground">Redimed Admin</h1>
          <p class="mt-1 text-sm text-muted-foreground">
            Ingresá con tu cuenta de administrador
          </p>
        </div>

        {/* Login Card */}
        <div class="rounded-2xl border border-border/50 bg-white p-8 shadow-sm">
          {loginAction.value?.error && (
            <div class="mb-4 rounded-lg border border-alert/20 bg-alert/5 px-4 py-3 text-sm text-alert">
              {loginAction.value.error}
            </div>
          )}

          <Form action={loginAction} class="flex flex-col gap-5">
            <div>
              <label for="login-email" class="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                placeholder="admin@redimed.com.ar"
              />
            </div>
            <div>
              <label for="login-password" class="mb-1.5 block text-sm font-medium text-foreground">
                Contraseña
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" size="md" class="w-full rounded-lg" disabled={loginAction.isRunning}>
              {loginAction.isRunning ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
          </Form>
        </div>

        <p class="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Redimed — Panel de Administración
        </p>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Login — Redimed Admin",
};

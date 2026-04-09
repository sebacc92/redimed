import { component$ } from "@builder.io/qwik";
import {
  routeAction$,
  Form,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { db } from "~/db/client";
import { users } from "~/db/schema";
import { eq } from "drizzle-orm";
import { validateSession } from "~/lib/auth";
import { hashSync, compareSync } from "bcryptjs";
import { Button } from "~/components/ui";
import { LuSave, LuShieldAlert } from "@qwikest/icons/lucide";

export const useUpdatePassword = routeAction$(async (data, event) => {
  const session = validateSession(event);
  if (!session) {
    return { success: false, error: "No autorizado." };
  }

  const currentPassword = String(data.currentPassword ?? "");
  const newPassword = String(data.newPassword ?? "");
  const confirmPassword = String(data.confirmPassword ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "Todos los campos son obligatorios." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Las contraseñas nuevas no coinciden." };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "La nueva contraseña debe tener al menos 6 caracteres." };
  }

  // Fetch user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.id))
    .limit(1);

  if (!user) {
    return { success: false, error: "Usuario no encontrado." };
  }

  // Verify current password
  if (!compareSync(currentPassword, user.passwordHash)) {
    return { success: false, error: "La contraseña actual es incorrecta." };
  }

  // Update password
  const newHash = hashSync(newPassword, 10);
  await db
    .update(users)
    .set({ passwordHash: newHash })
    .where(eq(users.id, session.id));

  return { success: true };
});

export default component$(() => {
  const updatePwd = useUpdatePassword();

  return (
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Cambiar la contraseña de la cuenta administradora
        </p>
      </div>

      <div class="mx-auto max-w-xl">
        {updatePwd.value?.success && (
          <div class="mb-6 rounded-lg border border-secondary/30 bg-secondary/5 px-4 py-3 text-sm text-secondary">
            ✅ Contraseña actualizada correctamente.
          </div>
        )}

        <Form action={updatePwd} class="rounded-xl border border-border/50 bg-white p-6 shadow-sm">
          <div class="mb-6 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-primary">
            <LuShieldAlert class="h-5 w-5 shrink-0" />
            <p class="text-sm">
              Por razones de seguridad, cerrá la sesión y volvé a ingresar luego de cambiar tu contraseña.
            </p>
          </div>

          <div class="space-y-4">
            <div>
              <label
                for="currentPassword"
                class="mb-1.5 block text-sm font-medium text-foreground"
              >
                Contraseña Actual
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                class="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
            
            <div class="pt-2">
              <label
                for="newPassword"
                class="mb-1.5 block text-sm font-medium text-foreground"
              >
                Nueva Contraseña
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minlength={6}
                class="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
            
            <div>
              <label
                for="confirmPassword"
                class="mb-1.5 block text-sm font-medium text-foreground"
              >
                Confirmar Nueva Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minlength={6}
                class="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
          </div>

          {updatePwd.value?.error && (
            <p class="mt-4 rounded-lg bg-alert/10 px-3 py-2 text-sm text-alert">
              ❌ {updatePwd.value.error}
            </p>
          )}

          <div class="mt-6 flex justify-end">
            <Button type="submit" size="md" class="gap-2 rounded-lg">
              <LuSave class="h-4 w-4" />
              {updatePwd.isRunning ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Usuarios — Redimed Admin",
};

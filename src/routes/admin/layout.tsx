import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation, routeAction$ } from "@builder.io/qwik-city";
import { destroySession } from "~/lib/auth";
import {
  LuLayoutDashboard,
  LuStethoscope,
  LuMail,
  LuSettings,
  LuUsers,
  LuLogOut,
  LuArrowLeft,
} from "@qwikest/icons/lucide";

export const useLogoutAction = routeAction$(async (_, event) => {
  destroySession(event);
  throw event.redirect(302, "/admin/login/");
});

const navItems = [
  { label: "Ajustes", href: "/admin/ajustes/", icon: LuSettings },
  { label: "Dashboard", href: "/admin/", icon: LuLayoutDashboard },
  { label: "Servicios", href: "/admin/servicios/", icon: LuStethoscope },
  { label: "Mensajes", href: "/admin/mensajes/", icon: LuMail },
  { label: "Usuarios", href: "/admin/usuarios/", icon: LuUsers },
];

export default component$(() => {
  const loc = useLocation();
  const logoutAction = useLogoutAction();

  return (
    <div class="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside class="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/50 bg-white lg:flex">
        {/* Brand */}
        <div class="flex h-16 items-center gap-2 border-b border-border/50 px-6">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <span class="text-lg font-bold text-primary">Redimed</span>
          <span class="ml-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
            Admin
          </span>
        </div>

        {/* Nav Links */}
        <nav class="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive =
              loc.url.pathname === item.href ||
              (item.href !== "/admin/" &&
                loc.url.pathname.startsWith(item.href));

            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                class={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon class="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div class="border-t border-border/50 p-4 space-y-1">
          <Link
            href="/"
            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LuArrowLeft class="h-5 w-5" />
            Volver al sitio
          </Link>
          <button
            onClick$={async () => {
              await logoutAction.submit({});
            }}
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-alert/5 hover:text-alert"
          >
            <LuLogOut class="h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div class="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border/50 bg-white px-4 lg:hidden">
        <div class="flex items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <span class="font-bold text-primary">Admin</span>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div class="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border/50 bg-white py-2 lg:hidden">
        {navItems.map((item) => {
          const isActive =
            loc.url.pathname === item.href ||
            (item.href !== "/admin/" && loc.url.pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              class={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon class="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Main Content */}
      <main class="flex-1 pt-14 pb-16 lg:ml-64 lg:pt-0 lg:pb-0">
        <div class="mx-auto max-w-6xl p-6 lg:p-8">
          <Slot />
        </div>
      </main>
    </div>
  );
});

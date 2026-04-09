import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/db/client";
import { services, messages } from "~/db/schema";
import { eq, count } from "drizzle-orm";
import { Card } from "~/components/ui";
import { LuStethoscope, LuMail, LuTrendingUp, LuActivity } from "@qwikest/icons/lucide";

export const useDashboardStats = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const [activeServices] = await db
    .select({ count: count() })
    .from(services)
    .where(eq(services.isActive, true));

  const [unreadMessages] = await db
    .select({ count: count() })
    .from(messages)
    .where(eq(messages.status, "unread"));

  const [totalMessages] = await db.select({ count: count() }).from(messages);

  const [totalServices] = await db.select({ count: count() }).from(services);

  return {
    activeServices: activeServices?.count ?? 0,
    unreadMessages: unreadMessages?.count ?? 0,
    totalMessages: totalMessages?.count ?? 0,
    totalServices: totalServices?.count ?? 0,
  };
});

export default component$(() => {
  const stats = useDashboardStats();
  const s = stats.value;

  const cards = [
    {
      title: "Servicios Activos",
      value: s.activeServices,
      total: s.totalServices,
      icon: LuStethoscope,
      color: "bg-primary/10 text-primary",
      href: "/admin/servicios/",
    },
    {
      title: "Mensajes sin leer",
      value: s.unreadMessages,
      total: s.totalMessages,
      icon: LuMail,
      color: "bg-secondary/10 text-secondary",
      href: "/admin/mensajes/",
    },
    {
      title: "Total Servicios",
      value: s.totalServices,
      total: null,
      icon: LuTrendingUp,
      color: "bg-sky-100 text-sky-700",
      href: "/admin/servicios/",
    },
    {
      title: "Total Consultas",
      value: s.totalMessages,
      total: null,
      icon: LuActivity,
      color: "bg-amber-100 text-amber-700",
      href: "/admin/mensajes/",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-foreground">Dashboard</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Resumen general de tu sitio web
        </p>
      </div>

      {/* Stats Grid */}
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <a key={card.title} href={card.href}>
              <Card.Root class="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <Card.Content class="p-5">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="text-sm font-medium text-muted-foreground">
                        {card.title}
                      </p>
                      <p class="mt-2 text-3xl font-bold text-foreground">
                        {card.value}
                      </p>
                      {card.total !== null && (
                        <p class="mt-1 text-xs text-muted-foreground">
                          de {card.total} totales
                        </p>
                      )}
                    </div>
                    <div
                      class={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}
                    >
                      <Icon class="h-5 w-5" />
                    </div>
                  </div>
                </Card.Content>
              </Card.Root>
            </a>
          );
        })}
      </div>

      {/* Quick actions */}
      <div class="mt-8 rounded-2xl border border-border/50 bg-white p-6">
        <h2 class="text-lg font-semibold text-foreground">Acciones rápidas</h2>
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <a
            href="/admin/servicios/"
            class="flex items-center gap-3 rounded-xl border border-border/50 p-4 transition-colors hover:border-primary/30 hover:bg-accent"
          >
            <LuStethoscope class="h-5 w-5 text-primary" />
            <span class="text-sm font-medium">Gestionar Servicios</span>
          </a>
          <a
            href="/admin/mensajes/"
            class="flex items-center gap-3 rounded-xl border border-border/50 p-4 transition-colors hover:border-primary/30 hover:bg-accent"
          >
            <LuMail class="h-5 w-5 text-secondary" />
            <span class="text-sm font-medium">Ver Mensajes</span>
          </a>
          <a
            href="/admin/ajustes/"
            class="flex items-center gap-3 rounded-xl border border-border/50 p-4 transition-colors hover:border-primary/30 hover:bg-accent"
          >
            <LuActivity class="h-5 w-5 text-sky-600" />
            <span class="text-sm font-medium">Configuración del Sitio</span>
          </a>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dashboard — Redimed Admin",
};

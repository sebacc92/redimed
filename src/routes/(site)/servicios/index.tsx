import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { db } from "~/db/client";
import { services, siteSettings } from "~/db/schema";
import { eq } from "drizzle-orm";
import { ServicesSection } from "~/components/site/services-section";

export const useServices = routeLoader$(async () => {
  return await db
    .select({
      id: services.id,
      title: services.title,
      description: services.description,
      iconName: services.iconName,
    })
    .from(services)
    .where(eq(services.isActive, true))
    .orderBy(services.order);
});

export const useServicesSettings = routeLoader$(async () => {
  const rows = await db.select().from(siteSettings);
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
});

export default component$(() => {
  const serviceList = useServices();
  const settings = useServicesSettings();
  const s = settings.value;

  return (
    <div class="pt-16">
      <section class="bg-gradient-to-br from-primary to-sky-800 py-16 text-center text-white">
        <div class="mx-auto max-w-3xl px-4">
          <h1 class="text-4xl font-bold tracking-tight">Nuestros Servicios</h1>
          <p class="mt-4 text-lg text-white/80">
            Brindamos una amplia gama de servicios de salud a domicilio con
            profesionales altamente capacitados.
          </p>
        </div>
      </section>
      <ServicesSection
        services={serviceList.value}
        title={s.services_title}
        subtitle={s.services_subtitle}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Servicios — Redimed Internación Domiciliaria",
  meta: [
    {
      name: "description",
      content:
        "Conocé todos nuestros servicios de internación domiciliaria: enfermería, kinesiología, fonoaudiología, recursos técnicos y más.",
    },
  ],
};

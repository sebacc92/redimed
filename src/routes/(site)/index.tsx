import { component$ } from "@builder.io/qwik";
import { routeLoader$, routeAction$, type DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/db/client";
import { services, messages, siteSettings } from "~/db/schema";
import { eq } from "drizzle-orm";
import { Hero } from "~/components/site/hero";
import { ServicesSection } from "~/components/site/services-section";
import { AboutSection } from "~/components/site/about-section";
import { ContactSection } from "~/components/site/contact-section";

// ─── Load active services ───────────────────────────────────────
export const useServices = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
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

// ─── Load settings for hero + contact ───────────────────────────
export const useHomeSettings = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  const rows = await db.select().from(siteSettings);
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
});

// ─── Contact form action ────────────────────────────────────────
export const useContactAction = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const phone = String(data.phone ?? "").trim();
  const message = String(data.message ?? "").trim();

  if (!name || !message) {
    return { success: false, error: "Nombre y mensaje son obligatorios." };
  }

  await db.insert(messages).values({
    name,
    email,
    phone,
    message,
    status: "unread",
  });

  return { success: true };
});

// ─── Page Component ─────────────────────────────────────────────
export default component$(() => {
  const serviceList = useServices();
  const settings = useHomeSettings();
  const contactAction = useContactAction();
  const s = settings.value;

  return (
    <>
      <Hero
        title={s.hero_title ?? "Internación Domiciliaria Integral"}
        subtitle={
          s.hero_subtitle ??
          "Más de 15 años brindando atención médica de calidad en la comodidad de tu hogar."
        }
        bgImage={s.hero_bg_image}
      />

      <ServicesSection
        services={serviceList.value}
        title={s.services_title}
        subtitle={s.services_subtitle}
      />

      <AboutSection
        title={s.about_title}
        text1={s.about_text_1}
        text2={s.about_text_2}
        val1Title={s.about_val1_title}
        val1Desc={s.about_val1_desc}
        val2Title={s.about_val2_title}
        val2Desc={s.about_val2_desc}
        val3Title={s.about_val3_title}
        val3Desc={s.about_val3_desc}
      />

      <ContactSection
        mapsUrl={s.site_maps_url ?? ""}
        phone={s.site_phone ?? ""}
        email={s.site_email ?? ""}
        address={s.site_address ?? ""}
        contactAction={contactAction}
        title={s.contact_title}
        subtitle={s.contact_subtitle}
      />
    </>
  );
});

// ─── SEO ────────────────────────────────────────────────────────
export const head: DocumentHead = {
  title: "Redimed — Internación Domiciliaria Integral",
  meta: [
    {
      name: "description",
      content:
        "Redimed: empresa líder en internación domiciliaria integral en Argentina. Más de 15 años de experiencia brindando atención médica profesional 24/7 en tu hogar.",
    },
    {
      name: "keywords",
      content:
        "internación domiciliaria, atención médica domiciliaria, enfermería a domicilio, kinesiología, fonoaudiología, cuidadores, Buenos Aires, Argentina",
    },
    {
      property: "og:title",
      content: "Redimed — Internación Domiciliaria Integral",
    },
    {
      property: "og:description",
      content:
        "Atención médica profesional 24/7 en la comodidad de tu hogar. Más de 15 años de experiencia.",
    },
    { property: "og:type", content: "website" },
  ],
};

import { component$ } from "@builder.io/qwik";
import { routeLoader$, routeAction$, type DocumentHead } from "@builder.io/qwik-city";
import { db } from "~/db/client";
import { messages, siteSettings } from "~/db/schema";
import { ContactSection } from "~/components/site/contact-section";

export const useContactSettings = routeLoader$(async () => {
  const rows = await db.select().from(siteSettings);
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
});

export const useContactAction = routeAction$(async (data) => {
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

export default component$(() => {
  const settings = useContactSettings();
  const contactAction = useContactAction();
  const s = settings.value;

  return (
    <div class="pt-16">
      <section class="bg-gradient-to-br from-primary to-sky-800 py-16 text-center text-white">
        <div class="mx-auto max-w-3xl px-4">
          <h1 class="text-4xl font-bold tracking-tight">Contacto</h1>
          <p class="mt-4 text-lg text-white/80">
            Estamos para ayudarte. Completá el formulario o contactanos
            directamente.
          </p>
        </div>
      </section>
      <ContactSection
        mapsUrl={s.site_maps_url ?? ""}
        phone={s.site_phone ?? ""}
        email={s.site_email ?? ""}
        address={s.site_address ?? ""}
        contactAction={contactAction}
        title={s.contact_title}
        subtitle={s.contact_subtitle}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Contacto — Redimed Internación Domiciliaria",
  meta: [
    {
      name: "description",
      content:
        "Contactá a Redimed para consultas sobre internación domiciliaria. Atención 24/7 por teléfono, WhatsApp o formulario.",
    },
  ],
};

import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { db } from "~/db/client";
import { siteSettings } from "~/db/schema";
import { Navbar } from "~/components/site/navbar";
import { Footer } from "~/components/site/footer";
import { WhatsappFab } from "~/components/site/whatsapp-fab";
import { Chatbot } from "~/components/site/chatbot";

// ─── Load site settings for the entire public layout ────────────
export const useSettings = routeLoader$(async () => {
  const rows = await db.select().from(siteSettings);
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
});

export default component$(() => {
  const settings = useSettings();
  const s = settings.value;

  return (
    <div class="flex min-h-screen flex-col">
      <Navbar
        phone={s.site_phone}
        whatsapp={s.site_whatsapp}
        facebook={s.site_facebook}
        instagram={s.site_instagram}
        linkedin={s.site_linkedin}
      />

      <main class="flex-1">
        <Slot />
      </main>

      <Footer
        phone={s.site_phone}
        email={s.site_email}
        address={s.site_address}
      />

      {/* Floating widgets */}
      <WhatsappFab whatsapp={s.site_whatsapp ?? "5491112345678"} />
      <Chatbot />
    </div>
  );
});

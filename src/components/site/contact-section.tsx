import { component$, useSignal } from "@builder.io/qwik";
import { type ActionStore } from "@builder.io/qwik-city";
import { Button } from "~/components/ui";
import { LuSend, LuCheckCircle, LuMapPin, LuPhone, LuMail } from "@qwikest/icons/lucide";

interface ContactSectionProps {
  mapsUrl: string;
  phone: string;
  email: string;
  address: string;
  contactAction: ActionStore<
    { success: boolean; error?: string },
    { name: string; email: string; phone: string; message: string },
    true
  >;
  title?: string;
  subtitle?: string;
}

export const ContactSection = component$<ContactSectionProps>(
  ({ mapsUrl, phone, email, address, contactAction, title, subtitle }) => {
    const sent = useSignal(false);

    return (
      <section id="contacto" class="py-20 lg:py-28">
        <div class="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Section Header */}
          <div class="mx-auto max-w-2xl text-center">
            <span class="text-sm font-semibold tracking-wider text-secondary uppercase">
              Contacto
            </span>
            <h2 class="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title || "¿Necesitás atención domiciliaria?"}
            </h2>
            <p class="mt-4 text-lg text-muted-foreground">
              {subtitle || "Completá el formulario y nos pondremos en contacto a la brevedad, o llamanos directamente."}
            </p>
          </div>

          <div class="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <div class="rounded-2xl border border-border/50 bg-white p-8 shadow-sm">
              {contactAction.value?.success || sent.value ? (
                <div class="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div class="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                    <LuCheckCircle class="h-8 w-8 text-secondary" />
                  </div>
                  <h3 class="text-xl font-semibold text-foreground">
                    ¡Mensaje enviado!
                  </h3>
                  <p class="text-muted-foreground">
                    Nos pondremos en contacto a la brevedad. Gracias por
                    confiar en Redimed.
                  </p>
                </div>
              ) : (
                <form
                  action={contactAction.actionPath}
                  method="post"
                  preventdefault:submit
                  onSubmit$={async (_, form) => {
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData) as Record<string, string>;
                    await contactAction.submit(data as any);
                    sent.value = true;
                  }}
                  class="flex flex-col gap-5"
                >
                  <div class="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        for="contact-name"
                        class="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        Nombre completo *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        placeholder="Juan Pérez"
                      />
                    </div>
                    <div>
                      <label
                        for="contact-phone"
                        class="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        Teléfono *
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        required
                        class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        placeholder="11 1234-5678"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      for="contact-email"
                      class="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      placeholder="juan@email.com"
                    />
                  </div>
                  <div>
                    <label
                      for="contact-message"
                      class="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Mensaje *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={4}
                      class="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      placeholder="Describe brevemente qué necesitás..."
                    />
                  </div>
                  <Button
                    type="submit"
                    size="md"
                    class="gap-2 rounded-lg"
                    disabled={contactAction.isRunning}
                  >
                    {contactAction.isRunning ? (
                      "Enviando..."
                    ) : (
                      <>
                        <LuSend class="h-4 w-4" />
                        Enviar consulta
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Map + Info */}
            <div class="flex flex-col gap-6">
              {/* Contact cards */}
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <a
                  href={`tel:${phone}`}
                  class="flex items-center gap-3 rounded-xl border border-border/50 bg-white p-4 shadow-sm transition-colors hover:border-primary/30"
                >
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <LuPhone class="h-5 w-5" />
                  </div>
                  <div>
                    <p class="text-xs font-medium text-muted-foreground">
                      Teléfono
                    </p>
                    <p class="text-sm font-semibold text-foreground">{phone}</p>
                  </div>
                </a>
                <a
                  href={`mailto:${email}`}
                  class="flex items-center gap-3 rounded-xl border border-border/50 bg-white p-4 shadow-sm transition-colors hover:border-primary/30"
                >
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <LuMail class="h-5 w-5" />
                  </div>
                  <div>
                    <p class="text-xs font-medium text-muted-foreground">
                      Email
                    </p>
                    <p class="text-sm font-semibold text-foreground">{email}</p>
                  </div>
                </a>
              </div>
              <div class="flex items-start gap-3 rounded-xl border border-border/50 bg-white p-4 shadow-sm">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <LuMapPin class="h-5 w-5" />
                </div>
                <div>
                  <p class="text-xs font-medium text-muted-foreground">
                    Dirección
                  </p>
                  <p class="text-sm font-semibold text-foreground">{address}</p>
                </div>
              </div>

              {/* Google Maps */}
              <div class="flex-1 overflow-hidden rounded-2xl border border-border/50 shadow-sm">
                {mapsUrl.includes('embed') ? (
                  <iframe
                    src={mapsUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "260px" }}
                    allowFullscreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación de Redimed"
                  />
                ) : (
                  <div class="flex h-full min-h-[260px] flex-col items-center justify-center gap-4 bg-muted/10 p-6 text-center">
                    <LuMapPin class="h-10 w-10 text-muted-foreground" />
                    <p class="text-sm font-medium text-foreground">
                      Encontrá nuestra ubicación en el mapa
                    </p>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
                    >
                      Abrir en Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

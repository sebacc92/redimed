import { $, component$, useSignal } from "@builder.io/qwik";
import {
  routeLoader$,
  routeAction$,
  Form,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { getDb } from "~/db/client";
import { siteSettings } from "~/db/schema";
import { eq, sql } from "drizzle-orm";
import { Button } from "~/components/ui";
import { LuSave, LuInfo, LuImage } from "@qwikest/icons/lucide";
import { put } from '@vercel/blob';
import imageCompression from 'browser-image-compression';

// ─── Load all settings ──────────────────────────────────────────
export const useAllSettings = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  return await db.select().from(siteSettings).orderBy(siteSettings.key);
});

// ─── Update settings ────────────────────────────────────────────
export const useUpdateSettings = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  // data comes as flat key-value pairs from the form
  const entries = Object.entries(data).filter(
    ([key]) => key.startsWith("setting_"),
  );

  for (const [formKey, value] of entries) {
    const settingKey = formKey.replace("setting_", "");
    await db
      .update(siteSettings)
      .set({
        value: String(value ?? ""),
        updatedAt: sql`(datetime('now'))`,
      })
      .where(eq(siteSettings.key, settingKey));
  }

  return { success: true };
});

// ─── Update hero image ──────────────────────────────────────────
export const useUpdateHeroImage = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  
  if (data.image && typeof data.image === 'object' && (data.image as Blob).size > 0) {
    const file = data.image as File;
    const fileName = file.name || `hero-${Date.now()}.webp`;
    const { url } = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: true,
      token: requestEvent.env.get('BLOB_READ_WRITE_TOKEN'),
    });
    
    // Validate if setting exists
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, 'hero_bg_image'));
    
    if (existing && existing.length > 0) {
      await db
        .update(siteSettings)
        .set({
          value: url,
          updatedAt: sql`(datetime('now'))`,
        })
        .where(eq(siteSettings.key, 'hero_bg_image'));
    } else {
      await db
        .insert(siteSettings)
        .values({
          key: 'hero_bg_image',
          value: url,
          updatedAt: sql`(datetime('now'))`,
        });
    }

    return { success: true, url };
  }
  return { success: false, error: 'No se recibió ninguna imagen.' };
});

// ─── Add new setting ────────────────────────────────────────────
export const useAddSetting = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  const key = String(data.key ?? "").trim().toLowerCase().replace(/\s+/g, "_");
  const value = String(data.value ?? "").trim();

  if (!key) return { success: false, error: "La clave es obligatoria." };

  await db
    .insert(siteSettings)
    .values({ key, value })
    .onConflictDoNothing();

  return { success: true };
});

const settingLabels: Record<string, { label: string; description: string; type: string }> = {
  site_phone: {
    label: "Teléfono",
    description: "Número de teléfono principal",
    type: "tel",
  },
  site_whatsapp: {
    label: "WhatsApp",
    description: "Número de WhatsApp (sin + ni espacios, ej: 5491112345678)",
    type: "text",
  },
  site_email: {
    label: "Email de contacto",
    description: "Dirección de email principal",
    type: "email",
  },
  site_address: {
    label: "Dirección",
    description: "Dirección física para mostrar en el sitio",
    type: "text",
  },
  site_maps_url: {
    label: "URL de Google Maps",
    description: "URL de embed del iframe de Google Maps",
    type: "url",
  },
  hero_title: {
    label: "Título del Hero",
    description: "Título principal que aparece en el banner de inicio",
    type: "text",
  },
  hero_subtitle: {
    label: "Subtítulo del Hero",
    description: "Texto debajo del título principal",
    type: "textarea",
  },
  services_title: {
    label: "Título de Servicios",
    description: "Ej: Atención integral a domicilio",
    type: "text",
  },
  services_subtitle: {
    label: "Subtítulo de Servicios",
    description: "Breve descripción general de los servicios",
    type: "textarea",
  },
  about_title: {
    label: "Título de Nosotros",
    description: "Ej: Más de 15 años cuidando la salud en tu hogar",
    type: "text",
  },
  about_text_1: {
    label: "Texto principal Nosotros (Párrafo 1)",
    description: "Primer párrafo descriptivo",
    type: "textarea",
  },
  about_text_2: {
    label: "Texto secundario Nosotros (Párrafo 2)",
    description: "Segundo párrafo descriptivo",
    type: "textarea",
  },
  about_val1_title: { label: "Valor 1 - Título", description: "", type: "text" },
  about_val1_desc: { label: "Valor 1 - Descripción", description: "", type: "textarea" },
  about_val2_title: { label: "Valor 2 - Título", description: "", type: "text" },
  about_val2_desc: { label: "Valor 2 - Descripción", description: "", type: "textarea" },
  about_val3_title: { label: "Valor 3 - Título", description: "", type: "text" },
  about_val3_desc: { label: "Valor 3 - Descripción", description: "", type: "textarea" },
  contact_title: { label: "Título de Contacto", description: "Ej: ¿Necesitás atención domiciliaria?", type: "text" },
  contact_subtitle: { label: "Subtítulo de Contacto", description: "Instrucciones del formulario", type: "textarea" },
};

export default component$(() => {
  const allSettings = useAllSettings();
  const updateAction = useUpdateSettings();
  const addAction = useAddSetting();
  const updateHeroAction = useUpdateHeroImage();
  const isCompressing = useSignal(false);
  const heroImage = allSettings.value.find((s) => s.key === "hero_bg_image")?.value;

  const handleImageSubmit = $(async (e: Event, currentTarget: HTMLFormElement) => {
    if (isCompressing.value || updateHeroAction.isRunning) return;

    isCompressing.value = true;
    try {
      const formData = new FormData(currentTarget);
      const imageFile = formData.get('image') as File | null;

      if (imageFile && imageFile.size > 0 && imageFile.name) {
        const options = {
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: 'image/webp',
          initialQuality: 0.8,
        };
        const compressedBlob = await imageCompression(imageFile, options);
        const newFileName = imageFile.name.replace(/\.[^/.]+$/, "") + ".webp";
        const compressedFile = new File([compressedBlob], newFileName, { type: 'image/webp' });
        
        formData.set('image', compressedFile);
      }

      await updateHeroAction.submit(formData);
    } catch (error) {
      console.error('Error al comprimir/subir imagen:', error);
    } finally {
      isCompressing.value = false;
    }
  });

  return (
    <div>
      {/* Header */}
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-foreground">Ajustes del Sitio</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Configurá los datos de contacto y textos del sitio web sin tocar
          código
        </p>
      </div>

      {/* Success message */}
      {updateAction.value?.success && (
        <div class="mb-4 rounded-lg border border-secondary/30 bg-secondary/5 px-4 py-3 text-sm text-secondary">
          ✅ Ajustes guardados correctamente
        </div>
      )}

      {/* Image Uploader */}
      <div class="mb-6 rounded-xl border border-border/50 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-foreground">Imagen del Hero</h2>
        <p class="mb-4 text-sm text-muted-foreground">Sube una imagen de fondo para la sección principal (recomendado: formato horizontal, ancho mayor a 1920px).</p>
        
        {updateHeroAction.value?.success && (
          <div class="mb-4 rounded-lg border border-secondary/30 bg-secondary/5 px-4 py-3 text-sm text-secondary">
            ✅ Imagen del hero actualizada correctamente
          </div>
        )}
        {updateHeroAction.value?.error && (
          <div class="mb-4 rounded-lg bg-alert/5 px-4 py-3 text-sm text-alert border border-alert/20">
            {updateHeroAction.value.error}
          </div>
        )}

        <Form 
          action={updateHeroAction}
          preventdefault:submit
          onSubmit$={handleImageSubmit}
          class="flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          {heroImage && (
            <div class="relative h-24 w-40 overflow-hidden rounded-lg border border-border shrink-0 bg-muted">
              <img src={heroImage} alt="Hero bg" class="h-full w-full object-cover" />
            </div>
          )}
          
          <div class="flex-1 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input
              type="file"
              name="image"
              id="hero-file"
              accept="image/*"
              required
              class="w-full sm:flex-1 border border-border bg-background rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-muted file:text-foreground file:cursor-pointer hover:file:bg-accent transition-colors"
            />
            <Button
              type="submit"
              disabled={isCompressing.value || updateHeroAction.isRunning}
              class="gap-2 shrink-0 w-full sm:w-auto rounded-lg"
            >
              <LuImage class="h-4 w-4" />
              {isCompressing.value ? "Optimizando..." : updateHeroAction.isRunning ? "Subiendo..." : "Subir Imagen"}
            </Button>
          </div>
        </Form>
      </div>

      {/* Settings Form */}
      <Form action={updateAction} class="space-y-6">
        {[
          {
            title: "Contacto y General",
            keys: ["site_phone", "site_whatsapp", "site_email", "site_address", "site_maps_url", "site_facebook", "site_instagram", "site_linkedin"],
          },
          {
            title: "Inicio (Hero)",
            keys: ["hero_title", "hero_subtitle"],
          },
          {
            title: "Sección Servicios",
            keys: ["services_title", "services_subtitle"],
          },
          {
            title: "Sección Nosotros",
            keys: [
              "about_title",
              "about_text_1",
              "about_text_2",
              "about_val1_title",
              "about_val1_desc",
              "about_val2_title",
              "about_val2_desc",
              "about_val3_title",
              "about_val3_desc",
            ],
          },
          {
            title: "Sección Contacto",
            keys: ["contact_title", "contact_subtitle"],
          },
        ].map((group) => {
          const groupSettings = allSettings.value.filter((s) =>
            group.keys.includes(s.key),
          );

          if (groupSettings.length === 0) return null;

          return (
            <div
              key={group.title}
              class="rounded-xl border border-border/50 bg-white shadow-sm overflow-hidden"
            >
              <div class="border-b border-border/30 bg-muted/20 px-5 py-3">
                <h3 class="font-semibold text-foreground">{group.title}</h3>
              </div>
              <div class="divide-y divide-border/30">
                {group.keys.map((key) => {
                  const setting = allSettings.value.find((s) => s.key === key);
                  if (!setting) return null;

                  const meta = settingLabels[setting.key];
                  const label = meta?.label ?? setting.key;
                  const description = meta?.description ?? "";
                  const inputType = meta?.type ?? "text";

                  return (
                    <div
                      key={setting.key}
                      class="grid gap-2 p-5 sm:grid-cols-3 sm:items-start sm:gap-4"
                    >
                      <div>
                        <label
                          for={`setting-${setting.key}`}
                          class="text-sm font-medium text-foreground"
                        >
                          {label}
                        </label>
                        {description && (
                          <p class="mt-0.5 flex items-start gap-1 text-xs text-muted-foreground">
                            <LuInfo class="mt-0.5 h-3 w-3 shrink-0" />
                            {description}
                          </p>
                        )}
                      </div>
                      <div class="sm:col-span-2">
                        {inputType === "textarea" ? (
                          <textarea
                            id={`setting-${setting.key}`}
                            name={`setting_${setting.key}`}
                            rows={3}
                            class="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            value={setting.value}
                          />
                        ) : (
                          <input
                            id={`setting-${setting.key}`}
                            name={`setting_${setting.key}`}
                            type={inputType}
                            class="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            value={setting.value}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Dynamic / unknown settings that don't fit the above groups */}
        {(() => {
          const knownKeys = [
            "site_phone", "site_whatsapp", "site_email", "site_address", "site_maps_url", "site_facebook", "site_instagram", "site_linkedin",
            "hero_title", "hero_subtitle", "hero_bg_image",
            "services_title", "services_subtitle",
            "about_title", "about_text_1", "about_text_2",
            "about_val1_title", "about_val1_desc", "about_val2_title", "about_val2_desc", "about_val3_title", "about_val3_desc",
            "contact_title", "contact_subtitle"
          ];
          const otherSettings = allSettings.value.filter(s => !knownKeys.includes(s.key));
          
          if (otherSettings.length === 0) return null;
          
          return (
            <div class="rounded-xl border border-border/50 bg-white shadow-sm overflow-hidden">
              <div class="border-b border-border/30 bg-muted/20 px-5 py-3">
                <h3 class="font-semibold text-foreground">Otras Configuraciones</h3>
              </div>
              <div class="divide-y divide-border/30">
                {otherSettings.map((setting) => (
                  <div key={setting.key} class="grid gap-2 p-5 sm:grid-cols-3 sm:items-start sm:gap-4">
                    <div>
                      <label for={`setting-${setting.key}`} class="text-sm font-medium text-foreground">
                        {settingLabels[setting.key]?.label || setting.key}
                      </label>
                    </div>
                    <div class="sm:col-span-2">
                      <input
                        id={`setting-${setting.key}`}
                        name={`setting_${setting.key}`}
                        type="text"
                        class="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        value={setting.value}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        <div class="sticky bottom-4 mx-auto flex max-w-sm justify-center rounded-2xl border border-border/50 bg-white/90 p-4 shadow-lg backdrop-blur">
          <Button type="submit" size="md" class="w-full gap-2 rounded-lg">
            <LuSave class="h-4 w-4" />
            {updateAction.isRunning ? "Guardando..." : "Guardar Todos los Cambios"}
          </Button>
        </div>
      </Form>

      {/* Add new setting */}
      <div class="mt-6 rounded-xl border border-dashed border-border bg-white p-5">
        <h3 class="mb-3 text-sm font-semibold text-foreground">
          Agregar nueva configuración
        </h3>
        <Form action={addAction} class="flex flex-col gap-3 sm:flex-row">
          <input
            name="key"
            type="text"
            required
            placeholder="Clave (ej: site_instagram)"
            class="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          <input
            name="value"
            type="text"
            placeholder="Valor"
            class="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          <Button type="submit" size="sm" look="outline" class="rounded-lg">
            Agregar
          </Button>
        </Form>
        {addAction.value?.error && (
          <p class="mt-2 text-sm text-alert">{addAction.value.error}</p>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Ajustes — Redimed Admin",
};

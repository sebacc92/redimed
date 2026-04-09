import { component$, useSignal } from "@builder.io/qwik";
import {
  routeLoader$,
  routeAction$,
  Form,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { db } from "~/db/client";
import { services } from "~/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "~/components/ui";
import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuCheck,
  LuX,
  LuGripVertical,
} from "@qwikest/icons/lucide";

// ─── Load all services ──────────────────────────────────────────
export const useAllServices = routeLoader$(async () => {
  return await db.select().from(services).orderBy(services.order);
});

// ─── Create service ─────────────────────────────────────────────
export const useCreateService = routeAction$(async (data) => {
  const title = String(data.title ?? "").trim();
  const description = String(data.description ?? "").trim();
  const iconName = String(data.icon_name ?? "heart-pulse").trim();
  const order = parseInt(String(data.order ?? "0"), 10);

  if (!title) return { success: false, error: "El título es obligatorio." };

  await db.insert(services).values({
    title,
    description,
    iconName,
    isActive: true,
    order: isNaN(order) ? 0 : order,
  });

  return { success: true };
});

// ─── Update service ─────────────────────────────────────────────
export const useUpdateService = routeAction$(async (data) => {
  const id = parseInt(String(data.id), 10);
  const title = String(data.title ?? "").trim();
  const description = String(data.description ?? "").trim();
  const iconName = String(data.icon_name ?? "heart-pulse").trim();
  const isActive = data.is_active === "true" || data.is_active === "on";
  const order = parseInt(String(data.order ?? "0"), 10);

  if (!id || !title)
    return { success: false, error: "ID y título son obligatorios." };

  await db
    .update(services)
    .set({
      title,
      description,
      iconName,
      isActive,
      order: isNaN(order) ? 0 : order,
    })
    .where(eq(services.id, id));

  return { success: true };
});

// ─── Delete service ─────────────────────────────────────────────
export const useDeleteService = routeAction$(async (data) => {
  const id = parseInt(String(data.id), 10);
  if (!id) return { success: false, error: "ID inválido." };

  await db.delete(services).where(eq(services.id, id));
  return { success: true };
});

// ─── Page Component ─────────────────────────────────────────────
export default component$(() => {
  const allServices = useAllServices();
  const createAction = useCreateService();
  const updateAction = useUpdateService();
  const deleteAction = useDeleteService();
  const showForm = useSignal(false);
  const editingId = useSignal<number | null>(null);

  return (
    <div>
      {/* Header */}
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-foreground">Servicios</h1>
          <p class="mt-1 text-sm text-muted-foreground">
            Gestioná los servicios que se muestran en el sitio web
          </p>
        </div>
        <Button
          size="sm"
          class="gap-2 rounded-lg"
          onClick$={() => {
            showForm.value = !showForm.value;
            editingId.value = null;
          }}
        >
          {showForm.value ? (
            <>
              <LuX class="h-4 w-4" /> Cancelar
            </>
          ) : (
            <>
              <LuPlus class="h-4 w-4" /> Nuevo Servicio
            </>
          )}
        </Button>
      </div>

      {/* Create Form */}
      {showForm.value && (
        <div class="mb-6 rounded-xl border border-border/50 bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-lg font-semibold text-foreground">
            Crear nuevo servicio
          </h2>
          <Form action={createAction} class="grid gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium">Título</label>
              <input
                name="title"
                type="text"
                required
                class="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                placeholder="Ej: Enfermería"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium">Descripción</label>
              <textarea
                name="description"
                rows={3}
                class="w-full resize-none rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                placeholder="Descripción del servicio..."
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium">
                Ícono (lucide name)
              </label>
              <input
                name="icon_name"
                type="text"
                class="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                placeholder="heart-pulse"
                value="heart-pulse"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium">Orden</label>
              <input
                name="order"
                type="number"
                class="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                value="0"
              />
            </div>
            <div class="sm:col-span-2">
              <Button type="submit" size="sm" class="rounded-lg">
                {createAction.isRunning ? "Guardando..." : "Crear Servicio"}
              </Button>
            </div>
          </Form>
          {createAction.value?.error && (
            <p class="mt-3 text-sm text-alert">{createAction.value.error}</p>
          )}
        </div>
      )}

      {/* Services Table */}
      <div class="overflow-hidden rounded-xl border border-border/50 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border/50 bg-muted/30">
                <th class="px-4 py-3 text-left font-medium text-muted-foreground">
                  Orden
                </th>
                <th class="px-4 py-3 text-left font-medium text-muted-foreground">
                  Servicio
                </th>
                <th class="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                  Ícono
                </th>
                <th class="px-4 py-3 text-left font-medium text-muted-foreground">
                  Estado
                </th>
                <th class="px-4 py-3 text-right font-medium text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {allServices.value.map((svc) => (
                <tr
                  key={svc.id}
                  class="border-b border-border/30 last:border-0"
                >
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-1 text-muted-foreground">
                      <LuGripVertical class="h-4 w-4" />
                      {svc.order}
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    {editingId.value === svc.id ? (
                      <Form
                        action={updateAction}
                        class="flex flex-col gap-2"
                        onSubmitCompleted$={() => {
                          editingId.value = null;
                        }}
                      >
                        <input type="hidden" name="id" value={svc.id} />
                        <input
                          name="title"
                          type="text"
                          value={svc.title}
                          class="rounded border border-border px-2 py-1 text-sm focus:border-primary focus:outline-none"
                        />
                        <textarea
                          name="description"
                          rows={2}
                          class="rounded border border-border px-2 py-1 text-sm focus:border-primary focus:outline-none"
                        >
                          {svc.description}
                        </textarea>
                        <input
                          name="icon_name"
                          type="text"
                          value={svc.iconName}
                          class="rounded border border-border px-2 py-1 text-sm focus:border-primary focus:outline-none"
                        />
                        <div class="flex items-center gap-2">
                          <label class="flex items-center gap-1 text-sm">
                            <input
                              type="checkbox"
                              name="is_active"
                              checked={svc.isActive}
                              class="rounded"
                            />
                            Activo
                          </label>
                          <input
                            name="order"
                            type="number"
                            value={svc.order}
                            class="w-16 rounded border border-border px-2 py-1 text-sm focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div class="flex gap-2">
                          <Button type="submit" size="sm" class="gap-1 rounded text-xs">
                            <LuCheck class="h-3 w-3" />
                            Guardar
                          </Button>
                          <Button
                            type="button"
                            look="ghost"
                            size="sm"
                            class="rounded text-xs"
                            onClick$={() => (editingId.value = null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </Form>
                    ) : (
                      <div>
                        <p class="font-medium text-foreground">{svc.title}</p>
                        <p class="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {svc.description}
                        </p>
                      </div>
                    )}
                  </td>
                  <td class="hidden px-4 py-3 md:table-cell">
                    <code class="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {svc.iconName}
                    </code>
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        svc.isActive
                          ? "bg-secondary/10 text-secondary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {svc.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        onClick$={() => (editingId.value = svc.id)}
                        class="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        title="Editar"
                      >
                        <LuPencil class="h-4 w-4" />
                      </button>
                      <button
                        onClick$={async () => {
                          if (confirm("¿Eliminar este servicio?")) {
                            await deleteAction.submit({ id: svc.id });
                          }
                        }}
                        class="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-alert/5 hover:text-alert"
                        title="Eliminar"
                      >
                        <LuTrash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {allServices.value.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    class="px-4 py-8 text-center text-muted-foreground"
                  >
                    No hay servicios. Creá el primero.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Servicios — Redimed Admin",
};

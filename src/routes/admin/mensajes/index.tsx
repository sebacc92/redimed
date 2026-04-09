import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  routeAction$,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { getDb } from "~/db/client";
import { messages } from "~/db/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "~/components/ui";
import { LuMail, LuMailOpen, LuTrash2, LuPhone, LuUser } from "@qwikest/icons/lucide";

// ─── Load all messages ──────────────────────────────────────────
export const useAllMessages = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  return await db
    .select()
    .from(messages)
    .orderBy(desc(messages.createdAt));
});

// ─── Mark as read ───────────────────────────────────────────────
export const useMarkRead = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  const id = parseInt(String(data.id), 10);
  if (!id) return { success: false };

  await db
    .update(messages)
    .set({ status: "read" })
    .where(eq(messages.id, id));

  return { success: true };
});

// ─── Delete message ─────────────────────────────────────────────
export const useDeleteMessage = routeAction$(async (data, requestEvent) => {
  const db = getDb(requestEvent.env);
  const id = parseInt(String(data.id), 10);
  if (!id) return { success: false };

  await db.delete(messages).where(eq(messages.id, id));
  return { success: true };
});

export default component$(() => {
  const allMessages = useAllMessages();
  const markReadAction = useMarkRead();
  const deleteAction = useDeleteMessage();

  return (
    <div>
      {/* Header */}
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-foreground">Mensajes</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Consultas recibidas desde el sitio web y el chatbot
        </p>
      </div>

      {/* Messages List */}
      <div class="space-y-3">
        {allMessages.value.map((msg) => (
          <div
            key={msg.id}
            class={`rounded-xl border p-5 transition-colors ${
              msg.status === "unread"
                ? "border-primary/20 bg-primary/5"
                : "border-border/50 bg-white"
            }`}
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                {/* Sender info */}
                <div class="flex flex-wrap items-center gap-3">
                  <div class="flex items-center gap-1.5">
                    <LuUser class="h-4 w-4 text-muted-foreground" />
                    <span class="text-sm font-semibold text-foreground">
                      {msg.name}
                    </span>
                  </div>
                  {msg.phone && (
                    <a
                      href={`tel:${msg.phone}`}
                      class="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    >
                      <LuPhone class="h-3 w-3" />
                      {msg.phone}
                    </a>
                  )}
                  {msg.email && (
                    <a
                      href={`mailto:${msg.email}`}
                      class="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    >
                      <LuMail class="h-3 w-3" />
                      {msg.email}
                    </a>
                  )}
                </div>

                {/* Message text */}
                <p class="mt-2 text-sm leading-relaxed text-foreground/80">
                  {msg.message}
                </p>

                {/* Timestamp & status */}
                <div class="mt-3 flex items-center gap-3">
                  <span class="text-xs text-muted-foreground">
                    {msg.createdAt}
                  </span>
                  <span
                    class={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      msg.status === "unread"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {msg.status === "unread" ? (
                      <>
                        <LuMail class="h-3 w-3" /> Sin leer
                      </>
                    ) : (
                      <>
                        <LuMailOpen class="h-3 w-3" /> Leído
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div class="flex shrink-0 items-center gap-1">
                {msg.status === "unread" && (
                  <Button
                    look="ghost"
                    size="icon"
                    class="h-8 w-8 rounded-lg"
                    title="Marcar como leído"
                    onClick$={async () => {
                      await markReadAction.submit({ id: msg.id });
                    }}
                  >
                    <LuMailOpen class="h-4 w-4" />
                  </Button>
                )}
                <Button
                  look="ghost"
                  size="icon"
                  class="h-8 w-8 rounded-lg text-muted-foreground hover:text-alert"
                  title="Eliminar"
                  onClick$={async () => {
                    if (confirm("¿Eliminar este mensaje?")) {
                      await deleteAction.submit({ id: msg.id });
                    }
                  }}
                >
                  <LuTrash2 class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {allMessages.value.length === 0 && (
          <div class="rounded-xl border border-border/50 bg-white py-12 text-center">
            <LuMail class="mx-auto h-8 w-8 text-muted-foreground" />
            <p class="mt-3 text-sm text-muted-foreground">
              No hay mensajes todavía
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Mensajes — Redimed Admin",
};

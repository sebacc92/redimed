import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { LuMessageCircle, LuX, LuBot, LuSend, LuAlertTriangle, LuPhone } from "@qwikest/icons/lucide";
import { getDb } from "~/db/client";
import { messages } from "~/db/schema";

// ─── Server function to save chatbot leads ──────────────────────
const saveChatbotLead = server$(async function (data: {
  name: string;
  phone: string;
  service: string;
}) {
  if (
    typeof data.name !== "string" ||
    typeof data.phone !== "string" ||
    typeof data.service !== "string"
  ) {
    throw new Error("Datos inválidos");
  }

  const db = getDb(this.env);
  await db.insert(messages).values({
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: "",
    message: `[Chatbot IA] Servicio solicitado: ${data.service}`,
    status: "unread",
  });

  return { success: true };
});

// ─── Chat flow steps ────────────────────────────────────────────
type Step =
  | "welcome"
  | "urgency"
  | "emergency"
  | "service-select"
  | "collect-name"
  | "collect-phone"
  | "done";

interface ChatMessage {
  from: "bot" | "user";
  text: string;
}

const serviceOptions = [
  "Internación Domiciliaria",
  "Recursos Técnicos",
  "Enfermería",
  "Kinesiología",
  "Fonoaudiología",
  "Cuidadores",
];

export const Chatbot = component$(() => {
  const isOpen = useSignal(false);
  const step = useSignal<Step>("welcome");
  const chatMessages = useStore<{ items: ChatMessage[] }>({
    items: [
      {
        from: "bot",
        text: "¡Hola! 👋 Soy el asistente virtual de Redimed. ¿En qué puedo ayudarte hoy?",
      },
    ],
  });
  const selectedService = useSignal("");
  const userName = useSignal("");
  const userPhone = useSignal("");
  const inputValue = useSignal("");

  const addBotMessage = $((text: string) => {
    chatMessages.items = [...chatMessages.items, { from: "bot", text }];
  });

  const addUserMessage = $((text: string) => {
    chatMessages.items = [...chatMessages.items, { from: "user", text }];
  });

  const handleOptionClick = $(async (option: string) => {
    const currentStep = step.value;

    if (currentStep === "welcome") {
      await addUserMessage(option);
      if (option === "Necesito ayuda urgente") {
        step.value = "urgency";
        await addBotMessage(
          "Entiendo que es urgente. ¿Se trata de una emergencia médica que pone en riesgo la vida del paciente?",
        );
      } else {
        step.value = "service-select";
        await addBotMessage(
          "¡Perfecto! ¿Qué tipo de servicio necesitás?",
        );
      }
    } else if (currentStep === "urgency") {
      await addUserMessage(option);
      if (option === "Sí, es una emergencia") {
        step.value = "emergency";
        await addBotMessage(
          "🚨 Para emergencias, llamá inmediatamente al 107 (SAME) o al número de guardia de Redimed. Te transferimos al contacto directo:",
        );
      } else {
        step.value = "service-select";
        await addBotMessage(
          "De acuerdo. Para poder ayudarte mejor, ¿qué servicio necesitás?",
        );
      }
    } else if (currentStep === "service-select") {
      await addUserMessage(option);
      selectedService.value = option;
      step.value = "collect-name";
      await addBotMessage(
        `Excelente, ${option}. Para comunicarnos con vos, ¿cuál es tu nombre completo?`,
      );
    }
  });

  const handleTextSubmit = $(async () => {
    const val = inputValue.value.trim();
    if (!val) return;

    const currentStep = step.value;

    if (currentStep === "collect-name") {
      userName.value = val;
      await addUserMessage(val);
      inputValue.value = "";
      step.value = "collect-phone";
      await addBotMessage(
        `Gracias ${val}. ¿Cuál es tu número de teléfono para que te contactemos?`,
      );
    } else if (currentStep === "collect-phone") {
      userPhone.value = val;
      await addUserMessage(val);
      inputValue.value = "";
      step.value = "done";

      try {
        await saveChatbotLead({
          name: userName.value,
          phone: val,
          service: selectedService.value,
        });
        await addBotMessage(
          "✅ ¡Listo! Tus datos fueron registrados. Un profesional de Redimed se va a comunicar con vos a la brevedad. ¡Gracias por confiar en nosotros!",
        );
      } catch {
        await addBotMessage(
          "Hubo un error al guardar tus datos. Por favor, intentá contactarnos por WhatsApp o teléfono.",
        );
      }
    }
  });

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick$={() => (isOpen.value = !isOpen.value)}
        class="fixed right-5 bottom-24 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Asistente virtual"
      >
        {isOpen.value ? (
          <LuX class="h-6 w-6" />
        ) : (
          <LuMessageCircle class="h-6 w-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen.value && (
        <div class="animate-in fade-in slide-in-from-bottom-4 fixed right-5 bottom-40 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-border/50 bg-white shadow-2xl sm:right-6">
          {/* Header */}
          <div class="flex items-center gap-3 bg-gradient-to-r from-primary to-sky-700 px-4 py-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <LuBot class="h-5 w-5 text-white" />
            </div>
            <div>
              <p class="text-sm font-semibold text-white">Asistente Redimed</p>
              <p class="text-xs text-white/70">En línea</p>
            </div>
            <div class="ml-auto h-2 w-2 rounded-full bg-green-400 shadow-sm shadow-green-400/50" />
          </div>

          {/* Messages */}
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.items.map((msg, i) => (
              <div
                key={i}
                class={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  class={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.from === "user"
                      ? "rounded-br-md bg-primary text-white"
                      : "rounded-bl-md bg-muted text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Option buttons based on step */}
            {step.value === "welcome" && (
              <div class="flex flex-col gap-2 pt-1">
                {["Necesito ayuda urgente", "Quiero consultar un servicio"].map(
                  (opt) => (
                    <button
                      key={opt}
                      onClick$={() => handleOptionClick(opt)}
                      class="rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-left text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      {opt}
                    </button>
                  ),
                )}
              </div>
            )}

            {step.value === "urgency" && (
              <div class="flex flex-col gap-2 pt-1">
                {["Sí, es una emergencia", "No, es una consulta programada"].map(
                  (opt) => (
                    <button
                      key={opt}
                      onClick$={() => handleOptionClick(opt)}
                      class={`rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                        opt.includes("emergencia")
                          ? "border-alert/20 bg-alert/5 text-alert hover:bg-alert/10"
                          : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                      }`}
                    >
                      {opt}
                    </button>
                  ),
                )}
              </div>
            )}

            {step.value === "emergency" && (
              <div class="space-y-2 pt-1">
                <a
                  href="tel:107"
                  class="flex items-center gap-2 rounded-xl border border-alert/30 bg-alert/5 px-4 py-3 text-sm font-semibold text-alert transition-colors hover:bg-alert/10"
                >
                  <LuAlertTriangle class="h-4 w-4" />
                  Llamar 107 (SAME)
                </a>
                <a
                  href="tel:+5491112345678"
                  class="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  <LuPhone class="h-4 w-4" />
                  Guardia Redimed
                </a>
              </div>
            )}

            {step.value === "service-select" && (
              <div class="flex flex-wrap gap-2 pt-1">
                {serviceOptions.map((svc) => (
                  <button
                    key={svc}
                    onClick$={() => handleOptionClick(svc)}
                    class="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    {svc}
                  </button>
                ))}
              </div>
            )}

            {step.value === "done" && (
              <div class="flex justify-center pt-2">
                <span class="text-xs text-muted-foreground">
                  Conversación finalizada
                </span>
              </div>
            )}
          </div>

          {/* Text Input (only for name/phone steps) */}
          {(step.value === "collect-name" ||
            step.value === "collect-phone") && (
            <div class="border-t border-border/50 p-3">
              <form
                preventdefault:submit
                onSubmit$={handleTextSubmit}
                class="flex gap-2"
              >
                <input
                  type="text"
                  value={inputValue.value}
                  onInput$={(_, el) => (inputValue.value = el.value)}
                  placeholder={
                    step.value === "collect-name"
                      ? "Escribí tu nombre..."
                      : "Ej: 11 1234-5678"
                  }
                  class="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none"
                />
                <button
                  type="submit"
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary/90"
                >
                  <LuSend class="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
});

import { component$ } from "@builder.io/qwik";
import { LuHeart, LuShieldCheck, LuUsers } from "@qwikest/icons/lucide";

interface AboutSectionProps {
  title?: string;
  text1?: string;
  text2?: string;
  val1Title?: string;
  val1Desc?: string;
  val2Title?: string;
  val2Desc?: string;
  val3Title?: string;
  val3Desc?: string;
}

export const AboutSection = component$<AboutSectionProps>(({
  title, text1, text2,
  val1Title, val1Desc,
  val2Title, val2Desc,
  val3Title, val3Desc
}) => {
  const values = [
    {
      icon: LuHeart,
      title: val1Title || "Compromiso",
      description: val1Desc || "Nos comprometemos con cada paciente y su familia, brindando atención personalizada y seguimiento continuo.",
      color: "from-red-500/10 to-rose-500/10",
      iconColor: "text-red-500",
    },
    {
      icon: LuShieldCheck,
      title: val2Title || "Profesionalismo",
      description: val2Desc || "Nuestro equipo está formado por profesionales de la salud altamente capacitados y con amplia experiencia.",
      color: "from-primary/10 to-sky-500/10",
      iconColor: "text-primary",
    },
    {
      icon: LuUsers,
      title: val3Title || "Respeto",
      description: val3Desc || "Respetamos la dignidad del paciente, su entorno familiar y sus necesidades individuales en todo momento.",
      color: "from-secondary/10 to-emerald-500/10",
      iconColor: "text-secondary",
    },
  ];

  return (
    <section id="nosotros" class="bg-muted/50 py-20 lg:py-28">
      <div class="mx-auto max-w-7xl px-4 lg:px-8">
        <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text */}
          <div>
            <span class="text-sm font-semibold tracking-wider text-secondary uppercase">
              Sobre Nosotros
            </span>
            <h2 class="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title || "Más de 15 años cuidando la salud en tu hogar"}
            </h2>
            <p class="mt-6 text-lg leading-relaxed text-muted-foreground">
              {text1 || (
                <>En <strong class="text-foreground">Redimed</strong> somos especialistas en internación domiciliaria integral. Nuestro objetivo es brindar atención médica de excelencia en el hogar, permitiendo que el paciente se recupere en un entorno familiar y contenedor.</>
              )}
            </p>
            <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
              {text2 || "Trabajamos con todas las obras sociales y prepagas del país, garantizando acceso universal a nuestros servicios de salud domiciliaria."}
            </p>

            {/* Highlight strip */}
            <div class="mt-8 flex items-center gap-4 rounded-xl border border-secondary/20 bg-secondary/5 p-4">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-foreground">
                  Atención las 24 horas, los 365 días
                </p>
                <p class="text-sm text-muted-foreground">
                  Servicio de guardia permanente para emergencias y consultas.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Values Cards */}
          <div class="flex flex-col gap-5">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  class="group flex gap-5 rounded-2xl border border-border/50 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div
                    class={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${value.color}`}
                  >
                    <Icon class={`h-7 w-7 ${value.iconColor}`} />
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p class="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

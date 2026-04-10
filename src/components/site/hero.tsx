import { component$ } from "@builder.io/qwik";
import { Button } from "~/components/ui";
import { LuArrowRight, LuShieldCheck } from "@qwikest/icons/lucide";
import { SymbolRim } from "~/components/icons/SymbolRim";

interface HeroProps {
  title: string;
  subtitle: string;
  bgImage?: string;
}

export const Hero = component$<HeroProps>(({ title, subtitle, bgImage }) => {
  return (
    <section
      id="inicio"
      class="relative overflow-hidden bg-gradient-to-br from-secondary to-primary pt-16"
      style={bgImage ? { backgroundImage: `linear-gradient(to right, rgba(240, 107, 0, 0.9), rgba(54, 160, 21, 0.7)), url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {/* Background pattern */}
      <div class="absolute inset-0 opacity-10">
        <div
          class="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* SymbolRim Watermark */}
      <div class="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
        <SymbolRim class="absolute -right-32 top-0 h-[600px] w-auto rotate-12" />
      </div>

      {/* Gradient overlay orbs */}
      <div class="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
      <div class="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

      <div class="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center lg:px-8 lg:py-32">
        {/* Trust badge */}
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
          <LuShieldCheck class="h-4 w-4 text-secondary" />
          Más de 15 años de experiencia
        </div>

        {/* Title */}
        <h1 class="max-w-4xl text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {/* Subtitle */}
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div class="mt-10 flex flex-col gap-4 sm:flex-row">
          <a href="#servicios">
            <Button
              size="lg"
              class="gap-2 rounded-full bg-white px-8 text-primary shadow-xl hover:bg-white/90"
            >
              Ver Servicios
              <LuArrowRight class="h-5 w-5" />
            </Button>
          </a>
          <a href="#contacto">
            <Button
              size="lg"
              look="ghost"
              class="gap-2 rounded-full border border-white/40 px-8 text-white hover:bg-white/15"
            >
              Contactar
            </Button>
          </a>
        </div>

        {/* Stats bar */}
        <div class="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 sm:grid-cols-4 sm:gap-12">
          {[
            { value: "15+", label: "Años de experiencia" },
            { value: "24/7", label: "Atención continua" },
            { value: "500+", label: "Pacientes atendidos" },
            { value: "100%", label: "Cobertura obra social" },
          ].map((stat) => (
            <div key={stat.label} class="text-center">
              <p class="text-3xl font-bold text-white">{stat.value}</p>
              <p class="mt-1 text-sm text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="h-12 w-full sm:h-16">
          <path d="M0 80L60 68C120 56 240 32 360 24C480 16 600 24 720 32C840 40 960 48 1080 44C1200 40 1320 24 1380 16L1440 8V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="var(--background)" />
        </svg>
      </div>
    </section>
  );
});

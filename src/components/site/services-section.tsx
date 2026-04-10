import { component$ } from "@builder.io/qwik";
import { Card } from "~/components/ui";
import g304Img from "~/media/g304.png";
import {
  LuBed,
  LuMonitorCheck,
  LuStethoscope,
  LuActivity,
  LuMic,
  LuHeart,
  LuHeartPulse,
  LuShield,
  LuSyringe,
  LuBrain,
  LuEye,
  LuPill,
} from "@qwikest/icons/lucide";

interface Service {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

interface ServicesSectionProps {
  services: Service[];
  title?: string;
  subtitle?: string;
}

const iconMap: Record<string, any> = {
  bed: LuBed,
  "monitor-check": LuMonitorCheck,
  stethoscope: LuStethoscope,
  activity: LuActivity,
  mic: LuMic,
  "hand-heart": LuHeart,
  "heart-pulse": LuHeartPulse,
  shield: LuShield,
  syringe: LuSyringe,
  brain: LuBrain,
  eye: LuEye,
  pill: LuPill,
};

export const ServicesSection = component$<ServicesSectionProps>(
  ({ services, title, subtitle }) => {
    return (
      <section id="servicios" class="py-20 lg:py-28">
        <div class="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Section Header */}
          <div class="mx-auto max-w-2xl text-center flex flex-col items-center">
            <img src={g304Img} alt="Redimed Icono" class="mt-6 mb-4 h-24 w-auto" />
            <span class="text-sm font-semibold tracking-wider text-secondary uppercase">
              Nuestros Servicios
            </span>
            <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title || "Atención integral a domicilio"}
            </h2>
            <p class="mt-4 text-lg text-muted-foreground">
              {subtitle || "Brindamos una amplia gama de servicios médicos y de cuidado personalizado en la comodidad de tu hogar."}
            </p>
          </div>

          {/* Services Grid */}
          <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const IconComponent = iconMap[service.iconName] ?? LuHeartPulse;
              return (
                <Card.Root
                  key={service.id}
                  class="group relative overflow-hidden border-border/50 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                >
                  <Card.Header class="pb-3">
                    <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary transition-colors group-hover:from-primary group-hover:to-primary group-hover:text-white">
                      <IconComponent class="h-6 w-6" />
                    </div>
                    <Card.Title class="text-lg font-semibold">
                      {service.title}
                    </Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <p class="text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </Card.Content>
                  {/* Hover accent line */}
                  <div class="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full" />
                </Card.Root>
              );
            })}
          </div>
        </div>
      </section>
    );
  },
);

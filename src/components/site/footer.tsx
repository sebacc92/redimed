import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { LuPhone, LuMail, LuMapPin } from "@qwikest/icons/lucide";
import { LogoFull } from "~/components/icons/LogoFull";

interface FooterProps {
  phone?: string;
  email?: string;
  address?: string;
}

export const Footer = component$<FooterProps>(({ phone, email, address }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer class="border-t border-border/50 bg-foreground text-white">
      <div class="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div class="lg:col-span-1">
            <Link href="/" class="flex items-center gap-2">
               <LogoFull class="h-20 w-auto grayscale contrast-125 brightness-0 invert" />
            </Link>
            <p class="mt-4 text-sm leading-relaxed text-white/60">
              Internación Domiciliaria Integral. Más de 15 años brindando
              atención médica de calidad en la comodidad de tu hogar.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 class="mb-4 text-sm font-semibold tracking-wider uppercase text-white/80">
              Navegación
            </h3>
            <ul class="flex flex-col gap-2.5">
              {[
                { label: "Inicio", href: "/#inicio" },
                { label: "Servicios", href: "/#servicios" },
                { label: "Nosotros", href: "/#nosotros" },
                { label: "Contacto", href: "/#contacto" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    class="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 class="mb-4 text-sm font-semibold tracking-wider uppercase text-white/80">
              Legal
            </h3>
            <ul class="flex flex-col gap-2.5">
              {[
                { label: "Política de Privacidad", href: "#" },
                { label: "Términos y Condiciones", href: "#" },
                { label: "Defensa del Consumidor", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    class="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 class="mb-4 text-sm font-semibold tracking-wider uppercase text-white/80">
              Contacto
            </h3>
            <ul class="flex flex-col gap-3">
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    class="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
                  >
                    <LuPhone class="h-4 w-4 shrink-0" />
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    class="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
                  >
                    <LuMail class="h-4 w-4 shrink-0" />
                    {email}
                  </a>
                </li>
              )}
              {address && (
                <li class="flex items-start gap-2 text-sm text-white/60">
                  <LuMapPin class="mt-0.5 h-4 w-4 shrink-0" />
                  {address}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div class="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          © {currentYear} Redimed — Internación Domiciliaria Integral. Todos
          los derechos reservados.
        </div>
      </div>
    </footer>
  );
});

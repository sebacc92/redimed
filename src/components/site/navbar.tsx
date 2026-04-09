import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { LuMenu, LuX, LuPhone } from "@qwikest/icons/lucide";
import { Button } from "~/components/ui";

interface NavbarProps {
  phone?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export const Navbar = component$<NavbarProps>(({ phone, whatsapp, facebook, instagram, linkedin }) => {
  const isOpen = useSignal(false);

  const navLinks = [
    { label: "Inicio", href: "/#inicio" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Nosotros", href: "/#nosotros" },
    { label: "Contacto", href: "/#contacto" },
  ];

  const whatsappUrl = `https://wa.me/${whatsapp ?? "5491112345678"}?text=Hola,%20necesito%20información%20sobre%20internación%20domiciliaria`;

  return (
    <nav class="fixed top-0 right-0 left-0 z-50 flex flex-col border-b border-border/50 bg-white/90 backdrop-blur-lg">
      {/* Top Bar for Social Links */}
      <div class="hidden bg-primary/5 py-1.5 md:block border-b border-border/30">
        <div class="mx-auto flex max-w-7xl items-center justify-end gap-4 px-4 lg:px-8 text-sm">
          {facebook && (
            <a href={facebook} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              Facebook
            </a>
          )}
          {instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Instagram
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
          )}
        </div>
      </div>

      <div class="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" class="flex items-center gap-2">
          <img src="/logo.webp" alt="Redimed" class="h-10 w-auto" />
          <span class="text-2xl font-bold tracking-tight text-primary">
            Redimed
          </span>
        </Link>

        {/* Desktop Nav */}
        <div class="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              class="rounded-lg px-4 py-2 text-lg font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div class="hidden items-center gap-3 md:flex">
          {phone && (
            <a
              href={`tel:${phone}`}
              class="flex items-center gap-1.5 text-base font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <LuPhone class="h-4 w-4" />
              <span>{phone}</span>
            </a>
          )}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button look="primary" size="md" class="gap-2 rounded-full bg-secondary px-6 text-base hover:bg-secondary/90">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Contacto Urgente
            </Button>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          class="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent md:hidden"
          onClick$={() => (isOpen.value = !isOpen.value)}
          aria-label="Menú"
        >
          {isOpen.value ? (
            <LuX class="h-5 w-5" />
          ) : (
            <LuMenu class="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen.value && (
        <div class="animate-in fade-in slide-in-from-top-2 border-t border-border/50 bg-white px-4 pb-4 md:hidden">
          <div class="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                class="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-primary"
                onClick$={() => (isOpen.value = false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div class="mt-3 flex flex-col gap-2 border-t border-border/50 pt-3">
            {phone && (
              <a
                href={`tel:${phone}`}
                class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground"
              >
                <LuPhone class="h-4 w-4" />
                {phone}
              </a>
            )}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button look="primary" size="sm" class="w-full gap-2 rounded-full bg-secondary hover:bg-secondary/90">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Contacto Urgente
              </Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
});

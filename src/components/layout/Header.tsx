import {
  component$,
  useSignal,
  useOnWindow,
  $,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import {
  TELEFONO_EMERGENCIAS,
  TELEFONO_HREF,
  WHATSAPP_ATENCION,
} from "~/lib/constants";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Servicios", href: "/servicios" },
  { label: "Soluciones", href: "/soluciones" },
  { label: "Empresas", href: "/empresas" },
  { label: "Obras Sociales", href: "/obras-sociales" },
  { label: "Sumate", href: "/sumate" },
  { label: "Contacto", href: "/contacto" },
];

export const Header = component$(() => {
  const scrolled = useSignal(false);
  const mobileOpen = useSignal(false);
  const loc = useLocation();

  useOnWindow(
    "scroll",
    $(() => {
      scrolled.value = window.scrollY > 60;
    }),
  );

  // Close mobile menu on route change
  useVisibleTask$(({ track }) => {
    track(() => loc.url.pathname);
    mobileOpen.value = false;
  });

  const isHome = loc.url.pathname === "/";

  return (
    <header
      class={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        (scrolled.value || !isHome)
          ? "bg-navy-900/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5",
      ]}
    >
      <div class="container mx-auto px-6 lg:px-12">
        <div class="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" class="flex items-center group">
            <img
              src="/logo.png"
              alt="Mijal Salud S.A."
              class="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Nav Desktop */}
          <nav class="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = loc.url.pathname === item.href ||
                (item.href !== "/" && loc.url.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  class={[
                    "px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200",
                    isActive
                      ? "text-verde-400 bg-white/10"
                      : "text-white/80 hover:text-white hover:bg-white/10",
                  ]}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Emergencias + Hamburguesa */}
          <div class="flex items-center gap-3">
            <a
              href={WHATSAPP_ATENCION}
              target="_blank"
              rel="noopener noreferrer"
              class="hidden sm:flex items-center gap-2 bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold text-sm px-4 py-2.5 rounded-xl shadow-cta hover:shadow-cta-hover transition-all duration-200 hover:-translate-y-0.5"
            >
              <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse-soft" />
              Atención 24/7
            </a>

            {/* Hamburguesa mobile */}
            <button
              class="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick$={() => (mobileOpen.value = !mobileOpen.value)}
              aria-label="Abrir menú"
              aria-expanded={mobileOpen.value}
            >
              <span
                class={[
                  "block w-6 h-0.5 bg-white transition-all duration-300",
                  mobileOpen.value ? "rotate-45 translate-y-2" : "",
                ]}
              />
              <span
                class={[
                  "block w-6 h-0.5 bg-white transition-all duration-300",
                  mobileOpen.value ? "opacity-0" : "",
                ]}
              />
              <span
                class={[
                  "block w-6 h-0.5 bg-white transition-all duration-300",
                  mobileOpen.value ? "-rotate-45 -translate-y-2" : "",
                ]}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        class={[
          "lg:hidden overflow-hidden transition-all duration-300",
          mobileOpen.value ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
        ]}
      >
        <div class="bg-navy-900/98 backdrop-blur-md border-t border-white/10 px-6 py-6">
          <nav class="flex flex-col gap-1 mb-6">
            {navLinks.map((item) => {
              const isActive = loc.url.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  class={[
                    "px-4 py-3 rounded-xl text-base font-body font-medium transition-colors",
                    isActive
                      ? "text-verde-400 bg-white/10"
                      : "text-white/80 hover:text-white hover:bg-white/10",
                  ]}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div class="flex flex-col gap-3">
            <a
              href={WHATSAPP_ATENCION}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 bg-verde-500 text-white font-display font-semibold py-3.5 rounded-xl shadow-cta"
            >
              Necesito atención ahora
            </a>
            <a
              href={TELEFONO_HREF}
              class="flex items-center justify-center gap-2 bg-white/10 text-white font-display font-semibold py-3.5 rounded-xl"
            >
              📞 {TELEFONO_EMERGENCIAS}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
});

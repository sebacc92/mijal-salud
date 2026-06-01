import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import {
  EMAIL_CONTACTO,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  FACEBOOK_URL,
} from "~/lib/constants";

const serviciosLinks = [
  { label: "Emergencias", href: "/servicios/emergencias" },
  { label: "Urgencias", href: "/servicios/urgencias" },
  { label: "Traslados Sanitarios", href: "/servicios/traslados" },
  { label: "Internación Domiciliaria", href: "/servicios/internacion" },
  { label: "Visitas Médicas", href: "/servicios/visitas" },
  { label: "Área Protegida", href: "/servicios/area-protegida" },
];

const solucionesLinks = [
  { label: "Mijal Salud Directa", href: "/soluciones/salud-directa" },
  { label: "Mijal Care IA", href: "/soluciones/care-ia" },
  { label: "Prevención Activa", href: "/soluciones/prevencion-activa" },
  { label: "Salud 360", href: "/soluciones/salud-360" },
  { label: "Conecta Salud", href: "/soluciones/conecta-salud" },
];

const empresaLinks = [
  { label: "Soluciones para Empresas", href: "/empresas" },
  { label: "Sumate al Equipo", href: "/sumate" },
  { label: "Contacto", href: "/contacto" },
];

export const Footer = component$(() => {
  const year = new Date().getFullYear();

  return (
    <footer class="bg-navy-950 text-white">

      {/* Cuerpo del footer */}
      <div class="container mx-auto px-6 lg:px-12 py-16">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Columna 1: Marca */}
          <div class="sm:col-span-2 lg:col-span-1">
            <div class="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Mijal Salud S.A."
                class="h-12 w-auto object-contain"
                width={154}
                height={48}
              />
            </div>
            <p class="text-white/60 font-body text-sm leading-relaxed mb-6">
              Más de 20 años brindando atención médica domiciliaria de
              excelencia en Buenos Aires y el AMBA.
            </p>
            <div class="flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Servicios */}
          <div>
            <h3 class="font-display font-semibold text-sm uppercase tracking-widest text-white/40 mb-5">
              Servicios
            </h3>
            <ul class="space-y-3">
              {serviciosLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    class="text-white/70 hover:text-verde-400 font-body text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Soluciones */}
          <div>
            <h3 class="font-display font-semibold text-sm uppercase tracking-widest text-white/40 mb-5">
              Soluciones 2026
            </h3>
            <ul class="space-y-3">
              {solucionesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    class="text-white/70 hover:text-verde-400 font-body text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Empresa */}
          <div>
            <h3 class="font-display font-semibold text-sm uppercase tracking-widest text-white/40 mb-5">
              Empresa
            </h3>
            <ul class="space-y-3">
              {empresaLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    class="text-white/70 hover:text-verde-400 font-body text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div class="mt-6 pt-6 border-t border-white/10">
              <a
                href={`mailto:${EMAIL_CONTACTO}`}
                class="text-white/60 hover:text-verde-400 font-body text-sm transition-colors block"
              >
                {EMAIL_CONTACTO}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div class="border-t border-white/10">
        <div class="container mx-auto px-6 lg:px-12 py-5">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-xs font-body">
            <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <span>© {year} Mijal Salud S.A. · Todos los derechos reservados</span>
              <span class="hidden sm:inline">·</span>
              <a
                href="/2026PCMIJAL.pdf"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-verde-450 font-semibold transition-colors"
              >
                Políticas de la Calidad
              </a>
            </div>
            <div class="flex items-center gap-4">
              <a
                href="https://indesign.ar"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-white/70 transition-colors"
              >
                Desarrollado por indesign.ar
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

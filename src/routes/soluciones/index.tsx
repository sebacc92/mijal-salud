import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";

const soluciones = [
  {
    id: "salud-directa",
    emoji: "📲",
    nombre: "Mijal Salud Directa",
    tagline: "Tu médico, a un click de distancia",
    descripcion: "Plataforma de telemedicina 24/7. Consultá desde WhatsApp en menos de 10 minutos.",
    badge: "Lanzamiento próximo",
    badgeColor: "bg-verde-100 text-verde-700",
    borderColor: "border-verde-200 hover:border-verde-400",
    href: "/soluciones/salud-directa",
    publico: "Particulares · Familias · Obras sociales",
  },
  {
    id: "care-ia",
    emoji: "🤖",
    nombre: "Mijal Care IA",
    tagline: "Salud predictiva con inteligencia artificial",
    descripcion: "Asistente inteligente para adultos mayores y pacientes crónicos. Alertas tempranas y conexión con la central.",
    badge: null,
    badgeColor: "",
    borderColor: "border-navy-200 hover:border-navy-400",
    href: "/soluciones/care-ia",
    publico: "Adultos mayores · Pacientes crónicos",
  },
  {
    id: "prevencion-activa",
    emoji: "🛡️",
    nombre: "Mijal Prevención Activa",
    tagline: "No esperes la emergencia, prevenila",
    descripcion: "Programa de medicina preventiva para empresas. Check-ups, dashboard de salud corporativa y reducción de ausentismo.",
    badge: "Alta demanda B2B",
    badgeColor: "bg-orange-100 text-orange-700",
    borderColor: "border-orange-200 hover:border-orange-400",
    href: "/soluciones/prevencion-activa",
    publico: "Empresas · Pymes · ARTs",
  },
  {
    id: "salud-360",
    emoji: "♾️",
    nombre: "Mijal Salud 360",
    tagline: "Acompañamiento integral, no solo emergencias",
    descripcion: "Plan concierge con médico de cabecera asignado, kinesiología y coordinación con especialistas.",
    badge: null,
    badgeColor: "",
    borderColor: "border-violet-200 hover:border-violet-400",
    href: "/soluciones/salud-360",
    publico: "Familias · Adultos mayores · Post-internados",
  },
  {
    id: "conecta-salud",
    emoji: "🌐",
    nombre: "Mijal Conecta Salud",
    tagline: "La plataforma que unifica todo el ecosistema",
    descripcion: "Portal digital unificado para pacientes, empresas y partners con API para obras sociales.",
    badge: "En desarrollo",
    badgeColor: "bg-slate-100 text-slate-700",
    borderColor: "border-slate-200 hover:border-slate-400",
    href: "/soluciones/conecta-salud",
    publico: "Pacientes · Empresas · Obras sociales",
  },
];

export default component$(() => {
  return (
    <main class="pt-24">
      {/* Hero */}
      <section class="bg-navy-900 relative overflow-hidden py-20">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-verde-500 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 text-center">
          <div class="inline-flex items-center gap-2 bg-verde-500/20 border border-verde-500/40 rounded-full px-4 py-2 mb-6">
            <svg class="w-4 h-4 text-verde-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="text-verde-300 text-sm font-body font-medium">Nuevas soluciones 2026</span>
          </div>
          <h1 class="font-display text-h1 text-white mb-4">
            La salud domiciliaria <span class="text-verde-400">del futuro</span>
          </h1>
          <p class="text-white/70 font-body text-body-lg max-w-2xl mx-auto">
            Un ecosistema completo de servicios innovadores que va más allá de las emergencias. 
            Tecnología, prevención e inteligencia artificial al servicio de tu salud.
          </p>
        </div>
      </section>

      {/* Grid de soluciones */}
      <section class="py-section bg-gradient-section">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {soluciones.map((s) => (
              <Link
                key={s.id}
                href={s.href}
                class={[
                  "group relative flex flex-col p-8 rounded-3xl border-2 bg-white",
                  s.borderColor,
                  "shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1",
                ]}
              >
                {s.badge && (
                  <span class={["absolute top-6 right-6 text-xs font-body font-medium px-3 py-1.5 rounded-full", s.badgeColor]}>
                    {s.badge}
                  </span>
                )}
                <div class="text-4xl mb-5">{s.emoji}</div>
                <h2 class="font-display font-bold text-navy-900 text-xl mb-1">{s.nombre}</h2>
                <p class="text-verde-600 font-body text-sm italic mb-3">{s.tagline}</p>
                <p class="text-gris-600 font-body text-sm leading-relaxed flex-grow mb-5">{s.descripcion}</p>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-body text-gris-500 bg-gris-100 px-3 py-1.5 rounded-full">
                    👥 {s.publico}
                  </span>
                  <span class="flex items-center gap-1.5 text-navy-700 font-display font-semibold text-sm group-hover:text-verde-600 transition-colors">
                    Ver más
                    <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Soluciones Innovadoras 2026 — Mijal Salud",
  meta: [{ name: "description", content: "Telemedicina, IA predictiva, prevención activa y salud concierge. El futuro de la salud domiciliaria en Buenos Aires." }],
};

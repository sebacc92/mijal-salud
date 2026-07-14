import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LeadForm } from "~/components/forms/LeadForm";
import { WHATSAPP_EMPRESAS } from "~/lib/constants";

const incluye = [
  "Médico y enfermero presenciales durante el evento",
  "Unidad móvil de emergencias disponible",
  "Protocolo de evacuación y enlace con hospitales",
  "Informes médicos post-evento",
  "Cobertura para 10 a 50.000+ personas",
];

const casos = [
  { emoji: "🏟️", title: "Estadios y eventos deportivos" },
  { emoji: "🎪", title: "Festivales y conciertos" },
  { emoji: "🏢", title: "Congresos y convenciones" },
  { emoji: "🏗️", title: "Obras y plantas industriales" },
  { emoji: "🎓", title: "Instituciones educativas" },
  { emoji: "🏖️", title: "Resorts y clubes" },
];

export default component$(() => {
  return (
    <main class="pt-24">
      {/* Hero Eventos */}
      <section class="bg-navy-900 relative overflow-hidden py-24">
        <div class="absolute inset-0 bg-gradient-hero opacity-85" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-verde-500 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 text-center">
          <div class="inline-flex items-center gap-2 bg-verde-500/20 border border-verde-500/40 rounded-full px-4 py-2 mb-8">
            <span class="text-verde-300 text-sm font-body font-medium">
              🛡️ Cobertura médica para eventos
            </span>
          </div>
          <h1 class="font-display text-h1 text-white mb-5 max-w-3xl mx-auto">
            Cobertura Médica para{" "}
            <span class="text-verde-400">Eventos</span>
          </h1>
          <p class="text-white/70 font-body text-body-lg mb-10 max-w-2xl mx-auto">
            Personal médico calificado y unidades equipadas para congresos,
            festivales, obras, estadios y espacios de trabajo. Siempre en tu lugar.
          </p>
          <div class="flex justify-center">
            <a
              href={WHATSAPP_EMPRESAS}
              target="_blank"
              rel="noopener noreferrer"
              class="bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200"
            >
              Pedir cotización
            </a>
          </div>
        </div>
      </section>

      {/* Qué incluye + casos de uso */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="font-display text-h2 text-navy-900 mb-6">
                Qué incluye la cobertura
              </h2>
              <ul class="space-y-4">
                {incluye.map((item) => (
                  <li key={item} class="flex items-start gap-3">
                    <div class="w-6 h-6 rounded-full bg-verde-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg class="w-3.5 h-3.5 text-verde-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span class="text-gris-700 font-body">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div class="grid grid-cols-2 gap-4">
              {casos.map((item) => (
                <div
                  key={item.title}
                  class="bg-gris-50 border border-gris-100 rounded-2xl p-5 hover:bg-gris-100 transition-colors"
                >
                  <div class="text-3xl mb-3">{item.emoji}</div>
                  <p class="text-gris-700 font-body text-sm font-medium">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Habilitación oficial */}
      <section class="pb-4 bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div class="flex items-start gap-4 bg-verde-50 border border-verde-100 rounded-2xl p-6">
            <svg class="w-6 h-6 text-verde-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gris-700 font-body text-sm leading-relaxed">
              Mijal Salud se encuentra inscripta en la habilitación del Gobierno de
              la Ciudad Autónoma de Buenos Aires para brindar cobertura médica en
              eventos.
            </p>
          </div>
        </div>
      </section>

      {/* Formulario de contacto */}
      <section id="contacto" class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-2xl">
          <div class="text-center mb-10">
            <h2 class="font-display text-h2 text-navy-900 mb-3">
              Solicitá tu cobertura
            </h2>
            <p class="text-gris-600 font-body">
              Completá el formulario y un asesor te contactará en menos de 24 horas.
            </p>
          </div>
          <div class="bg-white rounded-2xl p-8 shadow-card border border-gris-100">
            <LeadForm servicioDefault="cobertura-evento" isB2B={true} />
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Cobertura Médica para Eventos — Mijal Salud",
  meta: [
    {
      name: "description",
      content:
        "Cobertura médica para eventos en Buenos Aires y AMBA: congresos, festivales, obras y estadios. Personal médico y unidades equipadas. Habilitación GCBA.",
    },
  ],
};

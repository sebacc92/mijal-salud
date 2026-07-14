import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LeadForm } from "~/components/forms/LeadForm";
import { WHATSAPP_EMPRESAS } from "~/lib/constants";

const serviciosB2B = [
  {
    emoji: "🛡️",
    nombre: "Área Protegida",
    desc: "Cobertura médica permanente para eventos, plantas industriales y espacios de trabajo.",
    beneficio: "Cumplimiento legal ART incluido",
  },
];

export default component$(() => {
  return (
    <main class="pt-24">
      {/* Hero B2B */}
      <section class="bg-navy-900 relative overflow-hidden py-24">
        <div class="absolute inset-0 bg-gradient-hero opacity-85" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-verde-500 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 text-center">
          <div class="inline-flex items-center gap-2 bg-verde-500/20 border border-verde-500/40 rounded-full px-4 py-2 mb-8">
            <span class="w-2 h-2 bg-verde-400 rounded-full animate-pulse" />
            <span class="text-verde-300 text-sm font-body font-medium">
              Soluciones para empresas
            </span>
          </div>
          <h1 class="font-display text-h1 text-white mb-5 max-w-3xl mx-auto">
            Cobertura médica para tu empresa.{" "}
            <span class="text-verde-400">Área Protegida.</span>
          </h1>
          <p class="text-white/70 font-body text-body-lg mb-10 max-w-2xl mx-auto">
            Servicio de Área Protegida y cobertura médica permanente para eventos, plantas industriales y espacios de trabajo.
          </p>
          <div class="flex justify-center">
            <a
              href={WHATSAPP_EMPRESAS}
              target="_blank"
              rel="noopener noreferrer"
              class="bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200"
            >
              Hablar con un asesor
            </a>
          </div>
        </div>
      </section>

      {/* Servicios B2B */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">
              Servicios para <span class="text-verde-500">empresas</span>
            </h2>
            <p class="text-gris-600 font-body text-body-lg max-w-xl mx-auto">
              Solución integral de cobertura médica permanente que se adapta a tu industria, tamaño y necesidades.
            </p>
          </div>

          <div class="flex justify-center mb-12">
            {serviciosB2B.map((s) => (
              <div
                key={s.nombre}
                class="bg-white rounded-2xl p-7 border border-gris-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 max-w-md w-full"
              >
                <div class="text-4xl mb-4">{s.emoji}</div>
                <h3 class="font-display font-bold text-navy-900 text-lg mb-2">
                  {s.nombre}
                </h3>
                <p class="text-gris-600 font-body text-sm mb-4 leading-relaxed">
                  {s.desc}
                </p>
                <div class="inline-flex items-center gap-2 bg-verde-50 text-verde-700 text-xs font-body font-medium px-3 py-1.5 rounded-full">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  {s.beneficio}
                </div>
              </div>
            ))}
          </div>

          {/* Confianza */}
          <div class="bg-navy-900 rounded-2xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { n: "200+", l: "Empresas activas" },
              { n: "100%", l: "Cobertura médica" },
              { n: "4hs", l: "Implementación" },
              { n: "24/7", l: "Soporte dedicado" },
            ].map((s) => (
              <div key={s.n}>
                <div class="font-display font-black text-verde-400 text-3xl mb-1">
                  {s.n}
                </div>
                <div class="text-white/60 font-body text-sm">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de contacto B2B */}
      <section id="contacto" class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-2xl">
          <div class="text-center mb-10">
            <h2 class="font-display text-h2 text-navy-900 mb-3">
              Hablemos de tu empresa
            </h2>
            <p class="text-gris-600 font-body">
              Completá el formulario y un asesor especializado te contactará en
              menos de 24 horas.
            </p>
          </div>
          <div class="bg-white rounded-2xl p-8 shadow-card border border-gris-100">
            <LeadForm servicioDefault="area-protegida" isB2B={true} />
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Empresas — Mijal Salud | Área Protegida",
  meta: [
    {
      name: "description",
      content:
        "Servicio de Área Protegida y cobertura médica permanente para eventos, plantas industriales y espacios de trabajo.",
    },
  ],
};

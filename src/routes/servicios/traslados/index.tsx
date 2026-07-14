import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { WHATSAPP_ATENCION, TELEFONO_HREF, TELEFONO_EMERGENCIAS } from "~/lib/constants";

export default component$(() => {
  return (
    <main class="pt-24">
      <section class="bg-navy-900 relative overflow-hidden py-20">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 max-w-3xl text-center">
          <h1 class="font-display text-h1 text-white mb-5">
            Traslados <span class="text-blue-300">Sanitarios</span>
          </h1>
          <p class="text-white/75 font-body text-body-lg mb-8">
            Traslados seguros con asistencia médica. Para pacientes que necesitan moverse 
            entre domicilios, clínicas o centros de salud con cuidado médico durante el trayecto.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WHATSAPP_ATENCION} target="_blank" rel="noopener noreferrer"
              class="bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta transition-all duration-200">
              Solicitar traslado
            </a>
            <a href={TELEFONO_HREF}
              class="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-display font-semibold px-8 py-4 rounded-2xl transition-all duration-200">
              📞 {TELEFONO_EMERGENCIAS}
            </a>
          </div>
        </div>
      </section>

      {/* Tipos de traslado */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">Tipos de traslado disponibles</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🚑",
                title: "Alta complejidad",
                desc: "Con médico, enfermero y equipamiento completo. Para pacientes críticos o en terapia intensiva.",
                incluye: ["Monitor cardíaco", "Respirador portátil", "Medicación UCI", "Médico especialista"],
                color: "border-red-200 bg-red-50",
              },
              {
                icon: "🚐",
                title: "Mediana complejidad",
                desc: "Sin enfermero. Con acompañamiento médico.",
                incluye: ["Médico acompañante", "Oxígeno y saturometría", "Silla de ruedas", "Camilla articulada"],
                color: "border-blue-200 bg-blue-50",
              },
              {
                icon: "🚗",
                title: "Baja complejidad",
                desc: "Para pacientes autónomos que necesitan asistencia básica durante el trayecto.",
                incluye: ["Acompañante capacitado", "Botiquín básico", "Comunicación con central", "Cobertura de ruta"],
                color: "border-verde-200 bg-verde-50",
              },
            ].map((t) => (
              <div key={t.title} class={["rounded-2xl border-2 p-7", t.color]}>
                <div class="text-4xl mb-4">{t.icon}</div>
                <h3 class="font-display font-bold text-navy-900 text-lg mb-2">{t.title}</h3>
                <p class="text-gris-600 font-body text-sm mb-5">{t.desc}</p>
                <ul class="space-y-2">
                  {t.incluye.map((i) => (
                    <li key={i} class="flex items-center gap-2 text-gris-700 text-xs font-body">
                      <svg class="w-3.5 h-3.5 text-verde-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Casos de uso */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-10">
            <h2 class="font-display text-h2 text-navy-900 mb-4">¿Para qué usarlo?</h2>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { emoji: "🏥", label: "Alta hospitalaria" },
              { emoji: "🩺", label: "Turno con especialista" },
              { emoji: "🧪", label: "Laboratorio o diagnóstico" },
              { emoji: "🏊", label: "Rehabilitación" },
              { emoji: "✈️", label: "Traslado interurbano" },
              { emoji: "🏡", label: "Ingreso a geriátrico" },
            ].map((c) => (
              <div key={c.label} class="bg-white border border-gris-200 rounded-2xl p-5 text-center hover:border-blue-300 transition-colors">
                <div class="text-3xl mb-2">{c.emoji}</div>
                <p class="text-gris-700 font-body text-xs font-medium">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Traslados Sanitarios — Mijal Salud | Buenos Aires y AMBA",
  meta: [{ name: "description", content: "Traslados médicos seguros en Buenos Aires: alta, mediana y baja complejidad. Ambulancias equipadas con personal médico calificado." }],
};

import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { TELEFONO_EMERGENCIAS, TELEFONO_HREF, WHATSAPP_CLIENTES } from "~/lib/constants";
import { TiemposRespuesta } from "~/components/servicios/TiemposRespuesta";

export default component$(() => {
  return (
    <main class="pt-24">
      <section class="bg-red-900 relative overflow-hidden py-24">
        <div class="absolute inset-0 bg-gradient-to-br from-red-950 to-navy-900 opacity-95" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-red-400 rounded-full opacity-20 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 max-w-4xl text-center">
          <div class="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/40 rounded-full px-4 py-2 mb-8">
            <span class="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
            <span class="text-red-200 text-sm font-body font-medium">Disponible 24 horas · 365 días del año</span>
          </div>
          <h1 class="font-display text-h1 text-white mb-5">
            Emergencias <span class="text-red-300">Médicas</span>
          </h1>
          <p class="text-white/75 font-body text-body-lg mb-8 max-w-2xl mx-auto">
            Emergencia médica. Staff profesional altamente capacitado. Coordinación
            permanente con hospitales y guardias ante eventuales derivaciones.
            Médicos en cabina de apoyo las 24 horas. Despacho inmediato de unidades
            médicas con personal especializado.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={TELEFONO_HREF} class="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white font-display font-bold text-xl px-8 py-5 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200 animate-pulse-slow">
              📞 {TELEFONO_EMERGENCIAS}
            </a>
            <a href={WHATSAPP_CLIENTES} target="_blank" rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-display font-semibold px-8 py-5 rounded-2xl transition-all duration-200">
              WhatsApp Emergencias
            </a>
          </div>
        </div>
      </section>

      {/* Cuándo llamar */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">¿Cuándo es una emergencia?</h2>
            <p class="text-gris-600 font-body text-body-lg max-w-xl mx-auto">
              Llamanos de inmediato si alguien presenta alguno de estos síntomas.
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: "❤️", label: "Dolor en el pecho o presión" },
              { emoji: "🧠", label: "ACV: cara caída, brazo débil, habla entrecortada" },
              { emoji: "😮‍💨", label: "Dificultad respiratoria severa" },
              { emoji: "😵", label: "Pérdida de conciencia" },
              { emoji: "🤕", label: "Traumatismo de cráneo o columna" },
              { emoji: "🩸", label: "Hemorragia activa incontrolable" },
              { emoji: "💊", label: "Intoxicación o sobredosis" },
              { emoji: "⚡", label: "Convulsiones o paro epiléptico" },
              { emoji: "🤰", label: "Complicaciones en el parto" },
            ].map((item) => (
              <div key={item.label} class="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                <span class="text-2xl shrink-0">{item.emoji}</span>
                <span class="font-body text-gris-700 text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué hacemos */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="font-display text-h2 text-navy-900 mb-6">Qué traemos a tu domicilio</h2>
              <ul class="space-y-4">
                {[
                  "Médico especializado y enfermero calificado",
                  "Medicación de emergencias completa",
                  "Oxígeno, cánulas y equipos de vía aérea avanzada",
                  "Electrocardiograma portátil",
                  "Equipamiento de última tecnología",
                  "Coordinación con guardias hospitalarias",
                ].map((item) => (
                  <li key={item} class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span class="text-gris-700 font-body text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <TiemposRespuesta />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section class="py-14 bg-red-600">
        <div class="container mx-auto px-6 text-center">
          <h2 class="font-display font-black text-white text-3xl mb-3">¿Estás frente a una emergencia ahora?</h2>
          <p class="text-white/80 font-body mb-6">No esperes. Llamanos ahora.</p>
          <a href={TELEFONO_HREF} class="inline-flex items-center gap-3 bg-white text-red-700 font-display font-black text-2xl px-10 py-5 rounded-2xl shadow-2xl hover:shadow-red-900/30 transition-all duration-200">
            📞 {TELEFONO_EMERGENCIAS}
          </a>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Emergencias Médicas 24/7 — Mijal Salud | AMBA",
  meta: [
    { name: "description", content: `Emergencias médicas domiciliarias en Buenos Aires y AMBA. Médico en tu domicilio en minutos. Llamá al ${TELEFONO_EMERGENCIAS} las 24 horas.` },
  ],
};

import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { WHATSAPP_ATENCION, TELEFONO_HREF, TELEFONO_EMERGENCIAS } from "~/lib/constants";

export default component$(() => {
  return (
    <main class="pt-24">
      <section class="bg-navy-900 relative overflow-hidden py-20">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 max-w-3xl text-center">
          <div class="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 rounded-full px-4 py-2 mb-8">
            <span class="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <span class="text-orange-200 text-sm font-body font-medium">Disponible 24 horas · 365 días del año</span>
          </div>
          <h1 class="font-display text-h1 text-white mb-5">
            Urgencias <span class="text-orange-300">Médicas</span>
          </h1>
          <p class="text-white/75 font-body text-body-lg mb-8 max-w-2xl mx-auto">
            Cuando no puede esperar, pero tampoco es riesgo de vida inmediato. 
            Un médico en tu domicilio en el menor tiempo posible.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WHATSAPP_ATENCION} target="_blank" rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta transition-all duration-200">
              💬 Solicitar por WhatsApp
            </a>
            <a href={TELEFONO_HREF}
              class="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-display font-semibold px-8 py-4 rounded-2xl transition-all duration-200">
              📞 {TELEFONO_EMERGENCIAS}
            </a>
          </div>
        </div>
      </section>

      {/* Cuándo pedir urgencias */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">¿Cuándo pedir una urgencia?</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: "🌡️", label: "Fiebre alta (>39°C) en adultos o niños" },
              { emoji: "😣", label: "Dolor intenso sin causa conocida" },
              { emoji: "🫁", label: "Dificultad respiratoria moderada" },
              { emoji: "🤧", label: "Infección con rápido empeoramiento" },
              { emoji: "🦴", label: "Posible fractura o luxación" },
              { emoji: "💉", label: "Reacción alérgica sin compromiso vital" },
              { emoji: "🤢", label: "Vómitos o diarrea intensa con deshidratación" },
              { emoji: "👁️", label: "Problemas visuales o auditivos repentinos" },
              { emoji: "💊", label: "Necesidad urgente de medicación controlada" },
            ].map((item) => (
              <div key={item.label} class="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl p-4">
                <span class="text-2xl shrink-0">{item.emoji}</span>
                <span class="font-body text-gris-700 text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          <div class="mt-8 bg-gris-100 rounded-2xl p-6 flex gap-4">
            <div class="text-3xl">⚠️</div>
            <div>
              <p class="font-display font-semibold text-navy-900 mb-1">¿No sabés si es emergencia o urgencia?</p>
              <p class="text-gris-600 font-body text-sm">Llamanos de todas formas. Nuestro equipo de triaje te orientará y despachará el recurso adecuado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">Cómo funciona</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: "1", emoji: "📞", title: "Contactás", desc: "Llamás o escribís por WhatsApp describiendo el cuadro." },
              { n: "2", emoji: "🩺", title: "Triaje", desc: "Nuestro coordinador médico evalúa y prioriza tu caso." },
              { n: "3", emoji: "🚑", title: "Despacho", desc: "Enviamos el médico adecuado para tu situación." },
              { n: "4", emoji: "✅", title: "Atención", desc: "Diagnóstico, tratamiento y seguimiento en tu hogar." },
            ].map((s) => (
              <div key={s.n} class="text-center bg-white rounded-2xl p-6 border border-gris-100 shadow-sm">
                <div class="text-3xl mb-3">{s.emoji}</div>
                <h3 class="font-display font-bold text-navy-900 text-base mb-2">{s.title}</h3>
                <p class="text-gris-600 font-body text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Urgencias Médicas a Domicilio 24/7 — Mijal Salud",
  meta: [{ name: "description", content: "Atención médica urgente en tu domicilio en Buenos Aires y AMBA. Médico clínico disponible las 24 horas para cuadros que no pueden esperar." }],
};

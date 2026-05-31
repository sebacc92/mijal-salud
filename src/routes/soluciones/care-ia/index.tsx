import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LeadForm } from "~/components/forms/LeadForm";

export default component$(() => {
  return (
    <main class="pt-24">
      {/* Hero */}
      <section class="bg-navy-900 relative overflow-hidden py-24">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-navy-400 rounded-full opacity-20 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 bg-navy-600/50 border border-navy-400/40 rounded-full px-4 py-2 mb-8">
              <span class="text-2xl">🤖</span>
              <span class="text-white/80 text-sm font-body font-medium">Inteligencia Artificial · Salud Predictiva</span>
            </div>
            <h1 class="font-display text-h1 text-white mb-5">
              Mijal Care <span class="text-verde-400">IA</span>
            </h1>
            <p class="text-white/75 font-body text-body-lg mb-8 max-w-xl">
              El primer asistente de salud con IA para adultos mayores y pacientes crónicos en Argentina. 
              Detecta deterioro antes de que sea emergencia.
            </p>
            <a href="#registro" class="inline-flex bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200">
              Quiero saber más
            </a>
          </div>
        </div>
      </section>

      {/* El problema que resuelve */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <h2 class="font-display text-h2 text-navy-900 mb-6">
                El 70% de las internaciones de adultos mayores <span class="text-verde-500">son prevenibles</span>
              </h2>
              <p class="text-gris-600 font-body text-body-lg mb-6 leading-relaxed">
                La mayoría de las crisis de salud tienen señales de alerta tempranas. El problema es que 
                nadie está mirando. Mijal Care IA monitorea de forma continua y silenciosa, alertando 
                antes de que sea tarde.
              </p>
              <div class="space-y-4">
                {[
                  "Monitoreo 24/7 sin intervención del paciente",
                  "Alertas automáticas a familiares y médicos",
                  "Integración con dispositivos de salud existentes",
                  "Historial predictivo con tendencias mensuales",
                ].map((item) => (
                  <div key={item} class="flex items-center gap-3">
                    <div class="w-5 h-5 bg-verde-100 rounded-full flex items-center justify-center shrink-0">
                      <svg class="w-3 h-3 text-verde-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span class="text-gris-700 font-body text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              {[
                { emoji: "🔴", stat: "4 de cada 10", desc: "Adultos mayores internados podrían haberlo evitado" },
                { emoji: "⏱️", stat: "48 horas", desc: "Ventana de detección antes de una crisis" },
                { emoji: "📱", stat: "Sin app", desc: "Funciona por WhatsApp, sin tecnología nueva" },
                { emoji: "👨‍👩‍👧", stat: "Familia conectada", desc: "Reportes automáticos para cuidadores" },
              ].map((s) => (
                <div key={s.stat} class="bg-navy-900 rounded-2xl p-6 text-white">
                  <div class="text-3xl mb-3">{s.emoji}</div>
                  <div class="font-display font-black text-verde-400 text-xl mb-1">{s.stat}</div>
                  <p class="text-white/60 font-body text-xs">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">Lo que hace Mijal Care IA</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "💬", title: "Conversación diaria", desc: "El asistente IA chequea al paciente todos los días a través de WhatsApp de forma natural y amigable." },
              { emoji: "📈", title: "Análisis de patrones", desc: "Detecta cambios sutiles en respuestas, humedad, actividad y síntomas reportados." },
              { emoji: "🚨", title: "Alertas tempranas", desc: "Notifica a familiares y al médico tratante ante cualquier señal de deterioro detectada." },
              { emoji: "⌚", title: "Integración wearables", desc: "Compatible con glucómetros, tensiómetros y pulsómetros Bluetooth del mercado." },
              { emoji: "📊", title: "Reportes mensuales", desc: "Informe PDF completo para el médico de cabecera con tendencias y recomendaciones." },
              { emoji: "🏥", title: "Enlace con central", desc: "Si detecta urgencia, conecta automáticamente con la central de Mijal Salud." },
            ].map((f) => (
              <div key={f.title} class="bg-white rounded-2xl p-6 border border-gris-100 shadow-card">
                <div class="text-3xl mb-4">{f.emoji}</div>
                <h3 class="font-display font-bold text-navy-900 text-base mb-2">{f.title}</h3>
                <p class="text-gris-600 font-body text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="registro" class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-2xl">
          <div class="text-center mb-10">
            <h2 class="font-display text-h2 text-navy-900 mb-3">Registrá tu interés</h2>
            <p class="text-gris-600 font-body">¿Tenés un familiar mayor o sos médico/a? Contanos tu caso.</p>
          </div>
          <div class="bg-gris-50 rounded-2xl p-8 border border-gris-100">
            <LeadForm servicioDefault="care-ia" />
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Mijal Care IA — Salud Predictiva para Adultos Mayores",
  meta: [{ name: "description", content: "Asistente de salud con IA para adultos mayores y pacientes crónicos. Detecta deterioro antes de que sea emergencia y alerta a la familia." }],
};

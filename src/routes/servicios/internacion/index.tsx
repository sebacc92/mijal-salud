import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { WHATSAPP_ATENCION } from "~/lib/constants";

export default component$(() => {
  return (
    <main class="pt-24">
      <section class="bg-navy-900 relative overflow-hidden py-20">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="relative container mx-auto px-6 lg:px-12 max-w-3xl text-center">
          <h1 class="font-display text-h1 text-white mb-5">
            Internación <span class="text-verde-400">Domiciliaria</span>
          </h1>
          <p class="text-white/75 font-body text-body-lg mb-8">
            La calidad de una clínica, en la comodidad de tu hogar. 
            Seguimiento médico y enfermería las 24 horas junto a tu familia.
          </p>
          <a href={WHATSAPP_ATENCION} target="_blank" rel="noopener noreferrer"
            class="inline-flex bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200">
            Consultar disponibilidad
          </a>
        </div>
      </section>

      {/* Beneficios */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">¿Por qué internarse en casa?</h2>
            <p class="text-gris-600 font-body text-body-lg max-w-2xl mx-auto">
              La evidencia clínica demuestra que los pacientes evolucionan mejor en su entorno familiar.
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {[
              { emoji: "❤️", title: "Menor estrés", desc: "El ambiente familiar acelera la recuperación y mejora el bienestar." },
              { emoji: "🦠", title: "Menos infecciones", desc: "Sin exposición a gérmenes hospitalarios resistentes a antibióticos." },
              { emoji: "👨‍👩‍👧", title: "Acompañamiento", desc: "Tu familia puede estar presente sin horarios ni restricciones." },
              { emoji: "💰", title: "Menor costo", desc: "El costo promedio es significativamente menor a una internación clínica." },
            ].map((b) => (
              <div key={b.title} class="text-center bg-navy-50 border border-navy-100 rounded-2xl p-6">
                <div class="text-4xl mb-4">{b.emoji}</div>
                <h3 class="font-display font-bold text-navy-900 text-base mb-2">{b.title}</h3>
                <p class="text-gris-600 font-body text-sm">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Qué incluye */}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="font-display text-h2 text-navy-900 mb-6">Qué incluye el programa</h2>
              <ul class="space-y-4">
                {[
                  "Médico de cabecera con visitas según evolución",
                  "Enfermería domiciliaria (guardias de 12 o 24 horas)",
                  "Medicación e insumos en el domicilio",
                  "Equipamiento: bomba de infusión, oxígeno, nebulizador",
                  "Análisis de laboratorio a domicilio",
                  "Coordinación con hospital o clínica de referencia",
                  "Servicio de emergencias on-call incluido",
                ].map((item) => (
                  <li key={item} class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-verde-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-gris-700 font-body text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div class="bg-gris-50 rounded-3xl p-8 border border-gris-200">
              <h3 class="font-display font-bold text-navy-900 text-lg mb-5">Patologías frecuentes</h3>
              <div class="flex flex-wrap gap-2">
                {[
                  "Post-quirúrgicos", "EPOC", "Neumonía", "ICC descompensada",
                  "Diabetes complicada", "Oncología paliativa", "ACV en rehabilitación",
                  "Fractura de cadera", "Heridas crónicas", "Infecciones IV"
                ].map((p) => (
                  <span key={p} class="bg-white border border-gris-200 text-gris-700 text-xs font-body px-3 py-1.5 rounded-full">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Internación Domiciliaria — Mijal Salud | Buenos Aires",
  meta: [{ name: "description", content: "Programa de internación domiciliaria con médico de cabecera, enfermería 24hs, equipamiento y medicación. Recuperate en casa junto a tu familia." }],
};

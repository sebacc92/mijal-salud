import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { WHATSAPP_ATENCION } from "~/lib/constants";
import { TiemposRespuesta } from "~/components/servicios/TiemposRespuesta";

export default component$(() => {
  return (
    <main class="pt-24">
      <section class="bg-navy-900 relative overflow-hidden py-20">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-verde-400 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 max-w-3xl text-center">
          <h1 class="font-display text-h1 text-white mb-5">
            Visitas Médicas <span class="text-verde-400">a Domicilio</span>
          </h1>
          <p class="text-white/75 font-body text-body-lg mb-8">
            Atención médica orientada a Código Verde, sin turno previo. Es un
            servicio derivado desde nuestra Central de Operaciones. No corresponde
            a una urgencia ni a una emergencia médica.
          </p>
          <a href={WHATSAPP_ATENCION} target="_blank" rel="noopener noreferrer"
            class="inline-flex bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200">
            Solicitar una visita
          </a>
        </div>
      </section>

      {/* Especialidades */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">Especialidades disponibles</h2>
            <p class="text-gris-600 font-body text-body-lg max-w-xl mx-auto">
              Clínicos, pediatras, geriatras y especialistas que visitan tu hogar.
            </p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-14">
            {[
              { emoji: "🩺", label: "Medicina clínica" },
              { emoji: "👶", label: "Pediatría" },
              { emoji: "👴", label: "Geriatría" },
              { emoji: "🧠", label: "Neurología" },
              { emoji: "❤️", label: "Cardiología" },
              { emoji: "🫁", label: "Neumonología" },
              { emoji: "🩹", label: "Curación de heridas" },
              { emoji: "💉", label: "Aplicación de inyecciones" },
              { emoji: "🔬", label: "Extracción de laboratorio" },
              { emoji: "📋", label: "Certificados médicos" },
              { emoji: "💊", label: "Recetas y órdenes" },
              { emoji: "📊", label: "Seguimiento crónico" },
            ].map((e) => (
              <div key={e.label} class="flex items-center gap-3 bg-verde-50 border border-verde-100 rounded-xl p-4 hover:border-verde-300 transition-colors">
                <span class="text-2xl shrink-0">{e.emoji}</span>
                <span class="font-body text-gris-700 text-sm font-medium">{e.label}</span>
              </div>
            ))}
          </div>

          {/* Cómo funciona */}
          <div class="bg-navy-900 rounded-3xl p-8 text-white">
            <h3 class="font-display font-bold text-xl text-center mb-8">Cómo funciona</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              {[
                { emoji: "💬", step: "1", desc: "Contactás a la Central de Operaciones" },
                { emoji: "🩺", step: "2", desc: "Clasificamos el caso como Código Verde" },
                { emoji: "📍", step: "3", desc: "Coordinamos la visita a tu domicilio" },
                { emoji: "🏠", step: "4", desc: "El médico llega, sin turno previo" },
              ].map((s) => (
                <div key={s.step}>
                  <div class="w-12 h-12 bg-verde-500/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">{s.emoji}</div>
                  <p class="text-white/70 font-body text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tiempos de respuesta */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-3xl">
          <div class="text-center mb-10">
            <h2 class="font-display text-h2 text-navy-900 mb-4">Tiempos de respuesta</h2>
            <p class="text-gris-600 font-body text-body-lg max-w-xl mx-auto">
              La visita médica se atiende como Código Verde.
            </p>
          </div>
          <TiemposRespuesta titulo="Según código de prioridad" />
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Visitas Médicas Domiciliarias — Mijal Salud | Buenos Aires",
  meta: [{ name: "description", content: "Visitas médicas a domicilio en Buenos Aires. Atención de Código Verde sin turno previo, derivada desde la Central de Operaciones. Clínicos, pediatras, geriatras y especialistas." }],
};

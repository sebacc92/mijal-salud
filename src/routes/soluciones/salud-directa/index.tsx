import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LeadForm } from "~/components/forms/LeadForm";
import { WHATSAPP_ATENCION } from "~/lib/constants";

export default component$(() => {
  return (
    <main class="pt-24">
      {/* Hero */}
      <section class="bg-navy-900 relative overflow-hidden py-24">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-verde-500 rounded-full opacity-15 blur-3xl" />
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-verde-400 rounded-full opacity-10 blur-2xl" />
        <div class="relative container mx-auto px-6 lg:px-12">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 bg-verde-500/20 border border-verde-500/40 rounded-full px-4 py-2 mb-8">
              <span class="text-2xl">📲</span>
              <span class="text-verde-300 text-sm font-body font-medium">Telemedicina · Lanzamiento próximo</span>
            </div>
            <h1 class="font-display text-h1 text-white mb-5">
              Mijal Salud <span class="text-verde-400">Directa</span>
            </h1>
            <p class="text-white/75 font-body text-body-lg mb-8 max-w-xl">
              Tu médico a un click de distancia. Iniciá una consulta desde WhatsApp en menos de 10 minutos, 
              sin turnos, sin esperas y desde donde estés.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <a href="#registro" class="bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200">
                Registrar interés
              </a>
              <a href={WHATSAPP_ATENCION} target="_blank" rel="noopener noreferrer"
                class="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-display font-semibold px-8 py-4 rounded-2xl transition-all duration-200">
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-14">
            <h2 class="font-display text-h2 text-navy-900 mb-4">¿Cómo funciona?</h2>
            <p class="text-gris-600 font-body text-body-lg max-w-xl mx-auto">
              Tres pasos para tener un médico en tu pantalla.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { paso: "01", emoji: "💬", titulo: "Describí tu síntoma", desc: "Escribís por WhatsApp o completás un formulario rápido. Nuestra IA hace el triaje inicial." },
              { paso: "02", emoji: "📹", titulo: "Videoconsulta en <10 min", desc: "Un médico de Mijal Salud te llama por video. Sin espera, sin sala de guardia." },
              { paso: "03", emoji: "📋", titulo: "Receta y seguimiento", desc: "Recibís tu receta digital, órdenes de laboratorio o la derivación que necesitás." },
            ].map((s) => (
              <div key={s.paso} class="relative text-center">
                <div class="absolute -top-4 left-1/2 -translate-x-1/2 font-display font-black text-6xl text-gris-100 select-none z-0">{s.paso}</div>
                <div class="relative z-10 w-16 h-16 bg-verde-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">{s.emoji}</div>
                <h3 class="font-display font-bold text-navy-900 text-lg mb-2 relative z-10">{s.titulo}</h3>
                <p class="text-gris-600 font-body text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div class="inline-flex items-center gap-2 bg-verde-100 text-verde-700 rounded-full px-4 py-2 mb-6 text-sm font-body font-medium">
                ✨ Funcionalidades principales
              </div>
              <h2 class="font-display text-h2 text-navy-900 mb-6">Todo lo que necesitás, en una sola plataforma</h2>
              <ul class="space-y-4">
                {[
                  { icon: "🤖", title: "Triaje por IA", desc: "Evaluación inicial inteligente que prioriza según urgencia y deriva al especialista adecuado." },
                  { icon: "📹", title: "Videoconsulta 24/7", desc: "Médicos disponibles las 24 horas, incluyendo fines de semana y feriados." },
                  { icon: "📄", title: "Recetas digitales", desc: "Recetas, órdenes de laboratorio y derivaciones con firma electrónica certificada." },
                  { icon: "📊", title: "Historial médico", desc: "Todas tus consultas centralizadas y accesibles en cualquier momento." },
                  { icon: "🚑", title: "Despacho si es necesario", desc: "Si la situación lo requiere, enviamos una unidad móvil a tu domicilio." },
                ].map((f) => (
                  <li key={f.title} class="flex gap-4">
                    <div class="w-10 h-10 bg-verde-100 rounded-xl flex items-center justify-center text-xl shrink-0">{f.icon}</div>
                    <div>
                      <p class="font-display font-semibold text-navy-900 mb-0.5">{f.title}</p>
                      <p class="text-gris-600 font-body text-sm">{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div class="bg-navy-900 rounded-3xl p-8 text-white">
              <h3 class="font-display font-bold text-xl mb-6">¿Para quién es?</h3>
              <div class="space-y-4">
                {[
                  { emoji: "👨‍👩‍👧", label: "Familias con hijos", desc: "Consultas pediátricas sin salir de casa" },
                  { emoji: "👴", label: "Adultos mayores", desc: "Sin desplazamientos, en la comodidad del hogar" },
                  { emoji: "💼", label: "Profesionales ocupados", desc: "Consultas en el horario que mejor te venga" },
                  { emoji: "🏥", label: "Obras sociales", desc: "Reducción de consultas en guardia innecesarias" },
                ].map((p) => (
                  <div key={p.label} class="flex gap-4 bg-white/5 rounded-2xl p-4">
                    <span class="text-2xl shrink-0">{p.emoji}</span>
                    <div>
                      <p class="font-display font-semibold text-white text-sm">{p.label}</p>
                      <p class="text-white/60 font-body text-xs">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="registro" class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-2xl">
          <div class="text-center mb-10">
            <h2 class="font-display text-h2 text-navy-900 mb-3">Registrá tu interés</h2>
            <p class="text-gris-600 font-body">Sé de los primeros en acceder cuando lancemos. Te avisamos antes que nadie.</p>
          </div>
          <div class="bg-gris-50 rounded-2xl p-8 border border-gris-100">
            <LeadForm servicioDefault="salud-directa" />
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Mijal Salud Directa — Telemedicina 24/7",
  meta: [{ name: "description", content: "Consultá con un médico en menos de 10 minutos desde WhatsApp. Triaje por IA, videoconsulta y recetas digitales. Disponible 24/7." }],
};

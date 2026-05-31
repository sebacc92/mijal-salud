import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LeadForm } from "~/components/forms/LeadForm";
import { WHATSAPP_EMPRESAS } from "~/lib/constants";

export default component$(() => {
  return (
    <main class="pt-24">
      {/* Hero */}
      <section class="bg-navy-900 relative overflow-hidden py-24">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 rounded-full px-4 py-2 mb-8">
              <span class="text-2xl">🛡️</span>
              <span class="text-orange-200 text-sm font-body font-medium">Medicina preventiva corporativa · Alta demanda B2B</span>
            </div>
            <h1 class="font-display text-h1 text-white mb-5">
              Mijal Prevención <span class="text-orange-300">Activa</span>
            </h1>
            <p class="text-white/75 font-body text-body-lg mb-8 max-w-xl">
              Programa de salud preventiva para empresas. Reducí el ausentismo, 
              mejorá el bienestar de tu equipo y demostrá ROI medible desde el primer trimestre.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <a href={WHATSAPP_EMPRESAS} target="_blank" rel="noopener noreferrer"
                class="bg-orange-500 hover:bg-orange-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta transition-all duration-200">
                Hablar con un asesor
              </a>
              <a href="#formulario" class="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-display font-semibold px-8 py-4 rounded-2xl transition-all duration-200">
                Pedir propuesta
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Métricas clave */}
      <section class="py-14 bg-orange-50 border-y border-orange-100">
        <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { n: "35%", l: "Reducción ausentismo", sub: "Promedio en clientes piloto" },
              { n: "4.5x", l: "ROI promedio", sub: "En el primer año" },
              { n: "48hs", l: "Implementación", sub: "Sin interrumpir operaciones" },
              { n: "200+", l: "Empresas", sub: "Ya trabajan con nosotros" },
            ].map((s) => (
              <div key={s.n}>
                <div class="font-display font-black text-orange-600 text-4xl mb-1">{s.n}</div>
                <div class="font-display font-semibold text-navy-900 text-sm mb-0.5">{s.l}</div>
                <div class="text-gris-500 font-body text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">¿Qué incluye el programa?</h2>
            <p class="text-gris-600 font-body text-body-lg max-w-xl mx-auto">
              Un programa 360° que se adapta al tamaño y necesidades de tu empresa.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                emoji: "🩺",
                title: "Check-ups médicos domiciliarios",
                desc: "Visitas médicas en la empresa o el domicilio de los empleados. Sin ausentismo para la consulta.",
                tags: ["Clínicos", "Laboratorio", "Vacunación"],
              },
              {
                emoji: "📊",
                title: "Dashboard de salud corporativa",
                desc: "Panel de control en tiempo real para RRHH: indicadores de salud agregados, alertas y tendencias.",
                tags: ["Anónimo", "RRHH", "Tiempo real"],
              },
              {
                emoji: "📉",
                title: "Reducción de ausentismo medible",
                desc: "KPIs mensuales, comparación contra baseline y recomendaciones accionables para RR.HH.",
                tags: ["KPIs", "Benchmarks", "Informe trimestral"],
              },
              {
                emoji: "💊",
                title: "Programas de salud específicos",
                desc: "Diabetes, hipertensión, salud mental, ergonomía y más. Personalizados para tu industria.",
                tags: ["Crónicas", "Mental", "Ergonomía"],
              },
            ].map((f) => (
              <div key={f.title} class="border-2 border-orange-100 hover:border-orange-300 rounded-2xl p-7 transition-colors">
                <div class="text-3xl mb-4">{f.emoji}</div>
                <h3 class="font-display font-bold text-navy-900 text-lg mb-2">{f.title}</h3>
                <p class="text-gris-600 font-body text-sm leading-relaxed mb-4">{f.desc}</p>
                <div class="flex flex-wrap gap-2">
                  {f.tags.map((t) => (
                    <span key={t} class="bg-orange-50 text-orange-700 text-xs font-body font-medium px-2.5 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Casos de uso por industria */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">Adaptado a tu industria</h2>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { emoji: "🏗️", label: "Construcción" },
              { emoji: "🏭", label: "Industria" },
              { emoji: "💻", label: "Tech & Fintech" },
              { emoji: "🏪", label: "Retail" },
              { emoji: "📦", label: "Logística" },
              { emoji: "🎓", label: "Educación" },
            ].map((i) => (
              <div key={i.label} class="bg-white border border-gris-200 rounded-2xl p-5 text-center hover:border-orange-300 transition-colors">
                <div class="text-3xl mb-2">{i.emoji}</div>
                <p class="text-gris-700 font-body text-xs font-medium">{i.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="formulario" class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-2xl">
          <div class="text-center mb-10">
            <h2 class="font-display text-h2 text-navy-900 mb-3">Pedí una propuesta personalizada</h2>
            <p class="text-gris-600 font-body">Un asesor especializado te contactará en menos de 24 horas.</p>
          </div>
          <div class="bg-gris-50 rounded-2xl p-8 border border-gris-100">
            <LeadForm servicioDefault="prevencion-activa" />
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Mijal Prevención Activa — Salud Laboral para Empresas",
  meta: [{ name: "description", content: "Programa de medicina preventiva corporativa. Reducí el ausentismo un 35% con check-ups, dashboard de salud para RRHH y KPIs medibles." }],
};

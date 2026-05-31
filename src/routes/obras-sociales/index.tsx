import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LeadForm } from "~/components/forms/LeadForm";

const partners = [
  { nombre: "OSDE", tipo: "Prepaga" },
  { nombre: "Swiss Medical", tipo: "Prepaga" },
  { nombre: "Galeno", tipo: "Prepaga" },
  { nombre: "Medifé", tipo: "Prepaga" },
  { nombre: "IOMA", tipo: "Obra Social" },
  { nombre: "PAMI", tipo: "Programa" },
  { nombre: "Omint", tipo: "Prepaga" },
  { nombre: "Sancor Salud", tipo: "Prepaga" },
  { nombre: "Accord Salud", tipo: "Obra Social" },
  { nombre: "Sancor ART", tipo: "ART" },
  { nombre: "Federación Patronal", tipo: "ART" },
  { nombre: "La Segunda", tipo: "ART" },
];

const beneficios = [
  {
    emoji: "📉",
    title: "Reducción de internaciones",
    desc: "Nuestra atención domiciliaria reduce hasta un 60% las internaciones innecesarias, bajando costos significativamente.",
  },
  {
    emoji: "⚡",
    title: "Respuesta inmediata",
    desc: "Central operativa 24/7. Tiempo de respuesta promedio de 18 minutos en AMBA. Sin listas de espera.",
  },
  {
    emoji: "🔌",
    title: "Integración API",
    desc: "Conexión directa con tus sistemas de autorizaciones y facturación. Proceso 100% digital.",
  },
  {
    emoji: "📊",
    title: "Reportes y auditoría",
    desc: "Acceso a dashboard de atenciones, informes de calidad y métricas de satisfacción en tiempo real.",
  },
  {
    emoji: "🤝",
    title: "Atención humanizada",
    desc: "NPS promedio de 9.2/10. Médicos entrenados en comunicación con el paciente y la familia.",
  },
  {
    emoji: "💰",
    title: "Modelo flexible",
    desc: "Modelos de contratación por capita, fee-for-service o pago por atención. Sin mínimos abusivos.",
  },
];

export default component$(() => {
  return (
    <main class="pt-24">
      {/* Hero */}
      <section class="bg-navy-900 relative overflow-hidden py-24">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-verde-500 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 text-center max-w-4xl mx-auto">
          <div class="inline-flex items-center gap-2 bg-verde-500/20 border border-verde-500/40 rounded-full px-4 py-2 mb-8">
            <span class="text-verde-300 text-sm font-body font-medium">🏥 Partners estratégicos</span>
          </div>
          <h1 class="font-display text-h1 text-white mb-5">
            Soluciones para <span class="text-verde-400">Obras Sociales</span> y Prepagas
          </h1>
          <p class="text-white/70 font-body text-body-lg mb-8 max-w-2xl mx-auto">
            Más de 20 años trabajando con los principales financiadores de salud de Argentina. 
            Reducimos costos, mejoramos la experiencia del afiliado y digitalizamos el proceso.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contacto" class="bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200">
              Hablar con un ejecutivo
            </a>
            <a href="#beneficios" class="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-display font-semibold px-8 py-4 rounded-2xl transition-all duration-200">
              Ver beneficios
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section class="py-14 bg-verde-500">
        <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { n: "36+", l: "Financiadores activos" },
              { n: "20+", l: "Años de partnership" },
              { n: "28.957", l: "Atenciones facturadas" },
              { n: "9.2/10", l: "NPS promedio" },
            ].map((s) => (
              <div key={s.n}>
                <div class="font-display font-black text-white text-4xl mb-1">{s.n}</div>
                <div class="text-white/70 font-body text-sm">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners actuales */}
      <section class="py-14 bg-gris-50 border-b border-gris-100">
        <div class="container mx-auto px-6 lg:px-12">
          <p class="text-center text-gris-500 font-body text-sm uppercase tracking-widest mb-10">
            Trabajamos con los principales financiadores de Argentina
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            {partners.map((p) => (
              <div key={p.nombre} class="flex flex-col items-center gap-1 px-5 py-3 bg-white border border-gris-200 rounded-xl shadow-sm hover:shadow-card hover:border-verde-200 transition-all duration-200">
                <span class="font-display font-semibold text-gris-700 text-sm">{p.nombre}</span>
                <span class="text-gris-400 font-body text-xs">{p.tipo}</span>
              </div>
            ))}
            <div class="px-5 py-3 bg-navy-900 rounded-xl text-center">
              <span class="font-display font-semibold text-white text-sm">+24 más</span>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">
              Por qué elegir <span class="text-verde-500">Mijal Salud</span> como prestador
            </h2>
            <p class="text-gris-600 font-body text-body-lg max-w-xl mx-auto">
              Más de 20 años de confianza, tecnología de punta y resultados medibles.
            </p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficios.map((b) => (
              <div key={b.title} class="bg-gris-50 rounded-2xl p-7 border border-gris-100 hover:border-verde-200 hover:shadow-card transition-all duration-300">
                <div class="text-3xl mb-4">{b.emoji}</div>
                <h3 class="font-display font-bold text-navy-900 text-base mb-2">{b.title}</h3>
                <p class="text-gris-600 font-body text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso de onboarding */}
      <section class="py-section bg-navy-900">
        <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-white mb-4">Proceso de incorporación</h2>
            <p class="text-white/60 font-body">Empezar a trabajar juntos es simple y rápido.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: "1", title: "Reunión inicial", desc: "Diagnóstico de necesidades y volumen esperado de atenciones." },
              { n: "2", title: "Propuesta comercial", desc: "Modelo de facturación, cobertura geográfica y SLAs definidos." },
              { n: "3", title: "Integración técnica", desc: "Conexión API o carga manual de autorizaciones, según tu sistema." },
              { n: "4", title: "Go live", desc: "Capacitación al equipo y soporte dedicado en las primeras semanas." },
            ].map((s) => (
              <div key={s.n} class="text-center">
                <div class="w-14 h-14 bg-verde-500 rounded-full flex items-center justify-center font-display font-black text-white text-xl mx-auto mb-4">{s.n}</div>
                <h3 class="font-display font-bold text-white text-base mb-2">{s.title}</h3>
                <p class="text-white/50 font-body text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="contacto" class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-2xl">
          <div class="text-center mb-10">
            <h2 class="font-display text-h2 text-navy-900 mb-3">Hablemos de una alianza estratégica</h2>
            <p class="text-gris-600 font-body">Un ejecutivo de cuentas te contactará dentro de las 24 horas.</p>
          </div>
          <div class="bg-white rounded-2xl p-8 border border-gris-100 shadow-card">
            <LeadForm servicioDefault="conecta-salud" />
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Obras Sociales y Prepagas — Mijal Salud",
  meta: [{ name: "description", content: "Soluciones para obras sociales y prepagas: atención domiciliaria 24/7, API de integración, reportes de auditoría y reducción de internaciones." }],
};

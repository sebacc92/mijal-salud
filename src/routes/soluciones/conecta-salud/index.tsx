import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LeadForm } from "~/components/forms/LeadForm";

export default component$(() => {
  return (
    <main class="pt-24">
      {/* Hero */}
      <section class="bg-navy-900 relative overflow-hidden py-24">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-slate-400 rounded-full opacity-15 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
              <span class="text-2xl">🌐</span>
              <span class="text-white/80 text-sm font-body font-medium">Plataforma digital · En desarrollo</span>
            </div>
            <h1 class="font-display text-h1 text-white mb-5">
              Mijal <span class="text-verde-400">Conecta Salud</span>
            </h1>
            <p class="text-white/75 font-body text-body-lg mb-8 max-w-xl">
              La plataforma que unifica pacientes, médicos, empresas y obras sociales 
              en un solo ecosistema digital. Autogestión, geolocalización y API abierta.
            </p>
            <a href="#registro" class="inline-flex bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200">
              Registrar interés
            </a>
          </div>
        </div>
      </section>

      {/* Para quién */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">Un portal para todos los actores del ecosistema</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: "👤",
                role: "Pacientes",
                features: ["Solicitar atención", "Ver historial", "Pagar en línea", "Chat con médico"],
                color: "border-verde-200 bg-verde-50",
              },
              {
                emoji: "👨‍⚕️",
                role: "Médicos",
                features: ["Agenda digital", "Historial compartido", "Recetas electrónicas", "Facturación"],
                color: "border-navy-200 bg-navy-50",
              },
              {
                emoji: "🏢",
                role: "Empresas",
                features: ["Dashboard RRHH", "KPIs ausentismo", "Autorizaciones", "Reportes"],
                color: "border-orange-200 bg-orange-50",
              },
              {
                emoji: "🏥",
                role: "Obras Sociales",
                features: ["API REST", "Autorizaciones", "Auditoría", "Facturación electrónica"],
                color: "border-violet-200 bg-violet-50",
              },
            ].map((p) => (
              <div key={p.role} class={["rounded-2xl border-2 p-6", p.color]}>
                <div class="text-3xl mb-3">{p.emoji}</div>
                <h3 class="font-display font-bold text-navy-900 text-lg mb-4">{p.role}</h3>
                <ul class="space-y-2">
                  {p.features.map((f) => (
                    <li key={f} class="flex items-center gap-2 text-gris-700 text-sm font-body">
                      <svg class="w-3.5 h-3.5 text-verde-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades destacadas */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">Funcionalidades únicas</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: "📍", title: "Geolocalización en vivo", desc: "Seguí en el mapa la posición de tu unidad médica en tiempo real. Sin llamadas, sin incertidumbre." },
              { emoji: "🔌", title: "API abierta para obras sociales", desc: "Integración bidireccional para autorizaciones, auditoría y facturación electrónica en tiempo real." },
              { emoji: "💳", title: "Facturación digital integrada", desc: "Emisión de facturas, gestión de créditos y cobros a través de la plataforma. Sin papeles." },
              { emoji: "📱", title: "App móvil nativa", desc: "iOS y Android con notificaciones push, historial offline y firma digital para consentimientos." },
              { emoji: "🔒", title: "Seguridad y privacidad", desc: "Datos médicos cifrados en reposo y en tránsito. Cumplimiento Ley 25.326 y HIPAA." },
              { emoji: "📊", title: "Analytics en tiempo real", desc: "Dashboards personalizables para cada rol con métricas de atención, tiempos y satisfacción." },
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

      {/* Roadmap */}
      <section class="py-section bg-navy-900">
        <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-white mb-4">Roadmap de desarrollo</h2>
            <p class="text-white/60 font-body">Estamos construyendo el futuro de la salud digital en Argentina.</p>
          </div>
          <div class="relative">
            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10 hidden md:block" />
            <div class="space-y-6">
              {[
                { q: "Q2 2026", title: "Portal web pacientes (beta)", desc: "Solicitud de atención, historial y pagos en línea.", status: "En desarrollo", color: "bg-orange-400" },
                { q: "Q3 2026", title: "App móvil iOS + Android", desc: "Notificaciones push, geolocalización y firma digital.", status: "Próximamente", color: "bg-white/30" },
                { q: "Q4 2026", title: "API obras sociales", desc: "Integración completa con los principales financiadores.", status: "Próximamente", color: "bg-white/30" },
                { q: "Q1 2027", title: "Dashboard empresas", desc: "RRHH con KPIs de salud laboral y gestión de cobertura.", status: "Planeado", color: "bg-white/20" },
              ].map((r) => (
                <div key={r.q} class="md:pl-12 flex gap-5 relative">
                  <div class={["absolute left-0 top-2 w-8 h-8 rounded-full flex items-center justify-center text-xs hidden md:flex", r.color]}>
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div class="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-verde-400 font-display font-bold text-sm">{r.q}</span>
                      <span class="text-white/40 font-body text-xs">{r.status}</span>
                    </div>
                    <h3 class="font-display font-bold text-white text-base mb-1">{r.title}</h3>
                    <p class="text-white/60 font-body text-sm">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="registro" class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-2xl">
          <div class="text-center mb-10">
            <h2 class="font-display text-h2 text-navy-900 mb-3">Sumate a la lista de espera</h2>
            <p class="text-gris-600 font-body">¿Sos paciente, empresa u obra social? Registrate para acceso anticipado.</p>
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
  title: "Mijal Conecta Salud — Plataforma Digital de Salud",
  meta: [{ name: "description", content: "Portal digital unificado para pacientes, médicos, empresas y obras sociales. API abierta, geolocalización en vivo y facturación electrónica." }],
};

import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LeadForm } from "~/components/forms/LeadForm";

export default component$(() => {
  return (
    <main class="pt-24">
      {/* Hero */}
      <section class="bg-navy-900 relative overflow-hidden py-24">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-violet-400 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/40 rounded-full px-4 py-2 mb-8">
              <span class="text-2xl">♾️</span>
              <span class="text-violet-200 text-sm font-body font-medium">Salud concierge · Acompañamiento integral</span>
            </div>
            <h1 class="font-display text-h1 text-white mb-5">
              Mijal Salud <span class="text-violet-300">360</span>
            </h1>
            <p class="text-white/75 font-body text-body-lg mb-8 max-w-xl">
              Un médico de cabecera asignado a vos y tu familia. Seguimiento continuo, 
              coordinación con especialistas y atención domiciliaria cuando la necesitás.
            </p>
            <a href="#registro" class="inline-flex bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200">
              Conocer planes
            </a>
          </div>
        </div>
      </section>

      {/* Diferenciador */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-14">
            <h2 class="font-display text-h2 text-navy-900 mb-4">
              No es un seguro. No es una prepaga. Es <span class="text-violet-600">tu médico</span>.
            </h2>
            <p class="text-gris-600 font-body text-body-lg max-w-2xl mx-auto">
              Mijal Salud 360 es un plan de acompañamiento personalizado que va mucho más allá de las emergencias.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: "👨‍⚕️",
                title: "Tu médico personal",
                desc: "Un médico de cabecera asignado que conoce tu historial completo y el de tu familia. Disponible por WhatsApp.",
                color: "border-violet-200 bg-violet-50",
              },
              {
                emoji: "🔄",
                title: "Seguimiento continuo",
                desc: "Controles regulares, recordatorios de medicación y seguimiento post-internación o post-operatorio.",
                color: "border-navy-200 bg-navy-50",
              },
              {
                emoji: "🤝",
                title: "Coordinación total",
                desc: "Tu médico coordina con especialistas, laboratorios y obras sociales. Vos solo tenés que ir a la consulta.",
                color: "border-verde-200 bg-verde-50",
              },
            ].map((f) => (
              <div key={f.title} class={["rounded-2xl border-2 p-8 text-center", f.color]}>
                <div class="text-4xl mb-5">{f.emoji}</div>
                <h3 class="font-display font-bold text-navy-900 text-lg mb-3">{f.title}</h3>
                <p class="text-gris-600 font-body text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 class="font-display text-h2 text-navy-900 mb-8">Todo lo que incluye</h2>
              <ul class="space-y-5">
                {[
                  { emoji: "👨‍⚕️", title: "Médico de cabecera asignado", desc: "Con acceso directo por WhatsApp en horario ampliado." },
                  { emoji: "🏠", title: "Visitas domiciliarias programadas", desc: "Controles regulares en tu hogar según el plan elegido." },
                  { emoji: "🦿", title: "Kinesiología y rehabilitación", desc: "Sesiones domiciliarias de kinesio, fonoaudiología y TO." },
                  { emoji: "📋", title: "Seguimiento post-internación", desc: "Acompañamiento activo en los días más críticos de la recuperación." },
                  { emoji: "🔬", title: "Laboratorio a domicilio", desc: "Extracción de sangre en tu hogar, resultados en tu historial." },
                  { emoji: "🏥", title: "Coordinación con especialistas", desc: "Tu médico gestiona turnos, derivaciones y autorizaciones de obra social." },
                ].map((f) => (
                  <li key={f.title} class="flex gap-4">
                    <div class="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-xl shrink-0">{f.emoji}</div>
                    <div>
                      <p class="font-display font-semibold text-navy-900 mb-0.5">{f.title}</p>
                      <p class="text-gris-600 font-body text-sm">{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div class="bg-navy-900 rounded-3xl p-8 text-white sticky top-28">
              <h3 class="font-display font-bold text-xl mb-2">¿Para quién es ideal?</h3>
              <p class="text-white/60 font-body text-sm mb-6">Salud 360 está pensado para quienes valoran el acompañamiento continuo.</p>
              <div class="space-y-3">
                {[
                  { emoji: "👴👵", label: "Adultos mayores independientes", desc: "Con o sin patología crónica" },
                  { emoji: "👶", label: "Familias con bebés", desc: "Seguimiento pediátrico domiciliario" },
                  { emoji: "🏋️", label: "Post-cirugía y recuperación", desc: "Los primeros 90 días son clave" },
                  { emoji: "💊", label: "Pacientes crónicos", desc: "Diabéticos, hipertensos, oncológicos" },
                ].map((p) => (
                  <div key={p.label} class="bg-white/5 rounded-xl p-4 flex gap-3">
                    <span class="text-xl shrink-0">{p.emoji}</span>
                    <div>
                      <p class="font-display font-semibold text-sm text-white">{p.label}</p>
                      <p class="text-white/50 text-xs font-body">{p.desc}</p>
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
            <h2 class="font-display text-h2 text-navy-900 mb-3">Conocé los planes disponibles</h2>
            <p class="text-gris-600 font-body">Contanos tu situación y te asesoramos sin compromiso.</p>
          </div>
          <div class="bg-gris-50 rounded-2xl p-8 border border-gris-100">
            <LeadForm servicioDefault="salud-360" />
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Mijal Salud 360 — Tu Médico de Cabecera a Domicilio",
  meta: [{ name: "description", content: "Plan de salud concierge con médico de cabecera asignado, kinesiología, seguimiento post-internación y coordinación con especialistas." }],
};

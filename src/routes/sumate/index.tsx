import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { StaffForm } from "~/components/forms/StaffForm";

const beneficios = [
  {
    emoji: "🏥",
    titulo: "Trabajo con propósito",
    desc: "Ayudamos a pacientes reales en situaciones críticas. Cada turno tiene impacto.",
  },
  {
    emoji: "📅",
    titulo: "Flexibilidad horaria",
    desc: "Distintos turnos disponibles, adaptados a tus posibilidades.",
  },
  {
    emoji: "📈",
    titulo: "Crecimiento profesional",
    desc: "Capacitaciones constantes, protocolos actualizados y posibilidad de crecer dentro del equipo.",
  },
  {
    emoji: "🤝",
    titulo: "Equipo comprometido",
    desc: "Más de 20 años de trayectoria con un equipo humano excepcional.",
  },
];

const puestos = [
  "Médicos/as de guardia",
  "Enfermeros/as",
  "Paramédicos",
  "Kinesiólogos/as",
  "Conductores de ambulancia",
  "Personal administrativo",
];

export default component$(() => {
  return (
    <main class="pt-24">
      {/* Hero */}
      <section class="bg-navy-900 relative overflow-hidden py-20">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-verde-500 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 text-center">
          <div class="inline-flex items-center gap-2 bg-verde-500/20 border border-verde-500/40 rounded-full px-4 py-2 mb-6">
            <span class="text-verde-300 text-sm font-body font-medium">
              👩‍⚕️ Buscamos profesionales de la salud
            </span>
          </div>
          <h1 class="font-display text-h1 text-white mb-4">
            Sumate al equipo <span class="text-verde-400">Mijal Salud</span>
          </h1>
          <p class="text-white/70 font-body text-body-lg max-w-2xl mx-auto">
            Trabajá con más de 20 años de experiencia en el sector. Hacé la
            diferencia todos los días en la vida de nuestros pacientes.
          </p>
        </div>
      </section>

      {/* Beneficios */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <h2 class="font-display text-h2 text-navy-900 text-center mb-12">
            ¿Por qué trabajar{" "}
            <span class="text-verde-500">con nosotros?</span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {beneficios.map((b) => (
              <div
                key={b.titulo}
                class="bg-white rounded-2xl p-6 border border-gris-100 shadow-card flex gap-4"
              >
                <div class="text-3xl shrink-0">{b.emoji}</div>
                <div>
                  <h3 class="font-display font-bold text-navy-900 text-lg mb-1">
                    {b.titulo}
                  </h3>
                  <p class="text-gris-600 font-body text-sm leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Puestos activos */}
          <div class="bg-navy-900 rounded-3xl p-8 mb-16">
            <h2 class="font-display font-bold text-white text-xl mb-6 text-center">
              Puestos disponibles actualmente
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {puestos.map((p) => (
                <div
                  key={p}
                  class="flex items-center gap-2.5 bg-white/10 border border-white/10 rounded-xl px-4 py-3"
                >
                  <div class="w-1.5 h-1.5 bg-verde-400 rounded-full shrink-0" />
                  <span class="text-white font-body text-sm">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario */}
          <div class="bg-white rounded-2xl p-8 shadow-card border border-gris-100 max-w-2xl mx-auto">
            <h2 class="font-display font-bold text-navy-900 text-2xl mb-2">
              Mandanos tus datos
            </h2>
            <p class="text-gris-500 font-body text-sm mb-8">
              Completá el formulario y nos comunicaremos a la brevedad para
              coordinar una entrevista.
            </p>
            <StaffForm />
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Sumate al Equipo — Mijal Salud",
  meta: [
    {
      name: "description",
      content:
        "Buscamos médicos, enfermeros, paramédicos y personal administrativo. Trabajá con más de 20 años de experiencia en salud domiciliaria.",
    },
  ],
};

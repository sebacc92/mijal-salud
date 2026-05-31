import { component$, useSignal, useComputed$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LeadForm } from "~/components/forms/LeadForm";
import { WHATSAPP_EMPRESAS } from "~/lib/constants";
import { formatARS } from "~/lib/utils";

const serviciosB2B = [
  {
    emoji: "🛡️",
    nombre: "Área Protegida",
    desc: "Cobertura médica permanente para eventos, plantas industriales y espacios de trabajo.",
    beneficio: "Cumplimiento legal ART incluido",
  },
  {
    emoji: "🛡️",
    nombre: "Prevención Activa",
    desc: "Programa de medicina preventiva con check-ups, vacunación y dashboard de salud para RRHH.",
    beneficio: "Reducción de ausentismo comprobada",
  },
  {
    emoji: "📲",
    nombre: "Salud Directa para Equipos",
    desc: "Telemedicina 24/7 para todos tus empleados. Consultas médicas sin salir del trabajo.",
    beneficio: "Sin lista de espera",
  },
];

export default component$(() => {
  const empleados = useSignal(50);
  const ausentismoDias = useSignal(8);
  const salarioDiario = useSignal(5000);

  const costoAusentismo = useComputed$(
    () => empleados.value * ausentismoDias.value * salarioDiario.value,
  );
  const reduccionEstimada = useComputed$(
    () => Math.round(costoAusentismo.value * 0.35),
  );
  const inversionMensual = useComputed$(
    () => Math.round(empleados.value * 2500),
  );
  const roi = useComputed$(() => {
    const inversion = inversionMensual.value * 12;
    if (inversion === 0) return 0;
    return Math.round((reduccionEstimada.value / inversion) * 100);
  });

  return (
    <main class="pt-24">
      {/* Hero B2B */}
      <section class="bg-navy-900 relative overflow-hidden py-24">
        <div class="absolute inset-0 bg-gradient-hero opacity-85" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-verde-500 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 text-center">
          <div class="inline-flex items-center gap-2 bg-verde-500/20 border border-verde-500/40 rounded-full px-4 py-2 mb-8">
            <span class="w-2 h-2 bg-verde-400 rounded-full animate-pulse" />
            <span class="text-verde-300 text-sm font-body font-medium">
              Soluciones para empresas
            </span>
          </div>
          <h1 class="font-display text-h1 text-white mb-5 max-w-3xl mx-auto">
            Protegé la salud de tu equipo.{" "}
            <span class="text-verde-400">Medí el ROI.</span>
          </h1>
          <p class="text-white/70 font-body text-body-lg mb-10 max-w-2xl mx-auto">
            Área Protegida, Prevención Activa y Telemedicina corporativa: tres
            soluciones pensadas para empresas que toman la salud laboral en serio.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#calculadora"
              class="bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200"
            >
              Calculá tu ROI
            </a>
            <a
              href={WHATSAPP_EMPRESAS}
              target="_blank"
              rel="noopener noreferrer"
              class="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-display font-semibold px-8 py-4 rounded-2xl transition-all duration-200"
            >
              Hablar con un asesor
            </a>
          </div>
        </div>
      </section>

      {/* Servicios B2B */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">
              Servicios para <span class="text-verde-500">empresas</span>
            </h2>
            <p class="text-gris-600 font-body text-body-lg max-w-xl mx-auto">
              Soluciones integrales que se adaptan a tu industria, tamaño y
              necesidades.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {serviciosB2B.map((s) => (
              <div
                key={s.nombre}
                class="bg-white rounded-2xl p-7 border border-gris-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div class="text-4xl mb-4">{s.emoji}</div>
                <h3 class="font-display font-bold text-navy-900 text-lg mb-2">
                  {s.nombre}
                </h3>
                <p class="text-gris-600 font-body text-sm mb-4 leading-relaxed">
                  {s.desc}
                </p>
                <div class="inline-flex items-center gap-2 bg-verde-50 text-verde-700 text-xs font-body font-medium px-3 py-1.5 rounded-full">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  {s.beneficio}
                </div>
              </div>
            ))}
          </div>

          {/* Confianza */}
          <div class="bg-navy-900 rounded-2xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { n: "200+", l: "Empresas activas" },
              { n: "35%", l: "Reducción ausentismo" },
              { n: "4hs", l: "Implementación" },
              { n: "24/7", l: "Soporte dedicado" },
            ].map((s) => (
              <div key={s.n}>
                <div class="font-display font-black text-verde-400 text-3xl mb-1">
                  {s.n}
                </div>
                <div class="text-white/60 font-body text-sm">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculadora de ROI */}
      <section id="calculadora" class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">
              Calculá el impacto en tu empresa
            </h2>
            <p class="text-gris-600 font-body text-body-lg">
              Estimación basada en datos de reducción de ausentismo documentados
              en clientes actuales.
            </p>
          </div>

          <div class="bg-gris-50 rounded-3xl p-8 lg:p-12 border border-gris-200">
            {/* Sliders */}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div>
                <label class="font-display font-semibold text-navy-900 block mb-3 text-sm">
                  Cantidad de empleados
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  id="roi-empleados"
                  value={empleados.value}
                  onInput$={(e) =>
                    (empleados.value = +(e.target as HTMLInputElement).value)
                  }
                  class="w-full h-2 appearance-none rounded-full bg-gris-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-verde-500 [&::-webkit-slider-thumb]:cursor-pointer accent-verde-500"
                />
                <div class="text-center font-display font-black text-4xl text-navy-900 mt-3">
                  {empleados.value}
                </div>
              </div>

              <div>
                <label class="font-display font-semibold text-navy-900 block mb-3 text-sm">
                  Días ausentismo / empleado / año
                </label>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  id="roi-ausentismo"
                  value={ausentismoDias.value}
                  onInput$={(e) =>
                    (ausentismoDias.value = +(e.target as HTMLInputElement).value)
                  }
                  class="w-full accent-verde-500"
                />
                <div class="text-center font-display font-black text-4xl text-navy-900 mt-3">
                  {ausentismoDias.value} días
                </div>
              </div>

              <div>
                <label class="font-display font-semibold text-navy-900 block mb-3 text-sm">
                  Costo diario por empleado (ARS)
                </label>
                <input
                  type="range"
                  min="2000"
                  max="25000"
                  step="500"
                  id="roi-salario"
                  value={salarioDiario.value}
                  onInput$={(e) =>
                    (salarioDiario.value = +(e.target as HTMLInputElement).value)
                  }
                  class="w-full accent-verde-500"
                />
                <div class="text-center font-display font-black text-4xl text-navy-900 mt-3">
                  ${formatARS(salarioDiario.value)}
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-white rounded-2xl p-6 text-center border border-gris-200 shadow-sm">
                <div class="text-gris-500 text-sm font-body mb-2">
                  Costo actual del ausentismo
                </div>
                <div class="font-display font-black text-2xl text-navy-900">
                  ${formatARS(costoAusentismo.value)}
                  <span class="text-sm text-gris-400 font-normal"> /año</span>
                </div>
              </div>

              <div class="bg-verde-50 rounded-2xl p-6 text-center border border-verde-200 shadow-sm">
                <div class="text-verde-700 text-sm font-body mb-2">
                  Ahorro estimado con Mijal
                </div>
                <div class="font-display font-black text-2xl text-verde-600">
                  ${formatARS(reduccionEstimada.value)}
                  <span class="text-sm text-verde-500 font-normal"> /año</span>
                </div>
              </div>

              <div class="bg-navy-900 rounded-2xl p-6 text-center shadow-sm">
                <div class="text-white/60 text-sm font-body mb-2">
                  ROI estimado del programa
                </div>
                <div class="font-display font-black text-3xl text-verde-400">
                  {roi.value}%
                </div>
              </div>
            </div>

            <p class="text-gris-400 text-xs font-body text-center mt-5">
              * Estimación basada en reducción media del 35% en ausentismo
              documentada en clientes piloto. Resultados individuales pueden
              variar.
            </p>

            <div class="text-center mt-6">
              <a
                href={WHATSAPP_EMPRESAS}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200"
              >
                Quiero una propuesta a medida
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de contacto B2B */}
      <section id="contacto" class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-2xl">
          <div class="text-center mb-10">
            <h2 class="font-display text-h2 text-navy-900 mb-3">
              Hablemos de tu empresa
            </h2>
            <p class="text-gris-600 font-body">
              Completá el formulario y un asesor especializado te contactará en
              menos de 24 horas.
            </p>
          </div>
          <div class="bg-white rounded-2xl p-8 shadow-card border border-gris-100">
            <LeadForm servicioDefault="prevencion-activa" />
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Empresas — Mijal Salud | Salud Laboral y Prevención",
  meta: [
    {
      name: "description",
      content:
        "Área Protegida, Cobertura de Eventos y Prevención Activa para empresas. Reducí el ausentismo y demostrá ROI en salud laboral.",
    },
  ],
};

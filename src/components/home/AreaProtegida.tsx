import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { WHATSAPP_EMPRESAS } from "~/lib/constants";

export const AreaProtegida = component$(() => {
  return (
    <section class="py-section bg-navy-900 relative overflow-hidden">
      {/* Decoración */}
      <div class="absolute inset-0 bg-gradient-hero opacity-80" />
      <div class="absolute top-0 right-0 w-96 h-96 bg-verde-500 rounded-full opacity-10 blur-3xl" />
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-navy-400 rounded-full opacity-20 blur-2xl" />

      <div class="relative container mx-auto px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenido */}
          <div>
            <div class="inline-flex items-center gap-2 bg-verde-500/20 border border-verde-500/40 rounded-full px-4 py-2 mb-6">
              <span class="text-verde-300 text-sm font-body font-medium">
                🛡️ Servicio estrella para empresas
              </span>
            </div>

            <h2 class="font-display text-h2 text-white mb-4">
              Área Protegida:{" "}
              <span class="text-verde-400">cobertura médica</span> para tus
              eventos
            </h2>

            <p class="text-white/70 font-body text-body-lg mb-8 leading-relaxed">
              Cubrimos médicamente cualquier evento o espacio: congresos,
              festivales, obras en construcción, estadios, plantas industriales y
              más. Personal médico calificado y unidades equipadas, siempre en
              tu lugar.
            </p>

            <ul class="space-y-4 mb-10">
              {[
                "Médico y enfermero presenciales durante el evento",
                "Unidad móvil de emergencias disponible",
                "Protocolo de evacuación y enlace con hospitales",
                "Informes médicos post-evento",
                "Cobertura para 10 a 50.000+ personas",
              ].map((item, i) => (
                <li key={i} class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-verde-500/20 border border-verde-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      class="w-3.5 h-3.5 text-verde-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span class="text-white/80 font-body">{item}</span>
                </li>
              ))}
            </ul>

            <div class="flex flex-col sm:flex-row gap-4">
              <a
                href={WHATSAPP_EMPRESAS}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-2 bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-7 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200"
              >
                Pedir cotización
              </a>
              <Link
                href="/servicios/area-protegida"
                class="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white font-display font-semibold px-7 py-4 rounded-2xl transition-all duration-200"
              >
                Más información
              </Link>
            </div>
          </div>

          {/* Tarjetas de casos de uso */}
          <div class="grid grid-cols-2 gap-4">
            {[
              { emoji: "🏟️", title: "Estadios y eventos deportivos" },
              { emoji: "🎪", title: "Festivales y conciertos" },
              { emoji: "🏢", title: "Congresos y convenciones" },
              { emoji: "🏗️", title: "Obras y plantas industriales" },
              { emoji: "🎓", title: "Instituciones educativas" },
              { emoji: "🏖️", title: "Resorts y clubes" },
            ].map((item, i) => (
              <div
                key={i}
                class="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
              >
                <div class="text-3xl mb-3">{item.emoji}</div>
                <p class="text-white/80 font-body text-sm font-medium">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

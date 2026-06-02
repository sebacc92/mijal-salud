import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

interface ServiceCard {
  id: string;
  emoji: string;
  nombre: string;
  tagline: string;
  descripcion: string;
  publicoObjetivo: string;
  funcionalidades: string[];
  colorScheme: {
    border: string;
    iconBg: string;
    badge: string;
    tagline: string;
    checkmark: string;
    audience: string;
    cta: string;
  };
  href: string;
  badge?: string;
}

const servicios: ServiceCard[] = [
  {
    id: "salud-directa",
    emoji: "📲",
    nombre: "Mijal Salud Directa",
    tagline: "Tu médico, a un click de distancia",
    descripcion:
      "Plataforma de telemedicina 24/7. Iniciá una consulta desde WhatsApp en menos de 10 minutos. Triaje por IA, videoconsulta y despacho a domicilio si es necesario.",
    publicoObjetivo: "Particulares · Familias · Obras sociales",
    funcionalidades: [
      "Triaje automatizado por IA en WhatsApp",
      "Videoconsulta con médico en <10 minutos",
      "Recetas y órdenes médicas digitales",
      "Historial de consultas accesible 24/7",
    ],
    colorScheme: {
      border: "border-verde-200/80 hover:border-verde-300 hover:shadow-[0_20px_50px_rgba(0,166,81,0.06)]",
      iconBg: "bg-verde-50 border border-verde-100/50 text-verde-600",
      badge: "bg-verde-50 text-verde-700 border border-verde-100/30",
      tagline: "text-verde-600",
      checkmark: "text-verde-500",
      audience: "bg-verde-50/60 text-gris-700",
      cta: "group-hover:text-verde-600",
    },
    href: "/soluciones/salud-directa",
    badge: "Lanzamiento próximo",
  },
  {
    id: "care-ia",
    emoji: "🤖",
    nombre: "Mijal Care IA",
    tagline: "Salud predictiva con inteligencia artificial",
    descripcion:
      "Asistente inteligente para adultos mayores y pacientes crónicos. Detecta patrones de deterioro, emite alertas tempranas y conecta automáticamente con la central.",
    publicoObjetivo: "Adultos mayores · Pacientes crónicos · Familiares",
    funcionalidades: [
      "Asistente IA conversacional 24/7",
      "Alertas de deterioro en tiempo real",
      "Integración con wearables and dispositivos",
      "Reportes mensuales para familia o médico",
    ],
    colorScheme: {
      border: "border-navy-200/80 hover:border-navy-300 hover:shadow-[0_20px_50px_rgba(15,41,107,0.06)]",
      iconBg: "bg-navy-50 border border-navy-100/50 text-navy-700",
      badge: "bg-navy-50 text-navy-700 border border-navy-100/30",
      tagline: "text-navy-600",
      checkmark: "text-navy-500",
      audience: "bg-navy-50/60 text-gris-700",
      cta: "group-hover:text-navy-700",
    },
    href: "/soluciones/care-ia",
  },
  {
    id: "prevencion-activa",
    emoji: "🛡️",
    nombre: "Mijal Prevención Activa",
    tagline: "No esperes la emergencia, prevenila",
    descripcion:
      "Programa de medicina preventiva para empresas y pymes. Check-ups domiciliarios, análisis de laboratorio, vacunación y dashboard de salud corporativa para RR.HH.",
    publicoObjetivo: "Empresas · Pymes · ARTs · Aseguradoras",
    funcionalidades: [
      "Visitas médicas preventivas en empresa",
      "Dashboard de salud corporativa para RRHH",
      "Reducción de ausentismo con KPIs medibles",
      "Informe trimestral de riesgo por empleado",
    ],
    colorScheme: {
      border: "border-orange-200/80 hover:border-orange-300 hover:shadow-[0_20px_50px_rgba(249,115,22,0.08)]",
      iconBg: "bg-orange-50 border border-orange-100/50 text-orange-600",
      badge: "bg-orange-50 text-orange-700 border border-orange-100/30",
      tagline: "text-orange-600",
      checkmark: "text-orange-500",
      audience: "bg-orange-50/60 text-gris-700",
      cta: "group-hover:text-orange-600",
    },
    href: "/soluciones/prevencion-activa",
    badge: "Alta demanda B2B",
  },
  {
    id: "salud-360",
    emoji: "♾️",
    nombre: "Mijal Salud 360",
    tagline: "Acompañamiento integral, no solo emergencias",
    descripcion:
      "Plan de salud domiciliario premium tipo concierge. Médico de cabecera asignado, seguimiento post-internación, kinesiología y coordinación con especialistas.",
    publicoObjetivo: "Familias · Adultos mayores · Post-internados",
    funcionalidades: [
      "Médico de cabecera personal asignado",
      "Seguimiento activo post-internación",
      "Kinesiología y rehabilitación domiciliaria",
      "Coordinación con especialistas externos",
    ],
    colorScheme: {
      border: "border-violet-200/80 hover:border-violet-300 hover:shadow-[0_20px_50px_rgba(139,92,246,0.08)]",
      iconBg: "bg-violet-50 border border-violet-100/50 text-violet-600",
      badge: "bg-violet-50 text-violet-700 border border-violet-100/30",
      tagline: "text-violet-600",
      checkmark: "text-violet-500",
      audience: "bg-violet-50/60 text-gris-700",
      cta: "group-hover:text-violet-600",
    },
    href: "/soluciones/salud-360",
  },
  {
    id: "conecta-salud",
    emoji: "🌐",
    nombre: "Mijal Conecta Salud",
    tagline: "La plataforma que unifica todo el ecosistema",
    descripcion:
      "Portal digital unificado para pacientes, empresas y partners. Autogestión de consultas, historial médico, facturación digital y API para obras sociales.",
    publicoObjetivo: "Pacientes · Empresas · Obras sociales · Médicos",
    funcionalidades: [
      "Portal de autogestión web y app móvil",
      "API para integración con obras sociales",
      "Geolocalización de unidades móviles en vivo",
      "Facturación y autorizaciones digitales",
    ],
    colorScheme: {
      border: "border-slate-200/80 hover:border-slate-300 hover:shadow-[0_20px_50px_rgba(71,85,105,0.08)]",
      iconBg: "bg-slate-50 border border-slate-100/50 text-slate-600",
      badge: "bg-slate-50 text-slate-700 border border-slate-100/30",
      tagline: "text-slate-600",
      checkmark: "text-slate-500",
      audience: "bg-slate-50/60 text-gris-700",
      cta: "group-hover:text-slate-600",
    },
    href: "/soluciones/conecta-salud",
    badge: "En desarrollo",
  },
];

const delays = [
  "delay-[0ms]",
  "delay-[100ms]",
  "delay-[200ms]",
  "delay-[150ms]",
  "delay-[250ms]",
];

export interface NewServicesProps {
  settings?: { id: string; activo: boolean }[];
}

export const NewServices = component$<NewServicesProps>(({ settings }) => {
  const isVisible = useSignal(false);
  const containerRef = useSignal<Element>();

  useVisibleTask$(({ cleanup }) => {
    if (!containerRef.value) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.value);
    cleanup(() => observer.disconnect());
  });

  const activeServicios = servicios.filter(
    (s) => !settings || settings.find((set) => set.id === s.id)?.activo !== false
  );

  if (activeServicios.length === 0) {
    return null;
  }

  return (
    <section ref={containerRef} class="py-section bg-gradient-section overflow-hidden">
      <div class="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          class={[
            "text-center mb-16 transition-all duration-1000 transform",
            isVisible.value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          ]}
        >
          <div class="inline-flex items-center gap-2 bg-verde-50/80 text-verde-700 border border-verde-100/50 rounded-full px-4.5 py-2 mb-5 text-sm font-body font-semibold">
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Nuevas soluciones 2026
          </div>
          <h2 class="font-display text-h2 text-navy-900 mb-4 tracking-tight">
            La salud domiciliariaa{" "}
            <span class="text-verde-600 relative inline-block">
              del futuro,
              <span class="absolute bottom-1 left-0 w-full h-1.5 bg-verde-100/60 -z-10 rounded-full" />
            </span>{" "}
            hoy
          </h2>
          <p class="text-gris-600 text-body-lg font-body max-w-2xl mx-auto leading-relaxed">
            Más allá de las emergencias: un ecosistema completo de servicios
            innovadores para particulares, familias y empresas.
          </p>
        </div>

        {/* Grid de cards */}
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeServicios.map((servicio, index) => {
            const c = servicio.colorScheme;
            const delayClass = delays[index] || "delay-[0ms]";
            return (
              <Link
                key={servicio.id}
                href={servicio.href}
                class={[
                  "group relative flex flex-col p-8 rounded-3xl border bg-white",
                  c.border,
                  "shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:-translate-y-1.5",
                  "transition-all duration-500 transform",
                  isVisible.value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
                  delayClass,
                ]}
              >
                {/* Badge */}
                {servicio.badge && (
                  <span
                    class={[
                      "absolute top-6 right-6 text-xs font-body font-semibold px-3 py-1.5 rounded-full shadow-sm",
                      c.badge,
                    ]}
                  >
                    {servicio.badge}
                  </span>
                )}

                {/* Emoji / Ícono */}
                <div
                  class={[
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-all duration-300",
                    c.iconBg,
                  ]}
                >
                  <span class="transform group-hover:scale-110 transition-transform duration-300">
                    {servicio.emoji}
                  </span>
                </div>

                {/* Nombre */}
                <h3 class="font-display font-bold text-navy-900 text-xl mb-1 group-hover:text-navy-950 transition-colors">
                  {servicio.nombre}
                </h3>

                {/* Tagline */}
                <p class={["font-body text-sm mb-4 italic font-medium", c.tagline]}>
                  {servicio.tagline}
                </p>

                {/* Descripción */}
                <p class="text-gris-600 font-body text-[14.5px] leading-relaxed mb-6 flex-grow">
                  {servicio.descripcion}
                </p>

                {/* Funcionalidades */}
                <ul class="space-y-2.5 mb-6 border-t border-gris-100 pt-5">
                  {servicio.funcionalidades.map((f, j) => (
                    <li
                      key={j}
                      class="flex items-start gap-2.5 text-gris-700 text-[13.5px] font-body font-medium"
                    >
                      <svg
                        class={["w-4 h-4 shrink-0 mt-0.5 transition-transform group-hover:scale-110", c.checkmark]}
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
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Público objetivo */}
                <div
                  class={[
                    "text-xs font-body font-medium px-4 py-3 rounded-xl mb-6 border border-gris-100/50",
                    c.audience,
                  ]}
                >
                  👥 <span class="ml-1">{servicio.publicoObjetivo}</span>
                </div>

                {/* CTA */}
                <div
                  class={[
                    "flex items-center gap-2 text-navy-700 font-display font-semibold text-sm transition-colors",
                    c.cta || "group-hover:text-verde-600",
                  ]}
                >
                  Conocer más
                  <svg
                    class="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA general */}
        <div
          class={[
            "text-center mt-12 transition-all duration-1000 delay-[400ms] transform",
            isVisible.value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ]}
        >
          <Link
            href="/soluciones"
            class="inline-flex items-center gap-2 text-navy-700 hover:text-verde-600 font-display font-semibold transition-colors"
          >
            Ver todas las soluciones
            <svg
              class="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
});

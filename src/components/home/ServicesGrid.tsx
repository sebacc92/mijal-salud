import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

interface Service {
  id: string;
  nombre: string;
  descripcion: string;
  href: string;
  color: string;
  iconPath: string;
}

const services: Service[] = [
  {
    id: "emergencias",
    nombre: "Emergencias",
    descripcion:
      "Respuesta inmediata ante riesgo de vida. Médico y enfermero en tu domicilio en minutos.",
    href: "/servicios/emergencias",
    color: "red",
    iconPath:
      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  },
  {
    id: "urgencias",
    nombre: "Urgencias",
    descripcion:
      "Atención domiciliaria para situaciones que no pueden esperar pero no son de vida o muerte.",
    href: "/servicios/urgencias",
    color: "orange",
    iconPath:
      "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    id: "traslados",
    nombre: "Traslados Sanitarios",
    descripcion:
      "Traslados programados y de urgencia con unidades equipadas y personal médico calificado.",
    href: "/servicios/traslados",
    color: "blue",
    iconPath:
      "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
  },
  {
    id: "internacion",
    nombre: "Internación Domiciliaria",
    descripcion:
      "Seguimiento médico y de enfermería en tu hogar. Recuperate con tu familia y en tu ambiente.",
    href: "/servicios/internacion",
    color: "navy",
    iconPath:
      "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    id: "visitas",
    nombre: "Visitas Médicas",
    descripcion:
      "Consultas programadas a domicilio para diagnóstico, seguimiento, recetas y certificados.",
    href: "/servicios/visitas",
    color: "verde",
    iconPath:
      "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    id: "area-protegida",
    nombre: "Área Protegida",
    descripcion:
      "Cobertura médica para eventos: congresos, fiestas, obras en construcción, estadios y más.",
    href: "/servicios/area-protegida",
    color: "violet",
    iconPath:
      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
];

const colorConfig: Record<
  string,
  { icon: string; hover: string; accent: string }
> = {
  red: {
    icon: "bg-red-50 text-red-600 border border-red-100/50",
    hover: "hover:border-red-200 hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)]",
    accent: "group-hover:text-red-600",
  },
  orange: {
    icon: "bg-orange-50 text-orange-600 border border-orange-100/50",
    hover: "hover:border-orange-200 hover:shadow-[0_20px_50px_rgba(249,115,22,0.08)]",
    accent: "group-hover:text-orange-600",
  },
  blue: {
    icon: "bg-blue-50 text-blue-600 border border-blue-100/50",
    hover: "hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(59,130,246,0.08)]",
    accent: "group-hover:text-blue-600",
  },
  navy: {
    icon: "bg-navy-50 text-navy-700 border border-navy-100/50",
    hover: "hover:border-navy-200 hover:shadow-[0_20px_50px_rgba(15,41,107,0.06)]",
    accent: "group-hover:text-navy-700",
  },
  verde: {
    icon: "bg-verde-50 text-verde-600 border border-verde-100/50",
    hover: "hover:border-verde-200 hover:shadow-[0_20px_50px_rgba(0,166,81,0.06)]",
    accent: "group-hover:text-verde-600",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600 border border-violet-100/50",
    hover: "hover:border-violet-200 hover:shadow-[0_20px_50px_rgba(139,92,246,0.08)]",
    accent: "group-hover:text-violet-600",
  },
};

const delays = [
  "delay-[0ms]",
  "delay-[100ms]",
  "delay-[200ms]",
  "delay-[150ms]",
  "delay-[250ms]",
  "delay-[350ms]",
];

export const ServicesGrid = component$(() => {
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

  return (
    <section ref={containerRef} class="py-section bg-white overflow-hidden">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Nuestros servicios
          </div>
          <h2 class="font-display text-h2 text-navy-900 mb-4 tracking-tight">
            Atención médica completa,{" "}
            <span class="text-verde-600 relative inline-block">
              en tu domicilio
              <span class="absolute bottom-1 left-0 w-full h-1.5 bg-verde-100/60 -z-10 rounded-full" />
            </span>
          </h2>
          <p class="text-gris-600 text-body-lg font-body max-w-2xl mx-auto leading-relaxed">
            Desde emergencias hasta internación domiciliaria: cubrimos todas tus
            necesidades médicas con el más alto nivel de calidad.
          </p>
        </div>

        {/* Grid de servicios */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const colors = colorConfig[service.color];
            const delayClass = delays[index];
            return (
              <Link
                key={service.id}
                href={service.href}
                class={[
                  "group flex flex-col p-8 rounded-3xl border border-gris-200/80 bg-white",
                  "shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:-translate-y-1.5",
                  "transition-all duration-500 transform",
                  isVisible.value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
                  delayClass,
                  colors.hover,
                ]}
              >
                {/* Ícono */}
                <div
                  class={[
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300",
                    colors.icon,
                  ]}
                >
                  <svg
                    class="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d={service.iconPath}
                    />
                  </svg>
                </div>

                {/* Contenido */}
                <h3 class="font-display font-bold text-navy-900 text-lg mb-2 group-hover:text-navy-950 transition-colors">
                  {service.nombre}
                </h3>
                <p class="text-gris-600 font-body text-[14.5px] leading-relaxed flex-grow mb-6">
                  {service.descripcion}
                </p>

                {/* CTA */}
                <div
                  class={[
                    "flex items-center gap-2 text-navy-700 font-display font-semibold text-sm transition-colors",
                    colors.accent,
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

        {/* CTA ver todos */}
        <div
          class={[
            "text-center mt-12 transition-all duration-1000 delay-[400ms] transform",
            isVisible.value ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          ]}
        >
          <Link
            href="/servicios"
            class="inline-flex items-center gap-2 bg-navy-900 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Ver todos los servicios
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
});

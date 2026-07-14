import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";

const servicios = [
  {
    id: "emergencias",
    emoji: "🚨",
    nombre: "Emergencias Médicas",
    tagline: "Respuesta inmediata, las 24 horas",
    descripcion:
      "Ante una emergencia médica, el tiempo es crítico. Nuestra central operativa despacha una unidad médica equipada con médico y enfermero en minutos. Cubrimos paro cardiorrespiratorio, accidentes cerebrovasculares, politraumatismos, dificultad respiratoria grave y toda situación de riesgo de vida.",
    incluye: [
      "Médico y enfermero en el lugar",
      "Desfibrilador, oxígeno y medicación de emergencia",
      "Coordinación con hospitales y guardias",
      "Traslado incluido si es necesario",
    ],
    href: "/servicios/emergencias",
    color: { bg: "bg-red-50", border: "border-red-100", icon: "text-red-600", badge: "bg-red-100 text-red-700" },
  },
  {
    id: "urgencias",
    emoji: "⚕️",
    nombre: "Urgencias Médicas",
    tagline: "Cuando no puede esperar, pero tampoco es una emergencia",
    descripcion:
      "Fiebre alta, dolor intenso, cuadros respiratorios, infecciones, alergias o cualquier situación que requiera atención médica inmediata pero no implique riesgo de vida. Un médico en tu domicilio en el menor tiempo posible.",
    incluye: [
      "Médico clínico o especialista según el caso",
      "Diagnóstico y tratamiento in situ",
      "Recetas y órdenes médicas digitales",
      "Derivación y coordinación si es necesario",
    ],
    href: "/servicios/urgencias",
    color: { bg: "bg-orange-50", border: "border-orange-100", icon: "text-orange-600", badge: "bg-orange-100 text-orange-700" },
  },
  {
    id: "traslados",
    emoji: "🚑",
    nombre: "Traslados Sanitarios",
    tagline: "Traslados seguros con asistencia médica",
    descripcion:
      "Trasladamos pacientes entre domicilios, clínicas, hospitales y consultorios de forma segura y confortable. Contamos con ambulancias de alta complejidad y transporte sanitario liviano según el requerimiento.",
    incluye: [
      "Ambulancias de alta y mediana complejidad",
      "Personal médico y paramédico capacitado",
      "Traslados programados y de urgencia",
      "Coordinación con el centro receptor",
    ],
    href: "/servicios/traslados",
    color: { bg: "bg-blue-50", border: "border-blue-100", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
  },
  {
    id: "internacion",
    emoji: "🏠",
    nombre: "Internación Domiciliaria",
    tagline: "La clínica, en la comodidad de tu hogar",
    descripcion:
      "Programa de internación domiciliaria con seguimiento médico y de enfermería 24 horas. Ideal para post-operatorios, enfermedades crónicas, adultos mayores y cualquier paciente que se beneficie de recuperarse en su entorno familiar.",
    incluye: [
      "Médico de cabecera y equipo de enfermería",
      "Visitas médicas diarias o según requerimiento",
      "Medicación, insumos y equipamiento domiciliario",
      "Coordinación con especialistas y obra social",
    ],
    href: "/servicios/internacion",
    color: { bg: "bg-navy-50", border: "border-navy-100", icon: "text-navy-700", badge: "bg-navy-100 text-navy-700" },
  },
  {
    id: "visitas",
    emoji: "👨‍⚕️",
    nombre: "Visitas Médicas Programadas",
    tagline: "Tu médico en casa, cuando lo necesitás",
    descripcion:
      "Consultas médicas domiciliarias programadas para controles, seguimiento de enfermedades crónicas, pediatría, geriatría y más. Sin esperas, sin desplazamientos, con la comodidad del hogar.",
    incluye: [
      "Clínicos, pediatras, geriatras y especialistas",
      "Turno en menos de 2 horas en zonas céntricas",
      "Recetas, certificados y órdenes de laboratorio",
      "Historial de consultas centralizado",
    ],
    href: "/servicios/visitas",
    color: { bg: "bg-verde-50", border: "border-verde-100", icon: "text-verde-700", badge: "bg-verde-100 text-verde-700" },
  },
  {
    id: "area-protegida",
    emoji: "🛡️",
    nombre: "Área Protegida",
    tagline: "Cobertura médica para eventos y espacios",
    descripcion:
      "Servicio de cobertura médica para eventos masivos, congresos, fiestas corporativas, obras en construcción, plantas industriales, estadios y cualquier espacio que requiera presencia médica permanente.",
    incluye: [
      "Médico y enfermero durante todo el evento",
      "Unidad móvil de emergencias disponible",
      "Protocolo de actuación y evacuación",
      "Cobertura para 10 a 50.000+ asistentes",
    ],
    href: "/servicios/area-protegida",
    color: { bg: "bg-violet-50", border: "border-violet-100", icon: "text-violet-700", badge: "bg-violet-100 text-violet-700" },
  },
];

export default component$(() => {
  return (
    <main class="pt-24">
      {/* Hero */}
      <section class="bg-navy-900 relative overflow-hidden py-20">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-verde-500 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 text-center">
          <h1 class="font-display text-h1 text-white mb-4">
            Nuestros <span class="text-verde-400">Servicios</span>
          </h1>
          <p class="text-white/70 font-body text-body-lg max-w-2xl mx-auto">
            Atención médica domiciliaria integral en Buenos Aires y AMBA. Más de{" "}
            {new Date().getFullYear() - 2005} años de trayectoria con el más alto nivel profesional.
          </p>
        </div>
      </section>

      {/* Servicios */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="space-y-8">
            {servicios.map((s) => (
              <div
                key={s.id}
                class={[
                  "bg-white rounded-3xl border-2 p-8 shadow-card hover:shadow-card-hover transition-all duration-300",
                  s.color.border,
                ]}
              >
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Izquierda */}
                  <div>
                    <div class={["w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4", s.color.bg]}>
                      {s.emoji}
                    </div>
                    <h2 class="font-display font-bold text-navy-900 text-xl mb-1">
                      {s.nombre}
                    </h2>
                    <p class={["font-body text-sm italic mb-4", s.color.icon]}>
                      {s.tagline}
                    </p>
                    <Link
                      href={s.href}
                      class={[
                        "inline-flex items-center gap-2 font-display font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors",
                        s.color.badge,
                      ]}
                    >
                      Más información →
                    </Link>
                  </div>

                  {/* Centro: descripción */}
                  <div>
                    <p class="text-gris-600 font-body text-sm leading-relaxed">
                      {s.descripcion}
                    </p>
                  </div>

                  {/* Derecha: incluye */}
                  <div>
                    <p class="font-display font-semibold text-navy-900 text-sm mb-3 uppercase tracking-wide">
                      Incluye
                    </p>
                    <ul class="space-y-2.5">
                      {s.incluye.map((item, j) => (
                        <li key={j} class="flex items-start gap-2.5 text-gris-700 text-sm font-body">
                          <svg class={["w-4 h-4 shrink-0 mt-0.5", s.color.icon]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Servicios — Mijal Salud | Atención Médica Domiciliaria",
  meta: [
    {
      name: "description",
      content:
        "Emergencias, urgencias, traslados sanitarios, internación domiciliaria, visitas médicas programadas y Área Protegida en Buenos Aires y AMBA.",
    },
  ],
};

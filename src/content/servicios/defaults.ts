// ─────────────────────────────────────────────────────────────────────────────
// Contenido POR DEFECTO de /servicios y subpáginas.
//
// Es una copia EXACTA del contenido que estaba hardcodeado en cada página.
// Sirve como semilla inicial de la base y como fallback estático (si la base no
// responde, el sitio renderiza esto en vez de una página rota). Ver loader.ts.
//
// ⚠️ Estos objetos NO deben editarse para cambiar el sitio en producción: los
// cambios se hacen desde el panel admin. Editar acá sólo cambia el fallback.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  TiemposContent,
  ServiciosIndexContent,
  EmergenciasContent,
  UrgenciasContent,
  VisitasContent,
  TrasladosContent,
  InternacionContent,
  AreaProtegidaContent,
  PageContentMap,
} from "./types";

const tiemposCodigos = [
  { emoji: "🔴", codigo: "Código Rojo", tiempo: "hasta 15 minutos" },
  { emoji: "🟡", codigo: "Código Amarillo", tiempo: "entre 30 y 45 minutos" },
  { emoji: "🟢", codigo: "Código Verde", tiempo: "hasta 2 horas" },
];

const tiemposNota =
  "* Tiempos estimados, pueden variar según tráfico y condiciones climáticas.";

function tiempos(titulo: string): TiemposContent {
  return { titulo, codigos: tiemposCodigos.map((c) => ({ ...c })), nota: tiemposNota };
}

// ─── /servicios (índice) ──────────────────────────────────────────────────────
const servicios: ServiciosIndexContent = {
  heroTitle: "Nuestros",
  heroTitleHighlight: "Servicios",
  heroSubtitle:
    "Atención médica domiciliaria integral en Buenos Aires y AMBA. Más de {{anios}} años de trayectoria con el más alto nivel profesional.",
  cards: [
    {
      id: "emergencias",
      emoji: "🚨",
      nombre: "Emergencias Médicas",
      tagline: "Respuesta inmediata, las 24 horas",
      descripcion:
        "Ante una emergencia médica, el tiempo es crítico. Nuestra central operativa despacha una unidad médica equipada con médico y enfermero en minutos. Cubrimos paro cardiorrespiratorio, accidentes cerebrovasculares, politraumatismos, dificultad respiratoria grave y toda situación de riesgo de vida.",
      incluye: [],
      href: "/servicios/emergencias",
      colorKey: "red",
    },
    {
      id: "urgencias",
      emoji: "⚕️",
      nombre: "Urgencias Médicas",
      tagline: "Cuando no puede esperar, pero tampoco es una emergencia",
      descripcion:
        "Fiebre alta, dolor intenso, cuadros respiratorios, infecciones, alergias o cualquier situación que requiera atención médica inmediata pero no implique riesgo de vida. Un médico en tu domicilio en el menor tiempo posible.",
      incluye: [],
      href: "/servicios/urgencias",
      colorKey: "amber",
    },
    {
      id: "visitas",
      emoji: "👨‍⚕️",
      nombre: "Visitas Médicas",
      tagline: "Tu médico en casa, orientado a Código Verde",
      descripcion:
        "Atención médica a domicilio sin turno previo, derivada desde la Central de Operaciones. Para controles, seguimiento de enfermedades crónicas, pediatría, geriatría y más. No corresponde a una urgencia ni a una emergencia médica.",
      incluye: [],
      href: "/servicios/visitas",
      colorKey: "verde",
    },
    {
      id: "traslados",
      emoji: "🚑",
      nombre: "Traslados Sanitarios",
      tagline: "Traslados seguros con asistencia médica",
      descripcion:
        "Trasladamos pacientes entre domicilios, clínicas, hospitales y consultorios de forma segura y confortable. Contamos con ambulancias de alta complejidad y transporte sanitario liviano según el requerimiento.",
      incluye: [],
      href: "/servicios/traslados",
      colorKey: "blue",
    },
    {
      id: "internacion",
      emoji: "🏠",
      nombre: "Internación Domiciliaria",
      tagline: "La clínica, en la comodidad de tu hogar",
      descripcion:
        "Programa de internación domiciliaria con seguimiento médico y de enfermería 24 horas. Ideal para post-operatorios, enfermedades crónicas, adultos mayores y cualquier paciente que se beneficie de recuperarse en su entorno familiar.",
      incluye: [],
      href: "/servicios/internacion",
      colorKey: "navy",
    },
    {
      id: "area-protegida",
      emoji: "🛡️",
      nombre: "Área Protegida",
      tagline: "Cobertura médica para eventos y espacios",
      descripcion:
        "Servicio de cobertura médica para eventos masivos, congresos, fiestas corporativas, obras en construcción, plantas industriales, estadios y cualquier espacio que requiera presencia médica permanente.",
      incluye: [],
      href: "/servicios/area-protegida",
      colorKey: "violet",
    },
  ],
  seo: {
    title: "Servicios — Mijal Salud | Atención Médica Domiciliaria",
    description:
      "Emergencias, urgencias, traslados sanitarios, internación domiciliaria, visitas médicas y Área Protegida en Buenos Aires y AMBA.",
  },
};

// ─── /servicios/emergencias ─────────────────────────────────────────────────
const emergencias: EmergenciasContent = {
  heroBadge: "Disponible 24 horas · 365 días del año",
  heroTitle: "Emergencias",
  heroTitleHighlight: "Médicas",
  heroSubtitle:
    "Emergencia médica. Staff profesional altamente capacitado. Coordinación permanente con hospitales y guardias ante eventuales derivaciones. Médicos en cabina de apoyo las 24 horas. Despacho inmediato de unidades médicas con personal especializado.",
  ctaWhatsappLabel: "WhatsApp Emergencias",
  cuandoTitle: "¿Cuándo es una emergencia?",
  cuandoSubtitle:
    "Llamanos de inmediato si alguien presenta alguno de estos síntomas.",
  cuandoItems: [
    { emoji: "❤️", label: "Dolor en el pecho o presión" },
    { emoji: "🧠", label: "ACV: cara caída, brazo débil, habla entrecortada" },
    { emoji: "😮‍💨", label: "Dificultad respiratoria severa" },
    { emoji: "😵", label: "Pérdida de conciencia" },
    { emoji: "🤕", label: "Traumatismo de cráneo o columna" },
    { emoji: "🩸", label: "Hemorragia activa incontrolable" },
    { emoji: "💊", label: "Intoxicación o sobredosis" },
    { emoji: "⚡", label: "Convulsiones o paro epiléptico" },
    { emoji: "🤰", label: "Complicaciones en el parto" },
  ],
  traemosTitle: "Qué traemos a tu domicilio",
  traemosItems: [
    "Médico especializado y enfermero calificado",
    "Medicación de emergencias completa",
    "Oxígeno, cánulas y equipos de vía aérea avanzada",
    "Electrocardiograma portátil",
    "Equipamiento de última tecnología",
    "Coordinación con guardias hospitalarias",
  ],
  tiempos: tiempos("Tiempos de respuesta"),
  ctaFinalTitle: "¿Estás frente a una emergencia ahora?",
  ctaFinalSubtitle: "No esperes. Llamanos ahora.",
  seo: {
    title: "Emergencias Médicas 24/7 — Mijal Salud | AMBA",
    description:
      "Emergencias médicas domiciliarias en Buenos Aires y AMBA. Médico en tu domicilio en minutos. Atención las 24 horas.",
  },
};

// ─── /servicios/urgencias ────────────────────────────────────────────────────
const urgencias: UrgenciasContent = {
  heroBadge: "Disponible 24 horas · 365 días del año",
  heroTitle: "Urgencias",
  heroTitleHighlight: "Médicas",
  heroSubtitle:
    "Cuando no puede esperar, pero tampoco es riesgo de vida inmediato. Un médico en tu domicilio en el menor tiempo posible.",
  ctaWhatsappLabel: "Solicitar por WhatsApp",
  cuandoTitle: "¿Cuándo pedir una urgencia?",
  cuandoItems: [
    { emoji: "🌡️", label: "Fiebre alta (>39°C) en adultos o niños" },
    { emoji: "😣", label: "Dolor intenso sin causa conocida" },
    { emoji: "🫁", label: "Dificultad respiratoria moderada" },
    { emoji: "🤧", label: "Infección con rápido empeoramiento" },
    { emoji: "🦴", label: "Posible fractura o luxación" },
    { emoji: "💉", label: "Reacción alérgica sin compromiso vital" },
    { emoji: "🤢", label: "Vómitos o diarrea intensa con deshidratación" },
    { emoji: "👁️", label: "Problemas visuales o auditivos repentinos" },
    { emoji: "💊", label: "Necesidad urgente de medicación controlada" },
  ],
  avisoTitle: "¿No sabés si es emergencia o urgencia?",
  avisoText:
    "Llamanos de todas formas. Nuestro equipo de triaje te orientará y despachará el recurso adecuado.",
  tiemposTitle: "Tiempos de respuesta",
  tiemposSubtitle: "Priorizamos cada caso según su código de urgencia.",
  tiempos: tiempos("Según código de prioridad"),
  procesoTitle: "Cómo funciona",
  procesoSteps: [
    { emoji: "📞", title: "Contactás", desc: "Llamás o escribís por WhatsApp describiendo el cuadro." },
    { emoji: "🩺", title: "Triaje", desc: "Nuestro coordinador médico evalúa y prioriza tu caso." },
    { emoji: "🚑", title: "Despacho", desc: "Enviamos el médico adecuado para tu situación." },
    { emoji: "✅", title: "Atención", desc: "Diagnóstico, tratamiento y seguimiento en tu hogar." },
  ],
  seo: {
    title: "Urgencias Médicas a Domicilio 24/7 — Mijal Salud",
    description:
      "Atención médica urgente en tu domicilio en Buenos Aires y AMBA. Médico clínico disponible las 24 horas para cuadros que no pueden esperar.",
  },
};

// ─── /servicios/visitas ──────────────────────────────────────────────────────
const visitas: VisitasContent = {
  heroTitle: "Visitas Médicas",
  heroTitleHighlight: "a Domicilio",
  heroSubtitle:
    "Atención médica orientada a Código Verde, sin turno previo. Es un servicio derivado desde nuestra Central de Operaciones. No corresponde a una urgencia ni a una emergencia médica.",
  ctaLabel: "Solicitar una visita",
  especialidadesTitle: "Especialidades disponibles",
  especialidadesSubtitle:
    "Clínicos, pediatras, geriatras y especialistas que visitan tu hogar.",
  especialidades: [
    { emoji: "🩺", label: "Medicina clínica" },
    { emoji: "👶", label: "Pediatría" },
    { emoji: "👴", label: "Geriatría" },
    { emoji: "🧠", label: "Neurología" },
    { emoji: "❤️", label: "Cardiología" },
    { emoji: "🫁", label: "Neumonología" },
    { emoji: "🩹", label: "Curación de heridas" },
    { emoji: "💉", label: "Aplicación de inyecciones" },
    { emoji: "🔬", label: "Extracción de laboratorio" },
    { emoji: "📋", label: "Certificados médicos" },
    { emoji: "💊", label: "Recetas y órdenes" },
    { emoji: "📊", label: "Seguimiento crónico" },
  ],
  comoFuncionaTitle: "Cómo funciona",
  comoFuncionaSteps: [
    { emoji: "💬", desc: "Contactás a la Central de Operaciones" },
    { emoji: "🩺", desc: "Clasificamos el caso como Código Verde" },
    { emoji: "📍", desc: "Coordinamos la visita a tu domicilio" },
    { emoji: "🏠", desc: "El médico llega, sin turno previo" },
  ],
  tiemposTitle: "Tiempos de respuesta",
  tiemposSubtitle: "La visita médica se atiende como Código Verde.",
  tiempos: tiempos("Según código de prioridad"),
  seo: {
    title: "Visitas Médicas Domiciliarias — Mijal Salud | Buenos Aires",
    description:
      "Visitas médicas a domicilio en Buenos Aires. Atención de Código Verde sin turno previo, derivada desde la Central de Operaciones. Clínicos, pediatras, geriatras y especialistas.",
  },
};

// ─── /servicios/traslados ────────────────────────────────────────────────────
const traslados: TrasladosContent = {
  heroTitle: "Traslados",
  heroTitleHighlight: "Sanitarios",
  heroSubtitle:
    "Traslados seguros con asistencia médica. Para pacientes que necesitan moverse entre domicilios, clínicas o centros de salud con cuidado médico durante el trayecto.",
  ctaLabel: "Solicitar traslado",
  tiposTitle: "Tipos de traslado disponibles",
  tipos: [
    {
      icon: "🚑",
      title: "Alta complejidad",
      desc: "Con médico, enfermero y equipamiento completo. Para pacientes críticos o en terapia intensiva.",
      incluye: ["Monitor cardíaco", "Respirador portátil", "Medicación UCI", "Médico especialista"],
      colorKey: "red",
    },
    {
      icon: "🚐",
      title: "Mediana complejidad",
      desc: "Sin enfermero. Con acompañamiento médico.",
      incluye: ["Médico acompañante", "Oxígeno y saturometría", "Silla de ruedas", "Camilla articulada"],
      colorKey: "blue",
    },
    {
      icon: "🚗",
      title: "Baja complejidad",
      desc: "Para pacientes autónomos que necesitan asistencia básica durante el trayecto.",
      incluye: ["Acompañante capacitado", "Botiquín básico", "Comunicación con central", "Cobertura de ruta"],
      colorKey: "verde",
    },
  ],
  casosTitle: "¿Para qué usarlo?",
  casos: [
    { emoji: "🏥", label: "Alta hospitalaria" },
    { emoji: "🩺", label: "Turno con especialista" },
    { emoji: "🧪", label: "Laboratorio o diagnóstico" },
    { emoji: "🏊", label: "Rehabilitación" },
    { emoji: "✈️", label: "Traslado interurbano" },
    { emoji: "🏡", label: "Ingreso a geriátrico" },
  ],
  seo: {
    title: "Traslados Sanitarios — Mijal Salud | Buenos Aires y AMBA",
    description:
      "Traslados médicos seguros en Buenos Aires: alta, mediana y baja complejidad. Ambulancias equipadas con personal médico calificado.",
  },
};

// ─── /servicios/internacion ──────────────────────────────────────────────────
const internacion: InternacionContent = {
  heroTitle: "Internación",
  heroTitleHighlight: "Domiciliaria",
  heroSubtitle:
    "La calidad de una clínica, en la comodidad de tu hogar. Seguimiento médico y enfermería las 24 horas junto a tu familia.",
  ctaLabel: "Consultar disponibilidad",
  beneficiosTitle: "¿Por qué internarse en casa?",
  beneficiosSubtitle:
    "La evidencia clínica demuestra que los pacientes evolucionan mejor en su entorno familiar.",
  beneficios: [
    { emoji: "❤️", title: "Menor estrés", desc: "El ambiente familiar acelera la recuperación y mejora el bienestar." },
    { emoji: "🦠", title: "Menos infecciones", desc: "Sin exposición a gérmenes hospitalarios resistentes a antibióticos." },
    { emoji: "👨‍👩‍👧", title: "Acompañamiento", desc: "Tu familia puede estar presente sin horarios ni restricciones." },
    { emoji: "💰", title: "Menor costo", desc: "El costo promedio es significativamente menor a una internación clínica." },
  ],
  programaTitle: "Qué incluye el programa",
  programaItems: [
    "Médico de cabecera con visitas según evolución",
    "Enfermería domiciliaria (guardias de 12 o 24 horas)",
    "Medicación e insumos en el domicilio",
    "Equipamiento: bomba de infusión, oxígeno, nebulizador",
    "Análisis de laboratorio a domicilio",
    "Coordinación con hospital o clínica de referencia",
    "Servicio de emergencias on-call incluido",
  ],
  patologiasTitle: "Patologías frecuentes",
  patologias: [
    "Post-quirúrgicos",
    "EPOC",
    "Neumonía",
    "ICC descompensada",
    "Diabetes complicada",
    "Oncología paliativa",
    "ACV en rehabilitación",
    "Fractura de cadera",
    "Heridas crónicas",
    "Infecciones IV",
  ],
  seo: {
    title: "Internación Domiciliaria — Mijal Salud | Buenos Aires",
    description:
      "Programa de internación domiciliaria con médico de cabecera, enfermería 24hs, equipamiento y medicación. Recuperate en casa junto a tu familia.",
  },
};

// ─── /servicios/area-protegida ───────────────────────────────────────────────
const areaProtegida: AreaProtegidaContent = {
  heroBadge: "🛡️ Servicio para eventos y espacios",
  heroTitle: "Área",
  heroTitleHighlight: "Protegida",
  heroSubtitle:
    "Cobertura médica permanente para eventos, espacios de trabajo, establecimientos educativos y cualquier lugar que requiera presencia médica.",
  ctaCotizarLabel: "Pedir cotización",
  ctaVerCasosLabel: "Ver casos de uso",
  coberturaTitle: "Qué incluye la cobertura",
  coberturaItems: [
    "Médico y enfermero presenciales durante todo el evento",
    "Unidad móvil de emergencias en el lugar o en radio de cobertura",
    "Botiquín completo con DEA y medicación de urgencias",
    "Protocolo de evacuación médica acordado con el organizador",
    "Comunicación directa con hospitales de referencia de la zona",
    "Informe médico completo al finalizar el evento",
    "Certificación de cobertura para cumplimiento legal (ART, municipalidad)",
  ],
  dimensionesTitle: "Dimensionamos según tu evento",
  dimensiones: [
    { rango: "10 – 300 personas", equipo: "1 médico + 1 enfermero", colorKey: "verde" },
    { rango: "300 – 2.000 personas", equipo: "2 médicos + 2 enfermeros + ambulancia", colorKey: "orange" },
    { rango: "2.000 – 10.000 personas", equipo: "Equipo completo + UCM", colorKey: "red" },
    { rango: "+10.000 personas", equipo: "Operativo personalizado", colorKey: "violet" },
  ],
  casosTitle: "¿Dónde lo aplicamos?",
  casos: [
    { emoji: "🏟️", label: "Estadios y eventos deportivos" },
    { emoji: "🎪", label: "Festivales y conciertos" },
    { emoji: "🏢", label: "Congresos y convenciones" },
    { emoji: "🏗️", label: "Obras en construcción" },
    { emoji: "🏭", label: "Plantas industriales" },
    { emoji: "🎓", label: "Universidades e institutos" },
    { emoji: "🏖️", label: "Resorts y clubes" },
    { emoji: "🎉", label: "Eventos corporativos" },
  ],
  ctaCasosLabel: "Cotizar mi evento",
  planesEyebrow: "Planes Disponibles",
  planesTitle: "Planes de Cobertura Médica",
  planesSubtitle:
    "Contamos con esquemas de contratación flexibles adaptados a las necesidades reglamentarias y operativas de tu espacio.",
  planes: [
    {
      badge: "Temporal",
      title: "Eventos y Jornadas",
      desc: "Ideal para congresos, filmaciones, torneos deportivos o eventos puntuales.",
      items: [
        "Cobertura por día / jornada",
        "Ambulancia UCM en el lugar",
        "Médicos y paramédicos",
        "Desfibrilador DEA incluido",
        "Cumplimiento municipal/ART",
      ],
      ctaLabel: "Cotizar por Evento",
      recommended: false,
      recommendedLabel: "",
    },
    {
      badge: "Mensual",
      title: "Comercios y Pymes",
      desc: "Cobertura continua 24/7 para oficinas, locales y plantas pequeñas.",
      items: [
        "Facturación fija mensual",
        "Atención ante emergencias",
        "Protección para todo el personal",
        "Certificación ART vigente",
        "Soporte y asesoría legal",
      ],
      ctaLabel: "Contratar Plan Mensual",
      recommended: true,
      recommendedLabel: "Más Elegido",
    },
    {
      badge: "Gran Escala",
      title: "Grandes Industrias",
      desc: "Esquemas personalizados para campus educativos, fábricas y constructoras.",
      items: [
        "Operativos de salud a medida",
        "Puestos médicos fijos in-situ",
        "Ambulancias permanentes",
        "Auditorías de prevención",
        "Descuentos en telemedicina",
      ],
      ctaLabel: "Solicitar Reunión B2B",
      recommended: false,
      recommendedLabel: "",
    },
  ],
  zonaEyebrow: "Área de Acción",
  zonaTitle: "Zona de Cobertura e Infraestructura",
  zonaText:
    "Cubrimos Área Protegida y traslados en toda la Ciudad Autónoma de Buenos Aires (CABA) y el Gran Buenos Aires (GBA / AMBA), con unidades móviles distribuidas estratégicamente y derivación inmediata a los principales centros médicos de cada zona.",
  zonaPoints: [
    { emoji: "📍", title: "Punto Operativo Central", desc: "Buenos Aires, AMBA, Argentina" },
    { emoji: "⚡", title: "Despliegue Inmediato", desc: "Unidades médicas móviles distribuidas de forma estratégica." },
  ],
  seo: {
    title: "Área Protegida — Cobertura Médica para Eventos | Mijal Salud",
    description:
      "Cobertura médica para eventos, estadios, festivales y espacios de trabajo. Personal médico, ambulancias y protocolo de emergencias en tu evento.",
  },
};

/** Contenido por defecto de todas las páginas, indexado por pageId. */
export const DEFAULT_CONTENT: PageContentMap = {
  servicios,
  emergencias,
  urgencias,
  visitas,
  traslados,
  internacion,
  "area-protegida": areaProtegida,
};

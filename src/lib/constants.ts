// ─── Datos de contacto ────────────────────────────────────────────────────
export const TELEFONO_EMERGENCIAS = "+54 11 4788-6953/6954";
export const TELEFONO_NOTA = "Líneas rotativas";
export const TELEFONO_HREF = "tel:+5491132613981";
export const WHATSAPP_NUMERO = "5491132613981";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}`;
export const WHATSAPP_ATENCION = `${WHATSAPP_URL}?text=Hola!%20Necesito%20atenci%C3%B3n%20m%C3%A9dica`;
export const WHATSAPP_EMPRESAS = `${WHATSAPP_URL}?text=Hola!%20Me%20interesa%20conocer%20las%20soluciones%20para%20empresas`;
// WhatsApp de Atención 24/7 a Clientes (central de emergencias / convenios activos)
export const WHATSAPP_CLIENTES_NUMERO = "541135395037";
export const WHATSAPP_CLIENTES = `https://wa.me/${WHATSAPP_CLIENTES_NUMERO}`;
export const EMAIL_CONTACTO = "info@mijalsalud.com.ar";
export const EMAIL_HREF = `mailto:${EMAIL_CONTACTO}`;
export const DIRECCION = "Buenos Aires, AMBA, Argentina";

// ─── Redes sociales ───────────────────────────────────────────────────────
export const INSTAGRAM_URL = "https://www.instagram.com/mijalsalud/";
export const LINKEDIN_URL = "https://www.linkedin.com/company/mijalsalud/";
export const FACEBOOK_URL = "https://www.facebook.com/mijalsalud/";

// ─── Estadísticas ─────────────────────────────────────────────────────────
export const STATS = {
  anos: new Date().getFullYear() - 2005,
  atenciones: 28957,
  partners: 36,
  horasStr: "24/7",
};

// ─── Servicios clásicos ───────────────────────────────────────────────────
export const SERVICIOS_CLASICOS = [
  {
    id: "emergencias",
    nombre: "Emergencias",
    descripcion:
      "Respuesta inmediata ante situaciones de riesgo de vida. Médico y enfermero en tu domicilio en minutos.",
    href: "/servicios/emergencias",
    icon: "🚨",
    color: "red",
  },
  {
    id: "urgencias",
    nombre: "Urgencias",
    descripcion:
      "Atención médica domiciliaria para situaciones que no pueden esperar pero no son de vida o muerte.",
    href: "/servicios/urgencias",
    icon: "⚕️",
    color: "orange",
  },
  {
    id: "traslados",
    nombre: "Traslados",
    descripcion:
      "Traslados sanitarios programados y de urgencia con unidades equipadas y personal médico.",
    href: "/servicios/traslados",
    icon: "🚑",
    color: "blue",
  },
  {
    id: "internacion",
    nombre: "Internación Domiciliaria",
    descripcion:
      "Seguimiento médico y de enfermería 24hs en el hogar. Recuperate en tu ambiente, con tu familia.",
    href: "/servicios/internacion",
    icon: "🏠",
    color: "navy",
  },
  {
    id: "visitas",
    nombre: "Visitas Médicas",
    descripcion:
      "Consultas médicas programadas a domicilio para diagnóstico, seguimiento y recetas.",
    href: "/servicios/visitas",
    icon: "👨‍⚕️",
    color: "verde",
  },
  {
    id: "area-protegida",
    nombre: "Área Protegida",
    descripcion:
      "Cobertura médica de eventos y espacios: congresos, fiestas, obras, estadios y más.",
    href: "/servicios/area-protegida",
    icon: "🛡️",
    color: "violet",
  },
] as const;

// ─── Nuevos servicios 2026 ────────────────────────────────────────────────
export const NUEVOS_SERVICIOS = [
  {
    id: "salud-directa",
    nombre: "Mijal Salud Directa",
    tagline: "Tu médico, a un click de distancia",
    href: "/soluciones/salud-directa",
    badge: "Lanzamiento próximo",
  },
  {
    id: "care-ia",
    nombre: "Mijal Care IA",
    tagline: "Salud predictiva con inteligencia artificial",
    href: "/soluciones/care-ia",
  },
  {
    id: "prevencion-activa",
    nombre: "Mijal Prevención Activa",
    tagline: "No esperes la emergencia, prevenila",
    href: "/soluciones/prevencion-activa",
    badge: "Alta demanda B2B",
  },
  {
    id: "salud-360",
    nombre: "Mijal Salud 360",
    tagline: "Acompañamiento integral, no solo emergencias",
    href: "/soluciones/salud-360",
  },
  {
    id: "conecta-salud",
    nombre: "Mijal Conecta Salud",
    tagline: "La plataforma que unifica todo el ecosistema",
    href: "/soluciones/conecta-salud",
    badge: "En desarrollo",
  },
] as const;

// ─── SEO ──────────────────────────────────────────────────────────────────
export const SITE_NAME = "Mijal Salud";
export const SITE_URL = "https://mijalsalud.com.ar";
export const SITE_DESCRIPTION =
  `Más de ${new Date().getFullYear() - 2005} años brindando atención médica domiciliaria de excelencia: emergencias, urgencias, traslados e internación en Buenos Aires y AMBA.`;

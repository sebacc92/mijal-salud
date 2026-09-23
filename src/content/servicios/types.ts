// ─────────────────────────────────────────────────────────────────────────────
// Tipos del contenido editable de /servicios y sus subpáginas.
//
// Estos tipos describen EXACTAMENTE los textos que hoy estaban hardcodeados en
// cada página. Los valores por defecto (idénticos al contenido actual) viven en
// `defaults.ts` y sirven a la vez como:
//   1) Semilla de la base (contenido inicial).
//   2) Fallback estático si la base no responde (ver loader.ts).
//
// El texto de párrafos admite **negrita** (se renderiza con <strong>, sin HTML
// crudo) y saltos de línea. El token `{{anios}}` se reemplaza por los años de
// trayectoria calculados. Ver `RichText.tsx`.
// ─────────────────────────────────────────────────────────────────────────────

/** Claves de color permitidas para las cards (mapean a clases Tailwind fijas). */
export type ColorKey =
  | "red"
  | "amber"
  | "verde"
  | "blue"
  | "navy"
  | "violet"
  | "orange";

export interface SeoContent {
  title: string;
  description: string;
}

export interface EmojiItem {
  emoji: string;
  label: string;
}

export interface StepItem {
  emoji: string;
  title?: string;
  desc: string;
}

/** Códigos de prioridad del componente "Tiempos de respuesta". */
export interface CodigoTiempo {
  emoji: string;
  codigo: string;
  tiempo: string;
}

export interface TiemposContent {
  titulo: string;
  codigos: CodigoTiempo[];
  nota: string;
}

// ─── /servicios (índice) ──────────────────────────────────────────────────────
export interface ServicioCard {
  id: string;
  emoji: string;
  nombre: string;
  tagline: string;
  descripcion: string;
  incluye: string[];
  href: string;
  colorKey: ColorKey;
}

export interface ServiciosIndexContent {
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  cards: ServicioCard[];
  seo: SeoContent;
}

// ─── /servicios/emergencias ─────────────────────────────────────────────────
export interface EmergenciasContent {
  heroBadge: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  ctaWhatsappLabel: string;
  cuandoTitle: string;
  cuandoSubtitle: string;
  cuandoItems: EmojiItem[];
  traemosTitle: string;
  traemosItems: string[];
  tiempos: TiemposContent;
  ctaFinalTitle: string;
  ctaFinalSubtitle: string;
  seo: SeoContent;
}

// ─── /servicios/urgencias ────────────────────────────────────────────────────
export interface UrgenciasContent {
  heroBadge: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  ctaWhatsappLabel: string;
  cuandoTitle: string;
  cuandoItems: EmojiItem[];
  avisoTitle: string;
  avisoText: string;
  tiemposTitle: string;
  tiemposSubtitle: string;
  tiempos: TiemposContent;
  procesoTitle: string;
  procesoSteps: StepItem[];
  seo: SeoContent;
}

// ─── /servicios/visitas ──────────────────────────────────────────────────────
export interface VisitasContent {
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  ctaLabel: string;
  especialidadesTitle: string;
  especialidadesSubtitle: string;
  especialidades: EmojiItem[];
  comoFuncionaTitle: string;
  comoFuncionaSteps: StepItem[];
  tiemposTitle: string;
  tiemposSubtitle: string;
  tiempos: TiemposContent;
  seo: SeoContent;
}

// ─── /servicios/traslados ────────────────────────────────────────────────────
export interface TrasladoTipo {
  icon: string;
  title: string;
  desc: string;
  incluye: string[];
  colorKey: ColorKey;
}

export interface TrasladosContent {
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  ctaLabel: string;
  tiposTitle: string;
  tipos: TrasladoTipo[];
  casosTitle: string;
  casos: EmojiItem[];
  seo: SeoContent;
}

// ─── /servicios/internacion ──────────────────────────────────────────────────
export interface InternacionContent {
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  ctaLabel: string;
  beneficiosTitle: string;
  beneficiosSubtitle: string;
  beneficios: StepItem[];
  programaTitle: string;
  programaItems: string[];
  patologiasTitle: string;
  patologias: string[];
  seo: SeoContent;
}

// ─── /servicios/area-protegida ───────────────────────────────────────────────
export interface DimensionItem {
  rango: string;
  equipo: string;
  colorKey: ColorKey;
}

export interface PlanItem {
  badge: string;
  title: string;
  desc: string;
  items: string[];
  ctaLabel: string;
  recommended: boolean;
  recommendedLabel: string;
}

export interface ZonaPoint {
  emoji: string;
  title: string;
  desc: string;
}

export interface AreaProtegidaContent {
  heroBadge: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  ctaCotizarLabel: string;
  ctaVerCasosLabel: string;
  coberturaTitle: string;
  coberturaItems: string[];
  dimensionesTitle: string;
  dimensiones: DimensionItem[];
  casosTitle: string;
  casos: EmojiItem[];
  ctaCasosLabel: string;
  planesEyebrow: string;
  planesTitle: string;
  planesSubtitle: string;
  planes: PlanItem[];
  zonaEyebrow: string;
  zonaTitle: string;
  zonaText: string;
  zonaPoints: ZonaPoint[];
  seo: SeoContent;
}

/** Unión de todos los contenidos de página, indexados por su pageId. */
export interface PageContentMap {
  servicios: ServiciosIndexContent;
  emergencias: EmergenciasContent;
  urgencias: UrgenciasContent;
  visitas: VisitasContent;
  traslados: TrasladosContent;
  internacion: InternacionContent;
  "area-protegida": AreaProtegidaContent;
}

export type PageId = keyof PageContentMap;

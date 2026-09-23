// ─────────────────────────────────────────────────────────────────────────────
// Descriptores de formulario para el editor genérico del admin.
//
// Cada página declara los campos editables (con su `path` dentro del objeto de
// contenido). El componente <ContentEditor> recorre estos descriptores y
// renderiza el input adecuado, de modo que NO haya un formulario a mano por
// página. Reutilizable para futuras páginas: agregá su schema acá.
// ─────────────────────────────────────────────────────────────────────────────

import type { ColorKey, PageId } from "./types";

export interface SelectOption {
  value: string;
  label: string;
}

export type SubFieldKind = "text" | "textarea" | "select";

export interface SubField {
  key: string;
  label: string;
  kind: SubFieldKind;
  rows?: number;
  options?: SelectOption[];
}

export type Field =
  | { kind: "text"; path: string; label: string; help?: string }
  | { kind: "textarea"; path: string; label: string; help?: string; rows?: number }
  | { kind: "select"; path: string; label: string; help?: string; options: SelectOption[] }
  | { kind: "stringList"; path: string; label: string; itemLabel?: string; help?: string }
  | {
      kind: "objectList";
      path: string;
      label: string;
      itemLabel?: string;
      help?: string;
      fields: SubField[];
      template: Record<string, unknown>;
    };

export interface FormGroup {
  title: string;
  description?: string;
  fields: Field[];
}

export type PageForm = FormGroup[];

const COLOR_OPTIONS: SelectOption[] = [
  { value: "red", label: "Rojo" },
  { value: "amber", label: "Ámbar" },
  { value: "orange", label: "Naranja" },
  { value: "verde", label: "Verde" },
  { value: "blue", label: "Azul" },
  { value: "navy", label: "Azul marino" },
  { value: "violet", label: "Violeta" },
];

const seoGroup: FormGroup = {
  title: "SEO (buscadores)",
  description:
    "Título y descripción que ven Google y las redes al compartir la página.",
  fields: [
    { kind: "text", path: "seo.title", label: "Título SEO (pestaña del navegador)" },
    { kind: "textarea", path: "seo.description", label: "Meta descripción", rows: 2 },
  ],
};

const tiemposGroup = (path: string): FormGroup => ({
  title: "Tiempos de respuesta",
  description: "Códigos de prioridad y sus tiempos estimados.",
  fields: [
    { kind: "text", path: `${path}.titulo`, label: "Título del recuadro" },
    {
      kind: "objectList",
      path: `${path}.codigos`,
      label: "Códigos",
      itemLabel: "Código",
      fields: [
        { key: "emoji", label: "Emoji", kind: "text" },
        { key: "codigo", label: "Nombre del código", kind: "text" },
        { key: "tiempo", label: "Tiempo estimado", kind: "text" },
      ],
      template: { emoji: "🟢", codigo: "Código", tiempo: "" },
    },
    { kind: "textarea", path: `${path}.nota`, label: "Nota al pie", rows: 2 },
  ],
});

// ─── /servicios (índice) ──────────────────────────────────────────────────────
const servicios: PageForm = [
  {
    title: "Encabezado (hero)",
    fields: [
      { kind: "text", path: "heroTitle", label: "Título" },
      { kind: "text", path: "heroTitleHighlight", label: "Palabra destacada (en verde)" },
      {
        kind: "textarea",
        path: "heroSubtitle",
        label: "Subtítulo",
        rows: 3,
        help: "El token {{anios}} se reemplaza automáticamente por los años de trayectoria.",
      },
    ],
  },
  {
    title: "Tarjetas de servicios",
    description: "Cada tarjeta enlaza a la subpágina del servicio.",
    fields: [
      {
        kind: "objectList",
        path: "cards",
        label: "Servicios",
        itemLabel: "Servicio",
        fields: [
          { key: "emoji", label: "Ícono / Emoji", kind: "text" },
          { key: "nombre", label: "Nombre", kind: "text" },
          { key: "tagline", label: "Frase (tagline)", kind: "text" },
          { key: "descripcion", label: "Descripción", kind: "textarea", rows: 4 },
          { key: "href", label: "Link destino", kind: "text" },
          { key: "colorKey", label: "Color del tema", kind: "select", options: COLOR_OPTIONS },
        ],
        template: {
          id: "nuevo",
          emoji: "🩺",
          nombre: "Nuevo servicio",
          tagline: "",
          descripcion: "",
          incluye: [],
          href: "/servicios",
          colorKey: "verde" as ColorKey,
        },
      },
    ],
  },
  {
    title: 'Listas "Incluye" de cada tarjeta',
    description:
      "Editá los ítems que aparecen bajo cada servicio. El orden coincide con el de las tarjetas de arriba.",
    fields: [
      { kind: "stringList", path: "cards.0.incluye", label: "Incluye — Emergencias" },
      { kind: "stringList", path: "cards.1.incluye", label: "Incluye — Urgencias" },
      { kind: "stringList", path: "cards.2.incluye", label: "Incluye — Visitas" },
      { kind: "stringList", path: "cards.3.incluye", label: "Incluye — Traslados" },
      { kind: "stringList", path: "cards.4.incluye", label: "Incluye — Internación" },
      { kind: "stringList", path: "cards.5.incluye", label: "Incluye — Área Protegida" },
    ],
  },
  seoGroup,
];

// ─── /servicios/emergencias ─────────────────────────────────────────────────
const emergencias: PageForm = [
  {
    title: "Encabezado (hero)",
    fields: [
      { kind: "text", path: "heroBadge", label: "Insignia superior" },
      { kind: "text", path: "heroTitle", label: "Título" },
      { kind: "text", path: "heroTitleHighlight", label: "Palabra destacada" },
      { kind: "textarea", path: "heroSubtitle", label: "Subtítulo", rows: 4 },
      { kind: "text", path: "ctaWhatsappLabel", label: "Texto del botón de WhatsApp" },
    ],
  },
  {
    title: "¿Cuándo es una emergencia?",
    fields: [
      { kind: "text", path: "cuandoTitle", label: "Título de sección" },
      { kind: "textarea", path: "cuandoSubtitle", label: "Subtítulo", rows: 2 },
      {
        kind: "objectList",
        path: "cuandoItems",
        label: "Síntomas",
        itemLabel: "Síntoma",
        fields: [
          { key: "emoji", label: "Emoji", kind: "text" },
          { key: "label", label: "Texto", kind: "text" },
        ],
        template: { emoji: "❤️", label: "" },
      },
    ],
  },
  {
    title: "Qué traemos a tu domicilio",
    fields: [
      { kind: "text", path: "traemosTitle", label: "Título de sección" },
      { kind: "stringList", path: "traemosItems", label: "Ítems" },
    ],
  },
  tiemposGroup("tiempos"),
  {
    title: "Llamado a la acción final",
    fields: [
      { kind: "text", path: "ctaFinalTitle", label: "Título" },
      { kind: "text", path: "ctaFinalSubtitle", label: "Subtítulo" },
    ],
  },
  seoGroup,
];

// ─── /servicios/urgencias ────────────────────────────────────────────────────
const urgencias: PageForm = [
  {
    title: "Encabezado (hero)",
    fields: [
      { kind: "text", path: "heroBadge", label: "Insignia superior" },
      { kind: "text", path: "heroTitle", label: "Título" },
      { kind: "text", path: "heroTitleHighlight", label: "Palabra destacada" },
      { kind: "textarea", path: "heroSubtitle", label: "Subtítulo", rows: 3 },
      { kind: "text", path: "ctaWhatsappLabel", label: "Texto del botón de WhatsApp" },
    ],
  },
  {
    title: "¿Cuándo pedir una urgencia?",
    fields: [
      { kind: "text", path: "cuandoTitle", label: "Título de sección" },
      {
        kind: "objectList",
        path: "cuandoItems",
        label: "Situaciones",
        itemLabel: "Situación",
        fields: [
          { key: "emoji", label: "Emoji", kind: "text" },
          { key: "label", label: "Texto", kind: "text" },
        ],
        template: { emoji: "🌡️", label: "" },
      },
    ],
  },
  {
    title: "Aviso destacado",
    fields: [
      { kind: "text", path: "avisoTitle", label: "Título del aviso" },
      { kind: "textarea", path: "avisoText", label: "Texto del aviso", rows: 2 },
    ],
  },
  {
    title: "Sección de tiempos",
    fields: [
      { kind: "text", path: "tiemposTitle", label: "Título de sección" },
      { kind: "textarea", path: "tiemposSubtitle", label: "Subtítulo", rows: 2 },
    ],
  },
  tiemposGroup("tiempos"),
  {
    title: "Cómo funciona",
    fields: [
      { kind: "text", path: "procesoTitle", label: "Título de sección" },
      {
        kind: "objectList",
        path: "procesoSteps",
        label: "Pasos",
        itemLabel: "Paso",
        fields: [
          { key: "emoji", label: "Emoji", kind: "text" },
          { key: "title", label: "Título", kind: "text" },
          { key: "desc", label: "Descripción", kind: "textarea", rows: 2 },
        ],
        template: { emoji: "📞", title: "", desc: "" },
      },
    ],
  },
  seoGroup,
];

// ─── /servicios/visitas ──────────────────────────────────────────────────────
const visitas: PageForm = [
  {
    title: "Encabezado (hero)",
    fields: [
      { kind: "text", path: "heroTitle", label: "Título" },
      { kind: "text", path: "heroTitleHighlight", label: "Palabra destacada" },
      { kind: "textarea", path: "heroSubtitle", label: "Subtítulo", rows: 3 },
      { kind: "text", path: "ctaLabel", label: "Texto del botón" },
    ],
  },
  {
    title: "Especialidades disponibles",
    fields: [
      { kind: "text", path: "especialidadesTitle", label: "Título de sección" },
      { kind: "textarea", path: "especialidadesSubtitle", label: "Subtítulo", rows: 2 },
      {
        kind: "objectList",
        path: "especialidades",
        label: "Especialidades",
        itemLabel: "Especialidad",
        fields: [
          { key: "emoji", label: "Emoji", kind: "text" },
          { key: "label", label: "Texto", kind: "text" },
        ],
        template: { emoji: "🩺", label: "" },
      },
    ],
  },
  {
    title: "Cómo funciona",
    fields: [
      { kind: "text", path: "comoFuncionaTitle", label: "Título de sección" },
      {
        kind: "objectList",
        path: "comoFuncionaSteps",
        label: "Pasos",
        itemLabel: "Paso",
        fields: [
          { key: "emoji", label: "Emoji", kind: "text" },
          { key: "desc", label: "Descripción", kind: "textarea", rows: 2 },
        ],
        template: { emoji: "💬", desc: "" },
      },
    ],
  },
  {
    title: "Sección de tiempos",
    fields: [
      { kind: "text", path: "tiemposTitle", label: "Título de sección" },
      { kind: "textarea", path: "tiemposSubtitle", label: "Subtítulo", rows: 2 },
    ],
  },
  tiemposGroup("tiempos"),
  seoGroup,
];

// ─── /servicios/traslados ────────────────────────────────────────────────────
const traslados: PageForm = [
  {
    title: "Encabezado (hero)",
    fields: [
      { kind: "text", path: "heroTitle", label: "Título" },
      { kind: "text", path: "heroTitleHighlight", label: "Palabra destacada" },
      { kind: "textarea", path: "heroSubtitle", label: "Subtítulo", rows: 3 },
      { kind: "text", path: "ctaLabel", label: "Texto del botón" },
    ],
  },
  {
    title: "Tipos de traslado",
    fields: [
      { kind: "text", path: "tiposTitle", label: "Título de sección" },
      {
        kind: "objectList",
        path: "tipos",
        label: "Tipos",
        itemLabel: "Tipo de traslado",
        fields: [
          { key: "icon", label: "Ícono / Emoji", kind: "text" },
          { key: "title", label: "Título", kind: "text" },
          { key: "desc", label: "Descripción", kind: "textarea", rows: 3 },
          { key: "colorKey", label: "Color del tema", kind: "select", options: COLOR_OPTIONS },
        ],
        template: { icon: "🚑", title: "", desc: "", incluye: [], colorKey: "blue" as ColorKey },
      },
    ],
  },
  {
    title: 'Listas "Incluye" de cada tipo',
    description: "El orden coincide con el de los tipos de arriba.",
    fields: [
      { kind: "stringList", path: "tipos.0.incluye", label: "Incluye — 1er tipo" },
      { kind: "stringList", path: "tipos.1.incluye", label: "Incluye — 2do tipo" },
      { kind: "stringList", path: "tipos.2.incluye", label: "Incluye — 3er tipo" },
    ],
  },
  {
    title: "¿Para qué usarlo?",
    fields: [
      { kind: "text", path: "casosTitle", label: "Título de sección" },
      {
        kind: "objectList",
        path: "casos",
        label: "Casos de uso",
        itemLabel: "Caso",
        fields: [
          { key: "emoji", label: "Emoji", kind: "text" },
          { key: "label", label: "Texto", kind: "text" },
        ],
        template: { emoji: "🏥", label: "" },
      },
    ],
  },
  seoGroup,
];

// ─── /servicios/internacion ──────────────────────────────────────────────────
const internacion: PageForm = [
  {
    title: "Encabezado (hero)",
    fields: [
      { kind: "text", path: "heroTitle", label: "Título" },
      { kind: "text", path: "heroTitleHighlight", label: "Palabra destacada" },
      { kind: "textarea", path: "heroSubtitle", label: "Subtítulo", rows: 3 },
      { kind: "text", path: "ctaLabel", label: "Texto del botón" },
    ],
  },
  {
    title: "¿Por qué internarse en casa?",
    fields: [
      { kind: "text", path: "beneficiosTitle", label: "Título de sección" },
      { kind: "textarea", path: "beneficiosSubtitle", label: "Subtítulo", rows: 2 },
      {
        kind: "objectList",
        path: "beneficios",
        label: "Beneficios",
        itemLabel: "Beneficio",
        fields: [
          { key: "emoji", label: "Emoji", kind: "text" },
          { key: "title", label: "Título", kind: "text" },
          { key: "desc", label: "Descripción", kind: "textarea", rows: 2 },
        ],
        template: { emoji: "❤️", title: "", desc: "" },
      },
    ],
  },
  {
    title: "Qué incluye el programa",
    fields: [
      { kind: "text", path: "programaTitle", label: "Título de sección" },
      { kind: "stringList", path: "programaItems", label: "Ítems del programa" },
    ],
  },
  {
    title: "Patologías frecuentes",
    fields: [
      { kind: "text", path: "patologiasTitle", label: "Título" },
      { kind: "stringList", path: "patologias", label: "Patologías (etiquetas)" },
    ],
  },
  seoGroup,
];

// ─── /servicios/area-protegida ───────────────────────────────────────────────
const areaProtegida: PageForm = [
  {
    title: "Encabezado (hero)",
    fields: [
      { kind: "text", path: "heroBadge", label: "Insignia superior" },
      { kind: "text", path: "heroTitle", label: "Título" },
      { kind: "text", path: "heroTitleHighlight", label: "Palabra destacada" },
      { kind: "textarea", path: "heroSubtitle", label: "Subtítulo", rows: 3 },
      { kind: "text", path: "ctaCotizarLabel", label: "Botón principal" },
      { kind: "text", path: "ctaVerCasosLabel", label: "Botón secundario" },
    ],
  },
  {
    title: "Qué incluye la cobertura",
    fields: [
      { kind: "text", path: "coberturaTitle", label: "Título de sección" },
      { kind: "stringList", path: "coberturaItems", label: "Ítems" },
    ],
  },
  {
    title: "Dimensionamos según tu evento",
    fields: [
      { kind: "text", path: "dimensionesTitle", label: "Título" },
      {
        kind: "objectList",
        path: "dimensiones",
        label: "Rangos",
        itemLabel: "Rango",
        fields: [
          { key: "rango", label: "Cantidad de personas", kind: "text" },
          { key: "equipo", label: "Equipo asignado", kind: "text" },
          { key: "colorKey", label: "Color", kind: "select", options: COLOR_OPTIONS },
        ],
        template: { rango: "", equipo: "", colorKey: "verde" as ColorKey },
      },
    ],
  },
  {
    title: "¿Dónde lo aplicamos?",
    fields: [
      { kind: "text", path: "casosTitle", label: "Título de sección" },
      { kind: "text", path: "ctaCasosLabel", label: "Botón inferior" },
      {
        kind: "objectList",
        path: "casos",
        label: "Casos de uso",
        itemLabel: "Caso",
        fields: [
          { key: "emoji", label: "Emoji", kind: "text" },
          { key: "label", label: "Texto", kind: "text" },
        ],
        template: { emoji: "🏟️", label: "" },
      },
    ],
  },
  {
    title: "Planes de cobertura",
    fields: [
      { kind: "text", path: "planesEyebrow", label: "Etiqueta pequeña" },
      { kind: "text", path: "planesTitle", label: "Título de sección" },
      { kind: "textarea", path: "planesSubtitle", label: "Subtítulo", rows: 2 },
      {
        kind: "objectList",
        path: "planes",
        label: "Planes",
        itemLabel: "Plan",
        fields: [
          { key: "badge", label: "Etiqueta (badge)", kind: "text" },
          { key: "title", label: "Título del plan", kind: "text" },
          { key: "desc", label: "Descripción", kind: "textarea", rows: 2 },
          { key: "ctaLabel", label: "Texto del botón", kind: "text" },
          { key: "recommendedLabel", label: 'Cartel "recomendado" (vacío = ninguno)', kind: "text" },
        ],
        template: {
          badge: "",
          title: "",
          desc: "",
          items: [],
          ctaLabel: "Consultar",
          recommended: false,
          recommendedLabel: "",
        },
      },
    ],
  },
  {
    title: "Ítems de cada plan",
    description: "El orden coincide con el de los planes de arriba.",
    fields: [
      { kind: "stringList", path: "planes.0.items", label: "Ítems — 1er plan" },
      { kind: "stringList", path: "planes.1.items", label: "Ítems — 2do plan" },
      { kind: "stringList", path: "planes.2.items", label: "Ítems — 3er plan" },
    ],
  },
  {
    title: "Zona de cobertura",
    fields: [
      { kind: "text", path: "zonaEyebrow", label: "Etiqueta pequeña" },
      { kind: "text", path: "zonaTitle", label: "Título de sección" },
      { kind: "textarea", path: "zonaText", label: "Texto", rows: 4 },
      {
        kind: "objectList",
        path: "zonaPoints",
        label: "Puntos destacados",
        itemLabel: "Punto",
        fields: [
          { key: "emoji", label: "Emoji", kind: "text" },
          { key: "title", label: "Título", kind: "text" },
          { key: "desc", label: "Descripción", kind: "textarea", rows: 2 },
        ],
        template: { emoji: "📍", title: "", desc: "" },
      },
    ],
  },
  seoGroup,
];

export const FORM_SCHEMAS: Record<PageId, PageForm> = {
  servicios,
  emergencias,
  urgencias,
  visitas,
  traslados,
  internacion,
  "area-protegida": areaProtegida,
};

// ─────────────────────────────────────────────────────────────────────────────
// Registro de páginas editables + helpers de acceso por "path".
//
// Punto de entrada del modelo de contenido de /servicios. Reexporta tipos,
// defaults y schemas de formulario, y expone:
//   - PAGES: lista de páginas editables (para el admin y la navegación).
//   - getByPath / setByPath: acceso a valores anidados por string "a.b.0.c".
//
// La lectura desde la base (con fallback) vive en loader.ts (sólo servidor).
// ─────────────────────────────────────────────────────────────────────────────

import type { PageId } from "./types";

export * from "./types";
export { DEFAULT_CONTENT } from "./defaults";
export { FORM_SCHEMAS } from "./form-schema";
export type { PageForm, FormGroup, Field } from "./form-schema";

export interface PageMeta {
  /** id interno = parámetro de ruta del admin (sin "/"). */
  id: PageId;
  /** Nombre visible en el admin. */
  label: string;
  /** URL pública de la página. */
  url: string;
  emoji: string;
  descripcion: string;
}

/** Páginas editables, en el orden en que se muestran en el admin. */
export const PAGES: PageMeta[] = [
  {
    id: "servicios",
    label: "Servicios (general)",
    url: "/servicios",
    emoji: "🩺",
    descripcion: "Encabezado y las 6 tarjetas de la página principal de servicios.",
  },
  {
    id: "emergencias",
    label: "Emergencias",
    url: "/servicios/emergencias",
    emoji: "🚨",
    descripcion: "Subpágina de Emergencias Médicas.",
  },
  {
    id: "urgencias",
    label: "Urgencias",
    url: "/servicios/urgencias",
    emoji: "⚕️",
    descripcion: "Subpágina de Urgencias Médicas.",
  },
  {
    id: "visitas",
    label: "Visitas Médicas",
    url: "/servicios/visitas",
    emoji: "👨‍⚕️",
    descripcion: "Subpágina de Visitas Médicas a domicilio.",
  },
  {
    id: "traslados",
    label: "Traslados Sanitarios",
    url: "/servicios/traslados",
    emoji: "🚑",
    descripcion: "Subpágina de Traslados Sanitarios.",
  },
  {
    id: "internacion",
    label: "Internación Domiciliaria",
    url: "/servicios/internacion",
    emoji: "🏠",
    descripcion: "Subpágina de Internación Domiciliaria.",
  },
  {
    id: "area-protegida",
    label: "Área Protegida",
    url: "/servicios/area-protegida",
    emoji: "🛡️",
    descripcion: "Subpágina de Área Protegida (eventos y espacios).",
  },
];

const PAGE_IDS = new Set<string>(PAGES.map((p) => p.id));

export function isPageId(value: string | undefined): value is PageId {
  return !!value && PAGE_IDS.has(value);
}

export function getPageMeta(id: string): PageMeta | undefined {
  return PAGES.find((p) => p.id === id);
}

/** Lee un valor anidado por path tipo "cards.0.incluye". */
export function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null) return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

/** Escribe un valor anidado por path, creando objetos intermedios si faltan. */
export function setByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(".");
  let cursor: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (cursor[key] == null || typeof cursor[key] !== "object") {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
}

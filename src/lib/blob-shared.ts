// ─────────────────────────────────────────────────────────────────────────────
// Reglas de subida compartidas entre cliente y servidor.
//
// Este módulo no importa nada (ni @vercel/blob ni Qwik) a propósito: lo cargan
// tanto los componentes del navegador como el endpoint que firma los tokens y
// el script de migración. Así los límites viven en un solo lugar y no se
// desincronizan entre el mensaje de error del formulario y la validación real.
// ─────────────────────────────────────────────────────────────────────────────

export const MB = 1024 * 1024;

export const IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const VIDEO_CONTENT_TYPES = ["video/mp4", "video/webm"];

/**
 * Carpetas permitidas dentro del store, con su tipo y tamaño máximo.
 *
 * El endpoint de firma rechaza cualquier ruta que no empiece con una de estas
 * claves, así que un cliente no puede escribir en carpetas arbitrarias ni
 * saltarse el límite de tamaño (el token que emite Vercel Blob lleva el
 * `maximumSizeInBytes` adentro y lo hace cumplir el servicio, no el navegador).
 */
export const BLOB_PREFIXES = {
  galeria: {
    contentTypes: IMAGE_CONTENT_TYPES,
    maxBytes: 8 * MB,
    label: "La imagen",
  },
  "videos-verticales/video": {
    contentTypes: VIDEO_CONTENT_TYPES,
    maxBytes: 50 * MB,
    label: "El archivo de video",
  },
  "videos-verticales/thumbnail": {
    contentTypes: IMAGE_CONTENT_TYPES,
    maxBytes: 8 * MB,
    label: "La imagen de portada",
  },
  "politica-calidad": {
    contentTypes: ["application/pdf"],
    maxBytes: 10 * MB,
    label: "El PDF",
  },
  partners: {
    contentTypes: IMAGE_CONTENT_TYPES,
    maxBytes: 2 * MB,
    label: "El logo",
  },
  chatbot: {
    contentTypes: IMAGE_CONTENT_TYPES,
    maxBytes: 2 * MB,
    label: "El avatar",
  },
} as const satisfies Record<
  string,
  { contentTypes: readonly string[]; maxBytes: number; label: string }
>;

export type BlobPrefix = keyof typeof BLOB_PREFIXES;

/**
 * Resuelve la regla que corresponde a una ruta ya armada (`galeria/xxx.jpg`).
 * Toma la coincidencia más larga porque hay prefijos anidados
 * (`videos-verticales/video` vs `videos-verticales/thumbnail`).
 */
export function prefixRuleFor(pathname: string) {
  let best: { prefix: BlobPrefix; rule: (typeof BLOB_PREFIXES)[BlobPrefix] } | null = null;
  for (const key of Object.keys(BLOB_PREFIXES) as BlobPrefix[]) {
    if (!pathname.startsWith(`${key}/`)) continue;
    if (!best || key.length > best.prefix.length) {
      best = { prefix: key, rule: BLOB_PREFIXES[key] };
    }
  }
  return best;
}

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "application/pdf": "pdf",
};

export function extFor(contentType: string): string {
  return EXT_BY_MIME[contentType] || contentType.split("/")[1]?.split("+")[0] || "bin";
}

export function formatMb(bytes: number): string {
  return `${Math.round(bytes / MB)}MB`;
}

/** Valida tipo y tamaño en el cliente para dar un error inmediato y claro. */
export function validateFileForPrefix(
  prefix: BlobPrefix,
  file: { size: number; type: string },
): string | null {
  const rule = BLOB_PREFIXES[prefix];
  if (file.type && !(rule.contentTypes as readonly string[]).includes(file.type)) {
    return `${rule.label} tiene un formato no admitido (${file.type}). Se aceptan: ${rule.contentTypes.join(", ")}.`;
  }
  if (file.size > rule.maxBytes) {
    return `${rule.label} supera el límite de ${formatMb(rule.maxBytes)}.`;
  }
  return null;
}

/** `true` si la URL apunta al store de Vercel Blob (y por lo tanto se puede borrar). */
export function isBlobUrl(url: string | null | undefined): boolean {
  return !!url && url.includes(".blob.vercel-storage.com/");
}

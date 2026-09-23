// ─────────────────────────────────────────────────────────────────────────────
// Subida directa desde el navegador a Vercel Blob.
//
// El archivo va del navegador a Vercel Blob sin pasar por nuestro servidor: el
// endpoint /admin/api/blob-upload sólo firma un token de corta duración. Es lo
// que permite subir un video de decenas de MB, imposible cuando el archivo
// viajaba como Base64 dentro del body de un `server$` o un `routeAction$`.
// ─────────────────────────────────────────────────────────────────────────────

import { upload } from "@vercel/blob/client";
import {
  BLOB_PREFIXES,
  MB,
  extFor,
  validateFileForPrefix,
  type BlobPrefix,
} from "./blob-shared";

const HANDLE_UPLOAD_URL = "/admin/api/blob-upload";

/** A partir de este tamaño conviene multipart: sube en partes paralelas y reintenta las que fallan. */
const MULTIPART_THRESHOLD = 8 * MB;

export interface UploadProgress {
  percentage: number;
}

/**
 * Sube un archivo elegido por el usuario y devuelve su URL pública.
 *
 * Valida tipo y tamaño antes de pedir el token para dar un error inmediato;
 * la validación que realmente manda es la del token firmado en el servidor.
 */
export async function uploadFileToBlob(
  file: File,
  prefix: BlobPrefix,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> {
  const validationError = validateFileForPrefix(prefix, file);
  if (validationError) {
    throw new Error(validationError);
  }

  const contentType = file.type || BLOB_PREFIXES[prefix].contentTypes[0];
  const pathname = `${prefix}/${crypto.randomUUID()}.${extFor(contentType)}`;

  const { url } = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: HANDLE_UPLOAD_URL,
    contentType,
    multipart: file.size > MULTIPART_THRESHOLD,
    onUploadProgress: onProgress
      ? ({ percentage }) => onProgress({ percentage })
      : undefined,
  });

  return url;
}

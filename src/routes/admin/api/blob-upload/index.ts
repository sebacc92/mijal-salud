// ─────────────────────────────────────────────────────────────────────────────
// Emite los tokens de subida directa a Vercel Blob que usa el navegador.
//
// El navegador manda el archivo a Vercel Blob, no a nuestro servidor: eso evita
// el límite de tamaño del body de una función Edge (pocos MB), que es lo que
// rompía las subidas de video cuando el archivo viajaba como Base64.
//
// Seguridad: la ruta vive bajo /admin, así que el `onRequest` de
// src/routes/admin/layout.tsx ya exige sesión antes de llegar acá. Igual se
// revalida la cookie de forma explícita para que la protección no dependa de
// dónde esté ubicado el archivo, y `onBeforeGenerateToken` restringe carpeta,
// tipo de contenido y tamaño: el token que firma Vercel lleva esos límites
// adentro y los hace cumplir el servicio, no el cliente.
// ─────────────────────────────────────────────────────────────────────────────

import type { RequestHandler } from "@builder.io/qwik-city";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getBlobToken } from "~/lib/blob";
import { prefixRuleFor } from "~/lib/blob-shared";

export const onPost: RequestHandler = async ({ request, json, env, cookie }) => {
  const session = cookie.get("auth_session")?.value;
  if (!session || isNaN(Number(session))) {
    json(401, { error: "No autorizado." });
    return;
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    json(400, { error: "Body inválido." });
    return;
  }

  try {
    const result = await handleUpload({
      body,
      request,
      token: getBlobToken(env),
      onBeforeGenerateToken: async (pathname) => {
        const match = prefixRuleFor(pathname);
        if (!match) {
          throw new Error(`Ruta de subida no permitida: ${pathname}`);
        }
        return {
          allowedContentTypes: [...match.rule.contentTypes],
          maximumSizeInBytes: match.rule.maxBytes,
          // El cliente ya genera un UUID como nombre, no hace falta sufijo.
          addRandomSuffix: false,
        };
      },
    });

    json(200, result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error generando el token de subida.";
    console.error("Error en /admin/api/blob-upload:", error);
    json(400, { error: message });
  }
};

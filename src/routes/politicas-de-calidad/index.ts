import type { RequestHandler } from "@builder.io/qwik-city";
import { eq } from "drizzle-orm";
import { getDb, schema } from "~/db";

export const POLITICA_CALIDAD_KEY = "politica_calidad_pdf";

// Sirve el PDF de Políticas de la Calidad subido desde el panel de admin.
// Si todavía no se subió ninguno, redirige al archivo estático original.
export const onGet: RequestHandler = async ({ send, redirect, cacheControl }) => {
  cacheControl({ noCache: true });

  let value: string | null = null;
  try {
    const db = getDb();
    const [row] = await db
      .select({ value: schema.siteSettings.value })
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, POLITICA_CALIDAD_KEY));
    value = row?.value ?? null;
  } catch (error) {
    console.error("Error loading quality policy PDF:", error);
  }

  if (!value) {
    throw redirect(302, "/2026PCMIJAL.pdf");
  }

  const base64 = value.includes(",") ? value.split(",")[1] : value;
  const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  send(
    new Response(binary, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="politicas-de-la-calidad.pdf"',
      },
    }),
  );
};

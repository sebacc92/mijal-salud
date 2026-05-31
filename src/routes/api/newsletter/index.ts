import type { RequestHandler } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export const onPost: RequestHandler = async ({ request, json }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      json(400, { error: "Email inválido" });
      return;
    }

    const emailNorm = String(email).toLowerCase().trim();
    const db = getDb();

    // Upsert: si ya existe, lo reactiva
    const existing = await db
      .select()
      .from(schema.newsletter)
      .where(eq(schema.newsletter.email, emailNorm))
      .limit(1);

    if (existing.length > 0) {
      if (!existing[0].activo) {
        await db
          .update(schema.newsletter)
          .set({ activo: true })
          .where(eq(schema.newsletter.email, emailNorm));
      }
      json(200, { success: true, message: "¡Ya estás suscripto!" });
      return;
    }

    await db.insert(schema.newsletter).values({
      id: nanoid(),
      email: emailNorm,
      activo: true,
    });

    json(200, {
      success: true,
      message: "¡Suscripción exitosa! Bienvenido/a.",
    });
  } catch (error) {
    console.error("Error en /api/newsletter:", error);
    json(500, { error: "Error al procesar la suscripción." });
  }
};

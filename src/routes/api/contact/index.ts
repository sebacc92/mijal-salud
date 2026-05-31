import type { RequestHandler } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { nanoid } from "nanoid";

export const onPost: RequestHandler = async ({ request, json }) => {
  try {
    const body = await request.json();
    const { nombre, email, telefono, asunto, mensaje } = body;

    if (!nombre || !email || !mensaje) {
      json(400, { error: "Faltan campos requeridos: nombre, email, mensaje" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      json(400, { error: "Email inválido" });
      return;
    }

    const db = getDb();
    await db.insert(schema.contactos).values({
      id: nanoid(),
      nombre: String(nombre).trim(),
      email: String(email).toLowerCase().trim(),
      telefono: telefono ? String(telefono).trim() : null,
      asunto: asunto ? String(asunto).trim() : null,
      mensaje: String(mensaje).trim(),
    });

    json(200, {
      success: true,
      message: "Mensaje recibido. Te responderemos dentro de 24 horas.",
    });
  } catch (error) {
    console.error("Error en /api/contact:", error);
    json(500, { error: "Error interno del servidor. Intentá nuevamente." });
  }
};

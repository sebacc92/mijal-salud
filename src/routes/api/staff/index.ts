import type { RequestHandler } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { nanoid } from "nanoid";

export const onPost: RequestHandler = async ({ request, json }) => {
  try {
    const body = await request.json();
    const { nombre, email, telefono, rol, mensaje, cvBase64 } = body;

    if (!nombre || !email || !telefono) {
      json(400, {
        error: "Faltan datos de contacto requeridos: nombre, email, teléfono",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      json(400, { error: "Email inválido" });
      return;
    }

    const db = getDb();

    await db.insert(schema.postulantes).values({
      id: nanoid(),
      nombre: String(nombre).trim(),
      email: String(email).toLowerCase().trim(),
      telefono: String(telefono).trim(),
      rol: rol ? String(rol).trim() : null,
      mensaje: mensaje ? String(mensaje).trim() : null,
      cvUrl: cvBase64 ? String(cvBase64) : null,
      estado: "recibido",
    });

    json(200, {
      success: true,
      message: "¡Tu postulación fue recibida! Te contactaremos pronto.",
    });
  } catch (error) {
    console.error("Error en /api/staff:", error);
    json(500, { error: "Error al enviar la postulación. Intentá nuevamente." });
  }
};

import type { RequestHandler } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { nanoid } from "nanoid";
import { SERVICIOS_VALIDOS } from "~/lib/constants";

const segmentosValidos = ["particular", "empresa", "obra-social"];

export const onPost: RequestHandler = async ({ request, json }) => {
  try {
    const body = await request.json();
    const { nombre, email, telefono, empresa, servicio, segmento, mensaje } =
      body;

    if (!nombre || !email || !servicio || !segmento) {
      json(400, {
        error: "Faltan campos requeridos: nombre, email, servicio, segmento",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      json(400, { error: "Email inválido" });
      return;
    }

    if (!SERVICIOS_VALIDOS.includes(servicio)) {
      json(400, { error: "Servicio inválido" });
      return;
    }

    if (!segmentosValidos.includes(segmento)) {
      json(400, { error: "Segmento inválido" });
      return;
    }

    const db = getDb();
    const id = nanoid();

    await db.insert(schema.leads).values({
      id,
      nombre: String(nombre).trim(),
      email: String(email).toLowerCase().trim(),
      telefono: telefono ? String(telefono).trim() : null,
      empresa: empresa ? String(empresa).trim() : null,
      servicio,
      segmento,
      mensaje: mensaje ? String(mensaje).trim() : null,
      origen: "web",
      estado: "nuevo",
    });

    json(200, {
      success: true,
      message: "¡Gracias! Te contactaremos a la brevedad.",
      id,
    });
  } catch (error) {
    console.error("Error en /api/lead:", error);
    json(500, { error: "Error interno del servidor. Intentá nuevamente." });
  }
};

import type { RequestHandler } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { nanoid } from "nanoid";
import { SERVICIOS_VALIDOS } from "~/lib/constants";
import { notifyNewLead } from "~/lib/notify";

const segmentosValidos = ["particular", "empresa", "obra-social"];

// ─── Rate limiting simple por IP (en memoria) ──────────────────────────────
// Máx 5 envíos aceptados por hora por IP. Nota: es por instancia/isolate, así
// que en un entorno con múltiples réplicas el límite efectivo puede ser algo
// mayor; alcanza como freno básico junto con el honeypot.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hora
const ipHits = new Map<string, number[]>();

function recentHits(ip: string): number[] {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  ipHits.set(ip, hits);
  return hits;
}

function isRateLimited(ip: string): boolean {
  return recentHits(ip).length >= RATE_LIMIT_MAX;
}

function recordHit(ip: string): void {
  const hits = recentHits(ip);
  hits.push(Date.now());
  ipHits.set(ip, hits);
}

export const onPost: RequestHandler = async ({ request, json, clientConn, env }) => {
  try {
    const body = await request.json();
    const {
      nombre,
      email,
      telefono,
      empresa,
      servicio,
      segmento,
      mensaje,
      website, // honeypot: debe venir vacío
    } = body;

    // Honeypot: los bots suelen completar el campo oculto "website". Si viene
    // con valor, respondemos 200 (como si fuera exitoso) pero no insertamos.
    if (typeof website === "string" && website.trim() !== "") {
      json(200, {
        success: true,
        message: "¡Gracias! Te contactaremos a la brevedad.",
      });
      return;
    }

    // Rate limiting por IP.
    const ip =
      clientConn?.ip ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (isRateLimited(ip)) {
      json(429, {
        error: "Recibimos varios envíos desde tu conexión. Probá de nuevo en un rato.",
      });
      return;
    }

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

    const leadData = {
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
    };

    await db.insert(schema.leads).values(leadData);

    // Registrar el envío aceptado para el rate limiting.
    recordHit(ip);

    // Notificación por email (Resend). No bloquea ni rompe si falla.
    await notifyNewLead(leadData, {
      apiKey: env.get("RESEND_API_KEY"),
      to: env.get("LEADS_NOTIFY_EMAIL"),
      from: env.get("LEADS_NOTIFY_FROM"),
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

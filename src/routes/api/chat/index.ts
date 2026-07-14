import type { RequestHandler } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

// Respuestas predefinidas basadas en palabras clave (Fallback en caso de que no haya API Key de OpenAI)
function getBotResponseFallback(userMessage: string): string {
  const text = userMessage.toLowerCase().trim();

  // 1. Emergencias / Urgencias
  if (
    text.includes("emergencia") ||
    text.includes("urgencia") ||
    text.includes("grave") ||
    text.includes("accidente") ||
    text.includes("dolor de pecho")
  ) {
    return "🚨 Si estás ante una Emergencia Médica de riesgo de vida, por favor comunicate DIRECTAMENTE con nuestra central telefónica al 011 5273-1818 para asistencia inmediata las 24 hs.";
  }

  // 2. Planes / Costos / Precios
  if (
    text.includes("precio") ||
    text.includes("costo") ||
    text.includes("cuanto sale") ||
    text.includes("planes") ||
    text.includes("tarifa") ||
    text.includes("abono") ||
    text.includes("particular")
  ) {
    return "💼 En Mijal Salud ofrecemos soluciones a la medida de particulares, familias y empresas. Podés conocer nuestros servicios y solicitar un presupuesto a tu medida ingresando en nuestra sección de soluciones (/soluciones) o completando el formulario de contacto (/contacto) para que un asesor te asesore hoy mismo.";
  }

  // 3. Obras Sociales / Prepagas
  if (
    text.includes("obra social") ||
    text.includes("prepaga") ||
    text.includes("cobertura") ||
    text.includes("pami") ||
    text.includes("osseg") ||
    text.includes("omint") ||
    text.includes("oseiv")
  ) {
    return "🏥 Trabajamos con más de 36 obras sociales y aseguradoras del país (incluyendo PAMI, OSSEG, OMINT ART, OSEIV, OSPIC, Ospical y muchas más). Para saber si tu plan específico cuenta con cobertura, dejanos tus datos en la sección de contacto (/contacto) o hablá directamente con tu prestador.";
  }

  // 4. Servicios
  if (
    text.includes("servicio") ||
    text.includes("que hacen") ||
    text.includes("ofrecen") ||
    text.includes("visita") ||
    text.includes("medico a domicilio") ||
    text.includes("medico")
  ) {
    return "🩺 En Mijal Salud brindamos un ecosistema completo de salud: emergencias y urgencias 24/7, guardia médica domiciliaria, telemedicina con videoconsulta inmediata (Mijal Salud Directa), traslados de alta y baja complejidad, e internación domiciliaria. Podés explorar los detalles en la sección de Servicios (/servicios).";
  }

  // 5. Empresas / Área Protegida
  if (
    text.includes("empresa") ||
    text.includes("corporativo") ||
    text.includes("trabajo") ||
    text.includes("evento") ||
    text.includes("area protegida") ||
    text.includes("empleado")
  ) {
    return "🏢 Ofrecemos cobertura médica para eventos (congresos, festivales, obras y estadios) y Área Protegida para espacios de trabajo. Consultá nuestra sección de Eventos (/eventos) o completá el formulario para que un especialista te contacte.";
  }

  // 6. Telemedicina
  if (
    text.includes("telemedicina") ||
    text.includes("virtual") ||
    text.includes("online") ||
    text.includes("videoconsulta") ||
    text.includes("conecta") ||
    text.includes("ia")
  ) {
    return "📱 Contamos con 'Mijal Salud Directa', nuestro servicio de telemedicina que te conecta con un médico de guardia por videoconsulta en menos de 10 minutos, sin demoras y sin salir de tu casa, disponible las 24 horas.";
  }

  // 7. Saludos
  if (
    text.includes("hola") ||
    text.includes("buen") ||
    text.includes("saludo") ||
    text.includes("como andas") ||
    text.includes("que tal")
  ) {
    return "👋 ¡Hola! Soy el asistente virtual de Mijal Salud. Estoy aquí para guiarte e informarte sobre nuestros servicios médicos domiciliarios, telemedicina, soluciones corporativas u obras sociales asociadas. ¿De qué te gustaría hablar hoy?";
  }

  // Respuesta por defecto con sugerencias
  return (
    "🤖 Entiendo tu consulta. Para darte la mejor información, por favor indicame si te interesa saber sobre: \n\n" +
    "• 🩺 Nuestros *servicios médicos a domicilio*.\n" +
    "• 🏥 Cobertura de *obras sociales* y prepagas.\n" +
    "• 🏢 Soluciones de *Área Protegida y medicina laboral para empresas*.\n" +
    "• 📱 Servicio de *Telemedicina* Mijal Salud Directa.\n" +
    "• 📞 Vías de *contacto* o número de emergencia."
  );
}

export const onPost: RequestHandler = async (requestEvent) => {
  const { request, json, env } = requestEvent;
  try {
    const body = await request.json();
    const { messages, sessionId } = body;

    if (!messages || !Array.isArray(messages) || !sessionId) {
      json(400, { error: "Faltan campos requeridos: messages y sessionId" });
      return;
    }

    const lastUserMessage = messages[messages.length - 1];
    if (!lastUserMessage || lastUserMessage.role !== "user") {
      json(400, { error: "El último mensaje debe ser del usuario" });
      return;
    }

    const db = getDb();
    const timestampStr = new Date().toISOString();

    // 1. Obtener configuraciones del Chatbot en DB
    const [settings] = await db
      .select()
      .from(schema.chatbotSettings)
      .where(eq(schema.chatbotSettings.id, 1))
      .limit(1);

    // 2. Verificar si está deshabilitado
    if (settings && settings.activo === false) {
      json(403, {
        error: "El Asistente Virtual se encuentra deshabilitado temporalmente.",
      });
      return;
    }

    // 3. Verificar o crear la sesión de chat
    const [existingSession] = await db
      .select()
      .from(schema.chatSessions)
      .where(eq(schema.chatSessions.id, sessionId))
      .limit(1);

    if (!existingSession) {
      await db.insert(schema.chatSessions).values({
        id: sessionId,
        createdAt: timestampStr,
        lastActive: timestampStr,
      });
    } else {
      await db
        .update(schema.chatSessions)
        .set({ lastActive: timestampStr })
        .where(eq(schema.chatSessions.id, sessionId));
    }

    // 4. Guardar mensaje del usuario
    const userMsgId = "msg-" + nanoid();
    await db.insert(schema.chatMessages).values({
      id: userMsgId,
      sessionId: sessionId,
      role: "user",
      content: lastUserMessage.content,
      createdAt: timestampStr,
    });

    // 5. Intentar obtener respuesta mediante OpenAI o fallback
    let botReplyText = "";
    const openaiApiKey =
      env.get("OPENAI_API_KEY") || import.meta.env.OPENAI_API_KEY;

    if (openaiApiKey) {
      // Usar gpt-4o-mini de OpenAI
      const openai = new OpenAI({ apiKey: openaiApiKey });

      // Diseñar el system prompt personalizado
      const systemPrompt = `Eres ${settings?.nombre || "Mijal Care IA"}, el asistente virtual inteligente oficial de Mijal Salud S.A.

INSTRUCCIONES DE PERSONALIDAD Y TONO:
- Tono: ${settings?.tono || "Amigable, profesional y servicial"}.
${settings?.instrucciones || "1. TRATO NEUTRO E INCLUSIVO: NUNCA asumas el género del usuario.\n2. CERO ALUCINACIONES: Si un usuario te pregunta por un servicio o detalle que no esté cubierto, responde honestamente que no disponés de esa información."}

CONOCIMIENTO OBLIGATORIO DE LA EMPRESA (MIJAL SALUD):
${settings?.conocimiento || "- Identidad: Somos Mijal Salud S.A., una empresa líder de servicios de salud médica domiciliaria."}

LLAMADO A LA ACCIÓN DE CONTACTO (CTA):
${settings?.cta || "Para consultas administrativas, podés escribirnos al WhatsApp oficial:"} ${settings?.whatsapp || "5491152731818"}`;

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((msg: any) => ({
              role: (msg.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
              content: msg.content || "",
            })),
          ],
          max_tokens: 350,
          temperature: 0.5,
        });

        botReplyText =
          response.choices[0]?.message?.content ||
          "Lo siento. Tuve un inconveniente para procesar tu mensaje. ¿Podrías intentar de nuevo?";
      } catch (openaiErr) {
        console.error("OpenAI completion error, falling back:", openaiErr);
        botReplyText = getBotResponseFallback(lastUserMessage.content);
      }
    } else {
      // Si no hay API Key configurada, usar el motor de palabras clave fallback
      console.warn("No OPENAI_API_KEY found, using rule-based chatbot fallback.");
      botReplyText = getBotResponseFallback(lastUserMessage.content);
    }

    // 6. Guardar respuesta del bot en la base de datos
    const botMsgId = "msg-" + nanoid();
    const botTimestampStr = new Date().toISOString();

    await db.insert(schema.chatMessages).values({
      id: botMsgId,
      sessionId: sessionId,
      role: "assistant",
      content: botReplyText,
      createdAt: botTimestampStr,
    });

    json(200, {
      reply: {
        role: "assistant",
        content: botReplyText,
      },
    });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    json(500, { error: "Error interno del servidor. Reintentá más tarde." });
  }
};

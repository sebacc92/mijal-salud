import type { RequestHandler } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

// Respuestas predefinidas basadas en palabras clave para Mijal Salud
function getBotResponse(userMessage: string): string {
  const text = userMessage.toLowerCase().trim();

  // 1. Emergencias / Urgencias
  if (text.includes("emergencia") || text.includes("urgencia") || text.includes("grave") || text.includes("accidente") || text.includes("dolor de pecho")) {
    return "🚨 Si estás ante una Emergencia Médica de riesgo de vida, por favor comunicate DIRECTAMENTE con nuestra central telefónica al 011 5273-1818 para asistencia inmediata las 24 hs.";
  }

  // 2. Planes / Costos / Precios
  if (text.includes("precio") || text.includes("costo") || text.includes("cuanto sale") || text.includes("planes") || text.includes("tarifa") || text.includes("abono") || text.includes("particular")) {
    return "💼 En Mijal Salud ofrecemos soluciones a la medida de particulares, familias y empresas. Podés conocer nuestros servicios y solicitar un presupuesto a tu medida ingresando en nuestra sección de soluciones (/soluciones) o completando el formulario de contacto (/contacto) para que un asesor te asesore hoy mismo.";
  }

  // 3. Obras Sociales / Prepagas
  if (text.includes("obra social") || text.includes("prepaga") || text.includes("cobertura") || text.includes("pami") || text.includes("osseg") || text.includes("omint") || text.includes("oseiv")) {
    return "🏥 Trabajamos con más de 36 obras sociales y aseguradoras del país (incluyendo PAMI, OSSEG, OMINT ART, OSEIV, OSPIC, Ospical y muchas más). Para saber si tu plan específico cuenta con cobertura, dejanos tus datos en la sección de contacto (/contacto) o hablá directamente con tu prestador.";
  }

  // 4. Servicios / Qué ofrecen
  if (text.includes("servicio") || text.includes("que hacen") || text.includes("ofrecen") || text.includes("visita") || text.includes("medico a domicilio") || text.includes("medico")) {
    return "🩺 En Mijal Salud brindamos un ecosistema completo de salud: emergencias y urgencias 24/7, guardia médica domiciliaria, telemedicina con videoconsulta inmediata (Mijal Salud Directa), traslados de alta y baja complejidad, e internación domiciliaria. Podés explorar los detalles en la sección de Servicios (/servicios).";
  }

  // 5. Empresas / Área Protegida
  if (text.includes("empresa") || text.includes("corporativo") || text.includes("trabajo") || text.includes("evento") || text.includes("area protegida") || text.includes("empleado")) {
    return "🏢 Ofrecemos cobertura de Área Protegida para oficinas y comercios, cobertura médica para eventos corporativos y deportivos, telemedicina corporativa y medicina laboral. Consultá nuestra sección exclusiva para Empresas (/empresas) o completá el formulario para que un especialista corporativo te contacte.";
  }

  // 6. Telemedicina / Guardia virtual
  if (text.includes("telemedicina") || text.includes("virtual") || text.includes("online") || text.includes("videoconsulta") || text.includes("conecta") || text.includes("ia")) {
    return "📱 Contamos con 'Mijal Salud Directa', nuestro servicio de telemedicina que te conecta con un médico de guardia por videoconsulta en menos de 10 minutos, sin demoras y sin salir de tu casa, disponible las 24 horas.";
  }

  // 7. Internación domiciliaria
  if (text.includes("internacion") || text.includes("domicilio") || text.includes("casa") || text.includes("cuidado")) {
    return "🏠 Brindamos Internación Domiciliaria coordinada por un equipo interdisciplinario (médicos, enfermeros, kinesiólogos) para que los pacientes se recuperen con la comodidad y el amor de su hogar, manteniendo los máximos estándares clínicos.";
  }

  // 8. Contacto / Dirección / Teléfono
  if (text.includes("contacto") || text.includes("telefono") || text.includes("direccion") || text.includes("donde estan") || text.includes("ubica") || text.includes("mail") || text.includes("whatsapp")) {
    return "📞 Podés llamarnos a nuestra central al 011 5273-1818, escribirnos por WhatsApp al +54 9 11 5273-1818, o enviarnos un email a info@mijalsalud.com.ar. Nuestras oficinas administrativas se encuentran en Buenos Aires y podés dejarnos un mensaje desde nuestra web en /contacto.";
  }

  // 9. Saludos
  if (text.includes("hola") || text.includes("buen") || text.includes("saludo") || text.includes("como andas") || text.includes("que tal")) {
    return "👋 ¡Hola! Soy el asistente virtual de Mijal Salud. Estoy aquí para guiarte e informarte sobre nuestros servicios médicos domiciliarios, telemedicina, soluciones corporativas u obras sociales asociadas. ¿De qué te gustaría hablar hoy?";
  }

  // 10. Agradecimientos
  if (text.includes("gracia") || text.includes("buenisimo") || text.includes("ok") || text.includes("perfecto") || text.includes("chau") || text.includes("adios")) {
    return "❤️ ¡Muchas gracias a vos! Recordá que en Mijal Salud tu bienestar es nuestra prioridad. No dudes en consultarme cualquier otra duda, ¡que tengas un excelente día!";
  }

  // Respuesta por defecto con sugerencias
  return "🤖 Entiendo tu consulta. Para darte la mejor información, por favor indicame si te interesa saber sobre: \n\n" +
         "• 🩺 Nuestros *servicios médicos a domicilio*.\n" +
         "• 🏥 Cobertura de *obras sociales* y prepagas.\n" +
         "• 🏢 Soluciones de *Área Protegida y medicina laboral para empresas*.\n" +
         "• 📱 Servicio de *Telemedicina* Mijal Salud Directa.\n" +
         "• 📞 Vías de *contacto* o número de emergencia.";
}

export const onPost: RequestHandler = async ({ request, json }) => {
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

    // 1. Verificar si la sesión existe, sino crearla
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

    // 2. Guardar mensaje del usuario en la base de datos
    const userMsgId = "msg-" + nanoid();
    await db.insert(schema.chatMessages).values({
      id: userMsgId,
      sessionId: sessionId,
      role: "user",
      content: lastUserMessage.content,
      createdAt: timestampStr,
    });

    // 3. Obtener respuesta del bot e insertarla en la base de datos
    const botReplyText = getBotResponse(lastUserMessage.content);
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

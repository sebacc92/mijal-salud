import { component$ } from "@builder.io/qwik";
import { routeLoader$, Link } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/db";
import { chatSessions, chatMessages } from "~/db/schema";
import { eq, asc } from "drizzle-orm";

export const useChatDetailsLoader = routeLoader$(async (requestEvent) => {
  const sessionId = requestEvent.params.id;
  try {
    const db = getDb();

    // 1. Obtener la sesión
    const [sessionObj] = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, sessionId))
      .limit(1);

    if (!sessionObj) return null;

    // 2. Obtener todos los mensajes ordenados ascendentemente por fecha de creación
    const messagesList = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(asc(chatMessages.createdAt));

    return {
      session: sessionObj,
      messages: messagesList,
    };
  } catch (error) {
    console.error("Error loading chat session details:", error);
    return null;
  }
});

export default component$(() => {
  const data = useChatDetailsLoader();

  if (!data.value) {
    return (
      <div class="space-y-6 text-center py-16">
        <h2 class="text-2xl font-bold text-slate-800 font-display">Conversación no encontrada</h2>
        <p class="text-slate-500 font-body text-sm">La sesión solicitada no existe o fue eliminada.</p>
        <Link
          href="/admin/chats/"
          class="inline-flex items-center gap-2 bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-6 py-2.5 rounded-xl shadow-cta transition-all duration-200 cursor-pointer"
        >
          Volver a Auditoría
        </Link>
      </div>
    );
  }

  const { session, messages } = data.value;

  return (
    <div class="space-y-6">
      {/* Botón de volver */}
      <div>
        <Link
          href="/admin/chats/"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-navy-900 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2.5}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Auditoría
        </Link>
      </div>

      {/* Información de la sesión */}
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span class="text-[10px] font-bold text-verde-500 uppercase tracking-widest leading-none">Detalles del Chat</span>
          <h1 class="text-2xl font-bold font-display text-navy-900 mt-1 font-mono">{session.id}</h1>
          <p class="text-xs text-slate-500 font-body mt-1">
            Visualización histórica del diálogo entre el usuario y la IA de Mijal Salud.
          </p>
        </div>
        <div class="flex flex-wrap gap-4 text-xs font-body font-medium">
          <div class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-600">
            <span class="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Mensajes</span>
            <span class="font-bold text-slate-900 text-sm">{messages.length}</span>
          </div>
          <div class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-600">
            <span class="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Iniciado</span>
            <span class="font-bold text-slate-900">{new Date(session.createdAt).toLocaleString("es-AR")}</span>
          </div>
          <div class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-600">
            <span class="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Último Mensaje</span>
            <span class="font-bold text-slate-900">{new Date(session.lastActive).toLocaleString("es-AR")}</span>
          </div>
        </div>
      </div>

      {/* Transcripción del chat */}
      <div class="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-w-4xl mx-auto min-h-[28rem] h-[34rem]">
        {/* Header ficticio de la conversación */}
        <div class="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-verde-500 flex items-center justify-center font-bold text-sm">M</div>
            <div>
              <p class="font-bold text-sm font-display leading-none text-verde-400">Mijal Care IA</p>
              <p class="text-[9px] text-slate-350 tracking-wider mt-0.5 uppercase">Asistente Clínico Inteligente</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
            <div class="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
            <span class="text-[9px] font-bold text-green-400 uppercase tracking-widest">Activo</span>
          </div>
        </div>

        {/* Mensajes */}
        <div class="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-100/40">
          {messages.length === 0 ? (
            <div class="h-full flex items-center justify-center text-slate-400 text-sm font-body">
              No se intercambiaron mensajes en esta sesión.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                class={["flex w-full flex-col", msg.role === "user" ? "items-end" : "items-start"]}
              >
                {/* Remitente label */}
                <span class="text-[10px] text-slate-400 font-semibold mb-1 font-body uppercase tracking-wider">
                  {msg.role === "user" ? "Usuario" : "Mijal Care IA"}
                </span>
                
                {/* Contenedor del mensaje */}
                <div
                  class={[
                    "max-w-[75%] rounded-2xl px-5 py-3.5 text-sm shadow-sm leading-relaxed whitespace-pre-line",
                    msg.role === "user"
                      ? "bg-navy-900 text-white rounded-br-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-none",
                  ].join(" ")}
                >
                  {msg.content}
                </div>
                
                {/* Timestamp */}
                <span class="text-[9px] text-slate-400 mt-1 font-mono">
                  {new Date(msg.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Auditoría de Conversación — Mijal Salud",
};

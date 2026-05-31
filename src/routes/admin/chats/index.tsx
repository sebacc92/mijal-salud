import { component$ } from "@builder.io/qwik";
import { routeLoader$, Link } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/db";
import { chatSessions, chatMessages } from "~/db/schema";
import { desc, count, eq } from "drizzle-orm";

export const useChatsLoader = routeLoader$(async () => {
  try {
    const db = getDb();

    // Obtener todas las sesiones de chat ordenadas por última actividad
    const sessionsList = await db
      .select()
      .from(chatSessions)
      .orderBy(desc(chatSessions.lastActive));

    // Obtener conteo de mensajes de cada sesión
    const sessionsWithCount = await Promise.all(
      sessionsList.map(async (sess) => {
        const [msgCountObj] = await db
          .select({ val: count() })
          .from(chatMessages)
          .where(eq(chatMessages.sessionId, sess.id));

        return {
          ...sess,
          messageCount: msgCountObj?.val || 0,
        };
      })
    );

    return sessionsWithCount;
  } catch (error) {
    console.error("Error loading chat sessions:", error);
    return [];
  }
});

export default component$(() => {
  const sessions = useChatsLoader();

  return (
    <div class="space-y-8">
      {/* Encabezado */}
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold font-display text-navy-900">Auditoría de IA (Chats)</h1>
          <p class="text-slate-500 font-body text-sm mt-1">
            Supervisá en tiempo real las conversaciones de los usuarios con el asistente Mijal Care IA.
          </p>
        </div>
      </div>

      {/* Grid o Tabla de Conversaciones */}
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-bold text-base text-navy-900 font-display">Conversaciones Registradas</h3>
          <span class="text-xs bg-verde-50 text-verde-700 px-3 py-1 rounded-full font-semibold border border-verde-100">
            {sessions.value.length} {sessions.value.length === 1 ? "Sesión" : "Sesiones"}
          </span>
        </div>

        <div class="overflow-x-auto">
          {sessions.value.length === 0 ? (
            <div class="p-16 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={1.5}>
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h4 class="font-bold text-slate-700 text-base font-display">Sin actividad de chat</h4>
              <p class="text-slate-400 font-body text-sm mt-1 max-w-sm mx-auto">
                Las conversaciones que los usuarios inicien con el asistente flotante aparecerán listadas acá automáticamente.
              </p>
            </div>
          ) : (
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <th class="px-6 py-4">ID Sesión</th>
                  <th class="px-6 py-4 text-center">Total Mensajes</th>
                  <th class="px-6 py-4">Iniciada</th>
                  <th class="px-6 py-4">Última Actividad</th>
                  <th class="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-body text-slate-700">
                {sessions.value.map((sess) => (
                  <tr key={sess.id} class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4 font-semibold text-slate-900">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold font-mono">
                          {sess.id.slice(-4).toUpperCase()}
                        </div>
                        <span class="font-mono text-xs">{sess.id}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class={[
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                        sess.messageCount > 0
                          ? "bg-verde-50 text-verde-700 border-verde-150"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      ].join(" ")}>
                        {sess.messageCount} {sess.messageCount === 1 ? "msg" : "msgs"}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-xs text-slate-500">
                      {new Date(sess.createdAt).toLocaleString("es-AR")}
                    </td>
                    <td class="px-6 py-4 text-xs text-slate-500 font-medium">
                      {new Date(sess.lastActive).toLocaleString("es-AR")}
                    </td>
                    <td class="px-6 py-4 text-right">
                      <Link
                        href={`/admin/chats/${sess.id}/`}
                        class="inline-flex items-center gap-1 text-xs font-bold text-verde-600 hover:text-verde-700 transition-colors uppercase tracking-wider cursor-pointer"
                      >
                        Ver Auditoría
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2.5}><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Auditoría de IA — Mijal Salud",
};

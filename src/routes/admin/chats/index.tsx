import { component$, useSignal, $ } from "@builder.io/qwik";
import {
  routeLoader$,
  routeAction$,
  Form,
  Link,
} from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/db";
import { chatSessions, chatMessages, chatbotSettings } from "~/db/schema";
import { desc, count, eq } from "drizzle-orm";

// 1. LOADER UNIFICADO: CARGA SESIONES Y SETTINGS
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

    // Obtener la configuración actual de chatbotSettings (id = 1)
    let [settings] = await db
      .select()
      .from(chatbotSettings)
      .where(eq(chatbotSettings.id, 1))
      .limit(1);

    if (!settings) {
      const defaultSettings = {
        id: 1,
        activo: true,
        nombre: "Mijal Care IA",
        tono: "Amigable, profesional y servicial",
        instrucciones:
          "1. TRATO NEUTRO E INCLUSIVO: NUNCA asumas el género del usuario.\n2. CERO ALUCINACIONES: Si un usuario te pregunta por un servicio o detalle que no esté cubierto, responde honestamente que no disponés de esa información.",
        conocimiento:
          "- Identidad: Somos Mijal Salud S.A., una empresa líder de servicios de salud médica domiciliaria, traslados e internación domiciliaria con base operativa en Av. Lope de Vega 960, CABA.\n- Teléfono emergencias: 011 5273-1818\n- Teléfono administrativo: 011 5273-1818\n- WhatsApp: +54 9 11 5273-1818\n- Servicios: Guardia médica domiciliaria, Mijal Salud Directa (Telemedicina las 24 hs), Traslados sanitarios, Internación domiciliaria.",
        saludo:
          "¡Hola! Soy el asistente virtual de Mijal Salud. Estoy aquí para guiarte e informarte sobre nuestros servicios médicos domiciliarios, telemedicina u obras sociales. ¿En qué te puedo ayudar hoy?",
        cta: "Para consultas administrativas, podés escribirnos al WhatsApp oficial:",
        whatsapp: "5491152731818",
        avatarUrl: "",
        updatedAt: new Date().toISOString(),
      };

      await db.insert(chatbotSettings).values(defaultSettings as any);
      settings = defaultSettings;
    }

    return {
      sessions: sessionsWithCount,
      settings,
    };
  } catch (error) {
    console.error("Error loading chat sessions in admin:", error);
    return {
      sessions: [],
      settings: {
        id: 1,
        activo: true,
        nombre: "Mijal Care IA",
        tono: "Amigable, profesional y servicial",
        instrucciones: "",
        conocimiento: "",
        saludo: "",
        cta: "",
        whatsapp: "5491152731818",
        avatarUrl: "",
      },
    };
  }
});

// 2. ACTION: ACTUALIZAR CONFIGURACIÓN DE IA
export const useUpdateAiSettingsAction = routeAction$(async (data) => {
  try {
    const db = getDb();

    const active = data.activo === "true";
    const nombre = typeof data.nombre === "string" ? data.nombre.trim() : "Mijal Care IA";
    const tono = typeof data.tono === "string" ? data.tono.trim() : null;
    const instrucciones = typeof data.instrucciones === "string" ? data.instrucciones.trim() : null;
    const conocimiento = typeof data.conocimiento === "string" ? data.conocimiento.trim() : null;
    const saludo = typeof data.saludo === "string" ? data.saludo.trim() : null;
    const cta = typeof data.cta === "string" ? data.cta.trim() : null;
    const whatsapp = typeof data.whatsapp === "string" ? data.whatsapp.trim() : null;
    const avatarUrl = typeof data.avatarUrl === "string" ? data.avatarUrl : null;

    const valuesToInsert = {
      id: 1,
      activo: active,
      nombre,
      tono,
      instrucciones,
      conocimiento,
      saludo,
      cta,
      whatsapp,
      avatarUrl,
      updatedAt: new Date().toISOString(),
    };

    await db
      .insert(chatbotSettings)
      .values(valuesToInsert as any)
      .onConflictDoUpdate({
        target: chatbotSettings.id,
        set: valuesToInsert as any,
      });

    return { success: true };
  } catch (e: any) {
    console.error("Error updating AI settings:", e);
    return { success: false, error: "Error al guardar los ajustes de IA." };
  }
});

// 3. ACTION: ELIMINAR SESIÓN DE CHAT
export const useDeleteChatAction = routeAction$(async (data) => {
  const id = data.id as string;
  if (!id) return { success: false, error: "ID no proporcionado." };

  try {
    const db = getDb();
    await db.delete(chatMessages).where(eq(chatMessages.sessionId, id));
    await db.delete(chatSessions).where(eq(chatSessions.id, id));
    return { success: true };
  } catch (err) {
    console.error("Error deleting chat session:", err);
    return { success: false, error: "Error al eliminar la sesión de chat." };
  }
});

export default component$(() => {
  const data = useChatsLoader();
  const updateAction = useUpdateAiSettingsAction();
  const deleteAction = useDeleteChatAction();

  // Control del tab activo
  const activeTab = useSignal<"config" | "audit">("config");

  // Estado del Avatar
  const avatarUrl = useSignal(data.value.settings.avatarUrl || "");
  const isUploading = useSignal(false);
  const chatbotActivo = useSignal(!!data.value.settings.activo);

  // Compresión y Base64 del Avatar
  const compressAvatar = $((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
          }
          // Dimensiones fijas avatar: 160x160
          const SIZE = 160;
          canvas.width = SIZE;
          canvas.height = SIZE;

          ctx.clearRect(0, 0, SIZE, SIZE);
          ctx.drawImage(img, 0, 0, SIZE, SIZE);

          const base64 = canvas.toDataURL("image/webp", 0.85);
          resolve(base64);
        };
        img.onerror = (err) => reject(err);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  });

  const handleAvatarChange = $(async (event: Event, el: HTMLInputElement) => {
    const files = el.files;
    if (!files || files.length === 0) return;

    isUploading.value = true;
    try {
      const base64 = await compressAvatar(files[0]);
      avatarUrl.value = base64;
    } catch (err) {
      console.error("Error compressing avatar:", err);
      alert("Error al cargar y procesar la imagen del avatar.");
    } finally {
      isUploading.value = false;
      el.value = "";
    }
  });

  return (
    <div class="space-y-6 max-w-6xl mx-auto">
      {/* Encabezado */}
      <div>
        <h1 class="text-3xl font-bold font-display text-navy-900">
          Chatbot de IA
        </h1>
        <p class="text-slate-500 font-body text-sm mt-1">
          Personalizá la inteligencia artificial, respuestas, tono y auditá las
          conversaciones en tiempo real.
        </p>
      </div>

      {/* Tabs */}
      <div class="flex border-b border-slate-200">
        <button
          onClick$={() => (activeTab.value = "config")}
          class={[
            "px-6 py-3 font-display font-bold text-sm border-b-2 transition-all cursor-pointer",
            activeTab.value === "config"
              ? "border-verde-500 text-verde-600"
              : "border-transparent text-slate-400 hover:text-slate-600",
          ].join(" ")}
        >
          🤖 Configurar Chatbot
        </button>
        <button
          onClick$={() => (activeTab.value = "audit")}
          class={[
            "px-6 py-3 font-display font-bold text-sm border-b-2 transition-all cursor-pointer",
            activeTab.value === "audit"
              ? "border-verde-500 text-verde-600"
              : "border-transparent text-slate-400 hover:text-slate-600",
          ].join(" ")}
        >
          💬 Auditoría de Chats
        </button>
      </div>

      {/* Alert de feedback para actualizaciones */}
      {updateAction.value?.success && activeTab.value === "config" && (
        <div class="bg-verde-50 border border-verde-200 text-verde-800 px-4 py-3.5 rounded-2xl text-xs font-semibold font-body">
          ✅ ¡Configuración del Chatbot guardada correctamente!
        </div>
      )}
      {updateAction.value?.error && activeTab.value === "config" && (
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-2xl text-xs font-semibold font-body">
          ⚠️ {updateAction.value.error}
        </div>
      )}

      {/* Alert de feedback para auditoría */}
      {deleteAction.value?.success && activeTab.value === "audit" && (
        <div class="bg-verde-50 border border-verde-200 text-verde-800 px-4 py-3.5 rounded-2xl text-xs font-semibold font-body animate-fade-in">
          ✅ Chat eliminado exitosamente.
        </div>
      )}

      {/* TAB 1: CONFIGURAR CHATBOT */}
      {activeTab.value === "config" && (
        <Form action={updateAction} class="space-y-6">
          <input type="hidden" name="avatarUrl" value={avatarUrl.value} />
          <input
            type="hidden"
            name="activo"
            value={chatbotActivo.value ? "true" : "false"}
          />

          <div class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 font-body">
            {/* Activar / Desactivar y Avatar */}
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div class="flex items-center gap-4">
                {/* Avatar del Bot */}
                <div class="relative shrink-0 w-16 h-16 rounded-full bg-slate-100 border border-slate-250 flex items-center justify-center overflow-hidden">
                  {avatarUrl.value ? (
                    <img
                      src={avatarUrl.value}
                      alt="Avatar"
                      class="w-full h-full object-cover"
                    />
                  ) : (
                    <span class="text-3xl">🤖</span>
                  )}
                  {isUploading.value && (
                    <div class="absolute inset-0 bg-white/75 flex items-center justify-center">
                      <div class="animate-spin rounded-full h-5 w-5 border-2 border-verde-500 border-t-transparent" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 class="font-display font-bold text-navy-900 text-sm">
                    Foto de Perfil del Asistente
                  </h3>
                  <div class="flex gap-2 mt-1.5">
                    <label class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1 rounded-lg text-[11px] cursor-pointer shadow-sm transition-all">
                      Cambiar foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange$={handleAvatarChange}
                        class="hidden"
                      />
                    </label>
                    {avatarUrl.value && (
                      <button
                        type="button"
                        onClick$={() => (avatarUrl.value = "")}
                        class="border border-red-200 hover:bg-red-50 text-red-500 font-semibold px-2 py-1 rounded-lg text-[11px] transition-all"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón de switch de activación */}
              <div class="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
                <div class="leading-none text-left">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Disponibilidad
                  </p>
                  <p class="text-xs font-bold text-navy-900 mt-0.5">
                    {chatbotActivo.value ? "Chatbot Activo" : "Chatbot Inactivo"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick$={() => (chatbotActivo.value = !chatbotActivo.value)}
                  class={[
                    "w-11 h-6 rounded-full p-0.5 transition-colors duration-200 outline-none shrink-0",
                    chatbotActivo.value ? "bg-verde-500" : "bg-slate-300",
                  ].join(" ")}
                >
                  <div
                    class={[
                      "w-5 h-5 bg-white rounded-full shadow-sm transform duration-200",
                      chatbotActivo.value ? "translate-x-5" : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
              </div>
            </div>

            {/* Configuración principal */}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Nombre */}
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-navy-900 uppercase">
                  Nombre del Asistente
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={data.value.settings.nombre || "Mijal Care IA"}
                  required
                  class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 focus:ring-1 focus:ring-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-navy-900 font-semibold"
                />
              </div>

              {/* Tono */}
              <div class="space-y-1.5 md:col-span-2">
                <label class="block text-xs font-bold text-navy-900 uppercase">
                  Tono y Personalidad de la IA
                </label>
                <input
                  type="text"
                  name="tono"
                  value={data.value.settings.tono || ""}
                  placeholder="Ej. Amigable, profesional, empático y servicial..."
                  class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 focus:ring-1 focus:ring-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-navy-900"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div class="space-y-1.5 max-w-md">
              <label class="block text-xs font-bold text-navy-900 uppercase">
                WhatsApp de Derivación (CTA)
              </label>
              <input
                type="text"
                name="whatsapp"
                value={data.value.settings.whatsapp || ""}
                placeholder="Ej. 5491152731818"
                class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 focus:ring-1 focus:ring-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-navy-900 font-mono"
              />
              <p class="text-[10px] text-slate-400">
                Número internacional sin el signo + ni guiones. Se utilizará
                para derivar consultas de facturación o presupuestos.
              </p>
            </div>

            {/* Saludo inicial */}
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-navy-900 uppercase">
                Saludo de Bienvenida
              </label>
              <textarea
                name="saludo"
                rows={2}
                value={data.value.settings.saludo || ""}
                placeholder="Mensaje de bienvenida inicial..."
                class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 focus:ring-1 focus:ring-verde-500 rounded-xl px-4 py-3 text-sm outline-none transition-all text-navy-900 resize-none leading-relaxed"
              />
            </div>

            {/* CTA */}
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-navy-900 uppercase">
                Llamado a la Acción (CTA de WhatsApp)
              </label>
              <textarea
                name="cta"
                rows={2}
                value={data.value.settings.cta || ""}
                placeholder="Texto antes de sugerir el WhatsApp..."
                class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 focus:ring-1 focus:ring-verde-500 rounded-xl px-4 py-3 text-sm outline-none transition-all text-navy-900 resize-none leading-relaxed"
              />
            </div>

            {/* Instrucciones del Sistema */}
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-navy-900 uppercase">
                Instrucciones del Sistema (System Prompt)
              </label>
              <textarea
                name="instrucciones"
                rows={5}
                value={data.value.settings.instrucciones || ""}
                placeholder="Reglas obligatorias para el comportamiento del bot..."
                class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 focus:ring-1 focus:ring-verde-500 rounded-xl px-4 py-3 text-sm outline-none transition-all text-navy-900 leading-relaxed font-mono text-xs"
              />
            </div>

            {/* Base de Conocimiento Obligatorio */}
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-navy-900 uppercase">
                Base de Conocimiento Obligatorio
              </label>
              <textarea
                name="conocimiento"
                rows={6}
                value={data.value.settings.conocimiento || ""}
                placeholder="Información clave sobre Mijal Salud que la IA siempre debe saber..."
                class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 focus:ring-1 focus:ring-verde-500 rounded-xl px-4 py-3 text-sm outline-none transition-all text-navy-900 leading-relaxed font-mono text-xs"
              />
            </div>
          </div>

          {/* Botón de envío */}
          <div class="flex justify-end">
            <button
              type="submit"
              disabled={updateAction.isRunning}
              class="bg-navy-900 hover:bg-navy-950 text-white font-display font-semibold text-xs px-6 py-3.5 rounded-xl shadow-cta transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {updateAction.isRunning ? (
                <>
                  <svg
                    class="animate-spin h-3.5 w-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Guardando ajustes...
                </>
              ) : (
                "Guardar Configuración IA"
              )}
            </button>
          </div>
        </Form>
      )}

      {/* TAB 2: AUDITORÍA DE CHATS */}
      {activeTab.value === "audit" && (
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden font-body">
          <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 class="font-bold text-base text-navy-900 font-display">
              Conversaciones Registradas
            </h3>
            <span class="text-xs bg-verde-50 text-verde-700 px-3 py-1 rounded-full font-semibold border border-verde-100">
              {data.value.sessions.length}{" "}
              {data.value.sessions.length === 1 ? "Sesión" : "Sesiones"}
            </span>
          </div>

          <div class="overflow-x-auto">
            {data.value.sessions.length === 0 ? (
              <div class="p-16 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-12 h-12 mx-auto text-slate-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width={1.5}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h4 class="font-bold text-slate-700 text-base font-display">
                  Sin actividad de chat
                </h4>
                <p class="text-slate-400 font-body text-sm mt-1 max-w-sm mx-auto">
                  Las conversaciones que los usuarios inicien con el asistente
                  flotante aparecerán listadas acá automáticamente.
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
                  {data.value.sessions.map((sess) => (
                    <tr
                      key={sess.id}
                      class="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td class="px-6 py-4 font-semibold text-slate-900">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold font-mono shrink-0">
                            {sess.id.slice(-4).toUpperCase()}
                          </div>
                          <span class="font-mono text-xs truncate max-w-[120px] md:max-w-none block">
                            {sess.id}
                          </span>
                        </div>
                      </td>
                      <td class="px-6 py-4 text-center">
                        <span
                          class={[
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                            sess.messageCount > 0
                              ? "bg-verde-50 text-verde-700 border-verde-150"
                              : "bg-slate-50 text-slate-400 border-slate-200",
                          ].join(" ")}
                        >
                          {sess.messageCount}{" "}
                          {sess.messageCount === 1 ? "msg" : "msgs"}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-xs text-slate-500">
                        {new Date(sess.createdAt).toLocaleString("es-AR")}
                      </td>
                      <td class="px-6 py-4 text-xs text-slate-500 font-medium">
                        {new Date(sess.lastActive).toLocaleString("es-AR")}
                      </td>
                      <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-3.5">
                          <Link
                            href={`/admin/chats/${sess.id}/`}
                            class="inline-flex items-center gap-1 text-xs font-bold text-verde-600 hover:text-verde-700 transition-colors uppercase tracking-wider cursor-pointer font-display"
                          >
                            Ver
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              stroke-width={2.5}
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>

                          {/* Eliminar Sesión */}
                          <Form action={deleteAction}>
                            <input type="hidden" name="id" value={sess.id} />
                            <button
                              type="submit"
                              class="text-slate-400 hover:text-red-600 p-1 transition-colors rounded-lg hover:bg-red-50 cursor-pointer shrink-0"
                              preventdefault:click
                              onClick$={async (e, el) => {
                                if (
                                  confirm(
                                    `¿Estás seguro de eliminar este chat permanentemente? Se borrarán ${sess.messageCount} mensajes.`
                                  )
                                ) {
                                  (
                                    el.closest("form") as HTMLFormElement
                                  ).requestSubmit();
                                }
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </Form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Ajustes y Auditoría de Chatbot — Mijal Salud Panel",
};

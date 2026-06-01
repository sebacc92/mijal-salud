import { component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { routeLoader$, routeAction$, zod$, z } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { desc, eq } from "drizzle-orm";

// 1. CARGADOR DE CONTACTOS
export const useContactosLoader = routeLoader$(async () => {
  try {
    const db = getDb();
    const list = await db
      .select()
      .from(schema.contactos)
      .orderBy(desc(schema.contactos.createdAt));
    return list;
  } catch (error) {
    console.error("Error loading contacts:", error);
    return [];
  }
});

// 2. ACCION PARA MARCAR COMO LEIDO / NO LEIDO
export const useToggleLeidoAction = routeAction$(
  async ({ id, leido }) => {
    try {
      const db = getDb();
      await db
        .update(schema.contactos)
        .set({ leido })
        .where(eq(schema.contactos.id, id));
      return { success: true };
    } catch (error) {
      console.error("Error updating contact read state:", error);
      return { success: false, error: "No se pudo actualizar el estado de lectura." };
    }
  },
  zod$({
    id: z.string(),
    leido: z.boolean(),
  })
);

// 3. ACCION PARA ELIMINAR CONTACTO
export const useDeleteContactoAction = routeAction$(
  async ({ id }) => {
    try {
      const db = getDb();
      await db.delete(schema.contactos).where(eq(schema.contactos.id, id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting contact message:", error);
      return { success: false, error: "No se pudo eliminar el registro." };
    }
  },
  zod$({
    id: z.string(),
  })
);

export default component$(() => {
  const contacts = useContactosLoader();
  const toggleLeidoAction = useToggleLeidoAction();
  const deleteContactoAction = useDeleteContactoAction();

  const searchFilter = useSignal("");
  const readFilter = useSignal("");

  // Filtrado reactivo en el cliente
  const filteredContacts = useComputed$(() => {
    return contacts.value.filter((contact) => {
      const matchesSearch =
        contact.nombre.toLowerCase().includes(searchFilter.value.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchFilter.value.toLowerCase()) ||
        (contact.telefono && contact.telefono.includes(searchFilter.value)) ||
        (contact.asunto && contact.asunto.toLowerCase().includes(searchFilter.value.toLowerCase())) ||
        contact.mensaje.toLowerCase().includes(searchFilter.value.toLowerCase());

      const matchesRead =
        readFilter.value === "" ||
        (readFilter.value === "leido" && contact.leido) ||
        (readFilter.value === "no-leido" && !contact.leido);

      return matchesSearch && matchesRead;
    });
  });

  return (
    <div class="space-y-6">
      {/* Encabezado */}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-display font-bold text-navy-900">Mensajes de Contacto Recibidos</h1>
          <p class="text-slate-500 font-body text-sm mt-1">
            Revisá y gestioná las consultas y mensajes generales ingresados desde el formulario de contacto.
          </p>
        </div>
        <div class="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 self-start shadow-sm">
          <span class="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></span>
          <span class="text-xs font-semibold text-navy-900 font-body uppercase tracking-wider">
            {contacts.value.length} Mensajes
          </span>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Buscador */}
        <div class="md:col-span-2 relative">
          <label class="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5 font-body">Buscar mensaje</label>
          <input
            type="text"
            placeholder="Buscar por nombre, email, asunto, teléfono o mensaje..."
            value={searchFilter.value}
            onInput$={(e) => (searchFilter.value = (e.target as HTMLInputElement).value)}
            class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2 text-sm outline-none transition-colors font-body bg-white"
          />
        </div>

        {/* Filtrar por Estado de Lectura */}
        <div>
          <label class="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5 font-body">Estado de Lectura</label>
          <select
            value={readFilter.value}
            onChange$={(e) => (readFilter.value = (e.target as HTMLSelectElement).value)}
            class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body bg-white"
          >
            <option value="">Todos los mensajes</option>
            <option value="no-leido">No leídos</option>
            <option value="leido">Leídos</option>
          </select>
        </div>
      </div>

      {/* Tabla de Contactos */}
      <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {filteredContacts.value.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-16 text-center px-6">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4">📧</div>
            <h3 class="font-display font-bold text-navy-900 text-lg">No hay mensajes registrados</h3>
            <p class="text-slate-500 font-body text-sm max-w-sm mt-1">
              Las consultas de contacto que completen los usuarios en el sitio aparecerán listadas aquí automáticamente.
            </p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/70 border-b border-slate-200">
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Remitente</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Asunto</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Mensaje</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Fecha</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Leído</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-150">
                {filteredContacts.value.map((contact) => {
                  return (
                    <tr
                      key={contact.id}
                      class={[
                        "hover:bg-slate-50/40 transition-colors",
                        !contact.leido && "bg-blue-50/20 font-medium",
                      ].join(" ")}
                    >
                      {/* Remitente */}
                      <td class="px-6 py-4">
                        <div class="font-display font-bold text-navy-900 text-sm leading-snug">{contact.nombre}</div>
                        <div class="text-[10px] text-slate-450 font-body font-mono mt-0.5">{contact.email}</div>
                        {contact.telefono && (
                          <div class="text-[11px] text-slate-500 font-body mt-0.5">📞 {contact.telefono}</div>
                        )}
                      </td>

                      {/* Asunto */}
                      <td class="px-6 py-4 font-body text-sm text-slate-800 font-semibold">
                        {contact.asunto || "Sin Asunto"}
                      </td>

                      {/* Mensaje */}
                      <td class="px-6 py-4 max-w-[280px]">
                        <div class="text-xs text-slate-650 leading-relaxed font-body whitespace-pre-line line-clamp-3 hover:line-clamp-none transition-all duration-300 cursor-pointer">
                          {contact.mensaje}
                        </div>
                      </td>

                      {/* Fecha */}
                      <td class="px-6 py-4 text-xs text-slate-400 font-body">
                        {new Date(contact.createdAt).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Estado Leído */}
                      <td class="px-6 py-4">
                        <button
                          type="button"
                          onClick$={async () => {
                            await toggleLeidoAction.submit({
                              id: contact.id,
                              leido: !contact.leido,
                            });
                          }}
                          class={[
                            "text-xs font-body font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer transition-all",
                            contact.leido
                              ? "text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100"
                              : "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100",
                          ].join(" ")}
                        >
                          {contact.leido ? "✔ Leído" : "📩 Marcar leído"}
                        </button>
                      </td>

                      {/* Acciones */}
                      <td class="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick$={async () => {
                            if (confirm(`¿Estás seguro de que deseas eliminar el mensaje de ${contact.nombre}?`)) {
                              await deleteContactoAction.submit({ id: contact.id });
                            }
                          }}
                          class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Eliminar Mensaje"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Auditoría de Mensajes — Mijal Salud Panel",
};

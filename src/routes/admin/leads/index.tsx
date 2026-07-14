import { component$, useSignal, useComputed$, Fragment } from "@builder.io/qwik";
import { routeLoader$, routeAction$, zod$, z } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { desc, eq } from "drizzle-orm";
import { LEAD_SERVICIOS } from "~/lib/constants";

// 1. CARGADOR DE LEADS
export const useLeadsLoader = routeLoader$(async () => {
  try {
    const db = getDb();
    const list = await db
      .select()
      .from(schema.leads)
      .orderBy(desc(schema.leads.createdAt));
    return list;
  } catch (error) {
    console.error("Error loading leads:", error);
    return [];
  }
});

// 2. ACCION PARA ACTUALIZAR ESTADO DEL LEAD
export const useUpdateLeadEstadoAction = routeAction$(
  async ({ id, estado }) => {
    try {
      const db = getDb();
      await db
        .update(schema.leads)
        .set({ estado })
        .where(eq(schema.leads.id, id));
      return { success: true };
    } catch (error) {
      console.error("Error updating lead state:", error);
      return { success: false, error: "No se pudo actualizar el estado." };
    }
  },
  zod$({
    id: z.string(),
    estado: z.enum(["nuevo", "contactado", "en-proceso", "cerrado"]),
  })
);

// 3. ACCION PARA ELIMINAR LEAD
export const useDeleteLeadAction = routeAction$(
  async ({ id }) => {
    try {
      const db = getDb();
      await db.delete(schema.leads).where(eq(schema.leads.id, id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting lead:", error);
      return { success: false, error: "No se pudo eliminar el registro." };
    }
  },
  zod$({
    id: z.string(),
  })
);

export default component$(() => {
  const leads = useLeadsLoader();
  const updateEstadoAction = useUpdateLeadEstadoAction();
  const deleteLeadAction = useDeleteLeadAction();

  const searchFilter = useSignal("");
  const serviceFilter = useSignal("");
  const segmentFilter = useSignal("");
  const statusFilter = useSignal("");
  const expandedId = useSignal<string | null>(null);

  // Filtrado reactivo en el cliente
  const filteredLeads = useComputed$(() => {
    return leads.value.filter((lead) => {
      const matchesSearch =
        lead.nombre.toLowerCase().includes(searchFilter.value.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchFilter.value.toLowerCase()) ||
        (lead.telefono && lead.telefono.includes(searchFilter.value)) ||
        (lead.empresa && lead.empresa.toLowerCase().includes(searchFilter.value.toLowerCase())) ||
        (lead.mensaje && lead.mensaje.toLowerCase().includes(searchFilter.value.toLowerCase()));

      const matchesService = serviceFilter.value === "" || lead.servicio === serviceFilter.value;
      const matchesSegment = segmentFilter.value === "" || lead.segmento === segmentFilter.value;
      const matchesStatus = statusFilter.value === "" || lead.estado === statusFilter.value;

      return matchesSearch && matchesService && matchesSegment && matchesStatus;
    });
  });

  return (
    <div class="space-y-6">
      {/* Encabezado */}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-display font-bold text-navy-900">Leads de Interés Recibidos</h1>
          <p class="text-slate-500 font-body text-sm mt-1">
            Revisá y gestioná las personas interesadas en planes y servicios corporativos/particulares.
          </p>
        </div>
        <div class="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 self-start shadow-sm">
          <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span class="text-xs font-semibold text-navy-900 font-body uppercase tracking-wider">
            {leads.value.length} Leads
          </span>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Buscador */}
        <div class="relative">
          <label class="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5 font-body">Buscar por texto</label>
          <input
            type="text"
            placeholder="Nombre, email, empresa..."
            value={searchFilter.value}
            onInput$={(e) => (searchFilter.value = (e.target as HTMLInputElement).value)}
            class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2 text-sm outline-none transition-colors font-body bg-white"
          />
        </div>

        {/* Filtrar por Servicio */}
        <div>
          <label class="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5 font-body">Servicio</label>
          <select
            value={serviceFilter.value}
            onChange$={(e) => (serviceFilter.value = (e.target as HTMLSelectElement).value)}
            class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body bg-white"
          >
            <option value="">Todos los servicios</option>
            {LEAD_SERVICIOS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Filtrar por Segmento */}
        <div>
          <label class="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5 font-body">Segmento</label>
          <select
            value={segmentFilter.value}
            onChange$={(e) => (segmentFilter.value = (e.target as HTMLSelectElement).value)}
            class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body bg-white"
          >
            <option value="">Todos los segmentos</option>
            <option value="particular">Particular</option>
            <option value="empresa">Empresa / Pyme</option>
            <option value="obra-social">Obra Social / Prepaga</option>
          </select>
        </div>

        {/* Filtrar por Estado */}
        <div>
          <label class="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5 font-body">Estado</label>
          <select
            value={statusFilter.value}
            onChange$={(e) => (statusFilter.value = (e.target as HTMLSelectElement).value)}
            class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body bg-white"
          >
            <option value="">Todos los estados</option>
            <option value="nuevo">Nuevo</option>
            <option value="contactado">Contactado</option>
            <option value="en-proceso">En Proceso</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </div>
      </div>

      {/* Tabla de Leads */}
      <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {filteredLeads.value.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-16 text-center px-6">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4">👥</div>
            <h3 class="font-display font-bold text-navy-900 text-lg">No hay leads que coincidan</h3>
            <p class="text-slate-500 font-body text-sm max-w-sm mt-1">
              Las consultas de leads recibidas se visualizarán en esta lista automáticamente.
            </p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/70 border-b border-slate-200">
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Cliente</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Contacto / Empresa</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Interés / Segmento</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Mensaje</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Fecha</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Estado</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-150">
                {filteredLeads.value.map((lead) => {
                  const isExpanded = expandedId.value === lead.id;
                  const waPhone = lead.telefono ? lead.telefono.replace(/\D/g, "") : "";
                  return (
                    <Fragment key={lead.id}>
                    <tr
                      onClick$={() => (expandedId.value = isExpanded ? null : lead.id)}
                      class={[
                        "cursor-pointer transition-colors",
                        isExpanded ? "bg-slate-50" : "hover:bg-slate-50/40",
                      ]}
                    >
                      {/* Cliente */}
                      <td class="px-6 py-4 align-top">
                        <div class="flex items-start gap-2">
                          <svg
                            class={["w-4 h-4 mt-0.5 text-slate-400 shrink-0 transition-transform", isExpanded ? "rotate-90" : ""]}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2.5}
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                          <div>
                            <div class="font-display font-bold text-navy-900 text-sm leading-snug">{lead.nombre}</div>
                            <div class="text-[10px] text-slate-400 font-body font-mono mt-0.5">ID: {lead.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contacto / Empresa */}
                      <td class="px-6 py-4 font-body align-top">
                        <a
                          href={`mailto:${lead.email}`}
                          onClick$={(e) => e.stopPropagation()}
                          class="text-sm font-semibold text-slate-700 hover:text-verde-600 underline underline-offset-2 decoration-slate-300 break-all"
                        >
                          {lead.email}
                        </a>
                        {waPhone ? (
                          <a
                            href={`https://wa.me/${waPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick$={(e) => e.stopPropagation()}
                            class="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-semibold mt-1 w-fit"
                            title="Abrir chat de WhatsApp"
                          >
                            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            {lead.telefono}
                          </a>
                        ) : (
                          <div class="text-xs text-slate-450 mt-1">Sin teléfono</div>
                        )}
                        {lead.empresa && (
                          <div class="text-xs font-semibold text-verde-600 mt-1">🏢 {lead.empresa}</div>
                        )}
                      </td>

                      {/* Interés / Segmento */}
                      <td class="px-6 py-4 font-body">
                        <span class="inline-block bg-navy-50 text-navy-700 text-xs font-semibold px-2.5 py-1 rounded-md capitalize mb-1">
                          {lead.servicio.replace("-", " ")}
                        </span>
                        <div class="text-xs text-slate-500 font-medium">
                          Segmento: <span class="capitalize text-slate-700 font-semibold">{lead.segmento.replace("-", " ")}</span>
                        </div>
                      </td>

                      {/* Mensaje (preview; completo al expandir la fila) */}
                      <td class="px-6 py-4 align-top">
                        {lead.mensaje ? (
                          <div class="max-w-[200px] text-xs text-slate-600 line-clamp-2 font-body leading-relaxed">
                            {lead.mensaje}
                          </div>
                        ) : (
                          <span class="text-xs text-slate-350 italic font-body">Sin mensaje</span>
                        )}
                      </td>

                      {/* Fecha */}
                      <td class="px-6 py-4 text-xs text-slate-400 font-body align-top">
                        {new Date(lead.createdAt).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Estado */}
                      <td class="px-6 py-4 align-top" onClick$={(e) => e.stopPropagation()}>
                        <select
                          value={lead.estado || "nuevo"}
                          onChange$={async (e) => {
                            const val = (e.target as HTMLSelectElement).value;
                            await updateEstadoAction.submit({
                              id: lead.id,
                              estado: val as any,
                            });
                          }}
                          class={[
                            "text-xs font-body font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer transition-colors bg-white",
                            lead.estado === "nuevo" && "text-emerald-700 bg-emerald-50 border-emerald-200 focus:border-emerald-400",
                            lead.estado === "contactado" && "text-blue-600 bg-blue-50 border-blue-200 focus:border-blue-400",
                            lead.estado === "en-proceso" && "text-amber-600 bg-amber-50 border-amber-200 focus:border-amber-400",
                            lead.estado === "cerrado" && "text-slate-500 bg-slate-50 border-slate-200 focus:border-slate-400",
                          ].join(" ")}
                        >
                          <option value="nuevo">📥 Nuevo</option>
                          <option value="contactado">📞 Contactado</option>
                          <option value="en-proceso">⚙️ En Proceso</option>
                          <option value="cerrado">✅ Cerrado</option>
                        </select>
                      </td>

                      {/* Acciones */}
                      <td class="px-6 py-4 text-right align-top" onClick$={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick$={async () => {
                            if (confirm(`¿Estás seguro de que deseas eliminar el lead de ${lead.nombre}?`)) {
                              await deleteLeadAction.submit({ id: lead.id });
                            }
                          }}
                          class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Eliminar Lead"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr class="bg-slate-50">
                        <td colSpan={7} class="px-6 pb-5 pt-0">
                          <div class="rounded-xl border border-slate-200 bg-white p-4">
                            <div class="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5 font-body">
                              Mensaje completo
                            </div>
                            <p class="text-sm text-slate-700 font-body leading-relaxed whitespace-pre-wrap">
                              {lead.mensaje || "— El lead no dejó mensaje —"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                    </Fragment>
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
  title: "Auditoría de Leads — Mijal Salud Panel",
};

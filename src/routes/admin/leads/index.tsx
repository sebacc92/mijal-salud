import { component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { routeLoader$, routeAction$, zod$, z } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { desc, eq } from "drizzle-orm";

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
            <option value="salud-directa">Mijal Salud Directa</option>
            <option value="care-ia">Mijal Care IA</option>
            <option value="prevencion-activa">Prevención Activa</option>
            <option value="salud-360">Mijal Salud 360</option>
            <option value="conecta-salud">Conecta Salud</option>
            <option value="area-protegida">Área protegida</option>
            <option value="cobertura-evento">Cobertura de evento</option>
            <option value="proteccion-empresa">Protección para tu empresa</option>
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
                  return (
                    <tr key={lead.id} class="hover:bg-slate-50/40 transition-colors">
                      {/* Cliente */}
                      <td class="px-6 py-4">
                        <div class="font-display font-bold text-navy-900 text-sm leading-snug">{lead.nombre}</div>
                        <div class="text-[10px] text-slate-400 font-body font-mono mt-0.5">ID: {lead.id.substring(0, 8)}</div>
                      </td>

                      {/* Contacto / Empresa */}
                      <td class="px-6 py-4 font-body">
                        <div class="text-sm font-semibold text-slate-700">{lead.email}</div>
                        <div class="text-xs text-slate-450 mt-0.5">{lead.telefono || "Sin teléfono"}</div>
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

                      {/* Mensaje */}
                      <td class="px-6 py-4">
                        {lead.mensaje ? (
                          <div class="max-w-[200px] text-xs text-slate-600 line-clamp-2 hover:line-clamp-none font-body leading-relaxed transition-all duration-200 cursor-pointer">
                            {lead.mensaje}
                          </div>
                        ) : (
                          <span class="text-xs text-slate-350 italic font-body">Sin mensaje</span>
                        )}
                      </td>

                      {/* Fecha */}
                      <td class="px-6 py-4 text-xs text-slate-400 font-body">
                        {new Date(lead.createdAt).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Estado */}
                      <td class="px-6 py-4">
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
                      <td class="px-6 py-4 text-right">
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

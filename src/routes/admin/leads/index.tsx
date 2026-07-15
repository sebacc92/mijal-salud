import { component$, useSignal, useComputed$, Fragment } from "@builder.io/qwik";
import { routeLoader$, routeAction$, zod$, z } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { desc, eq } from "drizzle-orm";
import { LEAD_SERVICIOS } from "~/lib/constants";

// Estados de un lead: fuente única de verdad para etiquetas y colores, usada
// en los contadores, el badge/select y cualquier otro lugar del panel.
// nuevo = verde, contactado = amarillo, en-proceso = azul, cerrado = gris.
const ESTADOS = [
  {
    value: "nuevo",
    label: "Nuevo",
    emoji: "📥",
    dot: "bg-emerald-500",
    count: "text-emerald-700",
    active: "bg-emerald-50 border-emerald-300 ring-emerald-200",
    pill: "text-emerald-700 bg-emerald-50 border-emerald-200 focus:border-emerald-400",
  },
  {
    value: "contactado",
    label: "Contactado",
    emoji: "📞",
    dot: "bg-amber-400",
    count: "text-amber-700",
    active: "bg-amber-50 border-amber-300 ring-amber-200",
    pill: "text-amber-700 bg-amber-50 border-amber-200 focus:border-amber-400",
  },
  {
    value: "en-proceso",
    label: "En proceso",
    emoji: "⚙️",
    dot: "bg-blue-500",
    count: "text-blue-700",
    active: "bg-blue-50 border-blue-300 ring-blue-200",
    pill: "text-blue-700 bg-blue-50 border-blue-200 focus:border-blue-400",
  },
  {
    value: "cerrado",
    label: "Cerrado",
    emoji: "✅",
    dot: "bg-slate-400",
    count: "text-slate-600",
    active: "bg-slate-100 border-slate-300 ring-slate-200",
    pill: "text-slate-600 bg-slate-100 border-slate-200 focus:border-slate-400",
  },
] as const;

const ESTADO_MAP = Object.fromEntries(ESTADOS.map((e) => [e.value, e]));
const estadoInfo = (estado: string | null) =>
  ESTADO_MAP[estado || "nuevo"] ?? ESTADOS[0];

// Path del ícono de WhatsApp (se reutiliza en varios lugares).
const WA_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z";

// Columnas de la grilla (desktop). Se comparten entre header y filas.
const GRID_COLS =
  "lg:grid-cols-[1.3fr_1.9fr_1.3fr_1.7fr_1fr_1.15fr_2.5rem]";

// ─── Utilidades de fecha ────────────────────────────────────────────────────
// createdAt viene como "YYYY-MM-DD HH:MM:SS" (UTC) o ISO; se normaliza a UTC.
function parseDate(iso: string): Date {
  return new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
}

function formatRelative(iso: string): string {
  const d = parseDate(iso);
  if (isNaN(d.getTime())) return "—";
  const sec = Math.round((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return "recién";
  const min = Math.round(sec / 60);
  if (min < 60) return `hace ${min} min`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `hace ${hr} h`;
  const day = Math.round(hr / 24);
  if (day === 1) return "ayer";
  if (day < 30) return `hace ${day} días`;
  const month = Math.round(day / 30);
  if (month < 12) return `hace ${month} ${month === 1 ? "mes" : "meses"}`;
  const year = Math.round(day / 365);
  return `hace ${year} ${year === 1 ? "año" : "años"}`;
}

function formatExact(iso: string): string {
  const d = parseDate(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ¿El lead cae dentro del rango elegido? "" = cualquier fecha.
function matchesDateRange(iso: string, range: string): boolean {
  if (!range) return true;
  const created = parseDate(iso).getTime();
  if (isNaN(created)) return false;
  if (range === "hoy") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return created >= start.getTime();
  }
  const days = range === "7d" ? 7 : 30;
  return Date.now() - created <= days * 24 * 60 * 60 * 1000;
}

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
  }),
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
  }),
);

export default component$(() => {
  const leads = useLeadsLoader();
  const updateEstadoAction = useUpdateLeadEstadoAction();
  const deleteLeadAction = useDeleteLeadAction();

  const searchFilter = useSignal("");
  const serviceFilter = useSignal("");
  const segmentFilter = useSignal("");
  const statusFilter = useSignal("");
  const dateFilter = useSignal(""); // "" | "hoy" | "7d" | "30d"
  const sortDir = useSignal<"desc" | "asc">("desc");
  const expandedId = useSignal<string | null>(null);

  // Conteo por estado (sobre todos los leads, para los contadores).
  const counts = useComputed$(() => {
    const c: Record<string, number> = {
      nuevo: 0,
      contactado: 0,
      "en-proceso": 0,
      cerrado: 0,
    };
    for (const l of leads.value) {
      const e = l.estado || "nuevo";
      c[e] = (c[e] ?? 0) + 1;
    }
    return c;
  });

  // Filtrado reactivo en el cliente
  const filteredLeads = useComputed$(() => {
    const q = searchFilter.value.toLowerCase();
    return leads.value.filter((lead) => {
      const matchesSearch =
        lead.nombre.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.telefono && lead.telefono.includes(searchFilter.value)) ||
        (lead.empresa && lead.empresa.toLowerCase().includes(q)) ||
        (lead.mensaje && lead.mensaje.toLowerCase().includes(q));

      const matchesService =
        serviceFilter.value === "" || lead.servicio === serviceFilter.value;
      const matchesSegment =
        segmentFilter.value === "" || lead.segmento === segmentFilter.value;
      const matchesStatus =
        statusFilter.value === "" || (lead.estado || "nuevo") === statusFilter.value;
      const matchesDate = matchesDateRange(lead.createdAt, dateFilter.value);

      return (
        matchesSearch &&
        matchesService &&
        matchesSegment &&
        matchesStatus &&
        matchesDate
      );
    });
  });

  // Orden por fecha según el header clickeable.
  const visibleLeads = useComputed$(() => {
    const arr = [...filteredLeads.value];
    arr.sort((a, b) => {
      const ta = parseDate(a.createdAt).getTime();
      const tb = parseDate(b.createdAt).getTime();
      return sortDir.value === "asc" ? ta - tb : tb - ta;
    });
    return arr;
  });

  const anyFilterActive = useComputed$(
    () =>
      searchFilter.value !== "" ||
      serviceFilter.value !== "" ||
      segmentFilter.value !== "" ||
      statusFilter.value !== "" ||
      dateFilter.value !== "",
  );

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
      </div>

      {/* Contadores por estado (clickeables = filtro rápido) */}
      <div class="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          type="button"
          onClick$={() => (statusFilter.value = "")}
          class={[
            "flex items-center gap-2.5 rounded-xl border px-4 py-2.5 shrink-0 transition-all",
            statusFilter.value === ""
              ? "bg-navy-900 border-navy-900 text-white ring-2 ring-navy-200"
              : "bg-white border-slate-200 hover:border-slate-300",
          ]}
        >
          <span class={statusFilter.value === "" ? "text-sm font-semibold text-white" : "text-sm font-semibold text-navy-900"}>
            Todos
          </span>
          <span class={statusFilter.value === "" ? "text-sm font-black text-white" : "text-sm font-black text-navy-900"}>
            {leads.value.length}
          </span>
        </button>

        {ESTADOS.map((e) => {
          const isActive = statusFilter.value === e.value;
          return (
            <button
              key={e.value}
              type="button"
              onClick$={() => (statusFilter.value = isActive ? "" : e.value)}
              class={[
                "flex items-center gap-2.5 rounded-xl border px-4 py-2.5 shrink-0 transition-all",
                isActive ? `${e.active} ring-2` : "bg-white border-slate-200 hover:border-slate-300",
              ]}
            >
              <span class={["w-2.5 h-2.5 rounded-full shrink-0", e.dot]}></span>
              <span class="text-sm font-semibold text-navy-900 whitespace-nowrap">{e.label}</span>
              <span class={["text-sm font-black", e.count]}>{counts.value[e.value] ?? 0}</span>
            </button>
          );
        })}
      </div>

      {/* Barra de Filtros */}
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Buscador */}
        <div class="relative">
          <label class="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5 font-body">Buscar por texto</label>
          <input
            type="text"
            placeholder="Nombre, email, empresa..."
            value={searchFilter.value}
            onInput$={(e) => (searchFilter.value = (e.target as HTMLInputElement).value)}
            class="w-full border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body bg-white"
          />
        </div>

        {/* Filtrar por Servicio */}
        <div>
          <label class="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5 font-body">Servicio</label>
          <select
            value={serviceFilter.value}
            onChange$={(e) => (serviceFilter.value = (e.target as HTMLSelectElement).value)}
            class="w-full border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body bg-white"
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
            class="w-full border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body bg-white"
          >
            <option value="">Todos los segmentos</option>
            <option value="particular">Particular</option>
            <option value="empresa">Empresa / Pyme</option>
            <option value="obra-social">Obra Social / Prepaga</option>
          </select>
        </div>

        {/* Filtrar por Fecha */}
        <div>
          <label class="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5 font-body">Fecha</label>
          <select
            value={dateFilter.value}
            onChange$={(e) => (dateFilter.value = (e.target as HTMLSelectElement).value)}
            class="w-full border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body bg-white"
          >
            <option value="">Cualquier fecha</option>
            <option value="hoy">Hoy</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
          </select>
        </div>
      </div>

      {/* Lista de Leads */}
      <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header de columnas (sólo desktop) */}
        <div class={["hidden lg:grid gap-x-4 px-5 py-3 bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-450 uppercase tracking-wider font-body", GRID_COLS]}>
          <div>Cliente</div>
          <div>Contacto / Empresa</div>
          <div>Interés / Segmento</div>
          <div>Mensaje</div>
          <div>
            <button
              type="button"
              onClick$={() => (sortDir.value = sortDir.value === "desc" ? "asc" : "desc")}
              class="flex items-center gap-1 uppercase tracking-wider text-slate-450 hover:text-navy-900 transition-colors"
              title={sortDir.value === "desc" ? "Más nuevos primero" : "Más viejos primero"}
            >
              Fecha
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={3}>
                <path stroke-linecap="round" stroke-linejoin="round" d={sortDir.value === "desc" ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
              </svg>
            </button>
          </div>
          <div>Estado</div>
          <div class="text-right"></div>
        </div>

        {visibleLeads.value.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-16 text-center px-6">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4">
              {anyFilterActive.value ? "🔍" : "👥"}
            </div>
            <h3 class="font-display font-bold text-navy-900 text-lg">
              {anyFilterActive.value ? "Ningún lead coincide con los filtros" : "Todavía no hay leads"}
            </h3>
            <p class="text-slate-500 font-body text-sm max-w-sm mt-1">
              {anyFilterActive.value
                ? "Probá ajustar la búsqueda, el estado o los filtros de servicio y segmento."
                : "Las consultas recibidas desde el sitio se van a listar acá automáticamente."}
            </p>
            {anyFilterActive.value && (
              <button
                type="button"
                onClick$={() => {
                  searchFilter.value = "";
                  serviceFilter.value = "";
                  segmentFilter.value = "";
                  statusFilter.value = "";
                  dateFilter.value = "";
                }}
                class="mt-4 text-verde-600 hover:text-verde-700 font-semibold text-sm underline underline-offset-4"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div class="p-3 lg:p-0 space-y-3 lg:space-y-0 lg:divide-y lg:divide-slate-100">
            {visibleLeads.value.map((lead) => {
              const isExpanded = expandedId.value === lead.id;
              const waPhone = lead.telefono ? lead.telefono.replace(/\D/g, "") : "";
              const est = estadoInfo(lead.estado);
              return (
                <div
                  key={lead.id}
                  class="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden lg:border-0 lg:rounded-none lg:shadow-none"
                >
                  <div
                    onClick$={() => (expandedId.value = isExpanded ? null : lead.id)}
                    class={[
                      "grid grid-cols-1 gap-x-4 gap-y-2.5 p-4 lg:px-5 lg:items-start cursor-pointer transition-colors",
                      GRID_COLS,
                      isExpanded ? "bg-slate-50" : "hover:bg-slate-50/40",
                    ]}
                  >
                    {/* Cliente */}
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

                    {/* Contacto / Empresa */}
                    <div class="font-body min-w-0">
                      <span class="lg:hidden block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Contacto</span>
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
                          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={WA_PATH} /></svg>
                          {lead.telefono}
                        </a>
                      ) : (
                        <div class="text-xs text-slate-450 mt-1">Sin teléfono</div>
                      )}
                      {lead.empresa && (
                        <div class="text-xs font-semibold text-verde-600 mt-1">🏢 {lead.empresa}</div>
                      )}
                    </div>

                    {/* Interés / Segmento */}
                    <div class="font-body">
                      <span class="lg:hidden block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Interés</span>
                      <span class="inline-block bg-navy-50 text-navy-700 text-xs font-semibold px-2.5 py-1 rounded-md capitalize mb-1">
                        {lead.servicio.replace(/-/g, " ")}
                      </span>
                      <div class="text-xs text-slate-500 font-medium">
                        Segmento: <span class="capitalize text-slate-700 font-semibold">{lead.segmento.replace(/-/g, " ")}</span>
                      </div>
                    </div>

                    {/* Mensaje (preview; completo al expandir) */}
                    <div>
                      <span class="lg:hidden block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Mensaje</span>
                      {lead.mensaje ? (
                        <div class="text-xs text-slate-600 line-clamp-2 font-body leading-relaxed">
                          {lead.mensaje}
                        </div>
                      ) : (
                        <span class="text-xs text-slate-350 italic font-body">Sin mensaje</span>
                      )}
                    </div>

                    {/* Fecha (relativa; exacta en el tooltip) */}
                    <div class="text-xs text-slate-500 font-body">
                      <span class="lg:hidden block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Fecha</span>
                      <span class="cursor-help border-b border-dotted border-slate-300" title={formatExact(lead.createdAt)}>
                        {formatRelative(lead.createdAt)}
                      </span>
                    </div>

                    {/* Estado */}
                    <div onClick$={(e) => e.stopPropagation()}>
                      <span class="lg:hidden block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Estado</span>
                      <select
                        value={lead.estado || "nuevo"}
                        onChange$={async (e) => {
                          const val = (e.target as HTMLSelectElement).value;
                          await updateEstadoAction.submit({ id: lead.id, estado: val as any });
                        }}
                        class={[
                          "text-xs font-body font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer transition-colors w-full lg:w-auto",
                          est.pill,
                        ]}
                      >
                        {ESTADOS.map((e) => (
                          <option key={e.value} value={e.value}>{`${e.emoji} ${e.label}`}</option>
                        ))}
                      </select>
                    </div>

                    {/* Acciones */}
                    <div class="lg:justify-self-end" onClick$={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick$={async () => {
                          if (confirm(`¿Estás seguro de que deseas eliminar el lead de ${lead.nombre}?`)) {
                            await deleteLeadAction.submit({ id: lead.id });
                          }
                        }}
                        class="inline-flex items-center gap-1.5 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Eliminar Lead"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span class="lg:hidden text-xs font-semibold">Eliminar</span>
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div class="border-t border-slate-100 bg-slate-50 p-4 lg:px-5">
                      <div class="rounded-xl border border-slate-200 bg-white p-4">
                        <div class="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5 font-body">
                          Mensaje completo
                        </div>
                        <p class="text-sm text-slate-700 font-body leading-relaxed whitespace-pre-wrap">
                          {lead.mensaje || "— El lead no dejó mensaje —"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Auditoría de Leads — Mijal Salud Panel",
};

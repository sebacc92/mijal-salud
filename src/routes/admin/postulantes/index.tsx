import { component$, useSignal, useComputed$ } from "@builder.io/qwik";
import { routeLoader$, routeAction$, zod$, z } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { desc, eq } from "drizzle-orm";

// 1. CARGADOR DE POSTULANTES
export const usePostulantesLoader = routeLoader$(async () => {
  try {
    const db = getDb();
    const list = await db
      .select()
      .from(schema.postulantes)
      .orderBy(desc(schema.postulantes.createdAt));
    return list;
  } catch (error) {
    console.error("Error loading applicants:", error);
    return [];
  }
});

// 2. ACCION PARA ACTUALIZAR ESTADO DEL POSTULANTE
export const useUpdateEstadoAction = routeAction$(
  async ({ id, estado }) => {
    try {
      const db = getDb();
      await db
        .update(schema.postulantes)
        .set({ estado })
        .where(eq(schema.postulantes.id, id));
      return { success: true };
    } catch (error) {
      console.error("Error updating applicant state:", error);
      return { success: false, error: "No se pudo actualizar el estado." };
    }
  },
  zod$({
    id: z.string(),
    estado: z.enum(["recibido", "en-revision", "entrevista", "descartado"]),
  })
);

// 3. ACCION PARA ELIMINAR POSTULANTE
export const useDeletePostulanteAction = routeAction$(
  async ({ id }) => {
    try {
      const db = getDb();
      await db.delete(schema.postulantes).where(eq(schema.postulantes.id, id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting applicant:", error);
      return { success: false, error: "No se pudo eliminar el registro." };
    }
  },
  zod$({
    id: z.string(),
  })
);

export default component$(() => {
  const applicants = usePostulantesLoader();
  const updateEstadoAction = useUpdateEstadoAction();
  const deletePostulanteAction = useDeletePostulanteAction();

  const searchFilter = useSignal("");
  const roleFilter = useSignal("");
  const statusFilter = useSignal("");

  // Filtrado reactivo en el cliente
  const filteredApplicants = useComputed$(() => {
    return applicants.value.filter((app) => {
      const matchesSearch =
        app.nombre.toLowerCase().includes(searchFilter.value.toLowerCase()) ||
        app.email.toLowerCase().includes(searchFilter.value.toLowerCase()) ||
        app.telefono.includes(searchFilter.value) ||
        (app.mensaje && app.mensaje.toLowerCase().includes(searchFilter.value.toLowerCase()));

      const matchesRole = roleFilter.value === "" || app.rol === roleFilter.value;
      const matchesStatus = statusFilter.value === "" || app.estado === statusFilter.value;

      return matchesSearch && matchesRole && matchesStatus;
    });
  });

  // Lista de roles únicos presentes en la base de datos
  const uniqueRoles = useComputed$(() => {
    const rolesSet = new Set<string>();
    applicants.value.forEach((app) => {
      if (app.rol) rolesSet.add(app.rol);
    });
    return Array.from(rolesSet);
  });

  return (
    <div class="space-y-6">
      {/* Encabezado */}
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-display font-bold text-navy-900">Postulantes CV (Sumate a Staff)</h1>
          <p class="text-slate-500 font-body text-sm mt-1">
            Revisá y gestioná los perfiles y currículums de los profesionales postulados.
          </p>
        </div>
        <div class="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 self-start shadow-sm">
          <span class="w-2.5 h-2.5 bg-verde-500 rounded-full animate-pulse"></span>
          <span class="text-xs font-semibold text-navy-900 font-body uppercase tracking-wider">
            {applicants.value.length} Postulaciones
          </span>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Buscador */}
        <div class="md:col-span-2 relative">
          <label class="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5 font-body">Buscar postulante</label>
          <input
            type="text"
            placeholder="Buscar por nombre, email, teléfono o mensaje..."
            value={searchFilter.value}
            onInput$={(e) => (searchFilter.value = (e.target as HTMLInputElement).value)}
            class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body"
          />
        </div>

        {/* Filtrar por Rol */}
        <div>
          <label class="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5 font-body font-semibold">Filtrar por Rol</label>
          <select
            value={roleFilter.value}
            onChange$={(e) => (roleFilter.value = (e.target as HTMLSelectElement).value)}
            class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body bg-white"
          >
            <option value="">Todos los roles</option>
            {uniqueRoles.value.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Filtrar por Estado */}
        <div>
          <label class="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5 font-body font-semibold">Filtrar por Estado</label>
          <select
            value={statusFilter.value}
            onChange$={(e) => (statusFilter.value = (e.target as HTMLSelectElement).value)}
            class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body bg-white"
          >
            <option value="">Todos los estados</option>
            <option value="recibido">Recibidos</option>
            <option value="en-revision">En Revisión</option>
            <option value="entrevista">Entrevista Coordinada</option>
            <option value="descartado">Descartados</option>
          </select>
        </div>
      </div>

      {/* Tabla de Postulantes */}
      <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {filteredApplicants.value.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-16 text-center px-6">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4">💼</div>
            <h3 class="font-display font-bold text-navy-900 text-lg">No hay postulaciones registradas</h3>
            <p class="text-slate-500 font-body text-sm max-w-sm mt-1">
              Las personas que se postulen desde el sitio aparecerán listadas aquí automáticamente.
            </p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/70 border-b border-slate-200">
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Postulante</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Contacto</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Rol / Fecha</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Mensaje</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Currículum</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Estado</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-150">
                {filteredApplicants.value.map((app) => {
                  return (
                    <tr key={app.id} class="hover:bg-slate-50/40 transition-colors">
                      {/* Postulante */}
                      <td class="px-6 py-4">
                        <div class="font-display font-bold text-navy-900 text-sm leading-snug">{app.nombre}</div>
                        <div class="text-[10px] text-slate-400 font-body font-mono mt-0.5">ID: {app.id.substring(0, 8)}</div>
                      </td>

                      {/* Contacto */}
                      <td class="px-6 py-4">
                        <div class="text-sm font-body font-semibold text-slate-700">{app.email}</div>
                        <div class="text-xs font-body text-slate-450 mt-0.5">{app.telefono}</div>
                      </td>

                      {/* Rol y Fecha */}
                      <td class="px-6 py-4">
                        <span class="inline-block bg-slate-100 text-slate-700 text-xs font-body font-semibold px-2.5 py-1 rounded-md">
                          {app.rol || "No especificado"}
                        </span>
                        <div class="text-[11px] text-slate-400 font-body mt-1">
                          {new Date(app.createdAt).toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Mensaje */}
                      <td class="px-6 py-4">
                        {app.mensaje ? (
                          <div class="max-w-[180px] text-xs text-slate-600 line-clamp-2 hover:line-clamp-none font-body leading-relaxed transition-all duration-200 cursor-pointer">
                            {app.mensaje}
                          </div>
                        ) : (
                          <span class="text-xs text-slate-350 italic font-body">Sin mensaje</span>
                        )}
                      </td>

                      {/* CV Download / Preview */}
                      <td class="px-6 py-4">
                        {app.cvUrl ? (
                          <a
                            href={app.cvUrl}
                            download={`CV-${app.nombre.replace(/\s+/g, "-")}.pdf`}
                            class="inline-flex items-center gap-1.5 bg-verde-500 hover:bg-verde-600 text-white font-display text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2.5}>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Descargar CV
                          </a>
                        ) : (
                          <span class="text-xs text-red-400 font-body font-medium italic">Sin archivo</span>
                        )}
                      </td>

                      {/* Estado */}
                      <td class="px-6 py-4">
                        <select
                          value={app.estado || "recibido"}
                          onChange$={async (e) => {
                            const val = (e.target as HTMLSelectElement).value;
                            await updateEstadoAction.submit({
                              id: app.id,
                              estado: val as any,
                            });
                          }}
                          class={[
                            "text-xs font-body font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer transition-colors bg-white",
                            app.estado === "recibido" && "text-blue-600 bg-blue-50 border-blue-200 focus:border-blue-400",
                            app.estado === "en-revision" && "text-amber-600 bg-amber-50 border-amber-200 focus:border-amber-400",
                            app.estado === "entrevista" && "text-verde-700 bg-verde-50 border-verde-200 focus:border-verde-400",
                            app.estado === "descartado" && "text-slate-500 bg-slate-50 border-slate-200 focus:border-slate-400",
                          ].join(" ")}
                        >
                          <option value="recibido">📥 Recibido</option>
                          <option value="en-revision">🔍 En Revisión</option>
                          <option value="entrevista">📅 Entrevista</option>
                          <option value="descartado">❌ Descartado</option>
                        </select>
                      </td>

                      {/* Acciones */}
                      <td class="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick$={async () => {
                            if (confirm(`¿Estás seguro de que deseas eliminar la postulación de ${app.nombre}?`)) {
                              await deletePostulanteAction.submit({ id: app.id });
                            }
                          }}
                          class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Eliminar postulante"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
  title: "Auditoría de Postulantes — Mijal Salud Panel",
};

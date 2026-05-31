import { component$ } from '@builder.io/qwik';
import { Form, Link, routeAction$, routeLoader$, z, zod$, type DocumentHead } from '@builder.io/qwik-city';
import { getDb, schema } from '~/db';
import { eq, asc } from 'drizzle-orm';

export const useVerticalVideosAdminLoader = routeLoader$(async () => {
  try {
    const db = getDb();
    return await db.select().from(schema.verticalVideos).orderBy(asc(schema.verticalVideos.displayOrder));
  } catch (error) {
    console.error("Error loading vertical videos:", error);
    return [];
  }
});

export const useDeleteVerticalVideoAction = routeAction$(
  async (data) => {
    try {
      const db = getDb();
      await db.delete(schema.verticalVideos).where(eq(schema.verticalVideos.id, data.id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting vertical video:", error);
      return { success: false, error: 'No se pudo eliminar el video.' };
    }
  },
  zod$({ id: z.string().min(1) }),
);

export default component$(() => {
  const videosLoader = useVerticalVideosAdminLoader();
  const deleteAction = useDeleteVerticalVideoAction();
  const videosList = videosLoader.value;

  return (
    <div class="space-y-6">
      {/* Page Header */}
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-display font-bold text-navy-900">Videos Verticales (Reels)</h1>
          <p class="text-slate-500 font-body text-sm mt-1">
            {videosList.length} video{videosList.length !== 1 ? 's' : ''} registrado{videosList.length !== 1 ? 's' : ''} en la página principal.
          </p>
        </div>
        <Link
          href="/admin/videos-verticales/new"
          class="inline-flex items-center gap-2 bg-verde-500 hover:bg-verde-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2.5}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Video
        </Link>
      </div>

      {/* No Data State */}
      {videosList.length === 0 && (
        <div class="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
          <p class="text-4xl mb-4">📱</p>
          <h3 class="font-display font-bold text-navy-900 text-lg">No hay videos registrados</h3>
          <p class="text-slate-500 font-body text-sm mt-1 max-w-sm mx-auto">
            Subí reels o videos cortos para mostrar en formato vertical interactivo.
          </p>
          <Link href="/admin/videos-verticales/new" class="inline-block mt-4 text-sm text-verde-600 font-semibold hover:underline">
            + Crear primer video
          </Link>
        </div>
      )}

      {/* Table List */}
      {videosList.length > 0 && (
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-250">
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Miniatura</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Título</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Estado</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body">Orden</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-450 uppercase tracking-wider font-body text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-150">
                {videosList.map((video) => (
                  <tr
                    key={video.id}
                    class="hover:bg-slate-50/40 transition-colors"
                  >
                    {/* Thumbnail */}
                    <td class="px-6 py-3">
                      <div class="w-10 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                        {video.thumbnailUrl ? (
                           <img src={video.thumbnailUrl} alt={video.title} class="w-full h-full object-cover" loading="lazy" />
                        ) : (
                           <span class="text-[10px] text-slate-400 font-body">Sin portada</span>
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td class="px-6 py-3">
                      <div class="font-display font-bold text-navy-900 text-sm leading-snug">{video.title}</div>
                      <div class="text-[10px] text-slate-400 font-mono mt-0.5">ID: {video.id.slice(0, 8)}</div>
                    </td>

                    {/* State */}
                    <td class="px-6 py-3">
                      {video.isActive === 1 ? (
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-verde-50 text-verde-700 border border-verde-200">
                          <span class="w-1.5 h-1.5 rounded-full bg-verde-500 animate-pulse"></span>
                          Activo
                        </span>
                      ) : (
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Inactivo
                        </span>
                      )}
                    </td>

                    {/* Display Order */}
                    <td class="px-6 py-3 text-slate-500 font-mono text-xs">{video.displayOrder}</td>

                    {/* Actions */}
                    <td class="px-6 py-3">
                      <div class="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/videos-verticales/${video.id}/edit`}
                          class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2.2}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </Link>
                        <Form action={deleteAction}>
                          <input type="hidden" name="id" value={video.id} />
                          <button
                            type="submit"
                            class="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            onClick$={(e) => {
                              if (!confirm(`¿Eliminar el video "${video.title}"?`)) e.preventDefault();
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2.2}>
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </button>
                        </Form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Gestión de Videos Verticales — Mijal Salud Panel',
};

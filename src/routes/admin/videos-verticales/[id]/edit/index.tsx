import { $, component$, useSignal } from '@builder.io/qwik';
import { Link, routeAction$, routeLoader$, z, zod$, type DocumentHead } from '@builder.io/qwik-city';
import { getDb, schema } from '~/db';
import { eq } from 'drizzle-orm';

export const useVerticalVideoLoader = routeLoader$(async (requestEvent) => {
  try {
    const db = getDb();
    const id = requestEvent.params.id;
    const list = await db.select().from(schema.verticalVideos).where(eq(schema.verticalVideos.id, id));
    const video = list[0];
    if (!video) {
      throw requestEvent.redirect(302, '/admin/videos-verticales');
    }
    return video;
  } catch (error) {
    console.error("Error loading video details:", error);
    throw requestEvent.redirect(302, '/admin/videos-verticales');
  }
});

export const useEditVerticalVideoAction = routeAction$(
  async (data, requestEvent) => {
    const finalVideoUrl = typeof data.videoUrl === 'string' && data.videoUrl.length > 0 ? data.videoUrl : undefined;
    if (!finalVideoUrl) {
      return requestEvent.fail(400, {
        error: 'Debe proporcionar una URL de video o subir un archivo válido.',
      });
    }

    const finalThumbnailUrl = typeof data.thumbnailUrl === 'string' && data.thumbnailUrl.length > 0 ? data.thumbnailUrl : undefined;

    try {
      const db = getDb();
      const id = requestEvent.params.id;
      await db
        .update(schema.verticalVideos)
        .set({
          title: data.title,
          videoUrl: finalVideoUrl,
          thumbnailUrl: finalThumbnailUrl || null,
          displayOrder: Number(data.displayOrder) || 0,
          isActive: data.isActive === 'on' || data.isActive === 'true' ? 1 : 0,
        })
        .where(eq(schema.verticalVideos.id, id));
    } catch (error) {
      console.error("Error updating vertical video:", error);
      return requestEvent.fail(500, {
        error: 'Error interno al guardar los cambios.',
      });
    }
    
    throw requestEvent.redirect(302, '/admin/videos-verticales');
  },
  zod$({
    title: z.string().min(1, 'El título es requerido'),
    videoUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    displayOrder: z.string().default('0'),
    isActive: z.string().optional(),
  }),
);

export default component$(() => {
  const videoLoader = useVerticalVideoLoader();
  const editAction = useEditVerticalVideoAction();
  const isUploading = useSignal(false);
  const uploadError = useSignal<string | null>(null);
  const video = videoLoader.value;

  const handleSubmit = $(async (event: Event, element: HTMLFormElement) => {
    isUploading.value = true;
    uploadError.value = null;

    try {
      const formData = new FormData(element);
      const title = formData.get('title') as string;
      let videoUrl = formData.get('videoUrl') as string;
      let thumbnailUrl = formData.get('thumbnailUrl') as string;
      const displayOrder = formData.get('displayOrder') as string;
      const isActive = formData.get('isActive') === 'on' ? 'true' : 'false';

      const videoInput = element.querySelector('#videoFile') as HTMLInputElement;
      const thumbnailInput = element.querySelector('#thumbnailFile') as HTMLInputElement;

      // Handle video file base64 read
      if (videoInput?.files && videoInput.files.length > 0) {
        const file = videoInput.files[0];
        
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("El archivo de video supera el límite de 10MB. Para videos grandes, utilizá una URL externa.");
        }

        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        reader.readAsDataURL(file);
        videoUrl = await base64Promise;
      }

      // Handle thumbnail file base64 read
      if (thumbnailInput?.files && thumbnailInput.files.length > 0) {
        const file = thumbnailInput.files[0];
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        reader.readAsDataURL(file);
        thumbnailUrl = await base64Promise;
      }

      if (!videoUrl) {
        throw new Error("Debe subir un archivo de video o ingresar una URL de video.");
      }

      await editAction.submit({
        title,
        videoUrl,
        thumbnailUrl,
        displayOrder,
        isActive,
      });
    } catch (e: any) {
      console.error("Error en la subida/procesamiento:", e);
      uploadError.value = e.message || "Hubo un error al procesar los archivos.";
    } finally {
      isUploading.value = false;
    }
  });

  return (
    <div class="space-y-6">
      {/* Header */}
      <div class="flex items-center gap-4">
        <Link
          href="/admin/videos-verticales"
          class="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2.5}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 class="text-2xl font-display font-bold text-navy-900">Editar Video Vertical</h1>
          <p class="text-slate-500 font-body text-sm mt-1">
            Modificá la información o archivos del reel seleccionado.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div class="bg-white rounded-2xl border border-slate-200 p-8 max-w-2xl shadow-sm">
        {/* Error Alert */}
        {(editAction.value?.failed || uploadError.value) && (
          <div class="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 border border-red-200 font-body flex items-start gap-2.5">
            <span class="text-base">⚠️</span>
            <div>
              {uploadError.value || (editAction.value as any).error || 'Por favor corregí los errores en el formulario.'}
              {editAction.value?.fieldErrors && (
                <ul class="mt-1 list-disc list-inside text-xs">
                  {Object.entries(editAction.value.fieldErrors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <form 
          preventdefault:submit
          onSubmit$={handleSubmit}
          class="space-y-6"
        >
          {/* Title */}
          <div>
            <label for="title" class="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2 font-body">Título del Video</label>
            <input
              type="text"
              id="title"
              name="title"
              value={video.title}
              class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body"
              required
            />
          </div>

          {/* Video Section */}
          <div class="p-5 border border-slate-150 rounded-2xl bg-slate-50/50 space-y-4">
            <h3 class="font-display font-bold text-navy-900 text-sm border-b border-slate-200 pb-2">Archivo de Video</h3>
            <div>
              <label for="videoFile" class="block text-xs font-body font-semibold text-slate-600 mb-2">Subir Nuevo Video (Opcional, máx 10MB)</label>
              <input
                type="file"
                id="videoFile"
                name="videoFile"
                accept="video/mp4,video/webm"
                class="w-full border border-slate-250 bg-white rounded-xl px-4 py-2.5 text-sm outline-none font-body file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-navy-900 file:text-white file:cursor-pointer hover:file:bg-navy-800"
              />
              <p class="text-[10px] text-slate-400 mt-1 font-body">Si subís un archivo, reemplazará al archivo o URL actual.</p>
            </div>
            <div class="relative flex py-2 items-center">
              <div class="flex-grow border-t border-slate-250"></div>
              <span class="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider font-body">URL de Video</span>
              <div class="flex-grow border-t border-slate-250"></div>
            </div>
            <div>
              <label for="videoUrl" class="block text-xs font-body font-semibold text-slate-600 mb-2">URL del Video (Actual)</label>
              <input
                type="text"
                id="videoUrl"
                name="videoUrl"
                value={video.videoUrl}
                class="w-full bg-white border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body"
                required
              />
            </div>
          </div>

          {/* Thumbnail Section */}
          <div class="p-5 border border-slate-150 rounded-2xl bg-slate-50/50 space-y-4">
            <h3 class="font-display font-bold text-navy-900 text-sm border-b border-slate-200 pb-2">Imagen de Portada (Miniatura)</h3>
            <div>
              <label for="thumbnailFile" class="block text-xs font-body font-semibold text-slate-600 mb-2">Subir Nueva Portada (Opcional)</label>
              <input
                type="file"
                id="thumbnailFile"
                name="thumbnailFile"
                accept="image/jpeg,image/png,image/webp"
                class="w-full border border-slate-250 bg-white rounded-xl px-4 py-2.5 text-sm outline-none font-body file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-navy-900 file:text-white file:cursor-pointer hover:file:bg-navy-800"
              />
            </div>
            <div class="relative flex py-2 items-center">
              <div class="flex-grow border-t border-slate-250"></div>
              <span class="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider font-body">URL de Portada</span>
              <div class="flex-grow border-t border-slate-250"></div>
            </div>
            <div>
              <label for="thumbnailUrl" class="block text-xs font-body font-semibold text-slate-600 mb-2">URL de Portada (Actual)</label>
              <input
                type="text"
                id="thumbnailUrl"
                name="thumbnailUrl"
                value={video.thumbnailUrl || ''}
                class="w-full bg-white border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body"
              />
            </div>
          </div>

          {/* Settings */}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="displayOrder" class="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2 font-body">Orden de Visualización</label>
              <input
                type="number"
                id="displayOrder"
                name="displayOrder"
                value={video.displayOrder}
                class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors font-body"
              />
            </div>
            
            <div class="flex flex-col justify-center">
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={video.isActive === 1}
                  class="w-5 h-5 text-verde-500 rounded border-slate-300 focus:ring-verde-500 cursor-pointer"
                />
                <span class="text-sm font-semibold text-slate-700 font-body">Video Activo</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div class="flex items-center gap-4 pt-6 border-t border-slate-150">
            <button
              type="submit"
              disabled={editAction.isRunning || isUploading.value}
              class="inline-flex items-center justify-center gap-2 bg-verde-500 hover:bg-verde-600 text-white font-display text-sm font-bold px-6 py-3 rounded-xl shadow-cta hover:shadow-cta-hover transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
            >
              {(editAction.isRunning || isUploading.value) ? (
                <>
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando/Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
            <Link
              href="/admin/videos-verticales"
              class="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Editar Video Vertical — Mijal Salud Panel',
};

import { component$, $, useStore } from '@builder.io/qwik';
import {
  addGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
} from '~/routes/admin/galeria/index';

interface GalleryImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

interface MultiGalleryUploaderProps {
  images: GalleryImage[];
}

export const MultiGalleryUploader = component$<MultiGalleryUploaderProps>(({ images }) => {
  const state = useStore<{
    images: GalleryImage[];
    isUploading: boolean;
    uploadError: string | null;
    draggingIdx: number | null;
    dragOverIdx: number | null;
  }>(() => ({
    images: images.map((img) => ({ ...img })),
    isUploading: false,
    uploadError: null,
    draggingIdx: null,
    dragOverIdx: null,
  }));

  // ── Upload (Client Side FileReader -> Base64) ──────────────────────────────
  const handleUpload$ = $(async (e: Event, el: HTMLInputElement) => {
    const files = el.files;
    if (!files || files.length === 0) return;

    state.isUploading = true;
    state.uploadError = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate size (limit to 4MB for DB efficiency)
      if (file.size > 4 * 1024 * 1024) {
        state.uploadError = `El archivo "${file.name}" supera el límite de 4MB.`;
        continue;
      }

      // Convert to Base64 in browser
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);

      try {
        const base64Data = await base64Promise;
        // Persist to DB and get back the new record
        const newImage = await addGalleryImage(base64Data, state.images.length);

        if (newImage) {
          // Add to local state
          state.images.push(newImage);
        }
      } catch (err: any) {
        console.error('Upload failed:', err);
        state.uploadError = err.message || 'Error al guardar la imagen.';
      }
    }

    state.isUploading = false;
    el.value = '';
  });

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete$ = $(async (id: number) => {
    if (!confirm('¿Eliminar esta imagen de la galería?')) return;

    // Optimistic removal
    const idx = state.images.findIndex((img) => img.id === id);
    if (idx !== -1) {
      state.images.splice(idx, 1);
    }

    try {
      await deleteGalleryImage(id);
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  });

  // ── Drag & Drop Reordering ──────────────────────────────────────────────────
  const handleDragStart$ = $((idx: number) => {
    state.draggingIdx = idx;
  });

  const handleDragOver$ = $((e: DragEvent, idx: number) => {
    e.preventDefault();
    if (state.draggingIdx !== null && state.draggingIdx !== idx) {
      state.dragOverIdx = idx;
    }
  });

  const handleDrop$ = $(async (targetIdx: number) => {
    const fromIdx = state.draggingIdx;
    state.draggingIdx = null;
    state.dragOverIdx = null;

    if (fromIdx === null || fromIdx === targetIdx) return;

    // Reorder in local state
    const [moved] = state.images.splice(fromIdx, 1);
    state.images.splice(targetIdx, 0, moved);

    // Persist new order to DB
    try {
      await reorderGalleryImages(state.images.map((img) => img.id));
    } catch (err) {
      console.error('Error saving image order:', err);
    }
  });

  const handleDragEnd$ = $(() => {
    state.draggingIdx = null;
    state.dragOverIdx = null;
  });

  return (
    <div class="space-y-6">
      {/* Image Grid */}
      {state.images.length > 0 && (
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {state.images.map((img, idx) => (
            <div
              key={img.id}
              draggable
              onDragStart$={() => handleDragStart$(idx)}
              onDragOver$={(e) => handleDragOver$(e, idx)}
              onDrop$={() => handleDrop$(idx)}
              onDragEnd$={handleDragEnd$}
              class={[
                'group relative aspect-square overflow-hidden rounded-2xl border bg-slate-50 cursor-grab active:cursor-grabbing transition-all duration-255 select-none shadow-sm hover:shadow',
                state.dragOverIdx === idx && state.draggingIdx !== idx
                  ? 'border-verde-500 scale-95 opacity-80'
                  : 'border-slate-200',
                state.draggingIdx === idx ? 'opacity-30 scale-90 border-dashed border-slate-350' : '',
              ].join(' ')}
            >
              <img
                src={img.imageUrl}
                alt=""
                class="w-full h-full object-cover pointer-events-none"
                loading="lazy"
              />
              {/* Drag Handle Indicator */}
              <div class="absolute top-2 left-2 w-6 h-6 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
                  <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                  <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
                </svg>
              </div>
              {/* Delete Button */}
              <button
                type="button"
                onClick$={() => handleDelete$(img.id)}
                class="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm hover:shadow"
                title="Eliminar imagen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={3}>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Display Order Badge */}
              <div class="absolute bottom-2 left-2 min-w-[20px] h-[20px] bg-navy-900/85 backdrop-blur-sm rounded text-[10px] text-white font-bold flex items-center justify-center px-1">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {state.images.length === 0 && !state.isUploading && (
        <div class="flex flex-col items-center justify-center py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <span class="text-4xl mb-3">🖼️</span>
          <p class="font-display font-bold text-navy-900 text-sm">La galería está vacía</p>
          <p class="text-xs text-slate-500 mt-1 max-w-xs">
            Subí fotos del equipamiento, el equipo o las ambulancias para mostrarlas en la home.
          </p>
        </div>
      )}

      {/* File Upload Trigger */}
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        {state.isUploading && (
          <div class="text-sm font-semibold text-verde-600 flex items-center gap-2 font-body animate-pulse">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Procesando y guardando imágenes...
          </div>
        )}

        <label
          class={[
            'inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl border-2 border-dashed text-sm font-semibold transition-all cursor-pointer font-display shadow-sm',
            state.isUploading
              ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed'
              : 'border-verde-500 text-verde-600 hover:bg-verde-50 hover:border-solid',
          ].join(' ')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2.2}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {state.images.length === 0 ? 'Subir fotos...' : 'Subir más fotos...'}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            disabled={state.isUploading}
            onChange$={handleUpload$}
            class="sr-only"
          />
        </label>
      </div>

      {/* Error Logs */}
      {state.uploadError && (
        <div class="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-body">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {state.uploadError}
        </div>
      )}

      <p class="text-xs text-slate-400 font-body">
        * Podés seleccionar múltiples fotos a la vez. Arrastralas para ordenarlas libremente. El orden numérico indica la aparición de izquierda a derecha.
      </p>
    </div>
  );
});

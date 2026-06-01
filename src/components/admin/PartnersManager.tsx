import { component$, $, useStore } from '@builder.io/qwik';
import {
  addPartner,
  deletePartner,
  reorderPartners,
  updatePartnerName,
} from '~/routes/admin/partners/index';

interface PartnerItem {
  id: number;
  imageUrl: string;
  name: string;
  displayOrder: number;
}

interface PartnersManagerProps {
  partners: PartnerItem[];
}

export const PartnersManager = component$<PartnersManagerProps>(({ partners }) => {
  const state = useStore<{
    items: PartnerItem[];
    isUploading: boolean;
    uploadError: string | null;
    draggingIdx: number | null;
    dragOverIdx: number | null;
  }>(() => ({
    items: partners.map((p) => ({ ...p })),
    isUploading: false,
    uploadError: null,
    draggingIdx: null,
    dragOverIdx: null,
  }));

  // Helper for client-side canvas resizing and WebP compression
  const compressLogo = $((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          // Uniform logo dimensions: max 400x160 bounding box
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 160;
          let width = img.width;
          let height = img.height;

          // Scale proportionally
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw transparent background and scale
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // WebP transparent format, high quality (85%)
          const base64 = canvas.toDataURL('image/webp', 0.85);
          resolve(base64);
        };
        img.onerror = (err) => reject(err);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  });

  // ── Upload ──────────────────────────────────────────────────────────────────
  const handleUpload$ = $(async (e: Event, el: HTMLInputElement) => {
    const files = el.files;
    if (!files || files.length === 0) return;

    state.isUploading = true;
    state.uploadError = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Auto-extract and clean name from filename (e.g. "Logo-pami.png" -> "Logo Pami")
      const rawName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const cleanName = rawName
        .replace(/[-_]+/g, ' ')
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());

      try {
        // Compress instantly on client-side
        const compressedBase64 = await compressLogo(file);

        // Persist to DB and get back the new record
        const newPartner = await addPartner(compressedBase64, cleanName, state.items.length);

        if (newPartner) {
          state.items.push({
            id: newPartner.id,
            imageUrl: newPartner.imageUrl,
            name: newPartner.name,
            displayOrder: newPartner.displayOrder,
          });
        }
      } catch (err: any) {
        console.error('Upload & compression failed:', err);
        state.uploadError = err.message || 'Error al procesar y guardar la imagen.';
      }
    }

    state.isUploading = false;
    el.value = '';
  });

  // ── Name Edit Inline ─────────────────────────────────────────────────────────
  const handleNameChange$ = $(async (id: number, newName: string) => {
    const item = state.items.find((x) => x.id === id);
    if (!item || !newName.trim()) return;

    // Direct update
    item.name = newName.trim();

    try {
      await updatePartnerName(id, item.name);
    } catch (err) {
      console.error('Error updating partner name:', err);
    }
  });

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete$ = $(async (id: number) => {
    if (!confirm('¿Eliminar este partner?')) return;

    // Optimistic removal
    const idx = state.items.findIndex((x) => x.id === id);
    if (idx !== -1) {
      state.items.splice(idx, 1);
    }

    try {
      await deletePartner(id);
    } catch (err) {
      console.error('Error deleting partner:', err);
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
    const [moved] = state.items.splice(fromIdx, 1);
    state.items.splice(targetIdx, 0, moved);

    // Persist new order to DB
    try {
      await reorderPartners(state.items.map((x) => x.id));
    } catch (err) {
      console.error('Error saving partners order:', err);
    }
  });

  const handleDragEnd$ = $(() => {
    state.draggingIdx = null;
    state.dragOverIdx = null;
  });

  return (
    <div class="space-y-6">
      {/* Partners Grid */}
      {state.items.length > 0 && (
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {state.items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart$={() => handleDragStart$(idx)}
              onDragOver$={(e) => handleDragOver$(e, idx)}
              onDrop$={() => handleDrop$(idx)}
              onDragEnd$={handleDragEnd$}
              class={[
                'group relative flex flex-col items-center justify-between border bg-slate-50/50 p-5 rounded-2xl cursor-grab active:cursor-grabbing transition-all duration-200 select-none shadow-sm hover:shadow-md hover:bg-white',
                state.dragOverIdx === idx && state.draggingIdx !== idx
                  ? 'border-verde-500 scale-95 opacity-80'
                  : 'border-slate-200',
                state.draggingIdx === idx ? 'opacity-30 scale-90 border-dashed border-slate-350' : '',
              ].join(' ')}
            >
              {/* Logo Area */}
              <div class="w-full h-24 flex items-center justify-center bg-white border border-slate-100 rounded-xl px-4 py-2 pointer-events-none">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  width="180"
                  height="72"
                  class="max-w-full max-h-full object-contain opacity-95 transition-opacity"
                  loading="lazy"
                />
              </div>

              {/* Edit Name input */}
              <div class="w-full mt-4">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre / Tooltip</label>
                <input
                  type="text"
                  value={item.name}
                  onBlur$={(e, el) => handleNameChange$(item.id, el.value)}
                  onKeyDown$={(e, el) => {
                    if (e.key === 'Enter') {
                      el.blur();
                    }
                  }}
                  placeholder="Ej. Assist Card"
                  class="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-verde-500 transition-colors font-body"
                />
              </div>

              {/* Drag Handle Indicator */}
              <div class="absolute top-3 left-3 w-6 h-6 bg-slate-200/80 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
                  <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                  <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
                </svg>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick$={() => handleDelete$(item.id)}
                class="absolute top-3 right-3 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm hover:shadow"
                title="Eliminar partner"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={3}>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Display Order Badge */}
              <div class="absolute bottom-3 right-3 min-w-[20px] h-[20px] bg-navy-900/85 backdrop-blur-sm rounded text-[10px] text-white font-bold flex items-center justify-center px-1">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {state.items.length === 0 && !state.isUploading && (
        <div class="flex flex-col items-center justify-center py-20 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
          <span class="text-5xl mb-4">🤝</span>
          <p class="font-display font-bold text-navy-900 text-base">Aún no hay partners personalizados</p>
          <p class="text-xs text-slate-500 mt-1 max-w-sm px-6">
            Subí los logos de tus socios comerciales. Mientras esta sección esté vacía, la home seguirá mostrando el set predeterminado de logos premium.
          </p>
        </div>
      )}

      {/* File Upload Trigger */}
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-slate-150 rounded-2xl p-5 shadow-sm">
        <div class="flex-1">
          <h3 class="font-display font-bold text-sm text-navy-900">Subir nuevos logos</h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Soportamos archivos PNG, JPEG y WebP. Se optimizarán a WebP y a un tamaño máximo estandarizado de 400x160px con fondo transparente de forma automática.
          </p>
        </div>

        <div class="flex items-center gap-3">
          {state.isUploading && (
            <div class="text-xs font-bold text-verde-600 flex items-center gap-2 font-body animate-pulse">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Optimizando logos...
            </div>
          )}

          <label
            class={[
              'inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-dashed text-sm font-bold transition-all cursor-pointer font-display shadow-sm',
              state.isUploading
                ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed'
                : 'border-verde-500 text-verde-600 hover:bg-verde-50/50',
            ].join(' ')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2.2}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {state.items.length === 0 ? 'Seleccionar logos...' : 'Añadir logos...'}
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
      </div>

      {/* Error Message */}
      {state.uploadError && (
        <div class="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-body">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {state.uploadError}
        </div>
      )}

      <p class="text-xs text-slate-400 font-body">
        * Podés arrastrar y soltar los bloques para definir el orden en el home. Los nombres se guardan en tiempo real al hacer clic fuera del casillero.
      </p>
    </div>
  );
});

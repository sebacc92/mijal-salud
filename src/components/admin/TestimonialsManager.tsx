import { component$, $, useStore } from "@builder.io/qwik";
import {
  addTestimonio,
  updateTestimonio,
  deleteTestimonio,
  toggleTestimonioActivo,
} from "~/routes/admin/testimonios/index";

interface TestimonioItem {
  id: string;
  nombre: string;
  cargo: string | null;
  empresa: string | null;
  texto: string;
  rating: number | null;
  avatar: string | null;
  activo: boolean | number | null;
}

interface TestimonialsManagerProps {
  initialList: TestimonioItem[];
}

export const TestimonialsManager = component$<TestimonialsManagerProps>(
  ({ initialList }) => {
    const state = useStore<{
      items: TestimonioItem[];
      isModalOpen: boolean;
      isSubmitting: boolean;
      editingId: string | null;
      // Form Fields
      formNombre: string;
      formCargo: string;
      formEmpresa: string;
      formTexto: string;
      formRating: number;
      formActivo: boolean;
      errorMsg: string | null;
    }>(() => ({
      items: initialList.map((t) => ({ ...t })),
      isModalOpen: false,
      isSubmitting: false,
      editingId: null,
      formNombre: "",
      formCargo: "",
      formEmpresa: "",
      formTexto: "",
      formRating: 5,
      formActivo: true,
      errorMsg: null,
    }));

    const openAddModal = $(() => {
      state.editingId = null;
      state.formNombre = "";
      state.formCargo = "";
      state.formEmpresa = "";
      state.formTexto = "";
      state.formRating = 5;
      state.formActivo = true;
      state.errorMsg = null;
      state.isModalOpen = true;
    });

    const openEditModal = $((item: TestimonioItem) => {
      state.editingId = item.id;
      state.formNombre = item.nombre;
      state.formCargo = item.cargo || "";
      state.formEmpresa = item.empresa || "";
      state.formTexto = item.texto;
      state.formRating = item.rating || 5;
      state.formActivo = !!item.activo;
      state.errorMsg = null;
      state.isModalOpen = true;
    });

    const closeModal = $(() => {
      state.isModalOpen = false;
      state.editingId = null;
    });

    const handleSave = $(async () => {
      if (!state.formNombre.trim()) {
        state.errorMsg = "El nombre es obligatorio.";
        return;
      }
      if (!state.formTexto.trim()) {
        state.errorMsg = "El texto del testimonio es obligatorio.";
        return;
      }

      state.isSubmitting = true;
      state.errorMsg = null;

      try {
        if (state.editingId) {
          // UPDATE
          await updateTestimonio(
            state.editingId,
            state.formNombre.trim(),
            state.formCargo.trim(),
            state.formEmpresa.trim(),
            state.formTexto.trim(),
            state.formRating,
            state.formActivo
          );

          // Update local state
          const idx = state.items.findIndex((item) => item.id === state.editingId);
          if (idx !== -1) {
            state.items[idx] = {
              ...state.items[idx],
              nombre: state.formNombre.trim(),
              cargo: state.formCargo.trim() || null,
              empresa: state.formEmpresa.trim() || null,
              texto: state.formTexto.trim(),
              rating: state.formRating,
              activo: state.formActivo,
            };
          }
        } else {
          // ADD NEW
          const newRow = await addTestimonio(
            state.formNombre.trim(),
            state.formCargo.trim(),
            state.formEmpresa.trim(),
            state.formTexto.trim(),
            state.formRating
          );

          if (newRow) {
            // Unshift new item into state
            state.items.unshift({
              id: newRow.id,
              nombre: newRow.nombre,
              cargo: newRow.cargo,
              empresa: newRow.empresa,
              texto: newRow.texto,
              rating: newRow.rating,
              avatar: newRow.avatar,
              activo: !!newRow.activo,
            });
          }
        }
        state.isModalOpen = false;
      } catch (err: any) {
        console.error("Error saving testimonio:", err);
        state.errorMsg = "Ocurrió un error al guardar el testimonio.";
      } finally {
        state.isSubmitting = false;
      }
    });

    const handleToggleActivo = $((id: string, currentStatus: boolean) => {
      const newStatus = !currentStatus;
      // Optimistic update
      const idx = state.items.findIndex((item) => item.id === id);
      if (idx !== -1) {
        state.items[idx].activo = newStatus;
      }
      // Async server update
      toggleTestimonioActivo(id, newStatus).catch((err) => {
        console.error("Failed to toggle status:", err);
        // Revert
        if (idx !== -1) {
          state.items[idx].activo = currentStatus;
        }
      });
    });

    const handleDelete = $((id: string, name: string) => {
      if (confirm(`¿Estás seguro de que querés eliminar el testimonio de "${name}"?`)) {
        // Optimistic delete
        const originalItems = [...state.items];
        state.items = state.items.filter((item) => item.id !== id);

        deleteTestimonio(id).catch((err) => {
          console.error("Failed to delete testimonio:", err);
          // Revert
          state.items = originalItems;
        });
      }
    });

    return (
      <div class="space-y-6">
        {/* Acciones y Búsqueda */}
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div class="text-sm text-slate-500 font-body">
            Total: <span class="font-bold text-navy-900">{state.items.length}</span> testimonios
          </div>
          <button
            onClick$={openAddModal}
            class="inline-flex items-center gap-2 bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold text-xs px-4 py-2.5 rounded-xl shadow-cta transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Testimonio
          </button>
        </div>

        {/* Listado de testimonios */}
        {state.items.length === 0 ? (
          <div class="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
            <span class="text-4xl">💬</span>
            <h3 class="font-display font-bold text-navy-900 text-base mt-3">No hay testimonios</h3>
            <p class="text-slate-500 font-body text-xs mt-1">
              Hacé clic en "Nuevo Testimonio" para agregar el primero.
            </p>
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.items.map((item) => (
              <div
                key={item.id}
                class={[
                  "bg-slate-50 rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between relative group",
                  item.activo ? "border-slate-200" : "border-slate-200 opacity-60 bg-slate-100/50",
                ].join(" ")}
              >
                {/* Opciones de la tarjeta */}
                <div class="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick$={() => openEditModal(item)}
                    class="p-1.5 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-lg text-slate-600 transition-all shadow-sm"
                    title="Editar testimonio"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick$={() => handleDelete(item.id, item.nombre)}
                    class="p-1.5 bg-white border border-red-200 hover:border-red-400 hover:bg-red-50 rounded-lg text-red-500 transition-all shadow-sm"
                    title="Eliminar testimonio"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-3.5 h-3.5"
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
                </div>

                <div class="space-y-4">
                  {/* Rating e interruptor de activo */}
                  <div class="flex items-center justify-between">
                    <div class="flex gap-0.5">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <svg
                          key={i}
                          class="w-4 h-4 text-amber-400 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    {/* Switch Toggle Activo */}
                    <button
                      onClick$={() => handleToggleActivo(item.id, !!item.activo)}
                      class={[
                        "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 outline-none shrink-0",
                        item.activo ? "bg-verde-500" : "bg-slate-300",
                      ].join(" ")}
                      title={item.activo ? "Desactivar de la Home" : "Activar en la Home"}
                    >
                      <div
                        class={[
                          "w-4 h-4 bg-white rounded-full shadow-sm transform duration-200",
                          item.activo ? "translate-x-4" : "translate-x-0",
                        ].join(" ")}
                      />
                    </button>
                  </div>

                  {/* Texto */}
                  <p class="text-xs font-body text-slate-600 italic leading-relaxed">
                    "{item.texto}"
                  </p>
                </div>

                {/* Autor */}
                <div class="flex items-center gap-3 pt-4 mt-4 border-t border-slate-200">
                  <div class="w-8 h-8 rounded-full bg-verde-500/10 text-verde-600 font-display font-bold text-xs flex items-center justify-center shrink-0">
                    {item.avatar ||
                      item.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                  </div>
                  <div class="min-w-0">
                    <p class="font-display font-bold text-xs text-navy-900 truncate">
                      {item.nombre}
                    </p>
                    {(item.cargo || item.empresa) && (
                      <p class="text-[10px] font-body text-slate-400 truncate">
                        {item.cargo} {item.cargo && item.empresa && "·"} {item.empresa}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Agregar / Editar Testimonio */}
        {state.isModalOpen && (
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-sm animate-fade-in">
            <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
              {/* Header Modal */}
              <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 class="font-display font-bold text-navy-900 text-lg">
                  {state.editingId ? "Editar Testimonio" : "Nuevo Testimonio"}
                </h3>
                <button
                  onClick$={closeModal}
                  class="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Formulario */}
              <div class="px-6 py-6 space-y-4 max-h-[70vh] overflow-y-auto font-body">
                {state.errorMsg && (
                  <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-xs font-semibold">
                    ⚠️ {state.errorMsg}
                  </div>
                )}

                {/* Nombre */}
                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-navy-900 uppercase">
                    Nombre del Autor <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={state.formNombre}
                    onInput$={(ev, el) => (state.formNombre = el.value)}
                    placeholder="Ej. Martina García"
                    class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 focus:ring-1 focus:ring-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-navy-900"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  {/* Cargo */}
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-navy-900 uppercase">Cargo / Rol</label>
                    <input
                      type="text"
                      value={state.formCargo}
                      onInput$={(ev, el) => (state.formCargo = el.value)}
                      placeholder="Ej. Paciente o Gerente de RRHH"
                      class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 focus:ring-1 focus:ring-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-navy-900"
                    />
                  </div>

                  {/* Empresa */}
                  <div class="space-y-1.5">
                    <label class="block text-xs font-bold text-navy-900 uppercase">Empresa / Ciudad</label>
                    <input
                      type="text"
                      value={state.formEmpresa}
                      onInput$={(ev, el) => (state.formEmpresa = el.value)}
                      placeholder="Ej. Grupo Clarín o Palermo, CABA"
                      class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 focus:ring-1 focus:ring-verde-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-navy-900"
                    />
                  </div>
                </div>

                {/* Calificación / Rating */}
                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-navy-900 uppercase">Calificación</label>
                  <div class="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick$={() => (state.formRating = star)}
                        class="p-0.5 text-2xl outline-none focus:scale-110 transition-transform"
                      >
                        <span
                          class={
                            star <= state.formRating
                              ? "text-amber-400"
                              : "text-slate-250 hover:text-amber-300"
                          }
                        >
                          ★
                        </span>
                      </button>
                    ))}
                    <span class="text-xs text-slate-450 ml-2">({state.formRating} estrellas)</span>
                  </div>
                </div>

                {/* Texto del testimonio */}
                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-navy-900 uppercase">
                    Testimonio <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    value={state.formTexto}
                    onInput$={(ev, el) => (state.formTexto = el.value)}
                    placeholder="Escribí el testimonio o cita aquí..."
                    rows={4}
                    class="w-full bg-slate-50 border border-slate-200 focus:border-verde-500 focus:ring-1 focus:ring-verde-500 rounded-xl px-4 py-3 text-sm outline-none transition-all text-navy-900 resize-none leading-relaxed"
                  />
                </div>

                {/* Checkbox Activo (solo en edición) */}
                {state.editingId && (
                  <div class="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="formActivo"
                      checked={state.formActivo}
                      onChange$={(ev, el) => (state.formActivo = el.checked)}
                      class="w-4 h-4 rounded text-verde-500 focus:ring-verde-500 border-slate-300"
                    />
                    <label for="formActivo" class="text-xs font-bold text-navy-900 uppercase cursor-pointer">
                      Mostrar Testimonio en el Home
                    </label>
                  </div>
                )}
              </div>

              {/* Footer Modal */}
              <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick$={closeModal}
                  disabled={state.isSubmitting}
                  class="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick$={handleSave}
                  disabled={state.isSubmitting}
                  class="px-5 py-2 text-xs font-semibold text-white bg-verde-500 hover:bg-verde-650 rounded-xl transition-colors shadow-cta disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {state.isSubmitting ? (
                    <>
                      <svg class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    "Guardar"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

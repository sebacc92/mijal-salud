import { component$, $, useStore, type QRL } from "@builder.io/qwik";
import { getByPath, setByPath } from "~/content/servicios";
import type { Field, PageForm } from "~/content/servicios";

interface ContentEditorProps {
  pageId: string;
  pageLabel: string;
  pageUrl: string;
  updatedAt: string | null;
  initialData: Record<string, unknown>;
  groups: PageForm;
  /** Guarda el contenido completo. Devuelve la fecha de guardado. */
  onSave$: QRL<(pageId: string, data: unknown) => Promise<string>>;
  /** Restaura el contenido por defecto. */
  onReset$: QRL<(pageId: string) => Promise<void>>;
}

const inputCls =
  "w-full bg-slate-50 border border-slate-200 focus:border-verde-500 focus:ring-1 focus:ring-verde-500 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all text-navy-900";

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

export const ContentEditor = component$<ContentEditorProps>((props) => {
  const state = useStore<{
    data: Record<string, unknown>;
    saving: boolean;
    saved: boolean;
    error: string | null;
    updatedAt: string | null;
  }>({
    data: clone(props.initialData),
    saving: false,
    saved: false,
    error: null,
    updatedAt: props.updatedAt,
  });

  // ─── Mutadores genéricos (operan por path sobre state.data) ────────────────
  const setValue = $((path: string, value: unknown) => {
    setByPath(state.data, path, value);
    state.saved = false;
  });

  const addItem = $((path: string, template: unknown) => {
    const arr = getByPath(state.data, path) as unknown[] | undefined;
    if (Array.isArray(arr)) arr.push(clone(template));
    state.saved = false;
  });

  const removeItem = $((path: string, index: number) => {
    const arr = getByPath(state.data, path) as unknown[] | undefined;
    if (Array.isArray(arr)) arr.splice(index, 1);
    state.saved = false;
  });

  const moveItem = $((path: string, index: number, dir: -1 | 1) => {
    const arr = getByPath(state.data, path) as unknown[] | undefined;
    if (!Array.isArray(arr)) return;
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    const tmp = arr[index];
    arr[index] = arr[target];
    arr[target] = tmp;
    state.saved = false;
  });

  const handleSave = $(async () => {
    state.saving = true;
    state.error = null;
    try {
      const savedAt = await props.onSave$(props.pageId, clone(state.data));
      state.updatedAt = savedAt;
      state.saved = true;
    } catch (err) {
      console.error("Error al guardar contenido:", err);
      state.error = "No se pudo guardar. Reintentá en unos segundos.";
    } finally {
      state.saving = false;
    }
  });

  const handleReset = $(async () => {
    if (
      !confirm(
        "¿Restaurar esta página al contenido original? Se perderán los cambios guardados en el panel.",
      )
    )
      return;
    state.saving = true;
    state.error = null;
    try {
      await props.onReset$(props.pageId);
      // Recarga para traer el contenido por defecto ya aplicado.
      location.reload();
    } catch (err) {
      console.error("Error al restaurar contenido:", err);
      state.error = "No se pudo restaurar.";
      state.saving = false;
    }
  });

  return (
    <div class="space-y-6 pb-24">
      {props.groups.map((group, gi) => (
        <div key={gi} class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div class="mb-5">
            <h2 class="font-display font-bold text-navy-900 text-base">{group.title}</h2>
            {group.description && (
              <p class="text-slate-500 font-body text-xs mt-1">{group.description}</p>
            )}
          </div>
          <div class="space-y-5">
            {group.fields.map((field, fi) => (
              <FieldView
                key={fi}
                field={field}
                data={state.data}
                setValue$={setValue}
                addItem$={addItem}
                removeItem$={removeItem}
                moveItem$={moveItem}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Barra de guardado fija */}
      <div class="fixed bottom-0 left-64 right-0 bg-white/95 backdrop-blur border-t border-slate-200 px-8 py-3.5 flex items-center justify-between z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <div class="text-xs font-body">
          {state.error ? (
            <span class="text-red-600 font-semibold">⚠️ {state.error}</span>
          ) : state.saved ? (
            <span class="text-verde-700 font-semibold">
              ✓ Guardado. El sitio se actualiza en ~5–10 min (caché del CDN).
            </span>
          ) : state.updatedAt ? (
            <span class="text-slate-500">
              Última edición guardada:{" "}
              {new Date(
                state.updatedAt.includes("T") ? state.updatedAt : state.updatedAt + "Z",
              ).toLocaleString("es-AR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
            </span>
          ) : (
            <span class="text-slate-400">Mostrando el contenido original (sin ediciones aún).</span>
          )}
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            onClick$={handleReset}
            disabled={state.saving}
            class="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
          >
            Restaurar original
          </button>
          <button
            type="button"
            onClick$={handleSave}
            disabled={state.saving}
            class="px-6 py-2 text-xs font-bold text-white bg-verde-500 hover:bg-verde-600 rounded-xl shadow-cta transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {state.saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
interface FieldViewProps {
  field: Field;
  data: Record<string, unknown>;
  setValue$: QRL<(path: string, value: unknown) => void>;
  addItem$: QRL<(path: string, template: unknown) => void>;
  removeItem$: QRL<(path: string, index: number) => void>;
  moveItem$: QRL<(path: string, index: number, dir: -1 | 1) => void>;
}

const labelCls = "block text-xs font-bold text-navy-900 uppercase tracking-wide";
const helpCls = "text-[11px] text-slate-400 font-body";

const FieldView = component$<FieldViewProps>((props) => {
  const { field, data } = props;

  if (field.kind === "text" || field.kind === "textarea" || field.kind === "select") {
    const value = String(getByPath(data, field.path) ?? "");
    return (
      <div class="space-y-1.5">
        <label class={labelCls}>{field.label}</label>
        {field.kind === "textarea" ? (
          <textarea
            value={value}
            rows={field.rows ?? 3}
            onInput$={(_, el) => props.setValue$(field.path, el.value)}
            class={`${inputCls} resize-y leading-relaxed`}
          />
        ) : field.kind === "select" ? (
          <select
            value={value}
            onChange$={(_, el) => props.setValue$(field.path, el.value)}
            class={inputCls}
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={value}
            onInput$={(_, el) => props.setValue$(field.path, el.value)}
            class={inputCls}
          />
        )}
        {field.help && <p class={helpCls}>{field.help}</p>}
      </div>
    );
  }

  if (field.kind === "stringList") {
    const arr = (getByPath(data, field.path) as string[] | undefined) ?? [];
    return (
      <div class="space-y-2">
        <label class={labelCls}>{field.label}</label>
        {field.help && <p class={helpCls}>{field.help}</p>}
        <div class="space-y-2">
          {arr.map((item, i) => (
            <div key={i} class="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onInput$={(_, el) => props.setValue$(`${field.path}.${i}`, el.value)}
                class={inputCls}
              />
              <ListButtons
                index={i}
                length={arr.length}
                path={field.path}
                moveItem$={props.moveItem$}
                removeItem$={props.removeItem$}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick$={() => props.addItem$(field.path, "")}
          class="text-xs font-semibold text-verde-600 hover:text-verde-700 inline-flex items-center gap-1"
        >
          + Agregar {field.itemLabel ?? "ítem"}
        </button>
      </div>
    );
  }

  // objectList
  const arr = (getByPath(data, field.path) as Record<string, unknown>[] | undefined) ?? [];
  return (
    <div class="space-y-2">
      <label class={labelCls}>{field.label}</label>
      {field.help && <p class={helpCls}>{field.help}</p>}
      <div class="space-y-3">
        {arr.map((item, i) => (
          <div key={i} class="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold text-slate-500 uppercase">
                {field.itemLabel ?? "Ítem"} {i + 1}
              </span>
              <ListButtons
                index={i}
                length={arr.length}
                path={field.path}
                moveItem$={props.moveItem$}
                removeItem$={props.removeItem$}
              />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field.fields.map((sf) => {
                const subPath = `${field.path}.${i}.${sf.key}`;
                const subVal = String(item[sf.key] ?? "");
                const fullWidth = sf.kind === "textarea" ? "sm:col-span-2" : "";
                return (
                  <div key={sf.key} class={`space-y-1 ${fullWidth}`}>
                    <label class="block text-[11px] font-semibold text-slate-500">{sf.label}</label>
                    {sf.kind === "textarea" ? (
                      <textarea
                        value={subVal}
                        rows={sf.rows ?? 2}
                        onInput$={(_, el) => props.setValue$(subPath, el.value)}
                        class={`${inputCls} resize-y`}
                      />
                    ) : sf.kind === "select" ? (
                      <select
                        value={subVal}
                        onChange$={(_, el) => props.setValue$(subPath, el.value)}
                        class={inputCls}
                      >
                        {(sf.options ?? []).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={subVal}
                        onInput$={(_, el) => props.setValue$(subPath, el.value)}
                        class={inputCls}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick$={() => props.addItem$(field.path, field.template)}
        class="text-xs font-semibold text-verde-600 hover:text-verde-700 inline-flex items-center gap-1"
      >
        + Agregar {field.itemLabel ?? "ítem"}
      </button>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
interface ListButtonsProps {
  index: number;
  length: number;
  path: string;
  moveItem$: QRL<(path: string, index: number, dir: -1 | 1) => void>;
  removeItem$: QRL<(path: string, index: number) => void>;
}

const ListButtons = component$<ListButtonsProps>((props) => {
  const btn = "p-1.5 rounded-lg border text-slate-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed";
  return (
    <div class="flex items-center gap-1 shrink-0">
      <button
        type="button"
        title="Subir"
        disabled={props.index === 0}
        onClick$={() => props.moveItem$(props.path, props.index, -1)}
        class={`${btn} bg-white border-slate-200 hover:bg-slate-50`}
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <button
        type="button"
        title="Bajar"
        disabled={props.index === props.length - 1}
        onClick$={() => props.moveItem$(props.path, props.index, 1)}
        class={`${btn} bg-white border-slate-200 hover:bg-slate-50`}
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <button
        type="button"
        title="Eliminar"
        onClick$={() => props.removeItem$(props.path, props.index)}
        class={`${btn} bg-white border-red-200 text-red-500 hover:bg-red-50`}
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
});

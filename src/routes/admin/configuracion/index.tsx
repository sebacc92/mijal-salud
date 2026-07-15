import { $, component$, useSignal } from "@builder.io/qwik";
import { routeLoader$, server$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { getDb, schema } from "~/db";

const POLITICA_CALIDAD_KEY = "politica_calidad_pdf";
const MAX_PDF_SIZE = 3 * 1024 * 1024; // 3MB

// 1. LOADER: estado actual del PDF (sin traer el base64 completo)
export const useSettingsLoader = routeLoader$(async () => {
  try {
    const db = getDb();
    const [row] = await db
      .select({ updatedAt: schema.siteSettings.updatedAt })
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, POLITICA_CALIDAD_KEY));
    return { hasCustomPdf: !!row, updatedAt: row?.updatedAt ?? null };
  } catch (error) {
    console.error("Error loading site settings:", error);
    return { hasCustomPdf: false, updatedAt: null };
  }
});

// 2. GUARDAR PDF (upsert en site_settings)
export const saveQualityPdf = server$(async function (base64Data: string) {
  if (!base64Data.startsWith("data:application/pdf")) {
    throw new Error("El archivo debe ser un PDF.");
  }
  const db = getDb();
  await db
    .insert(schema.siteSettings)
    .values({ key: POLITICA_CALIDAD_KEY, value: base64Data })
    .onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { value: base64Data, updatedAt: sql`(CURRENT_TIMESTAMP)` },
    });
});

// 3. RESTAURAR PDF ORIGINAL (borra el registro y se vuelve al archivo por defecto)
export const resetQualityPdf = server$(async function () {
  const db = getDb();
  await db
    .delete(schema.siteSettings)
    .where(eq(schema.siteSettings.key, POLITICA_CALIDAD_KEY));
});

export default component$(() => {
  const settings = useSettingsLoader();

  const hasCustomPdf = useSignal(settings.value.hasCustomPdf);
  const updatedAt = useSignal(settings.value.updatedAt);
  const isUploading = useSignal(false);
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);

  const handleUpload$ = $(async (e: Event, el: HTMLInputElement) => {
    const file = el.files?.[0];
    if (!file) return;

    error.value = null;
    success.value = null;

    if (file.type !== "application/pdf") {
      error.value = "El archivo debe ser un PDF.";
      el.value = "";
      return;
    }
    if (file.size > MAX_PDF_SIZE) {
      error.value = `El archivo supera el límite de 3MB (pesa ${(file.size / 1024 / 1024).toFixed(1)}MB).`;
      el.value = "";
      return;
    }

    isUploading.value = true;
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      await saveQualityPdf(base64Data);
      hasCustomPdf.value = true;
      updatedAt.value = new Date().toISOString();
      success.value = "PDF actualizado correctamente. El link del footer ya muestra la nueva versión.";
    } catch (err: any) {
      console.error("Upload failed:", err);
      error.value = err.message || "Error al guardar el PDF.";
    } finally {
      isUploading.value = false;
      el.value = "";
    }
  });

  const handleReset$ = $(async () => {
    if (!confirm("¿Restaurar el PDF original del sitio? El archivo subido se eliminará.")) return;
    error.value = null;
    success.value = null;
    try {
      await resetQualityPdf();
      hasCustomPdf.value = false;
      updatedAt.value = null;
      success.value = "Se restauró el PDF original.";
    } catch (err: any) {
      error.value = err.message || "Error al restaurar el PDF.";
    }
  });

  return (
    <div class="space-y-6">
      {/* Page Header */}
      <div>
        <h1 class="text-2xl font-display font-bold text-navy-900">Configuración del Sitio</h1>
        <p class="text-slate-500 font-body text-sm mt-1">
          Gestioná documentos y ajustes generales del sitio público.
        </p>
      </div>

      {/* Card: Políticas de la Calidad */}
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-2xl">
        <div class="flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-display font-bold text-navy-900">Políticas de la Calidad (PDF)</h2>
            <p class="text-slate-500 font-body text-sm mt-1">
              Es el documento que se abre desde el link «Políticas de la Calidad» en el footer del sitio.
            </p>

            {/* Estado actual */}
            <div class="mt-4 flex flex-wrap items-center gap-3 text-sm font-body">
              {hasCustomPdf.value ? (
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-verde-50 text-verde-700 font-semibold text-xs">
                  <span class="w-1.5 h-1.5 rounded-full bg-verde-500"></span>
                  PDF personalizado
                  {updatedAt.value && (
                    <span class="font-normal text-verde-600">
                      · actualizado el {new Date(updatedAt.value.includes("T") ? updatedAt.value : updatedAt.value + "Z").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  )}
                </span>
              ) : (
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Usando el PDF original del sitio
                </span>
              )}
              <a
                href="/politicas-de-calidad"
                target="_blank"
                rel="noopener noreferrer"
                class="text-verde-600 hover:text-verde-700 font-semibold underline underline-offset-2"
              >
                Ver PDF actual
              </a>
            </div>

            {/* Mensajes */}
            {error.value && (
              <div class="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-body">
                {error.value}
              </div>
            )}
            {success.value && (
              <div class="mt-4 px-4 py-3 rounded-xl bg-verde-50 border border-verde-200 text-verde-700 text-sm font-body">
                {success.value}
              </div>
            )}

            {/* Acciones */}
            <div class="mt-5 flex flex-wrap items-center gap-3">
              <label
                class={[
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-all",
                  isUploading.value
                    ? "bg-slate-200 text-slate-400 cursor-wait"
                    : "bg-verde-500 hover:bg-verde-600 text-white shadow-cta",
                ].join(" ")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {isUploading.value ? "Subiendo..." : "Subir nuevo PDF"}
                <input
                  type="file"
                  accept="application/pdf"
                  class="hidden"
                  disabled={isUploading.value}
                  onChange$={handleUpload$}
                />
              </label>

              {hasCustomPdf.value && (
                <button
                  type="button"
                  onClick$={handleReset$}
                  class="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-600 border border-slate-300 hover:bg-slate-50 transition-all"
                >
                  Restaurar PDF original
                </button>
              )}
            </div>
            <p class="text-xs text-slate-400 font-body mt-3">
              Solo archivos PDF, hasta 3MB. El cambio impacta al instante en el sitio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Configuración — Mijal Salud Panel",
};

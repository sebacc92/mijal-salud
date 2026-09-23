import { component$ } from "@builder.io/qwik";
import { routeLoader$, server$, Link } from "@builder.io/qwik-city";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import {
  FORM_SCHEMAS,
  getPageMeta,
  isPageId,
  type PageId,
} from "~/content/servicios";
import {
  getPageContent,
  getPageUpdatedAt,
  savePageContent,
  resetPageContent,
} from "~/content/servicios/loader";
import { ContentEditor } from "~/components/admin/ContentEditor";

// El admin nunca se cachea en el CDN (está detrás de auth). Lo dejamos explícito.
export const onGet: RequestHandler = ({ cacheControl }) => {
  cacheControl({ noCache: true });
};

export const useEditorLoader = routeLoader$(async ({ params, status }) => {
  const page = params.page;
  if (!isPageId(page)) {
    status(404);
    return null;
  }
  const [content, updatedAt] = await Promise.all([
    getPageContent(page),
    getPageUpdatedAt(page),
  ]);
  return {
    pageId: page,
    meta: getPageMeta(page)!,
    groups: FORM_SCHEMAS[page],
    content: content as unknown as Record<string, unknown>,
    updatedAt,
  };
});

// ─── Acciones de servidor ─────────────────────────────────────────────────────
export const saveContentAction = server$(async function (pageId: string, data: unknown) {
  if (!isPageId(pageId)) throw new Error("Página inválida");
  await savePageContent(pageId as PageId, data);
  return (await getPageUpdatedAt(pageId as PageId)) ?? new Date().toISOString();
});

export const resetContentAction = server$(async function (pageId: string) {
  if (!isPageId(pageId)) throw new Error("Página inválida");
  await resetPageContent(pageId as PageId);
});

export default component$(() => {
  const data = useEditorLoader();

  if (!data.value) {
    return (
      <div class="text-center py-16">
        <h1 class="text-xl font-display font-bold text-navy-900">Página no encontrada</h1>
        <Link href="/admin/contenido-servicios" class="text-verde-600 font-semibold text-sm mt-3 inline-block">
          ← Volver al listado
        </Link>
      </div>
    );
  }

  const { pageId, meta, groups, content, updatedAt } = data.value;

  return (
    <div class="space-y-5">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/admin/contenido-servicios"
            class="text-xs font-semibold text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 mb-2"
          >
            ← Contenido de Servicios
          </Link>
          <h1 class="text-2xl font-display font-bold text-navy-900 flex items-center gap-2">
            <span>{meta.emoji}</span> {meta.label}
          </h1>
          <p class="text-slate-500 font-body text-sm mt-1">
            Editá los textos de esta página. Recordá hacer clic en{" "}
            <strong>Guardar cambios</strong> al final.
          </p>
        </div>
        <a
          href={meta.url}
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-semibold text-verde-600 hover:text-verde-700 border border-verde-200 hover:bg-verde-50 px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5"
        >
          Ver página pública ↗
        </a>
      </div>

      <ContentEditor
        pageId={pageId}
        pageLabel={meta.label}
        pageUrl={meta.url}
        updatedAt={updatedAt}
        initialData={content}
        groups={groups}
        onSave$={saveContentAction}
        onReset$={resetContentAction}
      />
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const data = resolveValue(useEditorLoader);
  return {
    title: `Editar ${data?.meta.label ?? "contenido"} — Mijal Salud Panel`,
  };
};

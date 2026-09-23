import { component$ } from "@builder.io/qwik";
import { routeLoader$, Link } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PAGES } from "~/content/servicios";
import { getPageUpdatedAt } from "~/content/servicios/loader";

// Lista de páginas editables + fecha de última edición (para mostrar estado).
export const usePagesLoader = routeLoader$(async () => {
  const rows = await Promise.all(
    PAGES.map(async (p) => ({
      ...p,
      updatedAt: await getPageUpdatedAt(p.id),
    })),
  );
  return rows;
});

export default component$(() => {
  const pages = usePagesLoader();

  return (
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-display font-bold text-navy-900">Contenido de Servicios</h1>
        <p class="text-slate-500 font-body text-sm mt-1 max-w-2xl">
          Editá los textos de la página de Servicios y de cada servicio. Los cambios se publican
          solos: aparecen en el sitio en aproximadamente 5 a 10 minutos, sin necesidad de un
          nuevo despliegue.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.value.map((p) => (
          <Link
            key={p.id}
            href={`/admin/contenido-servicios/${p.id}`}
            class="group bg-white border border-slate-200 hover:border-verde-300 hover:shadow-card rounded-2xl p-5 flex items-start gap-4 transition-all"
          >
            <div class="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
              {p.emoji}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <h2 class="font-display font-bold text-navy-900 text-sm">{p.label}</h2>
                {p.updatedAt ? (
                  <span class="text-[10px] font-semibold text-verde-700 bg-verde-50 px-2 py-0.5 rounded-full">
                    Editado
                  </span>
                ) : (
                  <span class="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    Original
                  </span>
                )}
              </div>
              <p class="text-slate-500 font-body text-xs mt-1">{p.descripcion}</p>
              <p class="text-slate-400 font-body text-[11px] mt-2 font-mono">{p.url}</p>
            </div>
            <svg class="w-4 h-4 text-slate-300 group-hover:text-verde-500 transition-colors shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Contenido de Servicios — Mijal Salud Panel",
};

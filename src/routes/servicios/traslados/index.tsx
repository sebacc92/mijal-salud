import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { WHATSAPP_ATENCION, TELEFONO_HREF, TELEFONO_EMERGENCIAS } from "~/lib/constants";
import { getPageContent } from "~/content/servicios/loader";
import { publicContentCache } from "~/lib/cache";
import { TRASLADO_COLORS } from "~/components/servicios/colors";

export const useTrasladosContent = routeLoader$(async ({ cacheControl }) => {
  publicContentCache(cacheControl);
  return getPageContent("traslados");
});

export default component$(() => {
  const c = useTrasladosContent().value;

  return (
    <main class="pt-24">
      <section class="bg-navy-900 relative overflow-hidden py-20">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 max-w-3xl text-center">
          <h1 class="font-display text-h1 text-white mb-5">
            {c.heroTitle} <span class="text-blue-300">{c.heroTitleHighlight}</span>
          </h1>
          <p class="text-white/75 font-body text-body-lg mb-8">{c.heroSubtitle}</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WHATSAPP_ATENCION} target="_blank" rel="noopener noreferrer"
              class="bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta transition-all duration-200">
              {c.ctaLabel}
            </a>
            <a href={TELEFONO_HREF}
              class="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-display font-semibold px-8 py-4 rounded-2xl transition-all duration-200">
              📞 {TELEFONO_EMERGENCIAS}
            </a>
          </div>
        </div>
      </section>

      {/* Tipos de traslado */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">{c.tiposTitle}</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.tipos.map((t) => (
              <div key={t.title} class={["rounded-2xl border-2 p-7", TRASLADO_COLORS[t.colorKey] ?? TRASLADO_COLORS.blue]}>
                <div class="text-4xl mb-4">{t.icon}</div>
                <h3 class="font-display font-bold text-navy-900 text-lg mb-2">{t.title}</h3>
                <p class="text-gris-600 font-body text-sm mb-5">{t.desc}</p>
                <ul class="space-y-2">
                  {t.incluye.map((i) => (
                    <li key={i} class="flex items-center gap-2 text-gris-700 text-xs font-body">
                      <svg class="w-3.5 h-3.5 text-verde-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Casos de uso */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-10">
            <h2 class="font-display text-h2 text-navy-900 mb-4">{c.casosTitle}</h2>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {c.casos.map((caso) => (
              <div key={caso.label} class="bg-white border border-gris-200 rounded-2xl p-5 text-center hover:border-blue-300 transition-colors">
                <div class="text-3xl mb-2">{caso.emoji}</div>
                <p class="text-gris-700 font-body text-xs font-medium">{caso.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const c = resolveValue(useTrasladosContent);
  return {
    title: c.seo.title,
    meta: [{ name: "description", content: c.seo.description }],
  };
};

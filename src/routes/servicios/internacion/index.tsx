import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { WHATSAPP_ATENCION } from "~/lib/constants";
import { getPageContent } from "~/content/servicios/loader";
import { publicContentCache } from "~/lib/cache";

export const useInternacionContent = routeLoader$(async ({ cacheControl }) => {
  publicContentCache(cacheControl);
  return getPageContent("internacion");
});

export default component$(() => {
  const c = useInternacionContent().value;

  return (
    <main class="pt-24">
      <section class="bg-navy-900 relative overflow-hidden py-20">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="relative container mx-auto px-6 lg:px-12 max-w-3xl text-center">
          <h1 class="font-display text-h1 text-white mb-5">
            {c.heroTitle} <span class="text-verde-400">{c.heroTitleHighlight}</span>
          </h1>
          <p class="text-white/75 font-body text-body-lg mb-8">{c.heroSubtitle}</p>
          <a href={WHATSAPP_ATENCION} target="_blank" rel="noopener noreferrer"
            class="inline-flex bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200">
            {c.ctaLabel}
          </a>
        </div>
      </section>

      {/* Beneficios */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">{c.beneficiosTitle}</h2>
            <p class="text-gris-600 font-body text-body-lg max-w-2xl mx-auto">{c.beneficiosSubtitle}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {c.beneficios.map((b) => (
              <div key={b.title} class="text-center bg-navy-50 border border-navy-100 rounded-2xl p-6">
                <div class="text-4xl mb-4">{b.emoji}</div>
                <h3 class="font-display font-bold text-navy-900 text-base mb-2">{b.title}</h3>
                <p class="text-gris-600 font-body text-sm">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Qué incluye */}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="font-display text-h2 text-navy-900 mb-6">{c.programaTitle}</h2>
              <ul class="space-y-4">
                {c.programaItems.map((item) => (
                  <li key={item} class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-verde-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-gris-700 font-body text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div class="bg-gris-50 rounded-3xl p-8 border border-gris-200">
              <h3 class="font-display font-bold text-navy-900 text-lg mb-5">{c.patologiasTitle}</h3>
              <div class="flex flex-wrap gap-2">
                {c.patologias.map((p) => (
                  <span key={p} class="bg-white border border-gris-200 text-gris-700 text-xs font-body px-3 py-1.5 rounded-full">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const c = resolveValue(useInternacionContent);
  return {
    title: c.seo.title,
    meta: [{ name: "description", content: c.seo.description }],
  };
};

import { component$ } from "@builder.io/qwik";
import { routeLoader$, Link } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getPageContent } from "~/content/servicios/loader";
import { publicContentCache } from "~/lib/cache";
import { CARD_COLORS } from "~/components/servicios/colors";
import { STATS } from "~/lib/constants";

// Lee el contenido editable desde la base (con fallback al default) y habilita
// el caché de CDN para servir la mayoría de requests sin tocar Turso.
export const useServiciosContent = routeLoader$(async ({ cacheControl }) => {
  publicContentCache(cacheControl);
  return getPageContent("servicios");
});

export default component$(() => {
  const c = useServiciosContent().value;
  const heroSubtitle = c.heroSubtitle.replace("{{anios}}", String(STATS.anos));

  return (
    <main class="pt-24">
      {/* Hero */}
      <section class="bg-navy-900 relative overflow-hidden py-20">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-verde-500 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 text-center">
          <h1 class="font-display text-h1 text-white mb-4">
            {c.heroTitle} <span class="text-verde-400">{c.heroTitleHighlight}</span>
          </h1>
          <p class="text-white/70 font-body text-body-lg max-w-2xl mx-auto">{heroSubtitle}</p>
        </div>
      </section>

      {/* Servicios */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="space-y-8">
            {c.cards.map((s) => {
              const color = CARD_COLORS[s.colorKey] ?? CARD_COLORS.verde;
              return (
                <div
                  key={s.id}
                  class={[
                    "bg-white rounded-3xl border-2 p-8 shadow-card hover:shadow-card-hover transition-all duration-300",
                    color.border,
                  ]}
                >
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Izquierda */}
                    <div>
                      <div class={["w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4", color.bg]}>
                        {s.emoji}
                      </div>
                      <h2 class="font-display font-bold text-navy-900 text-xl mb-1">{s.nombre}</h2>
                      <p class={["font-body text-sm italic mb-4", color.icon]}>{s.tagline}</p>
                      <Link
                        href={s.href}
                        class={[
                          "inline-flex items-center gap-2 font-display font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors",
                          color.badge,
                        ]}
                      >
                        Más información →
                      </Link>
                    </div>

                    {/* Centro: descripción */}
                    <div>
                      <p class="text-gris-600 font-body text-sm leading-relaxed">{s.descripcion}</p>
                    </div>

                    {/* Derecha: incluye */}
                    <div>
                      <ul class="space-y-2.5">
                        {s.incluye.map((item, j) => (
                          <li key={j} class="flex items-start gap-2.5 text-gris-700 text-sm font-body">
                            <svg class={["w-4 h-4 shrink-0 mt-0.5", color.icon]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const c = resolveValue(useServiciosContent);
  return {
    title: c.seo.title,
    meta: [{ name: "description", content: c.seo.description }],
  };
};

import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <main class="min-h-screen flex items-center justify-center bg-gris-50 pt-24 pb-16">
      <div class="container mx-auto px-6 text-center max-w-xl">
        {/* Número grande decorativo */}
        <div
          class="font-display font-black text-gris-200 select-none mb-4"
          style={{ fontSize: "clamp(6rem, 20vw, 12rem)", lineHeight: "1" }}
        >
          404
        </div>

        {/* Ícono médico */}
        <div class="w-20 h-20 bg-navy-900 rounded-full flex items-center justify-center mx-auto mb-6 -mt-4 relative z-10">
          <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <h1 class="font-display font-bold text-navy-900 text-3xl mb-3">
          Página no encontrada
        </h1>
        <p class="text-gris-600 font-body text-body-lg mb-8">
          La página que buscás no existe o fue movida. 
          Pero si necesitás atención médica, ¡estamos disponibles 24/7!
        </p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            class="bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-7 py-3.5 rounded-xl shadow-cta hover:shadow-cta-hover transition-all duration-200"
          >
            Ir al inicio
          </Link>
          <Link
            href="/contacto"
            class="bg-white border border-gris-200 hover:border-navy-300 text-navy-700 font-display font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-sm"
          >
            Contactarnos
          </Link>
        </div>

        {/* Links útiles */}
        <div class="mt-12 pt-8 border-t border-gris-200">
          <p class="text-gris-500 font-body text-sm mb-4">¿Buscabas algo en particular?</p>
          <div class="flex flex-wrap gap-2 justify-center">
            {[
              { label: "Servicios", href: "/servicios" },
              { label: "Empresas", href: "/empresas" },
              { label: "Obras sociales", href: "/obras-sociales" },
              { label: "Blog", href: "/blog" },
              { label: "Portal", href: "/portal" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                class="px-4 py-2 bg-white border border-gris-200 hover:border-verde-300 rounded-xl text-gris-600 hover:text-verde-700 font-body text-sm transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "404 — Página no encontrada | Mijal Salud",
  meta: [{ name: "robots", content: "noindex" }],
};

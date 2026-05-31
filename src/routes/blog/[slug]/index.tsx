import { component$ } from "@builder.io/qwik";
import { routeLoader$, Link } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { eq } from "drizzle-orm";
import { getDb, schema } from "~/db";

// Posts estáticos para fallback si la DB está vacía
const postsEstaticos: Record<string, {
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: string;
  autor: string;
  publishedAt: string;
  tiempoLectura: string;
  imagen: string;
}> = {
  "como-prevenir-infartos-en-verano": {
    titulo: "Cómo prevenir infartos y golpes de calor en el verano porteño",
    resumen: "El calor extremo multiplica el riesgo cardiovascular. Te contamos qué señales vigilar y qué hacer ante una emergencia.",
    contenido: `## El calor como factor de riesgo cardiovascular

El verano en Buenos Aires puede ser brutal. Temperaturas que superan los 35°C combinadas con humedad alta crean condiciones de riesgo real para la salud cardiovascular.

## Señales de alerta

- Dolor en el pecho que se irradia al brazo izquierdo
- Sudoración fría sin causa aparente
- Dificultad para respirar en reposo
- Mareos o pérdida de conciencia repentina

## Qué hacer en caso de emergencia

1. **Llamá inmediatamente al 107 o a tu servicio médico de emergencias**
2. Acostar al paciente en posición horizontal
3. Aflojar ropa ajustada
4. No dar agua si está inconsciente

## Prevención diaria

Hidratación constante, evitar actividad física en las horas pico de calor (12-16hs), y consultar con tu médico si tenés factores de riesgo.`,
    categoria: "Prevención",
    autor: "Dr. Martín Rueda",
    publishedAt: "12 de mayo, 2026",
    tiempoLectura: "5 min",
    imagen: "❤️",
  },
};

export const usePost = routeLoader$(async ({ params, status }) => {
  try {
    const db = getDb();
    const posts = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.slug, params.slug))
      .limit(1);

    if (posts.length > 0 && posts[0].publicado) {
      return { post: posts[0], fromDb: true };
    }
  } catch {
    // DB error fallback to static
  }

  // Fallback a posts estáticos
  const staticPost = postsEstaticos[params.slug];
  if (staticPost) {
    return { post: { ...staticPost, slug: params.slug }, fromDb: false };
  }

  status(404);
  return { post: null, fromDb: false };
});

function renderMarkdown(text: string) {
  return text
    .split("\n")
    .map((line) => {
      if (line.startsWith("## ")) return `<h2 class="font-display font-bold text-navy-900 text-2xl mt-10 mb-4">${line.slice(3)}</h2>`;
      if (line.startsWith("### ")) return `<h3 class="font-display font-bold text-navy-900 text-xl mt-8 mb-3">${line.slice(4)}</h3>`;
      if (line.startsWith("- ")) return `<li class="flex gap-2 text-gris-700 mb-2"><span class="text-verde-500 font-bold mt-0.5">•</span>${line.slice(2)}</li>`;
      if (/^\d+\.\s/.test(line)) return `<li class="text-gris-700 mb-2 ml-4">${line}</li>`;
      if (line.startsWith("**") && line.endsWith("**")) return `<strong class="text-navy-900">${line.slice(2, -2)}</strong>`;
      if (line === "") return `<div class="h-3"></div>`;
      return `<p class="text-gris-700 font-body leading-relaxed mb-3">${line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-navy-900">$1</strong>')}</p>`;
    })
    .join("");
}

export default component$(() => {
  const data = usePost();

  if (!data.value.post) {
    return (
      <main class="pt-24 min-h-screen flex items-center justify-center bg-gris-50">
        <div class="text-center">
          <div class="text-7xl mb-6">📰</div>
          <h1 class="font-display font-bold text-navy-900 text-3xl mb-3">Post no encontrado</h1>
          <p class="text-gris-600 font-body mb-6">El artículo que buscás no existe o fue eliminado.</p>
          <Link href="/blog" class="bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-6 py-3 rounded-xl transition-colors">
            Volver al blog
          </Link>
        </div>
      </main>
    );
  }

  const post = data.value.post;

  return (
    <main class="pt-24">
      {/* Header del post */}
      <section class="bg-navy-900 relative overflow-hidden py-16">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="relative container mx-auto px-6 lg:px-12 max-w-3xl">
          <div class="flex items-center gap-2 mb-6">
            <Link href="/blog" class="text-white/60 hover:text-white font-body text-sm transition-colors flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Blog
            </Link>
            <span class="text-white/30">/</span>
            <span class="text-white/60 font-body text-sm">{post.categoria}</span>
          </div>
          <h1 class="font-display text-h1 text-white mb-5 leading-tight">{post.titulo}</h1>
          <p class="text-white/70 font-body text-body-lg mb-8">{post.resumen}</p>
          <div class="flex flex-wrap items-center gap-5 text-white/50 text-sm font-body">
            <span>✍️ {post.autor}</span>
            <span>📅 {(post as any).publishedAt || (post as any).published_at || "—"}</span>
            {(post as any).tiempoLectura && <span>⏱️ {(post as any).tiempoLectura}</span>}
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12">
          <div class="max-w-3xl mx-auto">
            {/* Imagen decorativa */}
            {(post as any).imagen && (
              <div class="w-full h-40 bg-gris-100 rounded-2xl flex items-center justify-center text-7xl mb-10">
                {(post as any).imagen}
              </div>
            )}

            {/* Contenido del artículo */}
            <div
              class="prose-content"
              dangerouslySetInnerHTML={renderMarkdown(post.contenido || "")}
            />

            {/* Tags si existen */}
            {(post as any).tags && (
              <div class="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gris-100">
                {JSON.parse((post as any).tags || "[]").map((tag: string) => (
                  <span key={tag} class="bg-gris-100 text-gris-600 text-xs font-body px-3 py-1.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Navegación */}
            <div class="mt-10 pt-8 border-t border-gris-100 flex items-center justify-between">
              <Link href="/blog" class="flex items-center gap-2 text-navy-700 hover:text-verde-600 font-display font-semibold transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Volver al blog
              </Link>
              <div class="flex items-center gap-3">
                <span class="text-gris-400 text-sm font-body">Compartir:</span>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(post.titulo)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-9 h-9 bg-verde-500 rounded-lg flex items-center justify-center text-white hover:bg-verde-600 transition-colors"
                  aria-label="Compartir en WhatsApp"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = ({ head, resolveValue }) => {
  const data = resolveValue(usePost);
  const post = data?.post;
  if (!post) return { ...head, title: "Post no encontrado — Mijal Salud" };
  return {
    ...head,
    title: `${post.titulo} — Mijal Salud Blog`,
    meta: [
      ...(head.meta || []),
      { name: "description", content: post.resumen },
      { property: "og:title", content: post.titulo },
      { property: "og:description", content: post.resumen },
    ],
  };
};

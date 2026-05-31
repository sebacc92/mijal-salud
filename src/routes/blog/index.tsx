import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";

// Posts de ejemplo (en producción vendrían de Turso vía loader)
const posts = [
  {
    slug: "como-prevenir-infartos-en-verano",
    titulo: "Cómo prevenir infartos y golpes de calor en el verano porteño",
    resumen: "El calor extremo multiplica el riesgo cardiovascular. Te contamos qué señales vigilar y qué hacer ante una emergencia.",
    categoria: "Prevención",
    autor: "Dr. Martín Rueda",
    fecha: "12 de mayo, 2026",
    tiempoLectura: "5 min",
    imagen: "❤️",
    featured: true,
  },
  {
    slug: "internacion-domiciliaria-vs-clinica",
    titulo: "Internación domiciliaria vs. clínica: ¿cuál conviene para tu caso?",
    resumen: "Los pacientes que se recuperan en casa evolucionan mejor y con menos complicaciones. Te explicamos por qué y cuándo es posible.",
    categoria: "Salud",
    autor: "Dra. Laura Méndez",
    fecha: "8 de mayo, 2026",
    tiempoLectura: "7 min",
    imagen: "🏠",
    featured: false,
  },
  {
    slug: "diabetes-seguimiento-domiciliario",
    titulo: "Manejo de la diabetes tipo 2 desde el hogar: guía completa",
    resumen: "Control glucémico, dieta, ejercicio y señales de alerta. Todo lo que necesitás saber para vivir bien con diabetes.",
    categoria: "Prevención",
    autor: "Dra. Ana Torres",
    fecha: "3 de mayo, 2026",
    tiempoLectura: "10 min",
    imagen: "💉",
    featured: false,
  },
  {
    slug: "ia-en-salud-argentina",
    titulo: "Inteligencia artificial en salud: ¿qué está pasando en Argentina?",
    resumen: "Desde diagnóstico por imágenes hasta triaje predictivo, la IA está transformando la medicina. Te contamos el estado de situación local.",
    categoria: "Tecnología",
    autor: "Equipo Mijal Salud",
    fecha: "28 de abril, 2026",
    tiempoLectura: "8 min",
    imagen: "🤖",
    featured: false,
  },
  {
    slug: "beneficios-salud-corporativa-pymes",
    titulo: "Por qué las pymes deberían invertir en salud corporativa",
    resumen: "El ausentismo le cuesta a una empresa de 50 empleados más de $3M anuales. Estos son los números y las soluciones.",
    categoria: "Empresas",
    autor: "Lic. Sofía Ramos",
    fecha: "22 de abril, 2026",
    tiempoLectura: "6 min",
    imagen: "📊",
    featured: false,
  },
  {
    slug: "adultos-mayores-solos-en-casa",
    titulo: "Cómo cuidar a un adulto mayor que vive solo: guía para la familia",
    resumen: "Tecnología, rutinas y redes de apoyo. Todo lo que podés hacer desde lejos para garantizar la seguridad de tus seres queridos.",
    categoria: "Salud",
    autor: "Lic. María Gómez",
    fecha: "15 de abril, 2026",
    tiempoLectura: "9 min",
    imagen: "👴",
    featured: false,
  },
];

const categorias = ["Todos", "Salud", "Prevención", "Empresas", "Tecnología"];

const colorCategoria: Record<string, string> = {
  Salud: "bg-navy-100 text-navy-700",
  Prevención: "bg-verde-100 text-verde-700",
  Empresas: "bg-orange-100 text-orange-700",
  Tecnología: "bg-violet-100 text-violet-700",
};

export default component$(() => {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <main class="pt-24">
      {/* Hero */}
      <section class="bg-navy-900 relative overflow-hidden py-20">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="relative container mx-auto px-6 lg:px-12 text-center">
          <h1 class="font-display text-h1 text-white mb-4">Blog de Salud</h1>
          <p class="text-white/70 font-body text-body-lg max-w-xl mx-auto">
            Consejos de prevención, novedades médicas y guías para cuidar tu salud y la de tu familia.
          </p>
        </div>
      </section>

      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          {/* Categorías */}
          <div class="flex flex-wrap gap-2 mb-10">
            {categorias.map((cat) => (
              <button
                key={cat}
                class={[
                  "px-4 py-2 rounded-full text-sm font-body font-medium transition-colors",
                  cat === "Todos"
                    ? "bg-navy-900 text-white"
                    : "bg-white border border-gris-200 text-gris-600 hover:border-navy-300 hover:text-navy-700",
                ]}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Post destacado */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              class="group flex flex-col lg:flex-row gap-8 bg-white rounded-3xl p-8 border-2 border-gris-100 hover:border-verde-300 shadow-card hover:shadow-card-hover transition-all duration-300 mb-8"
            >
              <div class="w-full lg:w-48 h-40 lg:h-auto bg-gris-100 rounded-2xl flex items-center justify-center text-6xl shrink-0">
                {featured.imagen}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-4">
                  <span class={["text-xs font-body font-semibold px-3 py-1 rounded-full", colorCategoria[featured.categoria] || "bg-gris-100 text-gris-600"]}>
                    {featured.categoria}
                  </span>
                  <span class="bg-verde-100 text-verde-700 text-xs font-body font-semibold px-3 py-1 rounded-full">Destacado</span>
                </div>
                <h2 class="font-display font-bold text-navy-900 text-2xl mb-3 group-hover:text-verde-600 transition-colors">
                  {featured.titulo}
                </h2>
                <p class="text-gris-600 font-body text-sm leading-relaxed mb-4">{featured.resumen}</p>
                <div class="flex items-center gap-4 text-gris-400 text-xs font-body">
                  <span>✍️ {featured.autor}</span>
                  <span>📅 {featured.fecha}</span>
                  <span>⏱️ {featured.tiempoLectura}</span>
                </div>
              </div>
            </Link>
          )}

          {/* Grid de posts */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                class="group flex flex-col bg-white rounded-2xl border border-gris-100 hover:border-verde-200 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                <div class="h-36 bg-gris-100 flex items-center justify-center text-5xl">
                  {post.imagen}
                </div>
                <div class="p-6 flex flex-col flex-1">
                  <span class={["self-start text-xs font-body font-semibold px-3 py-1 rounded-full mb-3", colorCategoria[post.categoria] || "bg-gris-100 text-gris-600"]}>
                    {post.categoria}
                  </span>
                  <h2 class="font-display font-bold text-navy-900 text-base mb-2 group-hover:text-verde-600 transition-colors flex-grow">
                    {post.titulo}
                  </h2>
                  <p class="text-gris-500 font-body text-sm leading-relaxed mb-4 line-clamp-2">{post.resumen}</p>
                  <div class="flex items-center justify-between text-gris-400 text-xs font-body mt-auto">
                    <span>{post.fecha}</span>
                    <span>{post.tiempoLectura}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Blog de Salud — Mijal Salud",
  meta: [{ name: "description", content: "Artículos de prevención, salud domiciliaria, tecnología médica y bienestar. Información confiable del equipo de Mijal Salud." }],
};

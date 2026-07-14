import { component$ } from "@builder.io/qwik";

interface Bloque {
  tipo: string; // "parrafo" | "lista" | "aviso"
  texto?: string;
  items?: string[];
}

interface Seccion {
  titulo: string;
  bloques: Bloque[];
}

export interface LegalDoc {
  titulo: string;
  destacado: string;
  actualizado: string;
  secciones: Seccion[];
}

/**
 * Convierte marcas **negrita** en <strong>. El contenido proviene de archivos
 * de contenido versionados (src/content), por lo que es texto de confianza.
 */
function renderInline(text: string) {
  return text
    .split("**")
    .map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

/**
 * Renderiza un documento legal a partir de su JSON de contenido.
 * Usado por las páginas /privacidad y /terminos.
 */
export const LegalDocument = component$<{ doc: LegalDoc }>(({ doc }) => {
  return (
    <main class="pt-24 bg-gris-50 min-h-screen">
      <section class="bg-navy-900 relative overflow-hidden py-16 text-white">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-verde-500/10 rounded-full blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 max-w-4xl">
          <h1 class="font-display text-h2 md:text-h1 mb-4">
            {doc.titulo} <span class="text-verde-400">{doc.destacado}</span>
          </h1>
          <p class="text-white/70 font-body text-sm md:text-base">
            Última actualización: {doc.actualizado}
          </p>
        </div>
      </section>

      <section class="py-12">
        <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div class="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gris-100 font-body text-gris-700 space-y-6 leading-relaxed">
            {doc.secciones.map((seccion, si) => (
              <div key={si} class="space-y-6">
                <h2 class={["font-display text-2xl text-navy-900 font-bold", si === 0 ? "mt-2" : "mt-6"]}>
                  {seccion.titulo}
                </h2>
                {seccion.bloques.map((bloque, bi) => {
                  if (bloque.tipo === "lista" && bloque.items) {
                    return (
                      <ul key={bi} class="list-disc pl-6 space-y-2">
                        {bloque.items.map((item, ii) => (
                          <li key={ii}>{renderInline(item)}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (bloque.tipo === "aviso" && bloque.texto) {
                    return (
                      <div
                        key={bi}
                        class="bg-red-50 border-l-4 border-red-500 p-4 my-4 text-red-900 text-sm rounded-r-xl"
                      >
                        {renderInline(bloque.texto)}
                      </div>
                    );
                  }
                  return <p key={bi}>{renderInline(bloque.texto ?? "")}</p>;
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
});

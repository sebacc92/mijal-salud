import { component$, Fragment } from "@builder.io/qwik";

/**
 * Convierte marcas **negrita** en <strong>, sin usar innerHTML. El contenido es
 * de confianza (lo edita el admin) y aun así se renderiza como texto, por lo que
 * no hay superficie de XSS. Mismo criterio que el renderer de textos legales.
 */
export function renderInline(text: string) {
  return text
    .split("**")
    .map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

interface ParagraphsProps {
  text: string;
  class?: string;
}

/**
 * Renderiza un texto plano editable respetando saltos de línea:
 *   - Doble salto de línea → párrafo nuevo.
 *   - Salto simple → <br/>.
 *   - **negrita** → <strong>.
 */
export const Paragraphs = component$<ParagraphsProps>(({ text, class: cls }) => {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  return (
    <>
      {paragraphs.map((para, pi) => (
        <p key={pi} class={cls}>
          {para.split("\n").map((line, li, arr) => (
            <Fragment key={li}>
              {renderInline(line)}
              {li < arr.length - 1 && <br />}
            </Fragment>
          ))}
        </p>
      ))}
    </>
  );
});

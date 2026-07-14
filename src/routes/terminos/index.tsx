import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LegalDocument, type LegalDoc } from "~/components/legal/LegalDocument";
import terminos from "~/content/legal/terminos.json";

export default component$(() => {
  return <LegalDocument doc={terminos as LegalDoc} />;
});

export const head: DocumentHead = {
  title: "Términos y Condiciones — Mijal Salud S.A.",
  meta: [
    {
      name: "description",
      content: "Conocé las condiciones legales de uso de nuestro sitio web, herramientas digitales y servicios de salud domiciliaria de Mijal Salud S.A.",
    },
  ],
};

import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LegalDocument, type LegalDoc } from "~/components/legal/LegalDocument";
import privacidad from "~/content/legal/privacidad.json";

export default component$(() => {
  return <LegalDocument doc={privacidad as LegalDoc} />;
});

export const head: DocumentHead = {
  title: "Política de Privacidad — Mijal Salud S.A.",
  meta: [
    {
      name: "description",
      content: "Conocé cómo protegemos tus datos personales y de salud en Mijal Salud S.A. en cumplimiento con la Ley N° 25.326 de la República Argentina.",
    },
  ],
};

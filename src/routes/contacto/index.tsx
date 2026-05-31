import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ContactForm } from "~/components/forms/ContactForm";
import {
  TELEFONO_EMERGENCIAS,
  TELEFONO_HREF,
  WHATSAPP_ATENCION,
  EMAIL_CONTACTO,
  DIRECCION,
} from "~/lib/constants";

export default component$(() => {
  return (
    <main class="pt-24">
      {/* Hero */}
      <section class="bg-navy-900 relative overflow-hidden py-20">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="relative container mx-auto px-6 lg:px-12 text-center">
          <div class="inline-flex items-center gap-2 bg-verde-500/20 border border-verde-500/40 rounded-full px-4 py-2 mb-6">
            <span class="w-2 h-2 bg-verde-400 rounded-full animate-pulse" />
            <span class="text-verde-300 text-sm font-body font-medium">
              Estamos disponibles 24/7
            </span>
          </div>
          <h1 class="font-display text-h1 text-white mb-4">
            Contacto
          </h1>
          <p class="text-white/70 font-body text-body-lg max-w-xl mx-auto">
            ¿Tenés alguna consulta? Escribinos y te respondemos en menos de 24
            horas. Para emergencias, llamanos directamente.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Sidebar info */}
            <div class="space-y-6">
              {/* Emergencias */}
              <div class="bg-navy-900 rounded-2xl p-6 text-white">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-verde-500/20 rounded-xl flex items-center justify-center">
                    <span class="text-xl">🚨</span>
                  </div>
                  <h2 class="font-display font-bold text-lg">Emergencias</h2>
                </div>
                <p class="text-white/60 font-body text-sm mb-4">
                  Para situaciones urgentes, contactanos de inmediato.
                </p>
                <a
                  href={TELEFONO_HREF}
                  class="flex items-center gap-2 text-verde-400 font-display font-bold text-xl hover:text-verde-300 transition-colors"
                >
                  📞 {TELEFONO_EMERGENCIAS}
                </a>
              </div>

              {/* WhatsApp */}
              <div class="bg-white rounded-2xl p-6 border border-gris-200 shadow-card">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-verde-100 rounded-xl flex items-center justify-center">
                    <span class="text-xl">💬</span>
                  </div>
                  <h2 class="font-display font-bold text-navy-900 text-lg">
                    WhatsApp
                  </h2>
                </div>
                <p class="text-gris-600 font-body text-sm mb-4">
                  Chateá con nosotros en tiempo real.
                </p>
                <a
                  href={WHATSAPP_ATENCION}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-cta"
                >
                  Abrir WhatsApp
                </a>
              </div>

              {/* Email */}
              <div class="bg-white rounded-2xl p-6 border border-gris-200 shadow-card">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center">
                    <span class="text-xl">✉️</span>
                  </div>
                  <h2 class="font-display font-bold text-navy-900 text-lg">
                    Email
                  </h2>
                </div>
                <a
                  href={`mailto:${EMAIL_CONTACTO}`}
                  class="text-verde-600 hover:text-verde-700 font-body font-medium transition-colors"
                >
                  {EMAIL_CONTACTO}
                </a>
              </div>

              {/* Ubicación */}
              <div class="bg-white rounded-2xl p-6 border border-gris-200 shadow-card">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 bg-gris-100 rounded-xl flex items-center justify-center">
                    <span class="text-xl">📍</span>
                  </div>
                  <h2 class="font-display font-bold text-navy-900 text-lg">
                    Cobertura
                  </h2>
                </div>
                <p class="text-gris-600 font-body text-sm">{DIRECCION}</p>
                <p class="text-gris-500 font-body text-xs mt-1">
                  Ciudad de Buenos Aires y Gran Buenos Aires
                </p>
              </div>
            </div>

            {/* Formulario */}
            <div class="lg:col-span-2 bg-white rounded-2xl p-8 shadow-card border border-gris-100">
              <h2 class="font-display font-bold text-navy-900 text-2xl mb-2">
                Envianos un mensaje
              </h2>
              <p class="text-gris-500 font-body text-sm mb-8">
                Completá el formulario y te respondemos en menos de 24 horas
                hábiles.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Contacto — Mijal Salud",
  meta: [
    {
      name: "description",
      content:
        "Contactá a Mijal Salud para emergencias médicas domiciliarias, consultas de servicios y soluciones para empresas. Disponibles 24/7.",
    },
  ],
};

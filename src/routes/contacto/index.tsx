import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ContactForm } from "~/components/forms/ContactForm";
import {
  TELEFONO_EMERGENCIAS,
  TELEFONO_HREF,
  EMAIL_CONTACTO,
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
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto items-start">
            {/* Sidebar info */}
            <div class="space-y-6 lg:sticky lg:top-28">
              {/* Canales de Atención */}
              <div class="bg-white rounded-2xl p-6 border border-gris-200 shadow-card space-y-5">
                <h2 class="font-display font-bold text-navy-900 text-lg border-b border-gris-100 pb-3">
                  Canales de Atención
                </h2>

                {/* Emergencias */}
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                    <span class="text-xl">🚨</span>
                  </div>
                  <div>
                    <h3 class="font-display font-bold text-navy-900 text-[14px]">Emergencias 24hs</h3>
                    <p class="text-gris-500 font-body text-xs mt-0.5 mb-1.5">Llamado directo urgente</p>
                    <a
                      href={TELEFONO_HREF}
                      class="text-red-600 hover:text-red-750 font-display font-bold text-lg transition-colors"
                    >
                      📞 {TELEFONO_EMERGENCIAS}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div class="flex items-start gap-4 pt-4 border-t border-gris-100">
                  <div class="w-10 h-10 bg-navy-50 text-navy-500 rounded-xl flex items-center justify-center shrink-0">
                    <span class="text-xl">✉️</span>
                  </div>
                  <div>
                    <h3 class="font-display font-bold text-navy-900 text-[14px]">Correo Electrónico</h3>
                    <p class="text-gris-500 font-body text-xs mt-0.5 mb-1">Consultas generales y de prensa</p>
                    <a
                      href={`mailto:${EMAIL_CONTACTO}`}
                      class="text-verde-600 hover:text-verde-700 font-body font-semibold text-[13.5px] transition-colors break-all"
                    >
                      {EMAIL_CONTACTO}
                    </a>
                  </div>
                </div>
              </div>

              {/* Base Operativa */}
              <div class="bg-white rounded-2xl p-6 border border-gris-200 shadow-card">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-verde-50 rounded-xl flex items-center justify-center">
                    <span class="text-xl">📍</span>
                  </div>
                  <h2 class="font-display font-bold text-navy-900 text-lg">
                    Base Operativa
                  </h2>
                </div>
                <p class="text-gris-700 font-body font-semibold text-[14.5px] leading-relaxed mb-1">
                  Av. Lope de Vega 960, C1407
                </p>
                <p class="text-gris-500 font-body text-xs">
                  Buenos Aires - Argentina
                </p>
              </div>
            </div>

            {/* Formulario */}
            <div class="lg:col-span-2 bg-white rounded-2xl p-8 shadow-card border border-gris-100 self-start">
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

      {/* Sección Dedicada para el Código QR */}
      <section class="pb-20 bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 flex justify-center">
          <img
            src="/qr.webp"
            alt="Código QR Oficial Mijal Salud"
            class="w-[320px] md:w-[380px] h-auto object-contain drop-shadow-md"
            width={380}
            height={380}
          />
        </div>
      </section>

      {/* Mapa de Google Maps de Ancho Completo */}
      <section class="w-full bg-white leading-none">
        <div class="w-full h-[450px] relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d105054.95820095942!2d-58.50415300000001!3d-34.630263!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcc9ca331f871b%3A0xb3c655782b68d6d5!2sMijal%20Salud%20S.A.%20%7C%20Base%20Operativa!5e0!3m2!1ses-419!2sar!4v1780291544818!5m2!1ses-419!2sar"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullscreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa Base Operativa Mijal Salud"
          ></iframe>
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

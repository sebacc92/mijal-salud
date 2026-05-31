import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import {
  WHATSAPP_ATENCION,
  TELEFONO_EMERGENCIAS,
  TELEFONO_HREF,
} from "~/lib/constants";
import coverImg from "~/media/mijal-linkedin-portada.webp";

const taglines = [
  "Tu médico, a un click de distancia",
  "Emergencias · Urgencias · Prevención",
  "Más de 20 años cuidando la salud",
];

export const Hero = component$(() => {
  const currentSlide = useSignal(0);
  const mounted = useSignal(false);

  useVisibleTask$(({ cleanup }) => {
    mounted.value = true;
    const interval = setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % taglines.length;
    }, 4000);
    cleanup(() => clearInterval(interval));
  });

  return (
    <section class="relative min-h-screen flex items-center overflow-hidden bg-navy-900">
      {/* Imagen de fondo sutil (30% de opacidad) */}
      <div
        class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url(${coverImg})`,
        }}
      />

      {/* Gradiente de fondo */}
      <div class="absolute inset-0 bg-gradient-hero opacity-80 z-0" />

      {/* Grid decorativo sutil */}
      <div
        class="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Blob decorativo verde */}
      <div class="absolute top-1/4 right-[-5%] w-96 h-96 bg-verde-500 rounded-full opacity-20 blur-[120px] animate-pulse-soft" />
      <div class="absolute bottom-1/4 left-[-5%] w-64 h-64 bg-navy-400 rounded-full opacity-30 blur-[100px]" />

      {/* Círculos decorativos */}
      <div class="absolute top-20 right-20 w-72 h-72 border border-white/5 rounded-full hidden lg:block" />
      <div class="absolute top-32 right-32 w-48 h-48 border border-white/5 rounded-full hidden lg:block" />

      <div class="relative z-10 container mx-auto px-6 lg:px-12 pt-28 pb-20">
        <div class="max-w-3xl">
          {/* Badge "activo 24/7" */}
          <div
            class={[
              "inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5 mb-8 transition-all duration-700",
              mounted.value
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4",
            ]}
          >
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-verde-400 opacity-75" />
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-verde-400" />
            </span>
            <span class="text-white/90 text-sm font-body font-medium">
              Central operativa activa 24/7
            </span>
          </div>

          {/* Headline principal */}
          <h1
            class={[
              "font-display text-hero text-white mb-5 transition-all duration-700 delay-100",
              mounted.value
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5",
            ]}
          >
            Salud domiciliaria{" "}
            <span class="text-verde-400">de excelencia</span>
            <br />
            en Buenos Aires
          </h1>

          {/* Tagline rotativo */}
          <div
            class={[
              "h-8 mb-10 transition-all duration-700 delay-200",
              mounted.value
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4",
            ]}
          >
            <p
              key={currentSlide.value}
              class="text-white/75 text-body-lg font-body animate-fade-in"
            >
              {taglines[currentSlide.value]}
            </p>
          </div>

          {/* CTAs */}
          <div
            class={[
              "flex flex-col sm:flex-row gap-4 mb-10 transition-all duration-700 delay-300",
              mounted.value
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4",
            ]}
          >
            <a
              href={WHATSAPP_ATENCION}
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center justify-center gap-3 bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold text-lg px-8 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-300 hover:-translate-y-0.5"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Necesito atención ahora
            </a>

            <a
              href="/empresas"
              class="group flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-display font-semibold text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Soluciones para empresas
              <svg
                class="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>

          {/* Teléfono directo */}
          <div
            class={[
              "flex items-center gap-4 transition-all duration-700 delay-[400ms]",
              mounted.value
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3",
            ]}
          >
            <div class="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0">
              <svg
                class="w-5 h-5 text-verde-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <p class="text-white/50 text-xs font-body uppercase tracking-wide mb-0.5">
                Central de emergencias
              </p>
              <a
                href={TELEFONO_HREF}
                class="text-white font-display font-bold text-2xl hover:text-verde-400 transition-colors"
              >
                {TELEFONO_EMERGENCIAS}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-float">
        <span class="text-white/30 text-xs font-body tracking-[0.2em] uppercase">
          Scrollear
        </span>
        <svg
          class="w-5 h-5 text-white/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Curva inferior */}
      <div class="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-full"
        >
          <path d="M0 80L1440 80V40C1440 40 1080 0 720 0C360 0 0 40 0 40V80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
});

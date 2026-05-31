import { component$, useSignal, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import {
  WHATSAPP_ATENCION,
  TELEFONO_EMERGENCIAS,
  TELEFONO_HREF,
} from "~/lib/constants";
import { isValidEmail } from "~/lib/utils";

export const ContactCTA = component$(() => {
  const email = useSignal("");
  const loading = useSignal(false);
  const success = useSignal(false);
  const error = useSignal("");

  const handleSubmit = $(async (e: SubmitEvent) => {
    e.preventDefault();
    if (!isValidEmail(email.value)) {
      error.value = "Por favor ingresá un email válido";
      return;
    }
    loading.value = true;
    error.value = "";
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value }),
      });
      if (res.ok) {
        success.value = true;
        email.value = "";
      } else {
        error.value = "Hubo un error. Intentá nuevamente.";
      }
    } catch {
      error.value = "Error de conexión. Verificá tu internet.";
    } finally {
      loading.value = false;
    }
  });

  return (
    <section class="py-section bg-navy-900 relative overflow-hidden">
      {/* Decoración */}
      <div class="absolute inset-0 bg-gradient-hero opacity-85" />
      <div class="absolute top-0 right-0 w-72 h-72 bg-verde-500 rounded-full opacity-10 blur-3xl" />
      <div class="absolute bottom-0 left-20 w-64 h-64 bg-navy-500 rounded-full opacity-20 blur-2xl" />

      <div class="relative container mx-auto px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Izquierda: CTA principal */}
          <div>
            <h2 class="font-display text-h2 text-white mb-5">
              ¿Listo para proteger{" "}
              <span class="text-verde-400">tu salud</span> y la de tu familia?
            </h2>
            <p class="text-white/70 font-body text-body-lg mb-8">
              Contactanos ahora mismo. Estamos disponibles las 24 horas, los 365
              días del año.
            </p>

            <div class="flex flex-col gap-4 mb-10">
              <a
                href={WHATSAPP_ATENCION}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold text-lg px-7 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200 hover:-translate-y-0.5 w-fit"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Escribinos por WhatsApp
              </a>
              <a
                href={TELEFONO_HREF}
                class="flex items-center gap-3 text-white/80 hover:text-white font-display font-semibold text-lg transition-colors w-fit"
              >
                <span class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  📞
                </span>
                {TELEFONO_EMERGENCIAS}
              </a>
            </div>

            <Link
              href="/contacto"
              class="text-white/60 hover:text-verde-400 font-body text-sm underline underline-offset-4 transition-colors"
            >
              O completá el formulario de contacto →
            </Link>
          </div>

          {/* Derecha: Newsletter */}
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <h3 class="font-display font-bold text-white text-2xl mb-2">
              Recibí consejos de salud
            </h3>
            <p class="text-white/60 font-body text-sm mb-6">
              Tips de prevención, novedades y alertas de salud estacional. Sin
              spam, solo lo relevante.
            </p>

            {success.value ? (
              <div class="flex items-center gap-3 bg-verde-500/20 border border-verde-500/40 rounded-2xl p-5">
                <div class="w-10 h-10 bg-verde-500 rounded-full flex items-center justify-center shrink-0">
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p class="text-white font-body font-medium">
                  ¡Gracias! Vas a recibir nuestro contenido de salud.
                </p>
              </div>
            ) : (
              <form
                preventdefault:submit
                onSubmit$={handleSubmit}
                class="space-y-4"
              >
                <div>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email.value}
                    onInput$={(e) =>
                      (email.value = (e.target as HTMLInputElement).value)
                    }
                    class="w-full bg-white/10 border border-white/20 focus:border-verde-400 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 font-body outline-none transition-colors"
                    required
                  />
                  {error.value && (
                    <p class="text-red-400 text-sm font-body mt-2">
                      {error.value}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading.value}
                  class="w-full bg-verde-500 hover:bg-verde-600 disabled:opacity-60 text-white font-display font-semibold py-3.5 rounded-xl shadow-cta transition-all duration-200"
                >
                  {loading.value ? "Subscribiendo..." : "Suscribirme gratis"}
                </button>
                <p class="text-white/40 text-xs font-body text-center">
                  Podés desuscribirte en cualquier momento.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

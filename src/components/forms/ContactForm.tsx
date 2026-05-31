import { component$, useSignal, $ } from "@builder.io/qwik";
import { isValidEmail } from "~/lib/utils";

interface ContactFormProps {
  compact?: boolean;
}

export const ContactForm = component$<ContactFormProps>(
  ({ compact = false }) => {
    const nombre = useSignal("");
    const email = useSignal("");
    const telefono = useSignal("");
    const asunto = useSignal("");
    const mensaje = useSignal("");
    const loading = useSignal(false);
    const success = useSignal(false);
    const errors = useSignal<Record<string, string>>({});

    const validate = $(() => {
      const errs: Record<string, string> = {};
      if (!nombre.value.trim()) errs.nombre = "El nombre es requerido";
      if (!email.value.trim()) errs.email = "El email es requerido";
      else if (!isValidEmail(email.value)) errs.email = "Email inválido";
      if (!mensaje.value.trim()) errs.mensaje = "El mensaje es requerido";
      errors.value = errs;
      return Object.keys(errs).length === 0;
    });

    const handleSubmit = $(async (e: SubmitEvent) => {
      e.preventDefault();
      const valid = await validate();
      if (!valid) return;

      loading.value = true;
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nombre.value.trim(),
            email: email.value.trim(),
            telefono: telefono.value.trim() || undefined,
            asunto: asunto.value.trim() || undefined,
            mensaje: mensaje.value.trim(),
          }),
        });

        if (res.ok) {
          success.value = true;
          nombre.value = "";
          email.value = "";
          telefono.value = "";
          asunto.value = "";
          mensaje.value = "";
        } else {
          const data = await res.json();
          errors.value = { submit: data.error || "Error al enviar" };
        }
      } catch {
        errors.value = { submit: "Error de conexión. Intentá nuevamente." };
      } finally {
        loading.value = false;
      }
    });

    if (success.value) {
      return (
        <div class="flex flex-col items-center gap-4 py-10 text-center">
          <div class="w-16 h-16 bg-verde-100 rounded-full flex items-center justify-center">
            <svg
              class="w-8 h-8 text-verde-600"
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
          <h3 class="font-display font-bold text-navy-900 text-xl">
            ¡Mensaje recibido!
          </h3>
          <p class="text-gris-600 font-body">
            Te responderemos en menos de 24 horas hábiles.
          </p>
          <button
            onClick$={() => (success.value = false)}
            class="text-verde-600 font-body text-sm underline underline-offset-4"
          >
            Enviar otro mensaje
          </button>
        </div>
      );
    }

    return (
      <form
        preventdefault:submit
        onSubmit$={handleSubmit}
        class="space-y-5"
        noValidate
      >
        {/* Nombre + Email */}
        <div class={compact ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}>
          <div>
            <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">
              Nombre completo <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="contact-nombre"
              value={nombre.value}
              onInput$={(e) =>
                (nombre.value = (e.target as HTMLInputElement).value)
              }
              placeholder="María García"
              class={[
                "w-full border rounded-xl px-4 py-3 font-body text-gris-900 placeholder:text-gris-400 outline-none transition-colors",
                errors.value.nombre
                  ? "border-red-300 bg-red-50 focus:border-red-500"
                  : "border-gris-200 bg-white focus:border-verde-400",
              ]}
            />
            {errors.value.nombre && (
              <p class="text-red-500 text-xs font-body mt-1.5">
                {errors.value.nombre}
              </p>
            )}
          </div>

          <div>
            <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="contact-email"
              value={email.value}
              onInput$={(e) =>
                (email.value = (e.target as HTMLInputElement).value)
              }
              placeholder="maria@email.com"
              class={[
                "w-full border rounded-xl px-4 py-3 font-body text-gris-900 placeholder:text-gris-400 outline-none transition-colors",
                errors.value.email
                  ? "border-red-300 bg-red-50 focus:border-red-500"
                  : "border-gris-200 bg-white focus:border-verde-400",
              ]}
            />
            {errors.value.email && (
              <p class="text-red-500 text-xs font-body mt-1.5">
                {errors.value.email}
              </p>
            )}
          </div>
        </div>

        {/* Teléfono + Asunto */}
        {!compact && (
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">
                Teléfono
              </label>
              <input
                type="tel"
                id="contact-telefono"
                value={telefono.value}
                onInput$={(e) =>
                  (telefono.value = (e.target as HTMLInputElement).value)
                }
                placeholder="+54 11 1234-5678"
                class="w-full border border-gris-200 bg-white focus:border-verde-400 rounded-xl px-4 py-3 font-body text-gris-900 placeholder:text-gris-400 outline-none transition-colors"
              />
            </div>
            <div>
              <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">
                Asunto
              </label>
              <select
                id="contact-asunto"
                value={asunto.value}
                onChange$={(e) =>
                  (asunto.value = (e.target as HTMLSelectElement).value)
                }
                class="w-full border border-gris-200 bg-white focus:border-verde-400 rounded-xl px-4 py-3 font-body text-gris-900 outline-none transition-colors"
              >
                <option value="">Seleccionar...</option>
                <option value="consulta-general">Consulta general</option>
                <option value="servicios">Información de servicios</option>
                <option value="empresas">Soluciones para empresas</option>
                <option value="obras-sociales">Obras sociales</option>
                <option value="reclamo">Reclamo o sugerencia</option>
              </select>
            </div>
          </div>
        )}

        {/* Mensaje */}
        <div>
          <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">
            Mensaje <span class="text-red-500">*</span>
          </label>
          <textarea
            id="contact-mensaje"
            value={mensaje.value}
            onInput$={(e) =>
              (mensaje.value = (e.target as HTMLTextAreaElement).value)
            }
            placeholder="Contanos en qué te podemos ayudar..."
            rows={compact ? 3 : 5}
            class={[
              "w-full border rounded-xl px-4 py-3 font-body text-gris-900 placeholder:text-gris-400 outline-none transition-colors resize-none",
              errors.value.mensaje
                ? "border-red-300 bg-red-50 focus:border-red-500"
                : "border-gris-200 bg-white focus:border-verde-400",
            ]}
          />
          {errors.value.mensaje && (
            <p class="text-red-500 text-xs font-body mt-1.5">
              {errors.value.mensaje}
            </p>
          )}
        </div>

        {/* Error general */}
        {errors.value.submit && (
          <div class="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p class="text-red-600 text-sm font-body">{errors.value.submit}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading.value}
          class="w-full bg-verde-500 hover:bg-verde-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-display font-semibold py-4 rounded-xl shadow-cta hover:shadow-cta-hover transition-all duration-200"
        >
          {loading.value ? (
            <span class="flex items-center justify-center gap-2">
              <svg
                class="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Enviando...
            </span>
          ) : (
            "Enviar mensaje"
          )}
        </button>
      </form>
    );
  },
);

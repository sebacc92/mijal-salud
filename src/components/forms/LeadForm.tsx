import { component$, useSignal, $ } from "@builder.io/qwik";
import { isValidEmail } from "~/lib/utils";

const servicios = [
  { value: "salud-directa", label: "Mijal Salud Directa" },
  { value: "care-ia", label: "Mijal Care IA" },
  { value: "prevencion-activa", label: "Mijal Prevención Activa" },
  { value: "salud-360", label: "Mijal Salud 360" },
  { value: "conecta-salud", label: "Mijal Conecta Salud" },
];

const segmentos = [
  { value: "particular", label: "Particular / Familia" },
  { value: "empresa", label: "Empresa" },
  { value: "obra-social", label: "Obra Social / Aseguradora" },
];

interface LeadFormProps {
  servicioDefault?: string;
}

export const LeadForm = component$<LeadFormProps>(
  ({ servicioDefault = "" }) => {
    const nombre = useSignal("");
    const email = useSignal("");
    const telefono = useSignal("");
    const empresa = useSignal("");
    const servicio = useSignal(servicioDefault);
    const segmento = useSignal("");
    const mensaje = useSignal("");
    const loading = useSignal(false);
    const success = useSignal(false);
    const errors = useSignal<Record<string, string>>({});

    const handleSubmit = $(async (e: SubmitEvent) => {
      e.preventDefault();
      const errs: Record<string, string> = {};
      if (!nombre.value.trim()) errs.nombre = "Requerido";
      if (!email.value.trim() || !isValidEmail(email.value)) errs.email = "Email inválido";
      if (!servicio.value) errs.servicio = "Seleccioná un servicio";
      if (!segmento.value) errs.segmento = "Seleccioná tu perfil";
      errors.value = errs;
      if (Object.keys(errs).length > 0) return;

      loading.value = true;
      try {
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nombre.value.trim(),
            email: email.value.trim(),
            telefono: telefono.value.trim() || undefined,
            empresa: empresa.value.trim() || undefined,
            servicio: servicio.value,
            segmento: segmento.value,
            mensaje: mensaje.value.trim() || undefined,
          }),
        });
        if (res.ok) {
          success.value = true;
        } else {
          const data = await res.json();
          errors.value = { submit: data.error || "Error al enviar" };
        }
      } catch {
        errors.value = { submit: "Error de conexión" };
      } finally {
        loading.value = false;
      }
    });

    if (success.value) {
      return (
        <div class="flex flex-col items-center gap-4 py-10 text-center">
          <div class="w-16 h-16 bg-verde-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-verde-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="font-display font-bold text-navy-900 text-xl">¡Gracias por tu interés!</h3>
          <p class="text-gris-600 font-body">Un asesor te contactará dentro de las próximas 24 horas hábiles.</p>
        </div>
      );
    }

    return (
      <form preventdefault:submit onSubmit$={handleSubmit} class="space-y-4" noValidate>
        {/* Nombre + Email */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">
              Nombre <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lead-nombre"
              value={nombre.value}
              onInput$={(e) => (nombre.value = (e.target as HTMLInputElement).value)}
              placeholder="Tu nombre"
              class={["w-full border rounded-xl px-4 py-3 font-body text-gris-900 placeholder:text-gris-400 outline-none transition-colors",
                errors.value.nombre ? "border-red-300 bg-red-50" : "border-gris-200 focus:border-verde-400"]}
            />
            {errors.value.nombre && <p class="text-red-500 text-xs mt-1">{errors.value.nombre}</p>}
          </div>

          <div>
            <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="lead-email"
              value={email.value}
              onInput$={(e) => (email.value = (e.target as HTMLInputElement).value)}
              placeholder="tu@email.com"
              class={["w-full border rounded-xl px-4 py-3 font-body text-gris-900 placeholder:text-gris-400 outline-none transition-colors",
                errors.value.email ? "border-red-300 bg-red-50" : "border-gris-200 focus:border-verde-400"]}
            />
            {errors.value.email && <p class="text-red-500 text-xs mt-1">{errors.value.email}</p>}
          </div>
        </div>

        {/* Teléfono + Empresa */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">Teléfono</label>
            <input
              type="tel"
              id="lead-telefono"
              value={telefono.value}
              onInput$={(e) => (telefono.value = (e.target as HTMLInputElement).value)}
              placeholder="+54 11 ..."
              class="w-full border border-gris-200 focus:border-verde-400 rounded-xl px-4 py-3 font-body text-gris-900 placeholder:text-gris-400 outline-none transition-colors"
            />
          </div>
          <div>
            <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">Empresa / Organización</label>
            <input
              type="text"
              id="lead-empresa"
              value={empresa.value}
              onInput$={(e) => (empresa.value = (e.target as HTMLInputElement).value)}
              placeholder="Nombre de tu empresa"
              class="w-full border border-gris-200 focus:border-verde-400 rounded-xl px-4 py-3 font-body text-gris-900 placeholder:text-gris-400 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Servicio + Segmento */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">
              Servicio de interés <span class="text-red-500">*</span>
            </label>
            <select
              id="lead-servicio"
              value={servicio.value}
              onChange$={(e) => (servicio.value = (e.target as HTMLSelectElement).value)}
              class={["w-full border rounded-xl px-4 py-3 font-body text-gris-900 outline-none transition-colors bg-white",
                errors.value.servicio ? "border-red-300" : "border-gris-200 focus:border-verde-400"]}
            >
              <option value="">Seleccionar...</option>
              {servicios.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {errors.value.servicio && <p class="text-red-500 text-xs mt-1">{errors.value.servicio}</p>}
          </div>

          <div>
            <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">
              Soy <span class="text-red-500">*</span>
            </label>
            <select
              id="lead-segmento"
              value={segmento.value}
              onChange$={(e) => (segmento.value = (e.target as HTMLSelectElement).value)}
              class={["w-full border rounded-xl px-4 py-3 font-body text-gris-900 outline-none transition-colors bg-white",
                errors.value.segmento ? "border-red-300" : "border-gris-200 focus:border-verde-400"]}
            >
              <option value="">Seleccionar...</option>
              {segmentos.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {errors.value.segmento && <p class="text-red-500 text-xs mt-1">{errors.value.segmento}</p>}
          </div>
        </div>

        {/* Mensaje */}
        <div>
          <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">Mensaje (opcional)</label>
          <textarea
            id="lead-mensaje"
            value={mensaje.value}
            onInput$={(e) => (mensaje.value = (e.target as HTMLTextAreaElement).value)}
            placeholder="Contanos un poco más sobre tu necesidad..."
            rows={3}
            class="w-full border border-gris-200 focus:border-verde-400 rounded-xl px-4 py-3 font-body text-gris-900 placeholder:text-gris-400 outline-none transition-colors resize-none"
          />
        </div>

        {errors.value.submit && (
          <div class="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p class="text-red-600 text-sm font-body">{errors.value.submit}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading.value}
          class="w-full bg-verde-500 hover:bg-verde-600 disabled:opacity-60 text-white font-display font-semibold py-4 rounded-xl shadow-cta transition-all duration-200"
        >
          {loading.value ? "Enviando..." : "Quiero que me contacten"}
        </button>
      </form>
    );
  },
);

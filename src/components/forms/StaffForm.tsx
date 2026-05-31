import { component$, useSignal, $ } from "@builder.io/qwik";
import { isValidEmail, isValidPhone } from "~/lib/utils";

const roles = [
  "Médico / Médica",
  "Enfermero / Enfermera",
  "Paramédico",
  "Kinesiólogo / Kinesióloga",
  "Administrativo / Administrativa",
  "Conductor de ambulancia",
  "Otro",
];

export const StaffForm = component$(() => {
  const nombre = useSignal("");
  const email = useSignal("");
  const telefono = useSignal("");
  const rol = useSignal("");
  const mensaje = useSignal("");
  const cvFileSignal = useSignal<File | null>(null);
  const cvBase64 = useSignal<string>("");
  const cvFileName = useSignal<string>("");
  const loading = useSignal(false);
  const success = useSignal(false);
  const errors = useSignal<Record<string, string>>({});

  const handleFileChange = $((e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        errors.value = { ...errors.value, cv: "El archivo no debe superar los 5MB" };
        input.value = "";
        cvFileSignal.value = null;
        return;
      }

      // Validar tipo
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        errors.value = { ...errors.value, cv: "Formatos permitidos: PDF, DOC o DOCX" };
        input.value = "";
        cvFileSignal.value = null;
        return;
      }

      errors.value = { ...errors.value, cv: "" };
      cvFileSignal.value = file;
      cvFileName.value = file.name;

      // Convertir a base64
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          cvBase64.value = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  });

  const handleSubmit = $(async (e: SubmitEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!nombre.value.trim()) errs.nombre = "Requerido";
    if (!email.value.trim() || !isValidEmail(email.value)) errs.email = "Email inválido";
    if (!telefono.value.trim() || !isValidPhone(telefono.value)) errs.telefono = "Teléfono inválido";
    if (!cvFileSignal.value) errs.cv = "Debes adjuntar tu CV para postularte";
    
    errors.value = errs;
    if (Object.keys(errs).length > 0) return;

    loading.value = true;
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.value.trim(),
          email: email.value.trim(),
          telefono: telefono.value.trim(),
          rol: rol.value || undefined,
          mensaje: mensaje.value.trim() || undefined,
          cvBase64: cvBase64.value || undefined,
          cvFileName: cvFileName.value || undefined,
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
        <h3 class="font-display font-bold text-navy-900 text-xl">¡Postulación recibida!</h3>
        <p class="text-gris-600 font-body max-w-sm">
          Revisaremos tu perfil y tu CV adjunto. Nos contactaremos a la brevedad para coordinar una entrevista. Muchas gracias por tu interés en ser parte del equipo Mijal Salud.
        </p>
      </div>
    );
  }

  return (
    <form preventdefault:submit onSubmit$={handleSubmit} class="space-y-4" noValidate>
      {/* Nombre */}
      <div>
        <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">
          Nombre completo <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="staff-nombre"
          value={nombre.value}
          onInput$={(e) => (nombre.value = (e.target as HTMLInputElement).value)}
          placeholder="Tu nombre y apellido"
          class={["w-full border rounded-xl px-4 py-3 font-body text-gris-900 placeholder:text-gris-400 outline-none transition-colors",
            errors.value.nombre ? "border-red-300 bg-red-50" : "border-gris-200 focus:border-verde-400"]}
        />
        {errors.value.nombre && <p class="text-red-500 text-xs mt-1">{errors.value.nombre}</p>}
      </div>

      {/* Email + Teléfono */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="staff-email"
            value={email.value}
            onInput$={(e) => (email.value = (e.target as HTMLInputElement).value)}
            placeholder="tu@email.com"
            class={["w-full border rounded-xl px-4 py-3 font-body text-gris-900 placeholder:text-gris-400 outline-none transition-colors",
              errors.value.email ? "border-red-300 bg-red-50" : "border-gris-200 focus:border-verde-400"]}
          />
          {errors.value.email && <p class="text-red-500 text-xs mt-1">{errors.value.email}</p>}
        </div>

        <div>
          <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">
            Teléfono <span class="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="staff-telefono"
            value={telefono.value}
            onInput$={(e) => (telefono.value = (e.target as HTMLInputElement).value)}
            placeholder="+54 11 1234-5678"
            class={["w-full border rounded-xl px-4 py-3 font-body text-gris-900 placeholder:text-gris-400 outline-none transition-colors",
              errors.value.telefono ? "border-red-300 bg-red-50" : "border-gris-200 focus:border-verde-400"]}
          />
          {errors.value.telefono && <p class="text-red-500 text-xs mt-1">{errors.value.telefono}</p>}
        </div>
      </div>

      {/* Rol */}
      <div>
        <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">Rol / Área de interés</label>
        <select
          id="staff-rol"
          value={rol.value}
          onChange$={(e) => (rol.value = (e.target as HTMLSelectElement).value)}
          class="w-full border border-gris-200 focus:border-verde-400 rounded-xl px-4 py-3 font-body text-gris-900 outline-none transition-colors bg-white"
        >
          <option value="">Seleccionar rol...</option>
          {roles.map((r) => (<option key={r} value={r}>{r}</option>))}
        </select>
      </div>

      {/* Adjuntar CV */}
      <div>
        <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">
          Adjuntar CV (PDF, DOC, DOCX) <span class="text-red-500">*</span>
        </label>
        <div class="relative flex items-center justify-center border-2 border-dashed border-gris-200 hover:border-verde-400 rounded-xl p-4 transition-colors bg-gris-50/50">
          <input
            type="file"
            id="staff-cv"
            accept=".pdf,.doc,.docx"
            onChange$={handleFileChange}
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div class="text-center">
            <span class="text-2xl mb-1 block">📄</span>
            <span class="font-body text-sm text-gris-600 block">
              {cvFileName.value ? (
                <span class="font-semibold text-verde-600">{cvFileName.value}</span>
              ) : (
                "Hacé click o arrastrá tu archivo aquí"
              )}
            </span>
            <span class="text-gris-400 text-xs mt-0.5 block">Máximo 5MB (PDF o Word)</span>
          </div>
        </div>
        {errors.value.cv && <p class="text-red-500 text-xs mt-1 font-body font-medium">{errors.value.cv}</p>}
      </div>

      {/* Mensaje */}
      <div>
        <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">
          Contanos sobre vos (opcional)
        </label>
        <textarea
          id="staff-mensaje"
          value={mensaje.value}
          onInput$={(e) => (mensaje.value = (e.target as HTMLTextAreaElement).value)}
          placeholder="Experiencia, disponibilidad, zona de trabajo, etc."
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
        class="w-full bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-display font-semibold py-4 rounded-xl transition-all duration-200 cursor-pointer"
      >
        {loading.value ? "Enviando..." : "Enviar postulación"}
      </button>
    </form>
  );
});

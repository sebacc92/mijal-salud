import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { isValidEmail } from "~/lib/utils";

export default component$(() => {
  const email = useSignal("");
  const password = useSignal("");
  const loading = useSignal(false);
  const error = useSignal("");

  const handleLogin = $(async (e: SubmitEvent) => {
    e.preventDefault();
    if (!isValidEmail(email.value) || password.value.length < 4) {
      error.value = "Por favor revisá tus datos de acceso";
      return;
    }
    loading.value = true;
    error.value = "";
    // Simulamos un breve delay
    await new Promise((r) => setTimeout(r, 1200));
    loading.value = false;
    error.value = "Portal en construcción. Te avisaremos por email cuando esté disponible.";
  });

  return (
    <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div class="w-full max-w-sm">
        {/* Logo */}
        <div class="text-center mb-8">
          <div class="w-14 h-14 bg-verde-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-cta">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 5v4m0 0v4m0-4h4m-4 0H8" />
            </svg>
          </div>
          <h1 class="font-display font-bold text-navy-900 text-2xl">Portal del Paciente</h1>
          <p class="text-gris-500 font-body text-sm mt-1">Ingresá con tus credenciales</p>
        </div>

        {/* Formulario */}
        <div class="bg-white rounded-2xl p-8 border border-gris-100 shadow-card">
          <form preventdefault:submit onSubmit$={handleLogin} class="space-y-4">
            <div>
              <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">Email</label>
              <input
                type="email"
                id="portal-email"
                value={email.value}
                onInput$={(e) => (email.value = (e.target as HTMLInputElement).value)}
                placeholder="tu@email.com"
                class="w-full border border-gris-200 focus:border-verde-400 rounded-xl px-4 py-3 font-body text-gris-900 placeholder:text-gris-400 outline-none transition-colors"
              />
            </div>
            <div>
              <label class="block font-body font-medium text-gris-700 text-sm mb-1.5">Contraseña</label>
              <input
                type="password"
                id="portal-password"
                value={password.value}
                onInput$={(e) => (password.value = (e.target as HTMLInputElement).value)}
                placeholder="••••••••"
                class="w-full border border-gris-200 focus:border-verde-400 rounded-xl px-4 py-3 font-body text-gris-900 placeholder:text-gris-400 outline-none transition-colors"
              />
            </div>

            {error.value && (
              <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p class="text-amber-700 text-sm font-body">{error.value}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading.value}
              class="w-full bg-verde-500 hover:bg-verde-600 disabled:opacity-60 text-white font-display font-semibold py-3.5 rounded-xl shadow-cta transition-all duration-200 mt-2"
            >
              {loading.value ? (
                <span class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Ingresando...
                </span>
              ) : "Ingresar"}
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-gris-500 font-body text-xs">
              ¿Problemas para ingresar?{" "}
              <Link href="/contacto" class="text-verde-600 hover:text-verde-700 underline underline-offset-2">
                Contactanos
              </Link>
            </p>
          </div>
        </div>

        {/* Aviso de construcción */}
        <div class="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
          <p class="text-blue-700 font-body text-sm">
            🚧 El portal digital está en desarrollo activo. <br />
            <span class="font-medium">Lanzamiento: Q2 2026</span>
          </p>
          <Link
            href="/soluciones/conecta-salud"
            class="inline-flex items-center gap-1 text-blue-600 font-body text-xs underline underline-offset-2 mt-2"
          >
            Conocer Mijal Conecta Salud →
          </Link>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Portal del Paciente — Mijal Salud",
  meta: [{ name: "description", content: "Accedé a tu historial médico, gestioná turnos y consultá tus atenciones en el portal de pacientes de Mijal Salud." }],
};

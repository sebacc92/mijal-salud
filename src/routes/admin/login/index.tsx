import { component$, useSignal, $ } from "@builder.io/qwik";
import { routeAction$, zod$, z, Link } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/db";
import { users } from "~/db/schema";
import { eq } from "drizzle-orm";

export const useLoginAction = routeAction$(
  async ({ username, password }, { cookie, redirect }) => {
    const db = getDb();

    // Auto-seed: si no hay usuarios registrados, creamos uno por defecto
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length === 0) {
      await db.insert(users).values({
        username: "admin",
        password: "admin123", // Contraseña por defecto
      });
    }

    // Buscar al usuario
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username.trim().toLowerCase()))
      .limit(1);

    if (!user || user.password !== password) {
      return {
        success: false,
        error: "Usuario o contraseña incorrectos.",
      };
    }

    // Guardar sesión en cookie por 7 días
    const isProd = import.meta.env.PROD || process.env.NODE_ENV === "production";
    cookie.set("auth_session", user.id.toString(), {
      path: "/",
      httpOnly: true,
      secure: !!isProd,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    throw redirect(302, "/admin/");
  },
  zod$({
    username: z.string().min(1, "Ingresá tu usuario"),
    password: z.string().min(1, "Ingresá tu contraseña"),
  })
);

export default component$((props: { hasPreseededUser?: boolean }) => {
  const loginAction = useLoginAction();
  const username = useSignal("");
  const password = useSignal("");

  const handleSubmit = $(async () => {
    if (!username.value.trim() || !password.value.trim()) return;
    await loginAction.submit({
      username: username.value,
      password: password.value,
    });
  });

  return (
    <div class="min-h-screen flex items-center justify-center bg-slate-900 p-6 relative overflow-hidden font-sans">
      {/* Decorative Glow */}
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-verde-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-verde-450/10 rounded-full blur-3xl"></div>

      <div class="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div class="text-center mb-8">
          <Link href="/" class="inline-flex items-center gap-3 mb-4 group cursor-pointer">
            <div class="w-12 h-12 bg-verde-500 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <span class="text-white font-black text-lg">M</span>
            </div>
            <span class="font-display font-bold text-2xl text-white tracking-wide">Mijal Salud</span>
          </Link>
          <h1 class="text-xl font-semibold text-slate-300 font-display">Acceso Administrativo</h1>
          <p class="text-slate-450 text-xs font-body mt-1 uppercase tracking-wider">Ingresá tus credenciales de panel</p>
        </div>

        {/* Card */}
        <div class="bg-slate-950/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
          <form
            preventdefault:submit
            onSubmit$={handleSubmit}
            class="space-y-5"
          >
            <div>
              <label class="block font-body font-semibold text-slate-300 text-xs mb-1.5 uppercase tracking-wider">Usuario</label>
              <input
                type="text"
                id="login-username"
                value={username.value}
                onInput$={(e) => (username.value = (e.target as HTMLInputElement).value)}
                placeholder="admin"
                class="w-full bg-slate-900/60 border border-slate-850 focus:border-verde-500 rounded-xl px-4 py-3.5 font-body text-white placeholder:text-slate-650 outline-none transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label class="block font-body font-semibold text-slate-300 text-xs mb-1.5 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                id="login-password"
                value={password.value}
                onInput$={(e) => (password.value = (e.target as HTMLInputElement).value)}
                placeholder="••••••••"
                class="w-full bg-slate-900/60 border border-slate-850 focus:border-verde-500 rounded-xl px-4 py-3.5 font-body text-white placeholder:text-slate-650 outline-none transition-colors"
              />
            </div>

            {loginAction.value?.error && (
              <div class="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <p class="text-red-400 text-sm font-body">{loginAction.value.error}</p>
              </div>
            )}

            {/* Ayuda de Desarrollo / Semilla */}
            <div class="bg-verde-500/5 border border-verde-500/20 rounded-xl px-4 py-3 text-center">
              <p class="text-[11px] text-slate-400 font-body">
                💡 <span class="font-medium text-verde-400">Desarrollo:</span> Si es la primera vez que ingresás, usá <code class="bg-slate-900 px-1 py-0.5 rounded text-verde-300 font-semibold">admin</code> / <code class="bg-slate-900 px-1 py-0.5 rounded text-verde-300 font-semibold">admin123</code>.
              </p>
            </div>

            <button
              type="submit"
              disabled={loginAction.isRunning}
              class="w-full bg-verde-500 hover:bg-verde-600 disabled:opacity-60 text-white font-display font-semibold py-3.5 rounded-xl shadow-cta hover:shadow-cta-hover transition-all duration-200 mt-2 cursor-pointer"
            >
              {loginAction.isRunning ? (
                <span class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Iniciando...
                </span>
              ) : "Ingresar"}
            </button>
          </form>
        </div>

        <div class="mt-6 text-center">
          <Link href="/" class="text-xs text-slate-500 hover:text-slate-400 underline underline-offset-2 font-body font-medium transition-colors cursor-pointer">
            ← Volver al sitio principal
          </Link>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Acceso Administrativo — Mijal Salud",
  meta: [{ name: "description", content: "Ingresá al panel administrativo de Mijal Salud" }],
};

import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

const portalNav = [
  { label: "Inicio", href: "/portal", icon: "🏠" },
  { label: "Mis atenciones", href: "/portal/atenciones", icon: "📋" },
  { label: "Mi historial", href: "/portal/historial", icon: "🩺" },
  { label: "Turnos", href: "/portal/turnos", icon: "📅" },
  { label: "Facturas", href: "/portal/facturas", icon: "💳" },
];

export default component$(() => {
  const loc = useLocation();

  return (
    <div class="min-h-screen bg-gris-50 pt-20">
      {/* Header del portal */}
      <header class="fixed top-0 left-0 right-0 z-50 bg-navy-900 border-b border-white/10 h-16 flex items-center px-6">
        <div class="flex items-center gap-3 flex-1">
          <Link href="/" class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-verde-500 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 5v4m0 0v4m0-4h4m-4 0H8" />
              </svg>
            </div>
            <span class="font-display font-bold text-white text-base">
              Mijal<span class="text-verde-400">Salud</span>
            </span>
          </Link>
          <span class="text-white/30 mx-2">|</span>
          <span class="text-white/60 font-body text-sm">Portal del Paciente</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-verde-500/20 rounded-full flex items-center justify-center text-verde-400 font-display font-bold text-sm">
            U
          </div>
        </div>
      </header>

      <div class="flex">
        {/* Sidebar */}
        <aside class="w-56 bg-white border-r border-gris-100 min-h-screen fixed left-0 top-16 bottom-0 hidden md:flex flex-col p-4">
          <nav class="space-y-1 flex-1">
            {portalNav.map((item) => {
              const isActive = loc.url.pathname === item.href || (item.href !== "/portal" && loc.url.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  class={[
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-colors",
                    isActive
                      ? "bg-verde-50 text-verde-700 border border-verde-200"
                      : "text-gris-600 hover:bg-gris-50 hover:text-navy-700",
                  ]}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div class="border-t border-gris-100 pt-4">
            <Link
              href="/"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-gris-500 hover:text-navy-700 hover:bg-gris-50 transition-colors"
            >
              <span>🔙</span>
              Volver al sitio
            </Link>
          </div>
        </aside>

        {/* Contenido */}
        <main class="flex-1 md:ml-56 p-6 min-h-screen">
          <Slot />
        </main>
      </div>
    </div>
  );
});

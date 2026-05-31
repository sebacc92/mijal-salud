import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation, routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import { getDb } from "~/db";
import { users } from "~/db/schema";
import { eq } from "drizzle-orm";

// 1. LA BARRERA DE SEGURIDAD (Se ejecuta en el servidor antes de renderizar nada)
export const onRequest: RequestHandler = async ({ cookie, url, redirect }) => {
  const currentPath = url.pathname.replace(/\/$/, "");
  const isLoginPage = currentPath === "/admin/login";
  const sessionCookie = cookie.get("auth_session");
  const hasValidSession =
    sessionCookie &&
    sessionCookie.value &&
    !isNaN(Number(sessionCookie.value));

  if (!hasValidSession && !isLoginPage) {
    throw redirect(302, "/admin/login/");
  }
  if (hasValidSession && isLoginPage) {
    throw redirect(302, "/admin/");
  }
};

export const useAdminUserLoader = routeLoader$(async (requestEvent) => {
  const userIdStr = requestEvent.cookie.get("auth_session")?.value;
  // Si no hay sesión o el formato no es numérico
  if (!userIdStr || isNaN(Number(userIdStr))) return null;

  try {
    const db = getDb();
    const [user] = await db
      .select({ username: users.username })
      .from(users)
      .where(eq(users.id, Number(userIdStr)));
    return user ? user.username : null;
  } catch (error) {
    console.error("Error in useAdminUserLoader:", error);
    return null;
  }
});

const navLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/admin/leads",
    label: "Leads Recibidos",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: "/admin/contactos",
    label: "Mensajes Contacto",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
  },
  {
    href: "/admin/postulantes",
    label: "Postulaciones CV",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/admin/blog",
    label: "Blog de Salud",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    href: "/admin/testimonios",
    label: "Testimonios",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    href: "/admin/galeria",
    label: "Galería de Fotos",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/admin/videos-verticales",
    label: "Videos Verticales",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/admin/chats",
    label: "Auditoría de IA",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
];

export default component$(() => {
  const location = useLocation();
  const adminUser = useAdminUserLoader();

  // Si es la página de login, se renderiza directa sin la barra lateral
  const isLoginPage = location.url.pathname.startsWith("/admin/login");
  if (isLoginPage) {
    return <Slot />;
  }

  return (
    <div class="flex min-h-screen bg-gray-100 font-sans">
      {/* Barra Lateral / Sidebar */}
      <aside class="w-64 min-h-screen bg-navy-900 text-white flex flex-col fixed top-0 left-0 z-40 shadow-2xl" style={{ width: "16rem" }}>
        {/* Brand/Logo de Administración */}
        <div class="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div class="w-9 h-9 rounded-xl bg-verde-500 flex items-center justify-center flex-shrink-0 shadow-cta">
            <span class="text-white font-black text-sm">MS</span>
          </div>
          <div>
            <p class="text-[10px] font-bold text-verde-400 uppercase tracking-widest leading-none">Admin</p>
            <p class="text-sm font-bold text-white leading-tight font-display">Mijal Salud Panel</p>
          </div>
        </div>

        {/* Links de Navegación */}
        <nav class="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? location.url.pathname === "/admin" ||
                  location.url.pathname === "/admin/"
                : location.url.pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                class={[
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-verde-500 text-white shadow-md font-semibold"
                    : "text-slate-350 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <span class={isActive ? "text-white" : "text-slate-400 group-hover:text-white"}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer del Sidebar */}
        <div class="px-6 py-4 border-t border-white/10 bg-navy-950/40">
          <Link
            href="/admin/logout"
            prefetch={false}
            class="flex items-center gap-2 text-xs text-slate-400 hover:text-red-400 transition-colors font-medium cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </Link>
          <p class="text-[10px] text-slate-500 mt-2 font-body font-medium">v1.1 · Mijal Salud S.A.</p>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main class="flex-1 min-h-screen" style={{ marginLeft: "16rem" }}>
        {/* Barra Superior / Header */}
        <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <nav class="text-xs text-slate-450 flex items-center gap-2 font-body font-semibold uppercase tracking-wider">
            <span class="text-slate-400">Mijal Salud</span>
            <span class="text-slate-350">/</span>
            <span class="text-navy-900">
              {location.url.pathname.replace("/admin", "").replace(/\//g, "") || "Dashboard"}
            </span>
          </nav>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-navy-900 text-verde-400 flex items-center justify-center border border-slate-200">
              <span class="font-bold text-xs uppercase">
                {adminUser.value ? adminUser.value.charAt(0) : "A"}
              </span>
            </div>
            <div class="text-left leading-none">
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest">Usuario</p>
              <p class="text-sm font-bold text-navy-900 capitalize mt-0.5">
                {adminUser.value || "Administrador"}
              </p>
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <div class="p-8">
          <Slot />
        </div>
      </main>
    </div>
  );
});

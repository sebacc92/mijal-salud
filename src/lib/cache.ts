import type { RequestEventCommon } from "@builder.io/qwik-city";

/**
 * Política de caché de CDN para páginas públicas que leen contenido de la base.
 *
 * ── Trade-off elegido ──────────────────────────────────────────────────────
 *   - sMaxAge (s-maxage) = 300s (5 min): el CDN de Vercel sirve la MISMA HTML
 *     cacheada durante 5 minutos, sin volver a ejecutar el SSR ni consultar
 *     Turso. => la enorme mayoría de las visitas NO golpean la base (rápido y
 *     barato, y resistente a picos de tráfico).
 *   - staleWhileRevalidate = 86400s (24h): pasada la ventana de 5 min, el CDN
 *     sigue devolviendo la versión vieja al instante mientras revalida en
 *     segundo plano. El visitante nunca espera y nunca ve una página rota,
 *     incluso si Turso está lento o caído en ese momento.
 *   - maxAge = 0: el navegador revalida en cada navegación (no cachea de más),
 *     así un cambio publicado se ve apenas expira la ventana del CDN.
 *
 * Consecuencia práctica: tras editar en el admin, el contenido nuevo aparece
 * en el sitio en ~5–10 minutos (según expiración del CDN), SIN redeploy.
 * Priorizamos rendimiento y costo por sobre inmediatez absoluta.
 */
export function publicContentCache(
  cacheControl: RequestEventCommon["cacheControl"],
): void {
  cacheControl({
    public: true,
    maxAge: 0,
    sMaxAge: 60 * 5,
    staleWhileRevalidate: 60 * 60 * 24,
  });
}

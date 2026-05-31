import type { RequestHandler } from "@builder.io/qwik-city";

const SITE = "https://mijalsalud.com.ar";

const routes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/servicios", priority: "0.9", changefreq: "monthly" },
  { path: "/servicios/emergencias", priority: "0.9", changefreq: "monthly" },
  { path: "/servicios/urgencias", priority: "0.8", changefreq: "monthly" },
  { path: "/servicios/traslados", priority: "0.8", changefreq: "monthly" },
  { path: "/servicios/internacion", priority: "0.8", changefreq: "monthly" },
  { path: "/servicios/visitas", priority: "0.8", changefreq: "monthly" },
  { path: "/servicios/area-protegida", priority: "0.8", changefreq: "monthly" },
  { path: "/soluciones", priority: "0.9", changefreq: "monthly" },
  { path: "/soluciones/salud-directa", priority: "0.8", changefreq: "monthly" },
  { path: "/soluciones/care-ia", priority: "0.8", changefreq: "monthly" },
  { path: "/soluciones/prevencion-activa", priority: "0.8", changefreq: "monthly" },
  { path: "/soluciones/salud-360", priority: "0.8", changefreq: "monthly" },
  { path: "/soluciones/conecta-salud", priority: "0.7", changefreq: "monthly" },
  { path: "/empresas", priority: "0.9", changefreq: "monthly" },
  { path: "/obras-sociales", priority: "0.8", changefreq: "monthly" },
  { path: "/nosotros", priority: "0.7", changefreq: "yearly" },
  { path: "/contacto", priority: "0.8", changefreq: "yearly" },
  { path: "/sumate", priority: "0.6", changefreq: "monthly" },
  { path: "/blog", priority: "0.7", changefreq: "daily" },
];

const today = new Date().toISOString().split("T")[0];

export const onGet: RequestHandler = ({ send }) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${SITE}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  send(
    new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    }),
  );
};

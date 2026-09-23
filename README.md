# Mijal Salud — Sitio web

Sitio institucional de Mijal Salud S.A. construido con **Qwik + TypeScript + Tailwind** y desplegado en **Vercel**.

---

## ✏️ Cómo editar textos (guía rápida para el cliente)

Hay dos formas de editar textos, según el contenido:

- **Desde el Panel de Admin** (recomendado, sin tocar código): la mayoría de los
  textos del sitio. Los cambios aparecen en el sitio en **~5 a 10 minutos**, sin
  necesidad de un nuevo despliegue.
- **Desde GitHub** (para los textos legales): editando archivos de contenido.
  Cuando guardás, Vercel vuelve a publicar el sitio **automáticamente en ~2 min**.

### Qué se edita y dónde

| Qué querés cambiar | Dónde se edita |
| --- | --- |
| **Textos de Servicios** (página general + cada servicio: emergencias, urgencias, visitas, traslados, internación, área protegida) | **Panel de Admin → Contenido de Servicios** |
| **PDF de Políticas de la Calidad** (link del footer) | **Panel de Admin → Configuración** |
| **Reseñas / Testimonios** (Home) | **Panel de Admin → Testimonios** |
| Fotos, videos, partners, chatbot | **Panel de Admin** (secciones correspondientes) |
| Texto legal de **Política de Privacidad** | GitHub: `src/content/legal/privacidad.json` |
| Texto legal de **Términos y Condiciones** | GitHub: `src/content/legal/terminos.json` |

> Los **textos legales** (privacidad y términos) se siguen editando desde GitHub
> como antes: son documentos sensibles y quedan versionados con historial de cambios.

### Editar los textos de Servicios desde el panel (paso a paso)

1. Entrá al **Panel de Admin** e iniciá sesión.
2. En el menú lateral, hacé clic en **«Contenido de Servicios»**.
3. Vas a ver la lista de páginas editables: *Servicios (general)* y cada servicio.
   La etiqueta **«Editado» / «Original»** indica si esa página ya fue modificada.
4. Hacé clic en la página que querés cambiar (por ejemplo *Emergencias*).
5. Editá los campos: títulos, párrafos, y las **listas** (por ejemplo «Incluye»).
   En las listas podés **agregar** (botón «+ Agregar…»), **quitar** (✕) y
   **reordenar** los ítems con las flechas ▲▼.
   - Para poner una palabra en **negrita**, encerrala entre dos asteriscos:
     `**palabra**`.
   - En el subtítulo de *Servicios (general)*, el texto `{{anios}}` se reemplaza
     solo por los años de trayectoria; podés dejarlo o borrarlo.
6. Hacé clic en **«Guardar cambios»** (barra inferior). Vas a ver el aviso
   «Guardado».
7. Esperá **~5 a 10 minutos** y recargá la página pública (con el link
   «Ver página pública ↗») para ver el cambio. La demora es normal: el sitio se
   sirve desde una caché rápida que se refresca sola.
8. ¿Te equivocaste? Usá **«Restaurar original»** para volver esa página al texto
   de fábrica.

> ⚠️ Si un cambio no aparece enseguida, **no lo guardes de nuevo repetidamente**:
> esperá los minutos de propagación de la caché y recargá. El contenido nunca se
> pierde y el sitio nunca se rompe, aunque la base esté momentáneamente caída
> (en ese caso se muestra el último contenido conocido).

### Cómo se edita un archivo `.json` desde GitHub (paso a paso)

1. Entrá al repositorio en GitHub y abrí el archivo que querés cambiar
   (por ejemplo `src/content/legal/privacidad.json`).
2. Hacé clic en el **ícono del lápiz** ✏️ (arriba a la derecha, "Edit this file").
3. Modificá **solo el texto que está entre comillas**. Respetá las comillas `"`,
   las comas `,` y los corchetes `[ ]` y llaves `{ }` — no los borres.
   - Para poner una palabra en **negrita**, encerrala entre dos asteriscos:
     `**Mijal Salud S.A.**`.
   - Cada punto de una lista es un texto entre comillas separado por coma.
4. Abajo, escribí una breve descripción del cambio y hacé clic en
   **"Commit changes"** (Confirmar cambios) sobre la rama `main`.
5. Listo. En ~2 minutos el cambio queda publicado en el sitio.

> ⚠️ **Importante:** si al editar borrás por error una comilla o una coma, el
> despliegue va a fallar y el sitio no se actualiza (pero **no se rompe** la
> versión que ya está online). Si eso pasa, deshacé el cambio o avisá al equipo
> de desarrollo. Ante la duda, mejor consultar antes de guardar.

---

## ✅ QA — Checklist de Contenido de Servicios

Casos a verificar tras tocar el contenido editable de `/servicios`:

- [ ] **Editar hero**: cambiar el título/subtítulo de *Servicios (general)* en el
      panel, guardar, y confirmar que se ve en `/servicios` (tras la propagación).
- [ ] **Editar card**: cambiar nombre, tagline, descripción, color y agregar/quitar
      un ítem de «Incluye» de un servicio; verificar el orden y el color en la card.
- [ ] **Editar subpágina**: modificar una subpágina (ej. *Emergencias*): hero, una
      lista (síntomas / qué traemos), los tiempos de respuesta y el CTA final.
- [ ] **Reordenar**: subir/bajar ítems de una lista y confirmar el nuevo orden en el sitio.
- [ ] **Propagación (~5–10 min)**: tras guardar, el cambio aparece sin redeploy; una
      recarga dura (Ctrl/Cmd+Shift+R) acelera la verificación.
- [ ] **SEO**: el título de la pestaña y la meta descripción reflejan lo editado
      (ver código fuente de la página o compartir el link).
- [ ] **Restaurar original**: el botón devuelve la página al texto de fábrica.
- [ ] **Fallback con base caída**: con Turso inaccesible, las páginas siguen
      renderizando (contenido por defecto / último conocido), nunca una página rota.
- [ ] **Build**: `pnpm build` termina sin errores (typecheck + lint + client + server).

---

## Referencias

- [Qwik Docs](https://qwik.dev/)
- [Discord](https://qwik.dev/chat)
- [Qwik GitHub](https://github.com/QwikDev/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Vite](https://vitejs.dev/)

---

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.dev/qwikcity/overview/). QwikCity is just an extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory-based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs](https://qwik.dev/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.

## Dev — Modelo de contenido editable de `/servicios`

El contenido de `/servicios` y subpáginas vive en `src/content/servicios/`:

- `types.ts` — tipos del contenido de cada página.
- `defaults.ts` — contenido por defecto (copia exacta del original). Doble función:
  **semilla** de la base y **fallback** estático si la base no responde.
- `form-schema.ts` — descriptores de los formularios del admin (los recorre
  `ContentEditor` para renderizar los campos; no hay un form a mano por página).
- `index.ts` — registro de páginas (`PAGES`) y helpers `getByPath` / `setByPath`.
- `loader.ts` — **sólo servidor**: `getPageContent` (lee la base con fallback,
  nunca lanza) y `savePageContent` / `resetPageContent` (upsert, con bootstrap
  perezoso `CREATE TABLE IF NOT EXISTS`, porque no hay pipeline de migraciones).

Se guarda en la tabla `page_content` (una fila por página, JSON en `data`). La base
sólo almacena lo modificado desde el admin. Caché de CDN en `src/lib/cache.ts`.

**Para agregar una página editable nueva**: definí su tipo en `types.ts`, su default
en `defaults.ts`, su form en `form-schema.ts`, registrala en `PAGES` (`index.ts`), y
en la ruta pública leé con `routeLoader$` + `getPageContent(id)` + `publicContentCache`.

## Add Integrations and deployment

Use the `pnpm qwik add` command to add additional integrations. Some examples of integrations includes: Cloudflare, Netlify or Express Server, and the [Static Site Generator (SSG)](https://qwik.dev/qwikcity/guides/static-site-generation/).

```shell
pnpm qwik add # or `pnpm qwik add`
```

## Development

Development mode uses [Vite's development server](https://vitejs.dev/). The `dev` command will server-side render (SSR) the output during development.

```shell
npm start # or `pnpm start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files. This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to preview a production build locally and should not be used as a production server.

```shell
pnpm preview # or `pnpm preview`
```

## Production

The production build will generate client and server modules by running both client and server build commands. The build command will use Typescript to run a type check on the source code.

```shell
pnpm build # or `pnpm build`
```

## Vercel Edge

This starter site is configured to deploy to [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions), which means it will be rendered at an edge location near to your users.

## Installation

The adaptor will add a new `vite.config.ts` within the `adapters/` directory, and a new entry file will be created, such as:

```
└── adapters/
    └── vercel-edge/
        └── vite.config.ts
└── src/
    └── entry.vercel-edge.tsx
```

Additionally, within the `package.json`, the `build.server` script will be updated with the Vercel Edge build.

## Production build

To build the application for production, use the `build` command, this command will automatically run `pnpm build.server` and `pnpm build.client`:

```shell
pnpm build
```

[Read the full guide here](https://github.com/QwikDev/qwik/blob/main/starters/adapters/vercel-edge/README.md)

## Dev deploy

To deploy the application for development:

```shell
pnpm deploy
```

Notice that you might need a [Vercel account](https://docs.Vercel.com/get-started/) in order to complete this step!

## Production deploy

The project is ready to be deployed to Vercel. However, you will need to create a git repository and push the code to it.

You can [deploy your site to Vercel](https://vercel.com/docs/concepts/deployments/overview) either via a Git provider integration or through the Vercel CLI.

# Mijal Salud — Sitio web

Sitio institucional de Mijal Salud S.A. construido con **Qwik + TypeScript + Tailwind** y desplegado en **Vercel**.

---

## ✏️ Cómo editar textos (guía rápida para el cliente)

Algunos textos del sitio están separados en **archivos de contenido** para que puedas
editarlos vos mismo desde GitHub, sin tocar código. Cuando guardás un cambio,
Vercel vuelve a publicar el sitio **automáticamente en ~2 minutos**.

### Qué archivo tocar

| Qué querés cambiar | Archivo a editar |
| --- | --- |
| Texto legal de **Política de Privacidad** | `src/content/legal/privacidad.json` |
| Texto legal de **Términos y Condiciones** | `src/content/legal/terminos.json` |
| **PDF de Políticas de la Calidad** (link del footer) | Se cambia desde el **Panel de Admin → Configuración** (no hace falta tocar código) |
| **Reseñas de Google** (Home) | Panel de Admin → Testimonios (o el seed en `src/routes/index.tsx`, marcado con `TODO-RESEÑA`) |

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

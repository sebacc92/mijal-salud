import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  // Eliminar la cookie de sesión
  cookie.delete("auth_session", { path: "/" });
  
  // Redireccionar al login administrativo
  throw redirect(302, "/admin/login/");
};

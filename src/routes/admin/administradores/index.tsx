import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  routeAction$,
  zod$,
  z,
  Form,
} from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { users } from "~/db/schema";
import { ensureAuthReady, hashPassword, verifyPassword } from "~/lib/auth";

const ROLES = [{ value: "admin", label: "Administrador" }] as const;

function currentUserId(cookieValue: string | undefined): number | null {
  const id = Number(cookieValue);
  return cookieValue && !isNaN(id) ? id : null;
}

// ─── Loader: lista de administradores + usuario actual ──────────────────────
export const useAdminsLoader = routeLoader$(async ({ cookie, env }) => {
  const db = getDb();
  await ensureAuthReady(db, env.get("SEED_ADMIN_USERS"));

  const currentId = currentUserId(cookie.get("auth_session")?.value);
  const admins = await db
    .select({
      id: users.id,
      username: users.username,
      role: users.role,
      lastLogin: users.lastLogin,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(users.username);

  return { currentId, admins };
});

// ─── Acción: crear administrador ────────────────────────────────────────────
export const useCreateAdmin = routeAction$(
  async (data, { env }) => {
    const db = getDb();
    await ensureAuthReady(db, env.get("SEED_ADMIN_USERS"));

    const username = data.username.trim().toLowerCase();

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    if (existing) {
      return { success: false, error: `El usuario "${username}" ya existe.` };
    }

    try {
      await db.insert(users).values({
        username,
        password: await hashPassword(data.password),
        role: data.role,
      });
    } catch (e) {
      console.error("Error creando administrador:", e);
      return { success: false, error: "No se pudo crear el administrador." };
    }

    return { success: true, username };
  },
  zod$({
    username: z
      .string()
      .min(3, "El usuario debe tener al menos 3 caracteres")
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Sólo letras, números y los símbolos . _ -",
      ),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    role: z.enum(["admin"]),
  }),
);

// ─── Acción: cambiar la contraseña del propio usuario ───────────────────────
export const useChangeOwnPassword = routeAction$(
  async (data, { cookie, env }) => {
    const db = getDb();
    await ensureAuthReady(db, env.get("SEED_ADMIN_USERS"));

    const id = currentUserId(cookie.get("auth_session")?.value);
    if (!id) return { success: false, error: "Sesión inválida." };

    if (data.newPassword !== data.confirmPassword) {
      return { success: false, error: "Las contraseñas nuevas no coinciden." };
    }

    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) return { success: false, error: "Usuario no encontrado." };

    if (!(await verifyPassword(data.currentPassword, user.password))) {
      return { success: false, error: "La contraseña actual es incorrecta." };
    }

    await db
      .update(users)
      .set({ password: await hashPassword(data.newPassword) })
      .where(eq(users.id, id));

    return { success: true };
  },
  zod$({
    currentPassword: z.string().min(1, "Ingresá tu contraseña actual"),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Repetí la nueva contraseña"),
  }),
);

// ─── Acción: eliminar un administrador (no a uno mismo) ──────────────────────
export const useDeleteAdmin = routeAction$(
  async (data, { cookie, env }) => {
    const db = getDb();
    await ensureAuthReady(db, env.get("SEED_ADMIN_USERS"));

    const currentId = currentUserId(cookie.get("auth_session")?.value);
    if (data.id === currentId) {
      return { success: false, error: "No podés eliminar tu propio usuario." };
    }

    const total = await db.select({ id: users.id }).from(users);
    if (total.length <= 1) {
      return { success: false, error: "Debe quedar al menos un administrador." };
    }

    await db.delete(users).where(eq(users.id, data.id));
    return { success: true };
  },
  zod$({ id: z.coerce.number().int().positive() }),
);

function formatFecha(iso: string | null): string {
  if (!iso) return "Nunca ingresó";
  const value = iso.includes("T") ? iso : iso.replace(" ", "T") + "Z";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default component$(() => {
  const data = useAdminsLoader();
  const createAction = useCreateAdmin();
  const passwordAction = useChangeOwnPassword();
  const deleteAction = useDeleteAdmin();

  const { currentId, admins } = data.value;

  return (
    <div class="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 class="text-2xl font-display font-bold text-navy-900">
          Administradores
        </h1>
        <p class="text-slate-500 font-body text-sm mt-1">
          Gestioná los usuarios con acceso al panel. Podés cambiar tu propia
          contraseña; del resto sólo ves el usuario, el rol y el último acceso.
        </p>
      </div>

      {/* Lista de administradores */}
      <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100">
          <h2 class="font-display font-bold text-navy-900">
            Usuarios ({admins.length})
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm font-body">
            <thead>
              <tr class="text-left text-slate-500 border-b border-slate-100 bg-slate-50">
                <th class="px-6 py-3 font-semibold">Usuario</th>
                <th class="px-6 py-3 font-semibold">Rol</th>
                <th class="px-6 py-3 font-semibold">Último acceso</th>
                <th class="px-6 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => {
                const isMe = a.id === currentId;
                return (
                  <tr key={a.id} class="border-b border-slate-50 last:border-0">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-navy-900 text-verde-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {a.username.charAt(0)}
                        </div>
                        <span class="font-semibold text-navy-900 capitalize">
                          {a.username}
                        </span>
                        {isMe && (
                          <span class="text-[10px] font-bold uppercase tracking-wider bg-verde-50 text-verde-700 px-2 py-0.5 rounded-full">
                            Vos
                          </span>
                        )}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full capitalize">
                        {a.role}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-slate-500">
                      {formatFecha(a.lastLogin)}
                    </td>
                    <td class="px-6 py-4 text-right">
                      {isMe ? (
                        <a
                          href="#cambiar-contrasena"
                          class="text-verde-600 hover:text-verde-700 font-semibold text-xs underline underline-offset-2"
                        >
                          Cambiar mi contraseña
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled={deleteAction.isRunning}
                          onClick$={async () => {
                            if (
                              confirm(
                                `¿Eliminar al administrador "${a.username}"? Esta acción no se puede deshacer.`,
                              )
                            ) {
                              await deleteAction.submit({ id: a.id });
                            }
                          }}
                          class="text-slate-400 hover:text-red-500 disabled:opacity-50 font-semibold text-xs transition-colors"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {deleteAction.value?.error && (
          <div class="px-6 py-3 bg-red-50 border-t border-red-100 text-red-700 text-sm">
            {deleteAction.value.error}
          </div>
        )}
        {deleteAction.value?.success && (
          <div class="px-6 py-3 bg-verde-50 border-t border-verde-100 text-verde-700 text-sm">
            Administrador eliminado.
          </div>
        )}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Crear administrador */}
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 class="font-display font-bold text-navy-900 mb-1">
            Crear administrador
          </h2>
          <p class="text-slate-500 font-body text-sm mb-5">
            La contraseña se guarda encriptada. Compartísela al nuevo usuario para
            que la cambie en su primer ingreso.
          </p>
          <Form action={createAction} class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                name="username"
                placeholder="nombre.apellido"
                autoComplete="off"
                class="w-full border border-slate-200 focus:border-verde-400 rounded-xl px-4 py-3 font-body text-slate-900 outline-none transition-colors"
              />
              {createAction.value?.fieldErrors?.username && (
                <p class="text-red-500 text-xs mt-1.5">
                  {createAction.value.fieldErrors.username}
                </p>
              )}
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <input
                type="text"
                name="password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                class="w-full border border-slate-200 focus:border-verde-400 rounded-xl px-4 py-3 font-body text-slate-900 outline-none transition-colors"
              />
              {createAction.value?.fieldErrors?.password && (
                <p class="text-red-500 text-xs mt-1.5">
                  {createAction.value.fieldErrors.password}
                </p>
              )}
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Rol
              </label>
              <select
                name="role"
                class="w-full border border-slate-200 focus:border-verde-400 rounded-xl px-4 py-3 font-body text-slate-900 outline-none transition-colors bg-white"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <p class="text-slate-400 text-xs mt-1.5">
                Por ahora sólo existe el rol Administrador.
              </p>
            </div>

            {createAction.value?.error && (
              <div class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                {createAction.value.error}
              </div>
            )}
            {createAction.value?.success && (
              <div class="bg-verde-50 border border-verde-200 rounded-xl px-4 py-3 text-verde-700 text-sm">
                Administrador «{createAction.value.username}» creado.
              </div>
            )}

            <button
              type="submit"
              disabled={createAction.isRunning}
              class="w-full bg-verde-500 hover:bg-verde-600 disabled:opacity-60 text-white font-display font-semibold py-3 rounded-xl shadow-cta transition-all"
            >
              {createAction.isRunning ? "Creando..." : "Crear administrador"}
            </button>
          </Form>
        </div>

        {/* Cambiar mi contraseña */}
        <div
          id="cambiar-contrasena"
          class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm scroll-mt-24"
        >
          <h2 class="font-display font-bold text-navy-900 mb-1">
            Cambiar mi contraseña
          </h2>
          <p class="text-slate-500 font-body text-sm mb-5">
            Sólo podés modificar la contraseña de tu propio usuario.
          </p>
          <Form action={passwordAction} class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Contraseña actual
              </label>
              <input
                type="password"
                name="currentPassword"
                autoComplete="current-password"
                class="w-full border border-slate-200 focus:border-verde-400 rounded-xl px-4 py-3 font-body text-slate-900 outline-none transition-colors"
              />
              {passwordAction.value?.fieldErrors?.currentPassword && (
                <p class="text-red-500 text-xs mt-1.5">
                  {passwordAction.value.fieldErrors.currentPassword}
                </p>
              )}
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Nueva contraseña
              </label>
              <input
                type="password"
                name="newPassword"
                autoComplete="new-password"
                class="w-full border border-slate-200 focus:border-verde-400 rounded-xl px-4 py-3 font-body text-slate-900 outline-none transition-colors"
              />
              {passwordAction.value?.fieldErrors?.newPassword && (
                <p class="text-red-500 text-xs mt-1.5">
                  {passwordAction.value.fieldErrors.newPassword}
                </p>
              )}
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Repetir nueva contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                class="w-full border border-slate-200 focus:border-verde-400 rounded-xl px-4 py-3 font-body text-slate-900 outline-none transition-colors"
              />
            </div>

            {passwordAction.value?.error && (
              <div class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                {passwordAction.value.error}
              </div>
            )}
            {passwordAction.value?.success && (
              <div class="bg-verde-50 border border-verde-200 rounded-xl px-4 py-3 text-verde-700 text-sm">
                Contraseña actualizada correctamente.
              </div>
            )}

            <button
              type="submit"
              disabled={passwordAction.isRunning}
              class="w-full bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-display font-semibold py-3 rounded-xl transition-all"
            >
              {passwordAction.isRunning ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Administradores — Mijal Salud Panel",
};

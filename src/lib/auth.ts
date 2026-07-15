import { sql, eq } from "drizzle-orm";
import type { getDb } from "~/db";
import { users } from "~/db/schema";

type Db = ReturnType<typeof getDb>;

// ─── Hashing de contraseñas (PBKDF2 vía Web Crypto) ─────────────────────────
// Se usa Web Crypto (crypto.subtle) para que funcione tanto en Vercel Edge
// como en Node. Formato guardado: "pbkdf2$<iteraciones>$<saltB64>$<hashB64>".

const PBKDF2_ITERATIONS = 100_000;
const encoder = new TextEncoder();

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function derive(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    256,
  );
  return toBase64(new Uint8Array(bits));
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64(salt)}$${hash}`;
}

/** Comparación en tiempo constante para evitar timing attacks. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function isLegacyPassword(stored: string): boolean {
  return !stored.startsWith("pbkdf2$");
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  if (!isLegacyPassword(stored)) {
    const [, iterStr, saltB64, hashB64] = stored.split("$");
    const iterations = Number(iterStr);
    if (!iterations || !saltB64 || !hashB64) return false;
    const candidate = await derive(password, fromBase64(saltB64), iterations);
    return timingSafeEqual(candidate, hashB64);
  }
  // Legacy: contraseñas en texto plano (usuarios creados antes del hashing).
  return stored === password;
}

// ─── Provisión de esquema y usuarios iniciales (idempotente) ────────────────

/**
 * Lee los administradores a sembrar desde la variable de entorno
 * SEED_ADMIN_USERS, con formato "usuario:contraseña,usuario:contraseña".
 * Si la variable no está definida (o queda vacía), no se siembra nada.
 * Nota: la contraseña no puede contener comas (separador de pares); sí puede
 * contener ":" (se corta en el primer ":").
 */
function parseSeedAdmins(
  rawSeed: string | undefined | null,
): { username: string; password: string }[] {
  if (!rawSeed) return [];
  const result: { username: string; password: string }[] = [];
  for (const entry of rawSeed.split(",")) {
    const pair = entry.trim();
    if (!pair) continue;
    const idx = pair.indexOf(":");
    if (idx <= 0) continue; // sin ":" o sin usuario antes del ":"
    const username = pair.slice(0, idx).trim().toLowerCase();
    const password = pair.slice(idx + 1);
    if (username && password) result.push({ username, password });
  }
  return result;
}

let schemaEnsured = false;

/**
 * Agrega las columnas nuevas de `users` si todavía no existen. Es idempotente:
 * si la columna ya existe, el ALTER falla y se ignora. Evita tener que correr
 * `drizzle-kit push` a mano contra la base de Turso.
 */
async function ensureUsersSchema(db: Db): Promise<void> {
  if (schemaEnsured) return;
  const statements = [
    "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'admin'",
    "ALTER TABLE users ADD COLUMN last_login TEXT",
  ];
  for (const stmt of statements) {
    try {
      await db.run(sql.raw(stmt));
    } catch {
      // La columna ya existe: ignorar.
    }
  }
  schemaEnsured = true;
}

async function seedInitialAdmins(
  db: Db,
  rawSeed: string | undefined | null,
): Promise<void> {
  const admins = parseSeedAdmins(rawSeed);
  for (const admin of admins) {
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, admin.username))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(users).values({
        username: admin.username,
        password: await hashPassword(admin.password),
        role: "admin",
      });
    }
  }
}

/**
 * Deja lista la infraestructura de autenticación: agrega las columnas nuevas y
 * siembra los administradores definidos en SEED_ADMIN_USERS (si la variable
 * existe). Se llama al inicio del login y de las pantallas de administración.
 * `rawSeed` es el valor de la env var SEED_ADMIN_USERS, provisto por el caller.
 */
export async function ensureAuthReady(
  db: Db,
  rawSeed?: string | null,
): Promise<void> {
  await ensureUsersSchema(db);
  await seedInitialAdmins(db, rawSeed);
}

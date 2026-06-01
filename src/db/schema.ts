import { sql } from "drizzle-orm";
import {
  text,
  integer,
  sqliteTable,
  index,
} from "drizzle-orm/sqlite-core";

// ─── LEADS (formularios de interés en nuevos servicios) ───────────────────
export const leads = sqliteTable(
  "leads",
  {
    id: text("id").primaryKey(),
    nombre: text("nombre").notNull(),
    email: text("email").notNull(),
    telefono: text("telefono"),
    empresa: text("empresa"),
    servicio: text("servicio").notNull(), // 'salud-directa' | 'care-ia' | 'prevencion-activa' | 'salud-360' | 'conecta-salud'
    segmento: text("segmento").notNull(), // 'particular' | 'empresa' | 'obra-social'
    mensaje: text("mensaje"),
    origen: text("origen").default("web"), // 'web' | 'whatsapp' | 'referido'
    estado: text("estado").default("nuevo"), // 'nuevo' | 'contactado' | 'en-proceso' | 'cerrado'
    createdAt: text("created_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: text("updated_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => ({
    emailIdx: index("leads_email_idx").on(table.email),
    servicioIdx: index("leads_servicio_idx").on(table.servicio),
    estadoIdx: index("leads_estado_idx").on(table.estado),
  }),
);

// ─── CONTACTOS (formulario de contacto general) ───────────────────────────
export const contactos = sqliteTable("contactos", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  email: text("email").notNull(),
  telefono: text("telefono"),
  asunto: text("asunto"),
  mensaje: text("mensaje").notNull(),
  leido: integer("leido", { mode: "boolean" }).default(false),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

// ─── POSTULANTES (formulario "Sumate al equipo") ──────────────────────────
export const postulantes = sqliteTable("postulantes", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  email: text("email").notNull(),
  telefono: text("telefono").notNull(),
  rol: text("rol"),
  mensaje: text("mensaje"),
  cvUrl: text("cv_url"),
  estado: text("estado").default("recibido"), // 'recibido' | 'en-revision' | 'entrevista' | 'descartado'
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

// ─── NEWSLETTER ───────────────────────────────────────────────────────────
export const newsletter = sqliteTable("newsletter", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  activo: integer("activo", { mode: "boolean" }).default(true),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

// ─── BLOG POSTS ───────────────────────────────────────────────────────────
export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    titulo: text("titulo").notNull(),
    resumen: text("resumen").notNull(),
    contenido: text("contenido").notNull(), // Markdown
    imagen: text("imagen"),
    categoria: text("categoria").notNull(), // 'salud' | 'prevención' | 'empresas' | 'tecnología'
    tags: text("tags"), // JSON array serializado
    autor: text("autor").default("Equipo Mijal Salud"),
    publicado: integer("publicado", { mode: "boolean" }).default(false),
    publishedAt: text("published_at"),
    createdAt: text("created_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: text("updated_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => ({
    slugIdx: index("posts_slug_idx").on(table.slug),
    categoriaIdx: index("posts_categoria_idx").on(table.categoria),
  }),
);

// ─── TESTIMONIOS ──────────────────────────────────────────────────────────
export const testimonios = sqliteTable("testimonios", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  cargo: text("cargo"),
  empresa: text("empresa"),
  texto: text("texto").notNull(),
  rating: integer("rating").default(5),
  avatar: text("avatar"),
  activo: integer("activo", { mode: "boolean" }).default(true),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

// ─── Types para TypeScript ────────────────────────────────────────────────
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Contacto = typeof contactos.$inferSelect;
export type NewContacto = typeof contactos.$inferInsert;
export type Postulante = typeof postulantes.$inferSelect;
export type NewPostulante = typeof postulantes.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Testimonio = typeof testimonios.$inferSelect;
export type NewTestimonio = typeof testimonios.$inferInsert;

// ─── USERS (para administración) ──────────────────────────────────────────
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

// ─── CHAT SESSIONS ────────────────────────────────────────────────────────
export const chatSessions = sqliteTable("chat_sessions", {
  id: text("id").primaryKey(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  lastActive: text("last_active")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

// ─── CHAT MESSAGES ────────────────────────────────────────────────────────
export const chatMessages = sqliteTable("chat_messages", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => chatSessions.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ChatSession = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;

// ─── VIDEOS VERTICALES (Reels) ─────────────────────────────────────────────
export const verticalVideos = sqliteTable("vertical_videos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  isActive: integer("is_active").default(1).notNull(), // 1 for active, 0 for inactive
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

// ─── GALERIA DE IMAGENES ───────────────────────────────────────────────────
export const galeria = sqliteTable("galeria", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageUrl: text("image_url").notNull(),
  title: text("title"),
  category: text("category"),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export type VerticalVideo = typeof verticalVideos.$inferSelect;
export type NewVerticalVideo = typeof verticalVideos.$inferInsert;
export type GalleryImage = typeof galeria.$inferSelect;
export type NewGalleryImage = typeof galeria.$inferInsert;

// ─── PARTNERS (Marcas asociadas en la Home) ──────────────────────────────────
export const partners = sqliteTable("partners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageUrl: text("image_url").notNull(),
  name: text("name").notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export type Partner = typeof partners.$inferSelect;
export type NewPartner = typeof partners.$inferInsert;

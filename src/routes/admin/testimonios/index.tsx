import { component$ } from "@builder.io/qwik";
import { routeLoader$, server$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { desc, eq } from "drizzle-orm";
import { TestimonialsManager } from "~/components/admin/TestimonialsManager";

// 1. LOADER DE TESTIMONIOS PARA EL ADMIN
export const useTestimonialsAdminLoader = routeLoader$(async () => {
  try {
    const db = getDb();
    const list = await db
      .select()
      .from(schema.testimonios)
      .orderBy(desc(schema.testimonios.createdAt));
    return list;
  } catch (error) {
    console.error("Error loading testimonials in admin:", error);
    return [];
  }
});

// 2. ACCIONES DE SERVIDOR (SERVER$)
export const addTestimonio = server$(async function (
  nombre: string,
  cargo: string,
  empresa: string,
  texto: string,
  rating: number
) {
  const db = getDb();
  const id = crypto.randomUUID();
  const [newRow] = await db
    .insert(schema.testimonios)
    .values({
      id,
      nombre,
      cargo: cargo || null,
      empresa: empresa || null,
      texto,
      rating,
      activo: true,
    })
    .returning();
  return newRow;
});

export const updateTestimonio = server$(async function (
  id: string,
  nombre: string,
  cargo: string,
  empresa: string,
  texto: string,
  rating: number,
  activo: boolean
) {
  const db = getDb();
  await db
    .update(schema.testimonios)
    .set({
      nombre,
      cargo: cargo || null,
      empresa: empresa || null,
      texto,
      rating,
      activo,
    })
    .where(eq(schema.testimonios.id, id));
});

export const deleteTestimonio = server$(async function (id: string) {
  const db = getDb();
  await db.delete(schema.testimonios).where(eq(schema.testimonios.id, id));
});

export const toggleTestimonioActivo = server$(async function (
  id: string,
  activo: boolean
) {
  const db = getDb();
  await db
    .update(schema.testimonios)
    .set({ activo })
    .where(eq(schema.testimonios.id, id));
});

export default component$(() => {
  const testimonialsLoader = useTestimonialsAdminLoader();

  return (
    <div class="space-y-6">
      {/* Page Header */}
      <div>
        <h1 class="text-2xl font-display font-bold text-navy-900">
          Opiniones y Testimonios
        </h1>
        <p class="text-slate-500 font-body text-sm mt-1">
          Gestioná las opiniones y testimonios de pacientes y empresas asociadas
          que se muestran en la sección principal del sitio.
        </p>
      </div>

      {/* Testimonials Manager Panel */}
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <TestimonialsManager initialList={testimonialsLoader.value} />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Gestión de Testimonios — Mijal Salud Panel",
};

import { component$ } from "@builder.io/qwik";
import { routeLoader$, server$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { asc, eq } from "drizzle-orm";
import { MultiGalleryUploader } from "~/components/admin/MultiGalleryUploader";

// 1. LOADER DE IMÁGENES PARA EL ADMIN
export const useGalleryAdminLoader = routeLoader$(async () => {
  try {
    const db = getDb();
    const list = await db
      .select()
      .from(schema.galeria)
      .orderBy(asc(schema.galeria.displayOrder));
    return list;
  } catch (error) {
    console.error("Error loading gallery images:", error);
    return [];
  }
});

// 2. ACCIONES DE SERVIDOR (SERVER$) PARA EL UPLOADER CLIENTE
export const addGalleryImage = server$(async function (imageUrl: string, displayOrder: number) {
  const db = getDb();
  const [newRow] = await db
    .insert(schema.galeria)
    .values({
      imageUrl,
      displayOrder,
    })
    .returning();
  return newRow;
});

export const deleteGalleryImage = server$(async function (id: number) {
  const db = getDb();
  await db.delete(schema.galeria).where(eq(schema.galeria.id, id));
});

export const reorderGalleryImages = server$(async function (ids: number[]) {
  const db = getDb();
  for (let i = 0; i < ids.length; i++) {
    await db
      .update(schema.galeria)
      .set({ displayOrder: i })
      .where(eq(schema.galeria.id, ids[i]));
  }
});

export default component$(() => {
  const imagesLoader = useGalleryAdminLoader();

  return (
    <div class="space-y-6">
      {/* Page Header */}
      <div>
        <h1 class="text-2xl font-display font-bold text-navy-900">Galería de Imágenes</h1>
        <p class="text-slate-500 font-body text-sm mt-1">
          Subí, ordená y gestioná las imágenes que se muestran en la sección Galería de la página principal.
        </p>
      </div>

      {/* Uploader Integrado */}
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <MultiGalleryUploader images={imagesLoader.value} />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Gestión de Galería — Mijal Salud Panel",
};

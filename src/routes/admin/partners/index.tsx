import { component$ } from "@builder.io/qwik";
import { routeLoader$, server$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getDb, schema } from "~/db";
import { asc, eq } from "drizzle-orm";
import { PartnersManager } from "~/components/admin/PartnersManager";

// 1. LOADER DE PARTNERS PARA EL ADMIN
export const usePartnersAdminLoader = routeLoader$(async () => {
  try {
    const db = getDb();
    const list = await db
      .select()
      .from(schema.partners)
      .orderBy(asc(schema.partners.displayOrder));
    return list;
  } catch (error) {
    console.error("Error loading partners:", error);
    return [];
  }
});

// 2. ACCIONES DE SERVIDOR (SERVER$)
export const addPartner = server$(async function (imageUrl: string, name: string, displayOrder: number) {
  const db = getDb();
  const [newRow] = await db
    .insert(schema.partners)
    .values({
      imageUrl,
      name,
      displayOrder,
    })
    .returning();
  return newRow;
});

export const updatePartnerName = server$(async function (id: number, name: string) {
  const db = getDb();
  await db
    .update(schema.partners)
    .set({ name })
    .where(eq(schema.partners.id, id));
});

export const deletePartner = server$(async function (id: number) {
  const db = getDb();
  await db.delete(schema.partners).where(eq(schema.partners.id, id));
});

export const reorderPartners = server$(async function (ids: number[]) {
  const db = getDb();
  for (let i = 0; i < ids.length; i++) {
    await db
      .update(schema.partners)
      .set({ displayOrder: i })
      .where(eq(schema.partners.id, ids[i]));
  }
});

export default component$(() => {
  const partnersLoader = usePartnersAdminLoader();

  return (
    <div class="space-y-6">
      {/* Page Header */}
      <div>
        <h1 class="text-2xl font-display font-bold text-navy-900">Socios y Partners</h1>
        <p class="text-slate-500 font-body text-sm mt-1">
          Subí, editá el nombre e indicá el orden de las marcas asociadas que aparecen en la sección Partners de la página principal.
        </p>
      </div>

      {/* Partners Manager Card */}
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <PartnersManager partners={partnersLoader.value} />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Gestión de Partners — Mijal Salud Panel",
};

import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { getDb } from "~/db";
import { leads, contactos, postulantes, newsletter, chatSessions } from "~/db/schema";
import { count, desc } from "drizzle-orm";

export const useDashboardLoader = routeLoader$(async () => {
  try {
    const db = getDb();

    // Obtener conteos de las distintas tablas
    const [leadsCountObj] = await db.select({ val: count() }).from(leads);
    const [contactCountObj] = await db.select({ val: count() }).from(contactos);
    const [postulantCountObj] = await db.select({ val: count() }).from(postulantes);
    const [newsletterCountObj] = await db.select({ val: count() }).from(newsletter);
    const [chatCountObj] = await db.select({ val: count() }).from(chatSessions);

    // Obtener registros recientes
    const recentLeadsList = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt))
      .limit(5);

    const recentContactsList = await db
      .select()
      .from(contactos)
      .orderBy(desc(contactos.createdAt))
      .limit(5);

    return {
      stats: {
        leads: leadsCountObj?.val || 0,
        contactos: contactCountObj?.val || 0,
        postulantes: postulantCountObj?.val || 0,
        newsletter: newsletterCountObj?.val || 0,
        chats: chatCountObj?.val || 0,
      },
      recentLeads: recentLeadsList,
      recentContacts: recentContactsList,
    };
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    return {
      stats: { leads: 0, contactos: 0, postulantes: 0, newsletter: 0, chats: 0 },
      recentLeads: [],
      recentContacts: [],
    };
  }
});

export default component$(() => {
  const data = useDashboardLoader();

  const cards = [
    {
      title: "Leads de Interés",
      count: data.value.stats.leads,
      description: "Interesados en nuevos servicios",
      colorClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: "Mensajes de Contacto",
      count: data.value.stats.contactos,
      description: "Formulario de contacto general",
      colorClass: "bg-blue-50 text-blue-700 border-blue-100",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      title: "Postulantes CV",
      count: data.value.stats.postulantes,
      description: "Sumate a nuestro equipo",
      colorClass: "bg-indigo-50 text-indigo-700 border-indigo-100",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Auditoría de IA (Chats)",
      count: data.value.stats.chats,
      description: "Conversaciones con Mijal Care IA",
      colorClass: "bg-teal-50 text-teal-700 border-teal-100",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div class="space-y-8">
      {/* Saludo inicial */}
      <div>
        <h1 class="text-3xl font-bold font-display text-navy-900">Hola, Administrador</h1>
        <p class="text-slate-500 font-body text-sm mt-1">Acá tenés un resumen general de la actividad de Mijal Salud hoy.</p>
      </div>

      {/* Cards de Métricas */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.title} class={["bg-white border rounded-2xl p-6 shadow-sm flex items-center justify-between", card.colorClass].join(" ")}>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-450">{card.title}</p>
              <h3 class="text-4xl font-extrabold font-display my-1 text-slate-900">{card.count}</h3>
              <p class="text-xs text-slate-500 font-medium">{card.description}</p>
            </div>
            <div class={["p-4 rounded-xl", card.colorClass].join(" ")}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Listas y Tablas */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tabla Leads */}
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 class="font-bold text-base text-navy-900 font-display">Leads de Interés Recientes</h3>
            <span class="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">Últimos 5</span>
          </div>
          <div class="overflow-x-auto">
            {data.value.recentLeads.length === 0 ? (
              <div class="p-8 text-center text-slate-400 font-body text-sm">
                No hay leads registrados aún.
              </div>
            ) : (
              <table class="w-full text-left border-collapse text-sm">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <th class="px-6 py-3">Nombre / Info</th>
                    <th class="px-6 py-3">Servicio</th>
                    <th class="px-6 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-body text-slate-700">
                  {data.value.recentLeads.map((lead) => (
                    <tr key={lead.id} class="hover:bg-slate-50/50 transition-colors">
                      <td class="px-6 py-3.5">
                        <p class="font-semibold text-slate-900 leading-none">{lead.nombre}</p>
                        <p class="text-xs text-slate-450 mt-1">{lead.email}</p>
                      </td>
                      <td class="px-6 py-3.5">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-verde-50 text-verde-700 border border-verde-100 uppercase tracking-wide">
                          {lead.servicio}
                        </span>
                      </td>
                      <td class="px-6 py-3.5 text-xs text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString("es-AR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Tabla Contactos */}
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 class="font-bold text-base text-navy-900 font-display">Mensajes de Contacto Recientes</h3>
            <span class="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">Últimos 5</span>
          </div>
          <div class="overflow-x-auto">
            {data.value.recentContacts.length === 0 ? (
              <div class="p-8 text-center text-slate-400 font-body text-sm">
                No hay mensajes de contacto aún.
              </div>
            ) : (
              <table class="w-full text-left border-collapse text-sm">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <th class="px-6 py-3">Remitente</th>
                    <th class="px-6 py-3">Asunto / Mensaje</th>
                    <th class="px-6 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-body text-slate-700">
                  {data.value.recentContacts.map((contact) => (
                    <tr key={contact.id} class="hover:bg-slate-50/50 transition-colors">
                      <td class="px-6 py-3.5">
                        <p class="font-semibold text-slate-900 leading-none">{contact.nombre}</p>
                        <p class="text-xs text-slate-450 mt-1">{contact.email}</p>
                      </td>
                      <td class="px-6 py-3.5">
                        <p class="font-medium text-slate-800 line-clamp-1">{contact.asunto || "Sin Asunto"}</p>
                        <p class="text-xs text-slate-450 line-clamp-1 mt-0.5">{contact.mensaje}</p>
                      </td>
                      <td class="px-6 py-3.5 text-xs text-slate-400">
                        {new Date(contact.createdAt).toLocaleDateString("es-AR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dashboard de Administración — Mijal Salud",
};

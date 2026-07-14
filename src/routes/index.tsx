import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Hero } from "~/components/home/Hero";
import { ServicesGrid } from "~/components/home/ServicesGrid";
import { Stats } from "~/components/home/Stats";
import { NewServices } from "~/components/home/NewServices";
import { AreaProtegida } from "~/components/home/AreaProtegida";
import { Testimonials } from "~/components/home/Testimonials";
import { Partners } from "~/components/home/Partners";
import { StaffCTA } from "~/components/home/StaffCTA";
import { ContactCTA } from "~/components/home/ContactCTA";
import { Gallery } from "~/components/home/Gallery";
import { VerticalVideo } from "~/components/home/VerticalVideo";
import { SocialFeed } from "~/components/home/SocialFeed";
import { getDb, schema } from "~/db";
import { asc, desc, eq } from "drizzle-orm";

// Loader de datos para la página principal con auto-seeding de imágenes y videos
export const useHomeLoader = routeLoader$(async () => {
  try {
    const db = getDb();
    
    // Auto-corregir URLs rotas anteriores en la base de datos si ya fueron sembradas
    try {
      await db.update(schema.galeria)
        .set({ imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80" })
        .where(eq(schema.galeria.imageUrl, "https://images.unsplash.com/photo-1587350560957-3e19dedbbade?auto=format&fit=crop&w=800&q=80"));

      await db.update(schema.verticalVideos)
        .set({ 
          videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-nurse-measuring-patient-blood-pressure-40554-large.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80"
        })
        .where(eq(schema.verticalVideos.videoUrl, "https://assets.mixkit.co/videos/preview/mixkit-paramedic-checking-the-pulse-of-a-man-on-a-stretcher-40546-large.mp4"));
    } catch (e) {
      console.warn("Self-healing DB update skipped:", e);
    }

    // 1. Cargar imágenes de la galería
    let images = await db
      .select()
      .from(schema.galeria)
      .orderBy(asc(schema.galeria.displayOrder));

    // Si está vacío, sembrar 6 imágenes de demostración médicas
    if (images.length === 0) {
      const seedImages = [
        {
          imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
          title: "Ambulancia de Alta Complejidad UTIM",
          category: "Flota",
          displayOrder: 0,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
          title: "Visita Médica Domiciliaria Programada",
          category: "Atención",
          displayOrder: 1,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
          title: "Equipamiento Médico Portátil de Avanzada",
          category: "Tecnología",
          displayOrder: 2,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
          title: "Centro de Coordinación Operativo 24/7",
          category: "Coordinación",
          displayOrder: 3,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
          title: "Atención y Cuidado Integral Domiciliario",
          category: "Cuidado",
          displayOrder: 4,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
          title: "Modernas Oficinas Operativas",
          category: "Infraestructura",
          displayOrder: 5,
        },
      ];

      for (const img of seedImages) {
        await db.insert(schema.galeria).values(img);
      }

      images = await db
        .select()
        .from(schema.galeria)
        .orderBy(asc(schema.galeria.displayOrder));
    }

    // 2. Cargar videos verticales
    let videos = await db
      .select()
      .from(schema.verticalVideos)
      .where(eq(schema.verticalVideos.isActive, 1))
      .orderBy(asc(schema.verticalVideos.displayOrder));

    // Si está vacío, sembrar 3 videos verticales de demostración
    if (videos.length === 0) {
      const seedVideos = [
        {
          id: "seed-video-1",
          title: "Consejos de Prevención Domiciliaria",
          videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-doctor-explaining-a-treatment-to-a-patient-40552-large.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=300&q=80",
          isActive: 1,
          displayOrder: 0,
        },
        {
          id: "seed-video-2",
          title: "Protocolo de Emergencia UTIM",
          videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-nurse-measuring-patient-blood-pressure-40554-large.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80",
          isActive: 1,
          displayOrder: 1,
        },
        {
          id: "seed-video-3",
          title: "Nuestra Flota en Acción Constante",
          videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-doctor-writing-on-a-clipboard-40556-large.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80",
          isActive: 1,
          displayOrder: 2,
        },
      ];

      for (const vid of seedVideos) {
        await db.insert(schema.verticalVideos).values(vid);
      }

      videos = await db
        .select()
        .from(schema.verticalVideos)
        .where(eq(schema.verticalVideos.isActive, 1))
        .orderBy(asc(schema.verticalVideos.displayOrder));
    }

    // 3. Cargar partners
    let dbPartners: any[] = [];
    try {
      dbPartners = await db
        .select()
        .from(schema.partners)
        .orderBy(asc(schema.partners.displayOrder));
    } catch (e) {
      console.warn("Skipping partners query:", e);
    }

    // 4. Cargar testimonios con auto-seeding
    let dbTestimonios = await db
      .select()
      .from(schema.testimonios)
      .where(eq(schema.testimonios.activo, true));

    if (dbTestimonios.length === 0) {
      const seedTestimonios = [
        {
          id: "seed-test-1",
          nombre: "Martina García",
          cargo: "Gerente de RRHH",
          empresa: "Grupo Clarín",
          texto: "Implementamos Área Protegida para nuestros eventos internos. El equipo de Mijal Salud respondió de manera impecable en dos situaciones que se presentaron. Profesionalismo total.",
          rating: 5,
          avatar: "MG",
          activo: true,
        },
        {
          id: "seed-test-2",
          nombre: "Roberto Fernández",
          cargo: "Paciente",
          empresa: "Buenos Aires",
          texto: "A mi padre le dieron un turno de visita médica a domicilio en menos de 2 horas. El médico fue muy amable y profesional. Lo recomendaría a cualquier familia.",
          rating: 5,
          avatar: "RF",
          activo: true,
        },
        {
          id: "seed-test-3",
          nombre: "Laura Suárez",
          cargo: "Directora Médica",
          empresa: "OSDE",
          texto: "Trabajamos con Mijal Salud hace más de 8 años. Su capacidad de respuesta y la calidad de su equipo médico los hace un partner indispensable para nuestra obra social.",
          rating: 5,
          avatar: "LS",
          activo: true,
        },
        {
          id: "seed-test-4",
          nombre: "Diego Morales",
          cargo: "CEO",
          empresa: "TechBa S.A.",
          texto: "Contratamos el programa de Prevención Activa para nuestros 120 empleados. El ausentismo bajó un 40% en el primer trimestre. Los números hablan solos.",
          rating: 5,
          avatar: "DM",
          activo: true,
        },
        {
          id: "seed-test-5",
          nombre: "Ana Benitez",
          cargo: "Familiar",
          empresa: "Palermo, CABA",
          texto: "Mi mamá estuvo con internación domiciliaria por 3 semanas. El equipo de Mijal Salud la acompañó con una calidez y profesionalismo que nunca esperé. Gracias infinitas.",
          rating: 5,
          avatar: "AB",
          activo: true,
        },
      ];

      for (const test of seedTestimonios) {
        await db.insert(schema.testimonios).values(test);
      }

      dbTestimonios = await db
        .select()
        .from(schema.testimonios)
        .where(eq(schema.testimonios.activo, true));
    }

    // 5. Cargar posts de instagram
    let dbInstagramPosts: any[] = [];
    try {
      dbInstagramPosts = await db
        .select()
        .from(schema.instagramPosts)
        .orderBy(desc(schema.instagramPosts.timestamp));
    } catch(e) {
      console.warn("Skipping instagram query:", e);
    }

    // 6. Cargar configuraciones de nuevos servicios (y sembrar si está vacío)
    let serviceSettings = await db
      .select()
      .from(schema.newServicesSettings);

    if (serviceSettings.length === 0) {
      const defaultServices = [
        { id: "salud-directa", nombre: "Mijal Salud Directa", activo: true },
        { id: "care-ia", nombre: "Mijal Care IA", activo: true },
        { id: "prevencion-activa", nombre: "Mijal Prevención Activa", activo: true },
        { id: "salud-360", nombre: "Mijal Salud 360", activo: true },
        { id: "conecta-salud", nombre: "Mijal Conecta Salud", activo: true },
      ];
      for (const service of defaultServices) {
        await db.insert(schema.newServicesSettings).values(service);
      }
      serviceSettings = await db
        .select()
        .from(schema.newServicesSettings);
    }

    return { 
      images, 
      videos, 
      partners: dbPartners, 
      testimonios: dbTestimonios, 
      instagramPosts: dbInstagramPosts,
      newServicesSettings: serviceSettings 
    };
  } catch (error) {
    console.error("Error loading home data:", error);
    return { images: [], videos: [], partners: [], testimonios: [], instagramPosts: [], newServicesSettings: [] };
  }
});

export default component$(() => {
  const homeData = useHomeLoader();

  return (
    <>
      <Hero />
      <ServicesGrid />
      <Stats />
      <NewServices settings={homeData.value.newServicesSettings} />
      <AreaProtegida />
      <Testimonials list={homeData.value.testimonios} />
      <Partners partners={homeData.value.partners} />
      <VerticalVideo videos={homeData.value.videos} />
      <Gallery images={homeData.value.images} />
      <StaffCTA />
      <ContactCTA />
      <SocialFeed posts={homeData.value.instagramPosts} />
    </>
  );
});

export const head: DocumentHead = {
  title: "Mijal Salud — Atención Médica Domiciliaria 24/7 en AMBA",
  meta: [
    {
      name: "description",
      content:
        `Más de ${new Date().getFullYear() - 2005} años brindando atención médica de excelencia: emergencias, urgencias, traslados, internación domiciliaria y nuevos servicios digitales de salud en Buenos Aires.`,
    },
    {
      name: "keywords",
      content:
        "guardia médica domiciliaria, emergencias médicas Buenos Aires, médico a domicilio AMBA, telemedicina Argentina, salud domiciliaria",
    },
    {
      property: "og:title",
      content: "Mijal Salud — Tu médico, siempre cerca",
    },
    {
      property: "og:description",
      content:
        "Atención médica domiciliaria 24/7 con más de 28.000 atenciones realizadas.",
    },
    { property: "og:image", content: "/og-image.png" },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "es_AR" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  scripts: [
    {
      props: {
        type: "application/ld+json",
      },
      script: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        "name": "Mijal Salud S.A.",
        "image": "https://mijalsalud.com.ar/og-image.png",
        "@id": "https://mijalsalud.com.ar/#medicalbusiness",
        "url": "https://mijalsalud.com.ar",
        "telephone": "+541152731818",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Av. Corrientes 1234",
          "addressLocality": "Buenos Aires",
          "addressRegion": "CABA",
          "postalCode": "1043",
          "addressCountry": "AR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -34.603722,
          "longitude": -58.381592
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "00:00",
          "closes": "23:59"
        },
        "sameAs": [
          "https://www.facebook.com/mijalsalud",
          "https://www.instagram.com/mijalsalud"
        ],
        "medicalSpecialty": [
          "EmergencyMedicine",
          "GeneralPractice"
        ]
      })
    }
  ]
};

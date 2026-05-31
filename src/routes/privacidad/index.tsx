import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <main class="pt-24 bg-gris-50 min-h-screen">
      <section class="bg-navy-900 relative overflow-hidden py-16 text-white">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-verde-500/10 rounded-full blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 max-w-4xl">
          <h1 class="font-display text-h2 md:text-h1 mb-4">
            Política de <span class="text-verde-400">Privacidad</span>
          </h1>
          <p class="text-white/70 font-body text-sm md:text-base">
            Última actualización: 30 de Mayo de 2026
          </p>
        </div>
      </section>

      <section class="py-12">
        <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div class="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gris-100 font-body text-gris-700 space-y-6 leading-relaxed">
            <h2 class="font-display text-2xl text-navy-900 font-bold mt-2">1. Introducción</h2>
            <p>
              En <strong>Mijal Salud S.A.</strong> nos tomamos muy en serio la privacidad de nuestros usuarios y pacientes. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información personal cuando visita nuestro sitio web o utiliza nuestros servicios médicos domiciliarios y digitales en el ámbito del Área Metropolitana de Buenos Aires (AMBA).
            </p>

            <h2 class="font-display text-2xl text-navy-900 font-bold mt-6">2. Información que Recopilamos</h2>
            <p>
              Recopilamos información que usted nos proporciona voluntariamente a través de nuestros formularios de contacto, formularios de interés en nuevos servicios, solicitudes de empleo o mediante la contratación de nuestros servicios médicos. Esto incluye:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Datos Personales Básicos:</strong> Nombre completo, número de documento (DNI/CUIL), dirección física de domicilio en el AMBA, y fecha de nacimiento.</li>
              <li><strong>Información de Contacto:</strong> Dirección de correo electrónico y número de teléfono (móvil o fijo).</li>
              <li><strong>Información de Salud (Sensible):</strong> En el marco de la atención médica de emergencias, urgencias e internación domiciliaria, podemos procesar síntomas descritos, antecedentes clínicos, obras sociales asociadas y datos de telemedicina con la máxima confidencialidad legal exigida.</li>
              <li><strong>Información de Postulación:</strong> Currículum vitae, experiencia laboral y especialidad médica para los profesionales que se postulan en nuestra sección "Sumate".</li>
            </ul>

            <h2 class="font-display text-2xl text-navy-900 font-bold mt-6">3. Uso de la Información</h2>
            <p>
              La información recopilada se utiliza exclusivamente para las siguientes finalidades:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Coordinar y prestar asistencia médica de emergencias, urgencias y traslados domiciliarios.</li>
              <li>Gestionar e individualizar los programas de internación domiciliaria y visitas médicas.</li>
              <li>Responder a consultas recibidas a través de nuestros canales de contacto y de WhatsApp.</li>
              <li>Procesar solicitudes de empleo y evaluar perfiles profesionales.</li>
              <li>Mejorar continuamente nuestra plataforma digital y el ecosistema de servicios (como Mijal Care IA y Conecta Salud).</li>
              <li>Cumplir con las obligaciones legales y regulatorias del Ministerio de Salud de la Nación y demás autoridades argentinas.</li>
            </ul>

            <h2 class="font-display text-2xl text-navy-900 font-bold mt-6">4. Protección y Confidencialidad</h2>
            <p>
              Mijal Salud S.A. garantiza la implementación de medidas técnicas, organizativas y de seguridad física y lógica para evitar la alteración, pérdida, tratamiento o acceso no autorizado de sus datos personales. Todos los datos de salud son tratados bajo el estricto cumplimiento de la Ley de Protección de Datos Personales de la República Argentina (Ley N° 25.326) y el secreto profesional médico.
            </p>

            <h2 class="font-display text-2xl text-navy-900 font-bold mt-6">5. Transferencia de Datos a Terceros</h2>
            <p>
              No compartimos, vendemos ni alquilamos su información personal a terceros ajenos a la prestación de nuestros servicios médicos. Los datos podrán ser compartidos con su respectiva Obra Social o Empresa de Medicina Prepaga únicamente para la facturación y autorización de las prestaciones médicas brindadas, o bien por requerimiento de autoridades judiciales competentes en el marco de la normativa vigente.
            </p>

            <h2 class="font-display text-2xl text-navy-900 font-bold mt-6">6. Derechos de los Titulares (Derechos ARCO)</h2>
            <p>
              Usted tiene derecho a acceder, rectificar, actualizar o solicitar la supresión de sus datos personales almacenados en nuestras bases de datos de forma gratuita en intervalos no inferiores a seis meses (salvo que acredite un interés legítimo al efecto), conforme a la Ley N° 25.326. Para ejercer estos derechos, puede enviarnos un correo electrónico a <strong>contacto@mijalsalud.com.ar</strong> adjuntando una copia de su DNI.
            </p>

            <h2 class="font-display text-2xl text-navy-900 font-bold mt-6">7. Cambios en esta Política</h2>
            <p>
              Nos reservamos el derecho de actualizar o modificar esta Política de Privacidad en cualquier momento para adaptarla a novedades legislativas, jurisprudenciales o políticas comerciales de Mijal Salud S.A. Le recomendamos revisar este documento de forma periódica.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Política de Privacidad — Mijal Salud S.A.",
  meta: [
    {
      name: "description",
      content: "Conocé cómo protegemos tus datos personales y de salud en Mijal Salud S.A. en cumplimiento con la Ley N° 25.326 de la República Argentina.",
    },
  ],
};

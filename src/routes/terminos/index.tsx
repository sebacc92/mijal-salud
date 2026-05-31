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
            Términos y <span class="text-verde-400">Condiciones</span>
          </h1>
          <p class="text-white/70 font-body text-sm md:text-base">
            Última actualización: 30 de Mayo de 2026
          </p>
        </div>
      </section>

      <section class="py-12">
        <div class="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div class="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gris-100 font-body text-gris-700 space-y-6 leading-relaxed">
            <h2 class="font-display text-2xl text-navy-900 font-bold mt-2">1. Aceptación de los Términos</h2>
            <p>
              El acceso y uso de este sitio web y de los servicios provistos por <strong>Mijal Salud S.A.</strong> (en adelante, "Mijal Salud") están sujetos a los siguientes Términos y Condiciones. Al navegar por este sitio web, completar formularios o utilizar nuestras herramientas digitales, usted acepta plenamente y sin reservas estos términos. Si no está de acuerdo con alguno de ellos, le solicitamos que se abstenga de usar el sitio.
            </p>

            <h2 class="font-display text-2xl text-navy-900 font-bold mt-6">2. Naturaleza del Sitio e Información Médica</h2>
            <p>
              El contenido de este sitio web tiene carácter estrictamente informativo e institucional. Mijal Salud busca difundir información sobre sus servicios médicos domiciliarios, de emergencias, urgencias, traslados, internación domiciliaria y soluciones de salud digital (como Mijal Care IA y Conecta Salud).
            </p>
            <div class="bg-red-50 border-l-4 border-red-500 p-4 my-4 text-red-900 text-sm rounded-r-xl">
              <strong>⚠️ AVISO IMPORTANTE:</strong> La información contenida en esta web o las herramientas de consulta general no reemplazan, en ningún caso, la consulta médica presencial ni el diagnóstico profesional de un médico calificado. Ante cualquier síntoma grave o duda sobre su estado de salud, debe comunicarse de inmediato con su central de emergencias al número telefónico indicado o acudir al centro asistencial más cercano.
            </div>

            <h2 class="font-display text-2xl text-navy-900 font-bold mt-6">3. Uso de las Herramientas Digitales</h2>
            <p>
              Usted se compromete a hacer un uso lícito y correcto de los formularios y simuladores del sitio (tales como la calculadora de ROI para empresas o formularios de postulación). Específicamente, acepta:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li>No ingresar datos falsos, inexactos o de terceros sin su debida autorización.</li>
              <li>No utilizar el sitio para enviar spam, virus informáticos o realizar cualquier actividad que pueda dañar la infraestructura tecnológica de Mijal Salud.</li>
              <li>Mantener bajo su custodia los datos personales introducidos en el portal privado de pacientes o empresas cuando este se encuentre activo.</li>
            </ul>

            <h2 class="font-display text-2xl text-navy-900 font-bold mt-6">4. Prestación de Servicios Médicos Domiciliarios</h2>
            <p>
              La efectiva prestación de los servicios médicos domiciliarios en el AMBA (emergencias, urgencias, visitas) se rige por los contratos específicos de afiliación, los convenios vigentes con cada Obra Social o Prepaga, y los protocolos clínicos aprobados por Mijal Salud S.A.
            </p>
            <p>
              Los tiempos de respuesta de las ambulancias y móviles médicos son estimados y pueden verse afectados por factores de fuerza mayor no imputables a Mijal Salud, incluyendo el estado de las vías de circulación, condiciones climáticas extremas, huelgas o congestión extrema del tráfico vial en el AMBA.
            </p>

            <h2 class="font-display text-2xl text-navy-900 font-bold mt-6">5. Propiedad Intelectual</h2>
            <p>
              Todos los contenidos de este sitio, incluyendo pero no limitándose a: logotipos, marcas comerciales, diseños de interfaz, textos, gráficos, códigos fuente, íconos y software, son propiedad exclusiva de Mijal Salud S.A. o de terceros que han autorizado su uso. Queda terminantemente prohibida su reproducción, distribución o modificación sin autorización previa y por escrito de Mijal Salud.
            </p>

            <h2 class="font-display text-2xl text-navy-900 font-bold mt-6">6. Limitación de Responsabilidad</h2>
            <p>
              Mijal Salud realiza los mayores esfuerzos para mantener la información del sitio actualizada y libre de errores técnicos; sin embargo, no garantiza la infalibilidad del contenido ni la disponibilidad ininterrumpida de la web las 24 horas del día. Mijal Salud no será responsable por daños derivados del uso o imposibilidad de uso del sitio web, incluyendo pérdidas de datos o daños causados por virus informáticos.
            </p>

            <h2 class="font-display text-2xl text-navy-900 font-bold mt-6">7. Jurisdicción y Ley Aplicable</h2>
            <p>
              Estos Términos y Condiciones se rigen en todos sus puntos por las leyes vigentes de la República Argentina. Cualquier divergencia o disputa legal derivada de la interpretación o cumplimiento del presente contrato se someterá a la jurisdicción exclusiva de los Tribunales Ordinarios en lo Civil y Comercial de la Ciudad Autónoma de Buenos Aires, renunciando a cualquier otro fuero que pudiere corresponder.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Términos y Condiciones — Mijal Salud S.A.",
  meta: [
    {
      name: "description",
      content: "Conocé las condiciones legales de uso de nuestro sitio web, herramientas digitales y servicios de salud domiciliaria de Mijal Salud S.A.",
    },
  ],
};

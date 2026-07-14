import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { WHATSAPP_EMPRESAS } from "~/lib/constants";

export default component$(() => {
  return (
    <main class="pt-24">
      <section class="bg-navy-900 relative overflow-hidden py-20">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-violet-400 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 max-w-3xl text-center">
          <div class="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/40 rounded-full px-4 py-2 mb-8">
            <span class="text-violet-200 text-sm font-body font-medium">🛡️ Servicio para eventos y espacios</span>
          </div>
          <h1 class="font-display text-h1 text-white mb-5">
            Área <span class="text-violet-300">Protegida</span>
          </h1>
          <p class="text-white/75 font-body text-body-lg mb-8">
            Cobertura médica permanente para eventos, espacios de trabajo, 
            establecimientos educativos y cualquier lugar que requiera presencia médica.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WHATSAPP_EMPRESAS} target="_blank" rel="noopener noreferrer"
              class="bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta transition-all duration-200">
              Pedir cotización
            </a>
            <a href="#casos" class="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-display font-semibold px-8 py-4 rounded-2xl transition-all duration-200">
              Ver casos de uso
            </a>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="font-display text-h2 text-navy-900 mb-6">Qué incluye la cobertura</h2>
              <ul class="space-y-4">
                {[
                  "Médico y enfermero presenciales durante todo el evento",
                  "Unidad móvil de emergencias en el lugar o en radio de cobertura",
                  "Botiquín completo con DEA y medicación de urgencias",
                  "Protocolo de evacuación médica acordado con el organizador",
                  "Comunicación directa con hospitales de referencia de la zona",
                  "Informe médico completo al finalizar el evento",
                  "Certificación de cobertura para cumplimiento legal (ART, municipalidad)",
                ].map((item) => (
                  <li key={item} class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-violet-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span class="text-gris-700 font-body text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div class="bg-gris-50 rounded-3xl p-8 border border-gris-200">
              <h3 class="font-display font-bold text-navy-900 text-lg mb-5">Dimensionamos según tu evento</h3>
              <div class="space-y-4">
                {[
                  { rango: "10 – 300 personas", equipo: "1 médico + 1 enfermero", color: "bg-verde-100 text-verde-700" },
                  { rango: "300 – 2.000 personas", equipo: "2 médicos + 2 enfermeros + ambulancia", color: "bg-orange-100 text-orange-700" },
                  { rango: "2.000 – 10.000 personas", equipo: "Equipo completo + UCM", color: "bg-red-100 text-red-700" },
                  { rango: "+10.000 personas", equipo: "Operativo personalizado", color: "bg-violet-100 text-violet-700" },
                ].map((r) => (
                  <div key={r.rango} class="flex items-start justify-between gap-4 bg-white rounded-xl p-4 border border-gris-200">
                    <span class="font-body text-gris-700 text-sm">{r.rango}</span>
                    <span class={["text-xs font-body font-semibold px-3 py-1 rounded-full shrink-0", r.color]}>{r.equipo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de uso */}
      <section id="casos" class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">¿Dónde lo aplicamos?</h2>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { emoji: "🏟️", label: "Estadios y eventos deportivos" },
              { emoji: "🎪", label: "Festivales y conciertos" },
              { emoji: "🏢", label: "Congresos y convenciones" },
              { emoji: "🏗️", label: "Obras en construcción" },
              { emoji: "🏭", label: "Plantas industriales" },
              { emoji: "🎓", label: "Universidades e institutos" },
              { emoji: "🏖️", label: "Resorts y clubes" },
              { emoji: "🎉", label: "Eventos corporativos" },
            ].map((c) => (
              <div key={c.label} class="bg-white border border-gris-200 rounded-2xl p-6 text-center hover:border-violet-300 hover:shadow-card transition-all duration-300">
                <div class="text-4xl mb-3">{c.emoji}</div>
                <p class="text-gris-700 font-body text-sm font-medium">{c.label}</p>
              </div>
            ))}
          </div>

          <div class="text-center mt-10">
            <a href={WHATSAPP_EMPRESAS} target="_blank" rel="noopener noreferrer"
              class="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-display font-semibold px-8 py-4 rounded-2xl transition-all duration-200 cursor-pointer">
              Cotizar mi evento
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Planes de Área Protegida */}
      <section class="py-section bg-white border-t border-gris-150">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <div class="inline-flex items-center gap-2 bg-verde-500/10 border border-verde-500/20 rounded-full px-3 py-1 mb-4">
              <span class="text-verde-600 text-xs font-body font-semibold uppercase tracking-wider">Planes Disponibles</span>
            </div>
            <h2 class="font-display text-h2 text-navy-900 mb-4">Planes de Cobertura Médica</h2>
            <p class="text-gris-600 font-body text-body-lg max-w-xl mx-auto">
              Contamos con esquemas de contratación flexibles adaptados a las necesidades reglamentarias y operativas de tu espacio.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1: Eventos */}
            <div class="bg-gris-50 border border-gris-200 rounded-3xl p-8 flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all duration-300">
              <div>
                <span class="text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full uppercase tracking-wider font-body">Temporal</span>
                <h3 class="font-display font-bold text-xl text-navy-900 mt-4 mb-2">Eventos y Jornadas</h3>
                <p class="text-slate-500 text-sm font-body mb-6">Ideal para congresos, filmaciones, torneos deportivos o eventos puntuales.</p>
                <div class="border-t border-gris-200/60 pt-6">
                  <ul class="space-y-3">
                    {["Cobertura por día / jornada", "Ambulancia UCM en el lugar", "Médicos y paramédicos", "Desfibrilador DEA incluido", "Cumplimiento municipal/ART"].map((item) => (
                      <li key={item} class="flex items-center gap-2.5">
                        <span class="w-1.5 h-1.5 bg-verde-500 rounded-full"></span>
                        <span class="text-gris-700 text-xs font-body">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div class="mt-8">
                <a href={WHATSAPP_EMPRESAS} target="_blank" rel="noopener noreferrer"
                  class="block text-center bg-violet-600 hover:bg-violet-700 text-white font-display font-semibold text-sm py-3.5 rounded-xl transition-colors cursor-pointer">
                  Cotizar por Evento
                </a>
              </div>
            </div>

            {/* Plan 2: Pymes/Oficinas (Recomendado) */}
            <div class="bg-navy-900 border-2 border-verde-500 rounded-3xl p-8 flex flex-col justify-between shadow-card relative transform lg:-translate-y-2 transition-all duration-300">
              <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-verde-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-body shadow-sm">
                Más Elegido
              </div>
              <div>
                <span class="text-xs font-bold text-verde-400 bg-verde-900/50 border border-verde-800 px-3 py-1 rounded-full uppercase tracking-wider font-body">Mensual</span>
                <h3 class="font-display font-bold text-xl text-white mt-4 mb-2">Comercios y Pymes</h3>
                <p class="text-white/60 text-sm font-body mb-6">Cobertura continua 24/7 para oficinas, locales y plantas pequeñas.</p>
                <div class="border-t border-white/10 pt-6">
                  <ul class="space-y-3">
                    {["Facturación fija mensual", "Atención ante emergencias", "Protección para todo el personal", "Certificación ART vigente", "Soporte y asesoría legal"].map((item) => (
                      <li key={item} class="flex items-center gap-2.5">
                        <span class="w-1.5 h-1.5 bg-verde-400 rounded-full"></span>
                        <span class="text-white/80 text-xs font-body">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div class="mt-8">
                <a href={WHATSAPP_EMPRESAS} target="_blank" rel="noopener noreferrer"
                  class="block text-center bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold text-sm py-3.5 rounded-xl shadow-cta hover:shadow-cta-hover transition-colors cursor-pointer">
                  Contratar Plan Mensual
                </a>
              </div>
            </div>

            {/* Plan 3: Corporativo */}
            <div class="bg-gris-50 border border-gris-200 rounded-3xl p-8 flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all duration-300">
              <div>
                <span class="text-xs font-bold text-navy-800 bg-navy-100 border border-navy-200 px-3 py-1 rounded-full uppercase tracking-wider font-body">Gran Escala</span>
                <h3 class="font-display font-bold text-xl text-navy-900 mt-4 mb-2">Grandes Industrias</h3>
                <p class="text-slate-500 text-sm font-body mb-6">Esquemas personalizados para campus educativos, fábricas y constructoras.</p>
                <div class="border-t border-gris-200/60 pt-6">
                  <ul class="space-y-3">
                    {["Operativos de salud a medida", "Puestos médicos fijos in-situ", "Ambulancias permanentes", "Auditorías de prevención", "Descuentos en telemedicina"].map((item) => (
                      <li key={item} class="flex items-center gap-2.5">
                        <span class="w-1.5 h-1.5 bg-verde-500 rounded-full"></span>
                        <span class="text-gris-700 text-xs font-body">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div class="mt-8">
                <a href={WHATSAPP_EMPRESAS} target="_blank" rel="noopener noreferrer"
                  class="block text-center bg-navy-900 hover:bg-navy-800 text-white font-display font-semibold text-sm py-3.5 rounded-xl transition-colors cursor-pointer">
                  Solicitar Reunión B2B
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Punto en Google Maps y Zona de Cobertura */}
      <section class="py-section bg-gris-50 border-t border-gris-150">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div class="inline-flex items-center gap-2 bg-verde-500/10 border border-verde-500/20 rounded-full px-3 py-1 mb-4">
                <span class="text-verde-600 text-xs font-body font-semibold uppercase tracking-wider">Área de Acción</span>
              </div>
              <h2 class="font-display text-h2 text-navy-900 mb-6">Zona de Cobertura e Infraestructura</h2>
              <p class="text-gris-600 font-body text-sm leading-relaxed mb-6">
                Cubrimos Área Protegida y traslados en toda la Ciudad Autónoma de
                Buenos Aires (CABA) y el Gran Buenos Aires (GBA / AMBA), con
                unidades móviles distribuidas estratégicamente y derivación
                inmediata a los principales centros médicos de cada zona.
              </p>

              <div class="space-y-4">
                <div class="flex items-start gap-3 bg-white p-4 rounded-xl border border-gris-200">
                  <span class="text-2xl">📍</span>
                  <div>
                    <h4 class="font-display font-bold text-navy-900 text-sm">Punto Operativo Central</h4>
                    <p class="text-gris-500 text-xs font-body mt-0.5">Buenos Aires, AMBA, Argentina</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 bg-white p-4 rounded-xl border border-gris-200">
                  <span class="text-2xl">⚡</span>
                  <div>
                    <h4 class="font-display font-bold text-navy-900 text-sm">Despliegue Inmediato</h4>
                    <p class="text-gris-500 text-xs font-body mt-0.5">Unidades médicas móviles distribuidas de forma estratégica.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Iframe */}
            <div class="bg-white p-3 rounded-3xl border border-gris-200 shadow-card overflow-hidden">
              <iframe
                title="Google Maps Cobertura Mijal Salud"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105073.44367080608!2d-58.5033383427961!3d-34.60373891826458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca3b4ef90cbd%3A0xa0b3812e5d888620!2sBuenos%20Aires%2C%20Argentina!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar"
                width="100%"
                height="380"
                style="border:0; border-radius: 1.25rem;"
                allowFullscreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Área Protegida — Cobertura Médica para Eventos | Mijal Salud",
  meta: [{ name: "description", content: "Cobertura médica para eventos, estadios, festivales y espacios de trabajo. Personal médico, ambulancias y protocolo de emergencias en tu evento." }],
};

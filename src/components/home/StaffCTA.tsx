import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const StaffCTA = component$(() => {
  return (
    <section class="py-20 bg-gradient-to-r from-navy-950 to-navy-900 text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-verde-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-verde-400/5 rounded-full blur-3xl"></div>

      <div class="container mx-auto px-6 lg:px-12 relative z-10">
        <div class="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 backdrop-blur-md shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div class="text-center lg:text-left space-y-4 max-w-xl">
            <div class="inline-flex items-center gap-2 bg-verde-500/20 border border-verde-500/30 rounded-full px-3 py-1.5 self-start">
              <span class="w-1.5 h-1.5 bg-verde-400 rounded-full animate-pulse"></span>
              <span class="text-verde-300 text-xs font-body font-semibold uppercase tracking-wider">Trabajá con Nosotros</span>
            </div>
            <h2 class="font-display font-bold text-2xl lg:text-3xl text-white leading-tight">
              ¿Sos profesional de la salud o administrativo? <span class="text-verde-400">Sumate a nuestro staff</span>
            </h2>
            <p class="text-white/70 font-body text-sm lg:text-base leading-relaxed">
              Buscamos médicos de guardia, enfermeros, paramédicos, kinesiólogos, conductores de ambulancia y personal de soporte. Mandanos tus datos y adjuntá tu CV para sumarte a un equipo líder con más de {new Date().getFullYear() - 2005} años de trayectoria.
            </p>
          </div>

          <div class="shrink-0 w-full lg:w-auto text-center">
            <Link
              href="/sumate"
              class="inline-block w-full sm:w-auto bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta hover:shadow-cta-hover transition-all duration-200 cursor-pointer text-center"
            >
              Enviar mi CV 📄
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
});

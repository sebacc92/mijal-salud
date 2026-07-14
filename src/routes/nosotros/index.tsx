import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";



const valores = [
  { emoji: "❤️", titulo: "Humanidad", desc: "Cada paciente es una persona, no un número. El trato humano es nuestra prioridad absoluta." },
  { emoji: "⚡", titulo: "Urgencia", desc: "Entendemos que en salud el tiempo es crítico. Actuamos con rapidez y precisión." },
  { emoji: "🏆", titulo: "Excelencia", desc: "Protocolos de nivel internacional, capacitación continua y mejora permanente." },
  { emoji: "🤝", titulo: "Confianza", desc: `Más de ${new Date().getFullYear() - 2001} años construyendo una relación de confianza con pacientes y familias.` },
];

export default component$(() => {
  return (
    <main class="pt-24">
      {/* Hero */}
      <section class="bg-navy-900 relative overflow-hidden py-24">
        <div class="absolute inset-0 bg-gradient-hero opacity-90" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-verde-500 rounded-full opacity-10 blur-3xl" />
        <div class="relative container mx-auto px-6 lg:px-12 text-center max-w-3xl mx-auto">
          <h1 class="font-display text-h1 text-white mb-5">
            Más de {new Date().getFullYear() - 2001} años cuidando <span class="text-verde-400">vidas</span>
          </h1>
          <p class="text-white/70 font-body text-body-lg">
            Somos Mijal Salud S.A., una empresa argentina fundada en 2001 con la misión de 
            llevar atención médica de excelencia a cada hogar del AMBA.
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            <div class="bg-navy-900 rounded-3xl p-10 text-white">
              <div class="text-4xl mb-5">🎯</div>
              <h2 class="font-display font-bold text-2xl mb-4">Nuestra misión</h2>
              <p class="text-white/70 font-body leading-relaxed">
                Brindar atención médica domiciliaria de máxima calidad, accesible, humana y 
                tecnológicamente avanzada. Queremos que cada argentino tenga acceso a un médico 
                cuando lo necesita, sin importar el momento ni el lugar.
              </p>
            </div>
            <div class="bg-verde-500 rounded-3xl p-10 text-white">
              <div class="text-4xl mb-5">🔭</div>
              <h2 class="font-display font-bold text-2xl mb-4">Nuestra visión</h2>
              <p class="text-white/80 font-body leading-relaxed">
                Ser el referente nacional en salud domiciliaria digital para 2030: el ecosistema 
                que integra emergencias, prevención, IA y telemedicina en una sola plataforma 
                accesible para todos los argentinos.
              </p>
            </div>
          </div>

          {/* Valores */}
          <div class="text-center mb-10">
            <h2 class="font-display text-h2 text-navy-900 mb-4">Nuestros valores</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {valores.map((v) => (
              <div key={v.titulo} class="text-center p-6 bg-gris-50 rounded-2xl border border-gris-100">
                <div class="text-4xl mb-4">{v.emoji}</div>
                <h3 class="font-display font-bold text-navy-900 text-lg mb-2">{v.titulo}</h3>
                <p class="text-gris-600 font-body text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Sumate */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="bg-navy-900 rounded-3xl p-10 text-center">
            <h2 class="font-display font-bold text-white text-2xl mb-3">¿Querés ser parte del equipo?</h2>
            <p class="text-white/60 font-body mb-6">Siempre buscamos médicos, enfermeros y personal comprometido con la salud domiciliaria.</p>
            <Link href="/sumate" class="inline-flex bg-verde-500 hover:bg-verde-600 text-white font-display font-semibold px-8 py-4 rounded-2xl shadow-cta transition-all duration-200">
              Ver oportunidades →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: `Nosotros — Mijal Salud | Más de ${new Date().getFullYear() - 2001} años cuidando vidas`,
  meta: [{ name: "description", content: "Conocé la historia, misión y equipo de Mijal Salud. Fundada en 2001, somos líderes en atención médica domiciliaria en Buenos Aires y AMBA." }],
};

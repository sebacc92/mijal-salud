import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";

const hitos = [
  { year: "2004", titulo: "Fundación", desc: "Nace Mijal Salud en Buenos Aires con una sola ambulancia y un equipo de 4 personas." },
  { year: "2008", titulo: "Expansión AMBA", desc: "Extendemos la cobertura a todo el Gran Buenos Aires. Sumamos 8 unidades al parque vehicular." },
  { year: "2012", titulo: "Internación domiciliaria", desc: "Lanzamos el primer programa de internación domiciliaria estructurada de la región." },
  { year: "2016", titulo: "Obras sociales", desc: "Cerramos convenios con las 10 principales obras sociales del país." },
  { year: "2020", titulo: "Pandemia", desc: "Fuimos uno de los pocos servicios que mantuvo operación completa durante el COVID-19." },
  { year: "2023", titulo: "Digitalización", desc: "Iniciamos la transformación digital: central operativa con IA, app y geolocalización." },
  { year: "2026", titulo: "Nueva era", desc: "Lanzamos el ecosistema de salud digital: Salud Directa, Care IA, Prevención Activa y más." },
];

const equipo = [
  { nombre: "Dr. Ricardo Mijal", rol: "Director Médico", especialidad: "Medicina de Emergencias", iniciales: "RM" },
  { nombre: "Lic. Carolina Vidal", rol: "Directora de Operaciones", especialidad: "Gestión hospitalaria", iniciales: "CV" },
  { nombre: "Dr. Hernán Ruiz", rol: "Jefe de Guardia", especialidad: "Terapia intensiva", iniciales: "HR" },
  { nombre: "Lic. Natalia Soto", rol: "Directora Tecnológica", especialidad: "Salud digital", iniciales: "NS" },
];

const valores = [
  { emoji: "❤️", titulo: "Humanidad", desc: "Cada paciente es una persona, no un número. El trato humano es nuestra prioridad absoluta." },
  { emoji: "⚡", titulo: "Urgencia", desc: "Entendemos que en salud el tiempo es crítico. Actuamos con rapidez y precisión." },
  { emoji: "🏆", titulo: "Excelencia", desc: "Protocolos de nivel internacional, capacitación continua y mejora permanente." },
  { emoji: "🤝", titulo: "Confianza", desc: "Más de 20 años construyendo una relación de confianza con pacientes y familias." },
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
            Más de 20 años cuidando <span class="text-verde-400">vidas</span>
          </h1>
          <p class="text-white/70 font-body text-body-lg">
            Somos Mijal Salud S.A., una empresa argentina fundada en 2004 con la misión de 
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

      {/* Historia — Timeline */}
      <section class="py-section bg-gris-50">
        <div class="container mx-auto px-6 lg:px-12 max-w-3xl">
          <div class="text-center mb-14">
            <h2 class="font-display text-h2 text-navy-900 mb-4">Nuestra historia</h2>
            <p class="text-gris-600 font-body text-body-lg">
              Dos décadas de compromiso, aprendizaje y crecimiento.
            </p>
          </div>

          <div class="relative">
            <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gris-200 hidden sm:block" />
            <div class="space-y-6">
              {hitos.map((hito, i) => (
                <div key={hito.year} class="sm:pl-20 flex gap-5 relative">
                  <div class={[
                    "absolute left-0 top-1 w-16 h-16 rounded-full flex items-center justify-center text-xs font-display font-black hidden sm:flex shrink-0",
                    i === hitos.length - 1
                      ? "bg-verde-500 text-white"
                      : "bg-white border-2 border-gris-200 text-navy-700",
                  ]}>
                    {hito.year}
                  </div>
                  <div class="bg-white rounded-2xl p-6 shadow-sm border border-gris-100 flex-1">
                    <div class="flex items-center gap-3 mb-1">
                      <span class="sm:hidden font-display font-bold text-verde-600 text-sm">{hito.year}</span>
                      <h3 class="font-display font-bold text-navy-900 text-base">{hito.titulo}</h3>
                    </div>
                    <p class="text-gris-600 font-body text-sm">{hito.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section class="py-section bg-white">
        <div class="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div class="text-center mb-12">
            <h2 class="font-display text-h2 text-navy-900 mb-4">El equipo directivo</h2>
            <p class="text-gris-600 font-body text-body-lg">Profesionales con décadas de experiencia en salud domiciliaria.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {equipo.map((m, i) => {
              const colors = ["bg-verde-500", "bg-navy-700", "bg-violet-600", "bg-orange-500"];
              return (
                <div key={m.nombre} class="text-center">
                  <div class={["w-20 h-20 rounded-full flex items-center justify-center font-display font-black text-white text-2xl mx-auto mb-4", colors[i]]}>
                    {m.iniciales}
                  </div>
                  <h3 class="font-display font-bold text-navy-900 mb-1">{m.nombre}</h3>
                  <p class="text-verde-600 font-body text-sm font-medium mb-1">{m.rol}</p>
                  <p class="text-gris-500 font-body text-xs">{m.especialidad}</p>
                </div>
              );
            })}
          </div>

          {/* CTA Sumate */}
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
  title: "Nosotros — Mijal Salud | Más de 20 años cuidando vidas",
  meta: [{ name: "description", content: "Conocé la historia, misión y equipo de Mijal Salud. Fundada en 2004, somos líderes en atención médica domiciliaria en Buenos Aires y AMBA." }],
};

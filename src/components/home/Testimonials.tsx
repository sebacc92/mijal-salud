import { component$, useSignal, $ } from "@builder.io/qwik";

interface Testimonio {
  nombre: string;
  cargo: string;
  empresa: string;
  texto: string;
  rating: number;
  initials: string;
  color: string;
}

const testimonios: Testimonio[] = [
  {
    nombre: "Martina García",
    cargo: "Gerente de RRHH",
    empresa: "Grupo Clarín",
    texto:
      "Implementamos Área Protegida para nuestros eventos internos. El equipo de Mijal Salud respondió de manera impecable en dos situaciones que se presentaron. Profesionalismo total.",
    rating: 5,
    initials: "MG",
    color: "bg-verde-500",
  },
  {
    nombre: "Roberto Fernández",
    cargo: "Paciente",
    empresa: "Buenos Aires",
    texto:
      "A mi padre le dieron un turno de visita médica a domicilio en menos de 2 horas. El médico fue muy amable y profesional. Lo recomendaría a cualquier familia.",
    rating: 5,
    initials: "RF",
    color: "bg-navy-600",
  },
  {
    nombre: "Laura Suárez",
    cargo: "Directora Médica",
    empresa: "OSDE",
    texto:
      "Trabajamos con Mijal Salud hace más de 8 años. Su capacidad de respuesta y la calidad de su equipo médico los hace un partner indispensable para nuestra obra social.",
    rating: 5,
    initials: "LS",
    color: "bg-violet-600",
  },
  {
    nombre: "Diego Morales",
    cargo: "CEO",
    empresa: "TechBa S.A.",
    texto:
      "Contratamos el programa de Prevención Activa para nuestros 120 empleados. El ausentismo bajó un 40% en el primer trimestre. Los números hablan solos.",
    rating: 5,
    initials: "DM",
    color: "bg-orange-500",
  },
  {
    nombre: "Ana Benitez",
    cargo: "Familiar",
    empresa: "Palermo, CABA",
    texto:
      "Mi mamá estuvo con internación domiciliaria por 3 semanas. El equipo de Mijal Salud la acompañó con una calidez y profesionalismo que nunca esperé. Gracias infinitas.",
    rating: 5,
    initials: "AB",
    color: "bg-pink-500",
  },
];

export const Testimonials = component$(() => {
  const active = useSignal(0);

  const prev = $(() => {
    active.value =
      active.value === 0 ? testimonios.length - 1 : active.value - 1;
  });

  const next = $(() => {
    active.value = (active.value + 1) % testimonios.length;
  });

  return (
    <section class="py-section bg-white">
      <div class="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div class="text-center mb-14">
          <div class="inline-flex items-center gap-2 bg-gris-100 text-gris-600 rounded-full px-4 py-2 mb-5 text-sm font-body font-medium">
            <svg
              class="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Testimonios
          </div>
          <h2 class="font-display text-h2 text-navy-900 mb-4">
            Lo que dicen quienes{" "}
            <span class="text-verde-500">nos eligieron</span>
          </h2>
          <p class="text-gris-600 text-body-lg font-body max-w-xl mx-auto">
            Más de 28.000 familias y cientos de empresas confían en Mijal Salud.
          </p>
        </div>

        {/* Carousel principal */}
        <div class="max-w-3xl mx-auto">
          <div class="relative bg-gris-50 rounded-3xl p-8 lg:p-12 shadow-card">
            {/* Comillas decorativas */}
            <div class="absolute top-8 right-8 text-7xl font-display text-gris-200 leading-none select-none">
              "
            </div>

            {/* Estrellas */}
            <div class="flex gap-1 mb-6">
              {Array.from({ length: testimonios[active.value].rating }).map(
                (_, i) => (
                  <svg
                    key={i}
                    class="w-5 h-5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ),
              )}
            </div>

            {/* Texto */}
            <blockquote class="font-body text-body-lg text-gris-700 leading-relaxed mb-8 relative z-10">
              "{testimonios[active.value].texto}"
            </blockquote>

            {/* Autor */}
            <div class="flex items-center gap-4">
              <div
                class={[
                  "w-12 h-12 rounded-full flex items-center justify-center text-white font-display font-bold text-lg shrink-0",
                  testimonios[active.value].color,
                ]}
              >
                {testimonios[active.value].initials}
              </div>
              <div>
                <p class="font-display font-semibold text-navy-900">
                  {testimonios[active.value].nombre}
                </p>
                <p class="text-gris-500 text-sm font-body">
                  {testimonios[active.value].cargo} ·{" "}
                  {testimonios[active.value].empresa}
                </p>
              </div>
            </div>

            {/* Navegación */}
            <div class="flex items-center gap-3 mt-8 justify-between">
              <div class="flex gap-2">
                {testimonios.map((_, i) => (
                  <button
                    key={i}
                    class={[
                      "transition-all duration-200 rounded-full",
                      i === active.value
                        ? "w-8 h-2.5 bg-verde-500"
                        : "w-2.5 h-2.5 bg-gris-300 hover:bg-gris-400",
                    ]}
                    onClick$={() => (active.value = i)}
                    aria-label={`Ver testimonio ${i + 1}`}
                  />
                ))}
              </div>

              <div class="flex gap-2">
                <button
                  onClick$={prev}
                  class="w-10 h-10 rounded-full bg-white border border-gris-200 hover:border-navy-300 flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Anterior"
                >
                  <svg
                    class="w-4 h-4 text-navy-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick$={next}
                  class="w-10 h-10 rounded-full bg-navy-900 hover:bg-navy-800 flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Siguiente"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

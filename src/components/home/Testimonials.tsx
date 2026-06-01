import { component$ } from "@builder.io/qwik";

interface Testimonio {
  id: string;
  nombre: string;
  cargo?: string | null;
  empresa?: string | null;
  texto: string;
  rating?: number | null;
  avatar?: string | null;
  activo?: boolean | number | null;
}

export const Testimonials = component$(({ list }: { list: Testimonio[] }) => {
  const items = list && list.length > 0 ? list : [];

  const getAvatarBg = (initials: string) => {
    const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
    const colors = [
      "bg-verde-500",
      "bg-navy-600",
      "bg-indigo-600",
      "bg-emerald-600",
      "bg-violet-600",
      "bg-teal-600",
    ];
    return colors[code % colors.length];
  };

  return (
    <section class="py-section bg-gris-50 overflow-hidden">
      <div class="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 bg-verde-50 text-verde-600 border border-verde-100 rounded-full px-4.5 py-1.5 mb-5 text-xs font-body font-bold uppercase tracking-wider">
            <svg
              class="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Opiniones de la Comunidad
          </div>
          <h2 class="font-display text-h2 text-navy-900 mb-4 tracking-tight">
            Lo que dicen quienes <span class="text-verde-500">nos eligieron</span>
          </h2>
          <p class="text-gris-600 text-body-lg font-body max-w-xl mx-auto">
            Más de 28.000 familias y cientos de empresas confían en Mijal Salud.
          </p>
        </div>

        {/* Grid Layout - 3 columnas en desktop */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {items.map((item) => {
            const initials =
              item.avatar ||
              item.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
            const avatarColor = getAvatarBg(initials);

            return (
              <div
                key={item.id}
                class="bg-white rounded-2xl p-8 border border-gris-200 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between relative group"
              >
                {/* Decorative Quotation Mark */}
                <div class="absolute top-6 right-8 text-6xl font-display text-gris-100 group-hover:text-verde-100 transition-colors leading-none select-none">
                  "
                </div>

                <div class="space-y-5">
                  {/* Estrellas */}
                  <div class="flex gap-0.5">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <svg
                        key={i}
                        class="w-4.5 h-4.5 text-amber-400 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  {/* Texto de opinión */}
                  <p class="font-body text-[14.5px] leading-relaxed text-gris-600 italic relative z-10">
                    "{item.texto}"
                  </p>
                </div>

                {/* Info del autor */}
                <div class="flex items-center gap-3.5 pt-6 mt-6 border-t border-gris-100">
                  <div
                    class={[
                      "w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold text-sm shrink-0 shadow-sm",
                      avatarColor,
                    ]}
                  >
                    {initials}
                  </div>
                  <div class="min-w-0">
                    <p class="font-display font-bold text-navy-900 text-sm truncate">
                      {item.nombre}
                    </p>
                    {(item.cargo || item.empresa) && (
                      <p class="text-gris-450 text-[11.5px] font-body truncate">
                        {item.cargo} {item.cargo && item.empresa && "·"}{" "}
                        {item.empresa}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

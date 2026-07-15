import { component$ } from "@builder.io/qwik";

interface TiemposRespuestaProps {
  /** Título de la tarjeta */
  titulo?: string;
}

const codigos = [
  {
    emoji: "🔴",
    codigo: "Código Rojo",
    tiempo: "hasta 15 minutos",
    dot: "bg-red-500",
    valor: "text-red-400",
  },
  {
    emoji: "🟡",
    codigo: "Código Amarillo",
    tiempo: "entre 30 y 45 minutos",
    dot: "bg-amber-400",
    valor: "text-amber-300",
  },
  {
    emoji: "🟢",
    codigo: "Código Verde",
    tiempo: "hasta 2 horas",
    dot: "bg-verde-500",
    valor: "text-verde-400",
  },
];

/**
 * Componente reutilizable con los tiempos de respuesta por código de prioridad.
 * Se usa en Emergencias, Urgencias y Visita Médica.
 */
export const TiemposRespuesta = component$<TiemposRespuestaProps>(
  ({ titulo = "Tiempos de respuesta" }) => {
    return (
      <div class="bg-navy-900 rounded-3xl p-8 text-white w-full">
        <h3 class="font-display font-bold text-xl mb-6">{titulo}</h3>
        <div class="space-y-4">
          {codigos.map((c) => (
            <div
              key={c.codigo}
              class="flex items-center justify-between gap-4 bg-white/5 rounded-xl p-4"
            >
              <div class="flex items-center gap-3">
                <span class="text-lg" aria-hidden="true">
                  {c.emoji}
                </span>
                <span class="font-display font-semibold text-white text-sm sm:text-base">
                  {c.codigo}
                </span>
              </div>
              <span class={["font-display font-black text-sm sm:text-base text-right", c.valor]}>
                {c.tiempo}
              </span>
            </div>
          ))}
        </div>
        <p class="text-white/40 text-xs font-body mt-5">
          * Tiempos estimados, pueden variar según tráfico y condiciones climáticas.
        </p>
      </div>
    );
  },
);

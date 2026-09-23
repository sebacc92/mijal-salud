import { component$ } from "@builder.io/qwik";
import type { CodigoTiempo } from "~/content/servicios/types";

interface TiemposRespuestaProps {
  /** Título de la tarjeta */
  titulo?: string;
  /** Códigos de prioridad. Si no se pasa, usa los valores por defecto. */
  codigos?: CodigoTiempo[];
  /** Nota al pie. */
  nota?: string;
}

const DEFAULT_CODIGOS: CodigoTiempo[] = [
  { emoji: "🔴", codigo: "Código Rojo", tiempo: "hasta 15 minutos" },
  { emoji: "🟡", codigo: "Código Amarillo", tiempo: "entre 30 y 45 minutos" },
  { emoji: "🟢", codigo: "Código Verde", tiempo: "hasta 2 horas" },
];

const DEFAULT_NOTA =
  "* Tiempos estimados, pueden variar según tráfico y condiciones climáticas.";

/** Deriva el color del valor a partir del nombre del código (Rojo/Amarillo/Verde). */
function valorColor(codigo: string): string {
  const c = codigo.toLowerCase();
  if (c.includes("rojo")) return "text-red-400";
  if (c.includes("amarillo")) return "text-amber-300";
  if (c.includes("verde")) return "text-verde-400";
  return "text-white";
}

/**
 * Componente reutilizable con los tiempos de respuesta por código de prioridad.
 * Se usa en Emergencias, Urgencias y Visita Médica. Los textos son editables
 * desde el panel admin (se pasan por props); sin props, muestra los defaults.
 */
export const TiemposRespuesta = component$<TiemposRespuestaProps>(
  ({ titulo = "Tiempos de respuesta", codigos = DEFAULT_CODIGOS, nota = DEFAULT_NOTA }) => {
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
              <span class={["font-display font-black text-sm sm:text-base text-right", valorColor(c.codigo)]}>
                {c.tiempo}
              </span>
            </div>
          ))}
        </div>
        {nota && <p class="text-white/40 text-xs font-body mt-5">{nota}</p>}
      </div>
    );
  },
);

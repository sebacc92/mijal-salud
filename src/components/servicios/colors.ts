// Mapas de color por `colorKey`. Las clases Tailwind se escriben LITERALES acá
// para que el compilador (JIT) las genere; no construir nombres de clase
// dinámicamente (`bg-${x}-50`) porque no se generarían.

import type { ColorKey } from "~/content/servicios/types";

export interface CardColor {
  bg: string;
  border: string;
  icon: string;
  badge: string;
}

/** Colores de las tarjetas de /servicios. */
export const CARD_COLORS: Record<ColorKey, CardColor> = {
  red: { bg: "bg-red-50", border: "border-red-100", icon: "text-red-600", badge: "bg-red-100 text-red-700" },
  amber: { bg: "bg-amber-50", border: "border-amber-100", icon: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
  orange: { bg: "bg-orange-50", border: "border-orange-100", icon: "text-orange-600", badge: "bg-orange-100 text-orange-700" },
  verde: { bg: "bg-verde-50", border: "border-verde-100", icon: "text-verde-700", badge: "bg-verde-100 text-verde-700" },
  blue: { bg: "bg-blue-50", border: "border-blue-100", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
  navy: { bg: "bg-navy-50", border: "border-navy-100", icon: "text-navy-700", badge: "bg-navy-100 text-navy-700" },
  violet: { bg: "bg-violet-50", border: "border-violet-100", icon: "text-violet-700", badge: "bg-violet-100 text-violet-700" },
};

/** Borde + fondo de las tarjetas de tipos de traslado. */
export const TRASLADO_COLORS: Record<ColorKey, string> = {
  red: "border-red-200 bg-red-50",
  amber: "border-amber-200 bg-amber-50",
  orange: "border-orange-200 bg-orange-50",
  verde: "border-verde-200 bg-verde-50",
  blue: "border-blue-200 bg-blue-50",
  navy: "border-navy-200 bg-navy-50",
  violet: "border-violet-200 bg-violet-50",
};

/** Píldoras de color de los rangos de "Dimensionamos según tu evento". */
export const DIMENSION_COLORS: Record<ColorKey, string> = {
  red: "bg-red-100 text-red-700",
  amber: "bg-amber-100 text-amber-700",
  orange: "bg-orange-100 text-orange-700",
  verde: "bg-verde-100 text-verde-700",
  blue: "bg-blue-100 text-blue-700",
  navy: "bg-navy-100 text-navy-700",
  violet: "bg-violet-100 text-violet-700",
};

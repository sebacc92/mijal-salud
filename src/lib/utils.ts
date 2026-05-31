import { clsx, type ClassValue } from "clsx";

/** Combina clases de Tailwind de forma segura */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Formatea número en pesos argentinos */
export function formatARS(n: number): string {
  return n.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/** Formatea número grande con separador de miles */
export function formatNumber(n: number): string {
  return n.toLocaleString("es-AR");
}

/** Valida email básico */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Valida teléfono argentino básico */
export function isValidPhone(phone: string): boolean {
  return /^[\d\s\-\+\(\)]{8,20}$/.test(phone.trim());
}

/** Trunca texto con elipsis */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

/** Genera slug desde texto */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/** Ease-out cubic para animaciones de conteo */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

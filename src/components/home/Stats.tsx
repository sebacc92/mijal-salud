import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { easeOutCubic, formatNumber } from "~/lib/utils";

interface StatItem {
  target: number;
  suffix: string;
  label: string;
  descripcion: string;
}

const stats: StatItem[] = [
  {
    target: new Date().getFullYear() - 2001,
    suffix: "+",
    label: "Años de trayectoria",
    descripcion: "Más de dos décadas al servicio de la salud en Argentina",
  },
  {
    target: 28957,
    suffix: "",
    label: "Atenciones realizadas",
    descripcion: "Pacientes que confiaron en nuestro equipo médico",
  },
  {
    target: 36,
    suffix: "",
    label: "Partners activos",
    descripcion: "Obras sociales y aseguradoras que nos avalan",
  },
  {
    target: 24,
    suffix: "/7",
    label: "Horas disponibles",
    descripcion: "Central operativa activa todos los días del año",
  },
];

const StatCard = component$<{ stat: StatItem; delay: number }>(
  ({ stat, delay }) => {
    const ref = useSignal<Element>();
    const count = useSignal(0);
    const observed = useSignal(false);

    useVisibleTask$(({ cleanup }) => {
      const el = ref.value;
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !observed.value) {
            observed.value = true;
            const duration = 2200;

            setTimeout(() => {
              const start = performance.now();
              const tick = (now: number) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                count.value = Math.floor(easeOutCubic(progress) * stat.target);
                if (progress < 1) requestAnimationFrame(tick);
                else count.value = stat.target;
              };
              requestAnimationFrame(tick);
            }, delay);
          }
        },
        { threshold: 0.4 },
      );

      observer.observe(el);
      cleanup(() => observer.disconnect());
    });

    return (
      <div ref={ref} class="text-center group">
        <div
          class="font-display font-black text-white mb-2 tabular-nums"
          style={{
            fontSize: "clamp(2.75rem, 5.5vw, 4.5rem)",
            lineHeight: "1",
          }}
        >
          {formatNumber(count.value)}
          <span class="text-verde-400">{stat.suffix}</span>
        </div>
        <div class="font-display font-semibold text-white/90 text-lg mb-2">
          {stat.label}
        </div>
        <p class="text-white/50 text-sm font-body leading-relaxed hidden lg:block max-w-[200px] mx-auto">
          {stat.descripcion}
        </p>
      </div>
    );
  },
);

export const Stats = component$(() => {
  return (
    <section class="bg-navy-900 relative overflow-hidden">
      {/* Líneas decorativas top/bottom */}
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-verde-500/40 to-transparent" />
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-verde-500/40 to-transparent" />

      {/* Blob decorativo */}
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-verde-500 rounded-full opacity-5 blur-3xl" />

      <div class="container mx-auto px-6 lg:px-12 py-20">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} delay={i * 200} />
          ))}
        </div>
      </div>
    </section>
  );
});

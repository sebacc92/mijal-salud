import { component$ } from '@builder.io/qwik';

export interface VerticalVideoProps {
  videos: {
    id: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string | null;
    isActive: number;
    displayOrder: number;
    createdAt: string;
  }[];
}

export const VerticalVideo = component$<VerticalVideoProps>(({ videos }) => {
  if (!videos || videos.length === 0) return <></>;

  return (
    <section class="relative py-24 md:py-32 bg-navy-950 overflow-hidden border-t border-navy-900">
      {/* Background decoration grid / texture */}
      <div
        class="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(16,185,129,0.4) 40px, rgba(16,185,129,0.4) 41px)',
        }}
      />
      {/* Ambient green blur */}
      <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-verde-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div class="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div class="flex flex-col items-center mb-16 text-center">
          <div class="inline-flex items-center gap-2 bg-verde-500/10 border border-verde-500/20 rounded-full px-3 py-1 mb-4">
            <span class="text-verde-400 text-xs font-body font-semibold uppercase tracking-wider">Mijal en Acción</span>
          </div>
          <h2 class="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white">
            Nuestros <span class="text-verde-400">Reels & Videos</span>
          </h2>
          <p class="text-white/60 font-body text-sm md:text-base max-w-lg mt-4 leading-relaxed">
            Conocé de cerca nuestro equipamiento, consejos de prevención y el día a día de nuestro equipo médico.
          </p>
        </div>

        {/* Grid layout */}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 lg:gap-12 justify-center justify-items-center items-center w-full">
          {videos.map((video) => (
            <div key={video.id} class="relative w-full max-w-[280px] group">
              {/* Premium Glow effect behind card */}
              <div class="absolute -inset-2 bg-verde-500/20 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              <div class="relative bg-black rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 w-full" style={{ aspectRatio: '9/16' }}>
                <video
                  src={video.videoUrl}
                  poster={video.thumbnailUrl || undefined}
                  preload="none"
                  class="w-full h-full object-cover"
                  controls
                  playsInline
                  loop
                  muted
                />

                {/* Subtitle/Overlay for Title inside the video player */}
                <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12 flex flex-col justify-end pointer-events-none">
                  <h3 class="text-white font-display font-semibold text-sm leading-tight line-clamp-2">
                    {video.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

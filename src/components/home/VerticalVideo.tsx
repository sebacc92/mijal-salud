import { component$, useSignal, $ } from '@builder.io/qwik';

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
            <VerticalVideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
});

// Helper component for each individual video card
export const VerticalVideoCard = component$<{
  video: {
    id: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string | null;
  };
}>(({ video }) => {
  const videoRef = useSignal<HTMLVideoElement>();
  const isPlaying = useSignal(false);
  const isMuted = useSignal(true);

  const togglePlay = $(() => {
    if (!videoRef.value) return;
    if (videoRef.value.paused) {
      videoRef.value.play().catch((err) => console.error("Error playing video:", err));
    } else {
      videoRef.value.pause();
    }
  });

  const toggleMute = $((ev: Event) => {
    ev.stopPropagation(); // Evitar pausar/reproducir al mutear
    if (!videoRef.value) return;
    videoRef.value.muted = !videoRef.value.muted;
    isMuted.value = videoRef.value.muted;
  });

  return (
    <div 
      class="relative w-full max-w-[280px] group cursor-pointer select-none"
      onClick$={togglePlay}
    >
      {/* Premium Glow effect behind card */}
      <div class="absolute -inset-2 bg-verde-500/20 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      <div 
        class="relative bg-black rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 w-full" 
        style={{ aspectRatio: '9/16' }}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl || undefined}
          preload="metadata"
          class="w-full h-full object-cover"
          playsInline
          loop
          muted={isMuted.value}
          onPlay$={() => isPlaying.value = true}
          onPause$={() => isPlaying.value = false}
        />

        {/* Central Play button overlay */}
        <div class={["absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity duration-300 pointer-events-none", isPlaying.value ? "opacity-0" : "opacity-100"].join(" ")}>
          <div class="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/35 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 fill-current translate-x-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Sound toggle button */}
        <button
          onClick$={toggleMute}
          type="button"
          class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/60 transition-colors z-20 cursor-pointer"
          title={isMuted.value ? "Activar sonido" : "Desactivar sonido"}
        >
          {isMuted.value ? (
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L4.5 9H1.5v6h3l4.5 3.75V5.25z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          )}
        </button>

        {/* Subtitle/Overlay for Title inside the video player */}
        <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4 pt-16 flex flex-col justify-end pointer-events-none">
          <h3 class="text-white font-display font-semibold text-sm leading-tight line-clamp-2">
            {video.title}
          </h3>
        </div>
      </div>
    </div>
  );
});

import { component$, useSignal, useComputed$, $ } from '@builder.io/qwik';

interface GalleryImage {
  id: number;
  imageUrl: string;
  title: string | null;
  category: string | null;
  displayOrder: number;
}

interface GalleryProps {
  images: GalleryImage[];
}

const ITEMS_PER_PAGE = 12;

export const Gallery = component$(({ images }: GalleryProps) => {
  const currentPage = useSignal(0);
  const lightboxIdx = useSignal<number | null>(null);

  const totalPages = useComputed$(() => Math.ceil(images.length / ITEMS_PER_PAGE));

  const pageImages = useComputed$(() => {
    const start = currentPage.value * ITEMS_PER_PAGE;
    return images.slice(start, start + ITEMS_PER_PAGE);
  });

  const openLightbox = $((localIdx: number) => {
    lightboxIdx.value = currentPage.value * ITEMS_PER_PAGE + localIdx;
  });

  const closeLightbox = $(() => {
    lightboxIdx.value = null;
  });

  const lightboxNext = $(() => {
    if (lightboxIdx.value === null) return;
    lightboxIdx.value = (lightboxIdx.value + 1) % images.length;
    // Sync page
    currentPage.value = Math.floor(lightboxIdx.value / ITEMS_PER_PAGE);
  });

  const lightboxPrev = $(() => {
    if (lightboxIdx.value === null) return;
    lightboxIdx.value = (lightboxIdx.value - 1 + images.length) % images.length;
    currentPage.value = Math.floor(lightboxIdx.value / ITEMS_PER_PAGE);
  });

  const goToPage = $((page: number) => {
    currentPage.value = page;
  });

  const prevPage = $(() => {
    if (currentPage.value > 0) currentPage.value--;
  });

  const nextPage = $(() => {
    if (currentPage.value < totalPages.value - 1) currentPage.value++;
  });

  if (!images || images.length === 0) return <></>;

  const currentImage = lightboxIdx.value !== null ? images[lightboxIdx.value] : null;

  return (
    <section class="w-full bg-slate-50 py-24 md:py-32 px-6 relative overflow-hidden border-t border-b border-slate-100">
      {/* Background decoration */}
      <div
        class="absolute inset-0 opacity-4 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, #10b981 0%, transparent 50%), radial-gradient(circle at 80% 50%, #0c4a6e 0%, transparent 50%)',
        }}
      />

      <div class="relative z-10 container mx-auto max-w-7xl">
        {/* Section header */}
        <div class="flex flex-col items-center mb-8 text-center">
          <div class="inline-flex items-center gap-2 bg-verde-500/10 border border-verde-500/20 rounded-full px-3 py-1">
            <span class="text-verde-600 text-xs font-body font-semibold uppercase tracking-wider">Galería de Fotos</span>
          </div>
        </div>

        {/* Grid */}
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {pageImages.value.map((image, localIdx) => (
            <button
              key={image.id}
              type="button"
              class="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-verde-500"
              onClick$={() => openLightbox(localIdx)}
            >
              <img
                src={image.imageUrl}
                alt={image.title || 'Imagen Mijal Salud'}
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                width={300}
                height={300}
              />
              {/* Hover overlay */}
              <div class="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                {image.title && (
                  <p class="text-white text-[11px] sm:text-xs font-semibold leading-tight line-clamp-2 text-left">
                    {image.title}
                  </p>
                )}
              </div>
              {/* Expand icon */}
              <div class="absolute top-2.5 right-2.5 w-7 h-7 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3.5 h-3.5 text-navy-950"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width={2.5}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages.value > 1 && (
          <div class="flex items-center justify-center gap-4 mt-12">
            {/* Prev arrow */}
            <button
              type="button"
              onClick$={prevPage}
              disabled={currentPage.value === 0}
              class="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-slate-700 shadow-sm"
              aria-label="Página anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width={2.5}
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots */}
            <div class="flex items-center gap-2">
              {Array.from({ length: totalPages.value }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick$={() => goToPage(i)}
                  class={[
                    'transition-all duration-300 rounded-full cursor-pointer',
                    currentPage.value === i
                      ? 'w-6 h-2.5 bg-verde-500'
                      : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-450',
                  ].join(' ')}
                  aria-label={`Página ${i + 1}`}
                />
              ))}
            </div>

            {/* Next arrow */}
            <button
              type="button"
              onClick$={nextPage}
              disabled={currentPage.value >= totalPages.value - 1}
              class="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-slate-700 shadow-sm"
              aria-label="Página siguiente"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width={2.5}
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Image counter */}
        <p class="text-center text-slate-500 text-xs mt-6 font-body">
          {currentPage.value * ITEMS_PER_PAGE + 1}–
          {Math.min((currentPage.value + 1) * ITEMS_PER_PAGE, images.length)} de {images.length}{' '}
          foto{images.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Lightbox */}
      {lightboxIdx.value !== null && currentImage && (
        <div
          class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick$={closeLightbox}
        >
          {/* Close */}
          <button
            type="button"
            class="absolute top-4 right-4 z-10 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            onClick$={closeLightbox}
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width={2}
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              type="button"
              class="absolute left-4 md:left-8 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              onClick$={(e) => {
                e.stopPropagation();
                lightboxPrev();
              }}
              aria-label="Imagen anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width={2.5}
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image Container */}
          <div
            class="max-w-5xl w-full flex flex-col items-center gap-4"
            onClick$={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.imageUrl}
              alt={currentImage.title || 'Imagen Mijal Salud'}
              class="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            {currentImage.title && (
              <p class="text-white font-display font-semibold text-base md:text-lg text-center px-4 max-w-2xl">
                {currentImage.title}
              </p>
            )}
            {images.length > 1 && (
              <p class="text-slate-500 text-xs font-mono">
                {(lightboxIdx.value ?? 0) + 1} / {images.length}
              </p>
            )}
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              class="absolute right-4 md:right-8 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              onClick$={(e) => {
                e.stopPropagation();
                lightboxNext();
              }}
              aria-label="Imagen siguiente"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width={2.5}
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </section>
  );
});

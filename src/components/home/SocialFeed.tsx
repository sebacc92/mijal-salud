import { component$ } from '@builder.io/qwik';

export interface InstagramPostProps {
  id: string;
  mediaUrl: string;
  permalink: string;
  caption?: string;
}

type SocialFeedProps = {
  posts?: InstagramPostProps[];
};

export const SocialFeed = component$<SocialFeedProps>(({ posts }) => {
  const safePosts = posts && posts.length > 0 ? posts : [];

  if (safePosts.length === 0) {
    return null;
  }

  return (
    <section class="relative py-20 bg-slate-50 text-slate-800">
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div class="mx-auto flex max-w-7xl flex-col gap-10 px-4">
        <header class="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div class="text-center md:text-left">
            <p class="mb-2 text-[10px] font-bold tracking-[0.35em] text-verde-600 uppercase">
              Comunidad · Novedades · Salud
            </p>
            <h2 class="text-3xl font-display font-black uppercase leading-tight tracking-[0.1em] md:text-4xl text-navy-900">
              @mijalsalud
            </h2>
          </div>

          <a
            href="https://instagram.com/mijalsalud"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-3 border border-navy-900 bg-navy-900 text-white px-6 py-3 text-xs font-black uppercase tracking-[0.25em] transition hover:-translate-y-0.5 hover:bg-verde-600 hover:border-verde-600 rounded-full shadow-md"
          >
            <span>Ver perfil</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </header>

        <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {safePosts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              class="group relative block aspect-square overflow-hidden bg-slate-200 rounded-xl"
            >
              <img
                src={post.mediaUrl}
                alt={post.caption || 'Post de Instagram de Mijal Salud'}
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div class="flex flex-col items-center gap-2 text-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-9 w-9"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span class="text-xs font-bold tracking-widest uppercase">Ver en IG</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
});

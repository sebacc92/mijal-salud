import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

interface PartnerItem {
  id: number;
  imageUrl: string;
  name: string;
  displayOrder: number;
}

interface PartnersProps {
  partners?: PartnerItem[];
}

export const Partners = component$<PartnersProps>(({ partners }) => {
  useStylesScoped$(`
    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    .animate-marquee-track {
      display: flex;
      align-items: center;
      gap: 4rem;
      width: max-content;
      animation: marquee 35s linear infinite;
    }
    .animate-marquee-track:hover {
      animation-play-state: paused;
    }
    .marquee-container {
      position: relative;
      width: 100%;
      overflow: hidden;
      padding: 1.5rem 0;
    }
  `);

  const hasDbPartners = partners && partners.length > 0;

  const renderFallbackSVGs = () => (
    <>
      {/* Assist Card */}
      <div class="flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 hover:opacity-90">
        <svg viewBox="0 0 100 100" class="h-32 w-32" aria-label="Assist Card">
          <rect width="100" height="100" rx="16" fill="#C61A30"/>
          <text x="50" y="46" font-family="'Outfit', 'Arial Black', sans-serif" font-weight="900" font-size="14" fill="#FFFFFF" text-anchor="middle" font-style="italic" letter-spacing="-0.5">ASSIST</text>
          <text x="50" y="68" font-family="'Outfit', 'Arial Black', sans-serif" font-weight="900" font-size="14" fill="#FFFFFF" text-anchor="middle" font-style="italic" letter-spacing="-0.5">CARD</text>
        </svg>
      </div>

      {/* Reconquista */}
      <div class="flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 hover:opacity-90">
        <svg viewBox="0 0 200 100" class="h-32 w-72" aria-label="Reconquista">
          <path d="M 75 18 L 94 33 L 75 48 L 56 33 Z" fill="#00A2C9" />
          <path d="M 97 18 L 116 33 L 97 48 L 78 33 Z" fill="#0A3C6B" opacity="0.95" />
          <text x="75" y="37" font-family="'Outfit', sans-serif" font-weight="bold" font-size="10" fill="#FFFFFF" text-anchor="middle">rec</text>
          <text x="97" y="37" font-family="'Outfit', sans-serif" font-weight="bold" font-size="10" fill="#FFFFFF" text-anchor="middle">art</text>
          <text x="86" y="68" font-family="'Outfit', 'Georgia', serif" font-weight="700" font-size="16" fill="#0A3C6B" text-anchor="middle" letter-spacing="1">RECONQUISTA</text>
          <text x="86" y="80" font-family="'DM Sans', sans-serif" font-weight="500" font-size="4.5" fill="#5c6b7a" text-anchor="middle" letter-spacing="0.5">ASEGURADORA DE RIESGOS DEL TRABAJO S.A.</text>
        </svg>
      </div>

      {/* OSSEG */}
      <div class="flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 hover:opacity-90">
        <svg viewBox="0 0 180 100" class="h-32 w-64" aria-label="OSSEG">
          <text x="90" y="55" font-family="'Outfit', 'Georgia', serif" font-weight="700" font-size="34" fill="#0B426B" text-anchor="middle" letter-spacing="1">OSSEG</text>
          <line x1="20" y1="65" x2="160" y2="65" stroke="#C49A45" stroke-width="2" />
          <text x="90" y="78" font-family="'DM Sans', sans-serif" font-weight="700" font-size="7" fill="#0B426B" text-anchor="middle" letter-spacing="1.2">OBRA SOCIAL DE SEGUROS</text>
        </svg>
      </div>

      {/* OMINT ART */}
      <div class="flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 hover:opacity-90">
        <svg viewBox="0 0 200 100" class="h-32 w-64" aria-label="OMINT ART">
          <text x="60" y="58" font-family="'Outfit', sans-serif" font-weight="900" font-size="28" fill="#002D62" text-anchor="middle" letter-spacing="-0.5">OMINT</text>
          <path d="M 112 58 C 112 35, 127 28, 162 28 C 147 48, 147 55, 132 68 C 122 72, 112 72, 112 58 Z" fill="#002D62" />
          <text x="133" y="52" font-family="'Outfit', sans-serif" font-weight="bold" font-size="12" fill="#FFFFFF" text-anchor="middle">ART</text>
        </svg>
      </div>

      {/* OSPIC */}
      <div class="flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 hover:opacity-90">
        <svg viewBox="0 0 180 100" class="h-32 w-64" aria-label="OSPIC">
          <g transform="translate(35, 50)">
            <circle cx="0" cy="0" r="18" fill="none" stroke="#2E7D32" stroke-width="2.5" />
            <path d="M -9 -15 L 0 -18 L 9 -15 L -2 -9 Z" fill="#2E7D32" />
            <path d="M 15 -9 L 18 0 L 15 9 L 9 -2 Z" fill="#4CAF50" />
            <path d="M 9 15 L 0 18 L -9 15 L 2 9 Z" fill="#81C784" />
            <path d="M -15 9 L -18 0 L -15 -9 L -9 2 Z" fill="#1B5E20" />
            <circle cx="0" cy="0" r="5" fill="#333" />
          </g>
          <text x="115" y="59" font-family="'Outfit', sans-serif" font-weight="bold" font-size="30" fill="#2E7D32" text-anchor="middle" letter-spacing="1">OSPIC</text>
        </svg>
      </div>

      {/* Ospical */}
      <div class="flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 hover:opacity-90">
        <svg viewBox="0 0 180 100" class="h-32 w-64" aria-label="Ospical">
          <g transform="translate(35, 50)">
            <circle cx="0" cy="0" r="18" fill="none" stroke="#003366" stroke-width="2" />
            <path d="M -10 -10 C -5 -15, 5 -15, 10 -10 C 5 -5, -5 -5, -10 -10 Z" fill="#003366" opacity="0.8" />
            <path d="M -10 10 C -5 5, 5 5, 10 10 C 5 15, -5 15, -10 10 Z" fill="#0080FF" opacity="0.8" />
            <circle cx="0" cy="0" r="4" fill="#003366" />
          </g>
          <text x="115" y="58" font-family="'Outfit', 'Georgia', serif" font-weight="normal" font-size="28" fill="#003366" text-anchor="middle">Ospical</text>
        </svg>
      </div>

      {/* OSEIV */}
      <div class="flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 hover:opacity-90">
        <svg viewBox="0 0 220 100" class="h-32 w-72" aria-label="OSEIV">
          <g transform="translate(35, 50) scale(0.9)">
            <polygon points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8" fill="none" stroke="#0E4F8E" stroke-width="1.5" />
            <circle cx="0" cy="-16" r="3" fill="#0E4F8E" />
            <circle cx="14" cy="-8" r="3" fill="#1B75BC" />
            <circle cx="14" cy="8" r="3" fill="#29ABE2" />
            <circle cx="0" cy="16" r="3" fill="#0E4F8E" />
            <circle cx="-14" cy="8" r="3" fill="#1B75BC" />
            <circle cx="-14" cy="-8" r="3" fill="#29ABE2" />
            <circle cx="0" cy="0" r="4" fill="#0E4F8E" />
            <line x1="0" y1="0" x2="0" y2="-16" stroke="#0E4F8E" stroke-width="1" />
            <line x1="0" y1="0" x2="14" y2="-8" stroke="#1B75BC" stroke-width="1" />
            <line x1="0" y1="0" x2="14" y2="8" stroke="#29ABE2" stroke-width="1" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="#0E4F8E" stroke-width="1" />
            <line x1="0" y1="0" x2="-14" y2="8" stroke="#1B75BC" stroke-width="1" />
            <line x1="0" y1="0" x2="-14" y2="-8" stroke="#29ABE2" stroke-width="1" />
          </g>
          <text x="130" y="48" font-family="'Outfit', sans-serif" font-weight="bold" font-size="26" fill="#0E4F8E" text-anchor="middle" letter-spacing="1">OSEIV</text>
          <text x="130" y="65" font-family="'DM Sans', sans-serif" font-size="6" fill="#5c6b7a" text-anchor="middle">Obra Social Empleados Vidrio</text>
        </svg>
      </div>

      {/* PAMI */}
      <div class="flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 hover:opacity-90">
        <svg viewBox="0 0 180 100" class="h-32 w-64" aria-label="PAMI">
          <g transform="translate(35, 50)">
            <circle cx="0" cy="0" r="18" fill="none" stroke="#009EE3" stroke-width="4.5" />
            <circle cx="0" cy="0" r="8" fill="#FFCC00" />
          </g>
          <text x="115" y="50" font-family="'Outfit', 'Arial Black', sans-serif" font-weight="900" font-size="34" fill="#004B87" text-anchor="middle">PAMI</text>
          <text x="115" y="70" font-family="'DM Sans', sans-serif" font-weight="bold" font-size="12" fill="#009EE3" text-anchor="middle" letter-spacing="2">INSSJP</text>
        </svg>
      </div>

      {/* Centro Medico Pueyrredon */}
      <div class="flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 hover:opacity-90">
        <svg viewBox="0 0 240 100" class="h-32 w-80" aria-label="Centro Medico Pueyrredon">
          <g transform="translate(35, 50) scale(1.1)">
            <path d="M -15 -8 C -5 -8, -5 8, 5 8 C 15 8, 15 -8, 5 -8 C -5 -8, -5 8, -15 8 C -25 8, -25 -8, -15 -8 Z" fill="none" stroke="#003366" stroke-width="4" stroke-linecap="round" />
          </g>
          <text x="140" y="48" font-family="'Outfit', sans-serif" font-weight="bold" font-size="11" fill="#003366" text-anchor="middle" letter-spacing="0.5">CENTRO MEDICO PUEYRREDON</text>
          <text x="140" y="65" font-family="'DM Sans', sans-serif" font-size="7.5" fill="#003366" text-anchor="middle" letter-spacing="1">MEDICINA PREPAGA</text>
        </svg>
      </div>

      {/* Santa Catalina */}
      <div class="flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 hover:opacity-90">
        <svg viewBox="0 0 240 100" class="h-32 w-80" aria-label="Santa Catalina">
          <g transform="translate(35, 50)">
            <circle cx="0" cy="0" r="18" fill="none" stroke="#E67E22" stroke-width="1.5" />
            <circle cx="0" cy="0" r="12" fill="none" stroke="#E67E22" stroke-width="1.5" />
            <circle cx="0" cy="0" r="6" fill="none" stroke="#E67E22" stroke-width="1.5" />
            <line x1="0" y1="-18" x2="0" y2="18" stroke="#E67E22" stroke-width="1.5" />
            <line x1="-18" y1="0" x2="18" y2="0" stroke="#E67E22" stroke-width="1.5" />
            <line x1="-12.7" y1="-12.7" x2="12.7" y2="12.7" stroke="#E67E22" stroke-width="1.5" />
            <line x1="-12.7" y1="12.7" x2="12.7" y2="-12.7" stroke="#E67E22" stroke-width="1.5" />
          </g>
          <text x="140" y="48" font-family="'Outfit', sans-serif" font-weight="bold" font-size="15" fill="#333" text-anchor="middle" letter-spacing="1">SANTA CATALINA</text>
          <text x="140" y="65" font-family="'DM Sans', sans-serif" font-weight="bold" font-size="7" fill="#666" text-anchor="middle" letter-spacing="0.5">NEUROREHABILITACION CLINICA</text>
        </svg>
      </div>
    </>
  );

  return (
    <section class="py-16 bg-white overflow-hidden">
      <div class="container mx-auto px-6 lg:px-12">
        <h2 class="text-center font-display font-bold text-2xl text-gris-800 mb-12 tracking-wide">
          Partners
        </h2>

        {/* Marquee Container with fade gradient overlays */}
        <div class="marquee-container">
          <div class="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div class="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>

          <div class="animate-marquee-track">
            {hasDbPartners ? (
              <>
                {/* Original set */}
                {partners.map((partner) => (
                  <div
                    key={`p1-${partner.id}`}
                    class="flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 hover:opacity-90"
                    title={partner.name}
                  >
                    <img
                      src={partner.imageUrl}
                      alt={partner.name}
                      width="320"
                      height="128"
                      class="h-28 w-auto max-w-[280px] object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
                {/* Duplicated set for infinite loop */}
                {partners.map((partner) => (
                  <div
                    key={`p2-${partner.id}`}
                    class="flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 hover:opacity-90"
                    title={partner.name}
                  >
                    <img
                      src={partner.imageUrl}
                      alt={partner.name}
                      width="320"
                      height="128"
                      class="h-28 w-auto max-w-[280px] object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                {renderFallbackSVGs()}
                {renderFallbackSVGs()}
              </>
            )}
          </div>
        </div>

        {/* CTA a empresas */}
        <div class="text-center mt-14">
          <Link
            href="/empresas"
            class="inline-flex items-center gap-1.5 font-display font-bold text-navy-600 hover:text-verde-600 transition-colors text-base"
          >
            + Empresas que confían en MIJAL SALUD
          </Link>
        </div>
      </div>
    </section>
  );
});

import Link from "next/link";
import { getFeaturedArtworks, getUpcomingExhibition } from "@/lib/data";
import { formatDateRange } from "@/lib/format";
import SpotlightImage from "@/components/SpotlightImage";
import ArtworkImage from "@/components/ArtworkImage";

const URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

export async function generateMetadata() {
  const [hero] = await getFeaturedArtworks(1);
  if (!hero?.cover_image_url) return {};
  return { openGraph: { images: [`${URL_ENDPOINT}${hero.cover_image_url}`] } };
}

export default async function Home() {
  const [featured, exhibition] = await Promise.all([
    getFeaturedArtworks(6),
    getUpcomingExhibition(),
  ]);

  const hero = featured[0];
  const filmstrip = featured.slice(1);

  if (!hero) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-xl text-center">
          <p className="mb-6 font-label text-xs tracking-[0.2em] text-gold">
            قريبًا
          </p>
          <h1 className="mb-6 text-balance font-display text-4xl leading-tight md:text-5xl">
            الضوء الذي يتبع العمل
          </h1>
          <p className="font-body text-base leading-relaxed text-muted md:text-lg">
            موقع الفنانة قيد الإنشاء — معرض أعمال، مدونة، وتواصل مباشر.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      {/* Hero: featured artwork under its own spotlight */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="mb-6 font-label text-xs tracking-[0.2em] text-gold">
            عمل مميز
          </p>
          <h1 className="mb-6 text-balance font-display text-4xl leading-tight md:text-5xl">
            {hero.title}
          </h1>
          {hero.description && (
            <p className="mb-8 font-body text-base leading-relaxed text-muted md:text-lg">
              {hero.description}
            </p>
          )}
          <Link
            href={`/gallery/${hero.slug}`}
            className="inline-block border border-gold px-6 py-3.5 font-label text-xs tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-bg"
          >
            عرض العمل
          </Link>
        </div>

        <SpotlightImage
          src={hero.cover_image_url}
          alt={hero.title}
          width={800}
          height={1000}
          className="aspect-[4/5]"
        />
      </section>

      {/* Filmstrip of other featured works */}
      {filmstrip.length > 0 && (
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-display text-2xl">أعمال مختارة</h2>
              <Link
                href="/gallery"
                className="font-label text-xs tracking-[0.15em] text-gold hover:underline"
              >
                كل الأعمال ←
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-2">
              {filmstrip.map((art) => (
                <Link
                  key={art.id}
                  href={`/gallery/${art.slug}`}
                  className="group w-44 shrink-0"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-surface">
                    <ArtworkImage
                      src={art.cover_image_url}
                      alt={art.title}
                      width={300}
                      height={375}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 font-display text-sm text-ink">
                    {art.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming exhibition teaser */}
      {exhibition && (
        <section className="border-t border-white/5 bg-surface/40">
          <div className="mx-auto max-w-6xl px-6 py-14 text-center">
            <p className="mb-4 font-label text-xs tracking-[0.2em] text-gold">
              معرض قادم
            </p>
            <h2 className="mb-3 font-display text-2xl md:text-3xl">
              {exhibition.title}
            </h2>
            {exhibition.location && (
              <p className="font-body text-muted">{exhibition.location}</p>
            )}
            <p className="mt-1 font-label text-xs tracking-[0.1em] text-muted">
              {formatDateRange(exhibition.start_date, exhibition.end_date)}
            </p>
            <Link
              href="/blog"
              className="mt-6 inline-block font-label text-xs tracking-[0.15em] text-gold hover:underline"
            >
              التفاصيل ←
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

import Link from "next/link";
import { getArtworks, getArtworkCategories } from "@/lib/data";
import ArtworkCard from "@/components/ArtworkCard";

export const metadata = {
  title: "المعرض | ليالي الدرعية",
  description: "تصفحي مجموعة الأعمال الفنية — لوحات بخامات وتصنيفات مختلفة.",
  openGraph: {
    title: "المعرض",
    description: "تصفحي مجموعة الأعمال الفنية — لوحات بخامات وتصنيفات مختلفة.",
  },
};

export default async function GalleryPage({ searchParams }) {
  const { category } = await searchParams;

  const [artworks, categories] = await Promise.all([
    getArtworks({ category }),
    getArtworkCategories(),
  ]);

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14 text-center">
        <p className="mb-4 font-label text-xs tracking-[0.2em] text-gold">
          المعرض
        </p>
        <h1 className="font-display text-3xl md:text-4xl">أعمال فنية</h1>
      </section>

      {categories.length > 0 && (
        <nav className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-6 pb-10">
          <FilterChip href="/gallery" active={!category} label="الكل" />
          {categories.map((c) => (
            <FilterChip
              key={c}
              href={`/gallery?category=${encodeURIComponent(c)}`}
              active={category === c}
              label={c}
            />
          ))}
        </nav>
      )}

      <section className="mx-auto max-w-6xl px-6 pb-24">
        {artworks.length === 0 ? (
          <p className="py-24 text-center font-body text-muted">
            لا توجد أعمال منشورة في هذا التصنيف حاليًا.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function FilterChip({ href, active, label }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 font-label text-xs tracking-[0.1em] transition-colors ${
        active
          ? "border-gold bg-gold text-bg"
          : "border-white/10 text-muted hover:border-gold/40 hover:text-gold"
      }`}
    >
      {label}
    </Link>
  );
}

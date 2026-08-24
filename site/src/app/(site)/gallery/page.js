import { Suspense } from "react";
import Link from "next/link";
import { getArtworks, getArtworkCategories } from "@/lib/data";
import ArtworkCard from "@/components/ArtworkCard";
import { SkeletonArtworkCard, SkeletonBox } from "@/components/Skeleton";

export const metadata = {
  title: "المعرض | ليالي الدرعية",
  description: "تصفحي مجموعة الأعمال الفنية — لوحات بخامات وتصنيفات مختلفة.",
  openGraph: {
    title: "المعرض",
    description: "تصفحي مجموعة الأعمال الفنية — لوحات بخامات وتصنيفات مختلفة.",
  },
};

// Clicking a category chip only changes the searchParams — same route
// segment, not a fresh navigation — so the sibling loading.js (which only
// covers *entering* this segment) never fires for it. React's default
// Suspense-during-transition behavior keeps the old grid on screen instead
// of showing a fallback, which is the "freezes for two seconds" bug.
// Fix: an inner Suspense boundary keyed on `category`, so every filter
// click is treated as a fresh subtree and the skeleton actually shows.
export default async function GalleryPage({ searchParams }) {
  const { category } = await searchParams;

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14 text-center">
        <p className="mb-4 font-label text-xs tracking-[0.2em] text-gold">
          المعرض
        </p>
        <h1 className="font-display text-3xl md:text-4xl">أعمال فنية</h1>
      </section>

      <Suspense key={category ?? "all"} fallback={<GallerySkeleton />}>
        <GalleryContent category={category} />
      </Suspense>
    </main>
  );
}

async function GalleryContent({ category }) {
  const [artworks, categories] = await Promise.all([
    getArtworks({ category }),
    getArtworkCategories(),
  ]);

  return (
    <>
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
    </>
  );
}

function GallerySkeleton() {
  return (
    <>
      <nav className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-6 pb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="h-9 w-20 rounded-full" />
        ))}
      </nav>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonArtworkCard key={i} />
          ))}
        </div>
      </section>
    </>
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

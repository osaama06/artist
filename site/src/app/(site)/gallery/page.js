import { Suspense } from "react";
import { getArtworks, getArtworkCategories } from "@/lib/data";
import ArtworkCard from "@/components/ArtworkCard";
import CategoryFilterNav from "@/components/CategoryFilterNav";
import { SkeletonArtworkCard, SkeletonBox } from "@/components/Skeleton";

export const metadata = {
  title: "المعرض | ليالي الدرعية",
  description: "تصفحي مجموعة الأعمال الفنية — لوحات بخامات وتصنيفات مختلفة.",
  openGraph: {
    title: "المعرض",
    description: "تصفحي مجموعة الأعمال الفنية — لوحات بخامات وتصنيفات مختلفة.",
  },
};

// Two independent Suspense boundaries, not one shared boundary:
// - Chips: no `key`, so React keeps them mounted across filter clicks —
//   they never re-flash to a skeleton, and the active highlight updates
//   instantly client-side (see CategoryFilterNav) regardless of how long
//   the grid query takes.
// - Grid: `key={category}` deliberately forces a fresh subtree per filter,
//   so it *does* show a skeleton — that's the one thing actually loading.
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

      <Suspense fallback={<ChipsSkeleton />}>
        <CategoryChips />
      </Suspense>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Suspense key={category ?? "all"} fallback={<GridSkeleton />}>
          <ArtworkGrid category={category} />
        </Suspense>
      </section>
    </main>
  );
}

async function CategoryChips() {
  const categories = await getArtworkCategories();
  if (categories.length === 0) return null;
  return <CategoryFilterNav categories={categories} />;
}

async function ArtworkGrid({ category }) {
  const artworks = await getArtworks({ category });

  if (artworks.length === 0) {
    return (
      <p className="py-24 text-center font-body text-muted">
        لا توجد أعمال منشورة في هذا التصنيف حاليًا.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}

function ChipsSkeleton() {
  return (
    <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-6 pb-10">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonBox key={i} className="h-9 w-20 rounded-full" />
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonArtworkCard key={i} />
      ))}
    </div>
  );
}

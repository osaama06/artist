import { Suspense } from "react";
import { getArtworks, getArtworkCategories } from "@/lib/data";
import ArtworkCard from "@/components/ArtworkCard";
import GalleryInteractive from "@/components/GalleryInteractive";
import { SkeletonArtworkCard } from "@/components/Skeleton";

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
  const categories = await getArtworkCategories();

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14 text-center">
        <p className="mb-4 font-label text-xs tracking-[0.2em] text-gold">
          المعرض
        </p>
        <h1 className="font-display text-3xl md:text-4xl">أعمال فنية</h1>
      </section>

      <GalleryInteractive categories={categories}>
        {/* Still Suspense-wrapped for the non-JS / first-load path — but
            the instant loading feedback on filter clicks comes from
            GalleryInteractive's own isPending state, not this boundary. */}
        <Suspense key={category ?? "all"} fallback={<GridSkeleton />}>
          <ArtworkGrid category={category} />
        </Suspense>
      </GalleryInteractive>
    </main>
  );
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

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonArtworkCard key={i} />
      ))}
    </div>
  );
}

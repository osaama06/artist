import { SkeletonArtworkCard, SkeletonBox } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14 text-center">
        <SkeletonBox className="mx-auto mb-4 h-2.5 w-16" />
        <SkeletonBox className="mx-auto h-9 w-40" />
      </section>

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
    </main>
  );
}

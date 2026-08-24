import { SkeletonBox, SkeletonLine } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="flex-1">
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-2">
        <SkeletonBox className="aspect-[4/5] w-full" />

        <div>
          <SkeletonBox className="mb-5 h-6 w-20 rounded-full" />
          <SkeletonBox className="mb-6 h-10 w-4/5" />

          <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-white/5 py-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <SkeletonLine className="mb-2 w-12" />
                <SkeletonLine className="w-20" />
              </div>
            ))}
          </div>

          <SkeletonLine className="mb-2 w-full" />
          <SkeletonLine className="mb-8 w-2/3" />

          <SkeletonBox className="h-12 w-40" />
        </div>
      </section>
    </main>
  );
}

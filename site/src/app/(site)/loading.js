import { SkeletonBox, SkeletonLine } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="flex-1">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <SkeletonLine className="mb-6 h-2.5 w-20" />
          <SkeletonBox className="mb-3 h-9 w-full" />
          <SkeletonBox className="mb-6 h-9 w-2/3" />
          <SkeletonLine className="mb-2 w-full" />
          <SkeletonLine className="mb-8 w-4/5" />
          <SkeletonBox className="h-12 w-36" />
        </div>
        <SkeletonBox className="aspect-[4/5] w-full" />
      </section>
    </main>
  );
}

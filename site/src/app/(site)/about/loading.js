import { SkeletonBox, SkeletonLine } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="flex-1">
      <section className="mx-auto grid max-w-5xl gap-12 px-6 py-16 md:grid-cols-[300px_1fr] md:items-start">
        <SkeletonBox className="aspect-[4/5] w-full" />
        <div>
          <SkeletonLine className="mb-4 h-2.5 w-20" />
          <SkeletonBox className="mb-6 h-9 w-32" />
          <SkeletonLine className="mb-2 w-full" />
          <SkeletonLine className="mb-2 w-full" />
          <SkeletonLine className="w-3/4" />
        </div>
      </section>
    </main>
  );
}

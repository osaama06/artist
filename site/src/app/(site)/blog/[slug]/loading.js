import { SkeletonBox, SkeletonLine } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="flex-1">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <SkeletonBox className="mb-8 aspect-[16/9] w-full" />
        <SkeletonBox className="mb-8 h-10 w-3/4" />
        <div className="space-y-3">
          <SkeletonLine className="w-full" />
          <SkeletonLine className="w-full" />
          <SkeletonLine className="w-5/6" />
          <SkeletonLine className="w-full" />
          <SkeletonLine className="w-2/3" />
        </div>
      </article>
    </main>
  );
}

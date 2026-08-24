import { SkeletonBox, SkeletonLine } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div>
      <SkeletonBox className="mb-8 h-8 w-40" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-white/10 p-6">
            <SkeletonLine className="mb-4 w-24" />
            <SkeletonBox className="mb-4 h-10 w-12" />
            <SkeletonLine className="w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

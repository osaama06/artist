import { SkeletonBox, SkeletonLine } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <SkeletonBox className="h-8 w-32" />
        <SkeletonBox className="h-11 w-32" />
      </div>
      <div className="max-w-2xl divide-y divide-white/5 border-y border-white/5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-4">
            <div className="flex-1 space-y-2">
              <SkeletonLine className="h-4 w-1/3" />
              <SkeletonLine className="w-1/2" />
            </div>
            <SkeletonLine className="w-10 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

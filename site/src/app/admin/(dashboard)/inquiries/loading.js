import { SkeletonBox, SkeletonLine } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div>
      <SkeletonBox className="mb-8 h-8 w-32" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-white/10 p-5">
            <div className="mb-3 flex items-center justify-between">
              <SkeletonLine className="w-32" />
              <SkeletonLine className="w-20" />
            </div>
            <SkeletonLine className="mb-2 w-48" />
            <SkeletonLine className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

import { SkeletonBox, SkeletonLine } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div>
      <SkeletonBox className="mb-2 h-8 w-32" />
      <SkeletonLine className="mb-8 h-4 w-96 max-w-full" />

      <div className="mb-10 max-w-sm">
        <SkeletonLine className="mb-2 w-20" />
        <SkeletonBox className="h-11 w-full" />
      </div>

      <div className="max-w-md divide-y divide-white/5 border-y border-white/5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <SkeletonLine className="w-24" />
            <SkeletonLine className="w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

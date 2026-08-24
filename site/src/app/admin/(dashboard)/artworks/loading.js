import { SkeletonBox, SkeletonTable } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <SkeletonBox className="h-8 w-40" />
        <SkeletonBox className="h-11 w-32" />
      </div>
      <SkeletonTable rows={6} cols={4} />
    </div>
  );
}

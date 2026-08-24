import { SkeletonBox, SkeletonForm } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div>
      <SkeletonBox className="mb-8 h-8 w-48" />
      <SkeletonForm fields={6} />
    </div>
  );
}

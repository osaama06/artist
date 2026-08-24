import { SkeletonBox, SkeletonForm } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div>
      <SkeletonBox className="mb-8 h-8 w-56" />
      <SkeletonForm fields={7} />
    </div>
  );
}

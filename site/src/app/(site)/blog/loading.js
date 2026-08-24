import { SkeletonBox } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-14 text-center">
        <SkeletonBox className="mx-auto mb-4 h-2.5 w-16" />
        <SkeletonBox className="mx-auto h-9 w-48" />
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14">
        <div className="space-y-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <SkeletonBox className="mb-4 aspect-[16/9] w-full" />
              <SkeletonBox className="h-6 w-2/3" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

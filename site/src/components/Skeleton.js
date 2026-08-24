// Shared building blocks for loading.js skeleton screens. Kept dumb on
// purpose — each route's loading.js composes these to roughly match that
// page's real layout, so content doesn't jump when the real data swaps in.

export function SkeletonBox({ className = "" }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonLine({ className = "" }) {
  return <div className={`skeleton h-3 rounded-sm ${className}`} />;
}

export function SkeletonArtworkCard() {
  return (
    <div>
      <SkeletonBox className="aspect-[4/5] w-full" />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-3/4" />
          <SkeletonLine className="w-1/2" />
        </div>
        <SkeletonBox className="h-6 w-16 shrink-0 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 3 }) {
  return (
    <div className="overflow-hidden">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <SkeletonLine className="h-2.5 w-16" />
        <SkeletonLine className="h-2.5 w-16" />
      </div>
      <div className="space-y-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
            <SkeletonLine className="h-3.5 w-1/3" />
            {Array.from({ length: cols - 1 }).map((__, j) => (
              <SkeletonLine key={j} className="h-3 w-16 shrink-0" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonForm({ fields = 6 }) {
  return (
    <div className="max-w-2xl space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <SkeletonLine className="mb-2 h-2.5 w-24" />
          <SkeletonBox className="h-12 w-full" />
        </div>
      ))}
      <SkeletonBox className="h-12 w-32" />
    </div>
  );
}

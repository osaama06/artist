import { Image as ImageKitImage } from "@imagekit/next";

// Wraps @imagekit/next's Image component and falls back to a quiet
// placeholder when an artwork has no cover image yet (e.g. before the
// artist uploads it from the admin dashboard).
export default function ArtworkImage({
  src,
  alt,
  width,
  height,
  className = "",
  transformation,
  priority = false,
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-surface ${className}`}
      >
        <span className="font-label text-[0.65rem] tracking-[0.15em] text-muted">
          الصورة قيد الرفع
        </span>
      </div>
    );
  }

  return (
    <ImageKitImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      transformation={transformation ?? [{ width, height }]}
      priority={priority}
    />
  );
}

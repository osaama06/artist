import Link from "next/link";
import ArtworkImage from "./ArtworkImage";

const STATUS_STYLES = {
  متوفر: "text-gold border-gold/40",
  محجوز: "text-clay border-clay/40",
  مباع: "text-muted border-muted/30",
};

export default function ArtworkCard({ artwork }) {
  return (
    <Link href={`/gallery/${artwork.slug}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden bg-surface">
        <ArtworkImage
          src={artwork.cover_image_url}
          alt={artwork.title}
          width={600}
          height={750}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-ink">{artwork.title}</h3>
          <p className="mt-1 font-label text-xs tracking-[0.1em] text-muted">
            {[artwork.medium, artwork.year].filter(Boolean).join(" · ")}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 font-label text-[0.65rem] tracking-[0.1em] ${
            STATUS_STYLES[artwork.sale_status] ?? "border-white/10 text-muted"
          }`}
        >
          {artwork.sale_status}
        </span>
      </div>
    </Link>
  );
}

import { notFound } from "next/navigation";
import { getArtworkBySlug } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import ArtworkImage from "@/components/ArtworkImage";
import InquiryForm from "@/components/InquiryForm";

const STATUS_STYLES = {
  متوفر: "text-gold border-gold/40",
  محجوز: "text-clay border-clay/40",
  مباع: "text-muted border-muted/30",
};

const URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) return {};
  return {
    title: `${artwork.title} | ليالي الدرعية`,
    description: artwork.description ?? undefined,
    openGraph: {
      title: artwork.title,
      description: artwork.description ?? undefined,
      images: artwork.cover_image_url
        ? [`${URL_ENDPOINT}${artwork.cover_image_url}`]
        : undefined,
    },
  };
}

export default async function ArtworkPage({ params }) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) notFound();

  const price = formatPrice(artwork.price);
  const canRequest = artwork.sale_status === "متوفر";

  return (
    <main className="flex-1">
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden bg-surface">
          <ArtworkImage
            src={artwork.cover_image_url}
            alt={artwork.title}
            width={800}
            height={1000}
            priority
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <span
            className={`inline-block rounded-full border px-3 py-1 font-label text-[0.65rem] tracking-[0.1em] ${
              STATUS_STYLES[artwork.sale_status] ?? "border-white/10 text-muted"
            }`}
          >
            {artwork.sale_status}
          </span>

          <h1 className="mb-4 mt-5 text-balance font-display text-3xl leading-tight md:text-4xl">
            {artwork.title}
          </h1>

          <dl className="mb-6 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-white/5 py-6 font-label text-xs tracking-[0.05em]">
            {artwork.medium && (
              <Detail label="الخامة" value={artwork.medium} />
            )}
            {artwork.dimensions && (
              <Detail label="المقاس" value={artwork.dimensions} />
            )}
            {artwork.year && <Detail label="السنة" value={artwork.year} />}
            {artwork.categories?.name && (
              <Detail label="التصنيف" value={artwork.categories.name} />
            )}
            {price && <Detail label="السعر" value={price} />}
          </dl>

          {artwork.description && (
            <p className="mb-8 font-body leading-relaxed text-muted">
              {artwork.description}
            </p>
          )}

          {canRequest ? (
            <details className="group">
              <summary className="inline-block cursor-pointer list-none border border-gold px-6 py-3.5 font-label text-xs tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-bg">
                اطلب هذا العمل
              </summary>
              <div className="mt-6">
                <InquiryForm artworkId={artwork.id} artworkTitle={artwork.title} />
              </div>
            </details>
          ) : (
            <p className="font-label text-xs tracking-[0.1em] text-muted">
              هذا العمل غير متاح للطلب حاليًا.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="mb-1 text-muted">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

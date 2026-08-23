import { getSiteSettings, getExhibitions } from "@/lib/data";
import { formatDateRange } from "@/lib/format";
import ArtworkImage from "@/components/ArtworkImage";

const URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: "نبذة عني | ليالي الدرعية",
    description: settings?.bio?.slice(0, 160) ?? undefined,
    openGraph: {
      title: "نبذة عني",
      description: settings?.bio?.slice(0, 160) ?? undefined,
      images: settings?.profile_image_url
        ? [`${URL_ENDPOINT}${settings.profile_image_url}`]
        : undefined,
    },
  };
}

export default async function AboutPage() {
  const [settings, exhibitions] = await Promise.all([
    getSiteSettings(),
    getExhibitions(),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const pastExhibitions = exhibitions.filter(
    (e) => !e.end_date || e.end_date < today,
  );

  return (
    <main className="flex-1">
      <section className="mx-auto grid max-w-5xl gap-12 px-6 py-16 md:grid-cols-[300px_1fr] md:items-start">
        <div className="aspect-[4/5] overflow-hidden bg-surface">
          <ArtworkImage
            src={settings?.profile_image_url}
            alt="صورة الفنانة"
            width={400}
            height={500}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <p className="mb-4 font-label text-xs tracking-[0.2em] text-gold">
            نبذة عني
          </p>
          <h1 className="mb-6 font-display text-3xl md:text-4xl">الفنانة</h1>
          {settings?.bio ? (
            <p className="whitespace-pre-line font-body leading-relaxed text-muted">
              {settings.bio}
            </p>
          ) : (
            <p className="font-body leading-relaxed text-muted">
              النبذة قيد الإعداد.
            </p>
          )}
        </div>
      </section>

      {pastExhibitions.length > 0 && (
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <h2 className="mb-8 font-display text-2xl">محطات ومعارض سابقة</h2>
            <ul className="space-y-6">
              {pastExhibitions.map((ex) => (
                <li
                  key={ex.id}
                  className="flex flex-col gap-1 border-b border-white/5 pb-6 md:flex-row md:items-baseline md:justify-between"
                >
                  <div>
                    <p className="font-display text-lg text-ink">{ex.title}</p>
                    {ex.location && (
                      <p className="font-body text-sm text-muted">
                        {ex.location}
                      </p>
                    )}
                  </div>
                  <p className="font-label text-xs tracking-[0.1em] text-muted">
                    {formatDateRange(ex.start_date, ex.end_date)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}

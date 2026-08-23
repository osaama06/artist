import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getExhibitions } from "@/lib/data";
import { formatDateRange } from "@/lib/format";
import ArtworkImage from "@/components/ArtworkImage";

export const metadata = {
  title: "المدونة | ليالي الدرعية",
  description: "أخبار ومقالات، ومواعيد المعارض القادمة.",
  openGraph: {
    title: "المدونة",
    description: "أخبار ومقالات، ومواعيد المعارض القادمة.",
  },
};

async function getPublishedPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export default async function BlogPage() {
  const [posts, exhibitions] = await Promise.all([
    getPublishedPosts(),
    getExhibitions(),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = exhibitions.filter((e) => !e.end_date || e.end_date >= today);

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-14 text-center">
        <p className="mb-4 font-label text-xs tracking-[0.2em] text-gold">
          المدونة
        </p>
        <h1 className="font-display text-3xl md:text-4xl">أخبار ومعارض</h1>
      </section>

      {upcoming.length > 0 && (
        <section className="border-t border-white/5 bg-surface/40">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <h2 className="mb-8 font-display text-2xl">معارض قادمة</h2>
            <ul className="grid gap-8 sm:grid-cols-2">
              {upcoming.map((ex) => (
                <li key={ex.id} className="border border-white/5">
                  {ex.poster_url && (
                    <div className="aspect-[16/9] overflow-hidden bg-surface">
                      <ArtworkImage
                        src={ex.poster_url}
                        alt={ex.title}
                        width={700}
                        height={394}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="mb-2 font-display text-lg text-ink">
                      {ex.title}
                    </p>
                    {ex.location && (
                      <p className="mb-1 font-body text-sm text-muted">
                        {ex.location}
                      </p>
                    )}
                    <p className="font-label text-xs tracking-[0.1em] text-gold">
                      {formatDateRange(ex.start_date, ex.end_date)}
                    </p>
                    {ex.description && (
                      <p className="mt-3 font-body text-sm leading-relaxed text-muted">
                        {ex.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-6 py-14">
        {posts.length === 0 ? (
          <p className="py-12 text-center font-body text-muted">
            لا توجد مقالات منشورة بعد.
          </p>
        ) : (
          <ul className="space-y-10">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  {post.cover_image_url && (
                    <div className="mb-4 aspect-[16/9] overflow-hidden bg-surface">
                      <ArtworkImage
                        src={post.cover_image_url}
                        alt={post.title}
                        width={800}
                        height={450}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="font-display text-xl text-ink group-hover:text-gold">
                    {post.title}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

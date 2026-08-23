import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeDecodeSlug } from "@/lib/data";
import ArtworkImage from "@/components/ArtworkImage";

const URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | ليالي الدرعية`,
    openGraph: {
      title: post.title,
      type: "article",
      images: post.cover_image_url ? [`${URL_ENDPOINT}${post.cover_image_url}`] : undefined,
    },
  };
}

async function getPost(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .eq("slug", safeDecodeSlug(slug))
    .maybeSingle();

  if (error) throw error;
  return data;
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <main className="flex-1">
      <article className="mx-auto max-w-3xl px-6 py-16">
        {post.cover_image_url && (
          <div className="mb-8 aspect-[16/9] overflow-hidden bg-surface">
            <ArtworkImage
              src={post.cover_image_url}
              alt={post.title}
              width={900}
              height={506}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <h1 className="mb-8 text-balance font-display text-3xl leading-tight md:text-4xl">
          {post.title}
        </h1>
        <div className="whitespace-pre-line font-body leading-relaxed text-muted">
          {post.content}
        </div>
      </article>
    </main>
  );
}

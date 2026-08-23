import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const supabase = await createClient();

  const [{ data: artworks }, { data: posts }] = await Promise.all([
    supabase.from("artworks").select("slug, updated_at").eq("is_published", true),
    supabase.from("blog_posts").select("slug, updated_at").eq("is_published", true),
  ]);

  const staticRoutes = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/gallery", changeFrequency: "weekly", priority: 0.9 },
    { path: "/about", changeFrequency: "monthly", priority: 0.6 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
  ].map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const artworkRoutes = (artworks ?? []).map((a) => ({
    url: `${SITE_URL}/gallery/${a.slug}`,
    lastModified: a.updated_at ? new Date(a.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postRoutes = (posts ?? []).map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...artworkRoutes, ...postRoutes];
}

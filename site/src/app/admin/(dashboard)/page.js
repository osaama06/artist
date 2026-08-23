import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "لوحة التحكم" };

async function getCounts() {
  const supabase = await createClient();

  const [artworks, newInquiries, posts, exhibitions] = await Promise.all([
    supabase.from("artworks").select("id", { count: "exact", head: true }),
    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "جديد"),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("exhibitions").select("id", { count: "exact", head: true }),
  ]);

  return {
    artworks: artworks.count ?? 0,
    newInquiries: newInquiries.count ?? 0,
    posts: posts.count ?? 0,
    exhibitions: exhibitions.count ?? 0,
  };
}

export default async function AdminHomePage() {
  const counts = await getCounts();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">نظرة عامة</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="الأعمال الفنية"
          value={counts.artworks}
          href="/admin/artworks"
          cta="إدارة الأعمال"
        />
        <StatCard
          label="استفسارات جديدة"
          value={counts.newInquiries}
          href="/admin/inquiries"
          cta="عرض الصندوق"
          highlight={counts.newInquiries > 0}
        />
        <StatCard
          label="مقالات المدونة"
          value={counts.posts}
          href="/admin/blog"
          cta="إدارة المدونة"
        />
        <StatCard
          label="المعارض"
          value={counts.exhibitions}
          href="/admin/exhibitions"
          cta="إدارة المعارض"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, href, cta, highlight }) {
  return (
    <div className="border border-white/10 p-6">
      <p className="mb-2 font-label text-xs tracking-[0.1em] text-muted">
        {label}
      </p>
      <p
        className={`mb-4 font-display text-4xl ${highlight ? "text-gold" : "text-ink"}`}
      >
        {value}
      </p>
      <Link
        href={href}
        className="font-label text-xs tracking-[0.1em] text-gold hover:underline"
      >
        {cta} ←
      </Link>
    </div>
  );
}

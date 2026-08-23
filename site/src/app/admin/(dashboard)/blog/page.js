import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "@/components/admin/DeleteButton";
import { deletePost } from "./actions";

export const metadata = { title: "المدونة | لوحة التحكم" };

async function getAllPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export default async function AdminBlogPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl">المدونة</h1>
        <Link
          href="/admin/blog/new"
          className="border border-gold px-5 py-2.5 font-label text-xs tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-bg"
        >
          + مقال جديد
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="font-body text-muted">لا توجد مقالات بعد.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-right">
            <thead>
              <tr className="border-b border-white/10 font-label text-xs tracking-[0.1em] text-muted">
                <th className="py-3 pr-2 font-normal">العنوان</th>
                <th className="py-3 font-normal">منشور</th>
                <th className="py-3 font-normal" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-white/5">
                  <td className="py-3 pr-2 font-body text-ink">{post.title}</td>
                  <td className="py-3 font-body text-sm text-muted">
                    {post.is_published ? "✓" : "—"}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="font-label text-xs tracking-[0.1em] text-gold hover:underline"
                      >
                        تعديل
                      </Link>
                      <DeleteButton
                        action={deletePost.bind(null, post.id)}
                        confirmMessage={`حذف "${post.title}"؟ لا يمكن التراجع.`}
                      >
                        حذف
                      </DeleteButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

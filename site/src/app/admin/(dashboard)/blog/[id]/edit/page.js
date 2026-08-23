import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { updatePost } from "../../actions";

export const metadata = { title: "تعديل مقال | لوحة التحكم" };

export default async function EditPostPage({ params }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">تعديل: {post.title}</h1>
      <BlogPostForm action={updatePost.bind(null, id)} post={post} />
    </div>
  );
}

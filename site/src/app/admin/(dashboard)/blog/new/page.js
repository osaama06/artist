import BlogPostForm from "@/components/admin/BlogPostForm";
import { createPost } from "../actions";

export const metadata = { title: "مقال جديد | لوحة التحكم" };

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">مقال جديد</h1>
      <BlogPostForm action={createPost} />
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAuth(supabase) {
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { status: "error", message: "الجلسة منتهية، سجّلي الدخول من جديد." };
  }
  return null;
}

function readPostForm(formData) {
  return {
    title: formData.get("title")?.toString().trim(),
    slug: formData.get("slug")?.toString().trim(),
    content: formData.get("content")?.toString().trim() || null,
    cover_image_url: formData.get("cover_image_url")?.toString() || null,
    is_published: formData.get("is_published") === "on",
  };
}

function friendlyError(error) {
  if (error.code === "23505") return "الرابط (slug) مستخدم من قبل، اختاري غيره.";
  return "تعذّر الحفظ، حاولي مرة أخرى.";
}

export async function createPost(prevState, formData) {
  const supabase = await createClient();
  const authError = await requireAuth(supabase);
  if (authError) return authError;

  const values = readPostForm(formData);
  if (!values.title || !values.slug) {
    return { status: "error", message: "العنوان والرابط (slug) مطلوبان." };
  }

  const { error } = await supabase.from("blog_posts").insert({
    ...values,
    published_at: values.is_published ? new Date().toISOString() : null,
  });
  if (error) return { status: "error", message: friendlyError(error) };

  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function updatePost(id, prevState, formData) {
  const supabase = await createClient();
  const authError = await requireAuth(supabase);
  if (authError) return authError;

  const values = readPostForm(formData);
  if (!values.title || !values.slug) {
    return { status: "error", message: "العنوان والرابط (slug) مطلوبان." };
  }

  // Only stamp published_at the first time a post goes live — republishing
  // later shouldn't reset its original publish date.
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("published_at")
    .eq("id", id)
    .maybeSingle();

  const payload = { ...values };
  if (values.is_published && !existing?.published_at) {
    payload.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
  if (error) return { status: "error", message: friendlyError(error) };

  revalidatePath("/blog");
  revalidatePath(`/blog/${values.slug}`);
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function deletePost(id) {
  const supabase = await createClient();
  const authError = await requireAuth(supabase);
  if (authError) return;

  await supabase.from("blog_posts").delete().eq("id", id);

  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/admin/blog");
}

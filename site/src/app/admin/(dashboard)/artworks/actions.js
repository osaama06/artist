"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Defense in depth: proxy.js + the dashboard layout already gate this route,
// but every Server Function re-checks auth itself (see the Data Security
// guide referenced from node_modules/next/dist/docs proxy.md).
async function requireAuth(supabase) {
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { status: "error", message: "الجلسة منتهية، سجّلي الدخول من جديد." };
  }
  return null;
}

function readArtworkForm(formData) {
  const num = (v) => (v === "" || v === null || v === undefined ? null : Number(v));
  return {
    title: formData.get("title")?.toString().trim(),
    slug: formData.get("slug")?.toString().trim(),
    description: formData.get("description")?.toString().trim() || null,
    category_id: formData.get("category_id")?.toString() || null,
    medium: formData.get("medium")?.toString().trim() || null,
    dimensions: formData.get("dimensions")?.toString().trim() || null,
    year: num(formData.get("year")),
    sale_status: formData.get("sale_status")?.toString() || "متوفر",
    price: num(formData.get("price")),
    cover_image_url: formData.get("cover_image_url")?.toString() || null,
    is_featured: formData.get("is_featured") === "on",
    is_published: formData.get("is_published") === "on",
    display_order: num(formData.get("display_order")) ?? 0,
  };
}

function friendlyError(error) {
  if (error.code === "23505") return "الرابط (slug) مستخدم من قبل، اختاري غيره.";
  return "تعذّر الحفظ، حاولي مرة أخرى.";
}

export async function createArtwork(prevState, formData) {
  const supabase = await createClient();
  const authError = await requireAuth(supabase);
  if (authError) return authError;

  const values = readArtworkForm(formData);
  if (!values.title || !values.slug) {
    return { status: "error", message: "العنوان والرابط (slug) مطلوبان." };
  }

  const { error } = await supabase.from("artworks").insert(values);
  if (error) return { status: "error", message: friendlyError(error) };

  revalidatePath("/gallery");
  revalidatePath("/");
  redirect("/admin/artworks");
}

export async function updateArtwork(id, prevState, formData) {
  const supabase = await createClient();
  const authError = await requireAuth(supabase);
  if (authError) return authError;

  const values = readArtworkForm(formData);
  if (!values.title || !values.slug) {
    return { status: "error", message: "العنوان والرابط (slug) مطلوبان." };
  }

  const { error } = await supabase.from("artworks").update(values).eq("id", id);
  if (error) return { status: "error", message: friendlyError(error) };

  revalidatePath("/gallery");
  revalidatePath(`/gallery/${values.slug}`);
  revalidatePath("/");
  redirect("/admin/artworks");
}

export async function deleteArtwork(id) {
  const supabase = await createClient();
  const authError = await requireAuth(supabase);
  if (authError) return;

  await supabase.from("artworks").delete().eq("id", id);

  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/admin/artworks");
}

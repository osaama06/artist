"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAuth(supabase) {
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { status: "error", message: "الجلسة منتهية، سجّلي الدخول من جديد." };
  }
  return null;
}

export async function addCategory(prevState, formData) {
  const supabase = await createClient();
  const authError = await requireAuth(supabase);
  if (authError) return authError;

  const name = formData.get("name")?.toString().trim();
  if (!name) {
    return { status: "error", message: "اكتبي اسم التصنيف." };
  }

  const { error } = await supabase.from("categories").insert({ name });
  if (error) {
    return {
      status: "error",
      message:
        error.code === "23505" ? "هذا التصنيف موجود مسبقًا." : "تعذّر الإضافة، حاولي مرة أخرى.",
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
  return { status: "success", message: "تمت الإضافة." };
}

export async function deleteCategory(id) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return;

  // Linked artworks just lose this category (category_id → null via the FK's
  // on delete set null) — they are never deleted.
  await supabase.from("categories").delete().eq("id", id);

  revalidatePath("/admin/categories");
  revalidatePath("/admin/artworks");
  revalidatePath("/gallery");
}

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

function readExhibitionForm(formData) {
  return {
    title: formData.get("title")?.toString().trim(),
    location: formData.get("location")?.toString().trim() || null,
    start_date: formData.get("start_date")?.toString() || null,
    end_date: formData.get("end_date")?.toString() || null,
    poster_url: formData.get("poster_url")?.toString() || null,
    description: formData.get("description")?.toString().trim() || null,
    is_published: formData.get("is_published") === "on",
  };
}

export async function createExhibition(prevState, formData) {
  const supabase = await createClient();
  const authError = await requireAuth(supabase);
  if (authError) return authError;

  const values = readExhibitionForm(formData);
  if (!values.title) {
    return { status: "error", message: "العنوان مطلوب." };
  }

  const { error } = await supabase.from("exhibitions").insert(values);
  if (error) return { status: "error", message: "تعذّر الحفظ، حاولي مرة أخرى." };

  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/exhibitions");
}

export async function updateExhibition(id, prevState, formData) {
  const supabase = await createClient();
  const authError = await requireAuth(supabase);
  if (authError) return authError;

  const values = readExhibitionForm(formData);
  if (!values.title) {
    return { status: "error", message: "العنوان مطلوب." };
  }

  const { error } = await supabase.from("exhibitions").update(values).eq("id", id);
  if (error) return { status: "error", message: "تعذّر الحفظ، حاولي مرة أخرى." };

  revalidatePath("/blog");
  revalidatePath("/about");
  revalidatePath("/");
  redirect("/admin/exhibitions");
}

export async function deleteExhibition(id) {
  const supabase = await createClient();
  const authError = await requireAuth(supabase);
  if (authError) return;

  await supabase.from("exhibitions").delete().eq("id", id);

  revalidatePath("/blog");
  revalidatePath("/about");
  revalidatePath("/");
  revalidatePath("/admin/exhibitions");
}

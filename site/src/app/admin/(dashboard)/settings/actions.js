"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSettings(prevState, formData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { status: "error", message: "الجلسة منتهية، سجّلي الدخول من جديد." };
  }

  const bio = formData.get("bio")?.toString().trim() || null;
  const profile_image_url =
    formData.get("profile_image_url")?.toString() || null;
  const social_links = {
    instagram: formData.get("instagram")?.toString().trim() || null,
    twitter: formData.get("twitter")?.toString().trim() || null,
    whatsapp: formData.get("whatsapp")?.toString().trim() || null,
  };

  const { error } = await supabase
    .from("site_settings")
    .update({ bio, profile_image_url, social_links })
    .eq("id", 1);

  if (error) {
    return { status: "error", message: "تعذّر الحفظ، حاولي مرة أخرى." };
  }

  revalidatePath("/about");
  revalidatePath("/admin/settings");
  return { status: "success", message: "تم الحفظ." };
}

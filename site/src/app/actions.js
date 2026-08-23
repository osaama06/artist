"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitInquiry(prevState, formData) {
  const name = formData.get("name")?.toString().trim();
  const contact = formData.get("contact")?.toString().trim();
  const message = formData.get("message")?.toString().trim() || null;
  const artworkId = formData.get("artworkId")?.toString() || null;
  const inquiryType = formData.get("inquiryType")?.toString() || "تواصل عام";

  if (!name || !contact) {
    return {
      status: "error",
      message: "الاسم ووسيلة التواصل (بريد أو جوال) مطلوبة.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    name,
    contact,
    message,
    artwork_id: artworkId,
    inquiry_type: inquiryType,
  });

  if (error) {
    return {
      status: "error",
      message: "تعذّر إرسال الرسالة، حاولي مرة أخرى بعد قليل.",
    };
  }

  return {
    status: "success",
    message: "تم استلام رسالتك، سنتواصل معك قريبًا.",
  };
}

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExhibitionForm from "@/components/admin/ExhibitionForm";
import { updateExhibition } from "../../actions";

export const metadata = { title: "تعديل معرض | لوحة التحكم" };

export default async function EditExhibitionPage({ params }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: exhibition } = await supabase
    .from("exhibitions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!exhibition) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">تعديل: {exhibition.title}</h1>
      <ExhibitionForm action={updateExhibition.bind(null, id)} exhibition={exhibition} />
    </div>
  );
}

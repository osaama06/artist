import { createClient } from "@/lib/supabase/server";
import ArtworkForm from "@/components/admin/ArtworkForm";
import { createArtwork } from "../actions";

export const metadata = { title: "عمل جديد | لوحة التحكم" };

async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export default async function NewArtworkPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">عمل فني جديد</h1>
      <ArtworkForm action={createArtwork} categories={categories} />
    </div>
  );
}

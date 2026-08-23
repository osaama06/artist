import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArtworkForm from "@/components/admin/ArtworkForm";
import { updateArtwork } from "../../actions";

export const metadata = { title: "تعديل عمل | لوحة التحكم" };

async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export default async function EditArtworkPage({ params }) {
  const { id } = await params;

  const supabase = await createClient();
  const [{ data: artwork }, categories] = await Promise.all([
    supabase.from("artworks").select("*").eq("id", id).maybeSingle(),
    getCategories(),
  ]);

  if (!artwork) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">تعديل: {artwork.title}</h1>
      <ArtworkForm
        action={updateArtwork.bind(null, id)}
        artwork={artwork}
        categories={categories}
      />
    </div>
  );
}

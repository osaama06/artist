import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteArtwork } from "./actions";

export const metadata = { title: "الأعمال الفنية | لوحة التحكم" };

async function getAllArtworks() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("*, categories(name)")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export default async function AdminArtworksPage() {
  const artworks = await getAllArtworks();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl">الأعمال الفنية</h1>
        <Link
          href="/admin/artworks/new"
          className="border border-gold px-5 py-2.5 font-label text-xs tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-bg"
        >
          + عمل جديد
        </Link>
      </div>

      {artworks.length === 0 ? (
        <p className="font-body text-muted">لا توجد أعمال بعد.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-right">
            <thead>
              <tr className="border-b border-white/10 font-label text-xs tracking-[0.1em] text-muted">
                <th className="py-3 pr-2 font-normal">العنوان</th>
                <th className="py-3 font-normal">التصنيف</th>
                <th className="py-3 font-normal">حالة البيع</th>
                <th className="py-3 font-normal">منشور</th>
                <th className="py-3 font-normal">مميز</th>
                <th className="py-3 font-normal" />
              </tr>
            </thead>
            <tbody>
              {artworks.map((art) => (
                <tr key={art.id} className="border-b border-white/5">
                  <td className="py-3 pr-2 font-body text-ink">{art.title}</td>
                  <td className="py-3 font-body text-sm text-muted">
                    {art.categories?.name ?? "—"}
                  </td>
                  <td className="py-3 font-body text-sm text-muted">
                    {art.sale_status}
                  </td>
                  <td className="py-3 font-body text-sm text-muted">
                    {art.is_published ? "✓" : "—"}
                  </td>
                  <td className="py-3 font-body text-sm text-muted">
                    {art.is_featured ? "✓" : "—"}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/artworks/${art.id}/edit`}
                        className="font-label text-xs tracking-[0.1em] text-gold hover:underline"
                      >
                        تعديل
                      </Link>
                      <DeleteButton
                        action={deleteArtwork.bind(null, art.id)}
                        confirmMessage={`حذف "${art.title}"؟ لا يمكن التراجع.`}
                      >
                        حذف
                      </DeleteButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

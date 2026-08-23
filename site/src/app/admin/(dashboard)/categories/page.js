import { createClient } from "@/lib/supabase/server";
import DeleteButton from "@/components/admin/DeleteButton";
import AddCategoryForm from "@/components/admin/AddCategoryForm";
import { addCategory, deleteCategory } from "./actions";

export const metadata = { title: "التصنيفات | لوحة التحكم" };

async function getCategoriesWithCounts() {
  const supabase = await createClient();
  const [{ data: categories, error }, { data: artworks }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("artworks").select("category_id"),
  ]);
  if (error) throw error;

  const counts = new Map();
  for (const row of artworks ?? []) {
    if (row.category_id) counts.set(row.category_id, (counts.get(row.category_id) ?? 0) + 1);
  }

  return (categories ?? []).map((c) => ({ ...c, count: counts.get(c.id) ?? 0 }));
}

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl">التصنيفات</h1>
      <p className="mb-8 font-body text-sm text-muted">
        التصنيفات اللي تظهر كفلاتر بصفحة المعرض. حذف تصنيف ما يحذف الأعمال المرتبطة فيه — بس تصير
        بدون تصنيف.
      </p>

      <div className="mb-10 max-w-sm">
        <AddCategoryForm action={addCategory} />
      </div>

      {categories.length === 0 ? (
        <p className="font-body text-muted">لا توجد تصنيفات بعد.</p>
      ) : (
        <ul className="max-w-md divide-y divide-white/5 border-y border-white/5">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="font-body text-ink">{c.name}</span>
                <span className="font-label text-xs tracking-[0.05em] text-muted">
                  {c.count} {c.count === 1 ? "عمل" : "أعمال"}
                </span>
              </div>
              <DeleteButton
                action={deleteCategory.bind(null, c.id)}
                confirmMessage={
                  c.count > 0
                    ? `حذف "${c.name}"؟ ${c.count} ${c.count === 1 ? "عمل" : "أعمال"} مرتبط فيه بيصير بدون تصنيف (ما ينحذف).`
                    : `حذف "${c.name}"؟`
                }
              >
                حذف
              </DeleteButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

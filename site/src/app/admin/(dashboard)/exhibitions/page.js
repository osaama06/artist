import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "@/components/admin/DeleteButton";
import { formatDateRange } from "@/lib/format";
import { deleteExhibition } from "./actions";

export const metadata = { title: "المعارض | لوحة التحكم" };

async function getAllExhibitions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exhibitions")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export default async function AdminExhibitionsPage() {
  const exhibitions = await getAllExhibitions();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl">المعارض</h1>
        <Link
          href="/admin/exhibitions/new"
          className="border border-gold px-5 py-2.5 font-label text-xs tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-bg"
        >
          + معرض جديد
        </Link>
      </div>

      {exhibitions.length === 0 ? (
        <p className="font-body text-muted">لا توجد معارض بعد.</p>
      ) : (
        <ul className="max-w-2xl divide-y divide-white/5 border-y border-white/5">
          {exhibitions.map((ex) => (
            <li key={ex.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-display text-lg text-ink">{ex.title}</p>
                <p className="font-label text-xs tracking-[0.05em] text-muted">
                  {[ex.location, formatDateRange(ex.start_date, ex.end_date)]
                    .filter(Boolean)
                    .join(" · ")}
                  {!ex.is_published && " · مسودة"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href={`/admin/exhibitions/${ex.id}/edit`}
                  className="font-label text-xs tracking-[0.1em] text-gold hover:underline"
                >
                  تعديل
                </Link>
                <DeleteButton
                  action={deleteExhibition.bind(null, ex.id)}
                  confirmMessage={`حذف "${ex.title}"؟ لا يمكن التراجع.`}
                >
                  حذف
                </DeleteButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

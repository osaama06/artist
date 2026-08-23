import { createClient } from "@/lib/supabase/server";
import { markInquiryStatus } from "./actions";

export const metadata = { title: "الاستفسارات | لوحة التحكم" };

async function getInquiries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*, artworks(title)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">الاستفسارات</h1>

      {inquiries.length === 0 ? (
        <p className="font-body text-muted">لا توجد استفسارات بعد.</p>
      ) : (
        <ul className="space-y-4">
          {inquiries.map((inq) => {
            const isNew = inq.status === "جديد";
            return (
              <li
                key={inq.id}
                className={`border p-5 ${isNew ? "border-gold/40" : "border-white/10"}`}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-lg text-ink">{inq.name}</span>
                    <span
                      className={`rounded-full border px-3 py-1 font-label text-[0.65rem] tracking-[0.1em] ${
                        isNew ? "border-gold/40 text-gold" : "border-white/10 text-muted"
                      }`}
                    >
                      {inq.status}
                    </span>
                    <span className="font-label text-[0.65rem] tracking-[0.1em] text-muted">
                      {inq.inquiry_type}
                    </span>
                  </div>
                  <span className="font-label text-[0.65rem] tracking-[0.1em] text-muted">
                    {formatDateTime(inq.created_at)}
                  </span>
                </div>

                <p className="mb-1 font-body text-sm text-muted">{inq.contact}</p>

                {inq.artworks?.title && (
                  <p className="mb-2 font-label text-xs tracking-[0.1em] text-gold">
                    بخصوص: {inq.artworks.title}
                  </p>
                )}

                {inq.message && (
                  <p className="mb-4 font-body text-sm leading-relaxed text-ink">
                    {inq.message}
                  </p>
                )}

                <form
                  action={markInquiryStatus.bind(
                    null,
                    inq.id,
                    isNew ? "تم الرد" : "جديد",
                  )}
                >
                  <button
                    type="submit"
                    className="font-label text-xs tracking-[0.1em] text-gold hover:underline"
                  >
                    {isNew ? "تعليم كـ«تم الرد»" : "إعادة إلى «جديد»"}
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

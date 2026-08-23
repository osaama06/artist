"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import ImageUploader from "./ImageUploader";

const initialState = { status: "idle", message: "" };
const STATUSES = ["متوفر", "محجوز", "مباع", "غير معروض"];

export default function ArtworkForm({ action, artwork, categories = [] }) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <Field label="العنوان" name="title" defaultValue={artwork?.title} required />
      <Field
        label="الرابط (slug) — بالإنجليزي وبدون مسافات"
        name="slug"
        defaultValue={artwork?.slug}
        required
        pattern="[a-z0-9]+(-[a-z0-9]+)*"
        title="حروف إنجليزية صغيرة وأرقام وشرطات فقط، مثل: sunset-over-diriyah"
        placeholder="sunset-over-diriyah"
      />
      <TextArea label="الوصف" name="description" defaultValue={artwork?.description} />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-label text-xs tracking-[0.1em] text-muted">التصنيف</span>
          <Link
            href="/admin/categories"
            className="font-label text-[0.65rem] tracking-[0.08em] text-gold hover:underline"
          >
            إدارة التصنيفات
          </Link>
        </div>
        <select
          name="category_id"
          defaultValue={artwork?.category_id ?? ""}
          className="w-full border border-white/10 bg-transparent px-4 py-3 font-body text-ink outline-none transition-colors focus:border-gold"
        >
          <option value="" className="bg-surface">
            بدون تصنيف
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id} className="bg-surface">
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="الخامة" name="medium" defaultValue={artwork?.medium} placeholder="ألوان زيتية…" />
        <Field label="المقاس" name="dimensions" defaultValue={artwork?.dimensions} placeholder="80×100 سم" />
        <Field label="السنة" name="year" type="number" defaultValue={artwork?.year} />
        <Field label="السعر (اختياري)" name="price" type="number" step="0.01" defaultValue={artwork?.price} />
        <Field label="ترتيب العرض" name="display_order" type="number" defaultValue={artwork?.display_order ?? 0} />
      </div>

      <label className="block">
        <span className="mb-2 block font-label text-xs tracking-[0.1em] text-muted">
          حالة البيع
        </span>
        <select
          name="sale_status"
          defaultValue={artwork?.sale_status ?? "متوفر"}
          className="w-full border border-white/10 bg-transparent px-4 py-3 font-body text-ink outline-none transition-colors focus:border-gold"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} className="bg-surface">
              {s}
            </option>
          ))}
        </select>
      </label>

      <ImageUploader
        name="cover_image_url"
        label="صورة الغلاف"
        defaultValue={artwork?.cover_image_url}
        onUploadingChange={setIsUploading}
      />

      <div className="flex gap-8">
        <Checkbox
          label="منشور (يظهر للزوار)"
          name="is_published"
          defaultChecked={artwork?.is_published ?? true}
        />
        <Checkbox
          label="عمل مميز (يظهر بالرئيسية)"
          name="is_featured"
          defaultChecked={artwork?.is_featured ?? false}
        />
      </div>

      <button
        type="submit"
        disabled={isPending || isUploading}
        className="border border-gold px-6 py-3.5 font-label text-xs tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-bg disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? "بانتظار اكتمال رفع الصورة…" : isPending ? "جارٍ الحفظ…" : "حفظ"}
      </button>

      {state.status === "error" && (
        <p aria-live="polite" className="font-body text-sm text-clay">
          {state.message}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
  step,
  pattern,
  title,
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-label text-xs tracking-[0.1em] text-muted">
        {label}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        step={step}
        pattern={pattern}
        title={title}
        dir={pattern ? "ltr" : undefined}
        className="w-full border border-white/10 bg-transparent px-4 py-3 font-body text-ink outline-none transition-colors focus:border-gold"
      />
    </label>
  );
}

function TextArea({ label, name, defaultValue }) {
  return (
    <label className="block">
      <span className="mb-2 block font-label text-xs tracking-[0.1em] text-muted">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={4}
        className="w-full border border-white/10 bg-transparent px-4 py-3 font-body text-ink outline-none transition-colors focus:border-gold"
      />
    </label>
  );
}

function Checkbox({ label, name, defaultChecked }) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-gold"
      />
      <span className="font-label text-xs tracking-[0.1em] text-muted">{label}</span>
    </label>
  );
}

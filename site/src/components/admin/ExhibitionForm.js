"use client";

import { useActionState, useState } from "react";
import ImageUploader from "./ImageUploader";

const initialState = { status: "idle", message: "" };

export default function ExhibitionForm({ action, exhibition }) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <Field label="عنوان المعرض" name="title" defaultValue={exhibition?.title} required />
      <Field label="المكان" name="location" defaultValue={exhibition?.location} placeholder="الدرعية، الرياض" />

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="تاريخ البداية"
          name="start_date"
          type="date"
          defaultValue={exhibition?.start_date}
        />
        <Field
          label="تاريخ النهاية"
          name="end_date"
          type="date"
          defaultValue={exhibition?.end_date}
        />
      </div>

      <ImageUploader
        name="poster_url"
        label="بوستر المعرض"
        defaultValue={exhibition?.poster_url}
        onUploadingChange={setIsUploading}
      />

      <label className="block">
        <span className="mb-2 block font-label text-xs tracking-[0.1em] text-muted">
          الوصف
        </span>
        <textarea
          name="description"
          defaultValue={exhibition?.description ?? ""}
          rows={4}
          className="w-full border border-white/10 bg-transparent px-4 py-3 font-body text-ink outline-none transition-colors focus:border-gold"
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={exhibition?.is_published ?? true}
          className="h-4 w-4 accent-gold"
        />
        <span className="font-label text-xs tracking-[0.1em] text-muted">
          منشور (يظهر للزوار)
        </span>
      </label>

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

function Field({ label, name, type = "text", defaultValue, required, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block font-label text-xs tracking-[0.1em] text-muted">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className="w-full border border-white/10 bg-transparent px-4 py-3 font-body text-ink outline-none transition-colors focus:border-gold"
      />
    </label>
  );
}

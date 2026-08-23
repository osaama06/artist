"use client";

import { useActionState, useState } from "react";
import ImageUploader from "./ImageUploader";

const initialState = { status: "idle", message: "" };

export default function BlogPostForm({ action, post }) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <Field label="العنوان" name="title" defaultValue={post?.title} required />
      <Field
        label="الرابط (slug) — بالإنجليزي وبدون مسافات"
        name="slug"
        defaultValue={post?.slug}
        required
        pattern="[a-z0-9]+(-[a-z0-9]+)*"
        title="حروف إنجليزية صغيرة وأرقام وشرطات فقط، مثل: my-first-exhibition"
        placeholder="my-first-exhibition"
      />

      <ImageUploader
        name="cover_image_url"
        label="صورة الغلاف"
        defaultValue={post?.cover_image_url}
        onUploadingChange={setIsUploading}
      />

      <label className="block">
        <span className="mb-2 block font-label text-xs tracking-[0.1em] text-muted">
          محتوى المقال
        </span>
        <textarea
          name="content"
          defaultValue={post?.content ?? ""}
          rows={12}
          className="w-full border border-white/10 bg-transparent px-4 py-3 font-body leading-relaxed text-ink outline-none transition-colors focus:border-gold"
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={post?.is_published ?? false}
          className="h-4 w-4 accent-gold"
        />
        <span className="font-label text-xs tracking-[0.1em] text-muted">
          منشور (يظهر للزوار بالمدونة)
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

function Field({ label, name, defaultValue, required, placeholder, pattern, title }) {
  return (
    <label className="block">
      <span className="mb-2 block font-label text-xs tracking-[0.1em] text-muted">{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        pattern={pattern}
        title={title}
        dir={pattern ? "ltr" : undefined}
        className="w-full border border-white/10 bg-transparent px-4 py-3 font-body text-ink outline-none transition-colors focus:border-gold"
      />
    </label>
  );
}

"use client";

import { useActionState, useState } from "react";
import ImageUploader from "./ImageUploader";

const initialState = { status: "idle", message: "" };

export default function SettingsForm({ action, settings }) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [isUploading, setIsUploading] = useState(false);
  const social = settings?.social_links ?? {};

  return (
    <form action={formAction} className="max-w-xl space-y-6">
      <label className="block">
        <span className="mb-2 block font-label text-xs tracking-[0.1em] text-muted">
          نبذة عني
        </span>
        <textarea
          name="bio"
          rows={6}
          defaultValue={settings?.bio ?? ""}
          className="w-full border border-white/10 bg-transparent px-4 py-3 font-body text-ink outline-none transition-colors focus:border-gold"
        />
      </label>

      <ImageUploader
        name="profile_image_url"
        label="الصورة الشخصية"
        defaultValue={settings?.profile_image_url}
        onUploadingChange={setIsUploading}
      />

      <div className="space-y-4">
        <p className="font-label text-xs tracking-[0.1em] text-muted">
          روابط التواصل الاجتماعي
        </p>
        <Field label="Instagram" name="instagram" defaultValue={social.instagram} placeholder="https://instagram.com/…" />
        <Field label="X (Twitter)" name="twitter" defaultValue={social.twitter} placeholder="https://x.com/…" />
        <Field label="WhatsApp" name="whatsapp" defaultValue={social.whatsapp} placeholder="https://wa.me/9665…" />
      </div>

      <button
        type="submit"
        disabled={isPending || isUploading}
        className="border border-gold px-6 py-3.5 font-label text-xs tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-bg disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? "بانتظار اكتمال رفع الصورة…" : isPending ? "جارٍ الحفظ…" : "حفظ"}
      </button>

      {state.status !== "idle" && (
        <p
          aria-live="polite"
          className={`font-body text-sm ${state.status === "success" ? "text-gold" : "text-clay"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

function Field({ label, name, defaultValue, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block font-label text-xs tracking-[0.1em] text-muted">
        {label}
      </span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        dir="ltr"
        className="w-full border border-white/10 bg-transparent px-4 py-3 text-left font-body text-ink outline-none transition-colors focus:border-gold"
      />
    </label>
  );
}

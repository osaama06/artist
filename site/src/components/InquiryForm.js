"use client";

import { useActionState } from "react";
import { submitInquiry } from "@/app/actions";

const initialState = { status: "idle", message: "" };

// Shared form for both "اطلب هذا العمل" (artwork request) and the general
// contact page — same inquiries table, different inquiry_type/artwork_id.
export default function InquiryForm({ artworkId, artworkTitle }) {
  const [state, formAction, isPending] = useActionState(
    submitInquiry,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="artworkId" value={artworkId ?? ""} />
      <input
        type="hidden"
        name="inquiryType"
        value={artworkId ? "طلب عمل" : "تواصل عام"}
      />

      {artworkTitle && (
        <p className="font-label text-xs tracking-[0.1em] text-muted">
          بخصوص العمل: <span className="text-gold">{artworkTitle}</span>
        </p>
      )}

      <Field label="الاسم" name="name" required />
      <Field label="البريد الإلكتروني أو الجوال" name="contact" required />
      <TextArea label="رسالتك" name="message" />

      <button
        type="submit"
        disabled={isPending}
        className="w-full border border-gold px-6 py-3.5 font-label text-xs tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-bg disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "جارٍ الإرسال…" : "إرسال"}
      </button>

      {state.status !== "idle" && (
        <p
          aria-live="polite"
          className={`font-body text-sm ${
            state.status === "success" ? "text-gold" : "text-clay"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

function Field({ label, name, required }) {
  return (
    <label className="block">
      <span className="mb-2 block font-label text-xs tracking-[0.1em] text-muted">
        {label}
      </span>
      <input
        type="text"
        name={name}
        required={required}
        className="w-full border border-white/10 bg-transparent px-4 py-3 font-body text-ink outline-none transition-colors focus:border-gold"
      />
    </label>
  );
}

function TextArea({ label, name }) {
  return (
    <label className="block">
      <span className="mb-2 block font-label text-xs tracking-[0.1em] text-muted">
        {label}
      </span>
      <textarea
        name={name}
        rows={4}
        className="w-full border border-white/10 bg-transparent px-4 py-3 font-body text-ink outline-none transition-colors focus:border-gold"
      />
    </label>
  );
}

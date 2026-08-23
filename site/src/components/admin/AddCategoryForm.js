"use client";

import { useActionState, useEffect, useRef } from "react";

const initialState = { status: "idle", message: "" };

export default function AddCategoryForm({ action }) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const formRef = useRef(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction}>
      <div className="flex items-end gap-3">
        <label className="block flex-1">
          <span className="mb-2 block font-label text-xs tracking-[0.1em] text-muted">
            تصنيف جديد
          </span>
          <input
            type="text"
            name="name"
            required
            placeholder="مثال: بورتريه"
            className="w-full border border-white/10 bg-transparent px-4 py-2.5 font-body text-ink outline-none transition-colors focus:border-gold"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="border border-gold px-5 py-2.5 font-label text-xs tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-bg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "…" : "إضافة"}
        </button>
      </div>
      {state.status === "error" && (
        <p aria-live="polite" className="mt-2 font-body text-sm text-clay">
          {state.message}
        </p>
      )}
    </form>
  );
}

"use client";

// A form-action button with a native confirm() guard. Kept as a tiny client
// component so the surrounding list page can stay a Server Component.
export default function DeleteButton({ action, confirmMessage, children }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage || "متأكدة؟")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="font-label text-xs tracking-[0.1em] text-clay hover:underline"
      >
        {children}
      </button>
    </form>
  );
}

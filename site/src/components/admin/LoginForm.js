"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/login/actions";

const initialState = { status: "idle", message: "" };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="البريد الإلكتروني" name="email" type="email" autoComplete="email" />
      <Field
        label="كلمة المرور"
        name="password"
        type="password"
        autoComplete="current-password"
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full border border-gold px-6 py-3.5 font-label text-xs tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-bg disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "جارٍ الدخول…" : "دخول"}
      </button>

      {state.status === "error" && (
        <p aria-live="polite" className="font-body text-sm text-clay">
          {state.message}
        </p>
      )}
    </form>
  );
}

function Field({ label, name, type, autoComplete }) {
  return (
    <label className="block">
      <span className="mb-2 block font-label text-xs tracking-[0.1em] text-muted">
        {label}
      </span>
      <input
        type={type}
        name={name}
        required
        autoComplete={autoComplete}
        className="w-full border border-white/10 bg-transparent px-4 py-3 font-body text-ink outline-none transition-colors focus:border-gold"
      />
    </label>
  );
}

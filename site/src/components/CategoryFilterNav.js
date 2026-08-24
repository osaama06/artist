"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Client Component on purpose: useSearchParams() resolves *synchronously*
// on client-side navigations (the router already has the URL), so the
// active chip highlights instantly on click — no waiting on the server
// round-trip the artwork grid below still needs.
export default function CategoryFilterNav({ categories }) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <nav className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-6 pb-10">
      <FilterChip href="/gallery" active={!category} label="الكل" />
      {categories.map((c) => (
        <FilterChip
          key={c}
          href={`/gallery?category=${encodeURIComponent(c)}`}
          active={category === c}
          label={c}
        />
      ))}
    </nav>
  );
}

function FilterChip({ href, active, label }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 font-label text-xs tracking-[0.1em] transition-colors ${
        active
          ? "border-gold bg-gold text-bg"
          : "border-white/10 text-muted hover:border-gold/40 hover:text-gold"
      }`}
    >
      {label}
    </Link>
  );
}

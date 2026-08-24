"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SkeletonArtworkCard } from "./Skeleton";

// Owns both the chip row and the grid slot so both react to the SAME
// instant signal. `isPending` from useTransition flips to true
// *synchronously* on click (that's the whole point of the hook) — driving
// the skeleton from it means the grid swaps to loading state on the same
// paint as the click, not whenever the server stream happens to catch up.
// `children` is the server-resolved grid (passed in from the page Server
// Component); it just sits there ready, hidden behind the skeleton until
// isPending clears.
export default function GalleryInteractive({ categories, children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [isPending, startTransition] = useTransition();

  // Stay in sync if the URL changes some other way (back/forward button).
  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  function handleClick(e, href, value) {
    // Let the browser handle modifier-key clicks (new tab, etc.) natively.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setActiveCategory(value);
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <>
      {categories.length > 0 && (
        <nav className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-6 pb-10">
          <FilterChip
            href="/gallery"
            active={!activeCategory}
            label="الكل"
            onClick={(e) => handleClick(e, "/gallery", null)}
          />
          {categories.map((c) => (
            <FilterChip
              key={c}
              href={`/gallery?category=${encodeURIComponent(c)}`}
              active={activeCategory === c}
              label={c}
              onClick={(e) => handleClick(e, `/gallery?category=${encodeURIComponent(c)}`, c)}
            />
          ))}
        </nav>
      )}

      <section className="mx-auto max-w-6xl px-6 pb-24">
        {isPending ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonArtworkCard key={i} />
            ))}
          </div>
        ) : (
          children
        )}
      </section>
    </>
  );
}

function FilterChip({ href, active, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
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

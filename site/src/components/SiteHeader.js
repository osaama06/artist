import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/gallery", label: "المعرض" },
  { href: "/about", label: "نبذة عني" },
  { href: "/blog", label: "المدونة" },
  { href: "/contact", label: "تواصل" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-xl tracking-wide text-ink transition-colors hover:text-gold"
        >
          ليالي الدرعية
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-label text-xs tracking-[0.15em] text-muted transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile nav: simple wrapped list, no JS menu needed for this scope.
            py-3.5 pads each link's tap target close to the 44px minimum —
            the text itself stays small, the hit area doesn't. */}
        <nav className="flex items-center md:hidden">
          {NAV_LINKS.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center px-2 py-3.5 font-label text-[0.65rem] tracking-[0.1em] text-muted transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

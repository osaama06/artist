import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/admin/actions";

const NAV_LINKS = [
  { href: "/admin", label: "نظرة عامة" },
  { href: "/admin/artworks", label: "الأعمال الفنية" },
  { href: "/admin/categories", label: "التصنيفات" },
  { href: "/admin/blog", label: "المدونة" },
  { href: "/admin/exhibitions", label: "المعارض" },
  { href: "/admin/inquiries", label: "الاستفسارات" },
  { href: "/admin/settings", label: "الإعدادات" },
];

// Belt-and-suspenders alongside the /admin/ disallow in robots.js — every
// page under this layout inherits this unless it sets its own `robots`.
export const metadata = { robots: { index: false, follow: false } };

// Defense in depth: proxy.js already redirects unauthenticated visitors,
// but every Server Function must also check auth itself — a matcher change
// could silently drop proxy coverage without this.
export default async function AdminDashboardLayout({ children }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/admin" className="font-display text-lg text-ink">
            لوحة تحكم الفنانة
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-label text-xs tracking-[0.1em] text-muted transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-label text-xs tracking-[0.1em] text-muted hover:text-gold"
              target="_blank"
            >
              عرض الموقع ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="font-label text-xs tracking-[0.1em] text-clay hover:underline"
              >
                خروج
              </button>
            </form>
          </div>
        </div>
        <nav className="flex flex-wrap border-t border-white/5 px-4 py-1 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center px-2 py-3.5 font-label text-[0.7rem] tracking-[0.1em] text-muted hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}

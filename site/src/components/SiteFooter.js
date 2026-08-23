export default function SiteFooter() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-center">
        <p className="font-display text-base text-ink">ليالي الدرعية</p>
        <p className="font-body text-sm text-muted">
          معرض أعمال فنية تشكيلية — لوحات، معارض، وتواصل مباشر
        </p>
        <p className="font-label text-[0.7rem] tracking-[0.1em] text-muted/70">
          © {new Date().getFullYear()} جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}

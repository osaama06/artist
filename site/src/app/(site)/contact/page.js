import InquiryForm from "@/components/InquiryForm";

export const metadata = {
  title: "تواصل | ليالي الدرعية",
  description: "تواصلي معنا لأي استفسار أو طلب.",
  openGraph: {
    title: "تواصل",
    description: "تواصلي معنا لأي استفسار أو طلب.",
  },
};

export default function ContactPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-xl px-6 py-16">
        <p className="mb-4 text-center font-label text-xs tracking-[0.2em] text-gold">
          تواصل
        </p>
        <h1 className="mb-10 text-center font-display text-3xl md:text-4xl">
          راسلينا
        </h1>
        <InquiryForm />
      </section>
    </main>
  );
}

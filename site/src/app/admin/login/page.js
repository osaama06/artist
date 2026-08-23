import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "تسجيل الدخول | لوحة التحكم",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="mb-2 text-center font-label text-xs tracking-[0.2em] text-gold">
          لوحة التحكم
        </p>
        <h1 className="mb-8 text-center font-display text-2xl">
          تسجيل الدخول
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}

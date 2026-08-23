import { Amiri, Tajawal, Cairo } from "next/font/google";
import { ImageKitProvider } from "@imagekit/next";
import "./globals.css";

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["600"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_TITLE = "ليالي الدرعية | معرض أعمال فنية";
const SITE_DESCRIPTION = "معرض أعمال فنية تشكيلية — لوحات، معارض، وتواصل مباشر.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  // Every page already sets its own complete title (e.g. "المعرض | ليالي
  // الدرعية" for public pages, "... | لوحة التحكم" for admin) — no template
  // here, or those would double up ("X | ليالي الدرعية | ليالي الدرعية").
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "ليالي الدرعية",
    locale: "ar_SA",
    type: "website",
  },
  robots: { index: true, follow: true },
};

// Root layout: fonts, RTL, ImageKitProvider only. Public-site chrome
// (header/footer) lives in app/(site)/layout.js; /admin brings its own.
export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${tajawal.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink font-body">
        <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}>
          {children}
        </ImageKitProvider>
      </body>
    </html>
  );
}

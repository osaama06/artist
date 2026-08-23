/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a second `next dev` run concurrently against this same project dir
  // (e.g. from another session's preview) by using a separate build cache —
  // Next.js otherwise refuses a second dev server sharing one `.next` lock.
  distDir: process.env.NEXT_DEV_PREVIEW ? ".next-preview" : ".next",
};

export default nextConfig;

import { getUploadAuthParams } from "@imagekit/next/server";
import { createClient } from "@/lib/supabase/server";

// Signs ImageKit uploads — admin-only. Without the auth check here, any
// visitor could upload files to our ImageKit account using this endpoint.
export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return Response.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });

  return Response.json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
}

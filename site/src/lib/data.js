import { createClient } from "@/lib/supabase/server";

// Thin data-access layer over Supabase for the public site.
// Every function here reads only published rows (enforced again by RLS
// as a second line of defense) and is safe to call from Server Components.

// Next.js's dynamic route params ([slug]) are not reliably decoded for
// non-ASCII (e.g. Arabic) segments in this version — the same request can
// hand generateMetadata a decoded value and the page a still-percent-encoded
// one (confirmed by direct testing: "%D8%A7%D9%84..." vs "المدينه...").
// decodeURIComponent is a safe no-op on an already-decoded string (no `%`
// to unescape), so applying it unconditionally normalizes both cases.
export function safeDecodeSlug(slug) {
  if (!slug) return slug;
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug; // malformed escape sequence — fall back to the raw value
  }
}

export async function getFeaturedArtworks(limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getArtworks({ category } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("artworks")
    .select("*, categories(id, name)")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  if (category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("name", category)
      .maybeSingle();

    // No such category → filter to an id nothing can match, so the result
    // is an empty list instead of silently ignoring the filter.
    query = query.eq("category_id", cat?.id ?? "00000000-0000-0000-0000-000000000000");
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// Only categories with at least one published artwork — an empty filter
// chip that leads to a dead end would be a bad gallery experience.
export async function getArtworkCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("categories(id, name)")
    .eq("is_published", true)
    .not("category_id", "is", null);

  if (error) throw error;
  const seen = new Map();
  for (const row of data ?? []) {
    if (row.categories) seen.set(row.categories.id, row.categories.name);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, "ar"));
}

export async function getArtworkBySlug(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("*, categories(id, name)")
    .eq("is_published", true)
    .eq("slug", safeDecodeSlug(slug))
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getUpcomingExhibition() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exhibitions")
    .select("*")
    .eq("is_published", true)
    .gte("end_date", new Date().toISOString().slice(0, 10))
    .order("start_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getExhibitions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exhibitions")
    .select("*")
    .eq("is_published", true)
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

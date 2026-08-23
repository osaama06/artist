import { createClient } from "@/lib/supabase/server";
import SettingsForm from "@/components/admin/SettingsForm";
import { updateSettings } from "./actions";

export const metadata = { title: "الإعدادات | لوحة التحكم" };

async function getSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">الإعدادات</h1>
      <SettingsForm action={updateSettings} settings={settings} />
    </div>
  );
}

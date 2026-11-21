import { createClient } from "@supabase/supabase-js";

export default async function supabaseCheck(_req: any, res: any) {
  const url = process.env.SUPABASE_URL || "https://vbcwmymamzrnenyilhau.supabase.co";
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_yfFicMi_ZT4a0cJHX6hohQ_joP5PZzE";
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { count, error } = await supabase.from("site_settings").select("key", { count: "exact", head: true });
  if (error) return res.status(502).json({ status: "error", source: "supabase", message: error.message });
  return res.status(200).json({ status: "ok", source: "supabase", siteSettings: count ?? 0 });
}

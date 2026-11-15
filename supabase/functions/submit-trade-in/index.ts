import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const MAX_BODY = 38 * 1024 * 1024;
const MAX_PHOTO = 5 * 1024 * 1024;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const suffixes = [".manus.computer", ".manuspre.computer"];

type Body = { submissionId: string; name: string; phone: string; email?: string; message?: string; consent: boolean; website?: string; brand: string; model: string; year: number; mileageKm: number; fuel: string; condition: string; photos: string[] };
type Photo = { bytes: Uint8Array; contentType: string; extension: string };

function allowed(origin: string | null) {
  if (!origin) return false;
  let url: URL;
  try { url = new URL(origin); } catch { return false; }
  if (url.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(url.hostname)) return false;
  const configured = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map(v => v.trim()).filter(Boolean);
  return configured.length ? configured.includes(origin) : ["localhost", "127.0.0.1"].includes(url.hostname) || suffixes.some(s => url.hostname.endsWith(s));
}
function reply(status: number, body: Record<string, unknown>, origin: string | null) {
  const headers: Record<string, string> = { "Content-Type": "application/json", "Cache-Control": "no-store", Vary: "Origin" };
  if (origin && allowed(origin)) { headers["Access-Control-Allow-Origin"] = origin; headers["Access-Control-Allow-Headers"] = "content-type, apikey"; headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"; }
  return new Response(JSON.stringify(body), { status, headers });
}
function text(value: unknown, min: number, max: number) { if (typeof value !== "string") return null; const v = value.trim(); return v.length >= min && v.length <= max ? v : null; }
function photo(value: unknown): Photo | null {
  if (typeof value !== "string") return null;
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(value);
  if (!match) return null;
  let binary: string; try { binary = atob(match[2]); } catch { return null; }
  if (!binary.length || binary.length > MAX_PHOTO) return null;
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  const jpeg = match[1] === "image/jpeg" && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const png = match[1] === "image/png" && [137,80,78,71,13,10,26,10].every((v,i) => bytes[i] === v);
  const webp = match[1] === "image/webp" && String.fromCharCode(...bytes.slice(0,4)) === "RIFF" && String.fromCharCode(...bytes.slice(8,12)) === "WEBP";
  return jpeg || png || webp ? { bytes, contentType: match[1], extension: match[1] === "image/jpeg" ? "jpg" : match[1].slice(6) } : null;
}
async function hash(value: string, pepper: string) { const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${pepper}:${value}`)); return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join(""); }

Deno.serve(async req => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return allowed(origin) ? reply(200, { ok: true }, origin) : reply(403, { error: "Origin non autorisée." }, origin);
  if (req.method !== "POST") return reply(405, { error: "Méthode non autorisée." }, origin);
  if (!allowed(origin)) return reply(403, { error: "Origin non autorisée." }, origin);
  if (!req.headers.get("apikey")) return reply(401, { error: "Clé API manquante." }, origin);
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return reply(413, { error: "La demande est trop volumineuse." }, origin);
  let body: Body; try { body = await req.json() as Body; } catch { return reply(400, { error: "Corps de requête invalide." }, origin); }
  if (new TextEncoder().encode(JSON.stringify(body)).length > MAX_BODY || !UUID.test(body?.submissionId ?? "")) return reply(400, { error: "Demande invalide." }, origin);
  if (body.website?.trim() || body.consent !== true) return reply(400, { error: "Demande rejetée." }, origin);
  const name = text(body.name, 2, 160), phone = text(body.phone, 7, 50), brand = text(body.brand, 1, 80), model = text(body.model, 1, 120), fuel = text(body.fuel, 1, 40), condition = text(body.condition, 1, 200), message = typeof body.message === "string" ? body.message.trim() : "", email = typeof body.email === "string" ? body.email.trim() : "";
  if (!name || !phone || !brand || !model || !fuel || !condition || message.length > 4000 || email.length > 320 || email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !Number.isInteger(body.year) || body.year < 1950 || body.year > 2100 || !Number.isInteger(body.mileageKm) || body.mileageKm < 0 || body.mileageKm > 2_000_000) return reply(400, { error: "Vérifiez les champs de la demande." }, origin);
  if (!Array.isArray(body.photos) || body.photos.length > 5) return reply(400, { error: "Nombre de photos invalide." }, origin);
  const photos = body.photos.map(photo), valid = photos.every(Boolean) ? photos as Photo[] : [];
  if (valid.length !== body.photos.length || valid.reduce((sum, p) => sum + p.bytes.length, 0) > 25 * 1024 * 1024) return reply(400, { error: "Format ou taille photo invalide." }, origin);
  const url = Deno.env.get("SUPABASE_URL"), key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return reply(503, { error: "Service temporairement indisponible." }, origin);
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const duplicate = await db.from("leads").select("id").eq("submission_id", body.submissionId).maybeSingle();
  if (duplicate.error) return reply(503, { error: "Service temporairement indisponible." }, origin);
  if (duplicate.data) return reply(200, { success: true }, origin);
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = await hash(ip, key.slice(0, 32));
  const since = new Date(Date.now() - 3600000).toISOString();
  const rate = await db.from("leads").select("id", { count: "exact", head: true }).eq("source_ip_hash", ipHash).gte("created_at", since);
  if (rate.error) return reply(503, { error: "Service temporairement indisponible." }, origin);
  if ((rate.count ?? 0) >= 5) return reply(429, { error: "Limite temporaire atteinte." }, origin);
  const inserted = await db.from("leads").insert({ submission_id: body.submissionId, type: "trade_in", name, email: email || null, phone, message, details: { brand, model, year: body.year, mileageKm: body.mileageKm, fuel, condition, consent: true }, photo_paths: [], source_ip_hash: ipHash }).select("id").single();
  if (inserted.error) return reply(inserted.error.code === "23505" ? 200 : 503, inserted.error.code === "23505" ? { success: true } : { error: "La demande n’a pas pu être enregistrée." }, origin);
  const paths: string[] = [];
  for (const [index, item] of valid.entries()) { const path = `trade-ins/${new Date().toISOString().slice(0,10)}/${inserted.data.id}/${crypto.randomUUID()}-${index}.${item.extension}`; const upload = await db.storage.from("trade-in-photos").upload(path, item.bytes, { contentType: item.contentType, upsert: false }); if (upload.error) { await db.from("leads").delete().eq("id", inserted.data.id); if (paths.length) await db.storage.from("trade-in-photos").remove(paths); return reply(503, { error: "Une photo n’a pas pu être stockée." }, origin); } paths.push(path); }
  if (paths.length) await db.from("leads").update({ photo_paths: paths }).eq("id", inserted.data.id);
  return reply(200, { success: true }, origin);
});

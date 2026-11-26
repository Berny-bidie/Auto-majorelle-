import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Database, Json } from "../shared/database.types";
import { SITE_CONTACT, normalizeBrandName } from "../shared/siteData";
import { supabasePublishableKey, supabaseUrl } from "./supabase";
import type { TrpcContext } from "./_core/context";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { isPublicInventorySlug } from "./publicInventory";

const DEFAULT_SETTINGS: Record<string, string> = {
  businessName: SITE_CONTACT.name,
  phone: SITE_CONTACT.phone,
  phoneRaw: SITE_CONTACT.phoneRaw,
  secondaryPhone: SITE_CONTACT.secondaryPhone,
  secondaryPhoneRaw: SITE_CONTACT.secondaryPhoneRaw,
  whatsapp: SITE_CONTACT.whatsapp,
  email: SITE_CONTACT.email,
  address: SITE_CONTACT.address,
  hours: SITE_CONTACT.hours,
  instagramUrl: SITE_CONTACT.instagramUrl,
  facebookUrl: SITE_CONTACT.facebookUrl,
  tiktokUrl: SITE_CONTACT.tiktokUrl,
  financingAnnualRate: "",
  financingRateConfirmed: "false",
  financingRateSource: "",
  internalAddressNote: "Adresse publique communiquée par l’entreprise : utilisez la même adresse sur les pages et les liens d’itinéraire.",
};
const settingPublicKeys = new Set(["businessName", "phone", "phoneRaw", "secondaryPhone", "secondaryPhoneRaw", "whatsapp", "email", "address", "hours", "instagramUrl", "facebookUrl", "tiktokUrl"]);
const vehicleSelect = "id,brand_id,slug,model,year,price_dh,mileage_km,fuel,transmission,power_cv,category,description,equipment,images,availability,published,featured,warranty_note,published_at,created_at,updated_at,brands(name)";

function failDb(error: { code?: string } | null | undefined): never {
  const code = error?.code === "23505" ? "CONFLICT" : error?.code === "23503" || error?.code === "23514" ? "BAD_REQUEST" : error?.code === "42501" ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR";
  const message = code === "CONFLICT" ? "Cette valeur existe déjà." : code === "BAD_REQUEST" ? "Les données ne respectent pas les règles métier." : code === "FORBIDDEN" ? "Opération non autorisée." : "La base de données est temporairement indisponible.";
  throw new TRPCError({ code, message });
}
function stringArray(value: Json | null | undefined): string[] { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; }
function objectValue(value: Json | null | undefined): Record<string, unknown> { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; }

type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"] & { brands?: { name: string } | null };
type BrandRow = Database["public"]["Tables"]["brands"]["Row"];
type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type PartnerRow = Database["public"]["Tables"]["financing_partners"]["Row"];
type PostRow = Database["public"]["Tables"]["blog_posts"]["Row"];

function mapVehicle(row: VehicleRow) {
  return { id: row.id, slug: row.slug, brand: row.brands?.name ?? "", model: row.model, year: row.year, priceDh: row.price_dh, mileageKm: row.mileage_km, fuel: row.fuel, transmission: row.transmission, powerCv: row.power_cv, category: row.category, description: row.description, equipment: stringArray(row.equipment), images: stringArray(row.images), availability: row.availability as "available" | "reserved" | "sold", published: row.published ? 1 : 0, featured: row.featured ? 1 : 0, warrantyNote: row.warranty_note, publishedAt: row.published_at ? new Date(row.published_at) : null, createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at) };
}
function mapPost(row: PostRow) {
  return { id: row.id, slug: row.slug, title: row.title, category: row.category, excerpt: row.excerpt, body: row.body, imageUrl: row.image_url, author: row.author, readingMinutes: row.reading_minutes, sourceDate: row.source_date, status: row.status as "draft" | "published", reviewNotes: row.review_notes, publishedAt: row.published_at ? new Date(row.published_at) : null, createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at) };
}
function mapBrand(row: BrandRow) {
  return { id: row.id, slug: row.slug, name: row.name, logoUrl: row.logo_url, officialUrl: row.official_url ?? "", officialRegion: row.official_region as "Maroc" | "International" | null, description: row.description ?? "", displayOrder: row.display_order, active: row.active };
}
function mapService(row: ServiceRow) {
  return { id: row.id, slug: row.slug, name: row.name, description: row.description, imageUrl: row.image_url, icon: row.icon, ctaLabel: row.cta_label, ctaUrl: row.cta_url, displayOrder: row.display_order, active: row.active, published: row.published };
}
function mapPartner(row: PartnerRow) {
  const terms = objectValue(row.terms);
  return { id: row.id, slug: row.slug, name: row.name, logoUrl: row.logo_url, description: row.description, termsSummary: typeof terms.summary === "string" ? terms.summary : "", annualRate: row.annual_rate, minTermMonths: row.min_term_months, maxTermMonths: row.max_term_months, isConfirmed: row.is_confirmed, published: row.published, displayOrder: row.display_order };
}
async function readSettings(ctx: TrpcContext, includePrivate = false) {
  let query = ctx.supabase.from("site_settings").select("key,value,is_public");
  if (!includePrivate) query = query.eq("is_public", true);
  const { data, error } = await query;
  if (error) failDb(error);
  const values = Object.fromEntries((data ?? []).map(row => [row.key, row.value]));
  const merged = { ...DEFAULT_SETTINGS, ...values };
  merged.businessName = normalizeBrandName(values.businessName);
  const configuredAddress = typeof values.address === "string" ? values.address.trim() : "";
  if (configuredAddress && configuredAddress !== SITE_CONTACT.address && /(?:Alfa\s*2000|Allal El Fassi|Yaakoub El Mansour|Quartier industriel Sidi Ghanem 127)/i.test(configuredAddress)) {
    merged.address = SITE_CONTACT.address;
  }
  const internalAddressNote = typeof values.internalAddressNote === "string" ? values.internalAddressNote : "";
  if (/Adresse relevée sur la fiche Google Maps/i.test(internalAddressNote)) {
    merged.internalAddressNote = DEFAULT_SETTINGS.internalAddressNote;
  }
  if (!includePrivate) {
    delete merged.internalAddressNote;
    const rateConfirmed = values.financingRateConfirmed === "true" && Boolean(values.financingRateSource?.trim()) && Boolean(values.financingAnnualRate?.trim());
    if (!rateConfirmed) {
      delete merged.financingRateConfirmed;
      delete merged.financingRateSource;
      merged.financingAnnualRate = "";
    }
  }
  return merged;
}

const leadBase = { submissionId: z.string().uuid(), name: z.string().trim().min(2).max(160), phone: z.string().trim().min(7).max(50), email: z.string().trim().email().max(320).or(z.literal("")), message: z.string().trim().max(4000).default(""), consent: z.literal(true), website: z.string().max(200).default("") };
function rejectBot(website: string) { if (website.trim()) throw new TRPCError({ code: "BAD_REQUEST", message: "Demande rejetée." }); }
const rateBuckets = new Map<string, number[]>();
function limitPublic(ctx: TrpcContext, type: string, max: number) {
  const forwarded = ctx.req.headers["x-forwarded-for"];
  const ip = ctx.req.ip || (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0]?.trim()) || "unknown";
  const key = `${type}:${ip}`;
  const now = Date.now();
  const recent = (rateBuckets.get(key) ?? []).filter(value => now - value < 60 * 60 * 1000);
  if (recent.length >= max) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Trop de demandes depuis cette connexion. Réessayez plus tard." });
  recent.push(now);
  rateBuckets.set(key, recent);
  if (rateBuckets.size > 5000) for (const [oldKey, values] of rateBuckets) if (!values.some(value => now - value < 60 * 60 * 1000)) rateBuckets.delete(oldKey);
}
function imageBytes(dataUrl: string) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) throw new TRPCError({ code: "BAD_REQUEST", message: "Format d’image non accepté." });
  const contentType = match[1]!;
  const bytes = Buffer.from(match[2]!, "base64");
  if (!bytes.length || bytes.length > 5 * 1024 * 1024) throw new TRPCError({ code: "BAD_REQUEST", message: "Chaque image doit faire 5 Mo maximum." });
  const valid = contentType === "image/jpeg" ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff : contentType === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])) : bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  if (!valid) throw new TRPCError({ code: "BAD_REQUEST", message: "Le contenu du fichier ne correspond pas au format annoncé." });
  return { bytes, contentType, extension: contentType === "image/jpeg" ? "jpg" : contentType.slice("image/".length) };
}
async function uploadPublicImage(ctx: TrpcContext, dataUrl: string, prefix: string) {
  const { bytes, contentType, extension } = imageBytes(dataUrl);
  const path = `${prefix}/${new Date().toISOString().slice(0,10)}/${crypto.randomUUID()}.${extension}`;
  const { error } = await ctx.supabase.storage.from("public-media").upload(path, bytes, { contentType, cacheControl: "31536000", upsert: false });
  if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Le fichier n’a pas pu être stocké." });
  return ctx.supabase.storage.from("public-media").getPublicUrl(path).data.publicUrl;
}
async function findBrand(ctx: TrpcContext, name: string) {
  const { data, error } = await ctx.supabase.from("brands").select("id").eq("name", name).maybeSingle();
  if (error) failDb(error);
  if (!data) throw new TRPCError({ code: "BAD_REQUEST", message: "Ajoutez d’abord cette marque dans l’onglet Marques." });
  return data.id;
}

const vehicleFields = z.object({ slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), brand: z.string().trim().min(1).max(80), model: z.string().trim().min(1).max(120), year: z.number().int().min(1950).max(2100), priceDh: z.number().int().min(0).max(100_000_000), mileageKm: z.number().int().min(0).max(2_000_000), fuel: z.string().trim().min(1).max(40), transmission: z.string().trim().min(1).max(40), powerCv: z.number().int().min(0).max(3000).nullable(), category: z.string().trim().min(1).max(60), description: z.string().trim().min(10).max(10000), equipment: z.array(z.string().trim().min(1).max(100)).max(50), images: z.array(z.string().trim().max(1000)).max(12), availability: z.enum(["available", "reserved", "sold"]), published: z.boolean(), featured: z.boolean(), warrantyNote: z.string().trim().max(300).nullable() });
const postFields = z.object({ slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: z.string().trim().min(4).max(220), category: z.string().trim().min(1).max(80), excerpt: z.string().trim().min(10).max(1000), body: z.string().trim().min(30).max(12000), imageUrl: z.string().trim().max(1000), author: z.string().trim().max(120).nullable(), readingMinutes: z.number().int().min(1).max(120), status: z.enum(["draft", "published"]), reviewNotes: z.string().trim().max(4000).nullable() });
const brandFields = z.object({ slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: z.string().trim().min(1).max(80), logoUrl: z.string().trim().max(1000), officialUrl: z.string().trim().max(500).url().or(z.literal("")), officialRegion: z.enum(["Maroc", "International"]).nullable(), description: z.string().trim().max(1000), displayOrder: z.number().int().min(0).max(10000), active: z.boolean() });
const serviceFields = z.object({ slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: z.string().trim().min(1).max(120), description: z.string().trim().max(4000), imageUrl: z.string().trim().max(1000).nullable(), icon: z.enum(["car-front", "handshake", "search", "wrench", "shield-check", "message-circle"]), ctaLabel: z.string().trim().min(1).max(80), ctaUrl: z.string().trim().min(1).max(300), displayOrder: z.number().int().min(0).max(10000), active: z.boolean(), published: z.boolean() });
const partnerFields = z.object({ slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: z.string().trim().min(1).max(120), logoUrl: z.string().trim().max(1000).nullable(), description: z.string().trim().max(2000), termsSummary: z.string().trim().max(2000), annualRate: z.number().min(0).max(40).nullable(), minTermMonths: z.number().int().min(1).max(120).nullable(), maxTermMonths: z.number().int().min(1).max(120).nullable(), isConfirmed: z.boolean(), published: z.boolean(), displayOrder: z.number().int().min(0).max(10000) });

async function saveLead(ctx: TrpcContext, values: Database["public"]["Tables"]["leads"]["Insert"]) {
  const { error } = await ctx.supabase.from("leads").insert(values);
  if (error?.code === "23505") return { success: true } as const;
  if (error) failDb(error);
  return { success: true } as const;
}

export const automajorelRouter = router({
  site: router({
    settings: publicProcedure.query(({ ctx }) => readSettings(ctx)),
    brands: publicProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("brands").select("id,slug,name,logo_url,official_url,official_region,description,display_order,active,created_at,updated_at").eq("active", true).order("display_order").order("name").limit(100);
      if (error) failDb(error);
      return (data ?? []).map(row => mapBrand(row));
    }),
    services: publicProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("services").select("id,slug,name,description,image_url,icon,cta_label,cta_url,display_order,active,published,created_at,updated_at").eq("active", true).eq("published", true).order("display_order").limit(100);
      if (error) failDb(error);
      return (data ?? []).map(row => mapService(row));
    }),
    financingPartners: publicProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("financing_partners").select("id,slug,name,logo_url,description,terms,annual_rate,min_term_months,max_term_months,is_confirmed,published,display_order,created_at,updated_at").eq("is_confirmed", true).eq("published", true).order("display_order").limit(100);
      if (error) failDb(error);
      return (data ?? []).map(row => mapPartner(row));
    }),
  }),
  inventory: router({
    list: publicProcedure.input(z.object({ search: z.string().trim().max(100).optional(), brand: z.string().trim().max(80).optional(), category: z.string().trim().max(60).optional(), fuel: z.string().trim().max(40).optional(), transmission: z.string().trim().max(40).optional(), yearFrom: z.number().int().optional(), yearTo: z.number().int().optional(), budgetMax: z.number().int().optional(), mileageMax: z.number().int().optional() }).optional()).query(async ({ ctx, input }) => {
      const filters = input ?? {};
      let query = ctx.supabase.from("vehicles").select(vehicleSelect).eq("published", true).eq("availability", "available").order("featured", { ascending: false }).order("created_at", { ascending: false }).limit(100);
      if (filters.brand) {
        const { data: brand, error: brandError } = await ctx.supabase.from("brands").select("id").eq("name", filters.brand).maybeSingle();
        if (brandError) failDb(brandError);
        if (!brand) return [];
        query = query.eq("brand_id", brand.id);
      }
      const { data, error } = await query;
      if (error) failDb(error);
      const search = filters.search?.toLocaleLowerCase("fr");
      return ((data ?? []) as unknown as VehicleRow[]).map(mapVehicle).filter(row => isPublicInventorySlug(row.slug) && (!search || `${row.brand} ${row.model}`.toLocaleLowerCase("fr").includes(search)) && (!filters.category || row.category === filters.category) && (!filters.fuel || row.fuel === filters.fuel) && (!filters.transmission || row.transmission === filters.transmission) && (filters.yearFrom === undefined || row.year >= filters.yearFrom) && (filters.yearTo === undefined || row.year <= filters.yearTo) && (filters.budgetMax === undefined || row.priceDh <= filters.budgetMax) && (filters.mileageMax === undefined || row.mileageKm <= filters.mileageMax));
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(140) })).query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.from("vehicles").select(vehicleSelect).eq("slug", input.slug).eq("published", true).eq("availability", "available").maybeSingle();
      if (error) failDb(error);
      return data && isPublicInventorySlug(data.slug) ? mapVehicle(data as unknown as VehicleRow) : null;
    }),
  }),
  blog: router({
    list: publicProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("blog_posts").select("id,slug,title,category,excerpt,body,image_url,author,reading_minutes,source_date,status,review_notes,published_at,created_at,updated_at").eq("status", "published").order("published_at", { ascending: false }).limit(100);
      if (error) failDb(error);
      return (data ?? []).map(row => mapPost(row));
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(180) })).query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.from("blog_posts").select("id,slug,title,category,excerpt,body,image_url,author,reading_minutes,source_date,status,review_notes,published_at,created_at,updated_at").eq("slug", input.slug).eq("status", "published").maybeSingle();
      if (error) failDb(error);
      return data ? mapPost(data) : null;
    }),
  }),
  leads: router({
    contact: publicProcedure.input(z.object({ ...leadBase, vehicleSlug: z.string().trim().max(140).optional(), kind: z.enum(["contact", "appointment"]).default("contact") })).mutation(async ({ ctx, input }) => {
      rejectBot(input.website); limitPublic(ctx, "contact", 10);
      return saveLead(ctx, { submission_id: input.submissionId, type: input.kind, name: input.name, email: input.email || null, phone: input.phone, vehicle_slug: input.vehicleSlug || null, message: input.message, details: { consent: input.consent } });
    }),
    financing: publicProcedure.input(z.object({ ...leadBase, vehiclePrice: z.number().int().min(0).max(100_000_000), downPayment: z.number().int().min(0).max(100_000_000), termMonths: z.number().int().min(6).max(120), annualRate: z.number().min(0).max(40).nullable() })).mutation(async ({ ctx, input }) => {
      rejectBot(input.website); limitPublic(ctx, "financing", 8);
      return saveLead(ctx, { submission_id: input.submissionId, type: "financing", name: input.name, email: input.email || null, phone: input.phone, message: input.message, details: { vehiclePrice: input.vehiclePrice, downPayment: input.downPayment, termMonths: input.termMonths, annualRate: input.annualRate, consent: input.consent } });
    }),
    tradeIn: publicProcedure.input(z.object({ ...leadBase, brand: z.string().trim().min(1).max(80), model: z.string().trim().min(1).max(120), year: z.number().int().min(1950).max(2100), mileageKm: z.number().int().min(0).max(2_000_000), fuel: z.string().trim().min(1).max(40), condition: z.string().trim().min(1).max(200), photos: z.array(z.string().max(7_100_000)).max(5) })).mutation(async ({ ctx, input }) => {
      rejectBot(input.website);
      const origin = ctx.req.headers.origin;
      if (!origin) throw new TRPCError({ code: "FORBIDDEN", message: "Origine de la demande non vérifiée." });
      const response = await fetch(`${supabaseUrl}/functions/v1/submit-trade-in`, { method: "POST", headers: { apikey: supabasePublishableKey, "Content-Type": "application/json", Origin: origin }, body: JSON.stringify(input) });
      const result = await response.json().catch(() => ({})) as { success?: boolean; error?: string };
      if (!response.ok || !result.success) {
        const code = response.status === 429 ? "TOO_MANY_REQUESTS" : response.status >= 500 ? "SERVICE_UNAVAILABLE" : "BAD_REQUEST";
        throw new TRPCError({ code, message: result.error || "La demande de reprise n’a pas pu être enregistrée." });
      }
      return { success: true } as const;
    }),
  }),
  admin: router({
    stats: adminProcedure.query(async ({ ctx }) => {
      const [vehiclesTotal, vehiclesPublished, leadsTotal, newLeads, postsDraft, postsPublished] = await Promise.all([
        ctx.supabase.from("vehicles").select("id", { count: "exact", head: true }),
        ctx.supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("published", true),
        ctx.supabase.from("leads").select("id", { count: "exact", head: true }),
        ctx.supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
        ctx.supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
        ctx.supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published"),
      ]);
      for (const result of [vehiclesTotal, vehiclesPublished, leadsTotal, newLeads, postsDraft, postsPublished]) if (result.error) failDb(result.error);
      return { vehiclesTotal: vehiclesTotal.count ?? 0, vehiclesPublished: vehiclesPublished.count ?? 0, leadsTotal: leadsTotal.count ?? 0, newLeads: newLeads.count ?? 0, postsDraft: postsDraft.count ?? 0, postsPublished: postsPublished.count ?? 0 };
    }),
    settings: adminProcedure.query(({ ctx }) => readSettings(ctx, true)),
    saveSettings: adminProcedure.input(z.record(z.string(), z.string().trim().max(2000))).mutation(async ({ ctx, input }) => {
      const allowed = new Set(Object.keys(DEFAULT_SETTINGS));
      const rateConfirmed = input.financingRateConfirmed === "true" && Boolean(input.financingRateSource?.trim());
      const rate = input.financingAnnualRate?.trim() ?? "";
      if (rateConfirmed && (!rate || !Number.isFinite(Number(rate)) || Number(rate) < 0 || Number(rate) > 40)) throw new TRPCError({ code: "BAD_REQUEST", message: "Un taux confirmé entre 0 et 40 % et sa source sont requis." });
      const rows = Object.entries(input).filter(([key]) => allowed.has(key)).map(([key, original]) => {
        let value = original;
        if (key === "businessName") value = normalizeBrandName(value);
        if (key === "financingAnnualRate") value = rateConfirmed ? rate : "";
        if (key === "financingRateConfirmed") value = rateConfirmed ? "true" : "false";
        const confirmedRateKeys = ["financingAnnualRate", "financingRateConfirmed", "financingRateSource"];
        const isPublic = settingPublicKeys.has(key) || (rateConfirmed && confirmedRateKeys.includes(key));
        return { key, value, is_public: isPublic };
      });
      const { error } = await ctx.supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) failDb(error);
      return { success: true } as const;
    }),
    vehicles: adminProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("vehicles").select(vehicleSelect).order("created_at", { ascending: false }).limit(500);
      if (error) failDb(error);
      return ((data ?? []) as unknown as VehicleRow[]).map(mapVehicle);
    }),
    createVehicle: adminProcedure.input(vehicleFields).mutation(async ({ ctx, input }) => {
      const brandId = await findBrand(ctx, input.brand);
      const { data, error } = await ctx.supabase.from("vehicles").insert({ brand_id: brandId, slug: input.slug, model: input.model, year: input.year, price_dh: input.priceDh, mileage_km: input.mileageKm, fuel: input.fuel, transmission: input.transmission, power_cv: input.powerCv, category: input.category, description: input.description, equipment: input.equipment, images: input.images, availability: input.availability, published: input.published, featured: input.featured, warranty_note: input.warrantyNote, published_at: input.published ? new Date().toISOString() : null }).select("id").single();
      if (error) failDb(error);
      return { id: data.id };
    }),
    updateVehicle: adminProcedure.input(z.object({ id: z.number().int().positive(), ...vehicleFields.shape })).mutation(async ({ ctx, input }) => {
      const brandId = await findBrand(ctx, input.brand);
      const { id, ...value } = input;
      const { error } = await ctx.supabase.from("vehicles").update({ brand_id: brandId, slug: value.slug, model: value.model, year: value.year, price_dh: value.priceDh, mileage_km: value.mileageKm, fuel: value.fuel, transmission: value.transmission, power_cv: value.powerCv, category: value.category, description: value.description, equipment: value.equipment, images: value.images, availability: value.availability, published: value.published, featured: value.featured, warranty_note: value.warrantyNote, published_at: value.published ? new Date().toISOString() : null }).eq("id", id);
      if (error) failDb(error);
      return { success: true } as const;
    }),
    deleteVehicle: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from("vehicles").delete().eq("id", input.id);
      if (error) failDb(error);
      return { success: true } as const;
    }),
    uploadImage: adminProcedure.input(z.object({ dataUrl: z.string().max(7_100_000), prefix: z.enum(["vehicles", "brands", "services", "blog", "partners"]).default("vehicles") })).mutation(async ({ ctx, input }) => ({ url: await uploadPublicImage(ctx, input.dataUrl, input.prefix) })),
    posts: adminProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("blog_posts").select("id,slug,title,category,excerpt,body,image_url,author,reading_minutes,source_date,status,review_notes,published_at,created_at,updated_at").order("created_at", { ascending: false }).limit(500);
      if (error) failDb(error);
      return (data ?? []).map(row => mapPost(row));
    }),
    savePost: adminProcedure.input(postFields.extend({ id: z.number().int().positive().optional() })).mutation(async ({ ctx, input }) => {
      const { id, ...value } = input;
      const row = { slug: value.slug, title: value.title, category: value.category, excerpt: value.excerpt, body: value.body, image_url: value.imageUrl, author: value.author, reading_minutes: value.readingMinutes, status: value.status, review_notes: value.reviewNotes, published_at: value.status === "published" ? new Date().toISOString() : null };
      if (id) {
        const { error } = await ctx.supabase.from("blog_posts").update(row).eq("id", id);
        if (error) failDb(error);
        return { id };
      }
      const { data, error } = await ctx.supabase.from("blog_posts").insert(row).select("id").single();
      if (error) failDb(error);
      return { id: data.id };
    }),
    deletePost: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from("blog_posts").delete().eq("id", input.id);
      if (error) failDb(error);
      return { success: true } as const;
    }),
    leads: adminProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("leads").select("id,type,name,email,phone,vehicle_slug,message,details,photo_paths,status,created_at,updated_at").order("created_at", { ascending: false }).limit(500);
      if (error) failDb(error);
      return await Promise.all((data ?? []).map(async row => {
        const signed = await Promise.all((row.photo_paths ?? []).map(async path => {
          const { data: result } = await ctx.supabase.storage.from("trade-in-photos").createSignedUrl(path, 30 * 60);
          return result?.signedUrl ?? "";
        }));
        return { id: row.id, type: row.type as "contact" | "financing" | "trade_in" | "appointment", name: row.name, email: row.email, phone: row.phone, vehicleSlug: row.vehicle_slug, message: row.message, details: objectValue(row.details), photoUrls: signed.filter(Boolean), status: row.status as "new" | "in_progress" | "completed", createdAt: new Date(row.created_at) };
      }));
    }),
    updateLeadStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "in_progress", "completed"]) })).mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from("leads").update({ status: input.status }).eq("id", input.id);
      if (error) failDb(error);
      return { success: true } as const;
    }),
    brands: adminProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("brands").select("id,slug,name,logo_url,official_url,official_region,description,display_order,active,created_at,updated_at").order("display_order").order("name").limit(500);
      if (error) failDb(error);
      return (data ?? []).map(row => mapBrand(row));
    }),
    saveBrand: adminProcedure.input(brandFields.extend({ id: z.number().int().positive().optional() })).mutation(async ({ ctx, input }) => {
      const { id, ...value } = input;
      const row = { slug: value.slug, name: value.name, logo_url: value.logoUrl, official_url: value.officialUrl || null, official_region: value.officialRegion, description: value.description || null, display_order: value.displayOrder, active: value.active };
      if (id) {
        const { error } = await ctx.supabase.from("brands").update(row).eq("id", id);
        if (error) failDb(error);
        return { id };
      }
      const { data, error } = await ctx.supabase.from("brands").insert(row).select("id").single();
      if (error) failDb(error);
      return { id: data.id };
    }),
    deleteBrand: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from("brands").delete().eq("id", input.id);
      if (error) failDb(error);
      return { success: true } as const;
    }),
    services: adminProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("services").select("id,slug,name,description,image_url,icon,cta_label,cta_url,display_order,active,published,created_at,updated_at").order("display_order").limit(500);
      if (error) failDb(error);
      return (data ?? []).map(row => mapService(row));
    }),
    saveService: adminProcedure.input(serviceFields.extend({ id: z.number().int().positive().optional() })).mutation(async ({ ctx, input }) => {
      const { id, ...value } = input;
      const row = { slug: value.slug, name: value.name, description: value.description, image_url: value.imageUrl, icon: value.icon, cta_label: value.ctaLabel, cta_url: value.ctaUrl, display_order: value.displayOrder, active: value.active, published: value.published };
      if (id) {
        const { error } = await ctx.supabase.from("services").update(row).eq("id", id);
        if (error) failDb(error);
        return { id };
      }
      const { data, error } = await ctx.supabase.from("services").insert(row).select("id").single();
      if (error) failDb(error);
      return { id: data.id };
    }),
    deleteService: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from("services").delete().eq("id", input.id);
      if (error) failDb(error);
      return { success: true } as const;
    }),
    financingPartners: adminProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("financing_partners").select("id,slug,name,logo_url,description,terms,annual_rate,min_term_months,max_term_months,is_confirmed,published,display_order,created_at,updated_at").order("display_order").limit(500);
      if (error) failDb(error);
      return (data ?? []).map(row => mapPartner(row));
    }),
    saveFinancingPartner: adminProcedure.input(partnerFields.extend({ id: z.number().int().positive().optional() })).mutation(async ({ ctx, input }) => {
      if (input.published && !input.isConfirmed) throw new TRPCError({ code: "BAD_REQUEST", message: "Confirmez le partenaire et ses conditions avant publication." });
      const { id, ...value } = input;
      const row = { slug: value.slug, name: value.name, logo_url: value.logoUrl, description: value.description, terms: { summary: value.termsSummary } as Json, annual_rate: value.annualRate, min_term_months: value.minTermMonths, max_term_months: value.maxTermMonths, is_confirmed: value.isConfirmed, published: value.published, display_order: value.displayOrder };
      if (id) {
        const { error } = await ctx.supabase.from("financing_partners").update(row).eq("id", id);
        if (error) failDb(error);
        return { id };
      }
      const { data, error } = await ctx.supabase.from("financing_partners").insert(row).select("id").single();
      if (error) failDb(error);
      return { id: data.id };
    }),
    deleteFinancingPartner: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from("financing_partners").delete().eq("id", input.id);
      if (error) failDb(error);
      return { success: true } as const;
    }),
  }),
});

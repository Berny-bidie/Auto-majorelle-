// server/apiHandler.ts
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/_core/publicConfig.ts
function publicPlatformConfig(env = process.env) {
  return {
    projectId: env.MANUS_PROJECT_ID ?? "",
    oauthPortalUrl: env.MANUS_OAUTH_PORTAL_URL ?? "",
    apiUrl: env.MANUS_API_URL ?? "",
    apiBrowserKey: env.MANUS_API_BROWSER_KEY ?? ""
  };
}
function publicPlatformScript(env = process.env) {
  const json = JSON.stringify(publicPlatformConfig(env)).replaceAll("<", "\\u003c");
  return `window.__MANUS_CONFIG__=${json};`;
}

// server/automajorelRouter.ts
import { TRPCError as TRPCError2 } from "@trpc/server";
import { z } from "zod";

// shared/siteData.ts
var SITE_CONTACT = {
  name: "automajorelle",
  phone: "+212 678 880 268",
  phoneRaw: "+212678880268",
  secondaryPhone: "+212 660 889 030",
  secondaryPhoneRaw: "+212660889030",
  whatsapp: "212678880268",
  email: "contact.automajorelle@gmail.com",
  address: "Quartier industriel Sidi Ghanem 127, Marrakech 40000, Marrakech-Safi, Maroc",
  city: "Marrakech",
  hours: "Lundi\u2013samedi : 09:00\u201322:00 \xB7 Dimanche : ferm\xE9",
  hoursNote: "Horaires relev\xE9s sur la fiche Google Maps; appelez avant votre visite.",
  mapsSearchUrl: "https://www.google.com/maps/search/?api=1&query=Quartier%20industriel%20Sidi%20Ghanem%20127%2C%20Marrakech%2040000%2C%20Marrakech-Safi%2C%20Maroc",
  mapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Quartier%20industriel%20Sidi%20Ghanem%20127%2C%20Marrakech%2040000%2C%20Marrakech-Safi%2C%20Maroc",
  googleProfileUrl: "https://maps.app.goo.gl/33s4mzAFfpguhTo27",
  googleDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=automajorelle%2C%20Quartier%20industriel%20Sidi%20Ghanem%20127%2C%20Marrakech%2040000%2C%20Marrakech-Safi%2C%20Maroc",
  instagramUrl: "https://www.instagram.com/auto_majorelle",
  facebookUrl: "https://www.facebook.com/automajorelle",
  tiktokUrl: "https://www.tiktok.com/@auto_majorelle"
};
function normalizeBrandName(value) {
  if (typeof value !== "string" || !value.trim()) return SITE_CONTACT.name;
  return value.trim().replace(/\b(?:auto[\s_-]+majorelle|majorelle[\s_-]+auto)\b/gi, SITE_CONTACT.name).replace(/أوتو\s+ماجوريل/gu, SITE_CONTACT.name);
}

// server/supabase.ts
import { createClient } from "@supabase/supabase-js";

// shared/supabaseProject.ts
var SUPABASE_PROJECT_URL = "https://vbcwmymamzrnenyilhau.supabase.co";
var SUPABASE_PUBLISHABLE_KEY = "sb_publishable_yfFicMi_ZT4a0cJHX6hohQ_joP5PZzE";

// server/supabase.ts
var supabaseUrl = process.env.SUPABASE_URL?.trim() || SUPABASE_PROJECT_URL;
var supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.SUPABASE_ANON_KEY?.trim() || SUPABASE_PUBLISHABLE_KEY;
function createRequestSupabase(accessToken) {
  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    ...accessToken ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } } : {}
  });
}

// shared/const.ts
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({ transformer: superjson });
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  return next({ ctx: { ...ctx, user: ctx.user } });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  if (!ctx.isAdmin) throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
  return next({ ctx: { ...ctx, user: ctx.user } });
}));

// server/publicInventory.ts
var demoSlugPattern = /^(?:test|demo)-/i;
function isPublicInventorySlug(slug) {
  return !demoSlugPattern.test(slug);
}

// server/automajorelRouter.ts
var DEFAULT_SETTINGS = {
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
  internalAddressNote: "Adresse publique communiqu\xE9e par l\u2019entreprise : utilisez la m\xEAme adresse sur les pages et les liens d\u2019itin\xE9raire."
};
var settingPublicKeys = /* @__PURE__ */ new Set(["businessName", "phone", "phoneRaw", "secondaryPhone", "secondaryPhoneRaw", "whatsapp", "email", "address", "hours", "instagramUrl", "facebookUrl", "tiktokUrl"]);
var vehicleSelect = "id,brand_id,slug,model,year,price_dh,mileage_km,fuel,transmission,power_cv,category,description,equipment,images,availability,published,featured,warranty_note,published_at,created_at,updated_at,brands(name)";
function failDb(error) {
  const code = error?.code === "23505" ? "CONFLICT" : error?.code === "23503" || error?.code === "23514" ? "BAD_REQUEST" : error?.code === "42501" ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR";
  const message = code === "CONFLICT" ? "Cette valeur existe d\xE9j\xE0." : code === "BAD_REQUEST" ? "Les donn\xE9es ne respectent pas les r\xE8gles m\xE9tier." : code === "FORBIDDEN" ? "Op\xE9ration non autoris\xE9e." : "La base de donn\xE9es est temporairement indisponible.";
  throw new TRPCError2({ code, message });
}
function stringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function objectValue(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function mapVehicle(row) {
  return { id: row.id, slug: row.slug, brand: row.brands?.name ?? "", model: row.model, year: row.year, priceDh: row.price_dh, mileageKm: row.mileage_km, fuel: row.fuel, transmission: row.transmission, powerCv: row.power_cv, category: row.category, description: row.description, equipment: stringArray(row.equipment), images: stringArray(row.images), availability: row.availability, published: row.published ? 1 : 0, featured: row.featured ? 1 : 0, warrantyNote: row.warranty_note, publishedAt: row.published_at ? new Date(row.published_at) : null, createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at) };
}
function mapPost(row) {
  return { id: row.id, slug: row.slug, title: row.title, category: row.category, excerpt: row.excerpt, body: row.body, imageUrl: row.image_url, author: row.author, readingMinutes: row.reading_minutes, sourceDate: row.source_date, status: row.status, reviewNotes: row.review_notes, publishedAt: row.published_at ? new Date(row.published_at) : null, createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at) };
}
function mapBrand(row) {
  return { id: row.id, slug: row.slug, name: row.name, logoUrl: row.logo_url, officialUrl: row.official_url ?? "", officialRegion: row.official_region, description: row.description ?? "", displayOrder: row.display_order, active: row.active };
}
function mapService(row) {
  return { id: row.id, slug: row.slug, name: row.name, description: row.description, imageUrl: row.image_url, icon: row.icon, ctaLabel: row.cta_label, ctaUrl: row.cta_url, displayOrder: row.display_order, active: row.active, published: row.published };
}
function mapPartner(row) {
  const terms = objectValue(row.terms);
  return { id: row.id, slug: row.slug, name: row.name, logoUrl: row.logo_url, description: row.description, termsSummary: typeof terms.summary === "string" ? terms.summary : "", annualRate: row.annual_rate, minTermMonths: row.min_term_months, maxTermMonths: row.max_term_months, isConfirmed: row.is_confirmed, published: row.published, displayOrder: row.display_order };
}
async function readSettings(ctx, includePrivate = false) {
  let query = ctx.supabase.from("site_settings").select("key,value,is_public");
  if (!includePrivate) query = query.eq("is_public", true);
  const { data, error } = await query;
  if (error) failDb(error);
  const values = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
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
var leadBase = { submissionId: z.string().uuid(), name: z.string().trim().min(2).max(160), phone: z.string().trim().min(7).max(50), email: z.string().trim().email().max(320).or(z.literal("")), message: z.string().trim().max(4e3).default(""), consent: z.literal(true), website: z.string().max(200).default("") };
function rejectBot(website) {
  if (website.trim()) throw new TRPCError2({ code: "BAD_REQUEST", message: "Demande rejet\xE9e." });
}
var rateBuckets = /* @__PURE__ */ new Map();
function limitPublic(ctx, type, max) {
  const forwarded = ctx.req.headers["x-forwarded-for"];
  const ip = ctx.req.ip || (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0]?.trim()) || "unknown";
  const key = `${type}:${ip}`;
  const now = Date.now();
  const recent = (rateBuckets.get(key) ?? []).filter((value) => now - value < 60 * 60 * 1e3);
  if (recent.length >= max) throw new TRPCError2({ code: "TOO_MANY_REQUESTS", message: "Trop de demandes depuis cette connexion. R\xE9essayez plus tard." });
  recent.push(now);
  rateBuckets.set(key, recent);
  if (rateBuckets.size > 5e3) {
    for (const [oldKey, values] of rateBuckets) if (!values.some((value) => now - value < 60 * 60 * 1e3)) rateBuckets.delete(oldKey);
  }
}
function imageBytes(dataUrl) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) throw new TRPCError2({ code: "BAD_REQUEST", message: "Format d\u2019image non accept\xE9." });
  const contentType = match[1];
  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.length > 5 * 1024 * 1024) throw new TRPCError2({ code: "BAD_REQUEST", message: "Chaque image doit faire 5 Mo maximum." });
  const valid = contentType === "image/jpeg" ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 : contentType === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) : bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  if (!valid) throw new TRPCError2({ code: "BAD_REQUEST", message: "Le contenu du fichier ne correspond pas au format annonc\xE9." });
  return { bytes, contentType, extension: contentType === "image/jpeg" ? "jpg" : contentType.slice("image/".length) };
}
async function uploadPublicImage(ctx, dataUrl, prefix) {
  const { bytes, contentType, extension } = imageBytes(dataUrl);
  const path = `${prefix}/${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  const { error } = await ctx.supabase.storage.from("public-media").upload(path, bytes, { contentType, cacheControl: "31536000", upsert: false });
  if (error) throw new TRPCError2({ code: "INTERNAL_SERVER_ERROR", message: "Le fichier n\u2019a pas pu \xEAtre stock\xE9." });
  return ctx.supabase.storage.from("public-media").getPublicUrl(path).data.publicUrl;
}
async function findBrand(ctx, name) {
  const { data, error } = await ctx.supabase.from("brands").select("id").eq("name", name).maybeSingle();
  if (error) failDb(error);
  if (!data) throw new TRPCError2({ code: "BAD_REQUEST", message: "Ajoutez d\u2019abord cette marque dans l\u2019onglet Marques." });
  return data.id;
}
var vehicleFields = z.object({ slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), brand: z.string().trim().min(1).max(80), model: z.string().trim().min(1).max(120), year: z.number().int().min(1950).max(2100), priceDh: z.number().int().min(0).max(1e8), mileageKm: z.number().int().min(0).max(2e6), fuel: z.string().trim().min(1).max(40), transmission: z.string().trim().min(1).max(40), powerCv: z.number().int().min(0).max(3e3).nullable(), category: z.string().trim().min(1).max(60), description: z.string().trim().min(10).max(1e4), equipment: z.array(z.string().trim().min(1).max(100)).max(50), images: z.array(z.string().trim().max(1e3)).max(12), availability: z.enum(["available", "reserved", "sold"]), published: z.boolean(), featured: z.boolean(), warrantyNote: z.string().trim().max(300).nullable() });
var postFields = z.object({ slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: z.string().trim().min(4).max(220), category: z.string().trim().min(1).max(80), excerpt: z.string().trim().min(10).max(1e3), body: z.string().trim().min(30).max(12e3), imageUrl: z.string().trim().max(1e3), author: z.string().trim().max(120).nullable(), readingMinutes: z.number().int().min(1).max(120), status: z.enum(["draft", "published"]), reviewNotes: z.string().trim().max(4e3).nullable() });
var brandFields = z.object({ slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: z.string().trim().min(1).max(80), logoUrl: z.string().trim().max(1e3), officialUrl: z.string().trim().max(500).url().or(z.literal("")), officialRegion: z.enum(["Maroc", "International"]).nullable(), description: z.string().trim().max(1e3), displayOrder: z.number().int().min(0).max(1e4), active: z.boolean() });
var serviceFields = z.object({ slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: z.string().trim().min(1).max(120), description: z.string().trim().max(4e3), imageUrl: z.string().trim().max(1e3).nullable(), icon: z.enum(["car-front", "handshake", "search", "wrench", "shield-check", "message-circle"]), ctaLabel: z.string().trim().min(1).max(80), ctaUrl: z.string().trim().min(1).max(300), displayOrder: z.number().int().min(0).max(1e4), active: z.boolean(), published: z.boolean() });
var partnerFields = z.object({ slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: z.string().trim().min(1).max(120), logoUrl: z.string().trim().max(1e3).nullable(), description: z.string().trim().max(2e3), termsSummary: z.string().trim().max(2e3), annualRate: z.number().min(0).max(40).nullable(), minTermMonths: z.number().int().min(1).max(120).nullable(), maxTermMonths: z.number().int().min(1).max(120).nullable(), isConfirmed: z.boolean(), published: z.boolean(), displayOrder: z.number().int().min(0).max(1e4) });
async function saveLead(ctx, values) {
  const { error } = await ctx.supabase.from("leads").insert(values);
  if (error?.code === "23505") return { success: true };
  if (error) failDb(error);
  return { success: true };
}
var automajorelRouter = router({
  site: router({
    settings: publicProcedure.query(({ ctx }) => readSettings(ctx)),
    brands: publicProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("brands").select("id,slug,name,logo_url,official_url,official_region,description,display_order,active,created_at,updated_at").eq("active", true).order("display_order").order("name").limit(100);
      if (error) failDb(error);
      return (data ?? []).map((row) => mapBrand(row));
    }),
    services: publicProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("services").select("id,slug,name,description,image_url,icon,cta_label,cta_url,display_order,active,published,created_at,updated_at").eq("active", true).eq("published", true).order("display_order").limit(100);
      if (error) failDb(error);
      return (data ?? []).map((row) => mapService(row));
    }),
    financingPartners: publicProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("financing_partners").select("id,slug,name,logo_url,description,terms,annual_rate,min_term_months,max_term_months,is_confirmed,published,display_order,created_at,updated_at").eq("is_confirmed", true).eq("published", true).order("display_order").limit(100);
      if (error) failDb(error);
      return (data ?? []).map((row) => mapPartner(row));
    })
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
      return (data ?? []).map(mapVehicle).filter((row) => isPublicInventorySlug(row.slug) && (!search || `${row.brand} ${row.model}`.toLocaleLowerCase("fr").includes(search)) && (!filters.category || row.category === filters.category) && (!filters.fuel || row.fuel === filters.fuel) && (!filters.transmission || row.transmission === filters.transmission) && (filters.yearFrom === void 0 || row.year >= filters.yearFrom) && (filters.yearTo === void 0 || row.year <= filters.yearTo) && (filters.budgetMax === void 0 || row.priceDh <= filters.budgetMax) && (filters.mileageMax === void 0 || row.mileageKm <= filters.mileageMax));
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(140) })).query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.from("vehicles").select(vehicleSelect).eq("slug", input.slug).eq("published", true).eq("availability", "available").maybeSingle();
      if (error) failDb(error);
      return data && isPublicInventorySlug(data.slug) ? mapVehicle(data) : null;
    })
  }),
  blog: router({
    list: publicProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("blog_posts").select("id,slug,title,category,excerpt,body,image_url,author,reading_minutes,source_date,status,review_notes,published_at,created_at,updated_at").eq("status", "published").order("published_at", { ascending: false }).limit(100);
      if (error) failDb(error);
      return (data ?? []).map((row) => mapPost(row));
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(180) })).query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.from("blog_posts").select("id,slug,title,category,excerpt,body,image_url,author,reading_minutes,source_date,status,review_notes,published_at,created_at,updated_at").eq("slug", input.slug).eq("status", "published").maybeSingle();
      if (error) failDb(error);
      return data ? mapPost(data) : null;
    })
  }),
  leads: router({
    contact: publicProcedure.input(z.object({ ...leadBase, vehicleSlug: z.string().trim().max(140).optional(), kind: z.enum(["contact", "appointment"]).default("contact") })).mutation(async ({ ctx, input }) => {
      rejectBot(input.website);
      limitPublic(ctx, "contact", 10);
      return saveLead(ctx, { submission_id: input.submissionId, type: input.kind, name: input.name, email: input.email || null, phone: input.phone, vehicle_slug: input.vehicleSlug || null, message: input.message, details: { consent: input.consent } });
    }),
    financing: publicProcedure.input(z.object({ ...leadBase, vehiclePrice: z.number().int().min(0).max(1e8), downPayment: z.number().int().min(0).max(1e8), termMonths: z.number().int().min(6).max(120), annualRate: z.number().min(0).max(40).nullable() })).mutation(async ({ ctx, input }) => {
      rejectBot(input.website);
      limitPublic(ctx, "financing", 8);
      return saveLead(ctx, { submission_id: input.submissionId, type: "financing", name: input.name, email: input.email || null, phone: input.phone, message: input.message, details: { vehiclePrice: input.vehiclePrice, downPayment: input.downPayment, termMonths: input.termMonths, annualRate: input.annualRate, consent: input.consent } });
    }),
    tradeIn: publicProcedure.input(z.object({ ...leadBase, brand: z.string().trim().min(1).max(80), model: z.string().trim().min(1).max(120), year: z.number().int().min(1950).max(2100), mileageKm: z.number().int().min(0).max(2e6), fuel: z.string().trim().min(1).max(40), condition: z.string().trim().min(1).max(200), photos: z.array(z.string().max(71e5)).max(5) })).mutation(async ({ ctx, input }) => {
      rejectBot(input.website);
      const origin = ctx.req.headers.origin;
      if (!origin) throw new TRPCError2({ code: "FORBIDDEN", message: "Origine de la demande non v\xE9rifi\xE9e." });
      const response = await fetch(`${supabaseUrl}/functions/v1/submit-trade-in`, { method: "POST", headers: { apikey: supabasePublishableKey, "Content-Type": "application/json", Origin: origin }, body: JSON.stringify(input) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        const code = response.status === 429 ? "TOO_MANY_REQUESTS" : response.status >= 500 ? "SERVICE_UNAVAILABLE" : "BAD_REQUEST";
        throw new TRPCError2({ code, message: result.error || "La demande de reprise n\u2019a pas pu \xEAtre enregistr\xE9e." });
      }
      return { success: true };
    })
  }),
  admin: router({
    stats: adminProcedure.query(async ({ ctx }) => {
      const [vehiclesTotal, vehiclesPublished, leadsTotal, newLeads, postsDraft, postsPublished] = await Promise.all([
        ctx.supabase.from("vehicles").select("id", { count: "exact", head: true }),
        ctx.supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("published", true),
        ctx.supabase.from("leads").select("id", { count: "exact", head: true }),
        ctx.supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
        ctx.supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
        ctx.supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published")
      ]);
      for (const result of [vehiclesTotal, vehiclesPublished, leadsTotal, newLeads, postsDraft, postsPublished]) if (result.error) failDb(result.error);
      return { vehiclesTotal: vehiclesTotal.count ?? 0, vehiclesPublished: vehiclesPublished.count ?? 0, leadsTotal: leadsTotal.count ?? 0, newLeads: newLeads.count ?? 0, postsDraft: postsDraft.count ?? 0, postsPublished: postsPublished.count ?? 0 };
    }),
    settings: adminProcedure.query(({ ctx }) => readSettings(ctx, true)),
    saveSettings: adminProcedure.input(z.record(z.string(), z.string().trim().max(2e3))).mutation(async ({ ctx, input }) => {
      const allowed = new Set(Object.keys(DEFAULT_SETTINGS));
      const rateConfirmed = input.financingRateConfirmed === "true" && Boolean(input.financingRateSource?.trim());
      const rate = input.financingAnnualRate?.trim() ?? "";
      if (rateConfirmed && (!rate || !Number.isFinite(Number(rate)) || Number(rate) < 0 || Number(rate) > 40)) throw new TRPCError2({ code: "BAD_REQUEST", message: "Un taux confirm\xE9 entre 0 et 40 % et sa source sont requis." });
      const rows = Object.entries(input).filter(([key]) => allowed.has(key)).map(([key, original]) => {
        let value = original;
        if (key === "businessName") value = normalizeBrandName(value);
        if (key === "financingAnnualRate") value = rateConfirmed ? rate : "";
        if (key === "financingRateConfirmed") value = rateConfirmed ? "true" : "false";
        const confirmedRateKeys = ["financingAnnualRate", "financingRateConfirmed", "financingRateSource"];
        const isPublic = settingPublicKeys.has(key) || rateConfirmed && confirmedRateKeys.includes(key);
        return { key, value, is_public: isPublic };
      });
      const { error } = await ctx.supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) failDb(error);
      return { success: true };
    }),
    vehicles: adminProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("vehicles").select(vehicleSelect).order("created_at", { ascending: false }).limit(500);
      if (error) failDb(error);
      return (data ?? []).map(mapVehicle);
    }),
    createVehicle: adminProcedure.input(vehicleFields).mutation(async ({ ctx, input }) => {
      const brandId = await findBrand(ctx, input.brand);
      const { data, error } = await ctx.supabase.from("vehicles").insert({ brand_id: brandId, slug: input.slug, model: input.model, year: input.year, price_dh: input.priceDh, mileage_km: input.mileageKm, fuel: input.fuel, transmission: input.transmission, power_cv: input.powerCv, category: input.category, description: input.description, equipment: input.equipment, images: input.images, availability: input.availability, published: input.published, featured: input.featured, warranty_note: input.warrantyNote, published_at: input.published ? (/* @__PURE__ */ new Date()).toISOString() : null }).select("id").single();
      if (error) failDb(error);
      return { id: data.id };
    }),
    updateVehicle: adminProcedure.input(z.object({ id: z.number().int().positive(), ...vehicleFields.shape })).mutation(async ({ ctx, input }) => {
      const brandId = await findBrand(ctx, input.brand);
      const { id, ...value } = input;
      const { error } = await ctx.supabase.from("vehicles").update({ brand_id: brandId, slug: value.slug, model: value.model, year: value.year, price_dh: value.priceDh, mileage_km: value.mileageKm, fuel: value.fuel, transmission: value.transmission, power_cv: value.powerCv, category: value.category, description: value.description, equipment: value.equipment, images: value.images, availability: value.availability, published: value.published, featured: value.featured, warranty_note: value.warrantyNote, published_at: value.published ? (/* @__PURE__ */ new Date()).toISOString() : null }).eq("id", id);
      if (error) failDb(error);
      return { success: true };
    }),
    deleteVehicle: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from("vehicles").delete().eq("id", input.id);
      if (error) failDb(error);
      return { success: true };
    }),
    uploadImage: adminProcedure.input(z.object({ dataUrl: z.string().max(71e5), prefix: z.enum(["vehicles", "brands", "services", "blog", "partners"]).default("vehicles") })).mutation(async ({ ctx, input }) => ({ url: await uploadPublicImage(ctx, input.dataUrl, input.prefix) })),
    posts: adminProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("blog_posts").select("id,slug,title,category,excerpt,body,image_url,author,reading_minutes,source_date,status,review_notes,published_at,created_at,updated_at").order("created_at", { ascending: false }).limit(500);
      if (error) failDb(error);
      return (data ?? []).map((row) => mapPost(row));
    }),
    savePost: adminProcedure.input(postFields.extend({ id: z.number().int().positive().optional() })).mutation(async ({ ctx, input }) => {
      const { id, ...value } = input;
      const row = { slug: value.slug, title: value.title, category: value.category, excerpt: value.excerpt, body: value.body, image_url: value.imageUrl, author: value.author, reading_minutes: value.readingMinutes, status: value.status, review_notes: value.reviewNotes, published_at: value.status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null };
      if (id) {
        const { error: error2 } = await ctx.supabase.from("blog_posts").update(row).eq("id", id);
        if (error2) failDb(error2);
        return { id };
      }
      const { data, error } = await ctx.supabase.from("blog_posts").insert(row).select("id").single();
      if (error) failDb(error);
      return { id: data.id };
    }),
    deletePost: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from("blog_posts").delete().eq("id", input.id);
      if (error) failDb(error);
      return { success: true };
    }),
    leads: adminProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("leads").select("id,type,name,email,phone,vehicle_slug,message,details,photo_paths,status,created_at,updated_at").order("created_at", { ascending: false }).limit(500);
      if (error) failDb(error);
      return await Promise.all((data ?? []).map(async (row) => {
        const signed = await Promise.all((row.photo_paths ?? []).map(async (path) => {
          const { data: result } = await ctx.supabase.storage.from("trade-in-photos").createSignedUrl(path, 30 * 60);
          return result?.signedUrl ?? "";
        }));
        return { id: row.id, type: row.type, name: row.name, email: row.email, phone: row.phone, vehicleSlug: row.vehicle_slug, message: row.message, details: objectValue(row.details), photoUrls: signed.filter(Boolean), status: row.status, createdAt: new Date(row.created_at) };
      }));
    }),
    updateLeadStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "in_progress", "completed"]) })).mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from("leads").update({ status: input.status }).eq("id", input.id);
      if (error) failDb(error);
      return { success: true };
    }),
    brands: adminProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("brands").select("id,slug,name,logo_url,official_url,official_region,description,display_order,active,created_at,updated_at").order("display_order").order("name").limit(500);
      if (error) failDb(error);
      return (data ?? []).map((row) => mapBrand(row));
    }),
    saveBrand: adminProcedure.input(brandFields.extend({ id: z.number().int().positive().optional() })).mutation(async ({ ctx, input }) => {
      const { id, ...value } = input;
      const row = { slug: value.slug, name: value.name, logo_url: value.logoUrl, official_url: value.officialUrl || null, official_region: value.officialRegion, description: value.description || null, display_order: value.displayOrder, active: value.active };
      if (id) {
        const { error: error2 } = await ctx.supabase.from("brands").update(row).eq("id", id);
        if (error2) failDb(error2);
        return { id };
      }
      const { data, error } = await ctx.supabase.from("brands").insert(row).select("id").single();
      if (error) failDb(error);
      return { id: data.id };
    }),
    deleteBrand: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from("brands").delete().eq("id", input.id);
      if (error) failDb(error);
      return { success: true };
    }),
    services: adminProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("services").select("id,slug,name,description,image_url,icon,cta_label,cta_url,display_order,active,published,created_at,updated_at").order("display_order").limit(500);
      if (error) failDb(error);
      return (data ?? []).map((row) => mapService(row));
    }),
    saveService: adminProcedure.input(serviceFields.extend({ id: z.number().int().positive().optional() })).mutation(async ({ ctx, input }) => {
      const { id, ...value } = input;
      const row = { slug: value.slug, name: value.name, description: value.description, image_url: value.imageUrl, icon: value.icon, cta_label: value.ctaLabel, cta_url: value.ctaUrl, display_order: value.displayOrder, active: value.active, published: value.published };
      if (id) {
        const { error: error2 } = await ctx.supabase.from("services").update(row).eq("id", id);
        if (error2) failDb(error2);
        return { id };
      }
      const { data, error } = await ctx.supabase.from("services").insert(row).select("id").single();
      if (error) failDb(error);
      return { id: data.id };
    }),
    deleteService: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from("services").delete().eq("id", input.id);
      if (error) failDb(error);
      return { success: true };
    }),
    financingPartners: adminProcedure.query(async ({ ctx }) => {
      const { data, error } = await ctx.supabase.from("financing_partners").select("id,slug,name,logo_url,description,terms,annual_rate,min_term_months,max_term_months,is_confirmed,published,display_order,created_at,updated_at").order("display_order").limit(500);
      if (error) failDb(error);
      return (data ?? []).map((row) => mapPartner(row));
    }),
    saveFinancingPartner: adminProcedure.input(partnerFields.extend({ id: z.number().int().positive().optional() })).mutation(async ({ ctx, input }) => {
      if (input.published && !input.isConfirmed) throw new TRPCError2({ code: "BAD_REQUEST", message: "Confirmez le partenaire et ses conditions avant publication." });
      const { id, ...value } = input;
      const row = { slug: value.slug, name: value.name, logo_url: value.logoUrl, description: value.description, terms: { summary: value.termsSummary }, annual_rate: value.annualRate, min_term_months: value.minTermMonths, max_term_months: value.maxTermMonths, is_confirmed: value.isConfirmed, published: value.published, display_order: value.displayOrder };
      if (id) {
        const { error: error2 } = await ctx.supabase.from("financing_partners").update(row).eq("id", id);
        if (error2) failDb(error2);
        return { id };
      }
      const { data, error } = await ctx.supabase.from("financing_partners").insert(row).select("id").single();
      if (error) failDb(error);
      return { id: data.id };
    }),
    deleteFinancingPartner: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase.from("financing_partners").delete().eq("id", input.id);
      if (error) failDb(error);
      return { success: true };
    })
  })
});

// server/_core/systemRouter.ts
import { z as z2 } from "zod";

// server/_core/notification.ts
import { TRPCError as TRPCError3 } from "@trpc/server";

// server/_core/env.ts
var ENV = {
  get appId() {
    return process.env.MANUS_PROJECT_ID ?? "";
  },
  get cookieSecret() {
    return process.env.MANUS_JWT_SECRET ?? "";
  },
  get databaseUrl() {
    return process.env.DATABASE_URL ?? "";
  },
  get oAuthServerUrl() {
    return process.env.MANUS_OAUTH_API_URL ?? "";
  },
  // Preserve the legacy hint when supplied; otherwise roles remain application data.
  get ownerOpenId() {
    return process.env.OWNER_OPEN_ID ?? "";
  },
  get isProduction() {
    return process.env.NODE_ENV === "production";
  },
  get forgeApiUrl() {
    return process.env.MANUS_API_URL ?? "";
  },
  get forgeApiKey() {
    return process.env.MANUS_API_KEY ?? "";
  }
};

// server/_core/notification.ts
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError3({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError3({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError3({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError3({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError3({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError3({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z2.object({
      timestamp: z2.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z2.object({
      title: z2.string().min(1, "title is required"),
      content: z2.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user)
  }),
  automajorel: automajorelRouter
});

// server/_core/context.ts
async function createContext(opts) {
  const authorization = opts.req.headers.authorization;
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  const supabase = createRequestSupabase(accessToken);
  let authUser = null;
  let user = null;
  let isAdmin = false;
  if (accessToken) {
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (!error && data.user) {
      authUser = data.user;
      const { data: membership, error: membershipError } = await supabase.from("admin_users").select("role").eq("user_id", data.user.id).maybeSingle();
      const role = membershipError ? "user" : membership?.role ?? "user";
      user = { id: data.user.id, email: data.user.email ?? null, role };
      isAdmin = Boolean(membership && !membershipError && ["admin", "editor"].includes(role));
    }
  }
  return { req: opts.req, res: opts.res, supabase, authUser, user, isAdmin };
}

// server/apiHandler.ts
var app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.get("/healthz", (_req, res) => res.status(200).json({ status: "ok" }));
app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.get("/api/healthz", (_req, res) => res.status(200).json({ status: "ok" }));
app.get("/api/platform/config.js", (_req, res) => {
  res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript());
});
app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
function handler(req, res) {
  return app(req, res);
}
export {
  handler as default
};

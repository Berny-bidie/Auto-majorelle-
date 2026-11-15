export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Insert, Update = Partial<Insert>, Relationships extends unknown[] = []> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationships;
};
type Relationship<Name extends string, Columns extends string[], ReferencedRelation extends string, ReferencedColumns extends string[]> = {
  foreignKeyName: Name;
  columns: Columns;
  isOneToOne: false;
  referencedRelation: ReferencedRelation;
  referencedColumns: ReferencedColumns;
};

type Timestamps = { created_at: string; updated_at: string };

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.18" };
  public: {
    Tables: {
      admin_users: Table<{ user_id: string; email: string; role: string; created_at: string }, { user_id: string; email: string; role?: string; created_at?: string }>;
      brands: Table<Timestamps & { id: number; slug: string; name: string; logo_url: string; official_url: string | null; official_region: string | null; description: string | null; display_order: number; active: boolean }, { id?: number; slug: string; name: string; logo_url?: string; official_url?: string | null; official_region?: string | null; description?: string | null; display_order?: number; active?: boolean; created_at?: string; updated_at?: string }>;
      services: Table<Timestamps & { id: number; slug: string; name: string; description: string; image_url: string | null; icon: string; cta_label: string; cta_url: string; display_order: number; active: boolean; published: boolean }, { id?: number; slug: string; name: string; description?: string; image_url?: string | null; icon?: string; cta_label?: string; cta_url?: string; display_order?: number; active?: boolean; published?: boolean; created_at?: string; updated_at?: string }>;
      financing_partners: Table<Timestamps & { id: number; slug: string; name: string; logo_url: string | null; description: string; terms: Json; annual_rate: number | null; min_term_months: number | null; max_term_months: number | null; is_confirmed: boolean; published: boolean; display_order: number }, { id?: number; slug: string; name: string; logo_url?: string | null; description?: string; terms?: Json; annual_rate?: number | null; min_term_months?: number | null; max_term_months?: number | null; is_confirmed?: boolean; published?: boolean; display_order?: number; created_at?: string; updated_at?: string }>;
      vehicles: Table<Timestamps & { id: number; brand_id: number; slug: string; model: string; year: number; price_dh: number; mileage_km: number; fuel: string; transmission: string; power_cv: number | null; category: string; description: string; equipment: Json; images: Json; availability: string; published: boolean; featured: boolean; warranty_note: string | null; published_at: string | null }, { id?: number; brand_id: number; slug: string; model: string; year: number; price_dh: number; mileage_km: number; fuel: string; transmission: string; power_cv?: number | null; category: string; description: string; equipment?: Json; images?: Json; availability?: string; published?: boolean; featured?: boolean; warranty_note?: string | null; published_at?: string | null; created_at?: string; updated_at?: string }, Partial<{ brand_id: number; slug: string; model: string; year: number; price_dh: number; mileage_km: number; fuel: string; transmission: string; power_cv: number | null; category: string; description: string; equipment: Json; images: Json; availability: string; published: boolean; featured: boolean; warranty_note: string | null; published_at: string | null }>, [Relationship<"vehicles_brand_id_fkey", ["brand_id"], "brands", ["id"]>] >;
      blog_posts: Table<Timestamps & { id: number; slug: string; title: string; category: string; excerpt: string; body: string; image_url: string; author: string | null; reading_minutes: number; source_date: string | null; status: string; review_notes: string | null; published_at: string | null }, { id?: number; slug: string; title: string; category: string; excerpt: string; body: string; image_url?: string; author?: string | null; reading_minutes?: number; source_date?: string | null; status?: string; review_notes?: string | null; published_at?: string | null; created_at?: string; updated_at?: string }>;
      leads: Table<Timestamps & { id: number; submission_id: string; type: string; name: string; email: string | null; phone: string; vehicle_slug: string | null; message: string; details: Json; photo_paths: string[]; status: string; source_ip_hash: string | null }, { id?: number; submission_id: string; type: string; name: string; email?: string | null; phone: string; vehicle_slug?: string | null; message?: string; details?: Json; photo_paths?: string[]; status?: string; source_ip_hash?: string | null; created_at?: string; updated_at?: string }, Partial<{ submission_id: string; type: string; name: string; email: string | null; phone: string; vehicle_slug: string | null; message: string; details: Json; photo_paths: string[]; status: string; source_ip_hash: string | null }>, [Relationship<"leads_vehicle_slug_fkey", ["vehicle_slug"], "vehicles", ["slug"]>] >;
      site_settings: Table<{ key: string; value: string; is_public: boolean; updated_at: string }, { key: string; value?: string; is_public?: boolean; updated_at?: string }>;
    };
    Views: Record<never, never>;
    Functions: { is_auto_majorel_admin: { Args: Record<string, never>; Returns: boolean } };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js";
import type { Database } from "../../shared/database.types";
import { createRequestSupabase } from "../supabase";

export type AppUser = { id: string; email: string | null; role: string };

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  supabase: SupabaseClient<Database>;
  authUser: SupabaseUser | null;
  user: AppUser | null;
  isAdmin: boolean;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  const authorization = opts.req.headers.authorization;
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  const supabase = createRequestSupabase(accessToken);
  let authUser: SupabaseUser | null = null;
  let user: AppUser | null = null;
  let isAdmin = false;

  if (accessToken) {
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (!error && data.user) {
      authUser = data.user;
      const { data: membership, error: membershipError } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", data.user.id)
        .maybeSingle();
      const role = membershipError ? "user" : membership?.role ?? "user";
      user = { id: data.user.id, email: data.user.email ?? null, role };
      isAdmin = Boolean(membership && !membershipError && ["admin", "editor"].includes(role));
    }
  }

  return { req: opts.req, res: opts.res, supabase, authUser, user, isAdmin };
}

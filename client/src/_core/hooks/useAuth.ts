import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";

export function useAuth() {
  const utils = trpc.useUtils();
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const meQuery = trpc.auth.me.useQuery(undefined, { enabled: Boolean(session), retry: false, refetchOnWindowFocus: true, staleTime: 0 });

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setSessionLoading(false);
    }).catch(() => { if (active) setSessionLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSessionLoading(false);
      void utils.auth.me.invalidate();
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [utils.auth.me]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw new Error("Connexion impossible. Vérifiez vos identifiants ou contactez l’administrateur du projet.");
    await utils.auth.me.invalidate();
  }, [utils.auth.me]);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error("La déconnexion n’a pas pu être finalisée.");
    setSession(null);
    utils.auth.me.setData(undefined, null);
    await utils.auth.me.invalidate();
  }, [utils.auth.me]);

  return useMemo(() => {
    const user = meQuery.data ?? null;
    return {
      user,
      loading: sessionLoading || (Boolean(session) && meQuery.isLoading),
      error: meQuery.error ?? null,
      isAuthenticated: Boolean(session),
      isAdmin: user?.role === "admin" || user?.role === "editor",
      login,
      logout,
      refresh: () => meQuery.refetch(),
    };
  }, [session, sessionLoading, meQuery.data, meQuery.error, meQuery.isLoading, meQuery.refetch, login, logout]);
}

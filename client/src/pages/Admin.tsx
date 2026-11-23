import { useState, type FormEvent } from "react";
import { ExternalLink } from "lucide-react";
import { Link, useLocation } from "wouter";
import PageMeta from "@/components/site/PageMeta";
import BrandWordmark from "@/components/site/BrandWordmark";
import { useAuth } from "@/_core/hooks/useAuth";
import VehicleManager from "@/components/admin/VehicleManager";
import BlogManager from "@/components/admin/BlogManager";
import LeadInbox from "@/components/admin/LeadInbox";
import SiteSettingsManager from "@/components/admin/SiteSettingsManager";
import DashboardStats from "@/components/admin/DashboardStats";
import BrandManager from "@/components/admin/BrandManager";
import ServiceManager from "@/components/admin/ServiceManager";
import FinancingPartnerManager from "@/components/admin/FinancingPartnerManager";

const tabs = [["statistiques", "Vue d’ensemble"], ["vehicules", "Véhicules"], ["marques", "Marques"], ["services", "Services"], ["financement", "Financement"], ["articles", "Articles"], ["demandes", "Demandes"], ["parametres", "Coordonnées"]] as const;

export default function AdminPage() {
  const auth = useAuth();
  const [location] = useLocation();
  const [email, setEmail] = useState("bidieberny1@gmail.com");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginPending, setLoginPending] = useState(false);
  const section = location.split("/")[2] || "statistiques";

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setLoginPending(true);
    try {
      await auth.login(email, password);
      setPassword("");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Connexion impossible.");
    } finally {
      setLoginPending(false);
    }
  };

  return <div className="admin-shell">
    <PageMeta title="Administration — automajorelle" description="Espace privé de gestion automajorelle." noindex />
    <header className="admin-header"><Link href="/" aria-label="automajorelle"><BrandWordmark className="brand-wordmark--inverse" /></Link><div className="admin-header-actions"><Link className="button button-outline-light button-small" href="/">Voir le site</Link>{auth.isAuthenticated && <button className="button button-outline-light button-small" onClick={() => void auth.logout()}>Se déconnecter</button>}</div></header>
    {auth.loading ? <main className="admin-main"><div className="skeleton" /></main> : !auth.isAuthenticated ? <main className="admin-main"><div className="admin-login-card"><BrandWordmark /><span className="eyebrow">ESPACE PRIVÉ</span><h1>Administration</h1><p>Connectez-vous avec le compte administrateur autorisé pour gérer le site automajorelle.</p><div className="admin-access-note"><span className="eyebrow">BACKEND SUPABASE</span><p>Adresse autorisée : <strong>bidieberny1@gmail.com</strong>. Les comptes et les données sont gérés dans le projet sécurisé automajorelle.</p><a href="https://supabase.com/dashboard/project/vbcwmymamzrnenyilhau/auth/users" target="_blank" rel="noreferrer">Ouvrir les utilisateurs Supabase <ExternalLink size={13} /></a></div>{loginError && <div className="notice notice-error" role="alert">{loginError}</div>}<form className="admin-login-form" onSubmit={submitLogin}><label htmlFor="admin-email">E-mail administrateur</label><input id="admin-email" type="email" autoComplete="username" required maxLength={320} value={email} onChange={event => setEmail(event.target.value)} /><label htmlFor="admin-password">Mot de passe</label><input id="admin-password" type="password" autoComplete="current-password" required minLength={8} value={password} onChange={event => setPassword(event.target.value)} /><button className="button button-red" type="submit" disabled={loginPending}>{loginPending ? "Connexion…" : "Se connecter"}</button></form><p style={{ marginTop: 18 }}><Link className="link-arrow" href="/">Retour au site</Link></p></div></main> : !auth.isAdmin ? <main className="admin-main"><div className="admin-login-card"><h1>Accès non autorisé</h1><p>Ce compte est connecté, mais il n’est pas autorisé dans la liste des administrateurs automajorelle.</p><button className="button button-dark" onClick={() => void auth.logout()}>Changer de compte</button></div></main> : <main className="admin-main">
      <div className="admin-title-row"><div><span className="eyebrow">automajorelle · ESPACE PRIVÉ</span><h1>Gestion du site</h1></div><div className="field-help">Connecté : {auth.user?.email || "administrateur"}</div></div>
      <nav className="admin-tabs" aria-label="Sections d’administration">{tabs.map(([slug, label]) => <Link key={slug} className={`admin-tab ${section === slug ? "admin-tab-active" : ""}`} href={`/admin/${slug}`}>{label}</Link>)}</nav>
      {section === "statistiques" && <DashboardStats />}{section === "vehicules" && <VehicleManager />}{section === "marques" && <BrandManager />}{section === "services" && <ServiceManager />}{section === "financement" && <FinancingPartnerManager />}{section === "articles" && <BlogManager />}{section === "demandes" && <LeadInbox />}{section === "parametres" && <SiteSettingsManager />}{!tabs.some(([slug]) => slug === section) && <div className="admin-card">Section inconnue. Choisissez un onglet.</div>}
    </main>}
  </div>;
}

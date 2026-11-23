import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Phone, X } from "lucide-react";
import { useSiteSettings } from "@/lib/siteSettings";
import { LanguageSwitcher, useLanguage } from "@/lib/i18n";
import { WhatsAppLink } from "./Shared";
import { SOURCE_MEDIA } from "@shared/siteData";
import SocialLinks, { WhatsAppMark } from "./SocialLinks";
import AssistantChatWidget from "./AssistantChatWidget";

const navItems = [["Accueil", "/"], ["Véhicules", "/vehicules"], ["Services", "/services"], ["Financement", "/financement"], ["Reprise", "/reprise"], ["Blog", "/blog"], ["À propos", "/a-propos"], ["Contact", "/contact"]] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const contact = useSiteSettings();
  return <header className="site-header">
    <div className="topline"><div className="container topline-inner"><span>Marrakech · Showroom automobile</span><div className="topline-actions"><LanguageSwitcher /><a href={`tel:${contact.phoneRaw}`}><Phone size={13} /> {contact.phone}</a></div></div></div>
    <div className="container header-main">
      <Link href="/" className="brand-lockup" onClick={() => setOpen(false)} aria-label="automajorelle — Accueil"><img src={SOURCE_MEDIA.logo} alt="automajorelle" width="150" height="75" /></Link>
      <button className="menu-toggle" type="button" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav className={`primary-nav ${open ? "nav-open" : ""}`} aria-label="Navigation principale">{navItems.map(([label, href]) => { const active = location === href || (href !== "/" && location.startsWith(href)); return <Link key={href} href={href} className={active ? "nav-link nav-active" : "nav-link"} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>; })}<div className="mobile-nav-actions"><LanguageSwitcher /><WhatsAppLink message="Bonjour automajorelle, je souhaite en savoir plus." className="button button-whatsapp">WhatsApp</WhatsAppLink></div></nav>
      <div className="header-actions"><WhatsAppLink message="Bonjour automajorelle, je souhaite en savoir plus." className="button button-whatsapp header-whatsapp">WhatsApp</WhatsAppLink></div>
    </div>
  </header>;
}

export function SiteFooter() {
  const contact = useSiteSettings();
  return <footer className="site-footer"><div className="container footer-main">
    <div className="footer-brand"><Link href="/" aria-label="Accueil automajorelle"><img src={SOURCE_MEDIA.logo} alt="automajorelle" width="150" height="75" /></Link><p>Véhicules, financement et reprise à Marrakech.</p><SocialLinks /></div>
    <nav className="footer-nav" aria-label="Liens utiles">
      <div><h3>Découvrir</h3><Link href="/vehicules">Nos véhicules</Link><Link href="/services">Nos services</Link><Link href="/financement">Financement</Link><Link href="/reprise">Reprise</Link></div>
      <div><h3>automajorelle</h3><Link href="/blog">Conseils & actualités</Link><Link href="/a-propos">À propos</Link><Link href="/contact">Contact</Link><Link href="/garanties">Garanties</Link></div>
    </nav>
    <div className="footer-contact"><h3>Nous trouver</h3><a href={`tel:${contact.phoneRaw}`}>{contact.phone}</a><a href={`mailto:${contact.email}`}>{contact.email}</a><p>{contact.address}</p><a className="footer-map-link" href={contact.mapsDirectionsUrl} target="_blank" rel="noreferrer">Itinéraire Google Maps ↗</a></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} automajorelle · Marrakech</span><span>Informations commerciales à confirmer avec l’équipe avant votre visite.</span></div></footer>;
}

export function FloatingContact() {
  const contact = useSiteSettings();
  const { locale } = useLanguage();
  const labels = { fr: "Écrire à automajorelle sur WhatsApp", en: "Message automajorelle on WhatsApp", ar: "راسل automajorelle عبر واتساب" };
  const messages = { fr: "Bonjour automajorelle, je souhaite des informations.", en: "Hello automajorelle, I would like some information.", ar: "مرحبًا automajorelle، أود الحصول على معلومات." };
  return <a className="floating-whatsapp" href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(messages[locale])}`} target="_blank" rel="noopener noreferrer" aria-label={labels[locale]} title={labels[locale]}><WhatsAppMark /><span>WhatsApp</span></a>;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const contact = useSiteSettings();
  return <div className="site"><SiteHeader /><main>{children}</main><SiteFooter /><FloatingContact /><div className="mobile-action-bar" aria-label="Actions rapides"><a href={`tel:${contact.phoneRaw}`}><Phone size={16} /> Appeler</a><WhatsAppLink message="Bonjour automajorelle, je souhaite en savoir plus." className="mobile-action-whatsapp">WhatsApp</WhatsAppLink></div><AssistantChatWidget /></div>;
}

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "wouter";
import { useSiteSettings } from "@/lib/siteSettings";
import { translateText, useLanguage } from "@/lib/i18n";
import { WhatsAppMark } from "./SocialLinks";

export function SectionHeading({ eyebrow, title, description, light = false }: { eyebrow: string; title: string; description?: string; light?: boolean }) {
  return <div className={`section-heading ${light ? "section-heading-light" : ""}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        element.classList.add("is-visible");
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>{children}</div>;
}

export function WhatsAppLink({ children, message, className = "button button-whatsapp" }: { children: ReactNode; message?: string; className?: string }) {
  const contact = useSiteSettings(); const { locale } = useLanguage();
  const query = encodeURIComponent(translateText(message || "Bonjour Auto Majorelle, je souhaite obtenir des informations.", locale));
  return <a className={className} href={`https://wa.me/${contact.whatsapp}?text=${query}`} target="_blank" rel="noreferrer"><WhatsAppMark /> {children}</a>;
}

export function PrimaryLink({ href, children, className = "button button-dark" }: { href: string; children: ReactNode; className?: string }) {
  return <Link className={className} href={href}>{children}<ArrowRight size={16} aria-hidden="true" /></Link>;
}

export function ContactBand({ title = "Parlons de votre projet automobile.", text = "Notre équipe est à votre écoute pour vous orienter vers les bonnes informations." }: { title?: string; text?: string }) {
  const contact = useSiteSettings();
  return <section className="contact-band"><div className="container contact-band-inner"><div><span className="eyebrow eyebrow-light">AUTO MAJORELLE · MARRAKECH</span><h2>{title}</h2><p>{text}</p></div><div className="contact-band-actions"><a className="button button-light" href={`tel:${contact.phoneRaw}`}>Nous appeler <ArrowRight size={16} /></a><WhatsAppLink className="button button-outline-light">WhatsApp</WhatsAppLink></div></div></section>;
}

export function Notice({ children, kind = "info" }: { children: ReactNode; kind?: "info" | "success" | "error" }) {
  return <div className={`notice notice-${kind}`} role={kind === "error" ? "alert" : "status"}>{kind === "success" && <Check size={17} aria-hidden="true" />}{children}</div>;
}

export function PageIntro({ eyebrow, title, intro, image, imagePosition = "center" }: { eyebrow: string; title: string; intro: string; image?: string; imagePosition?: string }) {
  const style = image ? ({ "--page-intro-image": `url("${image}")`, "--page-intro-position": imagePosition } as CSSProperties) : undefined;
  return <section className={`page-intro${image ? " page-intro-photo" : ""}`} style={style}><div className="container"><div className="breadcrumb"><Link href="/">Accueil</Link><span> / </span><span>{eyebrow}</span></div><div className="page-intro-copy"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p>{image&&<div className="page-intro-proof"><span>Auto Majorelle</span><i aria-hidden="true"/><span>Votre concessionnaire à Marrakech</span></div>}</div></div></section>;
}

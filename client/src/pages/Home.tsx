import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import PageMeta from "@/components/site/PageMeta";
import { ContactBand, SectionHeading } from "@/components/site/Shared";
import VehicleCard from "@/components/site/VehicleCard";
import { GOOGLE_REVIEW_SNAPSHOT, SITE_CONTACT, SOURCE_MEDIA } from "@shared/siteData";
import { trpc } from "@/lib/trpc";
import { useSiteSettings } from "@/lib/siteSettings";
import { useLanguage } from "@/lib/i18n";

export default function Home() {
  const { locale } = useLanguage();
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const contact = useSiteSettings();
  const inventory = trpc.automajorel.inventory.list.useQuery({});
  const brandsQuery = trpc.automajorel.site.brands.useQuery();
  const vehicles = inventory.data ?? [];
  const brands = brandsQuery.data ?? [];
  const stockBrandNames = new Set(vehicles.map(vehicle => vehicle.brand.toLocaleLowerCase()));
  const stockBrands = brands.filter(brand => stockBrandNames.has(brand.name.toLocaleLowerCase()));
  const rating = locale === "en" ? GOOGLE_REVIEW_SNAPSHOT.rating.replace(",", ".") : GOOGLE_REVIEW_SNAPSHOT.rating;
  const reviewCount = GOOGLE_REVIEW_SNAPSHOT.count.split(" ")[0];

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    video.loop = true;
    const resumeVideo = () => {
      if (document.visibilityState === "visible" && video.paused) void video.play().catch(() => {});
    };
    video.addEventListener("canplay", resumeVideo);
    document.addEventListener("visibilitychange", resumeVideo);
    resumeVideo();
    return () => {
      video.removeEventListener("canplay", resumeVideo);
      document.removeEventListener("visibilitychange", resumeVideo);
    };
  }, []);

  return <>
    <PageMeta title="automajorelle — Concession automobile à Marrakech" description="Consultez le catalogue automajorelle à Marrakech, les informations du showroom et les moyens de contact." image="https://files.manuscdn.com/user_upload_by_module/session_file/310519663936004290/oUDvfFqktvDNXfey.jpg" />
    <main className="home-page">
      <section className="hero">
        <video ref={heroVideoRef} className="hero-video" autoPlay muted loop playsInline controls={false} disablePictureInPicture preload="metadata" poster={SOURCE_MEDIA.facade} aria-hidden="true" tabIndex={-1}>
          <source src="/assets/showroom-hero.mp4" type="video/mp4" />
        </video>
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow eyebrow-light">SHOWROOM automajorelle · SIDI GHANEM</span>
            <h1>À Marrakech,<br />la voiture se choisit <em>en vrai.</em></h1>
            <p>Parcourez le catalogue. Les fiches marquées DÉMO sont des exemples non disponibles à la vente.</p>
            <div className="hero-actions"><Link className="button button-red" href="/vehicules">Voir les véhicules <ArrowRight size={16} /></Link><Link className="button button-outline-light" href="/contact">Préparer ma visite</Link></div>
          </div>
          <aside className="hero-proof-card"><span className="eyebrow eyebrow-light">AU SHOWROOM</span><strong>Sidi Ghanem · Marrakech</strong><p>Vente · reprise · financement</p><span className="hero-proof-line" /><small>{contact.address}</small><Link href="/contact">Nous trouver <ArrowRight size={13} /></Link></aside>
        </div>
      </section>

      <section className="section section-surface home-stock-section" aria-labelledby="home-stock-title">
        <div className="container">
          <div className="section-topline"><SectionHeading eyebrow="CATALOGUE & DÉMOS" title="Les véhicules à découvrir" description="Les fiches marquées DÉMO sont des exemples et ne sont pas disponibles à la vente." /><Link className="link-arrow" href="/vehicules">Tout le catalogue <ArrowRight size={16} /></Link></div>
          {inventory.isLoading ? <div className="skeleton" aria-label="Chargement du stock" /> : inventory.error ? <div className="inventory-fallback"><h3>Le stock ne s’affiche pas pour le moment.</h3><p>Appelez l’équipe pour confirmer les véhicules actuellement disponibles.</p><a className="button button-dark button-small" href={`tel:${contact.phoneRaw}`}>Appeler le showroom</a></div> : vehicles.length ? <div className="home-featured-grid">{vehicles.slice(0, 3).map(vehicle => <VehicleCard vehicle={vehicle} key={vehicle.id} />)}</div> : <div className="inventory-fallback"><h3>Demandez les disponibilités du moment.</h3><p>Le catalogue en ligne ne contient pas d’annonce publiée. Contactez le showroom avant votre visite.</p><div className="inventory-actions"><a className="button button-dark button-small" href={`tel:${contact.phoneRaw}`}>Appeler le showroom</a><Link className="button button-outline button-small" href="/contact">Nous contacter</Link></div></div>}
        </div>
      </section>

      <section className="section home-proof-section">
        <div className="container home-proof-grid">
          <div className="home-proof-photo"><img src={SOURCE_MEDIA.showroomInterior} alt="Vue de l’intérieur du showroom automajorelle à Marrakech" loading="lazy" /><span className="eyebrow eyebrow-light">AUTOMAJORELLE · MARRAKECH</span></div>
          <div className="home-proof-copy"><span className="eyebrow">AVANCER AVEC DES INFORMATIONS VÉRIFIABLES</span><h2>Visitez. Examinez. Décidez avec l’équipe.</h2><p>Les informations et la disponibilité sont propres à chaque véhicule. Contactez le showroom pour confirmer les détails avant de vous déplacer.</p><div className="home-proof-points"><div><ShieldCheck size={18} /><span>Caractéristiques et prix sur les annonces publiées</span></div><div><MapPin size={18} /><span>Showroom à Sidi Ghanem, Marrakech</span></div></div><div className="home-proof-links"><Link className="button button-dark" href="/contact">Préparer une visite <ArrowRight size={15} /></Link><a className="link-arrow" href={SITE_CONTACT.googleProfileUrl} target="_blank" rel="noreferrer">Voir les avis Google · {rating}/5 · {reviewCount} avis <ArrowRight size={14} /></a></div></div>
        </div>
      </section>

      {stockBrands.length > 0 && <section className="section section-brands home-brands-section"><div className="container"><div className="section-topline"><SectionHeading eyebrow="MARQUES DU CATALOGUE" title="Parcourir par marque" description="Marques présentes dans les fiches du catalogue, y compris les exemples clairement marqués DÉMO." /><Link className="link-arrow" href="/vehicules">Voir le stock <ArrowRight size={15} /></Link></div><div className="home-brand-list">{stockBrands.slice(0, 8).map(brand => <span key={brand.id}>{brand.name}</span>)}</div></div></section>}

      <ContactBand title="Une question avant votre visite ?" text="Appelez le showroom ou écrivez directement à l’équipe." />
    </main>
  </>;
}

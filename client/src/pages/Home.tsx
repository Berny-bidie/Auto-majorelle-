import { ArrowRight, BadgeCheck, CarFront, KeyRound, MapPin, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "wouter";
import PageMeta from "@/components/site/PageMeta";
import { ContactBand, Reveal, SectionHeading, WhatsAppLink } from "@/components/site/Shared";
import HorizontalCarousel from "@/components/site/HorizontalCarousel";
import VehicleCard from "@/components/site/VehicleCard";
import HomeDetailDialog, { type HomeDetail } from "@/components/site/HomeDetailDialog";
import { GOOGLE_REVIEW_SNAPSHOT, GOOGLE_REVIEWS, SITE_CONTACT, SOURCE_MEDIA } from "@shared/siteData";
import { trpc } from "@/lib/trpc";
import { useSiteSettings } from "@/lib/siteSettings";
import { useLanguage } from "@/lib/i18n";

const showroomHighlights = [
  { name: "Le showroom Auto Majorelle", image: "/assets/vehicles/showroom-facade.jpg", maker: "Auto Majorelle", kind: "showroom" as const },
  { name: "Volkswagen Touareg", image: "/assets/vehicles/volkswagen-touareg.jpg", maker: "Volkswagen", kind: "vehicle" as const },
  { name: "Porsche Macan", image: "/assets/vehicles/porsche-macan.jpg", maker: "Porsche", kind: "vehicle" as const },
  { name: "Range Rover", image: "/assets/vehicles/range-rover.jpg", maker: "Range Rover", kind: "vehicle" as const },
  { name: "Dacia Logan", image: "/assets/vehicles/dacia-logan.jpg", maker: "Dacia", kind: "vehicle" as const },
  { name: "Kia Sportage", image: "/assets/vehicles/kia-sportage.jpg", maker: "Kia", kind: "vehicle" as const },
  { name: "MINI Cooper", image: "/assets/vehicles/mini-cooper.jpg", maker: "MINI", kind: "vehicle" as const },
  { name: "Range Rover Sport", image: "/assets/vehicles/range-rover-sport.jpg", maker: "Range Rover", kind: "vehicle" as const },
];

const archivedPartnerLogos = [
  { name: "Bank Al Yousr", logo: "/assets/partners/bank-al-yousr.png" },
  { name: "SOFAC", logo: "/assets/partners/sofac.png" },
  { name: "Wafasalaf", logo: "/assets/partners/wafasalaf.png" },
  { name: "Salafin", logo: "/assets/partners/salafin.png" },
  { name: "Maghrebail", logo: "/assets/partners/maghrebail.png" },
  { name: "Vivalis Salaf", logo: "/assets/partners/vivalis.png" },
];

const activityCards = [
  { icon: CarFront, eyebrow: "ACHETER", title: "Trouver votre prochain véhicule", text: "Parcourez les modèles présentés par Auto Majorelle et demandez les informations utiles avant votre visite.", href: "/vehicules", label: "Voir le catalogue" },
  { icon: KeyRound, eyebrow: "REPRISE", title: "Faire étudier votre voiture", text: "Transmettez les caractéristiques et quelques photos de votre véhicule pour préparer un échange avec l’équipe.", href: "/reprise", label: "Demander une étude" },
  { icon: ShieldCheck, eyebrow: "FINANCEMENT", title: "Construire votre projet", text: "Découvrez les étapes et les conditions à confirmer pour avancer avec une vision claire de votre projet automobile.", href: "/financement", label: "Voir les étapes" },
];

const exploreCards = [
  { eyebrow: "LE STOCK", title: "Trouver votre prochaine voiture", text: "Parcourez les annonces publiées et demandez les informations utiles avant votre visite.", href: "/vehicules", label: "Parcourir les véhicules", tone: "red" },
  { eyebrow: "REPRISE", title: "Donner une nouvelle valeur à votre véhicule", text: "Présentez votre véhicule à l’équipe pour étudier une reprise selon votre situation.", href: "/reprise", label: "Découvrir la reprise", tone: "dark" },
  { eyebrow: "FINANCEMENT", title: "Préparer votre projet sans promesse floue", text: "Les paramètres et conditions sont expliqués uniquement lorsqu’ils sont confirmés.", href: "/financement", label: "Voir le financement", tone: "light" },
  { eyebrow: "SERVICES", title: "Un accompagnement au même endroit", text: "Recherche, conseil, visite et démarches : avancez avec l’équipe Auto Majorelle.", href: "/services", label: "Explorer les services", tone: "light" },
];

const whyCards = [
  { eyebrow: "TRANSPARENCE", title: "Des informations lisibles", text: "Chaque annonce rassemble les éléments disponibles et vous invite à demander un complément si nécessaire.", image: SOURCE_MEDIA.showroomInterior },
  { eyebrow: "DÉTAILS", title: "Regarder la voiture en vrai", text: "Les photos donnent un premier aperçu ; la visite permet de vérifier les détails et de poser les bonnes questions.", image: SOURCE_MEDIA.porscheInterior },
  { eyebrow: "ACCOMPAGNEMENT", title: "Un échange au cas par cas", text: "Reprise et financement sont étudiés selon votre véhicule, votre recherche et les conditions confirmées.", image: SOURCE_MEDIA.rangeInterior },
  { eyebrow: "MARRAKECH", title: "Un showroom à Alfa 2000", text: "Retrouvez l’équipe à l’angle des avenues Allal El Fassi et Yaakoub El Mansour, après confirmation de votre passage.", image: SOURCE_MEDIA.facade },
];

const marrakechEditorial = [
  { image: SOURCE_MEDIA.facade, alt: "Façade du showroom Auto Majorelle à Marrakech", label: "Le showroom" },
  { image: SOURCE_MEDIA.showroomInterior, alt: "Intérieur du showroom Auto Majorelle", label: "Sur place" },
  { image: SOURCE_MEDIA.showroomRear, alt: "Véhicule présenté chez Auto Majorelle", label: "Sélection" },
];

export default function Home() {
  const { locale } = useLanguage();
  const [activeDetail, setActiveDetail] = useState<HomeDetail | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const contact = useSiteSettings();
  const inventory = trpc.automajorel.inventory.list.useQuery({});
  const brandsQuery = trpc.automajorel.site.brands.useQuery();
  const partnersQuery = trpc.automajorel.site.financingPartners.useQuery();
  const vehicles = inventory.data ?? [];
  const brands = brandsQuery.data ?? [];
  const reviewCount = GOOGLE_REVIEW_SNAPSHOT.count.split(" ")[0];
  const snapshotText = locale === "ar" ? `${reviewCount} مراجعة · تم التحقق في 15 نوفمبر 2026` : locale === "en" ? `${reviewCount} reviews · checked November 15, 2026` : `${GOOGLE_REVIEW_SNAPSHOT.count} · relevé le ${GOOGLE_REVIEW_SNAPSHOT.checkedAt}`;
  const snapshotNote = locale === "ar" ? "عنوان Google يختلف عن Alfa 2000؛ تحقق قبل الزيارة." : locale === "en" ? "Google shows a different address than Alfa 2000; check before visiting." : "L’adresse Google diffère de celle d’Alfa 2000 ; vérifiez avant de venir.";
  const snapshotRating = locale === "en" ? GOOGLE_REVIEW_SNAPSHOT.rating.replace(",", ".") : GOOGLE_REVIEW_SNAPSHOT.rating;
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    video.loop = true;
    const resumeVideo = () => {
      if (document.visibilityState === "visible" && video.paused) void video.play().catch(() => {});
    };
    video.addEventListener("canplay", resumeVideo);
    video.addEventListener("pause", resumeVideo);
    document.addEventListener("visibilitychange", resumeVideo);
    resumeVideo();
    return () => {
      video.removeEventListener("canplay", resumeVideo);
      video.removeEventListener("pause", resumeVideo);
      document.removeEventListener("visibilitychange", resumeVideo);
    };
  }, []);
  const openHighlight = (item: typeof showroomHighlights[number]) => {
    if (item.kind === "showroom") {
      setActiveDetail({ kind: "showroom", title: item.name, image: item.image, caption: `Showroom Auto Majorelle · ${contact.address}` });
      return;
    }
    const brand = brands.find(candidate => candidate.name === item.maker);
    setActiveDetail({ kind: "vehicle", title: item.name, image: item.image, maker: item.maker, officialUrl: brand?.officialUrl || undefined, officialRegion: brand?.officialRegion ?? undefined });
  };

  return <>
    <PageMeta title="Auto Majorelle — Concession automobile à Marrakech" description="Découvrez les véhicules publiés par Auto Majorelle à Marrakech, les solutions de financement, la reprise et les informations du showroom." image="https://files.manuscdn.com/user_upload_by_module/session_file/310519663936004290/oUDvfFqktvDNXfey.jpg" />
    <main className="home-page">
    <section className="hero">
      <video ref={heroVideoRef} className="hero-video" autoPlay muted loop playsInline controls={false} disablePictureInPicture preload="auto" poster={SOURCE_MEDIA.facade} aria-hidden="true" tabIndex={-1}>
        <source src="/assets/showroom-hero.mp4" type="video/mp4" />
      </video>
      <div className="container hero-inner"><div className="hero-copy">
        <span className="eyebrow eyebrow-light">SHOWROOM AUTO MAJORELLE · ALFA 2000</span>
        <h1>À Marrakech,<br />la voiture se choisit <em>en vrai.</em></h1>
        <p>Découvrez les véhicules présentés chez Auto Majorelle. Parcourez les annonces, puis contactez l’équipe pour confirmer la disponibilité et préparer votre visite.</p>
        <div className="hero-actions"><Link className="button button-red" href="/vehicules">Voir les véhicules <ArrowRight size={16} /></Link><Link className="button button-outline-light" href="/contact">Préparer ma visite</Link></div>
      </div><aside className="hero-proof-card"><span className="eyebrow eyebrow-light">AU SHOWROOM</span><strong>Alfa 2000</strong><p>Vente · reprise · financement</p><span className="hero-proof-line" /><small>Angle Av. Allal El Fassi & Av. Yaakoub El Mansour</small><Link href="/contact">Préparer un passage <ArrowRight size={13} /></Link></aside><div className="hero-scroll-cue"><span>FAIRE DÉFILER</span><i /></div></div>
    </section>

    <section className="trust-strip" aria-label="Points de contact Auto Majorelle"><div className="container trust-strip-inner">
      <a className="trust-item" href={contact.mapsDirectionsUrl} target="_blank" rel="noreferrer"><span className="trust-label">SHOWROOM</span><b>Alfa 2000 · Marrakech <ArrowRight size={12} /></b></a>
      <div className="trust-item"><span className="trust-label">HORAIRES</span><b>{contact.hours}</b></div>
      <a className="trust-item trust-item-rating" href={SITE_CONTACT.googleProfileUrl} target="_blank" rel="noreferrer"><span className="trust-label">AVIS GOOGLE</span><b><span className="trust-stars">★★★★★</span> {snapshotRating} · {GOOGLE_REVIEW_SNAPSHOT.count}</b></a>
    </div></section>

    <section className="section section-vehicle-highlights"><div className="container">
      <div className="section-topline"><SectionHeading eyebrow="AU SHOWROOM" title="Un aperçu en images." description="Cliquez sur un modèle pour ouvrir sa fiche et demander sa disponibilité." /><Link className="link-arrow" href="/vehicules">Parcourir les annonces <ArrowRight size={16} /></Link></div>
      <HorizontalCarousel label="Images du showroom et des véhicules" className="vehicle-highlight-carousel" autoPlay={!activeDetail}>
        {showroomHighlights.map(item => <button type="button" className="vehicle-highlight-card carousel-item" key={item.name} onClick={() => openHighlight(item)} aria-label={`Ouvrir les détails : ${item.name}`}><img src={item.image} alt="" loading="lazy" /><span className="vehicle-highlight-caption"><strong>{item.name}</strong><span>Voir les détails <ArrowRight size={13} /></span></span></button>)}
      </HorizontalCarousel>
    </div></section>

    <section className="section"><div className="container intro-grid">
      <div><span className="eyebrow">DE LA DÉCOUVERTE À LA VISITE</span><h2 className="intro-title">D’abord découvrir.<br /><span>Ensuite, vérifier.</span></h2></div>
      <div className="intro-aside">Un appel à l’équipe permet de confirmer la disponibilité d’un modèle et de préparer votre visite au showroom.</div>
    </div></section>

    <section className="section section-local-guide"><div className="container local-guide-layout"><div className="local-guide-copy"><span className="eyebrow">GUIDE AUTO · MARRAKECH</span><h2>Choisir une voiture d’occasion avec les bonnes informations.</h2><p>Vous cherchez une citadine, une berline, un SUV, une familiale ou un utilitaire à Marrakech ? Auto Majorelle vous permet de parcourir les véhicules présentés, de poser vos questions et de préparer une visite au showroom d’Alfa 2000.</p><p>Les informations, la disponibilité, le financement et la reprise sont étudiés avec l’équipe selon votre projet. Avant de vous déplacer, confirmez toujours le modèle et les modalités qui vous intéressent.</p><div className="local-guide-actions"><Link className="button button-dark" href="/vehicules">Explorer les véhicules <ArrowRight size={16} /></Link><Link className="link-arrow" href="/contact">Parler à l’équipe <ArrowRight size={14} /></Link></div></div><div className="local-guide-facts" aria-label="Parcours Auto Majorelle"><div><strong>01</strong><span>Parcourir les annonces publiées</span></div><div><strong>02</strong><span>Comparer les informations utiles</span></div><div><strong>03</strong><span>Confirmer la visite à Marrakech</span></div></div></div></section>

    <section className="section section-activity"><div className="container"><div className="section-heading"><span className="eyebrow">AUTO MAJORELLE EN PRATIQUE</span><h2>Que souhaitez-vous faire&nbsp;?</h2><p>Choisissez votre parcours : acheter, faire étudier une reprise ou préparer votre financement à Marrakech.</p></div><div className="activity-grid">{activityCards.map(({ icon: Icon, eyebrow, title, text, href, label }, index) => <Reveal className="activity-reveal" delay={index * 90} key={title}><article className="activity-card"><div className="activity-icon"><Icon size={21} /></div><span className="eyebrow">{eyebrow}</span><h3>{title}</h3><p>{text}</p><Link className="link-arrow" href={href}>{label} <ArrowRight size={14} /></Link></article></Reveal>)}</div></div></section>

    <section className="section section-why"><div className="container"><div className="section-topline"><SectionHeading eyebrow="POURQUOI AUTO MAJORELLE" title="Un choix à regarder de près." description="Une expérience locale, des informations à vérifier et un showroom pour avancer avec une vision claire." /><span className="why-index">04 REPÈRES</span></div><div className="why-grid">{whyCards.map((card, index) => <Reveal className="why-reveal" delay={index * 80} key={card.title}><article className="why-card" style={{ "--why-image": `url("${card.image}")` } as CSSProperties}><div className="why-card-content"><span className="eyebrow eyebrow-light">{card.eyebrow}</span><h3>{card.title}</h3><p>{card.text}</p></div></article></Reveal>)}</div></div></section>

    <section className="section section-explore"><div className="container"><div className="section-topline"><SectionHeading eyebrow="PARCOURIR AUTO MAJORELLE" title="Votre projet commence ici." description="Explorez les différentes étapes et trouvez rapidement le chemin qui vous correspond." /><span className="explore-index">01 — 04</span></div><div className="explore-grid">{exploreCards.map(card => <Link className={`explore-card explore-card-${card.tone}`} href={card.href} key={card.title}><span className="explore-card-number">{String(exploreCards.indexOf(card) + 1).padStart(2, "0")}</span><span className="eyebrow">{card.eyebrow}</span><h3>{card.title}</h3><p>{card.text}</p><span className="explore-card-link">{card.label} <ArrowRight size={15} /></span></Link>)}</div></div></section>

    <section className="section section-editorial"><div className="container editorial-layout"><div className="editorial-copy"><span className="eyebrow">MARRAKECH · ALFA 2000</span><h2>Voir la voiture autrement.</h2><p>Chez Auto Majorelle, le choix ne s’arrête pas à une fiche en ligne. Le showroom permet de regarder les détails, poser les bonnes questions et préparer une visite avec l’équipe.</p><p className="editorial-address"><MapPin size={15} /> Angle Av. Allal El Fassi & Av. Yaakoub El Mansour, Alfa 2000</p><div className="editorial-actions"><Link className="button button-dark" href="/a-propos">Découvrir le showroom</Link><Link className="link-arrow" href="/contact">Obtenir l’itinéraire <ArrowRight size={14} /></Link></div></div><div className="editorial-photo-grid">{marrakechEditorial.map((photo, index) => <button type="button" className={`editorial-photo editorial-photo-${index + 1}`} key={photo.label} onClick={() => setActiveDetail({ kind: "showroom", title: photo.label, image: photo.image, caption: `Auto Majorelle · ${contact.address}` })} aria-label={`Voir ${photo.label}`}><img src={photo.image} alt={photo.alt} loading="lazy" /><span>{photo.label}</span></button>)}</div></div></section>

    <section className="section section-surface"><div className="container">
      {vehicles.length ? <><div className="section-topline"><SectionHeading eyebrow="LE STOCK DU MOMENT" title="En ce moment au showroom" description="Consultez les annonces et leurs informations détaillées." /><Link className="link-arrow" href="/vehicules">Voir tous les véhicules <ArrowRight size={16} /></Link></div><HorizontalCarousel label="Véhicules disponibles au showroom" className="home-stock-carousel">{vehicles.slice(0, 6).map(vehicle=><div className="carousel-item home-stock-item" key={vehicle.id}><VehicleCard vehicle={vehicle} /></div>)}</HorizontalCarousel></> : <div className="empty-inventory"><div className="empty-inventory-copy"><span className="eyebrow">DISPONIBILITÉS</span><h2>Vous recherchez un modèle précis&nbsp;?</h2><p>Appelez ou écrivez à l’équipe pour connaître les véhicules actuellement présentés avant de vous déplacer.</p><div className="inventory-actions"><a className="button button-light button-small" href={`tel:${contact.phoneRaw}`}>Appeler le showroom</a><WhatsAppLink className="button button-outline-light button-small">Écrire sur WhatsApp</WhatsAppLink></div></div><button type="button" className="empty-inventory-photo" onClick={() => setActiveDetail({ kind: "showroom", title: "Le showroom Auto Majorelle", image: SOURCE_MEDIA.showroomInterior, caption: `Showroom Auto Majorelle · ${contact.address}` })} aria-label="Ouvrir les détails du showroom"><img src={SOURCE_MEDIA.showroomInterior} alt="" loading="lazy" /><span>Voir le showroom <ArrowRight size={14} /></span></button></div>}
    </div></section>

    <section className="section section-brands"><div className="container">
      <SectionHeading eyebrow="UN LARGE CHOIX DE MARQUES" title="Les marques à découvrir" description="Cliquez sur un logo pour ouvrir le site officiel du constructeur." />
      {brandsQuery.isLoading ? <div className="skeleton" /> : brandsQuery.error ? <p className="notice notice-error">Les marques ne peuvent pas être chargées pour le moment.</p> : brands.length ? <HorizontalCarousel label="Logos des marques automobiles" className="brand-logo-carousel" autoPlay={!activeDetail}>
        {brands.map(brand => <button type="button" className="brand-logo-card carousel-item" key={brand.id} onClick={() => setActiveDetail({ kind: "brand", title: brand.name, image: brand.logoUrl, officialUrl: brand.officialUrl || undefined, officialRegion: brand.officialRegion ?? undefined })} aria-label={`Détails et site officiel : ${brand.name}`}>{brand.logoUrl ? <img src={brand.logoUrl} alt="" loading="lazy" /> : <strong>{brand.name}</strong>}<span>{brand.name}</span></button>)}
      </HorizontalCarousel> : <p>Aucune marque n’est publiée.</p>}
    </div></section>

    <section className="section section-surface"><div className="container story-grid">
      <button type="button" className="story-image" onClick={() => setActiveDetail({ kind: "showroom", title: "Auto Majorelle · Alfa 2000", image: SOURCE_MEDIA.facade, caption: `Façade du showroom · ${contact.address}` })} aria-label="Ouvrir les détails du showroom Auto Majorelle"><img src={SOURCE_MEDIA.facade} alt="" loading="lazy" /><span className="story-image-caption">Voir le showroom <ArrowRight size={13} /></span></button>
      <div className="story-copy"><span className="eyebrow">À PROPOS</span><h2>Un showroom à Alfa 2000, Marrakech.</h2><p>Vente de véhicules, reprise et financement : Auto Majorelle réunit ces démarches au même endroit. Retrouvez l’équipe au showroom pour examiner un véhicule, poser vos questions et connaître les modalités adaptées à votre situation.</p><div className="story-points"><div className="story-point"><BadgeCheck size={16} /> Annonces et détails véhicule</div><div className="story-point"><ShieldCheck size={16} /> Conditions expliquées au cas par cas</div><div className="story-point"><MapPin size={16} /> Angle Allal El Fassi & Yaakoub El Mansour</div><div className="story-point"><KeyRound size={16} /> Reprise et financement à étudier</div></div><Link className="link-arrow" href="/a-propos">L’histoire du showroom <ArrowRight size={16} /></Link></div>
    </div></section>

    <section className="section"><div className="container">
      <div className="section-topline"><SectionHeading eyebrow="AVIS GOOGLE" title="Les mots de nos clients" description="Avis publiés sur la fiche Google d’Auto Majorelle; consultez la fiche pour les informations à jour." /><a className="link-arrow" href={SITE_CONTACT.googleProfileUrl} target="_blank" rel="noreferrer">Tous les avis Google <ArrowRight size={16} /></a></div>
      <div className="review-summary"><strong className="review-score">{snapshotRating}</strong><span className="review-stars" aria-label="5 étoiles sur 5">★★★★★</span><span className="review-source">{snapshotText}<br />{snapshotNote}</span></div>
      <div className="review-proof-rail" aria-label="Repères des avis clients"><div><strong>49</strong><span>Avis relevés</span></div><div><strong>5/5</strong><span>Étoiles affichées</span></div><div><strong>Google</strong><span>Source consultable</span></div></div>
      <HorizontalCarousel label="Avis clients" className="review-carousel" autoPlay>
        {GOOGLE_REVIEWS.map(review => <article className="review-card carousel-item" key={review.name}><div className="review-stars" aria-label={`${review.rating} étoiles sur 5`}>★★★★★</div><blockquote>{review.text}</blockquote><div className="review-person"><div>{review.name}<small>{`Source : fiche Google · ${review.date}`}</small></div><span>Google</span></div></article>)}
      </HorizontalCarousel>
    </div></section>

    <section className="section section-dark section-tight"><div className="container story-grid" style={{ gap: 45 }}><Reveal><div className="story-copy"><span className="eyebrow eyebrow-light">FINANCEMENT & PARTENAIRES</span><h2>Un projet à étudier selon votre situation.</h2><p>Parlez-nous de votre recherche. Les solutions, organismes et conditions sont présentés selon les informations vérifiées pour chaque dossier; aucune mensualité ou taux n’est présumé.</p><div className="finance-home-points"><div><strong>01</strong><span>Budget et apport indicatifs</span></div><div><strong>02</strong><span>Étude selon votre dossier</span></div><div><strong>03</strong><span>Conditions confirmées avant décision</span></div></div><Link className="button button-red" href="/financement">Découvrir le financement <ArrowRight size={16} /></Link></div></Reveal><Reveal delay={120}><div className="partner-carousel-wrap">{partnersQuery.isLoading ? <div className="skeleton" /> : partnersQuery.error ? <p className="partner-disclaimer">Les partenaires ne peuvent pas être chargés pour le moment.</p> : partnersQuery.data?.length ? <><HorizontalCarousel label="Organismes de financement confirmés" className="partner-carousel" autoPlay>{partnersQuery.data.map(partner => <div className="partner-card carousel-item" key={partner.id}>{partner.logoUrl ? <img src={partner.logoUrl} alt={partner.name} loading="lazy" /> : <strong>{partner.name}</strong>}</div>)}</HorizontalCarousel><p className="partner-disclaimer">Partenaires et informations affichés après confirmation.</p></> : <><div className="partner-archive-strip">{archivedPartnerLogos.map(partner => <div className="partner-card partner-card-archived" key={partner.name}><img src={partner.logo} alt={partner.name} loading="lazy" /><span className="partner-state">À confirmer</span></div>)}</div><p className="partner-disclaimer">Logos présents dans le dossier historique ; aucun accord n’est publié tant que les conditions ne sont pas confirmées.</p></>}</div></Reveal></div></section>

    <ContactBand title="Une question avant votre visite ?" text="Appelez le showroom ou écrivez directement à l’équipe." />
    <HomeDetailDialog detail={activeDetail} onClose={() => setActiveDetail(null)} />
    </main>
  </>;
}

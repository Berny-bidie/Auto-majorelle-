import { ArrowRight, BadgeCheck, CarFront, Handshake, MessageCircle, Search, ShieldCheck, Wrench, type LucideIcon } from "lucide-react";
import { Link } from "wouter";
import PageMeta from "@/components/site/PageMeta";
import { ContactBand, PageIntro, SectionHeading } from "@/components/site/Shared";
import { getLocalizedFallbackServices } from "@/data/fallbackEditorialContent";
import { genericServiceCopy, localizedServices } from "@/data/localizedServices";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/lib/i18n";

const serviceIcons: Record<string, LucideIcon> = { "car-front": CarFront, handshake: Handshake, search: Search, wrench: Wrench, "shield-check": ShieldCheck, "message-circle": MessageCircle };

export default function ServicesPage() {
  const { locale } = useLanguage();
  const services = trpc.automajorel.site.services.useQuery();
  const serviceCards = services.data?.length
    ? services.data.map(service => {
        const content = localizedServices[service.slug] ?? genericServiceCopy;
        return { ...service, name: content.name[locale], description: content.description[locale], ctaLabel: content.ctaLabel[locale] };
      })
    : getLocalizedFallbackServices(locale);
  return <>
    <PageMeta title="Services automobiles à Marrakech — Auto Majorelle" description="Vente de véhicules, échange sur le financement et formulaire de reprise automobile à Marrakech. Consultez les conditions directement avec Auto Majorelle." />
    <PageIntro eyebrow="NOS SERVICES" title="Un accompagnement adapté à votre projet." intro="Retrouvez les principaux parcours proposés par le showroom Auto Majorelle à Marrakech, avec des informations claires et un interlocuteur direct." image="/assets/showroom/majorelle-auto-showroom.jpg" imagePosition="center 58%" />
    <section className="section"><div className="container"><SectionHeading eyebrow="VOTRE PARCOURS" title="Commencer par le bon échange" description="Choisissez une étape pour obtenir les renseignements qui correspondent à votre situation." />{services.error && <p className="notice notice-error">{locale === "en" ? "Services are temporarily unavailable; the essential information remains available below." : locale === "ar" ? "الخدمات غير متاحة مؤقتًا؛ المعلومات الأساسية متاحة أدناه." : "Les services sont momentanément indisponibles; les informations essentielles restent disponibles ci-dessous."}</p>}{!services.data?.length && !services.isLoading && !services.error && <p className="notice notice-info" role="status">{locale === "en" ? "Essential information is available here; services published in the admin area will appear when added." : locale === "ar" ? "المعلومات الأساسية متاحة هنا؛ وستظهر الخدمات المنشورة من لوحة الإدارة عند إضافتها." : "Les informations essentielles restent disponibles ici; les services publiés depuis l’administration s’afficheront dès qu’ils seront renseignés."}</p>}<div className="service-grid">{serviceCards.map(service => { const Icon = serviceIcons[service.icon] ?? MessageCircle; return <article key={service.id} className="service-card"><span className="service-icon"><Icon size={20} /></span><h3>{service.name}</h3><p>{service.description}</p><Link className="link-arrow" href={service.ctaUrl}>{service.ctaLabel} <ArrowRight size={14} /></Link></article>; })}</div></div></section>
    <section className="section section-surface"><div className="container story-grid"><div className="story-copy"><span className="eyebrow">TRANSPARENCE</span><h2>Les informations importantes, voiture par voiture.</h2><p>Les caractéristiques et la disponibilité d’un véhicule sont propres à chaque annonce. Contactez l’équipe pour confirmer l’état, les équipements, les documents et les conditions avant de vous déplacer.</p><ul className="check-list"><li><BadgeCheck size={17} /> Détails de l’annonce et photos disponibles</li><li><ShieldCheck size={17} /> Conditions de garantie à confirmer pour chaque véhicule</li><li><MessageCircle size={17} /> Échange direct par téléphone ou WhatsApp</li></ul><Link className="button button-dark" href="/contact">Contacter l’équipe <ArrowRight size={15} /></Link></div><figure className="service-showcase"><img src="/assets/showroom/interior-range-rover-red.jpg" alt="Habitacle d’un véhicule photographié dans le showroom Auto Majorelle" loading="lazy" /><figcaption><span className="service-showcase-kicker">AUTO MAJORELLE · MARRAKECH</span><strong>Une visite au showroom, pour examiner le véhicule.</strong><Link href="/vehicules">Voir les véhicules <ArrowRight size={14} /></Link></figcaption></figure></div></section>
    <ContactBand title="Vous avez une question précise ?" text="Écrivez-nous ou appelez le showroom; l’équipe vous indiquera les informations vérifiées pour votre demande." />
  </>;
}

export function GuaranteesPage() {
  return <>
    <PageMeta title="Garanties automobiles — Auto Majorelle Marrakech" description="Demandez les conditions de garantie, d’inspection et d’assistance applicables à chaque véhicule Auto Majorelle à Marrakech." />
    <PageIntro eyebrow="GARANTIES & SUIVI" title="Des conditions à connaître avant de décider." intro="Les couvertures et prestations peuvent dépendre du véhicule. Demandez au showroom les conditions écrites qui s’appliquent à l’annonce concernée." image="/assets/showroom/showroom-mini-front.jpg" imagePosition="center 52%" />
    <section className="page-content"><div className="container two-col"><div className="prose"><h2>Des conditions propres à chaque véhicule</h2><p>Une garantie, une inspection ou un accompagnement après-vente ne se résume pas à une promesse générale. Les conditions dépendent du véhicule et des éléments confirmés par l’équipe Auto Majorelle. Avant de décider, demandez les informations écrites qui correspondent à l’annonce consultée.</p><h2>Les points à clarifier</h2><ul><li>La durée et le périmètre exacts de la couverture.</li><li>Les pièces, organes et éventuelles exclusions.</li><li>Les modalités de prise en charge et le contact après-vente.</li><li>Les contrôles réalisés et les documents disponibles.</li></ul><p>La disponibilité, l’état, les équipements et les conditions applicables sont à confirmer avec le showroom avant tout déplacement.</p></div><aside className="info-card"><span className="service-icon"><ShieldCheck size={20} /></span><h3>Une question sur une annonce&nbsp;?</h3><p>Indiquez la marque, le modèle ou le lien de la fiche pour obtenir une réponse adaptée.</p><Link className="button button-red" href="/contact">Demander les conditions</Link></aside></div></section>
    <ContactBand title="Clarifiez chaque condition avant l’achat." text="Nous vous aiderons à obtenir les informations propres au véhicule qui vous intéresse." />
  </>;
}

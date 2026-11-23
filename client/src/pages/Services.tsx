import { useState } from "react";
import { ArrowRight, BadgeCheck, CarFront, Handshake, MessageCircle, Search, ShieldCheck, Wrench, type LucideIcon } from "lucide-react";
import { Link } from "wouter";
import PageMeta from "@/components/site/PageMeta";
import { ContactBand, PageIntro, SectionHeading } from "@/components/site/Shared";
import { trpc } from "@/lib/trpc";

const serviceIcons: Record<string, LucideIcon> = { "car-front": CarFront, handshake: Handshake, search: Search, wrench: Wrench, "shield-check": ShieldCheck, "message-circle": MessageCircle };

export default function ServicesPage() {
  const services = trpc.automajorel.site.services.useQuery();
  return <>
    <PageMeta title="Services automobiles à Marrakech — automajorelle" description="Vente de véhicules, échange sur le financement et formulaire de reprise automobile à Marrakech. Consultez les conditions directement avec automajorelle." />
    <PageIntro eyebrow="NOS SERVICES" title="Un accompagnement adapté à votre projet." intro="Retrouvez les principaux parcours proposés par le showroom automajorelle à Marrakech, avec des informations claires et un interlocuteur direct." image="/assets/showroom/majorelle-auto-showroom.jpg" imagePosition="center 58%" />
    <section className="section"><div className="container"><SectionHeading eyebrow="VOTRE PARCOURS" title="Commencer par le bon échange" description="Choisissez une étape pour obtenir les renseignements qui correspondent à votre situation." />{services.isLoading ? <div className="skeleton" /> : services.error ? <p className="notice notice-error">Les services ne peuvent pas être chargés pour le moment.</p> : services.data?.length ? <div className="service-grid">{services.data.map(service => { const Icon = serviceIcons[service.icon] ?? MessageCircle; return <article key={service.id} className="service-card"><span className="service-icon"><Icon size={20} /></span><h3>{service.name}</h3><p>{service.description}</p><Link className="link-arrow" href={service.ctaUrl}>{service.ctaLabel} <ArrowRight size={14} /></Link></article>; })}</div> : <p>Aucun service n’est publié pour le moment.</p>}</div></section>
    <section className="section section-surface"><div className="container story-grid"><div className="story-copy"><span className="eyebrow">TRANSPARENCE</span><h2>Les informations importantes, voiture par voiture.</h2><p>Les caractéristiques et la disponibilité d’un véhicule sont propres à chaque annonce. Contactez l’équipe pour confirmer l’état, les équipements, les documents et les conditions avant de vous déplacer.</p><ul className="check-list"><li><BadgeCheck size={17} /> Détails de l’annonce et photos disponibles</li><li><ShieldCheck size={17} /> Conditions de garantie à confirmer pour chaque véhicule</li><li><MessageCircle size={17} /> Échange direct par téléphone ou WhatsApp</li></ul><Link className="button button-dark" href="/contact">Contacter l’équipe <ArrowRight size={15} /></Link></div><figure className="service-showcase"><img src="/assets/showroom/interior-range-rover-red.jpg" alt="Habitacle d’un véhicule photographié dans le showroom automajorelle" loading="lazy" /><figcaption><span className="service-showcase-kicker">automajorelle · MARRAKECH</span><strong>Une visite au showroom, pour examiner le véhicule.</strong><Link href="/vehicules">Voir les véhicules <ArrowRight size={14} /></Link></figcaption></figure></div></section>
    <ContactBand title="Vous avez une question précise ?" text="Écrivez-nous ou appelez le showroom; l’équipe vous indiquera les informations vérifiées pour votre demande." />
  </>;
}

export function GuaranteesPage() {
  return <>
    <PageMeta title="Garanties automobiles — automajorelle Marrakech" description="Demandez les conditions de garantie, d’inspection et d’assistance applicables à chaque véhicule automajorelle à Marrakech." />
    <PageIntro eyebrow="GARANTIES & SUIVI" title="Des conditions à connaître avant de décider." intro="Les couvertures et prestations peuvent dépendre du véhicule. Demandez au showroom les conditions écrites qui s’appliquent à l’annonce concernée." image="/assets/showroom/showroom-mini-front.jpg" imagePosition="center 52%" />
    <section className="page-content"><div className="container two-col"><div className="prose"><h2>Des conditions propres à chaque véhicule</h2><p>Une garantie, une inspection ou un accompagnement après-vente ne se résume pas à une promesse générale. Les conditions dépendent du véhicule et des éléments confirmés par l’équipe automajorelle. Avant de décider, demandez les informations écrites qui correspondent à l’annonce consultée.</p><h2>Les points à clarifier</h2><ul><li>La durée et le périmètre exacts de la couverture.</li><li>Les pièces, organes et éventuelles exclusions.</li><li>Les modalités de prise en charge et le contact après-vente.</li><li>Les contrôles réalisés et les documents disponibles.</li></ul><p>La disponibilité, l’état, les équipements et les conditions applicables sont à confirmer avec le showroom avant tout déplacement.</p></div><aside className="info-card"><span className="service-icon"><ShieldCheck size={20} /></span><h3>Une question sur une annonce&nbsp;?</h3><p>Indiquez la marque, le modèle ou le lien de la fiche pour obtenir une réponse adaptée.</p><Link className="button button-red" href="/contact">Demander les conditions</Link></aside></div></section>
    <ContactBand title="Clarifiez chaque condition avant l’achat." text="Nous vous aiderons à obtenir les informations propres au véhicule qui vous intéresse." />
  </>;
}

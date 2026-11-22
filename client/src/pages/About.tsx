import { ArrowRight, MapPin, MessageCircle, Search } from "lucide-react";
import { Link } from "wouter";
import PageMeta from "@/components/site/PageMeta";
import { ContactBand, PageIntro } from "@/components/site/Shared";
import { useSiteSettings } from "@/lib/siteSettings";
import { SOURCE_MEDIA } from "@shared/siteData";

export default function AboutPage() {
  const contact = useSiteSettings();
  return <>
    <PageMeta title="À propos d’Auto Majorelle — Marrakech" description="Découvrez Auto Majorelle, showroom automobile à Marrakech, son adresse à Sidi Ghanem et ses parcours de vente, financement et reprise." />
    <PageIntro eyebrow="À PROPOS" title="Un showroom pour choisir avec méthode." intro="À Marrakech, Auto Majorelle vous accueille pour regarder les véhicules, comparer les informations et avancer avec un interlocuteur qui connaît votre projet." />
    <section className="section"><div className="container story-grid"><div className="story-image"><img src={SOURCE_MEDIA.showroomRear} alt="Véhicule photographié dans le showroom Auto Majorelle"/><div className="story-image-caption">Auto Majorelle · Marrakech</div></div><div className="story-copy"><span className="eyebrow">NOTRE APPROCHE</span><h2>Regarder la voiture. Poser les bonnes questions.</h2><p>Un achat automobile commence souvent par une recherche en ligne, mais la décision se prend avec des informations concrètes. Les annonces donnent un premier aperçu ; l’équipe vous aide à préciser les détails utiles avant la visite.</p><p>Stock, reprise ou financement : chaque demande est étudiée selon le véhicule et votre situation. Les conditions importantes sont confirmées directement avec le showroom.</p><div className="story-points"><div className="story-point"><Search size={16}/> Parcourir le stock publié</div><div className="story-point"><MessageCircle size={16}/> Échanger sans intermédiaire</div><div className="story-point"><MapPin size={16}/> Rendez-vous à Sidi Ghanem</div></div><Link className="button button-dark" href="/vehicules">Voir les véhicules <ArrowRight size={15}/></Link></div></div></section>
    <section className="section section-surface"><div className="container story-grid"><div className="story-copy"><span className="eyebrow">LE SHOWROOM</span><h2>Retrouvez-nous à Marrakech.</h2><p>Le showroom Auto Majorelle se trouve au {contact.address}. L’équipe vous accueille pour examiner un véhicule et préparer la suite de votre projet.</p><p>Les horaires et l’itinéraire sont à confirmer avant votre déplacement.</p><Link className="link-arrow" href="/contact">Coordonnées et accès <ArrowRight size={15}/></Link></div><div className="story-image"><img src={SOURCE_MEDIA.showroomInterior} alt="Intérieur du showroom Majorelle Auto" loading="lazy"/></div></div></section>
    <ContactBand title="Venez découvrir Auto Majorelle." text="Appelez ou écrivez à l’équipe pour confirmer les horaires et l’itinéraire du showroom." />
  </>;
}

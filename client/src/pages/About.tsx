import { ArrowRight, MapPin, MessageCircle, Search } from "lucide-react";
import { Link } from "wouter";
import PageMeta from "@/components/site/PageMeta";
import { ContactBand, PageIntro } from "@/components/site/Shared";
import { SOURCE_MEDIA } from "@shared/siteData";

export default function AboutPage() {
  return <>
    <PageMeta title="À propos d’Auto Majorelle — Marrakech" description="Découvrez Auto Majorelle, showroom automobile à Marrakech, son adresse Alfa 2000 et ses parcours de vente, financement et reprise." />
    <PageIntro eyebrow="À PROPOS" title="Une adresse automobile à Marrakech." intro="Auto Majorelle accueille les automobilistes au showroom pour découvrir les véhicules publiés et échanger autour de leur projet." />
    <section className="section"><div className="container story-grid"><div className="story-image"><img src={SOURCE_MEDIA.showroomRear} alt="Véhicule photographié dans le showroom Auto Majorelle"/><div className="story-image-caption">Auto Majorelle · Marrakech</div></div><div className="story-copy"><span className="eyebrow">NOTRE APPROCHE</span><h2>Des informations utiles. Un échange direct.</h2><p>Choisir un véhicule demande de comparer, de poser des questions et d’obtenir des éléments précis. Auto Majorelle met à disposition ses annonces et son équipe pour répondre aux demandes liées au stock, au financement ou à la reprise.</p><p>Les détails de chaque véhicule, la disponibilité, les conditions de garantie et les modalités financières sont à confirmer avec l’équipe avant toute décision.</p><div className="story-points"><div className="story-point"><Search size={16}/> Découvrir les annonces</div><div className="story-point"><MessageCircle size={16}/> Échanger avec l’équipe</div><div className="story-point"><MapPin size={16}/> Showroom à Alfa 2000</div></div><Link className="button button-dark" href="/vehicules">Voir les véhicules <ArrowRight size={15}/></Link></div></div></section>
    <section className="section section-surface"><div className="container story-grid"><div className="story-copy"><span className="eyebrow">LE SHOWROOM</span><h2>Retrouvez-nous à Marrakech.</h2><p>Adresse affichée : Angle Av. Allal El Fassi et Av. Yaakoub El Mansour, Alfa 2000. Cette localisation a été choisie par l’entreprise. La fiche Google reliée aux avis indique une adresse différente; appelez-nous pour confirmer l’itinéraire avant une visite.</p><Link className="link-arrow" href="/contact">Coordonnées et accès <ArrowRight size={15}/></Link></div><div className="story-image"><img src={SOURCE_MEDIA.showroomInterior} alt="Intérieur du showroom Majorelle Auto" loading="lazy"/></div></div></section>
    <ContactBand title="Venez découvrir Auto Majorelle." text="Appelez ou écrivez à l’équipe pour confirmer les horaires et l’itinéraire du showroom." />
  </>;
}

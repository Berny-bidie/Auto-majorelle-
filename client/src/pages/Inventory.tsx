import { useMemo, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import PageMeta from "@/components/site/PageMeta";
import { PageIntro } from "@/components/site/Shared";
import HorizontalCarousel from "@/components/site/HorizontalCarousel";
import VehicleCard from "@/components/site/VehicleCard";
import { translateDynamicText, useLanguage } from "@/lib/i18n";
import { trpc } from "@/lib/trpc";
import { SITE_CONTACT } from "@shared/siteData";
import NotFound from "./NotFound";
import { useParams } from "wouter";

const emptyFilters = { search: "", brand: "", category: "", fuel: "", transmission: "", yearFrom: "", yearTo: "", budgetMax: "", mileageMax: "" };

export function InventoryPage() {
  const [draft, setDraft] = useState(emptyFilters);
  const [filters, setFilters] = useState<Partial<{search:string;brand:string;category:string;fuel:string;transmission:string;yearFrom:number;yearTo:number;budgetMax:number;mileageMax:number}>>({});
  const [sort, setSort] = useState("featured");
  const result = trpc.automajorel.inventory.list.useQuery(filters);
  const available = result.data ?? [];
  const brands = [...new Set(available.map(item => item.brand))].sort();
  const activeFilterCount = Object.keys(filters).length;
  const sorted = useMemo(() => [...available].sort((a,b) => sort === "price-asc" ? a.priceDh-b.priceDh : sort === "price-desc" ? b.priceDh-a.priceDh : sort === "year" ? b.year-a.year : b.featured-a.featured), [available, sort]);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next: typeof filters = {};
    if (draft.search.trim()) next.search = draft.search.trim();
    if (draft.brand) next.brand = draft.brand;
    if (draft.category) next.category = draft.category;
    if (draft.fuel) next.fuel = draft.fuel;
    if (draft.transmission) next.transmission = draft.transmission;
    if (draft.yearFrom) next.yearFrom = Number(draft.yearFrom);
    if (draft.yearTo) next.yearTo = Number(draft.yearTo);
    if (draft.budgetMax) next.budgetMax = Number(draft.budgetMax);
    if (draft.mileageMax) next.mileageMax = Number(draft.mileageMax);
    setFilters(next);
  };
  const reset = () => { setDraft(emptyFilters); setFilters({}); };
  const change = (key: keyof typeof emptyFilters) => (event: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setDraft(current => ({ ...current, [key]: event.target.value }));

  return <>
    <PageMeta title="Véhicules d’occasion à Marrakech — automajorelle" description="Recherchez les véhicules publiés par automajorelle à Marrakech et filtrez par marque, budget, catégorie, motorisation, année, kilométrage et transmission." />
    <PageIntro eyebrow="NOS VÉHICULES" title="Le prochain véhicule se trouve peut-être ici." intro="Parcourez les annonces actuellement publiées. Les fiches marquées DÉMO sont des exemples non disponibles à la vente." />
    <section className="page-content"><div className="container">
      <form className="filter-panel" onSubmit={submit}>
        <div className="filter-field filter-search"><label htmlFor="inventory-search">Recherche marque ou modèle</label><input id="inventory-search" value={draft.search} onChange={change("search")} placeholder="Ex. marque, modèle" /></div>
        <div className="filter-field"><label htmlFor="inventory-brand">Marque</label><select id="inventory-brand" value={draft.brand} onChange={change("brand")}><option value="">Toutes les marques</option>{brands.map(brand => <option key={brand}>{brand}</option>)}</select></div>
        <div className="filter-field"><label htmlFor="inventory-budget">Budget maximum</label><select id="inventory-budget" value={draft.budgetMax} onChange={change("budgetMax")}><option value="">Tous les budgets</option><option value="150000">150 000 DH</option><option value="250000">250 000 DH</option><option value="400000">400 000 DH</option><option value="700000">700 000 DH</option></select></div>
        <div className="filter-field"><label htmlFor="inventory-category">Type</label><select id="inventory-category" value={draft.category} onChange={change("category")}><option value="">Tous les types</option>{["SUV","Berline","Citadine","Coupé","Utilitaire"].map(x=><option key={x}>{x}</option>)}</select></div>
        <div className="filter-field"><label htmlFor="inventory-fuel">Motorisation</label><select id="inventory-fuel" value={draft.fuel} onChange={change("fuel")}><option value="">Toutes</option>{["Essence","Diesel","Hybride","Électrique"].map(x=><option key={x}>{x}</option>)}</select></div>
        <div className="filter-field"><label htmlFor="inventory-transmission">Transmission</label><select id="inventory-transmission" value={draft.transmission} onChange={change("transmission")}><option value="">Toutes</option>{["Automatique","Manuelle"].map(x=><option key={x}>{x}</option>)}</select></div>
        <div className="filter-field"><label htmlFor="inventory-year-from">Année à partir de</label><input id="inventory-year-from" type="number" min="1950" max="2100" value={draft.yearFrom} onChange={change("yearFrom")} placeholder="2018" /></div>
        <div className="filter-field"><label htmlFor="inventory-year-to">Année jusqu’à</label><input id="inventory-year-to" type="number" min="1950" max="2100" value={draft.yearTo} onChange={change("yearTo")} placeholder="2026" /></div>
        <div className="filter-field"><label htmlFor="inventory-mileage">Km maximum</label><input id="inventory-mileage" type="number" min="0" value={draft.mileageMax} onChange={change("mileageMax")} placeholder="100 000" /></div>
        <button className="button button-red" type="submit"><Search size={15} /> Appliquer</button>
      </form>
      {!result.error && <div className="results-line"><div className="results-summary"><span>{result.isLoading ? "Chargement des annonces…" : `Fiches au catalogue : ${sorted.length}`}</span><small>{activeFilterCount ? `${activeFilterCount} filtre${activeFilterCount > 1 ? "s" : ""} appliqué${activeFilterCount > 1 ? "s" : ""}` : "Tout le catalogue"}</small></div><div className="filter-field" style={{ flexDirection: "row", alignItems: "center" }}><label htmlFor="inventory-sort">Trier</label><select id="inventory-sort" value={sort} onChange={event=>setSort(event.target.value)} style={{ minHeight: 36 }}><option value="featured">Sélection</option><option value="price-asc">Prix croissant</option><option value="price-desc">Prix décroissant</option><option value="year">Année récente</option></select><button className="link-arrow reset-filter" type="button" onClick={reset} disabled={!activeFilterCount} aria-label="Réinitialiser les filtres">Réinitialiser</button></div></div>}
      {result.isLoading ? <div className="skeleton" aria-label="Chargement du catalogue" /> : result.error ? <div className="inventory-fallback" role="status"><h3>Les annonces ne sont pas disponibles pour le moment.</h3><p>Cette page ne peut pas confirmer le stock actuel. Appelez le showroom pour vérifier les disponibilités.</p><a className="button button-dark button-small" href={`tel:${SITE_CONTACT.phoneRaw}`}>Appeler le showroom</a></div> : sorted.length ? <HorizontalCarousel label="Véhicules du catalogue" className="inventory-vehicle-carousel">{sorted.map(vehicle=><div className="carousel-item inventory-vehicle-item" key={vehicle.id}><VehicleCard vehicle={vehicle} /></div>)}</HorizontalCarousel> : <div className="empty-inventory"><div><span className="empty-inventory-icon"><Search size={22}/></span><h3>{activeFilterCount ? "Aucune annonce ne correspond à ces filtres." : "Aucune annonce n’est publiée actuellement."}</h3><p>{activeFilterCount ? "Modifiez vos critères ou contactez le showroom pour connaître les disponibilités récentes." : "Contactez le showroom pour confirmer les véhicules disponibles avant votre visite."}</p><a className="button button-dark button-small" href="/contact">Contacter automajorelle</a></div></div>}
    </div></section>
  </>;
}

export function VehicleDetailPage() {
  const { slug = "" } = useParams<{slug:string}>();
  const { locale } = useLanguage();
  const query = trpc.automajorel.inventory.bySlug.useQuery({ slug });
  if (query.isLoading) return <><PageMeta title="Fiche véhicule — automajorelle" description="Chargement de la fiche véhicule." /><div className="container page-content"><div className="skeleton" /></div></>;
  if (query.error || !query.data) return <NotFound />;
  const car = query.data;
  const description = translateDynamicText(car.description, locale);
  const equipment = car.equipment.map(item => translateDynamicText(item, locale)).filter((item): item is string => item !== null);
  const untranslatedEquipment = equipment.length !== car.equipment.length;
  const warrantyNote = car.warrantyNote ? translateDynamicText(car.warrantyNote, locale) : null;
  const localizedCopy = {
    fr: { description: car.description, descriptionMissing: "La description n’est pas disponible.", equipmentMissing: "Certains détails d’équipement doivent être confirmés avec le showroom.", warrantyMissing: "Les conditions de garantie, si elles existent, sont à confirmer avec le showroom." },
    en: { description: "A vehicle-specific description is not available in English yet. Contact the showroom for verified details.", descriptionMissing: "A vehicle-specific description is not available in English yet. Contact the showroom for verified details.", equipmentMissing: "Some equipment details are not available in English yet. Contact the showroom to confirm them.", warrantyMissing: "Any warranty terms must be confirmed with the showroom." },
    ar: { description: "لا يتوفر وصف خاص بهذه السيارة باللغة العربية حاليًا. يُرجى التواصل مع المعرض للحصول على معلومات مؤكدة.", descriptionMissing: "لا يتوفر وصف خاص بهذه السيارة باللغة العربية حاليًا. يُرجى التواصل مع المعرض للحصول على معلومات مؤكدة.", equipmentMissing: "بعض تفاصيل التجهيزات غير متاحة بالعربية حاليًا. يُرجى تأكيدها مع المعرض.", warrantyMissing: "يجب تأكيد أي شروط ضمان مع المعرض." },
  }[locale];
  const title = car.isDemo ? `DÉMO — ${car.brand} ${car.model} ${car.year} — automajorelle` : `${car.brand} ${car.model} ${car.year} — automajorelle`;
  return <>
      <PageMeta title={title} description={car.isDemo ? "Fiche de démonstration : données d’exemple uniquement. Ce véhicule n’est pas une annonce réelle et n’est pas à vendre." : `${car.brand} ${car.model} ${car.year} à Marrakech. ${car.mileageKm.toLocaleString("fr-MA")} km, ${car.fuel}, ${car.transmission}. Prix ${car.priceDh.toLocaleString("fr-MA")} DH. Contactez automajorelle.`} type="article" image={car.images[0]} />
    <section className="page-intro"><div className="container"><div className="breadcrumb"><a href="/">Accueil</a> / <a href="/vehicules">Véhicules</a> / {car.brand} {car.model}</div><span className="eyebrow">{car.isDemo ? "DÉMO — NON DISPONIBLE À LA VENTE" : "FICHE VÉHICULE · MARRAKECH"}</span><h1>{car.brand} {car.model}</h1><p>{car.isDemo ? "Données de démonstration uniquement — véhicule non disponible à la vente." : "Informations de cette annonce publiée par automajorelle."}</p></div></section>
    <section className="page-content"><div className="container vehicle-detail-grid">
      <div><Gallery images={car.images} alt={car.isDemo ? `${car.brand} ${car.model} — démonstration, non disponible à la vente` : `${car.brand} ${car.model} à Marrakech`} /><div className="prose" style={{ marginTop: 26 }}><h2>À propos du véhicule</h2><p>{description ?? localizedCopy.description}</p>{equipment.length>0&&<><h3>Équipements</h3><ul>{equipment.map(item=><li key={item}>{item}</li>)}</ul></>}{untranslatedEquipment&&<p>{localizedCopy.equipmentMissing}</p>}{car.warrantyNote&&<p><strong>Garantie :</strong> {warrantyNote ?? localizedCopy.warrantyMissing}</p>}</div></div>
      <aside className="vehicle-detail-summary"><span className={car.isDemo ? "eyebrow vehicle-demo-eyebrow" : "eyebrow"}>{car.isDemo ? "DÉMO — NON DISPONIBLE À LA VENTE" : "ANNONCE DISPONIBLE"}</span><h1>{car.brand} {car.model}</h1><div className="vehicle-detail-price">{car.isDemo ? <small>Prix d’exemple</small> : null}{car.priceDh.toLocaleString("fr-MA")} DH</div><div className="spec-grid">
        <div className="spec-cell"><small>Année</small><b>{car.year}</b></div><div className="spec-cell"><small>Kilométrage</small><b>{car.mileageKm.toLocaleString("fr-MA")} km</b></div><div className="spec-cell"><small>Motorisation</small><b>{car.fuel}</b></div><div className="spec-cell"><small>Transmission</small><b>{car.transmission}</b></div><div className="spec-cell"><small>Catégorie</small><b>{car.category}</b></div><div className="spec-cell"><small>Puissance</small><b>{car.powerCv ? `${car.powerCv} ch` : "À préciser"}</b></div>
      </div>{car.isDemo ? <div className="demo-listing-notice" role="note"><strong>Fiche de démonstration</strong><p>Données d’exemple uniquement. Ce véhicule n’est pas une annonce réelle et n’est pas à vendre.</p></div> : <><div className="form-actions"><a className="button button-red" href={`/contact?vehicule=${encodeURIComponent(car.slug)}`}>Demander des informations</a><a className="button button-outline" href={`https://wa.me/212678880268?text=${encodeURIComponent(`Bonjour automajorelle, je souhaite des informations sur ${car.brand} ${car.model} (${car.year}).`)} `} target="_blank" rel="noreferrer">WhatsApp</a><a className="button button-dark" href={`/contact?vehicule=${encodeURIComponent(car.slug)}&rendezvous=1`}>Prendre rendez-vous</a></div><p className="field-help">Disponibilité, équipements et éventuelles conditions de garantie à confirmer avec le showroom.</p></>}</aside>
    </div></section>
  </>;
}

function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) return <div className="empty-inventory"><div><h3>Photos à venir</h3><p>Contactez le showroom pour recevoir les visuels du véhicule.</p></div></div>;
  return <div className="gallery"><img className="gallery-main" src={images[active]} alt={alt} /><div className="gallery-thumbs" aria-label="Galerie photos">{images.map((image,index)=><button type="button" key={`${image}-${index}`} className={index===active?"active":""} onClick={()=>setActive(index)} aria-label={`Voir la photo ${index+1}`}><img src={image} alt="" /></button>)}</div></div>;
}

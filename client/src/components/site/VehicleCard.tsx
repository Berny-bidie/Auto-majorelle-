import { ArrowRight, Fuel, Gauge, Settings2 } from "lucide-react";
import { Link } from "wouter";
import { formatDh, formatKm } from "@/lib/site";

type CardVehicle = {
  slug: string;
  isDemo: boolean;
  brand: string;
  model: string;
  year: number;
  priceDh: number;
  mileageKm: number;
  fuel: string;
  transmission: string;
  images: string[];
  featured: number;
};

export default function VehicleCard({ vehicle }: { vehicle: CardVehicle }) {
  const image = vehicle.images[0];
  return <article className="vehicle-card">
    <Link href={`/vehicules/${vehicle.slug}`} className="vehicle-card-image" aria-label={`Voir ${vehicle.brand} ${vehicle.model}`}>
      {image ? <img src={image} alt={vehicle.isDemo ? `${vehicle.brand} ${vehicle.model} — démonstration, non disponible à la vente` : `${vehicle.brand} ${vehicle.model} — véhicule disponible à Marrakech`} loading="lazy" /> : <div className="vehicle-image-empty">Photo à ajouter</div>}
      {vehicle.isDemo ? <span className="vehicle-badge vehicle-badge-demo">DÉMO — NON DISPONIBLE À LA VENTE</span> : vehicle.featured ? <span className="vehicle-badge">Sélection</span> : null}
    </Link>
    <div className="vehicle-card-body">
      <div className="vehicle-card-top"><span>{vehicle.brand}</span><span>{vehicle.year}</span></div>
      <h3>{vehicle.model}</h3>
      <p className={vehicle.isDemo ? "vehicle-card-subtitle vehicle-demo-note" : "vehicle-card-subtitle"}>{vehicle.isDemo ? "Données d’exemple — ce véhicule n’est pas une annonce réelle et n’est pas à vendre." : "Véhicule disponible à Marrakech"}</p>
      <div className="vehicle-specs">
        <span><Gauge size={13} /> {formatKm(vehicle.mileageKm)}</span>
        <span><Fuel size={13} /> {vehicle.fuel}</span>
        <span><Settings2 size={13} /> {vehicle.transmission}</span>
      </div>
      <div className="vehicle-card-bottom"><div>{vehicle.isDemo ? <span className="vehicle-price-label">Prix d’exemple</span> : null}<div className="vehicle-price">{formatDh(vehicle.priceDh)} <small>DH</small></div></div><Link className="vehicle-card-cta" href={`/vehicules/${vehicle.slug}`}>{vehicle.isDemo ? "Voir la démo" : "Découvrir"} <ArrowRight size={14} /></Link></div>
    </div>
  </article>;
}

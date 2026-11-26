import { ArrowRight, Fuel, Gauge, Settings2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { formatDh, formatKm } from "@/lib/site";

type CardVehicle = {
  slug: string;
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
  const [imageFailed, setImageFailed] = useState(false);
  return <article className="vehicle-card">
    <Link href={`/vehicules/${vehicle.slug}`} className="vehicle-card-image" aria-label={`Voir ${vehicle.brand} ${vehicle.model}`}>
      {image && !imageFailed ? <img src={image} alt={`${vehicle.brand} ${vehicle.model} — véhicule disponible à Marrakech`} loading="lazy" onError={() => setImageFailed(true)} /> : <div className="vehicle-image-empty">Photo indisponible<br /><small>Visuels à confirmer avec le showroom.</small></div>}
      {vehicle.featured ? <span className="vehicle-badge">Sélection</span> : null}
    </Link>
    <div className="vehicle-card-body">
      <div className="vehicle-card-top"><span>{vehicle.brand}</span><span>{vehicle.year}</span></div>
      <h3>{vehicle.model}</h3>
      <p className="vehicle-card-subtitle">Véhicule disponible à Marrakech</p>
      <div className="vehicle-specs">
        <span><Gauge size={13} /> {formatKm(vehicle.mileageKm)}</span>
        <span><Fuel size={13} /> {vehicle.fuel}</span>
        <span><Settings2 size={13} /> {vehicle.transmission}</span>
      </div>
      <div className="vehicle-card-bottom"><div className="vehicle-price">{formatDh(vehicle.priceDh)} <small>DH</small></div><Link className="vehicle-card-cta" href={`/vehicules/${vehicle.slug}`}>Découvrir <ArrowRight size={14} /></Link></div>
    </div>
  </article>;
}

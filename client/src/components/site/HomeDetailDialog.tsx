import { ArrowRight, ExternalLink, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { WhatsAppLink } from "@/components/site/Shared";
import { useSiteSettings } from "@/lib/siteSettings";

export type HomeDetail =
  | { kind: "vehicle"; title: string; image: string; maker: string; officialUrl?: string; officialRegion?: string }
  | { kind: "brand"; title: string; image: string; officialUrl?: string; officialRegion?: string }
  | { kind: "showroom"; title: string; image: string; caption: string };

type Props = { detail: HomeDetail | null; onClose: () => void };

export default function HomeDetailDialog({ detail, onClose }: Props) {
  const contact = useSiteSettings();
  const open = Boolean(detail);
  const whatsappMessage = detail?.kind === "vehicle"
    ? `Bonjour automajorelle, je souhaite vérifier la disponibilité du ${detail.title}.`
    : "Bonjour automajorelle, je souhaite en savoir plus sur votre showroom et les véhicules disponibles.";

  return <Dialog open={open} onOpenChange={nextOpen => { if (!nextOpen) onClose(); }}>
    <DialogContent className="home-detail-dialog" aria-describedby="home-detail-description">
      {detail && <div className={`home-detail-layout home-detail-${detail.kind}`}>
        <div className="home-detail-media"><img src={detail.image} alt={detail.title} /></div>
        <div className="home-detail-content">
          <span className="eyebrow">{detail.kind === "vehicle" ? "MODÈLE APERÇU AU SHOWROOM" : detail.kind === "brand" ? "MARQUE AUTOMOBILE" : "LE SHOWROOM"}</span>
          <DialogTitle className="home-detail-title">{detail.title}</DialogTitle>
          <DialogDescription id="home-detail-description" className="home-detail-description">
            {detail.kind === "vehicle"
              ? `Modèle aperçu dans la vidéo de présentation. L’année, la finition et la disponibilité de l’exemplaire sont à confirmer auprès de l’équipe.`
              : detail.kind === "brand"
                ? detail.officialUrl ? `Consultez les informations du constructeur sur son site officiel. Ce lien ne confirme pas la disponibilité d’un véhicule chez automajorelle.` : `Aucun site officiel n’a été confirmé pour cette marque.`
                : detail.caption}
          </DialogDescription>

          {detail.kind === "vehicle" && <div className="home-detail-fact"><span>MARQUE</span><strong>{detail.maker}</strong></div>}
          {detail.kind === "brand" && detail.officialUrl && <div className="home-detail-fact"><span>SITE CONSULTÉ</span><strong>{detail.officialRegion === "Maroc" ? "Site officiel au Maroc" : "Site officiel international"}</strong></div>}
          {detail.kind === "showroom" && <a className="home-detail-address" href={contact.mapsDirectionsUrl} target="_blank" rel="noreferrer"><MapPin size={16} /> <span>{contact.address}</span><ExternalLink size={13} /></a>}

          <div className="home-detail-actions">
            {detail.kind === "brand" ? detail.officialUrl ? <a className="button button-red" href={detail.officialUrl} target="_blank" rel="noreferrer">Site officiel <ExternalLink size={15} /></a> : null : detail.kind === "vehicle" && detail.officialUrl ? <a className="button button-outline" href={detail.officialUrl} target="_blank" rel="noreferrer">Site officiel {detail.maker} <ExternalLink size={14} /></a> : <a className="button button-outline" href={`tel:${contact.phoneRaw}`}>Appeler le showroom</a>}
            {detail.kind === "brand"
              ? <Link className="button button-dark" href="/vehicules">Catalogue automajorelle <ArrowRight size={15} /></Link>
              : <WhatsAppLink className="button button-dark" message={whatsappMessage}>Écrire à l’équipe <ArrowRight size={15} /></WhatsAppLink>}
          </div>
        </div>
      </div>}
    </DialogContent>
  </Dialog>;
}

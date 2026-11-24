import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useSearch } from "wouter";
import PageMeta from "@/components/site/PageMeta";
import { Notice, PageIntro } from "@/components/site/Shared";
import { GOOGLE_REVIEW_SNAPSHOT, SITE_CONTACT } from "@shared/siteData";
import { trpc } from "@/lib/trpc";
import { useSiteSettings } from "@/lib/siteSettings";
import { useLanguage } from "@/lib/i18n";

export function ContactForm({ defaultVehicle = "", defaultAppointment = false }: { defaultVehicle?: string; defaultAppointment?: boolean }) {
  const mutation = trpc.automajorel.leads.contact.useMutation();
  const [sent, setSent] = useState(false); const [error, setError] = useState("");
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setSent(false);
    const form = event.currentTarget; const data = new FormData(form);
    if (data.get("consent") !== "on") { setError("Veuillez accepter l’utilisation de vos coordonnées pour envoyer votre demande."); return; }
    try {
      await mutation.mutateAsync({ submissionId, name: String(data.get("name") || ""), phone: String(data.get("phone") || ""), email: String(data.get("email") || ""), message: String(data.get("message") || ""), consent: true, website: String(data.get("website") || ""), vehicleSlug: defaultVehicle || undefined, kind: defaultAppointment ? "appointment" : "contact" });
      setSent(true); form.reset(); setSubmissionId(crypto.randomUUID());
    } catch { setError("Votre demande n’a pas pu être enregistrée. Réessayez ou contactez-nous par téléphone ou WhatsApp."); }
  };
  return <div className="form-card"><h2>{defaultAppointment ? "Demander un rendez-vous" : "Écrivez-nous"}</h2><p>Votre message est enregistré dans l’espace de réception privé automajorelle. Pour une réponse immédiate, appelez-nous.</p>
    {sent && <Notice kind="success">Votre demande a bien été enregistrée. L’équipe automajorelle pourra la consulter et vous répondre.</Notice>}{error && <Notice kind="error">{error}</Notice>}
    <form onSubmit={submit}><div className="form-grid">
      <div className="field"><label htmlFor="contact-name">Nom complet *</label><input id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={160} /></div>
      <div className="field"><label htmlFor="contact-phone">Téléphone *</label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={50} /></div>
      <div className="field field-full"><label htmlFor="contact-email">E-mail</label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={320} /></div>
      <div className="field field-full"><label htmlFor="contact-message">Votre message *</label><textarea id="contact-message" name="message" required minLength={2} maxLength={4000} placeholder="Comment pouvons-nous vous aider ?" /></div>
      <div className="hidden-field" aria-hidden="true"><label htmlFor="contact-website">Site web</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    </div><label className="check-row"><input name="consent" type="checkbox" required /><span>J’accepte que mes coordonnées soient utilisées pour répondre à cette demande et traitées dans l’espace privé automajorelle.</span></label>
      <div className="form-actions"><button className="button button-red" type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Envoi…" : "Envoyer ma demande"}</button></div>
    </form>
  </div>;
}

export default function ContactPage() {
  const { locale } = useLanguage();
  const contact = useSiteSettings();
  const search = useSearch(); const params = new URLSearchParams(search);
  const vehicle = params.get("vehicule") || ""; const appointment = params.get("rendezvous") === "1";
  const [showMap, setShowMap] = useState(false);
  const mapUrl = `https://maps.google.com/maps?output=embed&q=${encodeURIComponent(contact.address)}`;
  return <>
    <PageMeta title="Contact automajorelle — Marrakech" description={`Contactez automajorelle à Marrakech par téléphone, e-mail ou WhatsApp. Retrouvez le showroom à ${contact.address} et demandez un rendez-vous.`} />
    <PageIntro eyebrow="CONTACT & ACCÈS" title="Nous sommes à votre écoute." intro="Une question sur le stock, une demande de financement ou un rendez-vous au showroom ? Choisissez votre moyen de contact." />
    <section className="page-content"><div className="container two-col">
      <div><div className="contact-info-list">
        <div className="contact-info-item"><span className="contact-info-icon"><Phone size={17}/></span><div><b>Téléphone</b><a href={`tel:${contact.phoneRaw}`}>{contact.phone}</a><a href={`tel:${contact.secondaryPhoneRaw}`}>{contact.secondaryPhone}</a></div></div>
        <div className="contact-info-item"><span className="contact-info-icon"><Mail size={17}/></span><div><b>E-mail</b><a href={`mailto:${contact.email}`}>{contact.email}</a></div></div>
        <div className="contact-info-item"><span className="contact-info-icon"><MapPin size={17}/></span><div><b>Showroom automajorelle</b><p>{contact.address}</p><p>{contact.hours}<br /><small>{contact.hoursNote}</small></p></div></div>
      </div>
      <div className="notice notice-info" style={{ marginTop: 22 }}>{locale === "en" ? "Call the showroom before your visit to confirm opening hours and vehicle availability." : locale === "ar" ? "اتصل بالمعرض قبل الزيارة لتأكيد ساعات العمل وتوفر السيارة." : "Pour confirmer les horaires et la disponibilité d’un véhicule, appelez le showroom avant votre visite."}</div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 17 }}><a className="button button-dark" href={contact.mapsDirectionsUrl} target="_blank" rel="noreferrer">{locale === "en" ? "Directions to the showroom" : locale === "ar" ? "الاتجاهات إلى المعرض" : "Itinéraire vers le showroom"}</a><a className="button button-outline" href={SITE_CONTACT.googleProfileUrl} target="_blank" rel="noreferrer">{locale === "en" ? "Google profile" : locale === "ar" ? "ملف Google" : "Fiche Google"} · {GOOGLE_REVIEW_SNAPSHOT.rating}</a><button className="button button-outline" type="button" onClick={() => setShowMap(value => !value)} aria-expanded={showMap}>{showMap ? (locale === "en" ? "Hide map" : locale === "ar" ? "إخفاء الخريطة" : "Masquer la carte") : (locale === "en" ? "Show map" : locale === "ar" ? "عرض الخريطة" : "Afficher la carte")}</button></div>
      {showMap && <iframe className="map-frame" title="Carte Google Maps du showroom automajorelle" src={mapUrl} loading="eager" referrerPolicy="no-referrer-when-downgrade" style={{ marginTop: 25 }} />}
      </div>
      <ContactForm defaultVehicle={vehicle} defaultAppointment={appointment} />
    </div></section>
  </>;
}

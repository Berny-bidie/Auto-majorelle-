import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Info } from "lucide-react";
import { Link } from "wouter";
import PageMeta from "@/components/site/PageMeta";
import { Notice, PageIntro, Reveal } from "@/components/site/Shared";
import { trpc } from "@/lib/trpc";

const archivedPartnerLogos = [
  { name: "Bank Al Yousr", logo: "/assets/partners/bank-al-yousr.png" },
  { name: "SOFAC", logo: "/assets/partners/sofac.png" },
  { name: "Wafasalaf", logo: "/assets/partners/wafasalaf.png" },
  { name: "Salafin", logo: "/assets/partners/salafin.png" },
  { name: "Maghrebail", logo: "/assets/partners/maghrebail.png" },
  { name: "Vivalis Salaf", logo: "/assets/partners/vivalis.png" },
];

export default function FinancePage() {
  const settings = trpc.automajorel.site.settings.useQuery();
  const partners = trpc.automajorel.site.financingPartners.useQuery();
  const mutation = trpc.automajorel.leads.financing.useMutation();
  const [price, setPrice] = useState(250000);
  const [down, setDown] = useState(50000);
  const [months, setMonths] = useState(48);
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const partnerWithTerms = partners.data?.find(partner => partner.minTermMonths !== null && partner.maxTermMonths !== null) ?? null;
  const settingsRateIsConfirmed = settings.data?.financingRateConfirmed === "true" && Boolean(settings.data.financingRateSource?.trim());
  const annualRate = partnerWithTerms?.annualRate ?? (settingsRateIsConfirmed && settings.data?.financingAnnualRate ? Number(settings.data.financingAnnualRate) : null);
  const annualRateSource = partnerWithTerms?.annualRate !== null && partnerWithTerms?.annualRate !== undefined ? partnerWithTerms.name : settings.data?.financingRateSource || "";
  const terms = useMemo(() => {
    if (!partnerWithTerms?.minTermMonths || !partnerWithTerms.maxTermMonths) return [];
    const common = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120];
    return [...new Set([partnerWithTerms.minTermMonths, partnerWithTerms.maxTermMonths, ...common.filter(value => value >= partnerWithTerms.minTermMonths! && value <= partnerWithTerms.maxTermMonths!)])].sort((a, b) => a - b);
  }, [partnerWithTerms]);

  useEffect(() => {
    if (terms.length && !terms.includes(months)) setMonths(terms[0]!);
  }, [terms, months]);

  const monthly = useMemo(() => {
    if (annualRate === null || !Number.isFinite(annualRate) || down > price || !terms.includes(months)) return null;
    const principal = price - down;
    const monthlyRate = annualRate / 1200;
    return monthlyRate === 0 ? principal / months : principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
  }, [annualRate, down, price, months, terms]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setSent(false);
    const form = event.currentTarget; const data = new FormData(form);
    if (data.get("consent") !== "on") { setError("Veuillez accepter l’utilisation de vos coordonnées pour envoyer votre demande."); return; }
    try {
      await mutation.mutateAsync({ submissionId, name: String(data.get("name") || ""), phone: String(data.get("phone") || ""), email: String(data.get("email") || ""), message: String(data.get("message") || ""), consent: true, website: String(data.get("website") || ""), vehiclePrice: price, downPayment: down, termMonths: months, annualRate });
      setSent(true); form.reset(); setSubmissionId(crypto.randomUUID());
    } catch { setError("La demande n’a pas pu être enregistrée. Appelez-nous pour en parler."); }
  };

  return <>
    <PageMeta title="Financement automobile à Marrakech — automajorelle" description="Demandez une étude de financement automobile à Marrakech. Seuls les paramètres confirmés par l’équipe et l’organisme concerné alimentent le simulateur." />
    <PageIntro eyebrow="FINANCEMENT AUTO" title="Préparer votre projet, sans promesse floue." intro="Décrivez votre projet à l’équipe automajorelle. Toute mensualité calculée ici est indicative; l’offre et le taux doivent être confirmés par l’organisme concerné." image="/assets/showroom/interior-porsche-macan.jpg" imagePosition="center 55%" />
    <section className="page-content"><div className="container two-col">
      <Reveal><div><div className="calculator"><div className="calculator-heading"><span className="eyebrow eyebrow-light">ÉTUDE PERSONNALISÉE</span><span className="calculator-pulse" aria-hidden="true" /></div><h2>Simulateur indicatif</h2><p>{annualRate !== null && partnerWithTerms ? `Paramètres confirmés pour ${partnerWithTerms.name}. Source du taux : ${annualRateSource || "à préciser avec l’équipe"}.` : "Aucun taux et aucune durée de financement ne sont confirmés pour le moment. Le simulateur restera indicatif et n’affichera pas de mensualité tant que ces paramètres n’auront pas été vérifiés."}</p>
        <div className="form-grid"><div className="field"><label htmlFor="calc-price">Prix du véhicule (DH)</label><input id="calc-price" type="number" min="0" step="1000" value={price} onChange={event => setPrice(Number(event.target.value))} /></div><div className="field"><label htmlFor="calc-down">Apport (DH)</label><input id="calc-down" type="number" min="0" step="1000" value={down} onChange={event => setDown(Number(event.target.value))} /></div><div className="field"><label htmlFor="calc-months">Durée confirmée (mois)</label><select id="calc-months" value={terms.includes(months) ? months : ""} disabled={!terms.length} onChange={event => setMonths(Number(event.target.value))}>{terms.length ? terms.map(value => <option key={value} value={value}>{value} mois</option>) : <option value="">À confirmer</option>}</select></div><div className="field"><label>Taux annuel confirmé</label><input readOnly aria-readonly="true" value={annualRate === null ? "À confirmer" : `${annualRate}%`} /></div></div>
        <div className="calculator-output"><small>Montant financé estimatif</small><strong>{Math.max(0, price - down).toLocaleString("fr-MA")} DH</strong>{monthly === null ? <span>Aucune mensualité n’est calculée sans taux et durée confirmés.</span> : <span>Mensualité indicative hors frais : {monthly.toLocaleString("fr-MA", { maximumFractionDigits: 0 })} DH/mois · calcul non contractuel</span>}</div>
        {down > price && <div className="notice notice-error">L’apport ne peut pas dépasser le prix saisi.</div>}
        {partners.error && <div className="notice notice-error">Impossible de charger les conditions de financement confirmées.</div>}
      </div>
      <div className="notice notice-info"><Info size={16} />Le simulateur applique une formule de mensualité constante et n’intègre pas frais, assurance, arrondis ou critères d’acceptation. Seule une proposition écrite de l’organisme fait foi.</div>
      <div className="admin-card financing-partners" style={{ marginTop: 30 }}><h2>{partners.data?.length ? "Partenaires confirmés" : "Partenaires financiers à confirmer"}</h2>{partners.isLoading ? <p>Chargement…</p> : partners.data?.length ? <><div className="partner-grid">{partners.data.map(partner => <article className="partner-card" key={partner.id}>{partner.logoUrl ? <img src={partner.logoUrl} alt={partner.name} loading="lazy" /> : <strong>{partner.name}</strong>}<span className="partner-state">Confirmé</span></article>)}</div><ul className="financing-terms-list">{partners.data.map(partner => <li key={partner.id}><strong>{partner.name}</strong>{partner.termsSummary ? ` — ${partner.termsSummary}` : " — Conditions confirmées auprès de l’organisme."}{partner.annualRate !== null ? ` Taux indiqué : ${partner.annualRate}%` : " Aucun taux publié."}</li>)}</ul></> : <><p className="partner-intro">Les organismes ci-dessous sont présentés à titre indicatif. automajorelle n’affiche un partenariat, un taux ou une condition comme actif qu’après confirmation.</p><div className="partner-grid partner-grid-archived">{archivedPartnerLogos.map(partner => <article className="partner-card partner-card-archived" key={partner.name}><img src={partner.logo} alt={partner.name} loading="lazy" /><span className="partner-state">À confirmer</span></article>)}</div><p className="partner-disclaimer">Aucune offre de financement ne découle de l’affichage de ces logos.</p></>}</div>
      </div></Reveal>
      <Reveal delay={100}><div className="form-card"><span className="eyebrow">PARLONS DE VOTRE PROJET</span><h2>Demander une étude</h2><p>Votre demande sera enregistrée dans la réception privée automajorelle. Les conditions restent à confirmer avec l’organisme financeur.</p>
        {sent && <Notice kind="success">Votre demande a été enregistrée. L’équipe pourra vous recontacter.</Notice>}{error && <Notice kind="error">{error}</Notice>}
        <form onSubmit={submit}><div className="form-grid"><div className="field"><label htmlFor="finance-name">Nom complet *</label><input id="finance-name" name="name" required minLength={2} maxLength={160} /></div><div className="field"><label htmlFor="finance-phone">Téléphone *</label><input id="finance-phone" name="phone" type="tel" required minLength={7} maxLength={50} /></div><div className="field field-full"><label htmlFor="finance-email">E-mail</label><input id="finance-email" name="email" type="email" maxLength={320} /></div><div className="field field-full"><label htmlFor="finance-message">Précisions sur votre projet</label><textarea id="finance-message" name="message" maxLength={4000} placeholder="Véhicule recherché, budget, apport…" /></div><div className="hidden-field" aria-hidden="true"><label htmlFor="finance-website">Site web</label><input id="finance-website" name="website" tabIndex={-1} autoComplete="off" /></div></div><label className="check-row"><input type="checkbox" name="consent" required /><span>J’accepte l’utilisation de ces coordonnées pour répondre à ma demande.</span></label><button className="button button-red" type="submit" disabled={mutation.isPending || down > price}>{mutation.isPending ? "Envoi…" : "Demander une étude"}<ArrowRight size={15} /></button></form>
      </div></Reveal>
    </div></section>
    <section className="section section-surface"><div className="container"><Reveal><div className="section-heading"><span className="eyebrow">COMMENT ÇA MARCHE</span><h2>Une étude claire, étape par étape.</h2><p>Les informations utiles sont regroupées ici pour vous aider à préparer votre échange avec l’équipe.</p></div></Reveal><div className="finance-steps"><Reveal delay={40}><article><span>01</span><h3>Définir le projet</h3><p>Choisissez un véhicule, un budget et un apport indicatif. L’équipe vérifie la disponibilité réelle.</p></article></Reveal><Reveal delay={100}><article><span>02</span><h3>Échanger avec l’équipe</h3><p>Votre demande est reçue dans l’espace privé afin de préciser votre situation et vos besoins.</p></article></Reveal><Reveal delay={160}><article><span>03</span><h3>Recevoir les conditions</h3><p>Les taux, durées, frais et documents ne sont retenus qu’après confirmation écrite de l’organisme concerné.</p></article></Reveal></div><div className="two-col finance-bottom"><div className="prose"><h2>Étude de financement</h2><p>La possibilité de financer un véhicule dépend de votre dossier, du véhicule et des critères de l’organisme. Les taux, durées, frais, assurances et modalités ne sont publiés qu’après confirmation par écrit.</p><h3>Pièces justificatives</h3><p>Les pièces éventuelles dépendent de l’organisme et de votre situation. Attendez ses consignes et vérifiez le canal sécurisé avant d’envoyer des documents personnels.</p></div><aside className="info-card info-card-accent"><h3>Besoin d’un véhicule ?</h3><p>Consultez le stock publié ou contactez l’équipe pour connaître les arrivages réellement disponibles.</p><Link className="button button-dark" href="/vehicules">Voir les véhicules</Link></aside></div></div></section>
  </>;
}

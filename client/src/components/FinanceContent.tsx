import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Clock3, FileText, HelpCircle, Info, RefreshCw, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import PageMeta from "@/components/site/PageMeta";
import { Notice, PageIntro, Reveal } from "@/components/site/Shared";
import { trpc } from "@/lib/trpc";

function formatDh(value: number) {
  return `${Math.round(value).toLocaleString("fr-MA")} DH`;
}

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

  const confirmedPartner = partners.data?.find((partner) =>
    partner.annualRate !== null &&
    partner.minTermMonths !== null &&
    partner.maxTermMonths !== null &&
    partner.minTermMonths <= partner.maxTermMonths,
  ) ?? null;

  const terms = useMemo(() => {
    if (!confirmedPartner?.minTermMonths || !confirmedPartner.maxTermMonths) return [];
    const commonTerms = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120];
    return [...new Set([
      confirmedPartner.minTermMonths,
      confirmedPartner.maxTermMonths,
      ...commonTerms.filter((value) => value >= confirmedPartner.minTermMonths! && value <= confirmedPartner.maxTermMonths!),
    ])].sort((a, b) => a - b);
  }, [confirmedPartner]);

  useEffect(() => {
    if (terms.length && !terms.includes(months)) setMonths(terms[0]!);
  }, [terms, months]);

  const priceIsValid = Number.isFinite(price) && price > 0;
  const downIsValid = Number.isFinite(down) && down >= 0 && down <= price;
  const configLoading = settings.isLoading || partners.isLoading;
  const configError = settings.error || partners.error;
  const calculatorReady = Boolean(confirmedPartner && terms.includes(months) && priceIsValid && downIsValid);
  const monthly = useMemo(() => {
    if (!calculatorReady || confirmedPartner?.annualRate === null || confirmedPartner?.annualRate === undefined) return null;
    const principal = price - down;
    const monthlyRate = confirmedPartner.annualRate / 1200;
    if (principal <= 0) return 0;
    return monthlyRate === 0 ? principal / months : principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
  }, [calculatorReady, confirmedPartner, down, months, price]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSent(false);
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("consent") !== "on") {
      setError("Veuillez accepter l’utilisation de vos coordonnées pour envoyer votre demande.");
      return;
    }
    if (!priceIsValid || !downIsValid) {
      setError("Vérifiez le prix du véhicule et le montant de l’apport avant d’envoyer votre demande.");
      return;
    }
    try {
      await mutation.mutateAsync({
        submissionId,
        name: String(data.get("name") || ""),
        phone: String(data.get("phone") || ""),
        email: String(data.get("email") || ""),
        message: String(data.get("message") || ""),
        consent: true,
        website: String(data.get("website") || ""),
        vehiclePrice: price,
        downPayment: down,
        termMonths: terms.includes(months) ? months : null,
        annualRate: confirmedPartner?.annualRate ?? null,
      });
      setSent(true);
      form.reset();
      setSubmissionId(crypto.randomUUID());
    } catch {
      setError("La demande n’a pas pu être enregistrée. Appelez-nous pour en parler.");
    }
  };

  return <>
    <PageMeta title="Financement automobile à Marrakech — Auto Majorelle" description="Préparez votre projet de financement automobile à Marrakech avec des informations distinctes entre simulation indicative, conditions confirmées et demande d’étude." />
    <PageIntro eyebrow="FINANCEMENT AUTO" title="Préparer votre projet, sans promesse floue." intro="Décrivez votre projet à l’équipe Auto Majorelle. Les taux, durées, frais et conditions d’acceptation ne sont affichés comme confirmés qu’après validation par l’organisme concerné." image="/assets/showroom/interior-porsche-macan.jpg" imagePosition="center 55%" />

    <section className="page-content finance-page"><div className="container">
      <div className="finance-intro-grid">
        <Reveal><div className="finance-lead-copy"><span className="eyebrow">UN CADRE CLAIR</span><h2>Une demande d’étude, pas une promesse de crédit.</h2><p>Le prix d’un véhicule ne suffit pas à déterminer une mensualité. Le résultat dépend du montant financé, de la durée, du taux, des frais éventuels, de l’assurance et de l’étude de votre dossier.</p><div className="finance-proof-row"><span><ShieldCheck size={17} /> Informations vérifiées</span><span><Clock3 size={17} /> Conditions à jour</span></div></div></Reveal>
        <Reveal delay={80}><div className="finance-status-card"><span className="eyebrow">ÉTAT DES CONDITIONS</span>{configLoading ? <><div className="finance-status-title"><span className="status-dot status-dot-loading" /> Vérification en cours</div><p>Les conditions publiées sont en cours de chargement.</p></> : configError ? <><div className="finance-status-title"><span className="status-dot status-dot-error" /> Conditions indisponibles</div><p>Les données de financement confirmées n’ont pas pu être chargées.</p><button className="button button-light" type="button" onClick={() => { void settings.refetch(); void partners.refetch(); }}><RefreshCw size={14} /> Réessayer</button></> : confirmedPartner ? <><div className="finance-status-title"><span className="status-dot status-dot-success" /> Conditions publiées</div><p>{confirmedPartner.name} · taux annuel {confirmedPartner.annualRate}% · durée de {confirmedPartner.minTermMonths} à {confirmedPartner.maxTermMonths} mois.</p></> : <><div className="finance-status-title"><span className="status-dot status-dot-muted" /> En attente de confirmation</div><p>Aucun barème complet — taux et durée — n’est actuellement publié. Le formulaire reste disponible pour demander une étude.</p></>}</div></Reveal>
      </div>

      <div className="finance-main-grid">
        <Reveal><div className="calculator calculator-improved">
          <div className="calculator-heading"><span className="eyebrow eyebrow-light">SIMULATION INDICATIVE</span><span className="calculator-pulse" aria-hidden="true" /></div>
          <h2>{confirmedPartner ? `Estimer avec ${confirmedPartner.name}` : "Aucun barème complet disponible"}</h2>
          <p>{confirmedPartner ? "Les paramètres ci-dessous viennent d’un partenaire confirmé et restent indicatifs. Ils ne remplacent pas une proposition écrite." : "Le calcul de mensualité est volontairement désactivé tant qu’un même partenaire n’a pas publié un taux et une plage de durées confirmés."}</p>
          <div className="form-grid">
            <div className="field"><label htmlFor="calc-price">Prix du véhicule (DH)</label><input id="calc-price" type="number" min="1" step="1000" value={price} onChange={(event) => setPrice(Number(event.target.value))} /></div>
            <div className="field"><label htmlFor="calc-down">Apport envisagé (DH)</label><input id="calc-down" type="number" min="0" step="1000" value={down} onChange={(event) => setDown(Number(event.target.value))} /></div>
            <div className="field"><label htmlFor="calc-months">Durée publiée (mois)</label><select id="calc-months" value={terms.includes(months) ? months : ""} disabled={!terms.length} onChange={(event) => setMonths(Number(event.target.value))}>{terms.length ? terms.map((value) => <option key={value} value={value}>{value} mois</option>) : <option value="">À confirmer</option>}</select></div>
            <div className="field"><label htmlFor="calc-rate">Taux annuel publié</label><input id="calc-rate" readOnly aria-readonly="true" value={confirmedPartner?.annualRate === null || !confirmedPartner ? "À confirmer" : `${confirmedPartner.annualRate}%`} /></div>
          </div>
          {!priceIsValid && <div className="notice notice-error">Saisissez un prix supérieur à 0 DH.</div>}
          {priceIsValid && !downIsValid && <div className="notice notice-error">L’apport doit être compris entre 0 et le prix du véhicule.</div>}
          <div className={`calculator-output ${monthly === null ? "calculator-output-muted" : "calculator-output-ready"}`}>
            <small>{monthly === null ? "RÉSULTAT" : "MENSUALITÉ INDICATIVE"}</small>
            <strong>{monthly === null ? "À confirmer" : `${monthly.toLocaleString("fr-MA", { maximumFractionDigits: 0 })} DH / mois`}</strong>
            <span>{monthly === null ? "Aucune mensualité n’est calculée sans taux et durée confirmés par un même partenaire." : `Montant financé indicatif : ${formatDh(price - down)} · hors frais, assurance et critères d’acceptation.`}</span>
          </div>
          <div className="notice notice-info"><Info size={16} /><span>Cette formule estime une mensualité constante. Elle n’intègre pas les frais, l’assurance, les arrondis contractuels ni les critères d’acceptation. Seule l’offre écrite de l’organisme fait foi.</span></div>
        </div></Reveal>

        <Reveal delay={100}><div className="form-card finance-request-card"><span className="eyebrow">PARLONS DE VOTRE PROJET</span><h2>Demander une étude</h2><p>Vous pouvez nous écrire même lorsqu’aucun partenaire n’est publié. L’équipe vous indiquera les informations et documents à fournir selon votre situation.</p>{sent && <Notice kind="success">Votre demande a été enregistrée. L’équipe pourra vous recontacter.</Notice>}{error && <Notice kind="error">{error}</Notice>}
          <form onSubmit={submit}><div className="form-grid"><div className="field"><label htmlFor="finance-name">Nom complet *</label><input id="finance-name" name="name" required minLength={2} maxLength={160} /></div><div className="field"><label htmlFor="finance-phone">Téléphone *</label><input id="finance-phone" name="phone" type="tel" required minLength={7} maxLength={50} /></div><div className="field field-full"><label htmlFor="finance-email">E-mail</label><input id="finance-email" name="email" type="email" maxLength={320} /></div><div className="field field-full"><label htmlFor="finance-message">Votre projet</label><textarea id="finance-message" name="message" maxLength={4000} placeholder="Véhicule recherché, budget, apport, durée souhaitée…" /></div><div className="hidden-field" aria-hidden="true"><label htmlFor="finance-website">Site web</label><input id="finance-website" name="website" tabIndex={-1} autoComplete="off" /></div></div><label className="check-row"><input type="checkbox" name="consent" required /><span>J’accepte l’utilisation de ces coordonnées pour répondre à ma demande.</span></label><button className="button button-red" type="submit" disabled={mutation.isPending || !priceIsValid || !downIsValid}>{mutation.isPending ? "Envoi…" : "Demander une étude"}<ArrowRight size={15} /></button></form>
        </div></Reveal>
      </div>

      <Reveal><div className="finance-confirmed-panel"><div><span className="eyebrow">PARTENAIRES ET CONDITIONS</span><h2>Ce qui est réellement publié</h2></div>{configLoading ? <div className="finance-panel-state"><span className="skeleton skeleton-line" /><span className="skeleton skeleton-line short" /></div> : configError ? <div className="finance-panel-state finance-panel-error"><p>Impossible de charger les partenaires confirmés.</p><button className="button button-dark" type="button" onClick={() => { void partners.refetch(); void settings.refetch(); }}>Réessayer</button></div> : partners.data?.length ? <div className="partner-detail-grid">{partners.data.map((partner) => <article className="partner-detail-card" key={partner.id}>{partner.logoUrl ? <img src={partner.logoUrl} alt={partner.name} loading="lazy" /> : <div className="partner-mark"><ShieldCheck size={18} /></div>}<div><h3>{partner.name}</h3><span className="partner-state"><CheckCircle2 size={13} /> Confirmé et publié</span><p>{partner.description || partner.termsSummary || "Les conditions doivent être vérifiées pour le dossier concerné."}</p>{partner.annualRate !== null && partner.minTermMonths !== null && partner.maxTermMonths !== null && <small>Taux publié : {partner.annualRate}% · durée : {partner.minTermMonths}–{partner.maxTermMonths} mois</small>}</div></article>)}</div> : <div className="finance-empty-state"><div className="partner-mark"><FileText size={18} /></div><div><h3>Aucun partenaire financier confirmé</h3><p>Cette page ne présente aucun logo ni condition commerciale tant qu’un partenaire n’est pas confirmé et publié dans l’administration. Demandez une étude pour connaître les possibilités actuelles.</p></div></div>}</div></Reveal>
    </div></section>

    <section className="section section-surface"><div className="container"><Reveal><div className="section-heading"><span className="eyebrow">COMMENT ÇA MARCHE</span><h2>Les étapes d’une étude sérieuse.</h2><p>Préparez les informations utiles, puis laissez l’organisme concerné confirmer les conditions applicables à votre dossier.</p></div></Reveal><div className="finance-steps"><Reveal delay={40}><article><span>01</span><h3>Choisir un véhicule</h3><p>Partez d’un prix et d’une disponibilité publiés, à confirmer avec l’équipe avant votre visite.</p></article></Reveal><Reveal delay={100}><article><span>02</span><h3>Décrire votre projet</h3><p>Indiquez votre budget, votre apport envisagé et la durée que vous souhaitez étudier.</p></article></Reveal><Reveal delay={160}><article><span>03</span><h3>Vérifier l’offre</h3><p>Demandez le coût total, les frais, l’assurance, les documents et les critères d’acceptation par écrit.</p></article></Reveal></div><div className="two-col finance-bottom"><div className="prose"><h2>Avant d’envoyer vos documents</h2><p>Les justificatifs dépendent de l’organisme et de votre situation. N’envoyez des documents personnels qu’après avoir reçu les consignes du canal concerné et vérifié l’identité de votre interlocuteur.</p><ul className="check-list"><li><CheckCircle2 size={16} /> Prix, apport et montant réellement financé</li><li><CheckCircle2 size={16} /> Durée, nombre d’échéances et coût total</li><li><CheckCircle2 size={16} /> Frais, assurance et conditions de remboursement</li></ul></div><aside className="info-card info-card-accent"><HelpCircle size={20} /><h3>Une question avant de simuler ?</h3><p>Consultez les véhicules publiés ou échangez directement avec l’équipe à Marrakech.</p><div className="finance-cta-stack"><Link className="button button-dark" href="/vehicules">Voir les véhicules</Link><Link className="text-link" href="/contact">Nous contacter <ArrowRight size={14} /></Link></div></aside></div></div></section>
  </>;
}

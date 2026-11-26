import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import PageMeta from "@/components/site/PageMeta";
import { Notice, PageIntro, Reveal } from "@/components/site/Shared";
import { trpc } from "@/lib/trpc";

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

  const partnerWithTerms = partners.data?.find(
    partner => partner.minTermMonths !== null && partner.maxTermMonths !== null,
  ) ?? null;
  const settingsRateIsConfirmed = settings.data?.financingRateConfirmed === "true"
    && Boolean(settings.data.financingRateSource?.trim());
  const annualRate = partnerWithTerms?.annualRate
    ?? (settingsRateIsConfirmed && settings.data?.financingAnnualRate
      ? Number(settings.data.financingAnnualRate)
      : null);
  const terms = useMemo(() => {
    if (!partnerWithTerms?.minTermMonths || !partnerWithTerms.maxTermMonths) return [];
    const common = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120];
    return [...new Set([
      partnerWithTerms.minTermMonths,
      partnerWithTerms.maxTermMonths,
      ...common.filter(value => value >= partnerWithTerms.minTermMonths! && value <= partnerWithTerms.maxTermMonths!),
    ])].sort((a, b) => a - b);
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
    event.preventDefault();
    setError("");
    setSent(false);
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("consent") !== "on") {
      setError("Veuillez accepter l’utilisation de vos coordonnées pour envoyer votre demande.");
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
        termMonths: months,
        annualRate,
      });
      setSent(true);
      form.reset();
      setSubmissionId(crypto.randomUUID());
    } catch {
      setError("La demande n’a pas pu être enregistrée. Appelez-nous pour en parler.");
    }
  };

  return <>
    <PageMeta
      title="Financement automobile à Marrakech — automajorelle"
      description="Simulateur indicatif et demande d’étude de financement à Marrakech."
    />
    <PageIntro
      eyebrow="FINANCEMENT AUTO"
      title="Votre projet de financement, simplement."
      intro="Saisissez le prix et l’apport, puis demandez une étude."
      image="/assets/showroom/interior-porsche-macan.jpg"
      imagePosition="center 55%"
    />
    <section className="page-content">
      <div className="container two-col">
        <Reveal>
          <div>
            <div className="calculator">
              <div className="calculator-heading">
                <span className="eyebrow eyebrow-light">ÉTUDE PERSONNALISÉE</span>
                <span className="calculator-pulse" aria-hidden="true" />
              </div>
              <h2>Simulateur indicatif</h2>
              <p>{annualRate !== null && partnerWithTerms
                ? "Taux et durée confirmés pour cet organisme."
                : annualRate !== null
                  ? "Taux confirmé; durée à confirmer."
                  : "Taux et durée à confirmer par l’organisme."}</p>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="calc-price">Prix du véhicule (DH)</label>
                  <input id="calc-price" type="number" min="0" step="1000" value={price} onChange={event => setPrice(Number(event.target.value))} />
                </div>
                <div className="field">
                  <label htmlFor="calc-down">Apport (DH)</label>
                  <input id="calc-down" type="number" min="0" step="1000" value={down} onChange={event => setDown(Number(event.target.value))} />
                </div>
                <div className="field">
                  <label htmlFor="calc-months">Durée (mois)</label>
                  <select id="calc-months" value={terms.includes(months) ? months : ""} disabled={!terms.length} onChange={event => setMonths(Number(event.target.value))}>
                    {terms.length ? terms.map(value => <option key={value} value={value}>{value} mois</option>) : <option value="">À confirmer</option>}
                  </select>
                </div>
                <div className="field">
                  <label>Taux annuel confirmé</label>
                  <input readOnly aria-readonly="true" value={annualRate === null ? "À confirmer" : `${annualRate}%`} />
                </div>
              </div>
              <div className="calculator-output">
                <small>Montant financé estimatif</small>
                <strong>{Math.max(0, price - down).toLocaleString("fr-MA")} DH</strong>
                {monthly === null
                  ? <span>Mensualité affichée après confirmation du taux et de la durée.</span>
                  : <span>Mensualité estimée : {monthly.toLocaleString("fr-MA", { maximumFractionDigits: 0 })} DH/mois.</span>}
              </div>
              {down > price && <div className="notice notice-error">L’apport ne peut pas dépasser le prix saisi.</div>}
            </div>
            <p className="financing-note">Simulation indicative. Taux, durée, frais et accord final à confirmer par l’organisme.</p>
            <div className="admin-card financing-partners">
              <h2>{partners.data?.length ? "Partenaires confirmés" : "Conditions de financement"}</h2>
              {partners.isLoading
                ? <p>Chargement…</p>
                : partners.error
                  ? <p>Conditions momentanément indisponibles. Contactez-nous pour vérifier les modalités.</p>
                  : partners.data?.length
                    ? <div className="partner-grid">{partners.data.map(partner => <article className="partner-card" key={partner.id}>
                      {partner.logoUrl ? <img src={partner.logoUrl} alt={partner.name} loading="lazy" /> : <strong>{partner.name}</strong>}
                    </article>)}</div>
                    : <p>Aucune condition confirmée actuellement. Contactez-nous pour votre dossier.</p>}
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="form-card">
            <span className="eyebrow">PARLONS DE VOTRE PROJET</span>
            <h2>Demander une étude</h2>
            <p>L’équipe vous recontactera après étude de votre dossier.</p>
            {sent && <Notice kind="success">Votre demande a été enregistrée. L’équipe pourra vous recontacter.</Notice>}
            {error && <Notice kind="error">{error}</Notice>}
            <form onSubmit={submit}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="finance-name">Nom complet *</label>
                  <input id="finance-name" name="name" required minLength={2} maxLength={160} />
                </div>
                <div className="field">
                  <label htmlFor="finance-phone">Téléphone *</label>
                  <input id="finance-phone" name="phone" type="tel" required minLength={7} maxLength={50} />
                </div>
                <div className="field field-full">
                  <label htmlFor="finance-email">E-mail</label>
                  <input id="finance-email" name="email" type="email" maxLength={320} />
                </div>
                <div className="field field-full">
                  <label htmlFor="finance-message">Précisions sur votre projet</label>
                  <textarea id="finance-message" name="message" maxLength={4000} placeholder="Véhicule recherché, budget, apport…" />
                </div>
                <div className="hidden-field" aria-hidden="true">
                  <label htmlFor="finance-website">Site web</label>
                  <input id="finance-website" name="website" tabIndex={-1} autoComplete="off" />
                </div>
              </div>
              <label className="check-row">
                <input type="checkbox" name="consent" required />
                <span>J’accepte l’utilisation de ces coordonnées pour répondre à ma demande.</span>
              </label>
              <button className="button button-red" type="submit" disabled={mutation.isPending || down > price}>
                {mutation.isPending ? "Envoi…" : "Demander une étude"}<ArrowRight size={15} />
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  </>;
}

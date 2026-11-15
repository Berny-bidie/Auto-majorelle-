import { useEffect, useState, type FormEvent } from "react";
import { Camera, Check, Info } from "lucide-react";
import PageMeta from "@/components/site/PageMeta";
import { Notice, PageIntro } from "@/components/site/Shared";
import { trpc } from "@/lib/trpc";

async function readFile(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Compression non disponible");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  for (const quality of [0.78, 0.66, 0.54, 0.42]) {
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/webp", quality));
    if (!blob) continue;
    if (blob.size > 650 * 1024) continue;
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Lecture impossible"));
      reader.onerror = () => reject(new Error("Lecture impossible"));
      reader.readAsDataURL(blob);
    });
  }
  throw new Error("La photo compressée reste trop volumineuse");
}

export default function TradeInPage() {
  const mutation = trpc.automajorel.leads.tradeIn.useMutation();
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const urls = photos.map(file => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [photos]);

  const selectPhotos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length > 5) { setError("Vous pouvez joindre jusqu’à 5 photos."); return; }
    if (selected.some(file => !/^image\/(jpeg|png|webp)$/.test(file.type))) { setError("Utilisez des images JPG, PNG ou WebP."); return; }
    if (selected.some(file => file.size > 5 * 1024 * 1024)) { setError("Chaque photo source doit faire 5 Mo maximum."); return; }
    setError(""); setPhotos(selected);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSent(false); setError("");
    const form = event.currentTarget; const data = new FormData(form);
    if (data.get("consent") !== "on") { setError("Veuillez accepter l’utilisation de vos coordonnées et des photos pour envoyer votre demande."); return; }
    try {
      const dataUrls = await Promise.all(photos.map(readFile));
      await mutation.mutateAsync({ submissionId, name: String(data.get("name") || ""), phone: String(data.get("phone") || ""), email: String(data.get("email") || ""), message: String(data.get("message") || ""), consent: true, website: String(data.get("website") || ""), brand: String(data.get("brand") || ""), model: String(data.get("model") || ""), year: Number(data.get("year")), mileageKm: Number(data.get("mileageKm")), fuel: String(data.get("fuel") || ""), condition: String(data.get("condition") || ""), photos: dataUrls });
      setSent(true); setPhotos([]); form.reset(); setSubmissionId(crypto.randomUUID());
    } catch { setError("La demande de reprise n’a pas pu être enregistrée. Vérifiez les photos ou contactez-nous directement."); }
  };

  return <>
    <PageMeta title="Reprise voiture à Marrakech — Auto Majorelle" description="Proposez votre véhicule à Auto Majorelle à Marrakech. Transmettez ses caractéristiques et des photos afin que l’équipe étudie votre demande de reprise." />
    <PageIntro eyebrow="REPRISE & RACHAT" title="Parlez-nous de votre véhicule." intro="Transmettez les informations utiles et des photos. Notre équipe étudiera votre demande et vous contactera; aucune valeur automatique n’est annoncée." image="/assets/showroom/showroom-range-rover-rear.jpg" imagePosition="center 56%" />
    <section className="page-content"><div className="container two-col">
      <div className="prose"><h2>Comment ça se passe ?</h2><ol><li>Vous partagez les caractéristiques et l’état général du véhicule.</li><li>Vous pouvez joindre jusqu’à cinq photos.</li><li>La demande est enregistrée dans l’espace privé Auto Majorelle.</li><li>L’équipe vous recontacte pour préciser les prochaines étapes et les documents utiles.</li></ol><div className="notice notice-info"><Info size={16} />Ce formulaire ne produit pas d’estimation automatique ni d’engagement d’achat. Aucune durée ni valeur n’est promise; toute proposition dépend de l’examen du véhicule et d’un échange avec l’équipe.</div><ul className="check-list"><li><Check size={16} /> Marque, modèle, année et kilométrage</li><li><Check size={16} /> Motorisation et état général</li><li><Check size={16} /> Photos éventuelles de l’extérieur et de l’habitacle</li></ul><img src="/assets/showroom/showroom-range-rover-rear.jpg" alt="Véhicule dans le showroom Auto Majorelle" loading="lazy" style={{ width: "100%", maxHeight: 300, objectFit: "cover", marginTop: 28 }} /></div>
      <div className="form-card"><h2>Demander une étude de reprise</h2><p>Les renseignements demandés permettent à l’équipe de traiter votre demande.</p>
        {sent && <Notice kind="success">Votre demande de reprise est enregistrée. Les photos éventuelles ont été déposées dans le stockage privé du projet.</Notice>}{error && <Notice kind="error">{error}</Notice>}
        <form onSubmit={submit}><div className="form-grid">
          <div className="field"><label htmlFor="trade-name">Nom complet *</label><input id="trade-name" name="name" required minLength={2} maxLength={160} /></div><div className="field"><label htmlFor="trade-phone">Téléphone *</label><input id="trade-phone" name="phone" type="tel" required minLength={7} maxLength={50} /></div>
          <div className="field field-full"><label htmlFor="trade-email">E-mail</label><input id="trade-email" name="email" type="email" maxLength={320} /></div>
          <div className="field"><label htmlFor="trade-brand">Marque *</label><input id="trade-brand" name="brand" required maxLength={80} /></div><div className="field"><label htmlFor="trade-model">Modèle *</label><input id="trade-model" name="model" required maxLength={120} /></div>
          <div className="field"><label htmlFor="trade-year">Année *</label><input id="trade-year" name="year" type="number" min="1950" max="2100" required /></div><div className="field"><label htmlFor="trade-mileage">Kilométrage *</label><input id="trade-mileage" name="mileageKm" type="number" min="0" max="2000000" required /></div>
          <div className="field"><label htmlFor="trade-fuel">Motorisation *</label><select id="trade-fuel" name="fuel" required defaultValue=""><option value="" disabled>Choisir</option>{["Essence", "Diesel", "Hybride", "Électrique", "Autre"].map(item => <option key={item}>{item}</option>)}</select></div><div className="field"><label htmlFor="trade-condition">État général *</label><select id="trade-condition" name="condition" required defaultValue=""><option value="" disabled>Choisir</option>{["Très bon état", "Bon état", "À signaler des défauts", "À remettre en état"].map(item => <option key={item}>{item}</option>)}</select></div>
          <div className="field field-full"><label htmlFor="trade-message">Description complémentaire</label><textarea id="trade-message" name="message" maxLength={4000} placeholder="Entretien, options, défauts connus…" /></div>
          <div className="field field-full"><label htmlFor="trade-photos">Photos (facultatif, 5 maximum)</label><div className="file-picker"><Camera size={16} /><input id="trade-photos" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectPhotos} /></div><span className="field-help">JPG, PNG ou WebP · fichier source 5 Mo maximum par image; compression avant transfert.</span>{previews.length > 0 && <div className="photo-preview-row">{previews.map((url, index) => <img key={url} src={url} alt={`Aperçu ${index + 1}`} />)}</div>}</div>
          <div className="hidden-field" aria-hidden="true"><label htmlFor="trade-website">Site web</label><input id="trade-website" name="website" tabIndex={-1} autoComplete="off" /></div>
        </div><label className="check-row"><input type="checkbox" name="consent" required /><span>J’accepte l’utilisation de mes coordonnées et des photos transmises pour traiter cette demande.</span></label><button type="submit" className="button button-red" disabled={mutation.isPending}>{mutation.isPending ? "Envoi…" : "Demander une étude"}</button></form>
      </div>
    </div></section>
  </>;
}

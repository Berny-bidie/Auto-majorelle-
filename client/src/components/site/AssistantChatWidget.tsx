import { useEffect, useState } from "react";
import { Bot, X } from "lucide-react";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { useLanguage } from "@/lib/i18n";

const copy = {
  fr: {
    title: "Assistant Auto Majorelle",
    subtitle: "Des repères utiles pour votre projet automobile",
    open: "Ouvrir l’assistant automobile",
    close: "Fermer l’assistant",
    empty: "Posez votre question ou choisissez un sujet",
    placeholder: "Écrivez votre question…",
    prompts: ["Quels véhicules sont disponibles ?", "Comment fonctionne le financement ?", "Comment faire reprendre ma voiture ?"],
  },
  en: {
    title: "Auto Majorelle assistant",
    subtitle: "Helpful guidance for your car plans",
    open: "Open the car assistant",
    close: "Close the assistant",
    empty: "Ask a question or choose a topic",
    placeholder: "Type your question…",
    prompts: ["Which vehicles are available?", "How does financing work?", "How can I trade in my car?"],
  },
  ar: {
    title: "مساعد أوتو ماجوريل",
    subtitle: "إرشادات مفيدة لمشروعك المتعلق بالسيارات",
    open: "افتح مساعد السيارات",
    close: "أغلق المساعد",
    empty: "اكتب سؤالك أو اختر موضوعًا",
    placeholder: "اكتب سؤالك…",
    prompts: ["ما السيارات المتاحة؟", "كيف يعمل التمويل؟", "كيف أستبدل سيارتي؟"],
  },
} as const;

function responseTo(message: string, locale: "fr" | "en" | "ar") {
  const query = message.toLocaleLowerCase();
  const has = (...terms: string[]) => terms.some(term => query.includes(term));
  const whatsapp = "https://wa.me/212678880268";
  if (has("financ", "credit", "crédit", "loan", "leasing", "mourabaha", "تمويل", "قرض", "تقسيط")) {
    if (locale === "en") return `Financing terms, rates and eligibility depend on the institution and your file; please confirm them with the team. [See financing information](/financement) or [message us on WhatsApp](${whatsapp}).`;
    if (locale === "ar") return `تعتمد شروط التمويل وأسعاره والأهلية على المؤسسة وملفك؛ يرجى تأكيدها مع الفريق. [اطّلع على معلومات التمويل](/financement) أو [راسلنا عبر واتساب](${whatsapp}).`;
    return `Les taux, conditions et critères d’acceptation dépendent de l’organisme et de votre dossier; confirmez-les avec l’équipe. [Voir les informations financement](/financement) ou [écrire sur WhatsApp](${whatsapp}).`;
  }
  if (has("reprise", "trade", "exchange", "sell my", "estimation", "تبديل", "استبدال", "بيع سيارتي")) {
    if (locale === "en") return `For a trade-in, share the make, model, year, mileage and condition of your vehicle with the team. No automatic estimate is guaranteed. [Trade-in information](/reprise) · [WhatsApp](${whatsapp}).`;
    if (locale === "ar") return `لدراسة الاستبدال، أرسل إلى الفريق ماركة سيارتك وطرازها وسنتها والمسافة المقطوعة وحالتها. لا يوجد تقييم آلي مضمون. [معلومات الاستبدال](/reprise) · [واتساب](${whatsapp}).`;
    return `Pour étudier une reprise, indiquez à l’équipe la marque, le modèle, l’année, le kilométrage et l’état du véhicule. Aucune estimation automatique n’est garantie. [Informations reprise](/reprise) · [WhatsApp](${whatsapp}).`;
  }
  if (has("voiture", "véhicule", "vehicule", "stock", "disponible", "car", "vehicle", "inventory", "السيارات", "سيارة", "متاح")) {
    if (locale === "en") return `Availability can change. Check [the vehicle listings](/vehicules), then contact the team to confirm a specific vehicle. [WhatsApp](${whatsapp}).`;
    if (locale === "ar") return `قد يتغير التوفر. راجع [قائمة السيارات](/vehicules)، ثم تواصل مع الفريق لتأكيد سيارة محددة. [واتساب](${whatsapp}).`;
    return `Les disponibilités peuvent changer. Consultez [les véhicules publiés](/vehicules), puis confirmez la disponibilité d’un modèle précis avec l’équipe. [WhatsApp](${whatsapp}).`;
  }
  if (has("horaire", "heure", "adresse", "contact", "appeler", "phone", "address", "opening", "location", "مواعيد", "عنوان", "هاتف")) {
    if (locale === "en") return `You can call the showroom at [+212 678 880 268](tel:+212678880268) or [open the contact page](/contact). Please confirm the address and opening hours before visiting.`;
    if (locale === "ar") return `يمكنك الاتصال بالمعرض على [+212 678 880 268](tel:+212678880268) أو [فتح صفحة التواصل](/contact). يُرجى تأكيد العنوان وساعات العمل قبل الزيارة.`;
    return `Appelez le showroom au [+212 678 880 268](tel:+212678880268) ou [ouvrez la page contact](/contact). Merci de confirmer l’adresse et les horaires avant votre visite.`;
  }
  if (locale === "en") return `I can help with [vehicles](/vehicules), [financing](/financement), [trade-ins](/reprise) and [contact](/contact). For a specific case, the team can confirm the details on [WhatsApp](${whatsapp}).`;
  if (locale === "ar") return `يمكنني مساعدتك بشأن [السيارات](/vehicules) و[التمويل](/financement) و[استبدال السيارات](/reprise) و[التواصل](/contact). للحالات المحددة، يمكن للفريق تأكيد التفاصيل عبر [واتساب](${whatsapp}).`;
  return `Je peux vous orienter vers les pages [véhicules](/vehicules), [financement](/financement), [reprise](/reprise) et [contact](/contact). Pour un cas précis, l’équipe pourra confirmer les informations sur [WhatsApp](${whatsapp}).`;
}

export default function AssistantChatWidget() {
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const text = copy[locale];

  useEffect(() => {
    setMessages([]);
    setIsLoading(false);
  }, [locale]);

  const send = (content: string) => {
    setMessages(previous => [...previous, { role: "user", content }]);
    setIsLoading(true);
    window.setTimeout(() => {
      setMessages(previous => [...previous, { role: "assistant", content: responseTo(content, locale) }]);
      setIsLoading(false);
    }, 380);
  };

  return <div className="assistant-widget" dir={locale === "ar" ? "rtl" : "ltr"}>
    {open && <section className="assistant-panel" aria-label={text.title}>
      <header className="assistant-panel-header">
        <div><strong>{text.title}</strong><small>{text.subtitle}</small></div>
        <button type="button" className="assistant-close" aria-label={text.close} onClick={() => setOpen(false)}><X size={18} /></button>
      </header>
      <AIChatBox
        messages={messages}
        onSendMessage={send}
        isLoading={isLoading}
        placeholder={text.placeholder}
        height="430px"
        className="assistant-chatbox"
        emptyStateMessage={text.empty}
        suggestedPrompts={[...text.prompts]}
      />
      <p className="assistant-note">{locale === "ar" ? "إرشادات عامة؛ أكّدوا المعلومات التجارية مع الفريق." : locale === "en" ? "General guidance; confirm business details with the team." : "Repères généraux; confirmez les informations commerciales avec l’équipe."}</p>
    </section>}
    <button type="button" className="assistant-trigger" aria-label={open ? text.close : text.open} aria-expanded={open} onClick={() => setOpen(value => !value)}>
      {open ? <X size={23} /> : <><Bot size={23} /><span>{locale === "ar" ? "مساعد" : locale === "en" ? "Help" : "Aide"}</span></>}
    </button>
  </div>;
}

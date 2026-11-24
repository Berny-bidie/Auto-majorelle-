import type { Locale } from "@/locales/translations";

type ServiceCopy = { name: Record<Locale, string>; description: Record<Locale, string>; ctaLabel: Record<Locale, string> };

export const localizedServices: Record<string, ServiceCopy> = {
  "decouvrir-un-vehicule": {
    name: { fr: "Découvrir un véhicule", en: "Explore a vehicle", ar: "اكتشف سيارة" },
    description: {
      fr: "Consultez les annonces publiées, demandez les caractéristiques manquantes et convenez d’une visite au showroom pour examiner le véhicule.",
      en: "Browse the published listings, ask for any missing specifications, and arrange a showroom visit to inspect the vehicle.",
      ar: "اطّلع على الإعلانات المنشورة، واستفسر عن المواصفات الناقصة، ورتّب زيارة إلى المعرض لمعاينة السيارة.",
    },
    ctaLabel: { fr: "Voir les véhicules", en: "View vehicles", ar: "عرض السيارات" },
  },
  "parler-de-financement": {
    name: { fr: "Parler de financement", en: "Discuss financing", ar: "تحدّث عن التمويل" },
    description: {
      fr: "Décrivez votre projet à notre équipe. Un taux, une durée et une offre définitive doivent être confirmés par l’organisme concerné.",
      en: "Tell our team about your plans. The relevant institution must confirm the rate, term, and final offer.",
      ar: "أخبر فريقنا بمشروعك. ويجب على الجهة المعنية تأكيد السعر والمدة والعرض النهائي.",
    },
    ctaLabel: { fr: "Étudier mon projet", en: "Discuss my plans", ar: "دراسة مشروعي" },
  },
  "envisager-une-reprise": {
    name: { fr: "Envisager une reprise", en: "Consider a trade-in", ar: "فكّر في استبدال سيارتك" },
    description: {
      fr: "Fournissez les informations de votre voiture et des photos. L’équipe pourra étudier votre demande; aucune estimation automatique n’est produite.",
      en: "Provide details about your car and photos. The team can review your request; no automated valuation is provided.",
      ar: "قدّم معلومات عن سيارتك وصورًا لها. يمكن للفريق دراسة طلبك؛ ولا يتم تقديم تقييم آلي.",
    },
    ctaLabel: { fr: "Demander une étude", en: "Request a review", ar: "اطلب دراسة" },
  },
};

export const genericServiceCopy = {
  name: { fr: "Un échange avec l’équipe", en: "Talk with our team", ar: "تواصل مع فريقنا" },
  description: {
    fr: "Contactez Auto Majorelle pour obtenir des informations confirmées qui correspondent à votre demande.",
    en: "Contact Auto Majorelle for confirmed information relevant to your request.",
    ar: "تواصل مع أوتو ماجوريل للحصول على معلومات مؤكدة تناسب طلبك.",
  },
  ctaLabel: { fr: "Nous contacter", en: "Contact us", ar: "اتصل بنا" },
} satisfies ServiceCopy;

import type { Locale } from "@/locales/translations";

type LocalizedText = Record<Locale, string>;

type FallbackService = {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  ctaLabel: LocalizedText;
  ctaUrl: string;
};

export const fallbackServices: FallbackService[] = [
  {
    id: "vehicle-stock",
    slug: "vehicules",
    name: { fr: "Véhicules disponibles", en: "Available vehicles", ar: "السيارات المتاحة" },
    description: {
      fr: "Parcourez les annonces publiées et comparez les informations utiles : prix affiché, année, kilométrage, motorisation, équipements et photos. La disponibilité et les détails d’un modèle sont à confirmer auprès de l’équipe avant votre visite.",
      en: "Browse published listings and compare useful details: displayed price, year, mileage, engine, equipment and photos. Confirm a vehicle’s availability and details with the team before visiting.",
      ar: "تصفح الإعلانات المنشورة وقارن المعلومات المفيدة: السعر المعروض، سنة الصنع، المسافة المقطوعة، المحرك، التجهيزات والصور. يرجى تأكيد توفر السيارة وتفاصيلها مع الفريق قبل الزيارة.",
    },
    icon: "car-front",
    ctaLabel: { fr: "Voir les véhicules", en: "View vehicles", ar: "عرض السيارات" },
    ctaUrl: "/vehicules",
  },
  {
    id: "trade-in",
    slug: "reprise",
    name: { fr: "Demande de reprise", en: "Trade-in request", ar: "طلب استبدال السيارة" },
    description: {
      fr: "Transmettez la marque, le modèle, l’année, le kilométrage, la motorisation et l’état général de votre véhicule. L’équipe pourra étudier les informations communiquées et vous recontacter; aucune estimation automatique n’est garantie.",
      en: "Share your vehicle’s make, model, year, mileage, engine and general condition. The team can review the information and contact you; no automatic valuation is guaranteed.",
      ar: "أرسل ماركة سيارتك وطرازها وسنة الصنع والمسافة المقطوعة ونوع المحرك والحالة العامة. يمكن للفريق مراجعة المعلومات والاتصال بك؛ ولا يوجد تقييم آلي مضمون.",
    },
    icon: "handshake",
    ctaLabel: { fr: "Présenter mon véhicule", en: "Share my vehicle details", ar: "تقديم معلومات سيارتي" },
    ctaUrl: "/reprise",
  },
  {
    id: "financing",
    slug: "financement",
    name: { fr: "Informations financement", en: "Financing information", ar: "معلومات التمويل" },
    description: {
      fr: "Exposez votre projet et votre budget à l’équipe. Les possibilités, les critères d’acceptation, les taux et les échéances dépendent de l’organisme partenaire et de l’étude de chaque dossier; demandez les conditions à jour avant toute décision.",
      en: "Discuss your plans and budget with the team. Options, eligibility, rates and instalments depend on the provider and an individual review; request current terms before making a decision.",
      ar: "ناقش مشروعك وميزانيتك مع الفريق. تعتمد الخيارات ومعايير القبول والمعدلات والأقساط على الجهة ودراسة كل ملف؛ اطلب الشروط الحالية قبل اتخاذ أي قرار.",
    },
    icon: "search",
    ctaLabel: { fr: "Découvrir le financement", en: "Explore financing", ar: "اكتشف معلومات التمويل" },
    ctaUrl: "/financement",
  },
  {
    id: "showroom-visit",
    slug: "visite-showroom",
    name: { fr: "Visite du showroom à Marrakech", en: "Visit the Marrakech showroom", ar: "زيارة معرض مراكش" },
    description: {
      fr: "Le showroom se trouve au Quartier industriel Sidi Ghanem 127, Marrakech 40000. Contactez l’équipe pour vérifier qu’un véhicule est toujours disponible et confirmer les horaires avant de vous déplacer.",
      en: "The showroom is at Quartier industriel Sidi Ghanem 127, Marrakech 40000. Contact the team to confirm vehicle availability and opening hours before travelling.",
      ar: "يقع المعرض في Quartier industriel Sidi Ghanem 127، مراكش 40000. تواصل مع الفريق لتأكيد توفر السيارة وساعات العمل قبل التنقل.",
    },
    icon: "message-circle",
    ctaLabel: { fr: "Coordonnées et itinéraire", en: "Contact and directions", ar: "معلومات الاتصال والاتجاهات" },
    ctaUrl: "/contact",
  },
];

export function getLocalizedFallbackServices(locale: Locale) {
  return fallbackServices.map(service => ({
    ...service,
    name: service.name[locale],
    description: service.description[locale],
    ctaLabel: service.ctaLabel[locale],
  }));
}

type FallbackArticle = {
  slug: string;
  title: LocalizedText;
  category: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  imageUrl: string;
  readingMinutes: number;
};

export const fallbackBlogArticles: FallbackArticle[] = [
  {
    slug: "preparer-visite-voiture-occasion",
    title: {
      fr: "Préparer la visite d’une voiture d’occasion : les bonnes questions",
      en: "Preparing to view a used car: questions worth asking",
      ar: "الاستعداد لمعاينة سيارة مستعملة: أسئلة مفيدة",
    },
    category: { fr: "Guide d’achat", en: "Buying guide", ar: "دليل الشراء" },
    excerpt: {
      fr: "Une courte liste de vérifications pour comparer une annonce et préparer un échange utile avec l’équipe.",
      en: "A short checklist for comparing a listing and preparing a useful conversation with the team.",
      ar: "قائمة قصيرة لمقارنة إعلان والاستعداد للتواصل مع الفريق.",
    },
    body: {
      fr: "Avant de vous déplacer, vérifiez que l’annonce correspond à votre besoin et contactez le showroom pour confirmer que le véhicule est toujours disponible.\n\n## Les informations à comparer\n- Le prix affiché, l’année et le kilométrage indiqués.\n- La motorisation, la boîte de vitesses et les équipements mentionnés.\n- Les photos de l’habitacle, de la carrosserie et des détails importants.\n\n## Pendant la visite\nDemandez à voir les éléments qui comptent pour votre usage et posez vos questions sur l’état, les documents disponibles et les conditions applicables. Les réponses et les documents propres au véhicule doivent être confirmés par l’équipe; une annonce ne remplace pas une inspection.\n\nPour organiser votre passage, indiquez le modèle qui vous intéresse et convenez d’un rendez-vous avec le showroom.",
      en: "Before travelling, check that the listing matches your needs and contact the showroom to confirm that the vehicle is still available.\n\n## Details to compare\n- The displayed price, year and stated mileage.\n- The engine, transmission and equipment listed.\n- Photos of the cabin, bodywork and important details.\n\n## During your visit\nAsk to see the features that matter for your use and ask about condition, available documents and applicable terms. The team must confirm the vehicle-specific answers and documents; a listing is not a substitute for an inspection.\n\nTo plan your visit, tell the showroom which model interests you and arrange an appointment.",
      ar: "قبل التنقل، تحقق من أن الإعلان يناسب احتياجاتك واتصل بالمعرض للتأكد من أن السيارة ما زالت متاحة.\n\n## معلومات للمقارنة\n- السعر المعروض وسنة الصنع والمسافة المقطوعة المذكورة.\n- نوع المحرك وناقل الحركة والتجهيزات المدرجة.\n- صور المقصورة والهيكل والتفاصيل المهمة.\n\n## أثناء الزيارة\nاطلب معاينة التجهيزات التي تهمك واسأل عن الحالة والوثائق المتوفرة والشروط المطبقة. يجب أن يؤكد الفريق المعلومات والوثائق الخاصة بالسيارة؛ فالإعلان لا يغني عن المعاينة.\n\nلترتيب زيارتك، أخبر المعرض بالطراز الذي يهمك وحدد موعدًا.",
    },
    imageUrl: "/assets/showroom/showroom-mini-front.jpg",
    readingMinutes: 3,
  },
  {
    slug: "comparer-annonces-automobiles",
    title: {
      fr: "Comparer des annonces automobiles avec méthode",
      en: "How to compare car listings methodically",
      ar: "مقارنة إعلانات السيارات بطريقة منظمة",
    },
    category: { fr: "Conseils pratiques", en: "Practical tips", ar: "نصائح عملية" },
    excerpt: {
      fr: "Au-delà du prix, rassemblez les mêmes critères pour chaque véhicule et faites confirmer les points importants.",
      en: "Look beyond price: compare the same criteria for each car and confirm the details that matter.",
      ar: "لا تكتفِ بالسعر؛ قارن المعايير نفسها لكل سيارة وتأكد من التفاصيل المهمة.",
    },
    body: {
      fr: "Comparer plusieurs annonces devient plus simple si vous notez les mêmes critères pour chaque véhicule.\n\n## Créer votre grille de comparaison\n- Prix affiché et budget prévu.\n- Année, kilométrage, carburant et transmission.\n- Équipements qui sont réellement importants pour vous.\n- Disponibilité du véhicule et informations manquantes à demander.\n\n## Vérifier avant de décider\nLes annonces ne décrivent pas toujours les mêmes éléments. Demandez au vendeur de clarifier les points absents et de confirmer les informations, l’état du véhicule et les conditions avant de prendre votre décision. Les prix et disponibilités peuvent évoluer.",
      en: "Comparing several listings is easier when you record the same details for every vehicle.\n\n## Build a comparison checklist\n- Displayed price and your planned budget.\n- Year, mileage, fuel and transmission.\n- Equipment that genuinely matters to you.\n- Vehicle availability and details you still need to ask about.\n\n## Confirm before deciding\nListings do not always describe the same details. Ask the seller to clarify anything missing and confirm the information, vehicle condition and terms before making a decision. Prices and availability can change.",
      ar: "تصبح مقارنة عدة إعلانات أسهل عندما تسجل المعايير نفسها لكل سيارة.\n\n## إعداد قائمة للمقارنة\n- السعر المعروض والميزانية التي حددتها.\n- سنة الصنع والمسافة المقطوعة والوقود وناقل الحركة.\n- التجهيزات المهمة فعليًا بالنسبة لك.\n- توفر السيارة والمعلومات التي تحتاج إلى السؤال عنها.\n\n## التأكد قبل اتخاذ القرار\nلا تعرض الإعلانات دائمًا التفاصيل نفسها. اطلب توضيح المعلومات الناقصة وتأكيد البيانات وحالة السيارة والشروط قبل اتخاذ القرار. قد تتغير الأسعار والتوفر.",
    },
    imageUrl: "/assets/showroom/majorelle-auto-showroom.jpg",
    readingMinutes: 3,
  },
  {
    slug: "preparer-demande-reprise-voiture",
    title: {
      fr: "Préparer une demande de reprise de véhicule",
      en: "Preparing a vehicle trade-in request",
      ar: "الاستعداد لطلب استبدال السيارة",
    },
    category: { fr: "Reprise", en: "Trade-in", ar: "استبدال السيارة" },
    excerpt: {
      fr: "Les renseignements et photos qui aident l’équipe à comprendre votre demande avant de vous répondre.",
      en: "The details and photos that help the team understand your request before responding.",
      ar: "المعلومات والصور التي تساعد الفريق على فهم طلبك قبل الرد.",
    },
    body: {
      fr: "Une demande claire aide l’équipe à comprendre votre véhicule et à vous recontacter avec les prochaines étapes.\n\n## Préparez les informations utiles\n- Marque, modèle, année et kilométrage.\n- Type de carburant et état général décrit simplement.\n- Photos récentes, si vous pouvez les fournir.\n- Un numéro de téléphone et un moment adapté pour être rappelé.\n\nTransmettez votre demande depuis le formulaire de reprise. L’équipe examinera les éléments communiqués et vous indiquera la suite. La valeur et les modalités éventuelles ne peuvent être confirmées qu’après étude de votre véhicule et de son dossier.",
      en: "A clear request helps the team understand your vehicle and get back to you with next steps.\n\n## Gather useful details\n- Make, model, year and mileage.\n- Fuel type and a simple description of the overall condition.\n- Recent photos, if you can provide them.\n- A phone number and a suitable time to call you back.\n\nSend your request through the trade-in form. The team will review the information and explain what comes next. Any value or terms can only be confirmed after reviewing the vehicle and its details.",
      ar: "يساعد الطلب الواضح الفريق على فهم سيارتك والاتصال بك بشأن الخطوات التالية.\n\n## جهّز المعلومات المفيدة\n- الماركة والطراز وسنة الصنع والمسافة المقطوعة.\n- نوع الوقود ووصف بسيط للحالة العامة.\n- صور حديثة إن أمكن.\n- رقم هاتف ووقت مناسب للاتصال بك.\n\nأرسل طلبك عبر نموذج الاستبدال. سيراجع الفريق المعلومات ويشرح الخطوات التالية. ولا يمكن تأكيد أي قيمة أو شروط إلا بعد دراسة السيارة وملفها.",
    },
    imageUrl: "/assets/showroom/interior-range-rover-red.jpg",
    readingMinutes: 3,
  },
  {
    slug: "questions-poser-financement-auto",
    title: {
      fr: "Financement automobile : les questions à poser avant de comparer",
      en: "Car finance: questions to ask before comparing options",
      ar: "تمويل السيارات: أسئلة مفيدة قبل المقارنة",
    },
    category: { fr: "Financement", en: "Financing", ar: "التمويل" },
    excerpt: {
      fr: "Comprenez les paramètres d’une offre et demandez des conditions à jour adaptées à votre dossier.",
      en: "Understand an offer's terms and request current details for your own application.",
      ar: "افهم شروط العرض واطلب معلومات حديثة تناسب ملفك.",
    },
    body: {
      fr: "Les offres de financement dépendent de l’organisme, du véhicule et de la situation de chaque demandeur. Avant de comparer, demandez les éléments écrits qui s’appliquent à votre dossier.\n\n## Points à clarifier\n- Le montant financé, l’apport et la durée proposés.\n- Le montant et le nombre des échéances.\n- Les frais, assurances ou autres conditions éventuelles.\n- Les documents à fournir et les critères d’acceptation.\n\nNe vous fiez pas à un taux ou à une mensualité générique : demandez une proposition à jour et vérifiez le coût total et les conditions auprès de l’organisme concerné. Une demande d’information ne vaut pas accord de financement.",
      en: "Financing offers depend on the provider, vehicle and each applicant's circumstances. Before comparing, request written details that apply to your own application.\n\n## Points to clarify\n- The amount financed, deposit and proposed term.\n- The amount and number of instalments.\n- Any fees, insurance or other conditions.\n- Required documents and eligibility criteria.\n\nDo not rely on a generic rate or monthly payment: request a current proposal and check the total cost and terms with the relevant provider. An enquiry is not financing approval.",
      ar: "تعتمد عروض التمويل على الجهة والسيارة وظروف كل طالب. قبل المقارنة، اطلب التفاصيل المكتوبة التي تنطبق على ملفك.\n\n## نقاط ينبغي توضيحها\n- المبلغ الممول والدفعة المقدمة والمدة المقترحة.\n- قيمة وعدد الأقساط.\n- أي رسوم أو تأمين أو شروط أخرى.\n- الوثائق المطلوبة ومعايير القبول.\n\nلا تعتمد على معدل أو قسط شهري عام؛ اطلب عرضًا حديثًا وتحقق من التكلفة الإجمالية والشروط لدى الجهة المعنية. طلب المعلومات لا يعني الموافقة على التمويل.",
    },
    imageUrl: "/assets/showroom/majorelle-auto-showroom.jpg",
    readingMinutes: 3,
  },
];

export function getFallbackBlogArticle(slug: string, locale: Locale) {
  const article = fallbackBlogArticles.find(item => item.slug === slug);
  if (!article) return null;
  return {
    id: article.slug,
    slug: article.slug,
    title: article.title[locale],
    category: article.category[locale],
    excerpt: article.excerpt[locale],
    body: article.body[locale],
    imageUrl: article.imageUrl,
    author: "automajorelle",
    readingMinutes: article.readingMinutes,
    publishedAt: null,
  };
}

export function getLocalizedFallbackBlogArticles(locale: Locale) {
  return fallbackBlogArticles.map(article => ({
    ...getFallbackBlogArticle(article.slug, locale)!,
  }));
}

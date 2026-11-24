import type { Locale } from "@/locales/translations";

export type EditorialBlock = {
  heading?: Record<Locale, string>;
  text: Record<Locale, string>;
  bullets?: Array<Record<Locale, string>>;
};

export type EditorialArticle = {
  slug: string;
  category: Record<Locale, string>;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  readingMinutes: number;
  blocks: EditorialBlock[];
};

export const localizedEditorial: EditorialArticle[] = [
  {
    slug: "preparer-visite-vehicule-marrakech",
    category: { fr: "Guide d’achat", en: "Buying guide", ar: "دليل الشراء" },
    title: {
      fr: "Visiter un véhicule d’occasion : les bons réflexes avant de décider",
      en: "Viewing a used car: what to check before deciding",
      ar: "زيارة سيارة مستعملة: ما الذي ينبغي التحقق منه قبل اتخاذ القرار؟",
    },
    excerpt: {
      fr: "Une méthode simple pour préparer votre visite au showroom Auto Majorelle et poser les bonnes questions sur l’annonce.",
      en: "A practical way to prepare for your visit to the Auto Majorelle showroom and ask the right questions about a listing.",
      ar: "طريقة عملية للتحضير لزيارة معرض أوتو ماجوريل وطرح الأسئلة المناسبة حول إعلان السيارة.",
    },
    readingMinutes: 4,
    blocks: [
      { text: {
        fr: "Une annonce donne un premier aperçu, mais une visite permet de vérifier si le véhicule correspond à vos besoins. Chez Auto Majorelle à Marrakech, prenez le temps d’examiner le véhicule présenté et de confirmer les informations propres à cette annonce avec l’équipe.",
        en: "A listing gives you an initial overview, but a visit helps you decide whether the car suits your needs. At Auto Majorelle in Marrakech, take time to inspect the vehicle shown and confirm the details of that specific listing with the team.",
        ar: "يمنحك الإعلان فكرة أولية، لكن الزيارة تساعدك على معرفة ما إذا كانت السيارة تلائم احتياجاتك. في معرض أوتو ماجوريل بمراكش، خذ وقتك لفحص السيارة المعروضة وتأكيد المعلومات الخاصة بهذا الإعلان مع الفريق.",
      } },
      { heading: { fr: "Avant la visite", en: "Before your visit", ar: "قبل الزيارة" }, text: {
        fr: "Notez la marque, le modèle et la référence de l’annonce. Préparez aussi les questions qui comptent pour votre usage quotidien : espace, type de carburant, transmission, équipements et documents disponibles.",
        en: "Write down the make, model, and listing reference. Prepare questions that matter for your everyday use, such as space, fuel type, transmission, equipment, and available documents.",
        ar: "دوّن الماركة والطراز ورقم الإعلان. وجهّز الأسئلة المهمة لاستخدامك اليومي، مثل المساحة ونوع الوقود وناقل الحركة والتجهيزات والوثائق المتاحة.",
      } },
      { heading: { fr: "Pendant l’examen", en: "During the inspection", ar: "أثناء الفحص" }, text: {
        fr: "Observez la carrosserie, l’habitacle et les équipements. Demandez à voir les éléments d’entretien disponibles et faites préciser les caractéristiques ou conditions qui ne figurent pas dans l’annonce. Un essai et les modalités associées sont à convenir directement avec le showroom.",
        en: "Look over the bodywork, cabin, and equipment. Ask to see any available maintenance records and clarify specifications or terms that are not stated in the listing. Arrange any test drive and related conditions directly with the showroom.",
        ar: "افحص الهيكل والمقصورة والتجهيزات. اطلب الاطلاع على سجلات الصيانة المتاحة، واستفسر عن المواصفات أو الشروط غير المذكورة في الإعلان. يُرجى الاتفاق مباشرةً مع المعرض على تجربة القيادة وشروطها.",
      } },
      { heading: { fr: "Avant de vous engager", en: "Before making a commitment", ar: "قبل الالتزام بالشراء" }, text: {
        fr: "Confirmez la disponibilité, le prix, les documents et les éventuelles conditions de garantie pour le véhicule concerné. Demandez que les conditions applicables soient expliquées clairement avant toute décision.",
        en: "Confirm the vehicle’s availability, price, documents, and any applicable warranty terms. Ask for the relevant conditions to be explained clearly before making a decision.",
        ar: "تأكد من توفر السيارة وسعرها ووثائقها وأي شروط ضمان تنطبق عليها. اطلب توضيح الشروط المعنية بوضوح قبل اتخاذ القرار.",
      } },
    ],
  },
  {
    slug: "financement-auto-questions-utiles",
    category: { fr: "Financement", en: "Financing", ar: "التمويل" },
    title: {
      fr: "Financement automobile : les questions à poser avant une simulation",
      en: "Car financing: questions to ask before using a calculator",
      ar: "تمويل السيارة: أسئلة ينبغي طرحها قبل استخدام الحاسبة",
    },
    excerpt: {
      fr: "Comprendre les paramètres d’une simulation et savoir quelles conditions confirmer auprès de l’organisme financeur.",
      en: "Understand the inputs to a repayment estimate and what to confirm with the financing institution.",
      ar: "افهم عناصر تقدير الأقساط وما ينبغي تأكيده مع جهة التمويل.",
    },
    readingMinutes: 3,
    blocks: [
      { text: {
        fr: "Une simulation permet d’explorer un scénario, mais ne constitue pas une offre de crédit. Sur la page Financement d’Auto Majorelle, les paramètres sont présentés comme indicatifs tant qu’ils n’ont pas été confirmés par l’organisme concerné.",
        en: "A calculator can help you explore a scenario, but it is not a credit offer. On Auto Majorelle’s Financing page, figures remain indicative until confirmed by the relevant institution.",
        ar: "تساعدك الحاسبة على استكشاف سيناريو محتمل، لكنها لا تُعد عرضًا ائتمانيًا. في صفحة التمويل لدى أوتو ماجوريل، تظل الأرقام تقديرية إلى أن تؤكدها الجهة المعنية.",
      } },
      { heading: { fr: "Quels éléments comparer ?", en: "What should you compare?", ar: "ما العناصر التي ينبغي مقارنتها؟" }, text: {
        fr: "Demandez le coût total, le taux effectivement proposé, la durée, les frais éventuels, l’assurance et les conditions de remboursement. Vérifiez aussi si l’apport et le véhicule choisi répondent aux critères de l’organisme.",
        en: "Ask about the total cost, the actual rate offered, term, any fees, insurance, and repayment conditions. Also check whether the down payment and chosen vehicle meet the institution’s criteria.",
        ar: "استفسر عن التكلفة الإجمالية والسعر الفعلي المقترح والمدة والرسوم المحتملة والتأمين وشروط السداد. وتحقق أيضًا مما إذا كانت الدفعة الأولية والسيارة المختارة تستوفيان معايير الجهة.",
      } },
      { heading: { fr: "Préparez votre échange", en: "Prepare for the conversation", ar: "استعد للمحادثة" }, text: {
        fr: "Indiquez à l’équipe le véhicule qui vous intéresse, votre budget et les grandes lignes de votre projet. La liste des justificatifs, les durées possibles et toute proposition finale dépendent de l’étude de votre dossier par l’organisme financeur.",
        en: "Tell the team which vehicle interests you, your budget, and the broad outline of your plans. Required documents, available terms, and any final offer depend on the financing institution’s review of your application.",
        ar: "أخبر الفريق بالسيارة التي تهمك وميزانيتك والخطوط العامة لمشروعك. تعتمد الوثائق المطلوبة والآجال المتاحة وأي عرض نهائي على دراسة ملفك من قبل جهة التمويل.",
      } },
    ],
  },
  {
    slug: "reprise-voiture-informations-a-preparer",
    category: { fr: "Reprise", en: "Trade-in", ar: "استبدال السيارة" },
    title: {
      fr: "Demander une reprise : quelles informations préparer sur votre voiture ?",
      en: "Requesting a trade-in: what information should you prepare?",
      ar: "طلب استبدال السيارة: ما المعلومات التي ينبغي تجهيزها؟",
    },
    excerpt: {
      fr: "Les renseignements et photos qui aident l’équipe Auto Majorelle à étudier votre demande, sans estimation automatique.",
      en: "The details and photos that help the Auto Majorelle team review your request, with no automated valuation.",
      ar: "المعلومات والصور التي تساعد فريق أوتو ماجوريل على دراسة طلبك، دون تقييم آلي.",
    },
    readingMinutes: 3,
    blocks: [
      { text: {
        fr: "Pour parler de la reprise de votre voiture avec Auto Majorelle à Marrakech, rassemblez d’abord les informations utiles sur le véhicule. Elles permettent à l’équipe de comprendre votre demande et de préciser les prochaines étapes avec vous.",
        en: "To discuss trading in your car with Auto Majorelle in Marrakech, first gather the relevant information about the vehicle. This helps the team understand your request and clarify the next steps with you.",
        ar: "لمناقشة استبدال سيارتك مع أوتو ماجوريل في مراكش، اجمع أولًا المعلومات اللازمة عن السيارة. يساعد ذلك الفريق على فهم طلبك وتوضيح الخطوات التالية معك.",
      } },
      { heading: { fr: "Les informations utiles", en: "Useful details", ar: "معلومات مفيدة" }, bullets: [
        { fr: "Marque, modèle, année et kilométrage affiché.", en: "Make, model, year, and odometer reading.", ar: "الماركة والطراز والسنة وقراءة عداد المسافة." },
        { fr: "Motorisation, transmission et état général connu.", en: "Powertrain, transmission, and known overall condition.", ar: "نوع المحرك وناقل الحركة والحالة العامة المعروفة." },
        { fr: "Entretien réalisé, défauts connus et documents disponibles.", en: "Maintenance carried out, known defects, and available documents.", ar: "الصيانة المنجزة والعيوب المعروفة والوثائق المتاحة." },
        { fr: "Des photos récentes de l’extérieur et de l’habitacle, si vous en avez.", en: "Recent photos of the exterior and cabin, if available.", ar: "صور حديثة للهيكل والمقصورة إن توفرت." },
      ], text: { fr: "", en: "", ar: "" } },
      { heading: { fr: "Une première demande, pas une offre", en: "An initial enquiry, not an offer", ar: "طلب أولي وليس عرضًا" }, text: {
        fr: "Le formulaire de reprise transmet les éléments à l’équipe Auto Majorelle. Il ne calcule pas automatiquement une valeur et ne constitue pas un engagement d’achat. Toute proposition éventuelle dépend de l’examen du véhicule et d’un échange avec l’équipe.",
        en: "The trade-in form sends the details to the Auto Majorelle team. It does not automatically calculate a value or commit the showroom to a purchase. Any possible offer depends on reviewing the vehicle and discussing it with the team.",
        ar: "يرسل نموذج الاستبدال التفاصيل إلى فريق أوتو ماجوريل. ولا يحسب قيمة تلقائيًا ولا يُلزم المعرض بالشراء. ويعتمد أي عرض محتمل على فحص السيارة ومناقشة الأمر مع الفريق.",
      } },
    ],
  },
];

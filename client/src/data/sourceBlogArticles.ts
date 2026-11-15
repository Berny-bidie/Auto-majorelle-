import type { Locale } from "@/locales/translations";

export type LocalizedText = Record<Locale, string>;
export type BlogBlock =
  | ({ type: "paragraph" | "heading" } & LocalizedText)
  | { type: "list"; items: LocalizedText[] };
export type SourceBlogArticle = {
  slug: string; title: LocalizedText; category: LocalizedText; excerpt: LocalizedText;
  date: string; readingMinutes: number; author: string | null; image: string;
  sections: BlogBlock[]; sourceComplete: boolean;
};

export const sourceBlogArticles: SourceBlogArticle[] = [
  {
    "slug": "acheter-voiture-occasion-marrakech-securite",
    "title": {
      "fr": "Comment acheter une voiture occasion à Marrakech en toute sécurité",
      "en": "How to safely buy a used car in Marrakech",
      "ar": "كيف تشتري سيارة مستعملة في مراكش بأمان"
    },
    "category": {
      "fr": "Guide d'achat",
      "en": "Buying guide",
      "ar": "دليل الشراء"
    },
    "excerpt": {
      "fr": "Sept étapes pour préparer un achat automobile : budget, inspection, kilométrage, négociation et documents.",
      "en": "Seven steps to prepare for a car purchase: budget, inspection, mileage, negotiation, and paperwork.",
      "ar": "سبع خطوات للاستعداد لشراء سيارة: الميزانية، والفحص، والمسافة المقطوعة، والتفاوض، والوثائق."
    },
    "date": "2025-06-10",
    "readingMinutes": 6,
    "author": "Auto Majorelle",
    "image": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&q=85",
    "sections": [
      {
        "type": "paragraph",
        "fr": "Acheter une voiture occasion à Marrakech peut s'avérer un excellent investissement si vous suivez les bonnes étapes. En tant que concessionnaire spécialisé depuis plus de 20 ans, Auto Majorelle vous guide.",
        "en": "Buying a used car in Marrakech can prove to be an excellent investment if you follow the right steps. As a dealership specializing in this field for more than 20 years, Auto Majorelle guides you.",
        "ar": "قد يكون شراء سيارة مستعملة في مراكش استثمارًا ممتازًا إذا اتبعت الخطوات الصحيحة. وبصفتها وكالة متخصصة منذ أكثر من 20 عامًا، ترشدكم أوتو ماجوريل."
      },
      {
        "type": "heading",
        "fr": "1. Définir votre budget et vos besoins",
        "en": "1. Define your budget and needs",
        "ar": "1. حدّد ميزانيتك واحتياجاتك"
      },
      {
        "type": "paragraph",
        "fr": "Avant de commencer votre recherche, établissez clairement votre budget maximum, l'usage prévu, le type de carburant et le kilométrage acceptable.",
        "en": "Before you begin your search, clearly establish your maximum budget, intended use, fuel type, and acceptable mileage.",
        "ar": "قبل أن تبدأ البحث، حدّد بوضوح ميزانيتك القصوى، والاستخدام المقصود، ونوع الوقود، والمسافة المقطوعة المقبولة."
      },
      {
        "type": "heading",
        "fr": "2. Choisir un concessionnaire sérieux",
        "en": "2. Choose a reputable dealership",
        "ar": "2. اختر وكالة موثوقة"
      },
      {
        "type": "paragraph",
        "fr": "Un concessionnaire fiable comme Auto Majorelle vous offrira toujours un historique complet, une inspection certifiée, une garantie contractuelle et des papiers en règle.",
        "en": "A reliable dealership such as Auto Majorelle will always provide you with a complete history, a certified inspection, a contractual warranty, and paperwork in order.",
        "ar": "ستوفر لك وكالة موثوقة مثل أوتو ماجوريل دائمًا سجلًا كاملًا، وفحصًا معتمدًا، وضمانًا تعاقديًا، وأوراقًا مستوفية للشروط."
      },
      {
        "type": "heading",
        "fr": "3. Inspecter la carrosserie et la mécanique",
        "en": "3. Inspect the bodywork and mechanics",
        "ar": "3. افحص هيكل السيارة وأجزاءها الميكانيكية"
      },
      {
        "type": "list",
        "items": [
          {
            "fr": "Alignement des portes et du capot",
            "en": "Alignment of the doors and hood",
            "ar": "محاذاة الأبواب وغطاء المحرك"
          },
          {
            "fr": "Épaisseur de peinture uniforme",
            "en": "Uniform paint thickness",
            "ar": "تجانس سُمك الطلاء"
          },
          {
            "fr": "Usure des pneus et des freins",
            "en": "Wear on the tires and brakes",
            "ar": "تآكل الإطارات والمكابح"
          },
          {
            "fr": "Fonctionnement de la climatisation (essentiel à Marrakech !)",
            "en": "Air-conditioning operation (essential in Marrakech!)",
            "ar": "عمل مكيف الهواء (أمر ضروري في مراكش!)"
          }
        ]
      },
      {
        "type": "heading",
        "fr": "4. Vérifier le kilométrage réel",
        "en": "4. Check the actual mileage",
        "ar": "4. تحقّق من المسافة المقطوعة الفعلية"
      },
      {
        "type": "paragraph",
        "fr": "Demandez toujours les carnets d'entretien et comparez avec les révisions effectuées. Un kilométrage suspect pour l'âge du véhicule est un signal d'alarme.",
        "en": "Always ask for the maintenance records and compare them with the servicing carried out. Mileage that seems suspicious for the vehicle's age is a warning sign.",
        "ar": "اطلب دائمًا دفاتر الصيانة وقارنها بأعمال الصيانة المنجزة. فالمسافة المقطوعة التي تبدو مثيرة للشك مقارنة بعمر السيارة علامة تحذير."
      },
      {
        "type": "heading",
        "fr": "5. Négocier intelligemment",
        "en": "5. Negotiate wisely",
        "ar": "5. تفاوض بذكاء"
      },
      {
        "type": "paragraph",
        "fr": "Sur le marché de Marrakech, une marge de 5 à 10% est souvent négociable selon l'ancienneté du stock.",
        "en": "In the Marrakech market, a margin of 5 to 10% is often negotiable depending on how long the vehicle has been in stock.",
        "ar": "في سوق مراكش، غالبًا ما تكون هناك نسبة تفاوض تتراوح بين 5 و10% بحسب مدة بقاء السيارة في المخزون."
      },
      {
        "type": "heading",
        "fr": "6. Finaliser avec les bons documents",
        "en": "6. Complete the purchase with the right documents",
        "ar": "6. أتمم عملية الشراء بالوثائق الصحيحة"
      },
      {
        "type": "paragraph",
        "fr": "Assurez-vous d'avoir : contrat de vente, quittance, certificat de cession et carte grise transférée dans les délais légaux.",
        "en": "Make sure you have: a sales contract, a receipt, a transfer certificate, and the vehicle registration transferred within the legal time limits.",
        "ar": "تأكد من حصولك على: عقد بيع، وإيصال، وشهادة نقل الملكية، وبطاقة تسجيل السيارة بعد نقلها ضمن الآجال القانونية."
      },
      {
        "type": "paragraph",
        "fr": "Chez Auto Majorelle Marrakech, chaque véhicule est inspecté en 150 points avant mise en vente, avec garantie minimum 6 mois.",
        "en": "At Auto Majorelle Marrakech, every vehicle undergoes a 150-point inspection before being put up for sale, with a minimum 6-month warranty.",
        "ar": "في أوتو ماجوريل مراكش، تخضع كل سيارة لفحص من 150 نقطة قبل عرضها للبيع، مع ضمان لمدة 6 أشهر على الأقل."
      }
    ],
    "sourceComplete": true
  },
  {
    "slug": "top-vehicules-premium-marrakech-2025",
    "title": {
      "fr": "Top 10 véhicules premium les plus vendus à Marrakech en 2025",
      "en": "Top 10 Best-Selling Premium Vehicles in Marrakech in 2025",
      "ar": "أفضل 10 سيارات فاخرة مبيعًا في مراكش عام 2025"
    },
    "category": {
      "fr": "Top & Sélection",
      "en": "Top Picks & Selection",
      "ar": "الأفضل والاختيارات"
    },
    "excerpt": {
      "fr": "Un aperçu éditorial des modèles premium cités dans l’article source; classement et prix à vérifier.",
      "en": "An editorial overview of the premium models mentioned in the source article; ranking and prices to be verified.",
      "ar": "نظرة تحريرية عامة على الطرازات الفاخرة المذكورة في المقال المصدر؛ يجب التحقق من الترتيب والأسعار."
    },
    "date": "2025-05-22",
    "readingMinutes": 8,
    "author": null,
    "image": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&q=85",
    "sections": [
      {
        "type": "paragraph",
        "fr": "Le marché des véhicules premium à Marrakech est en pleine effervescence. Voici le classement des 10 modèles les plus recherchés par nos clients en 2025.",
        "en": "The premium vehicle market in Marrakech is booming. Here is the ranking of the 10 models most sought after by our customers in 2025.",
        "ar": "يشهد سوق السيارات الفاخرة في مراكش نشاطًا كبيرًا. إليكم ترتيب الطرازات العشرة الأكثر طلبًا من عملائنا في عام 2025."
      },
      {
        "type": "heading",
        "fr": "1. Mercedes-Benz Classe C — Le prestige accessible",
        "en": "1. Mercedes-Benz C-Class — Accessible prestige",
        "ar": "1. مرسيدس-بنز الفئة C — فخامة في المتناول"
      },
      {
        "type": "paragraph",
        "fr": "Élégance, confort et fiabilité. Prix moyen : 220 000 – 380 000 MAD.",
        "en": "Elegance, comfort and reliability. Average price: 220 000 – 380 000 MAD.",
        "ar": "الأناقة والراحة والموثوقية. متوسط السعر: 220 000 – 380 000 MAD."
      },
      {
        "type": "heading",
        "fr": "2. BMW Série 3 — La sportivité allemande",
        "en": "2. BMW 3 Series — German sportiness",
        "ar": "2. بي إم دبليو الفئة الثالثة — الروح الرياضية الألمانية"
      },
      {
        "type": "paragraph",
        "fr": "Très demandée dans les versions 318d et 320i. Prix moyen : 200 000 – 350 000 MAD.",
        "en": "In high demand in the 318d and 320i versions. Average price: 200 000 – 350 000 MAD.",
        "ar": "تحظى بطلب كبير في نسختي 318d و320i. متوسط السعر: 200 000 – 350 000 MAD."
      },
      {
        "type": "heading",
        "fr": "3. Toyota Land Cruiser — Le roi du désert",
        "en": "3. Toyota Land Cruiser — The king of the desert",
        "ar": "3. تويوتا لاند كروزر — ملك الصحراء"
      },
      {
        "type": "paragraph",
        "fr": "Incontournable à Marrakech, allie luxe et robustesse. Prix : 350 000 – 600 000 MAD.",
        "en": "A must-have in Marrakech, combining luxury and robustness. Price: 350 000 – 600 000 MAD.",
        "ar": "سيارة لا غنى عنها في مراكش، تجمع بين الفخامة والمتانة. السعر: 350 000 – 600 000 MAD."
      },
      {
        "type": "heading",
        "fr": "4. Audi A6 — L'executive berline",
        "en": "4. Audi A6 — The executive sedan",
        "ar": "4. أودي A6 — سيارة سيدان تنفيذية"
      },
      {
        "type": "paragraph",
        "fr": "Confort premium, technologie avancée, très prisée des cadres marrakchis.",
        "en": "Premium comfort, advanced technology, highly sought after by executives in Marrakech.",
        "ar": "راحة فاخرة وتقنيات متقدمة، وتحظى بإقبال كبير من المديرين التنفيذيين في مراكش."
      },
      {
        "type": "heading",
        "fr": "5. Volkswagen Touareg — SUV premium polyvalent",
        "en": "5. Volkswagen Touareg — A versatile premium SUV",
        "ar": "5. فولكسفاغن طوارق — سيارة دفع رباعي فاخرة ومتعددة الاستخدامات"
      },
      {
        "type": "paragraph",
        "fr": "Meilleur compromis entre luxe et utilité, fiabilité remarquable.",
        "en": "The best compromise between luxury and practicality, with remarkable reliability.",
        "ar": "أفضل توازن بين الفخامة والعملية، مع موثوقية لافتة."
      }
    ],
    "sourceComplete": false
  },
  {
    "slug": "financement-automobile-maroc-options-marrakech",
    "title": {
      "fr": "Financement automobile au Maroc : toutes les options pour votre voiture à Marrakech",
      "en": "Car financing in Morocco: all the options for your car in Marrakech",
      "ar": "تمويل السيارات في المغرب: جميع الخيارات لسيارتك في مراكش"
    },
    "category": {
      "fr": "Financement",
      "en": "Financing",
      "ar": "التمويل"
    },
    "excerpt": {
      "fr": "Crédit auto, LOA et Mourabaha : présentation des options telles que décrites dans l’article source.",
      "en": "Car loans, lease with option to purchase (LOA), and Murabaha: an overview of the options as described in the source article.",
      "ar": "قروض السيارات، والإيجار مع خيار الشراء (LOA)، والمرابحة: عرض للخيارات كما وردت في المقالة المصدر."
    },
    "date": "2025-05-08",
    "readingMinutes": 7,
    "author": null,
    "image": "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=900&q=85",
    "sections": [
      {
        "type": "paragraph",
        "fr": "Le financement automobile au Maroc a considérablement évolué. Voici toutes les options disponibles chez Auto Majorelle Marrakech.",
        "en": "Car financing in Morocco has evolved considerably. Here are all the options available at Auto Majorelle Marrakech.",
        "ar": "شهد تمويل السيارات في المغرب تطورًا كبيرًا. إليكم جميع الخيارات المتاحة لدى أوتو ماجوريل مراكش."
      },
      {
        "type": "heading",
        "fr": "Le crédit auto classique",
        "en": "Traditional car loans",
        "ar": "قروض السيارات التقليدية"
      },
      {
        "type": "paragraph",
        "fr": "Taux fixe sur 12 à 72 mois. Nos partenaires (SOFAC, Wafasalaf, CIH) offrent des taux à partir de 5.5% annuel.",
        "en": "Fixed rate over 12 to 72 months. Our partners (SOFAC, Wafasalaf, CIH) offer rates starting at 5.5% per year.",
        "ar": "سعر فائدة ثابت لمدة تتراوح بين 12 و72 شهرًا. يقدم شركاؤنا (SOFAC وWafasalaf وCIH) أسعارًا تبدأ من 5.5% سنويًا."
      },
      {
        "type": "heading",
        "fr": "La Location avec Option d'Achat (LOA)",
        "en": "Lease with Option to Purchase (LOA)",
        "ar": "الإيجار مع خيار الشراء (LOA)"
      },
      {
        "type": "paragraph",
        "fr": "Mensualités réduites, achat possible au terme du contrat. Idéal pour les véhicules premium.",
        "en": "Lower monthly payments, with the option to purchase at the end of the contract. Ideal for premium vehicles.",
        "ar": "أقساط شهرية أقل، مع إمكانية الشراء عند انتهاء العقد. مثالي للسيارات الفاخرة."
      },
      {
        "type": "heading",
        "fr": "Financement islamique (Mourabaha)",
        "en": "Islamic financing (Murabaha)",
        "ar": "التمويل الإسلامي (المرابحة)"
      },
      {
        "type": "paragraph",
        "fr": "Disponible via Bank Al Yousr, conforme aux principes islamiques, très demandée à Marrakech.",
        "en": "Available through Bank Al Yousr, compliant with Islamic principles, and in high demand in Marrakech.",
        "ar": "متاح عبر بنك اليسر، ومتوافق مع المبادئ الإسلامية، ويحظى بطلب كبير في مراكش."
      },
      {
        "type": "heading",
        "fr": "Comment obtenir votre financement ?",
        "en": "How can you obtain financing?",
        "ar": "كيف تحصل على التمويل؟"
      },
      {
        "type": "list",
        "items": [
          {
            "fr": "CIN ou passeport",
            "en": "National identity card (CIN) or passport",
            "ar": "البطاقة الوطنية للتعريف (CIN) أو جواز السفر"
          },
          {
            "fr": "3 derniers bulletins de salaire",
            "en": "The 3 most recent payslips",
            "ar": "آخر 3 كشوفات للراتب"
          },
          {
            "fr": "Relevés bancaires des 3 derniers mois",
            "en": "Bank statements for the last 3 months",
            "ar": "كشوفات الحساب البنكي للأشهر الثلاثة الأخيرة"
          },
          {
            "fr": "Justificatif de domicile",
            "en": "Proof of residence",
            "ar": "إثبات السكن"
          }
        ]
      },
      {
        "type": "paragraph",
        "fr": "Notre équipe traite votre dossier en 48h avec une réponse rapide et sans engagement.",
        "en": "Our team processes your application within 48 hours, with a quick response and no obligation.",
        "ar": "يعالج فريقنا ملفك خلال 48 ساعة، مع رد سريع ودون أي التزام."
      }
    ],
    "sourceComplete": true
  },
  {
    "slug": "choisir-concessionnaire-marrakech-criteres",
    "title": {
      "fr": "Choisir le bon concessionnaire à Marrakech : critères essentiels",
      "en": "Choosing the Right Dealership in Marrakech: Essential Criteria",
      "ar": "اختيار الوكيل المناسب في مراكش: معايير أساسية"
    },
    "category": {
      "fr": "Conseils Expert",
      "en": "Expert Advice",
      "ar": "نصائح الخبراء"
    },
    "excerpt": {
      "fr": "Les critères de transparence, d’inspection, de garantie et de réputation mentionnés dans l’article source.",
      "en": "The criteria of transparency, inspection, warranty, and reputation mentioned in the source article.",
      "ar": "معايير الشفافية والفحص والضمان والسمعة المذكورة في المقال المصدر."
    },
    "date": "2025-04-15",
    "readingMinutes": 5,
    "author": "",
    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85",
    "sections": [
      {
        "type": "paragraph",
        "fr": "Face à la multiplication des annonces en ligne, choisir le bon concessionnaire automobile à Marrakech est une décision cruciale.",
        "en": "With online listings multiplying, choosing the right car dealership in Marrakech is a crucial decision.",
        "ar": "في ظل تزايد الإعلانات على الإنترنت، يُعد اختيار وكيل السيارات المناسب في مراكش قرارًا بالغ الأهمية."
      },
      {
        "type": "heading",
        "fr": "La transparence avant tout",
        "en": "Transparency Above All",
        "ar": "الشفافية أولاً"
      },
      {
        "type": "paragraph",
        "fr": "Un concessionnaire sérieux affiche clairement ses prix, l'historique de ses véhicules et ses conditions de garantie.",
        "en": "A reputable dealership clearly displays its prices, the history of its vehicles, and its warranty terms.",
        "ar": "يعرض الوكيل الجاد أسعاره وسجل سياراته وشروط الضمان بوضوح."
      },
      {
        "type": "heading",
        "fr": "La garantie constructeur ou concessionnaire",
        "en": "The Manufacturer's or Dealership's Warranty",
        "ar": "ضمان الشركة المصنّعة أو الوكيل"
      },
      {
        "type": "paragraph",
        "fr": "Auto Majorelle offre une garantie minimum de 6 mois sur tous les véhicules.",
        "en": "Auto Majorelle offers a minimum 6-month warranty on all vehicles.",
        "ar": "تقدم أوتو ماجوريل ضمانًا لمدة لا تقل عن 6 أشهر على جميع السيارات."
      },
      {
        "type": "heading",
        "fr": "L'inspection en 150 points",
        "en": "The 150-Point Inspection",
        "ar": "الفحص المكوّن من 150 نقطة"
      },
      {
        "type": "paragraph",
        "fr": "Chaque véhicule de notre stock fait l'objet d'une inspection technique approfondie avant d'être proposé à la vente.",
        "en": "Every vehicle in our inventory undergoes a thorough technical inspection before being offered for sale.",
        "ar": "تخضع كل سيارة في مخزوننا لفحص فني دقيق قبل عرضها للبيع."
      },
      {
        "type": "heading",
        "fr": "Les avis clients",
        "en": "Customer Reviews",
        "ar": "آراء العملاء"
      },
      {
        "type": "paragraph",
        "fr": "Avec une note de 4.8/5 sur Google, Auto Majorelle est le concessionnaire premium le mieux noté à Marrakech.",
        "en": "With a 4.8/5 rating on Google, Auto Majorelle is the highest-rated premium dealership in Marrakech.",
        "ar": "بتقييم 4.8/5 على Google، تُعد أوتو ماجوريل وكيل السيارات الفاخرة الأعلى تقييمًا في مراكش."
      }
    ],
    "sourceComplete": true
  },
  {
    "slug": "reprise-voiture-marrakech-meilleure-estimation",
    "title": {
      "fr": "Reprise de voiture à Marrakech : comment obtenir la meilleure estimation ?",
      "en": "Car Trade-In in Marrakech: How Can You Get the Best Valuation?",
      "ar": "استبدال سيارتك في مراكش: كيف تحصل على أفضل تقييم؟"
    },
    "category": {
      "fr": "Reprise & revente",
      "en": "Trade-In & Resale",
      "ar": "استبدال السيارات وإعادة بيعها"
    },
    "excerpt": {
      "fr": "Les critères de valeur et de préparation du véhicule cités dans l’article source; chiffres à valider.",
      "en": "The valuation and vehicle-preparation criteria mentioned in the source article; figures to be verified.",
      "ar": "معايير تقييم السيارة وتجهيزها المذكورة في المقال المصدر؛ يجب التحقق من الأرقام."
    },
    "date": "2025-04-02",
    "readingMinutes": 6,
    "author": null,
    "image": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=85",
    "sections": [
      {
        "type": "paragraph",
        "fr": "La reprise de voiture à Marrakech est un service très demandé. Voici comment maximiser la valeur de votre véhicule.",
        "en": "Car trade-in in Marrakech is a highly sought-after service. Here is how to maximize the value of your vehicle.",
        "ar": "استبدال السيارات في مراكش خدمة يكثر الطلب عليها. إليك كيفية زيادة قيمة سيارتك إلى أقصى حد."
      },
      {
        "type": "heading",
        "fr": "Facteurs qui influencent la valeur de reprise",
        "en": "Factors that influence trade-in value",
        "ar": "العوامل التي تؤثر في قيمة الاستبدال"
      },
      {
        "type": "heading",
        "fr": "Kilométrage",
        "en": "Mileage",
        "ar": "عدد الكيلومترات المقطوعة"
      },
      {
        "type": "paragraph",
        "fr": "Moins de 100 000 km = valeur significativement supérieure.",
        "en": "Under 100,000 km = significantly higher value.",
        "ar": "أقل من 100 000 كم = قيمة أعلى بكثير."
      },
      {
        "type": "heading",
        "fr": "État général",
        "en": "Overall condition",
        "ar": "الحالة العامة"
      },
      {
        "type": "paragraph",
        "fr": "Un véhicule bien entretenu peut valoir jusqu'à 15% de plus.",
        "en": "A well-maintained vehicle can be worth up to 15% more.",
        "ar": "قد تزيد قيمة السيارة التي تتم صيانتها جيدًا بنسبة تصل إلى 15%."
      },
      {
        "type": "heading",
        "fr": "Historique d'entretien",
        "en": "Service history",
        "ar": "سجل الصيانة"
      },
      {
        "type": "paragraph",
        "fr": "Les carnets d'entretien complets sont des arguments majeurs.",
        "en": "Complete service records are major selling points.",
        "ar": "تُعد سجلات الصيانة الكاملة من العوامل المهمة لصالح السيارة."
      },
      {
        "type": "heading",
        "fr": "Comment préparer votre véhicule ?",
        "en": "How should you prepare your vehicle?",
        "ar": "كيف تجهز سيارتك؟"
      },
      {
        "type": "list",
        "items": [
          {
            "fr": "Nettoyage complet intérieur + extérieur",
            "en": "Complete interior + exterior cleaning",
            "ar": "تنظيف كامل من الداخل + الخارج"
          },
          {
            "fr": "Réunir tous les documents (carte grise, carnets d'entretien)",
            "en": "Gather all the documents (vehicle registration document, service records)",
            "ar": "جمع جميع الوثائق (البطاقة الرمادية، سجلات الصيانة)"
          },
          {
            "fr": "Réparer les petits défauts visibles",
            "en": "Repair minor visible defects",
            "ar": "إصلاح العيوب الظاهرة البسيطة"
          }
        ]
      },
      {
        "type": "heading",
        "fr": "Estimation gratuite chez Auto Majorelle",
        "en": "Free valuation at Auto Majorelle",
        "ar": "تقييم مجاني لدى أوتو ماجوريل"
      },
      {
        "type": "paragraph",
        "fr": "Prenez rendez-vous directement en showroom ou via WhatsApp pour une estimation gratuite et sans engagement.",
        "en": "Make an appointment directly at the showroom or via WhatsApp for a free, no-obligation valuation.",
        "ar": "احجز موعدًا مباشرةً في صالة العرض أو عبر واتساب للحصول على تقييم مجاني دون أي التزام."
      }
    ],
    "sourceComplete": true
  },
  {
    "slug": "suv-familial-marrakech-comparatif-2025",
    "title": {
      "fr": "Quel SUV familial choisir à Marrakech en 2025 ? Comparatif complet",
      "en": "Which family SUV should you choose in Marrakech in 2025? Full comparison",
      "ar": "أي سيارة SUV عائلية تختار في مراكش سنة 2025؟ مقارنة كاملة"
    },
    "category": {
      "fr": "SUV & Famille",
      "en": "SUVs & Family",
      "ar": "سيارات SUV والعائلة"
    },
    "excerpt": {
      "fr": "Un comparatif des SUV cités dans l’article source; prix, disponibilité et assertions à actualiser.",
      "en": "A comparison of the SUVs mentioned in the source article; prices, availability, and claims should be updated.",
      "ar": "مقارنة بين سيارات SUV المذكورة في المقال الأصلي؛ ينبغي تحديث الأسعار والتوافر والادعاءات."
    },
    "date": "2025-03-18",
    "readingMinutes": 9,
    "author": null,
    "image": "https://images.unsplash.com/photo-1474749504571-0a682e2669ef?w=900&q=85",
    "sections": [
      {
        "type": "paragraph",
        "fr": "Le marché du SUV familial à Marrakech est dominé par quelques grands acteurs. Voici notre comparatif expert pour vous aider à choisir.",
        "en": "The family SUV market in Marrakech is dominated by a few major players. Here is our expert comparison to help you choose.",
        "ar": "تهيمن على سوق السيارات الرياضية متعددة الاستخدامات العائلية في مراكش قلة من الشركات الكبرى. إليكم مقارنتنا المتخصصة لمساعدتكم على الاختيار."
      },
      {
        "type": "heading",
        "fr": "Toyota Land Cruiser — Le roi incontesté",
        "en": "Toyota Land Cruiser — The undisputed king",
        "ar": "تويوتا لاند كروزر — الملك بلا منازع"
      },
      {
        "type": "paragraph",
        "fr": "Robustesse légendaire, 7 places confortables, adapté aux routes du Maroc. Prix occasion : 350 000 – 600 000 MAD.",
        "en": "Legendary toughness, 7 comfortable seats, suited to Morocco’s roads. Used price: 350 000 – 600 000 MAD.",
        "ar": "متانة أسطورية، و7 مقاعد مريحة، ومناسبة لطرق المغرب. سعر المستعمل: 350 000 – 600 000 MAD."
      },
      {
        "type": "heading",
        "fr": "Volkswagen Touareg — Le premium polyvalent",
        "en": "Volkswagen Touareg — The versatile premium SUV",
        "ar": "فولكسفاغن طوارق — سيارة SUV فاخرة متعددة الاستخدامات"
      },
      {
        "type": "paragraph",
        "fr": "Confort haut de gamme, technologies avancées, idéal pour la ville et les routes secondaires marrakchies.",
        "en": "High-end comfort, advanced technology, ideal for the city and Marrakech’s secondary roads.",
        "ar": "راحة من الفئة الراقية، وتقنيات متقدمة، ومثالية للمدينة والطرق الثانوية في مراكش."
      },
      {
        "type": "heading",
        "fr": "Range Rover Sport — Le luxe absolu",
        "en": "Range Rover Sport — Absolute luxury",
        "ar": "رينج روفر سبورت — الفخامة المطلقة"
      },
      {
        "type": "paragraph",
        "fr": "Pour ceux qui veulent le meilleur. Design iconique, performances exceptionnelles. Prix : 700 000+ MAD.",
        "en": "For those who want the best. Iconic design, exceptional performance. Price: 700 000+ MAD.",
        "ar": "لمن يريدون الأفضل. تصميم أيقوني وأداء استثنائي. السعر: 700 000+ MAD."
      },
      {
        "type": "heading",
        "fr": "Notre recommandation",
        "en": "Our recommendation",
        "ar": "توصيتنا"
      },
      {
        "type": "paragraph",
        "fr": "Selon votre budget et vos besoins, notre équipe vous conseillera le SUV idéal parmi notre stock de +50 véhicules.",
        "en": "Depending on your budget and needs, our team will advise you on the ideal SUV from our stock of +50 vehicles.",
        "ar": "بحسب ميزانيتكم واحتياجاتكم، سينصحكم فريقنا بسيارة SUV المثالية من مخزوننا الذي يضم +50 مركبة."
      }
    ],
    "sourceComplete": true
  }
];

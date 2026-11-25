import type { Locale } from "@/locales/translations";

export type BlogImage = {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
};

export const blogImages = {
  inspection: {
    src: "/assets/blog/car-inspection.webp",
    width: 1600,
    height: 1067,
    alt: {
      fr: "Mécanicien inspectant le moteur d’une voiture",
      en: "Mechanic inspecting a car engine",
      ar: "ميكانيكي يفحص محرك سيارة",
    },
  },
  financing: {
    src: "/assets/blog/financing-paperwork.webp",
    width: 1600,
    height: 1067,
    alt: {
      fr: "Personne consultant des documents financiers et une calculatrice",
      en: "Person reviewing financial paperwork with a calculator",
      ar: "شخص يراجع مستندات مالية ويستخدم آلة حاسبة",
    },
  },
  tradeIn: {
    src: "/assets/blog/car-key-handover.webp",
    width: 1067,
    height: 1600,
    alt: {
      fr: "Remise de clés de voiture entre deux personnes",
      en: "A car key being handed from one person to another",
      ar: "تسليم مفتاح سيارة من شخص إلى آخر",
    },
  },
} satisfies Record<string, BlogImage>;

export function getBlogFallbackImage(category: string | null | undefined): BlogImage {
  const normalized = (category ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (/financ|credit|loan/.test(normalized)) return blogImages.financing;
  if (/reprise|trade|exchange|cession/.test(normalized)) return blogImages.tradeIn;
  return blogImages.inspection;
}

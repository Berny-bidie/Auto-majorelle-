export const SITE_CONTACT = {
  name: "automajorelle",
  phone: "+212 678 880 268",
  phoneRaw: "+212678880268",
  secondaryPhone: "+212 660 889 030",
  secondaryPhoneRaw: "+212660889030",
  whatsapp: "212678880268",
  email: "contact.automajorelle@gmail.com",
  address: "Quartier industriel Sidi Ghanem 127, Marrakech 40000, Marrakech-Safi, Maroc",
  city: "Marrakech",
  hours: "Lundi–samedi : 09:00–22:00 · Dimanche : fermé",
  hoursNote: "Horaires relevés sur la fiche Google Maps; appelez avant votre visite.",
  mapsSearchUrl: "https://www.google.com/maps/search/?api=1&query=Quartier%20industriel%20Sidi%20Ghanem%20127%2C%20Marrakech%2040000%2C%20Marrakech-Safi%2C%20Maroc",
  mapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Quartier%20industriel%20Sidi%20Ghanem%20127%2C%20Marrakech%2040000%2C%20Marrakech-Safi%2C%20Maroc",
  googleProfileUrl: "https://maps.app.goo.gl/33s4mzAFfpguhTo27",
  googleDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=automajorelle%2C%20Quartier%20industriel%20Sidi%20Ghanem%20127%2C%20Marrakech%2040000%2C%20Marrakech-Safi%2C%20Maroc",
  instagramUrl: "https://www.instagram.com/auto_majorelle",
  facebookUrl: "https://www.facebook.com/automajorelle",
  tiktokUrl: "https://www.tiktok.com/@auto_majorelle",
} as const;

export function normalizeBrandName(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return SITE_CONTACT.name;
  return value.trim()
    .replace(/\b(?:auto[\s_-]+majorelle|majorelle[\s_-]+auto)\b/gi, SITE_CONTACT.name)
    .replace(/أوتو\s+ماجوريل/gu, SITE_CONTACT.name);
}

export const GOOGLE_REVIEW_SNAPSHOT = {
  rating: "4,8/5",
  count: "49 avis",
  checkedAt: "21 novembre 2026",
  note: "Note et volume relevés sur la fiche Google Maps d’automajorelle; confirmez l’adresse et les horaires auprès de l’entreprise avant votre visite.",
};

export const GOOGLE_REVIEWS = [
  {
    name: "Fadoua Rahioui",
    rating: 5,
    date: "il y a un an",
    text: "Très satisfaite de mon expérience dans ce garage, L’accueil été chaleureux, le personnel à l’écoute et de bon conseil. Le véhicule correspondait parfaitement à l’annonce, en excellent état et très propre. Je recommande ce garage à 100 % pour leur sérieux et leur professionnalisme.",
    language: "fr",
  },
  {
    name: "Zaki Adgham",
    rating: 5,
    date: "9 months ago",
    text: "Thank you auto Majorelle, for the services that you provided for me, you are the best.",
    language: "en",
  },
  {
    name: "Abdelatif Bahamu",
    rating: 5,
    date: "a year ago",
    text: "The best service very professional",
    language: "en",
  },
] as const;

export const SOURCE_MEDIA = {
  logo: "/assets/brand/majorelle-auto-logo-new.png",
  hero: "/assets/showroom/showroom-mini-front.jpg",
  showroomRear: "/assets/showroom/showroom-range-rover-rear.jpg",
  facade: "/assets/showroom/majorelle-auto-facade.jpg",
  showroomInterior: "/assets/showroom/majorelle-auto-showroom.jpg",
  porscheInterior: "/assets/showroom/interior-porsche-macan.jpg",
  rangeInterior: "/assets/showroom/interior-range-rover-red.jpg",
} as const;

export const SOURCE_PARTNERS = [
  { name: "Bank Al Yousr", logo: "/assets/partners/bank-al-yousr.png" },
  { name: "SOFAC", logo: "/assets/partners/sofac.png" },
  { name: "Wafasalaf", logo: "/assets/partners/wafasalaf.png" },
  { name: "Salafin", logo: "/assets/partners/salafin.png" },
  { name: "Maghrebail", logo: "/assets/partners/maghrebail.png" },
  { name: "Vivalis Salaf", logo: "/assets/partners/vivalis.png" },
] as const;

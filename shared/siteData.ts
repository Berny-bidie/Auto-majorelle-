export const SITE_CONTACT = {
  name: "Auto Majorelle",
  phone: "+212 678 880 268",
  phoneRaw: "+212678880268",
  secondaryPhone: "+212 660 889 030",
  secondaryPhoneRaw: "+212660889030",
  whatsapp: "212678880268",
  email: "contact.automajorelle@gmail.com",
  address: "Angle Av. Allal El Fassi & Av. Yaakoub El Mansour, Alfa 2000, Marrakech",
  city: "Marrakech",
  hours: "Lundi–samedi : 09:00–19:00 · Dimanche : sur rendez-vous",
  hoursNote: "Horaires indiqués sur le site source; appelez avant votre visite.",
  mapsSearchUrl: "https://www.google.com/maps/search/?api=1&query=Angle%20Av.%20Allal%20El%20Fassi%20%26%20Av.%20Yaakoub%20El%20Mansour%2C%20Alfa%202000%2C%20Marrakech",
  mapsDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Angle%20Av.%20Allal%20El%20Fassi%20%26%20Av.%20Yaakoub%20El%20Mansour%2C%20Alfa%202000%2C%20Marrakech",
  googleProfileUrl: "https://www.google.com/maps/place/Auto+Majorelle/data=!4m7!3m6!1s0xdafef001880f8b9:0xab6c52b15e1a2956!8m2!3d31.6408401!4d-8.0007864!16s%2Fg%2F11xfhp_8kn!19sChIJufiAGADvrw0RVikaXrFSbKs?hl=fr",
  googleDirectionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Auto+Majorelle&destination_place_id=ChIJufiAGADvrw0RVikaXrFSbKs",
  instagramUrl: "https://www.instagram.com/auto_majorelle",
  facebookUrl: "https://www.facebook.com/automajorelle",
  tiktokUrl: "https://www.tiktok.com/@auto_majorelle",
} as const;

export const GOOGLE_REVIEW_SNAPSHOT = {
  rating: "4,8/5",
  count: "49 avis",
  checkedAt: "15 novembre 2026",
  note: "Note et volume observés sur la fiche Google d’Auto Majorelle; consultez la fiche pour les données les plus récentes.",
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
  logo: "/assets/brand/majorelle-logo-cropped.png",
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

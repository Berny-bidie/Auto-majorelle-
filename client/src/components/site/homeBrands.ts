export type HomeBrand = {
  name: string;
  manufacturer: string;
  image: string;
  officialUrl: string;
  officialRegion: "Maroc" | "International";
};

export const HOME_BRANDS: HomeBrand[] = [
  { name: "Dacia", manufacturer: "Dacia", image: "/assets/brands/dacia.svg", officialUrl: "https://www.dacia.ma/", officialRegion: "Maroc" },
  { name: "Toyota", manufacturer: "Toyota", image: "/assets/brands/toyota.svg", officialUrl: "https://www.toyota.co.ma/", officialRegion: "Maroc" },
  { name: "Volkswagen", manufacturer: "Volkswagen", image: "/assets/brands/volkswagen.svg", officialUrl: "https://www.volkswagen.ma/fr.html", officialRegion: "Maroc" },
  { name: "Range Rover", manufacturer: "Range Rover", image: "/assets/brands/landrover.svg", officialUrl: "https://www.rangerover.com/en-ma/", officialRegion: "Maroc" },
  { name: "Audi", manufacturer: "Audi", image: "/assets/brands/audi.svg", officialUrl: "https://www.audi.ma/", officialRegion: "Maroc" },
  { name: "Mercedes-Benz", manufacturer: "Mercedes-Benz", image: "/assets/brands/mercedes-benz.svg", officialUrl: "https://www.mercedes-benz.ma/", officialRegion: "Maroc" },
  { name: "MINI", manufacturer: "MINI", image: "/assets/brands/mini.svg", officialUrl: "https://www.mini.com/en_MS/home.html", officialRegion: "International" },
  { name: "Porsche", manufacturer: "Porsche", image: "/assets/brands/porsche.svg", officialUrl: "https://www.porsche.com/middle-east/fr/_morocco_/", officialRegion: "Maroc" },
  { name: "SEAT", manufacturer: "SEAT", image: "/assets/brands/seat.svg", officialUrl: "https://www.seat.ma/home", officialRegion: "Maroc" },
  { name: "Kia", manufacturer: "Kia", image: "/assets/brands/kia.svg", officialUrl: "https://kia.ma/", officialRegion: "Maroc" },
];

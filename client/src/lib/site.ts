export function formatDh(value: number) {
  return new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(value);
}

export function formatKm(value: number) {
  return `${new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(value)} km`;
}

export function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

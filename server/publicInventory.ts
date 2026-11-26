const demoSlugPattern = /^(?:test|demo)-/i;

/** Identify seeded examples so public pages can label them clearly and avoid sales claims. */
export function isDemoInventorySlug(slug: string): boolean {
  return demoSlugPattern.test(slug);
}

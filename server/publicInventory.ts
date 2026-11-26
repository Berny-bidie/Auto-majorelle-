const demoSlugPattern = /^(?:test|demo)-/i;

/** Test and demo fixtures must never appear in public inventory or detail responses. */
export function isPublicInventorySlug(slug: string): boolean {
  return !demoSlugPattern.test(slug);
}

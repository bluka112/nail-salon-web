export const BRAND_NAME = "Trio Nail Studio"

const previousBrandPattern = /\b(?:elegance|elagance)(?:\s+nail\s*(?:&|and)?\s*spa)?\b/i

export function displaySalonName(name?: string | null) {
  if (!name || previousBrandPattern.test(name)) return BRAND_NAME
  return name
}

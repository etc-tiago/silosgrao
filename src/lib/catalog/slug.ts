export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
}

export function uniqueSlug(base: string, existing: Set<string>) {
  const normalized = slugify(base) || "item"
  if (!existing.has(normalized)) return normalized

  let index = 2
  while (existing.has(`${normalized}-${index}`)) {
    index += 1
  }

  return `${normalized}-${index}`
}

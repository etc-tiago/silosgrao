export function parseSpecsJson(raw: string | null | undefined) {
  if (!raw?.trim()) return []

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      .map((item) => item.trim())
  } catch {
    return []
  }
}

export function serializeSpecs(specs: string[]) {
  const cleaned = specs.map((item) => item.trim()).filter(Boolean)
  return cleaned.length > 0 ? JSON.stringify(cleaned) : null
}

export function specsToText(specs: string[]) {
  return specs.join("\n")
}

export function specsFromText(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
}

export function parseLegacyProductContent(description: string | null) {
  if (!description?.trim()) {
    return {
      capacity: null,
      description: null,
      specs: [] as string[],
    }
  }

  const parts = description
    .split("\n\n")
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length >= 3) {
    return {
      capacity: parts[0],
      description: parts[1],
      specs: parts[2]
        .split(" · ")
        .map((item) => item.trim())
        .filter(Boolean),
    }
  }

  if (parts.length === 2) {
    return {
      capacity: parts[0],
      description: parts[1],
      specs: [] as string[],
    }
  }

  return {
    capacity: null,
    description,
    specs: [] as string[],
  }
}

export function resolveProductFields(row: {
  capacity: string | null
  description: string | null
  specs: string | null
}) {
  const storedSpecs = parseSpecsJson(row.specs)

  if (row.capacity || storedSpecs.length > 0) {
    return {
      capacity: row.capacity,
      description: row.description,
      specs: storedSpecs,
    }
  }

  return parseLegacyProductContent(row.description)
}

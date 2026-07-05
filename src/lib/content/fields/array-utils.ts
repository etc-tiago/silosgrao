export function moveArrayItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items
  const next = [...items]
  const [removed] = next.splice(from, 1)
  next.splice(to, 0, removed!)
  return next
}

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

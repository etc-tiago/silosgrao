type ProductSpecsDetailsProps = {
  specs: string[]
  className?: string
}

export function ProductSpecsDetails({ specs, className }: ProductSpecsDetailsProps) {
  if (specs.length === 0) return null

  return (
    <details
      className={`group rounded-2xl border border-border bg-card open:bg-muted/30 ${className ?? ""}`}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
        <span>Ver especificações</span>
        <span
          aria-hidden
          className="text-muted-foreground transition-transform duration-300 group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div className="border-t border-border px-4 py-4">
        <ul className="space-y-2">
          {specs.map((spec) => (
            <li
              key={spec}
              className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
            >
              <span className="mt-0.5 font-bold text-primary">•</span>
              <span>{spec}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  )
}

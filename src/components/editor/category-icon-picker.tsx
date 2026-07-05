import {
  CATEGORY_ICON_ENTRIES,
  CATEGORY_ICON_LABELS,
  type CategoryIconId,
} from "@/lib/content/fields/category-icon"
import { CategoryIcon } from "@/components/icons/category-icon"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type CategoryIconPickerProps = {
  value: CategoryIconId
  onChange: (value: CategoryIconId) => void
  disabled?: boolean
}

export function CategoryIconPicker({
  value,
  onChange,
  disabled = false,
}: CategoryIconPickerProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    window.addEventListener("mousedown", onPointerDown)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("mousedown", onPointerDown)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  function selectIcon(icon: CategoryIconId) {
    onChange(icon)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Ícone: ${CATEGORY_ICON_LABELS[value]}. Escolher outro ícone.`}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3 text-left transition-colors",
          !disabled && "hover:bg-muted/50",
          open && "border-primary/40 ring-2 ring-primary/20",
          disabled && "cursor-not-allowed opacity-60"
        )}
        onClick={() => {
          if (!disabled) setOpen((current) => !current)
        }}
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-background">
          <CategoryIcon icon={value} className="size-7" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{CATEGORY_ICON_LABELS[value]}</p>
          <p className="text-xs text-muted-foreground">
            {open ? "Escolha um ícone abaixo" : "Clique para escolher ícone"}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Ícones disponíveis"
          className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border bg-popover p-2 text-popover-foreground shadow-lg"
        >
          <div className="grid max-h-60 grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-5">
            {CATEGORY_ICON_ENTRIES.map((entry) => (
              <button
                key={entry.id}
                type="button"
                role="option"
                aria-selected={value === entry.id}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border bg-input/20 p-2.5 transition-colors hover:bg-muted/60",
                  value === entry.id && "border-primary bg-primary/5"
                )}
                onClick={() => selectIcon(entry.id)}
              >
                <CategoryIcon icon={entry.id} className="size-5" />
                <span className="w-full truncate text-center text-[10px] leading-tight font-medium">
                  {entry.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

import { useEditorPageChrome } from "@/components/editor/editor-page-chrome"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown, PanelRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function FloatBarContentMenu({ disabled }: { disabled?: boolean }) {
  const editorPage = useEditorPageChrome()
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

  if (!editorPage) return null

  const { fieldGroups, openContentCategory, isContentBrowserOpen } = editorPage

  return (
    <div ref={rootRef} className="relative flex items-center">
      <Button
        size="sm"
        variant={open || isContentBrowserOpen ? "secondary" : "ghost"}
        className="rounded-full gap-1.5"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        title="Conteúdo da página"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <PanelRight className="size-4" />
        <span className="hidden sm:inline">Conteúdo</span>
        <ChevronDown
          className={cn(
            "size-3.5 opacity-60 transition-transform",
            open && "rotate-180"
          )}
        />
      </Button>

      {open ? (
        <div
          role="menu"
          className="absolute bottom-full left-1/2 z-10002 mb-3 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border bg-background shadow-xl"
        >
          <div className="border-b px-4 py-3">
            <p className="text-sm font-medium">Conteúdo da página</p>
            <p className="text-xs text-muted-foreground">
              Escolha o que deseja editar.
            </p>
          </div>

          <div className="p-2">
            {fieldGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/60"
                onClick={() => {
                  openContentCategory(group.id)
                  setOpen(false)
                }}
              >
                <group.icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 font-medium">{group.label}</span>
                <span className="text-xs text-muted-foreground">
                  {group.fields.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

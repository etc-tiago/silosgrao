import { cn } from "@/lib/utils"
import { useEffect, useState, type ReactNode } from "react"

export type SiteHeaderWrapperProps = {
  className?: string
  scrollThreshold?: number
}

export function SiteHeaderWrapper({
  className,
  scrollThreshold = 32,
  children,
}: SiteHeaderWrapperProps & { children: ReactNode }) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    function onScroll() {
      setHidden(window.scrollY > scrollThreshold)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [scrollThreshold])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-9999 w-full px-[3.2rem] py-[1.6rem] uppercase",
        'bg-linear-to-b from-black/60 via-black/30 to-black/0',
        "transition-all duration-500 ease-in-out",
        hidden && "pointer-events-none -translate-y-full opacity-0",
        className
      )}
    >
      {children}
    </header>
  )
}

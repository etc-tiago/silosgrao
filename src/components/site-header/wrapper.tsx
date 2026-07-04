import { cn } from "@/lib/utils"
import { useEffect, useState, type ReactNode } from "react"

export type SiteHeaderPosition = "fixed" | "embedded"

export type SiteHeaderWrapperProps = {
  className?: string
  scrollThreshold?: number
  position?: SiteHeaderPosition
  hideOnScroll?: boolean
}

export function SiteHeaderWrapper({
  className,
  scrollThreshold = 32,
  position = "fixed",
  hideOnScroll = true,
  children,
}: SiteHeaderWrapperProps & { children: ReactNode }) {
  const [hidden, setHidden] = useState(false)
  const shouldHideOnScroll = hideOnScroll && position === "fixed"

  useEffect(() => {
    if (!shouldHideOnScroll) {
      setHidden(false)
      return
    }

    function onScroll() {
      setHidden(window.scrollY > scrollThreshold)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [scrollThreshold, shouldHideOnScroll])

  return (
    <header
      className={cn(
        "w-full uppercase",
        position === "fixed"
          ? "fixed top-0 left-0 z-9999 px-[3.2rem] py-[1.6rem]"
          : "absolute inset-x-0 top-0 z-10",
        "bg-linear-to-b from-black/60 via-black/30 to-black/0",
        "mask-[linear-gradient(to_bottom,black_0%,transparent_100%)] backdrop-blur-md",
        "transition-all duration-500 ease-in-out",
        shouldHideOnScroll &&
        hidden &&
        "pointer-events-none -translate-y-full opacity-0",
        "h-36",
        className
      )}
    >
      {children}
    </header>
  )
}

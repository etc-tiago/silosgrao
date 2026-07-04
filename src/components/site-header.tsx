import { Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type SiteHeaderProps = {
  className?: string
  scrollThreshold?: number
}

export function SiteHeader({
  className,
  scrollThreshold = 32,
}: SiteHeaderProps) {
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
        "fixed top-0 left-0 z-[9999] w-full px-[3.2rem] py-[1.6rem] uppercase",
        "bg-[linear-gradient(180deg,rgba(35,31,32,0.6)_0%,rgba(35,31,32,0)_100%)]",
        "transition-all duration-500 ease-in-out",
        hidden && "-translate-y-full opacity-0 pointer-events-none",
        className
      )}
    >
      <Link
        to="/"
        className="text-sm font-semibold tracking-[0.2em] text-white/90 transition-colors hover:text-white"
      >
        Silos Grãos
      </Link>
    </header>
  )
}

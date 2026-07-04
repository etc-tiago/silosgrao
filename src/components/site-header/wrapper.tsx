import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export type SiteHeaderWrapperProps = {
  className?: string
}

export function SiteHeaderWrapper({
  className,
  children,
}: SiteHeaderWrapperProps & { children: ReactNode }) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-9999 h-36 w-full px-[3.2rem] py-[1.6rem] uppercase",
        "bg-linear-to-b from-black/60 via-black/30 to-black/0",
        "mask-[linear-gradient(to_bottom,black_0%,transparent_100%)] backdrop-blur-md",
        className
      )}
    >
      {children}
    </header>
  )
}

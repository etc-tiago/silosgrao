import type { CategoryIconId } from "@/lib/content/fields/category-icon"
import { cn } from "@/lib/utils"
import {
  Box,
  Boxes,
  Building2,
  Cog,
  Droplets,
  Factory,
  Flame,
  Gauge,
  HardHat,
  Layers,
  Package,
  Thermometer,
  Truck,
  Warehouse,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react"

const CATEGORY_ICON_COMPONENTS: Record<CategoryIconId, LucideIcon> = {
  "building-2": Building2,
  wind: Wind,
  droplets: Droplets,
  zap: Zap,
  warehouse: Warehouse,
  factory: Factory,
  truck: Truck,
  package: Package,
  layers: Layers,
  box: Box,
  boxes: Boxes,
  cog: Cog,
  gauge: Gauge,
  flame: Flame,
  thermometer: Thermometer,
  "hard-hat": HardHat,
}

type CategoryIconProps = {
  icon: CategoryIconId
  className?: string
}

export function CategoryIcon({ icon, className }: CategoryIconProps) {
  const Icon = CATEGORY_ICON_COMPONENTS[icon]
  return <Icon className={cn("size-6 shrink-0", className)} />
}

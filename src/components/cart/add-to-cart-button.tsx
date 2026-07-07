import { useCart } from "@/components/cart/cart-provider"
import type { CartProductInput } from "@/lib/cart/types"
import { cn } from "@/lib/utils"
import { Check, ShoppingCart } from "lucide-react"

type AddToCartButtonProps = {
  product: CartProductInput
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addItem, hasItem } = useCart()
  const inCart = hasItem(product.id)

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className={cn(
        "inline-flex h-10 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors",
        inCart
          ? "border bg-muted text-foreground hover:bg-muted/80"
          : "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
    >
      {inCart ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
      {inCart ? "Adicionado à lista" : "Solicitar orçamento"}
    </button>
  )
}

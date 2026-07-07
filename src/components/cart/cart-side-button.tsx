import { useCart } from "@/components/cart/cart-provider"
import { cn } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"

type CartSideButtonProps = {
  className?: string
}

export function CartSideButton({ className }: CartSideButtonProps) {
  const { itemCount, openCart } = useCart()

  if (itemCount === 0) {
    return null
  }

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={
        itemCount > 0
          ? `Abrir carrinho com ${itemCount} itens`
          : "Solicitar orçamento"
      }
      className={cn(
        "fixed top-1/2 right-4 z-9998 flex origin-right -translate-y-1/2 rotate-270 items-center gap-2 rounded-t-2xl border border-b-0 bg-primary px-4 py-2 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90",
        className
      )}
    >
      <ShoppingCart className="size-4 shrink-0" aria-hidden />
      <span className="text-base font-semibold uppercase whitespace-nowrap">
        Solicitar orçamento
      </span>
      <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-background px-1 py-0.5 text-[9px] font-semibold text-foreground">
        {itemCount > 99 ? "99+" : itemCount}
      </span>
    </button>
  )
}

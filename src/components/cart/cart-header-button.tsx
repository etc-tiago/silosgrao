import { useCart } from "@/components/cart/cart-provider"
import { cn } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"

type CartHeaderButtonProps = {
  className?: string
}

export function CartHeaderButton({ className }: CartHeaderButtonProps) {
  const { itemCount, openCart } = useCart()

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={
        itemCount > 0
          ? `Abrir carrinho com ${itemCount} itens`
          : "Abrir carrinho"
      }
      className={cn(
        "relative inline-flex size-11 items-center justify-center rounded-full border bg-background text-foreground transition-colors hover:bg-muted",
        className
      )}
    >
      <ShoppingCart className="size-5" />
      {itemCount > 0 ? (
        <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </button>
  )
}

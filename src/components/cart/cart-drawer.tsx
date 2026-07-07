import { useCart } from "@/components/cart/cart-provider"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { buildCartWhatsAppUrl } from "@/lib/cart/whatsapp"
import { Minus, Plus, Trash2 } from "lucide-react"

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart()

  const whatsappUrl = items.length > 0 ? buildCartWhatsAppUrl(items) : null

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <DrawerContent className="max-w-lg">
        <DrawerHeader>
          <DrawerTitle>Carrinho de orçamento</DrawerTitle>
          <DrawerDescription>
            Seus itens ficam salvos neste navegador. Envie a lista por WhatsApp
            para solicitar orçamento.
          </DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center">
              <p className="font-medium">Seu carrinho está vazio</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Adicione produtos na homepage ou no catálogo para montar seu
                pedido de orçamento.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{item.title}</p>
                      {item.categoryLabel ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.categoryLabel}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      aria-label={`Remover ${item.title}`}
                      onClick={() => removeItem(item.id)}
                      className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Diminuir quantidade"
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      className="inline-flex size-8 items-center justify-center rounded-full border transition-colors hover:bg-muted"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Aumentar quantidade"
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      className="inline-flex size-8 items-center justify-center rounded-full border transition-colors hover:bg-muted"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DrawerFooter className="gap-2 border-t pt-4">
          {items.length > 0 ? (
            <>
              <Button
                render={
                  <a
                    href={whatsappUrl ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                className="w-full"
              >
                Enviar pedido por WhatsApp
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={clearCart}
                className="w-full"
              >
                Limpar carrinho
              </Button>
            </>
          ) : null}
          <DrawerClose render={<Button type="button" variant="outline" />}>
            Fechar
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

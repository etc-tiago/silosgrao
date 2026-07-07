import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  getCartItemCount,
  readCartFromStorage,
  writeCartToStorage,
} from "@/lib/cart/storage"
import type { CartItem, CartProductInput } from "@/lib/cart/types"

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (product: CartProductInput) => void
  removeItem: (productId: number) => void
  setQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  hasItem: (productId: number) => boolean
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(readCartFromStorage())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    writeCartToStorage(items)
  }, [hydrated, items])

  const addItem = useCallback((product: CartProductInput) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id)

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...current,
        {
          id: product.id,
          slug: product.slug,
          title: product.title,
          categoryLabel: product.categoryLabel,
          quantity: 1,
        },
      ]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems((current) => current.filter((item) => item.id !== productId))
  }, [])

  const setQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) {
      setItems((current) => current.filter((item) => item.id !== productId))
      return
    }

    setItems((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const hasItem = useCallback(
    (productId: number) => items.some((item) => item.id === productId),
    [items]
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: getCartItemCount(items),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      hasItem,
    }),
    [addItem, clearCart, hasItem, isOpen, items, removeItem, setQuantity]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used within CartProvider.")
  }

  return context
}

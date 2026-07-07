import { cartSchema, type CartItem } from "@/lib/cart/types"

const CART_STORAGE_KEY = "silosgraos-cart-v1"

export function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return []

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    return cartSchema.parse(JSON.parse(raw))
  } catch {
    return []
  }
}

export function writeCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0)
}

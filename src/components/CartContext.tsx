// src/components/CartContext.tsx
'use client'

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

export type CartItem = {
  listingId: string
  cardName: string
  price: number
  quantity: number
  seller?: string
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (listingId: string) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Au montage, charger depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart")
      if (stored) setCart(JSON.parse(stored))
    } catch {
      setCart([])
    }
  }, [])

  // À chaque modification, sauvegarder
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart))
    } catch {
      /* ignore */
    }
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.listingId === item.listingId)
      if (idx !== -1) {
        const updated = [...prev]
        updated[idx].quantity += item.quantity
        return updated
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (listingId: string) =>
    setCart(prev => prev.filter(i => i.listingId !== listingId))

  const clearCart = () => setCart([])

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within <CartProvider>")
  return ctx
}

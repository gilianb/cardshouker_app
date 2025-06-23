// src/components/CartContext.tsx
'use client'

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import type { User } from '@supabase/supabase-js'

export type CartItem = {
  listingId: string
  cardName?: string
  setName?: string
  code?: string
  rarity?: string
  edition?: string
  cardImageUrl?: string
  price: number
  quantity: number
  seller?: string
}

type CartContextType = {
  cart: CartItem[]
  loading: boolean
  addToCart: (listingId: string) => Promise<void>
  removeFromCart: (listingId: string) => Promise<void>
  clearCart: () => Promise<void>
  total: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)

  // Charge le panier depuis la table cart_items
  const fetchCart = async (userId: string) => {
    setLoading(true)
    const { data, error } = await supabaseBrowser
      .from('cart_items')
      .select(`
        listing_id,
        quantity,
        listing:listing_id (
          price,
          sellers ( display_name ),
          full_card_versions:card_id (
            card_name,
            name_en,
            code,
            rarity,
            edition,
            card_image_url
          )
        )
      `)
      .eq('user_id', userId)

    if (!error && data) {
      const items = data.map((row: any) => {
        const l = row.listing
        const fc = Array.isArray(l.full_card_versions)
          ? l.full_card_versions[0]
          : l.full_card_versions
        return {
          listingId: row.listing_id,
          quantity: row.quantity,
          price: l.price,
          cardName: fc?.card_name,
          setName: fc?.name_en,
          code: fc?.code,
          rarity: fc?.rarity,
          edition: fc?.edition,
          cardImageUrl: fc?.card_image_url,
          seller: l.sellers?.[0]?.display_name,
        } as CartItem
      })
      setCart(items)
    }
    setLoading(false)
  }

  // Au montage, on récupère la session et on charge le panier
  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        fetchCart(user.id)
      }
    })
    const { data: { subscription } } =
      supabaseBrowser.auth.onAuthStateChange((_, session) => {
        if (session?.user) {
          setUser(session.user)
          fetchCart(session.user.id)
        } else {
          setUser(null)
          setCart([])
        }
      })
    return () => subscription.unsubscribe()
  }, [])

  // Appelle la RPC de réservation + ajout
  const addToCart = async (listingId: string) => {
    if (!user) return
    setLoading(true)
    try {
      const { error } = await supabaseBrowser.rpc(
        'reserve_and_add_to_cart',
        {
          p_listing_id: listingId,
          p_user_id: user.id,
        }
      )
      if (error) throw error
      await fetchCart(user.id)
    } catch (err) {
      console.error('addToCart RPC error', err)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (listingId: string) => {
    if (!user) return
    setLoading(true)
    try {
      const { error } = await supabaseBrowser
        .from('cart_items')
        .delete()
        .eq('listing_id', listingId)
        .eq('user_id', user.id)
      if (error) console.error('removeFromCart error', error)
      await fetchCart(user.id)
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { error } = await supabaseBrowser
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
      if (error) console.error('clearCart error', error)
      await fetchCart(user.id)
    } finally {
      setLoading(false)
    }
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}

// src/components/CartIcon.tsx
'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from './CartContext'

export default function CartIcon() {
  const { cart } = useCart()

  // Calculer le nombre total d'articles
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center p-2 hover:text-gray-900"
      aria-label="Voir le panier"
    >
      <ShoppingCart className="w-6 h-6" />
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 inline-flex items-center justify-center
                     bg-red-600 text-white text-[10px] font-bold rounded-full
                     w-4 h-4"
        >
          {count}
        </span>
      )}
    </Link>
  )
}

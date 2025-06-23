// src/app/cards/[id]/AddToCartButton.tsx
'use client'

import React from 'react'
import { useCart } from '@/components/CartContext'

export type AddToCartButtonProps = {
  listingId: string
}

export default function AddToCartButton({
  listingId,
}: AddToCartButtonProps) {
  const { addToCart, loading } = useCart()

  const handle = async () => {
    await addToCart(listingId)
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="bg-blue-600 text-white px-2 py-1 rounded text-xs 
                 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {loading ? 'Adding…' : 'Add to cart'}
    </button>
  )
}

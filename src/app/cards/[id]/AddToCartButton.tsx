// src/app/cards/[id]/AddToCartButton.tsx
'use client'

import { useCart } from "@/components/CartContext"

type AddToCartButtonProps = {
  listing: {
    id: string
    price: number
    sellers?: { display_name: string }[]
  }
  fc?: {
    card_name?: string
  }
}

export default function AddToCartButton({
  listing,
  fc,
}: AddToCartButtonProps) {
  const { addToCart } = useCart()

  return (
    <button
      className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
      onClick={() => {
        console.log("Ajout au panier :", listing.id)
        addToCart({
          listingId: listing.id,
          cardName: fc?.card_name ?? "",
          price: listing.price,
          quantity: 1,
          seller:
            Array.isArray(listing.sellers) && listing.sellers.length > 0
              ? listing.sellers[0].display_name
              : "Unknown",
        })
        alert("Carte ajoutée au panier !") // feedback visuel
      }}
    >
      Add to cart
    </button>
  )
}

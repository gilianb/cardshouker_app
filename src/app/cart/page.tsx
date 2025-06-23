// filepath: src/app/cart/page.tsx
'use client'
// Update the import path below if the actual location is different
import { useCart } from '../../components/CartContext'

export default function CartPage() {
  const { cart, removeFromCart, clearCart, total } = useCart()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <table className="w-full mb-4 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Card</th>
                <th className="p-2 text-left">Seller</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Qty</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.listingId} className="border-t">
                  <td className="p-2">{item.cardName}</td>
                  <td className="p-2">{item.seller}</td>
                  <td className="p-2">{item.price} €</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => removeFromCart(item.listingId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-bold mb-4">Total: {total} €</div>
          <button
            className="bg-gray-200 px-4 py-2 rounded mr-2"
            onClick={clearCart}
          >
            Clear Cart
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            // onClick={handleCheckout} // À implémenter
          >
            Checkout
          </button>
        </>
      )}
    </div>
  )
}
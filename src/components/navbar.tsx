'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow px-6 py-4 mb-6">
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link href="/" className={pathname === '/' ? 'text-blue-600' : 'text-gray-800'}>
          Home
        </Link>
        <Link href="/cards" className={pathname.startsWith('/cards') && pathname === '/cards' ? 'text-blue-600' : 'text-gray-800'}>
          Cards
        </Link>
        <Link href="/sell" className={pathname === '/sell' ? 'text-blue-600' : 'text-gray-800'}>
          Sell
        </Link>
      </div>
    </nav>
  );
}

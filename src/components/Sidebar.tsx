// filepath: src/components/Sidebar.tsx
'use client'
import Link from 'next/link'

export default function Sidebar({ open, setOpen }: { open: boolean, setOpen: (o: boolean) => void }) {
  return (
    <div
      className={`fixed left-0 z-40 flex flex-col transition-all duration-300
        ${open ? 'w-56' : 'w-14'}
        top-[4rem] h-[calc(100vh-4rem)] bg-transparent`}
    >
      <button
        className="p-3 focus:outline-none"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        <div className="space-y-1">
          <span className="block w-6 h-0.5 bg-gray-800"></span>
          <span className="block w-6 h-0.5 bg-gray-800"></span>
          <span className="block w-6 h-0.5 bg-gray-800"></span>
        </div>
      </button>
      {open && (
        <nav className="flex-1 flex flex-col gap-2 mt-4 pl-2">
          <Link href="/" className="py-2 px-2 rounded hover:bg-blue-50 text-gray-800">Home</Link>
          <Link href="/cards" className="py-2 px-2 rounded hover:bg-blue-50 text-gray-800">Cards</Link>
          <Link href="/sell" className="py-2 px-2 rounded hover:bg-blue-50 text-gray-800">Sell</Link>
          <Link href="/dashboard" className="py-2 px-2 rounded hover:bg-blue-50 text-gray-800">Dashboard</Link>
        </nav>
      )}
    </div>
  )
}
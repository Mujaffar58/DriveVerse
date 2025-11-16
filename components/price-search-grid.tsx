"use client"

import { useRouter } from "next/navigation"

export default function PriceSearchGrid() {
  const router = useRouter()

  const priceRanges = [
    { id: 1, label: "Under ₹5L", range: "0-500000", icon: "🚗" },
    { id: 2, label: "₹5–10L", range: "500000-1000000", icon: "🏎️" },
    { id: 3, label: "₹10–20L", range: "1000000-2000000", icon: "✨" },
    { id: 4, label: "₹20L+", range: "2000000+", icon: "👑" },
    { id: 5, label: "Electric Vehicles", range: "ev", icon: "⚡" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {priceRanges.map((range) => (
        <button
          key={range.id}
          onClick={() => router.push(`/search?priceRange=${range.range}`)}
          className="glass group hover:border-primary/50 hover:bg-white/15 transition-all p-6 text-center"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{range.icon}</div>
          <h3 className="text-lg font-semibold text-white">{range.label}</h3>
        </button>
      ))}
    </div>
  )
}

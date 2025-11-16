"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import VehicleCard from "@/components/vehicle-card"
import { vehicles } from "@/lib/vehicle-data"

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const priceRange = searchParams.get("priceRange")

  const filterVehicles = () => {
    if (!priceRange) return vehicles

    if (priceRange === "ev") {
      return vehicles.filter((v) => v.fuel === "Electric")
    }

    const [min, max] = priceRange.split("-").map(Number)
    return vehicles.filter((v) => v.price >= min && (max ? v.price <= max : true))
  }

  const filtered = filterVehicles()

  const priceLabels: Record<string, string> = {
    "0-500000": "Under ₹5L",
    "500000-1000000": "₹5–10L",
    "1000000-2000000": "₹10–20L",
    "2000000+": "₹20L+",
    ev: "Electric Vehicles",
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="glass-sm border-b border-white/10 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <button onClick={() => router.push("/")} className="text-secondary hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">{priceLabels[priceRange || ""] || "Search Results"}</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <p className="text-muted-foreground mb-6">{filtered.length} vehicles found</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((vehicle) => (
            <div key={vehicle.id} onClick={() => router.push(`/vehicle/${vehicle.id}`)} className="cursor-pointer">
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

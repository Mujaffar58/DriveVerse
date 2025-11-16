"use client"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import VehicleCard from "@/components/vehicle-card"
import { vehicles } from "@/lib/vehicle-data"

export default function BrandVehicles() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const brand = params.brand as string
  const category = searchParams.get("category") || "All"

  let filteredVehicles = vehicles.filter((v) => v.brand === brand)
  if (category !== "All") {
    filteredVehicles = filteredVehicles.filter((v) => v.category === category)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-sm border-b border-white/10 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            
          </button>
          <h1 className="text-3xl font-bold gradient-text">
            {brand} {category !== "All" ? category : ""}
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {filteredVehicles.length > 0 ? (
          <>
            <p className="text-muted-foreground mb-6">Showing {filteredVehicles.length} vehicles</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} onClick={() => router.push(`/vehicle/${vehicle.id}`)} className="cursor-pointer">
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="glass p-12 rounded-lg text-center">
            <p className="text-2xl text-muted-foreground">
              No vehicles found for {brand} in {category}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

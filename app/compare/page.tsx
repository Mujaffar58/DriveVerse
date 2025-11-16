"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X, ArrowLeft } from "lucide-react"
import { vehicles } from "@/lib/vehicle-data"

export default function ComparePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selected, setSelected] = useState<number[]>([])
  const [showDropdown, setShowDropdown] = useState<number | null>(null)

  useEffect(() => {
    const vehicleParam = searchParams.get("vehicle")
    if (vehicleParam) {
      setSelected([Number.parseInt(vehicleParam)])
    }
  }, [searchParams])

  const addVehicle = (vehicleId: number) => {
    if (selected.length < 3 && !selected.includes(vehicleId)) {
      setSelected([...selected, vehicleId])
      setShowDropdown(null)
    }
  }

  const removeVehicle = (vehicleId: number) => {
    setSelected(selected.filter((id) => id !== vehicleId))
  }

  const selectedVehicles = vehicles.filter((v) => selected.includes(v.id))

  const getComparison = (key: keyof (typeof vehicles)[0]) => {
    return selectedVehicles.map((v) => v[key])
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="glass-sm border-b border-white/10 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="text-secondary hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Compare Vehicles</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Vehicle Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="glass p-6 relative">
              {selected[idx] ? (
                <div className="text-center">
                  <img
                    src={vehicles.find((v) => v.id === selected[idx])?.image || "/placeholder.svg"}
                    alt="selected"
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-bold text-lg mb-4">{vehicles.find((v) => v.id === selected[idx])?.name}</h3>
                  <button
                    onClick={() => removeVehicle(selected[idx])}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <X className="w-5 h-5 inline-block mr-2" />
                    Remove
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(showDropdown === idx ? null : idx)}
                    className="w-full py-8 text-muted-foreground hover:text-foreground transition-colors text-center font-semibold"
                  >
                    + Add Vehicle
                  </button>

                  {showDropdown === idx && (
                    <div className="absolute top-full mt-2 w-full bg-slate-800 border border-white/20 rounded-lg overflow-hidden z-10 max-h-64 overflow-y-auto">
                      {vehicles
                        .filter((v) => !selected.includes(v.id))
                        .map((vehicle) => (
                          <button
                            key={vehicle.id}
                            onClick={() => addVehicle(vehicle.id)}
                            className="w-full px-4 py-3 hover:bg-white/10 transition-colors text-left border-b border-white/10 last:border-0"
                          >
                            <p className="font-semibold">{vehicle.name}</p>
                            <p className="text-sm text-muted-foreground">₹{vehicle.price.toLocaleString("en-IN")}</p>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        {selectedVehicles.length > 0 && (
          <div className="glass p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="font-semibold py-3 px-2 w-48">Price</td>
                  {selectedVehicles.map((v) => (
                    <td key={v.id} className="py-3 px-4 text-center font-bold gradient-text">
                      ₹{v.price.toLocaleString("en-IN")}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="font-semibold py-3 px-2">Category</td>
                  {selectedVehicles.map((v) => (
                    <td key={v.id} className="py-3 px-4 text-center">
                      {v.category}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="font-semibold py-3 px-2">Fuel Type</td>
                  {selectedVehicles.map((v) => (
                    <td key={v.id} className="py-3 px-4 text-center">
                      {v.fuel}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="font-semibold py-3 px-2">Engine</td>
                  {selectedVehicles.map((v) => (
                    <td key={v.id} className="py-3 px-4 text-center">
                      {v.engine}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="font-semibold py-3 px-2">Transmission</td>
                  {selectedVehicles.map((v) => (
                    <td key={v.id} className="py-3 px-4 text-center">
                      {v.transmission}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="font-semibold py-3 px-2">Mileage</td>
                  {selectedVehicles.map((v) => (
                    <td key={v.id} className="py-3 px-4 text-center">
                      {v.mileage} {v.fuel === "Electric" ? "km" : "km/l"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {selectedVehicles.length === 0 && (
          <div className="glass p-12 text-center">
            <p className="text-muted-foreground text-lg">Select up to 3 vehicles to compare</p>
          </div>
        )}
      </div>
    </main>
  )
}

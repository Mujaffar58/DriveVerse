"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin } from "lucide-react"
import SearchBar from "@/components/search-bar"
import CategoryTabs from "@/components/category-tabs"
import NewLaunchesCarousel from "@/components/new-launches-carousel"
import BrandGrid from "@/components/brand-grid"
import PriceSearchGrid from "@/components/price-search-grid"
import VehicleCard from "@/components/vehicle-card"
import { vehicles } from "@/lib/vehicle-data"
import CitySelector from "@/components/CitySelector"

export default function Home() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("Cars")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredVehicles = vehicles.filter((v) => v.category === selectedCategory)

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold gradient-text">DriveVerse</h1>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <CitySelector />
            </div>
          </div>
          <SearchBar />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* New Launches Carousel */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">New Launches</h2>
          <NewLaunchesCarousel />
        </div>

        {/* Category Tabs */}
        <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

        {/* Brand Grid */}
        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6">Featured Brands</h2>
          <BrandGrid selectedCategory={selectedCategory} />
        </div>

        {/* Price Search Grid */}
        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6">Search by Price Range</h2>
          <PriceSearchGrid />
        </div>

        {/* Vehicles Grid */}
        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6">{selectedCategory} Available</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} onClick={() => router.push(`/vehicle/${vehicle.id}`)} className="cursor-pointer">
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

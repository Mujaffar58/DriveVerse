"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import React from "react"

export default function BrandGrid({ selectedCategory }: { selectedCategory: string }) {
  const router = useRouter()

  const brandsByCategory: Record<string, Array<{ id: number; name: string; logo: string }>> = {
    Cars: [
      { id: 1, name: "Maruti", logo: "/logos/marutisuzuki.png" },
      { id: 2, name: "Tata", logo: "/logos/tata.png" },
      { id: 3, name: "Kia", logo: "/logos/kia.png" },
      { id: 4, name: "Hyundai", logo: "/logos/HYUNDAI.png" },
      { id: 5, name: "Honda", logo: "/logos/honda.png" },
      { id: 6, name: "MG", logo: "/logos/mg.png" },
    ],
    Bikes: [
      { id: 1, name: "Honda", logo: "/honda-m.png" },
      { id: 2, name: "Bajaj", logo: "/bajaj.png" },
      { id: 3, name: "Hero", logo: "/hero.png" },
      { id: 4, name: "TVS", logo: "/tvs.jpg" },
    ],
    Scooters: [
      { id: 1, name: "Hero", logo: "/logos/hero.png" },
      { id: 2, name: "Ather", logo: "/ather.png" },
    ],
    EVs: [
      { id: 1, name: "Tata", logo: "/logos/tata.png" },
      { id: 2, name: "BYD", logo: "/byd.png" },
      { id: 3, name: "Ather", logo: "/ather.png" },
    ],
  }

  const brands = brandsByCategory[selectedCategory] || []

  const handleBrandClick = (brandName: string) => {
    const url = `/brand/${encodeURIComponent(brandName)}?category=${encodeURIComponent(selectedCategory)}`
    console.log("[BrandGrid] navigating to", url, "selectedCategory:", selectedCategory)
    router.push(url)
  }

  const handleViewMore = () => {
    const url = `/brands?category=${encodeURIComponent(selectedCategory)}`
    console.log("[BrandGrid] View More click ->", url)
    router.push(url)
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-2">
        {brands.slice(0, 6).map((brand) => (
          <button
            key={brand.id}
            onClick={() => handleBrandClick(brand.name)}
            className="glass h-26 cursor-pointer hover:scale-105 transition-transform rounded-lg overflow-hidden bg-white/10 relative"
            aria-label={`Open ${brand.name}`}
          >
            <Image
              src={brand.logo || "/placeholder.svg"}
              alt={brand.name}
              fill
              className="object-contain hover:shadow-lg hover:shadow-primary/50 transition-all"
              sizes="(max-width: 640px) 30vw, 120px"
            />
          </button>
        ))}
      </div>

      {/* View More */}
      <div className="flex justify-center mt-3">
        <button
          onClick={handleViewMore}
          className="text-sm font-semibold text-primary hover:underline px-4 py-2 rounded"
        >
          View More
        </button>
      </div>
    </div>
  )
}

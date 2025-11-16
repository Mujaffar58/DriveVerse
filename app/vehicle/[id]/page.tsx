"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Heart, Share2, Check, ChevronLeft, ChevronRight } from "lucide-react"
import EMICalculator from "@/components/emi-calculator"
import { vehicles } from "@/lib/vehicle-data"

export default function VehicleDetails() {
  const router = useRouter()
  const params = useParams()
  const id = Number.parseInt(params.id as string)
  const [showVariants, setShowVariants] = useState(false)
const city = typeof window !== "undefined" ? localStorage.getItem("driveverse_city") : null
const [showGallery, setShowGallery] = useState(false)


  const vehicle = vehicles.find((v) => v.id === id) as any
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(vehicle?.variants?.[0] || null)
  const [selectedColor, setSelectedColor] = useState(vehicle?.colors?.[0] || "")
  const [galleryIndex, setGalleryIndex] = useState(0)

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-2xl text-muted-foreground">Vehicle not found</p>
      </div>
    )
  }

  const currentPrice = selectedVariant?.price || vehicle.price

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="glass-sm border-b border-white/10 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
    
          </button>
          <h1 className="text-2xl font-bold">{vehicle.name}</h1>
          <div className="flex gap-5">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-2 rounded-lg transition-colors ${isWishlisted ? "bg-primary text-white" : "glass hover:bg-white/15"}`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
            <button className="p-2 glass rounded-lg hover:bg-white/15 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Gallery Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <div className="glass h-76 overflow-hidden flex items-center justify-center relative group">
              <img
                src={vehicle.galleryImages?.[galleryIndex] || vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />

              {vehicle.galleryImages && vehicle.galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setGalleryIndex(
                        (prev) => (prev - 1 + vehicle.galleryImages.length) % vehicle.galleryImages.length,
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={() => setGalleryIndex((prev) => (prev + 1) % vehicle.galleryImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {vehicle.galleryImages && vehicle.galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {vehicle.galleryImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setGalleryIndex(idx)}
                    className={`h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === galleryIndex ? "border-secondary" : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="glass p-6 flex flex-col gap-6 h-fit sticky top-24">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Price</p>
              <p className="text-4xl font-bold gradient-text">₹{currentPrice.toLocaleString("en-IN")}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Fuel Type</p>
                <p className="font-semibold">{vehicle.fuel}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Transmission</p>
                <p className="font-semibold">{selectedVariant?.transmission || vehicle.transmission}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Engine</p>
                <p className="font-semibold">{vehicle.engine}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Mileage</p>
                <p className="font-semibold">
                  {vehicle.mileage} {vehicle.fuel === "Electric" ? "km" : "km/l"}
                </p>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all">
              Request Test Drive
            </button>

            <button
              onClick={() => router.push(`/compare?vehicle=${id}`)}
              className="w-full glass py-3 rounded-lg font-semibold hover:bg-white/15 transition-colors"
            >
              Compare
            </button>
          </div>
        </div>


        {/* Colors Section */}
        {vehicle.colors && vehicle.colors.length > 0 && (
          <div className="glass p-6 mb-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Available Colors</h2>
            <div className="flex flex-wrap gap-4">
              {vehicle.colors.map((color: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all font-semibold ${
                    selectedColor === color
                      ? "border-secondary bg-secondary/10"
                      : "border-white/10 hover:border-white/30 glass"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}
{/* Variants Section as Dropdown */}
{vehicle.variants && vehicle.variants.length > 1 && (
  <div className="glass p-6 mb-8 rounded-lg">
    <h2 className="text-2xl font-bold mb-6">Select Variant</h2>

    {/* Variant Dropdown */}
    <div className="relative mb-4">
      <button
        onClick={() => setShowVariants((s) => !s)}
        className="w-full px-4 py-3 rounded-lg border border-white/10 glass hover:border-white/30 flex items-center justify-between text-left"
      >
        <span className="font-semibold">
          {selectedVariant ? selectedVariant.name : "Choose Variant"}
        </span>
        <span className="text-gray-400">▾</span>
      </button>

      {showVariants && (
        <div className="absolute z-50 w-full bg-[#0f0f11] border border-white/10 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto">
          {vehicle.variants.map((variant: any, idx: number) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedVariant(variant)
                setShowVariants(false)
              }}
              className={`px-4 py-3 cursor-pointer hover:bg-white/10 transition ${
                selectedVariant?.name === variant.name ? "bg-secondary/10 border-l-4 border-secondary" : ""
              }`}
            >
              <p className="font-semibold">{variant.name}</p>
              
            </div>
          ))}
        </div>
      )}
    </div>

    {/* On Road Price Box */}
    {selectedVariant && (
      <div className="glass p-4 rounded-lg border border-white/10 mt-4">

        <h3 className="text-xl font-bold mb-4">On-Road Price ({city || "Select City"})</h3>

        {/* Pricing breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ex-Showroom</span>
            <span className="font-semibold">₹{selectedVariant.price.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">RTO Charges</span>
            <span className="font-semibold">
              ₹{Math.round(selectedVariant.price * 0.10).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Insurance</span>
            <span className="font-semibold">
              ₹{Math.round(selectedVariant.price * 0.025).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Other Charges</span>
            <span className="font-semibold">₹5,000</span>
          </div>

          <hr className="border-white/10 my-3" />

          {/* Total On Road */}
          <div className="flex justify-between text-lg font-bold">
            <span>On-Road Price</span>
            <span className="gradient-text">
              ₹{(
                selectedVariant.price +
                selectedVariant.price * 0.10 +
                selectedVariant.price * 0.025 +
                5000
              ).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    )}
  </div>
)}

        {/* EMI Calculator */}
        <div className="mb-12">
          <EMICalculator basePrice={currentPrice} />
        </div>
      </div>
    </main>
  )
}

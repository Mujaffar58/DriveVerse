"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import EMICalculator from "@/components/emi-calculator"
import { vehicles } from "@/lib/vehicle-data"

export default function VehicleDetails() {
  const router = useRouter()
  const params = useParams()
  const id = Number.parseInt(params.id as string)

  const [showVariants, setShowVariants] = useState(false)
  const city =
    typeof window !== "undefined" ? localStorage.getItem("driveverse_city") : null

  const vehicle = vehicles.find((v) => v.id === id) as any

  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(
    vehicle?.variants?.[0] || null,
  )

  // MAIN hero image state
  const [galleryIndex, setGalleryIndex] = useState(0)

  // GALLERY MODAL state
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [modalImageIndex, setModalImageIndex] = useState(0)

  // COLOR state (main)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(vehicle?.colors?.[0] || "")

  // COLOR MODAL state
  const [showColorModal, setShowColorModal] = useState(false)
  const [modalColorIndex, setModalColorIndex] = useState(0)
  const [modalColor, setModalColor] = useState(vehicle?.colors?.[0] || "")

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-2xl text-muted-foreground">Vehicle not found</p>
      </div>
    )
  }

  // pricing
  const currentPrice = selectedVariant?.price || vehicle.price

  const exShowroom = selectedVariant?.price || vehicle.price
  const rtoCharges = Math.round(exShowroom * 0.1)
  const insuranceCharges = Math.round(exShowroom * 0.025)
  const otherCharges = 5000
  const onRoadPrice =
    exShowroom + rtoCharges + insuranceCharges + otherCharges

  // variant-wise specs & features
  const variantSpecs =
    selectedVariant && vehicle.variantSpecs
      ? vehicle.variantSpecs[selectedVariant.name]
      : null

  const variantFeatures: string[] =
    selectedVariant && vehicle.variantFeatures
      ? vehicle.variantFeatures[selectedVariant.name] || []
      : []

  // color helper
  const getColorClass = (color: string) => {
    const c = color.toLowerCase()

    if (c.includes("white")) return "bg-slate-100 border border-slate-300"
    if (c.includes("black")) return "bg-black border border-slate-700"
    if (c.includes("red")) return "bg-red-600"
    if (c.includes("blue")) return "bg-blue-600"
    if (c.includes("silver") || c.includes("grey") || c.includes("gray"))
      return "bg-slate-400"
    if (c.includes("green")) return "bg-green-600"
    if (c.includes("yellow")) return "bg-yellow-400"
    if (c.includes("orange")) return "bg-orange-500"
    if (c.includes("brown")) return "bg-amber-800"
    if (c.includes("purple")) return "bg-purple-600"

    return "bg-slate-500"
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="glass-sm border-b border-white/10 py-3 mb-4 sm:mb-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-2xl font-bold">{vehicle.name}</h1>
          <div className="flex gap-3 sm:gap-5">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-2 rounded-lg transition-colors ${
                isWishlisted ? "bg-primary text-white" : "glass hover:bg-white/15"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
              />
            </button>
            <button className="p-2 glass rounded-lg hover:bg-white/15 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-8 pb-6 sm:pb-10">
        {/* Top hero section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mb-2 sm:mb-4">
          {/* Gallery */}
          <div className="lg:col-span-2">
            <div className="glass overflow-hidden relative aspect-[16/9] w-full rounded-xl flex items-center justify-center">
              <img
                src={vehicle.galleryImages?.[galleryIndex] || vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-contain"
              />

              {/* view images btn */}
              <button
                onClick={() => {
                  setModalImageIndex(galleryIndex)
                  setShowGalleryModal(true)
                }}
                className="absolute left-3 bottom-3 px-3 py-1.5 rounded-full bg-black/60 text-[11px] font-medium text-white flex items-center gap-1"
              >
                View {vehicle.galleryImages?.length || 1} Images
              </button>

              {/* colors btn */}
              {vehicle.colors && vehicle.colors.length > 0 && (
                <button
                  onClick={() => {
                    setModalColorIndex(selectedColorIndex)
                    setModalColor(
                      selectedColor || vehicle.colors?.[selectedColorIndex] || "",
                    )
                    setShowColorModal(true)
                  }}
                  className="absolute right-3 bottom-3 px-3 py-1.5 rounded-full bg-black/60 text-[11px] font-medium text-white"
                >
                  Colors
                </button>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="glass p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 h-fit lg:sticky lg:top-24 rounded-xl">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Price</p>
              <p className="text-3xl sm:text-4xl font-bold gradient-text">
                ₹{currentPrice.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Fuel Type</p>
                <p className="font-semibold text-sm">
                  {variantSpecs?.fuelType || vehicle.fuel}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">
                  Transmission
                </p>
                <p className="font-semibold text-sm">
                  {selectedVariant?.transmission ||
                    variantSpecs?.transmission ||
                    vehicle.transmission}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Engine</p>
                <p className="font-semibold text-sm">
                  {variantSpecs?.engine || vehicle.engine}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">
                  {vehicle.fuel === "Electric" ? "Range" : "Mileage"}
                </p>
                <p className="font-semibold text-sm">
                  {variantSpecs?.araiMileage || vehicle.mileage}{" "}
                  {vehicle.fuel === "Electric" ? "km" : "km/l"}
                </p>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-2 sm:py-3 rounded-lg hover:shadow-lg hover:shadow-primary/40 transition-all text-sm sm:text-base">
              Request Test Drive
            </button>

            <button
              onClick={() => router.push(`/compare?vehicle=${id}`)}
              className="w-full glass py-2 sm:py-3 rounded-lg font-semibold hover:bg-white/15 transition-colors text-sm sm:text-base"
            >
              Compare
            </button>
          </div>
        </div>

        {/* Variant & pricing section */}
        {vehicle.variants && vehicle.variants.length > 1 && (
          <div className="glass p-4 sm:p-6 mb-6 sm:mb-8 rounded-lg space-y-3">
            <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
              Select Variant
            </h2>

            {/* Variant dropdown */}
            <div className="relative mb-2 sm:mb-4">
              <button
                onClick={() => setShowVariants((s) => !s)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-white/10 glass hover:border-white/30 flex items-center justify-between text-left text-sm sm:text-base"
              >
                <span className="font-semibold">
                  {selectedVariant ? selectedVariant.name : "Choose Variant"}
                </span>
                <span className="text-gray-400">▾</span>
              </button>

              {showVariants && (
                <div className="absolute z-50 w-full bg-[#0f0f11] border border-white/10 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto text-sm">
                  {vehicle.variants.map((variant: any, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedVariant(variant)
                        setShowVariants(false)
                      }}
                      className={`px-4 py-3 cursor-pointer hover:bg-white/10 transition ${
                        selectedVariant?.name === variant.name
                          ? "bg-secondary/10 border-l-4 border-secondary"
                          : ""
                      }`}
                    >
                      <p className="font-semibold">{variant.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedVariant && (
              <div className="space-y-4 sm:space-y-6">
                {/* On-Road Price Box */}
                <div className="glass p-3 sm:p-4 rounded-lg border border-white/10 mt-1 sm:mt-2 text-sm sm:text-base space-y-2">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                    On-Road Price ({city || "Select City"})
                  </h3>

                  <div className="space-y-1.5 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ex-Showroom</span>
                      <span className="font-semibold">
                        ₹{exShowroom.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">RTO Charges</span>
                      <span className="font-semibold">
                        ₹{rtoCharges.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Insurance</span>
                      <span className="font-semibold">
                        ₹{insuranceCharges.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Other Charges
                      </span>
                      <span className="font-semibold">
                        ₹{otherCharges.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <hr className="border-white/10 my-2" />

                    <div className="flex justify-between text-base sm:text-lg font-semibold">
                      <span>On-Road Price</span>
                      <span className="gradient-text">
                        ₹{onRoadPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Specs & Features */}
                {variantSpecs && (
                  <div className="glass p-4 sm:p-5 rounded-lg border border-white/10 text-sm sm:text-base space-y-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-base sm:text-lg font-semibold">
                        Key Specs & Features
                      </h4>
                      <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">
                        {selectedVariant.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div>
                        <p className="text-muted-foreground text-[10px] sm:text-xs mb-1">
                          Fuel Type
                        </p>
                        <p className="font-semibold">
                          {variantSpecs.fuelType || vehicle.fuel}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[10px] sm:text-xs mb-1">
                          Engine
                        </p>
                        <p className="font-semibold">
                          {variantSpecs.engine || vehicle.engine}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[10px] sm:text-xs mb-1">
                          {vehicle.fuel === "Electric"
                            ? "Certified Range"
                            : "ARAI Mileage"}
                        </p>
                        <p className="font-semibold">
                          {variantSpecs.araiMileage ||
                            (vehicle.fuel === "Electric"
                              ? `${vehicle.mileage} km`
                              : `${vehicle.mileage} km/l`)}
                        </p>
                      </div>
                      {(variantSpecs.power || variantSpecs.torque) && (
                        <div>
                          <p className="text-muted-foreground text-[10px] sm:text-xs mb-1">
                            Power &amp; Torque
                          </p>
                          <p className="font-semibold">
                            {variantSpecs.power || ""}{" "}
                            {variantSpecs.power && variantSpecs.torque
                              ? " / "
                              : ""}
                            {variantSpecs.torque || ""}
                          </p>
                        </div>
                      )}
                    </div>

                    {variantFeatures.length > 0 && (
                      <div>
                        <p className="text-muted-foreground text-[10px] sm:text-xs mb-1.5">
                          Highlight Features
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                          {variantFeatures.slice(0, 5).map((feat, idx) => (
                            <li key={idx}>{feat}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={() => router.push(`/vehicle/${id}/specs`)}
                      className="mt-1 inline-flex items-center justify-center px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      View More Specs &amp; Features
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* EMI Calculator */}
        <div className="mb-8 sm:mb-12">
          <EMICalculator basePrice={onRoadPrice} maxLoan={onRoadPrice} />
        </div>
      </div>

      {/* IMAGE GALLERY MODAL */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-3xl px-3 sm:px-4">
            <div className="relative bg-slate-950/80 rounded-2xl overflow-hidden border border-white/10">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <span className="text-sm font-medium text-white/80">
                  Images
                </span>
                <button
                  onClick={() => {
                    setShowGalleryModal(false)
                    setGalleryIndex(modalImageIndex)
                  }}
                  className="text-white/70 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="relative aspect-video w-full flex items-center justify-center bg-black/60">
                <img
                  src={vehicle.galleryImages?.[modalImageIndex] || vehicle.image}
                  alt={`${vehicle.name} image ${modalImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />

                {vehicle.galleryImages && vehicle.galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setModalImageIndex(
                          (prev) =>
                            (prev - 1 + vehicle.galleryImages.length) %
                            vehicle.galleryImages.length,
                        )
                      }
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </button>
                    <button
                      onClick={() =>
                        setModalImageIndex(
                          (prev) =>
                            (prev + 1) % vehicle.galleryImages.length,
                        )
                      }
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COLOR PICKER MODAL */}
      {showColorModal &&
        vehicle.colors &&
        vehicle.colors.length > 0 && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <div className="w-full max-w-2xl px-3 sm:px-4">
              <div className="relative bg-slate-950/80 rounded-2xl border border-white/10">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <span className="text-sm font-medium text-white/80">
                    Colors
                  </span>
                  <button
                    onClick={() => {
                      setShowColorModal(false)
                      setSelectedColor(modalColor)
                      setSelectedColorIndex(modalColorIndex)
                      if (vehicle.galleryImages?.[modalColorIndex]) {
                        setGalleryIndex(modalColorIndex)
                      }
                    }}
                    className="text-white/70 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4 pt-3">
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground">
                      Selected Color
                    </p>
                    <p className="text-lg font-semibold">
                      {modalColor || "—"}
                    </p>
                  </div>

                  <div className="aspect-video w-full mb-4 rounded-xl overflow-hidden bg-black/60 flex items-center justify-center">
                    <img
                      src={
                        vehicle.galleryImages?.[modalColorIndex] ||
                        vehicle.galleryImages?.[galleryIndex] ||
                        vehicle.image
                      }
                      alt={`${vehicle.name} ${modalColor}`}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {vehicle.colors.map((color: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setModalColor(color)
                          setModalColorIndex(idx)
                        }}
                        className={`h-9 w-9 rounded-full border-2 flex-shrink-0 ${getColorClass(
                          color,
                        )} ${
                          modalColor === color
                            ? "border-secondary scale-110"
                            : "border-white/30"
                        } transition-transform`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </main>
  )
}

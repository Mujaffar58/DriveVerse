"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, Minus, Check } from "lucide-react"
import { vehicles } from "@/lib/vehicle-data"

export default function VehicleSpecsPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number.parseInt(params.id as string)

  const vehicle = vehicles.find((v) => v.id === id) as any

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Vehicle not found</p>
      </main>
    )
  }

  const [selectedVariant, setSelectedVariant] = useState(
    vehicle.variants?.[0] || null,
  )
  const [openSection, setOpenSection] = useState<string | null>("keySpecs")

  const variantName = selectedVariant?.name

  const variantSpecs =
    variantName && vehicle.variantSpecs
      ? vehicle.variantSpecs[variantName]
      : null

  const variantFeatures: string[] =
    variantName && vehicle.variantFeatures
      ? vehicle.variantFeatures[variantName] || []
      : []

  // merge base specs + variant specs (variant overrides)
  const specSource = {
    ...(vehicle.specifications || {}),
    ...(variantSpecs || {}),
  }

  const keySpecsConfig = [
    { key: "engine", label: "Engine" },
    { key: "fuelType", label: "Fuel Type" },
    { key: "transmission", label: "Transmission" },
    { key: "araiMileage", label: "ARAI Mileage / Range" },
    { key: "power", label: "Max Power" },
    { key: "torque", label: "Max Torque" },
    { key: "bodyType", label: "Body Type" },
    { key: "seating", label: "Seating Capacity" },
    { key: "seatingCapacity", label: "Seating Capacity" },
    { key: "fuelTankCapacity", label: "Fuel Tank Capacity" },
  ]

  const dimensionSpecsConfig = [
    { key: "length", label: "Length" },
    { key: "width", label: "Width" },
    { key: "height", label: "Height" },
    { key: "wheelbase", label: "Wheelbase" },
    { key: "groundClearance", label: "Ground Clearance" },
    { key: "bootSpace", label: "Boot Space" },
    { key: "kerbWeight", label: "Kerb Weight" },
  ]

  const performanceSpecsConfig = [
    { key: "acceleration", label: "0–100 km/h" },
    { key: "topSpeed", label: "Top Speed" },
  ]

  const chassisSpecsConfig = [
    { key: "frontSuspension", label: "Front Suspension" },
    { key: "rearSuspension", label: "Rear Suspension" },
    { key: "steeringType", label: "Steering Type" },
    { key: "frontBrake", label: "Front Brake" },
    { key: "rearBrake", label: "Rear Brake" },
    { key: "brakeType", label: "Brake Type" },
    { key: "tyreSize", label: "Tyre Size" },
    { key: "tyreFront", label: "Front Tyre" },
    { key: "tyreRear", label: "Rear Tyre" },
    { key: "wheelSize", label: "Wheel Size" },
  ]

  const safetyFeatures: string[] =
    (variantSpecs?.safetyFeatures as string[]) ||
    (specSource.safetyFeatures as string[]) ||
    []

  const comfortFeatures: string[] =
    (variantSpecs?.comfortFeatures as string[]) ||
    (specSource.comfortFeatures as string[]) ||
    []

  const infotainmentFeatures: string[] =
    (variantSpecs?.infotainmentFeatures as string[]) ||
    (specSource.infotainmentFeatures as string[]) ||
    []

  const exteriorFeatures: string[] =
    (variantSpecs?.exteriorFeatures as string[]) ||
    (specSource.exteriorFeatures as string[]) ||
    []

  const interiorFeatures: string[] =
    (variantSpecs?.interiorFeatures as string[]) ||
    (specSource.interiorFeatures as string[]) ||
    []

  const genericFeatures: string[] = [
    ...(vehicle.features || []),
    ...variantFeatures,
  ]

  const renderSpecRows = (config: { key: string; label: string }[]) =>
    config
      .filter((item) => specSource[item.key])
      .map((item) => (
        <div
          key={item.key}
          className="flex items-start justify-between py-1 border-b border-white/5 last:border-b-0 text-xs sm:text-sm"
        >
          <span className="text-muted-foreground mr-4">{item.label}</span>
          <span className="font-semibold text-right">
            {String(specSource[item.key])}
          </span>
        </div>
      ))

  const renderFeatureList = (items: string[]) =>
    items.length > 0 && (
      <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm">
        {items.map((feat, idx) => (
          <li key={idx}>{feat}</li>
        ))}
      </ul>
    )

  const toggleSection = (sectionId: string) => {
    setOpenSection((prev) => (prev === sectionId ? null : sectionId))
  }

  const SectionHeader: React.FC<{ id: string; title: string }> = ({
    id,
    title,
  }) => {
    const isOpen = openSection === id
    return (
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between gap-2 text-left"
      >
        <h2 className="text-sm sm:text-lg font-semibold">{title}</h2>
        <span className="p-1 rounded-full bg-white/5 border border-white/10">
          {isOpen ? (
            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </span>
      </button>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="glass-sm border-b border-white/10 py-3 mb-4 sm:mb-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center justify-center flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Specs &amp; Features
            </p>
            <h1 className="text-base sm:text-xl font-semibold text-center">
              {vehicle.name}
            </h1>
          </div>
          <div className="w-8" /> {/* spacer */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-8 space-y-4 sm:space-y-6">

        
        {/* Variant chips */}
{vehicle.variants && vehicle.variants.length > 0 && (
  <div className="glass p-4 sm:p-5 rounded-lg border border-white/10">
    <p className="text-xs sm:text-sm font-semibold text-muted-foreground mb-3 sm:mb-4">
      Select Variant
    </p>

    <div className="flex gap-3 overflow-x-auto pb-2 pt-1">
      {vehicle.variants.map((variant: any, idx: number) => {
        const active = variantName === variant.name

        return (
          <button
            key={idx}
            onClick={() => setSelectedVariant(variant)}
            aria-pressed={active}
            className={`group relative flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full border text-xs sm:text-sm font-semibold transition-all duration-150 ${
              active
                ? "bg-gradient-to-r from-secondary to-primary text-white border-transparent ring-2 ring-secondary shadow-md shadow-secondary/40 scale-[1.03]"
                : "bg-white/5 border-white/20 text-muted-foreground hover:border-white/60 hover:bg-white/10"
            }`}
          >
            {/* Selected tick icon */}
            {active && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/90 text-secondary">
                <Check className="w-3 h-3" />
              </span>
            )}
            <span>{variant.name}</span>

            {active && (
              <span className="hidden sm:inline text-[10px] font-normal opacity-90">
                • Selected
              </span>
            )}
          </button>
        )
      })}
    </div>
  </div>
)}



        {/* Key Specifications (Accordion) */}
        {keySpecsConfig.some((c) => specSource[c.key]) && (
          <section className="glass p-3 sm:p-4 rounded-lg border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <SectionHeader id="keySpecs" title="Key Specifications" />
              
            </div>

            {openSection === "keySpecs" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm mt-2">
                {keySpecsConfig
                  .filter((item) => specSource[item.key])
                  .map((item) => (
                    <div
                      key={item.key}
                      className="glass-sm rounded-lg p-2 border border-white/10"
                    >
                      <p className="text-[10px] text-muted-foreground mb-0.5">
                        {item.label}
                      </p>
                      <p className="font-semibold text-xs sm:text-sm">
                        {String(specSource[item.key])}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </section>
        )}

        {/* Dimensions & Performance (Accordion) */}
        {(dimensionSpecsConfig.some((c) => specSource[c.key]) ||
          performanceSpecsConfig.some((c) => specSource[c.key])) && (
          <section className="glass p-3 sm:p-4 rounded-lg border border-white/10 space-y-2">
            <SectionHeader
              id="dimensions"
              title="Dimensions & Performance"
            />

            {openSection === "dimensions" && (
              <div className="mt-2 space-y-3">
                {dimensionSpecsConfig.some((c) => specSource[c.key]) && (
                  <div>{renderSpecRows(dimensionSpecsConfig)}</div>
                )}

                {performanceSpecsConfig.some((c) => specSource[c.key]) && (
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-1">
                      Performance
                    </p>
                    {renderSpecRows(performanceSpecsConfig)}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Chassis, Brakes & Tyres (Accordion) */}
        {chassisSpecsConfig.some((c) => specSource[c.key]) && (
          <section className="glass p-3 sm:p-4 rounded-lg border border-white/10 space-y-2">
            <SectionHeader
              id="chassis"
              title="Chassis, Brakes & Tyres"
            />

            {openSection === "chassis" && (
              <div className="mt-2">{renderSpecRows(chassisSpecsConfig)}</div>
            )}
          </section>
        )}

        {/* Safety (Accordion) */}
        {safetyFeatures.length > 0 && (
          <section className="glass p-3 sm:p-4 rounded-lg border border-white/10 space-y-2">
            <SectionHeader id="safety" title="Safety" />
            {openSection === "safety" && (
              <div className="mt-2">{renderFeatureList(safetyFeatures)}</div>
            )}
          </section>
        )}

        {/* Comfort (Accordion) */}
        {comfortFeatures.length > 0 && (
          <section className="glass p-3 sm:p-4 rounded-lg border border-white/10 space-y-2">
            <SectionHeader
              id="comfort"
              title="Comfort & Convenience"
            />
            {openSection === "comfort" && (
              <div className="mt-2">{renderFeatureList(comfortFeatures)}</div>
            )}
          </section>
        )}

        {/* Infotainment (Accordion) */}
        {infotainmentFeatures.length > 0 && (
          <section className="glass p-3 sm:p-4 rounded-lg border border-white/10 space-y-2">
            <SectionHeader
              id="infotainment"
              title="Infotainment"
            />
            {openSection === "infotainment" && (
              <div className="mt-2">
                {renderFeatureList(infotainmentFeatures)}
              </div>
            )}
          </section>
        )}

        {/* Exterior (Accordion) */}
        {exteriorFeatures.length > 0 && (
          <section className="glass p-3 sm:p-4 rounded-lg border border-white/10 space-y-2">
            <SectionHeader id="exterior" title="Exterior" />
            {openSection === "exterior" && (
              <div className="mt-2">
                {renderFeatureList(exteriorFeatures)}
              </div>
            )}
          </section>
        )}

        {/* Interior (Accordion) */}
        {interiorFeatures.length > 0 && (
          <section className="glass p-3 sm:p-4 rounded-lg border border-white/10 space-y-2">
            <SectionHeader id="interior" title="Interior" />
            {openSection === "interior" && (
              <div className="mt-2">
                {renderFeatureList(interiorFeatures)}
              </div>
            )}
          </section>
        )}

        {/* Other Key Features (Accordion) */}
        {genericFeatures.length > 0 && (
          <section className="glass p-3 sm:p-4 rounded-lg border border-white/10 space-y-2">
            <SectionHeader
              id="otherFeatures"
              title="Other Key Features"
            />
            {openSection === "otherFeatures" && (
              <div className="mt-2">
                {renderFeatureList(genericFeatures)}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}

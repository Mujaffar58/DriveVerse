"use client"


import Image from "next/image"
import Link from "next/link"
import React from "react"
import { ArrowLeft } from "lucide-react"
import { useSearchParams } from "next/navigation"

type Brand = { id: number; name: string; logo: string }

const brandsByCategory: Record<string, Brand[]> = {
  Cars: [
    { id: 1, name: "Maruti", logo: "/logos/marutisuzuki.png" },
    { id: 2, name: "Tata", logo: "/logos/tata.png" },
    { id: 3, name: "Kia", logo: "/logos/kia.png" },
    { id: 4, name: "Hyundai", logo: "/logos/HYUNDAI.png" },
    { id: 5, name: "Honda", logo: "/logos/honda.png" },
    { id: 6, name: "MG", logo: "/logos/mg.png" },
  ],
  Bikes: [
    { id: 1, name: "Honda", logo: "/logos/honda-m.png" },
    { id: 2, name: "Bajaj", logo: "/logos/bajaj.png" },
    { id: 3, name: "Hero", logo: "/logos/hero.png" },
    { id: 4, name: "TVS", logo: "/logos/tvs.jpg" },
  ],
  Scooters: [
    { id: 1, name: "Hero", logo: "/logos/hero.png" },
    { id: 2, name: "Ather", logo: "/logos/ather-latest.jpg" },
  ],
  EVs: [
    { id: 1, name: "Tata", logo: "/logos/tata.png" },
    { id: 2, name: "BYD", logo: "/logos/byd-latest.jpg" },
    { id: 3, name: "Ather", logo: "/logos/ather-latest.jpg" },
  ],
}

const CATEGORY_ALIASES: Record<string, string> = {
  car: "Cars",
  cars: "Cars",
  automobile: "Cars",
  bike: "Bikes",
  bikes: "Bikes",
  motorcycle: "Bikes",
  scooter: "Scooters",
  scooty: "Scooters",
  scooters: "Scooters",
  ev: "EVs",
  evs: "EVs",
  electric: "EVs",
  "electric-vehicle": "EVs",
}

export default function BrandsPage() {
  const searchParams = useSearchParams()
  const raw = (searchParams?.get("category") || "").toString().trim()
  const normalized = raw.toLowerCase()
  const resolved =
    normalized
      ? CATEGORY_ALIASES[normalized] ||
        Object.keys(brandsByCategory).find((k) => k.toLowerCase() === normalized) ||
        null
      : null
  const category = resolved && brandsByCategory[resolved] ? resolved : ""

  
  // GLOBAL page wrapper ensures the dark background and text color
  const pageBgClass = "min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"

  // card styles: use dark card for category view (so they don't appear white)
  const cardBase =
    "relative rounded-xl overflow-hidden shadow-sm transform transition-all duration-300 flex items-center justify-center p-3"
  const darkCard = "bg-slate-800/60 border border-slate-700"
  const lightCard = "bg-white"

  const BrandCard: React.FC<{ brand: Brand; categoryName?: string; dark?: boolean }> = ({
    brand,
    categoryName,
    dark = true,
  }) => (
    <Link
      href={`/brand/${encodeURIComponent(brand.name)}?category=${encodeURIComponent(categoryName || "")}`}
      className={`${cardBase} ${dark ? darkCard : lightCard} group`}
      aria-label={brand.name}
    >
    <div className="flex items-center justify-center w-full h-20 sm:h-32 md:h-36 lg:h-40 p-1">
  <Image
    src={brand.logo}
    alt={brand.name}
    width={160}
    height={160}
    className="w-auto h-full object-contain transition-transform duration-300 group-hover:scale-105"
  />
</div>


      <div className="absolute bottom-0 left-0 w-full">
        <div className="w-full bg-black/10 text-center text-sm font-semibold py-1 backdrop-blur-sm">
          {brand.name}
        </div>
      </div>

      {/* hover overlay + lift */}
      <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/20 to-transparent"></span>

      <style jsx>{`
        /* Additional hover lift on the whole card */
        .group:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 10px 25px rgba(2,6,23,0.6);
          border-color: rgba(96,165,250,0.12);
        }
      `}</style>
    </Link>
  )

  return (
    <div className={pageBgClass}>

       {/* Header: perfect center for the title while keeping Back on left and an empty slot on right */}
      <header className="top-0 left-0 right-0 z-50 glass-sm border-b border-white/10 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
           <ArrowLeft className="w-5 h-5" />
           Back
          </Link>
           <h1
              className="
                text-3xl sm:text-3xl font-extrabold
                bg-gradient-to-r from-[#6d6f74] to-white
                bg-clip-text text-transparent
                select-none
              ">Brands
            </h1>

        </div>
      </header>

    <main className={`${pageBgClass} px-6 py-0`}>
    <div className="max-w-7x1 mx-auto">
           

        {category ? (
          <section>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1">
              {brandsByCategory[category].map((brand) => (
                <BrandCard key={brand.id} brand={brand} categoryName={category} dark={true} />
              ))}
            </div>
          </section>
        ) : (
          <>
            {Object.entries(brandsByCategory).map(([cat, brands]) => (
              <section key={cat} className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">{cat}</h2>
                  <Link href={`/brands?category=${encodeURIComponent(cat)}`} className="text-sm text-primary hover:underline">
                    View more
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {brands.map((brand) => (
                    <BrandCard key={`${cat}-${brand.id}`} brand={brand} categoryName={cat} dark={true} />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </main>
    </div>
  )
}


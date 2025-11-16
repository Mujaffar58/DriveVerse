"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function BannerCarousel() {
  const banners = [
    { id: 1, title: "Latest SUVs", gradient: "from-primary/40 to-secondary/40" },
    { id: 2, title: "Electric Revolution", gradient: "from-secondary/40 to-primary/40" },
    { id: 3, title: "Premium Sedans", gradient: "from-primary/30 via-secondary/30 to-primary/30" },
  ]

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative group">
      <div
        className={`glass h-48 bg-gradient-to-r ${banners[current].gradient} flex items-center justify-center overflow-hidden`}
      >
        <h3 className="text-4xl font-bold text-center text-white">{banners[current].title}</h3>
      </div>

      <button
        onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="flex gap-2 justify-center mt-4">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all ${idx === current ? "bg-primary w-8" : "bg-white/20 w-2"}`}
          />
        ))}
      </div>
    </div>
  )
}

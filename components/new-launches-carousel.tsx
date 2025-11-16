"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function NewLaunchesCarousel() {
  const launches = [
    {
      id: 1,
        image: "/new-launches/1.jpg",
    },
    {
      id: 2,
      image: "/new-launches/2.jpg",
    },
    {
      id: 3,
      image: "/new-launches/3.jpg",
    },
    {
      id: 4,
      image: "/new-launches/4.jpg",
    },
  ]

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % launches.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [launches.length])

  return (
    <div className="relative group mb-8">
      <div className="glass overflow-hidden rounded-lg">
        <div className="relative h-64 md:h-80">
          <img
            src={launches[current].image || "/placeholder.svg"}
            alt={launches[current].title}
            className="w-full h-full object-contain object-center bg black rounded-lg"
          />

          {/* Overlay with text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-3xl md:text-4xl font-bold text-white">{launches[current].title}</h3>
            <p className="text-lg text-white/80 mt-1">{launches[current].subtitle}</p>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + launches.length) % launches.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={() => setCurrent((prev) => (prev + 1) % launches.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dot indicators */}
      <div className="flex gap-2 justify-center mt-4">
        {launches.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all ${idx === current ? "bg-secondary w-8" : "bg-white/20 w-2"}`}
          />
        ))}
      </div>
    </div>
  )
}

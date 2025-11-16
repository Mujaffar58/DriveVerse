"use client"

import { Search, Mic } from "lucide-react"
import { useState } from "react"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [isListening, setIsListening] = useState(false)

  const handleMicClick = () => {
    setIsListening(!isListening)
    // Voice recognition would be implemented here
  }

  return (
    <div className="glass px-4 py-3 flex items-center gap-3">
      <Search className="w-5 h-5 text-secondary flex-shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by model, brand, or features..."
        className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
      />
      <button
        onClick={handleMicClick}
        className={`p-2 rounded-lg transition-colors ${
          isListening ? "bg-primary text-white" : "hover:bg-white/10 text-secondary"
        }`}
      >
        <Mic className="w-5 h-5" />
      </button>
    </div>
  )
}

"use client"

export default function CategoryTabs({ selectedCategory, onCategoryChange }: any) {
  const categories = ["Cars", "Bikes", "Scooters", "EVs"]

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            selectedCategory === category
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/50"
              : "glass hover:bg-white/15"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

"use client"

export default function VehicleCard({ vehicle }: any) {
  return (
    <div className="glass group hover:border-primary/50 overflow-hidden transition-all h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
        <img
          src={vehicle.image || "/placeholder.svg"}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-primary px-3 py-1 rounded-full text-xs font-semibold">
          {vehicle.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-white mb-2">{vehicle.name}</h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <span>{vehicle.year}</span>
          <span>•</span>
          <span>{vehicle.mileage} km/l</span>
        </div>

        <div className="mt-auto">
          <p className="text-2xl font-bold gradient-text mb-3">₹{vehicle.price.toLocaleString("en-IN")}</p>

          <button className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

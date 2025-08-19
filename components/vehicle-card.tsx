"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Check, XCircle, CheckCircle, Clock } from "lucide-react"
import Image from "next/image"

interface VehicleCardProps {
  vehicle: {
    id: string
    name: string
    seats: number
    image: string
    description: string
    features?: string[]
  }
  isSelected: boolean
  onSelect: (id: string) => void
  serviceType: "self-drive" | "chauffeur"
  availability?: {
    isAvailable: boolean
    availableCount: number
    totalCount?: number
    nextAvailableDate?: string
  }
  autoNavigating?: boolean
}

export default function VehicleCard({
  vehicle,
  isSelected,
  onSelect,
  serviceType,
  availability,
  autoNavigating = false,
}: VehicleCardProps) {
  const isAvailable = availability?.isAvailable !== false
  const availableCount = availability?.availableCount || 0
  const totalCount = availability?.totalCount || 0

  return (
    <div
      className={`relative backdrop-blur-sm bg-white/80 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl ${
        !isAvailable
          ? "border-red-200 opacity-75 cursor-not-allowed"
          : isSelected
            ? "border-emerald-500 shadow-lg shadow-emerald-200/50 scale-105"
            : "border-emerald-200/50 hover:border-emerald-300 hover:scale-105"
      }`}
      onClick={() => isAvailable && onSelect(vehicle.id)}
    >
      {/* Availability Status Badge */}
      <div className="absolute -top-2 -left-2 z-10">
        {isAvailable ? (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <XCircle className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Selection Check */}
      {isSelected && isAvailable && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center z-10">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Auto-navigation indicator */}
      {autoNavigating && isSelected && (
        <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl z-5 flex items-center justify-center">
          <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Selected!
          </div>
        </div>
      )}

      {/* Unavailable Overlay */}
      {!isAvailable && (
        <div className="absolute inset-0 bg-gray-900/20 rounded-2xl z-5 flex items-center justify-center">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">Not Available</div>
        </div>
      )}

      <div className="p-6">
        <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50">
          <Image
            src={vehicle.image || "/placeholder.svg"}
            alt={vehicle.name}
            fill
            className={`object-cover transition-transform duration-300 ${
              isAvailable && !autoNavigating ? "hover:scale-110" : "grayscale"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <h3 className={`text-xl font-bold mb-2 ${isAvailable ? "text-emerald-900" : "text-gray-600"}`}>
          {vehicle.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <Users className={`w-5 h-5 ${isAvailable ? "text-emerald-600" : "text-gray-500"}`} />
          <span className={`font-medium ${isAvailable ? "text-emerald-700" : "text-gray-600"}`}>
            Seats {vehicle.seats} people
          </span>
        </div>

        <p className={`text-sm mb-4 ${isAvailable ? "text-emerald-600" : "text-gray-500"}`}>{vehicle.description}</p>

        {/* Availability Info */}
        {availability && (
          <div className="mb-4">
            {isAvailable ? (
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-800 text-sm font-medium">
                  {availableCount} of {totalCount} available
                </span>
              </div>
            ) : (
              <div className="p-2 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-800 text-sm font-medium">Fully Booked</span>
                </div>
                {availability.nextAvailableDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-red-500" />
                    <span className="text-red-600 text-xs">Next available: {availability.nextAvailableDate}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Features */}
        {vehicle.features && (
          <div className="flex flex-wrap gap-1 mb-4">
            {vehicle.features.slice(0, 3).map((feature, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`text-xs ${
                  isAvailable ? "border-emerald-300 text-emerald-700" : "border-gray-300 text-gray-500"
                }`}
              >
                {feature}
              </Badge>
            ))}
            {vehicle.features.length > 3 && (
              <Badge
                variant="outline"
                className={`text-xs ${
                  isAvailable ? "border-emerald-300 text-emerald-700" : "border-gray-300 text-gray-500"
                }`}
              >
                +{vehicle.features.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <Button
          disabled={!isAvailable}
          className={`w-full rounded-xl transition-all ${
            !isAvailable
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : isSelected
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
          }`}
        >
          {!isAvailable ? "Not Available" : isSelected ? "Selected ✓" : "Select Vehicle"}
        </Button>
      </div>
    </div>
  )
}

"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, XCircle, Clock, RefreshCw, Users, Check } from "lucide-react"
import Image from "next/image"

interface VehicleSelectionWithAvailabilityProps {
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  onVehicleSelect: (vehicle: any) => void
  serviceType: "self-drive" | "chauffeur"
}

const vehicles = [
  {
    id: "swift-dzire",
    name: "Swift Dzire",
    seats: 4,
    image: "/images/swift-dzire.png",
    description: "Compact sedan",
    features: ["AC", "GPS"],
  },
  {
    id: "maruti-ertiga",
    name: "Maruti Ertiga",
    seats: 7,
    image: "/images/maruti-ertiga.png",
    description: "Family MPV",
    features: ["AC", "7 Seater"],
  },
  {
    id: "toyota-innova",
    name: "Toyota Innova",
    seats: 7,
    image: "/images/toyota-innova.png",
    description: "Premium MPV",
    features: ["Premium AC", "Comfortable"],
  },
  {
    id: "innova-crysta",
    name: "Innova Crysta",
    seats: 7,
    image: "/images/innova-crysta.png",
    description: "Luxury MPV",
    features: ["Luxury", "Entertainment"],
  },
  {
    id: "tempo-13",
    name: "Tempo Traveller 13",
    seats: 13,
    image: "/images/tempo-13.png",
    description: "Group travel",
    features: ["13 Seater", "AC"],
  },
  {
    id: "tempo-17",
    name: "Tempo Traveller 17",
    seats: 17,
    image: "/images/tempo-17.png",
    description: "Large group",
    features: ["17 Seater", "AC"],
  },
]

export default function VehicleSelectionWithAvailability({
  startDate,
  endDate,
  startTime,
  endTime,
  onVehicleSelect,
  serviceType,
}: VehicleSelectionWithAvailabilityProps) {
  const [availability, setAvailability] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [autoNavigating, setAutoNavigating] = useState(false)

  const checkAvailability = async () => {
    if (!startDate || !endDate) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/check-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          startTime,
          endTime,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setAvailability(data)
      } else {
        setError(data.error || "Failed to check availability")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (startDate && endDate) {
      checkAvailability()
    }
  }, [startDate, endDate, startTime, endTime])

  const handleVehicleSelect = (vehicleId: string) => {
    if (availability) {
      const vehicleAvailability = availability.availability.find((v: any) => v.vehicleId === vehicleId)
      if (vehicleAvailability && !vehicleAvailability.isAvailable) {
        return
      }
    }
    setSelectedVehicle(vehicleId)
    setAutoNavigating(true)
    setTimeout(() => {
      const vehicle = vehicles.find((v) => v.id === vehicleId)
      onVehicleSelect(vehicle)
    }, 1500)
  }

  const calculateVehiclePrice = (vehicleId: string) => {
    const baseRates: { [key: string]: number } = {
      "swift-dzire": 2500,
      "maruti-ertiga": 3000,
      "toyota-innova": 3500,
      "innova-crysta": 4000,
      "tempo-13": 6500,
      "tempo-17": 7500,
      "tempo-21": 8500,
    }
    const baseRate = baseRates[vehicleId] || 3000
    const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
    const serviceMultiplier = serviceType === "chauffeur" ? 1.3 : 1
    const subtotal = baseRate * days * serviceMultiplier
    const taxes = subtotal * 0.18
    return Math.round(subtotal + taxes)
  }

  const getVehicleAvailability = (vehicleId: string) => {
    if (!availability) return { isAvailable: true, availableCount: 0 }
    return (
      availability.availability.find((v: any) => v.vehicleId === vehicleId) || { isAvailable: true, availableCount: 0 }
    )
  }

  if (!startDate || !endDate) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="backdrop-blur-sm bg-blue-50/80 border-blue-200/50 w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Clock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Select Your Dates</h3>
            <p className="text-blue-700">Choose your travel dates to check vehicle availability</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col p-4">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />
          <h3 className="text-lg font-semibold text-emerald-900">Checking Availability...</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="backdrop-blur-sm bg-white/80 border-emerald-200/50">
              <CardContent className="p-4">
                <Skeleton className="w-full h-24 rounded-lg mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-3" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="backdrop-blur-sm bg-red-50/80 border-red-200/50 w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Checking Availability</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button
              onClick={checkAvailability}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const availableVehicles = availability?.availability.filter((v: any) => v.isAvailable).length || 0
  const totalVehicles = availability?.availability.length || 0

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with availability summary */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-4 pt-4 gap-2">
        <div>
          <h3 className="text-lg font-semibold text-emerald-900">Select Your Vehicle</h3>
          <p className="text-emerald-700 text-sm">
            {availability?.searchDates.startDate} to {availability?.searchDates.endDate}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-xl font-bold text-emerald-900">
            {availableVehicles}/{totalVehicles}
          </div>
          <div className="text-sm text-emerald-600">Available</div>
        </div>
      </div>

      {/* Auto-navigation message */}
      {autoNavigating && (
        <div className="flex-shrink-0 mx-4 mb-4">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-emerald-800 font-medium">Vehicle selected! Proceeding to next step...</span>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {vehicles.map((vehicle) => {
            const vehicleAvailability = getVehicleAvailability(vehicle.id)
            const isAvailable = vehicleAvailability?.isAvailable !== false
            const isSelected = selectedVehicle === vehicle.id
            
            return (
              <Card
                key={vehicle.id}
                className={`relative backdrop-blur-sm bg-white/80 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                  !isAvailable
                    ? "border-red-200 opacity-75 cursor-not-allowed"
                    : isSelected
                      ? "border-emerald-500 shadow-lg shadow-emerald-200/50 transform scale-[1.02]"
                      : "border-emerald-200/50 hover:border-emerald-300 hover:transform hover:scale-[1.02]"
                }`}
                onClick={() => isAvailable && handleVehicleSelect(vehicle.id)}
              >
                {/* Status indicators */}
                <div className="absolute -top-2 -left-2 z-10">
                  {isAvailable ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <XCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {isSelected && isAvailable && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center z-10 shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Auto-navigation overlay */}
                {autoNavigating && isSelected && (
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-lg z-5 flex items-center justify-center">
                    <div className="bg-emerald-600 text-white px-3 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Selected!
                    </div>
                  </div>
                )}

                {/* Unavailable overlay */}
                {!isAvailable && (
                  <div className="absolute inset-0 bg-gray-900/30 rounded-lg z-5 flex items-center justify-center">
                    <div className="bg-red-500 text-white px-3 py-2 rounded-lg font-semibold text-sm shadow-lg">
                      Not Available
                    </div>
                  </div>
                )}

                <CardContent className="p-4">
                  {/* Vehicle image */}
                  <div className="relative h-32 sm:h-24 lg:h-32 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50">
                    <Image
                      src={vehicle.image || "/placeholder.svg"}
                      alt={vehicle.name}
                      fill
                      className={`object-cover transition-transform duration-300 ${
                        isAvailable && !autoNavigating ? "hover:scale-110" : "grayscale"
                      }`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Vehicle details */}
                  <h4 className={`font-bold mb-2 text-base ${isAvailable ? "text-emerald-900" : "text-gray-600"}`}>
                    {vehicle.name}
                  </h4>

                  <div className="flex items-center gap-2 mb-3">
                    <Users className={`w-4 h-4 ${isAvailable ? "text-emerald-600" : "text-gray-500"}`} />
                    <span className={`text-sm ${isAvailable ? "text-emerald-700" : "text-gray-600"}`}>
                      {vehicle.seats} seats
                    </span>
                  </div>

                  {/* Availability status */}
                  {availability && (
                    <div className="mb-4">
                      {isAvailable ? (
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-800 text-sm font-medium">
                            {vehicleAvailability.availableCount} available
                          </span>
                        </div>
                      ) : (
                        <div className="p-2 bg-red-50 rounded border border-red-200">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-red-800 text-sm font-medium">Fully Booked</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="mb-4 p-3 bg-emerald-50 rounded-lg text-center">
                    <div className="text-xl font-bold text-emerald-900">
                      ₹{calculateVehiclePrice(vehicle.id).toLocaleString()}
                    </div>
                    <div className="text-sm text-emerald-600">Total estimated</div>
                  </div>

                  {/* Select button */}
                  <Button
                    disabled={!isAvailable}
                    className={`w-full rounded-lg transition-all h-10 ${
                      !isAvailable
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : isSelected
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                    }`}
                  >
                    {!isAvailable ? "Not Available" : isSelected ? "Selected ✓" : "Select Vehicle"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Refresh button */}
        <div className="text-center pb-4">
          <Button
            onClick={checkAvailability}
            variant="outline"
            className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Availability
          </Button>
        </div>
      </div>
    </div>
  )
}
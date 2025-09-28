"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"
import { getAvailableVehiclesForService } from "@/lib/booking-utils"

interface AvailabilityCheckerProps {
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  serviceType: "self-drive" | "chauffeur"
  onAvailabilityChange: (availability: any) => void
}

export default function AvailabilityChecker({
  startDate,
  endDate,
  startTime,
  endTime,
  serviceType,
  onAvailabilityChange,
}: AvailabilityCheckerProps) {
  const [availability, setAvailability] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const vehicles = getAvailableVehiclesForService(serviceType)

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
        onAvailabilityChange(data)
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

  if (!startDate || !endDate) {
    return (
      <Card className="backdrop-blur-sm bg-blue-50/80 border-blue-200/50">
        <CardContent className="p-4 md:p-6 text-center">
          <Clock className="w-10 h-10 md:w-12 md:h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Select Your Dates</h3>
          <p className="text-blue-700">Choose your travel dates to check vehicle availability</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />
            <h3 className="text-lg font-semibold text-emerald-900">Checking Availability...</h3>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 md:w-32 mb-2" />
                  <Skeleton className="h-3 w-16 md:w-24" />
                </div>
                <Skeleton className="w-16 md:w-20 h-6 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="backdrop-blur-sm bg-red-50/80 border-red-200/50">
        <CardContent className="p-4 md:p-6 text-center">
          <XCircle className="w-10 h-10 md:w-12 md:h-12 text-red-500 mx-auto mb-4" />
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
    )
  }

  if (!availability) return null

  const availableVehicles = availability.availability.filter((v: any) => v.isAvailable).length
  const totalVehicles = availability.availability.length

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <div>
            <h3 className="text-lg font-semibold text-emerald-900">Vehicle Availability</h3>
            <p className="text-emerald-700 text-sm">
              {availability.searchDates.startDate} to {availability.searchDates.endDate}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-2xl font-bold text-emerald-900">
              {availableVehicles}/{totalVehicles}
            </div>
            <div className="text-sm text-emerald-600">Available</div>
          </div>
        </div>

        <div className="space-y-4">
          {availability.availability.map((vehicle: any) => (
            <AvailabilityItem key={vehicle.vehicleId} vehicle={vehicle} vehicles={vehicles} />
          ))}
        </div>

        <div className="mt-6 p-3 md:p-4 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-emerald-900 mb-1">Real-time Availability</h4>
              <p className="text-sm text-emerald-700">
                Availability is checked in real-time. Prices and availability may change based on demand.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={checkAvailability}
          variant="outline"
          size="sm"
          className="w-full mt-4 border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Availability
        </Button>
      </CardContent>
    </Card>
  )
}

function AvailabilityItem({ vehicle, vehicles }: { vehicle: any; vehicles: any[] }) {
  const vehicleData = vehicles.find(v => v.id === vehicle.vehicleId)
  const vehicleName = vehicleData?.name || vehicle.vehicleId

  return (
    <div className="flex items-center justify-between p-3 md:p-4 rounded-xl border border-emerald-200/50 bg-emerald-50/30">
      <div className="flex items-center gap-3 md:gap-4">
        <div className={`w-3 h-3 rounded-full ${vehicle.isAvailable ? "bg-green-500" : "bg-red-500"} animate-pulse flex-shrink-0`} />
        <div>
          <h4 className="font-medium text-emerald-900">{vehicleName}</h4>
          <p className="text-sm text-emerald-600">
            {vehicle.availableCount} of {vehicle.totalCount} available
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {vehicle.isAvailable ? (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Available
          </Badge>
        ) : (
          <div className="text-right">
            <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
              <XCircle className="w-3 h-3 mr-1" />
              Unavailable
            </Badge>
            {vehicle.nextAvailableDate && (
              <p className="text-xs text-red-600 mt-1">Next: {vehicle.nextAvailableDate}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
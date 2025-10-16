"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, RefreshCw, Users, Check, Info } from "lucide-react"
import Image from "next/image"
import {
  getAvailableVehiclesForService,
  calculateSelfDrivePrice,
  calculateChauffeurPrice,
  calculateDays,
  calculateHours,
  type VehicleData,
  type PricingBreakdown,
  type ServiceArea
} from "@/lib/booking-utils"

interface VehicleSelectionWithAvailabilityProps {
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  onVehicleSelect: (vehicle: VehicleData) => void
  serviceType: "self-drive" | "chauffeur"
  bookingData?: any
}

export default function VehicleSelectionWithAvailability({
  startDate,
  endDate,
  startTime,
  endTime,
  onVehicleSelect,
  serviceType,
  bookingData,
}: VehicleSelectionWithAvailabilityProps) {
  const [vehicles, setVehicles] = useState<VehicleData[]>([])
  const [vehiclesLoading, setVehiclesLoading] = useState(true)
  const [availability, setAvailability] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [autoNavigating, setAutoNavigating] = useState(false)
  const [priceBreakdowns, setPriceBreakdowns] = useState<{ [key: string]: boolean }>({})
  const [vehiclePrices, setVehiclePrices] = useState<{ [key: string]: PricingBreakdown | null }>({})
  const [seatFilter, setSeatFilter] = useState<number | null>(null)
  const [fuelFilter, setFuelFilter] = useState<string | null>(null)
  const [transmissionFilter, setTransmissionFilter] = useState<string | null>(null)
  const [priceRangeFilter, setPriceRangeFilter] = useState<string | null>(null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Fetch vehicles on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      setVehiclesLoading(true)
      try {
        const fetchedVehicles = await getAvailableVehiclesForService(serviceType)
        setVehicles(fetchedVehicles)
      } catch (error) {
        console.error('Error fetching vehicles:', error)
        setError('Failed to load vehicles')
      } finally {
        setVehiclesLoading(false)
      }
    }

    fetchVehicles()
  }, [serviceType])

  // Calculate prices when vehicles are loaded or booking data changes
  useEffect(() => {
    if (vehicles.length > 0 && startDate && endDate) {
      calculateAllPrices()
    }
  }, [vehicles, bookingData, startDate, endDate, startTime, endTime])

  const calculateAllPrices = async () => {
    const newPrices: { [key: string]: PricingBreakdown | null } = {}

    for (const vehicle of vehicles) {
      try {
        const pricing = await calculateVehiclePrice(vehicle.id)
        newPrices[vehicle.id] = pricing
      } catch (error) {
        console.error(`Error calculating price for ${vehicle.id}:`, error)
        newPrices[vehicle.id] = null
      }
    }

    setVehiclePrices(newPrices)
  }

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
    if (startDate && endDate && vehicles.length > 0) {
      checkAvailability()
    }
  }, [startDate, endDate, startTime, endTime, vehicles])

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
      if (vehicle) {
        onVehicleSelect(vehicle)
      }
    }, 1500)
  }

  const calculateVehiclePrice = async (vehicleId: string): Promise<PricingBreakdown | null> => {
    try {
      const days = calculateDays(startDate, endDate)
      const estimatedKms = bookingData?.estimatedKms || 150
      const serviceArea: ServiceArea = bookingData?.serviceArea || {
        withinMumbai: true,
        naviMumbai: false,
        outsideMumbai: false,
      }

      if (serviceType === "self-drive") {
        return await calculateSelfDrivePrice(vehicleId, days, estimatedKms)
      } else {
        const hours = calculateHours(startTime, endTime)
        return await calculateChauffeurPrice(vehicleId, days, hours, estimatedKms, serviceArea)
      }
    } catch (error) {
      console.error('Price calculation error:', error)
      return null
    }
  }

  const getVehicleAvailability = (vehicleId: string) => {
    if (!availability) return { isAvailable: true, availableCount: 2 }
    const vehicleData = availability.availability.find((v: any) => v.vehicleId === vehicleId)
    if (!vehicleData) return { isAvailable: true, availableCount: 2 }
    // Always show 2 available regardless of actual count
    return { ...vehicleData, availableCount: 2 }
  }

  const togglePriceBreakdown = (vehicleId: string) => {
    setPriceBreakdowns(prev => ({
      ...prev,
      [vehicleId]: !prev[vehicleId]
    }))
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

  if (vehiclesLoading || isLoading) {
    return (
      <div className="h-full flex flex-col p-2 md:p-4">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />
          <h3 className="text-lg font-semibold text-emerald-900">
            {vehiclesLoading ? "Loading vehicles..." : "Checking Availability..."}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 flex-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="backdrop-blur-sm bg-white/80 border-emerald-200/50">
              <CardContent className="p-3 md:p-4">
                <Skeleton className="w-full h-20 md:h-24 rounded-lg mb-3" />
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
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button
              onClick={() => {
                setError(null)
                checkAvailability()
              }}
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

  if (vehicles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="backdrop-blur-sm bg-yellow-50/80 border-yellow-200/50 w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">No Vehicles Available</h3>
            <p className="text-yellow-700">No vehicles found for {serviceType} service.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const availableVehicles = availability?.availability.filter((v: any) => v.isAvailable).length || 0
  const totalVehicles = availability?.availability.length || 0

  // Filter vehicles with multiple criteria
  const filteredVehicles = vehicles.filter(v => {
    if (seatFilter && v.seats !== seatFilter) return false
    if (fuelFilter && (v as any).fuelType?.toLowerCase() !== fuelFilter.toLowerCase()) return false
    if (transmissionFilter && (v as any).transmission?.toLowerCase() !== transmissionFilter.toLowerCase()) return false
    if (priceRangeFilter) {
      const pricing = vehiclePrices[v.id]
      if (pricing) {
        const price = pricing.total
        if (priceRangeFilter === 'low' && price > 10000) return false
        if (priceRangeFilter === 'medium' && (price <= 10000 || price > 15000)) return false
        if (priceRangeFilter === 'high' && price <= 15000) return false
      }
    }
    return true
  })

  const clearFilters = () => {
    setSeatFilter(null)
    setFuelFilter(null)
    setTransmissionFilter(null)
    setPriceRangeFilter(null)
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Desktop: Left Sidebar Filters */}
      {serviceType === "self-drive" && (
        <div className="hidden md:block w-64 flex-shrink-0 border-r border-emerald-200 bg-emerald-50/30 overflow-y-auto p-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-emerald-900 mb-3 text-base flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="w-full text-xs text-emerald-600 hover:bg-emerald-100 mb-4"
              >
                Clear All
              </Button>
            </div>

            {/* Seats Filter */}
            <div>
              <label className="text-sm font-semibold text-emerald-900 mb-2 block">Seating Capacity</label>
              <div className="space-y-2">
                {[
                  { value: null, label: 'All' },
                  { value: 4, label: '4 Seater' },
                  { value: 5, label: '5 Seater' },
                  { value: 7, label: '7 Seater' },
                ].map((option) => (
                  <Button
                    key={option.label}
                    size="sm"
                    variant={seatFilter === option.value ? "default" : "outline"}
                    onClick={() => setSeatFilter(option.value)}
                    className={`w-full justify-start text-xs ${seatFilter === option.value
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-white"
                      }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Fuel Type Filter */}
            {/* <div>
              <label className="text-sm font-semibold text-emerald-900 mb-2 block">Fuel Type</label>
              <div className="space-y-2">
                {[
                  { value: null, label: 'All' },
                  { value: 'petrol', label: 'Petrol' },
                  { value: 'diesel', label: 'Diesel' },
                  { value: 'electric', label: 'Electric' },
                  { value: 'hybrid', label: 'Hybrid' },
                ].map((option) => (
                  <Button
                    key={option.label}
                    size="sm"
                    variant={fuelFilter === option.value ? "default" : "outline"}
                    onClick={() => setFuelFilter(option.value)}
                    className={`w-full justify-start text-xs ${fuelFilter === option.value
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-white"
                      }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div> */}

            {/* Transmission Filter */}
            {/* <div>
              <label className="text-sm font-semibold text-emerald-900 mb-2 block">Transmission</label>
              <div className="space-y-2">
                {[
                  { value: null, label: 'All' },
                  { value: 'manual', label: 'Manual' },
                  { value: 'automatic', label: 'Automatic' },
                ].map((option) => (
                  <Button
                    key={option.label}
                    size="sm"
                    variant={transmissionFilter === option.value ? "default" : "outline"}
                    onClick={() => setTransmissionFilter(option.value)}
                    className={`w-full justify-start text-xs ${transmissionFilter === option.value
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-white"
                      }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div> */}

            {/* Price Range Filter */}
            <div>
              <label className="text-sm font-semibold text-emerald-900 mb-2 block">Price Range</label>
              <div className="space-y-2">
                {[
                  { value: null, label: 'All' },
                  { value: 'low', label: 'Under ₹10,000' },
                  { value: 'medium', label: '₹10,000 - ₹15,000' },
                  { value: 'high', label: 'Above ₹15,000' },
                ].map((option) => (
                  <Button
                    key={option.label}
                    size="sm"
                    variant={priceRangeFilter === option.value ? "default" : "outline"}
                    onClick={() => setPriceRangeFilter(option.value)}
                    className={`w-full justify-start text-xs ${priceRangeFilter === option.value
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-white"
                      }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with availability summary */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 md:mb-3 px-2 md:px-4 pt-2 md:pt-3 gap-2">
          <div>
            <h3 className="text-base md:text-lg font-semibold text-emerald-900">Select Your Vehicle</h3>
            <p className="text-emerald-700 text-xs md:text-sm">
              {availability?.searchDates?.startDate || startDate} to {availability?.searchDates?.endDate || endDate}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-lg md:text-xl font-bold text-emerald-900">
              {filteredVehicles.length}
            </div>
            <div className="text-xs md:text-sm text-emerald-600">Cars Found</div>
          </div>
        </div>

        {/* Mobile: Filter Dropdown - Only for Self Drive */}
        {serviceType === "self-drive" && (
          <div className="md:hidden flex-shrink-0 px-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-white flex items-center justify-between h-9"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </span>
              <svg className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>

            {showMobileFilters && (
              <div className="mt-2 p-3 bg-white rounded-lg border border-emerald-200 shadow-lg space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-emerald-900 text-sm">Filter Options</span>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-emerald-600 h-7">
                    Clear All
                  </Button>
                </div>

                {/* Seats */}
                <div>
                  <label className="text-xs font-semibold text-emerald-900 mb-1.5 block">Seats</label>
                  <div className="flex gap-2 flex-wrap">
                    {[null, 4, 5, 7].map((seats) => (
                      <Button
                        key={seats || 'all'}
                        size="sm"
                        variant={seatFilter === seats ? "default" : "outline"}
                        onClick={() => setSeatFilter(seats)}
                        className={`h-7 px-3 text-xs ${seatFilter === seats
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          }`}
                      >
                        {seats ? `${seats}` : 'All'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Fuel Type */}
                {/* <div>
                  <label className="text-xs font-semibold text-emerald-900 mb-1.5 block">Fuel</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { value: null, label: 'All' },
                      { value: 'petrol', label: 'Petrol' },
                      { value: 'diesel', label: 'Diesel' },
                    ].map((option) => (
                      <Button
                        key={option.label}
                        size="sm"
                        variant={fuelFilter === option.value ? "default" : "outline"}
                        onClick={() => setFuelFilter(option.value)}
                        className={`h-7 px-3 text-xs ${fuelFilter === option.value
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          }`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div> */}

                {/* Transmission */}
                {/* <div>
                  <label className="text-xs font-semibold text-emerald-900 mb-1.5 block">Transmission</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { value: null, label: 'All' },
                      { value: 'manual', label: 'Manual' },
                      { value: 'automatic', label: 'Auto' },
                    ].map((option) => (
                      <Button
                        key={option.label}
                        size="sm"
                        variant={transmissionFilter === option.value ? "default" : "outline"}
                        onClick={() => setTransmissionFilter(option.value)}
                        className={`h-7 px-3 text-xs ${transmissionFilter === option.value
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          }`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div> */}

                <div>
                  <label className="text-xs font-semibold text-emerald-900 mb-1.5 block">Price</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { value: null, label: 'All' },
                      { value: 'low', label: 'Under ₹10,000' },
                      { value: 'medium', label: '₹10,000 - ₹15,000' },
                      { value: 'high', label: 'Above ₹15,000' },
                    ].map((option) => (
                      <Button
                        key={option.label}
                        size="sm"
                        variant={priceRangeFilter === option.value ? "default" : "outline"}
                        onClick={() => setPriceRangeFilter(option.value)}
                        className={`h-7 px-3 text-xs ${priceRangeFilter === option.value
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          }`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Auto-navigation message */}
        {autoNavigating && (
          <div className="flex-shrink-0 mx-2 md:mx-4 mb-2 md:mb-3">
            <div className="p-2 md:p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-emerald-800 font-medium text-xs md:text-sm">Vehicle selected! Proceeding to next step...</span>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto px-2 md:px-4 pb-4">
          {/* Mobile: Vertical Stack */}
          <div className="md:hidden space-y-2 mb-4">
            {filteredVehicles.map((vehicle) => {
              const vehicleAvailability = getVehicleAvailability(vehicle.id)
              const isAvailable = vehicleAvailability?.isAvailable !== false
              const isSelected = selectedVehicle === vehicle.id
              const pricing = vehiclePrices[vehicle.id]
              const showBreakdown = priceBreakdowns[vehicle.id]

              return (
                <Card
                  key={vehicle.id}
                  className={`relative backdrop-blur-sm bg-white/80 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${!isAvailable
                    ? "border-red-200 opacity-75 cursor-not-allowed"
                    : isSelected
                      ? "border-emerald-500 shadow-lg shadow-emerald-200/50"
                      : "border-emerald-200/50 hover:border-emerald-300"
                    }`}
                  onClick={() => isAvailable && handleVehicleSelect(vehicle.id)}
                >
                  {/* Status indicators */}
                  <div className="absolute -top-2 -left-2 z-10">
                    {isAvailable ? (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <XCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {isSelected && isAvailable && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center z-10 shadow-lg">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Auto-navigation overlay */}
                  {autoNavigating && isSelected && (
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-lg z-5 flex items-center justify-center">
                      <div className="bg-emerald-600 text-white px-2 py-1 rounded-lg font-semibold text-xs flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Selected!
                      </div>
                    </div>
                  )}

                  {/* Unavailable overlay */}
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-gray-900/30 rounded-lg z-5 flex items-center justify-center">
                      <div className="bg-red-500 text-white px-2 py-1 rounded-lg font-semibold text-xs shadow-lg">
                        Not Available
                      </div>
                    </div>
                  )}

                  <CardContent className="p-2 flex gap-2">
                    {/* Left: Vehicle image */}
                    <div className="relative h-24 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50">
                      <Image
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.name}
                        fill
                        className={`object-contain ${isAvailable && !autoNavigating ? "" : "grayscale"}`}
                        sizes="112px"
                      />
                    </div>

                    {/* Right: Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className={`font-bold text-xs mb-0.5 truncate ${isAvailable ? "text-emerald-900" : "text-gray-600"}`}>
                          {vehicle.name}
                        </h4>
                        <div className="flex items-center gap-1 mb-1">
                          <Users className={`w-3 h-3 ${isAvailable ? "text-emerald-600" : "text-gray-500"}`} />
                          <span className={`text-[10px] ${isAvailable ? "text-emerald-700" : "text-gray-600"}`}>
                            {vehicle.seats} seats
                          </span>
                        </div>
                        {vehicle.features.slice(0, 1).map((feature: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className={`text-[9px] px-1 py-0 ${isAvailable
                              ? "border-emerald-300 text-emerald-700"
                              : "border-gray-300 text-gray-500"
                              }`}
                          >
                            {feature}
                          </Badge>
                        ))}

                        {/* Availability status */}
                        {availability && (
                          <div className="mt-1">
                            {isAvailable ? (
                              <div className="flex items-center gap-0.5 px-1 py-0.5 bg-green-50 rounded border border-green-200">
                                <CheckCircle className="w-2.5 h-2.5 text-green-600" />
                                <span className="text-green-800 text-[9px] font-medium">
                                  {vehicleAvailability.availableCount} available
                                </span>
                              </div>
                            ) : (
                              <div className="px-1 py-0.5 bg-red-50 rounded border border-red-200">
                                <div className="flex items-center gap-0.5">
                                  <XCircle className="w-2.5 h-2.5 text-red-600" />
                                  <span className="text-red-800 text-[9px] font-medium">Fully Booked</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Pricing */}
                      {pricing ? (
                        <div className="mt-1">
                          <div className="text-sm font-bold text-emerald-900">
                            ₹{Math.round(pricing.total).toLocaleString()}
                          </div>
                          <Button
                            disabled={!isAvailable}
                            className={`w-full rounded-md mt-1 h-6 text-[10px] ${!isAvailable
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : isSelected
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                              }`}
                          >
                            {!isAvailable ? "Not Available" : isSelected ? "Selected ✓" : "Book Now"}
                          </Button>
                        </div>
                      ) : (
                        <div className="text-[10px] text-gray-500">Calculating...</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Desktop: 2 Column Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-3 mb-4">
            {filteredVehicles.map((vehicle) => {
              const vehicleAvailability = getVehicleAvailability(vehicle.id)
              const isAvailable = vehicleAvailability?.isAvailable !== false
              const isSelected = selectedVehicle === vehicle.id
              const pricing = vehiclePrices[vehicle.id]
              const showBreakdown = priceBreakdowns[vehicle.id]

              return (
                <Card
                  key={vehicle.id}
                  className={`relative backdrop-blur-sm bg-white/80 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${!isAvailable
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

                  <CardContent className="p-3 flex gap-3">
                    {/* Left: Vehicle image - Horizontal layout */}
                    <div className="relative h-24 w-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50">
                      <Image
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.name}
                        fill
                        className={`object-cover transition-transform duration-300 ${isAvailable && !autoNavigating ? "hover:scale-110" : "grayscale"
                          }`}
                        sizes="128px"
                      />
                    </div>

                    {/* Right: Vehicle details - Horizontal layout */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className={`font-bold mb-1 text-sm ${isAvailable ? "text-emerald-900" : "text-gray-600"}`}>
                          {vehicle.name}
                        </h4>

                        <div className="flex items-center gap-1 mb-2">
                          <Users className={`w-3 h-3 ${isAvailable ? "text-emerald-600" : "text-gray-500"}`} />
                          <span className={`text-xs ${isAvailable ? "text-emerald-700" : "text-gray-600"}`}>
                            {vehicle.seats} seats
                          </span>
                        </div>

                        {/* Features - More compact, show only 1 */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {vehicle.features.slice(0, 1).map((feature: string, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className={`text-xs px-1.5 py-0.5 ${isAvailable
                                ? "border-emerald-300 text-emerald-700"
                                : "border-gray-300 text-gray-500"
                                }`}
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        {/* Availability status */}
                        {availability && (
                          <div className="mb-2">
                            {isAvailable ? (
                              <div className="flex items-center gap-1 p-1.5 bg-green-50 rounded border border-green-200">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span className="text-green-800 text-xs font-medium">
                                  {vehicleAvailability.availableCount} available
                                </span>
                              </div>
                            ) : (
                              <div className="p-1.5 bg-red-50 rounded border border-red-200">
                                <div className="flex items-center gap-1">
                                  <XCircle className="w-3 h-3 text-red-600" />
                                  <span className="text-red-800 text-xs font-medium">Fully Booked</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom: Pricing and Button */}
                      <div>
                        {pricing ? (
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <div>
                                <div className="text-lg font-bold text-emerald-900">
                                  ₹{Math.round(pricing.total).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-emerald-600">Total est.</div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  togglePriceBreakdown(vehicle.id)
                                }}
                                className="text-emerald-600 hover:bg-emerald-100 h-6 w-6 p-0 rounded-full"
                              >
                                <Info className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* Price Breakdown */}
                            {showBreakdown && (
                              <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-200 mb-2">
                                <div className="text-xs space-y-0.5">
                                  <div className="flex justify-between">
                                    <span>Base Amount:</span>
                                    <span>₹{Math.round(pricing.subtotal).toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>GST (5%):</span>
                                    <span>₹{Math.round(pricing.gst).toLocaleString()}</span>
                                  </div>
                                  {pricing.driverDA && (
                                    <div className="flex justify-between">
                                      <span>Driver DA:</span>
                                      <span>₹{Math.round(pricing.driverDA).toLocaleString()}</span>
                                    </div>
                                  )}
                                  <div className="border-t border-emerald-300 pt-0.5 mt-0.5">
                                    <div className="flex justify-between font-bold">
                                      <span>Total:</span>
                                      <span>₹{Math.round(pricing.total).toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                                {pricing.isOutstation && (
                                  <div className="text-[10px] text-emerald-600 mt-1">
                                    * Outstation rates (300km/day minimum)
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="mb-2 text-xs text-gray-500">Calculating...</div>
                        )}

                        {/* Select button */}
                        <Button
                          disabled={!isAvailable}
                          className={`w-full rounded-lg transition-all h-8 text-xs ${!isAvailable
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : isSelected
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                            }`}
                        >
                          {!isAvailable ? "Not Available" : isSelected ? "Selected ✓" : "Book Now"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Refresh button */}
          <div className="text-center pb-4">
            <Button
              onClick={() => {
                checkAvailability()
                calculateAllPrices()
              }}
              variant="outline"
              className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Availability & Prices
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
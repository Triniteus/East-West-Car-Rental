"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X, MapPin, RotateCcw, Info } from "lucide-react"
import DateTimePicker from "@/components/date-time-picker"
import { calculateSelfDrivePrice, calculateChauffeurPrice, calculateDays, calculateHours } from "@/lib/booking-utils"
import type { ServiceArea } from "@/lib/booking-utils"

interface BookingFormStep1Props {
  onContinue: (data: any) => void
  initialData: any
  serviceType?: "self-drive" | "chauffeur"
}

export default function BookingFormStep1({
  onContinue,
  initialData,
  serviceType = "self-drive",
}: BookingFormStep1Props) {
  const [formData, setFormData] = useState({
    pickupLocation: initialData.pickupLocation || "",
    dropLocation: initialData.dropLocation || "",
    stopovers: initialData.stopovers || [""],
    startDate: initialData.startDate || "",
    startTime: initialData.startTime || "09:00",
    endDate: initialData.endDate || "",
    endTime: initialData.endTime || "18:00",
    numberOfDays: initialData.numberOfDays || 1,
    roundTrip: initialData.roundTrip || false,
    selectedVehicle: initialData.selectedVehicle || null,
    estimatedKms: initialData.estimatedKms || 150,
    serviceArea: initialData.serviceArea || {
      withinMumbai: true,
      naviMumbai: false,
      outsideMumbai: false,
    } as ServiceArea,
  })

  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false)

  const addStopover = () => {
    setFormData((prev) => ({
      ...prev,
      stopovers: [...prev.stopovers, ""],
    }))
  }

  const removeStopover = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stopovers: prev.stopovers.filter((_: any, i: number) => i !== index),
    }))
  }

  const updateStopover = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      stopovers: prev.stopovers.map((stop: any, i: number) => (i === index ? value : stop)),
    }))
  }

  const handleServiceAreaChange = (area: keyof ServiceArea, checked: boolean) => {
    setFormData(prev => {
      const newServiceArea = { ...prev.serviceArea }

      // Reset all areas first
      Object.keys(newServiceArea).forEach(key => {
        newServiceArea[key as keyof ServiceArea] = false
      })

      // Set the selected area
      newServiceArea[area] = checked

      return {
        ...prev,
        serviceArea: newServiceArea
      }
    })
  }

  // Memoize the date time change handler to prevent infinite loops
  const handleDateTimeChange = useCallback((dateTimeData: any) => {
    setFormData((prev) => ({ ...prev, ...dateTimeData }))
  }, [])

  const handleReset = () => {
    const today = new Date().toISOString().split("T")[0]
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    setFormData({
      pickupLocation: "",
      dropLocation: serviceType === "self-drive" ? "" : "",
      stopovers: [""],
      startDate: today,
      startTime: "09:00",
      endDate: tomorrow,
      endTime: "18:00",
      numberOfDays: 1,
      roundTrip: false,
      selectedVehicle: null,
      estimatedKms: 150,
      serviceArea: {
        withinMumbai: true,
        naviMumbai: false,
        outsideMumbai: false,
      },
    })
  }

  const calculateEstimatedPrice = () => {
    if (!formData.selectedVehicle || !formData.numberOfDays) return null

    try {
      if (serviceType === "self-drive") {
        // Ensure calculateSelfDrivePrice returns the value, not a Promise
        return calculateSelfDrivePrice(
          formData.selectedVehicle.id,
          formData.numberOfDays,
          formData.estimatedKms
        )
      } else {
        const hours = calculateHours(formData.startTime, formData.endTime)
        // Ensure calculateChauffeurPrice returns the value, not a Promise
        return calculateChauffeurPrice(
          formData.selectedVehicle.id,
          formData.numberOfDays,
          hours,
          formData.estimatedKms,
          formData.serviceArea
        )
      }
    } catch (error) {
      console.error('Price calculation error:', error)
      return null
    }
  }

  const [pricing, setPricing] = useState<any>(null)

  // Recalculate pricing when relevant formData changes
  useEffect(() => {
    let isMounted = true
    const fetchPricing = async () => {
      const result = await calculateEstimatedPrice()
      if (isMounted) setPricing(result)
    }
    fetchPricing()
    return () => { isMounted = false }
  }, [
    formData.selectedVehicle,
    formData.numberOfDays,
    formData.estimatedKms,
    formData.startTime,
    formData.endTime,
    formData.serviceArea,
    serviceType
  ])

  const handleContinue = () => {
    const requiredFields =
      serviceType === "self-drive"
        ? formData.pickupLocation && formData.startDate && formData.endDate
        : formData.pickupLocation && formData.dropLocation && formData.startDate && formData.endDate

    if (requiredFields) {
      onContinue(formData)
    }
  }

  const isFormValid =
    serviceType === "self-drive"
      ? formData.pickupLocation && formData.startDate && formData.endDate
      : formData.pickupLocation && formData.dropLocation && formData.startDate && formData.endDate

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-emerald-900 text-center">Plan Your Journey</h2>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {/* Service Area Selection */}
        <div className="bg-blue-50/80 rounded-xl p-4 border border-blue-200/50">
          <Label className="text-blue-900 font-medium text-sm mb-3 block">Service Area *</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="withinMumbai"
                checked={formData.serviceArea.withinMumbai}
                onCheckedChange={(checked) => handleServiceAreaChange('withinMumbai', !!checked)}
                className="border-blue-300"
              />
              <Label htmlFor="withinMumbai" className="text-blue-800 font-medium text-sm">
                Within Mumbai
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="naviMumbai"
                checked={formData.serviceArea.naviMumbai}
                onCheckedChange={(checked) => handleServiceAreaChange('naviMumbai', !!checked)}
                className="border-blue-300"
              />
              <Label htmlFor="naviMumbai" className="text-blue-800 font-medium text-sm">
                Navi Mumbai
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="outsideMumbai"
                checked={formData.serviceArea.outsideMumbai}
                onCheckedChange={(checked) => handleServiceAreaChange('outsideMumbai', !!checked)}
                className="border-blue-300"
              />
              <Label htmlFor="outsideMumbai" className="text-blue-800 font-medium text-sm">
                Outside Mumbai (Outstation)
              </Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Location Details */}
          <div className="space-y-3">
            {/* Pickup Location */}
            <div className="space-y-1">
              <Label htmlFor="pickup" className="text-emerald-800 font-medium flex items-center gap-2 text-sm">
                <MapPin className="w-3 h-3" />
                Pickup Location *
              </Label>
              <Input
                id="pickup"
                value={formData.pickupLocation}
                onChange={(e) => setFormData((prev) => ({ ...prev, pickupLocation: e.target.value }))}
                placeholder="Enter pickup location"
                className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9"
                required
              />
            </div>

            {/* Drop Location - Only for Chauffeur Service */}
            {serviceType === "chauffeur" && (
              <div className="space-y-1">
                <Label htmlFor="drop" className="text-emerald-800 font-medium flex items-center gap-2 text-sm">
                  <MapPin className="w-3 h-3" />
                  Drop Location *
                </Label>
                <Input
                  id="drop"
                  value={formData.dropLocation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dropLocation: e.target.value }))}
                  placeholder="Enter drop location"
                  className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9"
                  required
                />
              </div>
            )}

            {/* Estimated KMs */}
            <div className="space-y-1">
              <Label htmlFor="estimatedKms" className="text-emerald-800 font-medium text-sm">
                Estimated Distance (KMs)
              </Label>
              <Input
                id="estimatedKms"
                type="number"
                value={formData.estimatedKms}
                onChange={(e) => setFormData((prev) => ({ ...prev, estimatedKms: parseInt(e.target.value) || 0 }))}
                placeholder="Enter estimated kilometers"
                className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9"
                min="0"
              />
            </div>

            {/* Stopovers - Only for Chauffeur Service */}
            {serviceType === "chauffeur" && (
              <div className="space-y-1">
                <Label className="text-emerald-800 font-medium text-sm">Add Stopover (Optional)</Label>
                {formData.stopovers.slice(0, 2).map((stopover: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={stopover}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateStopover(index, e.target.value)}
                      placeholder="Enter stopover location"
                      className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9"
                    />
                    {formData.stopovers.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeStopover(index)}
                        className="rounded-lg border-red-300 text-red-600 hover:bg-red-50 h-9 w-9 p-0 flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
                {formData.stopovers.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStopover}
                    className="rounded-lg border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent h-8"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Stopover
                  </Button>
                )}
              </div>
            )}

            {/* Round Trip - Only for Chauffeur Service */}
            {serviceType === "chauffeur" && (
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="roundtrip"
                  checked={formData.roundTrip}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, roundTrip: !!checked }))}
                  className="border-emerald-300"
                />
                <Label htmlFor="roundtrip" className="text-emerald-800 font-medium text-sm">
                  Round Trip
                </Label>
              </div>
            )}
          </div>

          {/* Right Column - Date & Time Selection */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 mb-3">Select Dates & Times</h3>
            <DateTimePicker
              startDate={formData.startDate}
              endDate={formData.endDate}
              startTime={formData.startTime}
              endTime={formData.endTime}
              onChange={handleDateTimeChange}
            />
          </div>
        </div>

        {/* Price Preview */}
        {pricing && (
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">
                  ₹{Math.round(pricing.total).toLocaleString()}
                </div>
                <div className="text-emerald-100 text-sm">Estimated Total</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
              >
                <Info className="w-4 h-4" />
              </Button>
            </div>

            {/* Price Breakdown Overlay */}
            {showPriceBreakdown && (
              <div className="mt-3 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>₹{Math.round(pricing.subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (12%):</span>
                    <span>₹{Math.round(pricing.gst).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/30 pt-1 mt-1">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>₹{Math.round(pricing.total).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                {pricing.isOutstation}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex-shrink-0 flex gap-3 pt-4 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="flex-1 rounded-lg border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent h-9"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!isFormValid}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-9"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
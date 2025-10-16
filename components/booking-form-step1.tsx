"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X, MapPin, RotateCcw, Info } from "lucide-react"
import DateTimePicker from "@/components/date-time-picker"
import { DateRangePicker } from "@/components/date-range-picker"
import { calculateSelfDrivePrice, calculateChauffeurPrice, calculateDays, calculateHours } from "@/lib/booking-utils"
import type { ServiceArea } from "@/lib/booking-utils"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    // Self-drive address fields
    addressLine1: initialData.addressLine1 || "",
    addressLine2: initialData.addressLine2 || "",
    state: initialData.state || "",
    city: initialData.city || "",
    areaCode: initialData.areaCode || "",
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
  const [pickupOption, setPickupOption] = useState<"hub" | "custom">("custom")
  const [dropOption, setDropOption] = useState<"hub" | "custom">("custom")

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])


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

  // Handle date range change for self-drive
  const handleDateRangeChange = useCallback((startDate: string, endDate: string) => {
    const days = calculateDays(startDate, endDate)
    setFormData((prev) => ({
      ...prev,
      startDate,
      endDate,
      numberOfDays: days
    }))
  }, [])

  // Handle round trip toggle
  const handleRoundTripChange = (checked: boolean) => {
    setFormData((prev) => {
      if (checked && serviceType === "chauffeur") {
        // For round trip chauffeur: set drop as pickup and clear stopovers
        return {
          ...prev,
          roundTrip: true,
          dropLocation: prev.pickupLocation,
          stopovers: [""]
        }
      }
      return {
        ...prev,
        roundTrip: checked
      }
    })
  }

  const handleReset = () => {
    setFormData({
      addressLine1: "",
      addressLine2: "",
      state: "",
      city: "",
      areaCode: "",
      pickupLocation: "",
      dropLocation: serviceType === "self-drive" ? "" : "",
      stopovers: [""],
      startDate: "",
      startTime: "09:00",
      endDate: "",
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
    setPickupOption("custom")
    setDropOption("custom")
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
    // Combine address fields for self-drive
    if (serviceType === "self-drive") {
      if (!formData.addressLine1.trim()) {
        toast({
          title: "Missing Information",
          description: "Please fill in Address Line 1",
          variant: "destructive"
        })
        return
      }
      if (!formData.state.trim()) {
        toast({
          title: "Missing Information",
          description: "Please fill in State",
          variant: "destructive"
        })
        return
      }
      if (!formData.city.trim()) {
        toast({
          title: "Missing Information",
          description: "Please fill in City",
          variant: "destructive"
        })
        return
      }
      if (!formData.areaCode.trim()) {
        toast({
          title: "Missing Information",
          description: "Please fill in Area Code",
          variant: "destructive"
        })
        return
      }

      // Combine all address fields into pickupLocation
      const fullAddress = [
        formData.addressLine1,
        formData.addressLine2,
        formData.city,
        formData.state,
        formData.areaCode
      ].filter(Boolean).join(", ")

      formData.pickupLocation = fullAddress
    } else {
      // Chauffeur service validation
      if (!formData.pickupLocation.trim()) {
        toast({
          title: "Missing Information",
          description: "Please fill in Pickup Location",
          variant: "destructive"
        })
        return
      }
      if (!formData.dropLocation.trim()) {
        toast({
          title: "Missing Information",
          description: "Please fill in Drop Location",
          variant: "destructive"
        })
        return
      }
    }

    // Common validations
    if (!formData.startDate) {
      toast({
        title: "Missing Information",
        description: "Please select a start date",
        variant: "destructive"
      })
      return
    }
    if (!formData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please select an end date",
        variant: "destructive"
      })
      return
    }

    onContinue(formData)
  }

  const isFormValid =
    serviceType === "self-drive"
      ? formData.addressLine1 && formData.state && formData.city && formData.areaCode && formData.startDate && formData.endDate
      : formData.pickupLocation && formData.dropLocation && formData.startDate && formData.endDate

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 mb-3 md:mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-900 text-center">Plan Your Journey</h2>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 pr-1 md:pr-2">
        {/* Service Area Selection */}
        <div className="bg-emerald-50/80 rounded-lg md:rounded-xl p-3 md:p-4 border border-emerald-200/50">
          <Label className="text-emerald-900 font-medium text-xs sm:text-sm mb-2 md:mb-3 block">Service Area *</Label>
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="withinMumbai"
                checked={formData.serviceArea.withinMumbai}
                onCheckedChange={(checked) => handleServiceAreaChange('withinMumbai', !!checked)}
                className="border-blue-300"
              />
              <Label htmlFor="withinMumbai" className="text-emerald-800 font-medium text-xs sm:text-sm cursor-pointer">
                Within Mumbai & Navi Mumbai
              </Label>
            </div>
            {/* <div className="flex items-center space-x-2">
              <Checkbox
                id="naviMumbai"
                checked={formData.serviceArea.naviMumbai}
                onCheckedChange={(checked) => handleServiceAreaChange('naviMumbai', !!checked)}
                className="border-blue-300"
              />
              <Label htmlFor="naviMumbai" className="text-blue-800 font-medium text-sm">
                Navi Mumbai
              </Label>
            </div> */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="outsideMumbai"
                checked={formData.serviceArea.outsideMumbai}
                onCheckedChange={(checked) => handleServiceAreaChange('outsideMumbai', !!checked)}
                className="border-blue-300"
              />
              <Label htmlFor="outsideMumbai" className="text-emerald-800 font-medium text-xs sm:text-sm cursor-pointer">
                Outside Mumbai (Outstation)
              </Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Left Column - Location Details */}
          <div className="space-y-2.5 md:space-y-3">
            {/* Self-Drive Address Fields */}
            {serviceType === "self-drive" ? (
              <div className="space-y-2.5 md:space-y-3">
                <Label className="text-emerald-800 font-medium flex items-center gap-2 text-xs sm:text-sm">
                  <MapPin className="w-3 h-3" />
                  Pickup Address *
                </Label>

                <div className="space-y-2">
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData((prev) => ({ ...prev, addressLine1: e.target.value }))}
                    placeholder="Address Line 1 *"
                    className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9 text-xs sm:text-sm"
                    required
                  />
                  <Input
                    id="addressLine2"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData((prev) => ({ ...prev, addressLine2: e.target.value }))}
                    placeholder="Address Line 2 (Optional)"
                    className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9 text-xs sm:text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                      placeholder="City *"
                      className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9 text-xs sm:text-sm"
                      required
                    />
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                      placeholder="State *"
                      className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9 text-xs sm:text-sm"
                      required
                    />
                  </div>
                  <Input
                    id="areaCode"
                    value={formData.areaCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, areaCode: e.target.value }))}
                    placeholder="Area Code *"
                    className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9 text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>
            ) : (
              // Chauffeur Service Location Fields
              <>
                <div className="space-y-2">
                  <Label htmlFor="pickup" className="text-emerald-800 font-medium flex items-center gap-2 text-xs sm:text-sm">
                    <MapPin className="w-3 h-3" />
                    Pickup Location *
                  </Label>

                  {/* Pickup Option Selector */}
                  <Select
                    value={pickupOption}
                    onValueChange={(value: "hub" | "custom") => {
                      setPickupOption(value)
                      if (value === "hub") {
                        setFormData((prev) => ({
                          ...prev,
                          pickupLocation: "East West Car Rental Hub - Chembur, Mumbai"
                        }))
                      } else {
                        setFormData((prev) => ({ ...prev, pickupLocation: "" }))
                      }
                    }}
                    disabled={formData.roundTrip}
                  >
                    <SelectTrigger className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Select pickup option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hub">Pickup at Hub</SelectItem>
                      <SelectItem value="custom">Custom Location</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Show Hub Address or Custom Input */}
                  {pickupOption === "hub" ? (
                    <div className="p-2.5 md:p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                        📍 East West Car Rental Hub
                      </p>
                      <p className="text-[10px] sm:text-xs text-emerald-600 mt-1">
                        Chembur, Mumbai, Maharashtra
                      </p>
                    </div>
                  ) : (
                    <Input
                      id="pickup"
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pickupLocation: e.target.value }))}
                      placeholder="Enter custom pickup location"
                      className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9 text-xs sm:text-sm"
                      required
                      disabled={formData.roundTrip}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drop" className="text-emerald-800 font-medium flex items-center gap-2 text-xs sm:text-sm">
                    <MapPin className="w-3 h-3" />
                    Drop Location *
                  </Label>

                  {/* Drop Option Selector */}
                  {!formData.roundTrip && (
                    <Select
                      value={dropOption}
                      onValueChange={(value: "hub" | "custom") => {
                        setDropOption(value)
                        if (value === "hub") {
                          setFormData((prev) => ({
                            ...prev,
                            dropLocation: "East West Car Rental Hub - Chembur, Mumbai"
                          }))
                        } else {
                          setFormData((prev) => ({ ...prev, dropLocation: "" }))
                        }
                      }}
                    >
                      <SelectTrigger className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9 text-xs sm:text-sm">
                        <SelectValue placeholder="Select drop option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hub">Drop at Hub</SelectItem>
                        <SelectItem value="custom">Custom Location</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {/* Show Hub Address or Custom Input or Round Trip Message */}
                  {formData.roundTrip ? (
                    <div className="p-2.5 md:p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-[10px] sm:text-xs text-emerald-600">
                        🔄 Round trip: Drop location same as pickup
                      </p>
                    </div>
                  ) : dropOption === "hub" ? (
                    <div className="p-2.5 md:p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                        📍 East West Car Rental Hub
                      </p>
                      <p className="text-[10px] sm:text-xs text-emerald-600 mt-1">
                        Chembur, Mumbai, Maharashtra
                      </p>
                    </div>
                  ) : (
                    <Input
                      id="drop"
                      value={formData.dropLocation}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dropLocation: e.target.value }))}
                      placeholder="Enter custom drop location"
                      className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9 text-xs sm:text-sm"
                      required
                    />
                  )}
                </div>
              </>
            )}

            {/* Estimated KMs */}
            {/* <div className="space-y-1">
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
            </div> */}

            {/* Stopovers - Only for Chauffeur Service and not Round Trip */}
            {serviceType === "chauffeur" && !formData.roundTrip && (
              <div className="space-y-1">
                <Label className="text-emerald-800 font-medium text-xs sm:text-sm">Add Stopover (Optional)</Label>
                {formData.stopovers.slice(0, 2).map((stopover: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={stopover}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateStopover(index, e.target.value)}
                      placeholder="Enter stopover location"
                      className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9 text-xs sm:text-sm"
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
                    className="rounded-lg border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent h-8 text-xs sm:text-sm"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Stopover
                  </Button>
                )}
              </div>
            )}

            {/* Round Trip - Only for Chauffeur Service */}
            {serviceType === "chauffeur" && (
              <div className="flex items-center space-x-2 p-2.5 md:p-3 bg-emerald-50/50 rounded-lg">
                <Checkbox
                  id="roundTrip"
                  checked={formData.roundTrip}
                  onCheckedChange={handleRoundTripChange}
                  className="border-emerald-400"
                />
                <Label htmlFor="roundTrip" className="text-emerald-800 font-medium text-xs sm:text-sm cursor-pointer">
                  Round Trip (Return to pickup location)
                </Label>
              </div>
            )}
          </div>

          {/* Right Column - Date & Time Selection */}
          <div>
            {serviceType === "self-drive" ? (
              // Self-Drive: Date Range Picker (like Skyscanner)
              <div className="space-y-4">
                <DateRangePicker
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  onChange={handleDateRangeChange}
                />

                {/* Time Selection for Self-Drive */}
                <div className="space-y-2.5 md:space-y-3">
                  <div>
                    <Label className="text-emerald-800 font-medium text-xs sm:text-sm mb-2 block">Pickup Time</Label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => {
                        const newStartTime = e.target.value
                        setFormData((prev) => {
                          // If same day and return time is earlier than new pickup time, update return time
                          if (prev.startDate === prev.endDate && prev.endTime <= newStartTime) {
                            const [hour] = newStartTime.split(':')
                            const nextHour = String(parseInt(hour) + 1).padStart(2, '0')
                            return { ...prev, startTime: newStartTime, endTime: `${nextHour}:00` }
                          }
                          return { ...prev, startTime: newStartTime }
                        })
                      }}
                      className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-emerald-800 font-medium text-xs sm:text-sm mb-2 block">Return Time</Label>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => {
                        const newEndTime = e.target.value
                        // If same day, only allow times after pickup time
                        if (formData.startDate === formData.endDate && newEndTime <= formData.startTime) {
                          return // Don't update if trying to select invalid time
                        }
                        setFormData((prev) => ({ ...prev, endTime: newEndTime }))
                      }}
                      min={formData.startDate === formData.endDate ? formData.startTime : undefined}
                      className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9 text-xs sm:text-sm"
                    />
                  </div>
                  {formData.startDate === formData.endDate && (
                    <div className="text-[10px] text-amber-600 bg-amber-50 p-2 rounded">
                      Same-day rental: Return time must be after pickup time
                    </div>
                  )}
                </div>

                {/* Duration Summary for Self-Drive */}
                {formData.startDate && formData.endDate && (
                  <div className="p-2.5 md:p-3 bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-300">
                    <div className="text-xs sm:text-sm font-medium">
                      {formData.numberOfDays} Day{formData.numberOfDays > 1 ? "s" : ""} Rental
                    </div>
                    <div className="text-[10px] sm:text-xs text-emerald-700 mt-1">
                      {formData.startDate.split('-').reverse().join('-')} at {formData.startTime} → {formData.endDate.split('-').reverse().join('-')} at {formData.endTime}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Chauffeur: Full Date Time Picker
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-emerald-900 mb-2 md:mb-3">Select Dates & Times</h3>
                <DateTimePicker
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  startTime={formData.startTime}
                  endTime={formData.endTime}
                  onChange={handleDateTimeChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* Price Preview */}
        {pricing && (
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg md:rounded-xl p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base sm:text-lg md:text-xl font-bold">
                  ₹{Math.round(pricing.total).toLocaleString()}
                </div>
                <div className="text-emerald-100 text-xs sm:text-sm">Estimated Total</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                className="text-white hover:bg-white/20 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full"
              >
                <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </div>

            {/* Price Breakdown Overlay */}
            {showPriceBreakdown && (
              <div className="mt-2.5 md:mt-3 p-2.5 md:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <div className="text-xs sm:text-sm space-y-1">
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
      <div className="flex-shrink-0 flex gap-2 sm:gap-3 pt-3 md:pt-4 mt-3 md:mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="flex-1 rounded-lg border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent h-9 text-xs sm:text-sm"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
        <Button
          onClick={handleContinue}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-9 text-xs sm:text-sm"
        >
          Continue
        </Button>
      </div>
      <Toaster />
    </div>
  )
}
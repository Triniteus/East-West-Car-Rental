"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X, MapPin, RotateCcw } from "lucide-react"
import DateTimePicker from "@/components/date-time-picker"

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
  })

  const addStopover = () => {
    setFormData((prev) => ({
      ...prev,
      stopovers: [...prev.stopovers, ""],
    }))
  }

  const removeStopover = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stopovers: prev.stopovers.filter((_, i) => i !== index),
    }))
  }

  const updateStopover = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      stopovers: prev.stopovers.map((stop, i) => (i === index ? value : stop)),
    }))
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
    })
  }

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
    <div className="max-h-[calc(100vh-200px)] overflow-hidden">
      <h2 className="text-2xl font-bold text-emerald-900 mb-4 text-center">Plan Your Journey</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
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

          {/* Stopovers - Only for Chauffeur Service */}
          {serviceType === "chauffeur" && (
            <div className="space-y-1">
              <Label className="text-emerald-800 font-medium text-sm">Add Stopover (Optional)</Label>
              {formData.stopovers.slice(0, 2).map((stopover, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={stopover}
                    onChange={(e) => updateStopover(index, e.target.value)}
                    placeholder="Enter stopover location"
                    className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9"
                  />
                  {formData.stopovers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeStopover(index)}
                      className="rounded-lg border-red-300 text-red-600 hover:bg-red-50 h-9 w-9 p-0"
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

      {/* Action Buttons */}
      <div className="flex gap-3">
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

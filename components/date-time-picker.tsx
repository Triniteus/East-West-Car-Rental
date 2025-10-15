"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar22 } from "@/components/calendar"
import { calculateDays } from "@/lib/booking-utils"

interface DateTimePickerProps {
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  onChange: (data: {
    startDate: string
    endDate: string
    startTime: string
    endTime: string
    numberOfDays: number
  }) => void
}

export default function DateTimePicker({ startDate, endDate, startTime, endTime, onChange }: DateTimePickerProps) {
  const [selectedStartDate, setSelectedStartDate] = useState<string>()
  const [selectedEndDate, setSelectedEndDate] = useState<string>()
  const [selectedStartTime, setSelectedStartTime] = useState(startTime)
  const [selectedEndTime, setSelectedEndTime] = useState(endTime)

  // Common time options
  const timeOptions = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  ]

  // Memoized onChange callback to prevent infinite loops
  const handleChange = useCallback(
    (newStartDate: string, newEndDate: string, newStartTime: string, newEndTime: string) => {
      if (newStartDate && newEndDate) {
        const days = calculateDays(newStartDate, newEndDate)
        onChange({
          startDate: newStartDate,
          endDate: newEndDate,
          startTime: newStartTime,
          endTime: newEndTime,
          numberOfDays: days,
        })
      }
    },
    [onChange],
  )

  // Update parent component when values change
  useEffect(() => {
    if (selectedStartDate && selectedEndDate && selectedStartTime && selectedEndTime) {
      handleChange(selectedStartDate, selectedEndDate, selectedStartTime, selectedEndTime)
    }
  }, [selectedStartDate, selectedEndDate, selectedStartTime, selectedEndTime, handleChange])

  // Initialize from props
  useEffect(() => {
    if (startDate && endDate) {
      setSelectedStartDate(startDate)
      setSelectedEndDate(endDate)
      setSelectedStartTime(startTime)
      setSelectedEndTime(endTime)
    } else {
      // Set defaults
      const today = new Date().toISOString().split("T")[0]
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      // setSelectedStartDate(today)
      // setSelectedEndDate(tomorrow)
      setSelectedStartTime("09:00")
      setSelectedEndTime("18:00")
    }
  }, []) // Empty dependency array - only run once on mount

  const numberOfDays = calculateDays(selectedStartDate ?? "", selectedEndDate ?? "")

  function calculateEstimatedPrice() {
    // Example: ₹1500 per day, minimum 1 day
    const pricePerDay = 1500
    return numberOfDays * pricePerDay
  }

  function formatTime12Hr(time: string) {
    if (!time) return ""
    const [hourStr, minute] = time.split(":")
    let hour = parseInt(hourStr, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    hour = hour % 12 || 12 // convert "0" → "12"
    return `${hour}:${minute} ${ampm}`
  }

  return (
    <div className="space-y-4">
      {/* Date & Time Selection - Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Start Date & Time */}
        <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50">
          <CardContent className="p-3 md:p-4">
            <div className="mb-3">
              <Calendar22
                title="Pickup"
                value={selectedStartDate}
                onChange={setSelectedStartDate}
              />
            </div>

            <div className="space-y-2">
              {/* Quick time buttons - responsive grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                {timeOptions.slice(0, 6).map((time) => (
                  <Button
                    key={time}
                    type="button"
                    variant={selectedStartTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStartTime(time)}
                    className={`text-xs px-1 py-1 h-6 md:h-7 ${selectedStartTime === time
                      ? "bg-emerald-600 text-white"
                      : "border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                      }`}
                  >
                    {time}
                  </Button>
                ))}
              </div>
              <Input
                type="time"
                value={selectedStartTime}
                onChange={(e) => setSelectedStartTime(e.target.value)}
                className="rounded-lg border-emerald-300 focus:border-emerald-500 text-xs h-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* End Date & Time */}
        <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50">
          <CardContent className="p-3 md:p-4">
            <div className="mb-3">
              <Calendar22
                title="Return"
                value={selectedEndDate}
                onChange={setSelectedEndDate}
                minDate={selectedStartDate ? new Date(selectedStartDate + 'T00:00:00') : new Date()}
              />
            </div>

            <div className="space-y-2">
              {/* Quick time buttons - responsive grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                {timeOptions.slice(6, 12).map((time) => (
                  <Button
                    key={time}
                    type="button"
                    variant={selectedEndTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedEndTime(time)}
                    className={`text-xs px-1 py-1 h-6 md:h-7 ${selectedEndTime === time
                      ? "bg-emerald-600 text-white"
                      : "border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                      }`}
                  >
                    {time}
                  </Button>
                ))}
              </div>
              <Input
                type="time"
                value={selectedEndTime}
                onChange={(e) => setSelectedEndTime(e.target.value)}
                className="rounded-lg border-emerald-300 focus:border-emerald-500 text-xs h-8"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duration & Price Summary - Responsive */}
      {selectedStartDate && selectedEndDate && (
        <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex-1">
              <div className="text-lg font-bold">
                {numberOfDays} Day{numberOfDays > 1 ? "s" : ""}
              </div>
              <div className="text-emerald-100 text-xs">
                {selectedStartDate} {formatTime12Hr(selectedStartTime)} → {selectedEndDate} {formatTime12Hr(selectedEndTime)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">₹{calculateEstimatedPrice().toLocaleString()}</div>
              <div className="text-emerald-100 text-xs">Est. Base Price</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
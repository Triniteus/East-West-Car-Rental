"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"

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
  const [selectedStartDate, setSelectedStartDate] = useState(startDate)
  const [selectedEndDate, setSelectedEndDate] = useState(endDate)
  const [selectedStartTime, setSelectedStartTime] = useState(startTime)
  const [selectedEndTime, setSelectedEndTime] = useState(endTime)

  // Common time options
  const timeOptions = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ]

  // Calculate number of days
  const calculateDays = useCallback((start: string, end: string) => {
    if (!start || !end) return 1
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }, [])

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
    [onChange, calculateDays],
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
    }
  }, []) // Empty dependency array - only run once on mount

  const today = new Date().toISOString().split("T")[0]
  const numberOfDays = calculateDays(selectedStartDate, selectedEndDate)

  return (
    <div className="space-y-4">
      {/* Date & Time Selection - Compact Layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Start Date & Time */}
        <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50">
          <CardContent className="p-4">
            <Label className="text-emerald-800 font-medium flex items-center gap-2 mb-3 text-sm">
              <Calendar className="w-3 h-3" />
              Pickup
            </Label>

            <div className="space-y-3">
              <Input
                type="date"
                value={selectedStartDate}
                onChange={(e) => setSelectedStartDate(e.target.value)}
                className="rounded-lg border-emerald-300 focus:border-emerald-500 text-sm"
                min={today}
                required
              />

              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  {timeOptions.slice(0, 6).map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedStartTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStartTime(time)}
                      className={`text-xs px-1 py-1 h-7 ${
                        selectedStartTime === time
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
            </div>
          </CardContent>
        </Card>

        {/* End Date & Time */}
        <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50">
          <CardContent className="p-4">
            <Label className="text-emerald-800 font-medium flex items-center gap-2 mb-3 text-sm">
              <Calendar className="w-3 h-3" />
              Return
            </Label>

            <div className="space-y-3">
              <Input
                type="date"
                value={selectedEndDate}
                onChange={(e) => setSelectedEndDate(e.target.value)}
                className="rounded-lg border-emerald-300 focus:border-emerald-500 text-sm"
                min={selectedStartDate || today}
                required
              />

              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  {timeOptions.slice(6, 12).map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedEndTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedEndTime(time)}
                      className={`text-xs px-1 py-1 h-7 ${
                        selectedEndTime === time
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duration Summary - Compact */}
      {selectedStartDate && selectedEndDate && (
        <div className="text-center p-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg">
          <div className="text-lg font-bold">
            {numberOfDays} Day{numberOfDays > 1 ? "s" : ""}
          </div>
          <div className="text-emerald-100 text-xs">
            {selectedStartDate} {selectedStartTime} → {selectedEndDate} {selectedEndTime}
          </div>
        </div>
      )}
    </div>
  )
}

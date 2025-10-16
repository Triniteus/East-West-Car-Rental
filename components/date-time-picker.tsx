"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { calculateDays } from "@/lib/booking-utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Clock } from "lucide-react"

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
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>()
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>()
  const [selectedStartTime, setSelectedStartTime] = useState(startTime || "09:00")
  const [selectedEndTime, setSelectedEndTime] = useState(endTime || "18:00")

  const [pickupDateOpen, setPickupDateOpen] = useState(false)
  const [pickupTimeOpen, setPickupTimeOpen] = useState(false)
  const [returnDateOpen, setReturnDateOpen] = useState(false)
  const [returnTimeOpen, setReturnTimeOpen] = useState(false)

  // Common time options
  const timeOptions = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  ]

  // Sync with props when they change (including reset)
  useEffect(() => {
    if (startDate) {
      setSelectedStartDate(new Date(startDate + 'T00:00:00'))
    } else {
      setSelectedStartDate(undefined)
    }
  }, [startDate])

  useEffect(() => {
    if (endDate) {
      setSelectedEndDate(new Date(endDate + 'T00:00:00'))
    } else {
      setSelectedEndDate(undefined)
    }
  }, [endDate])

  useEffect(() => {
    setSelectedStartTime(startTime || "09:00")
  }, [startTime])

  useEffect(() => {
    setSelectedEndTime(endTime || "18:00")
  }, [endTime])

  // Notify parent of changes
  useEffect(() => {
    if (selectedStartDate && selectedEndDate && selectedStartTime && selectedEndTime) {
      const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }

      const startDateStr = formatDate(selectedStartDate)
      const endDateStr = formatDate(selectedEndDate)
      const days = calculateDays(startDateStr, endDateStr)

      onChange({
        startDate: startDateStr,
        endDate: endDateStr,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        numberOfDays: days,
      })
    }
  }, [selectedStartDate, selectedEndDate, selectedStartTime, selectedEndTime, onChange])

  const formatDateDDMMYYYY = (date: Date | undefined) => {
    if (!date) return "Select date"
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const formatTime12Hr = (time: string) => {
    if (!time) return "Select time"
    const [hourStr, minute] = time.split(":")
    let hour = parseInt(hourStr, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    hour = hour % 12 || 12
    return `${hour}:${minute} ${ampm}`
  }

  const handlePickupDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedStartDate(date)
      setPickupDateOpen(false)
      // Auto open time picker
      setTimeout(() => setPickupTimeOpen(true), 100)
    }
  }

  const handlePickupTimeSelect = (time: string) => {
    setSelectedStartTime(time)
    // If same day and return time is earlier than new pickup time, update return time
    if (selectedStartDate && selectedEndDate &&
      selectedStartDate.getTime() === selectedEndDate.getTime() &&
      selectedEndTime <= time) {
      const [hour] = time.split(':')
      const nextHour = String(parseInt(hour) + 1).padStart(2, '0')
      setSelectedEndTime(`${nextHour}:00`)
    }
    setPickupTimeOpen(false)
    // Auto open return date picker
    setTimeout(() => setReturnDateOpen(true), 100)
  }

  const handleReturnDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedEndDate(date)
      setReturnDateOpen(false)
      // Auto open return time picker
      setTimeout(() => setReturnTimeOpen(true), 100)
    }
  }

  const handleReturnTimeSelect = (time: string) => {
    // If same day, ensure return time is after pickup time
    if (selectedStartDate && selectedEndDate &&
      selectedStartDate.getTime() === selectedEndDate.getTime() &&
      time <= selectedStartTime) {
      // Don't allow selecting a time that's before or equal to pickup time on same day
      return
    }
    setSelectedEndTime(time)
    setReturnTimeOpen(false)
  }

  const numberOfDays = selectedStartDate && selectedEndDate
    ? calculateDays(
      `${selectedStartDate.getFullYear()}-${String(selectedStartDate.getMonth() + 1).padStart(2, '0')}-${String(selectedStartDate.getDate()).padStart(2, '0')}`,
      `${selectedEndDate.getFullYear()}-${String(selectedEndDate.getMonth() + 1).padStart(2, '0')}-${String(selectedEndDate.getDate()).padStart(2, '0')}`
    )
    : 0

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Date & Time Selection - Flight Booking Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {/* Pickup Date & Time */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-emerald-900">Pickup</label>
          <div className="flex flex-col xs:flex-row gap-2">
            {/* Pickup Date */}
            <Popover open={pickupDateOpen} onOpenChange={setPickupDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 justify-start text-left font-normal border-emerald-300 hover:border-emerald-500 h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                >
                  <CalendarIcon className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{formatDateDDMMYYYY(selectedStartDate)}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 max-w-[calc(100vw-2rem)]"
                align="start"
                sideOffset={4}
              >
                <Calendar
                  mode="single"
                  selected={selectedStartDate}
                  onSelect={handlePickupDateSelect}
                  disabled={{ before: new Date() }}
                  initialFocus
                  className="rounded-md p-2 sm:p-3"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-3 sm:space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-xs sm:text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-6 w-6 sm:h-7 sm:w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-7 sm:w-8 md:w-9 font-normal text-[0.7rem] sm:text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "text-center text-xs sm:text-sm p-0 relative",
                    day: "h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0 font-normal text-xs sm:text-sm",
                  }}
                />
              </PopoverContent>
            </Popover>

            {/* Pickup Time */}
            <Popover open={pickupTimeOpen} onOpenChange={setPickupTimeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full xs:w-28 sm:w-32 justify-start text-left font-normal border-emerald-300 hover:border-emerald-500 h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                >
                  <Clock className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-emerald-600 flex-shrink-0" />
                  <span>{formatTime12Hr(selectedStartTime)}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[calc(100vw-2rem)] sm:w-64 p-2 sm:p-3"
                align="start"
                sideOffset={4}
              >
                <div className="space-y-2">
                  <div className="text-xs font-medium text-emerald-900 mb-2">Select Time</div>
                  <div className="grid grid-cols-3 gap-1 max-h-48 sm:max-h-64 overflow-y-auto">
                    {timeOptions.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedStartTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePickupTimeSelect(time)}
                        className={`text-[10px] sm:text-xs h-7 md:h-8 ${selectedStartTime === time
                          ? "bg-emerald-600 text-white"
                          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          }`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  <div className="pt-2 border-t">
                    <Input
                      type="time"
                      value={selectedStartTime}
                      onChange={(e) => handlePickupTimeSelect(e.target.value)}
                      className="text-xs h-8 border-emerald-300"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Return Date & Time */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-emerald-900">Return</label>
          <div className="flex flex-col xs:flex-row gap-2">
            {/* Return Date */}
            <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 justify-start text-left font-normal border-emerald-300 hover:border-emerald-500 h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                >
                  <CalendarIcon className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{formatDateDDMMYYYY(selectedEndDate)}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 max-w-[calc(100vw-2rem)]"
                align="start"
                sideOffset={4}
              >
                <Calendar
                  mode="single"
                  selected={selectedEndDate}
                  onSelect={handleReturnDateSelect}
                  disabled={{ before: selectedStartDate || new Date() }}
                  initialFocus
                  className="rounded-md p-2 sm:p-3"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-3 sm:space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-xs sm:text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-6 w-6 sm:h-7 sm:w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-7 sm:w-8 md:w-9 font-normal text-[0.7rem] sm:text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "text-center text-xs sm:text-sm p-0 relative",
                    day: "h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0 font-normal text-xs sm:text-sm",
                  }}
                />
              </PopoverContent>
            </Popover>

            {/* Return Time */}
            <Popover open={returnTimeOpen} onOpenChange={setReturnTimeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full xs:w-28 sm:w-32 justify-start text-left font-normal border-emerald-300 hover:border-emerald-500 h-9 sm:h-10 md:h-11 text-xs sm:text-sm"
                >
                  <Clock className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-emerald-600 flex-shrink-0" />
                  <span>{formatTime12Hr(selectedEndTime)}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[calc(100vw-2rem)] sm:w-64 p-2 sm:p-3"
                align="start"
                sideOffset={4}
              >
                <div className="space-y-2">
                  <div className="text-xs font-medium text-emerald-900 mb-2">Select Time</div>
                  <div className="grid grid-cols-3 gap-1 max-h-48 sm:max-h-64 overflow-y-auto">
                    {timeOptions
                      .filter((time) => {
                        // If same day, only show times after pickup time
                        if (selectedStartDate && selectedEndDate &&
                          selectedStartDate.getTime() === selectedEndDate.getTime()) {
                          return time > selectedStartTime
                        }
                        return true
                      })
                      .map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={selectedEndTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleReturnTimeSelect(time)}
                          className={`text-[10px] sm:text-xs h-7 md:h-8 ${selectedEndTime === time
                            ? "bg-emerald-600 text-white"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            }`}
                        >
                          {time}
                        </Button>
                      ))}
                  </div>
                  <div className="pt-2 border-t">
                    <Input
                      type="time"
                      value={selectedEndTime}
                      onChange={(e) => handleReturnTimeSelect(e.target.value)}
                      min={selectedStartDate && selectedEndDate && selectedStartDate.getTime() === selectedEndDate.getTime() ? selectedStartTime : undefined}
                      className="text-xs h-8 border-emerald-300"
                    />
                  </div>
                  {selectedStartDate && selectedEndDate && selectedStartDate.getTime() === selectedEndDate.getTime() && (
                    <div className="text-[10px] text-amber-600 bg-amber-50 p-2 rounded">
                      Same-day rental: Return time must be after pickup time
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Duration Summary */}
      {selectedStartDate && selectedEndDate && numberOfDays > 0 && (
        <div className="p-3 md:p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex-1">
              <div className="text-base md:text-lg font-bold">
                {numberOfDays} Day{numberOfDays > 1 ? "s" : ""}
              </div>
              <div className="text-emerald-100 text-[10px] sm:text-xs md:text-sm break-words">
                {formatDateDDMMYYYY(selectedStartDate)} {formatTime12Hr(selectedStartTime)} → {formatDateDDMMYYYY(selectedEndDate)} {formatTime12Hr(selectedEndTime)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
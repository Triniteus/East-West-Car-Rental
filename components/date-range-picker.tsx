"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { useIsMobile } from "@/hooks/use-mobile"

interface DateRangePickerProps {
    startDate?: string
    endDate?: string
    onChange: (startDate: string, endDate: string) => void
}

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
    const [open, setOpen] = React.useState(false)
    const isMobile = useIsMobile()
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() => {
        if (startDate && endDate) {
            return {
                from: new Date(startDate + 'T00:00:00'),
                to: new Date(endDate + 'T00:00:00')
            }
        }
        return undefined
    })

    const formatDateDDMMYYYY = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
    }

    const formatDateShort = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        return `${day}/${month}`
    }

    const handleSelect = (range: DateRange | undefined) => {
        setDateRange(range)

        // Only update parent and close when BOTH dates are selected AND they are different
        if (range?.from && range?.to && range.from.getTime() !== range.to.getTime()) {
            const startYear = range.from.getFullYear()
            const startMonth = String(range.from.getMonth() + 1).padStart(2, '0')
            const startDay = String(range.from.getDate()).padStart(2, '0')
            const formattedStart = `${startYear}-${startMonth}-${startDay}`

            const endYear = range.to.getFullYear()
            const endMonth = String(range.to.getMonth() + 1).padStart(2, '0')
            const endDay = String(range.to.getDate()).padStart(2, '0')
            const formattedEnd = `${endYear}-${endMonth}-${endDay}`

            onChange(formattedStart, formattedEnd)

            // Auto close after selecting both dates
            setTimeout(() => setOpen(false), 300)
        } else if (range?.from && range?.to && range.from.getTime() === range.to.getTime()) {
            // If same date selected, keep it as pickup only and wait for return date
            setDateRange({ from: range.from, to: undefined })
        }
    }

    const getDayCount = () => {
        if (!dateRange?.from || !dateRange?.to) return null
        return Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
    }

    return (
        <div className="space-y-2">
            <Label className="text-emerald-800 font-medium text-xs sm:text-sm">Select Rental Period *</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-auto py-2 sm:py-2.5 md:py-3 px-2.5 sm:px-3 md:px-4 rounded-lg md:rounded-xl border-emerald-300 hover:border-emerald-500"
                    >
                        <CalIcon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-emerald-600" />
                        <div className="flex-1 min-w-0">
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-wrap">
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">Pickup</span>
                                            <span className="font-medium text-[11px] sm:text-xs md:text-sm truncate">
                                                {isMobile ? formatDateShort(dateRange.from) : formatDateDDMMYYYY(dateRange.from)}
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground flex-shrink-0 text-[11px] sm:text-xs md:text-sm">→</span>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">Return</span>
                                            <span className="font-medium text-[11px] sm:text-xs md:text-sm truncate">
                                                {isMobile ? formatDateShort(dateRange.to) : formatDateDDMMYYYY(dateRange.to)}
                                            </span>
                                        </div>
                                        {getDayCount() && (
                                            <span className="ml-auto text-[9px] sm:text-[10px] md:text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0 whitespace-nowrap">
                                                {getDayCount()} day{getDayCount()! > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-[11px] sm:text-xs md:text-sm">{formatDateDDMMYYYY(dateRange.from)}</span>
                                )
                            ) : (
                                <span className="text-muted-foreground text-[11px] sm:text-xs md:text-sm">Pick pickup and return dates</span>
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 max-w-[calc(100vw-1rem)] sm:max-w-none"
                    align="center"
                    sideOffset={4}
                    side="bottom"
                >
                    <div className="overflow-x-auto">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={handleSelect}
                            numberOfMonths={isMobile ? 1 : 2}
                            disabled={{ before: new Date() }}
                            className="rounded-md p-2 sm:p-3"
                            classNames={{
                                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-2 md:space-x-4 sm:space-y-0",
                                month: "space-y-3 sm:space-y-4",
                                caption: "flex justify-center pt-1 relative items-center",
                                caption_label: "text-xs sm:text-sm font-medium",
                                nav: "space-x-1 flex items-center",
                                nav_button: "h-6 w-6 sm:h-7 sm:w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex",
                                head_cell: "text-muted-foreground rounded-md w-7 sm:w-8 md:w-9 font-normal text-[0.7rem] sm:text-[0.75rem] md:text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell: "text-center text-xs sm:text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0 font-normal text-xs sm:text-sm aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                                day_selected: "bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white focus:bg-emerald-600 focus:text-white",
                                day_today: "bg-accent text-accent-foreground",
                                day_outside: "text-muted-foreground opacity-50",
                                day_disabled: "text-muted-foreground opacity-50",
                                day_range_middle: "aria-selected:bg-emerald-100 aria-selected:text-emerald-900",
                                day_hidden: "invisible",
                            }}
                        />
                    </div>
                    <div className="p-2 sm:p-2.5 md:p-3 border-t bg-muted/50">
                        <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                            {!dateRange?.from && "Select your pickup date"}
                            {dateRange?.from && !dateRange?.to && "Now select your return date"}
                            {dateRange?.from && dateRange?.to && `${getDayCount()} day${getDayCount()! > 1 ? 's' : ''} selected`}
                        </p>
                    </div>
                </PopoverContent>
            </Popover>
            {dateRange?.from && dateRange?.to && (
                <p className="text-[10px] sm:text-xs text-emerald-600 px-1">
                    {getDayCount()} day{getDayCount()! > 1 ? 's' : ''} rental period
                </p>
            )}
        </div>
    )
}
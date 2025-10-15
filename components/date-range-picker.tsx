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
import { CalendarIcon } from "lucide-react"
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

    const handleSelect = (range: DateRange | undefined) => {
        setDateRange(range)

        // Only update parent and close when BOTH dates are selected
        if (range?.from && range?.to) {
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
        } else if (range?.from && !range?.to) {
            // Keep popover open when only start date is selected
            // Don't close, user needs to pick end date
        }
    }

    return (
        <div className="space-y-2">
            <Label className="text-emerald-800 font-medium text-sm">Select Rental Period *</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-auto py-2 md:py-3 px-3 md:px-4 rounded-xl border-emerald-300 hover:border-emerald-500"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0 text-emerald-600" />
                        <div className="flex-1 min-w-0">
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs text-muted-foreground">Pickup</span>
                                            <span className="font-medium text-xs md:text-sm truncate">{formatDateDDMMYYYY(dateRange.from)}</span>
                                        </div>
                                        <span className="text-muted-foreground flex-shrink-0">→</span>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs text-muted-foreground">Return</span>
                                            <span className="font-medium text-xs md:text-sm truncate">{formatDateDDMMYYYY(dateRange.to)}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-xs md:text-sm">{formatDateDDMMYYYY(dateRange.from)}</span>
                                )
                            ) : (
                                <span className="text-muted-foreground text-xs md:text-sm">Pick pickup and return dates</span>
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 max-w-[calc(100vw-1rem)] sm:max-w-none"
                    align="center"
                    sideOffset={4}
                    side={isMobile ? "bottom" : "bottom"}
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
                            className="rounded-md"
                            classNames={{
                                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                month: "space-y-4",
                                caption: "flex justify-center pt-1 relative items-center",
                                caption_label: "text-sm font-medium",
                                nav: "space-x-1 flex items-center",
                                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex",
                                head_cell: "text-muted-foreground rounded-md w-8 sm:w-9 font-normal text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-8 w-8 sm:h-9 sm:w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                day_today: "bg-accent text-accent-foreground",
                                day_outside: "text-muted-foreground opacity-50",
                                day_disabled: "text-muted-foreground opacity-50",
                                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                day_hidden: "invisible",
                            }}
                        />
                    </div>
                    <div className="p-2 md:p-3 border-t bg-muted/50">
                        <p className="text-xs text-muted-foreground text-center">
                            {!dateRange?.from && "Select your pickup date"}
                            {dateRange?.from && !dateRange?.to && "Now select your return date"}
                            {dateRange?.from && dateRange?.to && "Both dates selected"}
                        </p>
                    </div>
                </PopoverContent>
            </Popover>
            {dateRange?.from && dateRange?.to && (
                <p className="text-xs text-emerald-600">
                    {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1} day(s) selected
                </p>
            )}
        </div>
    )
}

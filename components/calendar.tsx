"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function Calendar22({
    title,
    value,
    onChange,
    minDate,
}: {
    title: string
    value?: string
    onChange: (date: string | undefined) => void
    minDate?: Date
}) {
    const [open, setOpen] = React.useState(false)

    // convert string -> Date for Calendar
    const parsedDate = value ? new Date(value + 'T00:00:00') : undefined

    const formatDateDDMMYYYY = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
    }

    return (
        <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <Label htmlFor="date" className="px-1">{title}</Label>
                <PopoverTrigger asChild>
                    <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                        {value ? formatDateDDMMYYYY(new Date(value + 'T00:00:00')) : "Select date"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={parsedDate}
                        captionLayout="dropdown"
                        // Disable all dates before minDate or today
                        disabled={{ before: minDate || new Date() }}
                        onSelect={(date) => {
                            if (date) {
                                // Store in YYYY-MM-DD format for consistency
                                const year = date.getFullYear()
                                const month = String(date.getMonth() + 1).padStart(2, '0')
                                const day = String(date.getDate()).padStart(2, '0')
                                const formatted = `${year}-${month}-${day}`
                                onChange(formatted)
                            } else {
                                onChange(undefined)
                            }
                            setOpen(false)
                        }}
                    />

                </PopoverContent>
            </Popover>
        </div>
    )
}


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
import { title } from "process"

export function Calendar22({
    title,
    value,
    onChange,
}: {
    title: string
    value?: string
    onChange: (date: string | undefined) => void
}) {
    const [open, setOpen] = React.useState(false)

    // convert string -> Date for Calendar
    const parsedDate = value ? new Date(value) : undefined

    return (
        <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <Label htmlFor="date" className="px-1">{title}</Label>
                <PopoverTrigger asChild>
                    <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                        {value ? new Date(value).toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={parsedDate}
                        captionLayout="dropdown"
                        // Disable all dates before today
                        disabled={{ before: new Date() }}
                        onSelect={(date) => {
                            if (date) {
                                const formatted = date.toISOString().split("T")[0] // convert back to string
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


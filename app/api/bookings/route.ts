// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { saveBooking } from '@/lib/booking-utils'

export async function POST(request: NextRequest) {
    try {
        const bookingData = await request.json()

        const savedBooking = await saveBooking(bookingData)

        if (!savedBooking) {
            return NextResponse.json(
                { error: 'Failed to save booking' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            booking: savedBooking
        })
    } catch (error) {
        console.error('Booking API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
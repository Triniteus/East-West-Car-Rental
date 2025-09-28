// app/api/vehicles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getVehicles } from '@/lib/booking-utils'

export async function GET() {
    try {
        const vehicles = await getVehicles()

        return NextResponse.json({
            success: true,
            vehicles
        })
    } catch (error) {
        console.error('Vehicles API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { saveContactMessage } from '@/lib/booking-utils'

export async function POST(request: NextRequest) {
    try {
        const contactData = await request.json()

        const savedMessage = await saveContactMessage(contactData)

        if (!savedMessage) {
            return NextResponse.json(
                { error: 'Failed to save contact message' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: savedMessage
        })
    } catch (error) {
        console.error('Contact API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { saveBooking, type BookingData } from '@/lib/booking-utils'
import nodemailer from 'nodemailer'

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { bookingData, customer, pricing } = body

        // Generate unique order ID
        const orderId = `ORD${Date.now()}`

        // Prepare booking data for Supabase
        const bookingPayload: Omit<BookingData, 'id'> = {
            order_id: orderId,
            customer_name: customer.name,
            customer_email: customer.email || '',
            customer_phone: `+91${customer.whatsappNumber}`,
            service_type: bookingData.serviceType,
            vehicle_id: bookingData.selectedVehicle?.id || '',
            pickup_location: bookingData.pickupLocation,
            drop_location: bookingData.dropLocation || null,
            stopovers: bookingData.stopovers || [],
            estimated_kms: bookingData.estimatedKms || 150,
            start_date: bookingData.startDate,
            end_date: bookingData.endDate,
            start_time: bookingData.startTime,
            end_time: bookingData.endTime,
            number_of_days: bookingData.numberOfDays,
            round_trip: bookingData.roundTrip || false,
            service_area: bookingData.serviceArea,
            booking_status: 'pending',
            payment_status: 'pending',
            amount_paid: 0,
            total_amount: pricing?.total || 0,
            pricing_breakdown: pricing
        }

        // Save to Supabase
        const savedBooking = await saveBooking(bookingPayload)

        if (!savedBooking) {
            return NextResponse.json(
                { error: 'Failed to save booking' },
                { status: 500 }
            )
        }

        // Send confirmation email to customer
        try {
            await transporter.sendMail({
                from: `"East West Car Rental" <${process.env.SMTP_USER}>`,
                to: customer.email,
                subject: `Booking Confirmation - ${orderId}`,
                html: `
                    <h2>Booking Confirmation</h2>
                    <p>Dear ${customer.name},</p>
                    <p>Thank you for your booking with East West Car Rental!</p>
                    
                    <h3>Booking Details:</h3>
                    <ul>
                        <li><strong>Order ID:</strong> ${orderId}</li>
                        <li><strong>Service:</strong> ${bookingData.serviceType === 'self-drive' ? 'Self Drive' : 'Chauffeur Service'}</li>
                        <li><strong>Vehicle:</strong> ${bookingData.selectedVehicle?.name} (${bookingData.selectedVehicle?.seats} seats)</li>
                        <li><strong>Pickup:</strong> ${bookingData.pickupLocation}</li>
                        ${bookingData.dropLocation ? `<li><strong>Drop:</strong> ${bookingData.dropLocation}</li>` : ''}
                        <li><strong>Start:</strong> ${bookingData.startDate} ${bookingData.startTime}</li>
                        <li><strong>End:</strong> ${bookingData.endDate} ${bookingData.endTime}</li>
                        <li><strong>Duration:</strong> ${bookingData.numberOfDays} day(s)</li>
                        <li><strong>Estimated Total:</strong> ₹${Math.round(pricing?.total || 0).toLocaleString()}</li>
                    </ul>
                    
                    <p>Our team will contact you shortly to confirm your booking.</p>
                    <p><strong>Help Desk:</strong> +91 98672 85333 (Available 24/7)</p>
                    
                    <p>Best regards,<br>East West Car Rental Team</p>
                `
            })
        } catch (emailError) {
            console.error('Email sending failed:', emailError)
            // Don't fail the entire request if email fails
        }

        return NextResponse.json({
            success: true,
            booking: savedBooking,
            orderId
        })
    } catch (error) {
        console.error('Booking API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
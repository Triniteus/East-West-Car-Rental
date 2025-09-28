// app/api/admin/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
    try {
        const adminUser = await verifyAdminToken(request)
        if (!adminUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get total bookings
        const { count: totalBookings } = await supabaseAdmin
            .from('bookings')
            .select('*', { count: 'exact', head: true })

        // Get total revenue
        const { data: revenueData } = await supabaseAdmin
            .from('bookings')
            .select('amount_paid')
            .eq('payment_status', 'paid')

        const totalRevenue = revenueData?.reduce((sum, booking) => sum + booking.amount_paid, 0) || 0

        // Get active vehicles
        const { count: activeVehicles } = await supabaseAdmin
            .from('vehicles')
            .select('*', { count: 'exact', head: true })
            .eq('active', true)

        // Get unread messages
        const { count: unreadMessages } = await supabaseAdmin
            .from('contact_messages')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'unread')

        // Get today's bookings
        const today = new Date().toISOString().split('T')[0]
        const { count: todayBookings } = await supabaseAdmin
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', `${today}T00:00:00`)
            .lt('created_at', `${today}T23:59:59`)

        // Get monthly revenue
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        const { data: monthlyRevenueData } = await supabaseAdmin
            .from('bookings')
            .select('amount_paid')
            .eq('payment_status', 'paid')
            .gte('created_at', startOfMonth.toISOString())

        const monthlyRevenue = monthlyRevenueData?.reduce((sum, booking) => sum + booking.amount_paid, 0) || 0

        return NextResponse.json({
            success: true,
            stats: {
                totalBookings: totalBookings || 0,
                totalRevenue,
                activeVehicles: activeVehicles || 0,
                unreadMessages: unreadMessages || 0,
                todayBookings: todayBookings || 0,
                monthlyRevenue
            }
        })
    } catch (error) {
        console.error('Dashboard stats error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
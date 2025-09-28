// app/api/admin/bookings/route.ts
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

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const status = searchParams.get('status')
        const search = searchParams.get('search')

        let query = supabaseAdmin
            .from('bookings')
            .select(`
        *,
        vehicles(name, seats)
      `, { count: 'exact' })

        if (status && status !== 'all') {
            query = query.eq('booking_status', status)
        }

        if (search) {
            query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,order_id.ilike.%${search}%`)
        }

        const { data: bookings, error, count } = await query
            .order('created_at', { ascending: false })
            .range((page - 1) * limit, page * limit - 1)

        if (error) {
            throw error
        }

        return NextResponse.json({
            success: true,
            bookings,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil((count || 0) / limit)
            }
        })
    } catch (error) {
        console.error('Admin bookings error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
// app/api/admin/vehicles/route.ts
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

        const { data: vehicles, error } = await supabaseAdmin
            .from('vehicles')
            .select('*')
            .order('name')

        if (error) {
            throw error
        }

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
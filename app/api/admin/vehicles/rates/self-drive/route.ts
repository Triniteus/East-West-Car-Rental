import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
    try {
        const adminUser = await verifyAdminToken(request)
        if (!adminUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            id,
            vehicle_id,
            km150,
            km250,
            km600,
            deposit,
            monthly_rate,
            monthly_km_limit,
            monthly_deposit,
            extra_km,
            extra_hr,
            active
        } = body

        let data, error

        if (id && id > 0) {
            // Update existing rate
            ({ data, error } = await supabaseAdmin
                .from('self_drive_rates')
                .update({
                    km150,
                    km250,
                    km600,
                    deposit,
                    monthly_rate,
                    monthly_km_limit,
                    monthly_deposit,
                    extra_km,
                    extra_hr,
                    active: active ?? true,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single())
        } else {
            // Create new rate
            ({ data, error } = await supabaseAdmin
                .from('self_drive_rates')
                .insert({
                    vehicle_id,
                    km150,
                    km250,
                    km600,
                    deposit,
                    monthly_rate,
                    monthly_km_limit,
                    monthly_deposit,
                    extra_km,
                    extra_hr,
                    active: active ?? true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single())
        }

        if (error) {
            throw error
        }

        return NextResponse.json({
            success: true,
            rate: data
        })
    } catch (error) {
        console.error('Self-drive rates error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
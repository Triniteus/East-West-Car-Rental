// app/api/admin/vehicles/rates/route.ts
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

        // Get self-drive rates
        const { data: selfDriveRates, error: selfDriveError } = await supabaseAdmin
            .from('self_drive_rates')
            .select('*')
            .eq('active', true)

        // Get chauffeur rates
        const { data: chauffeurRates, error: chauffeurError } = await supabaseAdmin
            .from('chauffeur_rates')
            .select('*')
            .eq('active', true)

        if (selfDriveError || chauffeurError) {
            throw selfDriveError || chauffeurError
        }

        // Convert arrays to objects keyed by vehicle_id
        const selfDriveRatesMap: { [key: string]: any } = {}
        const chauffeurRatesMap: { [key: string]: any } = {}

        selfDriveRates?.forEach(rate => {
            selfDriveRatesMap[rate.vehicle_id] = rate
        })

        chauffeurRates?.forEach(rate => {
            chauffeurRatesMap[rate.vehicle_id] = rate
        })

        return NextResponse.json({
            success: true,
            selfDriveRates: selfDriveRatesMap,
            chauffeurRates: chauffeurRatesMap
        })
    } catch (error) {
        console.error('Vehicle rates API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
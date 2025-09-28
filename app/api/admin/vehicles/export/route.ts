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

        // Fetch vehicles with rates
        const { data: vehicles, error: vehiclesError } = await supabaseAdmin
            .from('vehicles')
            .select(`
                *,
                self_drive_rates (*),
                chauffeur_rates (*)
            `)
            .order('name')

        if (vehiclesError) {
            throw vehiclesError
        }

        // Create CSV content
        const csvHeaders = [
            'ID', 'Name', 'Category', 'Seats', 'Fuel Type', 'Transmission', 'AC', 'Active',
            'Self Drive 150km', 'Self Drive 250km', 'Self Drive 600km', 'Self Drive Deposit',
            'Chauffeur 8h/80km', 'Chauffeur Extra Km', 'Chauffeur Extra Hr'
        ].join(',')

        const csvRows = vehicles?.map(vehicle => [
            vehicle.id,
            `"${vehicle.name}"`,
            vehicle.category,
            vehicle.seats,
            vehicle.fuel_type,
            vehicle.transmission,
            vehicle.ac ? 'Yes' : 'No',
            vehicle.active ? 'Yes' : 'No',
            vehicle.self_drive_rates?.[0]?.km150 || '',
            vehicle.self_drive_rates?.[0]?.km250 || '',
            vehicle.self_drive_rates?.[0]?.km600 || '',
            vehicle.self_drive_rates?.[0]?.deposit || '',
            vehicle.chauffeur_rates?.[0]?.rate_8hrs_80km || '',
            vehicle.chauffeur_rates?.[0]?.extra_km_rate || '',
            vehicle.chauffeur_rates?.[0]?.extra_hr_rate || ''
        ].join(',')) || []

        const csvContent = [csvHeaders, ...csvRows].join('\n')

        return new Response(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="vehicles-${new Date().toISOString().split('T')[0]}.csv"`
            }
        })
    } catch (error) {
        console.error('Export vehicles error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
// app/api/admin/vehicles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const adminUser = await verifyAdminToken(request)
        if (!adminUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { active } = body

        const { data, error } = await supabaseAdmin
            .from('vehicles')
            .update({ active, updated_at: new Date().toISOString() })
            .eq('id', params.id)
            .select()
            .single()

        if (error) {
            throw error
        }

        return NextResponse.json({
            success: true,
            vehicle: data
        })
    } catch (error) {
        console.error('Vehicle update error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
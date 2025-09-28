// app/api/admin/messages/route.ts
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
        const status = searchParams.get('status')
        const search = searchParams.get('search')

        let query = supabaseAdmin
            .from('contact_messages')
            .select('*')

        if (status && status !== 'all') {
            query = query.eq('status', status)
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`)
        }

        const { data: messages, error } = await query
            .order('created_at', { ascending: false })

        if (error) {
            throw error
        }

        return NextResponse.json({
            success: true,
            messages
        })
    } catch (error) {
        console.error('Admin messages error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
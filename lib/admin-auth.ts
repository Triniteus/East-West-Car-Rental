// lib/admin-auth.ts
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface AdminUser {
    id: number
    email: string
    name: string
    role: 'admin' | 'super_admin'
}

export async function verifyAdminToken(request: NextRequest): Promise<AdminUser | null> {
    try {
        const token = request.cookies.get('admin-token')?.value
        if (!token) return null

        // ⚡ decode without verifying
        const decoded = jwt.decode(token) as any
        if (!decoded?.id) return null

        // Check DB to confirm user still exists & active
        const { data: adminUser } = await supabaseAdmin
            .from('admin_users')
            .select('id, email, name, role')
            .eq('id', decoded.id)
            .eq('active', true)
            .single()

        return adminUser ?? null
    } catch (err) {
        console.error('Token decode error:', err)
        return null
    }
}

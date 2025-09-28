// app/api/admin/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
    try {
        const adminUser = await verifyAdminToken(request)

        if (!adminUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        return NextResponse.json({
            success: true,
            user: adminUser
        })
    } catch (error) {
        console.error('Admin auth check error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
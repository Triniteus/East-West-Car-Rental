// app/api/admin/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Get admin user from database
        const { data: adminUser, error } = await supabaseAdmin
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .eq('active', true)
            .single()

        if (error || !adminUser) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, adminUser.password_hash)

        if (!passwordMatch) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Update last login
        await supabaseAdmin
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', adminUser.id)

        // Create JWT token
        const token = jwt.sign(
            { id: adminUser.id, email: adminUser.email, role: adminUser.role },
            process.env.ADMIN_JWT_SECRET!, // your env var
            { expiresIn: '24h' }
        )

        const response = NextResponse.json({
            success: true,
            user: {
                id: adminUser.id,
                email: adminUser.email,
                name: adminUser.name,
                role: adminUser.role
            }
        })

        // Set httpOnly cookie
        response.cookies.set('admin-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 86400 // 24 hours
        })

        return response
    } catch (error) {
        console.error('Admin login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
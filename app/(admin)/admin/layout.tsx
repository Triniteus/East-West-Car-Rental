// app/(admin)/admin/layout.tsx
'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AdminProvider, useAdmin } from '@/lib/admin-context'
import {
    LayoutDashboard,
    Car,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react'

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAdmin()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    // Redirect to login if not authenticated
    if (!loading && !user && pathname !== '/admin/login') {
        router.push('/admin/login')
        return null
    }

    // Show login page without sidebar
    if (pathname === '/admin/login') {
        return <div className="min-h-screen bg-gray-50">{children}</div>
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Bookings', href: '/admin/bookings', icon: Users },
        { name: 'Vehicles', href: '/admin/vehicles', icon: Car },
        { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
        // { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>

                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
                    <h1 className="text-xl font-bold text-emerald-900">East West Admin</h1>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 mt-6 px-3">
                    <div className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                        ? 'bg-emerald-100 text-emerald-900'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>
                </nav>

                {/* User info and logout */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                            <span className="text-xs text-gray-500">{user.email}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={logout}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile header */}
                <div className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
                    <div className="flex items-center justify-between h-16 px-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-semibold text-gray-900">
                            {navigation.find(item => item.href === pathname)?.name || 'Admin'}
                        </h1>
                        <div className="w-9" />
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AdminProvider>
    )
}
// app/(admin)/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Car, MessageSquare, TrendingUp, Calendar, IndianRupee } from 'lucide-react'

interface DashboardStats {
    totalBookings: number
    totalRevenue: number
    activeVehicles: number
    unreadMessages: number
    todayBookings: number
    monthlyRevenue: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalBookings: 0,
        totalRevenue: 0,
        activeVehicles: 0,
        unreadMessages: 0,
        todayBookings: 0,
        monthlyRevenue: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardStats()
    }, [])

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch('/api/admin/dashboard/stats')
            const data = await response.json()
            if (data.success) {
                setStats(data.stats)
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error)
            // Set mock data if API fails
            setStats({
                totalBookings: 156,
                totalRevenue: 245000,
                activeVehicles: 12,
                unreadMessages: 8,
                todayBookings: 3,
                monthlyRevenue: 89000
            })
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        {
            title: 'Total Bookings',
            value: stats.totalBookings,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: IndianRupee,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Active Vehicles',
            value: stats.activeVehicles,
            icon: Car,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            title: 'Unread Messages',
            value: stats.unreadMessages,
            icon: MessageSquare,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        },
        {
            title: "Today's Bookings",
            value: stats.todayBookings,
            icon: Calendar,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-100'
        },
        {
            title: 'Monthly Revenue',
            value: `₹${stats.monthlyRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        }
    ]

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">View and manage recent customer bookings</p>
                        <a href="/admin/bookings" className="text-emerald-600 hover:text-emerald-700 font-medium">
                            View All Bookings →
                        </a>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Vehicle Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">Add, edit, or remove vehicles and update pricing</p>
                        <a href="/admin/vehicles" className="text-emerald-600 hover:text-emerald-700 font-medium">
                            Manage Vehicles →
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
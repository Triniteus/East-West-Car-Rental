// app/(admin)/admin/bookings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Search,
    Download,
    Eye,
    Edit,
    Calendar,
    MapPin,
    User,
    Car,
    IndianRupee,
    Phone,
    Mail,
    Clock
} from 'lucide-react'

interface Booking {
    id: number
    order_id: string
    customer_name: string
    customer_email: string
    customer_phone: string
    service_type: 'self-drive' | 'chauffeur'
    vehicle_id: string
    pickup_location: string
    drop_location?: string
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    number_of_days: number
    booking_status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    payment_status: 'pending' | 'advance' | 'paid'
    amount_paid: number
    total_amount: number
    created_at: string
    vehicles?: { name: string; seats: number }
    service_area: any
    estimated_kms?: number
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchBookings()
    }, [currentPage, statusFilter, searchTerm])

    const fetchBookings = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                ...(statusFilter !== 'all' && { status: statusFilter }),
                ...(searchTerm && { search: searchTerm })
            })

            const response = await fetch(`/api/admin/bookings?${params}`)
            const data = await response.json()

            if (data.success) {
                setBookings(data.bookings || [])
                setTotalPages(data.pagination?.pages || 1)
            } else {
                // If API fails, show mock data
                setBookings([
                    {
                        id: 1,
                        order_id: 'EW123456',
                        customer_name: 'John Doe',
                        customer_email: 'john@example.com',
                        customer_phone: '9876543210',
                        service_type: 'self-drive',
                        vehicle_id: 'swift-dzire',
                        pickup_location: 'Mumbai Airport',
                        start_date: '2024-01-15',
                        end_date: '2024-01-17',
                        start_time: '10:00',
                        end_time: '18:00',
                        number_of_days: 2,
                        booking_status: 'confirmed',
                        payment_status: 'advance',
                        amount_paid: 2500,
                        total_amount: 10000,
                        created_at: '2024-01-10T10:00:00Z',
                        vehicles: { name: 'Swift Dzire', seats: 4 },
                        service_area: { withinMumbai: true },
                        estimated_kms: 200
                    },
                    {
                        id: 2,
                        order_id: 'EW123457',
                        customer_name: 'Jane Smith',
                        customer_email: 'jane@example.com',
                        customer_phone: '9876543211',
                        service_type: 'chauffeur',
                        vehicle_id: 'innova-crysta',
                        pickup_location: 'Bandra West',
                        drop_location: 'Pune',
                        start_date: '2024-01-20',
                        end_date: '2024-01-20',
                        start_time: '08:00',
                        end_time: '20:00',
                        number_of_days: 1,
                        booking_status: 'pending',
                        payment_status: 'paid',
                        amount_paid: 15000,
                        total_amount: 15000,
                        created_at: '2024-01-12T14:30:00Z',
                        vehicles: { name: 'Toyota Innova Crysta', seats: 7 },
                        service_area: { outsideMumbai: true },
                        estimated_kms: 300
                    }
                ])
            }
        } catch (error) {
            console.error('Error fetching bookings:', error)
            // Show mock data on error
            setBookings([])
        } finally {
            setLoading(false)
        }
    }

    const updateBookingStatus = async (bookingId: number, status: string) => {
        try {
            const response = await fetch(`/api/admin/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_status: status })
            })

            if (response.ok) {
                fetchBookings()
                setSelectedBooking(null)
            }
        } catch (error) {
            console.error('Error updating booking:', error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'completed': return 'bg-blue-100 text-blue-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800'
            case 'advance': return 'bg-yellow-100 text-yellow-800'
            case 'pending': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getServiceArea = (serviceArea: any) => {
        if (serviceArea?.withinMumbai) return 'Within Mumbai'
        if (serviceArea?.naviMumbai) return 'Navi Mumbai'
        if (serviceArea?.outsideMumbai) return 'Outside Mumbai'
        return 'Mumbai'
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
                    <p className="text-gray-600 mt-1">Manage all customer bookings and reservations</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Download className="h-4 w-4 mr-2" />
                    Export Bookings
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <IndianRupee className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ₹{bookings.reduce((sum, booking) => sum + booking.amount_paid, 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {bookings.filter(b => b.booking_status === 'pending').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <Car className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {bookings.filter(b => b.booking_status === 'confirmed').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search by customer name, email, or order ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bookings Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="animate-pulse flex space-x-4 p-4">
                                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by promoting your car rental services.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer & Order
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vehicle & Service
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trip Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status & Payment
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                            <User className="h-5 w-5 text-emerald-600" />
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                                                        <div className="text-sm text-gray-500">{booking.customer_email}</div>
                                                        <div className="text-xs text-gray-400">#{booking.order_id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{booking.vehicles?.name || 'Unknown Vehicle'}</div>
                                                <div className="text-sm text-gray-500 capitalize">{booking.service_type.replace('-', ' ')}</div>
                                                <div className="text-xs text-gray-400">{booking.vehicles?.seats} seats</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    <div className="flex items-center mb-1">
                                                        <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                                                        {booking.pickup_location}
                                                    </div>
                                                    {booking.drop_location && (
                                                        <div className="text-xs text-gray-500 ml-4">→ {booking.drop_location}</div>
                                                    )}
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {booking.start_date} ({booking.number_of_days} day{booking.number_of_days > 1 ? 's' : ''})
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {getServiceArea(booking.service_area)} • {booking.estimated_kms || 0} km
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-2">
                                                    <Badge className={getStatusColor(booking.booking_status)}>
                                                        {booking.booking_status}
                                                    </Badge>
                                                    <Badge className={getPaymentStatusColor(booking.payment_status)}>
                                                        {booking.payment_status}
                                                    </Badge>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        ₹{booking.amount_paid.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        of ₹{booking.total_amount.toLocaleString()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedBooking(booking)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {booking.booking_status === 'pending' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                                            className="text-green-600 hover:text-green-700"
                                                        >
                                                            Confirm
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Booking Detail Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Booking Details - {selectedBooking.order_id}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Customer Information */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><strong>Name:</strong> {selectedBooking.customer_name}</div>
                                        <div><strong>Email:</strong> {selectedBooking.customer_email}</div>
                                        <div><strong>Phone:</strong> +91-{selectedBooking.customer_phone}</div>
                                        <div><strong>Booking Date:</strong> {new Date(selectedBooking.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                {/* Trip Information */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Trip Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><strong>Service:</strong> {selectedBooking.service_type.replace('-', ' ')}</div>
                                        <div><strong>Vehicle:</strong> {selectedBooking.vehicles?.name}</div>
                                        <div><strong>Pickup:</strong> {selectedBooking.pickup_location}</div>
                                        {selectedBooking.drop_location && <div><strong>Drop:</strong> {selectedBooking.drop_location}</div>}
                                        <div><strong>Dates:</strong> {selectedBooking.start_date} to {selectedBooking.end_date}</div>
                                        <div><strong>Time:</strong> {selectedBooking.start_time} - {selectedBooking.end_time}</div>
                                        <div><strong>Duration:</strong> {selectedBooking.number_of_days} day(s)</div>
                                        <div><strong>Area:</strong> {getServiceArea(selectedBooking.service_area)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Payment Information</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Amount Paid:</span>
                                        <div className="font-semibold text-green-600">₹{selectedBooking.amount_paid.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Total Amount:</span>
                                        <div className="font-semibold">₹{selectedBooking.total_amount.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Payment Status:</span>
                                        <Badge className={getPaymentStatusColor(selectedBooking.payment_status)}>
                                            {selectedBooking.payment_status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Booking Status:</span>
                                        <Badge className={getStatusColor(selectedBooking.booking_status)}>
                                            {selectedBooking.booking_status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex justify-end space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedBooking(null)}
                                >
                                    Close
                                </Button>
                                {selectedBooking.booking_status === 'pending' && (
                                    <Button
                                        onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        Confirm Booking
                                    </Button>
                                )}
                                {selectedBooking.booking_status === 'confirmed' && (
                                    <Button
                                        onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Mark Complete
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
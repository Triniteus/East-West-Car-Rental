"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Calendar, Car, MapPin, CreditCard, Phone } from "lucide-react"
import Link from "next/link"

// Mock booking data
const mockBookings = [
  {
    id: "EW1704067200000",
    orderId: "order_1704067200000",
    vehicle: "Toyota Innova",
    serviceType: "self-drive",
    route: "Mumbai → Pune",
    date: "2025-08-01",
    days: 2,
    amount: 11250,
    status: "confirmed",
    paymentStatus: "paid",
    customerName: "John Doe",
    customerPhone: "9876543210",
    createdAt: "2024-12-31T18:30:00Z",
  },
  {
    id: "EW1704153600000",
    orderId: "order_1704153600000",
    vehicle: "Maruti Ertiga",
    serviceType: "chauffeur",
    route: "Delhi → Agra",
    date: "2025-08-05",
    days: 1,
    amount: 4550,
    status: "pending",
    paymentStatus: "advance_paid",
    customerName: "Jane Smith",
    customerPhone: "9876543211",
    createdAt: "2025-01-01T18:30:00Z",
  },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState(mockBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBookings, setFilteredBookings] = useState(mockBookings)

  useEffect(() => {
    const filtered = bookings.filter(
      (booking) =>
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredBookings(filtered)
  }, [searchTerm, bookings])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "advance_paid":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/80 border-b border-emerald-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-emerald-900">
              East West
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-emerald-700 font-medium">Booking Management</span>
              <Link href="/" className="text-emerald-600 hover:text-emerald-800">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">Booking Management</h1>
          <p className="text-emerald-700 text-lg">Manage and track all your car rental bookings</p>
        </div>

        {/* Search and Filters */}
        <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 w-5 h-5" />
                <Input
                  placeholder="Search by booking ID, customer name, or vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-emerald-300 focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-xl bg-transparent"
                >
                  Filter by Date
                </Button>
                <Button
                  variant="outline"
                  className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-xl bg-transparent"
                >
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50">
              <CardContent className="p-12 text-center">
                <Car className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">No bookings found</h3>
                <p className="text-emerald-600 mb-6">
                  {searchTerm ? "Try adjusting your search criteria" : "No bookings available at the moment"}
                </p>
                <Link href="/">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                    Create New Booking
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="backdrop-blur-sm bg-white/80 border-emerald-200/50 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-emerald-900 flex items-center gap-2">
                        <Car className="w-5 h-5" />
                        Booking #{booking.id}
                      </CardTitle>
                      <p className="text-emerald-600 text-sm mt-1">
                        Created on {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                      <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                        {booking.paymentStatus.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Vehicle & Service */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-emerald-900">Vehicle & Service</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-800">{booking.vehicle}</span>
                        </div>
                        <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                          {booking.serviceType === "self-drive" ? "Self Drive" : "Chauffeur Service"}
                        </Badge>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-emerald-900">Trip Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-800 text-sm">{booking.route}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-800 text-sm">
                            {booking.date} ({booking.days} day{booking.days > 1 ? "s" : ""})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-emerald-900">Customer</h4>
                      <div className="space-y-2">
                        <div className="text-emerald-800">{booking.customerName}</div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-800 text-sm">+91-{booking.customerPhone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-emerald-900">Payment</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-800 font-semibold">₹{booking.amount.toLocaleString()}</span>
                        </div>
                        <div className="text-emerald-600 text-sm">Order: {booking.orderId}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-emerald-200">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-lg bg-transparent"
                    >
                      Contact Customer
                    </Button>
                    {booking.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg bg-transparent"
                      >
                        Confirm Booking
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-emerald-900 mb-2">{filteredBookings.length}</div>
              <div className="text-emerald-700">Total Bookings</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 border-green-200/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-900 mb-2">
                {filteredBookings.filter((b) => b.status === "confirmed").length}
              </div>
              <div className="text-green-700">Confirmed</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 border-yellow-200/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-900 mb-2">
                {filteredBookings.filter((b) => b.status === "pending").length}
              </div>
              <div className="text-yellow-700">Pending</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 border-blue-200/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-900 mb-2">
                ₹{filteredBookings.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
              </div>
              <div className="text-blue-700">Total Revenue</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

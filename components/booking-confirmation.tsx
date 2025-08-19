"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Share2, Calendar, MapPin, Car, Phone, Mail, CreditCard, Clock } from "lucide-react"
import Link from "next/link"

interface BookingConfirmationProps {
  paymentData: any
}

export default function BookingConfirmation({ paymentData }: BookingConfirmationProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadReceipt = async () => {
    setIsDownloading(true)
    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsDownloading(false)

    // In a real implementation, you would generate and download a PDF
    alert("Receipt downloaded successfully!")
  }

  const handleShareBooking = () => {
    const shareText = `🚗 East West Booking Confirmed!
Order ID: ${paymentData.orderId}
Vehicle: ${paymentData.bookingData.selectedVehicle?.name}
Date: ${paymentData.bookingData.travelDate}
Amount Paid: ₹${paymentData.amount.toLocaleString()}

Book your ride at eastwestrentals.com`

    if (navigator.share) {
      navigator.share({
        title: "East West Booking Confirmation",
        text: shareText,
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert("Booking details copied to clipboard!")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">Booking Confirmed!</h1>
        <p className="text-xl text-emerald-700 mb-2">Thank you for choosing East West Premium Car Rentals</p>
        <p className="text-emerald-600">Your booking has been confirmed and payment processed successfully.</p>
      </div>

      {/* Booking Details Card */}
      <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl flex items-center justify-between">
            <span>Booking Details</span>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Order #{paymentData.orderId}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Trip Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Trip Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-emerald-900">Route</p>
                      <p className="text-emerald-700">
                        {paymentData.bookingData.pickupLocation} → {paymentData.bookingData.dropLocation}
                      </p>
                      {paymentData.bookingData.stopovers?.filter(Boolean).length > 0 && (
                        <p className="text-sm text-emerald-600">
                          Stopovers: {paymentData.bookingData.stopovers.filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-emerald-900">Travel Period</p>
                      <p className="text-emerald-700">
                        {paymentData.bookingData.startDate} {paymentData.bookingData.startTime} -{" "}
                        {paymentData.bookingData.endDate} {paymentData.bookingData.endTime}
                      </p>
                      <p className="text-sm text-emerald-600">
                        Duration: {paymentData.bookingData.numberOfDays} day
                        {paymentData.bookingData.numberOfDays > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-emerald-900">Duration</p>
                      <p className="text-emerald-700">
                        {paymentData.bookingData.numberOfDays} day{paymentData.bookingData.numberOfDays > 1 ? "s" : ""}
                        {paymentData.bookingData.roundTrip ? " (Round Trip)" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-4">Vehicle Details</h3>
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-emerald-200 rounded-xl flex items-center justify-center">
                      <Car className="w-8 h-8 text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-900">
                        {paymentData.bookingData.selectedVehicle?.name}
                      </h4>
                      <p className="text-emerald-700">Seats {paymentData.bookingData.selectedVehicle?.seats} people</p>
                      <Badge variant="outline" className="border-emerald-300 text-emerald-700 mt-1">
                        {paymentData.bookingData.serviceType === "self-drive" ? "Self Drive" : "Chauffeur Service"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & Contact Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Transaction ID:</span>
                    <span className="font-mono text-emerald-900">{paymentData.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Payment Method:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {paymentData.paymentMethod === "advance" ? "Advance Payment" : "Full Payment"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Amount Paid:</span>
                    <span className="font-semibold text-emerald-900">₹{paymentData.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Payment Status:</span>
                    <Badge className="bg-green-600 text-white">Confirmed</Badge>
                  </div>
                  {paymentData.paymentMethod === "advance" && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-800">
                        <strong>Remaining Amount:</strong> Pay ₹
                        {(paymentData.bookingData.total - paymentData.amount).toLocaleString()} at pickup
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-4">Customer Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 font-semibold text-sm">
                        {paymentData.customerDetails.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-emerald-900">{paymentData.customerDetails.name}</p>
                      <p className="text-sm text-emerald-600">Primary Contact</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">+91-{paymentData.customerDetails.phone}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">{paymentData.customerDetails.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="backdrop-blur-sm bg-blue-50/80 border-blue-200/50">
        <CardHeader>
          <CardTitle className="text-blue-900">Important Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">Before Your Trip</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Carry a valid driving license (for self-drive)</li>
                <li>• Bring original ID proof and address proof</li>
                <li>• Vehicle will be delivered 30 minutes before scheduled time</li>
                <li>• Fuel tank will be full at pickup</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">Contact Support</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>📞 24/7 Helpline: +91-9876543210</p>
                <p>📧 Email: support@eastwestrentals.com</p>
                <p>💬 WhatsApp: +91-9876543210</p>
                <p>🕒 Response Time: Within 15 minutes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleDownloadReceipt}
          disabled={isDownloading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 py-3"
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download Receipt
            </>
          )}
        </Button>

        <Button
          onClick={handleShareBooking}
          variant="outline"
          className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-xl px-8 py-3 bg-transparent"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share Booking
        </Button>

        <Link href="/">
          <Button
            variant="outline"
            className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-xl px-8 py-3 bg-transparent"
          >
            Book Another Trip
          </Button>
        </Link>
      </div>

      {/* Confirmation Email Notice */}
      <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
        <p className="text-green-800">
          📧 A confirmation email with all booking details has been sent to{" "}
          <strong>{paymentData.customerDetails.email}</strong>
        </p>
      </div>
    </div>
  )
}

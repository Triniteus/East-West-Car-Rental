"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Share2, Calendar, MapPin, Car, Phone, Mail, CreditCard, Clock, Info } from "lucide-react"
import Link from "next/link"
import {
  calculateSelfDrivePrice,
  calculateChauffeurPrice,
  calculateHours,
  PricingBreakdown
} from "@/lib/booking-utils"

interface BookingConfirmationProps {
  paymentData: any
}

export default function BookingConfirmation({ paymentData }: BookingConfirmationProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false)
  const [actualPricing, setActualPricing] = useState<PricingBreakdown>({
    total: paymentData.amount,
    subtotal: paymentData.amount * 0.89,
    gst: paymentData.amount * 0.11,
    driverDA: 0,
    isOutstation: false,
    baseRate: 0,
    extraKmRate: 0,
    extraHrRate: 0,
    totalKms: 0,
    totalHours: 0
  })

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
Service: ${paymentData.bookingData.serviceType === "self-drive" ? "Self Drive" : "Chauffeur Service"}
Date: ${paymentData.bookingData.startDate} to ${paymentData.bookingData.endDate}
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

  useEffect(() => {
    const loadActualPricing = async () => {
      try {
        const bookingData = paymentData.bookingData
        let pricing: PricingBreakdown | null = null

        if (bookingData.serviceType === "self-drive") {
          pricing = await calculateSelfDrivePrice(
            bookingData.selectedVehicle?.id,
            bookingData.numberOfDays,
            bookingData.estimatedKms || 150
          )
        } else {
          const hours = calculateHours(bookingData.startTime, bookingData.endTime)
          pricing = await calculateChauffeurPrice(
            bookingData.selectedVehicle?.id,
            bookingData.numberOfDays,
            hours,
            bookingData.estimatedKms || 150,
            bookingData.serviceArea
          )
        }

        if (pricing) {
          setActualPricing(pricing)
        }
      } catch (error) {
        console.error("Error calculating pricing:", error)
        // Keep default fallback pricing
      }
    }

    loadActualPricing()
  }, [paymentData])


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const serviceAreaText = paymentData.bookingData.serviceArea?.withinMumbai ? "Within Mumbai" :
    paymentData.bookingData.serviceArea?.naviMumbai ? "Navi Mumbai" :
      paymentData.bookingData.serviceArea?.outsideMumbai ? "Outside Mumbai" : "Mumbai"

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-4 md:space-y-8 pr-2">
        {/* Success Header */}
        <div className="text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-3 md:mb-4">Booking Confirmed!</h1>
          <p className="text-lg md:text-xl text-emerald-700 mb-2">Thank you for choosing East West Premium Car Rentals</p>
          <p className="text-emerald-600">Your booking has been confirmed and payment processed successfully.</p>
        </div>

        {/* Booking Details Card */}
        <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-t-lg">
            <CardTitle className="text-xl md:text-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>Booking Details</span>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 w-fit">
                Order #{paymentData.orderId}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Trip Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Trip Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-emerald-900">Service Area</p>
                        <p className="text-emerald-700">{serviceAreaText}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-emerald-900">Route</p>
                        <p className="text-emerald-700">
                          {paymentData.bookingData.pickupLocation}
                          {paymentData.bookingData.dropLocation && ` → ${paymentData.bookingData.dropLocation}`}
                        </p>
                        {paymentData.bookingData.stopovers?.filter(Boolean).length > 0 && (
                          <p className="text-sm text-emerald-600">
                            Stopovers: {paymentData.bookingData.stopovers.filter(Boolean).join(", ")}
                          </p>
                        )}
                        <p className="text-sm text-emerald-600">
                          Distance: {paymentData.bookingData.estimatedKms || 150} km
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-emerald-900">Travel Period</p>
                        <p className="text-emerald-700">
                          {paymentData.bookingData.startDate} {paymentData.bookingData.startTime} to{" "}
                          {paymentData.bookingData.endDate} {paymentData.bookingData.endTime}
                        </p>
                        <p className="text-sm text-emerald-600">
                          Duration: {paymentData.bookingData.numberOfDays} day
                          {paymentData.bookingData.numberOfDays > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-emerald-900">Service Type</p>
                        <p className="text-emerald-700">
                          {paymentData.bookingData.serviceType === "self-drive" ? "Self Drive" : "Chauffeur Service"}
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
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Car className="w-6 h-6 md:w-8 md:h-8 text-emerald-700" />
                      </div>
                      <div className="flex-1">
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
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5" />
                    <h3 className="text-lg font-semibold text-emerald-900">Payment Information</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                      className="text-emerald-600 hover:bg-emerald-100 h-6 w-6 p-0 rounded-full ml-auto"
                    >
                      <Info className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Transaction ID:</span>
                      <span className="font-mono text-emerald-900 text-sm">{paymentData.transactionId}</span>
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

                    {/* Price Breakdown */}
                    {showPriceBreakdown && (
                      <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span>Base Amount:</span>
                            <span>₹{Math.round(actualPricing.subtotal).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>GST (12%):</span>
                            <span>₹{Math.round(actualPricing.gst).toLocaleString()}</span>
                          </div>
                          {actualPricing.driverDA}
                          <div className="border-t border-emerald-300 pt-2 mt-2">
                            <div className="flex justify-between font-bold">
                              <span>Total Amount:</span>
                              <span>₹{Math.round(actualPricing.total).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        {actualPricing.isOutstation}
                      </div>
                    )}

                    {paymentData.paymentMethod === "advance" && (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-sm text-amber-800">
                          <strong>Remaining Amount:</strong> Pay ₹
                          {(Math.round(actualPricing.total) - paymentData.amount).toLocaleString()} at pickup
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
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-700 font-semibold text-sm">
                          {paymentData.customerDetails.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-emerald-900">{paymentData.customerDetails.name}</p>
                        <p className="text-sm text-emerald-600">Primary Contact</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-emerald-700">+91-{paymentData.customerDetails.phone}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-emerald-700 break-all">{paymentData.customerDetails.email}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <p>📞 24/7 Helpline: +91-9867285333</p>
                  <p>📧 Email: support@eastwestrentals.com</p>
                  <p>💬 WhatsApp: +91-9867285333</p>
                  <p>🕒 Response Time: Within 15 minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Email Notice */}
        <div className="text-center p-4 md:p-6 bg-green-50 rounded-xl border border-green-200">
          <p className="text-green-800 text-sm md:text-base">
            📧 A confirmation email with all booking details has been sent to{" "}
            <strong className="break-all">{paymentData.customerDetails.email}</strong>
          </p>
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex-shrink-0 pt-4 mt-4">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <Button
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 md:px-8 py-3"
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
            className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-xl px-6 md:px-8 py-3 bg-transparent"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Booking
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="w-full border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-xl px-6 md:px-8 py-3 bg-transparent"
            >
              Book Another Trip
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
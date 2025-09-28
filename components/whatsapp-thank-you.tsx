"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, MessageCircle, ArrowLeft, ExternalLink } from "lucide-react"
import {
  calculateSelfDrivePrice,
  calculateChauffeurPrice,
  calculateHours
} from "@/lib/booking-utils"

interface WhatsAppThankYouProps {
  bookingData: any
  customerData: any
  onBack: () => void
  onHome: () => void
}

export default function WhatsAppThankYou({ bookingData, customerData, onBack, onHome }: WhatsAppThankYouProps) {
  const [countdown, setCountdown] = useState(5)
  const [whatsappOpened, setWhatsappOpened] = useState(false)
  const [autoPopupDone, setAutoPopupDone] = useState(false)

  const generateWhatsAppMessage = () => {
    // Calculate pricing using utility functions
    const calculatePricing = () => {
      try {
        if (bookingData.serviceType === "self-drive") {
          return calculateSelfDrivePrice(
            bookingData.selectedVehicle?.id,
            bookingData.numberOfDays,
            bookingData.estimatedKms || 150
          )
        } else {
          const hours = calculateHours(bookingData.startTime, bookingData.endTime)
          return calculateChauffeurPrice(
            bookingData.selectedVehicle?.id,
            bookingData.numberOfDays,
            hours,
            bookingData.estimatedKms || 150,
            bookingData.serviceArea
          )
        }
      } catch (error) {
        return { total: 0 }
      }
    }

    const pricing = calculatePricing()
    const total = Math.round(pricing.total || 0)

    const serviceAreaText = bookingData.serviceArea?.withinMumbai ? "Within Mumbai" :
      bookingData.serviceArea?.naviMumbai ? "Navi Mumbai" :
        bookingData.serviceArea?.outsideMumbai ? "Outside Mumbai (Outstation)" : "Mumbai"

    const message = `Hello East West Team,

I would like a quote for:
- Service: ${bookingData.serviceType === "self-drive" ? "Self Drive" : "Chauffeur Service"}
- Vehicle: ${bookingData.selectedVehicle?.name}
- Service Area: ${serviceAreaText}
- Pickup: ${bookingData.pickupLocation}
${bookingData.serviceType === "chauffeur" && bookingData.dropLocation ? `- Drop: ${bookingData.dropLocation}` : ""}
${bookingData.stopovers?.filter(Boolean).length > 0 ? `- Stopovers: ${bookingData.stopovers.filter(Boolean).join(", ")}` : ""}
- Distance: ${bookingData.estimatedKms || 150} km
- Start: ${bookingData.startDate} ${bookingData.startTime}  
- End: ${bookingData.endDate} ${bookingData.endTime}
- Duration: ${bookingData.numberOfDays} day${bookingData.numberOfDays > 1 ? "s" : ""}
${bookingData.serviceType === "chauffeur" && bookingData.roundTrip ? "- Round Trip: Yes" : ""}
- Estimated Amount: ₹${total.toLocaleString()}

Customer: ${customerData.name}
WhatsApp: +91-${customerData.whatsappNumber}
${customerData.email ? `Email: ${customerData.email}` : ""}

Please confirm final pricing. Thank you!`

    return encodeURIComponent(message)
  }

  const openWhatsApp = () => {
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/919867285333?text=${message}`
    window.open(whatsappUrl, "_blank")
    setWhatsappOpened(true)
    setAutoPopupDone(true)
  }

  useEffect(() => {
    if (!autoPopupDone) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            openWhatsApp()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [autoPopupDone])

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-4 md:space-y-6 pr-2">
        {/* Success Header */}
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2 md:mb-3">Thank You!</h1>
          <p className="text-lg text-emerald-700 mb-2">Your quote request has been prepared</p>
          <p className="text-emerald-600">We'll redirect you to WhatsApp to send your quote request</p>
        </div>

        {/* Booking Summary Card */}
        <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50 shadow-xl">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-emerald-900 mb-3">Quote Request Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-sm">
              <div>
                <span className="font-medium text-emerald-800">Service:</span>
                <span className="ml-2 text-emerald-700">
                  {bookingData.serviceType === "self-drive" ? "Self Drive" : "Chauffeur Service"}
                </span>
              </div>
              <div>
                <span className="font-medium text-emerald-800">Vehicle:</span>
                <span className="ml-2 text-emerald-700">{bookingData.selectedVehicle?.name}</span>
              </div>
              <div>
                <span className="font-medium text-emerald-800">Area:</span>
                <span className="ml-2 text-emerald-700">
                  {bookingData.serviceArea?.withinMumbai && "Within Mumbai"}
                  {bookingData.serviceArea?.naviMumbai && "Navi Mumbai"}
                  {bookingData.serviceArea?.outsideMumbai && "Outside Mumbai"}
                </span>
              </div>
              <div>
                <span className="font-medium text-emerald-800">Distance:</span>
                <span className="ml-2 text-emerald-700">{bookingData.estimatedKms || 150} km</span>
              </div>
              <div>
                <span className="font-medium text-emerald-800">Customer:</span>
                <span className="ml-2 text-emerald-700">{customerData.name}</span>
              </div>
              <div>
                <span className="font-medium text-emerald-800">Phone:</span>
                <span className="ml-2 text-emerald-700">+91-{customerData.whatsappNumber}</span>
              </div>
              <div>
                <span className="font-medium text-emerald-800">Pickup:</span>
                <span className="ml-2 text-emerald-700">{bookingData.pickupLocation}</span>
              </div>
              <div>
                <span className="font-medium text-emerald-800">Duration:</span>
                <span className="ml-2 text-emerald-700">
                  {bookingData.numberOfDays} day{bookingData.numberOfDays > 1 ? "s" : ""}
                </span>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <span className="font-medium text-emerald-800">Dates:</span>
                <span className="ml-2 text-emerald-700">
                  {bookingData.startDate} {bookingData.startTime} to {bookingData.endDate} {bookingData.endTime}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-redirect countdown - only show if not done yet */}
        {!autoPopupDone && countdown > 0 && (
          <Card className="backdrop-blur-sm bg-green-50/80 border-green-200/50">
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">Opening WhatsApp...</h3>
              <p className="text-green-700 mb-3">
                Redirecting to WhatsApp in <span className="font-bold text-xl text-green-800">{countdown}</span> seconds
              </p>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* WhatsApp opened confirmation */}
        {whatsappOpened && (
          <Card className="backdrop-blur-sm bg-emerald-50/80 border-emerald-200/50">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">WhatsApp Opened!</h3>
              <p className="text-emerald-700">
                Your quote request has been prepared and WhatsApp should now be open. Our team will respond with pricing
                details shortly.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Help text */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 text-sm text-center">
            <strong>Need Help?</strong> Call us at +91 98672 85333 | Available 24/7
          </p>
        </div>
      </div>

      {/* Action buttons - Fixed at bottom */}
      <div className="flex-shrink-0 space-y-3 pt-4 mt-4">
        <div className="text-center">
          <Button
            onClick={openWhatsApp}
            disabled={autoPopupDone}
            className={`${autoPopupDone ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              } text-white rounded-xl py-3 px-6`}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {autoPopupDone ? "WhatsApp Already Opened" : "Open WhatsApp Now"}
            {!autoPopupDone && <ExternalLink className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 rounded-lg border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Edit Details
          </Button>
          <Button
            onClick={onHome}
            variant="outline"
            className="flex-1 rounded-lg border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
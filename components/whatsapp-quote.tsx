"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MessageCircle, Phone, Mail, CreditCard } from "lucide-react"
interface WhatsAppQuoteProps {
  bookingData: any
  onBack: () => void
  onPayNow?: (data: any) => void
  onWhatsAppQuote?: (data: any) => void
}

export default function WhatsAppQuote({ bookingData, onBack, onPayNow, onWhatsAppQuote }: WhatsAppQuoteProps) {
  const [customerData, setCustomerData] = useState({
    whatsappNumber: "",
    email: "",
    name: "",
  })

  const handleWhatsAppQuote = () => {
    if (onWhatsAppQuote && isFormValid) {
      onWhatsAppQuote(customerData)
    }
  }

  const handlePayNow = () => {
    if (onPayNow && isFormValid) {
      onPayNow(customerData)
    }
  }


  const calculatePricing = () => {
    const baseRates: { [key: string]: number } = {
      "swift-dzire": 2500,
      "maruti-ertiga": 3000,
      "toyota-innova": 3500,
      "innova-crysta": 4000,
      "tempo-13": 6500,
      "tempo-17": 7500,
      "tempo-21": 8500,
    }

    const baseRate = baseRates[bookingData.selectedVehicle?.id] || 3000
    const days = bookingData.numberOfDays
    const serviceMultiplier = bookingData.serviceType === "chauffeur" ? 1.3 : 1

    const subtotal = baseRate * days * serviceMultiplier
    const taxes = subtotal * 0.18
    const total = subtotal + taxes

    return {
      baseRate,
      subtotal: Math.round(subtotal),
      taxes: Math.round(taxes),
      total: Math.round(total),
    }
  }

  const pricing = calculatePricing()

  const isValidNumber = customerData.whatsappNumber.length === 10 && /^\d{10}$/.test(customerData.whatsappNumber)
  const isValidEmail = !customerData.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)
  const isFormValid = isValidNumber && customerData.name.trim().length > 0 && isValidEmail

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
      <h2 className="text-2xl font-bold text-emerald-900 mb-4 text-center">Customer Details</h2>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Left Column - Booking Summary */}
        <div className="backdrop-blur-sm bg-emerald-50/80 rounded-lg p-4 border border-emerald-200/50">
          <h3 className="text-lg font-bold text-emerald-900 mb-3">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-emerald-800">Service:</span>
              <span className="text-emerald-700">
                {bookingData.serviceType === "self-drive" ? "Self Drive" : "Chauffeur Service"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-emerald-800">Vehicle:</span>
              <span className="text-emerald-700">{bookingData.selectedVehicle?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-emerald-800">Pickup:</span>
              <span className="text-emerald-700">{bookingData.pickupLocation}</span>
            </div>
            {bookingData.serviceType === "chauffeur" && bookingData.dropLocation && (
              <div className="flex justify-between">
                <span className="font-medium text-emerald-800">Drop:</span>
                <span className="text-emerald-700">{bookingData.dropLocation}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium text-emerald-800">Start:</span>
              <span className="text-emerald-700">
                {bookingData.startDate} {bookingData.startTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-emerald-800">End:</span>
              <span className="text-emerald-700">
                {bookingData.endDate} {bookingData.endTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-emerald-800">Duration:</span>
              <span className="text-emerald-700">
                {bookingData.numberOfDays} day{bookingData.numberOfDays > 1 ? "s" : ""}
                {bookingData.serviceType === "chauffeur" && bookingData.roundTrip ? " (Round Trip)" : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-emerald-800">Capacity:</span>
              <span className="text-emerald-700">{bookingData.selectedVehicle?.seats} seats</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t border-emerald-300 pt-2 mt-2">
              <span className="text-emerald-800">Estimated Total:</span>
              <span className="text-emerald-900">₹{pricing.total.toLocaleString()}</span>
            </div>
            <div className="text-xs text-emerald-600 text-right">
              (Base: ₹{pricing.subtotal.toLocaleString()} + Tax: ₹{pricing.taxes.toLocaleString()})
            </div>
          </div>
        </div>

        {/* Right Column - Customer Details Form */}
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-emerald-800 font-medium text-sm">
              Full Name *
            </Label>
            <Input
              id="name"
              value={customerData.name}
              onChange={(e) => setCustomerData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="whatsapp" className="text-emerald-800 font-medium flex items-center gap-2 text-sm">
              <Phone className="w-3 h-3" />
              WhatsApp Number *
            </Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-emerald-100 border border-r-0 border-emerald-300 rounded-l-lg">
                <span className="text-emerald-700 font-medium text-sm">+91</span>
              </div>
              <Input
                id="whatsapp"
                value={customerData.whatsappNumber}
                onChange={(e) =>
                  setCustomerData((prev) => ({
                    ...prev,
                    whatsappNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
                  }))
                }
                placeholder="Enter 10-digit mobile number"
                className="rounded-l-none rounded-r-lg border-emerald-300 focus:border-emerald-500 h-9"
                required
              />
            </div>
            {customerData.whatsappNumber && !isValidNumber && (
              <p className="text-red-600 text-xs">Please enter exactly 10 digits</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-emerald-800 font-medium flex items-center gap-2 text-sm">
              <Mail className="w-3 h-3" />
              Email ID (Optional)
            </Label>
            <Input
              id="email"
              type="email"
              value={customerData.email}
              onChange={(e) => setCustomerData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email address"
              className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9"
            />
          </div>
          {customerData.email && !isValidEmail && (
            <p className="text-red-600 text-xs">Please enter a valid email address (e.g., user@example.com)</p>
          )}

          {/* Help Text */}
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 text-xs text-center">
              <strong>Help Desk:</strong> +91 98672 85333 | Available 24/7 for assistance
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 rounded-lg border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent h-9"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Back
          </Button>
          <Button
            onClick={handleWhatsAppQuote}
            disabled={!isFormValid}
            variant="outline"
            className="flex-1 rounded-lg border-green-300 text-green-600 hover:bg-green-50 bg-transparent h-9"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Get Quote on WhatsApp
          </Button>
        </div>

        {onPayNow && (
          <Button
            onClick={handlePayNow}
            disabled={!isFormValid}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-9"
          >
            <CreditCard className="w-3 h-3 mr-1" />
            Pay & Book Now
          </Button>
        )}
      </div>
    </div>
  )
}

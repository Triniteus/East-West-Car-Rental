"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MessageCircle, Phone, Mail, CreditCard, Info } from "lucide-react"
import {
  calculateSelfDrivePrice,
  calculateChauffeurPrice,
  calculateHours,
  type PricingBreakdown
} from "@/lib/booking-utils"

interface WhatsAppQuoteProps {
  bookingData: any
  onBack: () => void
}

export default function WhatsAppQuote({ bookingData, onBack }: WhatsAppQuoteProps) {
  const [customerData, setCustomerData] = useState({
    whatsappNumber: "",
    email: "",
    name: "",
  })
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false)
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null)
  const [loadingPrice, setLoadingPrice] = useState(true)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    calculatePricing()
  }, [bookingData])

  const calculatePricing = async () => {
    setLoadingPrice(true)
    try {
      let result: PricingBreakdown | null = null

      if (bookingData.serviceType === "self-drive") {
        result = await calculateSelfDrivePrice(
          bookingData.selectedVehicle?.id,
          bookingData.numberOfDays,
          bookingData.estimatedKms || 150
        )
      } else {
        const hours = calculateHours(bookingData.startTime, bookingData.endTime)
        result = await calculateChauffeurPrice(
          bookingData.selectedVehicle?.id,
          bookingData.numberOfDays,
          hours,
          bookingData.estimatedKms || 150,
          bookingData.serviceArea
        )
      }

      setPricing(result)
    } catch (error) {
      console.error('Pricing calculation error:', error)
      setPricing(null)
    } finally {
      setLoadingPrice(false)
    }
  }


  // Helper to build WhatsApp message
  const buildWhatsAppMessage = () => {
    return `Hi, I would like to book a ${bookingData.selectedVehicle?.name} (${bookingData.selectedVehicle?.seats} seats)\n\n` +
      `Service: ${bookingData.serviceType === "self-drive" ? "Self Drive" : "Chauffeur Service"}\n` +
      `Area: ${bookingData.serviceArea?.withinMumbai ? "Within Mumbai" : bookingData.serviceArea?.naviMumbai ? "Navi Mumbai" : "Outside Mumbai"}\n` +
      `Pickup: ${bookingData.pickupLocation}\n` +
      (bookingData.serviceType === "chauffeur" && bookingData.dropLocation ? `Drop: ${bookingData.dropLocation}\n` : "") +
      `Start: ${bookingData.startDate} ${bookingData.startTime}\n` +
      `End: ${bookingData.endDate} ${bookingData.endTime}\n` +
      `Duration: ${bookingData.numberOfDays} day${bookingData.numberOfDays > 1 ? "s" : ""}${bookingData.serviceType === "chauffeur" && bookingData.roundTrip ? " (Round Trip)" : ""}\n` +
      `Name: ${customerData.name}\n` +
      `WhatsApp: +91${customerData.whatsappNumber}\n` +
      (customerData.email ? `Email: ${customerData.email}\n` : "") +
      (pricing ? `Estimated Total: ₹${Math.round(pricing.total).toLocaleString()}\n` : "");
  };

  // Handler for WhatsApp action
  const handleImmediateWhatsApp = async () => {
    if (!isFormValid) return;

    // 1. Open WhatsApp chat with prefilled message
    const message = encodeURIComponent(buildWhatsAppMessage());
    const whatsappUrl = `https://wa.me/919867285333?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // 2. Post booking data to Supabase
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingData,
          customer: customerData,
          pricing,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log('Booking saved:', result.orderId);
      }
    } catch (err) {
      console.error('Failed to post booking to Supabase', err);
    }
  };

  // Handler for direct Submit/Book Now action
  const handleSubmitBooking = async () => {
    if (!isFormValid) return;

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingData,
          customer: customerData,
          pricing,
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Show success message
        alert(`Booking confirmed! Order ID: ${result.orderId}\nYou will receive a confirmation email shortly.`);
      } else {
        alert('Failed to submit booking. Please try again.');
      }
    } catch (err) {
      console.error('Failed to submit booking', err);
      alert('Failed to submit booking. Please try again.');
    }
  };

  const isValidNumber = customerData.whatsappNumber.length === 10 && /^\d{10}$/.test(customerData.whatsappNumber)
  const isValidEmail = !customerData.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)
  const isFormValid = isValidNumber && customerData.name.trim().length > 0 && isValidEmail

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 mb-2 md:mb-4">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-900 text-center">Customer Details</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 pr-1 md:pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          {/* Left Column - Booking Summary */}
          <div className="backdrop-blur-sm bg-emerald-50/80 rounded-lg p-3 md:p-4 border border-emerald-200/50 h-fit">
            <h3 className="text-base md:text-lg font-bold text-emerald-900 mb-2 md:mb-3">Booking Summary</h3>
            <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
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
                <span className="font-medium text-emerald-800">Area:</span>
                <span className="text-emerald-700">
                  {bookingData.serviceArea?.withinMumbai && "Within Mumbai"}
                  {bookingData.serviceArea?.naviMumbai && "Navi Mumbai"}
                  {bookingData.serviceArea?.outsideMumbai && "Outside Mumbai"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-emerald-800">Pickup:</span>
                <span className="text-emerald-700 text-right">{bookingData.pickupLocation}</span>
              </div>
              {bookingData.serviceType === "chauffeur" && bookingData.dropLocation && (
                <div className="flex justify-between">
                  <span className="font-medium text-emerald-800">Drop:</span>
                  <span className="text-emerald-700 text-right">{bookingData.dropLocation}</span>
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

              {loadingPrice ? (
                <div className="border-t border-emerald-300 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-800 text-xs md:text-sm">Loading price...</span>
                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : pricing ? (
                <div className="border-t border-emerald-300 pt-2 mt-2">
                  <div className="flex justify-between items-center font-semibold text-base md:text-lg">
                    <span className="text-emerald-800 text-sm md:text-base">Estimated Total:</span>
                    <div className="flex items-center gap-1 md:gap-2">
                      <span className="text-emerald-900">₹{Math.round(pricing.total).toLocaleString()}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                        className="text-emerald-600 hover:bg-emerald-100 h-5 w-5 md:h-6 md:w-6 p-0 rounded-full"
                      >
                        <Info className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {showPriceBreakdown && (
                    <div className="mt-2 md:mt-3 p-2 md:p-3 bg-white/60 rounded-lg">
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Base Amount:</span>
                          <span>₹{Math.round(pricing.subtotal).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>GST (5%):</span>
                          <span>₹{Math.round(pricing.gst).toLocaleString()}</span>
                        </div>
                        {pricing.driverDA && (
                          <div className="flex justify-between">
                            <span>Driver DA:</span>
                            <span>₹{Math.round(pricing.driverDA).toLocaleString()}</span>
                          </div>
                        )}
                        <div className="border-t border-emerald-300 pt-1 mt-1">
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>₹{Math.round(pricing.total).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      {pricing.isOutstation && (
                        <div className="text-xs text-emerald-600 mt-2">
                          * Outstation rates (300km/day minimum)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-t border-emerald-300 pt-2 mt-2">
                  <div className="text-red-600 text-sm">Unable to calculate pricing</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Customer Details Form */}
          <div className="space-y-2 md:space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-emerald-800 font-medium text-xs md:text-sm">
                Full Name *
              </Label>
              <Input
                id="name"
                value={customerData.name}
                onChange={(e) => setCustomerData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9 text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="whatsapp" className="text-emerald-800 font-medium flex items-center gap-2 text-xs md:text-sm">
                <Phone className="w-3 h-3" />
                WhatsApp Number *
              </Label>
              <div className="flex">
                <div className="flex items-center px-2 md:px-3 bg-emerald-100 border border-r-0 border-emerald-300 rounded-l-lg">
                  <span className="text-emerald-700 font-medium text-xs md:text-sm">+91</span>
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
                  className="rounded-l-none rounded-r-lg border-emerald-300 focus:border-emerald-500 h-9 text-sm"
                  required
                />
              </div>
              {customerData.whatsappNumber && !isValidNumber && (
                <p className="text-red-600 text-xs">Please enter exactly 10 digits</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-emerald-800 font-medium flex items-center gap-2 text-xs md:text-sm">
                <Mail className="w-3 h-3" />
                Email ID *
              </Label>
              <Input
                id="email"
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email address"
                className="rounded-lg border-emerald-300 focus:border-emerald-500 h-9 text-sm"
                required
              />
              {customerData.email && !isValidEmail && (
                <p className="text-red-600 text-xs">Please enter a valid email address (e.g., user@example.com)</p>
              )}
            </div>

            {/* Help Text */}
            <div className="p-2 md:p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 text-xs text-center">
                <strong>Help Desk:</strong> +91 98672 85333 | Available 24/7 for assistance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex-shrink-0 space-y-2 md:space-y-3 pt-3 md:pt-4 mt-3 md:mt-4">
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full sm:w-auto sm:flex-1 rounded-lg border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent h-9 text-sm"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Back
          </Button>
          <Button
            onClick={handleImmediateWhatsApp}
            disabled={!isFormValid}
            variant="outline"
            className="w-full sm:w-auto sm:flex-1 rounded-lg border-green-300 text-green-600 hover:bg-green-50 bg-transparent h-9 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Get Quote on WhatsApp
          </Button>
        </div>

        <Button
          onClick={handleSubmitBooking}
          disabled={!isFormValid}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-10 md:h-9 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard className="w-3 h-3 mr-1" />
          Book Now
        </Button>
      </div>
    </div>
  )
}
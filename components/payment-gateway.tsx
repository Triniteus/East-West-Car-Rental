"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Shield, CheckCircle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  calculateSelfDrivePrice,
  calculateChauffeurPrice,
  calculateHours
} from "@/lib/booking-utils"

interface PaymentGatewayProps {
  bookingData: any
  onBack: () => void
  onPaymentSuccess: (paymentData: any) => void
}

export default function PaymentGateway({ bookingData, onBack, onPaymentSuccess }: PaymentGatewayProps) {
  const [paymentMethod, setPaymentMethod] = useState<"advance" | "full">("advance")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false)

  // Pre-fill customer details from previous step
  const [customerDetails, setCustomerDetails] = useState({
    name: bookingData.name || "",
    email: bookingData.email || "",
    phone: bookingData.whatsappNumber || "",
    address: "",
  })

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
      console.error('Pricing calculation error:', error)
      return {
        baseRate: 0,
        subtotal: 0,
        gst: 0,
        total: 0,
        advanceAmount: 0,
        extraKmRate: 0,
        extraHrRate: 0,
        driverDA: 0,
        isOutstation: false
      }
    }
  }

  const pricing = calculatePricing()
  const advanceAmount = Math.round(pricing.total * 0.25)

  const handlePayment = async () => {
    setIsProcessing(true)

    const isValidNumber = customerDetails.phone.length === 10 && /^\d{10}$/.test(customerDetails.phone)
    const isValidEmail = !customerDetails.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)

    if (!isValidNumber) {
      alert("Please enter exactly 10 digits for phone number")
      setIsProcessing(false)
      return
    }

    if (customerDetails.email && !isValidEmail) {
      alert("Please enter a valid email address")
      setIsProcessing(false)
      return
    }

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const paymentData = {
        orderId: `EW${Date.now()}`,
        amount: paymentMethod === "advance" ? advanceAmount : Math.round(pricing.total),
        paymentMethod,
        customerDetails,
        bookingData,
        paymentStatus: "success",
        transactionId: `TXN${Date.now()}`,
        timestamp: new Date().toISOString(),
      }

      onPaymentSuccess(paymentData)
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const isFormValid =
    customerDetails.name &&
    customerDetails.email &&
    customerDetails.phone.length === 10 &&
    /^\d{10}$/.test(customerDetails.phone) &&
    (!customerDetails.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email))

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">Secure Payment</h2>
        <p className="text-emerald-700">Complete your booking with our secure payment gateway</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Booking Summary */}
          <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50 h-fit">
            <CardHeader>
              <CardTitle className="text-emerald-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Service:</span>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    {bookingData.serviceType === "self-drive" ? "Self Drive" : "Chauffeur Service"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Vehicle:</span>
                  <span className="font-medium text-emerald-900">{bookingData.selectedVehicle?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Area:</span>
                  <span className="font-medium text-emerald-900">
                    {bookingData.serviceArea?.withinMumbai && "Within Mumbai"}
                    {bookingData.serviceArea?.naviMumbai && "Navi Mumbai"}
                    {bookingData.serviceArea?.outsideMumbai && "Outside Mumbai"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Route:</span>
                  <span className="font-medium text-emerald-900 text-right text-sm">
                    {bookingData.pickupLocation}
                    {bookingData.dropLocation && ` → ${bookingData.dropLocation}`}
                  </span>
                </div>
                {bookingData.serviceType === "chauffeur" &&
                  (<div className="flex justify-between">
                    <span className="text-emerald-700">Distance:</span>
                    <span className="font-medium text-emerald-900">{bookingData.estimatedKms || 150} km</span>
                  </div>)}
                <div className="flex justify-between">
                  <span className="text-emerald-700">Duration:</span>
                  <span className="font-medium text-emerald-900">
                    {bookingData.numberOfDays} day{bookingData.numberOfDays > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Dates:</span>
                  <span className="font-medium text-emerald-900 text-right text-sm">
                    {bookingData.startDate} {bookingData.startTime}
                    <br />
                    {bookingData.endDate} {bookingData.endTime}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-emerald-900">Pricing Breakdown</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                    className="text-emerald-600 hover:bg-emerald-100 h-6 w-6 p-0 rounded-full"
                  >
                    <Info className="w-3 h-3" />
                  </Button>
                </div>

                {showPriceBreakdown && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Base Amount:</span>
                      <span className="text-emerald-900">₹{Math.round(pricing.subtotal).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">GST (12%):</span>
                      <span className="text-emerald-900">₹{Math.round(pricing.gst).toLocaleString()}</span>
                    </div>
                    {pricing.driverDA}
                    <Separator />
                    {pricing.isOutstation}
                  </div>
                )}

                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-emerald-900">Total Amount:</span>
                  <span className="text-emerald-900">₹{Math.round(pricing.total).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50 h-fit">
            <CardHeader>
              <CardTitle className="text-emerald-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method Selection */}
              <div className="space-y-4">
                <Label className="text-emerald-800 font-medium">Payment Option</Label>
                <div className="grid grid-cols-1 gap-3">
                  <div
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "advance"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-emerald-200 hover:border-emerald-300"
                      }`}
                    onClick={() => setPaymentMethod("advance")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-emerald-900">Pay Advance (25%)</h4>
                        <p className="text-sm text-emerald-700">Pay remaining amount at pickup</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-900">
                          ₹{advanceAmount.toLocaleString()}
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Recommended
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "full"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-emerald-200 hover:border-emerald-300"
                      }`}
                    onClick={() => setPaymentMethod("full")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-emerald-900">Pay Full Amount</h4>
                        <p className="text-sm text-emerald-700">Complete payment now</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-900">₹{Math.round(pricing.total).toLocaleString()}</div>
                        <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                          Save 5%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details - Pre-filled */}
              <div className="space-y-4">
                <Label className="text-emerald-800 font-medium">Customer Details</Label>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-emerald-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="rounded-xl border-emerald-300 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-emerald-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      className="rounded-xl border-emerald-300 focus:border-emerald-500"
                      required
                    />
                    {customerDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email) && (
                      <p className="text-red-600 text-xs">Please enter a valid email address (e.g., user@example.com)</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-emerald-700">
                      Phone Number *
                    </Label>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-emerald-100 border border-r-0 border-emerald-300 rounded-l-xl">
                        <span className="text-emerald-700 font-medium">+91</span>
                      </div>
                      <Input
                        id="phone"
                        value={customerDetails.phone}
                        onChange={(e) =>
                          setCustomerDetails((prev) => ({
                            ...prev,
                            phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                          }))
                        }
                        placeholder="Enter 10-digit number"
                        className="rounded-l-none rounded-r-xl border-emerald-300 focus:border-emerald-500"
                        required
                      />
                    </div>
                    {customerDetails.phone && customerDetails.phone.length !== 10 && (
                      <p className="text-red-600 text-xs">Please enter exactly 10 digits</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-emerald-700">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={customerDetails.address}
                      onChange={(e) => setCustomerDetails((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter your address (optional)"
                      className="rounded-xl border-emerald-300 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Secure Payment</h4>
                    <p className="text-sm text-blue-700">
                      Your payment is secured with 256-bit SSL encryption. We support UPI, Cards, Net Banking, and
                      Wallets.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex-shrink-0 flex gap-4 pt-4 mt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 rounded-xl border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent"
          disabled={isProcessing}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handlePayment}
          disabled={!isFormValid || isProcessing}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ₹{(paymentMethod === "advance" ? advanceAmount : Math.round(pricing.total)).toLocaleString()}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
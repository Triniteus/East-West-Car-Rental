"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Shield, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PaymentGatewayProps {
  bookingData: any
  onBack: () => void
  onPaymentSuccess: (paymentData: any) => void
}

export default function PaymentGateway({ bookingData, onBack, onPaymentSuccess }: PaymentGatewayProps) {
  const [paymentMethod, setPaymentMethod] = useState<"advance" | "full">("advance")
  const [isProcessing, setIsProcessing] = useState(false)

  // Pre-fill customer details from previous step
  const [customerDetails, setCustomerDetails] = useState({
    name: bookingData.name || "",
    email: bookingData.email || "",
    phone: bookingData.whatsappNumber || "",
    address: "",
  })

  // Calculate pricing (mock pricing logic)
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
    const advanceAmount = total * 0.25

    return {
      baseRate,
      subtotal: Math.round(subtotal),
      taxes: Math.round(taxes),
      total: Math.round(total),
      advanceAmount: Math.round(advanceAmount),
    }
  }

  const pricing = calculatePricing()

  const handlePayment = async () => {
    setIsProcessing(true)

    const isValidNumber = customerDetails.phone.length === 10 && /^\d{10}$/.test(customerDetails.phone)
    const isValidEmail = !customerDetails.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)

    if (!isValidNumber) {
      alert("Please enter exactly 10 digits for phone number")
      return
    }

    if (customerDetails.email && !isValidEmail) {
      alert("Please enter a valid email address")
      return
    }

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const paymentData = {
        orderId: `EW${Date.now()}`,
        amount: paymentMethod === "advance" ? pricing.advanceAmount : pricing.total,
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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-emerald-900 mb-4">Secure Payment</h2>
        <p className="text-emerald-700">Complete your booking with our secure payment gateway</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50">
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
                <span className="text-emerald-700">Route:</span>
                <span className="font-medium text-emerald-900 text-right">
                  {bookingData.pickupLocation}
                  {bookingData.dropLocation && ` → ${bookingData.dropLocation}`}
                </span>
              </div>
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
              <h4 className="font-semibold text-emerald-900">Pricing Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Base Rate (per day):</span>
                  <span className="text-emerald-900">₹{pricing.baseRate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Subtotal:</span>
                  <span className="text-emerald-900">₹{pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">GST (18%):</span>
                  <span className="text-emerald-900">₹{pricing.taxes.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-emerald-900">Total Amount:</span>
                  <span className="text-emerald-900">₹{pricing.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card className="backdrop-blur-sm bg-white/80 border-emerald-200/50">
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
                        ₹{pricing.advanceAmount.toLocaleString()}
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
                      <div className="text-lg font-bold text-emerald-900">₹{pricing.total.toLocaleString()}</div>
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

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
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
                    Pay ₹{(paymentMethod === "advance" ? pricing.advanceAmount : pricing.total).toLocaleString()}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

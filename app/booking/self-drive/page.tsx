"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import BookingFormStep1 from "@/components/booking-form-step1"
import BookingFormStep2 from "@/components/booking-form-step2"
import WhatsAppQuote from "@/components/whatsapp-quote"
import WhatsAppThankYou from "@/components/whatsapp-thank-you"
import PaymentGateway from "@/components/payment-gateway"
import BookingConfirmation from "@/components/booking-confirmation"

export default function SelfDrivePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    pickupLocation: "",
    dropLocation: "",
    stopovers: [""],
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "18:00",
    numberOfDays: 1,
    roundTrip: false,
    selectedVehicle: null,
    serviceType: "self-drive",
  })
  const [customerData, setCustomerData] = useState(null)
  const [paymentData, setPaymentData] = useState(null)

  const handleStep1Continue = (data: any) => {
    setBookingData((prev) => ({ ...prev, ...data }))
    setCurrentStep(2)
  }

  const handleStep2Continue = (vehicleData: any) => {
    setBookingData((prev) => ({ ...prev, ...vehicleData }))
    setCurrentStep(3)
  }

  const handleWhatsAppQuote = (contactData: any) => {
    setCustomerData(contactData)
    setCurrentStep(4) // Go to thank you page
  }

  const handlePayNow = (contactData: any) => {
    setBookingData((prev) => ({ ...prev, ...contactData }))
    setCurrentStep(5) // Go to payment
  }

  const handlePaymentSuccess = (payment: any) => {
    setPaymentData(payment)
    setCurrentStep(6) // Go to confirmation
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBackToHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex flex-col">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/80 border-b border-emerald-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <Link href="/" className="text-xl font-bold text-emerald-900">
              East West
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-emerald-700 font-medium text-sm">Self Drive Booking</span>
              <Link href="/" className="text-emerald-600 hover:text-emerald-800">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Indicator - Only show for steps 1-3 and 5-6 */}
      {currentStep !== 4 && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 5, 6].map((step, index) => {
                const adjustedStep = step > 3 ? step - 1 : step // Adjust for missing step 4
                const adjustedCurrent = currentStep > 4 ? currentStep - 1 : currentStep

                return (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        adjustedCurrent >= adjustedStep ? "bg-emerald-600 text-white" : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {adjustedStep}
                    </div>
                    {index < 4 && (
                      <div className={`w-6 h-1 ${adjustedCurrent > adjustedStep ? "bg-emerald-600" : "bg-gray-300"}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="flex-1 max-w-6xl mx-auto px-4 pb-4">
        <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-6 border border-emerald-200/50 shadow-xl h-full">
          {currentStep === 1 && (
            <BookingFormStep1 onContinue={handleStep1Continue} initialData={bookingData} serviceType="self-drive" />
          )}
          {currentStep === 2 && (
            <BookingFormStep2
              onContinue={handleStep2Continue}
              onBack={handleBack}
              serviceType="self-drive"
              bookingData={bookingData}
            />
          )}
          {currentStep === 3 && (
            <WhatsAppQuote
              bookingData={bookingData}
              onBack={handleBack}
              onPayNow={handlePayNow}
              onWhatsAppQuote={handleWhatsAppQuote}
            />
          )}
          {currentStep === 4 && customerData && (
            <WhatsAppThankYou
              bookingData={bookingData}
              customerData={customerData}
              onBack={handleBack}
              onHome={handleBackToHome}
            />
          )}
          {currentStep === 5 && (
            <PaymentGateway bookingData={bookingData} onBack={handleBack} onPaymentSuccess={handlePaymentSuccess} />
          )}
          {currentStep === 6 && paymentData && <BookingConfirmation paymentData={paymentData} />}
        </div>
      </div>
    </div>
  )
}

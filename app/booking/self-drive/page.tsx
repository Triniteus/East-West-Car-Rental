"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import BookingFormStep1 from "@/components/booking-form-step1"
import BookingFormStep2 from "@/components/booking-form-step2"
import WhatsAppQuote from "@/components/whatsapp-quote"
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
    estimatedKms: 150,
    serviceArea: {
      withinMumbai: true,
      naviMumbai: false,
      outsideMumbai: false,
    },
  })
  // Removed customerData and paymentData as WhatsAppThankYou and PaymentGateway are deprecated

  const handleStep1Continue = (data: any) => {
    setBookingData((prev) => ({ ...prev, ...data }))
    setCurrentStep(2)
  }

  const handleStep2Continue = (vehicleData: any) => {
    setBookingData((prev) => ({ ...prev, ...vehicleData }))
    setCurrentStep(3)
  }


  // WhatsAppQuote will now handle all actions (WhatsApp, Supabase, email)

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }


  // No longer needed: handleBackToHome

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex flex-col">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/80 border-b border-emerald-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-emerald-900">East West</span>
              <span className="text-[10px] text-emerald-600 font-medium">powered by Self Drive India</span>
            </Link>
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="text-emerald-700 font-medium text-sm">Self Drive Booking</span>
              <Link href="/" className="text-emerald-600 hover:text-emerald-800">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-4 py-2 md:py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-1 md:space-x-2">
            {[1, 2, 3].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center font-bold text-xs ${currentStep >= step ? "bg-emerald-600 text-white" : "bg-gray-300 text-gray-600"
                    }`}
                >
                  {step}
                </div>
                {index < 2 && (
                  <div
                    className={`w-4 md:w-6 h-1 ${currentStep > step ? "bg-emerald-600" : "bg-gray-300"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 max-w-6xl mx-auto px-2 sm:px-4 md:px-6 pb-2 md:pb-4 overflow-hidden">
        <div className="backdrop-blur-sm bg-white/70 rounded-lg md:rounded-xl lg:rounded-2xl p-2 sm:p-3 md:p-6 border border-emerald-200/50 shadow-xl h-full flex flex-col min-h-0">
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
            // All actions handled inside WhatsAppQuote now
            />
          )}
          {/* BookingConfirmation can be shown after WhatsAppQuote if needed */}
        </div>
      </div>
    </div>
  )
}
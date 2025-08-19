"use client"

import { useEffect } from "react"

interface RazorpayCheckoutProps {
  orderId: string
  amount: number
  customerDetails: any
  onSuccess: (response: any) => void
  onFailure: (error: any) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function RazorpayCheckout({
  orderId,
  amount,
  customerDetails,
  onSuccess,
  onFailure,
}: RazorpayCheckoutProps) {
  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_key", // Mock key for demo
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "East West Car Rentals",
        description: "Premium Car Rental Booking",
        image: "/logo.png",
        order_id: orderId,
        handler: (response: any) => {
          onSuccess(response)
        },
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: `+91${customerDetails.phone}`,
        },
        notes: {
          address: customerDetails.address || "N/A",
        },
        theme: {
          color: "#059669", // Emerald color
        },
        modal: {
          ondismiss: () => {
            onFailure({ error: "Payment cancelled by user" })
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on("payment.failed", (response: any) => {
        onFailure(response.error)
      })

      rzp.open()
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [orderId, amount, customerDetails, onSuccess, onFailure])

  return null
}

// app/contact/page.tsx - Updated to save to database
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValidEmail = !formData.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Thank you for your message! We will get back to you soon.")
        setFormData({ name: "", email: "", message: "" })
      } else {
        toast.error("Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/80 border-b border-emerald-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-emerald-900">
              East West
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/about" className="text-emerald-600 hover:text-emerald-800">
                About
              </Link>
              <Link href="/" className="text-emerald-600 hover:text-emerald-800">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-emerald-900 mb-4 md:mb-6">Contact Us</h1>
          <p className="text-lg md:text-xl text-emerald-700 max-w-3xl mx-auto">
            Get in touch with our team for bookings, inquiries, or any assistance you need. We're here to help make your
            journey smooth and memorable.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Form */}
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-emerald-200/50 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-6 md:mb-8">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-emerald-800 font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="rounded-xl border-emerald-300 focus:border-emerald-500"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-emerald-800 font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                  className="rounded-xl border-emerald-300 focus:border-emerald-500"
                  required
                  disabled={isSubmitting}
                />
                {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                  <p className="text-red-600 text-xs mt-1">
                    Please enter a valid email address (e.g., user@example.com)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-emerald-800 font-medium">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us about your requirements or any questions you have"
                  className="rounded-xl border-emerald-300 focus:border-emerald-500 min-h-[120px]"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || (!!formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 md:space-y-8">
            {/* Quick Contact */}
            <div className="backdrop-blur-sm bg-white/70 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-emerald-200/50 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-6 md:mb-8">Get in Touch</h2>

              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900 mb-1">Phone</h3>
                    <p className="text-emerald-700">+91 98672 85333</p>
                    <p className="text-emerald-600 text-sm">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900 mb-1">WhatsApp</h3>
                    <p className="text-green-700">+91 98672 85333</p>
                    <p className="text-green-600 text-sm">Quick responses</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-teal-900 mb-1">Email</h3>
                    <p className="text-teal-700 break-all">ewttcars@gmail.com</p>
                    <p className="text-teal-600 text-sm">We reply within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900 mb-1">Address</h3>
                    <p className="text-emerald-700">
                      123 Business District
                      <br />
                      Mumbai, Maharashtra 400001
                      <br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900 mb-1">Business Hours</h3>
                    <p className="text-green-700">
                      Monday - Sunday
                      <br />
                      24/7 Service Available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="backdrop-blur-sm bg-red-50/70 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-red-200/50 shadow-xl">
              <h3 className="text-xl md:text-2xl font-bold text-red-900 mb-4">Emergency Support</h3>
              <p className="text-red-700 mb-4">
                For urgent assistance during your trip, call our 24/7 emergency helpline:
              </p>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-lg md:text-xl font-bold text-red-800">+91 98672 85333</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-4 md:mb-6">Ready to Book Your Ride?</h2>
          <p className="text-emerald-700 mb-6 md:mb-8 text-lg">
            Start your booking process now and experience premium car rental service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking/self-drive">
              <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 py-3">
                Self Drive Booking
              </Button>
            </Link>
            <Link href="/booking/chauffeur">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-xl px-8 py-3 bg-transparent"
              >
                Chauffeur Service
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
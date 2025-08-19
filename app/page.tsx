"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Car, Users, Shield, Clock } from "lucide-react"
import Link from "next/link"
import LoadingSplash from "@/components/loading-splash"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingSplash />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Navigation - Fixed with proper z-index */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-emerald-900">
              East West
            </Link>
            <div className="flex space-x-4 sm:space-x-6">
              <Link
                href="/about"
                className="text-sm sm:text-base text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm sm:text-base text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Added top padding to account for fixed header */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-r from-emerald-900/80 via-green-800/70 to-teal-900/80 absolute z-10" />
          <img
            src="/placeholder.svg?height=1080&width=1920"
            alt="Premium cars on highway"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="backdrop-blur-md bg-white/10 rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent">
              East West
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-emerald-100">Premium Car Rental Portal</p>
            <p className="text-base sm:text-lg mb-8 sm:mb-12 text-green-200 font-medium">
              Driven by Trust. Powered by East West.
            </p>

            {/* Service Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
              <Link href="/booking/self-drive">
                <div className="group cursor-pointer">
                  <div className="backdrop-blur-lg bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-2xl p-6 sm:p-8 border border-emerald-400/30 hover:border-emerald-300/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <Car className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-300 mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">Self Drive</h3>
                    <p className="text-emerald-200 mb-3 sm:mb-4 text-sm sm:text-base">
                      Drive yourself with our premium fleet
                    </p>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm sm:text-base py-2 sm:py-3">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Link>

              <Link href="/booking/chauffeur">
                <div className="group cursor-pointer">
                  <div className="backdrop-blur-lg bg-gradient-to-br from-green-500/20 to-teal-600/20 rounded-2xl p-6 sm:p-8 border border-green-400/30 hover:border-green-300/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <Users className="w-10 h-10 sm:w-12 sm:h-12 text-green-300 mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">Chauffeur Service</h3>
                    <p className="text-green-200 mb-3 sm:mb-4 text-sm sm:text-base">
                      Professional drivers at your service
                    </p>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm sm:text-base py-2 sm:py-3">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-emerald-900">
            Why Choose East West?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 sm:p-8 backdrop-blur-sm bg-white/60 rounded-2xl border border-emerald-200/50 shadow-lg">
              <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600 mx-auto mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-emerald-900">Trusted Service</h3>
              <p className="text-emerald-700 text-sm sm:text-base">
                Premium vehicles with comprehensive insurance and 24/7 support
              </p>
            </div>
            <div className="text-center p-6 sm:p-8 backdrop-blur-sm bg-white/60 rounded-2xl border border-green-200/50 shadow-lg">
              <Car className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 mx-auto mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-green-900">Premium Fleet</h3>
              <p className="text-green-700 text-sm sm:text-base">
                Well-maintained vehicles from compact cars to luxury tempo travellers
              </p>
            </div>
            <div className="text-center p-6 sm:p-8 backdrop-blur-sm bg-white/60 rounded-2xl border border-teal-200/50 shadow-lg sm:col-span-2 md:col-span-1">
              <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-teal-600 mx-auto mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-teal-900">24/7 Available</h3>
              <p className="text-teal-700 text-sm sm:text-base">
                Round-the-clock booking and customer support for your convenience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

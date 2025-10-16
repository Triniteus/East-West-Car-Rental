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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2.5 sm:py-3 md:py-4">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-xl md:text-2xl font-bold text-emerald-900">East West</span>
              <span className="text-[9px] sm:text-[10px] md:text-xs text-emerald-600 font-medium whitespace-nowrap">powered by Self Drive India</span>
            </Link>
            <div className="flex space-x-3 sm:space-x-4 md:space-x-6">
              <Link
                href="/about"
                className="text-xs sm:text-sm md:text-base text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-xs sm:text-sm md:text-base text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Added top padding to account for fixed header */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14 sm:pt-16 md:pt-20">
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
        <div className="relative z-20 text-center text-white px-3 sm:px-4 md:px-6 max-w-4xl mx-auto w-full">
          <div className="backdrop-blur-md bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl">
            <div className="flex flex-col items-center mb-3 sm:mb-4 md:mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent">
                East West
              </h1>
              <p className="text-[10px] sm:text-xs md:text-sm text-emerald-200 font-medium mt-1.5 sm:mt-2">powered by Self Drive India</p>
            </div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-3 md:mb-4 text-emerald-100">Premium Car Rental Portal</p>
            <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-12 text-green-200 font-medium">
              Driven by Trust. Powered by East West.
            </p>

            {/* Service Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto">
              <Link href="/booking/self-drive">
                <div className="group cursor-pointer">
                  <div className="backdrop-blur-lg bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-emerald-400/30 hover:border-emerald-300/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <Car className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-emerald-300 mx-auto mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1.5 sm:mb-2 md:mb-3 text-white">Self Drive</h3>
                    <p className="text-emerald-200 mb-2.5 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">
                      Drive yourself with our premium fleet
                    </p>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3 h-auto">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Link>

              <Link href="/booking/chauffeur">
                <div className="group cursor-pointer">
                  <div className="backdrop-blur-lg bg-gradient-to-br from-green-500/20 to-teal-600/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-green-400/30 hover:border-green-300/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-300 mx-auto mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1.5 sm:mb-2 md:mb-3 text-white">Hired Driver Service</h3>
                    <p className="text-green-200 mb-2.5 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">
                      Professional drivers at your service
                    </p>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3 h-auto">
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
      <div className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 text-emerald-900">
            Why Choose East West?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center p-4 sm:p-6 md:p-8 backdrop-blur-sm bg-white/60 rounded-xl sm:rounded-2xl border border-emerald-200/50 shadow-lg">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-emerald-600 mx-auto mb-3 sm:mb-4 md:mb-6" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-emerald-900">Trusted Service</h3>
              <p className="text-emerald-700 text-xs sm:text-sm md:text-base leading-relaxed">
                Premium vehicles with comprehensive insurance and 24/7 support
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 md:p-8 backdrop-blur-sm bg-white/60 rounded-xl sm:rounded-2xl border border-green-200/50 shadow-lg">
              <Car className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-green-600 mx-auto mb-3 sm:mb-4 md:mb-6" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-green-900">Premium Fleet</h3>
              <p className="text-green-700 text-xs sm:text-sm md:text-base leading-relaxed">
                Well-maintained vehicles from compact cars to luxury tempo travellers
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 md:p-8 backdrop-blur-sm bg-white/60 rounded-xl sm:rounded-2xl border border-teal-200/50 shadow-lg sm:col-span-2 lg:col-span-1">
              <Clock className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-teal-600 mx-auto mb-3 sm:mb-4 md:mb-6" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-teal-900">24/7 Available</h3>
              <p className="text-teal-700 text-xs sm:text-sm md:text-base leading-relaxed">
                Round-the-clock booking and customer support for your convenience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Award, Users, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/80 border-b border-emerald-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-900">East West</span>
              <span className="text-xs text-emerald-600 font-medium">powered by Self Drive India</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/contact" className="text-emerald-600 hover:text-emerald-800">
                Contact
              </Link>
              <Link href="/" className="text-emerald-600 hover:text-emerald-800">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-5xl font-bold text-emerald-900">About East West</h1>
            <p className="text-sm text-emerald-600 font-medium mt-2">powered by Self Drive India</p>
          </div>
          <p className="text-xl text-emerald-700 max-w-3xl mx-auto">
            Your trusted partner for premium car rental services across India. We combine reliability, comfort, and
            exceptional service to make every journey memorable.
          </p>
        </div>

        {/* Company Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-emerald-200/50 shadow-lg text-center">
            <Shield className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-emerald-900 mb-4">Trust & Safety</h3>
            <p className="text-emerald-700">
              All our vehicles are regularly maintained and fully insured. Your safety is our top priority.
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-green-200/50 shadow-lg text-center">
            <Award className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-green-900 mb-4">Premium Quality</h3>
            <p className="text-green-700">
              From compact cars to luxury tempo travellers, we maintain the highest standards across our fleet.
            </p>
          </div>

          <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-8 border border-teal-200/50 shadow-lg text-center">
            <Users className="w-16 h-16 text-teal-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-teal-900 mb-4">Customer First</h3>
            <p className="text-teal-700">
              Our experienced team is dedicated to providing personalized service for every customer.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="backdrop-blur-sm bg-white/70 rounded-3xl p-12 border border-emerald-200/50 shadow-xl mb-16">
          <h2 className="text-4xl font-bold text-emerald-900 mb-8 text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none text-emerald-800">
            <p className="mb-6">
              Founded with a vision to revolutionize car rental services in India, East West has been serving customers
              with dedication and excellence for over a decade. What started as a small family business has grown into
              one of the most trusted names in the industry.
            </p>
            <p className="mb-6">
              We understand that every journey is unique, whether it's a business trip, family vacation, or special
              occasion. That's why we offer both self-drive and chauffeur services, ensuring you have the perfect
              solution for your travel needs.
            </p>
            <p>
              Our commitment to quality, safety, and customer satisfaction has earned us the trust of thousands of
              customers across multiple cities. We continue to expand our services while maintaining the personal touch
              that sets us apart.
            </p>
          </div>
        </div>

        {/* Service Regions */}
        <div className="backdrop-blur-sm bg-white/70 rounded-3xl p-12 border border-emerald-200/50 shadow-xl mb-16">
          <h2 className="text-4xl font-bold text-emerald-900 mb-8 text-center">Service Regions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Mumbai & Maharashtra",
              "Delhi & NCR",
              "Bangalore & Karnataka",
              "Chennai & Tamil Nadu",
              "Pune & Surrounding Areas",
              "Goa & Coastal Regions",
            ].map((region, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-800 font-medium">{region}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Information */}
        <div className="backdrop-blur-sm bg-white/70 rounded-3xl p-12 border border-emerald-200/50 shadow-xl mb-16">
          <h2 className="text-4xl font-bold text-emerald-900 mb-8 text-center">Our Fleet</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-4">Self Drive Options</h3>
              <ul className="space-y-3 text-emerald-700">
                <li>• Swift Dzire - Perfect for city drives</li>
                <li>• Maruti Ertiga - Ideal for families</li>
                <li>• Toyota Innova - Premium comfort</li>
                <li>• Innova Crysta - Luxury experience</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-4">Group Travel</h3>
              <ul className="space-y-3 text-emerald-700">
                <li>• Tempo Traveller 13 - Small groups</li>
                <li>• Tempo Traveller 17 - Medium groups</li>
                <li>• Tempo Traveller 21 - Large groups</li>
                <li>• Professional chauffeurs available</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-emerald-900 mb-6">Ready to Start Your Journey?</h2>
          <p className="text-emerald-700 mb-8 text-lg">
            Contact us today for personalized service and competitive rates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 py-3">
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-xl px-8 py-3 bg-transparent"
              >
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

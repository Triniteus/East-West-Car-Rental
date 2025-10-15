"use client"

import { useEffect, useState } from "react"

export default function LoadingSplash() {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 2)
    }, 16)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* 3D Car Animation */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto" style={{ transform: `rotateY(${rotation}deg)` }}>
            <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl shadow-2xl flex items-center justify-center">
              <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-600/20 rounded-full blur-xl animate-pulse" />
        </div>

        {/* Logo and Text */}
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-bold text-white animate-pulse">East West</h1>
          <p className="text-sm text-emerald-200 font-medium mt-2">powered by Self Drive India</p>
        </div>
        <p className="text-emerald-300 text-lg font-medium mt-4">Driven by Trust. Powered by East West.</p>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  )
}

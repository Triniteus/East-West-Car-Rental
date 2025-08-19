import { type NextRequest, NextResponse } from "next/server"

// Mock booking database - in production, this would be a real database
const mockBookings = [
  {
    vehicleId: "swift-dzire",
    startDate: "2025-08-01",
    endDate: "2025-08-03",
    status: "confirmed",
  },
  {
    vehicleId: "toyota-innova",
    startDate: "2025-08-02",
    endDate: "2025-08-04",
    status: "confirmed",
  },
  {
    vehicleId: "maruti-ertiga",
    startDate: "2025-08-01",
    endDate: "2025-08-02",
    status: "confirmed",
  },
  {
    vehicleId: "tempo-13",
    startDate: "2025-08-05",
    endDate: "2025-08-07",
    status: "confirmed",
  },
]

// Mock vehicle inventory - in production, this would track actual fleet
const vehicleInventory = {
  "swift-dzire": { total: 5, available: 4 },
  "maruti-ertiga": { total: 3, available: 2 },
  "toyota-innova": { total: 4, available: 3 },
  "innova-crysta": { total: 2, available: 2 },
  "tempo-13": { total: 3, available: 2 },
  "tempo-17": { total: 2, available: 2 },
  "tempo-21": { total: 2, available: 2 },
}

function checkDateOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  const startDate1 = new Date(start1)
  const endDate1 = new Date(end1)
  const startDate2 = new Date(start2)
  const endDate2 = new Date(end2)

  return startDate1 <= endDate2 && endDate1 >= startDate2
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { startDate, endDate, startTime, endTime } = body

    if (!startDate || !endDate) {
      return NextResponse.json({ success: false, error: "Start date and end date are required" }, { status: 400 })
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const availability = Object.entries(vehicleInventory).map(([vehicleId, inventory]) => {
      // Count overlapping bookings for this vehicle
      const overlappingBookings = mockBookings.filter(
        (booking) =>
          booking.vehicleId === vehicleId &&
          booking.status === "confirmed" &&
          checkDateOverlap(startDate, endDate, booking.startDate, booking.endDate),
      ).length

      const availableCount = Math.max(0, inventory.available - overlappingBookings)
      const isAvailable = availableCount > 0

      return {
        vehicleId,
        isAvailable,
        availableCount,
        totalCount: inventory.total,
        nextAvailableDate: !isAvailable ? getNextAvailableDate(vehicleId, endDate) : null,
      }
    })

    return NextResponse.json({
      success: true,
      availability,
      searchDates: {
        startDate,
        endDate,
        startTime,
        endTime,
      },
    })
  } catch (error) {
    console.error("Availability check failed:", error)
    return NextResponse.json({ success: false, error: "Failed to check availability" }, { status: 500 })
  }
}

function getNextAvailableDate(vehicleId: string, requestedEndDate: string): string {
  // Find the earliest date when this vehicle becomes available
  const relevantBookings = mockBookings
    .filter((booking) => booking.vehicleId === vehicleId && booking.status === "confirmed")
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())

  if (relevantBookings.length === 0) {
    return requestedEndDate
  }

  // Return the day after the last booking ends
  const lastBookingEnd = new Date(relevantBookings[relevantBookings.length - 1].endDate)
  lastBookingEnd.setDate(lastBookingEnd.getDate() + 1)
  return lastBookingEnd.toISOString().split("T")[0]
}

"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import VehicleSelectionWithAvailability from "@/components/vehicle-selection-with-availability"

interface BookingFormStep2Props {
  onContinue: (data: any) => void
  onBack: () => void
  serviceType: "self-drive" | "chauffeur"
  bookingData?: any
}

export default function BookingFormStep2({ onContinue, onBack, serviceType, bookingData }: BookingFormStep2Props) {
  const handleVehicleSelect = (vehicle: any) => {
    onContinue({ selectedVehicle: vehicle })
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0">
        <VehicleSelectionWithAvailability
          startDate={bookingData?.startDate || ""}
          endDate={bookingData?.endDate || ""}
          startTime={bookingData?.startTime || ""}
          endTime={bookingData?.endTime || ""}
          onVehicleSelect={handleVehicleSelect}
          serviceType={serviceType}
          bookingData={bookingData}
        />
      </div>

      {/* Back Button */}
      <div className="flex-shrink-0 pt-3 mt-auto">
        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-lg border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent h-9"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          Back to Journey Details
        </Button>
      </div>
    </div>
  )
}
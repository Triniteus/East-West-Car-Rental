// lib/booking-utils.ts - Updated to work with Supabase

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface VehicleData {
    id: string
    name: string
    seats: number
    image: string
    description: string
    features: string[]
    category: 'sedan-economy' | 'sedan-premium' | 'mpv' | 'suv' | 'electric'
    active?: boolean
    created_at?: string
    updated_at?: string
}

export interface ServiceArea {
    withinMumbai: boolean
    naviMumbai: boolean
    outsideMumbai: boolean
}

export interface PricingBreakdown {
    baseRate: number
    subtotal: number
    gst: number
    total: number
    extraKmRate: number
    extraHrRate: number
    driverDA?: number
    isOutstation: boolean
    totalKms: number
    totalHours: number
}

export interface SelfDriveRate {
    id?: number
    vehicle_id: string
    km150: number
    km250: number
    km600: number
    deposit: number
    monthly_rate: number
    monthly_km_limit: number
    monthly_deposit: number
    extra_km: number
    extra_hr: number
    active?: boolean
}

export interface ChauffeurRate {
    id?: number
    vehicle_id: string
    rate_8hrs_80km: number
    extra_km_rate: number
    extra_hr_rate: number
    outstation_rate: number
    driver_da: number
    active?: boolean
}

export interface BookingData {
    id?: number
    order_id: string
    customer_name: string
    customer_email: string
    customer_phone: string
    customer_address?: string
    service_type: 'self-drive' | 'chauffeur'
    vehicle_id: string
    pickup_location: string
    drop_location?: string
    stopovers?: string[]
    estimated_kms?: number
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    number_of_days: number
    round_trip?: boolean
    service_area: ServiceArea
    booking_status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    payment_status?: 'pending' | 'advance' | 'paid'
    payment_method?: 'advance' | 'full'
    amount_paid: number
    total_amount: number
    transaction_id?: string
    pricing_breakdown?: PricingBreakdown
}

export interface ContactMessage {
    id?: number
    name: string
    email: string
    message: string
    status?: 'unread' | 'read' | 'replied'
    admin_notes?: string
    created_at?: string
}

// Fetch all active vehicles
export async function getVehicles(): Promise<VehicleData[]> {
    const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('active', true)
        .order('name')

    if (error) {
        console.error('Error fetching vehicles:', error)
        return []
    }

    return data || []
}

// Fetch vehicle by ID
export async function getVehicleById(id: string): Promise<VehicleData | null> {
    const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .single()

    if (error) {
        console.error('Error fetching vehicle:', error)
        return null
    }

    return data
}

// Fetch vehicles available for specific service type
export async function getAvailableVehiclesForService(serviceType: 'self-drive' | 'chauffeur'): Promise<VehicleData[]> {
    let query = supabase
        .from('vehicles')
        .select('*')
        .eq('active', true)

    if (serviceType === 'self-drive') {
        // Join with self_drive_rates to get only vehicles with self-drive rates
        const { data, error } = await supabase
            .from('vehicles')
            .select(`
        *,
        self_drive_rates!inner(vehicle_id)
      `)
            .eq('active', true)
            .eq('self_drive_rates.active', true)

        if (error) {
            console.error('Error fetching self-drive vehicles:', error)
            return []
        }

        return data?.map(v => ({
            id: v.id,
            name: v.name,
            seats: v.seats,
            image: v.image,
            description: v.description,
            features: v.features,
            category: v.category,
            active: v.active,
            created_at: v.created_at,
            updated_at: v.updated_at
        })) || []
    } else {
        // Join with chauffeur_rates to get only vehicles with chauffeur rates
        const { data, error } = await supabase
            .from('vehicles')
            .select(`
        *,
        chauffeur_rates!inner(vehicle_id)
      `)
            .eq('active', true)
            .eq('chauffeur_rates.active', true)

        if (error) {
            console.error('Error fetching chauffeur vehicles:', error)
            return []
        }

        return data?.map(v => ({
            id: v.id,
            name: v.name,
            seats: v.seats,
            image: v.image,
            description: v.description,
            features: v.features,
            category: v.category,
            active: v.active,
            created_at: v.created_at,
            updated_at: v.updated_at
        })) || []
    }
}

// Fetch self-drive rates for a vehicle
export async function getSelfDriveRates(vehicleId: string): Promise<SelfDriveRate | null> {
    const { data, error } = await supabase
        .from('self_drive_rates')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .eq('active', true)
        .single()

    if (error) {
        console.error('Error fetching self-drive rates:', error)
        return null
    }

    return data
}

// Fetch chauffeur rates for a vehicle
export async function getChauffeurRates(vehicleId: string): Promise<ChauffeurRate | null> {
    const { data, error } = await supabase
        .from('chauffeur_rates')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .eq('active', true)
        .single()

    if (error) {
        console.error('Error fetching chauffeur rates:', error)
        return null
    }

    return data
}

// Utility functions
export function calculateDays(startDate: string, endDate: string): number {
    if (!startDate || !endDate) return 1
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}

export function calculateHours(startTime: string, endTime: string): number {
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)

    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    let diffMinutes = endMinutes - startMinutes
    if (diffMinutes < 0) diffMinutes += 24 * 60 // Handle next day

    return Math.max(8, Math.ceil(diffMinutes / 60))
}

export function isOutstationService(serviceArea: ServiceArea): boolean {
    return serviceArea.outsideMumbai
}

// Calculate self-drive pricing
export async function calculateSelfDrivePrice(
    vehicleId: string,
    days: number,
    estimatedKms: number
): Promise<PricingBreakdown | null> {
    const rates = await getSelfDriveRates(vehicleId)
    if (!rates) return null

    let baseRate = 0
    if (estimatedKms <= 150) baseRate = rates.km150
    else if (estimatedKms <= 250) baseRate = rates.km250
    else baseRate = rates.km600

    const subtotal = baseRate * days
    const gst = subtotal * 0.12 // 12% GST for self-drive
    const total = subtotal + gst

    return {
        baseRate,
        subtotal,
        gst,
        total,
        extraKmRate: rates.extra_km,
        extraHrRate: rates.extra_hr,
        isOutstation: false,
        totalKms: estimatedKms,
        totalHours: 0
    }
}

// Calculate chauffeur pricing
export async function calculateChauffeurPrice(
    vehicleId: string,
    days: number,
    hours: number,
    estimatedKms: number,
    serviceArea: ServiceArea
): Promise<PricingBreakdown | null> {
    const rates = await getChauffeurRates(vehicleId)
    if (!rates) return null

    const isOutstation = isOutstationService(serviceArea)
    let subtotal = 0
    let driverDA = 0

    if (isOutstation) {
        // Outstation: 300km per day minimum, additional km charges apply
        const minKmsPerDay = 300
        const totalMinKms = minKmsPerDay * days
        const actualKms = Math.max(estimatedKms, totalMinKms)

        subtotal = actualKms * rates.outstation_rate
        driverDA = rates.driver_da * days
    } else {
        // Within city: 8hrs/80km base, extra charges apply
        const baseHours = 8
        const baseKms = 80

        let dailyRate = rates.rate_8hrs_80km

        // Add extra hour charges
        if (hours > baseHours) {
            dailyRate += (hours - baseHours) * rates.extra_hr_rate
        }

        // Add extra km charges
        if (estimatedKms > baseKms) {
            dailyRate += (estimatedKms - baseKms) * rates.extra_km_rate
        }

        subtotal = dailyRate * days
    }

    const totalBeforeGST = subtotal + driverDA
    const gst = totalBeforeGST * 0.12 // 12% GST
    const total = totalBeforeGST + gst

    return {
        baseRate: isOutstation ? rates.outstation_rate : rates.rate_8hrs_80km,
        subtotal,
        gst,
        total,
        extraKmRate: rates.extra_km_rate,
        extraHrRate: rates.extra_hr_rate,
        driverDA,
        isOutstation,
        totalKms: estimatedKms,
        totalHours: hours
    }
}

// Save booking to database
export async function saveBooking(bookingData: Omit<BookingData, 'id'>): Promise<BookingData | null> {
    const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single()

    if (error) {
        console.error('Error saving booking:', error)
        return null
    }

    return data
}

// Save contact message to database
export async function saveContactMessage(contactData: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage | null> {
    const { data, error } = await supabase
        .from('contact_messages')
        .insert([contactData])
        .select()
        .single()

    if (error) {
        console.error('Error saving contact message:', error)
        return null
    }

    return data
}
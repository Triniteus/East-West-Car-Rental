// app/(admin)/admin/vehicles/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Search,
    Car,
    Users,
    Fuel,
    Settings,
    Edit,
    Eye,
    ToggleLeft,
    ToggleRight,
    IndianRupee,
    Plus,
    Save,
    X,
    Download
} from 'lucide-react'

interface Vehicle {
    id: string
    name: string
    category: string
    seats: number
    fuel_type: string
    transmission: string
    ac: boolean
    description?: string
    features?: string[]
    image_url?: string
    active: boolean
    created_at: string
    updated_at: string
}

interface SelfDriveRate {
    id: number
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
    active: boolean
    created_at: string
    updated_at: string
}

interface ChauffeurRate {
    id: number
    vehicle_id: string
    rate_8hrs_80km: number
    extra_km_rate: number
    extra_hr_rate: number
    outstation_rate: number
    driver_da: number
    active: boolean
    created_at: string
    updated_at: string
}

interface VehicleRates {
    selfDriveRates: { [key: string]: SelfDriveRate }
    chauffeurRates: { [key: string]: ChauffeurRate }
}

export default function AdminVehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [rates, setRates] = useState<VehicleRates>({ selfDriveRates: {}, chauffeurRates: {} })
    const [loading, setLoading] = useState(true)
    const [ratesLoading, setRatesLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
    const [editingSelfDriveRates, setEditingSelfDriveRates] = useState<SelfDriveRate | null>(null)
    const [editingChauffeurRates, setEditingChauffeurRates] = useState<ChauffeurRate | null>(null)
    const [showAddVehicle, setShowAddVehicle] = useState(false)
    const [updating, setUpdating] = useState(false)

    const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
        name: '',
        category: '',
        seats: 4,
        fuel_type: 'Petrol',
        transmission: 'Manual',
        ac: true,
        description: '',
        features: [],
        active: true
    })

    useEffect(() => {
        fetchVehicles()
        fetchRates()
    }, [])

    const fetchVehicles = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/vehicles')
            const data = await response.json()

            if (data.success) {
                setVehicles(data.vehicles || [])
            } else {
                // Mock data fallback
                setVehicles([
                    {
                        id: 'swift-dzire',
                        name: 'Swift Dzire',
                        category: 'Sedan',
                        seats: 4,
                        fuel_type: 'Petrol',
                        transmission: 'Manual',
                        ac: true,
                        description: 'Comfortable sedan perfect for city rides',
                        features: ['AC', 'Power Steering', 'Music System'],
                        active: true,
                        created_at: '2024-01-01T00:00:00Z',
                        updated_at: '2024-01-01T00:00:00Z'
                    },
                    {
                        id: 'innova-crysta',
                        name: 'Toyota Innova Crysta',
                        category: 'SUV',
                        seats: 7,
                        fuel_type: 'Diesel',
                        transmission: 'Automatic',
                        ac: true,
                        description: 'Premium SUV for family trips',
                        features: ['AC', 'Power Steering', 'Music System', 'GPS'],
                        active: true,
                        created_at: '2024-01-01T00:00:00Z',
                        updated_at: '2024-01-01T00:00:00Z'
                    }
                ])
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error)
            setVehicles([])
        } finally {
            setLoading(false)
        }
    }

    const fetchRates = async () => {
        setRatesLoading(true)
        try {
            const response = await fetch('/api/admin/vehicles/rates')
            const data = await response.json()

            if (data.success) {
                setRates({
                    selfDriveRates: data.selfDriveRates || {},
                    chauffeurRates: data.chauffeurRates || {}
                })
            } else {
                // Mock rates fallback based on your actual schema
                setRates({
                    selfDriveRates: {
                        'swift-dzire': {
                            id: 1,
                            vehicle_id: 'swift-dzire',
                            km150: 2500,
                            km250: 3500,
                            km600: 5000,
                            deposit: 15000,
                            monthly_rate: 45000,
                            monthly_km_limit: 3000,
                            monthly_deposit: 25000,
                            extra_km: 12,
                            extra_hr: 150,
                            active: true,
                            created_at: '2024-01-01T00:00:00Z',
                            updated_at: '2024-01-01T00:00:00Z'
                        },
                        'innova-crysta': {
                            id: 2,
                            vehicle_id: 'innova-crysta',
                            km150: 4000,
                            km250: 5500,
                            km600: 8000,
                            deposit: 25000,
                            monthly_rate: 75000,
                            monthly_km_limit: 3000,
                            monthly_deposit: 35000,
                            extra_km: 18,
                            extra_hr: 200,
                            active: true,
                            created_at: '2024-01-01T00:00:00Z',
                            updated_at: '2024-01-01T00:00:00Z'
                        }
                    },
                    chauffeurRates: {
                        'swift-dzire': {
                            id: 1,
                            vehicle_id: 'swift-dzire',
                            rate_8hrs_80km: 3500,
                            extra_km_rate: 15,
                            extra_hr_rate: 200,
                            outstation_rate: 12,
                            driver_da: 500,
                            active: true,
                            created_at: '2024-01-01T00:00:00Z',
                            updated_at: '2024-01-01T00:00:00Z'
                        },
                        'innova-crysta': {
                            id: 2,
                            vehicle_id: 'innova-crysta',
                            rate_8hrs_80km: 5500,
                            extra_km_rate: 22,
                            extra_hr_rate: 300,
                            outstation_rate: 18,
                            driver_da: 600,
                            active: true,
                            created_at: '2024-01-01T00:00:00Z',
                            updated_at: '2024-01-01T00:00:00Z'
                        }
                    }
                })
            }
        } catch (error) {
            console.error('Error fetching rates:', error)
            setRates({ selfDriveRates: {}, chauffeurRates: {} })
        } finally {
            setRatesLoading(false)
        }
    }

    const toggleVehicleStatus = async (vehicleId: string, currentStatus: boolean) => {
        setUpdating(true)
        try {
            const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !currentStatus })
            })

            if (response.ok) {
                await fetchVehicles()
                // Update selected vehicle if it's the one being updated
                if (selectedVehicle && selectedVehicle.id === vehicleId) {
                    setSelectedVehicle({ ...selectedVehicle, active: !currentStatus })
                }
            } else {
                alert('Failed to update vehicle status')
            }
        } catch (error) {
            console.error('Error updating vehicle status:', error)
            alert('Error updating vehicle status')
        } finally {
            setUpdating(false)
        }
    }

    const handleAddVehicle = async () => {
        if (!newVehicle.name || !newVehicle.category) {
            alert('Please fill in required fields')
            return
        }

        setUpdating(true)
        try {
            const response = await fetch('/api/admin/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVehicle)
            })

            if (response.ok) {
                await fetchVehicles()
                setShowAddVehicle(false)
                setNewVehicle({
                    name: '',
                    category: '',
                    seats: 4,
                    fuel_type: 'Petrol',
                    transmission: 'Manual',
                    ac: true,
                    description: '',
                    features: [],
                    active: true
                })
            } else {
                alert('Failed to add vehicle')
            }
        } catch (error) {
            console.error('Error adding vehicle:', error)
            alert('Error adding vehicle')
        } finally {
            setUpdating(false)
        }
    }

    const handleUpdateVehicle = async () => {
        if (!editingVehicle) return

        setUpdating(true)
        try {
            const response = await fetch(`/api/admin/vehicles/${editingVehicle.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingVehicle)
            })

            if (response.ok) {
                await fetchVehicles()
                setEditingVehicle(null)
                setSelectedVehicle(editingVehicle)
            } else {
                alert('Failed to update vehicle')
            }
        } catch (error) {
            console.error('Error updating vehicle:', error)
            alert('Error updating vehicle')
        } finally {
            setUpdating(false)
        }
    }

    const handleUpdateSelfDriveRates = async () => {
        if (!editingSelfDriveRates) return

        setUpdating(true)
        try {
            const response = await fetch(`/api/admin/vehicles/rates/self-drive`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingSelfDriveRates)
            })

            if (response.ok) {
                await fetchRates()
                setEditingSelfDriveRates(null)
            } else {
                alert('Failed to update self-drive rates')
            }
        } catch (error) {
            console.error('Error updating self-drive rates:', error)
            alert('Error updating self-drive rates')
        } finally {
            setUpdating(false)
        }
    }

    const handleUpdateChauffeurRates = async () => {
        if (!editingChauffeurRates) return

        setUpdating(true)
        try {
            const response = await fetch(`/api/admin/vehicles/rates/chauffeur`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingChauffeurRates)
            })

            if (response.ok) {
                await fetchRates()
                setEditingChauffeurRates(null)
            } else {
                alert('Failed to update chauffeur rates')
            }
        } catch (error) {
            console.error('Error updating chauffeur rates:', error)
            alert('Error updating chauffeur rates')
        } finally {
            setUpdating(false)
        }
    }

    const handleExport = async () => {
        try {
            const response = await fetch('/api/admin/vehicles/export')
            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.style.display = 'none'
                a.href = url
                a.download = `vehicles-${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
            } else {
                alert('Failed to export vehicles')
            }
        } catch (error) {
            console.error('Error exporting vehicles:', error)
            alert('Error exporting vehicles')
        }
    }

    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.category.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === 'all' || vehicle.category.toLowerCase() === categoryFilter.toLowerCase()
        return matchesSearch && matchesCategory
    })

    const getStatusColor = (active: boolean) => {
        return active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }

    const categories = [...new Set(vehicles.map(v => v.category))]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
                    <p className="text-gray-600 mt-1">Manage your fleet and pricing</p>
                </div>
                <div className="flex space-x-2">
                    <Button
                        onClick={handleExport}
                        variant="outline"
                        className="bg-blue-50 hover:bg-blue-100"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                    <Button
                        onClick={() => setShowAddVehicle(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vehicle
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Car className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                                <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <ToggleRight className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {vehicles.filter(v => v.active).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Settings className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Categories</p>
                                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Users className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Seats</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {vehicles.reduce((sum, v) => sum + v.seats, 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search by vehicle name or category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Vehicles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="animate-pulse">
                                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : filteredVehicles.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <Car className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Try adjusting your search or filters.
                        </p>
                    </div>
                ) : (
                    filteredVehicles.map((vehicle) => (
                        <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                {/* Vehicle Image */}
                                <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                                    {vehicle.image_url ? (
                                        <img
                                            src={vehicle.image_url}
                                            alt={vehicle.name}
                                            className="h-full w-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <Car className="h-16 w-16 text-gray-400" />
                                    )}
                                </div>

                                {/* Vehicle Info */}
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
                                            <p className="text-sm text-gray-500">{vehicle.category}</p>
                                        </div>
                                        <Badge className={getStatusColor(vehicle.active)}>
                                            {vehicle.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>

                                    {/* Vehicle Specs */}
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <Users className="h-4 w-4 mr-1" />
                                            {vehicle.seats} seats
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Fuel className="h-4 w-4 mr-1" />
                                            {vehicle.fuel_type}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Settings className="h-4 w-4 mr-1" />
                                            {vehicle.transmission}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <span className="text-xs">❄️</span>
                                            <span className="ml-1">{vehicle.ac ? 'AC' : 'Non-AC'}</span>
                                        </div>
                                    </div>

                                    {/* Pricing Preview */}
                                    {!ratesLoading && (rates.selfDriveRates[vehicle.id] || rates.chauffeurRates[vehicle.id]) && (
                                        <div className="border-t pt-3">
                                            <p className="text-xs text-gray-500 mb-2">Starting from:</p>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                {rates.selfDriveRates[vehicle.id] && (
                                                    <div>
                                                        <span className="text-gray-600">Self-Drive:</span>
                                                        <div className="font-semibold text-emerald-600">
                                                            ₹{rates.selfDriveRates[vehicle.id].km150?.toLocaleString()}
                                                        </div>
                                                    </div>
                                                )}
                                                {rates.chauffeurRates[vehicle.id] && (
                                                    <div>
                                                        <span className="text-gray-600">Chauffeur:</span>
                                                        <div className="font-semibold text-blue-600">
                                                            ₹{rates.chauffeurRates[vehicle.id].rate_8hrs_80km?.toLocaleString()}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedVehicle(vehicle)}
                                            className="flex-1"
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleVehicleStatus(vehicle.id, vehicle.active)}
                                            disabled={updating}
                                            className="flex-1"
                                        >
                                            {vehicle.active ? (
                                                <ToggleLeft className="h-4 w-4 mr-1" />
                                            ) : (
                                                <ToggleRight className="h-4 w-4 mr-1" />
                                            )}
                                            {updating ? 'Updating...' : (vehicle.active ? 'Disable' : 'Enable')}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Add Vehicle Modal */}
            {showAddVehicle && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Vehicle</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAddVehicle(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <Input
                                    value={newVehicle.name || ''}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                                    placeholder="e.g., Swift Dzire"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={newVehicle.category || ''}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Hatchback">Hatchback</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Luxury">Luxury</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                                <Input
                                    type="number"
                                    min="2"
                                    max="15"
                                    value={newVehicle.seats || 4}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, seats: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                                <select
                                    value={newVehicle.fuel_type || 'Petrol'}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, fuel_type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="CNG">CNG</option>
                                    <option value="Electric">Electric</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                                <select
                                    value={newVehicle.transmission || 'Manual'}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, transmission: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="Manual">Manual</option>
                                    <option value="Automatic">Automatic</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">AC</label>
                                <select
                                    value={newVehicle.ac ? 'true' : 'false'}
                                    onChange={(e) => setNewVehicle({ ...newVehicle, ac: e.target.value === 'true' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={newVehicle.description || ''}
                                onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                rows={3}
                                placeholder="Brief description of the vehicle"
                            />
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setShowAddVehicle(false)}
                                disabled={updating}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddVehicle}
                                disabled={updating || !newVehicle.name || !newVehicle.category}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {updating ? 'Adding...' : 'Add Vehicle'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Vehicle Detail Modal */}
            {selectedVehicle && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-5 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 shadow-lg rounded-md bg-white max-h-[95vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{selectedVehicle.name}</h3>
                                <p className="text-gray-600">{selectedVehicle.category}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(selectedVehicle.active)}>
                                    {selectedVehicle.active ? 'Active' : 'Inactive'}
                                </Badge>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedVehicle(null)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Vehicle Details */}
                            <div className="lg:col-span-1">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold text-gray-900">Vehicle Details</h4>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setEditingVehicle({ ...selectedVehicle })
                                            setSelectedVehicle(null)
                                        }}
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-3 text-sm">
                                        <div className="p-3 bg-gray-50 rounded">
                                            <span className="text-gray-600">Name:</span>
                                            <div className="font-semibold">{selectedVehicle.name}</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded">
                                            <span className="text-gray-600">Category:</span>
                                            <div className="font-semibold">{selectedVehicle.category}</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded">
                                            <span className="text-gray-600">Seats:</span>
                                            <div className="font-semibold">{selectedVehicle.seats}</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded">
                                            <span className="text-gray-600">Fuel Type:</span>
                                            <div className="font-semibold">{selectedVehicle.fuel_type}</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded">
                                            <span className="text-gray-600">Transmission:</span>
                                            <div className="font-semibold">{selectedVehicle.transmission}</div>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded">
                                            <span className="text-gray-600">AC:</span>
                                            <div className="font-semibold">{selectedVehicle.ac ? 'Yes' : 'No'}</div>
                                        </div>
                                    </div>

                                    {selectedVehicle.description && (
                                        <div className="p-3 bg-gray-50 rounded">
                                            <span className="text-gray-600 text-sm">Description:</span>
                                            <p className="mt-1 text-sm">{selectedVehicle.description}</p>
                                        </div>
                                    )}

                                    {selectedVehicle.features && selectedVehicle.features.length > 0 && (
                                        <div className="p-3 bg-gray-50 rounded">
                                            <span className="text-gray-600 text-sm">Features:</span>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {selectedVehicle.features.map((feature, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
                                        <div>Created: {new Date(selectedVehicle.created_at).toLocaleDateString()}</div>
                                        <div>Updated: {new Date(selectedVehicle.updated_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Self-Drive Rates */}
                            <div className="lg:col-span-1">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold text-gray-900">Self-Drive Rates</h4>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const currentRates = rates.selfDriveRates[selectedVehicle.id]
                                            if (currentRates) {
                                                setEditingSelfDriveRates(currentRates)
                                            } else {
                                                setEditingSelfDriveRates({
                                                    id: 0,
                                                    vehicle_id: selectedVehicle.id,
                                                    km150: 0,
                                                    km250: 0,
                                                    km600: 0,
                                                    deposit: 0,
                                                    monthly_rate: 0,
                                                    monthly_km_limit: 3000,
                                                    monthly_deposit: 0,
                                                    extra_km: 0,
                                                    extra_hr: 0,
                                                    active: true,
                                                    created_at: new Date().toISOString(),
                                                    updated_at: new Date().toISOString()
                                                })
                                            }
                                            setSelectedVehicle(null)
                                        }}
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        {rates.selfDriveRates[selectedVehicle.id] ? 'Edit' : 'Add'} Rates
                                    </Button>
                                </div>

                                {ratesLoading ? (
                                    <div className="animate-pulse space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                ) : rates.selfDriveRates[selectedVehicle.id] ? (
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <h5 className="font-medium text-emerald-700 mb-3">Daily Packages</h5>
                                            <div className="grid grid-cols-1 gap-2">
                                                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded">
                                                    <span>150 km package:</span>
                                                    <span className="font-semibold text-emerald-600">
                                                        ₹{rates.selfDriveRates[selectedVehicle.id].km150.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded">
                                                    <span>250 km package:</span>
                                                    <span className="font-semibold text-emerald-600">
                                                        ₹{rates.selfDriveRates[selectedVehicle.id].km250.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded">
                                                    <span>600 km package:</span>
                                                    <span className="font-semibold text-emerald-600">
                                                        ₹{rates.selfDriveRates[selectedVehicle.id].km600.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                                                    <span>Security Deposit:</span>
                                                    <span className="font-semibold text-orange-600">
                                                        ₹{rates.selfDriveRates[selectedVehicle.id].deposit.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="font-medium text-blue-700 mb-3">Monthly Package</h5>
                                            <div className="grid grid-cols-1 gap-2">
                                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                                                    <span>Monthly Rate:</span>
                                                    <span className="font-semibold text-blue-600">
                                                        ₹{rates.selfDriveRates[selectedVehicle.id].monthly_rate.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                                                    <span>Km Limit:</span>
                                                    <span className="font-semibold">
                                                        {rates.selfDriveRates[selectedVehicle.id].monthly_km_limit.toLocaleString()} km
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                                                    <span>Monthly Deposit:</span>
                                                    <span className="font-semibold text-orange-600">
                                                        ₹{rates.selfDriveRates[selectedVehicle.id].monthly_deposit.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="font-medium text-red-700 mb-3">Extra Charges</h5>
                                            <div className="grid grid-cols-1 gap-2">
                                                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                                                    <span>Extra Km:</span>
                                                    <span className="font-semibold text-red-600">
                                                        ₹{rates.selfDriveRates[selectedVehicle.id].extra_km}/km
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                                                    <span>Extra Hour:</span>
                                                    <span className="font-semibold text-red-600">
                                                        ₹{rates.selfDriveRates[selectedVehicle.id].extra_hr}/hr
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-8">
                                        <IndianRupee className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                                        <p>No self-drive rates available</p>
                                        <p className="text-sm mt-1">Click "Add Rates" to set pricing</p>
                                    </div>
                                )}
                            </div>

                            {/* Chauffeur Rates */}
                            <div className="lg:col-span-1">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold text-gray-900">Chauffeur Rates</h4>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const currentRates = rates.chauffeurRates[selectedVehicle.id]
                                            if (currentRates) {
                                                setEditingChauffeurRates(currentRates)
                                            } else {
                                                setEditingChauffeurRates({
                                                    id: 0,
                                                    vehicle_id: selectedVehicle.id,
                                                    rate_8hrs_80km: 0,
                                                    extra_km_rate: 0,
                                                    extra_hr_rate: 0,
                                                    outstation_rate: 0,
                                                    driver_da: 0,
                                                    active: true,
                                                    created_at: new Date().toISOString(),
                                                    updated_at: new Date().toISOString()
                                                })
                                            }
                                            setSelectedVehicle(null)
                                        }}
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        {rates.chauffeurRates[selectedVehicle.id] ? 'Edit' : 'Add'} Rates
                                    </Button>
                                </div>

                                {ratesLoading ? (
                                    <div className="animate-pulse space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                ) : rates.chauffeurRates[selectedVehicle.id] ? (
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <h5 className="font-medium text-blue-700 mb-3">Basic Package</h5>
                                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                                                <span>8 Hours / 80 Km:</span>
                                                <span className="font-semibold text-blue-600">
                                                    ₹{rates.chauffeurRates[selectedVehicle.id].rate_8hrs_80km.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="font-medium text-red-700 mb-3">Extra Charges</h5>
                                            <div className="grid grid-cols-1 gap-2">
                                                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                                                    <span>Extra Km:</span>
                                                    <span className="font-semibold text-red-600">
                                                        ₹{rates.chauffeurRates[selectedVehicle.id].extra_km_rate}/km
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                                                    <span>Extra Hour:</span>
                                                    <span className="font-semibold text-red-600">
                                                        ₹{rates.chauffeurRates[selectedVehicle.id].extra_hr_rate}/hr
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="font-medium text-purple-700 mb-3">Outstation</h5>
                                            <div className="grid grid-cols-1 gap-2">
                                                <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                                                    <span>Outstation Rate:</span>
                                                    <span className="font-semibold text-purple-600">
                                                        ₹{rates.chauffeurRates[selectedVehicle.id].outstation_rate}/km
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                                                    <span>Driver DA:</span>
                                                    <span className="font-semibold text-purple-600">
                                                        ₹{rates.chauffeurRates[selectedVehicle.id].driver_da}/day
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-8">
                                        <Users className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                                        <p>No chauffeur rates available</p>
                                        <p className="text-sm mt-1">Click "Add Rates" to set pricing</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setSelectedVehicle(null)}
                            >
                                Close
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditingVehicle({ ...selectedVehicle })
                                    setSelectedVehicle(null)
                                }}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Vehicle
                            </Button>
                            <Button
                                onClick={() => toggleVehicleStatus(selectedVehicle.id, selectedVehicle.active)}
                                disabled={updating}
                                className={selectedVehicle.active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                            >
                                {updating ? 'Updating...' : (selectedVehicle.active ? 'Disable' : 'Enable')} Vehicle
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Vehicle Modal */}
            {editingVehicle && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Vehicle</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingVehicle(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <Input
                                    value={editingVehicle.name}
                                    onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={editingVehicle.category}
                                    onChange={(e) => setEditingVehicle({ ...editingVehicle, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="Hatchback">Hatchback</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Luxury">Luxury</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                                <Input
                                    type="number"
                                    min="2"
                                    max="15"
                                    value={editingVehicle.seats}
                                    onChange={(e) => setEditingVehicle({ ...editingVehicle, seats: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                                <select
                                    value={editingVehicle.fuel_type}
                                    onChange={(e) => setEditingVehicle({ ...editingVehicle, fuel_type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="CNG">CNG</option>
                                    <option value="Electric">Electric</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                                <select
                                    value={editingVehicle.transmission}
                                    onChange={(e) => setEditingVehicle({ ...editingVehicle, transmission: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="Manual">Manual</option>
                                    <option value="Automatic">Automatic</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">AC</label>
                                <select
                                    value={editingVehicle.ac ? 'true' : 'false'}
                                    onChange={(e) => setEditingVehicle({ ...editingVehicle, ac: e.target.value === 'true' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={editingVehicle.description || ''}
                                onChange={(e) => setEditingVehicle({ ...editingVehicle, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setEditingVehicle(null)}
                                disabled={updating}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdateVehicle}
                                disabled={updating}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {updating ? 'Updating...' : 'Update Vehicle'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Self-Drive Rates Modal */}
            {editingSelfDriveRates && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-5 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[95vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Self-Drive Rates</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingSelfDriveRates(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {/* Daily Packages */}
                            <div>
                                <h4 className="font-medium text-emerald-700 mb-3">Daily Packages</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">150 km package (₹)</label>
                                        <Input
                                            type="number"
                                            value={editingSelfDriveRates.km150}
                                            onChange={(e) => setEditingSelfDriveRates({
                                                ...editingSelfDriveRates,
                                                km150: parseInt(e.target.value) || 0
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">250 km package (₹)</label>
                                        <Input
                                            type="number"
                                            value={editingSelfDriveRates.km250}
                                            onChange={(e) => setEditingSelfDriveRates({
                                                ...editingSelfDriveRates,
                                                km250: parseInt(e.target.value) || 0
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">600 km package (₹)</label>
                                        <Input
                                            type="number"
                                            value={editingSelfDriveRates.km600}
                                            onChange={(e) => setEditingSelfDriveRates({
                                                ...editingSelfDriveRates,
                                                km600: parseInt(e.target.value) || 0
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)</label>
                                        <Input
                                            type="number"
                                            value={editingSelfDriveRates.deposit}
                                            onChange={(e) => setEditingSelfDriveRates({
                                                ...editingSelfDriveRates,
                                                deposit: parseInt(e.target.value) || 0
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Package */}
                            <div>
                                <h4 className="font-medium text-blue-700 mb-3">Monthly Package</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rate (₹)</label>
                                        <Input
                                            type="number"
                                            value={editingSelfDriveRates.monthly_rate}
                                            onChange={(e) => setEditingSelfDriveRates({
                                                ...editingSelfDriveRates,
                                                monthly_rate: parseInt(e.target.value) || 0
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Km Limit</label>
                                        <Input
                                            type="number"
                                            value={editingSelfDriveRates.monthly_km_limit}
                                            onChange={(e) => setEditingSelfDriveRates({
                                                ...editingSelfDriveRates,
                                                monthly_km_limit: parseInt(e.target.value) || 0
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Deposit (₹)</label>
                                        <Input
                                            type="number"
                                            value={editingSelfDriveRates.monthly_deposit}
                                            onChange={(e) => setEditingSelfDriveRates({
                                                ...editingSelfDriveRates,
                                                monthly_deposit: parseInt(e.target.value) || 0
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Extra Charges */}
                            <div>
                                <h4 className="font-medium text-red-700 mb-3">Extra Charges</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Extra Km Rate (₹/km)</label>
                                        <Input
                                            type="number"
                                            value={editingSelfDriveRates.extra_km}
                                            onChange={(e) => setEditingSelfDriveRates({
                                                ...editingSelfDriveRates,
                                                extra_km: parseInt(e.target.value) || 0
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Extra Hour Rate (₹/hr)</label>
                                        <Input
                                            type="number"
                                            value={editingSelfDriveRates.extra_hr}
                                            onChange={(e) => setEditingSelfDriveRates({
                                                ...editingSelfDriveRates,
                                                extra_hr: parseInt(e.target.value) || 0
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setEditingSelfDriveRates(null)}
                                disabled={updating}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdateSelfDriveRates}
                                disabled={updating}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {updating ? 'Saving...' : 'Save Rates'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Chauffeur Rates Modal */}
            {editingChauffeurRates && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-5 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[95vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Chauffeur Rates</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingChauffeurRates(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {/* Basic Package */}
                            <div>
                                <h4 className="font-medium text-blue-700 mb-3">Basic Package</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">8 Hours / 80 Km Rate (₹)</label>
                                    <Input
                                        type="number"
                                        value={editingChauffeurRates.rate_8hrs_80km}
                                        onChange={(e) => setEditingChauffeurRates({
                                            ...editingChauffeurRates,
                                            rate_8hrs_80km: parseInt(e.target.value) || 0
                                        })}
                                        placeholder="e.g., 3500"
                                    />
                                </div>
                            </div>

                            {/* Extra Charges */}
                            <div>
                                <h4 className="font-medium text-red-700 mb-3">Extra Charges</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Extra Km Rate (₹/km)</label>
                                        <Input
                                            type="number"
                                            value={editingChauffeurRates.extra_km_rate}
                                            onChange={(e) => setEditingChauffeurRates({
                                                ...editingChauffeurRates,
                                                extra_km_rate: parseInt(e.target.value) || 0
                                            })}
                                            placeholder="e.g., 15"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Extra Hour Rate (₹/hr)</label>
                                        <Input
                                            type="number"
                                            value={editingChauffeurRates.extra_hr_rate}
                                            onChange={(e) => setEditingChauffeurRates({
                                                ...editingChauffeurRates,
                                                extra_hr_rate: parseInt(e.target.value) || 0
                                            })}
                                            placeholder="e.g., 200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Outstation Rates */}
                            <div>
                                <h4 className="font-medium text-purple-700 mb-3">Outstation Rates</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Outstation Rate (₹/km)</label>
                                        <Input
                                            type="number"
                                            value={editingChauffeurRates.outstation_rate}
                                            onChange={(e) => setEditingChauffeurRates({
                                                ...editingChauffeurRates,
                                                outstation_rate: parseInt(e.target.value) || 0
                                            })}
                                            placeholder="e.g., 12"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Driver DA (₹/day)</label>
                                        <Input
                                            type="number"
                                            value={editingChauffeurRates.driver_da}
                                            onChange={(e) => setEditingChauffeurRates({
                                                ...editingChauffeurRates,
                                                driver_da: parseInt(e.target.value) || 0
                                            })}
                                            placeholder="e.g., 500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setEditingChauffeurRates(null)}
                                disabled={updating}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdateChauffeurRates}
                                disabled={updating}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {updating ? 'Saving...' : 'Save Rates'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useTRPC } from '../../../../trpc/react'
import { PropertyFilters } from 'utils/validation/types'
import { LocationObject, PropertyObject } from 'utils/validation/types'
import { LocationSelector } from '@/components/basics/locationSelector'
import { Facilities, FacilitiesSet } from 'utils/validation/propertyFilters.ts'
import { trpcRouter } from 'trpc/router'
import { createServerFn } from '@tanstack/react-start'


export const getInitialFilterData = createServerFn().handler(async () => {
    const caller = trpcRouter.createCaller({})

    console.log('running')
    const res = await caller.properties.list({})

    return res as PropertyObject[]
})


export const Route = createFileRoute('/app/properties/')({
    component: PropertiesRoute,
    loader: async () => {
        const data = await getInitialFilterData()

        return data
    }
})


function PropertiesRoute() {

    const propertiesRecieved = Route.useLoaderData()
    const trpc = useTRPC()

    const [properties, setProperties] = useState<PropertyObject[]>(propertiesRecieved)

    useEffect(() => {
        setProperties(propertiesRecieved)

        // const { data: properties, isLoading, error } = trpc.properties.list.useQuery(filters)
    }, [propertiesRecieved])


    const [filters, setFilters] = useState<PropertyFilters>({})
    const [location, setLocation] = useState<LocationObject | undefined>()



    // Update filters when location changes
    useEffect(() => {
        if (location) {
            setFilters(prev => ({
                ...prev,
                location: {
                    city: location.city,
                    state: location.state,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    radius: 10 // Default 10km radius
                }
            }))
        }
    }, [location])


    const handleFilterChange = (newFilters: Partial<PropertyFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }))
    }



    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Cele mai potrivite proprietăți pentru tine</h1>

            {/* Filters Section */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <div className="flex flex-wrap gap-4 mb-4">
                    {/* Property Type Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Property Type</label>
                        <select
                            multiple
                            className="bg-gray-800 text-white rounded px-3 py-2"
                            onChange={(e) => {
                                const values = Array.from(e.target.selectedOptions, option => option.value) as ('apartment' | 'house' | 'hotel' | 'office')[]
                                handleFilterChange({ propertyType: values })
                            }}
                        >
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="hotel">Hotel</option>
                            <option value="office">Office</option>
                        </select>
                    </div>

                    {/* Budget Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Budget Range</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="bg-gray-800 text-white rounded px-3 py-2 w-24"
                                onChange={(e) => {
                                    const min = e.target.value ? parseInt(e.target.value) : undefined
                                    handleFilterChange({
                                        budget: { ...filters.budget, min }
                                    })
                                }}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="bg-gray-800 text-white rounded px-3 py-2 w-24"
                                onChange={(e) => {
                                    const max = e.target.value ? parseInt(e.target.value) : undefined
                                    handleFilterChange({
                                        budget: { ...filters.budget, max }
                                    })
                                }}
                            />
                        </div>
                    </div>

                    {/* Number of Rooms Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Number of Rooms</label>
                        <select
                            multiple
                            className="bg-gray-800 text-white rounded px-3 py-2"
                            onChange={(e) => {
                                const values = Array.from(e.target.selectedOptions, option => parseInt(option.value))
                                handleFilterChange({ numberOfRooms: values })
                            }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                <option key={num} value={num}>{num} rooms</option>
                            ))}
                        </select>
                    </div>

                    {/* Facilities Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Facilities</label>
                        <select
                            multiple
                            className="bg-gray-800 text-white rounded px-3 py-2"
                            onChange={(e) => {
                                const values = Array.from(e.target.selectedOptions, option => option.value)
                                handleFilterChange({ facilities: values as (typeof Facilities[number])[] })
                            }}
                        >
                            <option value="parking">Parking</option>
                            <option value="balcony">Balcony</option>
                            <option value="terrace">Terrace</option>
                            <option value="garden">Garden</option>
                            <option value="elevator">Elevator</option>
                            <option value="air_conditioning">Air conditioning</option>
                            <option value="central_heating">Central heating</option>
                            <option value="furnished">Furnished</option>
                            <option value="internet">Internet</option>
                        </select>
                    </div>
                </div>

                {/* Location Selector */}
                <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <LocationSelector
                        locationObject={location}
                        setLocationObject={setLocation}
                    />
                </div>

                <button
                    className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
                    onClick={() => setFilters({})}
                >
                    Clear Filters
                </button>
            </div>

            {/* Properties Grid */}
            {/*isLoading ? (
                <div>Loading properties...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties?.map((property) => (
                        <div key={property._id} className="bg-gray-800 rounded-lg overflow-hidden">
                            <div className="bg-gray-600 h-48 flex items-center justify-center">
                                <span className="text-gray-400">Property Photo</span>
                            </div>

                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                                        100% Match
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                                <p className="text-2xl font-bold mb-2">€{property.price.value.toLocaleString()}</p>

                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span>📏 {property.surfaceArea}m²</span>
                                    <span>🛏️ {property.numberOfRooms} rooms</span>
                                    <span>📍 {property.location.city}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )*/}

            {properties && properties.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-400">No properties found matching your criteria.</p>
                </div>
            )}
        </div>
    )
}

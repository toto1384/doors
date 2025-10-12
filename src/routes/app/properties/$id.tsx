import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useTRPC } from '../../../../trpc/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Calendar, DollarSign, MapPin, Bed, Home, Car, TreePine, Wind, PawPrint, ChevronLeft, ArrowLeft, Share2, MessageCircle, Phone } from 'lucide-react'
import { PropertyObject } from 'utils/validation/types'
import { trpcRouter } from 'trpc/router'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v3'
import { GoogleMapPreview } from '@/components/maps/GoogleMapPreview'


const getProperty = createServerFn().validator((params) => z.object({ id: z.string() }).parse(params)).handler(async ({ data: { id } }) => {
    const caller = trpcRouter.createCaller({ user: undefined, headers: undefined })
    const result = await caller.properties.byId({ id })
    return result as { property: PropertyObject, favorited: boolean }
})

export const Route = createFileRoute('/app/properties/$id')({
    component: PropertyDetailRoute,
    loader: async ({ params }) => {
        console.log('params', params)
        const result = await getProperty({ data: params })

        return result
    }
})

function PropertyDetailRoute() {
    const { id } = Route.useParams()
    const loaderData = Route.useLoaderData()
    const property = loaderData.property
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [notes, setNotes] = useState('')
    const [isSaved, setIsSaved] = useState(loaderData.favorited)

    const trpc = useTRPC()
    const setFavoriteMutation = useMutation(trpc.properties.setPropertyFavorite.mutationOptions({
        onSuccess: () => {
            setIsSaved(!isSaved)
        }
    }))

    const handleFavoriteToggle = () => {
        setFavoriteMutation.mutate({ propertyId: id, favorite: !isSaved })
    }

    return (
        <div className="min-h-screen text-white overflow-y-auto">
            {/* Header */}
            <PropertyHeader
                isSaved={isSaved}
                onFavoriteToggle={handleFavoriteToggle}
            />

            {/* Image Gallery */}
            <PropertyImageGallery property={property} />

            {/* Property Info */}
            <PropertyInfo property={property} />

            {/* Owner Section */}
            <OwnerSection />

            {/* Content Sections */}
            <div className="px-4 space-y-8">
                <OverviewSection property={property} />

                <FeaturesSection property={property} />

                <LocationSection property={property} />

                <OtherDetailsSection property={property} />
            </div>
        </div>
    )
}



// Utility functions
const getFeatureIcon = (feature: string) => {
    switch (feature) {
        case 'parking-included':
            return <Car className="w-4 h-4" />
        case 'balcony':
            return <Home className="w-4 h-4" />
        case 'air-conditioning':
            return <Wind className="w-4 h-4" />
        case 'pet-friendly':
            return <PawPrint className="w-4 h-4" />
        case 'garden':
            return <TreePine className="w-4 h-4" />
        default:
            return <Home className="w-4 h-4" />
    }
}

const getFeatureLabel = (feature: string) => {
    switch (feature) {
        case 'parking-included':
            return 'Parking'
        case 'balcony':
            return 'Balcony'
        case 'air-conditioning':
            return 'Air Conditioning'
        case 'pet-friendly':
            return 'Pet Friendly'
        case 'garden':
            return 'Garden'
        case 'furnished':
            return 'Furnished'
        default:
            return feature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
}


// Component: Property Header
function PropertyHeader({ isSaved, onFavoriteToggle }: {
    isSaved: boolean
    onFavoriteToggle: () => void
}) {
    const router = useRouter()

    return (
        <div className="flex items-center justify-between p-4 ">
            <button
                onClick={() => router.history.back()}
                className="p-2 hover:bg-purple-800/30 rounded-lg"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
                <button
                    onClick={onFavoriteToggle}
                    className={`p-2 hover:bg-purple-800/30 rounded-lg ${isSaved ? 'text-red-500' : 'text-white'}`}
                >
                    <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                </button>

                <button className="p-2 hover:bg-purple-800/30 rounded-lg">
                    <Share2 className="w-6 h-6" />
                </button>

                <Button className="bg-[#7B31DC] hover:bg-[#6A2BC4] text-white px-4 py-2 rounded-lg">
                    Editează proprietate
                </Button>

                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg">
                    Vezi oferte
                </Button>
            </div>
        </div>
    )
}

// Component: Property Images Gallery
function PropertyImageGallery({
    property
}: {
    property: PropertyObject
}) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    return (
        <div className="px-4 mb-6">
            {/* Main Image */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-2">
                    <div className="bg-gray-800 rounded-lg overflow-hidden h-80 flex items-center justify-center">
                        <img
                            src={property.imageUrls[selectedImageIndex] || property.imageUrls[0]}
                            className="w-full h-full object-cover"
                            alt="Property main view"
                        />
                    </div>
                </div>

                {/* Right side images */}
                <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg overflow-hidden h-[152px]">
                        <img
                            src={property.imageUrls[1] || property.imageUrls[0]}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                            onClick={() => setSelectedImageIndex(1)}
                            alt="Property view 2"
                        />
                    </div>
                    <div className="bg-gray-800 rounded-lg overflow-hidden h-[152px]">
                        <img
                            src={property.imageUrls[2] || property.imageUrls[0]}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                            onClick={() => setSelectedImageIndex(2)}
                            alt="Property view 3"
                        />
                    </div>
                </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 overflow-x-auto">
                {property.imageUrls.slice(0, 4).map((url, index) => (
                    <div
                        key={index}
                        className={`flex-shrink-0 w-16 h-16 bg-gray-800 rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImageIndex === index ? 'border-[#7B31DC]' : 'border-transparent'
                            }`}
                        onClick={() => setSelectedImageIndex(index)}
                    >
                        <img src={url} className="w-full h-full object-cover" alt={`Thumbnail ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    )
}

// Component: Property Info
function PropertyInfo({ property }: { property: PropertyObject }) {
    return (
        <div className="px-4 mb-6">
            <h1 className="text-2xl font-medium text-white mb-2">{property.title}</h1>
            <div className="text-3xl font-semibold text-[#7B31DC] mb-4">
                ${property.price.value.toLocaleString()}
            </div>

            {/* Property specifications horizontal layout */}
            <div className="flex items-center gap-6 text-white">
                <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-[#7B31DC]" />
                    <span>{property.numberOfRooms} Beds</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#7B31DC]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8,14A2,2 0 0,0 6,16A2,2 0 0,0 8,18A2,2 0 0,0 10,16A2,2 0 0,0 8,14M16,14A2,2 0 0,0 14,16A2,2 0 0,0 16,18A2,2 0 0,0 18,16A2,2 0 0,0 16,14M4,4V6H20V4H4M20,7H4V8H20V7M11,9H13V12H16V14H13V17H11V14H8V12H11V9Z" />
                    </svg>
                    <span>{property.numberOfBathrooms || 1} bath</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#7B31DC]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2,2V4H4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V4H22V2H2M6,4H18V20H6V4M8,6V18H10V6H8M12,6V18H14V6H12M16,6V18H18V6H16Z" />
                    </svg>
                    <span>{property.surfaceArea} sqft</span>
                </div>
            </div>
        </div>
    )
}

// Component: Owner Section
function OwnerSection() {
    return (
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-800">
            <div>
                <h2 className="text-lg font-medium text-white mb-4">Owner</h2>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src="/api/placeholder/48/48"
                            alt="Irene Patte"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-[#1A0F33]"></div>
                    </div>
                    <div>
                        <h3 className="text-white font-medium">Irene Patte</h3>
                        <p className="text-gray-400 text-sm">Member since 2018</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-3 bg-[#7B31DC] hover:bg-[#6A2BC4] rounded-full">
                    <MessageCircle className="w-5 h-5 text-white" />
                </button>
                <button className="p-3 bg-[#7B31DC] hover:bg-[#6A2BC4] rounded-full">
                    <Phone className="w-5 h-5 text-white" />
                </button>
            </div>
        </div>
    )
}

// Component: Overview Section
function OverviewSection({ property }: { property: PropertyObject }) {
    return (
        <div>
            <h2 className="text-xl font-medium text-white mb-4">Overview</h2>
            <p className="text-gray-300 leading-relaxed">
                {property.description}
            </p>
            <button className="text-[#7B31DC] mt-2 hover:underline">
                Read more...
            </button>
        </div>
    )
}

// Component: Location Section
function LocationSection({ property }: { property: PropertyObject }) {
    return (
        <div>
            <h2 className="text-xl font-medium text-white mb-4">Location</h2>
            <div className="flex items-center gap-2 text-gray-300 mb-4">
                <MapPin className="w-5 h-5 text-[#7B31DC]" />
                <span>Via Alessandro Volta, Italy</span>
            </div>
            <div className="bg-gray-800 rounded-lg h-64 overflow-hidden">
                <GoogleMapPreview
                    location={property.location}
                    height="256px"
                    zoom={16}
                    showMarker={true}
                />
            </div>
        </div>
    )
}

// Component: Other Details Section
function OtherDetailsSection({ property }: { property: PropertyObject }) {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-medium text-white mb-4">Alte detalii</h2>
            <ul className="space-y-2 text-gray-300">
                <li>• Lorem ipsum dolor sit amet</li>
                <li>• consectetur. Facilisis dolor</li>
                <li>• amet ipsum urna nunc</li>
                <li>• gi Nisl eu egestas massa.</li>
            </ul>
        </div>
    )
}

// Component: Features Section  
function FeaturesSection({ property }: { property: PropertyObject }) {
    const features = [
        { icon: <Car className="w-6 h-6" />, label: "Car Parking" },
        { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" /></svg>, label: "Swimming..." },
        { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7.5,12A2.5,2.5 0 0,1 10,9.5A2.5,2.5 0 0,1 12.5,12A2.5,2.5 0 0,1 10,14.5A2.5,2.5 0 0,1 7.5,12M20,4V20H4V4H20M22,2H2V22H22V2Z" /></svg>, label: "Gym & Fitne..." },
        { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2Z" /></svg>, label: "Sport Center" },
        { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" /></svg>, label: "Laundry" },
        { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" /></svg>, label: "Wi-fi & Ne..." },
        { icon: <PawPrint className="w-6 h-6" />, label: "Pet Center" },
        { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8.1,13.34L3.91,9.16C2.35,7.59 2.35,5.06 3.91,3.5L10.93,10.5L8.1,13.34M14.88,11.53C16.71,12.37 18.13,13.72 19.13,15.1C20.27,16.69 20.27,18.8 19.13,20.39C18.5,21.33 17.39,21.84 16.21,21.84C15.03,21.84 13.92,21.33 13.29,20.39C12.15,18.8 12.15,16.69 13.29,15.1C14.29,13.72 15.71,12.37 14.88,11.53Z" /></svg>, label: "Restaurant" }
    ]

    return (
        <div>
            <h2 className="text-xl font-medium text-white mb-6">Features</h2>
            <div className="grid grid-cols-4 gap-6">
                {features.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-[#2A1F3D] rounded-lg flex items-center justify-center text-[#7B31DC] mb-2">
                            {feature.icon}
                        </div>
                        <span className="text-xs text-gray-400">{feature.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}


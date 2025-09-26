import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useTRPC } from '../../../../trpc/react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Calendar, DollarSign, MapPin, Bed, Home, Car, TreePine, Wind, PawPrint, ChevronLeft, ArrowLeft } from 'lucide-react'
import { PropertyObject } from 'utils/validation/types'
import { trpcRouter } from 'trpc/router'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v3'
import { GoogleMapPreview } from '@/components/maps/GoogleMapPreview'


const getProperty = createServerFn().validator((params) => z.object({ id: z.string() }).parse(params)).handler(async ({ data: { id } }) => {
    const caller = trpcRouter.createCaller({})
    const property = await caller.properties.byId({ id })
    return property as PropertyObject
})

export const Route = createFileRoute('/app/properties/$id')({
    component: PropertyDetailRoute,
    loader: async ({ params }) => {
        const property = await getProperty({ data: params })

        return property
    }
})

function PropertyDetailRoute() {
    const { id } = Route.useParams()
    const property = Route.useLoaderData()
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [notes, setNotes] = useState('')
    const [isSaved, setIsSaved] = useState(false)

    return (
        <div className="min-h-screen flex flex-col">
            <BreadcrumbNavigation />

            <div className="container mx-auto px-6 py-6">
                <PropertyHeader
                    property={property}
                    isSaved={isSaved}
                    setIsSaved={setIsSaved}
                />

                <PropertyImageGallery property={property} />

                <PropertyActionButtons
                    isSaved={isSaved}
                    setIsSaved={setIsSaved}
                />

                <LocationSection property={property} />

                <DescriptionSection property={property} />

                <FeaturesSection property={property} />

                <AIMarketInsights />

                <NotesSection notes={notes} setNotes={setNotes} />
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

// Component: Breadcrumb Navigation
function BreadcrumbNavigation() {
    const router = useRouter()

    return (
        <div className="container mx-auto px-6 py-4 border-b border-[#404040]">
            <div className="flex items-center space-x-2 text-sm text-[#a3a3a3]">
                <Link to="/app" className="hover:text-[color:var(--foreground)] mt-0.5">Home</Link>
                <span className='text-xl'>›</span>
                <Link to="/app/properties" className="hover:text-[color:var(--foreground)] mt-0.5">Listings</Link>
                <span className='text-xl'>›</span>
                <span className=" text-[color:var(--foreground)] mt-0.5">Property Details</span>
            </div>

            <Link
                to="/app/properties"
                className="flex items-center space-x-2 mt-4 text-[#a3a3a3] hover:text-[color:var(--foreground)]"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Listings</span>
            </Link>
        </div>
    )
}

// Component: Property Header
function PropertyHeader({ property, isSaved, setIsSaved }: {
    property: PropertyObject
    isSaved: boolean
    setIsSaved: (saved: boolean) => void
}) {

    const trpc = useTRPC()

    // const useSaveMutation = trpc.properties.saveProperty.useMutation()

    return (
        <div className="flex items-start justify-between mb-6 border-b border-[#404040] pb-4">
            <div>
                <h1 className="text-3xl font-normal mb-2">{property.title}</h1>
                <p className="a3Text mb-3">{property.location.streetAddress}, {property.location.city}</p>
                <div className="text-4xl font-normal a3Text">
                    €{property.price.value.toLocaleString()}
                </div>
                <div className="flex items-center mt-2 space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                        <img src="/icons/bedIcon.svg" className="w-4 h-4" />
                        <span>{property.numberOfRooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <img src="/icons/surfaceArea.svg" className="w-4 h-4" />
                        <span>{property.surfaceArea} sq ft</span>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`mt-2 p-2 rounded-full ${isSaved ? 'text-red-500' : 'text-gray-400 hover:text-[color:var(--foreground)]'}`}
                >
                    <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                </button>
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
    return (
        <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-[#404040] ">
            <div className="col-span-4">
                <div className="bg-gray-800 rounded-lg overflow-hidden h-96 flex items-center justify-center">
                    <img src={property.imageUrls[0]} className="w-full h-full object-cover" />
                </div>
            </div>
            {property.imageUrls.map((url, index) => (
                <div
                    key={index}
                    className="bg-gray-800 rounded-lg h-30 flex items-center justify-center cursor-pointer hover:bg-gray-700"
                >
                    <img src={url} className="w-full rounded-lg h-full object-cover" />
                </div>
            ))}
        </div>
    )
}

// Component: Action Buttons
function PropertyActionButtons({ isSaved, setIsSaved }: {
    isSaved: boolean
    setIsSaved: (saved: boolean) => void
}) {
    return (
        <div className="flex grow-1 w-full space-x-4 mb-6 pb-6 border-b border-[#404040]">
            <Button
                variant="outline"
                className="flex w-[32%] grow-1 items-center space-x-2 bg-muted dark:border-gray-600 hover:bg-muted-foreground"
                onClick={() => setIsSaved(!isSaved)}
            >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                <span>Save Property</span>
            </Button>
            <Button
                variant="outline"
                className="flex w-[32%] grow-1 items-center space-x-2 bg-muted dark:border-gray-600 hover:bg-muted-foreground"
            >
                <Calendar className="w-4 h-4" />
                <span>Schedule Viewing</span>
            </Button>
            <Button
                variant="outline"
                className="flex w-[32%] grow-1 items-center space-x-2 bg-muted darkborder-gray-600 hover:bg-muted-foreground"
            >
                <DollarSign className="w-4 h-4" />
                <span>Make Offer</span>
            </Button>
        </div>
    )
}

// Component: Location Section
function LocationSection({ property }: { property: PropertyObject }) {
    return (<div className='flex flex-col mb-6 pb-6 border-b border-[#404040]'>
        <h2 className="text-lg mb-3.5 text-foreground">Location</h2>
        <p className="a3Text mb-2">
            {property.location.streetAddress}, {property.location.city}, {property.location.zipCode}
        </p>
        <GoogleMapPreview
            location={property.location}
            height="256px"
            zoom={16}
            showMarker={true}
        />

    </div>
    )
}

// Component: Description Section
function DescriptionSection({ property }: { property: PropertyObject }) {
    return (
        <div className='flex flex-col items-start mb-6 pb-6 border-b border-[#404040]'>
            <h2 className="text-foreground text-lg">Description</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
                {property.description}
            </p>
            {/* <button className="a3Text mt-2"> */}
            {/*     Read more... */}
            {/* </button> */}

        </div>
    )
}

// Component: Features Section
function FeaturesSection({ property }: { property: PropertyObject }) {
    return (
        <div className="flex flex-col items-start mb-6 pb-6 border-b border-[#404040]">
            <h2 className="text-foreground text-lg mb-2">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-input/30 rounded-lg">
                        {getFeatureIcon(feature)}
                        <span className="text-sm">{getFeatureLabel(feature)}</span>
                    </div>
                ))}
                {property.furnished && (
                    <div className="flex items-center space-x-2 p-3 bg-input/30 rounded-lg">
                        <Home className="w-4 h-4" />
                        <span className="text-sm">Furnished</span>
                    </div>
                )}
            </div>
        </div>
    )
}

// Component: AI Market Insights
function AIMarketInsights() {
    return (
        <div className="flex flex-col items-start mb-6 pb-6 border-b border-[#404040]">
            <h2 className="text-foreground text-lg mb-2">AI Market Insights</h2>
            <div className='flex flex-row items-start gap-3 bg-input/30 w-full border border-input/30 dark:border-input rounded-lg p-3.5 mb-4'>
                <img src="/icons/idea.svg" className="w-4 h-4 mt-1.5 text-green-400" />
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="a3Text font-light">Recommended Bid Range</span>
                    </div>
                    <p className="text-foreground/70 mb-2">
                        Based on recent sales in this area, consider bidding between €720,000 - €740,000 for a competitive offer.
                    </p>
                    <button className="a3Text hover:text-blue-300">
                        Learn more about this recommendation
                    </button>
                </div>
            </div>
        </div>
    )
}

// Component: Notes Section
function NotesSection({ notes, setNotes }: {
    notes: string
    setNotes: (notes: string) => void
}) {
    return (
        <div className="flex flex-col items-start mb-6 pb-6 border-b border-[#404040]">
            <CardTitle className="text-foreground text-lg">Your Notes</CardTitle>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your thoughts about this property..."
                className="w-full h-32 p-3 bg-input/30 border border-input/30 dark:border-input rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end mt-4">
                <Button
                    className="bg-input dark:bg-input/30 hover:bg-input/40 dark:hover:bg-input/40 text-foreground"
                    onClick={() => {
                        console.log('Saving notes:', notes)
                    }}
                >
                    Save Notes
                </Button>
            </div>
        </div>
    )
}


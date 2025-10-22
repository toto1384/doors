import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { useTRPC } from '../../../../trpc/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Calendar, DollarSign, MapPin, Bed, Home, ChevronLeft, ArrowLeft, Share2, MessageCircle, Phone, Check, Copy, Star, Play } from 'lucide-react'
import { PropertyObject, UserObject } from 'utils/validation/types'
import { trpcRouter } from 'trpc/router'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v3'
import { GoogleMapPreview } from '@/components/maps/GoogleMapPreview'
import { formatPrice } from 'utils/mainUtils'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getHeaders } from '@tanstack/react-start/server'
import { auth } from 'utils/auth'
import { BathIcon, BedIcon, PropertyFeatureIcon, SurfaceAreaIcon } from '@/components/icons/propertyIcons'
import { format } from 'date-fns'
import { useSize } from 'utils/hooks/useSize'


const getProperty = createServerFn().validator((params) => z.object({ id: z.string() }).parse(params)).handler(async ({ data: { id } }) => {

    const headers = getHeaders()

    const h = new Headers()
    Object.entries(headers).filter(r => r[1]).map(r => h.append(r[0], r[1]!))

    const sessionData = await auth.api.getSession({ headers: h })

    const caller = trpcRouter.createCaller({ user: sessionData?.user, headers: h })
    const result = await caller.properties.byId({ id })
    return result as { property: PropertyObject, favorited: boolean, propertyUser: UserObject }
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
    const imageUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2017/17_04_cat_bg_03.jpg";


    return (
        <div className="min-h-screen md:border md:ounded-lg md:mx-3 text-white overflow-y-auto ">

            <PropertyHeader
                isSaved={isSaved}
                onFavoriteToggle={handleFavoriteToggle}
                property={property}
            />
            {/* Image Gallery */}
            <PropertyImageGallery property={property} />

            <div className="grid grid-cols-1 m:grid-cols-3">

                <div className='md:col-spa-2'>

                    {/* Property Info */}
                    <PropertyInfo property={property} />


                    <OverviewSection property={property} />

                    <FeaturesSection property={property} />

                    <LocationSection property={property} />

                </div>
                {/* Content Sections */}
                <div className="px-4 space-y-8">
                    {/* Owner Section */}
                    {/* <OwnerSection owner={loaderData.propertyUser} /> */}



                </div>
            </div>
        </div>
    )
}


// Component: Property Header
function PropertyHeader({ isSaved, onFavoriteToggle, property }: {
    isSaved: boolean
    onFavoriteToggle: () => void
    property: PropertyObject
}) {
    const router = useRouter()
    const { t } = useTranslation('translation', { keyPrefix: 'property-page.share' })
    const [isSharing, setIsSharing] = useState(false)

    const handleShare = async () => {
        setIsSharing(true)

        try {
            const shareUrl = window.location.href
            const shareData = {
                title: property.title,
                text: `Check out this property: ${property.title} - ${formatPrice(property.price)}`,
                url: shareUrl
            }

            // Check if Web Share API is available
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData)
            } else {
                // Fallback: Copy to clipboard
                await navigator.clipboard.writeText(shareUrl)
                toast.success(t('linkCopied'))
            }
        } catch (error: any) {
            // Handle user cancellation or other errors
            if (error?.name !== 'AbortError') {
                try {
                    // Fallback: Try to copy to clipboard
                    await navigator.clipboard.writeText(window.location.href)
                    toast.success(t('linkCopied'))
                } catch (clipboardError) {
                    toast.error(t('copyError'))
                }
            }
        } finally {
            setIsSharing(false)
        }
    }

    return (
        <div className="absolute md:relative flex left-0 right-0 items-center md:border-b mb-4 justify-between p-4 ">
            <button
                onClick={() => router.history.back()}
                className=" ml-2 hover:bg-purple-800/30 rounded-lg relative"
            >
                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ mixBlendMode: 'difference', backdropFilter: 'blur(100px) grayscale(1) contrast(100)', clipPath: 'url(#back-arrow-clip)', backgroundColor: 'white' }}>
                    <defs>
                        <clipPath id="back-arrow-clip">
                            <path d="M3.9334 9H16.1084V7H3.9334L9.5334 1.4L8.1084 0L0.108398 8L8.1084 16L9.5334 14.6L3.9334 9Z" fill="#0B0014" />
                        </clipPath>
                    </defs>
                </svg>

                {/* <ArrowLeft className="w-5 text-white mix-blend-difference h-5 relative " /> */}
            </button>

            <div className="flex items-center gap-3">
                <button
                    onClick={onFavoriteToggle}
                    className={`p-1 md:bg-white/5 hover:bg-purple-800/30 rounded-full ${isSaved ? 'text-red-500' : 'text-white'}`}
                >
                    <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className='scale-125 mt-2' style={{ mixBlendMode: 'difference', backdropFilter: 'blur(100px) grayscale(1) contrast(100)', clipPath: 'url(#heart-clip)', backgroundColor: 'white' }}>
                        <defs>
                            <clipPath id="heart-clip">
                                {isSaved && <path d="M7.05625 13.6315L6.97813 13.5596L1.50312 8.4752C0.54375 7.58458 0 6.33458 0 5.0252V4.92208C0 2.72208 1.5625 0.834577 3.725 0.422077C4.95625 0.184577 6.21562 0.468952 7.21875 1.1752C7.5 1.3752 7.7625 1.60645 8 1.87208C8.13125 1.72208 8.27188 1.58458 8.42188 1.45645C8.5375 1.35645 8.65625 1.2627 8.78125 1.1752C9.78438 0.468952 11.0437 0.184577 12.275 0.418952C14.4375 0.831452 16 2.72208 16 4.92208V5.0252C16 6.33458 15.4563 7.58458 14.4969 8.4752L9.02188 13.5596L8.94375 13.6315C8.6875 13.869 8.35 14.0033 8 14.0033C7.65 14.0033 7.3125 13.8721 7.05625 13.6315Z" fill="white" />}

                                {!isSaved &&
                                    <path d="M7.05625 13.6315L6.97813 13.5596L1.50312 8.4752C0.54375 7.58458 0 6.33458 0 5.0252V4.92208C0 2.72208 1.5625 0.834577 3.725 0.422077C4.95625 0.184577 6.21562 0.468952 7.21875 1.1752C7.5 1.3752 7.7625 1.60645 8 1.87208C8.13125 1.72208 8.27188 1.58458 8.42188 1.45645C8.5375 1.35645 8.65625 1.2627 8.78125 1.1752C9.78438 0.468952 11.0437 0.184577 12.275 0.418952C14.4375 0.831452 16 2.72208 16 4.92208V5.0252C16 6.33458 15.4563 7.58458 14.4969 8.4752L9.02188 13.5596L8.94375 13.6315C8.6875 13.869 8.35 14.0033 8 14.0033C7.65 14.0033 7.3125 13.8721 7.05625 13.6315ZM7.47188 3.53145C7.45938 3.52208 7.45 3.50958 7.44063 3.49708L6.88438 2.87208L6.88125 2.86895C6.15937 2.05958 5.06875 1.69083 4.00625 1.89395C2.55 2.17208 1.5 3.44083 1.5 4.92208V5.0252C1.5 5.91583 1.87188 6.76895 2.525 7.3752L8 12.4596L13.475 7.3752C14.1281 6.76895 14.5 5.91583 14.5 5.0252V4.92208C14.5 3.44395 13.45 2.17208 11.9969 1.89395C10.9344 1.69083 9.84062 2.0627 9.12187 2.86895C9.12187 2.86895 9.12187 2.86895 9.11875 2.87208C9.11562 2.8752 9.11875 2.87208 9.11563 2.8752L8.55937 3.5002C8.55 3.5127 8.5375 3.52208 8.52812 3.53458C8.3875 3.6752 8.19687 3.75333 8 3.75333C7.80312 3.75333 7.6125 3.6752 7.47188 3.53458V3.53145Z" fill="white" />
                                }
                            </clipPath>
                        </defs>
                    </svg>

                </button>

                <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="p-1.5 mr-3 md:mr-0 bg-white/5 hover:bg-purple-800/30 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    title={t('title')}
                >
                    {isSharing ? (
                        <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ mixBlendMode: 'difference', backdropFilter: 'blur(100px) grayscale(1) contrast(100)', clipPath: 'url(#share-clip)', backgroundColor: 'white' }}>
                            <defs>
                                <clipPath id="share-clip">

                                    <path d="M15.1084 20C14.2751 20 13.5667 19.7083 12.9834 19.125C12.4001 18.5417 12.1084 17.8333 12.1084 17C12.1084 16.9 12.1334 16.6667 12.1834 16.3L5.1584 12.2C4.89173 12.45 4.5834 12.6458 4.2334 12.7875C3.8834 12.9292 3.5084 13 3.1084 13C2.27507 13 1.56673 12.7083 0.983398 12.125C0.400065 11.5417 0.108398 10.8333 0.108398 10C0.108398 9.16667 0.400065 8.45833 0.983398 7.875C1.56673 7.29167 2.27507 7 3.1084 7C3.5084 7 3.8834 7.07083 4.2334 7.2125C4.5834 7.35417 4.89173 7.55 5.1584 7.8L12.1834 3.7C12.1501 3.58333 12.1292 3.47083 12.1209 3.3625C12.1126 3.25417 12.1084 3.13333 12.1084 3C12.1084 2.16667 12.4001 1.45833 12.9834 0.875C13.5667 0.291667 14.2751 0 15.1084 0C15.9417 0 16.6501 0.291667 17.2334 0.875C17.8167 1.45833 18.1084 2.16667 18.1084 3C18.1084 3.83333 17.8167 4.54167 17.2334 5.125C16.6501 5.70833 15.9417 6 15.1084 6C14.7084 6 14.3334 5.92917 13.9834 5.7875C13.6334 5.64583 13.3251 5.45 13.0584 5.2L6.0334 9.3C6.06673 9.41667 6.08757 9.52917 6.0959 9.6375C6.10423 9.74583 6.1084 9.86667 6.1084 10C6.1084 10.1333 6.10423 10.2542 6.0959 10.3625C6.08757 10.4708 6.06673 10.5833 6.0334 10.7L13.0584 14.8C13.3251 14.55 13.6334 14.3542 13.9834 14.2125C14.3334 14.0708 14.7084 14 15.1084 14C15.9417 14 16.6501 14.2917 17.2334 14.875C17.8167 15.4583 18.1084 16.1667 18.1084 17C18.1084 17.8333 17.8167 18.5417 17.2334 19.125C16.6501 19.7083 15.9417 20 15.1084 20ZM15.1084 18C15.3917 18 15.6292 17.9042 15.8209 17.7125C16.0126 17.5208 16.1084 17.2833 16.1084 17C16.1084 16.7167 16.0126 16.4792 15.8209 16.2875C15.6292 16.0958 15.3917 16 15.1084 16C14.8251 16 14.5876 16.0958 14.3959 16.2875C14.2042 16.4792 14.1084 16.7167 14.1084 17C14.1084 17.2833 14.2042 17.5208 14.3959 17.7125C14.5876 17.9042 14.8251 18 15.1084 18ZM3.1084 11C3.39173 11 3.62923 10.9042 3.8209 10.7125C4.01257 10.5208 4.1084 10.2833 4.1084 10C4.1084 9.71667 4.01257 9.47917 3.8209 9.2875C3.62923 9.09583 3.39173 9 3.1084 9C2.82507 9 2.58757 9.09583 2.3959 9.2875C2.20423 9.47917 2.1084 9.71667 2.1084 10C2.1084 10.2833 2.20423 10.5208 2.3959 10.7125C2.58757 10.9042 2.82507 11 3.1084 11ZM15.1084 4C15.3917 4 15.6292 3.90417 15.8209 3.7125C16.0126 3.52083 16.1084 3.28333 16.1084 3C16.1084 2.71667 16.0126 2.47917 15.8209 2.2875C15.6292 2.09583 15.3917 2 15.1084 2C14.8251 2 14.5876 2.09583 14.3959 2.2875C14.2042 2.47917 14.1084 2.71667 14.1084 3C14.1084 3.28333 14.2042 3.52083 14.3959 3.7125C14.5876 3.90417 14.8251 4 15.1084 4Z" fill="#0B0014" />

                                </clipPath>
                            </defs>
                        </svg>

                    )}
                </button>

                {/* <Button className="bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] hover:bg-[#6A2BC4] text-white text-xs px-4 py-2 rounded-[6px]"> */}
                {/*     Editează proprietate */}
                {/* </Button> */}
                {/**/}
                {/* <button className="border-[#C1A7FF] border text-[#C1A7FF] hover:bg-gray-700 px-4 py-2 text-xs rounded-[6px]"> */}
                {/*     Vezi oferte */}
                {/* </button> */}
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


    const size = useSize(true)

    const nonSelected = property.imageUrls.filter((i, ind) => { return ind !== selectedImageIndex })


    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.id.split('-')[1]);
                    setSelectedImageIndex(index);
                }
            });
        }, { threshold: 0.5 });

        property.imageUrls.forEach((photo, index) => {
            const el = document.getElementById(`photo-${index}`);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="md:px-4 mb-6">
            {/* Main Image */}

            <div className='flex flex-row items-center snap-x snap-mandatory overflow-x-scroll md:hidden' >
                {property.imageUrls.map((i, ind) => <div className="bg-gray-800 snap-center min-w-[100dvw] mr-2 overflow-hidden h-80 flex items-center justify-center" id={`photo-${ind}`}><img src={i} className="w-full h-full object-cover" alt="Property main view" /></div>)}

            </div>
            <div className="hidden md:grid grid-cols-2 md:grid-cols-3 gap-3 mb-2 ">
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
                <div className="space-y-4 hidden md:block">
                    <div className="bg-gray-800 rounded-lg overflow-hidden h-[152px]">
                        <img
                            src={nonSelected[0]}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                            onClick={() => setSelectedImageIndex(0)}
                            alt="Property view 2"
                        />
                    </div>
                    <div className="bg-gray-800 rounded-lg overflow-hidden h-[152px]">
                        <img
                            src={nonSelected[1] || nonSelected[0]}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                            onClick={() => setSelectedImageIndex(1)}
                            alt="Property view 3"
                        />
                    </div>
                </div>
            </div>

            {/* Thumbnail Strip */}
            <div className=" gap-2 mt-2 overflow-x-auto flex px-4 md:px-0">
                {property.imageUrls.slice(0, 4).map((url, index) => (
                    <div
                        key={index}
                        className={`flex-shrink-0 w-16 h-16 bg-gray-800 rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImageIndex === index ? 'border-[#7B31DC]' : 'border-transparent'}`}
                        onClick={() => {
                            setSelectedImageIndex(index)
                            if (!size.gmd) document.querySelector(`#photo-${index}`)?.scrollIntoView({
                                behavior: 'smooth',
                                inline: 'center'
                            });
                        }}
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
            <h1 className="text-xl font-light text-white mb-2">{property.title}</h1>
            <div className="text-lg text-white mb-4">
                {formatPrice(property.price)}
            </div>

            {/* Property specifications horizontal layout */}
            <div className="flex items-center gap-6 text-white text-xs">
                <div className="flex items-center gap-2">
                    <BedIcon className="w-8 h-8 bg-white/5 p-2 rounded-full" color="#7B31DC" />
                    <span>{property.numberOfRooms} Beds</span>
                </div>
                <div className="flex items-center gap-2">
                    <BathIcon className="w-8 h-8 bg-white/5 p-2 rounded-full" color="#7B31DC" />
                    <span>{property.numberOfBathrooms || 1} bath</span>
                </div>
                <div className="flex items-center gap-2">
                    <SurfaceAreaIcon className="w-8 h-8 bg-white/5 p-2 rounded-full" color="#7B31DC" />
                    <span>{property.surfaceArea} sqft</span>
                </div>
            </div>
        </div>
    )
}

// Component: Owner Section
function OwnerSection({ owner }: { owner: UserObject }) {
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
                        <h3 className="text-white font-medium">{owner.name}</h3>
                        {owner.createdAt && <p className="text-gray-400 text-sm">Member since {format(new Date(owner.createdAt), 'yyyy')}</p>}
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
    const [isExpanded, setIsExpanded] = useState(false)
    const textRef = useRef<HTMLParagraphElement>(null)

    const checkIfTextOverflows = () => {
        if (textRef.current) {
            const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight)
            const actualHeight = textRef.current.scrollHeight
            const maxHeight = lineHeight * 2 // 2 lines

            return actualHeight > maxHeight
        }
        return false
    }

    useEffect(() => {
        // Force a check after component mounts to ensure proper calculation
        setTimeout(() => {
            if (textRef.current) {
                checkIfTextOverflows()
            }
        }, 0)
    }, [])

    const showReadMore = checkIfTextOverflows()

    return (
        <div className='px-4 mb-6'>
            <h2 className="text-base font-medium text-white mb-1">Overview</h2>
            <p
                ref={textRef}
                className={`text-[#919EAB] text-sm leading-relaxed ${!isExpanded && showReadMore
                    ? 'line-clamp-2'
                    : ''
                    }`}
            >
                {property.description}
            </p>
            {showReadMore && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[#7B31DC] mt-2 hover:underline"
                >
                    {isExpanded ? 'Read less...' : 'Read more...'}
                </button>
            )}
        </div>
    )
}

// Component: Location Section
function LocationSection({ property }: { property: PropertyObject }) {
    return (
        <div className='px-4 mb-6'>
            <h2 className="text-base font-medium text-white mb-4">Location</h2>
            <div className="flex items-center gap-1 text-[#919EAB] text-xs mb-2">
                <MapPin className="w-3 h-3 " />
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

// Component: Features Section  
function FeaturesSection({ property }: { property: PropertyObject }) {
    const { t } = useTranslation('translation', { keyPrefix: 'facilities' })

    return (
        <div className="px-4 mb-6">
            <h2 className="text-base font-medium text-white mb-2">Features</h2>
            <div className="flex flex-wrap gap-4">
                {property.features.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                        <div className="w-[50px] h-[50px] bg-[#120826] rounded-full flex items-center justify-center text-[#7B31DC] mb-2">
                            <PropertyFeatureIcon feature={feature} color={"#919EAB"} />
                        </div>
                        <span className="text-xs text-white">{t(feature, feature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()))}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}


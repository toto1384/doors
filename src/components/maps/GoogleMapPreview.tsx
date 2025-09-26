import React, { useEffect, useRef, useState } from 'react'
import { LocationObject } from 'utils/validation/types'
import { useGoogleMaps } from '@/components/providers/GoogleMapsProvider'
import { useTheme } from '@/components/providers/ThemeProvider'

// Dark theme styles for Google Maps
const darkMapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }]
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }]
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }]
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }]
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }]
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }]
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }]
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }]
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }]
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }]
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }]
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }]
    }
]

// Light theme styles (minimal styling, mostly default)
const lightMapStyles = [
    {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }]
    },
    {
        featureType: "poi.park",
        elementType: "labels.text",
        stylers: [{ visibility: "off" }]
    }
]

interface GoogleMapPreviewProps {
    location: LocationObject
    height?: string
    className?: string
    zoom?: number
    showMarker?: boolean
}

export function GoogleMapPreview({
    location,
    height = '300px',
    className = '',
    zoom = 15,
    showMarker = true
}: GoogleMapPreviewProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<google.maps.Map | null>(null)
    const markerRef = useRef<google.maps.Marker | null>(null)
    const [error, setError] = useState<string | null>(null)

    const { isLoaded, loadError } = useGoogleMaps()
    const { theme } = useTheme()

    useEffect(() => {
        if (loadError) {
            setError('Failed to load Google Maps')
            return
        }

        if (!isLoaded) {
            return
        }

        if (!location.latitude || !location.longitude) {
            setError('Invalid location coordinates')
            return
        }

        // Clean up existing map and marker before creating new ones
        if (markerRef.current) {
            markerRef.current.setMap(null)
            markerRef.current = null
        }
        if (mapInstanceRef.current) {
            mapInstanceRef.current = null
        }

        initializeMap()
    }, [isLoaded, loadError, location, zoom, theme])

    const initializeMap = () => {
        if (!mapRef.current || !window.google) return

        try {
            const mapOptions: google.maps.MapOptions = {
                center: {
                    lat: location.latitude,
                    lng: location.longitude
                },
                zoom: zoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: true,
                fullscreenControl: true,
                mapTypeControl: false,
                styles: theme === 'dark' ? darkMapStyles : lightMapStyles
            }

            mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions)

            if (showMarker) {
                // Create custom marker icon based on theme
                const markerColor = theme === 'dark' ? '#DC2626' : '#EF4444'
                const customIcon = {
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${markerColor}"/>
                        </svg>
                    `)}`,
                    scaledSize: new google.maps.Size(24, 24),
                    anchor: new google.maps.Point(12, 24)
                }

                markerRef.current = new google.maps.Marker({
                    position: {
                        lat: location.latitude,
                        lng: location.longitude
                    },
                    map: mapInstanceRef.current,
                    title: `${location.streetAddress}, ${location.city}`,
                    icon: customIcon
                })

                // Create themed info window content
                const infoWindowBg = theme === 'dark' ? '#262626' : '#ffffff'
                const infoWindowText = theme === 'dark' ? '#ffffff' : '#000000'
                const infoWindowSubtext = theme === 'dark' ? '#a3a3a3' : '#666666'

                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div style="padding: 8px; font-family: sans-serif; background: ${infoWindowBg}; color: ${infoWindowText};">
                            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: ${infoWindowText};">Property Location</h3>
                            <p style="margin: 0; font-size: 12px; color: ${infoWindowSubtext};">
                                ${location.streetAddress}<br>
                                ${location.city}, ${location.zipCode}
                            </p>
                        </div>
                    `
                })

                markerRef.current.addListener('click', () => {
                    infoWindow.open(mapInstanceRef.current, markerRef.current)
                })
            }

            setError(null)
        } catch (err) {
            console.error('Error initializing map:', err)
            setError('Failed to load map')
        }
    }

    if (error) {
        return (
            <div
                className={`bg-gray-700 rounded-lg flex items-center justify-center ${className}`}
                style={{ height }}
            >
                <div className="text-center">
                    <p className="text-gray-400 mb-2">Map Unavailable</p>
                    <p className="text-sm text-gray-500">{error}</p>
                </div>
            </div>
        )
    }

    if (loadError) {
        return (
            <div
                className={`bg-gray-700 rounded-lg flex items-center justify-center ${className}`}
                style={{ height }}
            >
                <div className="text-center">
                    <p className="text-gray-400 mb-2">Map Unavailable</p>
                    <p className="text-sm text-gray-500">Failed to load Google Maps</p>
                </div>
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div
                className={`bg-gray-700 rounded-lg flex items-center justify-center ${className}`}
                style={{ height }}
            >
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-gray-400">Loading map...</p>
                </div>
            </div>
        )
    }

    return (
        <div
            ref={mapRef}
            className={`rounded-lg overflow-hidden ${className}`}
            style={{ height }}
        />
    )
}
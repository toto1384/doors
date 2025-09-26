import React, { createContext, useContext } from 'react'
import { useLoadScript } from '@react-google-maps/api'

const libraries = ['places'] as const

interface GoogleMapsContextType {
    isLoaded: boolean
    loadError: Error | undefined
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
    isLoaded: false,
    loadError: undefined,
})

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
        libraries,
    })

    return (
        <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
            {children}
        </GoogleMapsContext.Provider>
    )
}

export function useGoogleMaps() {
    return useContext(GoogleMapsContext)
}
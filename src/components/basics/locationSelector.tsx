'use client';

import React, { useEffect, useState, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { LocationObject } from "utils/validation/types";
import { formatPlaceToLocationObject } from "utils/googleMapsUtils";

//https://medium.com/@mangergeorgepraise/integrating-google-places-autocomplete-api-for-form-filling-in-next-js-137ef1a2b7ee

interface GoogleMapsResult {
    address_components: {
        long_name: string;
        short_name: string;
        types: string[];
    }[];
    geometry: {
        location: {
            lat: () => number;
            lng: () => number;
        };
        viewport: {
            south: number;
            west: number;
            north: number;
            east: number;
        };
    };
    html_attributions: string[];
}


export const libraries = ["places"] as any;


export function LocationSelector(
    { locationObject, setLocationObject, width }:
        {
            locationObject: LocationObject | undefined,
            setLocationObject: (l: LocationObject | undefined) => void,
            className?: string
            width?: number
        }
) {

    const inputRef = useRef(null);


    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
        libraries,
    });

    const formData = (data: google.maps.places.PlaceResult) => {
        const locationObject = formatPlaceToLocationObject(data);
        setLocationObject(locationObject)
    };

    const handlePlaceChanged = async (address: any) => {
        if (!isLoaded) return;
        const place = address.getPlace()

        if (!place || !place.geometry) {
            // setInput({});
            return;
        }
        formData(place);
    };

    useEffect(() => {
        if (inputRef.current) (inputRef.current as any).value = locationObject?.fullLocationName || ''
    }, [locationObject])


    useEffect(() => {
        if (!isLoaded || loadError) return;

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current as any, {
            componentRestrictions: { country: "ro" },
            fields: ["address_components", "geometry"]
            // types
        });

        autocomplete.addListener("place_changed", () => handlePlaceChanged(autocomplete));

        // return () => autocomplete.removeListener("place_changed", handlePlaceChanged);
    }, [isLoaded, loadError]);



    return <>
        <input
            type="search"
            name="fullLocationName"
            autoComplete="off"
            onChange={(e) => {
                const value = e.target.value;
                // Detect when X button is clicked (value becomes empty)
                if (value === '') {
                    setLocationObject(undefined)
                    // Add your logic here
                }
            }}
            ref={inputRef}
            style={{ width: width }}
            className={' bg-input/30 dark:bg-[#404040] px-3 py-1.5 rounded'}
            placeholder="Enter Street Address"
            required
        />
    </>

}

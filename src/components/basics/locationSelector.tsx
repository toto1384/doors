'use client';

import React, { useEffect, useState, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { LocationObject } from "utils/validation/types";

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


export function LocationSelector({ locationObject, setLocationObject }: { locationObject: LocationObject | undefined, setLocationObject: React.Dispatch<React.SetStateAction<LocationObject | undefined>> }) {

    const inputRef = useRef(null);


    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
        libraries,
    });

    const formData = (data: GoogleMapsResult) => {
        console.log(data)
        const addressComponents = data?.address_components;

        const componentMap = {
            subPremise: "",
            premise: "",
            street_number: "",
            route: "",
            country: "",
            postal_code: "",
            administrative_area_level_2: "",
            administrative_area_level_1: "",
            countryShort: "",
            administrative_area_level_2Short: "",
            administrative_area_level_1Short: "",
        };

        for (const component of addressComponents) {
            const componentType = component.types[0];
            if (componentMap.hasOwnProperty(componentType)) {
                (componentMap as any)[componentType] = component.long_name;
                if (component.short_name) (componentMap as any)[`${componentType}Short`] = component.short_name;
            }
        }

        const formattedAddress =
            `${componentMap.subPremise} ${componentMap.premise} ${componentMap.street_number} ${componentMap.route}`.trim();
        const latitude = data?.geometry?.location?.lat();
        const longitude = data?.geometry?.location?.lng();

        setLocationObject((prev) => ({
            streetAddress: formattedAddress,
            country: componentMap.country,
            zipCode: componentMap.postal_code,
            city: componentMap.administrative_area_level_2,
            state: componentMap.administrative_area_level_1,
            stateShort: componentMap.administrative_area_level_1Short,
            countryShort: componentMap.countryShort,
            latitude: latitude,
            longitude: longitude,
            fullLocationName: `${formattedAddress}, ${componentMap.administrative_area_level_1Short}, ${componentMap.administrative_area_level_2Short}, ${componentMap.countryShort}`,
        }));
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
        if (!isLoaded || loadError) return;

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current as any, {
            componentRestrictions: { country: "ro" },
            fields: ["address_components", "geometry"],
            // types
        });

        autocomplete.addListener("place_changed", () => handlePlaceChanged(autocomplete));

        // return () => autocomplete.removeListener("place_changed", handlePlaceChanged);
    }, [isLoaded, loadError]);


    const className = ' w-3xl'

    return <div className="p-4 grid grid-cols-2 gap-5">
        <div className="flex flex-col w-full">
            <label className="text-md">Street address</label>
            <input
                type="search"
                name="fullLocationName"
                autoComplete="off"
                ref={inputRef}
                className={className}
                placeholder="Enter Street Address"
                required
            />
        </div>
    </div>

}

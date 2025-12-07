"use client";

import { useLoadScript } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatPlaceToLocationObject } from "@/utils/googleMapsUtils";
import { LocationObject } from "@/utils/validation/types";

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

export function LocationSelector({
	locationObject,
	setLocationObject,
	width,
	className,
}: {
	locationObject: LocationObject | undefined;
	setLocationObject: (l: LocationObject | undefined) => void;
	className?: string;
	width?: number | string;
}) {
	const inputRef = useRef(null);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
		libraries,
	});

	const formData = (data: google.maps.places.PlaceResult) => {
		const locationObject = formatPlaceToLocationObject(data);
		setLocationObject(locationObject);
	};

	const handlePlaceChanged = async (address: any) => {
		if (!isLoaded) return;
		const place = address.getPlace();

		if (!place || !place.geometry) {
			// setInput({});
			return;
		}
		formData(place);
	};

	useEffect(() => {
		if (inputRef.current) (inputRef.current as any).value = locationObject?.fullLocationName || "";
	}, [locationObject]);

	if (isLoaded && !loadError) {
		const autocomplete = new google.maps.places.Autocomplete(inputRef.current as any, {
			componentRestrictions: { country: "ro" },
			fields: ["address_components", "geometry"],
			// types
		});

		autocomplete.addListener("place_changed", () => handlePlaceChanged(autocomplete));
	}

	return (
		<>
			<input
				type="search"
				name="fullLocationName"
				autoComplete="off"
				onChange={(e) => {
					const value = e.target.value;
					// Detect when X button is clicked (value becomes empty)
					if (value === "") {
						setLocationObject(undefined);
						// Add your logic here
					}
				}}
				ref={inputRef}
				style={{ width: width }}
				className={cn(" bg-input/30 dark:bg-[#241540] px-3 py-1.5 rounded placeholder-white", className)}
				placeholder="Enter Street Address"
				required
			/>
		</>
	);
}

import { LocationObject } from './validation/types';

/**
 * Searches for a location using Google Maps Places API and returns the best match
 * @param searchString - The location string to search for
 * @returns Promise<LocationObject | null> - The best matching location or null if no match found
 */
export async function searchLocationByString(searchString: string): Promise<LocationObject | null> {
    return new Promise((resolve) => {
        if (!window.google) {
            console.error('Google Maps API not loaded');
            resolve(null);
            return;
        }

        const service = new google.maps.places.PlacesService(document.createElement('div'));


        console.log('searching for', searchString)
        service.textSearch({
            query: searchString,
            region: 'RO',
            // fields: ['address_components', 'geometry', 'place_id'],
        }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                console.log('results', results, status)
                const place = results[0] as any; // Type assertion for the result

                service.getDetails({
                    placeId: place.place_id,
                    fields: ['address_components', 'geometry', 'place_id'],
                }, (details, status) => {

                    if (!details || !details.geometry || !details.address_components) {
                        resolve(null);
                        return;
                    }

                    const locationObject = formatPlaceToLocationObject(details);
                    resolve(locationObject);
                })

            } else {
                console.warn('No results found for:', searchString);
                resolve(null);
            }
        });
    });
}

/**
 * Formats a Google Places result into our LocationObject format
 */
function formatPlaceToLocationObject(place: google.maps.places.PlaceResult): LocationObject {
    const addressComponents = place.address_components;

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

    for (const component of addressComponents ?? []) {
        const componentType = component.types[0];
        if (componentMap.hasOwnProperty(componentType)) {
            (componentMap as any)[componentType] = component.long_name;
            if (component.short_name) {
                (componentMap as any)[`${componentType}Short`] = component.short_name;
            }
        }
    }

    const formattedAddress =
        `${componentMap.subPremise} ${componentMap.premise} ${componentMap.street_number} ${componentMap.route}`.trim();
    const latitude = place.geometry?.location?.lat();
    const longitude = place.geometry?.location?.lng();

    return {
        streetAddress: formattedAddress,
        country: componentMap.country,
        zipCode: componentMap.postal_code,
        city: componentMap.administrative_area_level_2,
        state: componentMap.administrative_area_level_1,
        stateShort: componentMap.administrative_area_level_1Short,
        countryShort: componentMap.countryShort,
        latitude: latitude ?? 0,
        longitude: longitude ?? 0,
        fullLocationName: `${formattedAddress}, ${componentMap.administrative_area_level_1Short}, ${componentMap.administrative_area_level_2Short}, ${componentMap.countryShort}`,
    };
}


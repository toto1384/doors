import { z } from 'zod/v3';
import { extendZod } from "@zodyac/zod-mongoose";

extendZod(z as any);

// Available facility options based on common real estate features
export const Facilities = [
    'parking',
    'balcony',
    'terrace',
    'garden',
    'elevator',
    'air_conditioning',
    'central_heating',
    'furnished',
    'internet',
] as const


// Property filter schema based on the filters shown in the properties page
export const propertyFiltersSchema = z.object({
    propertyType: z.array(z.enum(['apartment', 'house', 'hotel', 'office'])).optional(), // Property type from PropertySchema
    budget: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
    }).optional(), // Budget range
    location: z.object({
        city: z.string().optional(),
        state: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        radius: z.number().optional(), // Search radius in km
    }).optional(), // Location using Google Maps data
    numberOfRooms: z.array(z.number()).optional(), // Number of rooms
    facilities: z.array(z.enum(Facilities)).optional(), // Facilities/amenities from property features
});



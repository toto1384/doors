import { z } from 'zod/v3';
import { LocationSchema } from './location';
import { PropertyType } from 'utils/constants';

// Available facility options based on common real estate features
export const Facilities = [
    'parking',
    'balcony',
    'terrace',
    'garden',
    'elevator',
    'air-conditioning',
    'central-heating',
    'furnished',
    'internet',
] as const

// Property filter schema based on the filters shown in the properties page
export const propertyFiltersSchema = z.object({
    propertyType: z.array(z.enum(PropertyType)).optional(), // Property type from PropertySchema
    surfaceArea: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
    }).optional(), // Surface area range
    budget: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
    }).optional(), // Budget range
    location: LocationSchema.optional(), // Location using Google Maps data
    numberOfRooms: z.array(z.number()).optional(), // Number of rooms
    facilities: z.array(z.enum(Facilities)).optional(), // Facilities/amenities from property features
});



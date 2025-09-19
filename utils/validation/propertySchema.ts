

import { z } from 'zod/v3';
import { LocationSchema } from './location';
import { extendZod } from "@zodyac/zod-mongoose";

extendZod(z as any);



// Enum for property status
const PropertyStatus = z.enum(['available', 'sold', 'pending', 'rented', 'off-market']);


export const UserSchema = z.object({
    _id: z.string(),
    preferences: z.object({
        budget: z.number(),
    })
})

// Enum for common property features
const PropertyFeatures = z.enum([
    'pet-friendly',
    'balcony',
    'terrace',
    'first-floor',
    'ground-floor',
    'top-floor',
    'elevator',
    'air-conditioning',
    'central-heating',
    'fireplace',
    'dishwasher',
    'washing-machine',
    'dryer',
    'microwave',
    'refrigerator',
    'furnished',
    'semi-furnished',
    'unfurnished',
    'garden',
    'yard',
    'pool',
    'gym',
    'security-system',
    'intercom',
    'video-surveillance',
    'gated-community',
    'wheelchair-accessible',
    'storage-room',
    'basement',
    'attic',
    'walk-in-closet',
    'hardwood-floors',
    'tile-floors',
    'carpet',
    'recently-renovated',
    'new-construction',
    'high-ceilings',
    'large-windows',
    'natural-light',
    'quiet-neighborhood',
    'near-public-transport',
    'near-schools',
    'near-shopping',
    'city-center',
    'parking-included',
    'garage',
    'covered-parking'
]);
// Main Property schema
export const PropertySchema = z.object({
    _id: z.string(),

    title: z.string(),

    description: z.string(),

    price: z.object({
        value: z.number(),
        currency: z.enum(['EUR', 'RON', 'USD']).optional(),
    }),

    location: LocationSchema,

    numberOfRooms: z.number(),
    surfaceArea: z.number(),
    furnished: z.boolean(),
    features: z.array(PropertyFeatures).default([]),
    propertyType: z.enum(['apartment', 'house', 'hotel', 'office']).optional(),
    heating: z.enum(['gas', 'fireplace', 'electric', '3rd_party']).optional(),
    buildingYear: z.number().optional(),
    buildingFloors: z.number().optional(),

    floor: z.number().optional(),

    parking: z.object({
        available: z.boolean(),
        spaces: z.number().optional(),
        type: z.enum(['garage', 'driveway', 'street', 'covered', 'underground']).optional()
    }),


    imageUrls: z.array(z.string()),

    // Alternative for base64 images (uncomment if needed)
    // imageData: z.array(
    //   z.string().regex(/^data:image\/(jpeg|jpg|png|gif);base64,/)
    // ).optional(),

    tags: z.array(z.string()).default([]),

    postedDate: z.date(),
    postedByUserId: z.string(),

    status: PropertyStatus.default('available')
});

// Type inference
export type Property = z.infer<typeof PropertySchema>;

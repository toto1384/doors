

import { z } from 'zod/v3';
import { LocationSchema } from './location';
import { zDate } from './zodUtils';


// Enum for property status
const PropertyStatus = z.enum(['available', 'sold', 'pending', 'rented', 'off-market']);


export const UserSchema = z.object({
    _id: z.string(),
    preferences: z.object({
        budget: z.number(),
    }),
    name: z.string(),
    email: z.string(),
    emailVerified: z.boolean(),
    image: z.string(),
    createdAt: zDate,
    updatedAt: zDate,
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
    'garden',
    'yard',
    'pool',
    'gym',
    'security-system',
    'basement',
    'recently-renovated',
    'new-construction',
    'large-windows',
    'near-public-transport',
    'city-center',
    'garage',
    'internet',
]);

export type PropertyFeaturesType = z.infer<typeof PropertyFeatures>;

export const PropertyType = ['apartment', 'house', 'hotel', 'office'] as const


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
    propertyType: z.enum(PropertyType).optional(),
    heating: z.enum(['gas', 'fireplace', 'electric', '3rd_party']).optional(),
    buildingYear: z.number().optional(),
    buildingFloors: z.number().optional(),

    floor: z.number().optional(),

    imageUrls: z.array(z.string()),

    tags: z.array(z.string()).default([]),

    postedDate: z.date(),
    postedByUserId: z.string(),

    status: PropertyStatus.default('available')
});

// Type inference
export type Property = z.infer<typeof PropertySchema>;



import { z } from 'zod/v3';
import { LocationSchema } from './location';
import { zDate } from './zodUtils';
import { Facilities } from './propertyFilters';
import { extendZod } from '@zodyac/zod-mongoose';
import { ObjectId } from 'mongodb';


extendZod(z as any)

// Enum for property status
const PropertyStatus = z.enum(['available', 'sold', 'pending', 'rented', 'off-market']);


export type PropertyFeaturesType = z.infer<typeof PropertyFeatures>;

export const PropertyType = ['apartment', 'house', 'hotel', 'office'] as const

// export const UserPreferences = 
// export type UserPreferencesType = z.infer<typeof UserPreferences>;

export const UserSchema = z.object({
    // _id: z.sting(),
    preferences: z.object({

        propertyType: z.array(z.string()).optional(), // Property type from PropertySchema
        budget: z.object({
            min: z.number().optional(),
            max: z.number().optional(),
        }).optional(), // Budget range
        location: LocationSchema.optional(), // Location using Google Maps data
        numberOfRooms: z.array(z.number()).optional(), // Number of rooms
        facilities: z.array(z.string()).optional(), // Facilities/amenities from property features
    }).optional(),
    notifications: z.object({
        emailNotifications: z.boolean().optional(),
        pushNotifications: z.boolean().optional(),
        aiNotifications: z.boolean().optional(),
    }),
    favoriteProperties: z.array(z.string()).optional(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.boolean(),
    image: z.string(),
    createdAt: zDate,
    updatedAt: zDate,
})


export const UserType = ['buyer', 'seller', 'admin'] as const

export const AccountSchema = z.object({
    _id: z.instanceof(ObjectId),
    id: z.string(),
    accountId: z.string(),
    providerId: z.string(),
    userId: z.instanceof(ObjectId),
    accessToken: z.string(),
    idToken: z.string(),
    accessTokenExpiresAt: z.string().datetime(),
    scope: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type AccountObject = z.infer<typeof AccountSchema>;

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
    'pool',
    'gym',
    'security-system',
    'basement',
    'recently-renovated',
    'new-construction',
    'city-center',
    'furnished',
    'central_heating',
    'internet',
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
    numberOfBathrooms: z.number(),
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


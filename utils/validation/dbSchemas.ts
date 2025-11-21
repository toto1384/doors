

import { z } from 'zod/v3';
import { LocationSchema } from './location';
import { zDate } from './zodUtils';
import { extendZod } from '@zodyac/zod-mongoose';
import { ObjectId } from 'mongodb';
import { appointmentStatus, PropertyHeatingValues, PropertyStatusValues, PropertyType, UserType } from 'utils/constants';


extendZod(z as any)



export const AppointmentSchema = z.object({
    _id: z.string().optional(),
    date: zDate,
    startTime: z.string(), // "09:00" format
    endTime: z.string(), // "09:30" format
    buyerUserId: z.string(), // buyer
    sellerUserId: z.string(), // seller
    propertyId: z.string(),
    status: z.enum(appointmentStatus).default('pending'),
    notes: z.string().optional(),
    createdAt: zDate.optional(),
    updatedAt: zDate.optional(),
})



export type PropertyFeaturesType = z.infer<typeof PropertyFeatures>;


export const UserPreferences = z.object({
    propertyType: z.array(z.string()).optional(), // Property type from PropertySchema
    budget: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
    }).optional(), // Budget range
    location: LocationSchema.optional(), // Location using Google Maps data
    numberOfRooms: z.array(z.number()).optional(), // Number of rooms
    facilities: z.array(z.string()).optional(), // Facilities/amenities from property features
    surfaceArea: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
    }).optional(), // Surface area range

    mandatoryPreferences: z.array(z.string()).optional(), // Mandatory preferences

    sellerAvailability: z.array(z.object({
        startDate: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
        endDate: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
        startTime: z.string(),
        endTime: z.string(),
    })).optional()
})
export type UserPreferencesType = z.infer<typeof UserPreferences>;



export const UserSchema = z.object({
    // _id: z.sting(),
    preferences: UserPreferences.optional(),
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
    userType: z.enum(UserType),
})

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
    'parking',
    'gym',
    'security-system',
    'basement',
    'recently-renovated',
    'new-construction',
    'city-center',
    'furnished',
    'central-heating',
    'internet',
]);



export const TPPTitlePriceRoomsSqFeetSchema = {
    title: z.string(),
    price: z.object({
        value: z.number(),
        currency: z.enum(['EUR', 'RON', 'USD']).optional(),
    }),
    numberOfRooms: z.number(),
    numberOfBathrooms: z.number().optional(),
    surfaceArea: z.number(),
    propertyType: z.enum(PropertyType),
}



const ToPostPropertySchemaZod = {
    ...TPPTitlePriceRoomsSqFeetSchema,

    description: z.string(),

    location: LocationSchema,

    furnished: z.boolean(),
    features: z.array(PropertyFeatures).default([]).optional(),

    heating: z.enum(PropertyHeatingValues).optional(),

    buildingYear: z.number().optional(),
    buildingFloors: z.number().optional(),

    floor: z.number().default(0),

    imageUrls: z.array(z.string()),

    tags: z.array(z.string()).default([]).optional(),

    status: z.enum(PropertyStatusValues).default('available'),
}

export const ToPostPropertySchema = z.object(ToPostPropertySchemaZod)


// Main Property schema
export const PropertySchema = z.object({
    _id: z.string(),

    ...ToPostPropertySchemaZod,

    postedDate: z.date(),
    postedByUserId: z.string(),

});

// Type inference
export type Property = z.infer<typeof PropertySchema>;


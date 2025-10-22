
import { z } from 'zod/v3'

export const LocationSchema = z.object({
    streetAddress: z.string().optional().or(z.literal('')),
    country: z.string(),
    countryShort: z.string(),
    zipCode: z.string().optional().or(z.literal('')),
    city: z.string(),
    state: z.string(),
    stateShort: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    fullLocationName: z.string().optional().or(z.literal('')),
});



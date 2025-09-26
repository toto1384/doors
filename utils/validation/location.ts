
import { z } from 'zod/v3'

export const LocationSchema = z.object({
    streetAddress: z.string(),
    country: z.string(),
    countryShort: z.string(),
    zipCode: z.string().optional(),
    city: z.string(),
    state: z.string(),
    stateShort: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    fullLocationName: z.string(),
});



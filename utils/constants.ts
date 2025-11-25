



export const bucharestSlugRo = 'bucuresti' as const
export const countyRoUrlSlug = 'judetul' as const
export const countyEnUrlSlug = 'county' as const
export const countyUrlSlugs = [countyRoUrlSlug, countyEnUrlSlug] as const

export const bypassLimitations = false

export const uploadThingGetUrl = (fileId: string) => `https://jrr69agtel.ufs.sh/f/${fileId}`

export const propPreferencesKey = 'prepPreferences'
export const demoPropertyKey = 'demoProperty'


export const authAdditionalFields = {
    _id: {
        type: "string",
        input: false
    },
    favoriteProperties: {
        type: "string[]",
        input: false
    },
    preferences: {
        type: "json",
        input: false
    },
    notifications: {
        type: "json",
        input: false
    },
    userType: {
        type: "string",
        input: false
    },
} as const

export const appointmentStatus = ['pending', 'confirmed', 'cancelled-by-buyer', 'cancelled-by-seller', 'completed'] as const;

export const UserType = ['buyer', 'seller', 'admin'] as const

export const PropertyType = ['apartment', 'house', 'hotel', 'office'] as const

export const PropertyStatusValues = ['available', 'sold', 'pending', 'rented', 'off-market'] as const

export type PropertyStatus = typeof PropertyStatusValues[number]

export const PropertyHeatingValues = ['gas', 'fireplace', 'electric', '3rd_party'] as const

export type PropertyHeating = typeof PropertyHeatingValues[number]

export type PropertyTypeType = typeof PropertyType[number]





export const bucharestSlugRo = 'bucuresti' as const
export const countyRoUrlSlug = 'judetul' as const
export const countyEnUrlSlug = 'county' as const
export const countyUrlSlugs = [countyRoUrlSlug, countyEnUrlSlug] as const


export const uploadThingGetUrl = (fileId: string) => `https://jrr69agtel.ufs.sh/f/${fileId}`


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

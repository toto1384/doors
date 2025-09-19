
import { z } from 'zod/v3'
import { extendZod } from "@zodyac/zod-mongoose";

extendZod(z);

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



export const OldLocationSchema = z.object({
    _id: z.string().optional(),
    id: z.number().optional(),

    //keep it optional, otherwise errors will appear
    name: z.string().optional(),
    fullName: z.string().optional(),

    state_id: z.number().optional(),
    country_id: z.number().optional(),

    latitude: z.string().optional(),
    longitude: z.string().optional(),
    type: z.enum(['City', 'State', 'Country']).optional(),
    slug: z.string().optional(),
    slugRo: z.string().optional(),
});

export type romaniaProvinces = typeof romaniaProvincesValues[number]
export const romaniaProvincesValues = ['Moldova', 'Muntenia', 'Dobrogea', 'Transilvania/Maramures', 'Oltenia', 'Banat/Crisana'] as const

export const CitySchema = z.object({
    // name:Joi.string(),
    _id: z.string().optional(),
    id: z.number().optional(),
    name: z.string(),
    state_id: z.number().optional(),
    state_code: z.string().optional(),
    state_name: z.string().optional(),
    country_id: z.number().optional(),
    country_code: z.string().optional(),
    country_name: z.string().optional(),
    ngrams: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    wikiDataId: z.string().optional(),
    jobsCount: z.number(),
    province: z.enum(romaniaProvincesValues).optional(),

    slug: z.string().optional(),
    slug_history: z.array(z.string()).default([]).optional(),
    priorityNine: z.boolean().optional(),
    favorite: z.boolean().optional(),

})

export const StateSchema = z.object({
    // name:Joi.string(),
    _id: z.string().optional(),
    id: z.number().optional(),
    name: z.string(),
    country_id: z.number().optional(),
    country_code: z.string().optional(),
    ngrams: z.string().optional(),
    country_name: z.string().optional(),
    state_code: z.string().optional(),
    type: z.any().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    province: z.enum(romaniaProvincesValues).optional(),

    slug: z.string().optional(),
    slug_history: z.array(z.string()).default([]).optional(),
    priorityNine: z.boolean().optional(),
    favorite: z.boolean().optional(),
})


export const CountrySchema = z.object({
    // name:Joi.string(),
    _id: z.string().optional(),
    id: z.number(),
    name: z.string(),
    nameRo: z.string().optional(),
    iso3: z.string().optional(),
    iso2: z.string().optional(),
    numeric_code: z.string().optional(),
    phone_code: z.string().optional(),
    capital: z.string().optional(),
    currency: z.string().optional(),
    currency_name: z.string().optional(),
    currency_symbol: z.string().optional(),
    tld: z.string().optional(),
    ngrams: z.string().optional(),
    native: z.string().optional(),
    region: z.string().optional(),
    subregion: z.string().optional(),
    timezones: z.array(z.object({
        zoneName: z.string().optional(),
        gmtOffset: z.number().optional(),
        gmtOffsetName: z.string().optional(),
        abbreviation: z.string().optional(),
        tzName: z.string().optional(),
    })).optional(),
    translations: z.any().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    emoji: z.string().optional(),
    emojiU: z.string().optional(),
    favorite: z.boolean().optional(),


    slug: z.string().optional(),
    slugRo: z.string().optional(),
    slug_history: z.array(z.string()).default([]).optional(),

})








export interface UntranslatableObject {
    id: string;
    name: string;
}

export interface TranslatableObject {
    id: string;
    nameRo: string;
    nameEn: string;
}


export type LanguageType = typeof LanguageTypeValues[number]
export const LanguageTypeValues = ['en', "ro"] as const


export type LocationType = typeof LocationTypeValues[number]
export const LocationTypeValues = ["City", "State", "Country"] as const


export type TranslatedLocationType = typeof TranslatedLocationTypeValues[number]
export const TranslatedLocationTypeValues = ["Oras", "Judetul", "Tara"] as const


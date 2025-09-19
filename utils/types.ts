import { CitySchema, CountrySchema, LocationSchema, StateSchema } from "./validation/location";

import { z } from 'zod'


export type LocationObject = z.infer<typeof LocationSchema>;


export type CityObject = z.infer<typeof CitySchema>;
export type StateObject = z.infer<typeof StateSchema>;
export type CountryObject = z.infer<typeof CountrySchema>;


export type FullLocationObject = CityObject | StateObject | CountryObject

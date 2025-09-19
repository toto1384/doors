import z from "zod/v3";
import { CitySchema, CountrySchema, LocationSchema, StateSchema } from "./location";
import { PropertySchema, UserSchema } from "./propertySchema";

export type LocationObject = z.infer<typeof LocationSchema>;

export type PropertyObject = z.infer<typeof PropertySchema>;
export type UserObject = z.infer<typeof UserSchema>;

export type CityObject = z.infer<typeof CitySchema>;
export type StateObject = z.infer<typeof StateSchema>;
export type CountryObject = z.infer<typeof CountrySchema>;





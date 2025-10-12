import z from "zod/v3";
import { LocationSchema, } from "./location";
import { PropertySchema, UserSchema } from "./dbSchemas";
import { propertyFiltersSchema } from "./propertyFilters";

export type LocationObject = z.infer<typeof LocationSchema>;

export type PropertyObject = z.infer<typeof PropertySchema> & { _id: string }
export type UserObject = z.infer<typeof UserSchema> & { _id: string };

export type PropertyFilters = z.infer<typeof propertyFiltersSchema>;



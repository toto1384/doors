import mongoose, { Document, Model, } from 'mongoose'
import { PropertyObject, UserObject } from "./types";
import { PropertySchema, UserSchema } from "./dbSchemas";


import { zodSchema } from "@zodyac/zod-mongoose";


export const getUserModel = (mong: typeof mongoose) => {
    const mgse = mong ?? mongoose;

    if (mgse.models.User) return mgse.models.User as Model<UserObject & Document>

    return mgse.model<UserObject & Document>('User', zodSchema(UserSchema as any), 'user')
}


export const getPropertyModel = (mong: typeof mongoose) => {
    const mgse = mong ?? mongoose;

    if (mgse.models.Property) return mgse.models.Property as Model<PropertyObject & Document>

    // const propertySchema = convertToModel(PropertySchema)
    return mgse.model<PropertyObject & Document>('Property', zodSchema(PropertySchema as any), 'properties')

}







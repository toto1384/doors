import mongoose, { Document, Model, } from 'mongoose'
import { PropertyObject, UserObject } from "./types";
import { PropertySchema, UserSchema } from "./propertySchema";


import { zodSchema } from "@zodyac/zod-mongoose";


export const getUserModel = (mong: typeof mongoose) => {
    const mgse = mong ?? mongoose;

    if (mgse.models.User) return mgse.models.User as Model<UserObject & Document>

    return mgse.model<UserObject & Document>('User', zodSchema(UserSchema), 'users')
}


export const getPropertyModel = (mong: typeof mongoose) => {
    const mgse = mong ?? mongoose;

    if (mgse.models.Property) return mgse.models.Property as Model<PropertyObject & Document>

    // const propertySchema = convertToModel(PropertySchema)
    return mgse.model<PropertyObject & Document>('Property', zodSchema(PropertySchema), 'properties')

}



// export function convertToModel<T extends ZodTypeAny>(zodSchema: T, collection?: string,) {
//     const jsonSchema = zodToJsonSchema(zodSchema, { name: "Schema", $refStrategy: 'none', },);
//
//     console.log('jsonSchema', jsonSchema)
//     const mongooseSchema = createMongooseSchema({}, {
//         ...(jsonSchema.definitions as any).Schema,
//         '$schema': 'http://json-schema.org/draft-04/schema#',
//
//     },);
//
//     return new mongoose.Schema(mongooseSchema, { collection });
// }
//







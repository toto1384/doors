import mongoose, { Document, Model, } from 'mongoose'
import { PropertyObject, UserObject, AppointmentObject, NotificationObject } from "./types";
import { AccountObject, AccountSchema, PropertySchema, UserSchema, AppointmentSchema, NotificationSchema, } from "./dbSchemas";


import { zodSchema } from "@zodyac/zod-mongoose";


export const getUserModel = (mong: typeof mongoose) => {
    const mgse = mong ?? mongoose;

    if (mgse.models.User) return mgse.models.User as Model<UserObject & Document>

    return mgse.model<UserObject & Document>('User', zodSchema(UserSchema as any), 'user')
}




export const getAccountModel = (mong: typeof mongoose) => {
    const mgse = mong ?? mongoose;

    if (mgse.models.Account) return mgse.models.Account as Model<AccountObject & Document>

    return mgse.model<AccountObject & Document>('Account', zodSchema(AccountSchema as any), 'account')
}

export const getPropertyModel = (mong: typeof mongoose) => {
    const mgse = mong ?? mongoose;

    if (mgse.models.Property) return mgse.models.Property as Model<PropertyObject & Document>

    // const propertySchema = convertToModel(PropertySchema)
    return mgse.model<PropertyObject & Document>('Property', zodSchema(PropertySchema as any), 'properties')

}

export const getAppointmentModel = (mong: typeof mongoose) => {
    const mgse = mong ?? mongoose;

    if (mgse.models.Appointment) return mgse.models.Appointment as Model<AppointmentObject & Document>

    return mgse.model<AppointmentObject & Document>('Appointment', zodSchema(AppointmentSchema as any), 'appointments')
}


export const getNotificationModel = (mong: typeof mongoose) => {
    const mgse = mong ?? mongoose;

    if (mgse.models.Notification) return mgse.models.Notification as Model<NotificationObject & Document>

    return mgse.model<NotificationObject & Document>('Notification', zodSchema(NotificationSchema as any), 'notifications')
}





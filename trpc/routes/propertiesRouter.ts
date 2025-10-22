import { TRPCError, TRPCRouterRecord } from '@trpc/server';
import { authProcedure, publicProcedure } from 'trpc/init';
import { auth } from 'utils/auth';
import dbConnect from 'utils/db/mongodb';
import { getPropertyModel, getUserModel } from 'utils/validation/mongooseModels';
import { propertyFiltersSchema } from 'utils/validation/propertyFilters';
import { PropertyObject } from 'utils/validation/types';
import { ObjectId } from 'mongodb';
import z from 'zod/v3';
import { PropertySchema, ToPostPropertySchema } from 'utils/validation/dbSchemas';
import { nanoid } from 'nanoid';


export const propertiesRouter = {
    setPropertyFavorite: authProcedure.input(z.object({ propertyId: z.string(), favorite: z.boolean() })).mutation(async ({ input, ctx }) => {
        const db = await dbConnect();
        console.log('aa')
        const UserModel = getUserModel(db);

        try {
            if (input.favorite) {
                console.log('ab', ctx.user.id)
                const res = await UserModel.updateOne({ _id: ctx.user.id.toString() }, { $addToSet: { favoriteProperties: input.propertyId } });
                console.log('ab', res)
            } else {
                const res = await UserModel.findByIdAndUpdate(ctx.user.id, { $pull: { favoriteProperties: input.propertyId } });
                console.log('a', res)
            }

            return { success: true };
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to update favorite status"
            });
        }
    }),

    migrate: publicProcedure.mutation(async ({ ctx }) => {
        const db = await dbConnect();
        const PropertyModel = getPropertyModel(db);

        try {
            const properties = await PropertyModel.updateMany({ numberOfBathrooms: undefined }, { $set: { numberOfBathrooms: 1 } });

            console.log('properties', properties)

            return { success: true };
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to migrate properties"
            });
        }
    }),
    getFavorites: authProcedure.query(async ({ ctx }) => {
        const db = await dbConnect();
        const UserModel = getUserModel(db);
        const PropertyModel = getPropertyModel(db);

        try {
            const user = await UserModel.findById(ctx.user.id);
            if (!user || !user.favoriteProperties || user.favoriteProperties.length === 0) {
                return [];
            }

            const properties = await PropertyModel.find({
                _id: { $in: user.favoriteProperties }
            }).lean() as PropertyObject[];

            return properties;
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch favorite properties"
            });
        }
    }),
    postProperty: authProcedure.input(z.object({ property: ToPostPropertySchema })).mutation(async ({ input, ctx }) => {
        const db = await dbConnect();
        const PropertyModel = getPropertyModel(db);

        try {


            const property = await PropertyModel.create({
                ...input.property,
                _id: nanoid().toString(),
                postedDate: new Date(),
                postedByUserId: ctx.user.id,
                status: "available",
            } as PropertyObject);

            console.log('property', property)

            return { success: true, message: 'Property created successfully' };
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to update favorite status"
            });
        }
    }),
    list: publicProcedure
        .input(propertyFiltersSchema)
        .query(async ({ input }) => {
            await dbConnect();
            const PropertyModel = getPropertyModel(await import('mongoose').then(m => m.default));


            console.log('filters', input)
            // Build MongoDB query based on filters
            const query: any = {};

            // Property type filte
            if (input.propertyType && input.propertyType.length > 0) {
                query.propertyType = { $in: input.propertyType };
            }

            // Budget filter
            if (input.budget) {
                const priceQuery: any = {};
                if (input.budget.min !== undefined) {
                    priceQuery.$gte = input.budget.min;
                }
                if (input.budget.max !== undefined) {
                    priceQuery.$lte = input.budget.max;
                }
                if (Object.keys(priceQuery).length > 0) {
                    query['price.value'] = priceQuery;
                }
            }

            // Location filter - geo-spatial search
            if (input.location) {
                const locationQuery: any = {};

                // City/state text search
                if (input.location.city) {
                    locationQuery['location.city'] = {
                        $regex: input.location.city.replace(/\W+/g, '\\W*'),
                        $options: 'i'
                    };
                }
                if (input.location.state) {
                    locationQuery['location.state'] = {
                        $regex: input.location.state.replace(' County', '').replace(/\W+/g, '\\W*'),
                        $options: 'i'
                    };
                }


                Object.assign(query, locationQuery);
            }

            // Number of rooms filter
            if (input.numberOfRooms && input.numberOfRooms.length > 0) {
                query.numberOfRooms = { $in: input.numberOfRooms };
            }

            // Facilities filter - check if property features contain any of the specified facilities
            if (input.facilities && input.facilities.length > 0) {
                query.features = { $in: input.facilities };
            }

            // Only show available properties by default
            query.status = 'available';


            console.log('finalQuery Fetch', query)

            try {
                const properties = await PropertyModel.find(query)
                    .sort({ postedDate: -1 }) // Most recent first
                    .limit(9) // Limit results for performance
                    .lean() as PropertyObject[];

                return properties;
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch properties"
                });
            }
        }),
    byId: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const db = await dbConnect();
            const PropertyModel = getPropertyModel(db);
            const UserModel = getUserModel(db);

            try {
                const property = await PropertyModel.findById(input.id).lean();
                if (!property) {
                    throw new TRPCError({ code: "NOT_FOUND", message: "Property not found" });
                }

                const propertyUser = await UserModel.findById(property.postedByUserId == '-1' ? '68e4fb510a3ece1a5839a59b' : property.postedByUserId, { favoriteProperties: -1 }).lean();

                console.log('propertyUser', propertyUser)


                let favorited = false;

                // Check if user is authenticated and has this property favorited
                if (ctx.user) {
                    const user = await UserModel.findById(ctx.user.id);
                    favorited = user?.favoriteProperties?.includes(input.id) || false;
                }

                return { property, favorited, propertyUser: JSON.parse(JSON.stringify(propertyUser)) as UserObject };
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Failed to fetch property ${error}`
                });
            }
        }),
} satisfies TRPCRouterRecord;

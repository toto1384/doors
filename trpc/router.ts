import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v3";

import { authProcedure, createTRPCRouter, publicProcedure } from "./init";
import { propertyFiltersSchema } from "../utils/validation/propertyFilters";
import { getPropertyModel, getUserModel } from "../utils/validation/mongooseModels";
import dbConnect from "../utils/db/mongodb";
import { PropertyObject } from "utils/validation/types";
import { extendZod } from "@zodyac/zod-mongoose";


extendZod(z as any)

const guitarRouter = {
    list: publicProcedure.query(async () => 'hello'),
    byId: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
        }),
} satisfies TRPCRouterRecord;

const propertiesRouter = {
    favoriteProperty: authProcedure.input(z.object({ propertyId: z.string() })).mutation(async ({ input }) => {
        const db = await dbConnect();

        const UserModel = getUserModel(db);

        // await UserModel.updateOne({ _id: ctx.user._id }, { $push: { favoriteProperties: input.propertyId } });



        // return property;
    }),
    list: publicProcedure
        .input(propertyFiltersSchema)
        .query(async ({ input }) => {
            await dbConnect();
            const PropertyModel = getPropertyModel(await import('mongoose').then(m => m.default));


            console.log('filters', input)
            // Build MongoDB query based on filters
            const query: any = {};

            // Property type filter
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
        .query(async ({ input }) => {
            await dbConnect();
            const PropertyModel = getPropertyModel(await import('mongoose').then(m => m.default));

            try {
                const property = await PropertyModel.findById(input.id).lean();
                if (!property) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Property not found"
                    });
                }
                return property;
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch property"
                });
            }
        }),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
    guitars: guitarRouter,
    properties: propertiesRouter,
    auth: {
        getToken: authProcedure.query(async ({ ctx }) => {
            console.log(process.env.VITE_AGENT_ID, process.env.ELEVENLABS_API_KEY)
            const response = await fetch(
                `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${process.env.VITE_AGENT_ID}`,
                { headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, } as any }
            );
            const body = await response.json();

            return { token: body.token as string };
        }),
    } satisfies TRPCRouterRecord,
});
export type TRPCRouter = typeof trpcRouter;

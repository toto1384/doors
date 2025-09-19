import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "./init";
import { propertyFiltersSchema } from "../utils/validation/propertyFilters";
import { getPropertyModel } from "../utils/validation/mongooseModels";
import dbConnect from "../utils/db/mongodb";


const guitarRouter = {
    list: publicProcedure.query(async () => 'hello'),
    byId: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
        }),
} satisfies TRPCRouterRecord;

const propertiesRouter = {
    list: publicProcedure
        .input(propertyFiltersSchema)
        .query(async ({ input }) => {
            await dbConnect();
            const PropertyModel = getPropertyModel(await import('mongoose').then(m => m.default));

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
                        $regex: input.location.city,
                        $options: 'i'
                    };
                }
                if (input.location.state) {
                    locationQuery['location.state'] = {
                        $regex: input.location.state,
                        $options: 'i'
                    };
                }

                // Geo-spatial search if coordinates and radius provided
                if (input.location.latitude && input.location.longitude && input.location.radius) {
                    locationQuery['$and'] = [
                        {
                            'location.latitude': {
                                $gte: input.location.latitude - (input.location.radius / 111), // Rough km to degree conversion
                                $lte: input.location.latitude + (input.location.radius / 111)
                            }
                        },
                        {
                            'location.longitude': {
                                $gte: input.location.longitude - (input.location.radius / (111 * Math.cos(input.location.latitude * Math.PI / 180))),
                                $lte: input.location.longitude + (input.location.radius / (111 * Math.cos(input.location.latitude * Math.PI / 180)))
                            }
                        }
                    ];
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

            try {
                const properties = await PropertyModel.find(query)
                    .sort({ postedDate: -1 }) // Most recent first
                    .limit(50) // Limit results for performance
                    .lean();

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
});
export type TRPCRouter = typeof trpcRouter;

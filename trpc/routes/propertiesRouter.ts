import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { ObjectId } from "mongodb";
import { nanoid } from "nanoid";
import z from "zod/v3";
import { authProcedure, publicProcedure } from "@/trpc/init";
import { auth } from "@/utils/auth";
import { PropertyStatus, PropertyStatusValues } from "@/utils/constants";
import dbConnect from "@/utils/db/mongodb";
import { PropertySchema, ToPostPropertySchema } from "@/utils/validation/dbSchemas";
import { getPropertyModel, getUserModel } from "@/utils/validation/mongooseModels";
import { propertyFiltersSchema } from "@/utils/validation/propertyFilters";
import { PropertyObject, UserObject } from "@/utils/validation/types";

export const propertiesRouter = {
	setPropertyFavorite: authProcedure
		.input(z.object({ propertyId: z.string(), favorite: z.boolean() }))
		.mutation(async ({ input, ctx }) => {
			const db = await dbConnect();
			console.log("aa");
			const UserModel = getUserModel(db);

			try {
				if (input.favorite) {
					console.log("ab", ctx.user.id);
					const res = await UserModel.updateOne(
						{ _id: ctx.user.id.toString() },
						{ $addToSet: { favoriteProperties: input.propertyId } },
					);
					console.log("ab", res);
				} else {
					const res = await UserModel.findByIdAndUpdate(ctx.user.id, {
						$pull: { favoriteProperties: input.propertyId },
					});
					console.log("a", res);
				}

				return { success: true };
			} catch (error) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update favorite status",
				});
			}
		}),

	migrate: publicProcedure.mutation(async ({ ctx }) => {
		const db = await dbConnect();
		const PropertyModel = getPropertyModel(db);

		try {
			const properties = await PropertyModel.updateMany(
				{ postedByUserId: "-1" },
				{ $set: { status: "off-market" as PropertyStatus } },
			);

			console.log("properties", properties);

			return { success: true };
		} catch (error) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to migrate properties",
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

			const properties = (await PropertyModel.find({
				_id: { $in: user.favoriteProperties },
			}).lean()) as PropertyObject[];

			return properties;
		} catch (error) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch favorite properties",
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

			console.log("property", property, input.property);

			console.log("property", property);

			return { success: true, message: "Property created successfully" };
		} catch (error) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: `Failed to post property ${error}`,
			});
		}
	}),
	list: publicProcedure
		.input(
			z.object({
				props: propertyFiltersSchema,
				limit: z.number().optional().default(9),
				skip: z.number().optional().default(0),
			}),
		)
		.query(async ({ input }) => {
			await dbConnect();
			const PropertyModel = getPropertyModel(await import("mongoose").then((m) => m.default));

			console.log("filters", input);
			// Build MongoDB query based on filters
			const query: any[] = [];

			// Property type filte
			if (input.props.propertyType && input.props.propertyType.length > 0) {
				query.push({ $cond: [{ $in: ["$propertyType", input.props.propertyType] }, 1, 0] });
			}

			// Budget filter
			if (input.props.budget) {
				query.push({
					$cond: [
						{
							$and: [
								...(input.props.budget.min !== undefined ? [{ $gte: ["$price.value", input.props.budget.min] }] : []),
								...(input.props.budget.max !== undefined ? [{ $lte: ["$price.value", input.props.budget.max] }] : []),
							],
						},
						1,
						0,
					],
				});
			}

			// Surface area filter
			if (input.props.surfaceArea) {
				query.push({
					$cond: [
						{
							$and: [
								...(input.props.surfaceArea.min !== undefined
									? [{ $gte: ["$surfaceArea", input.props.surfaceArea.min] }]
									: []),
								...(input.props.surfaceArea.max !== undefined
									? [{ $lte: ["$surfaceArea", input.props.surfaceArea.max] }]
									: []),
							],
						},
						1,
						0,
					],
				});
			}

			// Location filter - geo-spatial search
			if (input.props.location) {
				query.push({
					$cond: [
						{
							$and: [
								...(input.props.location.city
									? [
											{
												$regexMatch: {
													input: "$location.city",
													regex: input.props.location.city.replace(/\W+/g, "\\W*"),
												},
											},
										]
									: []),
								...(input.props.location.state
									? [
											{
												$regexMatch: {
													input: "$location.state",
													regex: input.props.location.state.replace(" County", "").replace(/\W+/g, "\\W*"),
												},
											},
										]
									: []),
							],
						},
						1,
						0,
					],
				});

				// const locationQuery: any = {};
				//
				// // City/state text search
				// if (input.location.city) {
				//     locationQuery['location.city'] = {
				//         $regex: input.location.city.replace(/\W+/g, '\\W*'),
				//         $options: 'i'
				//     };
				// }
				// if (input.location.state) {
				//     locationQuery['location.state'] = {
				//         $regex: input.location.state.replace(' County', '').replace(/\W+/g, '\\W*'),
				//         $options: 'i'
				//     };
				// }
				//
				//
				// Object.assign(query, locationQuery);
			}

			// Number of rooms filter
			if (input.props.numberOfRooms && input.props.numberOfRooms.length > 0) {
				query.push({ $cond: [{ $in: ["$numberOfRooms", input.props.numberOfRooms] }, 1, 0] });
				// query.numberOfRooms = { $in: input.numberOfRooms };
			}

			// Facilities filter - check if property features contain any of the specified facilities
			if (input.props.facilities && input.props.facilities.length > 0) {
				query.push({ $cond: [{ $in: ["$features", input.props.facilities] }, 1, 0] });
				// query.features = { $in: input.facilities };
			}

			try {
				const properties = (await PropertyModel.aggregate([
					{ $match: { status: "available" } },
					{ $addFields: { matchScore: { $sum: query } } },
					{ $sort: { matchScore: -1 } },
					{
						$facet: {
							properties: [{ $skip: input.skip }, { $limit: input.limit }],
							count: [{ $count: "count" }],
						},
					},
					// {$project: {_id: 0, status: 1, propertyType: 1, price: 1, location: 1, numberOfRooms: 1, features: 1, postedDate: 1}},
				])) as [{ properties: (PropertyObject & { matchScore: number })[]; count: [{ count: number }] }];

				return {
					properties: properties[0]?.properties ?? [],
					count: properties[0]?.count?.[0]?.count ?? 0,
					totalFilterCount: query.length,
				};
			} catch (error) {
				console.log(error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch properties",
				});
			}
		}),
	byId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
		const db = await dbConnect();
		const PropertyModel = getPropertyModel(db);
		const UserModel = getUserModel(db);

		try {
			const property = await PropertyModel.findById(input.id).lean();
			if (!property) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Property not found" });
			}

			const propertyUser = await UserModel.findById(
				property.postedByUserId == "-1" ? "68e4fb510a3ece1a5839a59b" : property.postedByUserId,
				{ favoriteProperties: -1 },
			).lean();

			console.log("propertyUser", propertyUser);

			let favorited = false;

			// Check if user is authenticated and has this property favorited
			if (ctx.user) {
				const user = await UserModel.findById(ctx.user.id);
				favorited = user?.favoriteProperties?.includes(input.id) || false;
			}

			return {
				property,
				favorited,
				propertyUser: JSON.parse(JSON.stringify(propertyUser)) as UserObject,
				ownProperty: property.postedByUserId == ctx.user?.id,
			};
		} catch (error) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: `Failed to fetch property ${error}`,
			});
		}
	}),
	myProperties: authProcedure
		.input(z.object({ skip: z.number().optional().default(0), status: z.enum(PropertyStatusValues).optional() }))
		.query(async ({ input, ctx }) => {
			const db = await dbConnect();
			const PropertyModel = getPropertyModel(db);

			try {
				const properties = (await PropertyModel.aggregate([
					{ $match: { postedByUserId: ctx.user.id } },
					{
						$facet: {
							properties: [
								{ $match: { ...(input.status ? { status: input.status } : {}) } },
								{ $sort: { postedDate: -1 } },
								{ $skip: input.skip },
								{ $limit: 9 },
							],
							groupStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
						},
					},
				])) as [{ properties: PropertyObject[]; groupStatus: { _id: string; count: number }[] }];

				return properties[0];
			} catch (error) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch properties",
				});
			}
		}),

	deleteProperty: authProcedure.input(z.object({ propertyId: z.string() })).mutation(async ({ input, ctx }) => {
		const db = await dbConnect();
		const PropertyModel = getPropertyModel(db);

		try {
			// Check if user is authenticated and has this property
			if (ctx.user) {
				const property = await PropertyModel.findById(input.propertyId);
				if (!property || property.postedByUserId !== ctx.user.id) {
					throw new TRPCError({ code: "NOT_FOUND", message: "Property not found" });
				}
			}

			const property = await PropertyModel.deleteOne({ _id: input.propertyId });
			if (!property) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Property not found" });
			}

			return { success: true };
		} catch (error) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to delete property",
			});
		}
	}),

	updateProperty: authProcedure
		.input(z.object({ property: ToPostPropertySchema.partial(), propertyId: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const db = await dbConnect();
			const PropertyModel = getPropertyModel(db);

			try {
				// Check if user is authenticated and has this property
				if (ctx.user) {
					const property = await PropertyModel.findById(input.propertyId);
					if (!property || property.postedByUserId !== ctx.user.id) {
						throw new TRPCError({ code: "NOT_FOUND", message: "Property not found" });
					}
				}
				const property = await PropertyModel.updateOne({ _id: input.propertyId }, input.property);
				if (!property) {
					throw new TRPCError({ code: "NOT_FOUND", message: "Property not found" });
				}

				return { success: true };
			} catch (error) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update property",
				});
			}
		}),
} satisfies TRPCRouterRecord;

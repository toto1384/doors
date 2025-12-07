import { extendZod } from "@zodyac/zod-mongoose";
import z from "zod/v3";
import dbConnect from "@/utils/db/mongodb";
import { getNotificationModel, getPropertyModel } from "@/utils/validation/mongooseModels";
import { authProcedure, createTRPCRouter } from "./init";
import { appointmentsRouter } from "./routes/appointmentsRouter";
import { authRouter } from "./routes/authRouter";
import { propertiesRouter } from "./routes/propertiesRouter";

extendZod(z as any);

export const trpcRouter = createTRPCRouter({
	properties: propertiesRouter,
	appointments: appointmentsRouter,
	auth: authRouter,
	notifications: {
		get: authProcedure.query(async ({ ctx }) => {
			const db = await dbConnect();
			const NotificationModel = getNotificationModel(db);

			const notifications = await NotificationModel.find({ userId: ctx.user.id }).sort({ createdAt: -1 }).limit(20);
			return { notifications };
		}),
		markAsRead: authProcedure.input(z.object({ ids: z.array(z.string()) })).mutation(async ({ ctx, input }) => {
			const db = await dbConnect();
			const NotificationModel = getNotificationModel(db);

			const notifications = await NotificationModel.updateMany({ _id: { $in: input.ids } }, { read: true });
			return { notifications };
		}),
	},
	photos: {
		delete: authProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
			const db = await dbConnect();
			const PropertyModel = getPropertyModel(db);

			// await utapi.deleteFiles(images.map(img => img.key));
		}),
	},
});
export type TRPCRouter = typeof trpcRouter;

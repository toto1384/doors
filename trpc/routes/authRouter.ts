import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import z from "zod/v3";
import { authProcedure, publicProcedure } from "@/trpc/init";
import { UserType } from "@/utils/constants";
import dbConnect from "@/utils/db/mongodb";
import { UserPreferences } from "@/utils/validation/dbSchemas";
import { getUserModel } from "@/utils/validation/mongooseModels";

export const authRouter = {
	getToken: publicProcedure.query(async ({ ctx }) => {
		console.log(process.env.VITE_AGENT_ID, process.env.ELEVENLABS_API_KEY);
		const response = await fetch(
			`https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${process.env.VITE_AGENT_ID}`,
			{ headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY } as any },
		);
		const body = await response.json();

		return { token: body.token as string };
	}),

	updateNewsletter: authProcedure
		.input(
			z.object({
				emailNotifications: z.boolean(),
				pushNotifications: z.boolean(),
				aiNotifications: z.boolean(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const db = await dbConnect();
			const UserModel = getUserModel(db);

			console.log("gh", ctx.user);
			const user = await UserModel.findOneAndUpdate({ _id: ctx.user.id }, { $set: { notifications: input } });
			if (!user) {
				throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
			}

			return { success: true };
		}),

	changeUserType: authProcedure.input(z.object({ userType: z.enum(UserType) })).mutation(async ({ ctx, input }) => {
		const db = await dbConnect();
		const UserModel = getUserModel(db);

		const user = await UserModel.updateOne({ _id: ctx.user.id }, { userType: input.userType });
		console.log("gh", input.userType, user, { userType: input.userType });

		if (!user) {
			throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
		}

		return { success: true };
	}),

	updateUserPreferences: authProcedure.input(UserPreferences).mutation(async ({ ctx, input }) => {
		const db = await dbConnect();
		const UserModel = getUserModel(db);

		const updateFields: any = {};
		Object.keys(input).forEach((key) => {
			if (input[key as keyof z.infer<typeof UserPreferences>] !== undefined) {
				updateFields[`preferences.${key}`] = input[key as keyof z.infer<typeof UserPreferences>];
			}
		});

		const user = await UserModel.updateOne({ _id: ctx.user.id }, { $set: updateFields });

		if (!user) {
			throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
		}

		return { success: true };
	}),
} satisfies TRPCRouterRecord;

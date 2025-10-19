import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v3";

import { extendZod } from "@zodyac/zod-mongoose";
import { authProcedure, createTRPCRouter, } from "./init";
import { propertiesRouter } from "./routes/propertiesRouter";
import { UTApi } from 'uploadthing/server';
import dbConnect from "utils/db/mongodb";
import { getAccountModel, getPropertyModel, getUserModel } from "utils/validation/mongooseModels";
import { ObjectId } from 'mongodb';
import { UserType } from "utils/validation/dbSchemas";

extendZod(z as any)



export const trpcRouter = createTRPCRouter({
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

        updateNewsletter: authProcedure.input(z.object({
            emailNotifications: z.boolean(),
            pushNotifications: z.boolean(),
            aiNotifications: z.boolean(),
        })).mutation(async ({ ctx, input }) => {
            const db = await dbConnect();
            const UserModel = getUserModel(db);

            console.log('gh', ctx.user)
            const user = await UserModel.findOneAndUpdate({ _id: ctx.user.id }, { $set: { notifications: input } })
            if (!user) {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
            }

            return { success: true };
        }),

        changeUserType: authProcedure.input(z.object({ userType: z.enum(UserType) })).mutation(async ({ ctx, input }) => {
            const db = await dbConnect();
            const UserModel = getUserModel(db);

            console.log('gh', ctx.user)
            const user = await UserModel.findOneAndUpdate({ _id: ctx.user.id }, { $set: { userType: input.userType } })
            if (!user) {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
            }

            return { success: true };
        }),
    } satisfies TRPCRouterRecord,
    photos: {
        delete: authProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
            const db = await dbConnect();
            const PropertyModel = getPropertyModel(db);

            // await utapi.deleteFiles(images.map(img => img.key));



        })
    }
});
export type TRPCRouter = typeof trpcRouter;

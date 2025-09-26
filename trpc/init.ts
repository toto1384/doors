

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth } from "../utils/auth";

const t = initTRPC.create({
    transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const authProcedure = t.procedure.use(async ({ ctx, next }) => {
    // Get the request from the procedure context
    const request = ctx.req || (globalThis as any).request;

    let session = null;
    let user = null;

    if (request) {
        try {
            session = await auth.api.getSession({
                headers: request.headers
            });

            if (session) {
                user = session.user;
            }
        } catch (error) {
            console.warn("Failed to get session:", error);
        }
    }

    if (!session || !user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required"
        });
    }

    return next({
        ctx: {
            ...ctx,
            session,
            user
        },
    });
});

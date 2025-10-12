

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth } from "../utils/auth";



// Create the tRPC context, which includes the database client and the potentially authenticated user. This will provide convenient access to both within our tRPC procedures.
export const createTRPCContextServer = async (opts: { headers: Headers }) => {
    const authSession = await auth.api.getSession({
        headers: opts.headers
    })

    return {
        user: authSession?.user,
        headers: opts.headers as (typeof opts.headers | undefined),
    }
}
type Context = Awaited<ReturnType<typeof createTRPCContextServer>>


const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const authProcedure = t.procedure.use(async ({ ctx, next }) => {

    if (!ctx.user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required"
        });
    }

    return next({ ctx: { ...ctx, user: ctx.user }, });
});


import { createServerFileRoute } from "@tanstack/react-start/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContextServer } from "trpc/init";
import { trpcRouter } from "trpc/router";

function handler({ request }: { request: Request }) {
    return fetchRequestHandler({
        req: request,
        router: trpcRouter,
        endpoint: "/api/trpc",
        createContext: () => (createTRPCContextServer({ headers: request.headers })),
    });
}

export const ServerRoute = createServerFileRoute("/api/trpc/$").methods({
    GET: handler,
    POST: handler,
});


//https://github.com/jherr/start-trpc/blob/main/start-trpc-pt-1/src/trpc/router.ts

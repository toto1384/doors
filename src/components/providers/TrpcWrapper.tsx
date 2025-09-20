
import superjson from "superjson";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { TRPCProvider } from "trpc/react";
import type { TRPCRouter } from "trpc/router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { useState } from 'react';


function getUrl() {
    const base = (() => {
        if (typeof window !== "undefined") return "";
        return import.meta.env.VITE_BETTER_AUTH_URL
    })();
    return base + "/api/trpc";
}




function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime
                // above 0 to avoid refetching immediately on the client
                staleTime: 60 * 1000,
            },
        },
    });
}
let browserQueryClient: QueryClient | undefined = undefined;
function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: always make a new query client
        return makeQueryClient();
    } else {
        // Browser: make a new query client if we don't already have one
        // This is very important, so we don't re-make a new client if React
        // suspends during the initial render. This may not be needed if we
        // have a suspense boundary BELOW the creation of the query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}
export function TRPCWrapper({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    const [trpcClient] = useState(() =>
        createTRPCClient<TRPCRouter>({
            links: [
                httpBatchLink({
                    url: `${getUrl()}/api/trpc`, // Replace with your actual API URL
                    transformer: superjson,
                }),
            ],
        }),
    );
    return (
        <QueryClientProvider client={queryClient}>
            <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
                {children}
            </TRPCProvider>
        </QueryClientProvider>
    );
}



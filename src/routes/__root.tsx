import { TanstackDevtools } from '@tanstack/react-devtools';
import { HeadContent, Outlet, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import '../components/i18n';
import { AutumnProvider } from "autumn-js/react";

import AppRouteWrapper from '@/components/appWrapper';
import { GoogleMapsProvider } from '@/components/providers/GoogleMapsProvider';
import { TRPCWrapper } from '@/components/providers/TrpcWrapper';
import { createContext, useState } from 'react';
import { PropertyFilters, PropertyObject } from 'utils/validation/types';
import { create } from 'zustand';
import appCss from '../styles.css?url';
import { ThemeProvider, useTheme } from '@/components/providers/ThemeProvider';
import { UserType } from 'utils/validation/dbSchemas';
import { Toaster } from '@/components/ui/sonner';
import { getHeaders } from '@tanstack/react-start/server';
import { auth } from 'utils/auth';
import { createServerFn } from '@tanstack/react-start';
import { PostHogProvider, PostHogErrorBoundary } from 'posthog-js/react'
import { PropertyFiltersObject } from 'utils/validation/propertyFilters';

export const getRootObjectsServerFn = createServerFn().handler(async ({ data: filters, }) => {

    const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${process.env.VITE_AGENT_ID}`,
        { headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, } as any }
    );
    const body = await response.json();


    return { token: body.token as string, }
})


export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'Doors Imobiliare',
            },
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss,
            },
        ],
    }),
    notFoundComponent: (p) => <div>Not found</div>,
    loader: async () => {

        return await getRootObjectsServerFn()
    },

    shellComponent: RootComponent,
})


type ProgressBarTypeValues = { progress: number, totalSteps: number, checkedSteps: number }

export const usePopoversOpenStore = create<{
    aiChatbotOpen: boolean,
    setAiChatbotOpen: (open: boolean) => void,
    menuOpen: boolean,
    setMenuOpen: (open: boolean) => void,
    userType: typeof UserType[number],
    setUserType: (p: typeof UserType[number]) => void,

    progressBar: ProgressBarTypeValues | undefined,
    setProgressBar: (p: ProgressBarTypeValues | undefined) => void,
}>()((set) => ({
    aiChatbotOpen: false, setAiChatbotOpen: (p) => set({ aiChatbotOpen: p }), menuOpen: false, setMenuOpen: (p) => set({ menuOpen: p }),
    userType: 'buyer', setUserType: (p) => set({ userType: p }),
    progressBar: undefined, setProgressBar: (p) => set({ progressBar: p }),
}));

export const usePropertyAddStore = create<{
    partialProperty: Partial<PropertyObject>,
    getPartialProperty: () => Partial<PropertyObject>,
    setPartialProperty: (p: Partial<PropertyObject>) => void,
    updatePropertyPhotos: (images: string[]) => Promise<void>,
    setUpdatePropertyPhotos: (fn: (images: string[]) => Promise<void>) => void,
    appendPartialProperty: (p: Partial<PropertyObject>) => void,

    titleAndDescResolver: ((title: string, description: string) => void) | undefined,
    setTitleAndDescResolver: (fn: ((title: string, description: string) => void) | undefined) => void,

    titlesAndDescriptions: { title: string, description: string }[],
    setTitlesAndDescriptions: (p: { title: string, description: string }[]) => void,


    postedStatus: { success: boolean, message: string } | undefined,
    setPostedStatus: (p: { success: boolean, message: string } | undefined) => void,

    propertyType: 'edit' | 'add-photos', setPropertyType: (p: 'edit' | 'add-photos') => void
}>()((set, get) => ({
    partialProperty: {},
    setPartialProperty: (p) => set({ partialProperty: p }),
    appendPartialProperty: (p) => { console.log('app', { ...get().partialProperty, ...p }); set({ partialProperty: { ...get().partialProperty, ...p } }) },
    getPartialProperty: () => get().partialProperty,

    postedStatus: undefined, setPostedStatus: (p) => set({ postedStatus: p }),

    updatePropertyPhotos: async () => { },
    setUpdatePropertyPhotos: (fn) => set({ updatePropertyPhotos: fn }),

    titleAndDescResolver: undefined, setTitleAndDescResolver: (fn) => set({ titleAndDescResolver: fn }),

    titlesAndDescriptions: [],
    setTitlesAndDescriptions: (p) => set({ titlesAndDescriptions: p }),

    propertyType: 'edit', setPropertyType: () => set({ propertyType: 'edit' }),
}));





// Property Filters Contexts

type UpdateFiltersFunction = (filters: PropertyFilters) => Promise<string>

export const usePropertyFilterStore = create<{
    sendUpdate(str: string): void, setSendUpdate(fn: (str: string) => void): void
    startConversation(): Promise<void>, endConversation(): Promise<void>
    setStartConversation(fn: () => Promise<void>): void, setEndConversation(fn: () => Promise<void>): void

    setDemoPropertyFilters(p: PropertyFiltersObject | undefined): void,
    demoPropertyFilters: PropertyFiltersObject | undefined,
}>()((set => ({
    sendUpdate: (s) => { }, setSendUpdate: (fn) => { },
    startConversation: async () => { }, endConversation: async () => { },
    setStartConversation: (p) => set({ startConversation: p }),
    setEndConversation: (p) => set({ endConversation: p }),

    setDemoPropertyFilters: (p) => set({ demoPropertyFilters: p }),
    demoPropertyFilters: undefined,
})));


export const ElevenlabsTokenContext = createContext<{ token: string | undefined, setToken: (token: string | undefined) => void }>({ token: undefined, setToken: () => { } });

function RootComponent() {
    // const { theme } = Route.useLoaderData();

    return (
        <ThemeProvider theme={'dark'}>
            <RootDocument>
                <Outlet />
            </RootDocument>
        </ThemeProvider>
    );
}


export function RootDocument({ children }: { children: React.ReactNode }) {
    const { token } = Route.useLoaderData();
    const { theme } = useTheme();

    const routerState = useRouterState();

    const appWrapper = routerState.location.pathname.includes('/app');

    return (
        <html lang="en" className={theme} suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body>
                <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={{
                    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
                    defaults: '2025-05-24',
                }}>
                    <PostHogErrorBoundary >
                        <GoogleMapsProvider>
                            <AutumnProvider betterAuthUrl={import.meta.env.VITE_BETTER_AUTH_URL}>
                                <TRPCWrapper>
                                    {appWrapper ? <AppRouteWrapper token={token}>{children}</AppRouteWrapper> : children}
                                </TRPCWrapper>
                            </AutumnProvider>
                        </GoogleMapsProvider>

                    </PostHogErrorBoundary>

                </PostHogProvider>
                <Toaster />
                {!import.meta.env.PROD && <TanstackDevtools
                    config={{
                        position: 'bottom-right',
                    }}
                    plugins={[
                        {
                            name: 'Tanstack Router',
                            render: <TanStackRouterDevtoolsPanel />,
                        },
                    ]}
                />}
                <Scripts />
            </body>
        </html>
    )
}

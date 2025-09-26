import { HeadContent, Outlet, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import '../components/i18n';

import Header from '../components/Header'

import appCss from '../styles.css?url'
import { getThemeServerFn } from 'utils/theme';
import { Theme, ThemeProvider, useTheme } from "@/components/providers/ThemeProvider";
import AppRouteWrapper from '@/components/appWrapper';
import { TRPCWrapper } from '@/components/providers/TrpcWrapper';
import { AuthProvider } from '@/components/providers/BetterAuthProvider';
import { GoogleMapsProvider } from '@/components/providers/GoogleMapsProvider';
import { PropertyFilters, PropertyObject } from 'utils/validation/types';
import { createContext, useContext, useState } from 'react';


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
                title: 'TanStack Start Starter',
            },
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss,
            },
        ],
    }),
    loader: async () => {
        const theme = await getThemeServerFn()

        const response = await fetch(
            `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${process.env.VITE_AGENT_ID}`,
            { headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, } as any }
        );
        const body = await response.json();

        return { theme, token: body.token };
    },

    shellComponent: RootComponent,
})


export const PropertyFilterContext = createContext<{
    propertyFilters: PropertyFilters | undefined,
    setPropertyFilters: React.Dispatch<React.SetStateAction<PropertyFilters | undefined>>
}>({ propertyFilters: undefined, setPropertyFilters: () => { } });

type UpdateFiltersFunction = (filters: PropertyFilters) => Promise<string>

export const UpdatePropertyFiltersContext = createContext<{
    updatePropertyFilters: UpdateFiltersFunction,
    setUpdatePropertyFilters: React.Dispatch<React.SetStateAction<UpdateFiltersFunction>>,
    sendUpdate(str: string): void
    setSendUpdate(fn: (str: string) => void): void
}>({ updatePropertyFilters: async () => '', setUpdatePropertyFilters: () => { }, sendUpdate: (s) => { }, setSendUpdate: (fn) => { } });

export const ElevenlabsTokenContext = createContext<{ token: string | undefined, setToken: (token: string | undefined) => void }>({ token: undefined, setToken: () => { } });

function RootComponent() {
    const { theme } = Route.useLoaderData();

    return (
        <ThemeProvider theme={theme}>
            <RootDocument>
                <Outlet />
            </RootDocument>
        </ThemeProvider>
    );
}

function RootDocument({ children }: { children: React.ReactNode }) {
    const { theme, token: receivedToken } = Route.useLoaderData();

    const [token, setToken] = useState<string>(receivedToken);

    const [updatePropertyFilters, setUpdatePropertyFilters] = useState<UpdateFiltersFunction>(async () => '');
    const [sendUpdate, setSendUpdate] = useState<(str: string) => void>(() => { });
    const [propertyFilters, setPropertyFilters] = useState<PropertyFilters | undefined>();


    const routerState = useRouterState();

    const appWrapper = routerState.location.pathname.includes('/app');

    return (
        <html lang="en" className={theme} suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body>
                <UpdatePropertyFiltersContext.Provider value={{ updatePropertyFilters, setUpdatePropertyFilters, sendUpdate, setSendUpdate }}>
                    <PropertyFilterContext.Provider value={{ propertyFilters, setPropertyFilters }}>
                        <GoogleMapsProvider>
                            <TRPCWrapper>
                                <AuthProvider>
                                    {appWrapper ? <AppRouteWrapper token={token}>{children}</AppRouteWrapper> : children}
                                </AuthProvider>
                            </TRPCWrapper>
                        </GoogleMapsProvider>
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
                    </PropertyFilterContext.Provider>
                </UpdatePropertyFiltersContext.Provider>
            </body>
        </html>
    )
}

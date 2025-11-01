


//this file tests that all pages load
import { describe, it, expect, vi, afterEach, } from 'vitest'
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';

import { PropertyAdd } from './app/properties/add.tsx';
import { ProfileView } from './app/profile/index';
import { MyPropertiesRoute } from './app/my-properties';
import { AuthPage } from './auth/$path/index.tsx';
import { LandingPage } from './index';
import { PropertiesRoute } from './app/properties/index';
import { PropertyDetailRoute } from './app/properties/$id.tsx';

import { Route as ProfileRoute } from './app/profile/index';
import { createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RegisteredRouter, RouterProvider } from '@tanstack/react-router';
import { cleanup } from '@testing-library/react'
import { TRPCWrapper } from '@/components/providers/TrpcWrapper.tsx';




type Routes = RegisteredRouter["routesByPath"];

interface MockedRouterProps<T extends keyof Routes = keyof Routes> {
    initialLocation?: string;
    mockRoute?: MockRoute<T>;
    children: React.ReactNode;
}

type MockRoute<T extends keyof Routes> = {
    path: T;
    loaderData?: Routes[T] extends { types: { loaderData: infer LoaderData } } ? LoaderData : never;
    context?: Routes[T] extends { types: { routeContext: infer Context } } ? Context : never;
};

/**
 * Router wrapper component for use with renderHook and testing
 */
export const MockedRouter: React.FC<MockedRouterProps> = ({
    initialLocation = "/",
    mockRoute,
    children,
}) => {
    const memoryHistory = createMemoryHistory({
        initialEntries: [initialLocation],
    });

    const testRouteTree = createRootRoute({
        component: () => (mockRoute ? <Outlet /> : children),
    });

    if (mockRoute) {
        testRouteTree.addChildren([
            createRoute({
                getParentRoute: () => testRouteTree,
                path: mockRoute.path,
                component: () => children,
                beforeLoad: () => mockRoute.context,
                loader: () => mockRoute.loaderData,
            }),
        ]);
    }

    const router = createRouter({
        routeTree: testRouteTree,
        defaultPendingMs: 0,
        history: memoryHistory,
    });

    return <RouterProvider router={router} />;
};

export const renderWithRouter = async <R extends keyof Routes>(
    component: React.ReactElement,
    {
        initialLocation = "/",
        mockRoute,
        ...options
    }: { initialLocation?: string; mockRoute?: MockRoute<R> } & RenderOptions = {},
): Promise<void> => {
    render(
        <MockedRouter initialLocation={initialLocation} mockRoute={mockRoute}>
            <TRPCWrapper>
                {component}
            </TRPCWrapper>
        </MockedRouter>,
        options,
    );

    await waitFor(() => {
        // TSR renders async, so we wait for it here
        expect(document.body).toBeInTheDocument();
    });
};





describe('Loaded Pages', () => {
    const router = createRouter({ routeTree: createRootRoute() });

    it('Property Add page loads', async () => {
        //   vi.mocked(PropertyAddRoute.useLoaderData).mockReturnValue({ session });
        // vi.mocked(PropertyAddRoute.useSearch).mockReturnValue(searchParams);

        await renderWithRouter(<PropertyAdd />, {
            initialLocation: "/app/properties/add",
            mockRoute: {
                path: "/app/properties/add", // restricted to available route paths
                loaderData: undefined, // fully typed
            },
        });

        expect(screen.queryAllByRole('heading').at(0)).toBeInTheDocument()
    });

    it('My Properties page loads', async () => {
        //   vi.mocked(PropertyAddRoute.useLoaderData).mockReturnValue({ session });
        // vi.mocked(PropertyAddRoute.useSearch).mockReturnValue(searchParams);

        await renderWithRouter(<MyPropertiesRoute />, {
            initialLocation: "/app/my-properties",
            mockRoute: {
                path: "/app/my-properties", // restricted to available route paths
                loaderData: undefined, // fully typed
            },
        });

        expect(screen.queryAllByRole('heading').at(0)).toBeInTheDocument()
    });

    it('Auth Page loads', async () => {
        //   vi.mocked(PropertyAddRoute.useLoaderData).mockReturnValue({ session });
        // vi.mocked(PropertyAddRoute.useSearch).mockReturnValue(searchParams);

        await renderWithRouter(<AuthPage />, {
            initialLocation: "/auth/$path",
            mockRoute: {
                path: "/auth/$path", // restricted to available route paths
                loaderData: undefined, // fully typed
            },
        });

        screen.debug()

        expect(screen.queryAllByRole('heading').at(0)).toBeInTheDocument()
    });

    it('Landing Page loads', async () => {
        //   vi.mocked(PropertyAddRoute.useLoaderData).mockReturnValue({ session });
        // vi.mocked(PropertyAddRoute.useSearch).mockReturnValue(searchParams);

        await renderWithRouter(<LandingPage />, {
            initialLocation: "/",
            mockRoute: {
                path: "/", // restricted to available route paths
                loaderData: undefined, // fully typed
            },
        });

        expect(screen.queryAllByRole('heading').at(0)).toBeInTheDocument()
    });

    it('Properties Page loads', async () => {
        //   vi.mocked(PropertyAddRoute.useLoaderData).mockReturnValue({ session });
        // vi.mocked(PropertyAddRoute.useSearch).mockReturnValue(searchParams);

        await renderWithRouter(<PropertiesRoute />, {
            initialLocation: "/app/properties",
            mockRoute: {
                path: "/app/properties", // restricted to available route paths
                loaderData: undefined, // fully typed
            },
        });

        expect(screen.queryAllByRole('heading').at(0)).toBeInTheDocument()
    });

    it('Property Page loads', async () => {
        //   vi.mocked(PropertyAddRoute.useLoaderData).mockReturnValue({ session });
        // vi.mocked(PropertyAddRoute.useSearch).mockReturnValue(searchParams);

        await renderWithRouter(<PropertyDetailRoute />, {
            initialLocation: "/app/properties/68caa9946b373862c81fb5d3",
            mockRoute: {
                path: "/app/properties/68caa9946b373862c81fb5d3", // restricted to available route paths
                loaderData: undefined, // fully typed
            },
        });

        expect(screen.queryAllByRole('heading').at(0)).toBeInTheDocument()
    });

    it('Property Add Page loads', async () => {
        //   vi.mocked(PropertyAddRoute.useLoaderData).mockReturnValue({ session });
        // vi.mocked(PropertyAddRoute.useSearch).mockReturnValue(searchParams);

        await renderWithRouter(<PropertyAdd />, {
            initialLocation: "/app/properties/add",
            mockRoute: {
                path: "/app/properties/add", // restricted to available route paths
                loaderData: undefined, // fully typed
            },
        });

        expect(screen.queryAllByRole('heading').at(0)).toBeInTheDocument()
    });

    it('Profile Page loads', async () => {
        //   vi.mocked(PropertyAddRoute.useLoaderData).mockReturnValue({ session });
        // vi.mocked(PropertyAddRoute.useSearch).mockReturnValue(searchParams);

        await renderWithRouter(<ProfileView />, {
            initialLocation: "/app/profile",
            mockRoute: {
                path: "/app/profile", // restricted to available route paths
                loaderData: undefined, // fully typed
            },
        });

        expect(screen.queryAllByRole('heading').at(0)).toBeInTheDocument()
    });

    it('Landing Page loads', async () => {
        //   vi.mocked(PropertyAddRoute.useLoaderData).mockReturnValue({ session });
        // vi.mocked(PropertyAddRoute.useSearch).mockReturnValue(searchParams);

        await renderWithRouter(<LandingPage />, {
            initialLocation: "/",
            mockRoute: {
                path: "/", // restricted to available route paths
                loaderData: undefined, // fully typed
            },
        });

        expect(screen.queryAllByRole('heading').at(0)).toBeInTheDocument()
    });
});

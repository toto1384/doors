



//this file tests that all pages load
import { describe, it, expect, } from 'vitest'
import { screen, } from '@testing-library/react';

import { Route as ProfileRoute } from './app/profile/index';
import { Route as AuthPageRoute } from './auth/$path/index.tsx';
import { Route as LandingPage } from './index';
import { Route as PropertiesRoute } from './app/properties/index';
import { Route as PropertyAddRoute } from './app/properties/add.tsx';
import { Route as MyPropertiesRoute } from './app/my-properties';

import { ReactNode } from 'react';
import { renderWithRouter } from '../../setupTests.tsx';
import { createRootRoute, createRouter } from '@tanstack/react-router';



const PropertyAdd = PropertyAddRoute.options.component as () => ReactNode;


describe('Loaded Pages', () => {
    const router = createRouter({ routeTree: createRootRoute() });

    it('Property Add page loads', async () => {
        //   vi.mocked(PropertyAddRoute.useLoaderData).mockReturnValue({ session });
        // vi.mocked(PropertyAddRoute.useSearch).mockReturnValue(searchParams);

        console.log('PropertyAddRoute', PropertyAdd)
        await renderWithRouter(<PropertyAdd />, {
            initialLocation: "/app/properties/add",
            mockRoute: {
                path: "/app/properties/add", // restricted to available route paths
                loaderData: undefined, // fully typed
            },
        });

        expect(screen.queryByTestId('title')).toBeInTheDocument()
    });

});


import { libraries, LocationSelector } from "@/components/basics/locationSelector";
import { useLoadScript } from "@react-google-maps/api";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { searchLocationByString } from "utils/googleMapsUtils";
import { propertyFiltersSchema } from "utils/validation/propertyFilters";
import { LocationObject } from "utils/validation/types";
import { PropertyObject } from "utils/validation/types";
import { trpcRouter } from "trpc/router";
import { createServerFn } from "@tanstack/react-start";
import { PropertyCard } from "./properties";
import { getHeaders } from "@tanstack/react-start/server";
import { auth } from "utils/auth";




export const getPropertiesWithFilters = createServerFn().validator((d) => propertyFiltersSchema.parse(d)).handler(async ({ data: filters, }) => {
    const headers = getHeaders()

    const h = new Headers()
    Object.entries(headers).filter(r => r[1]).map(r => h.append(r[0], r[1]!))

    const sessionData = await auth.api.getSession({ headers: h })

    const caller = trpcRouter.createCaller({ headers: h, user: sessionData?.user })
    const res = await caller.properties.list(filters)
    return res as PropertyObject[]
})


export const Route = createFileRoute('/app/')({
    component: Dashboard,

    loader: async () => {
        // Load initial properties without filters
        const data = await getPropertiesWithFilters({ data: {} })
        console.log('getPropertiesWithFilters', data.length)
        return data
    }
})



function Dashboard() {
    const propertiesReceived = Route.useLoaderData()

    const [properties, setProperties] = useState<PropertyObject[]>(propertiesReceived)

    const [locationObject, setLocationObject] = useState<LocationObject | undefined>()


    return (
        <div className="flex flex-col items-center justify-center border mx-2 rounded-lg">
            <div className='flex w-full flex-col gap-2 border-b px-6 pt-4 pb-5 dark:border-[#404040] '>
                <h1 className="text-2xl font-light">Ce vrei să faci astăzi pe DOORS?</h1>

                <p className={`relative max-w-2xl pl-4 text-xs before:absolute before:left-0 before:mt-1 before:text-3xl/1 before:text-gray-500  before:content-['•'] dark:text-[#a3a3a3] before:dark:text-[#737373]`}>
                    Alege dacă vrei să explorezi proprietăți sau să adaugi una pe platformă.
                </p>
            </div>
            {/* <LocationSelector locationObject={locationObject as any} setLocationObject={setLocationObject} /> */}

            {/* Properties Grid */}
            {<div className="grid grid-cols-2 gap-1 md:gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
                {properties?.map((property) => (<PropertyCard key={property._id} property={property} />))}
            </div>}

            {
                properties && properties.length === 0 && (
                    <div className="h-full py-8 text-center">
                        <p className="text-gray-400">No properties found matching your criteria.</p>
                    </div>
                )
            }
        </div>
    );
}


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




export const getPropertiesWithFilters = createServerFn().validator((d) => propertyFiltersSchema.parse(d)).handler(async ({ data: filters, }) => {
    const caller = trpcRouter.createCaller({})
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
        <div className="flex flex-col items-center justify-center ">
            <div className='flex flex-col gap-2 w-full border-b dark:border-[#404040] dark:bg-[#262626] pt-4 pb-5 px-6'>
                <h1 className="text-2xl font-light">Ce vrei să faci astăzi pe DOORS?</h1>

                <p className={`max-w-2xl before:content-['•'] before:dark:text-[#737373] before:text-3xl/1 pl-4 before:absolute before:mt-1 before:left-0 relative  before:text-gray-500 text-xs dark:text-[#a3a3a3]`}>
                    Alege dacă vrei să explorezi proprietăți sau să adaugi una pe platformă.
                </p>
            </div>
            {/* <LocationSelector locationObject={locationObject as any} setLocationObject={setLocationObject} /> */}

            {/* Properties Grid */}
            {<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                {properties?.map((property) => (<PropertyCard key={property._id} property={property} />))}
            </div>}

            {
                properties && properties.length === 0 && (
                    <div className="text-center h-full py-8">
                        <p className="text-gray-400">No properties found matching your criteria.</p>
                    </div>
                )
            }
        </div>
    );
}

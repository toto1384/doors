import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useContext } from 'react'
import { useTRPCClient } from '../../../../trpc/react'
import { PropertyFilters } from 'utils/validation/types'
import { LocationObject, PropertyObject } from 'utils/validation/types'
import { LocationSelector } from '@/components/basics/locationSelector'
import { Facilities, propertyFiltersSchema } from 'utils/validation/propertyFilters.ts'
import { trpcRouter } from 'trpc/router'
import { createServerFn } from '@tanstack/react-start'
import { PropertyType } from 'utils/validation/propertySchema'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelect, MultiSelectContent, MultiSelectItem, MultiSelectSeparator, MultiSelectTrigger, MultiSelectValue } from '@/components/ui/multi-select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDownIcon } from 'lucide-react'
import { usePropertyFilterStore } from '@/routes/__root'


export const getPropertiesWithFilters = createServerFn().validator((d) => propertyFiltersSchema.parse(d)).handler(async ({ data: filters, }) => {
    const caller = trpcRouter.createCaller({})
    const res = await caller.properties.list(filters)
    return res as PropertyObject[]
})

export const Route = createFileRoute('/app/properties/')({
    component: PropertiesRoute,
    loader: async () => {
        // Load initial properties without filters
        const data = await getPropertiesWithFilters({ data: {} })
        console.log('getPropertiesWithFilters', data.length)
        return data
    }
})


function PropertiesRoute() {
    const propertiesReceived = Route.useLoaderData()
    const trpcClient = useTRPCClient()

    const { updatePropertyFilters, setUpdatePropertyFilters, propertyFilters, setPropertyFilters } = usePropertyFilterStore(state => ({
        propertyFilters: state.propertyFilters,
        setPropertyFilters: state.setPropertyFilters,
        updatePropertyFilters: state.updatePropertyFilters,
        setUpdatePropertyFilters: state.setUpdatePropertyFilters,
    }))

    const [properties, setProperties] = useState<PropertyObject[]>(propertiesReceived)


    // Set up the updatePropertyFilters function to work with context instead of URL
    useEffect(() => {
        setUpdatePropertyFilters(() => async (filters: PropertyFilters) => {
            console.log('setUpdatePropertyFilters', { ...propertyFilters, ...filters })

            // Update context instead of URL
            setPropertyFilters({ ...propertyFilters, ...filters })

            const newProps = await trpcClient.properties.list.query({ ...propertyFilters, ...filters })
            setProperties(newProps)

            return JSON.stringify(newProps)
        })
    }, [propertyFilters])

    const handleFilterChange = async (newFilters: Partial<PropertyFilters>) => {
        updatePropertyFilters(newFilters)
    }




    return (
        <div className="container mx-auto h-full">
            <div className='flex flex-col gap-2 w-full border-b dark:border-[#404040] dark:bg-[#262626] pt-4 pb-5 px-6'>
                <h1 className="text-2xl font-light">Cele mai potrivite proprietăți pentru tine</h1>

                <p className={`max-w-2xl before:content-['•'] before:dark:text-[#737373] before:text-3xl/1 pl-4 before:absolute before:mt-1 before:left-0 relative  before:text-gray-500 text-xs dark:text-[#a3a3a3]`}>Am filtrat proprietățile în funcție de preferințele tale. Poți vedea aici cele care se potrivesc cel mai bine criteriilor setate.</p>
            </div>


            {/* Filters Section */}
            <div className="px-4 pt-4">
                <div className='flex flex-row items-center gap-3'>

                    <MultiSelect values={propertyFilters?.propertyType} onValuesChange={value => handleFilterChange({ propertyType: value as any })}>
                        <MultiSelectTrigger className=" w-[150px] custor-pointer" >
                            <MultiSelectValue className='cursor-pointer' placeholder="Property Type" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                            <MultiSelectItem value="apartment">Apartment</MultiSelectItem>
                            <MultiSelectItem value="house">House</MultiSelectItem>
                            <MultiSelectItem value="hotel">Hotel</MultiSelectItem>
                            <MultiSelectItem value="office">Office</MultiSelectItem>
                        </MultiSelectContent>
                    </MultiSelect>
                    <Popover>
                        <PopoverTrigger className='px-3 py-1.5 bg-input/30 text-black/50 dark:text-white hover:bg-input/50 dark:bg-[#404040] rounded flex flex-row items-center'>
                            Budget
                            <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
                        </PopoverTrigger>
                        <PopoverContent>
                            <label className="block text-sm font-medium mb-2">Budget Range</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={propertyFilters?.budget?.min || ''}
                                    className="bg-input/50 text-black/50 dark:text-white rounded px-3 py-2 w-24"
                                    onChange={(e) => {
                                        const min = e.target.value ? parseInt(e.target.value) : undefined
                                        handleFilterChange({
                                            budget: { ...propertyFilters?.budget, min }
                                        })
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={propertyFilters?.budget?.max || ''}
                                    className="bg-input/50 text-black/50 dark:text-white rounded px-3 py-2 w-24"
                                    onChange={(e) => {
                                        const max = e.target.value ? parseInt(e.target.value) : undefined
                                        handleFilterChange({
                                            budget: { ...propertyFilters?.budget, max }
                                        })
                                    }}
                                />
                            </div>

                        </PopoverContent>
                    </Popover>

                    <LocationSelector
                        width={150}
                        locationObject={propertyFilters?.location}
                        setLocationObject={(l) => {
                            console.log('in loc', propertyFilters)
                            // handleFilterChange({ location: l })
                            handleFilterChange({ location: l })
                        }}
                    />

                    <MultiSelect
                        values={propertyFilters?.numberOfRooms?.map(i => i.toString())}
                        onValuesChange={value => handleFilterChange({ numberOfRooms: value.map(i => Number(i)) as any })}
                    >
                        <MultiSelectTrigger className=" w-[150px] custor-pointer" >
                            <MultiSelectValue className='cursor-pointer' placeholder="Number of Rooms" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                <MultiSelectItem key={num} value={`${num}`}>{num} rooms</MultiSelectItem>
                            ))}
                        </MultiSelectContent>
                    </MultiSelect>

                    <MultiSelect values={propertyFilters?.facilities} onValuesChange={value => handleFilterChange({ facilities: value as (typeof Facilities[number])[] })}>
                        <MultiSelectTrigger className=" w-[150px] custor-pointer" >
                            <MultiSelectValue className='cursor-pointer' placeholder="Facilities" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                            <MultiSelectItem value="parking">Parking</MultiSelectItem>
                            <MultiSelectItem value="balcony">Balcony</MultiSelectItem>
                            <MultiSelectItem value="terrace">Terrace</MultiSelectItem>
                            <MultiSelectItem value="garden">Garden</MultiSelectItem>
                            <MultiSelectItem value="elevator">Elevator</MultiSelectItem>
                            <MultiSelectItem value="air_conditioning">Air conditioning</MultiSelectItem>
                            <MultiSelectItem value="central_heating">Central heating</MultiSelectItem>
                            <MultiSelectItem value="furnished">Furnished</MultiSelectItem>
                            <MultiSelectItem value="internet">Internet</MultiSelectItem>
                        </MultiSelectContent>
                    </MultiSelect>
                    {/* <button */}
                    {/*     className="bg-blue-600 text-white px-6 py-2 rounded mt-4 bg-gradient-to-br from-[#4C7CED] to-[#7B31DC]" */}
                    {/*     onClick={() => setPropertyFilters({})} */}
                    {/* > */}
                    {/*     Save Changes */}
                    {/* </button> */}
                </div>

            </div>

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
        </div >
    )
}


export const PropertyCard = ({ property }: { property: PropertyObject }) => {
    return <Link
        to='/app/properties/$id'
        params={{ id: property._id }}
        key={property._id}
        className="relative bg-[#f7f7f7] dark:bg-[#2B1C37]/20 rounded-[6px] overflow-hidden"
    >
        <div className=" h-48 flex items-center justify-center">
            <img src={property.imageUrls[0]} className="w-full h-full object-cover" />
        </div>

        <div className="p-4">
            <div className="flex items-center absolute top-2 left-2 justify-between mb-2">
                <span className="bg-[#32215A] text-white flex flex-row font-light items-center text-xs px-2 py-1 rounded">
                    <img src="/icons/checkIcon.svg" className="w-3 h-3 mr-1" />
                    100% Match
                </span>
            </div>

            <h3 className="text-lg font-normal mb-2">{property.title}</h3>
            <p className="text-[22px] font-light mb-2 text-[#8A4FFF]">€{property.price.value.toLocaleString()}</p>

            <div className="flex items-center gap-4 text-sm text-[#a3a3a3]">
                {[
                    { icon: "/icons/surfaceArea.svg", text: `${property.surfaceArea}m²` },
                    { icon: "/icons/bedIcon.svg", text: `${property.numberOfRooms} rooms` },
                    { icon: "/icons/locationIcon.svg", text: `${property.location.city}` },
                ].map(i =>
                    <span className='flex flex-row items-center gap-1 rounded bg-[#32215A]'><img src={i.icon} className="w-4 h-4" /> {i.text} </span>
                )}
            </div>
        </div>
    </Link>
}

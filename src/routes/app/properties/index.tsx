import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useContext } from 'react'
import { useTRPCClient } from '../../../../trpc/react'
import { PropertyFilters } from 'utils/validation/types'
import { LocationObject, PropertyObject } from 'utils/validation/types'
import { LocationSelector } from '@/components/basics/locationSelector'
import { Facilities, propertyFiltersSchema } from 'utils/validation/propertyFilters.ts'
import { trpcRouter } from 'trpc/router'
import { createServerFn } from '@tanstack/react-start'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelect, MultiSelectContent, MultiSelectItem, MultiSelectSeparator, MultiSelectTrigger, MultiSelectValue } from '@/components/ui/multi-select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDownIcon, X } from 'lucide-react'
import { usePropertyFilterStore } from '@/routes/__root'
import { useShallow } from 'zustand/react/shallow'
import { BathIcon, BedIcon, ChatIcon, FilterIcon, LocationIcon, priceChartSvg, SurfaceAreaIcon } from '@/components/icons/propertyIcons'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { cn } from 'lib/utils'
import { auth } from 'utils/auth'


export const getPropertiesWithFilters = createServerFn().validator((d) => propertyFiltersSchema.parse(d)).handler(async ({ data: filters, }) => {
    // auth.api.getSession()
    const caller = trpcRouter.createCaller({ headers: undefined, user: undefined })
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

    const { updatePropertyFilters, setUpdatePropertyFilters, propertyFilters, setPropertyFilters } = usePropertyFilterStore(useShallow(state => ({
        propertyFilters: state.propertyFilters,
        setPropertyFilters: state.setPropertyFilters,
        updatePropertyFilters: state.updatePropertyFilters,
        setUpdatePropertyFilters: state.setUpdatePropertyFilters,
    })))

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


    const [showFilters, setShowFilters] = useState(false)


    const filterButton = <button onClick={() => setShowFilters(!showFilters)} className="flex flex-row cursor-pointer touch-none select-none items-center gap-3 w-fit border rounded-[6px] border-[#C1A7FF] text-xs text-[#C1A7FF] px-3 py-2.5">
        <FilterIcon className='w-3 h-3' />
        Filtreaza
    </button>

    return (
        <div className='relative'>
            <div className="flex md:hidden flex-row items-center justify-between mx-3 gap-2">
                <Input placeholder="Search" className="w-full bg-transparent border py-[7px] h-auto" />
                {filterButton}
            </div>


            <div className="h-full border flex flex-col rounded-lg mx-3 mt-2 ">
                <div className='flex flex-row items-center gap-3 px-2 md:px-6 py-2 border-b justify-between'>
                    <div className='flex flex-col gap-2 w-full pt-2 pb-2 md:pt-4 md:pb-5 '>
                        <h1 className="text-xl font-light">Cele mai potrivite proprietăți pentru tine</h1>

                        <p className={`max-w-2xl before:content-['•'] before:dark:text-[#737373] before:text-2xl/1 pl-5 before:absolute before:mt-1 before:left-0 relative  before:text-gray-500 text-xs dark:text-[#a3a3a3]`}>
                            Am filtrat proprietățile în funcție de preferințele tale. Poți vedea aici cele care se potrivesc cel mai bine criteriilor setate.
                        </p>
                    </div>
                    <div className='hidden md:block'> {filterButton}</div>
                </div>

                {/* Filters Section */}
                {showFilters && <div className='md:flex hidden px-4 pt-4 flex-row items-center gap-3'>

                    <PropertyTypeSelector propertyFilters={propertyFilters} handleFilterChange={handleFilterChange} />

                    <Popover>
                        <PopoverTrigger className='px-3 py-1.5 bg-input/30 text-black/50 dark:text-white hover:bg-input/50 dark:bg-[#241540] rounded flex flex-row items-center'>
                            Budget
                            <ChevronDownIcon className="ml-3 size-4 shrink-0 opacity-50" />
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
                    {/* better looking locatoin selector, but needs fixing */}
                    {/* <Popover> */}
                    {/*     <PopoverTrigger className='px-3 py-1.5 bg-input/30 text-black/50 dark:text-white hover:bg-input/50 dark:bg-[#241540] rounded flex flex-row items-center'> */}
                    {/*         {propertyFilters?.location ? (propertyFilters?.location?.city + ", " + propertyFilters?.location?.state) : "Location"} */}
                    {/*         <ChevronDownIcon className="ml-3 size-4 shrink-0 opacity-50" /> */}
                    {/*     </PopoverTrigger> */}
                    {/*     <PopoverContent > */}
                    {/*         <LocationSelector */}
                    {/*             width={150} */}
                    {/*             locationObject={propertyFilters?.location} */}
                    {/*             setLocationObject={(l) => { */}
                    {/*                 console.log('in loc', propertyFilters) */}
                    {/*                 // handleFilterChange({ location: l }) */}
                    {/*                 handleFilterChange({ location: l }) */}
                    {/*             }} */}
                    {/*         /> */}
                    {/*     </PopoverContent> */}
                    {/* </Popover> */}


                    <MultiSelect
                        values={propertyFilters?.numberOfRooms?.map(i => i.toString())}
                        onValuesChange={value => handleFilterChange({ numberOfRooms: value.map(i => Number(i)) as any })}
                    >
                        <MultiSelectTrigger className=" w-[150px] custor-pointer" >
                            <MultiSelectValue className='cursor-pointer text-white' placeholder="Number of Rooms" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                <MultiSelectItem key={num} value={`${num}`}>{num} rooms</MultiSelectItem>
                            ))}
                        </MultiSelectContent>
                    </MultiSelect>

                    <MultiSelect values={propertyFilters?.facilities} onValuesChange={value => handleFilterChange({ facilities: value as (typeof Facilities[number])[] })}>
                        <MultiSelectTrigger className=" w-[150px] custor-pointer" >
                            <MultiSelectValue className='cursor-pointer text-white' placeholder="Facilities" />
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
                </div>}

                {/* Mobile Filters Section */}
                {showFilters && <MobileFiltersOverlay
                    propertyFilters={propertyFilters}
                    onFilterChange={handleFilterChange}
                    onClose={() => setShowFilters(false)}
                />}

                {/* Properties Grid */}
                {<div className="grid grid-cols-2 lg:grid-cols-3 gap-x-1 md:gap-x-3 gap-y-3 p-4">
                    {properties?.map((property) => (<PropertyCard match={100} key={property._id} property={property} />))}
                </div>}

                {
                    properties && properties.length === 0 && (
                        <div className="text-center h-full py-8">
                            <p className="text-gray-400">No properties found matching your criteria.</p>
                        </div>
                    )
                }
            </div >
        </div>
    )
}


export const PropertyCard = ({ property, match }: { property: PropertyObject, match?: number }) => {
    return <Link
        to='/app/properties/$id'
        params={{ id: property._id }}
        key={property._id}
        className="relative bg-[#f7f7f7] dark:bg-[#2B1C37]/50 p-1.5 md:p-3 rounded-[6px] overflow-hidden"
    >
        <div className=" max-h-42 flex items-center justify-center">
            <img src={property.imageUrls[0]} className="max-h-42 w-full rounded-[6px] h-full object-cover" />
        </div>

        {match && <div className="flex items-center absolute left-3 top-3 md:top-5 md:left-5 justify-between mb-2">
            <span className="bg-[#623398] text-white flex flex-row font-light items-center text-[9px] px-2 py-1 rounded">
                <img src="/icons/checkIcon.svg" className="w-2 h-2 mr-1" />
                {match}% Match
            </span>
        </div>}


        <div className="flex items-center gap-1 mt-2 text-[10px] text-[#a3a3a3]">
            {[
                { icon: <BedIcon className="w-3 h-3" color="#ffffff" />, text: `${property.numberOfRooms}` },
                { icon: <BathIcon className='w-3 h-3' color="#ffffff" />, text: `${property.numberOfBathrooms}` },
                { icon: <SurfaceAreaIcon className='w-3 h-3' color="#ffffff" />, text: `${property.surfaceArea}m²` },
                // { icon: "/icons/locationIcon.svg", text: `${property.location.city}` },
            ].map(i =>
                <span className='flex flex-row items-center gap-1 rounded bg-[#32215A] px-2 py-0.5'>{i.text}{i.icon}  </span>
            )}
        </div>

        <p className="text-xs md:text-[22px] font-light my-2 text-[#8A4FFF]">€{property.price.value.toLocaleString()}</p>
        <h3 className="text-sm md:text-lg font-normal md:mb-2">{property.title}</h3>

        <div className='flex flex-row text-[#637381] text-xs md:text-md items-center gap-1 md:mt-2'>
            <LocationIcon color={'#637381'} className="w-4 h-4 mt-2 mb-2" />
            {property.location.city}, {property.location.state}
        </div>
    </Link>
}

function PropertyTypeSelector({ propertyFilters, handleFilterChange, className }: { propertyFilters: PropertyFilters | undefined, handleFilterChange: (filters: PropertyFilters) => void, className?: string }) {
    return <MultiSelect values={propertyFilters?.propertyType} onValuesChange={value => handleFilterChange({ propertyType: value as any })} >
        <MultiSelectTrigger className={cn(" w-[150px] custor-pointer", className)} >
            <MultiSelectValue className='cursor-pointer text-white' placeholder="Property Type" />
        </MultiSelectTrigger>
        <MultiSelectContent>
            <MultiSelectItem value="apartment">Apartment</MultiSelectItem>
            <MultiSelectItem value="house">House</MultiSelectItem>
            <MultiSelectItem value="hotel">Hotel</MultiSelectItem>
            <MultiSelectItem value="office">Office</MultiSelectItem>
        </MultiSelectContent>
    </MultiSelect>
}

// Mobile Filters Overlay Component
function MobileFiltersOverlay({
    propertyFilters,
    onFilterChange,
    onClose
}: {
    propertyFilters: PropertyFilters | undefined,
    onFilterChange: (filters: Partial<PropertyFilters>) => void,
    onClose: () => void
}) {


    const min = 10000
    const max = 2000000

    return (
        <div className="md:hidden fixed top-14 bottom-20 left-3 right-3 z-50 bg-[#120826] text-white rounded-lg border overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b rounded-b-lg p-2 pb-3 pt-4 mb-8">
                <h1 className="text-2xl font-light">Filtrează proprietăți</h1>
                <button onClick={onClose} className="pl-2 pb-2 pt-1 pr-1"> <X className="w-6 h-6" /> </button>
            </div>


            <h2 className="text-lg font-medium mb-4 px-2">Tip Locuița</h2>
            <PropertyTypeSelector propertyFilters={propertyFilters} handleFilterChange={onFilterChange} className='mx-2 py-4 pl-3' />

            {/* Price Range */}
            <div className="mb-8 mt-3 p-2">
                <div className='flex flex-row items-center justify-between'>
                    <h2 className="text-lg font-medium mb-4">Price</h2>
                    <div className="text-[#7B31DC] text-lg font-medium mb-4">
                        ${(propertyFilters?.budget?.min ?? min).toLocaleString()}-{(propertyFilters?.budget?.max ?? max).toLocaleString()}
                    </div>
                </div>

                <div className="flex justify-center"> {priceChartSvg} </div>

                {/* Dual Range Slider */}
                <div className="relative mb-6">
                    <Slider
                        value={[propertyFilters?.budget?.min ?? min, propertyFilters?.budget?.max ?? max]}
                        onValueChange={([min, max]) => {
                            console.log('min', min, 'max', max)
                            onFilterChange({ ...propertyFilters, budget: { min, max } })
                        }}
                        trackClassName='bg-[#8A4FFF] data-[orientation=horizontal]:h-1'
                        min={min}
                        max={max}
                        step={50}
                        className="w-full"
                    />
                </div>

                {/* Manual Input */}
                <div className='grid grid-cols-2 gap-2'>
                    <Input placeholder="Introdu min" value={propertyFilters?.budget?.min} onChange={(v) => onFilterChange({ ...propertyFilters, budget: { min: parseInt(v.target.value) } })} />
                    <Input placeholder="Introdu max" value={propertyFilters?.budget?.max} onChange={(v) => onFilterChange({ ...propertyFilters, budget: { max: parseInt(v.target.value) } })} />
                </div>
            </div>

            {/* Location */}
            <div className="mb-8 px-2">
                <h2 className="text-lg font-medium mb-4">Locație</h2>
                <LocationSelector className='py-4 rounded-lg placeholder-gray-400' locationObject={propertyFilters?.location} setLocationObject={(l) => onFilterChange({ location: l })} />
            </div>

            {/* Number of Rooms */}
            <div className="mb-8 px-2">
                <h2 className="text-lg font-medium mb-4">Tip locuița</h2>
                <div className="grid grid-cols-5 gap-3">
                    {[1, 2, 3, 4, '5+'].map((num) => (
                        <button
                            key={num}
                            className={`py-2 px-4 rounded-lg text-sm font-light text-center ${propertyFilters?.numberOfRooms?.includes(typeof num === 'number' ? num : 5)
                                ? 'bg-[#7B31DC] text-white'
                                : 'bg-[#241540] text-gray-400'
                                }`}
                            onClick={() => {
                                const roomNum = typeof num === 'number' ? [num] : [5]
                                const newRooms = propertyFilters?.numberOfRooms?.every(r => roomNum.includes(r)) ? propertyFilters?.numberOfRooms?.filter(r => !roomNum.includes(r)) : propertyFilters?.numberOfRooms?.concat(roomNum)

                                onFilterChange({ ...propertyFilters, numberOfRooms: newRooms })
                            }}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            {/* Facilities */}
            <div className="mb-8 px-2">
                <h2 className="text-lg font-medium mb-4">Facilități</h2>
                <div className="grid grid-cols-2 gap-4">
                    {(['parking', 'balcony', 'terrace', 'garden', 'elevator', 'air_conditioning', 'central_heating', 'furnished', 'internet'] as const).map((facility) => (
                        <div key={facility} className="flex items-center space-x-3">
                            <Checkbox
                                id={facility}
                                checked={propertyFilters?.facilities?.includes(facility)}
                                onCheckedChange={(checked) => {
                                    const newFacilities = checked
                                        ? [...(propertyFilters?.facilities ?? []), facility]
                                        : propertyFilters?.facilities?.filter(f => f !== facility)
                                    onFilterChange({ ...propertyFilters, facilities: newFacilities })
                                }}
                                className="border-[#7B31DC] data-[state=checked]:bg-[#7B31DC]"
                            />
                            <label
                                htmlFor={facility}
                                className="text-white cursor-pointer"
                            >
                                {facility}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Continue in Chat */}
            <div className="mb-6 px-2">
                <p className="text-center text-[#E9E1FF] text-sm">Pentru mai multe filtre:</p>
                <button className="w-full bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] hover:bg-[#6A2BC4] text-white text-sm py-3 rounded-lg flex items-center justify-center gap-2">
                    <ChatIcon className="w-5 h-5" />
                    Continuă în chat
                </button>
            </div>

            {/* Bottom Actions */}
            <div className="grid grid-cols-2 gap-2 px-2 pt-3 pb-6 bg-[#1A0F33] text-white sticky bottom-0">
                <button className="py-3 border border-gray-600 rounded-lg text-white text-sm" onClick={() => { onFilterChange({}); onClose() }} > Șterge filtrele </button>
                <button className="py-3 bg-[#8A4FFF] hover:bg-[#6A2BC4] text-white rounded-lg tex-sm" onClick={() => { onClose() }} > Salvează modificările </button>
            </div>
        </div>
    )
}

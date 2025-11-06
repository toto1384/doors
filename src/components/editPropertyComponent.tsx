import { useEffect, useState } from "react";
import { useUploadThing } from "utils/uploadThingClient";
import { PropertyObject } from "utils/validation/types";
import { MultiImageUpload } from "./ui/multiImageUpload";
import { Controller, useForm } from "react-hook-form";
import z from "zod/v3";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { FloatingInput } from "./ui/floating-input";
import { useTRPCClient } from "trpc/react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { LocationSelector } from "./basics/locationSelector";
import { MultiSelect } from "./ui/multi-select";
import { FacilitiesSelector } from "./facilitiesSelector";
import { DescriptionSection, FeaturesSection, LocationSection, PropertyInfo } from "@/routes/app/properties/$id/index";
import { useUploadThingCompressed } from "./ui/imageUploaders";



const tprSchema = z.object({
    title: z.string().min(2),
    price: z.object({
        value: z.number(),
        currency: z.enum(['EUR', 'RON', 'USD']).optional(),
    }),
    numberOfRooms: z.number(),
    numberOfBathrooms: z.number().optional(),
    surfaceArea: z.number(),
})


export function EditPropertyComponent<T extends (Partial<PropertyObject> | PropertyObject)>({ property, onPropertyChange, onSave }: { property: T, onPropertyChange: (property: T) => void, onSave: () => Promise<void> }) {

    const [disabled, setDisabled] = useState(false)

    const { startUpload, isUploading, } = useUploadThingCompressed("imageUploader", {
        onClientUploadComplete: (e) => {
            console.log('e', e)
            onPropertyChange({ ...property, imageUrls: [...(property.imageUrls ?? []), ...e.map(i => i.ufsUrl)] })
            setHasEdited(true)
        }
    });


    const [editingStates, setEditingStates] = useState<{
        titlePriceRoomsSqFeet: boolean,
        description: boolean,
        facilities: boolean,
        location: boolean,
    }>({
        titlePriceRoomsSqFeet: false,
        description: false,
        facilities: false,
        location: false,
    })

    const [hasEdited, setHasEdited] = useState(false)



    // have the same layout as the normal property view, with edit buttons near. and when they are pressed it's switched to the edit mode
    // photos as they are with the component, title, price and  number of rooms & sq feet. then description, then facilities and then location

    return <div className='flex flex-col pb-15'>


        {/* Photos Section*/}
        <div className='flex flex-col mx-4'>
            <MultiImageUpload
                uploadFiles={async (f) => {
                    return startUpload(f)
                }}
                deleteFile={async (url) => {
                    onPropertyChange({ ...property, imageUrls: property.imageUrls?.filter(i => i != url) })
                    setHasEdited(true)
                }}
                value={property.imageUrls}
                className='mb-3'
            // disabled={!isConnected || disabled}
            />
        </div>

        {/* Title, Price, Number of Rooms, Surface Area */}
        {editingStates.titlePriceRoomsSqFeet ? <EditPropertyTitlePriceRoomsSqFeet property={property} onPropertyChange={(object) => {
            console.log('object', object)
            onPropertyChange({ ...property, ...object })
            setEditingStates(p => ({ ...p, titlePriceRoomsSqFeet: false }))
            setHasEdited(true)
        }} /> :
            <PropertyInfo
                property={property}
                additionalComponent={<div
                    className="flex flex-row items-center gap-2 cursor-pointer hover:opacity-80 p-3 rounded-lg hover:bg-white/5 "
                    onClick={async () => {
                        setEditingStates(p => ({ ...p, titlePriceRoomsSqFeet: !p.titlePriceRoomsSqFeet }))
                    }}
                ><Pencil className="w-4 h-4" /></div>}
            />}

        {/* Description */}
        {editingStates.description ? <EditPropertyDescription property={property} onPropertyChange={(object) => {
            console.log('object', object)
            onPropertyChange({ ...property, ...object })
            setEditingStates(p => ({ ...p, description: false }))
            setHasEdited(true)
        }} /> :
            <DescriptionSection property={property} additionalComponent={<div
                className="flex flex-row items-center gap-2 cursor-pointer hover:opacity-80 p-3 rounded-lg hover:bg-white/5 "
                onClick={async () => {
                    setEditingStates(p => ({ ...p, description: !p.description }))
                }}
            ><Pencil className="w-4 h-4" /></div>} />}

        {/* Location */}
        {editingStates.location ? <EditPropertyLocation property={property} onPropertyChange={(object) => {
            console.log('object', object)
            onPropertyChange({ ...property, ...object })
            setEditingStates(p => ({ ...p, location: false }))
            setHasEdited(true)
        }} /> : <LocationSection property={property} additionalComponent={<div
            className="flex flex-row items-center gap-2 cursor-pointer hover:opacity-80 p-3 rounded-lg hover:bg-white/5 "
            onClick={async () => {
                setEditingStates(p => ({ ...p, location: !p.location }))
            }}
        ><Pencil className="w-4 h-4" /></div>} />}

        {/* Features */}
        {editingStates.facilities ? <EditPropertyFeatures property={property} onPropertyChange={(object) => {
            console.log('object', object)
            onPropertyChange({ ...property, ...object })
            setEditingStates(p => ({ ...p, facilities: false }))
            setHasEdited(true)
        }} /> : <FeaturesSection property={property} additionalComponent={<div
            className="flex flex-row items-center gap-2 cursor-pointer hover:opacity-80 p-3 rounded-lg hover:bg-white/5 "
            onClick={async () => {
                setEditingStates(p => ({ ...p, facilities: !p.facilities }))
            }}
        ><Pencil className="w-4 h-4" /></div>} />}


        {(!editingStates.titlePriceRoomsSqFeet && !editingStates.description && !editingStates.location && !editingStates.facilities) && <div className="pb-20 md:pb-5 sticky bottom-10 md:bottom-0 bg-[#0E0118] px-4">

            <Button
                className="w-full mt-2 bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] text-white text-xs px-4 py-2 rounded-[6px] "
                disabled={!hasEdited}
                onClick={async () => {
                    await onSave()
                    setHasEdited(false)
                }}
            >Save</Button>
        </div>}
    </div>

}


function EditPropertyFeatures({ property, onPropertyChange }: { property: Partial<PropertyObject>, onPropertyChange: (property: Partial<PropertyObject>) => void }) {

    const [initialFeatures, setInitialFeatures] = useState(property.features)

    return <div className="mx-4">
        <FacilitiesSelector className="mt-2" facilities={initialFeatures as any} setFacilities={value => setInitialFeatures(value)} />

        <Button className="w-full mt-2 bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] text-white text-xs px-4 py-2 rounded-[6px]" onClick={() => onPropertyChange(({ ...property, features: initialFeatures }))}>Done</Button>

    </div>
}


function EditPropertyLocation({ property, onPropertyChange }: { property: Partial<PropertyObject>, onPropertyChange: (property: Partial<PropertyObject>) => void }) {

    const [initialLocation, setInitialLocation] = useState(property.location)


    return <div className="mx-4">
        <LocationSelector
            width={'100%'}
            locationObject={initialLocation}
            setLocationObject={(l) => {
                console.log('in loc', property)
                setInitialLocation(l)
            }}
        />

        <Button className="w-full mt-2 bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] text-white text-xs px-4 py-2 rounded-[6px]" onClick={() => onPropertyChange(({ ...property, location: initialLocation }))}>Done</Button>

    </div>
}


function EditPropertyDescription({ property, onPropertyChange }: { property: Partial<PropertyObject>, onPropertyChange: (property: Partial<PropertyObject>) => void }) {
    const { register, formState: { errors }, handleSubmit, control } = useForm({
        defaultValues: {
            description: property.description ?? '',
        },
        resolver: zodResolver(z.object({ description: z.string() })),
    })

    return <form className="flex flex-col gap-2 mx-4" onSubmit={handleSubmit(object => onPropertyChange({ ...property, description: object.description }))}>
        <Textarea
            id="description"
            {...register("description", {
                required: "Description is required",
                minLength: {
                    value: 2,
                    message: "Description must be at least 2 characters"
                }
            })}
        />
        {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
        )}
        <Button
            type="submit"
            className="rounded-lg p-2 text-white bg-gradient-to-br from-[#4C7CED] to-[#7B31DC]"
        >
            Done
        </Button>
    </form>
}



function EditPropertyTitlePriceRoomsSqFeet({ property, onPropertyChange }: { property: Partial<PropertyObject>, onPropertyChange: (property: Partial<PropertyObject>) => void }) {

    const { register, formState: { errors }, handleSubmit, control } = useForm({
        defaultValues: {
            title: property.title,
            price: property.price,
            numberOfRooms: property.numberOfRooms,
            numberOfBathrooms: property.numberOfBathrooms,
            surfaceArea: property.surfaceArea,
        },
        resolver: zodResolver(tprSchema),
    })


    useEffect(() => { console.log(errors) }, [errors])

    return <form onSubmit={handleSubmit((object) => {
        onPropertyChange({ ...property, ...object })
    })} className="mx-4">


        <>
            <FloatingInput
                id="title"
                type="text"
                label={'Title'}
                autoComplete="name"
                {...register("title", {
                    required: "Title is required",
                    minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters"
                    }
                })}
            />
            {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
            )}
        </>

        <div className="flex flex-row items-start gap-2 my-2">
            <div className="flex flex-col">
                <FloatingInput
                    id="price.value"
                    type="number"
                    label={'Price'}
                    autoComplete="name"
                    {...register("price.value", {
                        required: "Price is required",
                        valueAsNumber: true,
                    })}
                />
                {errors.price?.currency && (
                    <p className="text-red-400 text-sm mt-1">{errors.price.currency.message}</p>
                )}

                {errors.price?.value && (
                    <p className="text-red-400 text-sm mt-1">{errors.price.value.message}</p>
                )}
            </div>


            <Controller
                name="price.currency"
                control={control}
                render={({ field, fieldState }) => (
                    <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                    >
                        <SelectTrigger
                            id="form-rhf-select-language"
                            aria-invalid={fieldState.invalid}
                            className="min-w-[120px] h-fit py-6 dark:bg-[#241540] border-0"
                        >
                            <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                            {['EUR', 'RON', 'USD'].map(currency => (
                                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />

        </div>

        <>
            <FloatingInput
                id="numberOfRooms"
                type="number"
                label={'Number of Rooms'}
                autoComplete="name"
                {...register("numberOfRooms", {
                    valueAsNumber: true,
                    required: "Number of Rooms is required",
                })}
            />
            {errors.numberOfRooms && (
                <p className="text-red-400 text-sm mt-1">{errors.numberOfRooms.message}</p>
            )}
        </>

        <>
            <FloatingInput
                id="numberOfBathrooms"
                className='mt-2'
                type="number"
                label={'Number of Bathrooms'}
                autoComplete="name"
                {...register("numberOfBathrooms", {
                    valueAsNumber: true,
                })}
            />
            {errors.numberOfBathrooms && (
                <p className="text-red-400 text-sm mt-1">{errors.numberOfBathrooms.message}</p>
            )}
        </>

        <>
            <FloatingInput
                id="surfaceArea"
                className='mt-2'
                type="number"
                label={'Surface Area'}
                autoComplete="name"
                {...register("surfaceArea", {
                    required: "Surface Area is required",
                    valueAsNumber: true,
                })}
            />
            {errors.surfaceArea && (
                <p className="text-red-400 text-sm mt-1">{errors.surfaceArea.message}</p>
            )}
        </>


        <Button className="w-full mt-2 bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] text-white text-xs px-4 py-2 rounded-[6px]" type="submit">Done</Button>

    </form>

}

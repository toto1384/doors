import { usePopoversOpenStore, usePropertyAddStore } from "@/routes/__root"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import useDidMountEffect from "utils/hooks/useDidMountEffect"
import { PropertyObject } from "utils/validation/types"
import z from "zod"
import { useShallow } from "zustand/react/shallow"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { useRouter } from "@tanstack/react-router"
import { useSize } from "utils/hooks/useSize"
import { Label } from "../ui/label"
import { AnimatePresence, motion } from "framer-motion";
import { EditPropertyComponent } from "../editPropertyComponent"
import { usePublishPropertyHook } from "../userAndAi/usePostPropertyAiHook"
import { CheckCircle } from "lucide-react"

const titleAndDescriptionSchema = z.object({
    title: z.string().min(2),
    description: z.string().min(2),
})

export const PropertyAddView = ({ demoVersion }: { demoVersion?: boolean }) => {
    const { t } = useTranslation('translation', { keyPrefix: 'property-add' })

    const { titleAndDescResolver, titlesAndDescriptions, setTitlesAndDescriptions, postedStatus, partialProperty, setPartialProperty, propertyType, setPropertyType } = usePropertyAddStore(useShallow(state => ({
        titleAndDescResolver: state.titleAndDescResolver,
        titlesAndDescriptions: state.titlesAndDescriptions,
        setTitlesAndDescriptions: state.setTitlesAndDescriptions,
        postedStatus: state.postedStatus,
        partialProperty: state.partialProperty,
        setPartialProperty: state.appendPartialProperty,
        propertyType: state.propertyType,
        setPropertyType: state.setPropertyType,
    })))

    const checkedSteps = [
        { label: `${t('fields.propertyType')}${partialProperty.propertyType ? `: ${partialProperty.propertyType}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.propertyType },
        { label: `${t('fields.location')}${partialProperty.location ? `: ${partialProperty.location?.city}, ${partialProperty.location?.state}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.location?.country },
        { label: `${t('fields.numberOfRooms')}${partialProperty.numberOfRooms ? `: ${partialProperty.numberOfRooms}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.numberOfRooms },
        { label: `${t('fields.surfaceArea')}${partialProperty.surfaceArea ? `: ${partialProperty.surfaceArea}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.surfaceArea },
        { label: `${t('fields.floor')}${partialProperty.floor ? `: ${partialProperty.floor}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.floor },
        { label: `${t('fields.buildingYear')}${partialProperty.buildingYear ? `: ${partialProperty.buildingYear}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.buildingYear },
        { label: `${t('fields.furnished')}${partialProperty.furnished ? `: ${partialProperty.furnished}` : `: ${t('status.waiting')}`}`, isChecked: partialProperty?.furnished !== undefined },
        { label: `${t('fields.heating')}${partialProperty.heating ? `: ${partialProperty.heating}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.heating },
        { label: `${t('fields.facilities')}${partialProperty.features ? `: ${partialProperty.features?.join(', ')}` : `: ${t('status.waiting')}`}`, isChecked: (partialProperty?.features?.length ?? 0) > 0 },
        { label: `${t('fields.price')}${partialProperty.price ? `: ${partialProperty.price?.value} ${partialProperty.price?.currency}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.price?.value },
        { label: `${t('fields.imageUpload')}${partialProperty.imageUrls ? `: ${partialProperty.imageUrls?.length}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.imageUrls?.length },
        { label: `${t('fields.title')}${partialProperty.title ? `: ${partialProperty.title}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.title },
        { label: `${t('fields.description')}${partialProperty.description ? `: ${partialProperty.description?.substring(0, 10)}...` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.description },
    ]

    console.log('checkedSteps', checkedSteps)
    const checkedOnSteps = checkedSteps.filter(step => !step.isChecked)

    const completedSteps = checkedSteps.filter(step => step.isChecked).length
    const totalSteps = checkedSteps.length
    const progressPercentage = (completedSteps / totalSteps) * 100

    const { setProgressBar, setAiChatbotOpen } = usePopoversOpenStore(useShallow(state => ({ setProgressBar: state.setProgressBar, setAiChatbotOpen: state.setAiChatbotOpen, })))


    const router = useRouter()
    const size = useSize(true)
    const cutSize = size.gmd ? 5 : 3

    useDidMountEffect(() => {
        if (completedSteps != 0) setProgressBar({ progress: progressPercentage, totalSteps, checkedSteps: completedSteps, })
    }, [completedSteps, totalSteps])


    useEffect(() => {
        if (false) setPartialProperty({
            _id: '',
            status: 'available',
            propertyType: 'apartment',
            location: { fullLocationName: '', city: '', state: '', country: '', countryShort: '', },
            numberOfRooms: 5,
            surfaceArea: 35,
            floor: 0,
            buildingYear: 0,
            furnished: false,
            heating: 'electric',
            features: [],
            price: { value: 0, currency: 'EUR' },
            imageUrls: [],
            title: 'Title',
            description: 'Description',
        })
    }, [])

    const { control, handleSubmit } = useForm({
        defaultValues: {},
        resolver: zodResolver(titleAndDescriptionSchema),
    })

    const publishProperty = usePublishPropertyHook({ demoVersion })


    const width = demoVersion ? 200 : 200

    return <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ">

            {propertyType === 'final-edit' && <div className="md:col-span-3 relative">
                <EditPropertyComponent landingPage saveWithoutEdit property={partialProperty} onPropertyChange={(p) => {
                    console.log('property', p)
                    setPartialProperty(p)
                }} onSave={async () => {
                    await publishProperty()
                }} />
            </div>}

            {postedStatus && <>
                {!demoVersion && <div className="text-base font-medium text-white mb-4 md:col-span-3">
                    {postedStatus.success ? <div className="flex flex-col items-center">
                        <CheckCircle className="text-green-400 w-5 h-5 flex-shrink-0" />
                        <p> Property saved successfully </p>

                        <button onClick={() => router.navigate({ to: '/app/my-properties' })} className="ml-2 text-xs text-white hover:underline bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] hover:bg-[#6A2BC4] px-2 py-1 rounded-[6px]">Go to my properties</button>
                    </div> : 'Failed to save property details'}
                </div>}

                {demoVersion && <div className="text-base font-medium text-white mb-4 flex flex-col mx-auto items-center md:col-span-3">
                    <CheckCircle className="text-green-400 w-5 h-5 flex-shrink-0" />
                    <p> Property saved successfully. Log in to post your property. </p>
                    <button onClick={() => router.navigate({ to: '/auth/$path', params: { path: 'sign-in' } })} className="mt-2 text-xs text-white hover:underline bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] hover:bg-[#6A2BC4] px-2 py-1 rounded-[6px]">Login</button>
                </div>}

            </>
            }

            {(propertyType === 'edit' && !postedStatus) && <div className="md:col-span-2">
                {/* Progress Section */}
                <div className="px-6 py-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h2 className="text-lg font-medium text-white mb-4">{t('buildingListing')}</h2>

                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-400">{completedSteps}/{totalSteps} {t('detailsCompleted')}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!!(titlesAndDescriptions.length) && <form className="mx-2" onSubmit={handleSubmit((data) => {
                    titleAndDescResolver?.(data.title, data.description)
                })}>

                    <Controller
                        name="title"
                        control={control}
                        render={({ field, fieldState }) => (
                            <RadioGroup
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                                aria-invalid={fieldState.invalid}
                                className="grid grid-cols-2 gap-2"
                            >
                                {titlesAndDescriptions.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2 relative rounded-lg border hover:bg-gray-100/20 cursor-pointer" >
                                        <RadioGroupItem value={item.title} id={`title-${index.toString()}`} className="absolute bottom-1 right-1" />
                                        <Label htmlFor={`title-${index.toString()}`} className="whitespace-pre-line w-full h-full p-3">{item.title}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}
                        defaultValue={titlesAndDescriptions[0].title}
                    />

                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState, }) => (
                            <RadioGroup
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                                aria-invalid={fieldState.invalid}
                                className="grid grid-cols-2 gap-2 mt-2"
                            >
                                {titlesAndDescriptions.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2 relative rounded-lg border hover:bg-gray-100/20 cursor-pointer">
                                        <RadioGroupItem value={item.description} id={`description-${index.toString()}`} className="absolute bottom-1 right-1" />
                                        <Label htmlFor={`description-${index.toString()}`} className="whitespace-pre-line w-full h-full p-3">{item.description}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}
                        defaultValue={titlesAndDescriptions[0].description}
                    />

                    <button type="submit" className="w-full mt-2 bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] hover:bg-[#6A2BC4] text-white text-xs px-4 py-2 rounded-[6px]">Done</button>

                </form>}

                {(propertyType === 'edit' && !titlesAndDescriptions.length) && <div className='flex flex-col w-full pt-4 pb-5 px-6 space-y-2'>



                    {(!postedStatus && completedSteps === totalSteps) && <h3 className="text-base font-medium text-white mb-4"> Property details filled successfully</h3>}
                    {completedSteps !== totalSteps && <>
                        <h3 className="text-base font-medium text-white mb-4">{t('yourPreferences')}</h3>

                        {/* First 5 items displayed normally */}

                        <AnimatePresence>
                            {checkedOnSteps.slice(0, cutSize).map((item) => (
                                <motion.div
                                    key={item.label}
                                    animate={{ height: "3rem", scale: 1 }}
                                    exit={{ height: 0, scale: 0, margin: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex items-center gap-3 bg-[#1A0F33] px-2 py-2 rounded-[6px]"
                                >
                                    <CheckIcon isChecked={item.isChecked} />
                                    <p className="text-sm text-light text-gray-300">{item.label}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Remaining items stacked like iOS notifications */}
                        {checkedOnSteps.length > cutSize && (
                            <div className="relative mt-1">
                                {checkedOnSteps.slice(cutSize).map(({ label, isChecked }, index) => (
                                    <div
                                        key={index + cutSize}
                                        className="absolute bg-[#1A0F33] rounded-[6px] p-3 w-full"
                                        style={{
                                            top: `${index * 4}px`,
                                            left: `${index * 2}px`,
                                            transform: `scale(${1 - index * 0.05})`,
                                            zIndex: checkedOnSteps.length - index,
                                            opacity: 1 - index * 0.2
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 flex items-center justify-center">
                                                <CheckIcon isChecked={isChecked} />
                                            </div>
                                            <p className="text-xs text-gray-400 truncate">{label}</p>
                                        </div>
                                    </div>
                                ))}
                                {/* Spacer to prevent overlap with content below */}
                                <div style={{ height: `${Math.max(60, (checkedOnSteps.length - 5) * 4 + 40)}px` }}></div>
                            </div>
                        )}
                    </>}


                    <button
                        type="button"
                        onClick={() => { setAiChatbotOpen(true) }}
                        className="w-full mt-0 bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] text-white text-xs px-4 py-2 rounded-[6px] md:hidden flex flex-row items-center justify-center gap-2 hover:to-[#6A2BC4]/50 hover:from-[#4C7CED]/50 cursor-pointer"
                    >
                        <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.5039 10.1601C13.8494 9.44353 14.0189 8.65486 13.9984 7.85961C13.9779 7.06437 13.7679 6.2855 13.3859 5.5877C13.0039 4.8899 12.4609 4.29333 11.802 3.84752C11.1432 3.40172 10.3875 3.11955 9.59765 3.02447C9.33485 2.41345 8.95278 1.86101 8.47381 1.39949C7.99484 0.937968 7.4286 0.576653 6.80825 0.336699C6.18791 0.096746 5.52591 -0.017022 4.86105 0.00205764C4.19618 0.0211373 3.5418 0.172681 2.93624 0.447815C2.33067 0.722948 1.78608 1.11614 1.33437 1.60437C0.882653 2.09259 0.532891 2.66604 0.305563 3.29113C0.0782351 3.91622 -0.0220889 4.58038 0.0104656 5.24472C0.0430202 5.90906 0.207799 6.56023 0.495153 7.1601L0.0407777 8.70447C-0.0100253 8.87688 -0.0134222 9.05979 0.0309442 9.23397C0.0753107 9.40814 0.1658 9.56714 0.292893 9.69423C0.419986 9.82133 0.578984 9.91182 0.753158 9.95618C0.927333 10.0005 1.11025 9.99715 1.28265 9.94635L2.82703 9.49197C3.32292 9.73023 3.85458 9.88542 4.40078 9.95135C4.66614 10.5731 5.05483 11.1346 5.54334 11.6019C6.03186 12.0691 6.61006 12.4325 7.24298 12.67C7.87591 12.9075 8.55042 13.0141 9.22574 12.9835C9.90106 12.9529 10.5632 12.7857 11.172 12.492L12.7164 12.9463C12.8887 12.9971 13.0716 13.0005 13.2457 12.9561C13.4198 12.9118 13.5787 12.8214 13.7058 12.6944C13.8329 12.5673 13.9234 12.4085 13.9678 12.2344C14.0122 12.0603 14.0089 11.8775 13.9583 11.7051L13.5039 10.1601ZM12.4883 10.252L12.9995 11.9876L11.2645 11.477C11.1392 11.4407 11.0046 11.4548 10.8895 11.5163C9.9688 12.008 8.89245 12.1206 7.88991 11.8301C6.88737 11.5396 6.03794 10.8691 5.52265 9.96135C6.20726 9.8899 6.86972 9.67773 7.46847 9.33817C8.06721 8.99861 8.58933 8.53898 9.00205 7.98811C9.41478 7.43724 9.70921 6.80703 9.86688 6.137C10.0245 5.46697 10.042 4.77159 9.91828 4.09447C10.5148 4.23508 11.071 4.51086 11.544 4.90054C12.017 5.29022 12.3941 5.78337 12.6463 6.34193C12.8984 6.90049 13.0189 7.50952 12.9983 8.12201C12.9777 8.73451 12.8167 9.33409 12.5277 9.87447C12.4654 9.99024 12.4513 10.1259 12.4883 10.252Z" fill="#E9E1FF" />
                        </svg>

                        Continue in chat
                    </button>

                </div>}


            </div>}


            {propertyType === 'edit' && !postedStatus && <div className="hidden md:flex flex-row items-center justify-center">
                {/* Circular Progress Indicator */}
                <div className={`relative  `} style={{ width: `${width}px`, height: `${width}px` }}>
                    <svg width={`${width}`} height={`${width}`} className="transform -rotate-90">
                        {/* Background circle with blur effect */}
                        <circle cx={`${width / 2}`} cy={`${width / 2}`} r={`${width / 2 - width / 10}`} stroke="rgba(139, 92, 246, 0.2)" strokeWidth="8" fill="none" className="blur-sm" />
                        {/* Progress circle */}
                        <circle
                            cx={`${width / 2}`} cy={`${width / 2}`} r={`${width / 2 - width / 10}`} stroke="url(#progressGradient)" strokeWidth="6" fill="none" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * (width / 2 - width / 10)}`}
                            strokeDashoffset={`${2 * Math.PI * (width / 2 - width / 10) * (1 - progressPercentage / 100)}`}
                            className="transition-all duration-500 ease-out drop-shadow-lg"
                            style={{
                                filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))'
                            }}
                        />
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#8B5CF6" />
                                <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{Math.round(progressPercentage)}%</div>
                            <div className="text-xs text-gray-400">{t('completedPercent')}</div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    </>

}


function CheckIcon({ isChecked }: { isChecked: boolean }) {
    return isChecked ? <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.9931 0.882019C12.3349 1.22382 12.3349 1.77889 11.9931 2.12069L4.99307 9.12069C4.65127 9.46249 4.09619 9.46249 3.75439 9.12069L0.254395 5.62069C-0.0874023 5.27889 -0.0874023 4.72382 0.254395 4.38202C0.596191 4.04022 1.15127 4.04022 1.49307 4.38202L4.3751 7.26132L10.7571 0.882019C11.0989 0.540222 11.654 0.540222 11.9958 0.882019H11.9931Z" fill="#F9FAFB" />
    </svg> : <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_848_45365)">
            <path d="M12.6875 7C12.6875 5.49158 12.0883 4.04494 11.0217 2.97833C9.95506 1.91172 8.50842 1.3125 7 1.3125C5.49158 1.3125 4.04494 1.91172 2.97833 2.97833C1.91172 4.04494 1.3125 5.49158 1.3125 7C1.3125 8.50842 1.91172 9.95506 2.97833 11.0217C4.04494 12.0883 5.49158 12.6875 7 12.6875C8.50842 12.6875 9.95506 12.0883 11.0217 11.0217C12.0883 9.95506 12.6875 8.50842 12.6875 7ZM0 7C0 5.14348 0.737498 3.36301 2.05025 2.05025C3.36301 0.737498 5.14348 0 7 0C8.85652 0 10.637 0.737498 11.9497 2.05025C13.2625 3.36301 14 5.14348 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14C5.14348 14 3.36301 13.2625 2.05025 11.9497C0.737498 10.637 0 8.85652 0 7Z" fill="#F9FAFB" />
        </g>
        <defs>
            <clipPath id="clip0_848_45365">
                <rect width="14" height="14" fill="white" />
            </clipPath>
        </defs>
    </svg>


}

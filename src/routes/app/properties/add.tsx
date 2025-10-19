import { createFileRoute } from "@tanstack/react-router"
import { usePropertyAddStore } from "@/routes/__root"
import { useShallow } from "zustand/react/shallow"
import { useState } from "react"
import { UploadImageButton } from "@/components/ui/imageUploaders"
import { useTranslation } from 'react-i18next'


export const Route = createFileRoute("/app/properties/add")({
    component: PropertyAdd,
})


function PropertyAdd() {
    const { t } = useTranslation('translation', { keyPrefix: 'property-add' })

    const { partialProperty, setPartialProperty, titlesAndDescriptions, setTitlesAndDescriptions } = usePropertyAddStore(useShallow(state => ({
        partialProperty: state.partialProperty,
        setPartialProperty: state.setPartialProperty,
        titlesAndDescriptions: state.titlesAndDescriptions,
        setTitlesAndDescriptions: state.setTitlesAndDescriptions,
    })))

    const [displayMode, setDisplayMode] = useState<'edit' | 'add photos'>('edit')


    const checkedSteps = [
        { label: `${t('fields.title')}${partialProperty.title ? `: ${partialProperty.title}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.title },
        { label: `${t('fields.description')}${partialProperty.description ? `: ${partialProperty.description?.substring(0, 10)}...` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.description },
        { label: `${t('fields.price')}${partialProperty.price ? `: ${partialProperty.price?.value} ${partialProperty.price?.currency}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.price },
        { label: `${t('fields.location')}${partialProperty.location ? `: ${partialProperty.location?.city}, ${partialProperty.location?.state}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.location },
        { label: `${t('fields.numberOfRooms')}${partialProperty.numberOfRooms ? `: ${partialProperty.numberOfRooms}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.numberOfRooms },
        { label: `${t('fields.facilities')}${partialProperty.features ? `: ${partialProperty.features?.join(', ')}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.features },
        { label: `${t('fields.propertyType')}${partialProperty.propertyType ? `: ${partialProperty.propertyType}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.propertyType },
        { label: `${t('fields.imageUpload')}${partialProperty.imageUrls ? `: ${partialProperty.imageUrls?.length}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.imageUrls?.length },
        { label: `${t('fields.surfaceArea')}${partialProperty.surfaceArea ? `: ${partialProperty.surfaceArea}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.surfaceArea },
        { label: `${t('fields.furnished')}${partialProperty.furnished ? `: ${partialProperty.furnished}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.furnished },
        { label: `${t('fields.heating')}${partialProperty.heating ? `: ${partialProperty.heating}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.heating },
        { label: `${t('fields.buildingYear')}${partialProperty.buildingYear ? `: ${partialProperty.buildingYear}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.buildingYear },
        { label: `${t('fields.floor')}${partialProperty.floor ? `: ${partialProperty.floor}` : `: ${t('status.waiting')}`}`, isChecked: !!partialProperty?.floor },
    ]

    const completedSteps = checkedSteps.filter(step => step.isChecked).length
    const totalSteps = checkedSteps.length
    const progressPercentage = (completedSteps / totalSteps) * 100


    return <div className='flex flex-col border rounded-lg mx-3 min-h-[90dvh]'>
        <div className="border-b px-3">
            <div className='flex flex-col gap-2 w-full pt-2 pb-2 md:pt-4 md:pb-5 '>
                <h1 className="text-xl font-light">{t('title')}</h1>

                <p className={`max-w-2xl before:content-['•'] before:dark:text-[#737373] before:text-2xl/1 pl-5 before:absolute before:mt-1 before:left-0 relative  before:text-gray-500 text-xs dark:text-[#a3a3a3]`}>
                    {t('subtitle')}
                </p>
            </div>

        </div>

        {/* Progress Section */}
        <div className="border-b px-6 py-4">
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

                    <div className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{t('subtitle')}</span>
                    </div>
                </div>

                {/* Circular Progress Indicator */}
                <div className="relative ml-8">
                    <svg width="120" height="120" className="transform -rotate-90">
                        {/* Background circle with blur effect */}
                        <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke="rgba(139, 92, 246, 0.2)"
                            strokeWidth="8"
                            fill="none"
                            className="blur-sm"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke="url(#progressGradient)"
                            strokeWidth="6"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 50}`}
                            strokeDashoffset={`${2 * Math.PI * 50 * (1 - progressPercentage / 100)}`}
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
            </div>
        </div>

        {displayMode === 'edit' && <div className='flex flex-col gap-2 w-full border-b dark:border-[#404040] dark:bg-[#262626] pt-4 pb-5 px-6'>

            <div className="space-y-4">
                <h3 className="text-base font-medium text-white mb-4">{t('yourPreferences')}</h3>

                {/* First 5 items displayed normally */}
                <div className="space-y-3">
                    {checkedSteps.slice(0, 5).map(({ label, isChecked }, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <CheckIcon isChecked={isChecked} />
                            <p className="text-sm text-gray-300">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Remaining items stacked like iOS notifications */}
                {checkedSteps.length > 5 && (
                    <div className="relative mt-4">
                        {checkedSteps.slice(5).map(({ label, isChecked }, index) => (
                            <div
                                key={index + 5}
                                className="absolute bg-gray-800 border border-gray-700 rounded-lg p-3 w-full"
                                style={{
                                    top: `${index * 4}px`,
                                    left: `${index * 2}px`,
                                    transform: `scale(${1 - index * 0.05})`,
                                    zIndex: checkedSteps.length - index,
                                    opacity: 1 - index * 0.2
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 flex items-center justify-center">
                                        {isChecked ? (
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        ) : (
                                            <div className="w-2 h-2 border border-gray-500 rounded-full"></div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 truncate">{label}</p>
                                </div>
                            </div>
                        ))}
                        {/* Spacer to prevent overlap with content below */}
                        <div style={{ height: `${Math.max(60, (checkedSteps.length - 5) * 4 + 40)}px` }}></div>
                    </div>
                )}
            </div>
        </div>}

        {displayMode === 'add photos' && <div className='flex flex-col gap-2 w-full border-b dark:border-[#404040] dark:bg-[#262626] pt-4 pb-5 px-6'>
            <h1 className="text-2xl font-light">{t('addImage')}</h1>

            <UploadImageButton />
        </div>}
    </div>
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

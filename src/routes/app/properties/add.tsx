import { createFileRoute } from "@tanstack/react-router"
import { useShallow } from "zustand/react/shallow"
import { useTranslation } from 'react-i18next'
import { usePropertyAddStore } from "@/routes/__root"
import { PropertyAddView } from "@/components/pages/propertyAddView"
export const Route = createFileRoute("/app/properties/add")({
    component: PropertyAdd,
})





function PropertyAdd() {
    const { t } = useTranslation('translation', { keyPrefix: 'property-add' })

    const { partialProperty, titlesAndDescriptions, setPartialProperty, titleAndDescResolver, postedStatus } = usePropertyAddStore(useShallow(state => ({
        partialProperty: state.partialProperty,
        setPartialProperty: state.setPartialProperty,
        titlesAndDescriptions: state.titlesAndDescriptions,
        titleAndDescResolver: state.titleAndDescResolver,
        postedStatus: state.postedStatus,
    })))



    return <div className='flex flex-col border rounded-lg mx-3 min-h-[90dvh]'>
        <div className="border-b px-3">
            <div className='flex flex-col gap-2 w-full pt-2 pb-2 md:pt-4 md:pb-5 '>
                <h1 className="text-xl font-light" data-testid="title">{t('title')}</h1>

                <p className={`max-w-2xl before:content-['•'] before:dark:text-[#737373] before:text-2xl/1 pl-5 before:absolute before:mt-1 before:left-0 relative  before:text-gray-500 text-xs dark:text-[#a3a3a3]`}>
                    {t('subtitle')}
                </p>
            </div>

        </div>

        <PropertyAddView />
    </div>
}




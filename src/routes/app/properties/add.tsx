import { usePropertyAddStore } from "@/routes/__root"
import { useContext, useState } from "react"
import { UploadButton } from "utils/uploadThingClient"




function PropertyAdd() {


    const { partialProperty, setPartialProperty } = usePropertyAddStore(state => ({
        partialProperty: state.partialProperty,
        setPartialProperty: state.setPartialProperty,
    }))

    const [displayMode, setDisplayMode] = useState<'edit' | 'add photos'>('edit')

    return <>

        {displayMode === 'add photos' && <div className='flex flex-col gap-2 w-full border-b dark:border-[#404040] dark:bg-[#262626] pt-4 pb-5 px-6'>
            <h1 className="text-2xl font-light">Adaugă o imagine</h1>
            <UploadButton onClientUploadComplete={() => {

            }} endpoint={'imageUploader'} />
        </div>}
    </>
}

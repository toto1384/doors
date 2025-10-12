import { createFileRoute } from "@tanstack/react-router"
import { usePropertyAddStore } from "@/routes/__root"
import { useContext, useState } from "react"
import { UploadButton, useUploadThing } from "utils/uploadThingClient"
import { useShallow } from "zustand/react/shallow"
import imageCompression from "browser-image-compression";
import { MultiImageUpload } from "src/components/ui/multiImageUpload"


export const Route = createFileRoute("/app/properties/add")({
    component: PropertyAdd,
})


function PropertyAdd() {


    const { partialProperty, setPartialProperty } = usePropertyAddStore(useShallow( state => ({
        partialProperty: state.partialProperty,
        setPartialProperty: state.setPartialProperty,
    })))

    const [displayMode, setDisplayMode] = useState<'edit' | 'add photos'>('add photos')



    return <>

        {displayMode === 'add photos' && <div className='flex flex-col gap-2 w-full border-b dark:border-[#404040] dark:bg-[#262626] pt-4 pb-5 px-6'>
            <h1 className="text-2xl font-light">Adaugă o imagine</h1>

            <UploadImageButton />
        </div>}
    </>
}



async function compress(imageFile: File) {

  console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
  console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

  try {
    const compressedFile = await imageCompression(imageFile, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });
    console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

    return compressedFile;
  } catch (error) {
    console.log(error);
  }

}


function UploadImageButton(){

    const [images, setImages] = useState<string[]>([])

    const { startUpload, isUploading,  } = useUploadThing("imageUploader",{
        onClientUploadComplete: (e) => {
            setImages(prev=>[...prev, ...e.map(i=>i.ufsUrl)])
        }  
    });


    return <>
            {images.map(i => <img src={i} className="w-full h-full object-cover" />)}
        <MultiImageUpload
            uploadFiles={async (f)=> {startUpload(f)}}
            deleteFile={deleteFile}
            value={images}
        />
        <input
        type="file"
        onChange={async (e) => {
          const files = e.target.files;
          if (!files?.length) return;
 
          // Do something with the file before uploading
          const compressed = await Promise.all(Array.from(files).map(i=>compress(i)));
 
          // Then start the upload of the compressed file
          await startUpload(compressed.filter(i=>i) as File[]);
        }}
      />
    </>
}

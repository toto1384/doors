import imageCompression from "browser-image-compression";
import { MultiImageUpload } from "src/components/ui/multiImageUpload"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { authClient } from "utils/auth-client"
import { useState } from "react"
import { useUploadThing } from "utils/uploadThingClient"
import { toast } from "sonner"

export async function compress(imageFile: File) {

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


export function UploadImageButton() {

    const [images, setImages] = useState<string[]>([])

    const { startUpload, isUploading, } = useUploadThing("imageUploader", {
        onClientUploadComplete: (e) => {
            setImages(prev => [...prev, ...e.map(i => i.ufsUrl)])
        }
    });


    return <>
        {images.map(i => <img src={i} className="w-full h-full object-cover" />)}
        <MultiImageUpload
            uploadFiles={async (f) => { startUpload(f) }}
            deleteFile={async () => { }}
            value={images}
        />
        <input
            type="file"
            onChange={async (e) => {
                const files = e.target.files;
                if (!files?.length) return;

                // Do something with the file before uploading
                const compressed = await Promise.all(Array.from(files).map(i => compress(i)));

                // Then start the upload of the compressed file
                await startUpload(compressed.filter(i => i) as File[]);
            }}
        />

    </>
}


export function ChangeProfilePictureImageButton() {

    const { data } = authClient.useSession()


    const { startUpload, isUploading, } = useUploadThing("imageUploader", {
        onClientUploadComplete: async (e) => {
            const res = await authClient.updateUser({ image: e[0].ufsUrl })
        }
    });

    return <Button
        variant="ghost"
        className="flex-shrink-0"
        asChild
    >
        <label className="flex h-full w-full cursor-pointer items-center justify-center ">
            <div className="bg-white p-1.5 rounded-full flex items-center justify-center">
                <Edit className="w-1.5 h-1.5 text-[#7B31DC] " />
            </div>
            <input
                type="file"
                accept={'image/*'}
                // multiple
                className="hidden"
                name={'edit-profile-picture'}
                onChange={async (e) => {
                    const files = e.target.files;
                    if (!files?.length) return;

                    let compressed: File[]

                    toast.promise(async () => {
                        compressed = await Promise.all(Array.from(files).map(i => compress(i))) as File[]

                        toast.promise(async () => {
                            await startUpload(compressed.filter(i => i) as File[])
                        }, { loading: "Uploading...", success: () => `File uploaded successfully`, error: "Error" });

                        return compressed
                    }, { loading: "Compressing...", success: () => `File compressed successfully`, error: "Error" });


                }}
            />
        </label>
    </Button>
}


import { IsConnectedContext } from '@/components/userAndAi/aiChatbot';
import { MultiImageUpload } from '@/components/ui/multiImageUpload';
import { useState, useCallback, useEffect, useContext, ReactNode } from 'react';
import { useUploadThing } from 'utils/uploadThingClient';


export function useClientToolSelectPhotos({ onShowPhotoSelector, additionalOnClick }: {
    onShowPhotoSelector: (photosSelectorNode: React.ReactNode) => void;
    additionalOnClick?: (value: string[]) => void;
}) {


    const clientToolFunction = useCallback(async () => {

        return new Promise<string>((resolve) => {

            onShowPhotoSelector(<PhotoSelector resolve={(photos) => {
                resolve(`${photos.length} photos selected`);
                if (additionalOnClick) additionalOnClick(photos);
            }} />);
        });
    }, [onShowPhotoSelector]);

    return {
        clientToolFunction,
    };
}


const PhotoSelector = ({ resolve }: { resolve: (photos: string[]) => void }) => {

    const [images, setImages] = useState<string[]>([])

    const [disabled, setDisabled] = useState(false)


    const isConnected = useContext(IsConnectedContext);

    const { startUpload, isUploading, } = useUploadThing("imageUploader", {
        onClientUploadComplete: (e) => {
            setImages(prev => [...prev, ...e.map(i => i.ufsUrl)])
        }
    });


    return <div className='flex flex-col px-2'>
        <MultiImageUpload
            uploadFiles={async (f) => {
                return startUpload(f)
            }}
            deleteFile={async () => { }}
            value={images}
            className='mb-3'
            disabled={!isConnected || disabled}
        />
        {isUploading ? <>Loading...</> : <button
            key={'done'}
            disabled={!isConnected || disabled}
            onClick={() => {
                console.log('images', images, isConnected)
                if (isConnected) {
                    resolve(images);
                    setDisabled(true)
                }
            }}
            className={`px-4 py-2 text-white rounded-[6px] hover:opacity-90 bg-gradient-to-br w-full from-[#4C7CED] to-[#7B31DC] disabled:from-[#79a0fc] disabled:to-[#a561ff]`}
        >Done</button>}
    </div>

}



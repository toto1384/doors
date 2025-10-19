
import { IsConnectedContext } from '@/components/aiChatbot';
import { MultiImageUpload } from '@/components/ui/multiImageUpload';
import { useState, useCallback, useEffect, useContext, ReactNode } from 'react';
import { useUploadThing } from 'utils/uploadThingClient';


export function useClientToolSelectPhotos({ onShowPhotoSelector }: {
    onShowPhotoSelector: (photosSelectorNode: React.ReactNode) => void;
}) {


    const clientToolFunction = useCallback(async ({ message }: { message: string }) => {
        console.log(message);

        return new Promise<string[]>((resolve) => {

            onShowPhotoSelector(<PhotoSelector resolve={resolve} />);
        });
    }, [onShowPhotoSelector]);

    return {
        clientToolFunction,
    };
}


const PhotoSelector = ({ resolve }: { resolve: (photos: string[]) => void }) => {

    const [images, setImages] = useState<string[]>([])


    const isConnected = useContext(IsConnectedContext);

    const { startUpload, isUploading, } = useUploadThing("imageUploader", {
        onClientUploadComplete: (e) => {
            setImages(prev => [...prev, ...e.map(i => i.ufsUrl)])
        }
    });


    return <>
        <MultiImageUpload
            uploadFiles={async (f) => { return startUpload(f) }}
            deleteFile={async () => { }}
            value={images}
            className='mb-3'
        />
        {isUploading ? <>Loading...</> : <button
            key={'done'}
            disabled={images.length === 0}
            onClick={() => {
                console.log('images', images, isConnected)
                if (isConnected) {
                    resolve(images);
                }
            }}
            className={`px-4 py-2 text-white rounded-[6px] hover:opacity-90 bg-gradient-to-br w-full from-[#4C7CED] to-[#7B31DC] disabled:from-[#79a0fc] disabled:to-[#a561ff]`}
        >Done</button>}
    </>

}


const Buttons = <T extends boolean>({ choices, resolve, fullWidth, multiple, }: {
    choices: { key: string, value: string, icon?: ReactNode }[];
    resolve: (choice: (T extends true ? string[] : string)) => void;
    fullWidth?: boolean
    multiple?: T;
}) => {

    const [selectedChoice, setSelectedChoice] = useState<string | undefined>();

    const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
    const [done, setDone] = useState(false);

    const isConnected = useContext(IsConnectedContext);

    return <div className={`flex gap-2 px-3 mt-3 flex-wrap`}>
        {choices.map((choice) => (
            <button
                key={choice.key}
                disabled={!isConnected}
                onClick={() => {
                    if (isConnected) {
                        console.log('clicked', choice, selectedChoice);
                        if (multiple === true) {
                            if (!done) setSelectedChoices(prev => [...prev, choice.key]);
                        } else {
                            if (resolve && !selectedChoice) {
                                setSelectedChoice(choice.key);
                                resolve(choice.key as T extends true ? string[] : string);
                            }
                        }

                    }
                }}
                className={`px-4 py-2 text-white rounded-[6px] flex flex-row items-center gap-1.5 hover:opacity-90 bg-gradient-to-br ${fullWidth && 'w-full'}  ${(choice.key === selectedChoice || selectedChoices?.includes(choice.key)) ? 'from-[#4C7CED] to-[#7B31DC]' : 'bg-[#1C252E]'}`}
            >
                {choice.icon}
                {choice.value}
            </button>
        ))}
        {multiple && <button
            key={'done'}
            disabled={done || !isConnected}
            onClick={() => {
                if (isConnected) {
                    setDone(true);
                    resolve(selectedChoices as T extends true ? string[] : string);

                }
            }}
            className={`px-4 py-2 text-white rounded hover:opacity-90 bg-gradient-to-br w-full from-[#4C7CED] to-[#7B31DC] disabled:from-[#79a0fc] disabled:to-[#a561ff]`}
        >Done</button>}
    </div>
} 

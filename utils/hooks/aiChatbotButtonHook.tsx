import { IsConnectedContext } from '@/components/aiChatbot';
import { useState, useCallback, useEffect, useContext } from 'react';


export function useClientToolChoice<T extends boolean>({ choices, onShowButtons, fullWidth, multiple, }: {
    choices: { key: string, value: string }[];
    onShowButtons: (buttonsNode: React.ReactNode) => void;
    fullWidth?: boolean;
    multiple?: T;
}) {


    const clientToolFunction = useCallback(async ({ message }: { message: string }) => {
        console.log(message);

        return new Promise<string>((resolve) => {

            // Create buttons node
            onShowButtons(<Buttons choices={choices} resolve={(ch) => {

                if (multiple === true) resolve(ch as string);
                //elevenlabs only accepts strings not arrays
                else resolve(ch.toString());
            }}
                multiple={multiple} fullWidth={fullWidth} />);
        });
    }, [choices, onShowButtons,]);

    return {
        clientToolFunction,
    };
}


const Buttons = <T extends boolean>({ choices, resolve, fullWidth, multiple, }: {
    choices: { key: string, value: string }[];
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
                className={`px-4 py-2 text-white rounded hover:opacity-90 bg-gradient-to-br ${fullWidth && 'w-full'}  ${(choice.key === selectedChoice || selectedChoices?.includes(choice.key)) ? 'from-[#4C7CED] to-[#7B31DC]' : 'bg-[#404040]'}`}
            >
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

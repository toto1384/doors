import { useState, useCallback, useEffect } from 'react';

interface UseClientToolChoiceOptions<T extends boolean> {
    choices: string[];
    onShowButtons: (buttonsNode: React.ReactNode) => void;
    fullWidth?: boolean;
    multiple?: T;
}

export function useClientToolChoice<T extends boolean>({ choices, onShowButtons, fullWidth, multiple }: UseClientToolChoiceOptions<T>) {


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


const Buttons = <T extends boolean>({ choices, resolve, fullWidth, multiple }: {
    choices: string[];
    resolve: (choice: (T extends true ? string[] : string)) => void;
    fullWidth?: boolean
    multiple?: T
}) => {

    const [selectedChoice, setSelectedChoice] = useState<string | undefined>();

    const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
    const [done, setDone] = useState(false);

    return <div className={`flex gap-2 px-3 mt-3 ${fullWidth && 'flex-wrap'}`}>
        {choices.map((choice) => (
            <button
                key={choice}
                onClick={() => {
                    console.log('clicked', choice, selectedChoice);
                    if (multiple === true) {
                        if (!done) setSelectedChoices(prev => [...prev, choice]);
                    } else {
                        if (resolve && !selectedChoice) {
                            setSelectedChoice(choice);
                            resolve(choice as T extends true ? string[] : string);
                        }
                    }
                }}
                className={`px-4 py-2 text-white rounded hover:opacity-90 bg-gradient-to-br ${fullWidth && 'w-full'}  ${choice !== selectedChoice ? 'bg-[#404040]' : 'from-[#4C7CED] to-[#7B31DC]'}`}
            >
                {choice}
            </button>
        ))}
        {multiple && <button
            key={'done'}
            onClick={() => {
                setDone(true);
                resolve(selectedChoices as T extends true ? string[] : string);
            }}
            className={`px-4 py-2 text-white rounded hover:opacity-90 bg-gradient-to-br w-full from-[#4C7CED] to-[#7B31DC]`}
        >Done</button>}
    </div>
} 

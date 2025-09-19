import { useState, useCallback, useEffect } from 'react';

interface UseClientToolChoiceOptions {
    choices: string[];
    onShowButtons: (buttonsNode: React.ReactNode) => void;
    fullWidth?: boolean;
}

export function useClientToolChoice({ choices, onShowButtons, fullWidth }: UseClientToolChoiceOptions) {


    const clientToolFunction = useCallback(async ({ message }: { message: string }) => {
        console.log(message);

        return new Promise<string>((resolve) => {

            // Create buttons node

            onShowButtons(<Buttons choices={choices} resolve={resolve} fullWidth={fullWidth} />);
        });
    }, [choices, onShowButtons,]);

    return {
        clientToolFunction,
    };
}


const Buttons = ({ choices, resolve, fullWidth }: {
    choices: string[];
    resolve: (choice: string) => void;
    fullWidth?: boolean
}) => {

    const [selectedChoice, setSelectedChoice] = useState<string | undefined>();

    return <div className={`flex gap-2 px-3 mt-3 ${fullWidth && 'flex-wrap'}`}>
        {choices.map((choice) => (
            <button
                key={choice}
                onClick={() => {
                    console.log('clicked', choice, selectedChoice);
                    if (resolve && !selectedChoice) {
                        setSelectedChoice(choice);
                        resolve(choice);
                    }
                }}
                className={`px-4 py-2 text-white rounded hover:opacity-90 bg-gradient-to-br ${fullWidth && 'w-full'}  ${choice !== selectedChoice ? 'bg-[#404040]' : 'from-[#4C7CED] to-[#7B31DC]'}`}
            >
                {choice}
            </button>
        ))}
    </div>
} 

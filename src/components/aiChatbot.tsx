
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from 'components/ai-elements/conversation';
import { Message, MessageContent } from 'components/ai-elements/message';
import {
    PromptInput,
    PromptInputActionAddAttachments,
    PromptInputActionMenu,
    PromptInputActionMenuContent,
    PromptInputActionMenuTrigger,
    PromptInputAttachment,
    PromptInputAttachments,
    PromptInputBody,
    PromptInputButton,
    type PromptInputMessage,
    PromptInputModelSelect,
    PromptInputModelSelectContent,
    PromptInputModelSelectItem,
    PromptInputModelSelectTrigger,
    PromptInputModelSelectValue,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputToolbar,
    PromptInputTools,
} from 'components/ai-elements/prompt-input';
import {
    Actions
} from 'components/ai-elements/actions';
import { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Response } from 'components/ai-elements/response';
import { CopyIcon, GlobeIcon, Play, RefreshCcwIcon, StopCircleIcon } from 'lucide-react';
import {
    Source,
    Sources,
    SourcesContent,
    SourcesTrigger,
} from 'components/ai-elements/sources';
import {
    Reasoning,
    ReasoningContent,
    ReasoningTrigger,
} from 'components/ai-elements/reasoning';
import { Loader } from 'components/ai-elements/loader';
import { Status, useConversation } from '@elevenlabs/react';
import { FileUIPart } from 'ai';
import i18n from './i18n';
import { nanoid } from 'zod';
import { useClientToolChoice } from 'utils/hooks/aiChatbotButtonHook';
import { searchLocationByString } from 'utils/googleMapsUtils';
import { PropertyFilterContext } from '@/routes/__root';


function useChooseActions({ setMessages }: { setMessages: React.Dispatch<React.SetStateAction<Message[]>> }) {

    const { clientToolFunction: chooseHouseOrApartment } = useClientToolChoice({
        choices: ['Casa', 'Apartament'],
        onShowButtons: (buttonsNode) => {
            setMessages(prev => [...prev, { message: buttonsNode, source: 'user', id: nanoid().toString() }]);
        }
    });

    const { clientToolFunction: chooseBudget } = useClientToolChoice({
        choices: ['Sub 100.000 €', 'Intre 100.000 € și 200.000 €', 'Peste 200.000 €'],
        fullWidth: true,
        onShowButtons: (buttonsNode) => {
            setMessages(prev => [...prev, { message: buttonsNode, source: 'user', id: nanoid().toString() }]);
        }
    });

    return { chooseHouseOrApartment, chooseBudget }
}


export const ElevenLabsChatBotDemo = ({ conversationToken }: { conversationToken: string }) => {

    const [locale, setLocale] = useState(i18n.language as "ro" | "en");

    const { propertyFilters, setPropertyFilters } = useContext(PropertyFilterContext);

    const [messages, setMessages] = useState<Message[]>([]);


    useEffect(() => {
        const handleLanguageChange = (lng: string) => {
            setLocale(lng as "ro" | "en");
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [])

    const { chooseBudget, chooseHouseOrApartment } = useChooseActions({ setMessages })

    useEffect(() => {
        console.log(propertyFilters)
    }, [propertyFilters])

    const conversation = useConversation({
        clientTools: {
            chooseHouseOrApartment, chooseBudget,
            chooseAndSelectLocation: async ({ location }) => {
                const locationResult = await searchLocationByString(location);
                setPropertyFilters({ ...propertyFilters, location: locationResult ?? undefined });
            }
        },
        dynamicVariables: {
            'User_Name': "Alex"
        },
        volume: 0.5,
        onConnect: () => console.log('Connected'),
        onDisconnect: () => console.log('Disconnected'),
        onMessage: (message) => console.log('Message:', message),
        onError: (error) => console.error('Error:', error),
        overrides: {
            agent: {
                language: locale ?? 'ro',
            },
        },
    });




    const { isSpeaking, status, } = conversation

    const startConversation = useCallback(async () => {

        try {
            // Request microphone permission
            await navigator.mediaDevices.getUserMedia({ audio: true });
            // Start the conversation with your agent
            const str = await conversation.startSession({
                onMessage: (message) => {
                    setMessages((prev) => [...prev, { ...message, id: nanoid().toString() }])
                },
                // agentId: process.env.AGENT_ID!, // Replace with your agent I
                conversationToken: conversationToken as string,
                connectionType: 'webrtc', // either "webrtc" or "websocket"

                // userId: 'YOUR_CUSTOMER_USER_ID' // Optional field for tracking your end user IDs
            });

            console.log(str)
        } catch (error) {
            console.error('Failed to start conversation:', error);
        }
    }, [conversation]);


    const stopConversation = useCallback(async () => {
        await conversation.endSession();
        // setLocale('' as any)
        // setLocale(localeC)
    }, [conversation]);


    return <ChatBotDemo
        status={conversation.status}
        sendUserActivity={conversation.sendUserActivity}
        messages={messages}
        startConversation={startConversation}
        endConversation={stopConversation}
        sendMessage={(message) => { conversation.sendUserMessage(message.text); return setMessages(prev => [...prev, { message: message.text, source: 'user', id: nanoid().toString() }]); }}
    />
}

type Message = { source: 'user' | 'ai', message: string | ReactNode, id: string }

const ChatBotDemo = ({ messages, sendMessage, sendUserActivity, status, startConversation, endConversation }: {
    messages: Message[],
    sendMessage: ({ files, text }: { text: string, files?: FileUIPart[] }) => void,
    sendUserActivity: () => void,
    status: Status, startConversation: () => void, endConversation: () => void
}) => {
    const [input, setInput] = useState('');

    const handleSubmit = (message: PromptInputMessage) => {
        const hasText = Boolean(message.text);
        const hasAttachments = Boolean(message.files?.length);

        if (!(hasText || hasAttachments)) {
            return;
        }

        sendMessage({ text: message.text || 'Sent with attachments', files: message.files },
        );
        setInput('');
    };

    return (
        <div className="mx-auto py-4 relative h-full w-full">
            <div className="flex flex-col h-full">
                <Conversation className="h-full no-scrollbar">
                    <ConversationContent className='bg-transparent p-0'>
                        {messages.map((message, i) => (
                            <div key={message.id.toString()}>

                                <div key={`${message.message}-${i}`}>
                                    {typeof message.message == 'string' ?
                                        <Message from={message.source === 'ai' ? 'assistant' : 'user'}>
                                            <MessageContent>
                                                <Response className={message.source == 'ai' ? 'bg-[#404040] p-2 rounded-lg' : undefined} >
                                                    {message.message}
                                                </Response>
                                                {(message.source === 'ai' && typeof message.message == 'string' && i === messages.length - 1) && (
                                                    <Actions className="mt-2">
                                                        <Action
                                                            // onClick={() => regenerate()}
                                                            onClick={() => console.log('regenerate')}
                                                            label="Retry"
                                                        >
                                                            <RefreshCcwIcon className="size-3" />
                                                        </Action>
                                                        <Action
                                                            onClick={() =>
                                                                navigator.clipboard.writeText(message.message as string)
                                                            }
                                                            label="Copy"
                                                        >
                                                            <CopyIcon className="size-3" />
                                                        </Action>
                                                    </Actions>
                                                )}
                                            </MessageContent>
                                        </Message>
                                        : message.message}
                                </div>
                            </div>
                        ))}
                    </ConversationContent>
                    <ConversationScrollButton />
                </Conversation>

                <div className='px-3 w-full'>
                    <PromptInput onSubmit={handleSubmit} className="mt-4 px-2 w-full" globalDrop multiple>
                        {status === 'connected' && <>
                            <PromptInputBody>
                                <PromptInputAttachments>
                                    {(attachment) => <PromptInputAttachment data={attachment} />}
                                </PromptInputAttachments>
                                <PromptInputTextarea
                                    onChange={(e) => {
                                        sendUserActivity()
                                        return setInput(e.target.value)
                                    }}
                                    value={input}
                                />
                            </PromptInputBody>

                            <PromptInputToolbar>
                                <PromptInputTools>
                                    {/*<PromptInputActionMenu>
                                {/*<PromptInputActionMenuTrigger />
                                <PromptInputActionMenuContent>
                                    <PromptInputActionAddAttachments />
                                </PromptInputActionMenuContent>
                            </PromptInputActionMenu>*/}
                                    <PromptInputButton
                                        onClick={() => endConversation()}
                                        variant={'destructive'}
                                    >
                                        <StopCircleIcon size={16} />
                                        <span className="sr-only">Microphone</span>
                                    </PromptInputButton>
                                </PromptInputTools>
                                <PromptInputSubmit disabled={!input && !status} status={status as any} />
                            </PromptInputToolbar>

                        </>}

                        {status === 'disconnected' && <>
                            <PromptInputButton
                                onClick={() => startConversation()}
                                variant={'default'}
                            >
                                <Play size={16} />
                                <span className="sr-only">Microphone</span>
                            </PromptInputButton>
                        </>}

                        {(status === 'disconnecting' || status === 'connecting') && <>
                            <Loader />
                        </>}
                    </PromptInput>

                </div>
            </div>
        </div>
    );
};

export default ChatBotDemo;

function Action({ onClick, label, children }: ActionProps) {
    return (
        <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 focus-visible:outline-offset-2"
            onClick={onClick}
        >
            {children}
            <span className="sr-only">{label}</span>
        </button>
    );
}

interface ActionProps {
    onClick: () => void;
    label: string;
    children: React.ReactNode;
}

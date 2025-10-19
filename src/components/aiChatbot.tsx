
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from 'src/components/ai-elements/conversation';
import { Message, MessageContent } from 'src/components/ai-elements/message';
import { PromptInput, PromptInputAttachment, PromptInputAttachments, PromptInputBody, PromptInputButton, type PromptInputMessage, PromptInputSubmit, PromptInputTextarea, PromptInputToolbar, PromptInputTools, } from 'src/components/ai-elements/prompt-input';
import {
    Actions
} from 'src/components/ai-elements/actions';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Response } from 'src/components/ai-elements/response';
import { ChevronDown, ChevronsDown, CopyIcon, Play, RefreshCcwIcon, StopCircleIcon } from 'lucide-react';
import { Loader } from 'src/components/ai-elements/loader';
import { Status, useConversation } from '@elevenlabs/react';
import { FileUIPart } from 'ai';
import i18n from './i18n';
import { useTranslation } from 'react-i18next';
import { nanoid } from 'nanoid';
import { useClientToolChoice } from 'utils/hooks/aiChatbotButtonHook';
import { searchLocationByString } from 'utils/googleMapsUtils';
import { usePopoversOpenStore, usePropertyAddStore, usePropertyFilterStore } from '@/routes/__root';
import { PropertyFilters, PropertyObject, UserObject } from 'utils/validation/types';
import { useRouter, useRouterState } from '@tanstack/react-router';
import { useTRPC, useTRPCClient } from 'trpc/react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow'

type Message = { source: 'user' | 'ai', message: string | ReactNode, id: string }

function useChooseActions({ setMessages, }: { setMessages: React.Dispatch<React.SetStateAction<Message[]>>, }) {
    const { t } = useTranslation('translation', { keyPrefix: 'ai-chatbot' });

    const { clientToolFunction: chooseHouseOrApartment } = useClientToolChoice({
        choices: [
            { value: t('propertyTypes.house'), key: 'house' },
            { value: t('propertyTypes.apartment'), key: 'apartment' },
        ],
        onShowButtons: (buttonsNode) => {
            setMessages(prev => [...prev, { message: buttonsNode, source: 'user', id: nanoid() }]);
        },
    });

    const { clientToolFunction: chooseBudget } = useClientToolChoice({
        choices: [
            { value: t('budgetRanges.under100k'), key: 'under100k' },
            { value: t('budgetRanges.between100k200k'), key: 'between100k200k' },
            { value: t('budgetRanges.over200k'), key: 'over200k' },
        ],
        fullWidth: true,
        onShowButtons: (buttonsNode) => {
            setMessages(prev => [...prev, { message: buttonsNode, source: 'user', id: nanoid() }]);
        },
    });

    const { clientToolFunction: chooseFacilities } = useClientToolChoice({
        choices: [
            { value: t('facilities.parking'), key: 'parking' },
            { value: t('facilities.balcony'), key: 'balcony' },
            { value: t('facilities.terrace'), key: 'terrace' },
            { value: t('facilities.garden'), key: 'garden' },
            { value: t('facilities.elevator'), key: 'elevator' },
            { value: t('facilities.airConditioning'), key: 'airConditioning' },
            { value: t('facilities.centralHeating'), key: 'centralHeating' },
            { value: t('facilities.furnished'), key: 'furnished' },
        ],
        multiple: true,

        onShowButtons: (buttonsNode) => {
            setMessages(prev => [...prev, { message: buttonsNode, source: 'user', id: nanoid() }]);
        },
    });

    return { chooseHouseOrApartment, chooseBudget, chooseFacilities }
}


const useSetPropertyFunctions = ({
    setMessages,
    updateGhostProperty,
}: {
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    updateGhostProperty: (property: Partial<PropertyObject>) => void;
}) => {
    const { t } = useTranslation('translation', { keyPrefix: 'ai-chatbot' });

    return {
        //add posting tools
        // this tool displays a photo select interface for the user to add their photos
        selectPropertyPhotos: () => {

        },

        // this tool opens a displays an takes 2 titles and 2 descriptions that they are formed by the properties inputed by the user. the user can choose from those or write custom ones
        setPropertyTitleAndDescription: () => {

        },

        // this tools displays buttons in the ai chat to select the facilities of the property that he wants to post
        selectPropertyFacilities: useClientToolChoice({
            choices: [
                { value: t('facilities.parking'), key: 'parking' },
                { value: t('facilities.balcony'), key: 'balcony' },
                { value: t('facilities.terrace'), key: 'terrace' },
                { value: t('facilities.garden'), key: 'garden' },
                { value: t('facilities.elevator'), key: 'elevator' },
                { value: t('facilities.airConditioning'), key: 'airConditioning' },
                { value: t('facilities.centralHeating'), key: 'centralHeating' },
                { value: t('facilities.furnished'), key: 'furnished' },
            ],
            multiple: true,

            onShowButtons: (buttonsNode) => {
                setMessages(prev => [...prev, { message: buttonsNode, source: 'user', id: nanoid() }]);
            },
        }).clientToolFunction,

        // this sets the price of the property after the user tells it to the agent
        setPropertyPrice: ({ value, currency }: { value: number, currency: 'EUR' | 'USD' | 'RON' }) => {
            updateGhostProperty({ price: { value, currency } });
        },

        // this sets the number the rooms of the property after the user tells it to the agent
        setPropertyNumberOfRooms: ({ numberOfRooms }: { numberOfRooms: number }) => {
            updateGhostProperty({ numberOfRooms });
        },

        // this sets the surface area of the property after the user tells it to the agent
        setPropertySurfaceArea: ({ surfaceArea }: { surfaceArea: number }) => {
            updateGhostProperty({ surfaceArea });
        },


        // this sets the furnishing status of the property after the user tells it to the agent
        setPropertyFurnished: (furnished: boolean) => {
            updateGhostProperty({ furnished });
        },


        //todo: have to test for the specific streets to see that they are inputed correctly
        // this sets the location of the property after the user tells it to the agent
        setPropertyLocation: ({ location }: { location: string }) => {
            se
            updateGhostProperty({ location });
        },

        // this displays the buttons in the ai chat to select the type of the property that he wants to post
        setPropertyType: useClientToolChoice({
            choices: [
                { value: t('propertyTypes.house'), key: 'house' },
                { value: t('propertyTypes.apartment'), key: 'apartment' },
                { value: t('propertyTypes.hotel'), key: 'hotel' },
                { value: t('propertyTypes.office'), key: 'office' },
            ],
            onShowButtons: (buttonsNode) => {
                setMessages(prev => [...prev, { message: buttonsNode, source: 'user', id: nanoid() }]);
            },
        }).clientToolFunction,

        // this displays the buttons in the ai chat to select the heating of the property that he wants to post
        setPropertyHeating: useClientToolChoice({
            choices: [
                { value: t('heating.gas'), key: 'gas' },
                { value: t('heating.electric'), key: 'electric' },
                { value: t('heating.3rd_party'), key: '3rd_party' },
            ],
            onShowButtons: (buttonsNode) => {
                setMessages(prev => [...prev, { message: buttonsNode, source: 'user', id: nanoid() }]);
            },
        }).clientToolFunction,


        // // this displays the buttons in the ai chat to select the number of floors of the property that he wants to post
        // setPropertyFeatures: () => {
        // },

        // this sets the floor of the property after the user tells it to the agent
        setPropertyFloor: (floor: number) => {
        },

        // this sets the building year of the property after the user tells it to the agent
        setBuildingYear: ({ buildingYear }: { buildingYear: number }) => {
        },
    }
}

export const IsConnectedContext = createContext<boolean>(false);


export const ElevenLabsChatBotDemo = ({ conversationToken, user }: { conversationToken: string, user: { name: string, userType: string } }) => {

    const router = useRouter();
    const routerState = useRouterState();
    const trpc = useTRPC();

    const tokenQuery = useQuery({ ...trpc.auth.getToken.queryOptions(), initialData: { token: conversationToken } });

    const [locale, setLocale] = useState(i18n.language as "ro" | "en");


    const [messages, setMessages] = useState<Message[]>([]);

    const { partialProperty, setPartialProperty } = usePropertyAddStore(useShallow(state => ({
        partialProperty: state.partialProperty,
        setPartialProperty: state.setPartialProperty,
    })))

    const { propertyFilters, setPropertyFilters, updatePropertyFilters, sendUpdate, setSendUpdate } = usePropertyFilterStore(useShallow(state => ({
        propertyFilters: state.propertyFilters,
        setPropertyFilters: state.setPropertyFilters,
        updatePropertyFilters: state.updatePropertyFilters,
        sendUpdate: state.sendUpdate,
        setSendUpdate: state.setSendUpdate,
    })))


    useEffect(() => {
        const handleLanguageChange = (lng: string) => {
            setLocale(lng as "ro" | "en");
        };

        setSendUpdate(str => {
            conversation.sendContextualUpdate(str)
        })

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [])

    const { chooseBudget, chooseHouseOrApartment, chooseFacilities } = useChooseActions({ setMessages, })
    const functions = useSetPropertyFunctions({ setMessages, updateGhostProperty: (p) => setPartialProperty(({ ...partialProperty, ...p })) })

    const conversation = useConversation({

        clientTools: {
            //apply filters tools
            chooseHouseOrApartment, chooseBudget, chooseFacilities, ...functions,
            chooseAndSelectLocation: async ({ location }) => {
                const locationResult = await searchLocationByString(location);
                updatePropertyFilters({ ...propertyFilters, location: locationResult ?? undefined });
                // setPropertyFilters({ ...propertyFilters, location: locationResult ?? undefined });
            },
            applyFiltersWithoutLocation: async (propertyFilters: { filterObject: PropertyFilters }) => {
                console.log('setPropertyFilters', routerState.location.pathname, propertyFilters.filterObject)
                if (routerState.location.pathname !== '/app/properties') {
                    router.navigate({ to: '/app/properties' })
                }

                // setPropertyFilters(propertyFilters.filterObject)
                return await updatePropertyFilters(propertyFilters.filterObject)
            },


        },
        dynamicVariables: {
            'userName': user.name,
            "userType": user.userType,
        },
        volume: 0.5,
        onConnect: () => console.log('Connected'),
        onDisconnect: () => console.log('Disconnected'),
        onDebug: (message) => console.log('Debug:', message),

        onStatusChange(prop) {
            console.log('Status changed:', prop)
        },
        overrides: {
            agent: {
                language: locale ? (locale.includes('-') ? locale.split('-')[0] : locale) as 'en' | 'ro' : 'ro',
            },
        },
    });

    const { isSpeaking, status, } = conversation

    const startConversation = useCallback(async () => {

        async function start(token: string) {
            const str = await conversation.startSession({
                onMessage: (message) => {
                    setMessages((prev) => [...prev, { ...message, id: nanoid() }])
                },
                // agentId: process.env.AGENT_ID!, // Replace with your agent I
                conversationToken: token,
                connectionType: 'webrtc', // either "webrtc" or "websocket"
                onError(message, context) {
                    console.log('Error:', message, context)
                },
                onConnect({ conversationId }) {
                    console.log('Connected', conversationId)
                },

                // userId: 'YOUR_CUSTOMER_USER_ID' // Optional field for tracking your end user IDs
            });

            console.log(str)
        }
        console.log('start conversation', conversationToken)
        try {
            // Request microphone permission
            await navigator.mediaDevices.getUserMedia({ audio: true });
            await start(tokenQuery.data.token);
            // Start the conversation with your agent
        } catch (error) {
            console.log('Failed to start conversation:', { error });
            if ((error as any).status == 401) {
                tokenQuery.refetch().then(_ => start(_.data?.token ?? ''));
            }
        }
    }, [conversation]);


    const stopConversation = useCallback(async () => {
        await conversation.endSession();
    }, [conversation]);


    return <IsConnectedContext.Provider value={conversation.status === 'connected'}>
        <ChatBotDemo
            status={conversation.status}
            sendUserActivity={conversation.sendUserActivity}
            messages={messages}
            startConversation={startConversation}
            endConversation={stopConversation}
            sendMessage={(message) => { conversation.sendUserMessage(message.text); return setMessages(prev => [...prev, { message: message.text, source: 'user', id: nanoid() }]); }}
        />
    </IsConnectedContext.Provider>
}


const ChatBotDemo = ({ messages, sendMessage, sendUserActivity, status, startConversation, endConversation }: {
    messages: Message[],
    sendMessage: ({ files, text }: { text: string, files?: FileUIPart[] }) => void,
    sendUserActivity: () => void,
    status: Status, startConversation: () => void, endConversation: () => void
}) => {
    const [input, setInput] = useState('');

    const { aiChatbotOpen, setAiChatbotOpen } = usePopoversOpenStore(useShallow(state => ({
        aiChatbotOpen: state.aiChatbotOpen,
        setAiChatbotOpen: state.setAiChatbotOpen,
    })))

    const trpc = useTRPCClient()

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

                <div className='flex flex-row items-start justify-between border-b border-[#404040 rounded-b-lg'>
                    <div className='flex flex-row items-center px-3 pb-5 gap-2 '>
                        <img src={'/icons/robot.svg'} className="w-[35px] h-[35px] object-contain bg-[#525252] rounded-full p-2 object-center" />
                        <div className="flex flex-col mr-3">
                            <p >AI Assistant</p>
                            <p className="text-xs text-[#a3a3a3]">Online</p>
                        </div>
                    </div>

                    <div className='p-2 md:hidden' onClick={() => setAiChatbotOpen(!aiChatbotOpen)}><ChevronDown className='w-6 h-6' /></div>
                </div>

                <Conversation className="h-full no-scrollbar">
                    <ConversationContent className='bg-transparent p-0 min-h-full flex flex-col'>
                        {messages.length === 0 && <div className='flex flex-col min-h-full grow-1 flex-1 items-center justify-center'>
                            <img src={'/icons/robot.svg'} className="w-[100px] h-[100px] object-contain bg-[#525252] text-white opacity-40 rounded-full p-2 object-center" />
                            <p className='text-gray-400 text-center mt-3'>Ai Assistent Not Started</p>
                        </div>}
                        {messages.length > 0 && messages.map((message, i) => (
                            <div key={message.id.toString()}>
                                <div key={`${message.message}-${i}`}>
                                    {typeof message.message == 'string' ?
                                        <Message from={message.source === 'ai' ? 'assistant' : 'user'}>
                                            <MessageContent className='group-[.is-user]:bg-[#8A4FFF] group-[.is-assistant]:bg-[#241540] mx-2'>
                                                <Response >
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
                    <PromptInput onSubmit={handleSubmit} className="mt-4 px-2 " globalDrop multiple>
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
                                className='w-full cursor-pointer'
                            >
                                <span className="">Start Conversation</span>
                                <Play size={16} />
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

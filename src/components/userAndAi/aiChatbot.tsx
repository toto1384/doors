import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import i18n from '../i18n';
import { nanoid } from 'nanoid';
import { searchLocationByString } from 'utils/googleMapsUtils';
import { usePropertyAddStore, usePropertyFilterStore } from '@/routes/__root';
import { PropertyFilters, UserObject, } from 'utils/validation/types';
import { useRouter, useRouterState } from '@tanstack/react-router';
import { useTRPC, } from 'trpc/react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow'
import { useSetPropertyFunctions } from './usePostPropertyAiHook';
import { useChooseActions } from './useChooseActionsAiHook';
import { useConversation } from '@elevenlabs/react';
import { ChatComponent } from './chatComponent';

export type MessageType = { source: 'user' | 'ai', message: string | ReactNode, id: string }



export const IsConnectedContext = createContext<boolean>(false);


export const ElevenLabsChatBotDemo = ({ conversationToken, user }: { conversationToken: string, user: UserObject }) => {

    const trpc = useTRPC();
    const tokenQuery = useQuery({ ...trpc.auth.getToken.queryOptions(), initialData: { token: conversationToken } });

    const [locale, setLocale] = useState(i18n.language as "ro" | "en");
    const [messages, setMessages] = useState<MessageType[]>([]);


    const { partialProperty, setPartialProperty } = usePropertyAddStore(useShallow(state => ({
        partialProperty: state.partialProperty,
        setPartialProperty: state.appendPartialProperty,
    })))

    const { setSendUpdate } = usePropertyFilterStore(useShallow(state => ({
        // propertyFilters: state.propertyFilters,
        // updatePropertyFilters: state.updatePropertyFilters,
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

    const setPropertyFiltersFunctions = useChooseActions({ setMessages, })
    const postPropertyFunctions = useSetPropertyFunctions({
        setMessages, updateGhostProperty: (p) => setPartialProperty(({ ...partialProperty, ...p })),
    })


    const dynamicVariables = {
        'userName': user.name,
        "userType": user.userType,

        "hasAllPreferencesSet": !!((user.preferences?.propertyType?.length ?? 0) > 0 && (user.preferences?.budget?.min || user.preferences?.budget?.max) && user.preferences?.location?.fullLocationName && (user.preferences?.numberOfRooms?.length ?? 0) > 0 && (user.preferences?.facilities?.length ?? 0) > 0),

        "userPreferences_propertyType": user.preferences?.propertyType?.map(i => i.toString()).join(',') ?? '',
        "userPreferences_budgetMin": user.preferences?.budget?.min ?? 0,
        "userPreferences_budgetMax": user.preferences?.budget?.max ?? 0,
        "userPreferences_location": user.preferences?.location?.fullLocationName ?? '',
        "userPreferences_numberOfRooms": user.preferences?.numberOfRooms?.map(i => i.toString()).join(',') ?? '',
        "userPreferences_facilities": user.preferences?.facilities?.map(i => i.toString()).join(',') ?? '',
        "userPreferences_surfaceArea": user.preferences?.surfaceArea?.map(i => i.toString()).join(',') ?? '',
    }


    const conversation = useConversation({

        clientTools: { ...setPropertyFiltersFunctions, ...postPropertyFunctions, },
        dynamicVariables,
        volume: 0.5,
        onConnect: () => console.log('Connected'),
        onDisconnect: () => console.log('Disconnected'),
        onDebug: (message) => console.log('Debug:', message),

        onStatusChange(prop) {
            console.log('Status changed:', prop)
        },
        overrides: {
            agent: {
                language: locale ? ((locale.includes('-') ? locale.split('-')[0] : locale) as 'en' | 'ro') : 'ro',
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
                onStatusChange(prop) {
                    console.log('Status changed:', prop)
                },
                onAgentToolResponse(message: any) {
                    console.log('Agent tool response:', message)
                },
                onDisconnect: () => {
                    console.log('Disconnected')
                },
                onModeChange(prop) {
                    console.log('Mode changed:', prop)
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
        <ChatComponent
            status={conversation.status}
            sendUserActivity={conversation.sendUserActivity}
            messages={messages}
            startConversation={startConversation}
            endConversation={stopConversation}
            sendMessage={(message) => { conversation.sendUserMessage(message.text); return setMessages(prev => [...prev, { message: message.text, source: 'user', id: nanoid() }]); }}
        />
    </IsConnectedContext.Provider>
}



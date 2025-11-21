import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import i18n from '../i18n';
import { nanoid } from 'nanoid';
import { searchLocationByString } from 'utils/googleMapsUtils';
import { usePropertyAddStore, usePropertyFilterStore } from '@/routes/__root';
import { PropertyFilters, UserObject, } from 'utils/validation/types';
import { useRouter, useRouterState } from '@tanstack/react-router';
import { useTRPC, useTRPCClient, } from 'trpc/react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow'
import { useSetPropertyFunctions } from './usePostPropertyAiHook';
import { useChooseActions } from './useChooseActionsAiHook';
import { ChatComponent } from './chatComponent';
import { useConversation } from '@elevenlabs/react';
import { UserType } from 'utils/constants';
// import { useConversation as uc } from 'utils/hooks/mockElevenlabsHook';
// const useConversation = uc({ flow: 'buyer' })

export type MessageType = { source: 'user' | 'ai', message: string | ReactNode, id: string }



export const IsConnectedContext = createContext<boolean>(false);


export function ElevenLabsChatBotDemo<T extends boolean>({ conversationToken, user, demoVersion, userType }: {
    conversationToken: string,
    user: T extends true ? UserObject | undefined : UserObject,
    demoVersion?: T,
    userType?: typeof UserType[number];
}) {

    const trpc = useTRPCClient();
    const tokenQuery = useQuery({
        queryKey: ['auth.getToken'],
        initialData: { token: conversationToken },
        queryFn: () => trpc.auth.getToken.query()
    });

    const [locale, setLocale] = useState(i18n.language as "ro" | "en");
    const [messages, setMessages] = useState<MessageType[]>([]);


    const { partialProperty, setPartialProperty } = usePropertyAddStore(useShallow(state => ({
        partialProperty: state.partialProperty,
        setPartialProperty: state.appendPartialProperty,
    })))

    const { setSendUpdate, setStartConversation, setEndConversation } = usePropertyFilterStore(useShallow(state => ({
        setSendUpdate: state.setSendUpdate,
        setStartConversation: state.setStartConversation,
        setEndConversation: state.setEndConversation,
    })))


    const [agentState, setAgentState] = useState<'not-started' | 'stopped'>('not-started')


    const setPropertyFiltersFunctions = useChooseActions({ setMessages, demoVersion })
    const postPropertyFunctions = useSetPropertyFunctions({
        setMessages, updateGhostProperty: (p) => setPartialProperty(({ ...partialProperty, ...p })), demoVersion
    })


    const userTypeVar = userType ?? user?.userType;
    const localeVar = locale ? ((locale.includes('-') ? locale.split('-')[0] : locale) as 'en' | 'ro') : 'ro';

    const firstMessage = userTypeVar == undefined ? (localeVar == 'ro' ? 'Doresti sa cumperi sau sa vinzi o proprietate' : 'Are you looking to buy or to sell a property') :
        userTypeVar === 'buyer' ? (localeVar == 'ro' ? "sunt aici sa te ajut sa iti gasesti noua proprietate. Cauti un apartament sau o casa?" : "I\'m here to help you buy a property. Are you looking for an apartment or a house?") :
            (localeVar == "ro" ? "sunt aici sa te ajut sa iti vinzi proprietatea. Este vorba de apartament sau casa?" : 'I\'m here to help you sell your property. Are we talking about an apartment or a house?')

    const dynamicVariables = {
        'userName': user?.name ?? '',
        "userType": userTypeVar ?? '',
        "userTypeMessage": firstMessage,
        'demoVersion': (demoVersion ?? false).toString(),

        "hasAllPreferencesSet": user ? !!((user.preferences?.propertyType?.length ?? 0) > 0 && (user.preferences?.budget?.min || user.preferences?.budget?.max) && user.preferences?.location?.fullLocationName && (user.preferences?.numberOfRooms?.length ?? 0) > 0 && (user.preferences?.facilities?.length ?? 0) > 0) : false,

        "userPreferences_propertyType": user?.preferences?.propertyType?.map(i => i.toString()).join(',') ?? '',
        "userPreferences_budgetMin": user?.preferences?.budget?.min ?? 0,
        "userPreferences_budgetMax": user?.preferences?.budget?.max ?? 0,
        "userPreferences_location": user?.preferences?.location?.fullLocationName ?? '',
        "userPreferences_numberOfRooms": user?.preferences?.numberOfRooms?.map(i => i.toString()).join(',') ?? '',
        "userPreferences_facilities": user?.preferences?.facilities?.map(i => i.toString()).join(',') ?? '',
        "userPreferences_surfaceArea": user?.preferences?.surfaceArea?.min ?? '',
    };


    const conversation = useConversation({

        clientTools: { ...setPropertyFiltersFunctions, ...postPropertyFunctions, },
        dynamicVariables,
        volume: 0.9,
        onDebug: (message) => console.log('Debug:', message),

        onStatusChange(prop) {
            console.log('Status changed:', prop)
        },
        overrides: {
            agent: {
                language: localeVar,
            },
        },
    });

    console.log('conversation', conversation)

    const { isSpeaking, status, } = conversation

    const startConversation = useCallback(async () => {

        async function start(token: string) {
            setAgentState('not-started')
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


    useEffect(() => {
        const handleLanguageChange = (lng: string) => {
            setLocale(lng as "ro" | "en");
        };

        setSendUpdate(str => {
            conversation.sendContextualUpdate(str)
        })

        setStartConversation(() => {
            console.log('setStartConversation')
            return startConversation()
        })


        setEndConversation(async () => {
            console.log('setEndConversation')
            setAgentState('stopped')
            return conversation.endSession()
        })

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [])

    const stopConversation = useCallback(async () => {
        console.log('stopConversation')
        await conversation.endSession();
    }, [conversation]);


    return <IsConnectedContext.Provider value={conversation.status === 'connected'}>
        <ChatComponent
            agentState={agentState}
            demoVersion={demoVersion}
            userType={userTypeVar}
            firstMessage={`${localeVar == 'ro' ? 'Salut' : 'Hello'}, ${firstMessage}`}
            status={conversation.status}
            sendUserActivity={conversation.sendUserActivity}
            messages={messages}
            startConversation={startConversation}
            endConversation={stopConversation}
            sendMessage={(message) => { conversation.sendUserMessage(message.text); return setMessages(prev => [...prev, { message: message.text, source: 'user', id: nanoid() }]); }}
        />
    </IsConnectedContext.Provider>
}



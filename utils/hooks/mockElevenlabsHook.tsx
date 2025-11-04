import { useChooseActions } from "@/components/userAndAi/useChooseActionsAiHook";
import React from "react";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { Status } from "@elevenlabs/react";



type ParameterType<T extends 'array' | 'string' | 'number' | 'object'> = {
    id: string,
    type: T,
    items: T extends 'array' ? ParameterType<'string' | 'number' | 'object' | 'array'> : undefined,
    properties: T extends 'object' ? ParameterType<'string' | 'number' | 'object' | 'array'>[] : undefined,
    enum: T extends 'string' ? string[] | undefined : undefined,
}


// function transformParameter(parameter: ParameterType<'array' | 'string' | 'number' | 'object'>): ParameterType<'array' | 'string' | 'number' | 'object'> {
//
//     if (parameter.type === 'array') {
//         return {
//             id: parameter.id,
//             type: parameter.type,
//             items: transformParameter(parameter.items!),
//             properties: parameter.properties,
//             enum: parameter.enum,
//         } as const
//     } else if (parameter.type === 'object') {
//         return {
//             id: parameter.id,
//             type: parameter.type,
//             items: parameter.items,
//             properties: parameter.properties?.map(i=> transformParameter(i)),
//             enum: parameter.enum,
//         } as const
//     } else {
//         return {
//             id: parameter.id,
//             type: parameter.type,
//             items: parameter.items,
//             properties: parameter.properties,
//             enum: parameter.enum,
//         } as const
//     }
//
// }



async function GetAllTools() {
    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    const tools = await client.conversationalAi.tools.list();

    tools.tools.map(tool => {
        // tool.accessInfo.role
        if (tool.toolConfig.type === 'client') {
            return {
                name: tool.toolConfig.name,
                parameters: tool.toolConfig.parameters?.properties ? Object.entries(tool.toolConfig.parameters?.properties).map(([k, v]) => ({ id: k, ...v, })) : undefined,
            }
        }

        return undefined
    })
}





export const useConversation = ({ flow }: { flow: 'buyer' | 'seller' }) => ({ clientTools }: {
    clientTools: { [key: string]: Function },
    dynamicVariables: any,
    onDebug: (message: string) => void,
    onStatusChange: (prop: string) => void,
    volume: number,
    overrides: { agent: { language: string } };
}) => {

    const [status, setStatus] = React.useState<Status>('disconnected');
    const [isSpeaking, setIsSpeaking] = React.useState(false);

    const [conversationEvents, setConversationEvents] = React.useState<{ onConnect: Function, onDisconnect: Function, onMessage: Function } | undefined>()


    const [messages, setMessages] = React.useState<string[]>([])

    return {
        sendContextualUpdate: (str: string) => { },
        status, isSpeaking,
        sendUserActivity: () => { },
        sendUserMessage: (str: string) => {
            setMessages(prev => [...prev, str])
        },
        startSession: async ({ onMessage, onConnect, onDisconnect, onError }: {
            onMessage: (message: { message: string, source: 'user' | 'ai' }) => void,
            onConnect: (co: { conversationId: string }) => void,
            onDisconnect: () => void,
            onError: (message: string, context: any) => void;
            conversationToken: string,
            connectionType: 'webrtc' | 'websocket',
            onStatusChange: (prop: Status) => void,
            onAgentToolResponse: (message: any) => void,
            onModeChange: (prop: string) => void,
        }) => {
            GetAllTools().then(tools => {
                console.log('tools', tools)
            })
            //here start sending the messages
            setConversationEvents({ onConnect, onDisconnect, onMessage })
            setStatus('connected')
            onConnect({ conversationId: 'conversationId' })
            if (flow === 'buyer') {
                onMessage({ message: 'Bun venit la doors, cu ce te pot ajuta?', source: 'ai' })
                onMessage({ message: 'Vreau sa imi gasesc o casa', source: 'user' })
                console.log('clientTools', clientTools)
                const houseOrApartment = await clientTools.chooseHouseOrApartment()
                onMessage({ message: `Perfect, deci doresti ${houseOrApartment}`, source: 'ai' })

                onMessage({ message: 'Ce buget ai', source: 'ai' })
                const budget = await clientTools.chooseBudget()
                onMessage({ message: `Perfect, deci doresti ${budget}`, source: 'ai' })

                onMessage({ message: 'Ce facilitati doresti', source: 'ai' })
                const facilities = await clientTools.chooseFacilities()
                onMessage({ message: `Perfect, deci doresti ${facilities}`, source: 'ai' })

                onMessage({ message: 'Ce suprafata doresti', source: 'ai' })
                onMessage({ message: '30 m2', source: 'user' })
                const surfaceArea = await clientTools.chooseSurfaceArea({ surfaceArea: 30 })
                onMessage({ message: `Perfect, deci doresti ${30}`, source: 'ai' })

                onMessage({ message: 'Cate camere doresti', source: 'ai' })
                onMessage({ message: '1, 2, 3', source: 'user' })
                const numberOfRooms = await clientTools.chooseNumberOfRooms({ numberOfRoomsArray: [1, 2, 3,] })
                onMessage({ message: `Perfect, deci doresti ${[1, 2, 3]}`, source: 'ai' })


                onMessage({ message: 'Care este locatia pe care o doresti', source: 'ai' })
                onMessage({ message: 'In Iasi', source: 'user' })
                const { fullLocationName } = JSON.parse(await clientTools.chooseAndSelectLocation({ location: 'Iasi' }))
                onMessage({ message: `Perfect, deci doresti ${fullLocationName}`, source: 'ai' })

                onMessage({ message: 'Ok, asta este tot', source: 'ai' })
                await clientTools.endBuyerFlow()

            } else if (flow === 'seller') {
                onMessage({ message: 'Bun venit la doors, cu ce te pot ajuta?', source: 'ai' })

                onMessage({ message: 'Vreau sa imi vand o locuinta', source: 'user' })
                onMessage({ message: 'Care este tipul de proprietate pe care doresti sa o vinzi', source: 'ai' })
                const propertyType = await clientTools.setPropertyType()
                onMessage({ message: `Perfect, deci este ${propertyType}`, source: 'ai' })

                onMessage({ message: 'In ce locatie doresti sa te muti', source: 'ai' })
                onMessage({ message: 'In Iasi', source: 'user' })
                const { locationName } = JSON.parse(await clientTools.setPropertyLocation({ location: 'iasi' }))
                onMessage({ message: `Perfect, deci este ${locationName}`, source: 'ai' })

                onMessage({ message: 'Cate camere are locuinta', source: 'ai' })
                onMessage({ message: '2', source: 'user' })
                const numberOfRooms = await clientTools.setPropertyNumberOfRooms({ numberOfRooms: 2 })
                onMessage({ message: `Perfect, deci doresti ${2}`, source: 'ai' })


                onMessage({ message: 'Care este suprafata locuintei', source: 'ai' })
                onMessage({ message: '30 m2', source: 'user' })
                const surfaceArea = await clientTools.setPropertySurfaceArea({ surfaceArea: 30 })
                onMessage({ message: `Perfect, deci doresti ${30}`, source: 'ai' })


                onMessage({ message: 'Care este etajul locuintei', source: 'ai' })
                onMessage({ message: '2 etaje', source: 'user' })
                const floor = await clientTools.setPropertyFloor({ propertyFloor: 2 })
                onMessage({ message: `Perfect, deci doresti ${2}`, source: 'ai' })


                onMessage({ message: 'Care este anul constructiei locuintei', source: 'ai' })
                onMessage({ message: '2020', source: 'user' })
                const buildingYear = await clientTools.setBuildingYear({ buildingYear: 2020 })
                onMessage({ message: `Perfect, deci doresti ${2020}`, source: 'ai' })


                onMessage({ message: 'Este mobilata locuinta', source: 'ai' })
                onMessage({ message: 'Da', source: 'user' })
                const furnished = await clientTools.setPropertyFurnished({ furnished: true })
                onMessage({ message: `Perfect, deci doresti ${true}`, source: 'ai' })

                onMessage({ message: 'Care este incalzirea locuintei', source: 'ai' })
                const heating = await clientTools.setPropertyHeating()
                onMessage({ message: `Perfect, deci doresti ${heating}`, source: 'ai' })


                onMessage({ message: 'Ce este facilitatia locuintei', source: 'ai' })
                const facilities = await clientTools.setPropertyFeatures()
                onMessage({ message: `Perfect, deci doresti ${facilities}`, source: 'ai' })


                onMessage({ message: 'Care este pretul locuintei', source: 'ai' })
                const price = await clientTools.setPropertyPrice({ value: 10000, currency: 'EUR' })
                onMessage({ message: `Perfect, deci doresti ${10000} ${'EUR'}`, source: 'ai' })


                onMessage({ message: 'Ti-am generat 2 titluri si descrieri pentru aceasta proprietate', source: 'ai' })
                const titleAndDescriptionCombo = await clientTools.setPropertyTitleAndDescription({
                    title1: `${propertyType} in ${locationName} cu ${floor} etaj si ${buildingYear} anul constructiei`,
                    description1: `Va prezentam o ${propertyType} in ${locationName} cu ${floor} etaj si ${buildingYear} anul constructiei cu ${numberOfRooms} camere si ${surfaceArea} suprafata cu ${heating} si ${furnished} si ${facilities}`,
                    title2: `${propertyType} in ${locationName} cu ${numberOfRooms} camere si ${surfaceArea} suprafata`,
                    description2: `Avem in vanzare o ${propertyType} in ${locationName} cu ${numberOfRooms} camere si ${surfaceArea} suprafata cu ${heating} si ${furnished} si ${facilities}`,
                })
                onMessage({ message: `Perfect, ai selectat titlrile si descrierile`, source: 'ai' })


                onMessage({ message: 'Acum incarca Pozele', source: 'ai' })
                const photos = await clientTools.selectPropertyPhotos()
                onMessage({ message: `Perfect, ai selectat fotografiile`, source: 'ai' })

                await clientTools.publishProperty()
                onMessage({ message: `Perfect, ai publicat proprietatea`, source: 'ai' })


            }
            return 'conversationId'
        },
        endSession: () => {
            conversationEvents?.onDisconnect()
            setStatus('disconnected')
            setConversationEvents(undefined)
            setIsSpeaking(false)
        },
    }
}

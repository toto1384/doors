import { PropertyObject } from "utils/validation/types";
import { MessageType } from "./aiChatbot";
import { useTranslation } from "react-i18next";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { useTRPCClient } from "trpc/react";
import { usePopoversOpenStore, usePropertyAddStore, usePropertyFilterStore } from "@/routes/__root";
import { useShallow } from "zustand/react/shallow";
import { useClientToolSelectPhotos } from "utils/hooks/aiChatbotSelectImagesHook";
import { nanoid } from "nanoid";
import { useClientToolChoice } from "utils/hooks/aiChatbotButtonHook";
import { searchLocationByString } from "utils/googleMapsUtils";
import { Facilities } from "utils/validation/propertyFilters";
import { demoPropertyKey, PropertyHeating, PropertyTypeType } from "utils/constants";
import { useQueryClient } from "@tanstack/react-query";


export const useSetPropertyFunctions = ({
    setMessages,
    updateGhostProperty,
    demoVersion
}: {
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
    updateGhostProperty: (property: Partial<PropertyObject>) => void;
    demoVersion?: boolean;
}) => {
    const { t } = useTranslation('translation', { keyPrefix: 'ai-chatbot' });
    const router = useRouter()
    const routerState = useRouterState()
    const trpcClient = useTRPCClient()

    const ensureIsInAddMode = () => { if (routerState.location.pathname !== '/app/properties/add' && !demoVersion) router.navigate({ to: '/app/properties/add' }) }

    const { setProgressBar, aiChatbotOpen, setAiChatbotOpen } = usePopoversOpenStore(useShallow(state => ({
        setProgressBar: state.setProgressBar,
        aiChatbotOpen: state.aiChatbotOpen,
        setAiChatbotOpen: state.setAiChatbotOpen,
    })))

    const { setTitlesAndDescriptions, setTitleAndDescResolver, getPartialProperty, setPostedStatus } = usePropertyAddStore(useShallow(state => ({
        setTitlesAndDescriptions: state.setTitlesAndDescriptions,
        setTitleAndDescResolver: state.setTitleAndDescResolver,
        getPartialProperty: state.getPartialProperty,
        setPostedStatus: state.setPostedStatus,

    })))

    const { endConversation } = usePropertyFilterStore(useShallow(state => ({
        endConversation: state.endConversation,
    })))


    const queryClient = useQueryClient()


    return {
        publishProperty: async () => {
            const ghostProperty = getPartialProperty()
            console.log('publishProperty', ghostProperty)
            try {
                let result
                if (demoVersion) {
                    localStorage.setItem(demoPropertyKey, JSON.stringify(ghostProperty))
                    result = JSON.stringify(ghostProperty)
                    setPostedStatus({ success: true, message: 'Property saved as demo. Login to post' })
                    setProgressBar(undefined)
                    router.navigate({ to: '/auth/$path', params: { path: 'sign-in' } })
                } else {
                    result = await trpcClient.properties.postProperty.mutate({ property: ghostProperty as any })
                    setPostedStatus({ success: result.success, message: result.message })
                    if (result.success) setProgressBar(undefined)
                    router.navigate({ to: '/app/my-properties' })
                }
                await endConversation()
                queryClient.invalidateQueries({ queryKey: ['my-properties'] })
                return JSON.stringify(result)
            } catch (error) {
                console.log('error', error)
                return JSON.stringify({ success: false, message: error })
            }
        },
        //add posting tools
        // this tool displays a photo select interface for the user to add their photos
        selectPropertyPhotos: useClientToolSelectPhotos({
            onShowPhotoSelector(photosSelectorNode) {
                setMessages(prev => [...prev, { message: photosSelectorNode, source: 'user', id: nanoid() }]);
            },
            additionalOnClick(photos) {
                updateGhostProperty({ imageUrls: photos })
                ensureIsInAddMode()

            },
        }).clientToolFunction,

        // this tool opens a displays an takes 2 titles and 2 descriptions that they are formed by the properties inputed by the user. the user can choose from those or write custom ones
        setPropertyTitleAndDescription: ({ title1, title2, description1, description2 }: { title1: string, title2: string, description1: string, description2: string }) => {
            setTitlesAndDescriptions([{ title: title1, description: description1 }, { title: title2, description: description2 }])
            ensureIsInAddMode()
            if (aiChatbotOpen) setAiChatbotOpen(false)

            return new Promise<string>((resolve) => {
                setTitleAndDescResolver((title, description) => {
                    resolve(`${title} ${description}`)
                    updateGhostProperty({ title, description })
                    if (!aiChatbotOpen) setAiChatbotOpen(true)
                    setTitlesAndDescriptions([])
                })
            })
        },

        // this tools displays buttons in the ai chat to select the facilities of the property that he wants to post
        setPropertyFeatures: useClientToolChoice({
            choices: [
                { value: t('facilities.parking'), key: 'parking' },
                { value: t('facilities.balcony'), key: 'balcony' },
                { value: t('facilities.terrace'), key: 'terrace' },
                { value: t('facilities.garden'), key: 'garden' },
                { value: t('facilities.elevator'), key: 'elevator' },
                { value: t('facilities.airConditioning'), key: 'air-conditioning' },
                { value: t('facilities.centralHeating'), key: 'central-heating' },
                { value: t('facilities.furnished'), key: 'furnished' },
            ],
            multiple: true,
            additionalOnClick(value) {
                updateGhostProperty({ features: value as any[] })
                ensureIsInAddMode()
            },

            onShowButtons: (buttonsNode) => {
                setMessages(prev => [...prev, { message: buttonsNode, source: 'user', id: nanoid() }]);
            },
        }).clientToolFunction,

        // this sets the price of the property after the user tells it to the agent
        setPropertyPrice: ({ value, currency }: { value: number, currency: 'EUR' | 'USD' | 'RON' }) => {
            updateGhostProperty({ price: { value, currency } });
            ensureIsInAddMode()
        },

        // this sets the number the rooms of the property after the user tells it to the agent
        setPropertyNumberOfRooms: ({ numberOfRooms }: { numberOfRooms: number }) => {
            updateGhostProperty({ numberOfRooms });
            ensureIsInAddMode()
        },

        // this sets the surface area of the property after the user tells it to the agent
        setPropertySurfaceArea: ({ surfaceArea }: { surfaceArea: number }) => {
            updateGhostProperty({ surfaceArea });
            ensureIsInAddMode()
        },


        // this sets the furnishing status of the property after the user tells it to the agent
        setPropertyFurnished: ({ furnished }: { furnished: boolean }) => {
            updateGhostProperty({ furnished });
            ensureIsInAddMode()
        },


        //todo: have to test for the specific streets to see that they are inputed correctly
        // this sets the location of the property after the user tells it to the agent
        setPropertyLocation: async ({ location }: { location: string }) => {

            const locationResult = await searchLocationByString(location);
            updateGhostProperty({ location: locationResult ?? undefined });
            ensureIsInAddMode()

            return JSON.stringify({ locationName: locationResult?.fullLocationName })
        },

        // this displays the buttons in the ai chat to select the type of the property that he wants to post
        setPropertyType: useClientToolChoice({
            choices: [
                { value: t('propertyTypes.house'), key: 'house' },
                { value: t('propertyTypes.apartment'), key: 'apartment' },
                { value: t('propertyTypes.hotel'), key: 'hotel' },
                { value: t('propertyTypes.office'), key: 'office' },
            ],
            additionalOnClick(value) {
                updateGhostProperty({ propertyType: value as any })
                ensureIsInAddMode()
            },
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
            additionalOnClick(value) {
                updateGhostProperty({ heating: value as any })
                ensureIsInAddMode()
            },
            onShowButtons: (buttonsNode) => {
                setMessages(prev => [...prev, { message: buttonsNode, source: 'user', id: nanoid() }]);
            },
        }).clientToolFunction,


        // // this displays the buttons in the ai chat to select the number of floors of the property that he wants to post
        // setPropertyFeatures: () => {
        // },

        // this sets the floor of the property after the user tells it to the agent
        setPropertyFloor: ({ propertyFloor }: { propertyFloor: number }) => {
            updateGhostProperty({ floor: propertyFloor });
            ensureIsInAddMode()
        },

        // this sets the building year of the property after the user tells it to the agent
        setBuildingYear: ({ buildingYear }: { buildingYear: number }) => {
            updateGhostProperty({ buildingYear });
            ensureIsInAddMode()
        },


        setPropertyFeaturesVoice: ({ features }: { features: typeof Facilities[number][] }) => {
            updateGhostProperty({ features });
            ensureIsInAddMode()
        },

        setPropertyHeatingVoice: ({ heating }: { heating: PropertyHeating }) => {
            updateGhostProperty({ heating });
            ensureIsInAddMode()
        },


        setPropertyTypeVoice: ({ propertyType }: { propertyType: PropertyTypeType }) => {
            updateGhostProperty({ propertyType });
            ensureIsInAddMode()
        },
    }
}

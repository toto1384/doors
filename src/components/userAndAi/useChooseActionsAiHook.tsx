import React from "react";
import { Message } from "./aiChatbot";
import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useClientToolChoice } from "utils/hooks/aiChatbotButtonHook";
import { nanoid } from "nanoid";

export function useChooseActions({ setMessages, }: { setMessages: React.Dispatch<React.SetStateAction<Message[]>>, }) {

    const router = useRouter()
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


    const { clientToolFunction: setIntentFunction } = useClientToolChoice({
        choices: [
            {
                value: 'Cumpara/Inchiriaza', key: 'buyer', icon: <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.9937 7.98438C17.9937 8.54688 17.525 8.9875 16.9937 8.9875H15.9937L16.0156 13.9937C16.0156 14.0781 16.0094 14.1625 16 14.2469V14.75C16 15.4406 15.4406 16 14.75 16H14.25C14.2156 16 14.1813 16 14.1469 15.9969C14.1031 16 14.0594 16 14.0156 16H13H12.25C11.5594 16 11 15.4406 11 14.75V14V12C11 11.4469 10.5531 11 10 11H8C7.44688 11 7 11.4469 7 12V14V14.75C7 15.4406 6.44063 16 5.75 16H5H4.00313C3.95625 16 3.90937 15.9969 3.8625 15.9937C3.825 15.9969 3.7875 16 3.75 16H3.25C2.55938 16 2 15.4406 2 14.75V11.25C2 11.2219 2 11.1906 2.00312 11.1625V8.9875H1C0.4375 8.9875 0 8.55 0 7.98438C0 7.70312 0.09375 7.45312 0.3125 7.23438L8.325 0.25C8.54375 0.03125 8.79375 0 9.0125 0C9.23125 0 9.48125 0.0625 9.66875 0.21875L17.65 7.23438C17.9 7.45312 18.025 7.70312 17.9937 7.98438Z" fill="#E9E1FF" />
                </svg>
            },
            {
                value: 'Listeaza Proprietate', key: 'seller', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16ZM7.25 10.75V8.75H5.25C4.83437 8.75 4.5 8.41562 4.5 8C4.5 7.58437 4.83437 7.25 5.25 7.25H7.25V5.25C7.25 4.83437 7.58437 4.5 8 4.5C8.41562 4.5 8.75 4.83437 8.75 5.25V7.25H10.75C11.1656 7.25 11.5 7.58437 11.5 8C11.5 8.41562 11.1656 8.75 10.75 8.75H8.75V10.75C8.75 11.1656 8.41562 11.5 8 11.5C7.58437 11.5 7.25 11.1656 7.25 10.75Z" fill="#E9E1FF" />
                </svg>
            },
        ],
        additionalOnClick: (choice) => {
            if (choice == 'seller') router.navigate({ to: '/app/properties/add' })
            if (choice == 'buyer') router.navigate({ to: '/app/properties' })
        },
        onShowButtons: (buttonsNode) => {
            setMessages(prev => [...prev, { message: buttonsNode, source: 'user', id: nanoid() }]);
        },
    });

    return { chooseHouseOrApartment, chooseBudget, chooseFacilities, setIntentFunction }
}


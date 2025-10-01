import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../locales/en.json';
import roTranslations from '../locales/ro.json';

const resources = {
    en: {
        translation: enTranslations
    },
    ro: {
        translation: roTranslations
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(LanguageDetector)
    .init({
        resources,
        fallbackLng: "en", // fallback language if translation missing
        supportedLngs: ['en', 'ro'],
        load: 'languageOnly',
        convertDetectedLanguage: (lng: string) => lng.includes('-') ? lng.split('-')[0] : lng,
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            lookupLocalStorage: 'i18nextLng',
            caches: ['localStorage']
        },
    } as any);

export default i18n;

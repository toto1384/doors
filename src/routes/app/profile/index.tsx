import ThemeSwitcher from "../../../components/themeSwitcher";
import { LanguageToggle } from "@/components/language-toggle";
import { AccountSettingsCards, DeleteAccountCard, SessionsCard, SettingsCard } from "@daveyplate/better-auth-ui"
import { useTranslation } from "react-i18next";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute('/app/profile/')({
    component: Profile,
})

function Profile() {

    const { t } = useTranslation('translation', { keyPrefix: 'profile-page' });


    return (
        <div className="container mx-auto px-6 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid gap-6">
                    {/* Language Settings Section */}
                    <div className="bg-card rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {t('sections.language')}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {t('language.subtitle')}
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {t('language.title')}
                            </span>
                            <LanguageToggle variant="outline" />
                        </div>
                    </div>

                    {/* Theme Settings Section */}
                    <div className="bg-card rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {t('theme.title')}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {t('theme.subtitle')}
                            </p>
                        </div>
                        <ThemeSwitcher />
                    </div>

                    {/* Account Actions */}
                    {/* <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"> */}
                    {/*     <div className="mb-4"> */}
                    {/*         <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2"> */}
                    {/*             Account */}
                    {/*         </h2> */}
                    {/*     </div> */}
                    {/*     <LoginSwitchButton /> */}
                    {/* </div> */}
                    {/* <AccountSettingsCards /> */}
                    <SessionsCard />
                    <DeleteAccountCard />
                </div>
            </div>
        </div>
    );
}

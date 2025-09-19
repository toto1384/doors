import { Link, useRouter } from "@tanstack/react-router"
import i18n from "../i18n"
import { useTranslation } from "react-i18next"
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { authClient } from "utils/auth-client"
import { ReactNode } from "react"



export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    const locale = i18n.language
    const { t } = useTranslation('auth-ui')

    const localization = {
        SIGN_IN: t('signIn'),
        SIGN_UP: t('signUp'),
        SIGN_OUT: t('signOut'),
        EMAIL: t('email'),
        PASSWORD: t('password'),
        USERNAME: t('name'),
        NAME: t('name'),
        FORGOT_PASSWORD: t('forgotPassword'),
        RESET_PASSWORD: t('resetPassword'),
        VERIFY_YOUR_EMAIL: t('verifyEmail'),
        RESEND_VERIFICATION_EMAIL: t('resendVerification'),
        REMEMBER_ME: t('rememberMe'),
        RECOVER_ACCOUNT: t('forgotPassword'),
        CHANGE_PASSWORD: t('changePassword'),
        CURRENT_PASSWORD: t('currentPassword'),
        NEW_PASSWORD: t('newPassword'),
        CONFIRM_PASSWORD: t('confirmPassword'),
        SETTINGS: t('settings'),
        SAVE: t('saving'),
        CANCEL: t('cancel'),
        CONTINUE: t('continue'),
        DONE: t('continue'),
        DELETE: t('delete'),
        GO_BACK: t('backToSignIn'),
        BY_CONTINUING_YOU_AGREE: t('byContinuingYouAgree'),
        TERMS_OF_SERVICE: t('termsOfService'),
        PRIVACY_POLICY: t('privacyPolicy'),
        ACCOUNT: t('account'),
        PROFILE: t('profile')
    }




    return (
        <AuthUIProvider
            social={{ providers: ['google'] }}
            localization={localization}
            authClient={authClient}
            navigate={(str) => router.navigate({ to: str, replace: false })}
            replace={(str) => router.navigate({ to: str, replace: true })}
            onSessionChange={() => {

                // Clear router cache (protected routes)
                router.invalidate()
            }}
            Link={({ children, href, className }) => <Link to={href} className={className}>{children}</Link>}
            avatar={{
                size: 50,
            }}
            account={{
                basePath: '/app',
                viewPaths: {

                    SETTINGS: '/profile'
                }
            }}
        >

            {children}
        </AuthUIProvider>
    )
}


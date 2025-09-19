

import { AuthView } from "@daveyplate/better-auth-ui"
import { authViewPaths } from "@daveyplate/better-auth-ui/server"
import { createFileRoute, useRouterState } from "@tanstack/react-router"


export const Route = createFileRoute('/auth/$path/')({
    component: AuthPage,
})

function AuthPage() {

    const router = useRouterState()

    return (
        <main className="container flex grow flex-col items-center justify-center self-center p-4 md:p-6">
            <AuthView path={router.location.pathname} redirectTo="/app" />
        </main>
    )
}

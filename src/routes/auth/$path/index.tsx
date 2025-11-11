
import LoginPage from "@/components/pages/login-01"
import RegisterPage from "@/components/pages/register-01"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute('/auth/$path/')({
    component: AuthPage,
})

function AuthPage() {
    const { path } = Route.useParams()

    // throw new Error('Not implemented')
    if (path === 'sign-up') {
        return <RegisterPage />
    }

    return <LoginPage />
}

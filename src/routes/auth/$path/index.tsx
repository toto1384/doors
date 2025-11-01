
import { createFileRoute } from "@tanstack/react-router"
import LoginPage from "../../../components/login-01"
import RegisterPage from "../../../components/register-01"

export const Route = createFileRoute('/auth/$path/')({
    component: AuthPage,
})

export function AuthPage() {
    const { path } = Route.useParams()

    // throw new Error('Not implemented')
    if (path === 'sign-up') {
        return <RegisterPage />
    }

    return <LoginPage />
}

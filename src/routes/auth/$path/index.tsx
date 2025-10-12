
import { createFileRoute } from "@tanstack/react-router"
import LoginPage from "../../../components/login-01"
import RegisterPage from "../../../components/register-01"

export const Route = createFileRoute('/auth/$path/')({
    component: AuthPage,
})

function AuthPage() {
    const { path } = Route.useParams()

    if (path === 'sign-up') {
        return <RegisterPage />
    }

    return <LoginPage />
}

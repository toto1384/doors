import { createFileRoute } from "@tanstack/react-router"
import ResetPasswordPage from "../../../components/reset-password"

export const Route = createFileRoute('/auth/reset-password/')({
    component: () => {
        const { token } = Route.useSearch()
        return <ResetPasswordPage token={token} />
    },
    validateSearch: (search: Record<string, unknown>) => {
        return {
            token: search.token as string
        }
    }
})
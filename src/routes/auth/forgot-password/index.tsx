import ForgotPasswordPage from "@/components/pages/forgot-password"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute('/auth/forgot-password/')({
    component: ForgotPasswordPage,
})

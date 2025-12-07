import { createFileRoute } from "@tanstack/react-router";
import ForgotPasswordPage from "@/src/components/pages/forgot-password";

export const Route = createFileRoute("/auth/forgot-password/")({
	component: ForgotPasswordPage,
});

import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/src/components/pages/login-01";
import RegisterPage from "@/src/components/pages/register-01";

export const Route = createFileRoute("/auth/$path/")({
	component: AuthPage,
});

function AuthPage() {
	const { path } = Route.useParams();

	// throw new Error('Not implemented')
	if (path === "sign-up") {
		return <RegisterPage />;
	}

	return <LoginPage />;
}

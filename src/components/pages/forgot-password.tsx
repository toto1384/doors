import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/ui/button";
import { FloatingInput } from "@/src/components/ui/floating-input";
import { authClient } from "@/utils/auth-client";
import { Header } from "./landing/headerLanding";

type ForgotPasswordForm = {
	email: string;
};

export default function ForgotPasswordPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const { t } = useTranslation("translation", { keyPrefix: "forgot-password-page" });

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordForm>();

	const onSubmit = async (data: ForgotPasswordForm) => {
		setIsLoading(true);
		setError("");

		try {
			const result = await authClient.forgetPassword({
				email: data.email,
				redirectTo: "/auth/reset-password",
			});

			if (result.error) {
				setError(result.error.message || "Failed to send reset email");
			} else {
				setSuccess(true);
			}
		} catch (err) {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	if (success) {
		return (
			<div className="h-dvh overflow-hidden relative flex items-center justify-center px-4 pt-20 bg-[#120826]">
				<Header />
				<div
					className="absolute rounded-full blur-[100px] pointer-events-none -z10"
					style={{
						left: `30dvh`,
						bottom: `0px`,
						transform: "translate(-50%, -50%)",
					}}
				>
					<div
						className="w-[1000px] h-[300px] rotate-[-45deg]"
						style={{ background: "radial-gradient(circle, rgba(138, 64, 182, 0.3) 0%, transparent 90%)" }}
					></div>
				</div>
				<div
					className="absolute rounded-full blur-[100px] pointer-events-none -z10"
					style={{
						left: `80dvw`,
						bottom: `0px`,
						transform: "translate(-50%, -50%)",
					}}
				>
					<div
						className="w-[1000px] h-[300px] rotate-[45deg]"
						style={{ background: "radial-gradient(circle, rgba(138, 64, 182, 0.3) 0%, transparent 90%)" }}
					></div>
				</div>
				<div className="w-full max-w-md space-y-6">
					<div className="bg-[#0B0014] backdrop-blur-sm rounded-xl p-8">
						<div className="text-center">
							<h2 className="text-3xl text-white">{t("success.title")}</h2>
							<p className="mt-2 font-light mb-5 text-sm text-[#637381]">{t("success.subtitle")}</p>
							<Link
								to="/auth/$path"
								params={{ path: "sign-in" }}
								className="text-indigo-400 hover:text-indigo-300 underline"
							>
								{t("success.backToLogin")}
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-dvh overflow-hidden relative flex items-center justify-center px-4 pt-20 bg-[#120826]">
			<Header />
			<div
				className="absolute rounded-full blur-[100px] pointer-events-none -z10"
				style={{
					left: `30dvh`,
					bottom: `0px`,
					transform: "translate(-50%, -50%)",
				}}
			>
				<div
					className="w-[1000px] h-[300px] rotate-[-45deg]"
					style={{ background: "radial-gradient(circle, rgba(138, 64, 182, 0.3) 0%, transparent 90%)" }}
				></div>
			</div>
			<div
				className="absolute rounded-full blur-[100px] pointer-events-none -z10"
				style={{
					left: `80dvw`,
					bottom: `0px`,
					transform: "translate(-50%, -50%)",
				}}
			>
				<div
					className="w-[1000px] h-[300px] rotate-[45deg]"
					style={{ background: "radial-gradient(circle, rgba(138, 64, 182, 0.3) 0%, transparent 90%)" }}
				></div>
			</div>
			<div className="w-full max-w-md space-y-6">
				<div className="bg-[#0B0014] backdrop-blur-sm rounded-xl p-8">
					<div className="text-center">
						<h2 className="text-3xl text-white">{t("title")}</h2>
						<p className="mt-2 font-light mb-5 text-sm text-[#637381]">{t("subtitle")}</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						{error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">{error}</div>}

						<div>
							<FloatingInput
								id="email"
								type="email"
								label={t("form.email")}
								autoComplete="email"
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: "Invalid email address",
									},
								})}
							/>
							{errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
						</div>

						<Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t("form.sending")}
								</>
							) : (
								t("form.button")
							)}
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-sm text-gray-300">
							<Link
								to="/auth/$path"
								params={{ path: "sign-in" }}
								className="text-indigo-400 hover:text-indigo-300 underline"
							>
								{t("form.backToLogin")}
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

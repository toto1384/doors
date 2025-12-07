import { Link, useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { FloatingInput } from "@/src/components/ui/floating-input";
import { FloatingPasswordInput } from "@/src/components/ui/floating-password-input";
import { PhoneInput } from "@/src/components/ui/phone-input";
import { useTRPCClient } from "@/trpc/react";
import { authClient } from "@/utils/auth-client";
import { demoPropertyKey, propPreferencesKey } from "@/utils/constants";
import { Header } from "./landing/headerLanding";

type RegisterForm = {
	name: string;
	email: string;
	phoneNumber: string;
	password: string;
	confirmPassword: string;
};

export default function RegisterPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const { t } = useTranslation("translation", { keyPrefix: "register-page" });

	const trpcClient = useTRPCClient();

	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm<RegisterForm>();

	const password = watch("password");

	const onSubmit = async (data: RegisterForm) => {
		setIsLoading(true);
		setError("");

		const preferences = JSON.parse(localStorage.getItem(propPreferencesKey) ?? "{}");
		const demoProperty = JSON.parse(localStorage.getItem(demoPropertyKey) ?? "{}");

		console.log("demoProperty", demoProperty);
		console.log("preferences", preferences);

		try {
			const result = await authClient.signUp.email({
				email: data.email,
				password: data.password,
				name: data.name,
				phoneNumber: data.phoneNumber,
			} as any);

			if (result.error) {
				setError(result.error.message || "Registration failed");
			} else {
				if (preferences.propertyType) {
					const res = await trpcClient.auth.updateUserPreferences.mutate(preferences);
					console.log("resUpdatePreferences", res);
					if (!res.success) toast.error("Failed to update preferences");
					localStorage.removeItem(propPreferencesKey);
				}

				if (demoProperty.propertyType) {
					const res = await trpcClient.properties.postProperty.mutate({ property: demoProperty as any });
					console.log("resPostDemoProperty", res);
					localStorage.removeItem(demoPropertyKey);
					if (!res.success) toast.error("Failed to post demo property");
					router.navigate({ to: "/app/my-properties" });
				} else router.navigate({ to: "/app" });
			}
		} catch (err) {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignUp = async () => {
		setIsLoading(true);
		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/app",
			});
		} catch (err) {
			setError("Google sign up failed");
			setIsLoading(false);
		}
	};

	return (
		<div className="h-dvh overflow-hidden relative flex items-center justify-center px-4 pt-20 bg-gradient-to-b from-[#211021] to-50% md:from-[#120826] to-[#0B0014] md:to-[#120826] ">
			<Header />
			<div
				className="absolute hidden md:block rounded-full blur-[100px] pointer-events-none"
				style={{ left: `30dvh`, bottom: `0px`, transform: "translate(-50%, -50%)" }}
			>
				<div
					className="w-[1000px] h-[300px] rotate-[-45deg]"
					style={{ background: "radial-gradient(circle, rgba(138, 64, 182, 0.3) 0%, transparent 90%)" }}
				>
					{" "}
				</div>
			</div>
			<div
				className="absolute hidden md:block rounded-full blur-[100px] pointer-events-none"
				style={{ left: `80dvw`, bottom: `0px`, transform: "translate(-50%, -50%)" }}
			>
				<div
					className="w-[1000px] h-[300px] rotate-[45deg]"
					style={{ background: "radial-gradient(circle, rgba(138, 64, 182, 0.3) 0%, transparent 90%)" }}
				>
					{" "}
				</div>
			</div>

			<div className="w-full max-w-lg space-y-6">
				<div className="md:bg-[#0B0014] md:backdrop-blur-sm rounded-xl md:p-8 ">
					<div className="text-center">
						<h2 className="text-3xl text-white">{t("title")}</h2>
						<p className="mt-2 font-light mb-5 text-sm text-[#637381]">{t("subtitle")}</p>
					</div>
					{/* Google Sign Up Button */}
					<Button
						onClick={handleGoogleSignUp}
						disabled={isLoading}
						className="w-full mb-2 bg-[#241540] py-[22px] hover:bg-indigo-900/70 cursor-pointer text-white "
					>
						{isLoading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<img src="/icons/google_icon.svg" className="w-4 h-4" />
						)}
						{t("form.continueWithGoogle")}
					</Button>

					{/* Divider */}
					<div className="relative my-6 flex flex-row items-center">
						<span className="w-full bg-gradient-to-r from-transparent to-white/50 h-1 rounded-full" />
						<div className="relative flex justify-center text-sm ">
							<span className="px-2 text-[#919EAB]">{t("form.or")}</span>
						</div>
						<span className="w-full bg-gradient-to-r from-white/50 to-transparent h-1 rounded-full" />
					</div>

					{/* Registration Form */}
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						{error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">{error}</div>}

						<div>
							<FloatingInput
								id="name"
								type="text"
								label={t("form.fullName")}
								autoComplete="name"
								{...register("name", {
									required: "Name is required",
									minLength: {
										value: 2,
										message: "Name must be at least 2 characters",
									},
								})}
							/>
							{errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
						</div>

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

						<div>
							<div className="group relative w-full">
								<Controller
									name="phoneNumber"
									control={control}
									rules={{
										required: "Phone number is required",
									}}
									render={({ field }) => <PhoneInput {...field} defaultCountry="RO" className="peer" />}
								/>
								<label className="text-sm text-[#637381] absolute top-4 left-4 origin-[0] -translate-y-2 scale-75 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75">
									{t("form.phoneNumber")}
								</label>
							</div>
							{errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber.message}</p>}
						</div>

						<div>
							<FloatingPasswordInput
								id="password"
								label={t("form.password")}
								autoComplete="new-password"
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 8,
										message: "Password must be at least 8 characters",
									},
									pattern: {
										value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
										message:
											"Password must contain at least one uppercase letter, one lowercase letter, and one number",
									},
								})}
							/>
							{errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
						</div>

						<div>
							<FloatingPasswordInput
								id="confirmPassword"
								label={t("form.confirmPassword")}
								autoComplete="new-password"
								{...register("confirmPassword", {
									required: "Please confirm your password",
									validate: (value) => value === password || "Passwords do not match",
								})}
							/>
							{errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
						</div>

						<Button
							type="submit"
							className="w-full py-6 text-[15px] hover:bg-indigo-700/20 cursor-pointer bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] text-white"
							disabled={isLoading}
						>
							{isLoading ? "..." : t("form.button")}
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-sm text-gray-300">
							{t("form.haveAccount")}{" "}
							<Link
								to="/auth/$path"
								params={{ path: "sign-in" }}
								className="text-[#8A4FFF] hover:text-indigo-300 underline"
							>
								{t("form.signIn")}
							</Link>
						</p>
					</div>
					<div className="mt-4 text-center">
						<p className="text-xs text-gray-400 flex items-center justify-center">
							<svg
								width="25"
								height="24"
								viewBox="0 0 25 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="mr-2"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M13.016 2.16995C12.8767 2.03786 12.692 1.96423 12.5 1.96423C12.308 1.96423 12.1233 2.03786 11.984 2.16995C9.86128 4.18583 7.03413 5.29128 4.10701 5.24995C3.94754 5.24788 3.79157 5.29669 3.66173 5.3893C3.5319 5.48191 3.43496 5.6135 3.38501 5.76495C2.96298 7.05111 2.74862 8.39632 2.75001 9.74995C2.75001 15.6919 6.81401 20.6829 12.313 22.0979C12.4357 22.1296 12.5643 22.1296 12.687 22.0979C18.186 20.6829 22.25 15.6919 22.25 9.74995C22.25 8.35995 22.027 7.01995 21.615 5.76495C21.5652 5.61331 21.4684 5.48151 21.3385 5.38871C21.2087 5.2959 21.0526 5.24695 20.893 5.24895L20.75 5.24995C17.754 5.24995 15.033 4.07995 13.016 2.16995ZM16.11 10.186C16.17 10.106 16.2134 10.0149 16.2377 9.9179C16.262 9.82093 16.2666 9.72009 16.2514 9.6213C16.2361 9.52252 16.2013 9.42777 16.1489 9.34265C16.0965 9.25752 16.0276 9.18373 15.9463 9.1256C15.8649 9.06748 15.7728 9.02619 15.6753 9.00418C15.5778 8.98217 15.4769 8.97987 15.3785 8.99741C15.2801 9.01496 15.1862 9.052 15.1023 9.10636C15.0184 9.16072 14.9462 9.2313 14.89 9.31395L11.654 13.844L10.03 12.22C9.88783 12.0875 9.69979 12.0153 9.50548 12.0188C9.31118 12.0222 9.1258 12.1009 8.98839 12.2383C8.85097 12.3757 8.77226 12.5611 8.76883 12.7554C8.7654 12.9497 8.83753 13.1378 8.97001 13.28L11.22 15.53C11.297 15.6069 11.3898 15.6661 11.492 15.7036C11.5942 15.7411 11.7033 15.7558 11.8118 15.7469C11.9202 15.7379 12.0255 15.7055 12.1201 15.6518C12.2148 15.5981 12.2967 15.5245 12.36 15.436L16.11 10.186Z"
									fill="#919EAB"
								/>
							</svg>
							{t("form.dataProtection")}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { authClient, useSignOutFunction } from "utils/auth-client";
import { useShallow } from "zustand/react/shallow";
import { usePopoversOpenStore } from "@/routes/__root";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { UserTypeSwitch } from "./userAndAi/userTypeSwitch";

const ProfileContent = ({ session }: { session: any }) => {
	const { t } = useTranslation("translation", { keyPrefix: "app-wrapper" });

	const signOut = useSignOutFunction();

	const { setProfileMenuOpen, userType } = usePopoversOpenStore(
		useShallow((state) => ({
			setProfileMenuOpen: state.setMenuOpen,
			userType: state.userType,
		})),
	);

	return (
		<>
			{/* User Profile Section */}
			<div className="pb-6 text-center">
				<div className="relative inline-block mb-2">
					<Avatar className="h-[85px] w-[85px] flex items-center justify-center mx-auto bg-gray-300 rounded-full">
						<AvatarImage
							src={session.user?.image || ""}
							alt={session.user?.name || ""}
							className="rounded-full aspect-square object-cover"
						/>
						<AvatarFallback className="text-gray-600 text-xl font-semibold">
							{session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
						</AvatarFallback>
					</Avatar>
					{/* <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center"> */}
					{/*     <Edit className="w-3 h-3 text-white" /> */}
					{/* </div> */}
				</div>
				<h3 className="text-xl font-semibold text-white mb-4">{session.user?.name || session.user?.email || "User"}</h3>

				<div className="flex flex-row items-center justify-center">
					<UserTypeSwitch />
				</div>
			</div>

			{[
				...(userType === "buyer"
					? [
							{ name: t("viewProfile"), href: "/app/profile" },
							{ name: t("myAppointments"), href: "/app/appointments" },
							{ name: t("billing"), href: "/app/billing" },
						]
					: [
							{ name: t("myProperties"), href: "/app/my-properties" },
							{ name: t("manageBookings"), href: "/app/my-properties/bookings" },
						]),
				{ name: t("accountSettings"), href: "/app/profile/settings" },
				{ divider: true },
				{ name: t("helpCenter"), href: "/app/profile/help" },
				{ name: t("termsConditions"), href: "/terms-of-service" },
				{ name: t("privacyPolicy"), href: "/privacy-policy" },
				{ divider: true },
			].map((item, index) =>
				item.divider ? (
					<div key={index} className="h-px bg-[#637381]/20 hidden md:block mx-5 my-2" />
				) : (
					<Link
						key={index}
						onClick={() => setProfileMenuOpen(false)}
						to={item.href}
						className="px-4 md:px-6 py-4 my-1.5 md:my-0 md:py-2 rounded-lg bg-[#241540] md:bg-transparent text-white hover:bg-purple-800/50 flex flex-row items-center justify-between"
					>
						{item.name}
						<ChevronRight className="w-4 h-4 md:hidden" />
					</Link>
				),
			)}

			{/* Logout Button */}
			<div className="md:px-6 py-4">
				<button
					onClick={() => signOut()}
					className="w-full bg-[#1C252E] hover:bg-gray-700 text-white flex items-center justify-between h-auto gap-2 py-4 px-5 rounded-lg font-medium"
				>
					{t("logout")}
					<LogOut className="w-4 h-4 " />
				</button>
			</div>
		</>
	);
};

export function ProfileDropdown() {
	const { t } = useTranslation("translation", { keyPrefix: "app-wrapper" });

	const { data: session, isPending } = authClient.useSession();

	const { profileMenuOpen, setProfileMenuOpen } = usePopoversOpenStore(
		useShallow((state) => ({
			profileMenuOpen: state.menuOpen,
			setProfileMenuOpen: state.setMenuOpen,
		})),
	);

	return (
		<>
			{/* Desktop Dropdown */}
			<div className="hidden md:block">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Avatar className="h-8 w-8 rounded-full flex items-center justify-center">
							<AvatarImage
								className="rounded-full aspect-square object-cover"
								src={session?.user?.image || ""}
								alt={session?.user?.name || ""}
							/>
							<AvatarFallback className="rounded-full bg-[#130826] border text-base/1 w-8 h-8 flex flex-col items-center justify-center">
								{session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-72 bg-[#1A0F33] text-white flex flex-col" align="end" forceMount>
						{session && <ProfileContent session={session} />}
						{isPending && (
							<div className="text-center h-full py-8">
								<p className="text-gray-400">{t("loading")}</p>
							</div>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Mobile Button */}
			<div className="md:hidden">
				<Avatar onClick={() => setProfileMenuOpen(true)} className="h-8 w-8 flex items-center justify-center">
					<AvatarImage
						className="rounded-full aspect-square object-cover"
						src={session?.user?.image || ""}
						alt={session?.user?.name || ""}
					/>
					<AvatarFallback className="rounded-full">
						{session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
					</AvatarFallback>
				</Avatar>
			</div>

			{/* Mobile Fullscreen Overlay */}
			{profileMenuOpen && (
				<div className="md:hidden fixed top-16 bottom-20 left-0 right-0 mx-3 rounded-lg z-50 bg-[#1A0F33] text-white">
					<div className="flex flex-col h-full mx-5">
						{/* Header with close button */}
						<div className="p-4 -ml-4" onClick={() => setProfileMenuOpen(false)}>
							<ArrowLeft className="h-6 w-6 cursor-pointer " />
						</div>
						{/* Content */}
						<div className="flex-1 overflow-y-auto -mt-4 flex flex-col">
							{isPending && (
								<div className="text-center h-full py-8">
									<p className="text-gray-400">{t("loading")}</p>
								</div>
							)}
							{session && <ProfileContent session={session} />}
						</div>
					</div>
				</div>
			)}
		</>
	);
}

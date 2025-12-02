import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { CalendarIcon } from "lucide-react";
import { posthog } from "posthog-js";
import { createContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTRPCClient } from "trpc/react";
import { auth } from "utils/auth";
import { authClient } from "utils/auth-client";
import { UserType } from "utils/constants";
import { NotificationObject, UserObject } from "utils/validation/types";
import { useShallow } from "zustand/react/shallow";
import { usePopoversOpenStore } from "@/routes/__root";
import { HeartIcon, HomeIcon, NotificationsOutlineIcon, TokensOutlineIcon } from "./icons/homeIcons";
import { NotificationsDropdown } from "./notifications-dropdown";
import { ProfileDropdown } from "./profile-dropdown";
import { useTheme } from "./providers/ThemeProvider";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ElevenLabsChatBotDemo } from "./userAndAi/aiChatbot";

export const NotificationsContext = createContext<NotificationObject[]>([]);

export default function AppRouteWrapper({
	children,
	token,
}: Readonly<{
	children: React.ReactNode;
	token: string;
}>) {
	const { theme } = useTheme();
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const { t } = useTranslation("translation", { keyPrefix: "app-wrapper" });

	const { aiChatbotOpen, setAiChatbotOpen, userType, setUserType } = usePopoversOpenStore(
		useShallow((state) => ({
			aiChatbotOpen: state.aiChatbotOpen,
			setAiChatbotOpen: state.setAiChatbotOpen,
			userType: state.userType,
			setUserType: state.setUserType,
		})),
	);

	const trpcClient = useTRPCClient();
	const notificationsData = useQuery({
		queryKey: ["notifications"],
		refetchInterval: 30000, // Poll every 30s
		queryFn: () => trpcClient.notifications.get.query(),
	});

	console.log("session", session);

	useEffect(() => {
		if (!isPending && !session) {
			router.navigate({ to: "/auth/$path", params: { path: "sign-in" } });
		}
		if (session?.user) setUserType(session.user.userType as (typeof UserType)[number]);
	}, [session, isPending, router]);

	if (isPending) {
		return <div>{t("loading")}</div>;
	}

	if (!session) {
		return <></>;
	}

	return (
		<NotificationsContext.Provider value={notificationsData.data?.notifications || []}>
			<div className="flex flex-col h-dvh overflow-clip relative max-w-[1900px] mx-auto">
				<div
					className="absolute w-[1000px] h-[1000px] rounded-full blur-[100px] pointer-events-none -z10"
					style={{
						left: `50%`,
						top: `30%`,
						background: "radial-gradient(circle, rgba(138, 64, 182, 0.25) 0%, transparent 70%)",
						transform: "translate(-50%, -50%)",
					}}
				/>

				<div className="flex flex-row w-full justify-between px-4 md:py-2 items-center relative">
					<Link to="/app">
						{theme === "dark" ? (
							<img src={"/doors-logo.png"} className="w-[120px] h-[60px] object-cover object-center" />
						) : (
							<img src={"/doors-logo-dark.png"} className="w-[120px] h-[60px] object-cover object-center" />
						)}
					</Link>
					<div className="flex flex-row items-center mr-3 gap-3">
						<NotificationsDropdown className="hidden md:block" />
						{/* <Link to={'/app/billing'} className="md:flex flex-row gap-1 items-center hidden"> */}
						{/*     <img src={'/icons/credits.svg'} className="w-[18px] h-[18px] invert-[85] dark:invert-0" /> */}
						{/*     <span className="text-xs font-light"> 5009 </span> */}
						{/* </Link> */}
						<ProfileDropdown />
					</div>
				</div>
				<div className="flex flex-row items-stretch grow-1 flex-1 min-h-0 relative">
					<div
						className={` ${!aiChatbotOpen ? "hidden" : "flex "} absolute top-0 bottom-20 z-30 mx-3 md:mx-0 md:z-auto w-[calc(100%-24px)] md:relative md:flex flex-col border rounded-lg dark:border-[#1C252E] md:w-[30vw] md:ml-2 mb-2 bg-gray-100 dark:bg-[#120826] `}
					>
						<ElevenLabsChatBotDemo user={session.user as any as UserObject} conversationToken={token} />
					</div>
					<div className="flex flex-col w-full max-h-full overflow-y-auto">
						<div className="pb-28 md:pb-0">{children}</div>
					</div>

					<div className="flex items-end justify-stretch md:hidden bg-[#1A0F33]/39 backdrop-blur-xl w-full h-20 fixed bottom-0 left-0 right-0 z-50">
						{[
							{
								name: "Home",
								icon: (selected: boolean) => <HomeIcon color={selected ? "#8A4FFF" : "#919EAB"} />,
								link: "/app",
							},
							{
								name: "Notifications",
								icon: (selected: boolean) => (
									<div className="relative">
										<NotificationsOutlineIcon color={selected ? "#8A4FFF" : "#919EAB"} />
										{(notificationsData.data?.notifications?.filter((i) => !i.read).length ?? 0) > 0 && (
											<Badge variant="destructive" className="absolute -top-1 -right-1 w-2 h-2 p-0 text-xs" />
										)}
									</div>
								),
								link: "/app/notifications",
							},
						].map((item, index) => (
							<NavBarItem key={index} {...item} />
						))}

						<div
							className="pb-5 flex-1 mx-5 flex flex-col items-center"
							onClick={() => setAiChatbotOpen(!aiChatbotOpen)}
						>
							<img
								src={"/icons/aiChatbot.png"}
								className="w-[90px] h-[90px] absolute left-0 right-0 bottom-7 mx-auto object-contain object-bottom"
							/>
							<span className="mx-auto text-[9px]">Chat</span>
						</div>

						{[
							...(userType === "buyer"
								? [
										{
											name: t("myAppointments"),
											icon: (selected: boolean) => (
												<CalendarIcon strokeWidth={1.5} className="w-5 h-5" color={selected ? "#8A4FFF" : "#919EAB"} />
											),
											link: "/app/appointments",
										},
									]
								: [
										{
											name: t("manageBookings"),
											icon: (selected: boolean) => (
												<CalendarIcon strokeWidth={1.5} className="w-5 h-5" color={selected ? "#8A4FFF" : "#919EAB"} />
											),
											link: "/app/my-properties/bookings",
										},
									]),
							{
								name: "Favorites",
								icon: (selected: boolean) => <HeartIcon color={selected ? "#8A4FFF" : "#919EAB"} />,
								link: "/app/favorites",
							},
						].map((item, index) => (
							<NavBarItem key={index} {...item} />
						))}
					</div>
				</div>
			</div>
		</NotificationsContext.Provider>
	);
}

function NavBarItem({
	name,
	icon,
	link,
}: {
	name: string;
	icon: (selected: boolean) => React.ReactNode;
	link: string;
}) {
	const selected = useRouter().matchRoute({ to: link });

	return (
		<Link
			to={link}
			className="flex flex-1 flex-col items-center gap-1 rounded-full pb-5 hover:bg-[#1A0F33]/10 line-clamp-1 hover:text-white"
		>
			{icon(!!selected)}
			<span
				className={`text-[9px] ${selected ? "text-[#8A4FFF]" : "text-[#919EAB]"} text-center line-clamp-1 font-medium`}
			>
				{name}
			</span>
		</Link>
	);
}

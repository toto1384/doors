import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
import { Calendar, Eye, Heart, LogOut } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import z from "zod/v3";
import { PropertyCard } from "@/src/components/basics/propertyCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { ChangeProfilePictureImageButton } from "@/src/components/ui/imageUploaders";
import { UserTypeSwitch } from "@/src/components/userAndAi/userTypeSwitch";
import { auth } from "@/utils/auth";
import { authClient, useSignOutFunction } from "@/utils/auth-client";
import dbConnect from "@/utils/db/mongodb";
import { getPropertyModel } from "@/utils/validation/mongooseModels";
import { PropertyObject } from "@/utils/validation/types";

const getFavouritesProperties = createServerFn()
	.validator((params) => z.object({ skip: z.number().optional() }).parse(params))
	.handler(async ({ data }) => {
		const headers = getHeaders();

		const h = new Headers();
		Object.entries(headers)
			.filter((r) => r[1])
			.map((r) => h.append(r[0], r[1]!));

		const sessionData = await auth.api.getSession({ headers: h });

		if (!sessionData?.user) return { favouriteProperties: [], count: 0 };

		const favourites = sessionData.user.favoriteProperties;

		const db = await dbConnect();
		const PropertyModel = getPropertyModel(db);

		const properties = (await PropertyModel.find({
			_id: { $in: favourites },
		})
			.skip(data.skip ?? 0)
			.limit(6)
			.lean()) as PropertyObject[];

		return { favouriteProperties: properties, count: favourites.length };
	});

export const Route = createFileRoute("/app/profile/")({
	component: ProfileView,
	loader: async (ctx) => {
		return await getFavouritesProperties({ data: {} });
	},
});

function ProfileView() {
	const { t } = useTranslation("translation", { keyPrefix: "profile-page.view" });
	const { t: tCommon } = useTranslation("translation", { keyPrefix: "app-wrapper" });
	const { data: session } = authClient.useSession();
	const [isSeller, setIsSeller] = useState(false);

	const { favouriteProperties: initialFavouriteProperties, count } = Route.useLoaderData();

	const [favouriteProperties, setFavouriteProperties] = useState<PropertyObject[]>(initialFavouriteProperties);

	const getFavouritePropertiesSF = useServerFn(getFavouritesProperties);

	const signOut = useSignOutFunction();

	// Mock data for the stats
	const stats = {
		savedProperties: { count: 12, change: `+3 ${t("thisWeek")}` },
		offersMade: { count: 5, change: `2 ${t("pending")}` },
		viewingsScheduled: { count: 3, change: t("nextTomorrow") },
	};

	return (
		<div className="md:mx-5 border border-[#1C252E] rounded-xl min-h-screen text-white">
			{/* Profile Header */}
			<div className="flex items-center justify-between mb-8 md:border-b rounded-b-lg">
				{session && (
					<div className="flex p-6 flex-row items-center ">
						<div className="relative inline-block ">
							<Avatar className="h-[75px] w-[75px] flex items-center justify-center mx-auto bg-gray-300 rounded-full">
								<AvatarImage
									src={session.user?.image || ""}
									alt={session.user?.name || ""}
									className="rounded-full aspect-square object-cover"
								/>
								<AvatarFallback className="text-gray-600 text-xl font-semibold">
									{session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
								</AvatarFallback>
							</Avatar>
							<div className="absolute -bottom-1 -right-1 w-6 h-6  flex items-center justify-center">
								<ChangeProfilePictureImageButton />
							</div>
						</div>
						<div className="flex flex-col gap-2 mx-3">
							<h3 className="text-xl text-white">
								{session.user?.name || session.user?.email || "User"}
								{session.user?.name ? (
									<div className="text-[#637381] text-xs mt-1 font-normal">{session.user?.email}</div>
								) : (
									<></>
								)}
							</h3>

							<UserTypeSwitch extraPadding />
						</div>
					</div>
				)}

				<div className="flex flex-col gap-3 mx-3">
					<Link to="/app/profile/settings">
						<button className="border cursor-pointer text-sm px-3 rounded-[6px] py-2 border-[#C1A7FF] text-[#C1A7FF] hover:bg-[#637381]/10">
							{t("accountSettings")}
						</button>
					</Link>
					<button
						onClick={() => signOut()}
						className="bg-[#1C252E] cursor-pointer hover:bg-gray-700 text-white flex text-sm items-center gap-2 px-3 py-2 rounded-[6px] justify-center"
					>
						{tCommon("logout")}
						<LogOut className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Quick Overview Section */}
			<div className="mb-8 px-6">
				<h2 className="text-base font-light text-white mb-3">{t("quickOverview")}</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Saved Properties */}
					<div className="bg-[#2B1C37]/20 rounded-lg p-4">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-[#919EAB] font-light text-sm">{t("savedProperties")}</h3>
							<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M1.4875 9.38755L7.13438 14.6594C7.36875 14.8782 7.67812 15 8 15C8.32187 15 8.63125 14.8782 8.86563 14.6594L14.5125 9.38755C15.4625 8.50317 16 7.26255 16 5.96567V5.78442C16 3.60005 14.4219 1.73755 12.2688 1.37817C10.8438 1.14067 9.39375 1.6063 8.375 2.62505L8 3.00005L7.625 2.62505C6.60625 1.6063 5.15625 1.14067 3.73125 1.37817C1.57812 1.73755 0 3.60005 0 5.78442V5.96567C0 7.26255 0.5375 8.50317 1.4875 9.38755Z"
									fill="#919EAB"
								/>
							</svg>
						</div>
						<div className="text-xl text-white mb-2">{count}</div>
						{/* <div className="text-[10px] text-[#454F5B]">{stats.savedProperties.change}</div> */}
					</div>

					{/* Offers Made */}
					<div className="bg-[#2B1C37]/20 rounded-lg p-4">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-[#919EAB] font-light text-sm">{t("offersMade")}</h3>
							<svg width="17" height="14" viewBox="0 0 21 12" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M10.4402 0.6625L7.41523 3.1125C6.91211 3.51875 6.81523 4.25 7.19648 4.77187C7.59961 5.32812 8.38398 5.4375 8.92461 5.01562L12.0277 2.60313C12.2465 2.43438 12.559 2.47188 12.7309 2.69063C12.9027 2.90938 12.8621 3.22188 12.6434 3.39375L11.9902 3.9L16.334 7.9V2H16.3121L16.1902 1.92188L13.9215 0.46875C13.4434 0.1625 12.884 0 12.3152 0C11.634 0 10.9715 0.234375 10.4402 0.6625ZM11.1527 4.55L9.53711 5.80625C8.55273 6.575 7.12461 6.375 6.38711 5.3625C5.69336 4.40938 5.86836 3.07812 6.78398 2.3375L9.38398 0.234375C9.02148 0.08125 8.63086 0.00312495 8.23398 0.00312495C7.64648 -4.77303e-08 7.07461 0.175 6.58398 0.5L4.33398 2V9H5.21523L8.07148 11.6062C8.68398 12.1656 9.63086 12.1219 10.1902 11.5094C10.3621 11.3187 10.4777 11.0969 10.5371 10.8656L11.0684 11.3531C11.6777 11.9125 12.6277 11.8719 13.1871 11.2625C13.3277 11.1094 13.4309 10.9312 13.4965 10.7469C14.1027 11.1531 14.9277 11.0687 15.4371 10.5125C15.9965 9.90312 15.9559 8.95312 15.3465 8.39375L11.1527 4.55ZM0.833984 2C0.558984 2 0.333984 2.225 0.333984 2.5V9C0.333984 9.55313 0.780859 10 1.33398 10H2.33398C2.88711 10 3.33398 9.55313 3.33398 9V2H0.833984ZM1.83398 8C1.96659 8 2.09377 8.05268 2.18754 8.14645C2.28131 8.24021 2.33398 8.36739 2.33398 8.5C2.33398 8.63261 2.28131 8.75979 2.18754 8.85355C2.09377 8.94732 1.96659 9 1.83398 9C1.70138 9 1.5742 8.94732 1.48043 8.85355C1.38666 8.75979 1.33398 8.63261 1.33398 8.5C1.33398 8.36739 1.38666 8.24021 1.48043 8.14645C1.5742 8.05268 1.70138 8 1.83398 8ZM17.334 2V9C17.334 9.55313 17.7809 10 18.334 10H19.334C19.8871 10 20.334 9.55313 20.334 9V2.5C20.334 2.225 20.109 2 19.834 2H17.334ZM18.334 8.5C18.334 8.36739 18.3867 8.24021 18.4804 8.14645C18.5742 8.05268 18.7014 8 18.834 8C18.9666 8 19.0938 8.05268 19.1875 8.14645C19.2813 8.24021 19.334 8.36739 19.334 8.5C19.334 8.63261 19.2813 8.75979 19.1875 8.85355C19.0938 8.94732 18.9666 9 18.834 9C18.7014 9 18.5742 8.94732 18.4804 8.85355C18.3867 8.75979 18.334 8.63261 18.334 8.5Z"
									fill="#919EAB"
								/>
							</svg>
						</div>
						<div className="text-xl text-white mb-2">{stats.offersMade.count}</div>
						<div className="text-[10px] text-[#454F5B]">{stats.offersMade.change}</div>
					</div>

					{/* Viewings Scheduled */}
					<div className="bg-[#2B1C37]/20 rounded-lg p-4">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-[#919EAB] font-light text-sm">{t("viewingsScheduled")}</h3>
							<svg width="14" height="14" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M3.66602 1V2H2.16602C1.33789 2 0.666016 2.67188 0.666016 3.5V5H14.666V3.5C14.666 2.67188 13.9941 2 13.166 2H11.666V1C11.666 0.446875 11.2191 0 10.666 0C10.1129 0 9.66602 0.446875 9.66602 1V2H5.66602V1C5.66602 0.446875 5.21914 0 4.66602 0C4.11289 0 3.66602 0.446875 3.66602 1ZM14.666 6H0.666016V14.5C0.666016 15.3281 1.33789 16 2.16602 16H13.166C13.9941 16 14.666 15.3281 14.666 14.5V6Z"
									fill="#919EAB"
								/>
							</svg>
						</div>
						<div className="text-xl text-white mb-2">{stats.viewingsScheduled.count}</div>
						<div className="text-[10px] text-[#454F5B]">{stats.viewingsScheduled.change}</div>
					</div>
				</div>
			</div>

			{/* Favorite Properties Section */}
			<h2 className="text-base font-light text-white px-6 mb-6">{t("favoriteProperties")}</h2>
			<div className="space-y-4 px-6 grid grid-cols-2 md:grid-cols-3 gap-6">
				{favouriteProperties.map((property) => (
					<PropertyCard match={"hide"} key={property._id} property={property} />
				))}
				{!favouriteProperties.length && (
					<div className="text-center col-span-2 md:col-span-3 h-full py-8 flex flex-col gap-2 md:flex-row items-center justify-center">
						<img src="/icons/emptyIllustration.svg" className="w-30 h-30 object-cover" />
						<p className="text-gray-400">No properties found matching your criteria.</p>
					</div>
				)}
				{favouriteProperties.length < count && (
					<button
						className="bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] cursor-pointer hover:bg-[#6A2BC4] cols-span-2 md:col-span-3 mb-3 w-fit mx-auto px-4 py-2 text-white text-sm rounded-[6px] flex items-center justify-center gap-2"
						onClick={async () => {
							const newFavourites = await getFavouritePropertiesSF({ data: { skip: favouriteProperties.length } });
							console.log("newFavourites", newFavourites.favouriteProperties);
							setFavouriteProperties((prev) => [...prev, ...newFavourites.favouriteProperties]);
						}}
					>
						Load more
					</button>
				)}
			</div>
		</div>
	);
}

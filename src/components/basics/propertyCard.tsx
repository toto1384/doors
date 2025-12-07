import { Link, useNavigate } from "@tanstack/react-router";
import { ReactNode } from "react";
import { PropertyObject } from "@/utils/validation/types";
import { BathIcon, BedIcon, LocationIcon, SurfaceAreaIcon } from "../icons/propertyIcons";
import { AspectRatio } from "../ui/aspect-ratio";
import { ImageFallback } from "./imageFallback";

export const PropertyCard = ({
	property,
	match,
	matchRight,
	moreComponent,
	disableLink,
	demoVersion,
}: {
	property: PropertyObject;
	match?: number | "hide" | string;
	matchRight?: boolean;
	moreComponent?: ReactNode;
	disableLink?: boolean;
	demoVersion?: boolean;
}) => {
	const navigate = useNavigate();

	const propertyContent = (
		<>
			<div className=" max-h-42 flex items-center justify-center">
				<AspectRatio ratio={16 / 9}>
					<ImageFallback
						src={property.imageUrls[0] ?? "/icons/homeIcon.svg"}
						className={`max-h-42 w-full rounded-[6px] h-full object-cover`}
					/>
				</AspectRatio>
			</div>

			{match && match !== "hide" && (
				<div
					className={`flex items-center absolute ${matchRight ? "right-3 md:right-5" : "left-3 md:left-5"} top-3 md:top-5  justify-between mb-2`}
				>
					<span className="bg-[#623398] text-white flex flex-row font-light items-center text-[9px] px-2 py-1 rounded">
						{typeof match === "string" ? (
							match
						) : (
							<>
								<img src="/icons/checkIcon.svg" className="w-2 h-2 mr-1" />
								{match.toFixed(2)}% Match
							</>
						)}
					</span>
				</div>
			)}

			<div className="flex flex-row justify-between">
				<div className="flex flex-col">
					<div className={`flex items-center gap-1 mt-2 ${demoVersion ? "text-[8px]" : `text-[10px]`} text-[#a3a3a3]`}>
						{[
							...(property.numberOfRooms
								? [
										{
											icon: <BedIcon className={demoVersion ? "w-2 h-2" : "w-3 h-3"} color="#ffffff" />,
											text: `${property.numberOfRooms}`,
										},
									]
								: []),
							...(property.numberOfBathrooms
								? [
										{
											icon: <BathIcon className={demoVersion ? "w-2 h-2" : "w-3 h-3"} color="#ffffff" />,
											text: `${property.numberOfBathrooms}`,
										},
									]
								: []),
							...(property.surfaceArea
								? [
										{
											icon: <SurfaceAreaIcon className={demoVersion ? "w-2 h-2" : "w-3 h-3"} color="#ffffff" />,
											text: `${property.surfaceArea}m²`,
										},
									]
								: []),
							// { icon: "/icons/locationIcon.svg", text: `${property.location.city}` },
						].map((i) => (
							<span className="flex flex-row items-center gap-1 rounded bg-[#32215A] px-2 py-0.5">
								{i.text}
								{i.icon}{" "}
							</span>
						))}
					</div>

					<p
						className={` ${demoVersion ? "text-[12px] mt-0.5" : "text-xs md:text-[22px] my-2"}  font-light text-white text-start`}
					>
						€{property.price.value.toLocaleString()}
					</p>
				</div>
				{moreComponent}
			</div>

			<h3
				className={` ${demoVersion ? "text-[13px]" : "text-sm md:text-lg md:mb-2"} ${demoVersion ? "line-clamp-2" : "line-clamp-3"} font-normal text-start `}
			>
				{property.title}
			</h3>

			<div
				className={`flex flex-row text-[#637381] ${demoVersion ? "text-[8px]" : "text-xs md:text-md md:mt-2"}  text-start items-center gap-1 `}
			>
				<LocationIcon color={"#637381"} className={`${demoVersion ? "w-2.5 h-2.5" : "w-4 h-4"}  mt-2 mb-2`} />
				{property.location.city}, {property.location.state}
			</div>
		</>
	);
	return disableLink ? (
		<div
			className="relative bg-[#f7f7f7] dark:bg-[#2B1C37]/50 p-1.5 md:p-3 rounded-[6px] overflow-hidden"
			onClick={() => {
				if (!demoVersion) navigate({ to: `/app/properties/${property._id}` });
				else navigate({ to: `/auth/$path`, params: { path: "sign-in" } });
			}}
			key={property._id}
		>
			{propertyContent}
		</div>
	) : (
		<Link
			to={demoVersion ? "/auth/$path" : `/app/properties/$id`}
			target={demoVersion ? "_blank" : ""}
			params={demoVersion ? { path: "sign-in" } : { id: property._id }}
			key={property._id}
			className={`relative bg-[#f7f7f7] dark:bg-[#2B1C37]/50 ${demoVersion ? "p-1" : "p-1.5 md:p-3"} rounded-[6px] overflow-hidden`}
		>
			{propertyContent}
		</Link>
	);
};

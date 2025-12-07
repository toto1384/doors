import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
import { ChevronDownIcon, X } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { LocationSelector } from "@/src/components/basics/locationSelector";
import { FacilitiesSelector } from "@/src/components/facilitiesSelector";
import { ChatIcon, FilterIcon, priceChartSvg } from "@/src/components/icons/propertyIcons";
import { PropertiesView } from "@/src/components/pages/propertiesView";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Input } from "@/src/components/ui/input";
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectItem,
	MultiSelectTrigger,
	MultiSelectValue,
} from "@/src/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Slider } from "@/src/components/ui/slider";
import { usePopoversOpenStore } from "@/src/routes/__root";
import { trpcRouter } from "@/trpc/router";
import { auth } from "@/utils/auth";
import { PropertyTypeType } from "@/utils/constants";
import { propertyFiltersSchema } from "@/utils/validation/propertyFilters.ts";
import { PropertyFilters } from "@/utils/validation/types";

export const getPropertiesWithFilters = createServerFn()
	.validator((d) => propertyFiltersSchema.parse(d))
	.handler(async ({ data: filters }) => {
		const headers = getHeaders();

		const h = new Headers();
		Object.entries(headers)
			.filter((r) => r[1])
			.map((r) => h.append(r[0], r[1]!));

		const sessionData = await auth.api.getSession({ headers: h });

		const caller = trpcRouter.createCaller({ headers: h, user: sessionData?.user });
		const res = await caller.properties.list({ props: filters, skip: 0 });
		return res;
	});

export const Route = createFileRoute("/app/properties/")({
	component: PropertiesRoute,
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({ deps: { search } }) => {
		// Load initial properties without filters
		const data = await getPropertiesWithFilters({ data: search });
		console.log("getPropertiesWithFilters", data.properties.length);
		return data;
	},
	validateSearch: propertyFiltersSchema,
});

function PropertiesRoute() {
	const propertiesReceived = Route.useLoaderData();

	const navigate = useNavigate();
	const searchParams = Route.useSearch();

	function handleFilterChange(newFilters: Partial<PropertyFilters>) {
		navigate({ to: "/app/properties", search: (prev) => ({ ...prev, ...newFilters }) });
	}

	const [showFilters, setShowFilters] = useState(false);

	const [budget, setBudget] = useState<Partial<PropertyFilters["budget"]>>(searchParams?.budget ?? {});
	const debouncedHandleFilterChange = useDebouncedCallback(async (value: Partial<PropertyFilters>) => {
		handleFilterChange(value);
	}, 300);

	const filterButton = (
		<button
			onClick={() => setShowFilters(!showFilters)}
			className="flex flex-row cursor-pointer touch-none select-none items-center gap-3 w-fit border rounded-[6px] border-[#C1A7FF] text-xs text-[#C1A7FF] px-3 py-2.5"
		>
			<FilterIcon className="w-3 h-3" />
			Filtreaza
		</button>
	);

	return (
		<div className="relative">
			<div className="flex md:hidden flex-row items-center justify-between mx-3 gap-2 mb-2">
				<Input placeholder="Search" className="w-full bg-transparent border py-[7px] h-auto" />
				{filterButton}
			</div>

			<div className="h-full border flex flex-col rounded-lg mx-3 ">
				<div className="flex flex-row items-center gap-3 px-2 md:px-6 py-2 border-b justify-between">
					<div className="flex flex-col gap-2 w-full pt-2 pb-2 md:pt-4 md:pb-5 ">
						<h1 className="text-xl font-light">Cele mai potrivite proprietăți pentru tine</h1>

						<p
							className={`max-w-2xl before:content-['•'] before:dark:text-[#737373] before:text-2xl/1 pl-5 before:absolute before:mt-1 before:left-0 relative  before:text-gray-500 text-xs dark:text-[#a3a3a3]`}
						>
							Am filtrat proprietățile în funcție de preferințele tale. Poți vedea aici cele care se potrivesc cel mai
							bine criteriilor setate.
						</p>
					</div>
					<div className="hidden md:block"> {filterButton}</div>
				</div>

				{/* Filters Section */}
				{showFilters && (
					<div className="md:flex hidden px-4 pt-4 flex-row items-start justify-between gap-3">
						<div className="flex flex-row gap-3 items-start">
							<PropertyTypeSelector
								propertyType={searchParams?.propertyType ?? []}
								handleChangePropertyType={(p) => handleFilterChange({ propertyType: p })}
							/>

							<Popover>
								<PopoverTrigger className="px-3 py-1.5 bg-input/30 text-black/50 dark:text-white hover:bg-input/50 dark:bg-[#241540] rounded flex flex-row items-center relative">
									Budget
									{!!(searchParams?.budget?.min || searchParams?.budget?.max) && (
										<span className="animate-pulse text-purple-700 mr-1.5 left-[0.5px] top-0 absolute">•</span>
									)}
									<ChevronDownIcon className="ml-3 size-4 shrink-0 opacity-50" />
								</PopoverTrigger>
								<PopoverContent>
									<label className="block text-sm font-medium mb-2">Budget Range</label>
									<div className="flex gap-2">
										<input
											type="number"
											placeholder="Min"
											value={searchParams.budget?.min || ""}
											className="bg-input/50 text-black/50 dark:text-white rounded px-3 py-2 w-24"
											onChange={(e) => {
												const min = e.target.value ? parseInt(e.target.value) : undefined;
												setBudget({ ...budget, min });
												debouncedHandleFilterChange({
													budget: { ...searchParams?.budget, min },
												});
											}}
										/>
										<input
											type="number"
											placeholder="Max"
											value={searchParams.budget?.max || ""}
											className="bg-input/50 text-black/50 dark:text-white rounded px-3 py-2 w-24"
											onChange={(e) => {
												const max = e.target.value ? parseInt(e.target.value) : undefined;
												setBudget({ ...budget, max });
												debouncedHandleFilterChange({
													budget: { ...searchParams?.budget, max },
												});
											}}
										/>
									</div>
								</PopoverContent>
							</Popover>

							<Popover>
								<PopoverTrigger className="px-3 py-1.5 bg-input/30 text-black/50 dark:text-white hover:bg-input/50 dark:bg-[#241540] rounded flex flex-row items-center relative">
									Surface Area
									{!!(searchParams?.surfaceArea?.min || searchParams?.surfaceArea?.max) && (
										<span className="animate-pulse text-purple-700 mr-1.5 left-[0.5px] top-0 absolute">•</span>
									)}
									<ChevronDownIcon className="ml-3 size-4 shrink-0 opacity-50" />
								</PopoverTrigger>
								<PopoverContent>
									<label className="block text-sm font-medium mb-2">Surface Area Range</label>
									<div className="flex gap-2">
										<input
											type="number"
											placeholder="Min"
											value={searchParams.surfaceArea?.min || ""}
											className="bg-input/50 text-black/50 dark:text-white rounded px-3 py-2 w-24"
											onChange={(e) => {
												const min = e.target.value ? parseInt(e.target.value) : undefined;
												debouncedHandleFilterChange({
													surfaceArea: { ...searchParams?.surfaceArea, min },
												});
											}}
										/>
										<input
											type="number"
											placeholder="Max"
											value={searchParams.surfaceArea?.max || ""}
											className="bg-input/50 text-black/50 dark:text-white rounded px-3 py-2 w-24"
											onChange={(e) => {
												const max = e.target.value ? parseInt(e.target.value) : undefined;
												debouncedHandleFilterChange({
													surfaceArea: { ...searchParams?.surfaceArea, max },
												});
											}}
										/>
									</div>
								</PopoverContent>
							</Popover>

							<LocationSelector
								width={150}
								locationObject={searchParams?.location}
								setLocationObject={(l) => {
									console.log("in loc", searchParams);
									// handleFilterChange({ location: l })
									handleFilterChange({ location: l });
								}}
							/>
							{/* better looking locatoin selector, but needs fixing */}
							{/* <Popover> */}
							{/*     <PopoverTrigger className='px-3 py-1.5 bg-input/30 text-black/50 dark:text-white hover:bg-input/50 dark:bg-[#241540] rounded flex flex-row items-center'> */}
							{/*         {propertyFilters?.location ? (propertyFilters?.location?.city + ", " + propertyFilters?.location?.state) : "Location"} */}
							{/*         <ChevronDownIcon className="ml-3 size-4 shrink-0 opacity-50" /> */}
							{/*     </PopoverTrigger> */}
							{/*     <PopoverContent > */}
							{/*         <LocationSelector */}
							{/*             width={150} */}
							{/*             locationObject={propertyFilters?.location} */}
							{/*             setLocationObject={(l) => { */}
							{/*                 console.log('in loc', propertyFilters) */}
							{/*                 // handleFilterChange({ location: l }) */}
							{/*                 handleFilterChange({ location: l }) */}
							{/*             }} */}
							{/*         /> */}
							{/*     </PopoverContent> */}
							{/* </Popover> */}

							<MultiSelect
								values={searchParams?.numberOfRooms?.map((i) => i.toString())}
								onValuesChange={(value) => handleFilterChange({ numberOfRooms: value.map((i) => Number(i)) as any })}
							>
								<MultiSelectTrigger className=" w-[150px] custor-pointer">
									<MultiSelectValue className="cursor-pointer text-white" placeholder="Number of Rooms" />
								</MultiSelectTrigger>
								<MultiSelectContent>
									{[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
										<MultiSelectItem key={num} value={`${num}`}>
											{num} rooms
										</MultiSelectItem>
									))}
								</MultiSelectContent>
							</MultiSelect>

							<FacilitiesSelector
								className="mt-2 w-[150px] "
								facilities={searchParams?.facilities ?? []}
								setFacilities={(value) => handleFilterChange({ facilities: value })}
							/>
						</div>
						<button
							className="py-1.5 px-4 outline-2 outline-gray-600 rounded text-white text-sm cursor-pointer hover:outline-purple-400"
							onClick={() => {
								handleFilterChange({
									propertyType: undefined,
									numberOfRooms: undefined,
									facilities: undefined,
									budget: undefined,
									location: undefined,
									surfaceArea: undefined,
								});
							}}
						>
							{" "}
							Șterge filtrele{" "}
						</button>
					</div>
				)}

				{/* Mobile Filters Section */}
				{showFilters && (
					<MobileFiltersOverlay
						propertyFilters={searchParams}
						debouncedHandleFilterChange={debouncedHandleFilterChange}
						budget={budget}
						setBudget={setBudget}
						onFilterChange={handleFilterChange}
						onClose={() => setShowFilters(false)}
					/>
				)}

				<PropertiesView propertiesReceived={propertiesReceived} searchParams={searchParams} />
			</div>
		</div>
	);
}

function PropertyTypeSelector({
	propertyType,
	handleChangePropertyType,
	className,
}: {
	propertyType: PropertyTypeType[];
	handleChangePropertyType: (type: PropertyTypeType[]) => void;
	className?: string;
}) {
	return (
		<MultiSelect values={propertyType} onValuesChange={handleChangePropertyType as any}>
			<MultiSelectTrigger className={cn(" w-[150px] custor-pointer", className)}>
				<MultiSelectValue className="cursor-pointer text-white" placeholder="Property Type" />
			</MultiSelectTrigger>
			<MultiSelectContent>
				<MultiSelectItem value="apartment">Apartment</MultiSelectItem>
				<MultiSelectItem value="house">House</MultiSelectItem>
				<MultiSelectItem value="hotel">Hotel</MultiSelectItem>
				<MultiSelectItem value="office">Office</MultiSelectItem>
			</MultiSelectContent>
		</MultiSelect>
	);
}

// Mobile Filters Overlay Component
function MobileFiltersOverlay({
	propertyFilters,
	onFilterChange,
	budget,
	setBudget,
	debouncedHandleFilterChange,
	onClose,
}: {
	propertyFilters: PropertyFilters | undefined;
	onFilterChange: (filters: Partial<PropertyFilters>) => void;
	onClose: () => void;
	debouncedHandleFilterChange: (value: Partial<PropertyFilters>) => void;
	budget: Partial<PropertyFilters["budget"]>;
	setBudget: (budget: Partial<PropertyFilters["budget"]>) => void;
}) {
	const min = 10000;
	const max = 2000000;

	const { aiChatbotOpen, setAiChatbotOpen } = usePopoversOpenStore(
		useShallow((state) => ({
			aiChatbotOpen: state.aiChatbotOpen,
			setAiChatbotOpen: state.setAiChatbotOpen,
		})),
	);

	return (
		<div className="md:hidden fixed top-14 bottom-20 left-3 right-3 z-50 bg-[#120826] text-white rounded-lg border overflow-y-auto">
			{/* Header */}
			{/*JSON.stringify(propertyFilters)*/}
			<div className="flex items-center justify-between border-b rounded-b-lg p-2 pb-3 pt-4 mb-8">
				<h1 className="text-2xl font-light">Filtrează proprietăți</h1>
				<button onClick={onClose} className="pl-2 pb-2 pt-1 pr-1">
					{" "}
					<X className="w-6 h-6" />{" "}
				</button>
			</div>

			<h2 className="text-lg font-medium mb-4 px-2">Tip Locuița</h2>
			<PropertyTypeSelector
				propertyType={propertyFilters?.propertyType ?? []}
				handleChangePropertyType={(p) => onFilterChange({ propertyType: p })}
				className="mx-2 py-2 pl-3"
			/>

			{/* Price Range */}
			<div className="mb-8 mt-3 p-2">
				<div className="flex flex-row items-center justify-between">
					<h2 className="text-lg font-medium mb-4">Price</h2>
					<div className="text-[#7B31DC] text-lg font-medium mb-4">
						${(propertyFilters?.budget?.min ?? min).toLocaleString()}-
						{(propertyFilters?.budget?.max ?? max).toLocaleString()}
					</div>
				</div>

				<div className="flex justify-center"> {priceChartSvg} </div>

				{/* Dual Range Slider */}
				<div className="relative mb-6">
					<Slider
						value={[propertyFilters?.budget?.min ?? min, propertyFilters?.budget?.max ?? max]}
						onValueChange={([min, max]) => {
							console.log("min", min, "max", max);
							// onFilterChange({ ...propertyFilters, budget: { min, max } })
							setBudget({ min, max });
							debouncedHandleFilterChange({ budget: { min, max } });
						}}
						trackClassName="bg-[#8A4FFF] data-[orientation=horizontal]:h-1"
						min={min}
						max={max}
						step={50}
						className="w-full"
					/>
				</div>

				{/* Manual Input */}
				<div className="grid grid-cols-2 gap-2">
					<Input
						placeholder="Introdu min"
						value={propertyFilters?.budget?.min}
						onChange={(v) => {
							setBudget({ min: parseInt(v.target.value), max: budget?.max });
							debouncedHandleFilterChange({ budget: { min: parseInt(v.target.value), max: budget?.max } });
						}}
					/>
					<Input
						placeholder="Introdu max"
						value={propertyFilters?.budget?.max}
						onChange={(v) => {
							setBudget({ max: parseInt(v.target.value), min: budget?.min });
							debouncedHandleFilterChange({ budget: { max: parseInt(v.target.value), min: budget?.min } });
						}}
					/>
				</div>
			</div>

			{/* Surface Area */}
			<div className="mb-8 px-2">
				<h2 className="text-lg font-medium mb-4">Suprafață</h2>
				<div className="flex justify-center"> {priceChartSvg} </div>

				{/* Dual Range Slider */}
				<div className="relative mb-6">
					<Slider
						value={[propertyFilters?.surfaceArea?.min ?? 15, propertyFilters?.surfaceArea?.max ?? 500]}
						onValueChange={([min, max]) => {
							console.log("min", min, "max", max);
							// onFilterChange({ ...propertyFilters, budget: { min, max } })
							debouncedHandleFilterChange({ surfaceArea: { min, max } });
						}}
						trackClassName="bg-[#8A4FFF] data-[orientation=horizontal]:h-1"
						min={15}
						max={500}
						step={5}
						className="w-full"
					/>
				</div>

				{/* Manual Input */}
				<div className="grid grid-cols-2 gap-2">
					<Input
						placeholder="Introdu min"
						value={propertyFilters?.surfaceArea?.min}
						onChange={(v) => {
							debouncedHandleFilterChange({
								surfaceArea: { min: parseInt(v.target.value), max: propertyFilters?.surfaceArea?.max },
							});
						}}
					/>
					<Input
						placeholder="Introdu max"
						value={propertyFilters?.surfaceArea?.max}
						onChange={(v) => {
							debouncedHandleFilterChange({
								surfaceArea: { max: parseInt(v.target.value), min: propertyFilters?.surfaceArea?.min },
							});
						}}
					/>
				</div>
			</div>

			{/* Location */}
			<div className="mb-8 px-2">
				<h2 className="text-lg font-medium mb-4">Locație</h2>
				<LocationSelector
					className="py-4 rounded-lg placeholder-gray-400"
					locationObject={propertyFilters?.location}
					setLocationObject={(l) => onFilterChange({ location: l })}
				/>
			</div>

			{/* Number of Rooms */}
			<div className="mb-8 px-2">
				<h2 className="text-lg font-medium mb-4">Numar De Camere</h2>
				<div className="grid grid-cols-5 gap-3">
					{[1, 2, 3, 4, "5+"].map((num) => (
						<button
							key={num}
							className={`py-2 px-4 rounded-lg text-sm font-light text-center ${
								propertyFilters?.numberOfRooms?.includes(typeof num === "number" ? num : 5)
									? "bg-[#7B31DC] text-white"
									: "bg-[#241540] text-gray-400"
							}`}
							onClick={() => {
								const roomNum = typeof num === "number" ? [num] : [5, 6, 7, 8, 9];
								const newRooms = propertyFilters?.numberOfRooms?.some((i) => roomNum.includes(i))
									? propertyFilters.numberOfRooms.filter((i) => !roomNum.includes(i))
									: [...new Set((propertyFilters?.numberOfRooms ?? [])?.concat(roomNum))];
								onFilterChange({ ...propertyFilters, numberOfRooms: newRooms });
							}}
						>
							{num}
						</button>
					))}
				</div>
			</div>

			{/* Facilities */}
			<div className="mb-8 px-2">
				<h2 className="text-lg font-medium mb-4">Facilități</h2>
				<div className="grid grid-cols-2 gap-4">
					{(
						[
							{ key: "parking", value: "parking" },
							{ key: "balcony", value: "balcony" },
							{ key: "terrace", value: "terrace" },
							{ key: "garden", value: "garden" },
							{ key: "elevator", value: "elevator" },
							{ key: "air-conditioning", value: "air-conditioning" },
							{ key: "central-heating", value: "central-heating" },
							{ key: "furnished", value: "furnished" },
							{ key: "internet", value: "internet" },
						] as const
					).map((facility) => (
						<div key={facility.key} className="flex items-center space-x-3">
							<Checkbox
								id={facility.key}
								checked={propertyFilters?.facilities?.includes(facility.key)}
								onCheckedChange={(checked) => {
									const newFacilities = checked
										? [...(propertyFilters?.facilities ?? []), facility.key]
										: propertyFilters?.facilities?.filter((f) => f !== facility.key);
									onFilterChange({ ...propertyFilters, facilities: newFacilities });
								}}
								className="border-[#7B31DC] data-[state=checked]:bg-[#7B31DC]"
							/>
							<label htmlFor={facility.key} className="text-white cursor-pointer">
								{facility.value}
							</label>
						</div>
					))}
				</div>
			</div>

			{/* Continue in Chat */}
			<div className="mb-6 px-2">
				<p className="text-center text-[#E9E1FF] text-sm">Pentru mai multe filtre:</p>
				<button
					className="w-full bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] hover:bg-[#6A2BC4] text-white text-sm py-3 rounded-lg flex items-center justify-center gap-2"
					onClick={() => {
						setAiChatbotOpen(true);
						onClose();
					}}
				>
					<ChatIcon className="w-5 h-5" />
					Continuă în chat
				</button>
			</div>

			{/* Bottom Actions */}
			<div className="grid grid-cols-2 gap-2 px-2 pt-3 pb-6 bg-[#1A0F33] text-white sticky bottom-0">
				<button
					className="py-3 border border-gray-600 rounded-lg text-white text-sm"
					onClick={() => {
						onFilterChange({
							propertyType: undefined,
							numberOfRooms: undefined,
							facilities: undefined,
							budget: undefined,
							location: undefined,
							surfaceArea: undefined,
						});
						onClose();
					}}
				>
					{" "}
					Șterge filtrele{" "}
				</button>
				<button
					className="py-3 bg-[#8A4FFF] hover:bg-[#6A2BC4] text-white rounded-lg tex-sm"
					onClick={() => {
						onClose();
					}}
				>
					{" "}
					Salvează modificările{" "}
				</button>
			</div>
		</div>
	);
}

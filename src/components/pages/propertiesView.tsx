import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useTRPCClient } from "@/trpc/react";
import { PropertyFiltersObject } from "@/utils/validation/propertyFilters";
import { PropertyFilters, PropertyObject } from "@/utils/validation/types";
import { PropertyCard } from "../basics/propertyCard";

export function PropertiesView({
	propertiesReceived,
	searchParams,
	demoVersion,
}: {
	propertiesReceived?: {
		properties: (PropertyObject & { matchScore: number })[];
		count: number;
		totalFilterCount: number;
	};
	searchParams: PropertyFiltersObject;
	demoVersion?: boolean;
}) {
	const { ref, inView } = useInView();
	const trpcClient = useTRPCClient();

	const { status, data, error, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
		queryKey: [demoVersion ? "demoProperties" : "properties", searchParams],
		queryFn: async ({ pageParam }) => {
			{
				/* if (demoVersion && pageParam !== 0) return */
			}
			const res = await fetchProperties({ skip: pageParam * 9 });
			return res;
		},
		initialData: propertiesReceived ? { pages: [propertiesReceived], pageParams: [0] } : undefined,
		initialPageParam: 0,
		getNextPageParam: (lastpage, _allPages, lastPageParam) => {
			if ((lastpage?.properties.length ?? 0) === 0) {
				return undefined;
			}
			return lastPageParam + 1;
		},
	});

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	const [count, setCount] = useState<number>(propertiesReceived?.count ?? 0);

	async function fetchProperties({ skip = 0 }: { skip?: number }) {
		const newProps = await trpcClient.properties.list.query({ props: searchParams, skip });
		setCount(newProps.count);
		return newProps;
	}

	return status === "error" ? (
		<span>Error: {error.message}</span>
	) : (
		<>
			{/* Properties Grid */}
			{
				<div className={`grid grid-cols-2 lg:grid-cols-3 ${demoVersion ? "gap-1" : "gap-x-1 md:gap-x-3 gap-y-3 p-4"} `}>
					{data?.pages?.map((p) =>
						p?.properties.map((property) => (
							<PropertyCard
								match={
									p?.totalFilterCount && property.matchScore ? (property.matchScore * 100) / p.totalFilterCount : "hide"
								}
								key={property._id}
								property={property}
								demoVersion={demoVersion}
							/>
						)),
					)}
				</div>
			}

			{data?.pages.flat(1) && data?.pages.flat(1).length === 0 && (
				<div className="text-center h-full py-8">
					<p className="text-gray-400">No properties found matching your criteria.</p>
				</div>
			)}

			<div>
				<button ref={ref} onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
					{isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load Newer" : "Nothing more to load"}
				</button>
			</div>
		</>
	);
}

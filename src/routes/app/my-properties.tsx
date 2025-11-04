import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { PropertyStatusValues, PropertyType } from 'utils/constants'
import z from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { getHeaders } from '@tanstack/react-start/server'
import { auth } from 'utils/auth'
import { trpcRouter } from 'trpc/router'
import { useEffect, useState } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useTRPC, useTRPCClient } from 'trpc/react'
import { PropertyCard } from './properties'
import { MoreVerticalIcon, PencilIcon, Plus, TrashIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { useTranslation } from 'react-i18next'
import { usePropertyFilterStore } from '../__root'
import { useShallow } from 'zustand/react/shallow'



const zodValidator = z.object({ status: z.enum(PropertyStatusValues).optional() })

const fetchMyPropertiesServerFn = createServerFn().validator(d => zodValidator.parse(d)).handler(async ({ data: input }) => {
    const headers = getHeaders()
    const h = new Headers()
    Object.entries(headers).filter(r => r[1]).map(r => h.append(r[0], r[1]!))
    const sessionData = await auth.api.getSession({ headers: h })
    const caller = trpcRouter.createCaller({ headers: h, user: sessionData?.user })
    const res = await caller.properties.myProperties({ skip: 0, status: input.status })
    return res
})

export const Route = createFileRoute('/app/my-properties')({
    component: MyPropertiesRoute,
    loaderDeps: ({ search }) => ({ search }),
    loader: async ({ deps: { search } }) => {
        // Load initial properties without filters
        const data = await fetchMyPropertiesServerFn({ data: search })
        console.log('getPropertiesWithFilters', data.properties.length)
        return data
    },
    validateSearch: zodValidator
})

function MyPropertiesRoute() {

    const { t } = useTranslation()
    const propertiesReceived = Route.useLoaderData()
    const searchParams = Route.useSearch()
    const trpcClient = useTRPCClient()
    const trpc = useTRPC()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    console.log('propertiesReceived', propertiesReceived)

    const [count, setCount] = useState<{ _id: string, count: number }[]>(propertiesReceived.groupStatus)

    const { ref, inView } = useInView()


    const {
        status,
        data,
        error,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['my-properties', searchParams],
        queryFn: async ({ pageParam, }) => {
            const res = await fetchMyProperties({ skip: pageParam * 9 })
            return res.properties
        },
        initialData: { pages: [propertiesReceived.properties], pageParams: [0] },
        initialPageParam: 0,
        getNextPageParam: (lastpage, _allPages, lastPageParam) => {
            if (lastpage.length === 0) { return undefined; }
            return lastPageParam + 1;
        },
    })

    const { startConversation } = usePropertyFilterStore(useShallow(state => ({
        startConversation: state.startConversation,
    })))

    async function fetchMyProperties({ skip = 0, status }: { skip?: number, status?: typeof PropertyStatusValues[number] }) {
        const newProps = await trpcClient.properties.myProperties.query({ skip })
        setCount(newProps.groupStatus)
        return newProps
    }


    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    const updatePropertyMutation = useMutation(trpc.properties.updateProperty.mutationOptions())
    const deletePropertyMutation = useMutation(trpc.properties.deleteProperty.mutationOptions())
    const [toDeletePropertyId, setToDeletePropertyId] = useState<string | undefined>()

    async function handleStatusChange(propertyId: string, status: typeof PropertyStatusValues[number]) {
        console.log('handleStatusChange', status)
        const res = await updatePropertyMutation.mutateAsync({ propertyId: propertyId, property: { status } })
        queryClient.invalidateQueries({ queryKey: ['my-properties'] })
    }

    const actualProperties = data.pages.flat(1).filter(i => searchParams.status === undefined || i.status === searchParams.status)


    return (
        <div className="flex flex-col items-center justify-center border mx-2 rounded-lg">
            <div className='flex w-full flex-row items-center justify-between gap-2 border-b px-6 pt-6 pb-7 '>
                <h1 className="text-2xl font-light">{t('my-properties.title')}</h1>

                <button
                    onClick={() => { startConversation() }}
                    className="py-3.5 px-4 rounded-lg cursor-pointer text-sm font-light text-center border border-[#C1A7FF] text-[#C1A7FF] hover:bg-[#C1A7FF] hover:text-white flex flex-row items-center gap-2"
                >
                    <Plus className='w-4 h-4' />
                    {t('my-properties.addProperty')}
                </button>

            </div>


            <div className="flex flex-row items-center gap-3 px-2 md:px-4 py-2 justify-start w-full">
                <button
                    className={`py-3 px-4 rounded-[6px] text-sm font-light text-center ${searchParams?.status !== undefined ? 'bg-[#241540] text-white' : 'bg-[#7B31DC] text-white'}`}
                    onClick={() => {
                        navigate({ to: '/app/my-properties', search: (prev) => ({ ...prev, status: undefined, skip: 0 }) })
                    }}
                >
                    {t('my-properties.filters.all')} ({count.reduce((prev, curr) => prev + curr.count, 0)})
                </button>
                {PropertyStatusValues.map(status => (
                    <button
                        key={status}
                        className={`py-3 px-4 rounded-[6px] text-sm font-light text-center ${status === searchParams?.status ? 'bg-[#7B31DC] text-white' : 'bg-[#241540] text-white'}`}
                        onClick={() => {
                            const newStatus = status === searchParams?.status ? undefined : status
                            const newSkip = newStatus ? 0 : undefined
                            navigate({ to: '/app/my-properties', search: (prev) => ({ ...prev, status: newStatus, skip: newSkip }) })

                        }}
                    >
                        {t(`my-properties.status.${status}`)} ({count.find(i => i._id === status)?.count ?? 0})
                    </button>
                ))}

            </div>

            {/* {toDeletePropertyId} */}
            {toDeletePropertyId && <AlertDialog onOpenChange={(open) => { if (!open) setToDeletePropertyId(undefined) }} open={!!toDeletePropertyId}>
                <AlertDialogTrigger>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('my-properties.deleteDialog.title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('my-properties.deleteDialog.description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('my-properties.deleteDialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            await deletePropertyMutation.mutateAsync({ propertyId: toDeletePropertyId })
                            queryClient.invalidateQueries({ queryKey: ['my-properties'] })
                            setToDeletePropertyId(undefined)
                        }}>{t('my-properties.deleteDialog.confirm')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>}

            {/* Properties Grid */}
            {<div className="grid grid-cols-2 gap-1 md:gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
                {actualProperties.map((property) => (<PropertyCard
                    match={property.status}
                    matchRight
                    disableLink
                    key={property._id}
                    property={property}
                    moreComponent={<DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className='p-3 rounded-lg cursor-pointer hover:bg-gray-100/10 '>
                                <MoreVerticalIcon className='w-4 h-4 ' />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>{t('my-properties.status.label')}</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem
                                checked={property.status === 'available'}
                                onCheckedChange={(checked) => { if (checked) handleStatusChange(property._id, 'available') }}
                                onClick={(e) => { e.stopPropagation() }}
                            >{t('my-properties.status.available')}</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={property.status === 'sold'}
                                onCheckedChange={(checked) => { if (checked) handleStatusChange(property._id, 'sold') }}
                                onClick={(e) => { e.stopPropagation() }}
                            >{t('my-properties.status.sold')}</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={property.status === 'pending'}
                                onCheckedChange={(checked) => { if (checked) handleStatusChange(property._id, 'pending') }}
                                onClick={(e) => { e.stopPropagation() }}
                            >{t('my-properties.status.pending')}</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={property.status === 'rented'}
                                onCheckedChange={(checked) => { if (checked) handleStatusChange(property._id, 'rented') }}
                                onClick={(e) => { e.stopPropagation() }}
                            >{t('my-properties.status.rented')}</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={property.status === 'off-market'}
                                onCheckedChange={(checked) => { if (checked) handleStatusChange(property._id, 'off-market') }}
                                onClick={(e) => { e.stopPropagation() }}
                            >{t('my-properties.status.off-market')}</DropdownMenuCheckboxItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <div onClick={async (e) => {
                                    e.stopPropagation()
                                    setToDeletePropertyId(property._id)
                                }} className="flex flex-row items-center gap-2 text-red-500 hover:text-red-700 cursor-pointer">
                                    <TrashIcon className='w-4 h-4' />
                                    {t('my-properties.actions.delete')}
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>}
                />))}
            </div>}

            {actualProperties && actualProperties.length === 0 && (
                <div className="text-center h-full py-8">
                    <p className="text-gray-400">{t('my-properties.emptyState')}</p>
                </div>
            )}


            <div>
                <button
                    ref={ref}
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                >
                    {isFetchingNextPage
                        ? t('my-properties.loadMore.loading')
                        : hasNextPage
                            ? t('my-properties.loadMore.loadNewer')
                            : t('my-properties.loadMore.noMore')}
                </button>
            </div>

        </div>
    )
}

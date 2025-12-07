import { createFileRoute, useRouter } from '@tanstack/react-router'
import { getHeaders } from '@tanstack/react-start/server'
import { trpcRouter } from '@/trpc/router'
import { auth } from '@/utils/auth'
import { PropertyObject, UserObject } from '@/utils/validation/types'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v3'
import { EditPropertyComponent } from '@/src/components/editPropertyComponent'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTRPC } from '@/trpc/react'
import { Link } from '@tanstack/react-router'



const getProperty = createServerFn().validator((params) => z.object({ id: z.string() }).parse(params)).handler(async ({ data: { id } }) => {

    const headers = getHeaders()

    const h = new Headers()
    Object.entries(headers).filter(r => r[1]).map(r => h.append(r[0], r[1]!))

    const sessionData = await auth.api.getSession({ headers: h })

    const caller = trpcRouter.createCaller({ user: sessionData?.user, headers: h })
    const result = await caller.properties.byId({ id })
    if (result.property.postedByUserId === sessionData?.user?.id) {
        return { ...result, success: true } as { success: true, property: PropertyObject, favorited: boolean, propertyUser: UserObject }
    } else return { success: false } as const

})



export const Route = createFileRoute('/app/properties/$id/edit')({
    component: RouteComponent,
    loader: async ({ params }) => {
        console.log('params', params)
        const result = await getProperty({ data: params })

        return result
    },
})

function RouteComponent() {


    const { id } = Route.useParams()
    const loaderData = Route.useLoaderData()

    const trpc = useTRPC()
    const router = useRouter()

    const updatePropertyMutation = useMutation(trpc.properties.updateProperty.mutationOptions({}));


    const [property, setProperty] = useState<PropertyObject | undefined>(loaderData.success ? loaderData.property : undefined)

    if (!loaderData.success) {
        return <div>You are not the owner of this property</div>
    }

    if (updatePropertyMutation.status === 'error') {
        console.log('error', updatePropertyMutation.error)
        return <div className='flex flex-col'>
            Error: {updatePropertyMutation.error.message}
            <Link to={'/app/properties/$id/edit'} reloadDocument params={{ id: id }}><button className='bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] hover:from-[#6A2BC4] hover:to-[#6A2BC4]/50 text-white px-4 py-3 rounded-lg cursor-pointer'>Reload</button></Link>
        </div>
    }

    return <div className='flex flex-col border mx-2 rounded-lg'>

        <div className='p-4 w-full border-b mb-4'>
            <button
                onClick={() => router.history.back()}
                className=" hover:bg-purple-800/30 rounded-lg relative cursor-pointer"
            >
                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ mixBlendMode: 'difference', backdropFilter: 'blur(100px) grayscale(1) contrast(100)', clipPath: 'url(#back-arrow-clip)', backgroundColor: 'white' }}>
                    <defs>
                        <clipPath id="back-arrow-clip">
                            <path d="M3.9334 9H16.1084V7H3.9334L9.5334 1.4L8.1084 0L0.108398 8L8.1084 16L9.5334 14.6L3.9334 9Z" fill="#0B0014" />
                        </clipPath>
                    </defs>
                </svg>

                {/* <ArrowLeft className="w-5 text-white mix-blend-difference h-5 relative " /> */}
            </button>

        </div>
        <EditPropertyComponent<PropertyObject> property={property!} onPropertyChange={(p) => {
            console.log('property', property)
            setProperty(p as PropertyObject)
        }} onSave={async () => {
            const res = await updatePropertyMutation.mutateAsync({ propertyId: id, property: property! })
            return;
        }} />
    </div>
}

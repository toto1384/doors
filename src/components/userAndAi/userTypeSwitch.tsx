import { usePopoversOpenStore } from "@/routes/__root"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useTRPC } from "trpc/react"
import { UserType } from "utils/validation/dbSchemas"
import { useShallow } from "zustand/react/shallow"



export function UserTypeSwitch({ extraPadding }: { extraPadding?: boolean }) {

    const { t } = useTranslation('translation', { keyPrefix: 'app-wrapper' })


    const { userType: gUserType, setUserType } = usePopoversOpenStore(useShallow(state => ({
        userType: state.userType,
        setUserType: state.setUserType,
    })))

    const trpc = useTRPC()
    const changeUserTypeMutation = useMutation(trpc.auth.changeUserType.mutationOptions())


    async function handleChangeUserType(userType: typeof UserType[number]) {

        try {
            const res = await changeUserTypeMutation.mutateAsync({ userType })
            if (res.success) setUserType(userType)
        } catch (error) {
            console.log('error', error)
        }
    }

    return <div className='rounded-[5px] bg-[#32215A] w-fit flex flex-row items-center p-0.5'>
        <button
            className={(gUserType === 'buyer' ? 'bg-gradient-to-br from-[#4C7CED] to-[#7B31DC]' : '') + ` text-white text-xs ${extraPadding ? "px-5" : "px-2.5"} py-[6px] rounded hover:from-blue-600 hover:to-purple-700 transition-all`}
            onClick={() => handleChangeUserType('buyer')}
        >
            {t('buyer')}
        </button>
        <button
            className={(gUserType === 'seller' ? 'bg-gradient-to-br from-[#4C7CED] to-[#7B31DC]' : '') + ` text-white text-xs ${extraPadding ? "px-5" : "px-2.5"} py-[6px] rounded hover:from-blue-600 hover:to-purple-700 transition-all`}
            onClick={() => handleChangeUserType('seller')}
        >
            {t('seller')}
        </button>
    </div>
}

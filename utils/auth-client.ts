

import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, phoneNumberClient } from "better-auth/client/plugins"

import type { auth } from "./auth";
import { authAdditionalFields } from "./constants";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "trpc/react";
import { useRouter } from "@tanstack/react-router";

console.log(import.meta.env.VITE_BETTER_AUTH_URL)

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
    plugins: [
        phoneNumberClient(),
        inferAdditionalFields<typeof auth>()
    ]
})


export function useSignOutFunction() {
    const query = useQueryClient()
    const router = useRouter()
    return async () => {
        query.invalidateQueries({ queryKey: ['better_auth_account'] })

        await authClient.signOut({
            fetchOptions: {
                onSuccess(context) {
                    router.navigate({ to: '/auth/$path', params: { path: 'sign-in' }, reloadDocument: true })
                },
            }
        })

    }

}

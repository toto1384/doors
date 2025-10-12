

import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, phoneNumberClient } from "better-auth/client/plugins"

import type { auth } from "./auth";

console.log(import.meta.env.VITE_BETTER_AUTH_URL)

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
    plugins:[
        phoneNumberClient(),
        inferAdditionalFields<typeof auth>()
    ]
})


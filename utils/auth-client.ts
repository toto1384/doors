

import { createAuthClient } from "better-auth/react"

console.log(import.meta.env.VITE_BETTER_AUTH_URL)

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL,

})


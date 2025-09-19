'use client';

// NextAuth imports commented out for BetterAuth migration
// import { signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";


export default function LoginSwitchButton() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [])

    if (!mounted) {
        return null;
    }

    return (
        <div>
            <button
                onClick={() => {
                    // session.status === "authenticated" ? signOut() : signIn("google") // Commented out for BetterAuth migration
                    console.log("Auth functionality to be implemented with BetterAuth")
                }}
                className="mx-5 my-5 text-3xl"
            >
                {/* {session.status === "authenticated" ? "Sign Out" : "Sign In"} */}
                {"Sign In/Out (BetterAuth TBD)"}
            </button>
        </div>
    );
}

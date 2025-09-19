


import { auth } from "utils/auth";
import { RedirectToSignIn, SignedIn, UserButton } from '@daveyplate/better-auth-ui';
import { ElevenLabsChatBotDemo } from "./aiChatbot";
import { Link } from "@tanstack/react-router";


export default function AppRouteWrapper({
    children,
    token
}: Readonly<{
    children: React.ReactNode;
    token: string;
}>) {


    return (
        <>
            <RedirectToSignIn />
            <SignedIn>
                <div className="flex flex-col max-h-dvh">

                    <div className='flex flex-row w-full justify-between px-4 py-2 bg-gray-100 dark:bg-[#171717] items-center border-b border-[#454F5B]'>
                        <Link to="/app" >

                            <img src={'/doors-logo.png'} className="w-[90px] h-[45px] object-cover object-center" />
                        </Link>
                        <div className="flex flex-row items-center mr-3 gap-3">
                            <img src={'/icons/notifications.svg'} className="w-[18px] h-[18px] " />
                            <div className="flex flex-row gap-1 items-center">
                                <img src={'/icons/credits.svg'} className="w-[18px] h-[18px] " />
                                <span className="text-xs font-light"> 5009 </span>
                            </div>
                            <UserButton
                                size="icon"
                                className="size-5"
                            // additionalLinks={}
                            />

                        </div>
                    </div>
                    <div className="flex flex-row items-stretch grow-1 flex-1 min-h-0" >
                        <div className="flex flex-col w-[30vw] bg-gray-100 dark:bg-[#262626] ">
                            <ElevenLabsChatBotDemo conversationToken={token} />
                        </div>
                        <div className='flex flex-col w-full max-h-full overflow-y-auto'>
                            {children}
                        </div>
                    </div>
                </div>
            </SignedIn>
        </>
    );
}

import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useTranslation } from "react-i18next";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    image?: string;
    isRead?: boolean;
}

const mockNotifications: NotificationItem[] = [
    {
        id: "1",
        title: "You purchased a rent",
        message: "01 minutes ago.",
        timestamp: "01 minutes ago",
        image: "/icons/notifications.svg",
        isRead: false
    },
    {
        id: "2",
        title: "You purchased a rent",
        message: "01 minutes ago.",
        timestamp: "01 minutes ago",
        image: "/icons/notifications.svg",
        isRead: false
    },
    {
        id: "3",
        title: "You purchased a rent",
        message: "01 minutes ago.",
        timestamp: "01 minutes ago",
        image: "/icons/notifications.svg",
        isRead: true
    },
    {
        id: "4",
        title: "You purchased a rent",
        message: "01 minutes ago.",
        timestamp: "01 minutes ago",
        image: "/icons/notifications.svg",
        isRead: true
    },
    {
        id: "5",
        title: "You purchased a rent",
        message: "01 minutes ago.",
        timestamp: "01 minutes ago",
        image: "/icons/notifications.svg",
        isRead: true
    },
    {
        id: "6",
        title: "You purchased a rent",
        message: "01 minutes ago.",
        timestamp: "01 minutes ago",
        image: "/icons/notifications.svg",
        isRead: true
    }
];

export function NotificationsContent({className}:{className?:string}) {
    const { t } = useTranslation();
    const [notifications] = useState<NotificationItem[]>(mockNotifications);

    const todayNotifications = notifications.slice(0, 2);
    const yesterdayNotifications = notifications.slice(2);


    return (
        <div className={ cn("w-full overflow-y-auto",className) }>

            {notifications.length == 0 && <div className="text-center py-12">
                    <div className="mb-4">
                        <img
                            src="/icons/emptyIllustration.svg"
                            alt="No notifications"
                            className="w-16 h-16 mx-auto"
                        />
                    </div>
                    <h4 className="text-xl font-semibold mb-2">Empty</h4>
                    <p className="text-gray-300 text-sm">
                        You don't have any notifications at this time
                    </p>
                </div>}


            {todayNotifications.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3 text-gray-300">Today</h4>
                    <div className="space-y-3">
                        {todayNotifications.map((notification) => (<NotificationItem notification={notification} />))}
                    </div>
                </div>
            )}

            {yesterdayNotifications.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium mb-3 text-gray-300">Yesterday</h4>
                    <div className="space-y-3">
                        {yesterdayNotifications.map((notification) => (<NotificationItem notification={notification} />))}
                    </div>
                </div>
            )}
        </div>
    );
}


function NotificationItem({ notification }: { notification: NotificationItem }) {
    return (
        <div key={notification.id} className="flex items-center gap-3 bg-[#241540] rounded-lg px-4 py-4">
            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                <img src={notification.image || "/icons/notifications.svg"} alt="" className="w-full h-full objec-contain" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs text-gray-400">{notification.message}</p>
            </div>
        </div>
    );
}

export function NotificationsDropdown({className}:{className?:string}) {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleNotificationClick = () => {
        if (isMobile) {
            router.navigate({ to: '/app/notifications' });
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className={className}>
                <Button variant="ghost" size="sm" className="relative p-1">
                    <img
                        src="/icons/notifications.svg"
                        className="w-[18px] h-[18px] invert-[85] dark:invert-0"
                        alt="Notifications"
                    />
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 w-2 h-2 p-0 text-xs"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-6 w-80 max-h-96 border-0 bg-[#1A0F33] text-white rounded-lg" align="end">
            <h3 className="text-lg font-semibold text-center mb-4">Notification</h3>
                <NotificationsContent className={''} />

            </DropdownMenuContent>
        </DropdownMenu>
    );
}

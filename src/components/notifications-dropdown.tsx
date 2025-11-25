import { useState, useEffect, useContext } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useTranslation } from "react-i18next";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC, useTRPCClient } from "trpc/react";
import { format, isToday } from "date-fns";
import { NotificationObject } from "utils/validation/types";
import { NotificationsContext } from "./appWrapper";

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    image?: string;
    isRead?: boolean;
}


export function NotificationsContent({ className, open }: { className?: string, open: boolean }) {
    const { t } = useTranslation();
    const trpc = useTRPC();
    const markAsReadMutation = useMutation(trpc.notifications.markAsRead.mutationOptions())
    const queryClient = useQueryClient();

    const notifications = useContext(NotificationsContext);
    // const notifications = notificationsData.data?.notifications || []

    const todayNotifications = notifications.filter(n => isToday(n.createdAt));
    const olderNotifications = notifications.filter(n => !isToday(n.createdAt));


    useEffect(() => {
        if (open) {
            console.log('gh', notifications)
            //here mark the notifications as read
            markAsReadMutation.mutateAsync({ ids: notifications.map(n => n._id).filter(Boolean) as string[] }).then(() => {
                queryClient.invalidateQueries({ queryKey: ['notifications'] })
            })
        }
    }, [open, notifications])


    return (
        <div className={cn("w-full overflow-y-auto", className)}>

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

            {olderNotifications.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium mb-3 text-gray-300">Yesterday</h4>
                    <div className="space-y-3">
                        {olderNotifications.map((notification) => (<NotificationItem notification={notification} />))}
                    </div>
                </div>
            )}
        </div>
    );
}


function NotificationItem({ notification }: { notification: NotificationObject }) {
    const router = useRouter()
    return (
        <div
            key={notification._id}
            className={`flex ${notification.read ? 'bg-[#241540]' : 'bg-[#1A0F33]'} items-center gap-3 rounded-lg px-4 py-4 cursor-pointer hover:bg-[#2A2A3E]/50`}
            onClick={() => router.navigate({ to: notification.link })}
        >
            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                <img src={notification.image || "/icons/notifications.svg"} alt="" className="w-full h-full objec-contain" />
            </div>
            <div className="flex-1 min-w-0">
                {/*<p className="text-sm font-medium">{format(new Date(notification.createdAt), 'dd-MM-yyyy')}</p>*/}
                <p className="text-xs text-gray-400">{notification.message}</p>
            </div>
        </div>
    );
}

export function NotificationsDropdown({ className }: { className?: string }) {

    const [open, setOpen] = useState(false);
    const notifications = useContext(NotificationsContext);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild className={className}>
                <Button variant="ghost" size="sm" className="relative p-1">
                    <img
                        src="/icons/notifications.svg"
                        className="w-[18px] h-[18px] invert-[85] dark:invert-0"
                        alt="Notifications"
                    />
                    {notifications.filter(i => !i.read).length > 0 && <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 w-2 h-2 p-0 text-xs"
                    />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-6 w-80 max-h-96 border-0 bg-[#1A0F33] text-white rounded-lg" align="end">
                <h3 className="text-lg font-semibold text-center mb-4">Notification</h3>
                <NotificationsContent open={open} className={''} />

            </DropdownMenuContent>
        </DropdownMenu>
    );
}

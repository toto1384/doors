import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "react-i18next";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authClient } from "utils/auth-client";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingPasswordInput } from "@/components/ui/floating-password-input";
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Edit } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v3";
import { UserObject } from "utils/validation/types";
import { useTRPC, useTRPCClient } from "trpc/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import i18n from "@/components/i18n";
import { ChangeProfilePictureImageButton } from "@/components/ui/imageUploaders";
import { UserTypeSwitch } from "@/components/userAndAi/userTypeSwitch";

export const Route = createFileRoute('/app/profile/settings')({
    component: ProfileSettings,
})

const accountSchema = z.object({
    fullName: z.string().min(2),
})

const passwordSchema = z.object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
})

const notificationSchema = z.object({
    emailNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    aiNotifications: z.boolean(),
})


function ProfileSettings() {
    const { t } = useTranslation('translation', { keyPrefix: 'profile-page' });
    const { t: tSettings } = useTranslation('translation', { keyPrefix: 'profile-page.settings' });
    const { data: session } = authClient.useSession();


    const trpc = useTRPC()
    const newsletterMutation = useMutation(trpc.auth.updateNewsletter.mutationOptions())


    const accounts = useQuery({ queryKey: ['better_auth_account'], queryFn: async () => await authClient.listAccounts({ fetchOptions: { cache: 'no-cache' } }), })

    const user = session?.user as UserObject | undefined


    //notifications - moved to form

    const accountForm = useForm({ defaultValues: { fullName: session?.user?.name || '', }, resolver: zodResolver(accountSchema) });

    const passwordForm = useForm({ defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }, resolver: zodResolver(passwordSchema) });

    const notificationForm = useForm({
        defaultValues: {
            emailNotifications: user?.notifications?.emailNotifications ?? true,
            pushNotifications: user?.notifications?.pushNotifications ?? true,
            aiNotifications: user?.notifications?.aiNotifications ?? true,
        },
        resolver: zodResolver(notificationSchema)
    });

    const accountFormRef = useRef<HTMLFormElement>(null);
    const passwordFormRef = useRef<HTMLFormElement>(null);
    const notificationFormRef = useRef<HTMLFormElement>(null);

    const handleAccountCancel = () => {
        accountForm.reset({ fullName: session?.user?.name || '', });
    };

    const handlePasswordCancel = () => {
        passwordForm.reset({ currentPassword: '', newPassword: '', confirmPassword: '', });
    };

    const handleNotificationCancel = () => {
        notificationForm.reset({ emailNotifications: user?.notifications?.emailNotifications ?? true, pushNotifications: user?.notifications?.pushNotifications ?? true, aiNotifications: user?.notifications?.aiNotifications ?? true, });
    };


    const handleAccountSave = async (data: z.infer<typeof accountSchema>) => {
        // Handle account save logic
        const res = await authClient.updateUser({ name: data.fullName });
        if (res.error) {
            accountForm.setError('fullName', { message: res.error.message ?? 'An error occurred' })
        } else {
            accountForm.reset({ fullName: data.fullName, });
        }
    };

    const handlePasswordSave = async (data: z.infer<typeof passwordSchema>) => {
        // Handle password save logic
        console.log('Saving password:', data);
        if (data.newPassword !== data.confirmPassword) {
            passwordForm.setError('confirmPassword', { message: 'Passwords do not match' })
            return
        }
        const res = await authClient.changePassword({
            newPassword: data.newPassword, // required
            currentPassword: data.currentPassword, // required
            revokeOtherSessions: true,
        });
        if (res.error) {
            passwordForm.setError('currentPassword', { message: res.error.message ?? 'An error occurred' })
        } else {
            passwordForm.reset({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        }
    };


    const handleNotificationSave = async (data: z.infer<typeof notificationSchema>) => {
        // Handle notification save logic
        console.log('Saving notifications:', data);
        try {
            const res = await newsletterMutation.mutateAsync(data);
            notificationForm.reset({
                emailNotifications: data.emailNotifications,
                pushNotifications: data.pushNotifications,
                aiNotifications: data.aiNotifications,
            });
        } catch (error: any) {
            notificationForm.setError('emailNotifications', { message: `${error ?? 'An error occurred'}` })
        }

    };

    return (
        <div className="md:mx-5 md:border rounded-lg min-h-screen text-white relative">
            {/* Header */}
            {session && <div className="flex p-6 mb-3 flex-row items-center md:border-b rounded-b-lg">

                <div className="relative inline-block ">
                    <Avatar className="h-[75px] w-[75px] flex items-center justify-center mx-auto bg-gray-300 rounded-full">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} className="rounded-full aspect-square object-cover" />
                        <AvatarFallback className="text-gray-600 text-xl font-semibold">{session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6  flex items-center justify-center">
                        <ChangeProfilePictureImageButton />
                    </div>
                </div>
                <div className="flex flex-col gap-2 mx-3">
                    <h3 className="text-xl text-white">
                        {session.user?.name || session.user?.email || 'User'}
                        {session.user?.name ? <div className="text-[#637381] text-xs mt-1 font-normal">{session.user?.email}</div> : <></>}
                    </h3>

                    <UserTypeSwitch extraPadding />

                </div>

            </div>}

            <div className="space-y-8 max-w-3xl mx-auto">
                {/* Account Information */}
                <div className="md:bg-[#2B1C37]/20 rounded-lg px-6 md:py-6">
                    <div className="flex items-center gap-2 mb-6">
                        <svg width="16" height="16" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_848_45668)">
                                <path d="M8.75 10C10.0761 10 11.3479 9.47322 12.2855 8.53553C13.2232 7.59785 13.75 6.32608 13.75 5C13.75 3.67392 13.2232 2.40215 12.2855 1.46447C11.3479 0.526784 10.0761 0 8.75 0C7.42392 0 6.15215 0.526784 5.21447 1.46447C4.27678 2.40215 3.75 3.67392 3.75 5C3.75 6.32608 4.27678 7.59785 5.21447 8.53553C6.15215 9.47322 7.42392 10 8.75 10ZM6.96484 11.875C3.11719 11.875 0 14.9922 0 18.8398C0 19.4805 0.519531 20 1.16016 20H16.3398C16.9805 20 17.5 19.4805 17.5 18.8398C17.5 14.9922 14.3828 11.875 10.5352 11.875H6.96484Z" fill="white" />
                            </g>
                            <defs>
                                <clipPath id="clip0_848_45668">
                                    <path d="M0 0H17.5V20H0V0Z" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>

                        <h2 className="text-xl font-semibold">{tSettings('accountInformation')}</h2>
                    </div>

                    <form ref={accountFormRef} onSubmit={accountForm.handleSubmit(handleAccountSave)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FloatingInput
                                error={accountForm.formState.errors.fullName?.message}
                                label="Full Name"
                                {...accountForm.register("fullName")}
                            />
                        </div>

                    </form>
                </div>

                <div className="h-px bg-[#637381]/50 mx-auto w-[calc(100%-48px)] md:hidden mb-4"></div>

                {/* Change Password */}
                {accounts.isLoading && <>Loading...</>}
                {accounts.data?.data?.find(j => j.providerId == 'credential') && <div className="md:bg-[#2B1C37]/20 rounded-lg px-6 md:py-6">
                    <div className="flex items-center gap-2 mb-6">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_848_45680)">
                                <path d="M10 0C10.1797 0 10.3594 0.0390625 10.5235 0.113281L17.8789 3.23438C18.7383 3.59766 19.3789 4.44531 19.375 5.46875C19.3555 9.34375 17.7617 16.4336 11.0313 19.6562C10.3789 19.9688 9.62111 19.9688 8.96877 19.6562C2.2383 16.4336 0.644549 9.34375 0.625018 5.46875C0.621112 4.44531 1.26174 3.59766 2.12111 3.23438L9.48049 0.113281C9.64064 0.0390625 9.82033 0 10 0ZM10 2.60938V17.375C15.3906 14.7656 16.8399 8.98828 16.875 5.52344L10 2.60938Z" fill="white" />
                            </g>
                            <defs>
                                <clipPath id="clip0_848_45680">
                                    <path d="M0 0H20V20H0V0Z" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>

                        <h2 className="text-xl font-semibold">{tSettings('changePassword')}</h2>
                    </div>

                    <form ref={passwordFormRef} onSubmit={passwordForm.handleSubmit(handlePasswordSave)} className="space-y-4">
                        <FloatingPasswordInput
                            label={tSettings('currentPassword')}
                            error={passwordForm.formState.errors.currentPassword?.message}
                            {...passwordForm.register("currentPassword")}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FloatingPasswordInput
                                error={passwordForm.formState.errors.newPassword?.message}
                                label={tSettings('newPassword')}
                                {...passwordForm.register("newPassword")}
                            />
                            <FloatingPasswordInput
                                error={passwordForm.formState.errors.confirmPassword?.message}
                                label={tSettings('confirmNewPassword')}
                                {...passwordForm.register("confirmPassword")}
                            />
                        </div>
                    </form>
                </div>}

                <div className="h-px bg-[#637381]/50 mx-auto w-[calc(100%-48px)] md:hidden mb-4"></div>

                {/* Language Settings */}
                <div className="md:bg-[#2B1C37]/20 rounded-lg px-6 md:py-6">
                    <div className="flex items-center gap-2 mb-6">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_848_45692)">
                                <path d="M13.75 10C13.75 10.8672 13.7031 11.7031 13.6211 12.5H6.37891C6.29297 11.7031 6.25 10.8672 6.25 10C6.25 9.13281 6.29688 8.29688 6.37891 7.5H13.6211C13.707 8.29688 13.75 9.13281 13.75 10ZM14.875 7.5H19.6836C19.8906 8.30078 20 9.13672 20 10C20 10.8633 19.8906 11.6992 19.6836 12.5H14.875C14.957 11.6953 15 10.8594 15 10C15 9.14062 14.957 8.30469 14.875 7.5ZM19.2734 6.25H14.7148C14.3242 3.75391 13.5508 1.66406 12.5547 0.328125C15.6133 1.13672 18.1016 3.35547 19.2695 6.25H19.2734ZM13.4492 6.25H6.55078C6.78906 4.82812 7.15625 3.57031 7.60547 2.55078C8.01562 1.62891 8.47266 0.960938 8.91406 0.539062C9.35156 0.125 9.71484 0 10 0C10.2852 0 10.6484 0.125 11.0859 0.539062C11.5273 0.960938 11.9844 1.62891 12.3945 2.55078C12.8477 3.56641 13.2109 4.82422 13.4492 6.25ZM5.28516 6.25H0.726562C1.89844 3.35547 4.38281 1.13672 7.44531 0.328125C6.44922 1.66406 5.67578 3.75391 5.28516 6.25ZM0.316406 7.5H5.125C5.04297 8.30469 5 9.14062 5 10C5 10.8594 5.04297 11.6953 5.125 12.5H0.316406C0.109375 11.6992 0 10.8633 0 10C0 9.13672 0.109375 8.30078 0.316406 7.5ZM7.60547 17.4453C7.15234 16.4297 6.78906 15.1719 6.55078 13.75H13.4492C13.2109 15.1719 12.8438 16.4297 12.3945 17.4453C11.9844 18.3672 11.5273 19.0352 11.0859 19.457C10.6484 19.875 10.2852 20 10 20C9.71484 20 9.35156 19.875 8.91406 19.4609C8.47266 19.0391 8.01562 18.3711 7.60547 17.4492V17.4453ZM5.28516 13.75C5.67578 16.2461 6.44922 18.3359 7.44531 19.6719C4.38281 18.8633 1.89844 16.6445 0.726562 13.75H5.28516ZM19.2734 13.75C18.1016 16.6445 15.6172 18.8633 12.5586 19.6719C13.5547 18.3359 14.3242 16.2461 14.7188 13.75H19.2734Z" fill="white" />
                            </g>
                            <defs>
                                <clipPath id="clip0_848_45692">
                                    <path d="M0 0H20V20H0V0Z" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>

                        <h2 className="text-xl font-semibold">{tSettings('language')}</h2>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-400 mb-3">{tSettings('languageDescription')}</p>
                        <Select onValueChange={(i) => { i18n.changeLanguage(i); console.log(i) }} defaultValue="ro">
                            <SelectTrigger className="bg-[#3A3A5C] border-gray-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ro">Română</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>


                <div className="h-px bg-[#637381]/50 mx-auto w-[calc(100%-48px)] md:hidden mb-4"></div>

                {/* Notifications */}
                <div className="md:bg-[#2B1C37]/20 rounded-lg px-6 md:py-6">
                    <div className="flex items-center gap-2 mb-6">
                        <svg width="16" height="16" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_848_45712)">
                                <path d="M8.74925 0C8.05785 0 7.49925 0.558594 7.49925 1.25V2C4.64769 2.57812 2.49925 5.10156 2.49925 8.125V8.85938C2.49925 10.6953 1.82347 12.4688 0.604721 13.8438L0.315659 14.168C-0.0124665 14.5352 -0.0905915 15.0625 0.108627 15.5117C0.307846 15.9609 0.757065 16.25 1.24925 16.25H16.2493C16.7414 16.25 17.1868 15.9609 17.3899 15.5117C17.593 15.0625 17.511 14.5352 17.1828 14.168L16.8938 13.8438C15.675 12.4688 14.9993 10.6992 14.9993 8.85938V8.125C14.9993 5.10156 12.8508 2.57812 9.99925 2V1.25C9.99925 0.558594 9.44066 0 8.74925 0ZM10.5188 19.2695C10.9875 18.8008 11.2493 18.1641 11.2493 17.5H8.74925H6.24925C6.24925 18.1641 6.51097 18.8008 6.97972 19.2695C7.44847 19.7383 8.08519 20 8.74925 20C9.41331 20 10.05 19.7383 10.5188 19.2695Z" fill="#F9FAFB" />
                            </g>
                            <defs>
                                <clipPath id="clip0_848_45712">
                                    <rect width="17.5" height="20" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>

                        <h2 className="text-xl font-semibold">{tSettings('notifications')}</h2>
                    </div>

                    <form ref={notificationFormRef} onSubmit={notificationForm.handleSubmit(handleNotificationSave)} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">{tSettings('emailNotifications')}</h3>
                                <p className="text-sm text-gray-400">{tSettings('emailNotificationsDescription')}</p>
                            </div>
                            <Controller
                                name="emailNotifications"
                                control={notificationForm.control}
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">{tSettings('pushNotifications')}</h3>
                                <p className="text-sm text-gray-400">{tSettings('pushNotificationsDescription')}</p>
                            </div>
                            <Controller
                                name="pushNotifications"
                                control={notificationForm.control}
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">{tSettings('aiNotifications')}</h3>
                                <p className="text-sm text-gray-400">{tSettings('aiNotificationsDescription')}</p>
                            </div>
                            <Controller
                                name="aiNotifications"
                                control={notificationForm.control}
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </form>
                </div>

                <div className="h-px bg-[#637381]/50 mx-auto w-[calc(100%-48px)] md:hidden"></div>

                {(passwordForm.formState.isDirty || accountForm.formState.isDirty || notificationForm.formState.isDirty) && (<div className="sticky bottom-20 md:bottom-0 px-3 md:px-0 pb-8 bg-[#0E0218] md:bg-[#0B0014] text-white">


                    <div className="flex justify-end gap-3 pt-4">
                        <div className="bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] rounded-lg p-[2px]">
                            <Button
                                size="lg"
                                type="button"
                                onClick={() => {
                                    if (passwordForm.formState.isDirty) handlePasswordCancel()
                                    if (accountForm.formState.isDirty) handleAccountCancel()
                                    if (notificationForm.formState.isDirty) handleNotificationCancel()
                                }}
                                className="border-gray-600 h-11 text-gray-300 bg-[#0B0014] hover:bg-[#0B0014]/70"
                            >
                                {tSettings('cancel')}
                            </Button>

                        </div>
                        <Button
                            type="button"
                            size="lg"
                            onClick={() => {
                                if (passwordForm.formState.isDirty) passwordFormRef.current?.requestSubmit()
                                if (accountForm.formState.isDirty) accountFormRef.current?.requestSubmit()
                                if (notificationForm.formState.isDirty) notificationFormRef.current?.requestSubmit()
                            }}
                            className="bg-gradient-to-br h-12 from-[#4C7CED] to-[#7B31DC] text-whiter"
                        >
                            {tSettings('saveChanges')}
                        </Button>
                    </div>
                </div>)}
            </div>
        </div>
    );
}

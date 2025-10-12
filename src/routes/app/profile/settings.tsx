import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "react-i18next";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authClient } from "utils/auth-client";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingPasswordInput } from "@/components/ui/floating-password-input";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute('/app/profile/settings')({
    component: ProfileSettings,
})

type AccountForm = {
    fullName: string;
    email: string;
};

type PasswordForm = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

function ProfileSettings() {
    const { t } = useTranslation('translation', { keyPrefix: 'profile-page' });
    const { data: session } = authClient.useSession();

    const [accountFormChanged, setAccountFormChanged] = useState(false);
    const [passwordFormChanged, setPasswordFormChanged] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [aiNotifications, setAiNotifications] = useState(true);

    const accountForm = useForm<AccountForm>({
        defaultValues: {
            fullName: session?.user?.name || '',
            email: session?.user?.email || ''
        }
    });

    const passwordForm = useForm<PasswordForm>();

    // Watch for changes in account form
    const accountFormValues = accountForm.watch();
    const passwordFormValues = passwordForm.watch();

    useEffect(() => {
        const subscription = accountForm.watch((values) => {
            const hasChanges = values.fullName !== (session?.user?.name || '') ||
                              values.email !== (session?.user?.email || '');
            setAccountFormChanged(hasChanges);
        });
        return () => subscription.unsubscribe();
    }, [accountForm, session]);

    useEffect(() => {
        const subscription = passwordForm.watch((values) => {
            const hasChanges = Boolean(values.currentPassword || values.newPassword || values.confirmPassword);
            setPasswordFormChanged(hasChanges);
        });
        return () => subscription.unsubscribe();
    }, [passwordForm]);

    const handleAccountCancel = () => {
        accountForm.reset({
            fullName: session?.user?.name || '',
            email: session?.user?.email || ''
        });
        setAccountFormChanged(false);
    };

    const handlePasswordCancel = () => {
        passwordForm.reset();
        setPasswordFormChanged(false);
    };

    const handleAccountSave = (data: AccountForm) => {
        // Handle account save logic
        console.log('Saving account:', data);
        setAccountFormChanged(false);
    };

    const handlePasswordSave = (data: PasswordForm) => {
        // Handle password save logic
        console.log('Saving password:', data);
        setPasswordFormChanged(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-[#1A0F33] min-h-screen text-white">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/app/profile">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-purple-800/50">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Account Settings</h1>
                    <p className="text-gray-400">Manage your account preferences and settings</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Account Information */}
                <div className="bg-[#2A2A4A] rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 2L3 7V9C3 10.1 3.9 11 5 11H19C20.1 11 21 10.1 21 9ZM12 13C9.24 13 7 15.24 7 18V20H17V18C17 15.24 14.76 13 12 13Z"/>
                        </svg>
                        <h2 className="text-xl font-semibold">Account Information</h2>
                    </div>

                    <form onSubmit={accountForm.handleSubmit(handleAccountSave)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FloatingInput
                                label="Full Name"
                                {...accountForm.register("fullName")}
                            />
                            <FloatingInput
                                label="Email Address"
                                {...accountForm.register("email")}
                            />
                        </div>

                        {accountFormChanged && (
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAccountCancel}
                                    className="border-gray-600 text-gray-300"
                                >
                                    Anulează
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Salvează modificările
                                </Button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-[#2A2A4A] rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                        </svg>
                        <h2 className="text-xl font-semibold">Modifica parola</h2>
                    </div>

                    <form onSubmit={passwordForm.handleSubmit(handlePasswordSave)} className="space-y-4">
                        <FloatingPasswordInput
                            label="Parola actuala"
                            {...passwordForm.register("currentPassword")}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FloatingPasswordInput
                                label="Parola noua"
                                {...passwordForm.register("newPassword")}
                            />
                            <FloatingPasswordInput
                                label="Confirma noua parola"
                                {...passwordForm.register("confirmPassword")}
                            />
                        </div>

                        {passwordFormChanged && (
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePasswordCancel}
                                    className="border-gray-600 text-gray-300"
                                >
                                    Anulează
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Salvează modificările
                                </Button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Language Settings */}
                <div className="bg-[#2A2A4A] rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07Z"/>
                        </svg>
                        <h2 className="text-xl font-semibold">Limba</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-400 mb-3">Limba aplicației</p>
                            <Select defaultValue="ro">
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
                </div>

                {/* Notifications */}
                <div className="bg-[#2A2A4A] rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
                        </svg>
                        <h2 className="text-xl font-semibold">Notificări</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Email Notifications</h3>
                                <p className="text-sm text-gray-400">Receive updates and alerts via email</p>
                            </div>
                            <Switch
                                checked={emailNotifications}
                                onCheckedChange={setEmailNotifications}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Push Notifications</h3>
                                <p className="text-sm text-gray-400">Get instant notifications in your browser</p>
                            </div>
                            <Switch
                                checked={pushNotifications}
                                onCheckedChange={setPushNotifications}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">AI Assistant Notifications</h3>
                                <p className="text-sm text-gray-400">Receive notifications from your AI assistant</p>
                            </div>
                            <Switch
                                checked={aiNotifications}
                                onCheckedChange={setAiNotifications}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
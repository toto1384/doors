import { useTranslation } from "react-i18next";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authClient } from "utils/auth-client";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Calendar, Eye, LogOut } from "lucide-react";

export const Route = createFileRoute('/app/profile/')({
    component: ProfileView,
})

function ProfileView() {
    const { t } = useTranslation('translation', { keyPrefix: 'profile-page.view' });
    const { t: tCommon } = useTranslation('translation', { keyPrefix: 'app-wrapper' });
    const { data: session } = authClient.useSession();
    const [isSeller, setIsSeller] = useState(false);

    // Mock data for the stats
    const stats = {
        savedProperties: { count: 12, change: `+3 ${t('thisWeek')}` },
        offersMade: { count: 5, change: `2 ${t('pending')}` },
        viewingsScheduled: { count: 3, change: t('nextTomorrow') }
    };

    // Mock data for favorite properties
    const favoriteProperties = [
        {
            id: 1,
            title: "Apartament 3 camere modern",
            location: "Sector I, București",
            price: "€180.000",
            rooms: `2 ${t('rooms')}`,
            bathrooms: `2 ${t('bathrooms')}`,
            area: "85 mp",
            image: "/placeholder-property.jpg"
        },
        {
            id: 2,
            title: "Apartament 3 camere modern",
            location: "Sector I, București", 
            price: "€180.000",
            rooms: `2 ${t('rooms')}`,
            bathrooms: `2 ${t('bathrooms')}`,
            area: "85 mp",
            image: "/placeholder-property.jpg"
        },
        {
            id: 3,
            title: "Apartament 3 camere modern",
            location: "Sector I, București",
            price: "€180.000", 
            rooms: `2 ${t('rooms')}`,
            bathrooms: `2 ${t('bathrooms')}`,
            area: "85 mp",
            image: "/placeholder-property.jpg"
        }
    ];

    return (
        <div className="p-6 md:mx-5 mt-2 border border-[#1C252E] rounded-xl min-h-screen text-white">
            {/* Profile Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback className="bg-gray-300 text-gray-600 text-2xl font-semibold">
                                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "S"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                            {session?.user?.name || 'Sarah Johnson'}
                        </h1>
                        <p className="text-gray-400 mb-3">{session?.user?.email || 'sarah.johnson@email.com'}</p>
                        
                        {/* Buyer/Seller Toggle */}
                        <div className='rounded-[5px] bg-[#32215A] w-fit flex flex-row items-center p-0.5'>
                            <button
                                className={(!isSeller ? 'bg-gradient-to-br from-[#4C7CED] to-[#7B31DC]' : '') + ` text-white text-xs px-2.5 py-[6px] rounded hover:from-blue-600 hover:to-purple-700 transition-all`}
                                onClick={() => setIsSeller(false)}
                            >
                                {tCommon('buyer')}
                            </button>
                            <button
                                className={(isSeller ? 'bg-gradient-to-br from-[#4C7CED] to-[#7B31DC]' : '') + ` text-white text-xs px-2.5 py-[6px] rounded hover:from-blue-600 hover:to-purple-700 transition-all`}
                                onClick={() => setIsSeller(true)}
                            >
                                {tCommon('seller')}
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <Link to="/app/profile/settings">
                        <Button variant="outline" className="border-[#637381] text-[#637381] hover:bg-[#637381]/10">
                            {t('accountSettings')}
                        </Button>
                    </Link>
                    <Button 
                        onClick={() => authClient.signOut()}
                        className="bg-[#1C252E] hover:bg-gray-700 text-white flex items-center gap-2"
                    >
                        {tCommon('logout')}
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Quick Overview Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">{t('quickOverview')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Saved Properties */}
                    <div className="bg-[#1C252E]/60 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[#637381] font-medium">{t('savedProperties')}</h3>
                            <Heart className="w-5 h-5 text-[#637381]" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">{stats.savedProperties.count}</div>
                        <div className="text-sm text-[#637381]">{stats.savedProperties.change}</div>
                    </div>

                    {/* Offers Made */}
                    <div className="bg-[#1C252E]/60 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[#637381] font-medium">{t('offersMade')}</h3>
                            <svg className="w-5 h-5 text-[#637381]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H17.5L13.96 12.29Z"/>
                            </svg>
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">{stats.offersMade.count}</div>
                        <div className="text-sm text-[#637381]">{stats.offersMade.change}</div>
                    </div>

                    {/* Viewings Scheduled */}
                    <div className="bg-[#1C252E]/60 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[#637381] font-medium">{t('viewingsScheduled')}</h3>
                            <Calendar className="w-5 h-5 text-[#637381]" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">{stats.viewingsScheduled.count}</div>
                        <div className="text-sm text-[#637381]">{stats.viewingsScheduled.change}</div>
                    </div>
                </div>
            </div>

            {/* Favorite Properties Section */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">{t('favoriteProperties')}</h2>
                <div className="space-y-4">
                    {favoriteProperties.map((property) => (
                        <div key={property.id} className="bg-[#1C252E]/60 rounded-lg p-6 flex items-center gap-6">
                            <div className="w-32 h-24 bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                                <img 
                                    src={property.image} 
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9Ijk2IiB2aWV3Qm94PSIwIDAgMTI4IDk2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjNEE0QTRBIi8+CjxwYXRoIGQ9Ik00OCA0MEg4MFY1Nkg0OFY0MFoiIGZpbGw9IiM2QTZBNkEiLz4KPC9zdmc+';
                                    }}
                                />
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-white mb-2">{property.title}</h3>
                                <div className="flex items-center gap-1 text-[#637381] mb-3">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    <span className="text-sm">{property.location}</span>
                                </div>
                                
                                <div className="text-2xl font-bold text-[#7B31DC] mb-4">{property.price}</div>
                                
                                <div className="flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2 bg-[#32215A] px-3 py-1.5 rounded">
                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3 9V21H9V9H3ZM5 19H7V11H5V19ZM10 9V21H16V9H10ZM12 19H14V11H12V19ZM17 9V21H23V9H17ZM19 19H21V11H19V19Z"/>
                                        </svg>
                                        <span className="text-white">{property.rooms}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#32215A] px-3 py-1.5 rounded">
                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8,14A2,2 0 0,0 6,16A2,2 0 0,0 8,18A2,2 0 0,0 10,16A2,2 0 0,0 8,14M16,14A2,2 0 0,0 14,16A2,2 0 0,0 16,18A2,2 0 0,0 18,16A2,2 0 0,0 16,14M4,4V6H20V4H4M20,7H4V8H20V7M11,9H13V12H16V14H13V17H11V14H8V12H11V9Z"/>
                                        </svg>
                                        <span className="text-white">{property.bathrooms}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#32215A] px-3 py-1.5 rounded">
                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M2,2V4H4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V4H22V2H2M6,4H18V20H6V4M8,6V18H10V6H8M12,6V18H14V6H12M16,6V18H18V6H16Z"/>
                                        </svg>
                                        <span className="text-white">{property.area}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Button className="bg-[#7B31DC] hover:bg-[#6A2BC4] text-white px-6">
                                    {t('viewDetails')}
                                </Button>
                                <Button variant="ghost" size="icon" className="text-[#637381] hover:text-white">
                                    <Heart className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

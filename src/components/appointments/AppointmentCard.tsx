import { Link } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon, Clock, MessageCircle, ExternalLink, Star, AlertCircle } from 'lucide-react'
import { format, isPast } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { BedIcon, BathIcon, SurfaceAreaIcon, LocationIcon } from '../icons/propertyIcons'

interface AppointmentCardProps {
    appointment: any
    onStatusUpdate: (id: string, status: any) => void
    userRole: 'buyer' | 'seller'
}

export function AppointmentCard({ appointment, onStatusUpdate, userRole }: AppointmentCardProps) {
    const { t } = useTranslation()

    const getStatusBadge = (status: string) => {
        const translationKey = userRole === 'buyer' ? 'buyer-appointments' : 'bookings'

        switch (status) {
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">{t(`${translationKey}.statusPending`)}</Badge>
            case 'confirmed':
                return <Badge variant="default" className="bg-green-500/20 text-green-400">{t(`${translationKey}.statusConfirmed`)}</Badge>
            case 'cancelled-by-buyer':
            case 'cancelled-by-seller':
                return <Badge variant="destructive" className="bg-red-500/20 text-red-400">{t(`${translationKey}.statusCancelled`)}</Badge>
            case 'completed':
                return <Badge variant="outline" className="bg-blue-500/20 text-blue-400">{t(`${translationKey}.statusCompleted`)}</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const isAppointmentPast = appointment.date ? isPast(new Date(appointment.date)) : false
    const translationKey = userRole === 'buyer' ? 'buyer-appointments' : 'bookings'

    return (
        <Card className="bg-[#2A2A3E]/50 p-1 border-slate-600 hover:bg-[#2A2A3E]/70 transition-colors">
            <CardContent className="p-1">
                <div className="flex flex-col md:flex-row items-start gap-4">
                    {/* Property Image */}
                    {appointment.property?.imageUrls?.[0] && (
                        <img
                            src={appointment.property.imageUrls[0]}
                            alt={appointment.property.title}
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                    )}

                    {/* Appointment Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-white text-base mb-1">
                                    {appointment.property?.title || 'Property'}
                                </h3>
                                {appointment.property?.location && (
                                    <p className="text-slate-400 text-sm flex items-center gap-1">
                                        <LocationIcon className="w-3 h-3" color="#94a3b8" />
                                        {appointment.property.location.fullLocationName}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusBadge(appointment.status)}
                                {isAppointmentPast && appointment.status !== 'completed' && (
                                    <Badge variant="outline" className="bg-orange-500/20 text-orange-400">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Past Due
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Time and Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                                <CalendarIcon className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-300">
                                    {appointment.date && format(new Date(appointment.date), 'EEEE, MMM d, yyyy')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-300">
                                    {appointment.startTime} - {appointment.endTime}
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="text-base font-bold mb-4">
                            €{appointment.property?.price?.value?.toLocaleString() || '0'}
                        </div>

                        {/* Property Features */}
                        {appointment.property && (
                            <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                                {appointment.property.numberOfRooms && (
                                    <span className="flex flex-row items-center gap-1 rounded bg-[#32215A] px-2 py-0.5">
                                        {appointment.property.numberOfRooms}
                                        <BedIcon className="w-3 h-3" color="#ffffff" />
                                    </span>
                                )}
                                {appointment.property.numberOfBathrooms && (
                                    <span className="flex flex-row items-center gap-1 rounded bg-[#32215A] px-2 py-0.5">
                                        {appointment.property.numberOfBathrooms}
                                        <BathIcon className="w-3 h-3" color="#ffffff" />
                                    </span>
                                )}
                                {appointment.property.surfaceArea && (
                                    <span className="flex flex-row items-center gap-1 rounded bg-[#32215A] px-2 py-0.5">
                                        {appointment.property.surfaceArea}m²
                                        <SurfaceAreaIcon className="w-3 h-3" color="#ffffff" />
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Actions - Different based on user role */}
                        <div className="flex gap-2">
                            {/* Common action - View Property (only for buyers) */}
                            {userRole === 'buyer' && (
                                <Link
                                    to="/app/properties/$id"
                                    params={{ id: appointment.propertyId }}
                                    className="inline-flex"
                                >
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                    >
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        {t(`${translationKey}.viewProperty`)}
                                    </Button>
                                </Link>
                            )}

                            {/* Seller Actions */}
                            {userRole === 'seller' && (
                                <>
                                    {appointment.status === 'pending' && (
                                        <>
                                            <Button
                                                size="sm"
                                                onClick={() => onStatusUpdate(appointment._id, 'confirmed')}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                {t(`${translationKey}.confirm`)}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onStatusUpdate(appointment._id, 'cancelled-by-seller')}
                                                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                            >
                                                {t(`${translationKey}.cancel`)}
                                            </Button>
                                        </>
                                    )}

                                    {appointment.status === 'confirmed' && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onStatusUpdate(appointment._id, 'cancelled-by-seller')}
                                                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                            >
                                                {t(`${translationKey}.cancel`)}
                                            </Button>
                                            {/* <Button */}
                                            {/*     size="sm" */}
                                            {/*     className="bg-blue-600 hover:bg-blue-700 text-white" */}
                                            {/* > */}
                                            {/*     {t(`${translationKey}.reschedule`)} */}
                                            {/* </Button> */}
                                        </>
                                    )}
                                </>
                            )}

                            {/* Buyer Actions */}
                            {userRole === 'buyer' && (
                                <>
                                    {appointment.status === 'pending' && !isAppointmentPast && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onStatusUpdate(appointment._id, 'cancelled-by-buyer')}
                                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                        >
                                            {t(`${translationKey}.cancel`)}
                                        </Button>
                                    )}

                                    {appointment.status === 'confirmed' && !isAppointmentPast && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onStatusUpdate(appointment._id, 'cancelled-by-buyer')}
                                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                        >
                                            {t(`${translationKey}.cancel`)}
                                        </Button>
                                    )}

                                    {isAppointmentPast && appointment.status === 'confirmed' && (
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => onStatusUpdate(appointment._id, 'completed')}
                                        >
                                            <Star className="w-3 h-3 mr-1" />
                                            {t(`${translationKey}.markCompleted`)}
                                        </Button>
                                    )}
                                </>
                            )}

                            {/* Contact action - available for both roles when appointment is active */}
                            {/*(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                >
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    {t(`${translationKey}.contact`)}
                                </Button>
                            )*/}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

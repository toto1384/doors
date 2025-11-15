import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar as CalendarIcon, Clock, User, MapPin, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, isSameDay, addMonths, subMonths, startOfDay, endOfDay } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { useTRPC } from '../../../../trpc/react'
import { toast } from 'sonner'

export const Route = createFileRoute('/app/my-properties/bookings')({
    component: BookingsManagementPage,
})

function BookingsManagementPage() {
    const { t } = useTranslation()
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const trpc = useTRPC()

    // Get all appointments where user is the receiver (seller)
    const { data: appointmentsData, refetch } = useQuery(
        trpc.appointments.getSellerAppointments.queryOptions()
    )

    const updateStatusMutation = useMutation(trpc.appointments.updateAppointmentStatus.mutationOptions({
        onSuccess: () => {
            toast.success('Appointment status updated successfully!')
            refetch()
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update appointment status')
        }
    }))

    // Get seller appointments (already filtered by backend)
    const sellerAppointments = appointmentsData?.appointments || []

    // Filter appointments by selected date
    const filteredAppointments = selectedDate
        ? sellerAppointments.filter(apt =>
            apt.date && isSameDay(new Date(apt.date), selectedDate)
        )
        : sellerAppointments

    // Get dates that have appointments for calendar highlighting
    const appointmentDates = sellerAppointments.map(apt =>
        apt.date ? new Date(apt.date) : null
    ).filter(Boolean) as Date[]

    const handleStatusUpdate = (appointmentId: string, status: 'confirmed' | 'cancelled') => {
        updateStatusMutation.mutate({ appointmentId, status })
    }

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
    }

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1))
    }

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1))
    }

    const goToToday = () => {
        const today = new Date()
        setCurrentMonth(today)
        setSelectedDate(today)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B0014] to-[#1A0B2E] text-white p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">{t('bookings.title')}</h1>
                    <p className="text-slate-300">{t('bookings.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar Section */}
                    <div className="lg:col-span-1">
                        <Card className="bg-[#1A1A2E]/50 border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg text-white">
                                        {format(currentMonth, 'MMMM yyyy')}
                                    </CardTitle>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={prevMonth}
                                            className="h-8 w-8 p-0 hover:bg-slate-700"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={nextMonth}
                                            className="h-8 w-8 p-0 hover:bg-slate-700"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={goToToday}
                                            className="ml-2 text-xs"
                                        >
                                            {t('bookings.todayButton')}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    month={currentMonth}
                                    onMonthChange={setCurrentMonth}
                                    className="w-full"
                                    modifiers={{
                                        hasAppointment: appointmentDates,
                                    }}
                                    modifiersStyles={{
                                        hasAppointment: {
                                            backgroundColor: 'rgba(59, 130, 246, 0.5)',

                                            borderRadius: '6px',
                                            fontWeight: 'bold'
                                        }
                                    }}
                                />
                                <div className="mt-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-3 h-3 bg-blue-500/50 rounded"></div>
                                        <span>{t('bookings.daysWithAppointments')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-600 rounded"></div>
                                        <span>{t('bookings.selectedDate')}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Appointments List */}
                    <div className="lg:col-span-2">
                        <Card className="bg-[#1A1A2E]/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">
                                    {selectedDate
                                        ? `${t('bookings.appointmentsFor')} ${format(selectedDate, 'EEEE, MMMM d')}`
                                        : t('bookings.upcomingViewings')
                                    }
                                </CardTitle>
                                <p className="text-slate-400 text-sm">
                                    {filteredAppointments.length} {filteredAppointments.length === 1 ? t('bookings.appointmentCount') : t('bookings.appointmentsCount')}
                                    {selectedDate && ' on this day'}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {filteredAppointments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <CalendarIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-slate-300 mb-2">{t('bookings.noAppointments')}</h3>
                                        <p className="text-slate-500">
                                            {selectedDate
                                                ? t('bookings.noAppointmentsDate')
                                                : t('bookings.noAppointmentsGeneral')
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredAppointments.map((appointment) => (
                                            <AppointmentCard
                                                key={appointment._id}
                                                appointment={appointment}
                                                onStatusUpdate={handleStatusUpdate}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Appointment Card Component
function AppointmentCard({
    appointment,
    onStatusUpdate
}: {
    appointment: any
    onStatusUpdate: (id: string, status: 'confirmed' | 'cancelled') => void
}) {
    const { t } = useTranslation()

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">{t('bookings.statusPending')}</Badge>
            case 'confirmed':
                return <Badge variant="default" className="bg-green-500/20 text-green-400">{t('bookings.statusConfirmed')}</Badge>
            case 'cancelled':
                return <Badge variant="destructive" className="bg-red-500/20 text-red-400">{t('bookings.statusCancelled')}</Badge>
            case 'completed':
                return <Badge variant="outline" className="bg-blue-500/20 text-blue-400">{t('bookings.statusCompleted')}</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <Card className="bg-[#2A2A3E]/50 border-slate-600 hover:bg-[#2A2A3E]/70 transition-colors">
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
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
                                <h3 className="font-semibold text-white text-lg mb-1">
                                    {appointment.property?.title || 'Property'}
                                </h3>
                                {appointment.property?.location && (
                                    <p className="text-slate-400 text-sm flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {appointment.property.location.address}
                                    </p>
                                )}
                            </div>
                            {getStatusBadge(appointment.status)}
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
                        <div className="text-2xl font-bold text-blue-400 mb-4">
                            €{appointment.property?.price?.value?.toLocaleString() || '0'}
                        </div>

                        {/* Property Features */}
                        {appointment.property && (
                            <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                                {appointment.property.numberOfRooms && (
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 bg-slate-600 rounded flex items-center justify-center">
                                            <span className="text-xs">🛏</span>
                                        </div>
                                        <span>{appointment.property.numberOfRooms} camere</span>
                                    </div>
                                )}
                                {appointment.property.numberOfBathrooms && (
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 bg-slate-600 rounded flex items-center justify-center">
                                            <span className="text-xs">🚿</span>
                                        </div>
                                        <span>{appointment.property.numberOfBathrooms} băi</span>
                                    </div>
                                )}
                                {appointment.property.surfaceArea && (
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 bg-slate-600 rounded flex items-center justify-center">
                                            <span className="text-xs">📐</span>
                                        </div>
                                        <span>{appointment.property.surfaceArea} mp</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        {appointment.status === 'pending' && (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => onStatusUpdate(appointment._id, 'confirmed')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {t('bookings.confirm')}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onStatusUpdate(appointment._id, 'cancelled')}
                                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                >
                                    {t('bookings.cancel')}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                >
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    {t('bookings.contact')}
                                </Button>
                            </div>
                        )}

                        {appointment.status === 'confirmed' && (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onStatusUpdate(appointment._id, 'cancelled')}
                                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                >
                                    {t('bookings.cancel')}
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {t('bookings.reschedule')}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                >
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    {t('bookings.contact')}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

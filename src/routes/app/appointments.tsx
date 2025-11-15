import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar as CalendarIcon, Clock, User, MapPin, Phone, MessageCircle, ChevronLeft, ChevronRight, ExternalLink, Star, AlertCircle } from 'lucide-react'
import { format, isSameDay, addMonths, subMonths, startOfDay, endOfDay, isPast, isBefore } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { useTRPC } from '../../../trpc/react'
import { toast } from 'sonner'
import { ViewingScheduleModal } from '@/components/scheduling/ViewingScheduleModal'

export const Route = createFileRoute('/app/appointments')({
    component: BuyerAppointmentsPage,
})

function BuyerAppointmentsPage() {
    const { t } = useTranslation()
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [rescheduleAppointment, setRescheduleAppointment] = useState<any>(null)
    const trpc = useTRPC()

    // Get all appointments where user is the initiator (buyer)
    const { data: appointmentsData, refetch } = useQuery(
        trpc.appointments.getBuyerAppointments.queryOptions()
    )

    const updateStatusMutation = useMutation(trpc.appointments.updateAppointmentStatus.mutationOptions({
        onSuccess: () => {
            toast.success('Appointment updated successfully!')
            refetch()
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update appointment')
        }
    }))

    // Get seller availability for rescheduling
    // const { data: sellerAvailability } = useQuery(
    //   rescheduleAppointment ? 
    //     trpc.appointments.getSellerAvailability.queryOptions({ 
    //       propertyId: rescheduleAppointment.propertyId,
    //       month: currentMonth.getMonth() + 1,
    //       year: currentMonth.getFullYear()
    //     }) :
    //     { queryKey: ['appointments.getSellerAvailability'], queryFn: () => null, enabled: false }
    // )
    // 
    // const { data: existingBookings } = useQuery(
    //   rescheduleAppointment ?
    //     trpc.appointments.getExistingBookings.queryOptions({ propertyId: rescheduleAppointment.propertyId }) :
    //     { queryKey: ['appointments.getExistingBookings'], queryFn: () => null, enabled: false }
    // )

    // Get buyer appointments (already filtered by backend)
    const buyerAppointments = appointmentsData?.appointments || []

    // Filter appointments by selected date
    const filteredAppointments = selectedDate
        ? buyerAppointments.filter(apt =>
            apt.date && isSameDay(new Date(apt.date), selectedDate)
        )
        : buyerAppointments

    // Get dates that have appointments for calendar highlighting
    const appointmentDates = buyerAppointments.map(apt =>
        apt.date ? new Date(apt.date) : null
    ).filter(Boolean) as Date[]

    const handleStatusUpdate = (appointmentId: string, status: 'cancelled' | 'completed') => {
        updateStatusMutation.mutate({ appointmentId, status })
    }

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
    }

    const handleReschedule = (appointment: any) => {
        setRescheduleAppointment(appointment)
    }

    const handleRescheduleViewing = async (date: Date, time: string) => {
        if (!rescheduleAppointment) return

        const endTime = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        endTime.setHours(hours, minutes + 30, 0, 0);

        const endTimeString = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

        // Cancel current appointment and create new one
        await updateStatusMutation.mutateAsync({
            appointmentId: rescheduleAppointment._id,
            status: 'cancelled'
        })

        // Create new appointment via the existing scheduleViewing mutation
        const scheduleResult = (props: any) => { }
        //         await trpc.appointments.scheduleViewing.mutate({
        //   propertyId: rescheduleAppointment.propertyId,
        //   date: date,
        //   startTime: time,
        //   endTime: endTimeString,
        // })

        setRescheduleAppointment(null)
        toast.success('Viewing rescheduled successfully!')
        refetch()
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
                    <h1 className="text-3xl font-bold text-white mb-2">{t('buyer-appointments.title')}</h1>
                    <p className="text-slate-300">{t('buyer-appointments.subtitle')}</p>
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
                                            {t('buyer-appointments.todayButton')}
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
                                        <span>{t('buyer-appointments.daysWithAppointments')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-600 rounded"></div>
                                        <span>{t('buyer-appointments.selectedDate')}</span>
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
                                        ? `${t('buyer-appointments.appointmentsFor')} ${format(selectedDate, 'EEEE, MMMM d')}`
                                        : t('buyer-appointments.upcomingViewings')
                                    }
                                </CardTitle>
                                <p className="text-slate-400 text-sm">
                                    {filteredAppointments.length} {filteredAppointments.length === 1 ? t('buyer-appointments.appointmentCount') : t('buyer-appointments.appointmentsCount')}
                                    {selectedDate && ' on this day'}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {filteredAppointments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <CalendarIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-slate-300 mb-2">{t('buyer-appointments.noAppointments')}</h3>
                                        <p className="text-slate-500">
                                            {selectedDate
                                                ? t('buyer-appointments.noAppointmentsDate')
                                                : t('buyer-appointments.noAppointmentsGeneral')
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredAppointments.map((appointment) => (
                                            <BuyerAppointmentCard
                                                key={appointment._id}
                                                appointment={appointment}
                                                onStatusUpdate={handleStatusUpdate}
                                                onReschedule={() => handleReschedule(appointment)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Reschedule Modal */}
                {rescheduleAppointment && (
                    <ViewingScheduleModal
                        isOpen={!!rescheduleAppointment}
                        onClose={() => setRescheduleAppointment(null)}
                        property={rescheduleAppointment.property}
                        sellerAvailability={{ availableSlots: [] }}
                        existingBookings={[]}
                        // sellerAvailability={sellerAvailability || { availableSlots: [] }}
                        // existingBookings={existingBookings?.existingBookings || []}
                        onScheduleViewing={handleRescheduleViewing}
                    />
                )}
            </div>
        </div>
    )
}

// Buyer Appointment Card Component
function BuyerAppointmentCard({
    appointment,
    onStatusUpdate,
    onReschedule
}: {
    appointment: any
    onStatusUpdate: (id: string, status: 'cancelled' | 'completed') => void
    onReschedule: () => void
}) {
    const { t } = useTranslation()

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">{t('buyer-appointments.statusPending')}</Badge>
            case 'confirmed':
                return <Badge variant="default" className="bg-green-500/20 text-green-400">{t('buyer-appointments.statusConfirmed')}</Badge>
            case 'cancelled':
                return <Badge variant="destructive" className="bg-red-500/20 text-red-400">{t('buyer-appointments.statusCancelled')}</Badge>
            case 'completed':
                return <Badge variant="outline" className="bg-blue-500/20 text-blue-400">{t('buyer-appointments.statusCompleted')}</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const isAppointmentPast = appointment.date ? isPast(new Date(appointment.date)) : false
    const canReschedule = appointment.status === 'pending' || appointment.status === 'confirmed'

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
                        <div className="flex gap-2">
                            {/* Always show View Property */}
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
                                    {t('buyer-appointments.viewProperty')}
                                </Button>
                            </Link>

                            {/* Actions based on status and timing */}
                            {appointment.status === 'pending' && !isAppointmentPast && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onStatusUpdate(appointment._id, 'cancelled')}
                                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                >
                                    {t('buyer-appointments.cancel')}
                                </Button>
                            )}

                            {appointment.status === 'confirmed' && !isAppointmentPast && (
                                <>
                                    <Button
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={onReschedule}
                                    >
                                        {t('buyer-appointments.reschedule')}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onStatusUpdate(appointment._id, 'cancelled')}
                                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                    >
                                        {t('buyer-appointments.cancel')}
                                    </Button>
                                </>
                            )}

                            {isAppointmentPast && appointment.status === 'confirmed' && (
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => onStatusUpdate(appointment._id, 'completed')}
                                >
                                    <Star className="w-3 h-3 mr-1" />
                                    {t('buyer-appointments.markCompleted')}
                                </Button>
                            )}

                            {/* Contact action for active appointments */}
                            {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                >
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    {t('buyer-appointments.contact')}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

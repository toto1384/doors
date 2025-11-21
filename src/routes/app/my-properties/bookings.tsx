import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, isSameDay, addMonths, subMonths } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { useTRPC } from '../../../../trpc/react'
import { toast } from 'sonner'
import { AppointmentCard } from '@/components/appointments/AppointmentCard'

export const Route = createFileRoute('/app/my-properties/bookings')({
    component: BookingsManagementPage,
})

function BookingsManagementPage() {
    const { t } = useTranslation()
    const [selectedDate, setSelectedDate] = useState<Date | undefined>()
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

    const handleStatusUpdate = (appointmentId: string, status: 'confirmed' | 'cancelled-by-buyer' | 'cancelled-by-seller' | 'completed') => {
        updateStatusMutation.mutate({ appointmentId, status })
    }

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
    }

    return (
        <div className="min-h-screen text-white p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">{t('bookings.title')}</h1>
                    <p className="text-slate-300">{t('bookings.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar Section */}
                    <div >
                        <Card className="bg-[#1A1A2E]/50 p-2 border-slate-700">
                            <CardContent className='px-0'>
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
                                    <Button
                                        className='bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] text-white text-xs px-4 py-2 rounded-[6px] mt-3'
                                        onClick={() => handleDateSelect(undefined)}
                                    >See All Dates</Button>
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
                                                userRole="seller"
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


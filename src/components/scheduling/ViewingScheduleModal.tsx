import React, { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, User, MapPin, X } from 'lucide-react'
import { format, isBefore, parse } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { PropertyObject } from 'utils/validation/types'


export function ViewingScheduleModal({
    isOpen,
    onClose,
    property,
    sellerAvailability,
    existingBookings,
    onScheduleViewing
}: {
    isOpen: boolean
    onClose: () => void
    property: Partial<PropertyObject>
    sellerAvailability: { availableSlots: { date: string, availableBookings: string[] }[] },
    existingBookings: { date: Date, startTime: string, endTime: string }[],
    onScheduleViewing: (date: Date, time: string) => void
}) {
    const { t } = useTranslation()
    const [selectedDate, setSelectedDate] = useState<Date | undefined>()
    const [selectedTime, setSelectedTime] = useState<string | undefined>()
    const [isScheduling, setIsScheduling] = useState(false)

    // Get available dates from the new API response
    const availableDates = useMemo(() => {
        if (!sellerAvailability?.availableSlots) return []
        
        return sellerAvailability.availableSlots
            .filter(slot => slot.availableBookings.length > 0)
            .map(slot => {
                const [day, month, year] = slot.date.split('-')
                return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
            })
    }, [sellerAvailability])


    // Get available time slots for selected date
    const availableTimeSlots = useMemo(() => {
        if (!selectedDate || !sellerAvailability?.availableSlots) return []

        const selectedDateString = format(selectedDate, 'dd-MM-yyyy')
        const daySlot = sellerAvailability.availableSlots.find(slot => slot.date === selectedDateString)
        
        return daySlot?.availableBookings || []
    }, [selectedDate, sellerAvailability])

    const handleSchedule = async () => {
        if (!selectedDate || !selectedTime) return

        setIsScheduling(true)
        try {
            await onScheduleViewing(selectedDate, selectedTime)
            onClose()
        } catch (error) {
            console.error('Error scheduling viewing:', error)
        } finally {
            setIsScheduling(false)
        }
    }

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        setSelectedTime(undefined) // Reset time when date changes
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {t('property-page.scheduleViewing')}
                    </DialogTitle>
                </DialogHeader>

                {/* Property Info */}
                <Card className="mb-4">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            {property.imageUrls && property.imageUrls[0] && (
                                <img
                                    src={property.imageUrls[0]}
                                    alt={property.title}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                            )}
                            <div>
                                <h3 className="font-semibold">{property.title}</h3>
                                {property.location && (
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {property.location.fullLocationName}
                                    </p>
                                )}
                                {property.price && (
                                    <p className="text-lg font-bold text-blue-600">
                                        €{property.price.value?.toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Calendar Section */}
                    <div>
                        <h3 className="font-semibold mb-3">Select a Date</h3>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={(date) =>
                                isBefore(date, new Date()) ||
                                !availableDates.some(availableDate =>
                                    format(availableDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                                )
                            }
                            className="rounded-md border"
                        />
                    </div>

                    {/* Time Slots Section */}
                    <div>
                        <h3 className="font-semibold mb-3">
                            {selectedDate ? (
                                <>Available Times for {format(selectedDate, 'EEEE, MMMM d')}</>
                            ) : (
                                'Select a date to see available times'
                            )}
                        </h3>

                        {selectedDate && (
                            <div className="space-y-3">
                                {availableTimeSlots.length === 0 ? (
                                    <p className="text-gray-500 text-sm">
                                        No available time slots for this date.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2">
                                        {availableTimeSlots.map((time) => (
                                            <Button
                                                key={time}
                                                variant={selectedTime === time ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setSelectedTime(time)}
                                                className="flex items-center gap-1 h-10"
                                            >
                                                <Clock className="w-3 h-3" />
                                                {time}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Selected Summary */}
                        {selectedDate && selectedTime && (
                            <Card className="mt-4">
                                <CardContent className="p-4">
                                    <h4 className="font-semibold mb-2">Viewing Summary</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {selectedTime} - {format(new Date(parse(selectedTime, 'HH:mm', new Date()).getTime() + 60 * 60 * 1000), 'HH:mm')}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Property viewing (1 hour)
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSchedule}
                        disabled={!selectedDate || !selectedTime || isScheduling}
                        className="bg-gradient-to-br from-[#4C7CED] to-[#7B31DC]"
                    >
                        {isScheduling ? 'Scheduling...' : 'Schedule Viewing'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

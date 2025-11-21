import { describe, it, expect, beforeEach } from 'vitest'
import {
    calculateAvailableSlots,
    generateRandomSellerAvailability,
    generateRandomBookings,
    SellerAvailability,
    ExistingBooking
} from './scheduleUtils'

describe('scheduleUtils', () => {
    describe('calculateAvailableSlots', () => {
        const basicAvailability: SellerAvailability[] = [
            {
                startDate: 'Monday',
                endDate: 'Friday',
                startTime: '09:00',
                endTime: '17:00'
            }
        ]

        it('should return empty array for month with no availability', () => {
            const result = calculateAvailableSlots({
                sellerAvailability: [],
                existingBookings: [],
                month: 12,
                year: 2024,
                skipPastDates: false
            })

            expect(result).toEqual([])
        })

        it('should exclude booked time slots', () => {
            const existingBookings: ExistingBooking[] = [
                {
                    date: new Date(2024, 11, 2), // December 2nd, 2024 (Monday)
                    startTime: '10:00',
                    endTime: '11:00'
                }
            ]

            const result = calculateAvailableSlots({
                sellerAvailability: basicAvailability,
                existingBookings,
                month: 12,
                year: 2024,
                skipPastDates: false
            })

            // Find December 2nd
            const dec2Slot = result.find(slot => slot.date === '02-12-2024')
            expect(dec2Slot).toBeDefined()
            expect(dec2Slot?.availableBookings).not.toContain('10:00')
            expect(dec2Slot?.availableBookings).toContain('09:00')
            expect(dec2Slot?.availableBookings).toContain('11:00')
        })



        it('should skip past dates when skipPastDates is true', () => {
            const today = new Date()
            const currentMonth = today.getMonth() + 1
            const currentYear = today.getFullYear()

            const result = calculateAvailableSlots({
                sellerAvailability: basicAvailability,
                existingBookings: [],
                month: currentMonth,
                year: currentYear,
                skipPastDates: true
            })

            // All dates should be in the future
            result.forEach(slot => {
                const [day, month, year] = slot.date.split('-').map(Number)
                const slotDate = new Date(year, month - 1, day)
                expect(slotDate >= today).toBe(true)
            })
        })

        it('should include past dates when skipPastDates is false', () => {
            const result = calculateAvailableSlots({
                sellerAvailability: basicAvailability,
                existingBookings: [],
                month: 1, // January (past month)
                year: 2024,
                skipPastDates: false
            })

            expect(result.length).toBeGreaterThan(0)
        })


        it('handle booked time slots and generate 1-hour time slots', () => {
            const result = calculateAvailableSlots({
                sellerAvailability: [{
                    startDate: 'Monday',
                    endDate: 'Sunday',
                    startTime: '10:00',
                    endTime: '13:00'
                }],
                existingBookings: [
                    {
                        date: new Date(2024, 11, 1), // December 1nd, 2024 (Monday)
                        startTime: '10:00',
                        endTime: '11:00'
                    }
                ],
                month: 12,
                year: 2024,
                skipPastDates: false
            })

            console.log('result', result)

            const firstSlot = result[0]
            expect(firstSlot.availableBookings).toEqual(['11:00', '12:00'])
        })
    })



})

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

        it('should generate correct available slots for weekdays only', () => {
            const result = calculateAvailableSlots({
                sellerAvailability: basicAvailability,
                existingBookings: [],
                month: 12, // December 2024
                year: 2024,
                skipPastDates: false
            })
            
            // Should only have weekdays (Mon-Fri)
            expect(result.length).toBeGreaterThan(0)
            
            // Check first few results
            const firstSlot = result[0]
            expect(firstSlot.date).toMatch(/^\d{2}-12-2024$/)
            expect(firstSlot.availableBookings).toContain('09:00')
            expect(firstSlot.availableBookings).toContain('16:00')
            expect(firstSlot.availableBookings).not.toContain('17:00') // End time not included
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

        it('should handle weekend availability', () => {
            const weekendAvailability: SellerAvailability[] = [
                {
                    startDate: 'Saturday',
                    endDate: 'Sunday',
                    startTime: '10:00',
                    endTime: '16:00'
                }
            ]

            const result = calculateAvailableSlots({
                sellerAvailability: weekendAvailability,
                existingBookings: [],
                month: 12,
                year: 2024,
                skipPastDates: false
            })

            expect(result.length).toBeGreaterThan(0)
            
            // Should contain Saturday and Sunday slots only
            const timeSlots = result[0].availableBookings
            expect(timeSlots).toContain('10:00')
            expect(timeSlots).toContain('15:00')
            expect(timeSlots).not.toContain('16:00')
        })

        it('should handle week wraparound availability (Friday to Monday)', () => {
            const wraparoundAvailability: SellerAvailability[] = [
                {
                    startDate: 'Friday',
                    endDate: 'Monday',
                    startTime: '14:00',
                    endTime: '18:00'
                }
            ]

            const result = calculateAvailableSlots({
                sellerAvailability: wraparoundAvailability,
                existingBookings: [],
                month: 12,
                year: 2024,
                skipPastDates: false
            })

            expect(result.length).toBeGreaterThan(0)
            
            // Should have Friday, Saturday, Sunday, Monday slots
            // Check that we have slots for multiple days of week
            const allDates = result.map(slot => {
                const [day, month, year] = slot.date.split('-').map(Number)
                const date = new Date(year, month - 1, day)
                return date.getDay() // 0=Sunday, 1=Monday, ... 5=Friday, 6=Saturday
            })
            
            expect(allDates).toContain(0) // Sunday
            expect(allDates).toContain(1) // Monday
            expect(allDates).toContain(5) // Friday
            expect(allDates).toContain(6) // Saturday
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

        it('should handle multiple availability periods', () => {
            const multipleAvailability: SellerAvailability[] = [
                {
                    startDate: 'Monday',
                    endDate: 'Wednesday',
                    startTime: '09:00',
                    endTime: '12:00'
                },
                {
                    startDate: 'Monday',
                    endDate: 'Wednesday',
                    startTime: '14:00',
                    endTime: '17:00'
                }
            ]

            const result = calculateAvailableSlots({
                sellerAvailability: multipleAvailability,
                existingBookings: [],
                month: 12,
                year: 2024,
                skipPastDates: false
            })

            expect(result.length).toBeGreaterThan(0)
            
            const firstSlot = result[0]
            // Should have morning and afternoon slots
            expect(firstSlot.availableBookings).toContain('09:00')
            expect(firstSlot.availableBookings).toContain('11:00')
            expect(firstSlot.availableBookings).toContain('14:00')
            expect(firstSlot.availableBookings).toContain('16:00')
            // Should not have lunch break or end times
            expect(firstSlot.availableBookings).not.toContain('12:00')
            expect(firstSlot.availableBookings).not.toContain('13:00')
            expect(firstSlot.availableBookings).not.toContain('17:00')
        })

        it('should generate 1-hour time slots', () => {
            const result = calculateAvailableSlots({
                sellerAvailability: [{
                    startDate: 'Monday',
                    endDate: 'Monday',
                    startTime: '10:00',
                    endTime: '13:00'
                }],
                existingBookings: [],
                month: 12,
                year: 2024,
                skipPastDates: false
            })

            const firstSlot = result[0]
            expect(firstSlot.availableBookings).toEqual(['10:00', '11:00', '12:00'])
        })
    })

    describe('generateRandomSellerAvailability', () => {
        it('should generate specified number of availability periods', () => {
            const availability = generateRandomSellerAvailability(3)
            expect(availability).toHaveLength(3)
        })

        it('should generate valid availability periods', () => {
            const availability = generateRandomSellerAvailability(5)
            
            availability.forEach(period => {
                expect(period.startDate).toMatch(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/)
                expect(period.endDate).toMatch(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/)
                expect(period.startTime).toMatch(/^\d{2}:00$/)
                expect(period.endTime).toMatch(/^\d{2}:00$/)
                
                // Start time should be before end time (or equal for same day)
                const startHour = parseInt(period.startTime.split(':')[0])
                const endHour = parseInt(period.endTime.split(':')[0])
                expect(endHour).toBeGreaterThan(startHour)
            })
        })

        it('should generate different availability periods on multiple calls', () => {
            const availability1 = generateRandomSellerAvailability(2)
            const availability2 = generateRandomSellerAvailability(2)
            
            // It's very unlikely (but possible) they're identical, so we test multiple times
            let different = false
            for (let i = 0; i < 10; i++) {
                const a1 = generateRandomSellerAvailability(3)
                const a2 = generateRandomSellerAvailability(3)
                if (JSON.stringify(a1) !== JSON.stringify(a2)) {
                    different = true
                    break
                }
            }
            expect(different).toBe(true)
        })
    })

    describe('generateRandomBookings', () => {
        it('should generate specified number of bookings', () => {
            const bookings = generateRandomBookings(12, 2024, 3)
            expect(bookings).toHaveLength(3)
        })

        it('should generate bookings within the specified month', () => {
            const bookings = generateRandomBookings(12, 2024, 5)
            
            bookings.forEach(booking => {
                expect(booking.date.getMonth()).toBe(11) // December = 11
                expect(booking.date.getFullYear()).toBe(2024)
                expect(booking.date.getDate()).toBeGreaterThanOrEqual(1)
                expect(booking.date.getDate()).toBeLessThanOrEqual(31)
            })
        })

        it('should generate valid 1-hour bookings', () => {
            const bookings = generateRandomBookings(6, 2024, 10)
            
            bookings.forEach(booking => {
                expect(booking.startTime).toMatch(/^\d{2}:00$/)
                expect(booking.endTime).toMatch(/^\d{2}:00$/)
                
                const startHour = parseInt(booking.startTime.split(':')[0])
                const endHour = parseInt(booking.endTime.split(':')[0])
                expect(endHour).toBe(startHour + 1) // 1 hour duration
            })
        })
    })

    describe('integration tests with random data', () => {
        it('should handle random availability and bookings without errors', () => {
            for (let i = 0; i < 10; i++) {
                const availability = generateRandomSellerAvailability(2)
                const bookings = generateRandomBookings(12, 2024, 3)
                
                expect(() => {
                    const result = calculateAvailableSlots({
                        sellerAvailability: availability,
                        existingBookings: bookings,
                        month: 12,
                        year: 2024,
                        skipPastDates: false
                    })
                    expect(Array.isArray(result)).toBe(true)
                }).not.toThrow()
            }
        })

        it('should produce consistent results with same input data', () => {
            const availability = generateRandomSellerAvailability(2)
            const bookings = generateRandomBookings(12, 2024, 3)
            
            const result1 = calculateAvailableSlots({
                sellerAvailability: availability,
                existingBookings: bookings,
                month: 12,
                year: 2024,
                skipPastDates: false
            })
            
            const result2 = calculateAvailableSlots({
                sellerAvailability: availability,
                existingBookings: bookings,
                month: 12,
                year: 2024,
                skipPastDates: false
            })
            
            expect(result1).toEqual(result2)
        })

        it('should respect booking conflicts in random scenarios', () => {
            const availability: SellerAvailability[] = [
                {
                    startDate: 'Monday',
                    endDate: 'Friday',
                    startTime: '09:00',
                    endTime: '17:00'
                }
            ]
            
            const bookings: ExistingBooking[] = [
                {
                    date: new Date(2024, 11, 2), // Monday Dec 2nd
                    startTime: '10:00',
                    endTime: '11:00'
                },
                {
                    date: new Date(2024, 11, 2), // Same day
                    startTime: '15:00',
                    endTime: '16:00'
                }
            ]
            
            const result = calculateAvailableSlots({
                sellerAvailability: availability,
                existingBookings: bookings,
                month: 12,
                year: 2024,
                skipPastDates: false
            })
            
            const dec2Slot = result.find(slot => slot.date === '02-12-2024')
            expect(dec2Slot).toBeDefined()
            expect(dec2Slot?.availableBookings).not.toContain('10:00')
            expect(dec2Slot?.availableBookings).not.toContain('15:00')
            expect(dec2Slot?.availableBookings).toContain('09:00')
            expect(dec2Slot?.availableBookings).toContain('11:00')
            expect(dec2Slot?.availableBookings).toContain('14:00')
            expect(dec2Slot?.availableBookings).toContain('16:00')
        })
    })
})
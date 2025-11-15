import { getDaysInMonth } from 'date-fns';

export interface SellerAvailability {
    startDate: string; // Day of week (Monday, Tuesday, etc.)
    endDate: string;   // Day of week
    startTime: string; // HH:mm format
    endTime: string;   // HH:mm format
}

export interface ExistingBooking {
    date: Date;
    startTime: string; // HH:mm format
    endTime: string;   // HH:mm format
}

export interface AvailableSlot {
    date: string; // DD-MM-YYYY format
    availableBookings: string[]; // Array of HH:mm time slots
}

export interface AvailabilityCalculationInput {
    sellerAvailability: SellerAvailability[];
    existingBookings: ExistingBooking[];
    month: number; // 1-12
    year: number;
    skipPastDates?: boolean; // Default true
}

/**
 * Calculates available booking slots for a given month based on seller availability and existing bookings
 * @param input - Configuration object containing availability, bookings, and time parameters
 * @returns Array of available slots with dates and time slots
 */
export function calculateAvailableSlots(input: AvailabilityCalculationInput): AvailableSlot[] {
    const { sellerAvailability, existingBookings, month, year, skipPastDates = true } = input;
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    /**
     * Checks if a day of the week falls within an availability range
     * Handles week wraparound (e.g., Friday to Monday)
     */
    const isDayInAvailabilityRange = (dayName: string, startDay: string, endDay: string): boolean => {
        const startIndex = dayNames.indexOf(startDay);
        const endIndex = dayNames.indexOf(endDay);
        const dayIndex = dayNames.indexOf(dayName);
        
        if (startIndex <= endIndex) {
            return dayIndex >= startIndex && dayIndex <= endIndex;
        } else {
            // Wraps around week (e.g., Friday to Monday)
            return dayIndex >= startIndex || dayIndex <= endIndex;
        }
    };

    /**
     * Generates 1-hour time slots between start and end time
     */
    const generateTimeSlots = (startTime: string, endTime: string): string[] => {
        const slots: string[] = [];
        const start = parseInt(startTime.split(':')[0]);
        const startMinutes = parseInt(startTime.split(':')[1]);
        const end = parseInt(endTime.split(':')[0]);
        const endMinutes = parseInt(endTime.split(':')[1]);
        
        let currentHour = start;
        let currentMinutes = startMinutes;
        
        while (currentHour < end || (currentHour === end && currentMinutes < endMinutes)) {
            const timeSlot = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
            slots.push(timeSlot);
            
            currentMinutes += 60; // 1-hour slots
            if (currentMinutes >= 60) {
                currentHour += Math.floor(currentMinutes / 60);
                currentMinutes = currentMinutes % 60;
            }
        }
        
        return slots;
    };

    const availableSlots: AvailableSlot[] = [];
    const daysInMonth = getDaysInMonth(new Date(year, month - 1, 1));
    const today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month - 1, day);
        const dayName = dayNames[currentDate.getDay()];
        const dateString = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
        
        // Skip past dates if requested
        if (skipPastDates && currentDate < today) {
            continue;
        }

        let daySlots: string[] = [];

        // Check each availability period
        for (const availability of sellerAvailability) {
            if (isDayInAvailabilityRange(dayName, availability.startDate, availability.endDate)) {
                const slots = generateTimeSlots(availability.startTime, availability.endTime);
                daySlots = [...daySlots, ...slots];
            }
        }

        // Remove duplicates and sort
        daySlots = [...new Set(daySlots)].sort();

        // Filter out booked slots
        const bookedSlots = existingBookings
            .filter(booking => {
                const bookingDate = new Date(booking.date);
                return bookingDate.getDate() === day && 
                       bookingDate.getMonth() === month - 1 && 
                       bookingDate.getFullYear() === year;
            })
            .map(booking => booking.startTime);

        const availableBookings = daySlots.filter(slot => !bookedSlots.includes(slot));

        if (availableBookings.length > 0) {
            availableSlots.push({
                date: dateString,
                availableBookings
            });
        }
    }

    return availableSlots;
}

/**
 * Generates random seller availability data for testing
 * @param numPeriods - Number of availability periods to generate
 * @returns Array of random seller availability periods
 */
export function generateRandomSellerAvailability(numPeriods: number = 2): SellerAvailability[] {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const availability: SellerAvailability[] = [];

    for (let i = 0; i < numPeriods; i++) {
        const startDayIndex = Math.floor(Math.random() * dayNames.length);
        const endDayIndex = (startDayIndex + Math.floor(Math.random() * 3)) % dayNames.length; // Max 3 days range
        
        const startHour = 8 + Math.floor(Math.random() * 4); // 8-11 AM
        const endHour = startHour + 4 + Math.floor(Math.random() * 6); // 4-10 hours later
        
        availability.push({
            startDate: dayNames[startDayIndex],
            endDate: dayNames[endDayIndex],
            startTime: `${startHour.toString().padStart(2, '0')}:00`,
            endTime: `${Math.min(endHour, 23).toString().padStart(2, '0')}:00`
        });
    }

    return availability;
}

/**
 * Generates random existing bookings for a given month
 * @param month - Month (1-12)
 * @param year - Year
 * @param numBookings - Number of bookings to generate
 * @returns Array of random existing bookings
 */
export function generateRandomBookings(month: number, year: number, numBookings: number = 5): ExistingBooking[] {
    const bookings: ExistingBooking[] = [];
    const daysInMonth = getDaysInMonth(new Date(year, month - 1, 1));
    
    for (let i = 0; i < numBookings; i++) {
        const day = 1 + Math.floor(Math.random() * daysInMonth);
        const startHour = 9 + Math.floor(Math.random() * 10); // 9 AM - 7 PM
        const endHour = startHour + 1; // 1 hour duration
        
        bookings.push({
            date: new Date(year, month - 1, day),
            startTime: `${startHour.toString().padStart(2, '0')}:00`,
            endTime: `${endHour.toString().padStart(2, '0')}:00`
        });
    }

    return bookings;
}
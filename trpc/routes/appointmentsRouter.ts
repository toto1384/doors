import { TRPCError } from "@trpc/server";
import { z } from "zod/v3";
import { authProcedure, createTRPCRouter } from "../init";
import dbConnect from "utils/db/mongodb";
import { getAppointmentModel, getPropertyModel, getUserModel } from "utils/validation/mongooseModels";
import { AppointmentSchema } from "utils/validation/dbSchemas";
import { startOfMonth, endOfMonth } from "date-fns";
import { calculateAvailableSlots } from "utils/scheduleUtils";

export const appointmentsRouter = createTRPCRouter({
    // Schedule a new viewing
    scheduleViewing: authProcedure
        .input(z.object({
            propertyId: z.string(),
            date: z.date(),
            startTime: z.string(),
            endTime: z.string(),
            notes: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const db = await dbConnect();
            const AppointmentModel = getAppointmentModel(db);
            const PropertyModel = getPropertyModel(db);
            const UserModel = getUserModel(db);

            // Get property to find seller
            const property = await PropertyModel.findById(input.propertyId);
            if (!property) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Property not found' });
            }

            // Check if user is trying to book their own property
            if (property.postedByUserId === ctx.user.id) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot book viewing for your own property' });
            }

            // Check for existing appointments at the same time
            const existingAppointment = await AppointmentModel.findOne({
                propertyId: input.propertyId,
                date: input.date,
                $or: [
                    {
                        startTime: { $lt: input.endTime },
                        endTime: { $gt: input.startTime }
                    }
                ],
                status: { $in: ['pending', 'confirmed'] }
            });

            if (existingAppointment) {
                throw new TRPCError({ code: 'CONFLICT', message: 'Time slot is already booked' });
            }

            const appointmentObject = {
                date: input.date,
                startTime: input.startTime,
                endTime: input.endTime,
                initiatorUserId: ctx.user.id, // buyer
                receiverUserId: property.postedByUserId, // seller
                propertyId: input.propertyId,
                status: 'pending',
                notes: input.notes,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            console.log('appointmentObject', appointmentObject)

            // Create new appointment
            const appointment = await AppointmentModel.create(appointmentObject);

            return { success: true, appointmentId: appointment._id };
        }),

    // Get seller availability for a property
    //
    // i should probably write a unit test for this
    //
    // 1 unit test for scheduling the viewing
    getSellerAvailability: authProcedure
        .input(z.object({
            propertyId: z.string(),
            month: z.number().min(1).max(12),
            year: z.number().min(2024)
        }))
        .query(async ({ ctx, input }) => {
            const db = await dbConnect();
            const PropertyModel = getPropertyModel(db);
            const UserModel = getUserModel(db);
            const AppointmentModel = getAppointmentModel(db);

            // Get property to find seller
            const property = await PropertyModel.findById(input.propertyId);
            if (!property) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Property not found' });
            }

            // Get seller's availability
            const seller = await UserModel.findById(property.postedByUserId);
            if (!seller) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Seller not found' });
            }

            const sellerAvailability = seller.preferences?.sellerAvailability || [
                // Default availability: weekdays 9-18
                { startDate: 'Monday', endDate: 'Friday', startTime: '09:00', endTime: '18:00' }
            ];

            // Get all existing bookings for this property in the specified month
            const monthStart = startOfMonth(new Date(input.year, input.month - 1, 1));
            const monthEnd = endOfMonth(new Date(input.year, input.month - 1, 1));

            const existingBookings = await AppointmentModel.find({
                propertyId: input.propertyId,
                status: { $in: ['pending', 'confirmed'] },
                date: { $gte: monthStart, $lte: monthEnd }
            });

            // Use the utility function to calculate available slots
            const availableSlots = calculateAvailableSlots({
                sellerAvailability,
                existingBookings: existingBookings.map(booking => ({
                    date: booking.date,
                    startTime: booking.startTime,
                    endTime: booking.endTime
                })),
                month: input.month,
                year: input.year,
                skipPastDates: true
            });

            return { availableSlots };
        }),

    // Get existing bookings for a property
    getExistingBookings: authProcedure
        .input(z.object({ propertyId: z.string() }))
        .query(async ({ ctx, input }) => {
            const db = await dbConnect();
            const AppointmentModel = getAppointmentModel(db);

            // Get all confirmed/pending appointments for the property
            const appointments = await AppointmentModel.find({
                propertyId: input.propertyId,
                status: { $in: ['pending', 'confirmed'] },
                date: { $gte: new Date() } // Only future appointments
            }).sort({ date: 1, startTime: 1 });

            return {
                existingBookings: appointments.map(apt => ({
                    date: apt.date,
                    startTime: apt.startTime,
                    endTime: apt.endTime,
                    status: apt.status
                }))
            };
        }),

    // Get user's appointments
    getUserAppointments: authProcedure
        .query(async ({ ctx }) => {
            const db = await dbConnect();
            const AppointmentModel = getAppointmentModel(db);
            const PropertyModel = getPropertyModel(db);

            const appointments = await AppointmentModel.find({
                $or: [
                    { initiatorUserId: ctx.user.id },
                    { receiverUserId: ctx.user.id }
                ]
            }).sort({ date: 1, startTime: 1 });

            // Populate with property details
            const appointmentsWithProperties = await Promise.all(
                appointments.map(async (appointment) => {
                    const property = await PropertyModel.findById(appointment.propertyId);
                    return {
                        ...appointment.toObject(),
                        property: property ? {
                            title: property.title,
                            location: property.location,
                            imageUrls: property.imageUrls,
                            price: property.price,
                            numberOfRooms: property.numberOfRooms,
                            numberOfBathrooms: property.numberOfBathrooms,
                            surfaceArea: property.surfaceArea
                        } : null
                    };
                })
            );

            return { appointments: appointmentsWithProperties };
        }),

    // Get seller's appointments (where user is receiver)
    getSellerAppointments: authProcedure
        .query(async ({ ctx }) => {
            const db = await dbConnect();
            const AppointmentModel = getAppointmentModel(db);
            const PropertyModel = getPropertyModel(db);

            const appointments = await AppointmentModel.find({
                receiverUserId: ctx.user.id,
                date: { $gte: new Date() }
            }).sort({ date: 1, startTime: 1 });

            // Populate with property details
            const appointmentsWithProperties = await Promise.all(
                appointments.map(async (appointment) => {
                    const property = await PropertyModel.findById(appointment.propertyId);
                    return {
                        ...appointment.toObject(),
                        property: property ? {
                            title: property.title,
                            location: property.location,
                            imageUrls: property.imageUrls,
                            price: property.price,
                            numberOfRooms: property.numberOfRooms,
                            numberOfBathrooms: property.numberOfBathrooms,
                            surfaceArea: property.surfaceArea
                        } : null
                    };
                })
            );

            return { appointments: appointmentsWithProperties };
        }),

    // Get buyer's appointments (where user is initiator)
    getBuyerAppointments: authProcedure
        .query(async ({ ctx }) => {
            const db = await dbConnect();
            const AppointmentModel = getAppointmentModel(db);
            const PropertyModel = getPropertyModel(db);

            const appointments = await AppointmentModel.find({
                initiatorUserId: ctx.user.id,
                date: { $gte: new Date() }
            }).sort({ date: 1, startTime: 1 });

            // Populate with property details
            const appointmentsWithProperties = await Promise.all(
                appointments.map(async (appointment) => {
                    const property = await PropertyModel.findById(appointment.propertyId);
                    return {
                        ...appointment.toObject(),
                        property: property ? {
                            title: property.title,
                            location: property.location,
                            imageUrls: property.imageUrls,
                            price: property.price,
                            numberOfRooms: property.numberOfRooms,
                            numberOfBathrooms: property.numberOfBathrooms,
                            surfaceArea: property.surfaceArea
                        } : null
                    };
                })
            );

            return { appointments: appointmentsWithProperties };
        }),

    // Update appointment status
    updateAppointmentStatus: authProcedure
        .input(z.object({
            appointmentId: z.string(),
            status: z.enum(['confirmed', 'cancelled', 'completed'])
        }))
        .mutation(async ({ ctx, input }) => {
            const db = await dbConnect();
            const AppointmentModel = getAppointmentModel(db);

            const appointment = await AppointmentModel.findById(input.appointmentId);
            if (!appointment) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Appointment not found' });
            }

            // Only seller can confirm/cancel, both parties can mark as completed
            if (input.status === 'confirmed' || input.status === 'cancelled') {
                if (appointment.sellerUserId !== ctx.user.id) {
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Only seller can confirm or cancel appointments' });
                }
            } else if (input.status === 'completed') {
                if (appointment.buyerUserId !== ctx.user.id && appointment.sellerUserId !== ctx.user.id) {
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Only appointment participants can mark as completed' });
                }
            }

            await AppointmentModel.findByIdAndUpdate(input.appointmentId, {
                status: input.status,
                updatedAt: new Date()
            });

            return { success: true };
        })
});

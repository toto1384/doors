import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import z from "zod/v3";
import { AppointmentCard } from "@/src/components/appointments/AppointmentCard";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { zDate } from "@/utils/validation/zodUtils";
import { useTRPC } from "../../../trpc/react";

export const Route = createFileRoute("/app/appointments")({
	component: BuyerAppointmentsPage,
	validateSearch: z.object({
		date: z.string().optional(),
	}),
});

function BuyerAppointmentsPage() {
	const { t } = useTranslation();
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const trpc = useTRPC();
	const navigate = useNavigate();

	const searchParams = Route.useSearch();
	const selectedDate = searchParams?.date ? new Date(searchParams.date) : undefined;

	// Get all appointments where user is the initiator (buyer)
	const { data: appointmentsData, refetch } = useQuery(trpc.appointments.getBuyerAppointments.queryOptions());

	const updateStatusMutation = useMutation(
		trpc.appointments.updateAppointmentStatus.mutationOptions({
			onSuccess: () => {
				toast.success("Appointment updated successfully!");
				refetch();
			},
			onError: (error) => {
				toast.error(error.message || "Failed to update appointment");
			},
		}),
	);

	// Get buyer appointments (already filtered by backend)
	const buyerAppointments = appointmentsData?.appointments || [];

	// Filter appointments by selected date
	const filteredAppointments = selectedDate
		? buyerAppointments.filter((apt) => apt.date && isSameDay(new Date(apt.date), selectedDate))
		: buyerAppointments;

	// Get dates that have appointments for calendar highlighting
	const appointmentDates = buyerAppointments
		.map((apt) => (apt.date ? new Date(apt.date) : null))
		.filter(Boolean) as Date[];

	const handleStatusUpdate = (
		appointmentId: string,
		status: "cancelled-by-buyer" | "cancelled-by-seller" | "completed",
	) => {
		updateStatusMutation.mutate({ appointmentId, status });
	};

	const handleDateSelect = (date: Date | undefined) => {
		navigate({ to: "/app/appointments", search: { date: date ? format(date, "yyyy-MM-dd") : undefined } });
	};

	return (
		<div className="min-h-screen text-white p-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">{t("buyer-appointments.title")}</h1>
					<p className="text-slate-300">{t("buyer-appointments.subtitle")}</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
					{/* Calendar Section */}
					<div>
						<Card className="bg-[#1A1A2E]/50 p-2 border-slate-700">
							<CardContent className="px-0">
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
											backgroundColor: "rgba(59, 130, 246, 0.5)",
											borderRadius: "6px",
											fontWeight: "bold",
										},
									}}
								/>
								<div className="mt-4 text-sm text-slate-400">
									<div className="flex items-center gap-2 mb-1">
										<div className="w-3 h-3 bg-blue-500/50 rounded"></div>
										<span>{t("buyer-appointments.daysWithAppointments")}</span>
									</div>
									<Button
										className="bg-gradient-to-br from-[#4C7CED] to-[#7B31DC] text-white text-xs px-4 py-2 rounded-[6px] mt-3"
										onClick={() => handleDateSelect(undefined)}
									>
										See All Dates
									</Button>
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
										? `${t("buyer-appointments.appointmentsFor")} ${format(selectedDate, "EEEE, MMMM d")}`
										: t("buyer-appointments.upcomingViewings")}
								</CardTitle>
								<p className="text-slate-400 text-sm">
									{filteredAppointments.length}{" "}
									{filteredAppointments.length === 1
										? t("buyer-appointments.appointmentCount")
										: t("buyer-appointments.appointmentsCount")}
									{selectedDate && " on this day"}
								</p>
							</CardHeader>
							<CardContent className="space-y-4">
								{filteredAppointments.length === 0 ? (
									<div className="text-center py-12">
										<CalendarIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
										<h3 className="text-lg font-medium text-slate-300 mb-2">
											{t("buyer-appointments.noAppointments")}
										</h3>
										<p className="text-slate-500">
											{selectedDate
												? t("buyer-appointments.noAppointmentsDate")
												: t("buyer-appointments.noAppointmentsGeneral")}
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{filteredAppointments.map((appointment) => (
											<AppointmentCard
												key={appointment._id}
												appointment={appointment}
												onStatusUpdate={handleStatusUpdate}
												userRole="buyer"
											/>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Reschedule Modal */}
				{/*rescheduleAppointment && (
                    <ViewingScheduleModal
                        month={}
                        isOpen={!!rescheduleAppointment}
                        onClose={() => setRescheduleAppointment(null)}
                        property={rescheduleAppointment.property}
                        sellerAvailability={{ availableSlots: [] }}
                        // sellerAvailability={sellerAvailability || { availableSlots: [] }}
                        // existingBookings={existingBookings?.existingBookings || []}
                        onScheduleViewing={handleRescheduleViewing}
                    />
                )*/}
			</div>
		</div>
	);
}

{
	/* const handleRescheduleViewing = async (date: Date, time: string) => { */
}
{
	/*         if (!rescheduleAppointment) return */
}
{
	/**/
}
{
	/*         const endTime = new Date(date); */
}
{
	/*         const [hours, minutes] = time.split(':').map(Number); */
}
{
	/*         endTime.setHours(hours, minutes + 30, 0, 0); */
}
{
	/**/
}
{
	/*         const endTimeString = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`; */
}
{
	/**/
}
{
	/*         // Cancel current appointment and create new one */
}
{
	/*         await updateStatusMutation.mutateAsync({ */
}
{
	/*             appointmentId: rescheduleAppointment._id, */
}
{
	/*             status: 'cancelled' */
}
{
	/*         }) */
}
{
	/**/
}
{
	/*         // Create new appointment via the existing scheduleViewing mutation */
}
{
	/*         const scheduleResult = (props: any) => { } */
}
{
	/*         //         await trpc.appointments.scheduleViewing.mutate({ */
}
{
	/*         //   propertyId: rescheduleAppointment.propertyId, */
}
{
	/*         //   date: date, */
}
{
	/*         //   startTime: time, */
}
{
	/*         //   endTime: endTimeString, */
}
{
	/*         // }) */
}
{
	/**/
}
{
	/*         setRescheduleAppointment(null) */
}
{
	/*         toast.success('Viewing rescheduled successfully!') */
}
{
	/*         refetch() */
}
{
	/*     } */
}

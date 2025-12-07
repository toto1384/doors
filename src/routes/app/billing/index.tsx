import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useAnalytics, useCustomer } from "autumn-js/react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { FloatingInput } from "@/src/components/ui/floating-input";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

export const Route = createFileRoute("/app/billing/")({
	component: BillingPage,
});

function BillingPage() {
	const [customAmount, setCustomAmount] = useState("0.00");
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = 6; // 24 transactions / 4 per page

	const transactions = [
		{ date: "Jan 15, 2025", type: "Purchase", tokens: "+500 tokens", amount: "$49.99", status: "Completed" },
		{ date: "Jan 12, 2025", type: "Spend", tokens: "-150 tokens", amount: "-", status: "Completed" },
		{ date: "Jan 08, 2025", type: "Purchase", tokens: "+1,200 tokens", amount: "$99.99", status: "Pending" },
		{ date: "Jan 05, 2025", type: "Spend", tokens: "-300 tokens", amount: "-", status: "Completed" },
	];

	const paymentMethods = [
		{ icon: () => <img src="/icons/card.svg" alt="Credit Card" className="w-3 h-3" />, label: "Credit Card" },
		{ icon: () => <img src="/icons/paypal.svg" alt="PayPal" className="w-3 h-3" />, label: "PayPal" },
		{ icon: () => <img src="/icons/apple.svg" alt="Apple Pay" className="w-3 h-3" />, label: "Apple Pay" },
		{ icon: () => <img src="/icons/google.svg" alt="Google Pay" className="w-3 h-3" />, label: "Google Pay" },
	];

	const { check, attach, customer } = useCustomer({ expand: ["invoices"] });
	/* const { data: analyticsData, isLoading, error } = useAnalytics({ featureId: "appointmnts", range: "7d" }); */

	const { data } = useQuery({
		queryKey: ["appointments.billing"],
		queryFn: async () => check({ featureId: "appointmnts" }),
	});

	return (
		<div className="max-w-6xl mx-auto px-2 md:px-6 text-white">
			{/* Current Balance Section */}
			<div className="text-center mb-4 md:mb-12 bg-[#120826] rounded-lg p-5">
				<h1 className="text-md font-light mb-4">Programari curente:</h1>
				<div className="text-[40px] mt-2 font-semibold text-[#8045F5] mb-2">
					{customer?.features.appointmnts.balance}
				</div>
				<p className="text-gray-400 text-sm">programari</p>
			</div>

			<div className="grid md:grid-cols-2 gap-4 md:gap-8">
				{/* Starter Package */}
				<div className="bg-[#130826] rounded-lg p-8 text-center">
					<h2 className="text-2xl font-normal mb-8">Cumpără vizionari</h2>
					<div className="text-4xl font-semibold mb-2">€19.99</div>
					<p className="text-gray-400 mb-8">4 vizionari</p>
					<Button
						className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
						onClick={async () => {
							toast("Opening checkout...");
							await attach({
								productId: "pro_plan",
								// dialog: CheckoutDialog,
								forceCheckout: true,
								successUrl: `${import.meta.env.VITE_BETTER_AUTH_URL}/app/billing`,
							});
						}}
					>
						Cumpara
					</Button>
				</div>

				{/* Payment Options */}
				<div className="mb-4 md:mb-12">
					<h3 className="text-lg font-semibold mb-4">Payment Options</h3>
					<div className="flex flex-wrap gap-4">
						{paymentMethods.map((method, index) => (
							<div
								key={index}
								className="flex items-center gap-2 bg-[#130826] px-4 py-3 rounded-lg cursor-pointer hover:bg-[#3A3A5C] transition-colors"
							>
								<method.icon />
								<span className="text-xs">{method.label}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Transaction History */}
			<div className="bg-[#130826] rounded-lg px-4 py-6 md:p-8">
				<h2 className="text-xl mb-8">Transaction History</h2>

				{/* Filters */}
				<div className="flex flex-col md:flex-row gap-4 mb-6">
					<div className="relative flex-1">
						<Input
							placeholder="Search transactions..."
							className="bg-[#1A0F33] border-[#1C252E] border text-white pl-10 py-4 h-10"
						/>
						<svg
							className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>

					{/* <Select defaultValue="all"> */}
					{/* 	<SelectTrigger className="w-40 bg-[#2A2A4A] border-gray-600 text-white"> */}
					{/* 		<SelectValue placeholder="All Types" /> */}
					{/* 	</SelectTrigger> */}
					{/* 	<SelectContent> */}
					{/* 		<SelectItem value="all">All Types</SelectItem> */}
					{/* 		<SelectItem value="purchase">Purchase</SelectItem> */}
					{/* 		<SelectItem value="spend">Spend</SelectItem> */}
					{/* 	</SelectContent> */}
					{/* </Select> */}
					{/**/}
					{/* <Select defaultValue="date"> */}
					{/* 	<SelectTrigger className="w-32 bg-[#2A2A4A] border-gray-600 text-white"> */}
					{/* 		<SelectValue placeholder="Date" /> */}
					{/* 	</SelectTrigger> */}
					{/* 	<SelectContent> */}
					{/* 		<SelectItem value="date">Date</SelectItem> */}
					{/* 		<SelectItem value="newest">Newest</SelectItem> */}
					{/* 		<SelectItem value="oldest">Oldest</SelectItem> */}
					{/* 	</SelectContent> */}
					{/* </Select> */}
					{/**/}
					{/* <Select defaultValue="status"> */}
					{/* 	<SelectTrigger className="w-32 bg-[#2A2A4A] border-gray-600 text-white"> */}
					{/* 		<SelectValue placeholder="Status" /> */}
					{/* 	</SelectTrigger> */}
					{/* 	<SelectContent> */}
					{/* 		<SelectItem value="status">Status</SelectItem> */}
					{/* 		<SelectItem value="completed">Completed</SelectItem> */}
					{/* 		<SelectItem value="pending">Pending</SelectItem> */}
					{/* 	</SelectContent> */}
					{/* </Select> */}
				</div>

				{/* Transaction Table */}
				<div className="bg-[#1A0F33] rounded-lg overflow-hidden border border-[#1C252E]">
					<div className="grid grid-cols-5 gap-4 py-4 px-3 border-b border-[#1C252E] text-xs text-gray-400 font-medium">
						<div>Date</div>
						<div>Type</div>
						<div>Tokens</div>
						<div>Amount</div>
						<div>Status</div>
					</div>

					{customer?.invoices?.map((invoice, index) => (
						<div
							key={index}
							onClick={() => window.open(invoice.hosted_invoice_url, "_blank")}
							className="grid grid-cols-5 gap-4 text-xs py-4 px-3 border-b border-gray-700 cursor-pointer last:border-b-0 hover:bg-[#3A3A5C] transition-colors"
						>
							<div className="">{format(new Date(invoice.created_at), "dd-MM-yyyy")}</div>
							<div className="">{invoice.product_ids[0]}</div>
							<div className={` font-medium `}>{4}</div>
							<div className="">
								{invoice.total}
								{invoice.currency}
							</div>
							<div className={``}>{invoice.status}</div>
						</div>
					))}
				</div>

				{/* Pagination */}
				<div className="hidden items-center justify-between mt-6">
					<p className="text-sm text-gray-400">Showing 4 of 24 transactions</p>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
							disabled={currentPage === 1}
							className="border-gray-600 text-gray-300"
						>
							<ChevronLeft className="w-4 h-4" />
						</Button>

						<div className="flex gap-1">
							{[1, 2, 3].map((page) => (
								<Button
									key={page}
									variant={currentPage === page ? "default" : "outline"}
									size="sm"
									onClick={() => setCurrentPage(page)}
									className={currentPage === page ? "bg-blue-600 text-white" : "border-gray-600 text-gray-300"}
								>
									{page}
								</Button>
							))}
						</div>

						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
							disabled={currentPage === totalPages}
							className="border-gray-600 text-gray-300"
						>
							<ChevronRight className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export const Route = createFileRoute('/app/billing/')({
  component: BillingPage,
})

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
    { icon: CreditCard, label: "Credit Card" },
    { icon: () => <span className="text-blue-600 font-bold">PayPal</span>, label: "PayPal" },
    { icon: () => <span className="text-gray-900">Apple Pay</span>, label: "Apple Pay" },
    { icon: () => <span className="text-blue-600">Google Pay</span>, label: "Google Pay" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#1A1A2E] min-h-screen text-white">
      {/* Current Balance Section */}
      <div className="text-center mb-12">
        <h1 className="text-lg text-gray-400 mb-4">Sold curent de tokeni</h1>
        <div className="text-6xl font-bold text-purple-400 mb-2">2,450</div>
        <p className="text-gray-400">tokeni disponibili</p>
      </div>

      {/* Purchase Tokens Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8">Cumpără tokeni</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Starter Package */}
          <div className="bg-[#2A2A4A] rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-6">Starter</h3>
            <div className="text-4xl font-bold mb-2">$49.99</div>
            <p className="text-gray-400 mb-8">500 tokens</p>
            <Button className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300">
              Purchase
            </Button>
          </div>

          {/* Custom Amount */}
          <div className="bg-[#2A2A4A] rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-6">Custom Amount</h3>
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-3">Enter Amount ($)</label>
              <Input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="bg-[#3A3A5C] border-gray-600 text-white h-12"
                step="0.01"
                min="0"
              />
            </div>
            <Button className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300">
              Purchase
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold mb-4">Payment Options</h3>
        <div className="flex flex-wrap gap-4">
          {paymentMethods.map((method, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-[#2A2A4A] px-4 py-3 rounded-lg cursor-pointer hover:bg-[#3A3A5C] transition-colors"
            >
              <method.icon className="w-5 h-5" />
              <span className="text-sm">{method.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-2xl font-bold mb-8">Transaction History</h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Input
              placeholder="Search transactions..."
              className="bg-[#2A2A4A] border-gray-600 text-white pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <Select defaultValue="all">
            <SelectTrigger className="w-40 bg-[#2A2A4A] border-gray-600 text-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="purchase">Purchase</SelectItem>
              <SelectItem value="spend">Spend</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="date">
            <SelectTrigger className="w-32 bg-[#2A2A4A] border-gray-600 text-white">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="status">
            <SelectTrigger className="w-32 bg-[#2A2A4A] border-gray-600 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction Table */}
        <div className="bg-[#2A2A4A] rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-600 text-sm text-gray-400 font-medium">
            <div>Date</div>
            <div>Type</div>
            <div>Tokens</div>
            <div>Amount</div>
            <div>Status</div>
          </div>

          {transactions.map((transaction, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-700 last:border-b-0 hover:bg-[#3A3A5C] transition-colors">
              <div className="text-sm">{transaction.date}</div>
              <div className="text-sm">{transaction.type}</div>
              <div className={`text-sm font-medium ${
                transaction.tokens.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {transaction.tokens}
              </div>
              <div className="text-sm">{transaction.amount}</div>
              <div className={`text-sm ${
                transaction.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {transaction.status}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-400">
            Showing 4 of 24 transactions
          </p>

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
                  className={currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border-gray-600 text-gray-300"
                  }
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
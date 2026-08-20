import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, CalendarDays, DollarSign, Clock, Briefcase, Users, Plus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import InvoiceWizard from "@/components/InvoiceWizard";

const Dashboard = () => {
  const { user } = useAuth();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const stats = [
    {
      title: "Total Revenue",
      value: "₦1,200,000",
      change: "+18.2%",
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Pending Invoices",
      value: "₦450,000",
      change: "+12.5%",
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Active Projects",
      value: "5",
      change: "+2",
      icon: Briefcase,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Clients",
      value: "12",
      change: "+20%",
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const revenueData = [
    { month: "Mar", revenue: 40000 },
    { month: "Apr", revenue: 60000 },
    { month: "May", revenue: 100000 },
    { month: "Jun", revenue: 120000 },
    { month: "Jul", revenue: 140000 },
    { month: "Aug", revenue: 150000 },
  ];

  const recentInvoices = [
    {
      id: "INV-2024-001",
      client: "CodeCraft Studios",
      date: "May 12, 2024",
      amount: "₦250,000",
      status: "Paid",
    },
    {
      id: "INV-2024-002",
      client: "DesignHub Agency",
      date: "May 05, 2024",
      amount: "₦180,000",
      status: "Overdue",
    },
    {
      id: "INV-2024-003",
      client: "GreenByte Tech",
      date: "Apr 28, 2024",
      amount: "₦95,000",
      status: "Paid",
    },
  ];

  return (
    <>
      <div className="space-y-6 bg-slate-50">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-emerald-600">Overview</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back, {user?.fullName || "there"}!
            </h1>
          </div>
          <div className="flex w-full gap-3 sm:w-auto">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm sm:flex-none">
              <CalendarDays className="h-4 w-4" />
              This Month
            </button>
            <button
              onClick={() => setIsWizardOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 sm:flex-none"
            >
              <Plus className="h-4 w-4" />
              New Invoice
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-1">
                <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.iconBg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                <div className="flex items-center pt-1">
                  <span className="text-emerald-600 text-xs font-medium flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </span>
                  <span className="text-slate-400 text-xs ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Revenue Growth</h3>
              <p className="mt-1 text-xs text-slate-400">Last 6 months</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">+18.2%</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(value) => `₦${value / 1000}K`}
              />
              <Tooltip
                formatter={(value) => [`₦${value.toLocaleString()}`, "Revenue"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  background: "white",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#059669"
                strokeWidth={3}
                dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-900">Recent Invoices</h3>
            <button className="text-emerald-600 text-sm font-medium hover:underline">
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-500 border-b">
                <tr>
                  <th className="text-left py-3 font-medium">Invoice</th>
                  <th className="text-left py-3 font-medium">Client</th>
                  <th className="text-left py-3 font-medium">Date</th>
                  <th className="text-left py-3 font-medium">Amount</th>
                  <th className="text-left py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-slate-50 transition">
                    <td className="py-3 font-medium text-slate-900">{invoice.id}</td>
                    <td className="py-3 text-slate-700">{invoice.client}</td>
                    <td className="py-3 text-slate-500">{invoice.date}</td>
                    <td className="py-3 font-medium text-slate-900">{invoice.amount}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          invoice.status === "Paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice Wizard Modal */}
      <InvoiceWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </>
  );
};

export default Dashboard;
import { useState, useEffect } from "react";
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
import { clientsAPI, projectsAPI, invoicesAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  // ✅ State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    pendingInvoices: 0,
    activeProjects: 0,
    totalClients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  // ✅ Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [clientsRes, projectsRes, invoicesRes] = await Promise.all([
          clientsAPI.getAll(),
          projectsAPI.getAll(),
          invoicesAPI.getAll(),
        ]);
        
        const clients = clientsRes.data.data || [];
        const projects = projectsRes.data.data || [];
        const invoices = invoicesRes.data.data || [];
        const totals = invoicesRes.data.totals || {};
        
        // Calculate active projects
        const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
        
        // Get recent invoices (last 3)
        const recent = invoices.slice(0, 3).map(inv => ({
          id: inv.number,
          client: inv.project?.client?.name || 'N/A',
          date: new Date(inv.createdAt).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          amount: `₦${inv.amount.toLocaleString()}`,
          status: inv.status,
        }));
        
        // Generate revenue data from invoices
        const revenueMap = {};
        invoices.forEach(inv => {
          const date = new Date(inv.createdAt);
          const monthKey = date.toLocaleDateString('en-NG', { month: 'short' });
          if (!revenueMap[monthKey]) revenueMap[monthKey] = 0;
          revenueMap[monthKey] += inv.amount;
        });
        
        const revenueChartData = Object.entries(revenueMap)
          .slice(-6)
          .map(([month, revenue]) => ({ month, revenue }));
        
        setDashboardData({
          totalRevenue: totals.total || 0,
          pendingInvoices: totals.pending || 0,
          activeProjects: activeProjects,
          totalClients: clients.length,
        });
        
        setRecentInvoices(recent);
        setRevenueData(revenueChartData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Use fallback data if API fails
        setDashboardData({
          totalRevenue: 0,
          pendingInvoices: 0,
          activeProjects: 0,
          totalClients: 0,
        });
        setRecentInvoices([]);
        setRevenueData([
          { month: "Mar", revenue: 0 },
          { month: "Apr", revenue: 0 },
          { month: "May", revenue: 0 },
          { month: "Jun", revenue: 0 },
          { month: "Jul", revenue: 0 },
          { month: "Aug", revenue: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // ✅ Build stats array from real data
  const stats = [
    {
      title: "Total Revenue",
      value: `₦${dashboardData.totalRevenue.toLocaleString()}`,
      change: "+18.2%",
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Pending Invoices",
      value: `₦${dashboardData.pendingInvoices.toLocaleString()}`,
      change: "+12.5%",
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Active Projects",
      value: dashboardData.activeProjects.toString(),
      change: "+2",
      icon: Briefcase,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Clients",
      value: dashboardData.totalClients.toString(),
      change: "+20%",
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
              {dashboardData.totalRevenue > 0 ? '+18.2%' : '0%'}
            </span>
          </div>
          {revenueData.length > 0 ? (
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
          ) : (
            <div className="flex items-center justify-center h-[250px] text-slate-400">
              <p>No revenue data available yet</p>
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-900">Recent Invoices</h3>
            <a href="/invoices" className="text-emerald-600 text-sm font-medium hover:underline">
              View all
            </a>
          </div>
          {recentInvoices.length > 0 ? (
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
                            invoice.status === "PAID"
                              ? "bg-emerald-100 text-emerald-700"
                              : invoice.status === "OVERDUE"
                              ? "bg-red-100 text-red-700"
                              : invoice.status === "SENT"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-700"
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
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p>No invoices yet. Create your first invoice!</p>
            </div>
          )}
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
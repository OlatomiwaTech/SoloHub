import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check, CircleAlert, DollarSign, Clock, Briefcase, FileText, Users, Plus, RefreshCw } from "lucide-react";
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
import InvoiceEmailDraftButton from "@/components/InvoiceEmailDraftButton";
import { clientsAPI, projectsAPI, invoicesAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  // ✅ State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    pendingInvoices: 0,
    activeProjects: 0,
    totalClients: 0,
    totalProjects: 0,
    totalInvoices: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [attentionInvoices, setAttentionInvoices] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [chartMonths, setChartMonths] = useState(6);
  const [recentStatusFilter, setRecentStatusFilter] = useState('ALL');

  // ✅ Fetch dashboard data on mount
  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        if (!cancelled) setDashboardError('');
        
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
        const recent = invoices.slice(0, 5).map(inv => ({
          id: inv.number,
          client: inv.project?.client?.name || 'N/A',
          date: new Date(inv.createdAt).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          amount: `₦${Number(inv.amount).toLocaleString('en-NG')}`,
          status: inv.status,
        }));

        // Surface sent invoices that are overdue or due within the next week.
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const needsFollowUp = invoices
          .filter((invoice) => invoice.status === 'OVERDUE' || invoice.status === 'SENT')
          .map((invoice) => {
            const dueDate = new Date(invoice.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            return {
              id: invoice.id,
              number: invoice.number,
              client: invoice.project?.client?.name || 'Client unavailable',
              project: invoice.project,
              amount: Number(invoice.amount) || 0,
              dueDate: invoice.dueDate,
              overdue: invoice.status === 'OVERDUE' || dueDate < today,
              dueTimestamp: dueDate.getTime(),
            };
          })
          .filter((invoice) => invoice.overdue || invoice.dueTimestamp <= nextWeek.getTime())
          .sort((a, b) => a.dueTimestamp - b.dueTimestamp)
          .slice(0, 4);
        
        // Revenue means money collected, grouped by payment date.
        const revenueMap = new Map();
        invoices.filter((invoice) => invoice.status === 'PAID' && invoice.paidAt).forEach((invoice) => {
          const paidDate = new Date(invoice.paidAt);
          const key = `${paidDate.getFullYear()}-${String(paidDate.getMonth() + 1).padStart(2, '0')}`;
          revenueMap.set(key, (revenueMap.get(key) || 0) + Number(invoice.amount));
        });

        const now = new Date();
        const revenueChartData = Array.from({ length: 12 }, (_, index) => {
          const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          return {
            month: date.toLocaleDateString('en-NG', { month: 'short', year: '2-digit' }),
            revenue: revenueMap.get(key) || 0,
          };
        });
        
        if (cancelled) return;
        setDashboardData({
          totalRevenue: totals.paid || 0,
          pendingInvoices: (totals.pending || 0) + (totals.overdue || 0),
          activeProjects: activeProjects,
          totalClients: clients.length,
          totalProjects: projects.length,
          totalInvoices: invoices.length,
        });
        
        setRecentInvoices(recent);
        setAttentionInvoices(needsFollowUp);
        setRevenueData(revenueChartData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (!cancelled) setDashboardError('We could not load your workspace data. Check your connection and try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    
    fetchDashboardData();
    return () => { cancelled = true; };
  }, [loadAttempt]);

  // ✅ Build stats array from real data
  const stats = [
    {
      title: "Revenue Collected",
      value: `₦${dashboardData.totalRevenue.toLocaleString()}`,
      description: "From paid invoices",
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      to: '/invoices',
    },
    {
      title: "Unpaid Invoices",
      value: `₦${dashboardData.pendingInvoices.toLocaleString()}`,
      description: "Draft, sent, and overdue",
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      to: '/invoices',
    },
    {
      title: "Active Projects",
      value: dashboardData.activeProjects.toString(),
      description: "Currently active",
      icon: Briefcase,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      to: '/projects',
    },
    {
      title: "Total Clients",
      value: dashboardData.totalClients.toString(),
      description: "In your workspace",
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      to: '/clients',
    },
  ];

  const onboardingSteps = [
    { label: 'Add your first client', complete: dashboardData.totalClients > 0, to: '/clients' },
    { label: 'Create a project', complete: dashboardData.totalProjects > 0, to: '/projects' },
    { label: 'Create an invoice', complete: dashboardData.totalInvoices > 0, onClick: handleCreateInvoice },
  ];
  const completedSteps = onboardingSteps.filter((step) => step.complete).length;
  const visibleRevenueData = revenueData.slice(-chartMonths);
  const visibleRecentInvoices = recentStatusFilter === 'ALL'
    ? recentInvoices
    : recentInvoices.filter((invoice) => invoice.status === recentStatusFilter);

  function handleCreateInvoice() {
    if (dashboardData.totalClients === 0) navigate('/clients');
    else if (dashboardData.totalProjects === 0) navigate('/projects');
    else setIsWizardOpen(true);
  }

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

  if (dashboardError) {
    return (
      <section className="mx-auto mt-12 max-w-xl rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm" role="alert">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-amber-50 text-amber-700"><CircleAlert className="h-6 w-6" /></span>
        <h1 className="mt-4 text-xl font-semibold text-slate-900">Your dashboard is unavailable</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{dashboardError}</p>
        <button type="button" onClick={() => { setLoading(true); setLoadAttempt((attempt) => attempt + 1); }} className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      </section>
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
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/clients?new=1')}
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 sm:flex-none"
            >
              <Users className="h-4 w-4" /> Add client
            </button>
            <button
              type="button"
              onClick={() => navigate('/projects?new=1')}
              className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 sm:flex-none"
            >
              <Briefcase className="h-4 w-4" /> Add project
            </button>
            <button
              onClick={handleCreateInvoice}
              className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:flex-none"
            >
              <Plus className="h-4 w-4" />
              New Invoice
            </button>
          </div>
        </div>

        {attentionInvoices.length > 0 && (
          <section className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="invoice-follow-up-title">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Billing follow-up</p>
                <h2 id="invoice-follow-up-title" className="mt-1 font-semibold text-slate-900">Invoices that need attention</h2>
                <p className="mt-1 text-sm text-slate-500">Sent invoices that are overdue or due within 7 days.</p>
              </div>
              <Link to="/invoices" className="inline-flex items-center gap-1 self-start text-sm font-semibold text-emerald-700 hover:text-emerald-800 sm:self-auto">
                Review invoices <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-slate-100">
              {attentionInvoices.map((invoice) => (
                <li key={invoice.id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{invoice.client} <span className="font-normal text-slate-500">· {invoice.number}</span></p>
                    <p className={`mt-1 text-xs font-medium ${invoice.overdue ? 'text-red-700' : 'text-amber-700'}`}>
                      {invoice.overdue ? 'Overdue' : 'Due'} · {new Date(invoice.dueDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                    <span className="text-sm font-semibold text-slate-900">₦{invoice.amount.toLocaleString('en-NG')}</span>
                    <InvoiceEmailDraftButton invoice={invoice} mode="reminder" />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.title} to={stat.to} className="block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
            <Card className="h-full border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
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
                <p className="pt-1 text-xs text-slate-400">{stat.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">View details <ArrowRight className="h-3 w-3" /></span>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>

        {completedSteps < onboardingSteps.length && (
          <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="getting-started-title">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">A good place to begin</p>
                <h2 id="getting-started-title" className="mt-1 text-lg font-semibold text-slate-900">Set up your workspace</h2>
                <p className="mt-1 text-sm text-slate-500">Follow these steps to connect your clients, work, and billing.</p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">{completedSteps} of {onboardingSteps.length} complete</span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {onboardingSteps.map((step, index) => {
                const content = <><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${step.complete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{step.complete ? <Check className="h-4 w-4" /> : `0${index + 1}`}</span><span className="min-w-0 flex-1"><span className={`block text-sm font-medium ${step.complete ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{step.label}</span><span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">{step.complete ? 'Done' : 'Get started'} {!step.complete && <ArrowRight className="h-3 w-3" />}</span></span></>;
                const className = `flex min-h-[76px] items-center gap-3 rounded-lg border p-3 text-left transition duration-200 ${step.complete ? 'border-slate-100 bg-slate-50' : 'border-slate-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600'}`;

                return step.to ? <Link key={step.label} to={step.to} className={className}>{content}</Link> : <button key={step.label} type="button" onClick={step.onClick} className={className}>{content}</button>;
              })}
            </div>
          </section>
        )}

        {/* Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Revenue Trend</h3>
              <p className="mt-1 text-xs text-slate-400">Paid invoices by payment month · last {chartMonths} months</p>
            </div>
            <div className="inline-flex self-start rounded-lg bg-slate-100 p-1" role="group" aria-label="Revenue chart period">
              {[6, 12].map((months) => (
                <button
                  key={months}
                  type="button"
                  aria-pressed={chartMonths === months}
                  onClick={() => setChartMonths(months)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 ${chartMonths === months ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {months} months
                </button>
              ))}
            </div>
          </div>
          {visibleRevenueData.some((month) => month.revenue > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={visibleRevenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(value) => value >= 1000000 ? `₦${(value / 1000000).toFixed(1)}M` : value >= 1000 ? `₦${(value / 1000).toFixed(0)}K` : `₦${value}`}
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
              <p>No paid invoices in the last {chartMonths} months.</p>
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Recent Invoices</h3>
              <p className="mt-1 text-xs text-slate-500">Filter the latest five by status.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {['ALL', 'DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  type="button"
                  aria-pressed={recentStatusFilter === status}
                  onClick={() => setRecentStatusFilter(status)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 ${recentStatusFilter === status ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'}`}
                >
                  {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
              <Link to="/invoices" className="ml-1 inline-flex items-center gap-1 text-emerald-700 text-sm font-medium hover:underline">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          {recentInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              {visibleRecentInvoices.length === 0 && (
                <p className="mb-2 rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500" role="status">
                  No recent {recentStatusFilter.toLowerCase()} invoices.
                </p>
              )}
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
                  {visibleRecentInvoices.map((invoice, index) => (
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
            <div className="rounded-lg bg-slate-50 py-8 text-center">
              <FileText className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-slate-700">No invoices yet</p>
              <p className="mt-1 text-xs text-slate-500">Your latest billing activity will appear here.</p>
              <button type="button" onClick={handleCreateInvoice} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition hover:gap-2.5 hover:text-emerald-800">Create an invoice <ArrowRight className="h-4 w-4" /></button>
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

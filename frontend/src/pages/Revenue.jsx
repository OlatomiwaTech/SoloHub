import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, CircleAlert, Clock3, DollarSign, FileText, RefreshCw, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { invoicesAPI } from '../services/api';
import { getInvoiceDisplayStatus } from '../lib/invoiceStatus';

const currency = (amount) => new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 2,
}).format(Number(amount) || 0);

const formatAxisAmount = (amount) => amount >= 1000000
  ? `₦${(amount / 1000000).toFixed(1)}M`
  : amount >= 1000 ? `₦${(amount / 1000).toFixed(0)}K` : `₦${amount}`;

const Revenue = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [chartMonths, setChartMonths] = useState(6);

  useEffect(() => {
    let cancelled = false;
    const loadRevenue = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await invoicesAPI.getAll();
        if (!cancelled) setInvoices(response.data.data || []);
      } catch (requestError) {
        if (!cancelled) {
          setError('We could not load your revenue data. Check your connection and try again.');
          toast.error('Failed to load revenue data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadRevenue();
    return () => { cancelled = true; };
  }, [attempt]);

  const paidInvoices = invoices
    .filter((invoice) => invoice.status === 'PAID')
    .sort((a, b) => new Date(b.paidAt || b.updatedAt) - new Date(a.paidAt || a.updatedAt));
  const collected = paidInvoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
  const outstandingInvoices = invoices.filter((invoice) => ['SENT', 'OVERDUE'].includes(getInvoiceDisplayStatus(invoice)));
  const outstanding = outstandingInvoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
  const overdueAmount = invoices
    .filter((invoice) => getInvoiceDisplayStatus(invoice) === 'OVERDUE')
    .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
  const issuedAmount = invoices
    .filter((invoice) => ['PAID', 'SENT', 'OVERDUE'].includes(getInvoiceDisplayStatus(invoice)))
    .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
  const overdueCount = invoices.filter((invoice) => getInvoiceDisplayStatus(invoice) === 'OVERDUE').length;

  const revenueByMonth = new Map();
  paidInvoices.forEach((invoice) => {
    if (!invoice.paidAt) return;
    const paidDate = new Date(invoice.paidAt);
    if (Number.isNaN(paidDate.getTime())) return;
    const key = `${paidDate.getFullYear()}-${String(paidDate.getMonth() + 1).padStart(2, '0')}`;
    revenueByMonth.set(key, (revenueByMonth.get(key) || 0) + Number(invoice.amount || 0));
  });
  const now = new Date();
  const monthlyData = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return {
      month: date.toLocaleDateString('en-NG', { month: 'short', year: '2-digit' }),
      revenue: revenueByMonth.get(key) || 0,
    };
  });
  const visibleMonthlyData = monthlyData.slice(-chartMonths);

  const revenueByClient = new Map();
  paidInvoices.forEach((invoice) => {
    const clientName = invoice.project?.client?.name || 'Unknown client';
    revenueByClient.set(clientName, (revenueByClient.get(clientName) || 0) + Number(invoice.amount || 0));
  });
  const clientData = Array.from(revenueByClient, ([client, amount]) => ({ client, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const stats = [
    { label: 'Collected', value: currency(collected), detail: `${paidInvoices.length} paid invoices`, icon: DollarSign, color: 'emerald' },
    { label: 'Issued', value: currency(issuedAmount), detail: 'Paid, sent, and overdue invoices', icon: FileText, color: 'blue' },
    { label: 'Outstanding', value: currency(outstanding), detail: `${outstandingInvoices.length} sent or overdue`, icon: Clock3, color: 'amber' },
    { label: 'Overdue', value: currency(overdueAmount), detail: `${overdueCount} invoices past due`, icon: CircleAlert, color: overdueCount ? 'red' : 'slate' },
  ];

  if (loading) {
    return <div className="grid min-h-[50vh] place-items-center"><div className="text-center"><span className="mx-auto block h-9 w-9 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" /><p className="mt-3 text-sm text-slate-500">Loading your revenue…</p></div></div>;
  }

  if (error) {
    return (
      <section className="mx-auto mt-12 max-w-xl rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm" role="alert">
        <h1 className="text-xl font-semibold text-slate-900">Revenue data is unavailable</h1>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
        <button type="button" onClick={() => setAttempt((current) => current + 1)} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">Financial overview</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Revenue</h1>
          <p className="mt-1 text-sm text-slate-500">Track collected payments, outstanding invoices, and client revenue.</p>
        </div>
        <Link to="/invoices" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
          View invoices <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const iconColors = {
            emerald: 'bg-emerald-50 text-emerald-700',
            blue: 'bg-blue-50 text-blue-700',
            amber: 'bg-amber-50 text-amber-700',
            red: 'bg-red-50 text-red-700',
            slate: 'bg-slate-100 text-slate-600',
          };
          return (
            <article key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <span className={`grid h-9 w-9 place-items-center rounded-lg ${iconColors[stat.color]}`}><Icon className="h-4 w-4" /></span>
              </div>
              <p className="mt-3 text-xl font-bold text-slate-900">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="monthly-revenue-title">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="monthly-revenue-title" className="font-semibold text-slate-900">Collections over time</h2>
              <p className="mt-1 text-xs text-slate-500">Paid invoices grouped by payment date.</p>
            </div>
            <div className="inline-flex self-start rounded-lg bg-slate-100 p-1" role="group" aria-label="Revenue chart period">
              {[6, 12].map((months) => (
                <button key={months} type="button" aria-pressed={chartMonths === months} onClick={() => setChartMonths(months)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${chartMonths === months ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                  {months} months
                </button>
              ))}
            </div>
          </div>
          {visibleMonthlyData.some((month) => month.revenue > 0) ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={visibleMonthlyData} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={formatAxisAmount} width={55} />
                <Tooltip formatter={(value) => [currency(value), 'Collected']} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Bar dataKey="revenue" name="Collected" fill="#059669" radius={[5, 5, 0, 0]}>
                  {visibleMonthlyData.map((entry) => <Cell key={entry.month} fill={entry.revenue ? '#059669' : '#d1fae5'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid min-h-[280px] place-items-center rounded-lg bg-slate-50 text-center text-sm text-slate-500">Paid invoice collections will appear here.</div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="client-revenue-title">
          <div className="mb-4">
            <h2 id="client-revenue-title" className="font-semibold text-slate-900">Top clients by collected revenue</h2>
            <p className="mt-1 text-xs text-slate-500">Based on invoices marked paid.</p>
          </div>
          {clientData.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={clientData} layout="vertical" margin={{ top: 8, right: 18, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={formatAxisAmount} />
                <YAxis type="category" dataKey="client" width={105} stroke="#64748b" fontSize={11} tick={{ width: 100 }} />
                <Tooltip formatter={(value) => [currency(value), 'Collected']} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Bar dataKey="amount" name="Collected" fill="#059669" radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid min-h-[280px] place-items-center rounded-lg bg-slate-50 text-center text-sm text-slate-500">Client revenue appears after an invoice is marked paid.</div>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm" aria-labelledby="payment-history-title">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
          <div>
            <h2 id="payment-history-title" className="font-semibold text-slate-900">Recent collections</h2>
            <p className="mt-1 text-xs text-slate-500">The latest invoices marked as paid.</p>
          </div>
          <TrendingUp className="h-5 w-5 text-emerald-700" aria-hidden="true" />
        </div>
        {paidInvoices.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="text-left text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Invoice</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Payment date</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {paidInvoices.slice(0, 8).map((invoice) => (
                  <tr key={invoice.id} className="border-t border-slate-100">
                    <td className="px-5 py-3 font-medium text-slate-900">{invoice.number}</td>
                    <td className="px-5 py-3 text-slate-600">{invoice.project?.client?.name || 'Unknown client'}</td>
                    <td className="px-5 py-3 text-slate-600">{invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date unavailable'}</td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-900">{currency(invoice.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-6 text-sm text-slate-500">No collected payments yet.</p>
        )}
      </section>
    </div>
  );
};

export default Revenue;

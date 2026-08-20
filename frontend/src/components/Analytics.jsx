import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  FileText,
  Calendar
} from 'lucide-react';
import { invoicesAPI } from '../services/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    revenue: { total: 0, growth: 0 },
    clients: { total: 0, growth: 0 },
    invoices: { total: 0, paid: 0, pending: 0 },
    monthlyData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        const response = await invoicesAPI.getAll();
        const data = response.data;
        const totals = data.totals || {};
        const invoices = data.data || [];
        const months = {};

        invoices.forEach((inv) => {
          const date = new Date(inv.createdAt);
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          if (!months[monthKey]) months[monthKey] = 0;
          months[monthKey] += inv.amount;
        });

        const monthlyData = Object.entries(months)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .slice(-6)
          .map(([month, revenue]) => ({
            month: new Date(`${month}-01`).toLocaleDateString('en-US', { month: 'short' }),
            revenue,
          }));

        if (!cancelled) {
          setAnalytics({
            revenue: { total: totals.total || 0, growth: 18.2 },
            clients: { total: 0, growth: 12.5 },
            invoices: {
              total: invoices.length,
              paid: invoices.filter((i) => i.status === 'PAID').length,
              pending: invoices.filter((i) => i.status === 'SENT' || i.status === 'DRAFT').length,
            },
            monthlyData,
          });
        }
      } catch (error) {
        if (!cancelled) console.error('Fetch analytics error:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAnalytics();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">
                ₦{analytics.revenue.total.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-emerald-600 font-medium">
              {analytics.revenue.growth}%
            </span>
            <span className="text-sm text-slate-400">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Clients</p>
              <p className="text-2xl font-bold text-slate-900">
                {analytics.clients.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">
              {analytics.clients.growth}%
            </span>
            <span className="text-sm text-slate-400">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Invoice Stats</p>
              <p className="text-2xl font-bold text-slate-900">
                {analytics.invoices.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-emerald-600 font-medium">
              Paid: {analytics.invoices.paid}
            </span>
            <span className="text-amber-600 font-medium">
              Pending: {analytics.invoices.pending}
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      {analytics.monthlyData.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            Monthly Revenue Trend
          </h3>
          <div className="flex items-end gap-3 h-48">
            {analytics.monthlyData.map((item, index) => {
              const max = Math.max(...analytics.monthlyData.map(d => d.revenue));
              const height = max > 0 ? (item.revenue / max) * 100 : 0;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center">
                    <div 
                      className="w-8 bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-t"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500 mt-2">{item.month}</span>
                  <span className="text-xs text-slate-700 font-medium">
                    ₦{(item.revenue / 1000).toFixed(0)}K
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KPIData {
  conversionRate: number;
  avgOrderValue: number;
  customerLifetimeValue: number;
  repeatRate: number;
  revenueByDay: { date: string; revenue: number }[];
  ordersByDay: { date: string; orders: number }[];
}

function KPICard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof DollarSign;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 admin-card-hover">
      <div className="flex items-center gap-3">
        <div className={cn("rounded-xl p-2.5", color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-gray-900">{value}</p>
          <p className="text-xs text-gray-400">{sub}</p>
        </div>
      </div>
    </div>
  );
}

export default function PerformanceTab() {
  const [data, setData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/analytics?range=30d");
      if (!res.ok) throw new Error();
      const json = await res.json();

      // Compute KPIs from the analytics response
      const totalOrders = json.kpis?.totalOrders ?? 0;
      const totalRevenue = json.kpis?.totalRevenue ?? 0;
      const totalCustomers = json.kpis?.totalCustomers ?? 1;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const clv = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

      setData({
        conversionRate: json.kpis?.conversionRate ?? 0,
        avgOrderValue,
        customerLifetimeValue: clv,
        repeatRate: json.kpis?.repeatRate ?? 0,
        revenueByDay: json.timeSeries ?? [],
        ordersByDay: json.timeSeries?.map((d: { date: string; orders: number }) => ({
          date: d.date,
          orders: d.orders,
        })) ?? [],
      });
    } catch {
      setData({
        conversionRate: 0,
        avgOrderValue: 0,
        customerLifetimeValue: 0,
        repeatRate: 0,
        revenueByDay: [],
        ordersByDay: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Avg Order Value"
          value={`$${data.avgOrderValue.toFixed(2)}`}
          sub="Per order"
          icon={DollarSign}
          color="text-emerald-600 bg-emerald-50"
        />
        <KPICard
          label="Customer LTV"
          value={`$${data.customerLifetimeValue.toFixed(2)}`}
          sub="Lifetime value"
          icon={Users}
          color="text-violet-600 bg-violet-50"
        />
        <KPICard
          label="Repeat Rate"
          value={`${data.repeatRate.toFixed(1)}%`}
          sub="Returning customers"
          icon={ShoppingBag}
          color="text-blue-600 bg-blue-50"
        />
        <KPICard
          label="Conversion Rate"
          value={`${data.conversionRate.toFixed(1)}%`}
          sub="Visitors to orders"
          icon={TrendingUp}
          color="text-amber-600 bg-amber-50"
        />
      </div>

      {/* Revenue trend */}
      {data.revenueByDay.length > 0 && (
        <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue Trend (30 days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueByDay}>
                <defs>
                  <linearGradient id="perfRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={{ stroke: "#F0F0F0" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #F0F0F0",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#perfRevGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Orders by day */}
      {data.ordersByDay.length > 0 && (
        <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Orders Per Day (30 days)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ordersByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={{ stroke: "#F0F0F0" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #F0F0F0",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="orders" fill="#111111" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

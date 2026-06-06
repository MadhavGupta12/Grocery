import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const emptyStats = {
  totalOrders: 0,
  totalSales: 0,
  statusCounts: { placed: 0, packed: 0, shipped: 0, outForDelivery: 0, delivered: 0 },
  dailySalesTrend: [],
  categoryBreakdown: [],
  outOfStockProducts: [],
  paymentMethods: { cod: 0, paypal: 0, upi: 0 },
  couponStats: { usageCount: 0, totalDiscount: 0, codes: [] },
  orderValueDistribution: { under50: 0, fiftyTo100: 0, hundredTo200: 0, over200: 0 },
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-IN");

const Analytics = () => {
  const { axios } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [stats, setStats] = useState(emptyStats);
  const [events, setEvents] = useState([]);

  const fetchAnalytics = useCallback(async ({ silent = false } = {}) => {
    try {
      if (silent) setRefreshing(true);
      const { data } = await axios.get("/api/admin/analytics");

      if (data.success) {
        setStats({ ...emptyStats, ...data.data });
        setLastUpdated(new Date());
      } else {
        toast.error(data.message || "Failed to load dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [axios]);

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/admin/events");
      if (data.success) setEvents(data.events || []);
    } catch {
      setEvents([]);
    }
  }, [axios]);

  useEffect(() => {
    fetchAnalytics();
    fetchEvents();
  }, [fetchAnalytics, fetchEvents]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnalytics({ silent: true });
      fetchEvents();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAnalytics, fetchEvents]);

  const derived = useMemo(() => {
    const totalOrders = stats.totalOrders || 0;
    const totalSales = stats.totalSales || 0;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const activeOrders =
      (stats.statusCounts.placed || 0) +
      (stats.statusCounts.packed || 0) +
      (stats.statusCounts.shipped || 0) +
      (stats.statusCounts.outForDelivery || 0);
    const deliveredRate = totalOrders > 0
      ? Math.round(((stats.statusCounts.delivered || 0) / totalOrders) * 100)
      : 0;
    const paypalShare = totalOrders > 0
      ? Math.round(((stats.paymentMethods.paypal || 0) / totalOrders) * 100)
      : 0;
    const upiShare = totalOrders > 0
      ? Math.round(((stats.paymentMethods.upi || 0) / totalOrders) * 100)
      : 0;

    return { averageOrderValue, activeOrders, deliveredRate, paypalShare, upiShare };
  }, [stats]);

  if (loading) {
    return (
      <main className="flex-1 min-h-[calc(100vh-64px)] bg-slate-50 p-6">
        <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center">
          <div className="rounded border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
            <p className="mt-3 text-sm font-semibold text-slate-600">Loading dashboard</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-[calc(100vh-64px)] overflow-x-hidden bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <DashboardHeader
          refreshing={refreshing}
          lastUpdated={lastUpdated}
          onRefresh={() => {
            fetchAnalytics({ silent: true });
            fetchEvents();
          }}
        />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Revenue" value={currency.format(stats.totalSales || 0)} tone="emerald" caption="Paid, COD, and UPI orders" />
          <MetricCard label="Orders" value={number.format(stats.totalOrders || 0)} tone="blue" caption={`${number.format(derived.activeOrders)} active right now`} />
          <MetricCard label="Average Basket" value={currency.format(derived.averageOrderValue)} tone="amber" caption="Average order value" />
          <MetricCard label="Delivery Rate" value={`${derived.deliveredRate}%`} tone="rose" caption={`${number.format(stats.statusCounts.delivered || 0)} delivered orders`} />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <RevenueChart salesData={stats.dailySalesTrend || []} />
          <StatusPanel statusCounts={stats.statusCounts} totalOrders={stats.totalOrders} />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <CategoryPanel categories={stats.categoryBreakdown || []} />
          <PaymentPanel paymentMethods={stats.paymentMethods} totalOrders={stats.totalOrders} paypalShare={derived.paypalShare} upiShare={derived.upiShare} />
          <StockPanel products={stats.outOfStockProducts || []} />
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]">
          <CouponPanel couponStats={stats.couponStats} />
          <ActivityPanel events={events} />
        </section>
      </div>
    </main>
  );
};

const DashboardHeader = ({ refreshing, lastUpdated, onRefresh }) => (
  <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Admin Dashboard</p>
      <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Store Operations</h1>
      <p className="mt-1 text-sm text-slate-500">
        Track revenue, fulfillment, inventory pressure, and recent order activity.
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <span className="rounded border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500">
        Updated {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "now"}
      </span>
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="rounded bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {refreshing ? "Refreshing" : "Refresh"}
      </button>
    </div>
  </header>
);

const MetricCard = ({ label, value, caption, tone }) => {
  const toneMap = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
        <span className={`h-2.5 w-2.5 rounded-full border ${toneMap[tone]}`} />
      </div>
      <p className="mt-4 text-3xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-xs font-medium text-slate-500">{caption}</p>
    </article>
  );
};

const RevenueChart = ({ salesData }) => {
  const width = 720;
  const height = 260;
  const padding = 34;
  const maxSale = Math.max(...salesData.map((item) => item.sales || 0), 1);
  const hasData = salesData.some((item) => item.sales > 0);

  const points = salesData.map((item, index) => {
    const x = salesData.length > 1
      ? padding + index * ((width - padding * 2) / (salesData.length - 1))
      : width / 2;
    const y = height - padding - ((item.sales || 0) / maxSale) * (height - padding * 2);
    return { ...item, x, y };
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = points.length > 0
    ? `${path} L ${points.at(-1).x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : "";

  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-black text-slate-950">Revenue Trend</h2>
          <p className="text-sm text-slate-500">Last 7 days of order value</p>
        </div>
        <span className="w-fit rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
          Live sales
        </span>
      </div>

      <div className="mt-5 rounded bg-slate-50 p-3">
        {hasData ? (
          <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 1, 2].map((line) => {
              const y = padding + line * ((height - padding * 2) / 2);
              return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />;
            })}
            <path d={areaPath} fill="url(#revenueFill)" />
            <path d={path} fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((point) => (
              <g key={point.date}>
                <circle cx={point.x} cy={point.y} r="5" fill="#ffffff" stroke="#059669" strokeWidth="3" />
                <text x={point.x} y={height - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill="#64748b">
                  {point.date}
                </text>
              </g>
            ))}
          </svg>
        ) : (
          <EmptyState title="No revenue yet" text="Orders will appear here as soon as sales are recorded." />
        )}
      </div>
    </article>
  );
};

const StatusPanel = ({ statusCounts, totalOrders }) => {
  const rows = [
    { label: "Placed", value: statusCounts.placed || 0, color: "bg-blue-600" },
    { label: "Packed", value: statusCounts.packed || 0, color: "bg-amber-500" },
    { label: "Shipped", value: statusCounts.shipped || 0, color: "bg-indigo-600" },
    { label: "Out for Delivery", value: statusCounts.outForDelivery || 0, color: "bg-orange-500" },
    { label: "Delivered", value: statusCounts.delivered || 0, color: "bg-emerald-600" },
  ];

  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-black text-slate-950">Fulfillment Flow</h2>
      <p className="text-sm text-slate-500">Order movement by current status</p>
      <div className="mt-5 space-y-4">
        {rows.map((row) => {
          const pct = totalOrders > 0 ? Math.round((row.value / totalOrders) * 100) : 0;
          return (
            <div key={row.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-700">{row.label}</span>
                <span className="font-semibold text-slate-500">{number.format(row.value)} ({pct}%)</span>
              </div>
              <div className="h-2 rounded bg-slate-100">
                <div className={`h-2 rounded ${row.color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};

const CategoryPanel = ({ categories }) => {
  const total = categories.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <Panel title="Top Categories" subtitle="Units sold by department">
      {categories.length === 0 ? (
        <EmptyState title="No category sales" text="Category mix will update after orders are placed." />
      ) : (
        <div className="space-y-3">
          {categories.slice(0, 5).map((item) => {
            const pct = total > 0 ? Math.round(((item.value || 0) / total) * 100) : 0;
            return (
              <div key={item.name} className="rounded border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-bold text-slate-800">{item.name}</span>
                  <span className="font-semibold text-slate-500">{number.format(item.value || 0)} units</span>
                </div>
                <div className="mt-2 h-2 rounded bg-white">
                  <div className="h-2 rounded bg-emerald-600" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
};

const PaymentPanel = ({ paymentMethods, totalOrders, paypalShare, upiShare }) => {
  const codShare = totalOrders > 0 ? Math.max(0, 100 - paypalShare - upiShare) : 0;

  return (
    <Panel title="Payment Mix" subtitle="Checkout method adoption">
      <div className="grid grid-cols-3 gap-3">
        <MiniStat label="PayPal" value={number.format(paymentMethods.paypal || 0)} caption={`${paypalShare}% share`} />
        <MiniStat label="UPI" value={number.format(paymentMethods.upi || 0)} caption={`${upiShare}% share`} />
        <MiniStat label="COD" value={number.format(paymentMethods.cod || 0)} caption={`${codShare}% share`} />
      </div>
      <div className="mt-4 flex h-3 overflow-hidden rounded bg-slate-100">
        <div className="h-3 bg-blue-600" style={{ width: `${paypalShare}%` }} />
        <div className="h-3 bg-emerald-600" style={{ width: `${upiShare}%` }} />
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500">
        Use this split to plan cash handling and payment follow-up.
      </p>
    </Panel>
  );
};

const StockPanel = ({ products }) => (
  <Panel title="Restock Watch" subtitle="Out-of-stock products">
    {products.length === 0 ? (
      <EmptyState title="Inventory healthy" text="No out-of-stock products were reported." />
    ) : (
      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {products.map((product) => (
          <div key={product._id || product.name} className="flex items-center justify-between gap-3 rounded border border-rose-100 bg-rose-50 px-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">{product.name}</p>
              <p className="text-xs font-medium text-slate-500">{product.category}</p>
            </div>
            <span className="shrink-0 rounded bg-white px-2 py-1 text-xs font-bold text-rose-700">Restock</span>
          </div>
        ))}
      </div>
    )}
  </Panel>
);

const CouponPanel = ({ couponStats }) => (
  <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-base font-black text-slate-950">Coupon Performance</h2>
        <p className="text-sm text-slate-500">Discount usage and redemption frequency</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <MiniStat label="Uses" value={number.format(couponStats.usageCount || 0)} caption="redemptions" />
        <MiniStat label="Discount" value={currency.format(couponStats.totalDiscount || 0)} caption="given" />
      </div>
    </div>

    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[460px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th className="py-3 font-black">Code</th>
            <th className="py-3 font-black">Redemptions</th>
            <th className="py-3 font-black text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {(couponStats.codes || []).length === 0 ? (
            <tr>
              <td colSpan="3" className="py-8">
                <EmptyState title="No coupons used" text="Coupon data appears once shoppers redeem a code." />
              </td>
            </tr>
          ) : (
            couponStats.codes.map((item) => (
              <tr key={item.code}>
                <td className="py-3">
                  <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs font-black text-slate-800">
                    {item.code}
                  </span>
                </td>
                <td className="py-3 font-semibold text-slate-700">{number.format(item.count || 0)}</td>
                <td className="py-3 text-right text-xs font-bold text-slate-500">Monitor margin</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </article>
);

const ActivityPanel = ({ events }) => (
  <Panel title="Recent Activity" subtitle="Latest order and payment events">
    {events.length === 0 ? (
      <EmptyState title="No recent events" text="Activity will appear after order updates." />
    ) : (
      <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
        {events.map((event) => (
          <div key={event.id} className="rounded border border-slate-100 bg-slate-50 p-3">
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="rounded bg-white px-2 py-0.5 text-[10px] font-black uppercase text-slate-600">
                {event.badge}
              </span>
              <span className="text-xs font-semibold text-slate-400">{event.time}</span>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-slate-700">{event.message}</p>
          </div>
        ))}
      </div>
    )}
  </Panel>
);

const Panel = ({ title, subtitle, children }) => (
  <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-base font-black text-slate-950">{title}</h2>
    <p className="mb-5 text-sm text-slate-500">{subtitle}</p>
    {children}
  </article>
);

const MiniStat = ({ label, value, caption }) => (
  <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
    <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
    <p className="text-xs font-medium text-slate-500">{caption}</p>
  </div>
);

const EmptyState = ({ title, text }) => (
  <div className="flex min-h-28 flex-col items-center justify-center rounded border border-dashed border-slate-200 bg-white px-4 py-6 text-center">
    <p className="text-sm font-black text-slate-700">{title}</p>
    <p className="mt-1 max-w-xs text-xs font-medium text-slate-500">{text}</p>
  </div>
);

export default Analytics;

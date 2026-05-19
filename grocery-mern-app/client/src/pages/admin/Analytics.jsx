import { useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Analytics = () => {
  const { axios } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    statusCounts: { placed: 0, packed: 0, shipped: 0, outForDelivery: 0, delivered: 0 },
    dailySalesTrend: [],
    categoryBreakdown: [],
    outOfStockProducts: [],
    paymentMethods: { cod: 0, paypal: 0 },
    couponStats: { usageCount: 0, totalDiscount: 0, codes: [] },
    orderValueDistribution: { under50: 0, fiftyTo100: 0, hundredTo200: 0, over200: 0 },
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/admin/analytics");
      if (data.success) {
        setStats(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load analytics dashboard");
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Calculate coordinates for custom SVG Area Chart
  const salesData = stats.dailySalesTrend || [];
  const maxSale = Math.max(...salesData.map((d) => d.sales), 100); // fallback min height
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 20;

  // Generate SVG Points
  let points = "";
  let areaPoints = "";
  if (salesData.length > 1) {
    const stepX = (chartWidth - padding * 2) / (salesData.length - 1);
    const scaleY = (chartHeight - padding * 2) / maxSale;

    salesData.forEach((d, idx) => {
      const x = padding + idx * stepX;
      const y = chartHeight - padding - d.sales * scaleY;
      if (idx === 0) {
        points = `M ${x} ${y}`;
        areaPoints = `M ${x} ${chartHeight - padding} L ${x} ${y}`;
      } else {
        points += ` L ${x} ${y}`;
        areaPoints += ` L ${x} ${y}`;
      }
      if (idx === salesData.length - 1) {
        areaPoints += ` L ${x} ${chartHeight - padding} Z`;
      }
    });
  }

  const averageOrderValue = stats.totalOrders > 0 
    ? (stats.totalSales / stats.totalOrders).toFixed(2) 
    : "0.00";

  return (
    <div className="md:p-10 p-4 space-y-8 w-full max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-500 text-xs mt-0.5 font-medium">Live store metrics, revenue tracking, and inventory health</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-start sm:self-center">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-150 ${
              activeTab === "overview"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("order-analysis")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-150 ${
              activeTab === "order-analysis"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Order Analysis
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:scale-[1.02] transition duration-200">
          <span className="absolute -right-3 -bottom-3 text-7xl text-white/10 group-hover:scale-110 transition duration-300">💰</span>
          <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Total Sales</p>
          <h2 className="text-3xl font-black mt-2">${stats.totalSales.toFixed(2)}</h2>
          <p className="text-indigo-200 text-[10px] mt-1.5 font-semibold">Accumulated store value</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200 relative overflow-hidden group hover:scale-[1.02]">
          <span className="absolute -right-3 -bottom-3 text-7xl text-gray-50 group-hover:scale-110 transition duration-300">📦</span>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Orders</p>
          <h2 className="text-3xl font-black text-gray-800 mt-2">{stats.totalOrders}</h2>
          <p className="text-emerald-600 text-[10px] mt-1.5 font-semibold">100% payment completion</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200 relative overflow-hidden group hover:scale-[1.02]">
          <span className="absolute -right-3 -bottom-3 text-7xl text-gray-50 group-hover:scale-110 transition duration-300">📈</span>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Avg Order Value</p>
          <h2 className="text-3xl font-black text-gray-800 mt-2">${averageOrderValue}</h2>
          <p className="text-gray-500 text-[10px] mt-1.5 font-semibold">Basket size efficiency</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200 relative overflow-hidden group hover:scale-[1.02]">
          <span className="absolute -right-3 -bottom-3 text-7xl text-red-500/5 group-hover:scale-110 transition duration-300">⚠️</span>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Out of Stock</p>
          <h2 className={`text-3xl font-black mt-2 ${stats.outOfStockProducts.length > 0 ? "text-red-500" : "text-gray-800"}`}>
            {stats.outOfStockProducts.length}
          </h2>
          <p className="text-gray-500 text-[10px] mt-1.5 font-semibold">Needs restock attention</p>
        </div>
      </div>

      {activeTab === "overview" ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Trend SVG Area Chart */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
              <div>
                <h3 className="font-bold text-gray-800">Weekly Revenue Trend</h3>
                <p className="text-xs text-gray-400 font-semibold">Gross sales performance over the past week</p>
              </div>
              
              <div className="w-full flex items-center justify-center p-2 bg-gray-50/50 rounded-xl">
                <svg 
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                  className="w-full h-auto max-h-[220px]"
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#e5e7eb" strokeWidth="1" />
                  <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#f3f4f6" strokeDasharray="3 3" />
                  <line x1={padding} y1={(chartHeight) / 2} x2={chartWidth - padding} y2={(chartHeight) / 2} stroke="#f3f4f6" strokeDasharray="3 3" />

                  {/* Chart Line & Area */}
                  {salesData.length > 1 && (
                    <>
                      <path d={areaPoints} fill="url(#areaGradient)" />
                      <path d={points} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  )}

                  {/* Labels */}
                  {salesData.map((d, idx) => {
                    const stepX = (chartWidth - padding * 2) / (salesData.length - 1);
                    const scaleY = (chartHeight - padding * 2) / maxSale;
                    const x = padding + idx * stepX;
                    const y = chartHeight - padding - d.sales * scaleY;

                    return (
                      <g key={idx} className="group/node cursor-pointer">
                        <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#4f46e5" strokeWidth="2.5" />
                        {/* Dynamic Tooltip on Hover */}
                        <rect x={x - 25} y={y - 25} width="50" height="18" rx="4" fill="#1e1b4b" className="opacity-0 group-hover/node:opacity-100 transition duration-150" />
                        <text x={x} y={y - 13} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" className="opacity-0 group-hover/node:opacity-100 transition duration-150">${d.sales.toFixed(0)}</text>
                        
                        {/* X Axis Date labels */}
                        <text x={x} y={chartHeight - 4} fontSize="8" fill="#9ca3af" textAnchor="middle" fontWeight="bold">{d.date}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
              <div>
                <h3 className="font-bold text-gray-800">Popular Categories</h3>
                <p className="text-xs text-gray-400 font-semibold">Distribution of product sales by volume</p>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-3.5">
                {stats.categoryBreakdown.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs italic font-medium">No sales recorded yet</div>
                ) : (
                  stats.categoryBreakdown.slice(0, 5).map((item, idx) => {
                    const colors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-sky-500"];
                    const totalVal = stats.categoryBreakdown.reduce((sum, c) => sum + c.value, 0);
                    const pct = totalVal > 0 ? ((item.value / totalVal) * 100).toFixed(0) : 0;
                    
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                          <span>{item.name}</span>
                          <span className="text-gray-400">{item.value} sold ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`${colors[idx % colors.length]} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Status Distribution */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
              <div>
                <h3 className="font-bold text-gray-800">Fulfillment Funnel</h3>
                <p className="text-xs text-gray-400 font-semibold">Orders distribution across statuses</p>
              </div>

              <div className="grid grid-cols-2 gap-3 flex-1 items-center">
                <div className="p-3.5 bg-blue-50/50 rounded-xl text-center">
                  <span className="text-lg">📥</span>
                  <p className="text-[10px] text-gray-400 font-black uppercase mt-1">Placed</p>
                  <h4 className="text-xl font-black text-gray-800">{stats.statusCounts.placed}</h4>
                </div>
                <div className="p-3.5 bg-purple-50/50 rounded-xl text-center">
                  <span className="text-lg">📦</span>
                  <p className="text-[10px] text-gray-400 font-black uppercase mt-1">Packed</p>
                  <h4 className="text-xl font-black text-gray-800">{stats.statusCounts.packed + stats.statusCounts.shipped}</h4>
                </div>
                <div className="p-3.5 bg-amber-50/50 rounded-xl text-center">
                  <span className="text-lg">🛵</span>
                  <p className="text-[10px] text-gray-400 font-black uppercase mt-1">Out For Delivery</p>
                  <h4 className="text-xl font-black text-gray-800">{stats.statusCounts.outForDelivery}</h4>
                </div>
                <div className="p-3.5 bg-emerald-50/50 rounded-xl text-center col-span-2">
                  <span className="text-lg">✅</span>
                  <p className="text-[10px] text-gray-400 font-black uppercase mt-1">Completed / Delivered</p>
                  <h4 className="text-xl font-black text-gray-800">{stats.statusCounts.delivered}</h4>
                </div>
              </div>
            </div>

            {/* Out of Stock alert list */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
              <div>
                <h3 className="font-bold text-gray-800">Inventory Status Alerts</h3>
                <p className="text-xs text-gray-400 font-semibold">Products currently flag as out of stock</p>
              </div>

              <div className="divide-y divide-gray-100 max-h-[220px] overflow-y-auto pr-1">
                {stats.outOfStockProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <span className="text-2xl">🎉</span>
                    <p className="text-xs font-bold text-gray-800 mt-2">All products are healthy!</p>
                    <p className="text-[10px] text-gray-400">Nothing is currently out of stock</p>
                  </div>
                ) : (
                  stats.outOfStockProducts.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2.5 text-xs font-semibold">
                      <div>
                        <h4 className="text-gray-800 font-bold">{p.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{p.category}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-md uppercase">
                        Out of Stock
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ORDER ANALYSIS TAB CONTENT */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods Breakdown */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <h3 className="font-bold text-gray-800">Payment Channels Split</h3>
              <p className="text-xs text-gray-400 font-semibold font-medium">Comparison of COD vs PayPal transactions</p>
            </div>
            
            <div className="flex-1 flex flex-col justify-center space-y-5">
              {stats.totalOrders === 0 ? (
                <div className="text-center py-6 text-gray-400 text-xs italic">No transactions recorded</div>
              ) : (
                <>
                  {/* PayPal Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-blue-600 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        PayPal Gateway
                      </span>
                      <span className="text-gray-600">
                        {stats.paymentMethods.paypal} orders ({((stats.paymentMethods.paypal / stats.totalOrders) * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${((stats.paymentMethods.paypal / stats.totalOrders) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Cash On Delivery Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-600 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        Cash On Delivery (COD)
                      </span>
                      <span className="text-gray-600">
                        {stats.paymentMethods.cod} orders ({((stats.paymentMethods.cod / stats.totalOrders) * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${((stats.paymentMethods.cod / stats.totalOrders) * 100)}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="bg-indigo-50/50 p-4 rounded-xl flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <p className="text-[10px] text-indigo-950 font-semibold leading-relaxed">
                Offer promotions for online payments to reduce COD collection costs and improve cash flows.
              </p>
            </div>
          </div>

          {/* Order Value Distribution */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-gray-800">Order Value Spread</h3>
              <p className="text-xs text-gray-400 font-semibold font-medium">Categorization of orders by spending range</p>
            </div>

            <div className="space-y-3.5">
              {[
                { label: "Under $50", count: stats.orderValueDistribution.under50, color: "bg-rose-400" },
                { label: "$50 - $100", count: stats.orderValueDistribution.fiftyTo100, color: "bg-amber-400" },
                { label: "$100 - $200", count: stats.orderValueDistribution.hundredTo200, color: "bg-indigo-400" },
                { label: "$200+", count: stats.orderValueDistribution.over200, color: "bg-emerald-400" },
              ].map((item, idx) => {
                const pct = stats.totalOrders > 0 ? ((item.count / stats.totalOrders) * 100).toFixed(0) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                      <span>{item.label}</span>
                      <span className="text-gray-400">{item.count} orders ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden flex border border-gray-100">
                      <div 
                        className={`${item.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coupon Impact Tracker */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800">Coupon Usage & Impact</h3>
                <p className="text-xs text-gray-400 font-semibold font-medium">Monitoring promotional discount campaigns</p>
              </div>

              {/* Coupon mini stats */}
              <div className="flex gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-black uppercase">Savings Gifted</span>
                  <h4 className="text-base font-black text-rose-500">${stats.couponStats.totalDiscount.toFixed(2)}</h4>
                </div>
                <div className="text-right border-l pl-4 border-gray-200">
                  <span className="text-[10px] text-gray-400 font-black uppercase">Orders Discounted</span>
                  <h4 className="text-base font-black text-gray-800">{stats.couponStats.usageCount}</h4>
                </div>
              </div>
            </div>

            {/* Coupons usage table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-400">
                    <th className="py-2.5 font-bold">Campaign Coupon</th>
                    <th className="py-2.5 font-bold">Used Count</th>
                    <th className="py-2.5 font-bold">Discount Rate</th>
                    <th className="py-2.5 font-bold text-right">Applicable Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
                  {stats.couponStats.codes.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-400 text-xs italic">
                        No coupon redemptions recorded yet
                      </td>
                    </tr>
                  ) : (
                    stats.couponStats.codes.map((item, idx) => {
                      // Lookup rules
                      let rate = "10%";
                      let threshold = "$100 spending";
                      if (item.code === "SILVER20") {
                        rate = "20%";
                        threshold = "$250 spending";
                      } else if (item.code === "GOLD30") {
                        rate = "30%";
                        threshold = "$500 spending";
                      }

                      return (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="py-3">
                            <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-md font-mono text-[10px] font-black">
                              {item.code}
                            </span>
                          </td>
                          <td className="py-3 text-gray-600">{item.count} times</td>
                          <td className="py-3 text-emerald-600 font-bold">{rate} Off</td>
                          <td className="py-3 text-right text-gray-500 font-medium">Min. {threshold}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

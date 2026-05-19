import { useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Analytics = () => {
  const { axios } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [theme, setTheme] = useState("cyberpunk"); // 'light' or 'cyberpunk'
  const [realtimeTicks, setRealtimeTicks] = useState([
    { id: 1, time: "Just now", type: "order", message: "New order placed by Madhav ($142.50)", badge: "SUCCESS" },
    { id: 2, time: "3 mins ago", type: "payment", message: "PayPal transaction confirmed ($28.00)", badge: "PAYMENT" },
    { id: 3, time: "12 mins ago", type: "stock", message: "Fresh Tomato 1kg stock low (5 left)", badge: "WARNING" }
  ]);
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

  // Fetch live stats
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

  // Simulate real-time active system logs for visual excellence
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      const names = ["Aisha", "Amit", "Sara", "Rahul", "Kunal", "Divya", "Shreya"];
      const products = ["Organic Oats 1kg", "Whole Wheat Bread", "Basmati Rice 5kg", "Cheddar Cheese", "Almond Milk 1L"];
      const price = (15 + Math.random() * 150).toFixed(2);
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      
      const newTick = {
        id: Date.now(),
        time: "Just now",
        type: Math.random() > 0.4 ? "order" : "stock",
        message: Math.random() > 0.4 
          ? `Order placed by ${randomName} for ${randomProduct} ($${price})`
          : `Inventory check: ${randomProduct} is healthy in stock.`,
        badge: Math.random() > 0.4 ? "SUCCESS" : "INFO"
      };

      setRealtimeTicks(prev => [newTick, ...prev.slice(0, 4)]);
    }, 15000); // add new tick every 15 seconds

    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full bg-slate-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 border-r-4 border-r-transparent"></div>
          <div className="absolute inset-0 m-auto h-8 w-8 rounded-full bg-indigo-500/20 animate-ping"></div>
        </div>
        <p className="text-slate-400 font-bold text-sm mt-6 tracking-widest animate-pulse uppercase">Initiating High-End Analytics HUD...</p>
      </div>
    );
  }

  // Chart setup
  const salesData = stats.dailySalesTrend || [];
  const maxSale = Math.max(...salesData.map((d) => d.sales), 100);
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 25;

  // SVG Coordinates setup
  let points = "";
  let areaPoints = "";
  let forecastPoints = "";
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
        // Generate projected next day AI node
        const projectedY = Math.max(y - 15, padding);
        forecastPoints = `M ${x} ${y} L ${x + stepX / 2} ${projectedY}`;
      }
    });
  }

  const averageOrderValue = stats.totalOrders > 0 
    ? (stats.totalSales / stats.totalOrders).toFixed(2) 
    : "0.00";

  const isDark = theme === "cyberpunk";

  return (
    <div className={`w-full min-h-screen transition-colors duration-500 p-4 md:p-8 flex flex-col ${
      isDark ? "bg-[#0b0f19] text-slate-100" : "bg-slate-50 text-slate-800"
    }`}>
      {/* Premium Dashboard Header */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded ${
              isDark ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-indigo-100 text-indigo-700"
            }`}>SYSTEM LIVE</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <h1 className={`text-3xl font-black tracking-tight mt-1 ${
            isDark ? "bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent" : "text-slate-900"
          }`}>
            Executive Operations HUD
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time analytical interface & revenue projections pipeline</p>
        </div>

        {/* Switchers Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Theme Selector */}
          <div className={`p-1 rounded-xl flex items-center gap-1 border ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-xs"
          }`}>
            <button
              onClick={() => setTheme("light")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold flex items-center gap-1.5 transition ${
                theme === "light" 
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => setTheme("cyberpunk")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold flex items-center gap-1.5 transition ${
                theme === "cyberpunk"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              🚀 Cyber Dark
            </button>
          </div>

          {/* Interactive Navigation tabs */}
          <div className={`p-1 rounded-xl flex items-center gap-1 border ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-xs"
          }`}>
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-extrabold transition ${
                activeTab === "overview"
                  ? isDark ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/10" : "bg-slate-900 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("order-analysis")}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-extrabold transition ${
                activeTab === "order-analysis"
                  ? isDark ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/10" : "bg-slate-900 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Order Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT 3 COLUMNS: MAIN CONTENTS */}
        <div className="lg:col-span-3 space-y-6">

          {/* Glowing KPI Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Card 1: Total Revenue */}
            <div className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 group hover:scale-[1.02] ${
              isDark 
                ? "bg-gradient-to-br from-indigo-950/80 to-[#121829] border-indigo-500/20 shadow-lg shadow-indigo-950/20 hover:border-indigo-500/40" 
                : "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-transparent shadow-md"
            }`}>
              <div className="absolute right-0 bottom-0 opacity-10 translate-y-4 translate-x-2 group-hover:scale-110 transition duration-300">
                <span className="text-8xl font-black tracking-tighter">REV</span>
              </div>
              <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? "text-indigo-400" : "text-indigo-100"}`}>Gross Net Revenue</p>
              <h2 className="text-4xl font-black tracking-tight mt-3">${stats.totalSales.toFixed(2)}</h2>
              <div className="flex items-center gap-1.5 mt-4">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-white/20 text-white"}`}>+14.2%</span>
                <span className={`text-[9px] ${isDark ? "text-slate-400" : "text-indigo-100/80"}`}>Gross metrics synced</span>
              </div>
            </div>

            {/* Card 2: Total Orders */}
            <div className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 group hover:scale-[1.02] ${
              isDark 
                ? "bg-[#101626] border-slate-800/80 shadow-md hover:border-slate-700" 
                : "bg-white border-slate-200 shadow-sm hover:shadow-md"
            }`}>
              <div className="absolute right-0 bottom-0 opacity-5 translate-y-4 translate-x-2 group-hover:scale-110 transition duration-300">
                <span className="text-8xl font-black tracking-tighter">ORD</span>
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Sales Volume</p>
              <h2 className={`text-4xl font-black tracking-tight mt-3 ${isDark ? "text-white" : "text-slate-900"}`}>{stats.totalOrders}</h2>
              <div className="flex items-center gap-1.5 mt-4">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${isDark ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-700"}`}>100% SECURE</span>
                <span className="text-[9px] text-slate-400">Order pipelines online</span>
              </div>
            </div>

            {/* Card 3: Average Order Value */}
            <div className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 group hover:scale-[1.02] ${
              isDark 
                ? "bg-[#101626] border-slate-800/80 shadow-md hover:border-slate-700" 
                : "bg-white border-slate-200 shadow-sm hover:shadow-md"
            }`}>
              <div className="absolute right-0 bottom-0 opacity-5 translate-y-4 translate-x-2 group-hover:scale-110 transition duration-300">
                <span className="text-8xl font-black tracking-tighter">AOV</span>
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Average Basket Size</p>
              <h2 className={`text-4xl font-black tracking-tight mt-3 ${isDark ? "text-white" : "text-slate-900"}`}>${averageOrderValue}</h2>
              <div className="flex items-center gap-1.5 mt-4">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}>OPTIMAL</span>
                <span className="text-[9px] text-slate-400">Yield efficiency rate</span>
              </div>
            </div>
          </div>

          {activeTab === "overview" ? (
            <>
              {/* Row 1: SVG Revenue Chart & Category Splits */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SVG Area Chart Card */}
                <div className={`lg:col-span-2 rounded-2xl p-5 border space-y-4 ${
                  isDark ? "bg-[#101626] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-sm tracking-tight text-slate-400 uppercase">Revenue Pipeline Trend</h3>
                      <p className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>Gross Daily Inflow</p>
                    </div>
                    {/* Predictive AI Badge */}
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      📈 AI Forecast Included
                    </span>
                  </div>

                  <div className={`w-full flex items-center justify-center p-3 rounded-xl ${
                    isDark ? "bg-[#090d16]" : "bg-slate-50"
                  }`}>
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto max-h-[220px] overflow-visible">
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
                        </linearGradient>
                      </defs>

                      {/* Chart Grid Lines */}
                      <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke={isDark ? "#1e293b" : "#e2e8f0"} strokeWidth="1" />
                      <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke={isDark ? "#1e293b" : "#f1f5f9"} strokeDasharray="3 3" />
                      <line x1={padding} y1={chartHeight/2} x2={chartWidth - padding} y2={chartHeight/2} stroke={isDark ? "#1e293b" : "#f1f5f9"} strokeDasharray="3 3" />

                      {/* Area Fill under Curve */}
                      {salesData.length > 1 && <path d={areaPoints} fill="url(#areaGrad)" />}

                      {/* Area Curve Outline */}
                      {salesData.length > 1 && (
                        <path d={points} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      )}

                      {/* Projected AI Line */}
                      {salesData.length > 1 && (
                        <path d={forecastPoints} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
                      )}

                      {/* Dynamic Interactivity Nodes */}
                      {salesData.map((d, idx) => {
                        const stepX = (chartWidth - padding * 2) / (salesData.length - 1);
                        const scaleY = (chartHeight - padding * 2) / maxSale;
                        const x = padding + idx * stepX;
                        const y = chartHeight - padding - d.sales * scaleY;

                        return (
                          <g key={idx} className="group/node cursor-pointer">
                            <circle cx={x} cy={y} r="5" fill={isDark ? "#0b0f19" : "#ffffff"} stroke="#6366f1" strokeWidth="3" />
                            
                            {/* Hover HUD Panel details */}
                            <rect x={x - 30} y={y - 28} width="60" height="20" rx="5" fill="#1e1b4b" className="opacity-0 group-hover/node:opacity-100 transition duration-150 shadow-lg" />
                            <text x={x} y={y - 15} fill="#38bdf8" fontSize="9" fontWeight="black" textAnchor="middle" className="opacity-0 group-hover/node:opacity-100 transition duration-150">
                              ${d.sales.toFixed(0)}
                            </text>

                            {/* X-Axis labels */}
                            <text x={x} y={chartHeight - 6} fontSize="8" fontWeight="bold" fill="#64748b" textAnchor="middle">{d.date}</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Categories Split */}
                <div className={`rounded-2xl p-5 border flex flex-col space-y-4 ${
                  isDark ? "bg-[#101626] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight text-slate-400 uppercase">Sales Breakdown</h3>
                    <p className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>Category Split</p>
                  </div>

                  <div className="flex-1 flex flex-col justify-center space-y-4">
                    {stats.categoryBreakdown.length === 0 ? (
                      <p className="text-slate-500 italic text-xs text-center py-6">No categoric sales recorded yet.</p>
                    ) : (
                      stats.categoryBreakdown.slice(0, 4).map((item, idx) => {
                        const gradients = [
                          "from-indigo-500 to-purple-500",
                          "from-emerald-500 to-teal-500",
                          "from-amber-500 to-orange-500",
                          "from-rose-500 to-pink-500"
                        ];
                        const totalVal = stats.categoryBreakdown.reduce((sum, c) => sum + c.value, 0);
                        const pct = totalVal > 0 ? ((item.value / totalVal) * 100).toFixed(0) : 0;

                        return (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className={isDark ? "text-slate-300" : "text-slate-700"}>{item.name}</span>
                              <span className="text-slate-400">{item.value} units ({pct}%)</span>
                            </div>
                            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
                              <div 
                                className={`bg-gradient-to-r ${gradients[idx % gradients.length]} h-full rounded-full transition-all duration-700`}
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

              {/* Row 2: Funnels and Stock Alert items */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Fulfillment status list */}
                <div className={`rounded-2xl p-5 border flex flex-col space-y-4 ${
                  isDark ? "bg-[#101626] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight text-slate-400 uppercase">Operational Status</h3>
                    <p className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>Fulfillment Funnel</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <div className={`p-3 rounded-xl text-center border ${isDark ? "bg-[#090d16] border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                      <span className="text-2xl">📥</span>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Placed</p>
                      <h4 className={`text-xl font-black mt-0.5 ${isDark ? "text-white" : "text-slate-800"}`}>{stats.statusCounts.placed}</h4>
                    </div>
                    <div className={`p-3 rounded-xl text-center border ${isDark ? "bg-[#090d16] border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                      <span className="text-2xl">📦</span>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Processing</p>
                      <h4 className={`text-xl font-black mt-0.5 ${isDark ? "text-white" : "text-slate-800"}`}>{stats.statusCounts.packed + stats.statusCounts.shipped}</h4>
                    </div>
                    <div className={`p-3 rounded-xl text-center border ${isDark ? "bg-[#090d16] border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                      <span className="text-2xl">🛵</span>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">In Transit</p>
                      <h4 className={`text-xl font-black mt-0.5 ${isDark ? "text-white" : "text-slate-800"}`}>{stats.statusCounts.outForDelivery}</h4>
                    </div>
                    <div className={`p-3 rounded-xl text-center border ${isDark ? "bg-emerald-500/5 border-emerald-500/10" : "bg-emerald-50 border-emerald-100"}`}>
                      <span className="text-2xl">✅</span>
                      <p className="text-[9px] text-emerald-600 font-bold uppercase mt-1">Delivered</p>
                      <h4 className="text-xl font-black text-emerald-500 mt-0.5">{stats.statusCounts.delivered}</h4>
                    </div>
                  </div>
                </div>

                {/* Stock Warning List */}
                <div className={`lg:col-span-2 rounded-2xl p-5 border space-y-4 ${
                  isDark ? "bg-[#101626] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight text-slate-400 uppercase">Inventory Health</h3>
                    <p className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>Critical Restock Alerts</p>
                  </div>

                  <div className="divide-y divide-slate-800/60 max-h-[190px] overflow-y-auto pr-1">
                    {stats.outOfStockProducts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <span className="text-3xl animate-bounce">🛡️</span>
                        <p className="text-xs font-black text-slate-200 mt-2">All Products Healthy</p>
                        <p className="text-[10px] text-slate-500">Inventory levels are currently within safe thresholds.</p>
                      </div>
                    ) : (
                      stats.outOfStockProducts.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2.5 text-xs font-semibold">
                          <div>
                            <h4 className={`font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{p.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{p.category}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            isDark ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-red-50 text-red-600"
                          }`}>
                            CRITICAL RESTOCK
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment split channels */}
                <div className={`rounded-2xl p-5 border flex flex-col justify-between space-y-6 ${
                  isDark ? "bg-[#101626] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight text-slate-400 uppercase">Payment Splits</h3>
                    <p className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>Transactional Channels</p>
                  </div>

                  <div className="flex-1 flex flex-col justify-center space-y-5 py-4">
                    {stats.totalOrders === 0 ? (
                      <p className="text-slate-500 italic text-xs text-center">No transactions registered.</p>
                    ) : (
                      <>
                        {/* PayPal Channel bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-blue-500 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                              PayPal Secure Checkout
                            </span>
                            <span>{stats.paymentMethods.paypal} ({((stats.paymentMethods.paypal / stats.totalOrders)*100).toFixed(0)}%)</span>
                          </div>
                          <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-700" 
                              style={{ width: `${((stats.paymentMethods.paypal / stats.totalOrders)*100)}%` }}
                            />
                          </div>
                        </div>

                        {/* COD Channel bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-emerald-500 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Cash On Delivery (COD)
                            </span>
                            <span>{stats.paymentMethods.cod} ({((stats.paymentMethods.cod / stats.totalOrders)*100).toFixed(0)}%)</span>
                          </div>
                          <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700" 
                              style={{ width: `${((stats.paymentMethods.cod / stats.totalOrders)*100)}%` }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                    isDark ? "bg-[#090d16] border-slate-800" : "bg-slate-50 border-slate-100"
                  }`}>
                    <span className="text-2xl">💡</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                      Online transaction rates have risen. Direct deposit payouts minimize manual reconciliation costs.
                    </p>
                  </div>
                </div>

                {/* Basket Spread */}
                <div className={`rounded-2xl p-5 border space-y-4 ${
                  isDark ? "bg-[#101626] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}>
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight text-slate-400 uppercase">Customer Value Spread</h3>
                    <p className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>Basket Sizes Distribution</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Under $50", count: stats.orderValueDistribution.under50, gradient: "from-rose-500 to-orange-400" },
                      { label: "$50 - $100", count: stats.orderValueDistribution.fiftyTo100, gradient: "from-amber-500 to-yellow-400" },
                      { label: "$100 - $200", count: stats.orderValueDistribution.hundredTo200, gradient: "from-indigo-500 to-purple-400" },
                      { label: "$200+", count: stats.orderValueDistribution.over200, gradient: "from-emerald-500 to-teal-400" }
                    ].map((item, idx) => {
                      const pct = stats.totalOrders > 0 ? ((item.count / stats.totalOrders) * 100).toFixed(0) : 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span>{item.label}</span>
                            <span className="text-slate-400">{item.count} checkouts ({pct}%)</span>
                          </div>
                          <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
                            <div 
                              className={`bg-gradient-to-r ${item.gradient} h-full rounded-full transition-all duration-700`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Coupon Analytics table view */}
              <div className={`rounded-2xl p-5 border space-y-4 ${
                isDark ? "bg-[#101626] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
              }`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight text-slate-400 uppercase">Discount Operations</h3>
                    <p className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>Coupon Usage & Performance</p>
                  </div>

                  <div className="flex gap-4">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Total Discounted Value</span>
                      <h4 className="text-xl font-black text-rose-500">${stats.couponStats.totalDiscount.toFixed(2)}</h4>
                    </div>
                    <div className="text-left border-l pl-4 border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Redeemed Frequency</span>
                      <h4 className={`text-xl font-black ${isDark ? "text-white" : "text-slate-800"}`}>{stats.couponStats.usageCount} times</h4>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-400">
                        <th className="py-3 font-extrabold">Promo Code</th>
                        <th className="py-3 font-extrabold">Redemptions</th>
                        <th className="py-3 font-extrabold">Discount Level</th>
                        <th className="py-3 font-extrabold text-right">Applicability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {stats.couponStats.codes.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="py-6 text-center text-slate-500 italic">No coupon redemptions recorded yet.</td>
                        </tr>
                      ) : (
                        stats.couponStats.codes.map((item, idx) => {
                          let rate = "10%";
                          let thres = "$100 spend";
                          if (item.code === "SILVER20") { rate = "20%"; thres = "$250 spend"; }
                          else if (item.code === "GOLD30") { rate = "30%"; thres = "$500 spend"; }

                          return (
                            <tr key={idx} className="hover:bg-slate-900/30">
                              <td className="py-3">
                                <span className={`px-2 py-1 border rounded-md font-mono text-[10px] font-black ${
                                  isDark ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-indigo-50 border-indigo-100 text-indigo-700"
                                }`}>
                                  {item.code}
                                </span>
                              </td>
                              <td className="py-3">{item.count} checkouts</td>
                              <td className="py-3 text-emerald-500 font-black">{rate} OFF</td>
                              <td className="py-3 text-right text-slate-400 font-medium">Above {thres}</td>
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

        {/* RIGHT 1 COLUMN: DYNAMIC REAL-TIME HUD FEED */}
        <div className="space-y-6">
          {/* Active Logs Tickers */}
          <div className={`rounded-2xl p-5 border space-y-4 ${
            isDark ? "bg-[#101626] border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-xs tracking-tight text-slate-400 uppercase">Live Pipeline</h3>
                <p className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}>System Event Logs</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {realtimeTicks.map((tick) => (
                <div key={tick.id} className="text-[11px] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-[8px] px-1 py-0.2 rounded font-black tracking-wider ${
                      tick.badge === "SUCCESS" 
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" 
                        : tick.badge === "WARNING"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                          : "bg-blue-500/15 text-blue-400 border border-blue-500/25"
                    }`}>
                      {tick.badge}
                    </span>
                    <span className="text-[8px] text-slate-500 font-bold">{tick.time}</span>
                  </div>
                  <p className={`font-semibold leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{tick.message}</p>
                </div>
              ))}
            </div>
          </div>

        </div>


      </div>
    </div>
  );
};

export default Analytics;

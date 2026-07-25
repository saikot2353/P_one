import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Store,
  LayoutDashboard,
  FilePlus,
  Scissors,
  Droplet,
  Grid,
  Printer,
  Layers,
  Activity,
  Wind,
  FileWarning,
  RefreshCw,
  BarChart2,
  Calendar,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Search,
  Download,
  AlertTriangle,
  CheckCircle,
  FileText,
  Briefcase,
  Users,
  Bell,
  Sliders,
  DollarSign,
  PieChart as PieChartIcon,
  Percent,
  Play,
  ArrowLeft,
  Sun,
  Moon,
  Info
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { toast } from "sonner";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";

export const Route = createFileRoute("/merchandising-dashboard")({
  head: () => ({
    meta: [
      { title: "Merchandising Dashboard — CRIPTON" },
      {
        name: "description",
        content: "Advanced Merchandising Dashboard with analytics, order status, capacity control, and TNA tracking.",
      },
    ],
  }),
  component: MerchandisingDashboardPage,
});

// Sidebar Navigation config
interface SidebarItem {
  label: string;
  icon: any;
  to?: string;
  subitems?: { label: string; to?: string }[];
}

const sidebarMenu: SidebarItem[] = [
  { label: "Trims WO Submit", icon: FilePlus },
  { label: "Trims WO List", icon: Scissors },
  { label: "Wash WO", icon: Droplet },
  { label: "Wash WO Submit", icon: Droplet },
  { label: "Wash WO List", icon: Droplet },
  { label: "AOP WO", icon: Grid },
  { label: "AOP Submit WO", icon: Grid },
  { label: "AOP WO List", icon: Grid },
  { label: "Print WO", icon: Printer },
  { label: "Print Submit WO", icon: Printer },
  { label: "Print WO List", icon: Printer },
  { label: "Emb WO", icon: Layers },
  { label: "Emb WO Submit", icon: Layers },
  { label: "Emb WO List", icon: Layers },
  { label: "Dyed Yarn Work Order", icon: Wind },
  { label: "Revise Work Order", icon: RefreshCw },
  {
    label: "MM Reports",
    icon: BarChart2,
    subitems: [
      { label: "Daily Order Report" },
      { label: "Date Wise Fabric Booking" },
    ],
  },
  {
    label: "Report",
    icon: TrendingUp,
    subitems: [
      { label: "Buyer Share Report" },
      { label: "Shipment Status Report" },
      { label: "SMV Utilization Report" },
    ],
  },
];

// Demo TNA Data
interface TNAEvent {
  sl: number;
  eventName: string;
  tnaDate: string;
  tnaLead: string;
  upDate: string;
  remarks: string;
  buyerName: string;
  po: string;
  style: string;
  styleDesc: string;
  shipment: string;
  orderQty: number;
  leadDay: number;
  status: "Completed" | "Pending" | "Critical";
}

const initialTNAData: TNAEvent[] = [
  {
    sl: 1,
    eventName: "Fabric Booking Approval",
    tnaDate: "2026-07-10",
    tnaLead: "15 Days",
    upDate: "2026-07-12",
    remarks: "Completed on schedule",
    buyerName: "ITPS",
    po: "PO-2026-ITPS",
    style: "ST-8822",
    styleDesc: "Men's Crew Neck T-Shirt",
    shipment: "2026-08-15",
    orderQty: 12000,
    leadDay: 22,
    status: "Completed",
  },
  {
    sl: 2,
    eventName: "Trims & Accessories Sourcing",
    tnaDate: "2026-07-15",
    tnaLead: "10 Days",
    upDate: "2026-07-16",
    remarks: "Thread shipment arrived",
    buyerName: "ITPS",
    po: "PO-2026-ITPS",
    style: "ST-8822",
    styleDesc: "Men's Crew Neck T-Shirt",
    shipment: "2026-08-15",
    orderQty: 11000,
    leadDay: 18,
    status: "Completed",
  },
  {
    sl: 3,
    eventName: "Embroidery Sample Strike-off",
    tnaDate: "2026-07-22",
    tnaLead: "5 Days",
    upDate: "2026-07-25",
    remarks: "Waiting for buyer size-set comments",
    buyerName: "A-M-London Fashion Ltd",
    po: "PO-AM-LND",
    style: "ST-1092",
    styleDesc: "Women's Denim Jacket",
    shipment: "2026-08-30",
    orderQty: 21,
    leadDay: 35,
    status: "Pending",
  },
  {
    sl: 4,
    eventName: "Bulk Cutting Release",
    tnaDate: "2026-07-24",
    tnaLead: "12 Days",
    upDate: "-",
    remarks: "Blocked due to fabric print inspection delay",
    buyerName: "ITPS",
    po: "PO-2026-ITPS",
    style: "ST-8822",
    styleDesc: "Men's Crew Neck T-Shirt",
    shipment: "2026-08-15",
    orderQty: 23000,
    leadDay: 12,
    status: "Critical",
  },
];

export default function MerchandisingDashboardPage() {
  const navigate = useNavigate();

  // Filters State
  const [filterYear, setFilterYear] = useState("2026");
  const [filterMonth, setFilterMonth] = useState("July");
  const [filterSMV, setFilterSMV] = useState("3.3");

  // Interactive controls
  const [simulateCapacity, setSimulateCapacity] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");
  const [tnaSearch, setTnaSearch] = useState("");
  const [loadTNA, setLoadTNA] = useState(false);
  const [openSidebarMenus, setOpenSidebarMenus] = useState<Record<string, boolean>>({});

  // Theme support
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleExport = (type: string) => {
    toast.success(`${type} Export Triggered`, {
      description: "Compiling document records and rendering download package...",
    });
  };

  const toggleSidebarMenu = (label: string) => {
    setOpenSidebarMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Order summary data
  const orderSummaryData = useMemo(() => {
    return [
      {
        sl: 1,
        status: "Confirmed",
        buyer: "A-M-London Fashion Ltd",
        avgSmv: 0.0,
        qty: 21,
        exQty: 0,
        exVal: 0,
        yetQty: 21,
        yetVal: 141,
        exBalPct: "100.00%",
        orderVal: 140.91,
        avgRate: 6.71,
        cmVal: 0.0,
        buyerShare: 0.09,
        avgBasicRate: 0.0,
      },
      {
        sl: 2,
        status: "Confirmed",
        buyer: "ITPS",
        avgSmv: 0.0,
        qty: 23000,
        exQty: 0,
        exVal: 0,
        yetQty: 23000,
        yetVal: 58952,
        exBalPct: "100.00%",
        orderVal: 58952.0,
        avgRate: 2.56,
        cmVal: 0.0,
        buyerShare: 99.91,
        avgBasicRate: 0.0,
      },
    ];
  }, []);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orderSummaryData.filter(
      (o) =>
        o.buyer.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.status.toLowerCase().includes(orderSearch.toLowerCase())
    );
  }, [orderSummaryData, orderSearch]);

  // Order summary totals
  const totals = useMemo(() => {
    const orderQtySum = filteredOrders.reduce((sum, o) => sum + o.qty, 0);
    const exQtySum = filteredOrders.reduce((sum, o) => sum + o.exQty, 0);
    const exValSum = filteredOrders.reduce((sum, o) => sum + o.exVal, 0);
    const yetQtySum = filteredOrders.reduce((sum, o) => sum + o.yetQty, 0);
    const yetValSum = filteredOrders.reduce((sum, o) => sum + o.yetVal, 0);
    const orderValSum = filteredOrders.reduce((sum, o) => sum + o.orderVal, 0);
    const averageRate = orderQtySum > 0 ? Number((orderValSum / orderQtySum).toFixed(2)) : 0;

    return {
      qty: orderQtySum,
      exQty: exQtySum,
      exVal: exValSum,
      yetQty: yetQtySum,
      yetVal: yetValSum,
      orderVal: orderValSum,
      avgRate: averageRate,
    };
  }, [filteredOrders]);

  // TNA data
  const tnaDataList = useMemo(() => {
    if (!loadTNA) return [];
    return initialTNAData.filter(
      (t) =>
        t.buyerName.toLowerCase().includes(tnaSearch.toLowerCase()) ||
        t.eventName.toLowerCase().includes(tnaSearch.toLowerCase()) ||
        t.po.toLowerCase().includes(tnaSearch.toLowerCase()) ||
        t.style.toLowerCase().includes(tnaSearch.toLowerCase())
    );
  }, [loadTNA, tnaSearch]);

  // Recharts color palettes
  const COLORS = ["#14b8a6", "#3b82f6", "#ef4444", "#f59e0b"];

  // Buyer Share data for chart
  const buyerShareChartData = [
    { name: "ITPS", value: 23000, share: 99.91 },
    { name: "A-M-London Fashion", value: 21, share: 0.09 },
  ];

  // Month-wise Capacity trend
  const capacityTrendData = [
    { month: "Jan", Capacity: 22000, Orders: 20400 },
    { month: "Feb", Capacity: 22000, Orders: 18500 },
    { month: "Mar", Capacity: 25000, Orders: 24200 },
    { month: "Apr", Capacity: 25000, Orders: 21000 },
    { month: "May", Capacity: 25000, Orders: 23900 },
    { month: "Jun", Capacity: 28000, Orders: 27500 },
    { month: "Jul", Capacity: simulateCapacity ? 25000 : 0, Orders: 23021 },
  ];

  return (
    <MerchandisingLayout
      activePath="dashboard"
      breadcrumbs={[{ label: "Dashboard" }]}
      title="Dashboard Overview"
    >

        <div className="p-4 lg:p-6 space-y-6">

          {/* ─────────── FILTER & CAPACITY SIMULATOR PANEL ─────────── */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
            
            {/* Header / Interactive switch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Order Summary Parameters
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5 font-semibold">
                  Adjust date parameters and SMV targets below
                </p>
              </div>
              
              {/* Capacity Simulator Switch */}
              <div className="inline-flex items-center gap-3 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/50">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 pl-1.5">
                  Simulate Capacity Loading
                </span>
                <button
                  onClick={() => {
                    setSimulateCapacity(!simulateCapacity);
                    toast.info(
                      simulateCapacity ? "Capacity Simulation Off" : "Capacity Simulation Active",
                      { description: simulateCapacity ? "Capacity statistics set to empty state." : "Loaded 25,000 Pcs capacity." }
                    );
                  }}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 cursor-pointer ${
                    simulateCapacity ? "bg-teal-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${
                      simulateCapacity ? "translate-x-4.5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Inputs / Filters form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Year</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Month</label>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SMV Target</label>
                <input
                  type="text"
                  value={filterSMV}
                  onChange={(e) => setFilterSMV(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-teal-500 text-slate-800 dark:text-slate-200 transition-colors"
                  placeholder="3.3"
                />
              </div>

              <button
                onClick={() => toast.success("Filters applied successfully")}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-500/10 active:scale-95"
              >
                <Play size={12} className="fill-white" />
                <span>SUBMIT</span>
              </button>
            </div>

            {/* Status Alert Banner */}
            <div className="mt-5">
              {simulateCapacity ? (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-fadeIn text-xs font-bold">
                  <CheckCircle size={16} className="shrink-0" />
                  <span>Capacity data successfully loaded for {filterMonth} {filterYear}! Setup target SMV {filterSMV}.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse text-xs font-bold">
                  <AlertTriangle size={16} className="shrink-0 text-rose-500" />
                  <span>Sorry, Capacity Data Not Found! Please toggle the capacity simulator switch above to load demo capacity parameters.</span>
                </div>
              )}
            </div>
          </div>

          {/* ─────────── KEY METRICS CARDS ─────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            
            {/* Card 1: Capacity */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm relative group hover:border-teal-500/40 transition-colors duration-300">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Capacity (Pcs)
                </span>
                <span className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase size={16} />
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {simulateCapacity ? "25,000" : "00"}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                Approved master layout capacity
              </p>
            </div>

            {/* Card 2: Order Qty */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm relative group hover:border-teal-500/40 transition-colors duration-300">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Order Qty (Pcs)
                </span>
                <span className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Store size={16} />
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                23,021
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                Confirmed buyer order placements
              </p>
            </div>

            {/* Card 3: Balance */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm relative group hover:border-teal-500/40 transition-colors duration-300">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Balance (Pcs)
                </span>
                <span className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Percent size={16} />
                </span>
              </div>
              <h3 className={`text-2xl font-black transition-colors ${
                simulateCapacity ? "text-emerald-500" : "text-rose-500"
              }`}>
                {simulateCapacity ? "+1,979" : "-23,021"}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                Remaining production buffer capacity
              </p>
            </div>

            {/* Card 4: Avg SMV */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm relative group hover:border-teal-500/40 transition-colors duration-300">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Avg SMV
                </span>
                <span className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sliders size={16} />
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                0.00
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                Average Standard Minute Value
              </p>
            </div>
          </div>

          {/* ─────────── SECTION: ORDER SUMMARY TABLE ─────────── */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            
            {/* Table Control Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                Confirmed Orders Ledger
              </h3>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
                  <button
                    onClick={() => handleExport("EXCEL")}
                    className="px-2.5 py-1 text-[10px] font-bold rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:shadow-xs transition-all cursor-pointer"
                  >
                    EXCEL
                  </button>
                  <button
                    onClick={() => handleExport("PRINT")}
                    className="px-2.5 py-1 text-[10px] font-bold rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:shadow-xs transition-all cursor-pointer"
                  >
                    PRINT
                  </button>
                  <button
                    onClick={() => handleExport("PDF")}
                    className="px-2.5 py-1 text-[10px] font-bold rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:shadow-xs transition-all cursor-pointer"
                  >
                    PDF
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <Search size={12} />
                  </span>
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-teal-500 text-xs text-slate-800 dark:text-slate-200 transition-colors w-full sm:w-48"
                    placeholder="Search buyer..."
                  />
                </div>
              </div>
            </div>

            {/* Responsive Table Grid */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800/60 scrollbar-thin">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-[11px] font-semibold text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="px-3 py-3 font-extrabold sticky left-0 bg-slate-50 dark:bg-slate-900 z-20 min-w-[50px] w-[50px] max-w-[50px] text-center border-r border-slate-200 dark:border-slate-800">SL</th>
                    <th className="px-3 py-3 font-extrabold sticky left-[50px] bg-slate-50 dark:bg-slate-900 z-20 min-w-[120px] w-[120px] max-w-[120px] text-center border-r border-slate-200 dark:border-slate-800">Order Status</th>
                    <th className="px-3 py-3 font-extrabold sticky left-[170px] bg-slate-50 dark:bg-slate-900 z-20 min-w-[200px] w-[200px] max-w-[200px] border-r border-slate-200 dark:border-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.3)]">Buyer Name</th>
                    <th className="px-3 py-3 font-extrabold text-right">Avg.SMV</th>
                    <th className="px-3 py-3 font-extrabold text-right">OrderQty</th>
                    <th className="px-3 py-3 font-extrabold text-right">Ex-Fac.Qty</th>
                    <th className="px-3 py-3 font-extrabold text-right">Ex-Fac.Val</th>
                    <th className="px-3 py-3 font-extrabold text-right">YetTo.Ex-Fac.Qty</th>
                    <th className="px-3 py-3 font-extrabold text-right">YetTo.Ex-Fac.Val</th>
                    <th className="px-3 py-3 font-extrabold text-right">Ex-Fac.Bal(%)</th>
                    <th className="px-3 py-3 font-extrabold text-right">Order Value</th>
                    <th className="px-3 py-3 font-extrabold text-right">Avg.Rate</th>
                    <th className="px-3 py-3 font-extrabold text-right">CM Value</th>
                    <th className="px-3 py-3 font-extrabold text-right">Buyer Share</th>
                    <th className="px-3 py-3 font-extrabold text-right">AvgBasicRate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((o) => (
                      <tr key={o.sl} className="group hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-3 py-3 sticky left-0 bg-white dark:bg-slate-900 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 z-10 text-center border-r border-slate-200 dark:border-slate-800 transition-colors">{o.sl}</td>
                        <td className="px-3 py-3 sticky left-[50px] bg-white dark:bg-slate-900 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 z-10 text-center border-r border-slate-200 dark:border-slate-800 transition-colors">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px]">
                            {o.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 sticky left-[170px] bg-white dark:bg-slate-900 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.3)] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer transition-colors">
                          {o.buyer}
                        </td>
                        <td className="px-3 py-3 text-right">{o.avgSmv.toFixed(3)}</td>
                        <td className="px-3 py-3 text-right font-bold">{o.qty.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right">{o.exQty}</td>
                        <td className="px-3 py-3 text-right">{o.exVal}</td>
                        <td className="px-3 py-3 text-right">{o.yetQty.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right font-bold">{o.yetVal.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right text-emerald-500">{o.exBalPct}</td>
                        <td className="px-3 py-3 text-right">{o.orderVal.toFixed(2)}</td>
                        <td className="px-3 py-3 text-right">{o.avgRate.toFixed(2)}</td>
                        <td className="px-3 py-3 text-right">{o.cmVal.toFixed(3)}</td>
                        <td className="px-3 py-3 text-right text-blue-500 dark:text-blue-400">{o.buyerShare.toFixed(2)}%</td>
                        <td className="px-3 py-3 text-right">{o.avgBasicRate.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={15} className="px-4 py-8 text-center text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-900/10">
                        No orders matching the search query
                      </td>
                    </tr>
                  )}

                  {/* Totals Row */}
                  <tr className="bg-slate-50 dark:bg-slate-900/50 font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800">
                    <td className="px-3 py-3 sticky left-0 bg-slate-50 dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-800 text-center"></td>
                    <td className="px-3 py-3 sticky left-[50px] bg-slate-50 dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-800 text-center"></td>
                    <td className="px-3 py-3 sticky left-[170px] bg-slate-50 dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-850 shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.3)] uppercase tracking-wider text-xs font-black">Total</td>
                    <td className="px-3 py-3 text-right">0.000</td>
                    <td className="px-3 py-3 text-right">{totals.qty.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right">{totals.exQty}</td>
                    <td className="px-3 py-3 text-right">{totals.exVal}</td>
                    <td className="px-3 py-3 text-right">{totals.yetQty.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right">{totals.yetVal.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right text-emerald-500">100.00%</td>
                    <td className="px-3 py-3 text-right">{totals.orderVal.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right">{totals.avgRate.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right">0.000</td>
                    <td className="px-3 py-3 text-right">100.00%</td>
                    <td className="px-3 py-3 text-right">0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-[10px] text-slate-400 font-semibold">
                Showing 1 to {filteredOrders.length} of {filteredOrders.length} entries
              </span>
              
              <button
                onClick={() => handleExport("PDF")}
                className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-[10px] font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors active:scale-95"
              >
                VIEW PDF
              </button>
            </div>
          </div>

          {/* ─────────── ADVANCED GRAPHICS SECTION ─────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            
            {/* Chart 1: Buyer Share Pie Chart */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                  Buyer Share Distribution
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Order breakdown percentage between buyers
                </p>
              </div>

              <div className="h-56 mt-4 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={buyerShareChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {buyerShareChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ background: "#0f172a", border: "none", borderRadius: "8px", fontSize: "11px" }}
                      itemStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-6 text-[10px] font-bold border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>ITPS (99.91%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>AM-London (0.09%)</span>
                </div>
              </div>
            </div>

            {/* Chart 2: Capacity vs Orders Monthly trend */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between xl:col-span-2">
              <div>
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                  Monthly Orders vs Production Capacity
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Historical capacity utilisation trends
                </p>
              </div>

              <div className="h-56 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={capacityTrendData}>
                    <defs>
                      <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOrd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <RechartsTooltip
                      contentStyle={{ background: "#0f172a", border: "none", borderRadius: "8px", fontSize: "11px" }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }} />
                    <Area type="monotone" dataKey="Capacity" stroke="#14b8a6" fillOpacity={1} fill="url(#colorCap)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Orders" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOrd)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ─────────── SECTION: TNA FOLLOW UP ─────────── */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            
            {/* Header / Interactive data trigger */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                  TNA FollowUp (Time & Action Milestones)
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Critical path and milestone delay indicators
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Simulated Load Data Button */}
                {!loadTNA ? (
                  <button
                    onClick={() => {
                      setLoadTNA(true);
                      toast.success("Demo TNA Data Loaded Successfully", {
                        description: "Parsed 4 milestone schedules for ITPS and AM-London.",
                      });
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95"
                  >
                    <RefreshCw size={12} className="animate-[spin_4s_linear_infinite]" />
                    <span>LOAD DEMO TNA DATA</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setLoadTNA(false);
                      toast.info("Cleared TNA Data", { description: "Resetting TNA ledger state." });
                    }}
                    className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>RESET TABLE</span>
                  </button>
                )}

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
                  <button
                    onClick={() => handleExport("TNA EXCEL")}
                    className="px-2.5 py-1 text-[10px] font-bold rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:shadow-xs transition-all cursor-pointer"
                  >
                    EXCEL
                  </button>
                  <button
                    onClick={() => handleExport("TNA PRINT")}
                    className="px-2.5 py-1 text-[10px] font-bold rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:shadow-xs transition-all cursor-pointer"
                  >
                    PRINT
                  </button>
                  <button
                    onClick={() => handleExport("TNA PDF")}
                    className="px-2.5 py-1 text-[10px] font-bold rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:shadow-xs transition-all cursor-pointer"
                  >
                    PDF
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <Search size={12} />
                  </span>
                  <input
                    type="text"
                    value={tnaSearch}
                    onChange={(e) => setTnaSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-teal-500 text-xs text-slate-800 dark:text-slate-200 transition-colors w-full sm:w-48"
                    placeholder="Filter TNA milestones..."
                    disabled={!loadTNA}
                  />
                </div>
              </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800/60 scrollbar-thin">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-[11px] font-semibold text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="px-3 py-3 font-extrabold sticky left-0 bg-slate-50 dark:bg-slate-900 z-20 min-w-[50px] w-[50px] max-w-[50px] text-center border-r border-slate-200 dark:border-slate-800">SL</th>
                    <th className="px-3 py-3 font-extrabold sticky left-[50px] bg-slate-50 dark:bg-slate-900 z-20 min-w-[100px] w-[100px] max-w-[100px] text-center border-r border-slate-200 dark:border-slate-800">Actions</th>
                    <th className="px-3 py-3 font-extrabold sticky left-[150px] bg-slate-50 dark:bg-slate-900 z-20 min-w-[180px] w-[180px] max-w-[180px] border-r border-slate-200 dark:border-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.3)]">Event Name</th>
                    <th className="px-3 py-3 font-extrabold">TNA Date</th>
                    <th className="px-3 py-3 font-extrabold">TNA Lead</th>
                    <th className="px-3 py-3 font-extrabold">Up Date</th>
                    <th className="px-3 py-3 font-extrabold">Remarks</th>
                    <th className="px-3 py-3 font-extrabold">Buyer Name</th>
                    <th className="px-3 py-3 font-extrabold">PO</th>
                    <th className="px-3 py-3 font-extrabold">Style/Kimbol</th>
                    <th className="px-3 py-3 font-extrabold">Style Desc</th>
                    <th className="px-3 py-3 font-extrabold">Shipment</th>
                    <th className="px-3 py-3 font-extrabold text-right">Order Quantity</th>
                    <th className="px-3 py-3 font-extrabold text-right">LeadDay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {loadTNA ? (
                    tnaDataList.length > 0 ? (
                      tnaDataList.map((t) => (
                        <tr key={t.sl} className="group hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-3 py-3 sticky left-0 bg-white dark:bg-slate-900 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 z-10 text-center border-r border-slate-200 dark:border-slate-800 transition-colors">{t.sl}</td>
                          <td className="px-3 py-3 sticky left-[50px] bg-white dark:bg-slate-900 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 z-10 text-center border-r border-slate-200 dark:border-slate-800 transition-colors">
                            <button
                              onClick={() => toast.info(`Action Log for Event ${t.sl}`)}
                              className="px-2 py-0.5 rounded bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/25 text-[10px] cursor-pointer font-bold transition-all active:scale-95"
                            >
                              Details
                            </button>
                          </td>
                          <td className="px-3 py-3 sticky left-[150px] bg-white dark:bg-slate-900 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 z-10 border-r border-slate-200 dark:border-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.3)] text-slate-900 dark:text-white font-bold transition-colors">{t.eventName}</td>
                          <td className="px-3 py-3">{t.tnaDate}</td>
                          <td className="px-3 py-3 text-teal-600 dark:text-teal-400">{t.tnaLead}</td>
                          <td className="px-3 py-3">{t.upDate}</td>
                          <td className="px-3 py-3">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] ${
                              t.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold"
                                : t.status === "Pending"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse font-bold"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold"
                            }`}>
                              {t.remarks}
                            </span>
                          </td>
                          <td className="px-3 py-3">{t.buyerName}</td>
                          <td className="px-3 py-3 text-slate-400">{t.po}</td>
                          <td className="px-3 py-3">{t.style}</td>
                          <td className="px-3 py-3">{t.styleDesc}</td>
                          <td className="px-3 py-3">{t.shipment}</td>
                          <td className="px-3 py-3 text-right font-bold">{t.orderQty.toLocaleString()}</td>
                          <td className="px-3 py-3 text-right text-indigo-500 dark:text-indigo-400">{t.leadDay} Days</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={14} className="px-4 py-8 text-center text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-900/10">
                          No matching Time & Action events found.
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan={14} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500 bg-slate-50/30 dark:bg-slate-900/5">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Info size={20} className="text-slate-400" />
                          <span>No data available in table</span>
                          <button
                            onClick={() => {
                              setLoadTNA(true);
                              toast.success("Demo TNA Data Loaded Successfully");
                            }}
                            className="mt-2 text-teal-600 dark:text-teal-400 hover:underline text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Load Demo TNA Records
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {loadTNA && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-slate-400 font-semibold">
                  Showing {tnaDataList.length} of {tnaDataList.length} entries
                </span>
                
                <div className="flex items-center gap-1.5 text-[10px] font-bold">
                  <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed">Previous</span>
                  <span className="px-2.5 py-1 rounded bg-teal-500 text-white cursor-default">1</span>
                  <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed">Next</span>
                </div>
              </div>
            )}
          </div>
      </div>
    </MerchandisingLayout>
  );
}


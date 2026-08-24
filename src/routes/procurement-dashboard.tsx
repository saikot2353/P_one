import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  ShoppingCart,
  DollarSign,
  ChevronRight,
  Package,
  CheckCircle2,
  Building,
  Clock,
  TrendingUp,
  Percent,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const Route = createFileRoute("/procurement-dashboard")({
  head: () => ({
    meta: [
      { title: "Procurement Command Center — CRIPTON" },
      { name: "description", content: "Professional purchasing, billing, audits, and comparison sheets." },
    ],
  }),
  component: ProcurementDashboardPage,
});

// --- Mock Data ---

const mockPOs = [
  { id: "1", poNo: "PO-2026-00481", date: "2026-08-23", supplier: "Zhejiang Yarn Spinning Co.", requisitionNo: "REQ-2026-091", totalValue: "$45,200.00", deliveryDate: "2026-09-15", status: "Work Order Approval" },
  { id: "2", poNo: "PO-2026-00482", date: "2026-08-21", supplier: "Apex Textile Chemical Ltd", requisitionNo: "REQ-2026-093", totalValue: "৳1,520,000.00", deliveryDate: "2026-09-05", status: "Approved" },
  { id: "3", poNo: "PO-2026-00483", date: "2026-08-24", supplier: "Dacca Accessories & Thread Ind.", requisitionNo: "REQ-2026-095", totalValue: "$8,950.00", deliveryDate: "2026-09-10", status: "Draft" },
  { id: "4", poNo: "PO-2026-00484", date: "2026-08-22", supplier: "Euro Machinery Corp.", requisitionNo: "REQ-2026-098", totalValue: "€124,500.00", deliveryDate: "2026-10-01", status: "Approved" },
];

const mockLCs = [
  { id: "LCB-2026-001", supplier: "Zhejiang Yarn Spinning Co.", pi: "PI-2026-YRN-089", value: "$45,200.00", bank: "Eastern Bank Ltd", date: "2026-08-24", status: "Draft" },
  { id: "LCB-2026-002", supplier: "Euro Machinery Corp.", pi: "PI-2026-MAC-012", value: "€124,500.00", bank: "HSBC Bangladesh", date: "2026-08-22", status: "Active" },
];

const purchaseTrends = [
  { m: "Jan", import: 45000, local: 20000 },
  { m: "Feb", import: 52000, local: 24000 },
  { m: "Mar", import: 61000, local: 28000 },
  { m: "Apr", import: 58000, local: 22000 },
  { m: "May", import: 72000, local: 31000 },
  { m: "Jun", import: 80000, local: 35000 },
  { m: "Jul", import: 68000, local: 29000 },
  { m: "Aug", import: 85000, local: 38000 },
];

const categorySpend = [
  { name: "Yarn", value: 420000, color: "var(--chart-1)" },
  { name: "Chemicals", value: 280000, color: "var(--chart-2)" },
  { name: "Machinery", value: 350000, color: "var(--chart-3)" },
  { name: "Accessories", value: 150000, color: "var(--chart-4)" },
  { name: "Packaging", value: 95000, color: "var(--chart-5)" },
];

const supplierPayouts = [
  { name: "Apex", paid: 152 },
  { name: "Zhejiang", paid: 242 },
  { name: "Global Log.", paid: 89 },
  { name: "Dacca Acc.", paid: 120 },
  { name: "Euro Mach.", paid: 350 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-md border border-border/80 p-3 rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
        <p className="font-bold text-xs text-foreground mb-1.5">{label}</p>
        <div className="space-y-1.5">
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex items-center gap-2 text-[11px]">
              <span
                className="size-2 rounded-full shadow-xs"
                style={{ backgroundColor: p.color || p.stroke || p.fill }}
              />
              <span className="text-muted-foreground/90 font-semibold">{p.name}:</span>
              <span className="font-bold text-foreground ml-auto">${p.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function ProcurementDashboardPage() {
  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative">
      <ProcurementSidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <ProcurementTopbar />
        
        <div className="p-3.5 md:p-4.5 lg:p-5 space-y-4 lg:space-y-5 w-full max-w-[1600px] mx-auto">
          {/* Main header block */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/45 pb-4">
            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                <ShoppingCart className="size-5.5 text-amber-500" />
                Procurement Command Center
              </h2>
              <p className="text-[10px] text-muted-foreground/80 mt-0.5 font-semibold">
                Procurement Management Workspace &gt; <span className="text-amber-500 font-bold">Overview Dashboard</span>
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Row 1: Primary Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4.5">
              <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-xs transition hover:shadow-elegant relative overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Suppliers</span>
                  <div className="size-8 rounded-lg bg-amber-500/10 grid place-items-center text-amber-500">
                    <Building className="size-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-black tracking-tight">42</span>
                  <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                    +3 this month
                  </span>
                </div>
              </div>

              <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-xs transition hover:shadow-elegant relative overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 to-red-500" />
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Pending PO Approvals</span>
                  <div className="size-8 rounded-lg bg-orange-500/10 grid place-items-center text-orange-500">
                    <ShoppingCart className="size-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-black tracking-tight text-orange-500">8</span>
                  <span className="text-[10px] font-bold text-orange-500 flex items-center gap-0.5 animate-pulse">
                    Requires attention
                  </span>
                </div>
              </div>

              <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-xs transition hover:shadow-elegant relative overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">L/C Active Bookings</span>
                  <div className="size-8 rounded-lg bg-blue-500/10 grid place-items-center text-blue-500">
                    <Package className="size-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-black tracking-tight">15</span>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    Total Val: $420k
                  </span>
                </div>
              </div>

              <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-xs transition hover:shadow-elegant relative overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Bills Awaiting Audit</span>
                  <div className="size-8 rounded-lg bg-emerald-500/10 grid place-items-center text-emerald-500">
                    <DollarSign className="size-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-black tracking-tight text-emerald-500">22</span>
                  <span className="text-[10px] font-bold text-success flex items-center gap-0.5">
                    ৳82.5 Lakhs
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: Secondary Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4.5">
              <div className="bg-card border border-border/80 p-4 rounded-xl shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">Average Lead Time</span>
                  <div className="text-lg font-black tracking-tight text-foreground">24 Days</div>
                </div>
                <div className="size-10 bg-slate-100 dark:bg-slate-900 border border-border/80 rounded-lg grid place-items-center text-muted-foreground">
                  <Clock className="size-4.5" />
                </div>
              </div>

              <div className="bg-card border border-border/80 p-4 rounded-xl shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">Negotiated Savings</span>
                  <div className="text-lg font-black tracking-tight text-success flex items-center gap-1">
                    $152k
                    <span className="text-[9px] font-bold flex items-center text-success bg-success/10 px-1 py-0.5 rounded leading-none">
                      <TrendingDown className="size-2.5 mr-0.5" /> 8.4%
                    </span>
                  </div>
                </div>
                <div className="size-10 bg-slate-100 dark:bg-slate-900 border border-border/80 rounded-lg grid place-items-center text-success">
                  <Percent className="size-4.5" />
                </div>
              </div>

              <div className="bg-card border border-border/80 p-4 rounded-xl shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">Material Defect Rate</span>
                  <div className="text-lg font-black tracking-tight text-orange-500">0.8%</div>
                </div>
                <div className="size-10 bg-slate-100 dark:bg-slate-900 border border-border/80 rounded-lg grid place-items-center text-orange-500">
                  <AlertTriangle className="size-4.5" />
                </div>
              </div>

              <div className="bg-card border border-border/80 p-4 rounded-xl shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">Quality Audit Pass</span>
                  <div className="text-lg font-black tracking-tight text-foreground">99.2%</div>
                </div>
                <div className="size-10 bg-slate-100 dark:bg-slate-900 border border-border/80 rounded-lg grid place-items-center text-muted-foreground">
                  <ShieldCheck className="size-4.5" />
                </div>
              </div>
            </div>

            {/* Row 3: Graphical Spend Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Spend Trend AreaChart */}
              <div className="lg:col-span-2 bg-card border border-border/80 p-5 rounded-2xl shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-border/40 pb-3">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Procurement Spend Trends</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Import L/C purchases vs Local BDT orders (YTD)</p>
                  </div>
                  <span className="text-[9px] font-bold text-success flex items-center bg-success/10 px-2 py-1 rounded">
                    <TrendingUp className="size-3 mr-1" /> +14.5% Spend
                  </span>
                </div>

                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={purchaseTrends} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gImport" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gLocal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
                      <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: "bold" }} />
                      <Area type="monotone" name="Import L/C" dataKey="import" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#gImport)" />
                      <Area type="monotone" name="Local Purchases" dataKey="local" stroke="var(--chart-2)" strokeWidth={2.5} fill="url(#gLocal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Spend Category Allocation PieChart */}
              <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
                <div className="border-b border-border/40 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Spend Allocation</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Allocation by procurement categories</p>
                </div>

                <div className="h-[180px] relative flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySpend}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categorySpend.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center metric */}
                  <div className="absolute text-center leading-none">
                    <div className="text-xs font-black text-muted-foreground/80 uppercase tracking-wider">Total</div>
                    <div className="text-lg font-black text-foreground mt-1">$1.3M</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-[10px] font-bold">
                  {categorySpend.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-muted-foreground/85">
                      <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="truncate">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 4: Transaction & Audit data split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Monthly Payouts BarChart */}
              <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-xs space-y-4">
                <div className="border-b border-border/40 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Monthly Payouts</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Settlements cleared per major vendor (Lakhs)</p>
                  </div>
                  <Zap className="size-4.5 text-success animate-pulse" />
                </div>

                <div className="h-[230px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={supplierPayouts} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
                      <Tooltip formatter={(value) => `৳${value} Lakhs`} />
                      <Bar dataKey="paid" radius={[4, 4, 0, 0]}>
                        {supplierPayouts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`var(--chart-${(index % 5) + 1})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Purchase Orders Table */}
              <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-xs space-y-4 lg:col-span-2">
                <div className="flex justify-between items-center border-b border-border/40 pb-3">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Recent Purchase Orders</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Active requisition and dispatch tracker</p>
                  </div>
                  <Link
                    to="/procurement-po-list"
                    className="text-[9px] font-black text-amber-500 hover:underline cursor-pointer uppercase tracking-wider flex items-center gap-0.5"
                  >
                    View All Registry <ArrowUpRight className="size-3" />
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-muted/40 border-b border-border/45">
                        <th className="py-2.5 px-3">PO Number</th>
                        <th className="py-2.5 px-3">Supplier Name</th>
                        <th className="py-2.5 px-3">Requisition</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/45 font-medium">
                      {mockPOs.map((po) => (
                        <tr key={po.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3 font-bold text-amber-500">{po.poNo}</td>
                          <td className="py-3 px-3 truncate max-w-[200px]">{po.supplier}</td>
                          <td className="py-3 px-3 text-muted-foreground">{po.requisitionNo}</td>
                          <td className="py-3 px-3 font-bold">{po.totalValue}</td>
                          <td className="py-3 px-3">
                            <div className="flex justify-center">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${
                                po.status === "Approved" ? "bg-success/15 text-success-foreground" :
                                po.status === "Draft" ? "bg-muted text-muted-foreground" : "bg-orange-500/10 text-orange-600 border border-orange-500/20"
                              }`}>
                                {po.status}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Row 5: Comparison sheets & Active LCs bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Comparison Sheet Batches */}
              <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-border/40 pb-3">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Comparison Batches</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Supplier quotation analyses</p>
                  </div>
                  <Link
                    to="/procurement-cs-batch-list"
                    className="text-[9px] font-black text-amber-500 hover:underline cursor-pointer uppercase tracking-wider flex items-center gap-0.5"
                  >
                    View Batches <ArrowUpRight className="size-3" />
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-muted/30 border border-border/60 rounded-xl space-y-2 hover:border-amber-500/30 transition-all cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-foreground truncate pr-2">Batch # CS-2026-YRN4</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-orange-500/10 text-orange-600 rounded">Comparison</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground flex justify-between">
                      <span>Items: Yarn Cone Spinning</span>
                      <span>Suppliers: 3 Quotes</span>
                    </div>
                    <div className="pt-1.5 flex justify-between items-center border-t border-border/30 text-[9px]">
                      <span className="font-semibold text-muted-foreground">Target Price: $3.40/Kg</span>
                      <span className="font-bold text-amber-500 flex items-center gap-0.5">Evaluate Quotes <ChevronRight className="size-3" /></span>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/30 border border-border/60 rounded-xl space-y-2 hover:border-amber-500/30 transition-all cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-foreground truncate pr-2">Batch # CS-2026-CHM12</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-success/10 text-success-foreground rounded">Approved</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground flex justify-between">
                      <span>Items: Reactive Dyes Bulk</span>
                      <span>Suppliers: 4 Quotes</span>
                    </div>
                    <div className="pt-1.5 flex justify-between items-center border-t border-border/30 text-[9px]">
                      <span className="font-semibold text-muted-foreground">Apex Chemical Ltd (Winner)</span>
                      <span className="font-bold text-success flex items-center gap-0.5"><CheckCircle2 className="size-3" /> Workorder Created</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* L/C Booking List */}
              <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-xs space-y-4 lg:col-span-2">
                <div className="flex justify-between items-center border-b border-border/40 pb-3">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Active L/C Booking Queue</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Letter of Credit registrations and bank margins</p>
                  </div>
                  <Link
                    to="/procurement-config-lc-booking-list"
                    className="text-[9px] font-black text-amber-500 hover:underline cursor-pointer uppercase tracking-wider flex items-center gap-0.5"
                  >
                    View LC Register <ArrowUpRight className="size-3" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 bg-muted/40 border-b border-border/45">
                        <th className="py-2.5 px-3">Booking ID</th>
                        <th className="py-2.5 px-3">Supplier</th>
                        <th className="py-2.5 px-3">PI Ref</th>
                        <th className="py-2.5 px-3">Value</th>
                        <th className="py-2.5 px-3">Bank Source</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/45 font-medium">
                      {mockLCs.map((lc) => (
                        <tr key={lc.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3 font-bold text-amber-500">{lc.id}</td>
                          <td className="py-3 px-3 truncate max-w-[150px]">{lc.supplier}</td>
                          <td className="py-3 px-3 text-muted-foreground">{lc.pi}</td>
                          <td className="py-3 px-3 font-bold">{lc.value}</td>
                          <td className="py-3 px-3">{lc.bank}</td>
                          <td className="py-3 px-3">
                            <div className="flex justify-center">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${
                                lc.status === "Active" ? "bg-success/15 text-success-foreground" : "bg-orange-500/10 text-orange-600 border border-orange-500/20"
                              }`}>
                                {lc.status}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

          <footer className="pt-6 pb-2 text-center text-[10px] font-medium text-muted-foreground/60 border-t border-border/20">
            © 2026 CRIPTON Procurement Management Portal — built with CRIPTON HRIS premium components.
          </footer>
        </div>
      </main>
    </div>
  );
}

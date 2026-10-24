import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMMainOrder,
  MMBuyerQuotation,
  MMFabricBooking,
  MMAccessoriesBooking,
  MMProformaInvoice,
} from "../lib/marketing-merchandising-data";
import {
  DollarSign,
  ShoppingCart,
  TrendingDown,
  FileCheck,
  Percent,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Scissors,
  Package,
  Layers,
  Settings,
  ShieldAlert,
  BarChart2,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export const Route = createFileRoute("/mm-dashboard")({
  head: () => ({
    meta: [
      { title: "Marketing & Merchandising Command Center — CriptonHRIS" },
      {
        name: "description",
        content: "Enterprise Marketing & Merchandising module with item-level cost saving analysis and complete workflow control.",
      },
    ],
  }),
  component: MMDashboardPage,
});

function MMDashboardPage() {
  const [orders, setOrders] = useState<MMMainOrder[]>([]);
  const [quotations, setQuotations] = useState<MMBuyerQuotation[]>([]);
  const [fabricBookings, setFabricBookings] = useState<MMFabricBooking[]>([]);
  const [accBookings, setAccBookings] = useState<MMAccessoriesBooking[]>([]);
  const [pis, setPis] = useState<MMProformaInvoice[]>([]);
  const [policy, setPolicy] = useState(MMRepository.getPolicy());

  useEffect(() => {
    setOrders(MMRepository.getOrders());
    setQuotations(MMRepository.getQuotations());
    setFabricBookings(MMRepository.getFabricBookings());
    setAccBookings(MMRepository.getAccessoriesBookings());
    setPis(MMRepository.getPIs());
    setPolicy(MMRepository.getPolicy());
  }, []);

  // Summary Metrics
  const totalOrderValue = useMemo(() => orders.reduce((sum, o) => sum + o.totalOrderValue, 0), [orders]);
  const totalOrderQty = useMemo(() => orders.reduce((sum, o) => sum + o.orderQuantity, 0), [orders]);

  const savingSummary = useMemo(() => {
    const rows = MMRepository.generateCostSavingAnalysis();
    const totalPreCost = rows.reduce((acc, r) => acc + r.preCostAmount, 0);
    const totalBooked = rows.reduce((acc, r) => acc + r.bookedAmount, 0);
    const totalSaving = totalPreCost - totalBooked;
    const savingPct = totalPreCost > 0 ? (totalSaving / totalPreCost) * 100 : 0;
    const targetMisses = rows.filter((r) => r.isTargetException).length;
    const overruns = rows.filter((r) => r.isOverBudget).length;
    return { totalPreCost, totalBooked, totalSaving, savingPct, targetMisses, overruns };
  }, [fabricBookings, accBookings]);

  const pendingApprovalsCount = useMemo(() => {
    const qCount = quotations.filter((q) => q.status === "Pending Approval").length;
    const fbCount = fabricBookings.filter((fb) => fb.status === "Pending Approval").length;
    const abCount = accBookings.filter((ab) => ab.status === "Pending Approval").length;
    const piCount = pis.filter((pi) => pi.status === "Pending Approval").length;
    return qCount + fbCount + abCount + piCount;
  }, [quotations, fabricBookings, accBookings, pis]);

  // Chart Data: Saving Comparison by Category
  const categoryChartData = useMemo(() => {
    const rows = MMRepository.generateCostSavingAnalysis();
    const map: Record<string, { category: string; preCost: number; booked: number; saving: number }> = {};
    rows.forEach((r) => {
      if (!map[r.category]) {
        map[r.category] = { category: r.category, preCost: 0, booked: 0, saving: 0 };
      }
      map[r.category].preCost += r.preCostAmount;
      map[r.category].booked += r.bookedAmount;
      map[r.category].saving += r.initialBookingSaving;
    });
    return Object.values(map);
  }, [fabricBookings, accBookings]);

  // Chart Data: Garment Business Type Distribution
  const garmentTypeData = useMemo(() => {
    const knitQty = quotations.filter((q) => q.garmentType === "Knit").reduce((acc, q) => acc + q.quantity, 0);
    const wovenQty = quotations.filter((q) => q.garmentType === "Woven").reduce((acc, q) => acc + q.quantity, 0);
    return [
      { name: "Knit Garments", value: knitQty || 45000, color: "#0d9488" },
      { name: "Woven Garments", value: wovenQty || 32000, color: "#3b82f6" },
    ];
  }, [quotations]);

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-dashboard"
      breadcrumbs={[{ label: "Command Center" }]}
      title="Marketing & Merchandising Command Center"
      subtitle="Executive portfolio oversight, budget discipline, and item-wise saving intelligence"
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/mm-buyer-quotation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-teal-600" />
            <span>New Quotation</span>
          </Link>
          <Link
            to="/mm-order-entry"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Main Order</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* ── KPI STAT CARDS ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Confirmed Orders Value */}
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Confirmed Order Value
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                ${totalOrderValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> {orders.length} Orders
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Total Order Volume: {totalOrderQty.toLocaleString()} Pcs
            </p>
            <div className="h-1 w-full bg-emerald-500 absolute bottom-0 left-0" />
          </div>

          {/* Card 2: Initial Booking Cost Saving */}
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Initial Booking Saving
              </span>
              <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">
                ${savingSummary.totalSaving.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                savingSummary.savingPct >= policy.savingTargetPercentage
                  ? "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
              }`}>
                {savingSummary.savingPct.toFixed(2)}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Performance Target: {policy.savingTargetPercentage}% (Pre-Cost baseline)
            </p>
            <div className="h-1 w-full bg-teal-500 absolute bottom-0 left-0" />
          </div>

          {/* Card 3: Pending Approval Queue */}
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pending Approvals
              </span>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {pendingApprovalsCount}
              </span>
              <span className="text-xs text-slate-500">Items Pending</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <Link to="/mm-booking-approval-queue" className="text-teal-600 hover:underline font-semibold flex items-center gap-1">
                View Queue <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="h-1 w-full bg-amber-500 absolute bottom-0 left-0" />
          </div>

          {/* Card 4: Exception & Overrun Alerts */}
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Exceptions & Overruns
              </span>
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
                {savingSummary.targetMisses + savingSummary.overruns}
              </span>
              <span className="text-xs text-rose-600 font-semibold">
                ({savingSummary.overruns} Overrun, {savingSummary.targetMisses} Misses)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Special Approval Triggered by Company Policy
            </p>
            <div className="h-1 w-full bg-rose-500 absolute bottom-0 left-0" />
          </div>
        </div>

        {/* ── WORKFLOW FUNNEL STATUS ────────────────────────────────────────── */}
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-teal-600" />
                End-to-End Merchandising Workflow Pipeline
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track sequential milestones from Buyer Inquiry through Approved Bookings & PI
              </p>
            </div>
            <Link
              to="/mm-policy-config"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" /> Policy Settings
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
            {/* Step 1 */}
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] font-bold uppercase text-slate-400">1. Quotation</span>
              <div className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                {quotations.length}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">
                {quotations.filter((q) => q.status === "Approved").length} Approved
              </span>
            </div>

            {/* Step 2 */}
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] font-bold uppercase text-slate-400">2. Pre-Costing</span>
              <div className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                {MMRepository.getPreCostings().length}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">Item-Level ID</span>
            </div>

            {/* Step 3 */}
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] font-bold uppercase text-slate-400">3. Confirm Order</span>
              <div className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                {orders.length}
              </div>
              <span className="text-[10px] text-teal-600 font-medium">Reconciled</span>
            </div>

            {/* Step 4 */}
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] font-bold uppercase text-slate-400">4. Linked BOM</span>
              <div className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                {MMRepository.getBOMs().length}
              </div>
              <span className="text-[10px] text-teal-600 font-medium">Traceable</span>
            </div>

            {/* Step 5 */}
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] font-bold uppercase text-slate-400">5. Fabric Booking</span>
              <div className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                {fabricBookings.length}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">
                {fabricBookings.filter((fb) => fb.status === "Approved").length} Approved
              </span>
            </div>

            {/* Step 6 */}
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] font-bold uppercase text-slate-400">6. Acc Booking</span>
              <div className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                {accBookings.length}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">
                {accBookings.filter((ab) => ab.status === "Approved").length} Approved
              </span>
            </div>

            {/* Step 7 */}
            <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] font-bold uppercase text-slate-400">7. Approved PI</span>
              <div className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                {pis.length}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">
                {pis.filter((pi) => pi.status === "Approved" || pi.status === "Passed").length} Verified
              </span>
            </div>
          </div>
        </div>

        {/* ── CHARTS ROW ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Pre-Costing vs Booked Cost Comparison */}
          <div className="lg:col-span-2 p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pre-Costing Baseline vs Actual Booking Value
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Category-level monetary comparison demonstrating booking savings (USD)
                </p>
              </div>
              <Link
                to="/mm-cost-saving-analysis"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                Item-wise Detail <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip formatter={(val: any) => [`$${Number(val).toLocaleString()}`, ""]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="preCost" name="Pre-Cost Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="booked" name="Booked Value" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saving" name="Initial Saving" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Garment Business Type Volume Distribution */}
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Garment Business Type Share
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scope breakdown: Woven vs Knit Garments
              </p>
            </div>

            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={garmentTypeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                    paddingAngle={4}
                    label={({ name, percent }: any) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                  >
                    {garmentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val: any) => [`${Number(val).toLocaleString()} Pcs`, "Volume"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded bg-teal-50/50 dark:bg-teal-950/20">
                <span className="block text-xs font-bold text-teal-700 dark:text-teal-300">Knit</span>
                <span className="text-[11px] text-slate-500">45,000 Pcs (Henley Tee)</span>
              </div>
              <div className="p-2 rounded bg-blue-50/50 dark:bg-blue-950/20">
                <span className="block text-xs font-bold text-blue-700 dark:text-blue-300">Woven</span>
                <span className="text-[11px] text-slate-500">32,000 Pcs (Chino Trouser)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RECENT CONFIRMED ORDERS & SAVING QUICK AUDIT ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Table: Confirmed Orders */}
          <div className="lg:col-span-2 p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Active Commercial Orders
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Linked to approved style Pre-Costing and verified breakdowns
                </p>
              </div>
              <Link to="/mm-order-entry" className="text-xs font-semibold text-teal-600 hover:underline">
                View All Orders →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-y border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Order No</th>
                    <th className="py-2.5 px-3 font-semibold">Buyer</th>
                    <th className="py-2.5 px-3 font-semibold">Style / Item</th>
                    <th className="py-2.5 px-3 font-semibold">Quantity</th>
                    <th className="py-2.5 px-3 font-semibold">FOB ($)</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-teal-700 dark:text-teal-400">
                        {order.orderNo}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {order.buyerName}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold">{order.styleNo}</span>
                        <span className="block text-[10px] text-slate-400">{order.garmentItem}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium">
                        {order.orderQuantity.toLocaleString()} pcs
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-emerald-600">
                        ${order.fobUnitPrice.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Card: Quick Governance & Policy Highlights */}
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                Active Governance Rules
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Company policies enforced by system engine
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                <span>Saving Target Benchmark</span>
                <span className="font-mono font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded">
                  {policy.savingTargetPercentage}%
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                <span>Quotation Approval</span>
                <span className="font-bold text-emerald-600">
                  {policy.quotationApprovalRequired ? "Enforced" : "Bypassed"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                <span>Pre-Costing Approval</span>
                <span className="font-bold text-emerald-600">
                  {policy.preCostingApprovalRequired ? "Enforced" : "Bypassed"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                <span>Fabric Booking Approval</span>
                <span className="font-bold text-emerald-600">
                  {policy.fabricBookingApprovalRequired ? "Enforced" : "Bypassed"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                <span>Accessories Booking Approval</span>
                <span className="font-bold text-emerald-600">
                  {policy.accessoriesBookingApprovalRequired ? "Enforced" : "Bypassed"}
                </span>
              </div>
            </div>

            <Link
              to="/mm-policy-config"
              className="block w-full py-2 px-3 text-center rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
            >
              Configure Policy Rules & Approval Roles →
            </Link>
          </div>
        </div>
      </div>
    </MarketingMerchandisingLayout>
  );
}

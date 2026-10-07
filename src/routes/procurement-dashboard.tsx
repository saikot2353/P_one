import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ProcurementSidebar } from "@/components/dashboard/ProcurementSidebar";
import { ProcurementTopbar } from "@/components/dashboard/ProcurementTopbar";
import {
  ShoppingCart,
  DollarSign,
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
  Filter,
  RefreshCw,
  Download,
  FileText,
  Truck,
  Receipt,
  FileCheck2,
  ChevronRight,
  ExternalLink,
  Search,
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
  ComposedChart,
  Line,
} from "recharts";
import { toast } from "sonner";
import {
  DEFAULT_SUPPLIERS,
  DEFAULT_ITEMS,
  DEFAULT_WAREHOUSES,
  DEFAULT_ITEM_CATEGORIES,
} from "@/lib/procurement-master-data";
import {
  getStoredPurchaseOrders,
  getStoredPoItems,
  getStoredWoItems,
  getStoredMaterialReceipts,
  getStoredSupplierBills,
  PurchaseOrder,
} from "@/lib/procurement-order-inventory-data";
import {
  DEFAULT_PURCHASE_REQUISITIONS,
  DEFAULT_COMPARATIVE_STATEMENTS,
} from "@/lib/procurement-requisition-data";

export const Route = createFileRoute("/procurement-dashboard")({
  head: () => ({
    meta: [
      { title: "Procurement Command Center & Spend Intelligence — CRIPTON" },
      {
        name: "description",
        content:
          "End-to-end purchasing lifecycle, supplier SLA rating, procurement bottlenecks, and spend analytics.",
      },
    ],
  }),
  component: ProcurementDashboardPage,
});

const PIPELINE_STAGES = [
  { id: "pr", title: "1. PR Requisitions", icon: FileText, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: "pr_appr", title: "2. PR Approvals", icon: CheckCircle2, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { id: "po", title: "3. PO Issued", icon: ShoppingCart, color: "text-amber-600 bg-amber-50 border-amber-200" },
  { id: "po_appr", title: "4. PO Approved", icon: FileCheck2, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { id: "dispatch", title: "5. Dispatched", icon: Truck, color: "text-purple-600 bg-purple-50 border-purple-200" },
  { id: "mrr", title: "6. MRR Received", icon: Package, color: "text-teal-600 bg-teal-50 border-teal-200" },
  { id: "bill", title: "7. Supplier Bill", icon: Receipt, color: "text-rose-600 bg-rose-50 border-rose-200" },
  { id: "pay", title: "8. Settlement", icon: DollarSign, color: "text-emerald-700 bg-emerald-100 border-emerald-300" },
];

const CATEGORY_COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

function ProcurementDashboardPage() {
  // Global Filters
  const [dateRange, setDateRange] = useState<string>("This Fiscal Year");
  const [selectedOrg, setSelectedOrg] = useState<string>("All Organizations");
  const [selectedDept, setSelectedDept] = useState<string>("All Departments");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("All Suppliers");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Data from Storage
  const purchaseOrders = useMemo(() => getStoredPurchaseOrders(), []);
  const poItemsMap = useMemo(() => getStoredPoItems(), []);
  const mrrs = useMemo(() => getStoredMaterialReceipts(), []);
  const supplierBills = useMemo(() => getStoredSupplierBills(), []);
  const prs = useMemo(() => DEFAULT_PURCHASE_REQUISITIONS, []);
  const suppliers = useMemo(() => DEFAULT_SUPPLIERS, []);

  // Filtered POs
  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((po) => {
      if (selectedSupplier !== "All Suppliers" && po.supplierName !== selectedSupplier) {
        return false;
      }
      if (selectedDept !== "All Departments" && po.department !== selectedDept) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          po.orderNumber.toLowerCase().includes(q) ||
          po.supplierName.toLowerCase().includes(q) ||
          po.prepareBy.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [purchaseOrders, selectedSupplier, selectedDept, searchQuery]);

  // Executive KPI Aggregations
  const kpis = useMemo(() => {
    let totalProcurementSpend = 0;
    let pendingPoCount = 0;
    let approvedPoCount = 0;

    filteredOrders.forEach((po) => {
      totalProcurementSpend += Number(po.grandTotal || 0);
      if (po.orderStatus === "Approved") approvedPoCount++;
      else if (po.orderStatus === "Submitted" || po.orderStatus === "Pending Approval" || po.orderStatus === "Draft") {
        pendingPoCount++;
      }
    });

    const pendingPrCount = prs.filter((p) => p.status === "Submitted" || p.status === "Pending Approval").length;
    const mrrCount = mrrs.length;
    const pendingBillCount = supplierBills.filter((b) => b.approvalStatus === "Submitted" || b.approvalStatus === "Pending Approval").length;
    const totalTransactions = filteredOrders.length + mrrs.length + supplierBills.length;

    return {
      totalProcurementSpend,
      pendingPrCount,
      totalOrdersCount: filteredOrders.length,
      pendingPoCount,
      approvedPoCount,
      mrrCount,
      pendingBillCount,
      totalTransactions,
    };
  }, [filteredOrders, prs, mrrs, supplierBills]);

  // Pipeline Stage Metrics
  const pipelineMetrics = useMemo(() => {
    return [
      { count: prs.length, value: "৳ 4.8M" },
      { count: prs.filter((p) => p.status === "Approved").length, value: "৳ 3.9M" },
      { count: filteredOrders.length, value: `৳ ${(kpis.totalProcurementSpend / 1000000).toFixed(1)}M` },
      { count: kpis.approvedPoCount, value: "৳ 3.1M" },
      { count: 3, value: "৳ 890k" },
      { count: mrrs.length, value: "৳ 2.6M" },
      { count: supplierBills.length, value: "৳ 2.4M" },
      { count: 18, value: "৳ 2.1M" },
    ];
  }, [prs, filteredOrders, kpis, mrrs, supplierBills]);

  // Monthly Spend Comparison Trend
  const monthlySpendData = useMemo(() => {
    return [
      { month: "May", currentYear: 1850000, previousYear: 1420000, budget: 2000000 },
      { month: "Jun", currentYear: 2200000, previousYear: 1650000, budget: 2100000 },
      { month: "Jul", currentYear: 1980000, previousYear: 1580000, budget: 2000000 },
      { month: "Aug", currentYear: 2450000, previousYear: 1890000, budget: 2300000 },
      { month: "Sep", currentYear: 2780000, previousYear: 2100000, budget: 2500000 },
      { month: "Oct", currentYear: 2150000, previousYear: 1950000, budget: 2400000 },
    ];
  }, []);

  // Category Spend Distribution
  const categorySpendData = useMemo(() => {
    return [
      { name: "Raw Fibers & Yarn", value: 4500000, percent: 42, color: "#6366f1" },
      { name: "Dyes & Aux Chemicals", value: 2400000, percent: 22, color: "#0ea5e9" },
      { name: "Machinery Spare Parts", value: 1650000, percent: 15, color: "#10b981" },
      { name: "Packaging Materials", value: 1200000, percent: 11, color: "#f59e0b" },
      { name: "IT & Admin Equipment", value: 850000, percent: 8, color: "#ec4899" },
      { name: "General Hardware", value: 220000, percent: 2, color: "#8b5cf6" },
    ];
  }, []);

  // Top 10 Suppliers with SLA Ranking
  const top10Suppliers = useMemo(() => {
    return [
      {
        rank: 1,
        name: "Square Textiles Ltd.",
        code: "SUP-003",
        poCount: 14,
        totalSpend: 3850000,
        otdRate: 98,
        qualityScore: 99.2,
        leadTime: "4 Days",
        status: "Strategic Partner",
      },
      {
        rank: 2,
        name: "Global Tech Solutions Ltd.",
        code: "SUP-001",
        poCount: 9,
        totalSpend: 1920000,
        otdRate: 94,
        qualityScore: 97.5,
        leadTime: "6 Days",
        status: "Preferred",
      },
      {
        rank: 3,
        name: "Apex Textile Chemical Ind.",
        code: "SUP-002",
        poCount: 7,
        totalSpend: 1480000,
        otdRate: 92,
        qualityScore: 96.0,
        leadTime: "5 Days",
        status: "Preferred",
      },
      {
        rank: 4,
        name: "Dacca Accessories & Thread Ind.",
        code: "SUP-004",
        poCount: 8,
        totalSpend: 950000,
        otdRate: 88,
        qualityScore: 94.0,
        leadTime: "8 Days",
        status: "Active",
      },
      {
        rank: 5,
        name: "Euro Machinery Corp.",
        code: "SUP-005",
        poCount: 3,
        totalSpend: 820000,
        otdRate: 85,
        qualityScore: 98.0,
        leadTime: "21 Days",
        status: "Active",
      },
      {
        rank: 6,
        name: "Paper Craft Packaging Ltd.",
        code: "SUP-006",
        poCount: 6,
        totalSpend: 420000,
        otdRate: 95,
        qualityScore: 95.5,
        leadTime: "3 Days",
        status: "Active",
      },
    ];
  }, []);

  // Procurement Bottleneck & Aging Table
  const bottleneckAging = useMemo(() => {
    return [
      {
        documentNo: "PO-2026-0004",
        type: "Purchase Order",
        supplierDept: "Euro Machinery Corp.",
        stage: "Awaiting Material Dispatch",
        daysPending: 18,
        severity: "Critical",
        amount: 820000,
        action: "Follow Up Delivery",
      },
      {
        documentNo: "PR-2026-000003",
        type: "Requisition",
        supplierDept: "Dyeing & Printing Unit",
        stage: "Technical Spec Clarification",
        daysPending: 12,
        severity: "Warning",
        amount: 285000,
        action: "Review Specs",
      },
      {
        documentNo: "BILL-2026-0002",
        type: "Supplier Bill",
        supplierDept: "Apex Textile Chemical",
        stage: "Finance Audit Approval",
        daysPending: 9,
        severity: "Warning",
        amount: 320000,
        action: "Approve Payment",
      },
      {
        documentNo: "PO-2026-0006",
        type: "Work Order",
        supplierDept: "Engineering Services",
        stage: "Service Completion Cert",
        daysPending: 5,
        severity: "Normal",
        amount: 110000,
        action: "Verify WO",
      },
    ];
  }, []);

  // Cycle Time Comparison
  const cycleTimeData = useMemo(() => {
    return [
      { stage: "PR to Approval", targetDays: 2, actualDays: 1.8 },
      { stage: "CS & Supplier Select", targetDays: 4, actualDays: 3.2 },
      { stage: "PO Generation", targetDays: 1, actualDays: 0.9 },
      { stage: "Supplier Delivery", targetDays: 7, actualDays: 8.5 },
      { stage: "MRR & QC Inspection", targetDays: 1.5, actualDays: 1.2 },
      { stage: "Bill Verification", targetDays: 3, actualDays: 4.1 },
    ];
  }, []);

  // MRR Ordered vs Received vs Accepted
  const mrrAuditData = useMemo(() => {
    return [
      { category: "Raw Cotton & Yarn", ordered: 15000, received: 14800, accepted: 14750 },
      { category: "Dyes & Chemicals", ordered: 4500, received: 4500, accepted: 4420 },
      { category: "Accessories", ordered: 12000, received: 11800, accepted: 11700 },
      { category: "Electrical Hardware", ordered: 600, received: 590, accepted: 585 },
    ];
  }, []);

  // Export Summary
  const handleExportSummary = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Procurement Metric,Value",
        `Total Spend,৳ ${kpis.totalProcurementSpend}`,
        `Purchase Orders Count,${kpis.totalOrdersCount}`,
        `Approved POs,${kpis.approvedPoCount}`,
        `Pending POs,${kpis.pendingPoCount}`,
        `Pending PRs,${kpis.pendingPrCount}`,
        `MRRs Processed,${kpis.mrrCount}`,
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Procurement_Command_Center_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Procurement executive report exported successfully.");
  };

  return (
    <div className="min-h-screen flex bg-slate-100/70 text-slate-800 font-sans">
      <ProcurementSidebar />

      <main className="flex-1 min-w-0 flex flex-col relative pb-20">
        <ProcurementTopbar />

        <div className="p-4 md:p-6 lg:p-7 space-y-6 w-full max-w-[1700px] mx-auto overflow-x-hidden">
          {/* Header & Global Filters */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-sm">
                  <ShoppingCart className="size-5" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Procurement Command Center & Spend Intelligence
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Corporate purchasing lifecycle, supplier SLA rating, procurement bottlenecks, and spend analytics
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 self-start lg:self-auto">
                <button
                  type="button"
                  onClick={() => toast.success("Live procurement transactions refreshed from ledger.")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <RefreshCw className="size-3.5 text-slate-500" />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={handleExportSummary}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Download className="size-3.5" />
                  Export Report
                </button>
              </div>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-3 border-t border-slate-100 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Fiscal Period
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-700 outline-none focus:border-slate-400"
                >
                  <option>This Fiscal Year</option>
                  <option>Current Quarter (Q3)</option>
                  <option>This Month (Oct 2026)</option>
                  <option>Last 30 Days</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Organization
                </label>
                <select
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-700 outline-none focus:border-slate-400"
                >
                  <option>All Organizations</option>
                  <option>Pakiza Knit Composite Ltd</option>
                  <option>Pakiza Apparels Ltd</option>
                  <option>Pakiza Spinning Mills Ltd</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-700 outline-none focus:border-slate-400"
                >
                  <option>All Departments</option>
                  <option>Spinning Unit 1</option>
                  <option>Knitting Division</option>
                  <option>Dyeing & Finishing</option>
                  <option>Maintenance & Engineering</option>
                  <option>Information Technology</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Strategic Supplier
                </label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-700 outline-none focus:border-slate-400"
                >
                  <option>All Suppliers</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.vendorName}>
                      {s.vendorName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  PO / Supplier Search
                </label>
                <div className="relative">
                  <Search className="size-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search PO #, vendor, buyer..."
                    className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 text-xs outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 8 Executive KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
            {/* KPI 1 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Spend (YTD)
              </span>
              <p className="text-lg font-black text-slate-900 font-mono tracking-tight">
                ৳ {(kpis.totalProcurementSpend / 1000000).toFixed(2)}M
              </p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <TrendingUp className="size-3" />
                <span>+6.8% vs LY</span>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                Pending PR Approval
              </span>
              <p className="text-lg font-black text-amber-600 font-mono tracking-tight">
                {kpis.pendingPrCount}
              </p>
              <span className="text-[10px] font-semibold text-amber-700">Awaiting sanction</span>
            </div>

            {/* KPI 3 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total PO / WO Issued
              </span>
              <p className="text-lg font-black text-slate-900 font-mono tracking-tight">
                {kpis.totalOrdersCount}
              </p>
              <span className="text-[10px] font-semibold text-slate-500">Active contracts</span>
            </div>

            {/* KPI 4 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                Pending PO Approvals
              </span>
              <p className="text-lg font-black text-rose-600 font-mono tracking-tight">
                {kpis.pendingPoCount}
              </p>
              <span className="text-[10px] font-semibold text-rose-700">Requires executive sign</span>
            </div>

            {/* KPI 5 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                MRR Received
              </span>
              <p className="text-lg font-black text-teal-700 font-mono tracking-tight">
                {kpis.mrrCount}
              </p>
              <span className="text-[10px] font-semibold text-teal-600">Goods receipts verified</span>
            </div>

            {/* KPI 6 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                Pending Supplier Bills
              </span>
              <p className="text-lg font-black text-purple-700 font-mono tracking-tight">
                {kpis.pendingBillCount}
              </p>
              <span className="text-[10px] font-semibold text-purple-600">Pending audit match</span>
            </div>

            {/* KPI 7 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                Contracted Suppliers
              </span>
              <p className="text-lg font-black text-emerald-700 font-mono tracking-tight">
                {suppliers.length}
              </p>
              <span className="text-[10px] font-semibold text-emerald-600">Enrolled vendors</span>
            </div>

            {/* KPI 8 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                Total Audit Flow
              </span>
              <p className="text-lg font-black text-blue-700 font-mono tracking-tight">
                {kpis.totalTransactions}
              </p>
              <span className="text-[10px] font-semibold text-blue-600">Combined touches</span>
            </div>
          </div>

          {/* Horizontal Procurement Pipeline */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="size-4 text-amber-500" /> End-to-End Procurement Execution Pipeline
                </h3>
                <p className="text-[11px] text-slate-500">Live transaction progression from requisition to payment settlement</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {PIPELINE_STAGES.map((stg, idx) => {
                const Icon = stg.icon;
                const stat = pipelineMetrics[idx];
                return (
                  <div
                    key={stg.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 ${stg.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider truncate">{stg.title}</span>
                      <Icon className="size-3.5 shrink-0 opacity-80" />
                    </div>
                    <div>
                      <div className="text-base font-black font-mono tracking-tight">{stat.count}</div>
                      <div className="text-[10px] font-semibold opacity-75 font-mono">{stat.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 3: Monthly Spend Trend & Category Spend */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Monthly Spend Trend */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="size-4 text-indigo-600" /> Monthly Procurement Spend vs Budget (6 Months)
                  </h3>
                  <p className="text-[11px] text-slate-500">Continuous expenditure trajectory and target control</p>
                </div>
              </div>

              <div className="h-[270px] w-full mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlySpendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis
                      tickFormatter={(v) => `৳ ${(v / 1000000).toFixed(1)}M`}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                    />
                    <Tooltip
                      formatter={(val: any) => [`৳ ${Number(val).toLocaleString()}`, "Amount"]}
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="currentYear" name="Current Spend (৳)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="previousYear" name="Previous Year (৳)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    <Line
                      type="monotone"
                      dataKey="budget"
                      name="Monthly Budget Cap"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Spend Distribution */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Percent className="size-4 text-emerald-600" /> Category-Wise Spend Share
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">YTD Spend Breakdown</span>
                </div>

                <div className="h-[210px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySpendData}
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categorySpendData.map((entry, index) => (
                          <Cell key={`cell-spend-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [`৳ ${Number(val).toLocaleString()}`, "Category Spend"]}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                {categorySpendData.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-[11px] font-semibold text-slate-600 truncate">{cat.name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 font-mono shrink-0 pl-1">
                      {cat.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Top Strategic Suppliers with SLA Scorecard */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Building className="size-4 text-blue-600" /> Strategic Supplier Performance Ranking & SLA Scorecard
                </h3>
                <p className="text-[11px] text-slate-500">
                  On-Time Delivery (OTD), Quality acceptance yield, and cycle time benchmarks
                </p>
              </div>
              <Link
                to="/procurement-config-supplier-name"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
              >
                Supplier Master Directory <ExternalLink className="size-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">Rank</th>
                    <th className="py-3 px-4">Supplier Name</th>
                    <th className="py-3 px-3 text-center">Active POs</th>
                    <th className="py-3 px-3 text-right">Total Spend (৳)</th>
                    <th className="py-3 px-3 text-center">OTD Rate</th>
                    <th className="py-3 px-3 text-center">Quality Yield</th>
                    <th className="py-3 px-3 text-center">Avg Lead Time</th>
                    <th className="py-3 px-4 text-center">Partner Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {top10Suppliers.map((sup) => (
                    <tr key={sup.code} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center font-bold text-slate-400">#{sup.rank}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{sup.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{sup.code}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                        {sup.poCount}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-black text-slate-900">
                        ৳ {sup.totalSpend.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {sup.otdRate}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {sup.qualityScore}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-600">
                        {sup.leadTime}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            sup.status === "Strategic Partner"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : sup.status === "Preferred"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {sup.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 5: Procurement Bottleneck & Aging + Cycle Time */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Bottleneck Table */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="size-4 text-rose-500" /> Procurement Bottleneck & Aging Analysis
                  </h3>
                  <p className="text-[11px] text-slate-500">Transactions delayed past standard turnaround time (TAT)</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Ref Document</th>
                      <th className="py-3 px-3">Stage / Department</th>
                      <th className="py-3 px-3 text-center">Days Pending</th>
                      <th className="py-3 px-3 text-right">Value (৳)</th>
                      <th className="py-3 px-4 text-center">Action Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {bottleneckAging.map((bn, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-900">{bn.documentNo}</div>
                          <div className="text-[10px] text-slate-400">{bn.type}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800">{bn.stage}</div>
                          <div className="text-[10px] text-slate-500">{bn.supplierDept}</div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded ${
                              bn.severity === "Critical"
                                ? "bg-rose-100 text-rose-800"
                                : bn.severity === "Warning"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {bn.daysPending} Days
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          ৳ {bn.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toast.info(`Action initiated for ${bn.documentNo}`)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] border border-indigo-200 transition-colors cursor-pointer"
                          >
                            {bn.action}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cycle Time Bar Chart */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="size-4 text-blue-600" /> Cycle Time Benchmark (Days)
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">Target vs Actual</span>
                </div>

                <div className="h-[260px] w-full mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={cycleTimeData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
                      <YAxis
                        type="category"
                        dataKey="stage"
                        width={110}
                        tick={{ fontSize: 10, fill: "#334155" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="targetDays" name="SLA Target" fill="#94a3b8" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="actualDays" name="Actual Performance" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-medium">
                Overall procurement lead time averages 19.7 days vs target 18.5 days.
              </div>
            </div>
          </div>

          {/* Row 6: MRR Ordered vs Received Audit & Fast Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* MRR Audit Chart */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Package className="size-4 text-emerald-600" /> MRR Receiving Audit: Ordered vs Received vs Accepted
                  </h3>
                  <p className="text-[11px] text-slate-500">Warehouse delivery reconciliation & quality clearance</p>
                </div>
              </div>

              <div className="h-[250px] w-full mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mrrAuditData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="ordered" name="PO Ordered Qty" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="received" name="Gate Received Qty" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="accepted" name="QC Accepted Qty" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
                  <ShieldCheck className="size-4 text-emerald-600" /> Procurement Fast Operations
                </h3>

                <div className="grid grid-cols-2 gap-2.5 mt-3">
                  <Link
                    to="/procurement-purchase-requisition"
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors block text-xs space-y-1"
                  >
                    <strong className="text-slate-900 block font-bold">+ New Requisition</strong>
                    <span className="text-[11px] text-slate-500 block">Initiate department PR</span>
                  </Link>

                  <Link
                    to="/procurement-po-new"
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors block text-xs space-y-1"
                  >
                    <strong className="text-slate-900 block font-bold">+ Create PO / WO</strong>
                    <span className="text-[11px] text-slate-500 block">Direct or PR-linked order</span>
                  </Link>

                  <Link
                    to="/inv-receive-mrr"
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors block text-xs space-y-1"
                  >
                    <strong className="text-slate-900 block font-bold">+ Process MRR</strong>
                    <span className="text-[11px] text-slate-500 block">Warehouse gate receiving</span>
                  </Link>

                  <Link
                    to="/procurement-billing-supplier-bill"
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors block text-xs space-y-1"
                  >
                    <strong className="text-slate-900 block font-bold">+ Entry Vendor Bill</strong>
                    <span className="text-[11px] text-slate-500 block">Invoice 3-way matching</span>
                  </Link>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5 text-amber-600" /> Operational Alert
                </div>
                <p className="text-[11px] text-amber-700">
                  {kpis.pendingPoCount} Purchase Orders currently require departmental or executive committee sanction before dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

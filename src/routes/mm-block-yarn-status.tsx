import React, { useState, useEffect, useMemo, Component, ErrorInfo, ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMBlockYarnStatusRecord,
  MMYarnBookingTagRecord,
} from "../lib/marketing-merchandising-data";
import {
  Package,
  Layers,
  Search,
  Filter,
  Eye,
  Plus,
  RefreshCw,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Percent,
  Calendar,
  FileText,
  Building2,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Sparkles,
  PieChart,
  Table as TableIcon,
  Tag,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-block-yarn-status")({
  head: () => ({
    meta: [
      { title: "Block Yarn Status — CriptonHRIS" },
      {
        name: "description",
        content:
          "Real-time Block Yarn Status register, consumption tracking, and multi-dimensional summary based on Block Yarn Status 2026.",
      },
    ],
  }),
  component: MMBlockYarnStatusPage,
});

type TabMode = "register" | "summary";
type SummaryGrouping = "buyer" | "blockNo" | "season" | "yarnCount";

interface SummaryRow {
  groupName: string;
  totalQty: number;
  totalUseQty: number;
  balanceStockQty: number;
  kdAdjustBalance: number;
  receivedPaymentQty: number;
  utilizationPct: number;
  recordCount: number;
}

function MMBlockYarnStatusPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabMode>("register");
  const [summaryGrouping, setSummaryGrouping] = useState<SummaryGrouping>("buyer");
  const [records, setRecords] = useState<MMBlockYarnStatusRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("All");
  const [seasonFilter, setSeasonFilter] = useState("All");
  const [yarnCountFilter, setYarnCountFilter] = useState("All");
  const [blockNoFilter, setBlockNoFilter] = useState("All");
  const [documentsStatusFilter, setDocumentsStatusFilter] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail Modal
  const [viewRecord, setViewRecord] = useState<MMBlockYarnStatusRecord | null>(null);

  // Synchronize and load records
  const loadData = () => {
    setIsLoading(true);
    try {
      const data = MMRepository.getBlockYarnStatusRecords();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load Block Yarn Status data:", err);
      toast.error("Failed to load Block Yarn Status data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter options derived dynamically from data
  const filterOptions = useMemo(() => {
    const list = Array.isArray(records) ? records : [];
    const buyers = Array.from(new Set(list.map((r) => r?.buyer).filter(Boolean))).sort();
    const seasons = Array.from(new Set(list.map((r) => r?.season).filter(Boolean))).sort();
    const counts = Array.from(new Set(list.map((r) => r?.yarnCount).filter(Boolean))).sort();
    const blocks = Array.from(new Set(list.map((r) => r?.blockNo).filter(Boolean))).sort();
    return { buyers, seasons, counts, blocks };
  }, [records]);

  // Filtered Records for Register Table
  const filteredRecords = useMemo(() => {
    const list = Array.isArray(records) ? records : [];
    return list.filter((r) => {
      if (!r) return false;

      // Global Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          (r.buyer || "").toLowerCase().includes(q) ||
          (r.blockNo || "").toLowerCase().includes(q) ||
          (r.season || "").toLowerCase().includes(q) ||
          (r.job || "").toLowerCase().includes(q) ||
          (r.yarnCount || "").toLowerCase().includes(q) ||
          (r.yarnItem || "").toLowerCase().includes(q) ||
          (r.piNo || "").toLowerCase().includes(q) ||
          (r.documentsStatus || "").toLowerCase().includes(q) ||
          (r.supplierName || "").toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Dropdown filters
      if (buyerFilter !== "All" && r.buyer !== buyerFilter) return false;
      if (seasonFilter !== "All" && r.season !== seasonFilter) return false;
      if (yarnCountFilter !== "All" && r.yarnCount !== yarnCountFilter) return false;
      if (blockNoFilter !== "All" && r.blockNo !== blockNoFilter) return false;
      if (documentsStatusFilter !== "All") {
        const docStatus = r.documentsStatus || "";
        if (documentsStatusFilter === "WithLC") {
          if (!docStatus || docStatus.includes("Pending") || docStatus === "-") return false;
        } else if (documentsStatusFilter === "Pending") {
          if (docStatus && !docStatus.includes("Pending") && docStatus !== "-") return false;
        }
      }

      return true;
    });
  }, [
    records,
    searchQuery,
    buyerFilter,
    seasonFilter,
    yarnCountFilter,
    blockNoFilter,
    documentsStatusFilter,
  ]);

  // Totals for filtered records
  const totals = useMemo(() => {
    const list = Array.isArray(filteredRecords) ? filteredRecords : [];
    const totalQty = list.reduce((sum, r) => sum + (Number(r?.qty) || 0), 0);
    const totalUseQty = list.reduce((sum, r) => sum + (Number(r?.useQty) || 0), 0);
    const totalBalance = list.reduce((sum, r) => sum + (Number(r?.balance) || 0), 0);
    const totalReceivedQty = list.reduce((sum, r) => sum + (Number(r?.receivedQty) || 0), 0);
    const avgPrice =
      list.length > 0
        ? list.reduce((sum, r) => sum + (Number(r?.price) || 0), 0) / list.length
        : 0;
    const utilizationPct = totalQty > 0 ? (totalUseQty / totalQty) * 100 : 0;

    return {
      totalQty: Number(totalQty.toFixed(2)) || 0,
      totalUseQty: Number(totalUseQty.toFixed(2)) || 0,
      totalBalance: Number(totalBalance.toFixed(2)) || 0,
      totalReceivedQty: Number(totalReceivedQty.toFixed(2)) || 0,
      avgPrice: Number(avgPrice.toFixed(2)) || 0,
      utilizationPct: Number(utilizationPct.toFixed(1)) || 0,
    };
  }, [filteredRecords]);

  // Paginated records
  const paginatedRecords = useMemo(() => {
    const list = Array.isArray(filteredRecords) ? filteredRecords : [];
    const startIndex = (currentPage - 1) * pageSize;
    return list.slice(startIndex, startIndex + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;

  // --------------------------------------------------------------------------
  // Summary Calculations (Worksheet: "Summary")
  // 4 Group summaries: By Buyer, By Block No., By Season, By Yarn Count
  // --------------------------------------------------------------------------
  const summaryTables = useMemo(() => {
    const buildSummary = (keyExtractor: (r: MMBlockYarnStatusRecord) => string): SummaryRow[] => {
      const map = new Map<string, { totalQty: number; totalUseQty: number; receivedQty: number; count: number }>();
      const list = Array.isArray(records) ? records : [];

      list.forEach((r) => {
        if (!r) return;
        const groupKey = keyExtractor(r) || "Unassigned";
        const curr = map.get(groupKey) || { totalQty: 0, totalUseQty: 0, receivedQty: 0, count: 0 };
        curr.totalQty += Number(r.qty) || 0;
        curr.totalUseQty += Number(r.useQty) || 0;
        curr.receivedQty += Number(r.receivedQty) || 0;
        curr.count += 1;
        map.set(groupKey, curr);
      });

      const rows: SummaryRow[] = [];
      map.forEach((val, groupName) => {
        const balanceStockQty = Number((val.totalQty - val.totalUseQty).toFixed(2)) || 0;
        const kdAdjustBalance = balanceStockQty;
        const utilizationPct = val.totalQty > 0 ? Number(((val.totalUseQty / val.totalQty) * 100).toFixed(1)) || 0 : 0;
        rows.push({
          groupName,
          totalQty: Number(val.totalQty.toFixed(2)) || 0,
          totalUseQty: Number(val.totalUseQty.toFixed(2)) || 0,
          balanceStockQty,
          kdAdjustBalance,
          receivedPaymentQty: Number(val.receivedQty.toFixed(2)) || 0,
          utilizationPct,
          recordCount: val.count,
        });
      });

      return rows.sort((a, b) => b.totalQty - a.totalQty);
    };

    const byBuyer = buildSummary((r) => r?.buyer || "Unassigned");
    const byBlockNo = buildSummary((r) => r?.blockNo || "Unassigned");
    const bySeason = buildSummary((r) => r?.season || "Unassigned");
    const byYarnCount = buildSummary((r) => r?.yarnCount || "Unassigned");

    const computeGrandTotal = (rows: SummaryRow[]): SummaryRow => {
      const safeRows = Array.isArray(rows) ? rows : [];
      const totalQty = safeRows.reduce((sum, r) => sum + (Number(r?.totalQty) || 0), 0);
      const totalUseQty = safeRows.reduce((sum, r) => sum + (Number(r?.totalUseQty) || 0), 0);
      const balanceStockQty = safeRows.reduce((sum, r) => sum + (Number(r?.balanceStockQty) || 0), 0);
      const kdAdjustBalance = safeRows.reduce((sum, r) => sum + (Number(r?.kdAdjustBalance) || 0), 0);
      const receivedPaymentQty = safeRows.reduce((sum, r) => sum + (Number(r?.receivedPaymentQty) || 0), 0);
      const utilizationPct = totalQty > 0 ? Number(((totalUseQty / totalQty) * 100).toFixed(1)) || 0 : 0;
      const recordCount = safeRows.reduce((sum, r) => sum + (Number(r?.recordCount) || 0), 0);

      return {
        groupName: "Grand Total",
        totalQty: Number(totalQty.toFixed(2)) || 0,
        totalUseQty: Number(totalUseQty.toFixed(2)) || 0,
        balanceStockQty: Number(balanceStockQty.toFixed(2)) || 0,
        kdAdjustBalance: Number(kdAdjustBalance.toFixed(2)) || 0,
        receivedPaymentQty: Number(receivedPaymentQty.toFixed(2)) || 0,
        utilizationPct,
        recordCount,
      };
    };

    return {
      buyer: { rows: byBuyer, grandTotal: computeGrandTotal(byBuyer) },
      blockNo: { rows: byBlockNo, grandTotal: computeGrandTotal(byBlockNo) },
      season: { rows: bySeason, grandTotal: computeGrandTotal(bySeason) },
      yarnCount: { rows: byYarnCount, grandTotal: computeGrandTotal(byYarnCount) },
    };
  }, [records]);

  // Safe reference to active summary table
  const activeSummaryData = useMemo(() => {
    return (
      summaryTables[summaryGrouping] || {
        rows: [],
        grandTotal: {
          groupName: "Grand Total",
          totalQty: 0,
          totalUseQty: 0,
          balanceStockQty: 0,
          kdAdjustBalance: 0,
          receivedPaymentQty: 0,
          utilizationPct: 0,
          recordCount: 0,
        },
      }
    );
  }, [summaryTables, summaryGrouping]);

  // Export to CSV
  const handleExportCSV = () => {
    if (activeTab === "register") {
      const headers = [
        "Buyer",
        "Block No",
        "Season",
        "Job",
        "Yarn Count",
        "Qty (KG)",
        "Use Qty (KG)",
        "Balance (KG)",
        "Price ($/KG)",
        "Booking Date",
        "Received Qty (KG)",
        "Documents Status (LC)",
        "Actual Price ($/KG)",
        "PI No",
        "Supplier",
      ];
      const rows = filteredRecords.map((r) => [
        `"${r?.buyer || ""}"`,
        `"${r?.blockNo || ""}"`,
        `"${r?.season || ""}"`,
        `"${r?.job || ""}"`,
        `"${r?.yarnCount || ""}"`,
        Number(r?.qty) || 0,
        Number(r?.useQty) || 0,
        Number(r?.balance) || 0,
        Number(r?.price) || 0,
        `"${r?.bookingDate || ""}"`,
        Number(r?.receivedQty) || 0,
        `"${r?.documentsStatus || ""}"`,
        Number(r?.actualPrice) || 0,
        `"${r?.piNo || ""}"`,
        `"${r?.supplierName || ""}"`,
      ]);
      const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Block_Yarn_Status_Register_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Main Register exported successfully as CSV");
    } else {
      const activeSummary = activeSummaryData;
      const groupHeader =
        summaryGrouping === "buyer"
          ? "Buyer"
          : summaryGrouping === "blockNo"
          ? "Block No"
          : summaryGrouping === "season"
          ? "Season"
          : "Yarn Count";
      const headers = [
        groupHeader,
        "Total Qty (KG)",
        "Total Use Qty (KG)",
        "Balance / Stock Qty (KG)",
        "KD Adjust Balance (KG)",
        "Received / Payment Qty (KG)",
        "Utilization %",
      ];
      const rows = [
        ...activeSummary.rows.map((r) => [
          `"${r.groupName}"`,
          r.totalQty,
          r.totalUseQty,
          r.balanceStockQty,
          r.kdAdjustBalance,
          r.receivedPaymentQty,
          `${r.utilizationPct}%`,
        ]),
        [
          `"${activeSummary.grandTotal.groupName}"`,
          activeSummary.grandTotal.totalQty,
          activeSummary.grandTotal.totalUseQty,
          activeSummary.grandTotal.balanceStockQty,
          activeSummary.grandTotal.kdAdjustBalance,
          activeSummary.grandTotal.receivedPaymentQty,
          `${activeSummary.grandTotal.utilizationPct}%`,
        ],
      ];
      const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Block_Yarn_Summary_By_${groupHeader}_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Summary by ${groupHeader} exported successfully as CSV`);
    }
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-block-yarn-status"
      title="Block Yarn Status"
      subtitle="2026 Live Synchronized Register & Multi-Dimensional Summary"
      breadcrumbs={[
        { label: "Booking Information" },
        { label: "Block Yarn Status" },
      ]}
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              loadData();
              toast.success("Synchronized real-time data from Bookings, Pre Costing & PIs");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
            title="Force Real-time Synchronization"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-teal-600" : "text-slate-500"}`} />
            <span>Sync Data</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
            title="Export Current View to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/mm-manual-booking"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm shadow-teal-600/20 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Block Booking</span>
          </Link>
        </div>
      }
    >
      <div className="w-full space-y-5">
        {/* Top KPI Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full">
          <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-muted-foreground flex items-center justify-between">
              Total Booked Qty
              <Package className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">
              {(Number(totals.totalQty) || 0).toLocaleString()}{" "}
              <span className="text-xs font-normal text-muted-foreground">KG</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {((Number(totals.totalQty) || 0) / 1000).toFixed(1)} TON (Metric Ton)
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-muted-foreground flex items-center justify-between">
              Total Use Qty
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {(Number(totals.totalUseQty) || 0).toLocaleString()}{" "}
              <span className="text-xs font-normal text-muted-foreground">KG</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Tagged via Pre Costing
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-muted-foreground flex items-center justify-between">
              Available Balance
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {(Number(totals.totalBalance) || 0).toLocaleString()}{" "}
              <span className="text-xs font-normal text-muted-foreground">KG</span>
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium mt-0.5">
              {totals.totalQty > 0 ? (100 - totals.utilizationPct).toFixed(1) : 0}% Untagged
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-muted-foreground flex items-center justify-between">
              Utilization %
              <Percent className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {totals.utilizationPct}%
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(100, totals.utilizationPct)}%` }}
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-muted-foreground flex items-center justify-between">
              Received Qty
              <Clock className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">
              {(Number(totals.totalReceivedQty) || 0).toLocaleString()}{" "}
              <span className="text-xs font-normal text-muted-foreground">KG</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Mill Delivery Status
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
            <div className="text-[11px] font-medium text-muted-foreground flex items-center justify-between">
              Active Bookings
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <div className="text-xl font-bold text-foreground mt-1">
              {filterOptions.blocks.length}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {records.length} Item Allocations
            </div>
          </div>
        </div>

        {/* Tab Selection: Main Register vs Summary View */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="inline-flex p-1 bg-muted rounded-xl gap-1">
            <button
              onClick={() => setActiveTab("register")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "register"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Main Register (Worksheet: Block Yarn Status)
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-primary/10 text-primary font-bold">
                {filteredRecords.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "summary"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              Summary View (Worksheet: Summary)
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                4 Groupings
              </span>
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* TAB 1: MAIN REGISTER VIEW (Worksheet: Block Yarn Status)           */}
        {/* ================================================================== */}
        {activeTab === "register" && (
          <div className="space-y-4">
            {/* Filter Toolbar */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search Buyer, Block No, Job, Yarn Count, PI No, LC No, Supplier..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                  {/* Buyer Filter */}
                  <select
                    value={buyerFilter}
                    onChange={(e) => {
                      setBuyerFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-2 text-xs rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="All">All Buyers ({filterOptions.buyers.length})</option>
                    {filterOptions.buyers.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>

                  {/* Season Filter */}
                  <select
                    value={seasonFilter}
                    onChange={(e) => {
                      setSeasonFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-2 text-xs rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="All">All Seasons ({filterOptions.seasons.length})</option>
                    {filterOptions.seasons.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  {/* Yarn Count Filter */}
                  <select
                    value={yarnCountFilter}
                    onChange={(e) => {
                      setYarnCountFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-2 text-xs rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="All">All Yarn Counts ({filterOptions.counts.length})</option>
                    {filterOptions.counts.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  {/* Block No Filter */}
                  <select
                    value={blockNoFilter}
                    onChange={(e) => {
                      setBlockNoFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-2 text-xs rounded-lg border border-input bg-background text-foreground font-mono"
                  >
                    <option value="All">All Block Nos ({filterOptions.blocks.length})</option>
                    {filterOptions.blocks.map((bl) => (
                      <option key={bl} value={bl}>
                        {bl}
                      </option>
                    ))}
                  </select>

                  {/* Documents / LC Filter */}
                  <select
                    value={documentsStatusFilter}
                    onChange={(e) => {
                      setDocumentsStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-2 text-xs rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="All">All LC Statuses</option>
                    <option value="WithLC">LC Issued / Confirmed</option>
                    <option value="Pending">Pending LC / PI</option>
                  </select>

                  {(searchQuery ||
                    buyerFilter !== "All" ||
                    seasonFilter !== "All" ||
                    yarnCountFilter !== "All" ||
                    blockNoFilter !== "All" ||
                    documentsStatusFilter !== "All") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setBuyerFilter("All");
                        setSeasonFilter("All");
                        setYarnCountFilter("All");
                        setBlockNoFilter("All");
                        setDocumentsStatusFilter("All");
                        setCurrentPage(1);
                      }}
                      className="px-2.5 py-2 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Register Table (Columns 1 to 14) */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-border text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider select-none">
                      <th className="py-3.5 px-3 w-12 text-center whitespace-nowrap">Sl.</th>
                      <th className="py-3.5 px-3.5 min-w-[170px] whitespace-nowrap">Buyer</th>
                      <th className="py-3.5 px-3.5 min-w-[150px] whitespace-nowrap">Block No</th>
                      <th className="py-3.5 px-3.5 min-w-[160px] whitespace-nowrap">Season</th>
                      <th className="py-3.5 px-3.5 min-w-[130px] whitespace-nowrap">Job</th>
                      <th className="py-3.5 px-3.5 min-w-[130px] whitespace-nowrap">Yarn Count</th>
                      <th className="py-3.5 px-3.5 min-w-[120px] text-right whitespace-nowrap">Qty (kg)</th>
                      <th className="py-3.5 px-3.5 min-w-[120px] text-right whitespace-nowrap">Use Qty (kg)</th>
                      <th className="py-3.5 px-3.5 min-w-[130px] text-right whitespace-nowrap">Balance (kg)</th>
                      <th className="py-3.5 px-3.5 min-w-[110px] text-right whitespace-nowrap">Price ($/kg)</th>
                      <th className="py-3.5 px-3.5 min-w-[120px] whitespace-nowrap">Booking Date</th>
                      <th className="py-3.5 px-3.5 min-w-[140px] text-right whitespace-nowrap">Received Qty (kg)</th>
                      <th className="py-3.5 px-3.5 min-w-[170px] whitespace-nowrap">Documents Status</th>
                      <th className="py-3.5 px-3.5 min-w-[130px] text-right whitespace-nowrap">Actual Price ($/kg)</th>
                      <th className="py-3.5 px-3.5 min-w-[150px] whitespace-nowrap">PI No</th>
                      <th className="py-3.5 px-3 w-16 text-center whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-normal">
                    {paginatedRecords.length === 0 ? (
                      <tr>
                        <td colSpan={16} className="text-center py-16 text-muted-foreground">
                          <Layers className="w-10 h-10 mx-auto mb-2 opacity-30 text-teal-600" />
                          <div className="font-semibold text-foreground text-sm">No Block Yarn Status records found</div>
                          <p className="text-xs mt-1">
                            Try adjusting your search criteria or create a new Block Yarn Booking.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedRecords.map((r, idx) => {
                        const qtyNum = Number(r?.qty) || 0;
                        const useQtyNum = Number(r?.useQty) || 0;
                        const balanceNum = Number(r?.balance) || 0;
                        const isFullyUtilized = balanceNum <= 0 && qtyNum > 0;
                        const isPartiallyUtilized = useQtyNum > 0 && balanceNum > 0;

                        return (
                          <tr
                            key={r?.id || idx}
                            className="even:bg-slate-50/60 dark:even:bg-slate-900/40 hover:bg-teal-50/60 dark:hover:bg-teal-950/30 transition-colors group cursor-pointer"
                            onClick={() => setViewRecord(r)}
                          >
                            <td className="py-3 px-3 text-center text-muted-foreground text-[11px] whitespace-nowrap font-mono">
                              {(currentPage - 1) * pageSize + idx + 1}
                            </td>

                            {/* Buyer */}
                            <td className="py-3 px-3.5 font-semibold text-foreground whitespace-nowrap" title={r?.buyer || ""}>
                              {r?.buyer || "—"}
                            </td>

                            {/* Block No */}
                            <td className="py-3 px-3.5 font-mono font-medium text-teal-700 dark:text-teal-300 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 font-semibold">
                                {r?.blockNo || "—"}
                              </span>
                            </td>

                            {/* Season */}
                            <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap" title={r?.season || ""}>
                              {r?.season || "—"}
                            </td>

                            {/* Job */}
                            <td className="py-3 px-3.5 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                              {r?.job || "—"}
                            </td>

                            {/* Yarn Count */}
                            <td className="py-3 px-3.5 font-semibold text-foreground whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono border border-slate-200 dark:border-slate-700">
                                {r?.yarnCount || "—"}
                              </span>
                            </td>

                            {/* Qty (kg) */}
                            <td className="py-3 px-3.5 text-right font-mono font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                              {qtyNum.toLocaleString()}
                            </td>

                            {/* Use Qty (kg) */}
                            <td className="py-3 px-3.5 text-right font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                              {useQtyNum.toLocaleString()}
                            </td>

                            {/* Balance (kg) */}
                            <td className="py-3 px-3.5 text-right font-mono font-bold whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded border inline-block ${
                                  isFullyUtilized
                                    ? "bg-slate-100 text-slate-500 border-slate-200 line-through dark:bg-slate-800 dark:border-slate-700"
                                    : isPartiallyUtilized
                                    ? "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                    : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                }`}
                              >
                                {balanceNum.toLocaleString()}
                              </span>
                            </td>

                            {/* Price ($/kg) */}
                            <td className="py-3 px-3.5 text-right font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              ${(Number(r?.price) || 0).toFixed(2)}
                            </td>

                            {/* Booking Date */}
                            <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              {r?.bookingDate || "—"}
                            </td>

                            {/* Received Qty (kg) */}
                            <td className="py-3 px-3.5 text-right font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                              {(Number(r?.receivedQty) || 0).toLocaleString()}
                            </td>

                            {/* Documents Status */}
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              {r?.documentsStatus && !r.documentsStatus.includes("Pending") && r.documentsStatus !== "-" ? (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800">
                                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                  {r.documentsStatus}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                  <Clock className="w-3 h-3 text-amber-500" />
                                  Pending LC
                                </span>
                              )}
                            </td>

                            {/* Actual Price ($/kg) */}
                            <td className="py-3 px-3.5 text-right font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              ${(Number(r?.actualPrice) || 0).toFixed(2)}
                            </td>

                            {/* PI No */}
                            <td className="py-3 px-3.5 font-mono font-medium text-foreground whitespace-nowrap">
                              {r?.piNo && r.piNo !== "-" ? (
                                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-teal-700 dark:text-teal-300 border border-slate-200 dark:border-slate-700">
                                  {r.piNo}
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-[11px]">—</span>
                              )}
                            </td>

                            {/* Action: View */}
                            <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setViewRecord(r)}
                                className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-500 hover:text-teal-600 transition-colors"
                                title="View Complete Status Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>

                  {/* Table Footer with Totals */}
                  {filteredRecords.length > 0 && (
                    <tfoot>
                      <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-t-2 border-slate-300 dark:border-slate-700 font-bold text-xs whitespace-nowrap">
                        <td colSpan={6} className="py-3.5 px-3.5 text-right uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          Total ({filteredRecords.length} records):
                        </td>
                        <td className="py-3.5 px-3.5 text-right font-mono text-slate-900 dark:text-white font-extrabold">
                          {(Number(totals.totalQty) || 0).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3.5 text-right font-mono text-amber-600 dark:text-amber-400 font-extrabold">
                          {(Number(totals.totalUseQty) || 0).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
                          {(Number(totals.totalBalance) || 0).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3.5 text-right font-mono text-slate-600 dark:text-slate-300 font-semibold">
                          ${(Number(totals.avgPrice) || 0).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3.5"></td>
                        <td className="py-3.5 px-3.5 text-right font-mono text-slate-900 dark:text-white font-extrabold">
                          {(Number(totals.totalReceivedQty) || 0).toLocaleString()}
                        </td>
                        <td colSpan={4} className="py-3.5 px-3.5"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-3 border-t border-border gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value) || 10);
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 rounded border border-input bg-background text-foreground text-xs"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>per page</span>
                  <span className="mx-2 text-border">|</span>
                  <span>
                    Showing {filteredRecords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length} entries
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-1 rounded border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                    title="First Page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 font-semibold text-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Last Page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: SUMMARY VIEW (Worksheet: Summary)                           */}
        {/* 4 Groupings: By Buyer, By Block No., By Season, By Yarn Count      */}
        {/* ================================================================== */}
        {activeTab === "summary" && (
          <div className="space-y-4">
            {/* Sub-group Navigation Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-3 bg-card border border-border rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-muted-foreground mr-2">
                  Group Summary By:
                </span>
                <button
                  onClick={() => setSummaryGrouping("buyer")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    summaryGrouping === "buyer"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  1. By Buyer ({summaryTables.buyer.rows.length})
                </button>
                <button
                  onClick={() => setSummaryGrouping("blockNo")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    summaryGrouping === "blockNo"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  2. By Block No. ({summaryTables.blockNo.rows.length})
                </button>
                <button
                  onClick={() => setSummaryGrouping("season")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    summaryGrouping === "season"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  3. By Season ({summaryTables.season.rows.length})
                </button>
                <button
                  onClick={() => setSummaryGrouping("yarnCount")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    summaryGrouping === "yarnCount"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  4. By Yarn Count ({summaryTables.yarnCount.rows.length})
                </button>
              </div>

              <div className="text-xs text-muted-foreground">
                Formula: <span className="font-mono text-foreground font-semibold">Balance = Total Qty - Total Use Qty</span>
              </div>
            </div>

            {/* Active Summary Table */}
            {(() => {
              const currentSummary = activeSummaryData;
              const groupLabel =
                summaryGrouping === "buyer"
                  ? "Buyer Name"
                  : summaryGrouping === "blockNo"
                  ? "Block Booking No."
                  : summaryGrouping === "season"
                  ? "Season Name"
                  : "Yarn Count Specification";

              return (
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 border-b bg-muted/40 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <span>Worksheet: Summary — Grouped by {groupLabel}</span>
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Aggregation of booked quantity, consumed/tagged yarn, remaining balance, and utilization rate.
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold font-mono">
                      {currentSummary.rows.length} Groups
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-border text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider whitespace-nowrap">
                          <th className="py-3.5 px-4 w-12 text-center">Sl.</th>
                          <th className="py-3.5 px-4 min-w-[200px]">{groupLabel}</th>
                          <th className="py-3.5 px-4 text-center min-w-[110px]">Allocations</th>
                          <th className="py-3.5 px-4 text-right min-w-[130px]">Total Qty (kg)</th>
                          <th className="py-3.5 px-4 text-right min-w-[130px]">Total Use Qty (kg)</th>
                          <th className="py-3.5 px-4 text-right min-w-[150px]">Balance / Stock Qty (kg)</th>
                          <th className="py-3.5 px-4 text-right min-w-[150px]">KD Adjust Balance (kg)</th>
                          <th className="py-3.5 px-4 text-right min-w-[160px]">Received / Payment Qty (kg)</th>
                          <th className="py-3.5 px-4 text-center w-52">Utilization %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {currentSummary.rows.map((row, idx) => (
                          <tr key={row.groupName || idx} className="even:bg-slate-50/60 dark:even:bg-slate-900/40 hover:bg-teal-50/60 dark:hover:bg-teal-950/30 transition-colors whitespace-nowrap">
                            <td className="py-3 px-4 text-center text-muted-foreground font-mono text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-4 font-bold text-foreground">
                              {summaryGrouping === "blockNo" ? (
                                <span className="font-mono text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                                  {row.groupName}
                                </span>
                              ) : summaryGrouping === "yarnCount" ? (
                                <span className="font-mono text-foreground px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                  {row.groupName}
                                </span>
                              ) : (
                                row.groupName
                              )}
                            </td>
                            <td className="py-3 px-4 text-center text-muted-foreground font-mono">
                              {row.recordCount}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-medium text-foreground">
                              {(Number(row.totalQty) || 0).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-semibold text-amber-600 dark:text-amber-400">
                              {(Number(row.totalUseQty) || 0).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {(Number(row.balanceStockQty) || 0).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                              {(Number(row.kdAdjustBalance) || 0).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                              {(Number(row.receivedPaymentQty) || 0).toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      row.utilizationPct > 80
                                        ? "bg-emerald-500"
                                        : row.utilizationPct > 40
                                        ? "bg-amber-500"
                                        : "bg-teal-600"
                                    }`}
                                    style={{ width: `${Math.min(100, Math.max(0, row.utilizationPct))}%` }}
                                  />
                                </div>
                                <span className="text-xs font-mono font-semibold w-12 text-right">
                                  {row.utilizationPct}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                      {/* Grand Total Row at Bottom */}
                      <tfoot>
                        <tr className="bg-slate-100/95 dark:bg-slate-900/95 border-t-2 border-slate-300 dark:border-slate-700 font-extrabold text-xs whitespace-nowrap">
                          <td colSpan={2} className="py-3.5 px-4 text-left uppercase tracking-wider text-teal-800 dark:text-teal-300">
                            Grand Total ({currentSummary.grandTotal.groupName})
                          </td>
                          <td className="py-3.5 px-4 text-center text-teal-800 dark:text-teal-300 font-mono">
                            {currentSummary.grandTotal.recordCount} items
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-foreground font-black text-sm">
                            {(Number(currentSummary.grandTotal.totalQty) || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-amber-600 dark:text-amber-400 font-black text-sm">
                            {(Number(currentSummary.grandTotal.totalUseQty) || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-black text-sm">
                            {(Number(currentSummary.grandTotal.balanceStockQty) || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-muted-foreground">
                            {(Number(currentSummary.grandTotal.kdAdjustBalance) || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-foreground font-black text-sm">
                            {(Number(currentSummary.grandTotal.receivedPaymentQty) || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                                <div
                                  className="bg-teal-600 h-2.5 rounded-full transition-all"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(0, currentSummary.grandTotal.utilizationPct)
                                    )}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-mono font-black text-teal-700 dark:text-teal-300 w-12 text-right">
                                {currentSummary.grandTotal.utilizationPct}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================================================================== */}
        {/* RECORD DETAIL MODAL (Worksheet Row Inspection)                     */}
        {/* ================================================================== */}
        {viewRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      Block Yarn Status Record Detail
                      <span className="text-xs px-2.5 py-0.5 rounded bg-primary/10 text-primary font-mono font-semibold">
                        {viewRecord.blockNo || "-"}
                      </span>
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Buyer: <span className="font-semibold text-foreground">{viewRecord.buyer || "-"}</span> • Yarn:{" "}
                      <span className="font-semibold text-foreground">{viewRecord.yarnCount || "-"}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewRecord(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* 1. Header Information Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-muted/40 p-3 rounded-xl border border-border">
                    <div className="text-[11px] text-muted-foreground">Buyer</div>
                    <div className="text-xs font-bold text-foreground mt-0.5">{viewRecord.buyer || "H&M Europe"}</div>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-xl border border-border">
                    <div className="text-[11px] text-muted-foreground">Block Booking No.</div>
                    <div className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300 mt-0.5">{viewRecord.blockNo || "-"}</div>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-xl border border-border">
                    <div className="text-[11px] text-muted-foreground">Season</div>
                    <div className="text-xs font-semibold text-foreground mt-0.5">{viewRecord.season || "Spring/Summer 2026"}</div>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-xl border border-border">
                    <div className="text-[11px] text-muted-foreground">Job / Order Ref</div>
                    <div className="text-xs font-mono font-semibold text-foreground mt-0.5">{viewRecord.job || "-"}</div>
                  </div>
                </div>

                {/* 2. Yarn Specifications & Commercial Cards */}
                <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-teal-600" />
                    Yarn Specification & Commercial Terms
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground text-[11px]">Yarn Count:</span>
                      <div className="font-bold text-foreground font-mono mt-0.5">{viewRecord.yarnCount || "Ne 30/1"}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[11px]">Item Description:</span>
                      <div className="font-medium text-foreground mt-0.5">{viewRecord.yarnItem || "100% Combed Cotton Yarn"}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[11px]">Supplier / Mill:</span>
                      <div className="font-medium text-foreground mt-0.5">{viewRecord.supplierName || "Square Textiles Ltd"}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[11px]">Booking Date:</span>
                      <div className="font-mono text-foreground mt-0.5">{viewRecord.bookingDate || "-"}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[11px]">Price:</span>
                      <div className="font-mono font-semibold text-foreground mt-0.5">
                        ${(Number(viewRecord.price) || 0).toFixed(2)} / KG
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[11px]">Actual Price:</span>
                      <div className="font-mono font-semibold text-foreground mt-0.5">
                        ${(Number(viewRecord.actualPrice) || 0).toFixed(2)} / KG
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[11px]">PI No.:</span>
                      <div className="font-mono font-bold text-teal-700 dark:text-teal-300 mt-0.5">{viewRecord.piNo || "-"}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[11px]">Documents Status / LC:</span>
                      <div className="font-mono font-semibold text-foreground mt-0.5">{viewRecord.documentsStatus || "Pending LC"}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[11px]">Received Qty:</span>
                      <div className="font-mono font-semibold text-foreground mt-0.5">
                        {(Number(viewRecord.receivedQty) || 0).toLocaleString()} KG
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Balance & Consumption Status Card */}
                <div className="bg-card border-2 border-teal-500/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      Dynamic Balance & Utilization
                    </h3>
                    <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
                      {Number(viewRecord.qty) > 0
                        ? (((Number(viewRecord.useQty) || 0) / Number(viewRecord.qty)) * 100).toFixed(1)
                        : 0}% Utilized
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-muted/40 rounded-xl">
                      <div className="text-[11px] text-muted-foreground">Booked Qty</div>
                      <div className="text-lg font-bold font-mono text-foreground mt-0.5">
                        {(Number(viewRecord.qty) || 0).toLocaleString()}{" "}
                        <span className="text-xs font-normal text-muted-foreground">KG</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {((Number(viewRecord.qty) || 0) / 1000).toFixed(1)} TON
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl">
                      <div className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold">
                        Use Qty
                      </div>
                      <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                        {(Number(viewRecord.useQty) || 0).toLocaleString()}{" "}
                        <span className="text-xs font-normal text-amber-600 dark:text-amber-400">KG</span>
                      </div>
                      <div className="text-[10px] text-amber-700 dark:text-amber-300">
                        Tagged across Pre Costing
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                        Balance
                      </div>
                      <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {(Number(viewRecord.balance) || 0).toLocaleString()}{" "}
                        <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">KG</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-300">
                        Remaining Available
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          Number(viewRecord.qty) > 0
                            ? ((Number(viewRecord.useQty) || 0) / Number(viewRecord.qty)) * 100
                            : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* 4. Tagged Pre Costing Records Breakdown */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-primary" />
                      Pre Costing (Knit) Tagged Styles ({viewRecord.tags?.length || 0})
                    </span>
                    <Link
                      to="/mm-pre-costing-knit"
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 normal-case font-normal"
                    >
                      Open Pre Costing Entry <ExternalLink className="w-3 h-3" />
                    </Link>
                  </h3>

                  {Array.isArray(viewRecord.tags) && viewRecord.tags.length > 0 ? (
                    <div className="border border-border rounded-xl overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted/70 text-[11px] font-semibold text-muted-foreground uppercase border-b border-border">
                            <th className="py-2.5 px-3 text-center w-10">Sl</th>
                            <th className="py-2.5 px-3">Pre Cost Job ID</th>
                            <th className="py-2.5 px-3">Yarn Row Tag ID</th>
                            <th className="py-2.5 px-3 text-right">Tagged Qty (KG)</th>
                            <th className="py-2.5 px-3">Tagged Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {viewRecord.tags.map((t, tidx) => (
                            <tr key={t?.id || tidx} className="hover:bg-muted/30">
                              <td className="py-2 px-3 text-center text-muted-foreground">{tidx + 1}</td>
                              <td className="py-2 px-3 font-mono font-semibold text-primary">
                                {t?.preCostId || viewRecord?.job || "JOB-KT-2026-0001"}
                              </td>
                              <td className="py-2 px-3 font-mono text-muted-foreground text-[11px]">
                                {t?.yarnRowId || "-"}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                                {(Number(t?.tagQtyKg) || 0).toLocaleString()} KG
                              </td>
                              <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                                {t?.taggedAt || viewRecord?.bookingDate || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-border rounded-xl text-muted-foreground text-xs">
                      No Pre Costing style has tagged yarn against this booking item yet.
                      <div className="text-[11px] mt-1 text-muted-foreground">
                        Yarn can be tagged in Pre Costing Entry (Knit) under the "Yarn Breakdown & Costing Details" section.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
                <div className="text-xs text-muted-foreground">
                  Persistent Storage: <code className="text-[11px]">cripton_mm_block_yarn_status_v1</code>
                </div>
                <button
                  onClick={() => setViewRecord(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MarketingMerchandisingLayout>
  );
}

export default MMBlockYarnStatusPage;

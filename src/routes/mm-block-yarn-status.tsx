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
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  X,
  Sparkles,
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
          "Real-time Block Yarn Status register and consumption tracking based on Block Yarn Status 2026.",
      },
    ],
  }),
  component: MMBlockYarnStatusPage,
});

export interface BlockYarnTransactionRow {
  id: string;
  sl: number;
  buyer: string;
  season: string;
  job: string;
  useQty: number;
  balance: number;
  price?: number;
  blockQty?: number;
  tag?: MMYarnBookingTagRecord;
}

export interface BlockYarnGroup {
  id: string;
  blockNo: string;
  yarnName: string;
  yarnNames: string[];
  qty: number;
  price: number;
  bookingDate: string;
  receivedQty: number;
  documentsStatus: string;
  actualPrice: number;
  piNo: string;
  piId?: string;
  supplierName: string;
  rawRecord: MMBlockYarnStatusRecord;
  rows: BlockYarnTransactionRow[];
  totalUseQty: number;
  finalBalance: number;
  transactionCount: number;
}

function MMBlockYarnStatusPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<MMBlockYarnStatusRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("All");
  const [seasonFilter, setSeasonFilter] = useState("All");
  const [yarnNameFilter, setYarnNameFilter] = useState("All");
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

    // Listen to local storage changes from Pre Costing or Bookings in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (
        !e.key ||
        e.key.includes("cripton_mm_yarn_booking_tags_v1") ||
        e.key.includes("cripton_pre_costings_knit_master_v1") ||
        e.key.includes("cripton_mm_manual_bookings_v1") ||
        e.key.includes("cripton_mm_pi_v1")
      ) {
        loadData();
      }
    };

    // Re-sync on window focus when navigating back from Pre Costing
    const handleFocus = () => {
      loadData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // 1. Group records by unique combination of (Block Booking No. + Yarn Name)
  const allGroups = useMemo<BlockYarnGroup[]>(() => {
    const list = Array.isArray(records) ? records : [];
    const groupMap = new Map<string, BlockYarnGroup>();

    list.forEach((r) => {
      if (!r) return;
      const blockNo = r.blockNo || "—";
      const yarnName = r.yarnName || r.yarnItem || r.yarnCount || "Yarn Item";
      // Grouping Key strictly uses combination of Block Booking No. + Yarn Name
      const groupKey = `${blockNo}___${yarnName}`;

      if (!groupMap.has(groupKey)) {
        const validTags = Array.isArray(r.tags)
          ? r.tags.filter((t) => t && Number(t.tagQtyKg) > 0)
          : [];

        let rows: BlockYarnTransactionRow[] = [];
        let runningBal = Number(r.qty) || 0;

        if (validTags.length === 0) {
          // If a booking has not been tagged yet, display 1 row with Buyer="—", Season="—", Job="—", Use Qty=0, and Balance=Total Booking Qty
          rows = [
            {
              id: `${groupKey}-untagged`,
              sl: 1,
              buyer: "—",
              season: "—",
              job: "—",
              useQty: 0,
              balance: runningBal,
              price: Number(r.price) || 0,
              blockQty: Number(r.qty) || 0,
            },
          ];
        } else {
          // Sequential running balance calculation within this group:
          // Row 1: Balance = Qty - UseQty_1
          // Row 2: Balance = Balance_1 - UseQty_2
          // Row i: Balance = Balance_{i-1} - UseQty_i
          rows = validTags.map((t, idx) => {
            const useQty = Number(t.tagQtyKg) || 0;
            runningBal = Math.max(0, Number((runningBal - useQty).toFixed(2)));
            return {
              id: t.id || `${groupKey}-t-${idx}`,
              sl: idx + 1,
              buyer: t.buyer && t.buyer !== "—" ? t.buyer : "—",
              season: t.season && t.season !== "—" ? t.season : "—",
              job: t.job && t.job !== "—" ? t.job : (t.preCostId || "—"),
              useQty,
              balance: runningBal,
              price: Number(t.price) || Number(r.price) || 0,
              blockQty: Number(r.qty) || 0,
              tag: t,
            };
          });
        }

        const totalUseQty = rows.reduce((sum, row) => sum + row.useQty, 0);
        const finalBalance = rows[rows.length - 1].balance;

        groupMap.set(groupKey, {
          id: groupKey,
          blockNo,
          yarnName,
          yarnNames: [yarnName],
          qty: Number(r.qty) || 0,
          price: Number(r.price) || 0,
          bookingDate: r.bookingDate || "",
          receivedQty: Number(r.receivedQty) || 0,
          documentsStatus: r.documentsStatus || "Pending LC",
          actualPrice: Number(r.actualPrice) || 0,
          piNo: r.piNo || "—",
          piId: r.piId,
          supplierName: r.supplierName || "Square Textiles Ltd",
          rawRecord: r,
          rows,
          totalUseQty: Number(totalUseQty.toFixed(2)),
          finalBalance: Number(finalBalance.toFixed(2)),
          transactionCount: validTags.length,
        });
      } else {
        // Same Block No + Same Yarn Name: append any distinct tags
        const existingGroup = groupMap.get(groupKey)!;
        if (Array.isArray(r.tags) && r.tags.length > 0) {
          const extraTags = r.tags.filter(
            (t) => t && Number(t.tagQtyKg) > 0 && !existingGroup.rows.some((row) => row.id === t.id)
          );
          if (extraTags.length > 0) {
            if (existingGroup.rows.length === 1 && existingGroup.rows[0].buyer === "—") {
              existingGroup.rows = [];
            }
            let runningBal =
              existingGroup.rows.length > 0
                ? existingGroup.rows[existingGroup.rows.length - 1].balance
                : existingGroup.qty;

            extraTags.forEach((t) => {
              const useQty = Number(t.tagQtyKg) || 0;
              runningBal = Math.max(0, Number((runningBal - useQty).toFixed(2)));
              existingGroup.rows.push({
                id: t.id || `${groupKey}-t-${existingGroup.rows.length}`,
                sl: existingGroup.rows.length + 1,
                buyer: t.buyer && t.buyer !== "—" ? t.buyer : "—",
                season: t.season && t.season !== "—" ? t.season : "—",
                job: t.job && t.job !== "—" ? t.job : (t.preCostId || "—"),
                useQty,
                balance: runningBal,
                price: Number(t.price) || 0,
                blockQty: existingGroup.qty,
                tag: t,
              });
            });

            existingGroup.transactionCount += extraTags.length;
            existingGroup.totalUseQty = Number(
              existingGroup.rows.reduce((sum, row) => sum + row.useQty, 0).toFixed(2)
            );
            existingGroup.finalBalance = Number(
              Math.max(0, existingGroup.qty - existingGroup.totalUseQty).toFixed(2)
            );
          }
        }
      }
    });

    return Array.from(groupMap.values());
  }, [records]);

  // Filter options derived dynamically from data
  const filterOptions = useMemo(() => {
    const buyersSet = new Set<string>();
    const seasonsSet = new Set<string>();
    const yarnNamesSet = new Set<string>();
    const blocksSet = new Set<string>();

    allGroups.forEach((g) => {
      if (g.blockNo && g.blockNo !== "—") blocksSet.add(g.blockNo);
      if (g.yarnName && g.yarnName !== "—") yarnNamesSet.add(g.yarnName);
      g.rows.forEach((r) => {
        if (r.buyer && r.buyer !== "—") buyersSet.add(r.buyer);
        if (r.season && r.season !== "—") seasonsSet.add(r.season);
      });
    });

    return {
      buyers: Array.from(buyersSet).sort(),
      seasons: Array.from(seasonsSet).sort(),
      yarnNames: Array.from(yarnNamesSet).sort(),
      counts: Array.from(yarnNamesSet).sort(),
      blocks: Array.from(blocksSet).sort(),
    };
  }, [allGroups]);

  // Filtered Groups for Register Table
  const filteredGroups = useMemo<BlockYarnGroup[]>(() => {
    return allGroups
      .map((g) => {
        let matchingRows = g.rows;
        if (buyerFilter !== "All") {
          matchingRows = matchingRows.filter((r) => r.buyer === buyerFilter);
        }
        if (seasonFilter !== "All") {
          matchingRows = matchingRows.filter((r) => r.season === seasonFilter);
        }

        if ((buyerFilter !== "All" || seasonFilter !== "All") && matchingRows.length === 0) {
          return null;
        }

        if (yarnNameFilter !== "All" && g.yarnName !== yarnNameFilter) {
          return null;
        }

        if (blockNoFilter !== "All" && g.blockNo !== blockNoFilter) {
          return null;
        }

        if (documentsStatusFilter !== "All") {
          const docStatus = g.documentsStatus || "";
          if (documentsStatusFilter === "WithLC") {
            if (!docStatus || docStatus.includes("Pending") || docStatus === "-") return null;
          } else if (documentsStatusFilter === "Pending") {
            if (docStatus && !docStatus.includes("Pending") && docStatus !== "-") return null;
          }
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchGroup =
            (g.blockNo || "").toLowerCase().includes(q) ||
            (g.yarnName || "").toLowerCase().includes(q) ||
            (g.piNo || "").toLowerCase().includes(q) ||
            (g.documentsStatus || "").toLowerCase().includes(q) ||
            (g.supplierName || "").toLowerCase().includes(q);

          const matchRows = matchingRows.some(
            (r) =>
              (r.buyer || "").toLowerCase().includes(q) ||
              (r.season || "").toLowerCase().includes(q) ||
              (r.job || "").toLowerCase().includes(q)
          );

          if (!matchGroup && !matchRows) return null;
        }

        return {
          ...g,
          rows: matchingRows,
        };
      })
      .filter((g): g is BlockYarnGroup => g !== null);
  }, [
    allGroups,
    searchQuery,
    buyerFilter,
    seasonFilter,
    yarnNameFilter,
    blockNoFilter,
    documentsStatusFilter,
  ]);

  // Expandable group state (combination of Block No + Yarn Name) - collapsed by default
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const allExpanded =
    filteredGroups.length > 0 && filteredGroups.every((g) => expandedGroups.has(g.id));

  const toggleAllExpanded = () => {
    if (allExpanded) {
      setExpandedGroups(new Set());
    } else {
      setExpandedGroups(new Set(filteredGroups.map((g) => g.id)));
    }
  };

  // Backward compatibility alias
  const filteredRecords = filteredGroups;

  // Totals for filtered groups (Counting each booking quantity once per group)
  const totals = useMemo(() => {
    const list = Array.isArray(filteredGroups) ? filteredGroups : [];
    let totalQty = 0;
    let totalUseQty = 0;
    let totalBalance = 0;
    let totalReceivedQty = 0;
    const pricedRows: number[] = [];

    list.forEach((g) => {
      totalQty += Number(g.qty) || 0;
      totalUseQty += g.rows.reduce((sum, r) => sum + (Number(r.useQty) || 0), 0);
      totalBalance += Number(g.finalBalance) || 0;
      totalReceivedQty += Number(g.receivedQty) || 0;
      if (Number(g.price) > 0) pricedRows.push(Number(g.price));
    });

    const avgPrice =
      pricedRows.length > 0
        ? pricedRows.reduce((sum, p) => sum + p, 0) / pricedRows.length
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
  }, [filteredGroups]);

  // Total transaction rows across all filtered groups
  const totalTransactionRows = useMemo(() => {
    return filteredGroups.reduce((sum, g) => sum + g.rows.length, 0);
  }, [filteredGroups]);

  // Cumulative starting index of transactions for each group
  const groupStartIndices = useMemo(() => {
    const indices: number[] = [];
    let running = 0;
    filteredGroups.forEach((g) => {
      indices.push(running);
      running += g.rows.length;
    });
    return indices;
  }, [filteredGroups]);

  // Paginated groups
  const paginatedGroups = useMemo(() => {
    const list = Array.isArray(filteredGroups) ? filteredGroups : [];
    const startIndex = (currentPage - 1) * pageSize;
    return list.slice(startIndex, startIndex + pageSize);
  }, [filteredGroups, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredGroups.length / pageSize) || 1;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "SL.",
      "Buyer",
      "Season",
      "Job",
      "Block Qty (KG)",
      "Use Qty (KG)",
      "Balance (KG)",
      "Price ($/KG)",
      "Booking Date",
      "Received Qty (KG)",
      "Documents Status",
      "Actual Price ($/KG)",
      "PI No",
      "Block No",
      "Yarn Name",
      "Supplier",
    ];
    const rows: (string | number)[][] = [];
    let globalSl = 1;

    filteredGroups.forEach((g) => {
      g.rows.forEach((r) => {
        rows.push([
          globalSl++,
          `"${r.buyer || ""}"`,
          `"${r.season || ""}"`,
          `"${r.job || ""}"`,
          Number(g.qty) || 0,
          Number(r.useQty) || 0,
          Number(r.balance) || 0,
          r.price && Number(r.price) > 0
            ? Number(r.price)
            : Number(g.price) > 0
            ? Number(g.price)
            : "",
          `"${g.bookingDate || ""}"`,
          Number(g.receivedQty) || 0,
          `"${g.documentsStatus || ""}"`,
          Number(g.actualPrice) > 0 ? Number(g.actualPrice) : "",
          `"${g.piNo || ""}"`,
          `"${g.blockNo || ""}"`,
          `"${g.yarnName || ""}"`,
          `"${g.supplierName || ""}"`,
        ]);
      });
    });
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Block_Yarn_Status_Register_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Main Register exported successfully as CSV");
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-block-yarn-status"
      title="Block Yarn Status"
      subtitle="2026 Live Synchronized Register & Consumption Tracking"
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

        {/* ================================================================== */}
        {/* MAIN REGISTER VIEW (Worksheet: Block Yarn Status)                  */}
        {/* ================================================================== */}
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

                  {/* Yarn Name Filter */}
                  <select
                    value={yarnNameFilter}
                    onChange={(e) => {
                      setYarnNameFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-2 text-xs rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="All">All Yarn Names ({filterOptions.yarnNames.length})</option>
                    {filterOptions.yarnNames.map((c) => (
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
                    yarnNameFilter !== "All" ||
                    blockNoFilter !== "All" ||
                    documentsStatusFilter !== "All") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setBuyerFilter("All");
                        setSeasonFilter("All");
                        setYarnNameFilter("All");
                        setBlockNoFilter("All");
                        setDocumentsStatusFilter("All");
                        setCurrentPage(1);
                      }}
                      className="px-2.5 py-2 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      Clear Filters
                    </button>
                  )}

                  <button
                    onClick={toggleAllExpanded}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-teal-300 dark:border-teal-700 bg-teal-50/80 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-200 transition-colors shadow-xs ml-auto sm:ml-0"
                    title={allExpanded ? "Collapse all yarn groups" : "Expand all yarn groups"}
                  >
                    {allExpanded ? (
                      <>
                        <ChevronDown className="w-3.5 h-3.5 text-teal-600" />
                        <span>Collapse All</span>
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-3.5 h-3.5 text-teal-600" />
                        <span>Expand All</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Register Table (Columns 1 to 14) */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-border text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider select-none">
                      <th className="py-3 px-3 w-12 text-center whitespace-nowrap">SL.</th>
                      <th className="py-3 px-3.5 min-w-[170px] whitespace-nowrap">Buyer</th>
                      <th className="py-3 px-3.5 min-w-[150px] whitespace-nowrap">Season</th>
                      <th className="py-3 px-3.5 min-w-[140px] whitespace-nowrap">Job</th>
                      <th className="py-3 px-3.5 min-w-[130px] text-center whitespace-nowrap">Block Qty (KG)</th>
                      <th className="py-3 px-3.5 min-w-[120px] text-right whitespace-nowrap">Use Qty (KG)</th>
                      <th className="py-3 px-3.5 min-w-[130px] text-right whitespace-nowrap">Balance (KG)</th>
                      <th className="py-3 px-3.5 min-w-[110px] text-center whitespace-nowrap">Price ($/KG)</th>
                      <th className="py-3 px-3.5 min-w-[120px] text-center whitespace-nowrap">Booking Date</th>
                      <th className="py-3 px-3.5 min-w-[140px] text-center whitespace-nowrap">Received Qty (KG)</th>
                      <th className="py-3 px-3.5 min-w-[170px] text-center whitespace-nowrap">Documents Status</th>
                      <th className="py-3 px-3.5 min-w-[130px] text-center whitespace-nowrap">Actual Price ($/KG)</th>
                      <th className="py-3 px-3.5 min-w-[140px] text-center whitespace-nowrap">PI No</th>
                      <th className="py-3 px-3 w-16 text-center whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-normal">
                    {paginatedGroups.length === 0 ? (
                      <tr>
                        <td colSpan={14} className="text-center py-16 text-muted-foreground">
                          <Layers className="w-10 h-10 mx-auto mb-2 opacity-30 text-teal-600" />
                          <div className="font-semibold text-foreground text-sm">No Block Yarn Status records found</div>
                          <p className="text-xs mt-1 max-w-md mx-auto text-slate-500 dark:text-slate-400">
                            No Block Yarn Booking items match your search or filter criteria. Create a Block Yarn Booking or adjust your filters.
                          </p>
                          <div className="mt-4 flex items-center justify-center gap-3">
                            <Link
                              to="/mm-pre-costing-knit"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Pre Costing Entry (Knit)</span>
                            </Link>
                            <Link
                              to="/mm-manual-booking"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-sm"
                            >
                              <span>View Block Yarn Bookings</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedGroups.map((group, groupIdx) => {
                        const globalGroupIdx = (currentPage - 1) * pageSize + groupIdx;
                        const groupStartSl = groupStartIndices[globalGroupIdx] ?? 0;
                        const isExpanded = expandedGroups.has(group.id);

                        return (
                          <React.Fragment key={`group-${group.id}`}>
                            {/* Expandable Group Header - Compact Single-line Left-aligned */}
                            <tr
                              className="bg-teal-50/70 hover:bg-teal-100/70 dark:bg-teal-950/40 dark:hover:bg-teal-900/40 border-y-2 border-teal-200/90 dark:border-teal-800/90 transition-colors select-none cursor-pointer"
                              onClick={() => toggleGroup(group.id)}
                            >
                              <td colSpan={14} className="py-2 px-3">
                                <div className="flex items-center gap-2.5 whitespace-nowrap overflow-x-auto text-xs">
                                  {/* 1. Expand/Collapse Icon */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleGroup(group.id);
                                    }}
                                    className="p-1 rounded-md hover:bg-teal-200/60 dark:hover:bg-teal-800/60 text-teal-800 dark:text-teal-200 transition-colors shrink-0"
                                    title={isExpanded ? "Collapse Yarn Group" : "Expand Yarn Group"}
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="w-4 h-4 text-teal-700 dark:text-teal-300" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-teal-700 dark:text-teal-300" />
                                    )}
                                  </button>

                                  {/* 2. Block Booking No. */}
                                  <span className="font-mono font-bold text-sm text-teal-950 dark:text-teal-100 flex items-center gap-1.5 shrink-0">
                                    <Package className="w-4 h-4 text-teal-600 shrink-0" />
                                    {group.blockNo}
                                  </span>

                                  {/* 3. Transaction Count */}
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900/70 dark:text-teal-300 border border-teal-300/70 dark:border-teal-700/70 shadow-2xs shrink-0">
                                    {group.transactionCount === 0
                                      ? "0 Transactions"
                                      : `${group.transactionCount} ${
                                          group.transactionCount === 1 ? "Transaction" : "Transactions"
                                        }`}
                                  </span>

                                  {/* 4. Yarn Name */}
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <Tag className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                    <span className="text-[11px] text-muted-foreground font-medium shrink-0">
                                      Yarn Name:
                                    </span>
                                    <span
                                      className="text-xs font-bold text-teal-950 dark:text-teal-100 bg-white/80 dark:bg-card/60 px-2 py-0.5 rounded border border-teal-200/70 dark:border-teal-800/70 shadow-2xs"
                                      title={group.yarnName}
                                    >
                                      {group.yarnName || "—"}
                                    </span>
                                  </div>

                                  {/* 5-8. Four Summary Cards immediately after Yarn Name, compact & left-aligned */}
                                  <div className="flex items-center gap-2 bg-card/90 dark:bg-slate-900/90 px-2.5 py-1 rounded-lg border border-teal-200/80 dark:border-teal-800/80 shadow-2xs shrink-0">
                                    {/* 5. Block Qty */}
                                    <div className="flex items-center gap-1 px-1">
                                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                                        Block Qty:
                                      </span>
                                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                                        {group.qty.toLocaleString()}{" "}
                                        <span className="text-[10px] font-sans font-normal text-muted-foreground">
                                          KG
                                        </span>
                                      </span>
                                    </div>

                                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

                                    {/* 6. Use Qty */}
                                    <div className="flex items-center gap-1 px-1">
                                      <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
                                        Use Qty:
                                      </span>
                                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                                        {group.totalUseQty.toLocaleString()}{" "}
                                        <span className="text-[10px] font-sans font-normal text-muted-foreground">
                                          KG
                                        </span>
                                      </span>
                                    </div>

                                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

                                    {/* 7. Balance */}
                                    <div className="flex items-center gap-1 px-1">
                                      <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                                        Balance:
                                      </span>
                                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                        {group.finalBalance.toLocaleString()}{" "}
                                        <span className="text-[10px] font-sans font-normal text-muted-foreground">
                                          KG
                                        </span>
                                      </span>
                                    </div>

                                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

                                    {/* 8. Received Qty */}
                                    <div className="flex items-center gap-1 px-1">
                                      <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400 tracking-wider">
                                        Received Qty:
                                      </span>
                                      <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
                                        {group.receivedQty.toLocaleString()}{" "}
                                        <span className="text-[10px] font-sans font-normal text-muted-foreground">
                                          KG
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>

                            {/* Expanded Transaction Records */}
                            {isExpanded &&
                              group.rows.map((row, rowIdx) => {
                                const rowSl = groupStartSl + rowIdx + 1;
                                const isFullyUtilized = row.balance <= 0 && group.qty > 0;
                                const isPartiallyUtilized = row.useQty > 0 && row.balance > 0;
                                const isLastRow = rowIdx === group.rows.length - 1;
                                const isFirstRow = rowIdx === 0;
                                const rowCount = group.rows.length;

                                return (
                                  <tr
                                    key={row.id}
                                    className={`transition-colors cursor-pointer group hover:bg-teal-50/40 dark:hover:bg-teal-950/20 bg-card ${
                                      isLastRow
                                        ? "border-b-2 border-slate-300 dark:border-slate-700"
                                        : "border-b border-border/40"
                                    }`}
                                    onClick={() => setViewRecord(group.rawRecord)}
                                  >
                                    {/* 1. SL. (Transaction-wise) */}
                                    <td className="py-2.5 px-3 text-center text-muted-foreground text-[11px] whitespace-nowrap font-mono">
                                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                                        {rowSl}
                                      </span>
                                      {group.rows.length > 1 && (
                                        <span className="block text-[9px] text-teal-600 dark:text-teal-400 font-medium">
                                          {`T-${rowIdx + 1}`}
                                        </span>
                                      )}
                                    </td>

                                    {/* 2. Buyer (Transaction-wise) */}
                                    <td
                                      className="py-2.5 px-3.5 font-semibold text-foreground whitespace-nowrap"
                                      title={row.buyer}
                                    >
                                      {row.buyer !== "—" ? (
                                        <span className="text-slate-900 dark:text-slate-100">{row.buyer}</span>
                                      ) : (
                                        <span className="text-muted-foreground">—</span>
                                      )}
                                    </td>

                                    {/* 3. Season (Transaction-wise) */}
                                    <td
                                      className="py-2.5 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap"
                                      title={row.season}
                                    >
                                      {row.season}
                                    </td>

                                    {/* 4. Job (Transaction-wise) */}
                                    <td className="py-2.5 px-3.5 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                      {row.job}
                                    </td>

                                    {/* 5. Block Qty (KG) (Vertically Merged #1) */}
                                    {isFirstRow && (
                                      <td
                                        rowSpan={rowCount}
                                        className="py-2.5 px-3.5 text-center align-middle font-mono font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap bg-muted/20 dark:bg-slate-900/30 border-x border-border/40"
                                      >
                                        {group.qty.toLocaleString()}
                                      </td>
                                    )}

                                    {/* 6. Use Qty (KG) (Transaction-wise) */}
                                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                                      {row.useQty > 0 ? row.useQty.toLocaleString() : "0"}
                                    </td>

                                    {/* 7. Balance (KG) (Transaction-wise) */}
                                    <td className="py-2.5 px-3.5 text-right font-mono font-bold whitespace-nowrap">
                                      <span
                                        className={`px-2 py-0.5 rounded border inline-block ${
                                          isFullyUtilized
                                            ? "bg-slate-100 text-slate-500 border-slate-200 line-through dark:bg-slate-800 dark:border-slate-700"
                                            : isPartiallyUtilized
                                            ? "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                            : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                        }`}
                                      >
                                        {row.balance.toLocaleString()}
                                      </span>
                                    </td>

                                    {/* 8-14. Vertically Merged Booking-level Columns (Rendered once on first row) */}
                                    {isFirstRow && (
                                      <>
                                        {/* 8. Price ($/KG) (Vertically Merged #2) */}
                                        <td
                                          rowSpan={rowCount}
                                          className="py-2.5 px-3.5 text-center align-middle font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap bg-muted/20 dark:bg-slate-900/30 border-x border-border/40"
                                        >
                                          {group.price > 0 ? `$${group.price.toFixed(2)}` : "—"}
                                        </td>

                                        {/* 9. Booking Date (Vertically Merged #3) */}
                                        <td
                                          rowSpan={rowCount}
                                          className="py-2.5 px-3.5 text-center align-middle text-slate-600 dark:text-slate-300 whitespace-nowrap bg-muted/20 dark:bg-slate-900/30 border-x border-border/40"
                                        >
                                          {group.bookingDate || "—"}
                                        </td>

                                        {/* 10. Received Qty (KG) (Vertically Merged #4) */}
                                        <td
                                          rowSpan={rowCount}
                                          className="py-2.5 px-3.5 text-center align-middle font-mono font-semibold text-teal-700 dark:text-teal-300 whitespace-nowrap bg-muted/20 dark:bg-slate-900/30 border-x border-border/40"
                                        >
                                          {group.receivedQty.toLocaleString()}
                                        </td>

                                        {/* 11. Documents Status (Vertically Merged #5) */}
                                        <td
                                          rowSpan={rowCount}
                                          className="py-2.5 px-3.5 text-center align-middle whitespace-nowrap bg-muted/20 dark:bg-slate-900/30 border-x border-border/40"
                                        >
                                          {group.documentsStatus &&
                                          !group.documentsStatus.includes("Pending") &&
                                          group.documentsStatus !== "-" ? (
                                            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800">
                                              <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                              {group.documentsStatus}
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                              <Clock className="w-3 h-3 text-amber-500" />
                                              Pending LC
                                            </span>
                                          )}
                                        </td>

                                        {/* 12. Actual Price ($/KG) (Vertically Merged #6) */}
                                        <td
                                          rowSpan={rowCount}
                                          className="py-2.5 px-3.5 text-center align-middle font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap bg-muted/20 dark:bg-slate-900/30 border-x border-border/40"
                                        >
                                          {group.actualPrice > 0 ? `$${group.actualPrice.toFixed(2)}` : "—"}
                                        </td>

                                        {/* 13. PI No (Vertically Merged #7) */}
                                        <td
                                          rowSpan={rowCount}
                                          className="py-2.5 px-3.5 text-center align-middle font-mono font-medium text-foreground whitespace-nowrap bg-muted/20 dark:bg-slate-900/30 border-x border-border/40"
                                        >
                                          {group.piNo && group.piNo !== "-" ? (
                                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-teal-700 dark:text-teal-300 border border-slate-200 dark:border-slate-700">
                                              {group.piNo}
                                            </span>
                                          ) : (
                                            <span className="text-muted-foreground text-[11px]">—</span>
                                          )}
                                        </td>

                                        {/* 14. Action (Vertically Merged) */}
                                        <td
                                          rowSpan={rowCount}
                                          className="py-2.5 px-3 text-center align-middle whitespace-nowrap bg-muted/20 dark:bg-slate-900/30 border-l border-border/40"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <button
                                            onClick={() => setViewRecord(group.rawRecord)}
                                            className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-500 hover:text-teal-600 transition-colors"
                                            title="View Complete Status Details"
                                          >
                                            <Eye className="w-4 h-4" />
                                          </button>
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                );
                              })}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>

                  {/* Table Footer with Totals */}
                  {filteredGroups.length > 0 && (
                    <tfoot>
                      <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-t-2 border-slate-300 dark:border-slate-700 font-bold text-xs whitespace-nowrap">
                        <td
                          colSpan={4}
                          className="py-3.5 px-3.5 text-right uppercase tracking-wider text-slate-600 dark:text-slate-400"
                        >
                          Total ({filteredGroups.length} yarn groups, {totalTransactionRows} transactions):
                        </td>
                        <td className="py-3.5 px-3.5 text-center font-mono text-slate-900 dark:text-white font-extrabold">
                          {(Number(totals.totalQty) || 0).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3.5 text-right font-mono text-amber-600 dark:text-amber-400 font-extrabold">
                          {(Number(totals.totalUseQty) || 0).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
                          {(Number(totals.totalBalance) || 0).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3.5 text-center font-mono text-slate-600 dark:text-slate-300 font-semibold">
                          {Number(totals.avgPrice) > 0 ? `$${(Number(totals.avgPrice) || 0).toFixed(2)}` : "—"}
                        </td>
                        <td className="py-3.5 px-3.5 text-center"></td>
                        <td className="py-3.5 px-3.5 text-center font-mono text-teal-700 dark:text-teal-300 font-extrabold">
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
                    Showing {filteredGroups.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, filteredGroups.length)} of {filteredGroups.length} yarn groups ({totalTransactionRows} total transaction rows)
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
                      Buyer: <span className="font-semibold text-foreground">{viewRecord.buyer || "-"}</span> • Yarn Name:{" "}
                      <span className="font-semibold text-foreground">{viewRecord.yarnName || viewRecord.yarnItem || viewRecord.yarnCount || "-"}</span>
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
                      <span className="text-muted-foreground text-[11px]">Yarn Name:</span>
                      <div className="font-bold text-foreground font-medium mt-0.5">{viewRecord.yarnName || viewRecord.yarnItem || viewRecord.yarnCount || "100% Combed Cotton Yarn"}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[11px]">Specification:</span>
                      <div className="font-medium text-foreground mt-0.5">{viewRecord.yarnComposition || "Combed Ring Spun Auto Coned"}</div>
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

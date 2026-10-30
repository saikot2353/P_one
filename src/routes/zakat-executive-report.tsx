import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  HeartHandshake,
  Printer,
  ChevronRight,
  TrendingUp,
  PieChart,
  ShoppingBag,
  Banknote,
  Users,
  ShieldCheck,
  Search,
  ExternalLink,
  Filter,
  CheckCircle2,
  Calendar,
  Building2,
  Phone,
  MapPin,
  X,
  FileText,
  Layers,
  RotateCcw,
} from "lucide-react";
import {
  INITIAL_ZAKAT_DATA,
  ZakatRecord,
  ZakatDisbursementChannel,
  ZakatDisbursementMode,
  ZakatPurposeCategory,
  RecurringZakatSchedule,
  INITIAL_RECURRING_SCHEDULES,
  INITIAL_BUDGET_POOLS,
} from "@/routes/zakat-list";

export const Route = createFileRoute("/zakat-executive-report")({
  component: ZakatExecutiveReportPage,
});

function ZakatExecutiveReportPage() {
  const [records, setRecords] = useState<ZakatRecord[]>([]);
  const [recurringSchedules, setRecurringSchedules] = useState<RecurringZakatSchedule[]>([]);
  const [budgetPools] = useState(INITIAL_BUDGET_POOLS || [{ year: 2026, amount: 800000 }, { year: 2025, amount: 650000 }]);

  // Multi-dimensional filters (Year, Month, Date Range, Channel, Mode)
  const [filterYear, setFilterYear] = useState<string>("2026");
  const [filterMonth, setFilterMonth] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [filterChannel, setFilterChannel] = useState<string>("ALL");
  const [filterMode, setFilterMode] = useState<string>("ALL");

  // Load Zakat records from storage or initial
  useEffect(() => {
    const rawRecs = localStorage.getItem("cripton_zakat_records") || localStorage.getItem("zakat_distribution_records");
    if (rawRecs) {
      try {
        setRecords(JSON.parse(rawRecs));
      } catch {
        setRecords(INITIAL_ZAKAT_DATA || []);
      }
    } else {
      setRecords(INITIAL_ZAKAT_DATA || []);
    }

    const rawSched = localStorage.getItem("cripton_zakat_recurring_schedules") || localStorage.getItem("zakat_recurring_schedules");
    if (rawSched) {
      try {
        setRecurringSchedules(JSON.parse(rawSched));
      } catch {
        setRecurringSchedules(INITIAL_RECURRING_SCHEDULES || []);
      }
    } else {
      setRecurringSchedules(INITIAL_RECURRING_SCHEDULES || []);
    }
  }, []);

  // Filtered records based on active multi-dimensional filters
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // 1. Year filter
      if (filterYear !== "ALL") {
        const matchesYear =
          r.budgetYear?.toString() === filterYear ||
          (r.assignedDate && r.assignedDate.startsWith(filterYear));
        if (!matchesYear) return false;
      }

      // 2. Month filter (assignedDate: YYYY-MM-DD)
      if (filterMonth !== "ALL") {
        if (!r.assignedDate) return false;
        const parts = r.assignedDate.split("-");
        if (parts.length >= 2) {
          if (parts[1] !== filterMonth) return false;
        } else {
          return false;
        }
      }

      // 3. Date Range
      if (dateFrom && r.assignedDate && r.assignedDate < dateFrom) return false;
      if (dateTo && r.assignedDate && r.assignedDate > dateTo) return false;

      // 4. Channel filter
      if (filterChannel !== "ALL" && r.disbursementChannel !== filterChannel) return false;

      // 5. Aid Mode filter
      if (filterMode !== "ALL" && r.disbursementMode !== filterMode) return false;

      return true;
    });
  }, [records, filterYear, filterMonth, dateFrom, dateTo, filterChannel, filterMode]);

  // Compute multi-dimensional stats
  const stats = useMemo(() => {
    const targetRecords = filteredRecords;

    let totalAssigned = 0;
    let totalDistributed = 0;

    // Channel Segregation (3-way)
    let totalDirectEmployee = 0;
    let countDirectEmployee = 0;
    let totalViaAgent = 0;
    let countViaAgent = 0;
    let totalDirectExternal = 0;
    let countDirectExternal = 0;

    // Mode Segregation (2-way: Cash vs Asset)
    let totalCashGrants = 0;
    let countCashGrants = 0;
    let totalAssetPurchased = 0;
    let countAssetPurchased = 0;

    const channelMatrix = {
      "Direct Employee": { cash: 0, asset: 0, total: 0, count: 0 },
      "Via Employee Agent": { cash: 0, asset: 0, total: 0, count: 0 },
    };

    const purposeBreakdown: Record<
      ZakatPurposeCategory,
      { total: number; count: number; cash: number; asset: number }
    > = {
      "Mosque/Madrasa": { total: 0, count: 0, cash: 0, asset: 0 },
      "Medical Treatment": { total: 0, count: 0, cash: 0, asset: 0 },
      Vehicle: { total: 0, count: 0, cash: 0, asset: 0 },
      "Farm Animal": { total: 0, count: 0, cash: 0, asset: 0 },
      "Business Setup": { total: 0, count: 0, cash: 0, asset: 0 },
      Others: { total: 0, count: 0, cash: 0, asset: 0 },
    };

    targetRecords.forEach((r) => {
      totalAssigned += r.amount;
      if (r.agencyStatus === "Distributed" || r.agencyStatus === "Verified") {
        totalDistributed += r.amount;
      }

      // Channel Segregation (Direct Staff vs. Via Staff Agent)
      if (r.disbursementChannel === "Via Employee Agent" || (r as any).disbursementChannel === "Direct External") {
        totalViaAgent += r.amount;
        countViaAgent++;
        channelMatrix["Via Employee Agent"].total += r.amount;
        channelMatrix["Via Employee Agent"].count++;
        if (r.disbursementMode === "Asset Purchased") {
          channelMatrix["Via Employee Agent"].asset += r.amount;
        } else {
          channelMatrix["Via Employee Agent"].cash += r.amount;
        }
      } else {
        totalDirectEmployee += r.amount;
        countDirectEmployee++;
        channelMatrix["Direct Employee"].total += r.amount;
        channelMatrix["Direct Employee"].count++;
        if (r.disbursementMode === "Asset Purchased") {
          channelMatrix["Direct Employee"].asset += r.amount;
        } else {
          channelMatrix["Direct Employee"].cash += r.amount;
        }
      }

      // Mode Segregation
      if (r.disbursementMode === "Asset Purchased") {
        totalAssetPurchased += r.amount;
        countAssetPurchased++;
      } else {
        totalCashGrants += r.amount;
        countCashGrants++;
      }

      // Purpose breakdown
      const targetCat = purposeBreakdown[r.purposeCategory] ? r.purposeCategory : "Others";
      purposeBreakdown[targetCat].total += r.amount;
      purposeBreakdown[targetCat].count += 1;
      if (r.disbursementMode === "Asset Purchased") {
        purposeBreakdown[targetCat].asset += r.amount;
      } else {
        purposeBreakdown[targetCat].cash += r.amount;
      }
    });

    const activeMonthlyCommitment = recurringSchedules
      .filter((s) => s.status === "Active")
      .reduce((sum, s) => sum + s.monthlyAmount, 0);

    const currentBudget =
      filterYear !== "ALL"
        ? (budgetPools || []).find((b) => b.year === Number(filterYear))?.amount || 800000
        : (budgetPools || []).reduce((sum, b) => sum + b.amount, 0);
    const remainingBudget = currentBudget - totalAssigned;

    return {
      currentBudget,
      totalAssigned,
      totalDistributed,
      remainingBudget,
      // Channels
      totalDirectEmployee,
      countDirectEmployee,
      totalViaAgent,
      countViaAgent,
      totalDirectExternal,
      countDirectExternal,
      channelMatrix,
      // Modes
      totalCashGrants,
      countCashGrants,
      totalAssetPurchased,
      countAssetPurchased,
      purposeBreakdown,
      activeMonthlyCommitment,
      activeSchedulesCount: recurringSchedules.filter((s) => s.status === "Active").length,
      totalRecords: targetRecords.length,
    };
  }, [filteredRecords, filterYear, budgetPools, recurringSchedules]);

  // Drill-down Modal State
  const [drillDownState, setDrillDownState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    channel: ZakatDisbursementChannel | "ALL";
    mode: ZakatDisbursementMode | "ALL";
    purpose: ZakatPurposeCategory | "ALL";
  }>({
    isOpen: false,
    title: "",
    subtitle: "",
    channel: "ALL",
    mode: "ALL",
    purpose: "ALL",
  });

  const [drillDownSearch, setDrillDownSearch] = useState("");
  const [drillDownChannelFilter, setDrillDownChannelFilter] = useState<string>("ALL");
  const [drillDownModeFilter, setDrillDownModeFilter] = useState<string>("ALL");

  // Filtered drill-down items
  const drillDownRecords = useMemo(() => {
    if (!drillDownState.isOpen) return [];
    return filteredRecords.filter((r) => {
      // Base matrix constraints
      if (drillDownState.channel !== "ALL" && r.disbursementChannel !== drillDownState.channel) return false;
      if (drillDownState.mode !== "ALL" && r.disbursementMode !== drillDownState.mode) return false;
      if (drillDownState.purpose !== "ALL" && r.purposeCategory !== drillDownState.purpose) return false;

      // Secondary interactive filters
      if (drillDownChannelFilter !== "ALL" && r.disbursementChannel !== drillDownChannelFilter) return false;
      if (drillDownModeFilter !== "ALL" && r.disbursementMode !== drillDownModeFilter) return false;

      if (drillDownSearch.trim()) {
        const q = drillDownSearch.toLowerCase().trim();
        const str = `${r.employeeName || ""} ${r.employeeId || ""} ${r.beneficiaryName || ""} ${r.institutionName || ""} ${r.assetDetails?.assetName || ""} ${r.purposeCategory || ""}`.toLowerCase();
        return str.includes(q);
      }
      return true;
    });
  }, [
    filteredRecords,
    drillDownState,
    drillDownChannelFilter,
    drillDownModeFilter,
    drillDownSearch,
  ]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar />

        <main className="p-4 sm:p-5 lg:p-6 w-full space-y-5">
          {/* Top Breadcrumb & Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5 font-medium">
                <Link to="/" className="hover:text-primary transition">Home</Link>
                <span>/</span>
                <span>Welfare & Support</span>
                <span>/</span>
                <Link to="/zakat-list" className="hover:text-primary transition">Zakat Management</Link>
                <span>/</span>
                <span className="text-foreground font-semibold">Zakat Executive Report</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-blue-600/10 text-blue-600 rounded-xl border border-blue-600/20">
                  <PieChart className="size-5" />
                </div>
                <span>Zakat Governance & Executive Audit Report</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-normal">
                Cross-tabulated audit statement by Beneficiary Channel (Staff vs. Agent vs. Outside) and Aid Medium (Cash vs. Asset Purchases).
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap print:hidden">
              <Link
                to="/zakat-list"
                className="h-8.5 px-3.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-medium flex items-center gap-1.5 transition shadow-2xs"
              >
                <HeartHandshake className="size-4 text-emerald-600" />
                <span>Zakat Cases List</span>
              </Link>

              <button
                type="button"
                onClick={handlePrint}
                className="h-8.5 px-3.5 bg-primary hover:opacity-95 text-primary-foreground text-xs font-medium rounded-lg transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Printer className="size-3.5" />
                <span>Print Executive Statement</span>
              </button>
            </div>
          </div>

          {/* Enhanced Multi-Dimensional Filter Bar */}
          <div className="bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3 print:hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/60">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide">
                <Filter className="size-3.5 text-primary" />
                <span>Executive Report Filters</span>
                {(filterYear !== "2026" || filterMonth !== "ALL" || dateFrom || dateTo || filterChannel !== "ALL" || filterMode !== "ALL") && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Filters Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilterYear("2026");
                    setFilterMonth("ALL");
                    setDateFrom("");
                    setDateTo("");
                    setFilterChannel("ALL");
                    setFilterMode("ALL");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1 cursor-pointer transition"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset All</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* 1. Year */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Year
                </label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:border-primary cursor-pointer shadow-2xs"
                >
                  <option value="ALL">All Years</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              {/* 2. Month */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Month
                </label>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:border-primary cursor-pointer shadow-2xs"
                >
                  <option value="ALL">All Months</option>
                  <option value="01">01 - January</option>
                  <option value="02">02 - February</option>
                  <option value="03">03 - March</option>
                  <option value="04">04 - April</option>
                  <option value="05">05 - May</option>
                  <option value="06">06 - June</option>
                  <option value="07">07 - July</option>
                  <option value="08">08 - August</option>
                  <option value="09">09 - September</option>
                  <option value="10">10 - October</option>
                  <option value="11">11 - November</option>
                  <option value="12">12 - December</option>
                </select>
              </div>

              {/* 3. Date From */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer shadow-2xs"
                />
              </div>

              {/* 4. Date To */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Date To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer shadow-2xs"
                />
              </div>

              {/* 5. Channel */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Channel
                </label>
                <select
                  value={filterChannel}
                  onChange={(e) => setFilterChannel(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:border-primary cursor-pointer shadow-2xs"
                >
                  <option value="ALL">All Channels</option>
                  <option value="Direct Employee">Direct Employee</option>
                  <option value="Via Employee Agent">Via Staff Agent</option>
                </select>
              </div>

              {/* 6. Aid Mode */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase block">
                  Aid Mode
                </label>
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:border-primary cursor-pointer shadow-2xs"
                >
                  <option value="ALL">All Modes</option>
                  <option value="Cash Grant">Direct Cash Grant</option>
                  <option value="Asset Purchased">In-Kind Asset Purchased</option>
                </select>
              </div>
            </div>

            {/* Compact Executive Key Metrics Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-border/50 text-xs">
              <div className="flex flex-wrap items-center gap-3 font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500"></span>
                  <span>Filtered Cases: <strong className="text-foreground font-bold">{stats.totalRecords}</strong></span>
                </div>
                <span className="text-border">|</span>
                <div>
                  Cash Grants: <strong className="text-foreground font-bold">৳{stats.totalCashGrants.toLocaleString()}</strong> ({stats.countCashGrants})
                </div>
                <span className="text-border">|</span>
                <div>
                  Asset Purchases: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">৳{stats.totalAssetPurchased.toLocaleString()}</strong> ({stats.countAssetPurchased})
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-lg border border-border/70">
                  <span className="text-muted-foreground text-[11px] uppercase font-bold">Total Disbursed:</span>
                  <span className="text-foreground font-mono text-sm font-black">
                    ৳{stats.totalAssigned.toLocaleString()}
                  </span>
                </div>
                {filterYear !== "ALL" && (
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                    <span className="text-[11px] uppercase font-bold">Remaining Pool:</span>
                    <span className="font-mono text-sm font-black">
                      ৳{stats.remainingBudget.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* REPORT 1: CHANNEL SEGREGATION MATRIX */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Report 1: Beneficiary Channel Segregation (Direct Staff vs. Staff Agent)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Segregates funds distributed directly to staff or channeled through staff proxies for village handovers.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider self-start sm:self-auto">
                Direct Staff vs. Staff Agent
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-3">Disbursement Channel</th>
                    <th className="px-4 py-3 text-right">Cash Grants (৳)</th>
                    <th className="px-4 py-3 text-right">Asset Purchased (৳)</th>
                    <th className="px-4 py-3 text-right font-bold text-foreground">Total Disbursed (৳)</th>
                    <th className="px-4 py-3 text-center">Cases</th>
                    <th className="px-4 py-3 text-right">Share of Zakat (%)</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-card font-normal">
                  {[
                    {
                      channel: "Direct Employee" as ZakatDisbursementChannel,
                      label: "Direct Employee (Company Staff)",
                      desc: "Disbursed directly to eligible company staff in need",
                    },
                    {
                      channel: "Via Employee Agent" as ZakatDisbursementChannel,
                      label: "Via Staff Agent (Village Handover)",
                      desc: "Handed to employee to distribute to verified village poor",
                    },
                  ].map(({ channel, label, desc }) => {
                    const data = stats.channelMatrix[channel];
                    const share = stats.totalAssigned > 0 ? ((data.total / stats.totalAssigned) * 100).toFixed(1) : "0.0";
                    return (
                      <tr key={channel} className="hover:bg-muted/30 transition">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-foreground text-xs">{label}</div>
                          <div className="text-[10px] text-muted-foreground">{desc}</div>
                        </td>
                        <td
                          onClick={() => {
                            setDrillDownState({
                              isOpen: true,
                              title: `${label} — Cash Grants`,
                              subtitle: `Itemized cash payments issued under ${label}`,
                              channel,
                              mode: "Cash Grant",
                              purpose: "ALL",
                            });
                            setDrillDownModeFilter("Cash Grant");
                            setDrillDownChannelFilter(channel);
                            setDrillDownSearch("");
                          }}
                          className="px-4 py-3 text-right font-medium text-foreground cursor-pointer hover:bg-muted/50 hover:underline"
                        >
                          ৳{data.cash.toLocaleString()}
                        </td>
                        <td
                          onClick={() => {
                            setDrillDownState({
                              isOpen: true,
                              title: `${label} — Asset Purchases`,
                              subtitle: `Physical assets purchased and handed over under ${label}`,
                              channel,
                              mode: "Asset Purchased",
                              purpose: "ALL",
                            });
                            setDrillDownModeFilter("Asset Purchased");
                            setDrillDownChannelFilter(channel);
                            setDrillDownSearch("");
                          }}
                          className="px-4 py-3 text-right font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer hover:bg-muted/50 hover:underline"
                        >
                          ৳{data.asset.toLocaleString()}
                        </td>
                        <td
                          onClick={() => {
                            setDrillDownState({
                              isOpen: true,
                              title: `${label} — All Disbursements`,
                              subtitle: `Complete audit trail for channel ${label}`,
                              channel,
                              mode: "ALL",
                              purpose: "ALL",
                            });
                            setDrillDownModeFilter("ALL");
                            setDrillDownChannelFilter(channel);
                            setDrillDownSearch("");
                          }}
                          className="px-4 py-3 text-right font-bold text-foreground cursor-pointer hover:bg-muted/50 hover:underline"
                        >
                          ৳{data.total.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-muted-foreground">
                          {data.count}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground font-medium">
                          {share}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setDrillDownState({
                                isOpen: true,
                                title: `${label} — Channel Audit`,
                                subtitle: `Complete audit trail of all allocations and cases for ${label}`,
                                channel,
                                mode: "ALL",
                                purpose: "ALL",
                              });
                              setDrillDownModeFilter("ALL");
                              setDrillDownChannelFilter(channel);
                              setDrillDownSearch("");
                            }}
                            className="px-2.5 py-1 rounded border border-border hover:bg-muted text-foreground text-xs font-medium cursor-pointer transition shadow-2xs"
                          >
                            Inspect ({data.count})
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-muted/40 font-bold border-t-2 border-border text-foreground">
                    <td className="px-4 py-3 uppercase tracking-wider text-[11px]">Total All Channels</td>
                    <td className="px-4 py-3 text-right">৳{stats.totalCashGrants.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-indigo-600 dark:text-indigo-400">
                      ৳{stats.totalAssetPurchased.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">৳{stats.totalAssigned.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">{stats.totalRecords}</td>
                    <td className="px-4 py-3 text-right">100.0%</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setDrillDownState({
                            isOpen: true,
                            title: "All Zakat Cases — Complete Audit",
                            subtitle: "Complete audit portfolio of all channels and modes",
                            channel: "ALL",
                            mode: "ALL",
                            purpose: "ALL",
                          });
                          setDrillDownModeFilter("ALL");
                          setDrillDownChannelFilter("ALL");
                          setDrillDownSearch("");
                        }}
                        className="px-3 py-1 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        View All
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* REPORT 2: PURPOSE & ASSET PURCHASE MATRIX */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Report 2: Purpose & Asset Purchase Matrix (Cash Grants vs. Physical Assets Purchased)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cross-tabulates funds by objective (Medical, Mosque/Madrasa, Vehicle, Cow/Goat, Tea stall/Store) and aid medium (Direct Cash vs. Physical Asset Purchased).
                </p>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider self-start sm:self-auto">
                Cash vs. Physical Assets
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-3">Purpose Category</th>
                    <th className="px-4 py-3 text-right">Subtotal Cash (৳)</th>
                    <th className="px-4 py-3 text-right">Subtotal Asset (৳)</th>
                    <th className="px-4 py-3 text-right font-bold text-foreground">Total Disbursement (৳)</th>
                    <th className="px-4 py-3 text-right">Share of Zakat (%)</th>
                    <th className="px-4 py-3 text-center">Cases</th>
                    <th className="px-4 py-3">Typical Handover Type</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 bg-card font-normal">
                  {[
                    {
                      cat: "Mosque/Madrasa" as ZakatPurposeCategory,
                      label: "Mosque / Madrasa Construction & Iftar",
                      typical: "Cash / Bank Pay Order to Committee",
                    },
                    {
                      cat: "Medical Treatment" as ZakatPurposeCategory,
                      label: "Medical Treatment & Surgical Equipment",
                      typical: "Hospital Bill Settlement / Wheelchair / Meds",
                    },
                    {
                      cat: "Vehicle" as ZakatPurposeCategory,
                      label: "Vehicle (Electric Auto-Van, Rickshaw, Cargo Van)",
                      typical: "Physical Asset Purchase with Local Handover",
                    },
                    {
                      cat: "Farm Animal" as ZakatPurposeCategory,
                      label: "Farm Animal (Dairy Cow, Goat, Poultry Kit)",
                      typical: "Hat Cattle Purchase for Village Handover",
                    },
                    {
                      cat: "Business Setup" as ZakatPurposeCategory,
                      label: "Business Setup (Tea Stall, Grocery, Sewing Machine)",
                      typical: "Commercial Equipment & Micro-Retail Stock",
                    },
                    {
                      cat: "Others" as ZakatPurposeCategory,
                      label: "Others (Debt Relief, Education, Emergency)",
                      typical: "Cash Assistance / Emergency Aid",
                    },
                  ].map(({ cat, label, typical }) => {
                    const row = stats.purposeBreakdown[cat];
                    const share = stats.totalAssigned > 0 ? ((row.total / stats.totalAssigned) * 100).toFixed(1) : "0.0";
                    return (
                      <tr key={cat} className="hover:bg-muted/30 transition">
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {label}
                        </td>
                        <td
                          onClick={() => {
                            setDrillDownState({
                              isOpen: true,
                              title: `${label} — Cash Grants`,
                              subtitle: `Cash assistance given for ${label}`,
                              purpose: cat,
                              mode: "Cash Grant",
                              channel: "ALL",
                            });
                            setDrillDownModeFilter("Cash Grant");
                            setDrillDownChannelFilter("ALL");
                            setDrillDownSearch("");
                          }}
                          className="px-4 py-3 text-right text-foreground font-medium cursor-pointer hover:bg-muted/50 hover:underline"
                        >
                          ৳{row.cash.toLocaleString()}
                        </td>
                        <td
                          onClick={() => {
                            setDrillDownState({
                              isOpen: true,
                              title: `${label} — Physical Assets`,
                              subtitle: `Physical assets purchased for ${label}`,
                              purpose: cat,
                              mode: "Asset Purchased",
                              channel: "ALL",
                            });
                            setDrillDownModeFilter("Asset Purchased");
                            setDrillDownChannelFilter("ALL");
                            setDrillDownSearch("");
                          }}
                          className="px-4 py-3 text-right text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:bg-muted/50 hover:underline"
                        >
                          ৳{row.asset.toLocaleString()}
                        </td>
                        <td
                          onClick={() => {
                            setDrillDownState({
                              isOpen: true,
                              title: `${label} — All Disbursements`,
                              subtitle: `All Zakat disbursements for ${label}`,
                              purpose: cat,
                              mode: "ALL",
                              channel: "ALL",
                            });
                            setDrillDownModeFilter("ALL");
                            setDrillDownChannelFilter("ALL");
                            setDrillDownSearch("");
                          }}
                          className="px-4 py-3 text-right font-bold text-foreground cursor-pointer hover:bg-muted/50 hover:underline"
                        >
                          ৳{row.total.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground font-medium">{share}%</td>
                        <td className="px-4 py-3 text-center text-muted-foreground font-medium">{row.count}</td>
                        <td className="px-4 py-3 text-muted-foreground text-[11px]">{typical}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setDrillDownState({
                                isOpen: true,
                                title: `${label} — Purpose Audit`,
                                subtitle: `All cases filed under purpose ${label}`,
                                purpose: cat,
                                mode: "ALL",
                                channel: "ALL",
                              });
                              setDrillDownModeFilter("ALL");
                              setDrillDownChannelFilter("ALL");
                              setDrillDownSearch("");
                            }}
                            className="px-2.5 py-1 rounded border border-border hover:bg-muted text-foreground text-xs font-medium cursor-pointer transition shadow-2xs"
                          >
                            Inspect ({row.count})
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-muted/40 font-bold border-t-2 border-border text-foreground">
                    <td className="px-4 py-3 uppercase tracking-wider text-[11px]">Total Portfolio</td>
                    <td className="px-4 py-3 text-right">৳{stats.totalCashGrants.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-indigo-600 dark:text-indigo-400">
                      ৳{stats.totalAssetPurchased.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">৳{stats.totalAssigned.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">100.0%</td>
                    <td className="px-4 py-3 text-center">{stats.totalRecords}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">All portfolio grants and physical assets</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setDrillDownState({
                            isOpen: true,
                            title: "All Zakat Cases — Complete Audit",
                            subtitle: "Complete audit portfolio of all channels and modes",
                            channel: "ALL",
                            mode: "ALL",
                            purpose: "ALL",
                          });
                          setDrillDownModeFilter("ALL");
                          setDrillDownChannelFilter("ALL");
                          setDrillDownSearch("");
                        }}
                        className="px-3 py-1 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        View All
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* ─── DRILL-DOWN AUDIT TRAIL MODAL ──────────────────────────────────── */}
        {drillDownState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200/90 bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-blue-50 border border-blue-200/70 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {drillDownState.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-100/80 text-blue-700 border border-blue-200">
                        Audit Trail
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{drillDownState.subtitle}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDrillDownState({ ...drillDownState, isOpen: false })}
                  className="size-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                  title="Close modal"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              {/* Filters toolbar inside modal */}
              <div className="px-6 py-3 border-b border-slate-200/80 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={drillDownSearch}
                      onChange={(e) => setDrillDownSearch(e.target.value)}
                      placeholder="Search recipient, ID, agent..."
                      className="h-8.5 pl-8 pr-3 w-52 sm:w-60 rounded-lg border border-slate-300/90 bg-white text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all"
                    />
                  </div>
                  <select
                    value={drillDownChannelFilter}
                    onChange={(e) => setDrillDownChannelFilter(e.target.value)}
                    className="h-8.5 px-3 rounded-lg border border-slate-300/90 bg-white text-xs font-medium text-slate-700 outline-none focus:border-blue-600 shadow-2xs cursor-pointer"
                  >
                    <option value="ALL">All Channels</option>
                    <option value="Direct Employee">Direct Employee</option>
                    <option value="Via Employee Agent">Via Staff Agent</option>
                  </select>
                  <select
                    value={drillDownModeFilter}
                    onChange={(e) => setDrillDownModeFilter(e.target.value)}
                    className="h-8.5 px-3 rounded-lg border border-slate-300/90 bg-white text-xs font-medium text-slate-700 outline-none focus:border-blue-600 shadow-2xs cursor-pointer"
                  >
                    <option value="ALL">All Modes</option>
                    <option value="Cash Grant">Cash Grant</option>
                    <option value="Asset Purchased">Asset Purchased</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/90 font-medium">
                    Found: <strong className="text-slate-900 font-bold">{drillDownRecords.length}</strong> cases
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold shadow-2xs">
                    Total: ৳{drillDownRecords.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-auto flex-1 bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50/95 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 w-[155px] min-w-[155px] shrink-0 whitespace-nowrap">Case ID</th>
                      <th className="px-4 py-3 min-w-[180px]">Beneficiary / Recipient</th>
                      <th className="px-4 py-3 w-[160px] min-w-[160px] shrink-0 whitespace-nowrap">Channel & Agent</th>
                      <th className="px-4 py-3 min-w-[200px]">Mode & Asset</th>
                      <th className="px-4 py-3 w-[140px] shrink-0 whitespace-nowrap">Purpose</th>
                      <th className="px-4 py-3 w-[120px] shrink-0 text-right whitespace-nowrap">Amount (৳)</th>
                      <th className="px-4 py-3 w-[110px] shrink-0 text-center whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {drillDownRecords.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-14 text-center text-slate-400 text-xs font-medium">
                          No matching disbursement cases found for this matrix cross-section.
                        </td>
                      </tr>
                    ) : (
                      drillDownRecords.map((r, rIdx) => (
                        <tr key={`${r.id}-${rIdx}`} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3.5 font-mono font-bold text-blue-600 whitespace-nowrap align-middle">
                            {r.id}
                          </td>
                          <td className="px-4 py-3.5 align-middle">
                            <div className="font-bold text-slate-800 text-xs leading-snug">
                              {r.beneficiaryName || r.employeeName || r.institutionName}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {r.beneficiaryPhone || r.employeeId || r.institutionType}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 align-middle">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 text-[11px] font-semibold whitespace-nowrap">
                              {r.disbursementChannel}
                            </span>
                            {r.disbursementChannel === "Via Employee Agent" && r.employeeName && (
                              <div className="text-[11px] text-slate-500 font-medium mt-1 leading-tight">
                                Agent: <span className="text-slate-800 font-semibold">{r.employeeName}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5 align-middle">
                            {r.disbursementMode === "Asset Purchased" ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/80 text-[11px] font-semibold whitespace-nowrap">
                                  Asset Purchased
                                </span>
                                <div className="text-[11px] text-slate-700 font-medium leading-relaxed">
                                  {r.assetDetails?.assetName || r.assetDetails?.assetType}
                                  {r.assetDetails?.assetQuantity && (
                                    <span className="text-slate-500 font-normal ml-1">({r.assetDetails.assetQuantity})</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold whitespace-nowrap">
                                Cash Grant
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-slate-700 font-medium align-middle whitespace-nowrap text-xs">
                            {r.purposeCategory}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 align-middle whitespace-nowrap text-xs">
                            ৳{r.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5 text-center align-middle whitespace-nowrap">
                            <span
                              className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                r.agencyStatus === "Verified" || r.agencyStatus === "Distributed"
                                  ? "bg-emerald-100/90 text-emerald-800 border border-emerald-200"
                                  : "bg-amber-100/90 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {r.agencyStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 border-t border-slate-200/90 bg-slate-50/70 flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-500 font-medium">
                  Showing <strong className="text-slate-700 font-bold">{drillDownRecords.length}</strong> records in this drill-down audit trail
                </span>
                <button
                  type="button"
                  onClick={() => setDrillDownState({ ...drillDownState, isOpen: false })}
                  className="h-8.5 px-5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

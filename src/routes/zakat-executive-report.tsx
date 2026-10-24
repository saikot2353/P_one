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
  const [selectedBudgetYear, setSelectedBudgetYear] = useState<number>(2026);
  const [budgetPools] = useState(INITIAL_BUDGET_POOLS);

  // Load Zakat records from storage or initial
  useEffect(() => {
    const rawRecs = localStorage.getItem("zakat_distribution_records");
    if (rawRecs) {
      try {
        setRecords(JSON.parse(rawRecs));
      } catch {
        setRecords(INITIAL_ZAKAT_DATA);
      }
    } else {
      setRecords(INITIAL_ZAKAT_DATA);
    }

    const rawSched = localStorage.getItem("zakat_recurring_schedules");
    if (rawSched) {
      try {
        setRecurringSchedules(JSON.parse(rawSched));
      } catch {
        setRecurringSchedules(INITIAL_RECURRING_SCHEDULES);
      }
    } else {
      setRecurringSchedules(INITIAL_RECURRING_SCHEDULES);
    }
  }, []);

  // Compute multi-dimensional stats
  const stats = useMemo(() => {
    const yearRecords = records.filter(
      (r) => r.budgetYear === selectedBudgetYear || r.assignedDate.startsWith(selectedBudgetYear.toString())
    );

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
      "Direct External": { cash: 0, asset: 0, total: 0, count: 0 },
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

    yearRecords.forEach((r) => {
      totalAssigned += r.amount;
      if (r.agencyStatus === "Distributed" || r.agencyStatus === "Verified") {
        totalDistributed += r.amount;
      }

      // Channel Segregation
      if (r.disbursementChannel === "Direct Employee") {
        totalDirectEmployee += r.amount;
        countDirectEmployee++;
        channelMatrix["Direct Employee"].total += r.amount;
        channelMatrix["Direct Employee"].count++;
        if (r.disbursementMode === "Asset Purchased") {
          channelMatrix["Direct Employee"].asset += r.amount;
        } else {
          channelMatrix["Direct Employee"].cash += r.amount;
        }
      } else if (r.disbursementChannel === "Via Employee Agent") {
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
        totalDirectExternal += r.amount;
        countDirectExternal++;
        channelMatrix["Direct External"].total += r.amount;
        channelMatrix["Direct External"].count++;
        if (r.disbursementMode === "Asset Purchased") {
          channelMatrix["Direct External"].asset += r.amount;
        } else {
          channelMatrix["Direct External"].cash += r.amount;
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

    const currentBudget = budgetPools.find((b) => b.year === selectedBudgetYear)?.amount || 800000;
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
      totalRecords: yearRecords.length,
    };
  }, [records, selectedBudgetYear, budgetPools, recurringSchedules]);

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
    return records.filter((r) => {
      const matchYear =
        r.budgetYear === selectedBudgetYear || r.assignedDate.startsWith(selectedBudgetYear.toString());
      if (!matchYear) return false;

      // Base matrix constraints
      if (drillDownState.channel !== "ALL" && r.disbursementChannel !== drillDownState.channel) return false;
      if (drillDownState.mode !== "ALL" && r.disbursementMode !== drillDownState.mode) return false;
      if (drillDownState.purpose !== "ALL" && r.purposeCategory !== drillDownState.purpose) return false;

      // Secondary interactive filters
      if (drillDownChannelFilter !== "ALL" && r.disbursementChannel !== drillDownChannelFilter) return false;
      if (drillDownModeFilter !== "ALL" && r.disbursementMode !== drillDownModeFilter) return false;

      if (drillDownSearch.trim()) {
        const q = drillDownSearch.toLowerCase().trim();
        const str = `${r.recipientEmpName} ${r.recipientEmpId} ${r.beneficiaryName} ${r.institutionName} ${r.assetName} ${r.purposeCategory} ${r.agentEmployeeName}`.toLowerCase();
        return str.includes(q);
      }
      return true;
    });
  }, [
    records,
    drillDownState,
    selectedBudgetYear,
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
                <span className="text-foreground font-semibold">Executive Multi-Dimensional Report</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2.5">
                <div className="p-2 bg-blue-600/10 text-blue-600 rounded-xl border border-blue-600/20">
                  <PieChart className="size-5" />
                </div>
                <span>Executive Multi-Dimensional Zakat Governance Report</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-normal">
                Audited cross-tabulation of funds disbursed by Beneficiary Channel (Direct Staff vs. Agent vs. Outside) and Aid Mode (Cash vs. Asset Purchases).
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap print:hidden">
              <div className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs">
                <Calendar className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground text-[11px] uppercase">Pool Year:</span>
                <select
                  value={selectedBudgetYear}
                  onChange={(e) => setSelectedBudgetYear(Number(e.target.value))}
                  className="bg-transparent font-bold text-foreground outline-none cursor-pointer"
                >
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>

              <Link
                to="/zakat-list"
                className="h-8.5 px-3.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-medium flex items-center gap-1.5 transition"
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

          {/* 6 Executive Summary Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Total Budget */}
            <div className="bg-card rounded-xl border border-border p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                {selectedBudgetYear} Budget Pool
              </span>
              <div className="text-lg font-bold text-foreground mt-1">
                ৳{stats.currentBudget.toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Corporate Allocation</div>
            </div>

            {/* Direct Employee Channel */}
            <div className="bg-card rounded-xl border border-border p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">
                1. Direct Employee
              </span>
              <div className="text-lg font-bold text-purple-700 dark:text-purple-400 mt-1">
                ৳{stats.totalDirectEmployee.toLocaleString()}
              </div>
              <div className="text-[11px] text-purple-600 dark:text-purple-300 mt-0.5 font-medium">
                {stats.countDirectEmployee} Staff Beneficiaries
              </div>
            </div>

            {/* Via Agent Channel */}
            <div className="bg-card rounded-xl border border-border p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">
                2. Via Staff Agent
              </span>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-400 mt-1">
                ৳{stats.totalViaAgent.toLocaleString()}
              </div>
              <div className="text-[11px] text-blue-600 dark:text-blue-300 mt-0.5 font-medium">
                {stats.countViaAgent} Distributed in Villages
              </div>
            </div>

            {/* Direct External */}
            <div className="bg-card rounded-xl border border-border p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                3. Direct External
              </span>
              <div className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-1">
                ৳{stats.totalDirectExternal.toLocaleString()}
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-300 mt-0.5 font-medium">
                {stats.countDirectExternal} Madrasa / Public
              </div>
            </div>

            {/* Asset vs Cash Split */}
            <div className="bg-card rounded-xl border border-border p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">
                Asset vs. Cash Split
              </span>
              <div className="text-xs font-bold text-foreground mt-1">
                Asset: ৳{stats.totalAssetPurchased.toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Cash: ৳{stats.totalCashGrants.toLocaleString()}
              </div>
            </div>

            {/* Remaining Balance */}
            <div className="bg-card rounded-xl border border-border p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                Remaining Balance
              </span>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                ৳{stats.remainingBudget.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                {stats.currentBudget > 0
                  ? `${((stats.totalAssigned / stats.currentBudget) * 100).toFixed(1)}% disbursed`
                  : "0%"}
              </div>
            </div>
          </div>

          {/* REPORT 1: CHANNEL SEGREGATION MATRIX */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Report 1: Beneficiary Channel Segregation (Staff vs. Agent vs. Outside)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Segregates funds distributed directly to staff, channeled through staff proxies for village handovers, or paid to external parties.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider self-start sm:self-auto">
                Staff vs. Staff Agent vs. Outside
              </span>
            </div>

            {/* Notice Bar */}
            <div className="p-3 bg-muted/30 rounded-lg border border-border/60 flex items-center justify-between text-xs text-foreground">
              <div>
                <strong className="text-primary">Clickable Audit Trail:</strong> Click any channel row or disbursement figure to view the itemized list of beneficiaries, locations, agent handover chains, and receipts.
              </div>
              <span className="hidden md:inline-block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-card border border-border px-2 py-0.5 rounded">
                Clickable Drill-Down
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
                    {
                      channel: "Direct External" as ZakatDisbursementChannel,
                      label: "Direct External (Outside Person / Madrasa)",
                      desc: "Given directly to outside needy people, mosques, or madrasas",
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-card w-full max-w-5xl xl:max-w-6xl max-h-[92vh] rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600/10 text-blue-600 rounded-xl border border-blue-600/20">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{drillDownState.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{drillDownState.subtitle}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDrillDownState({ ...drillDownState, isOpen: false })}
                  className="size-8 rounded-lg text-muted-foreground hover:bg-muted flex items-center justify-center cursor-pointer"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              {/* Filters toolbar inside modal */}
              <div className="p-3.5 border-b border-border bg-muted/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={drillDownSearch}
                      onChange={(e) => setDrillDownSearch(e.target.value)}
                      placeholder="Search recipient, ID, vendor..."
                      className="h-8 pl-8 pr-3 w-48 sm:w-60 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <select
                    value={drillDownChannelFilter}
                    onChange={(e) => setDrillDownChannelFilter(e.target.value)}
                    className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
                  >
                    <option value="ALL">All Channels</option>
                    <option value="Direct Employee">Direct Employee</option>
                    <option value="Via Employee Agent">Via Staff Agent</option>
                    <option value="Direct External">Direct External</option>
                  </select>
                  <select
                    value={drillDownModeFilter}
                    onChange={(e) => setDrillDownModeFilter(e.target.value)}
                    className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
                  >
                    <option value="ALL">All Modes</option>
                    <option value="Cash Grant">Cash Grant</option>
                    <option value="Asset Purchased">Asset Purchased</option>
                  </select>
                </div>

                <div className="text-xs font-semibold text-foreground">
                  Found: <span className="text-primary">{drillDownRecords.length}</span> cases | Total:{" "}
                  <span className="text-emerald-600 font-bold">
                    ৳{drillDownRecords.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase border-b border-border sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Case ID</th>
                      <th className="px-4 py-3">Beneficiary / Recipient</th>
                      <th className="px-4 py-3">Channel & Agent</th>
                      <th className="px-4 py-3">Mode & Asset</th>
                      <th className="px-4 py-3">Purpose</th>
                      <th className="px-4 py-3 text-right">Amount (৳)</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 bg-card font-normal">
                    {drillDownRecords.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-xs">
                          No matching disbursement cases found for this matrix cross-section.
                        </td>
                      </tr>
                    ) : (
                      drillDownRecords.map((r) => (
                        <tr key={r.id} className="hover:bg-muted/20">
                          <td className="px-4 py-3 font-mono font-medium text-primary">
                            {r.id}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-foreground text-xs">
                              {r.beneficiaryName || r.recipientEmpName || r.institutionName}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {r.beneficiaryPhone || r.recipientEmpId || r.institutionType}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-md bg-muted text-foreground border border-border text-[11px]">
                              {r.disbursementChannel}
                            </span>
                            {r.agentEmployeeName && (
                              <div className="text-[10px] text-muted-foreground mt-0.5">
                                Agent: {r.agentEmployeeName}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {r.disbursementMode === "Asset Purchased" ? (
                              <div>
                                <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-[11px] font-medium">
                                  Asset Purchased
                                </span>
                                <div className="text-[10px] text-foreground font-medium mt-0.5">
                                  {r.assetName} {r.assetQty && `(${r.assetQty})`}
                                </div>
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px] font-medium">
                                Cash Grant
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {r.purposeCategory}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-foreground">
                            ৳{r.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                r.agencyStatus === "Verified" || r.agencyStatus === "Distributed"
                                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                                  : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
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
              <div className="p-3.5 border-t border-border bg-muted/20 flex items-center justify-between shrink-0">
                <span className="text-xs text-muted-foreground">
                  Showing {drillDownRecords.length} records in this drill-down audit trail
                </span>
                <button
                  type="button"
                  onClick={() => setDrillDownState({ ...drillDownState, isOpen: false })}
                  className="h-8 px-4 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-medium cursor-pointer"
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

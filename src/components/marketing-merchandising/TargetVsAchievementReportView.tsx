import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  Calendar,
  Filter,
  Search,
  RotateCcw,
  Download,
  Info,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Layers,
  ChevronDown,
  ChevronRight,
  Eye,
  Edit,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  X,
  Save,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  MarketingPerformanceRepository,
  MarketingTargetPlan,
  BuyerTargetRecord,
  CalculationBasis,
  MONTH_KEYS,
  KNOWN_HODS,
  computeMonthlyMetrics,
  computeYearlySummary,
} from "../../lib/marketing-performance-data";

export function TargetVsAchievementReportView() {
  const [selectedYear, setSelectedYear] = useState<number>(2027);
  const [plan, setPlan] = useState<MarketingTargetPlan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHodFilter, setSelectedHodFilter] = useState("ALL");
  const [selectedBuyerFilter, setSelectedBuyerFilter] = useState("ALL");
  const [selectedMonthFocus, setSelectedMonthFocus] = useState<string>("ALL");
  // Default per specification: Base Target FOB
  const [calculationBasis, setCalculationBasis] = useState<CalculationBasis>("base");
  const [activeTab, setActiveTab] = useState<"matrix" | "hodSummary">("matrix");

  // Edit Actuals Dialog State
  const [editingActuals, setEditingActuals] = useState<{
    buyerId: string;
    buyerName: string;
    monthKey: string;
    monthLabel: string;
    qty: string;
    fob: string;
  } | null>(null);

  // Load plan
  const loadPlan = () => {
    const loaded = MarketingPerformanceRepository.getTargetPlan(selectedYear);
    setPlan(loaded);
  };

  useEffect(() => {
    loadPlan();
  }, [selectedYear]);

  // Master lists
  const availableYears = MarketingPerformanceRepository.getAvailableYears();
  const availableHODs = MarketingPerformanceRepository.getAvailableHODs();
  const availableBuyers = useMemo(() => {
    if (!plan) return [];
    return Array.from(new Set(plan.buyers.map((b) => b.buyer).filter(Boolean)));
  }, [plan]);

  // Filtered buyers
  const filteredBuyers = useMemo(() => {
    if (!plan) return [];
    return plan.buyers.filter((b) => {
      if (selectedHodFilter !== "ALL" && b.hod !== selectedHodFilter) return false;
      if (selectedBuyerFilter !== "ALL" && b.buyer !== selectedBuyerFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          b.buyer.toLowerCase().includes(q) || b.hod.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [plan, selectedHodFilter, selectedBuyerFilter, searchTerm]);

  // Months to display based on focus filter
  const displayedMonths = useMemo(() => {
    if (selectedMonthFocus === "ALL") return MONTH_KEYS;
    return MONTH_KEYS.filter((m) => m.key === selectedMonthFocus);
  }, [selectedMonthFocus]);

  // Handle Save Actual Achievement
  const handleSaveActuals = () => {
    if (!editingActuals || !plan) return;
    const qtyVal = editingActuals.qty.trim() === "" ? null : Number(editingActuals.qty);
    const fobVal = editingActuals.fob.trim() === "" ? null : Number(editingActuals.fob);

    const updated = MarketingPerformanceRepository.updateMonthlyAchievement(
      plan.year,
      editingActuals.buyerId,
      editingActuals.monthKey,
      isNaN(qtyVal as any) ? null : qtyVal,
      isNaN(fobVal as any) ? null : fobVal
    );
    setPlan(updated);
    setEditingActuals(null);
  };

  // Helper formatting
  const formatQty = (val: number | null | undefined) => {
    if (val === null || val === undefined) return "—";
    return val.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const formatFob = (val: number | null | undefined) => {
    if (val === null || val === undefined) return "—";
    return `$${val.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const formatVariance = (val: number | null | undefined, isFob: boolean = false) => {
    if (val === null || val === undefined) return <span className="text-slate-400">—</span>;
    if (val > 0) {
      return (
        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
          +{isFob ? `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : val.toLocaleString()}
        </span>
      );
    }
    if (val < 0) {
      const abs = Math.abs(val);
      return (
        <span className="text-rose-700 dark:text-rose-400 font-medium">
          -{isFob ? `$${abs.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : abs.toLocaleString()}
        </span>
      );
    }
    return <span className="text-slate-500 font-medium">0</span>;
  };

  const formatPercent = (val: number | null | undefined) => {
    if (val === null || val === undefined || isNaN(val)) return "—";
    const color =
      val >= 100
        ? "text-emerald-700 dark:text-emerald-400 font-bold"
        : val >= 80
        ? "text-teal-700 dark:text-teal-400 font-semibold"
        : val > 0
        ? "text-amber-700 dark:text-amber-400 font-semibold"
        : "text-slate-400";
    return <span className={color}>{val.toFixed(1)}%</span>;
  };

  // Aggregated Monthly Subtotals
  const monthlySubtotals = useMemo(() => {
    if (!filteredBuyers.length) return {};
    const res: Record<string, {
      targetQty: number;
      targetFob: number;
      targetFobExtra: number;
      achieveQty: number;
      achieveFob: number;
      qtyVariance: number;
      fobVariance: number;
      achievePercent: number | null;
    }> = {};

    MONTH_KEYS.forEach((m) => {
      let tQty = 0;
      let tFob = 0;
      let tExtra = 0;
      let aQty = 0;
      let aFob = 0;

      filteredBuyers.forEach((b) => {
        if (b.targetQty) tQty += b.targetQty;
        if (b.targetFob) tFob += b.targetFob;
        if (b.targetFobExtra) tExtra += b.targetFobExtra;

        const ach = b.achievements[m.key];
        if (ach?.achieveQty) aQty += ach.achieveQty;
        if (ach?.achieveFob) aFob += ach.achieveFob;
      });

      const qtyVariance = aQty - tQty;
      const fobTargetToUse = calculationBasis === "extra" ? tExtra : tFob;
      const fobVariance = aFob - fobTargetToUse;
      const achievePercent = tFob > 0 ? (aFob / tFob) * 100 : null;

      res[m.key] = {
        targetQty: tQty,
        targetFob: tFob,
        targetFobExtra: tExtra,
        achieveQty: aQty,
        achieveFob: aFob,
        qtyVariance,
        fobVariance,
        achievePercent,
      };
    });

    return res;
  }, [filteredBuyers, calculationBasis]);

  // Yearly Grand Totals across filtered buyers
  const yearlyGrandTotal = useMemo(() => {
    if (!filteredBuyers.length)
      return {
        totalTargetQty: 0,
        totalTargetFob: 0,
        totalTargetExtra: 0,
        totalAchieveQty: 0,
        totalAchieveFob: 0,
        qtyVariance: 0,
        fobVariance: 0,
        achievePercent: 0,
      };

    let totalTargetQty = 0;
    let totalTargetFob = 0;
    let totalTargetExtra = 0;
    let totalAchieveQty = 0;
    let totalAchieveFob = 0;

    filteredBuyers.forEach((b) => {
      const summary = computeYearlySummary(b, 12, calculationBasis);
      if (summary.totalTargetQty) totalTargetQty += summary.totalTargetQty;
      if (summary.totalTargetValue) totalTargetFob += summary.totalTargetValue;
      if (summary.totalTargetExtra) totalTargetExtra += summary.totalTargetExtra;
      totalAchieveQty += summary.totalAchieveQty;
      totalAchieveFob += summary.totalAchieveFob;
    });

    const qtyVariance = totalAchieveQty - totalTargetQty;
    const targetFobToUse = calculationBasis === "extra" ? totalTargetExtra : totalTargetFob;
    const fobVariance = totalAchieveFob - targetFobToUse;
    const achievePercent = totalTargetFob > 0 ? (totalAchieveFob / totalTargetFob) * 100 : 0;

    return {
      totalTargetQty,
      totalTargetFob,
      totalTargetExtra,
      totalAchieveQty,
      totalAchieveFob,
      qtyVariance,
      fobVariance,
      achievePercent,
    };
  }, [filteredBuyers, calculationBasis]);

  // HOD-wise aggregates month-by-month matching Yearly-2027 worksheet
  const hodMonthlyData = useMemo(() => {
    if (!plan) return {};
    const result: Record<string, Record<string, {
      targetQty: number;
      targetFob: number;
      achieveQty: number;
      achieveFob: number;
      qtyVariance: number;
      fobVariance: number;
      achievePercent: number | null;
    }>> = {};

    availableHODs.forEach((hod) => {
      result[hod] = {};
      const hodBuyers = plan.buyers.filter((b) => b.hod === hod);

      // Monthly baseline for this HOD
      const hodMonthlyTargetQty = hodBuyers.reduce((acc, b) => acc + (b.targetQty || 0), 0);
      const hodMonthlyTargetFob = hodBuyers.reduce((acc, b) => acc + (b.targetFob || 0), 0);
      const hodMonthlyTargetExtra = hodBuyers.reduce((acc, b) => acc + (b.targetFobExtra || 0), 0);

      MONTH_KEYS.forEach((m) => {
        let mAchQty = 0;
        let mAchFob = 0;

        hodBuyers.forEach((b) => {
          const ach = b.achievements[m.key];
          if (ach?.achieveQty) mAchQty += ach.achieveQty;
          if (ach?.achieveFob) mAchFob += ach.achieveFob;
        });

        const qVar = mAchQty - hodMonthlyTargetQty;
        const fobTarget = calculationBasis === "extra" ? hodMonthlyTargetExtra : hodMonthlyTargetFob;
        const fVar = mAchFob - fobTarget;
        const pct = hodMonthlyTargetFob > 0 ? (mAchFob / hodMonthlyTargetFob) * 100 : null;

        result[hod][m.key] = {
          targetQty: hodMonthlyTargetQty,
          targetFob: hodMonthlyTargetFob,
          achieveQty: mAchQty,
          achieveFob: mAchFob,
          qtyVariance: qVar,
          fobVariance: fVar,
          achievePercent: pct,
        };
      });
    });

    return result;
  }, [plan, availableHODs, calculationBasis]);

  // Export displayed register data to real Excel (.xlsx) file
  const handleExportToExcel = () => {
    try {
      if (!plan || filteredBuyers.length === 0) {
        toast.error("No data available to export.");
        return;
      }

      // Build Headers (2 rows)
      const headerRow1: (string | number)[] = [
        "SL",
        "Buyer",
        "HOD",
        "Target Qty (Monthly)",
        "Target FOB $ (Monthly Base)",
        "Target FOB +15% (Extra Margin)",
      ];
      const headerRow2: (string | number)[] = ["", "", "", "", "", ""];

      displayedMonths.forEach((m) => {
        headerRow1.push(`${m.label} '${selectedYear.toString().slice(2)}`, "", "", "", "");
        headerRow2.push(
          "Achieve Qty",
          "Achieve FOB $",
          "Ex / Less Qty",
          calculationBasis === "extra" ? "Ex/Less (15%)" : "Ex/Less (Base)",
          "Achieve %"
        );
      });

      if (selectedMonthFocus === "ALL") {
        headerRow1.push(`Yearly Total (${selectedYear})`, "", "", "", "", "", "");
        headerRow2.push(
          "Target Qty",
          "Target Value $",
          "Achieve Qty",
          "Achieve FOB $",
          "Excess/Less Qty",
          calculationBasis === "extra" ? "Excess/Less (15%)" : "Excess/Less (Base)",
          "Achieve %"
        );
      }

      const rows: (string | number)[][] = [headerRow1, headerRow2];

      // Data Rows
      filteredBuyers.forEach((b, idx) => {
        const row: (string | number)[] = [
          idx + 1,
          b.buyer,
          b.hod,
          b.targetQty ?? 0,
          b.targetFob ?? 0,
          b.targetFobExtra ?? 0,
        ];

        displayedMonths.forEach((m) => {
          const ach = b.achievements[m.key];
          const metrics = computeMonthlyMetrics(
            b.targetQty,
            b.targetFob,
            b.targetFobExtra,
            ach?.achieveQty ?? null,
            ach?.achieveFob ?? null,
            calculationBasis
          );
          row.push(
            metrics.achieveQty ?? "",
            metrics.achieveFob ?? "",
            metrics.qtyVariance ?? "",
            metrics.fobVariance ?? "",
            metrics.achievePercent !== null ? `${metrics.achievePercent.toFixed(1)}%` : ""
          );
        });

        if (selectedMonthFocus === "ALL") {
          const yearly = computeYearlySummary(b, 12, calculationBasis);
          row.push(
            yearly.totalTargetQty ?? 0,
            yearly.totalTargetValue ?? 0,
            yearly.totalAchieveQty,
            yearly.totalAchieveFob,
            yearly.qtyVariance ?? "",
            yearly.fobVariance ?? "",
            yearly.achievePercent !== null ? `${yearly.achievePercent.toFixed(1)}%` : ""
          );
        }

        rows.push(row);
      });

      // Summary / Total Row
      const totalRow: (string | number)[] = [
        "TOTAL",
        `All ${filteredBuyers.length} Buyers`,
        "",
        filteredBuyers.reduce((a, b) => a + (b.targetQty || 0), 0),
        filteredBuyers.reduce((a, b) => a + (b.targetFob || 0), 0),
        filteredBuyers.reduce((a, b) => a + (b.targetFobExtra || 0), 0),
      ];

      displayedMonths.forEach((m) => {
        const col = monthlySubtotals[m.key] || {
          achieveQty: 0,
          achieveFob: 0,
          qtyVariance: 0,
          fobVariance: 0,
          achievePercent: 0,
        };
        totalRow.push(
          col.achieveQty,
          col.achieveFob,
          col.qtyVariance,
          col.fobVariance,
          col.achievePercent !== null ? `${col.achievePercent.toFixed(1)}%` : ""
        );
      });

      if (selectedMonthFocus === "ALL") {
        totalRow.push(
          yearlyGrandTotal.totalTargetQty,
          yearlyGrandTotal.totalTargetFob,
          yearlyGrandTotal.totalAchieveQty,
          yearlyGrandTotal.totalAchieveFob,
          yearlyGrandTotal.qtyVariance,
          yearlyGrandTotal.fobVariance,
          `${yearlyGrandTotal.achievePercent.toFixed(1)}%`
        );
      }

      rows.push(totalRow);

      const ws = XLSX.utils.aoa_to_sheet(rows);

      // Define merges for grouped headers
      const merges: XLSX.Range[] = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
        { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
        { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } },
        { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } },
        { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } },
        { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } },
      ];

      let colIdx = 6;
      displayedMonths.forEach(() => {
        merges.push({
          s: { r: 0, c: colIdx },
          e: { r: 0, c: colIdx + 4 },
        });
        colIdx += 5;
      });

      if (selectedMonthFocus === "ALL") {
        merges.push({
          s: { r: 0, c: colIdx },
          e: { r: 0, c: colIdx + 6 },
        });
      }

      ws["!merges"] = merges;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `Target_vs_Achieve_${selectedYear}`);
      XLSX.writeFile(wb, `Marketing_Target_vs_Achievement_${selectedYear}.xlsx`);
      toast.success(`Successfully exported ${filteredBuyers.length} records to Marketing_Target_vs_Achievement_${selectedYear}.xlsx`);
    } catch (error: any) {
      console.error("Export error:", error);
      toast.error(error?.message || "Failed to export Excel file. Please try again.");
    }
  };

  if (!plan) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading Target vs Achievement Report...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Marketing & Merchandising</span>
            <span>/</span>
            <span>Marketing Planning & Performance</span>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">Target vs Achievement Report</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Target vs Achievement Report</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Year {selectedYear}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {filteredBuyers.length} Buyers
            </span>
          </div>
        </div>

        {/* View Switcher Tabs & Excel Export Action */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("matrix")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "matrix"
                  ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Buyer Matrix (12 Months)
            </button>
            <button
              onClick={() => setActiveTab("hodSummary")}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "hodSummary"
                  ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              HOD Performance (Yearly-2027)
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportToExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
            title="Download displayed register data as Excel file (.xlsx)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* FOB Variance Basis Selector Bar (Data Source description text removed per specification) */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            FOB Variance Calculation Basis:
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">
            {calculationBasis === "base" ? "(Comparing Actual FOB against Base Target FOB)" : "(Comparing Actual FOB against Target FOB with +15% Extra Margin)"}
          </span>
        </div>

        {/* Calculation Basis Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setCalculationBasis("base")}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                calculationBasis === "base"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              title="FOB Variance = Actual FOB − Base Target FOB (Default Basis)"
            >
              Base Target FOB (Default)
            </button>
            <button
              type="button"
              onClick={() => setCalculationBasis("extra")}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                calculationBasis === "extra"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              title="FOB Variance = Actual FOB − Target FOB with 15% Extra (Summary-2027 Extra)"
            >
              Target FOB + 15% Extra
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
          {/* Filter 1: Target Year */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Reporting Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  Year {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 2: HOD */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Responsible HOD
            </label>
            <select
              value={selectedHodFilter}
              onChange={(e) => setSelectedHodFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All HODs (6)</option>
              {availableHODs.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 3: Buyer */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Buyer Filter
            </label>
            <select
              value={selectedBuyerFilter}
              onChange={(e) => setSelectedBuyerFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Buyers ({availableBuyers.length})</option>
              {availableBuyers.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 4: Month Focus */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Month Focus
            </label>
            <select
              value={selectedMonthFocus}
              onChange={(e) => setSelectedMonthFocus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All 12 Months (Horizontal)</option>
              {MONTH_KEYS.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label} '{selectedYear.toString().slice(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Quick Search
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Buyer or HOD..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Reset */}
        {(selectedHodFilter !== "ALL" ||
          selectedBuyerFilter !== "ALL" ||
          selectedMonthFocus !== "ALL" ||
          searchTerm.trim()) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">
              Filtering: Showing {filteredBuyers.length} of {plan.buyers.length} Buyers
            </span>
            <button
              onClick={() => {
                setSelectedHodFilter("ALL");
                setSelectedBuyerFilter("ALL");
                setSelectedMonthFocus("ALL");
                setSearchTerm("");
              }}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: Buyer-Wise Target and Achievement Matrix (All 12 Months Horizontal) */}
      {activeTab === "matrix" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-h-[75vh]">
            <table className="w-full text-left text-xs border-collapse">
              {/* Table Header with 2 Levels: Month Groups & Metrics */}
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
                {/* Level 1: Fixed Columns & Month Headings */}
                <tr>
                  <th
                    rowSpan={2}
                    className="px-3 py-2 text-center w-10 sticky left-0 z-30 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700"
                  >
                    SL
                  </th>
                  <th
                    rowSpan={2}
                    className="px-3.5 py-2 font-bold min-w-[150px] sticky left-10 z-30 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700"
                  >
                    Buyer
                  </th>
                  <th
                    rowSpan={2}
                    className="px-3 py-2 font-bold min-w-[110px] sticky left-[190px] z-30 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700"
                  >
                    HOD
                  </th>
                  <th
                    rowSpan={2}
                    className="px-3 py-2 text-right font-bold min-w-[110px] border-r border-slate-200 dark:border-slate-700"
                  >
                    Target Qty
                    <span className="block text-[9px] font-normal text-slate-400">Monthly</span>
                  </th>
                  <th
                    rowSpan={2}
                    className="px-3 py-2 text-right font-bold min-w-[110px] border-r border-slate-200 dark:border-slate-700"
                  >
                    Target FOB $
                    <span className="block text-[9px] font-normal text-slate-400">Monthly Base</span>
                  </th>
                  <th
                    rowSpan={2}
                    className="px-3 py-2 text-right font-bold min-w-[120px] bg-teal-50/70 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-r-2 border-slate-300 dark:border-slate-700"
                  >
                    Target FOB +15%
                    <span className="block text-[9px] font-normal">Extra Margin</span>
                  </th>

                  {/* Twelve Months Header Columns (5 sub-columns each) */}
                  {displayedMonths.map((m) => (
                    <th
                      key={m.key}
                      colSpan={5}
                      className="px-3 py-2 text-center font-bold border-r-2 border-slate-300 dark:border-slate-700 bg-slate-200/70 dark:bg-slate-750"
                    >
                      {m.label} '{selectedYear.toString().slice(2)}
                    </th>
                  ))}

                  {/* Yearly Total Header Column (7 sub-columns) */}
                  {selectedMonthFocus === "ALL" && (
                    <th
                      colSpan={7}
                      className="px-3 py-2 text-center font-bold bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-l-2 border-amber-300 dark:border-amber-700"
                    >
                      Yearly Total ({selectedYear})
                    </th>
                  )}
                </tr>

                {/* Level 2: 5 Metrics per Month + 7 Metrics for Yearly Total */}
                <tr className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-850">
                  {displayedMonths.map((m) => (
                    <React.Fragment key={`sub-${m.key}`}>
                      <th className="px-2 py-1.5 text-right font-semibold min-w-[85px]">Achieve Qty</th>
                      <th className="px-2 py-1.5 text-right font-semibold min-w-[95px]">Achieve FOB $</th>
                      <th className="px-2 py-1.5 text-right font-semibold min-w-[85px]">Ex / Less Qty</th>
                      <th className="px-2 py-1.5 text-right font-semibold min-w-[95px]">
                        {calculationBasis === "extra" ? "Ex/Less (15%)" : "Ex/Less (Base)"}
                      </th>
                      <th className="px-2 py-1.5 text-right font-semibold min-w-[70px] border-r-2 border-slate-300 dark:border-slate-700">
                        Achieve %
                      </th>
                    </React.Fragment>
                  ))}

                  {/* 7 Yearly Metrics */}
                  {selectedMonthFocus === "ALL" && (
                    <>
                      <th className="px-2 py-1.5 text-right font-semibold min-w-[100px] bg-amber-50/50 dark:bg-amber-950/20">
                        Target Qty
                      </th>
                      <th className="px-2 py-1.5 text-right font-semibold min-w-[110px] bg-amber-50/50 dark:bg-amber-950/20">
                        Target Value $
                      </th>
                      <th className="px-2 py-1.5 text-right font-semibold min-w-[100px] bg-amber-50/50 dark:bg-amber-950/20">
                        Achieve Qty
                      </th>
                      <th className="px-2 py-1.5 text-right font-semibold min-w-[110px] bg-amber-50/50 dark:bg-amber-950/20">
                        Achieve FOB $
                      </th>
                      <th className="px-2 py-1.5 text-right font-semibold min-w-[100px] bg-amber-50/50 dark:bg-amber-950/20">
                        Ex/Less (Qty)
                      </th>
                      <th className="px-2 py-1.5 text-right font-semibold min-w-[110px] bg-amber-50/50 dark:bg-amber-950/20">
                        Ex/Less (FOB)
                      </th>
                      <th className="px-2 py-1.5 text-right font-semibold min-w-[80px] bg-amber-50/50 dark:bg-amber-950/20">
                        Achieve %
                      </th>
                    </>
                  )}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredBuyers.length > 0 ? (
                  filteredBuyers.map((b, idx) => {
                    const yearly = computeYearlySummary(b, 12, calculationBasis);

                    return (
                      <tr
                        key={b.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition group font-mono text-[11px]"
                      >
                        {/* Fixed SL */}
                        <td className="px-3 py-2 text-center text-slate-400 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-850 border-r border-slate-200 dark:border-slate-800">
                          {idx + 1}
                        </td>

                        {/* Fixed Buyer Name */}
                        <td className="px-3.5 py-2 font-sans font-bold text-slate-900 dark:text-slate-100 truncate max-w-[150px] sticky left-10 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-850 border-r border-slate-200 dark:border-slate-800">
                          {b.buyer}
                        </td>

                        {/* Fixed HOD */}
                        <td className="px-3 py-2 font-sans text-slate-700 dark:text-slate-300 font-medium truncate max-w-[110px] sticky left-[190px] z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-850 border-r border-slate-200 dark:border-slate-800">
                          {b.hod}
                        </td>

                        {/* Target Qty */}
                        <td className="px-3 py-2 text-right border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                          {formatQty(b.targetQty)}
                        </td>

                        {/* Target FOB $ */}
                        <td className="px-3 py-2 text-right border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                          {formatFob(b.targetFob)}
                        </td>

                        {/* Target FOB with 15% Extra */}
                        <td className="px-3 py-2 text-right border-r-2 border-slate-300 dark:border-slate-700 bg-teal-50/30 dark:bg-teal-950/10 text-teal-900 dark:text-teal-200 font-bold">
                          {formatFob(b.targetFobExtra)}
                        </td>

                        {/* Monthly Group Metrics */}
                        {displayedMonths.map((m) => {
                          const ach = b.achievements[m.key] || { achieveQty: null, achieveFob: null };
                          const metrics = computeMonthlyMetrics(
                            b.targetQty,
                            b.targetFob,
                            b.targetFobExtra,
                            ach.achieveQty,
                            ach.achieveFob,
                            calculationBasis
                          );

                          return (
                            <React.Fragment key={`cell-${b.id}-${m.key}`}>
                              {/* Achieve Qty (clickable to update) */}
                              <td
                                onClick={() =>
                                  setEditingActuals({
                                    buyerId: b.id,
                                    buyerName: b.buyer,
                                    monthKey: m.key,
                                    monthLabel: m.label,
                                    qty: ach.achieveQty !== null && ach.achieveQty !== undefined ? String(ach.achieveQty) : "",
                                    fob: ach.achieveFob !== null && ach.achieveFob !== undefined ? String(ach.achieveFob) : "",
                                  })
                                }
                                className="px-2 py-2 text-right text-slate-900 dark:text-slate-100 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 cursor-pointer"
                                title="Click to edit actual achievement"
                              >
                                {formatQty(ach.achieveQty)}
                              </td>

                              {/* Achieve FOB $ */}
                              <td
                                onClick={() =>
                                  setEditingActuals({
                                    buyerId: b.id,
                                    buyerName: b.buyer,
                                    monthKey: m.key,
                                    monthLabel: m.label,
                                    qty: ach.achieveQty !== null && ach.achieveQty !== undefined ? String(ach.achieveQty) : "",
                                    fob: ach.achieveFob !== null && ach.achieveFob !== undefined ? String(ach.achieveFob) : "",
                                  })
                                }
                                className="px-2 py-2 text-right font-medium text-slate-900 dark:text-slate-100 hover:bg-teal-50/50 dark:hover:bg-teal-950/30 cursor-pointer"
                                title="Click to edit actual achievement"
                              >
                                {formatFob(ach.achieveFob)}
                              </td>

                              {/* Excess / Less (Qty) */}
                              <td className="px-2 py-2 text-right">
                                {formatVariance(metrics.qtyVariance, false)}
                              </td>

                              {/* Excess / Less (FOB) */}
                              <td className="px-2 py-2 text-right">
                                {formatVariance(metrics.fobVariance, true)}
                              </td>

                              {/* Achieve % Value $ FOB */}
                              <td className="px-2 py-2 text-right border-r-2 border-slate-300 dark:border-slate-700">
                                {formatPercent(metrics.achievePercent)}
                              </td>
                            </React.Fragment>
                          );
                        })}

                        {/* Yearly Total Columns */}
                        {selectedMonthFocus === "ALL" && (
                          <>
                            <td className="px-2 py-2 text-right bg-amber-50/30 dark:bg-amber-950/10 text-slate-800 dark:text-slate-200">
                              {formatQty(yearly.totalTargetQty)}
                            </td>
                            <td className="px-2 py-2 text-right bg-amber-50/30 dark:bg-amber-950/10 text-slate-800 dark:text-slate-200">
                              {formatFob(yearly.totalTargetValue)}
                            </td>
                            <td className="px-2 py-2 text-right bg-amber-50/30 dark:bg-amber-950/10 font-bold text-slate-900 dark:text-slate-100">
                              {formatQty(yearly.totalAchieveQty)}
                            </td>
                            <td className="px-2 py-2 text-right bg-amber-50/30 dark:bg-amber-950/10 font-bold text-slate-900 dark:text-slate-100">
                              {formatFob(yearly.totalAchieveFob)}
                            </td>
                            <td className="px-2 py-2 text-right bg-amber-50/30 dark:bg-amber-950/10">
                              {formatVariance(yearly.qtyVariance, false)}
                            </td>
                            <td className="px-2 py-2 text-right bg-amber-50/30 dark:bg-amber-950/10">
                              {formatVariance(yearly.fobVariance, true)}
                            </td>
                            <td className="px-2 py-2 text-right bg-amber-50/30 dark:bg-amber-950/10 font-bold">
                              {formatPercent(yearly.achievePercent)}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={75} className="px-4 py-8 text-center text-xs text-slate-400 italic">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Monthly Subtotal Footer Row */}
              <tfoot className="bg-slate-100 dark:bg-slate-850 font-mono text-[11px] font-bold border-t-2 border-slate-300 dark:border-slate-700 sticky bottom-0 z-20 shadow-md">
                <tr>
                  <td
                    colSpan={3}
                    className="px-3.5 py-3 text-right uppercase tracking-wider font-sans text-xs sticky left-0 z-30 bg-slate-100 dark:bg-slate-850 border-r border-slate-200 dark:border-slate-700"
                  >
                    Monthly Total:
                  </td>
                  <td className="px-3 py-3 text-right border-r border-slate-200 dark:border-slate-800 text-teal-800 dark:text-teal-300">
                    {formatQty(
                      filteredBuyers.reduce((a, b) => a + (b.targetQty || 0), 0)
                    )}
                  </td>
                  <td className="px-3 py-3 text-right border-r border-slate-200 dark:border-slate-800">
                    {formatFob(
                      filteredBuyers.reduce((a, b) => a + (b.targetFob || 0), 0)
                    )}
                  </td>
                  <td className="px-3 py-3 text-right border-r-2 border-slate-300 dark:border-slate-700 text-teal-900 dark:text-teal-200">
                    {formatFob(
                      filteredBuyers.reduce((a, b) => a + (b.targetFobExtra || 0), 0)
                    )}
                  </td>

                  {/* Monthly Subtotals */}
                  {displayedMonths.map((m) => {
                    const st = monthlySubtotals[m.key] || {
                      achieveQty: 0,
                      achieveFob: 0,
                      qtyVariance: 0,
                      fobVariance: 0,
                      achievePercent: 0,
                    };

                    return (
                      <React.Fragment key={`foot-${m.key}`}>
                        <td className="px-2 py-3 text-right text-slate-900 dark:text-slate-100">
                          {formatQty(st.achieveQty)}
                        </td>
                        <td className="px-2 py-3 text-right text-slate-900 dark:text-slate-100">
                          {formatFob(st.achieveFob)}
                        </td>
                        <td className="px-2 py-3 text-right">
                          {formatVariance(st.qtyVariance, false)}
                        </td>
                        <td className="px-2 py-3 text-right">
                          {formatVariance(st.fobVariance, true)}
                        </td>
                        <td className="px-2 py-3 text-right border-r-2 border-slate-300 dark:border-slate-700">
                          {formatPercent(st.achievePercent)}
                        </td>
                      </React.Fragment>
                    );
                  })}

                  {/* Yearly Grand Subtotal */}
                  {selectedMonthFocus === "ALL" && (
                    <>
                      <td className="px-2 py-3 text-right bg-amber-100/60 dark:bg-amber-950/40 text-slate-900 dark:text-slate-100">
                        {formatQty(yearlyGrandTotal.totalTargetQty)}
                      </td>
                      <td className="px-2 py-3 text-right bg-amber-100/60 dark:bg-amber-950/40 text-slate-900 dark:text-slate-100">
                        {formatFob(yearlyGrandTotal.totalTargetFob)}
                      </td>
                      <td className="px-2 py-3 text-right bg-amber-100/60 dark:bg-amber-950/40 text-teal-800 dark:text-teal-300">
                        {formatQty(yearlyGrandTotal.totalAchieveQty)}
                      </td>
                      <td className="px-2 py-3 text-right bg-amber-100/60 dark:bg-amber-950/40 text-teal-800 dark:text-teal-300">
                        {formatFob(yearlyGrandTotal.totalAchieveFob)}
                      </td>
                      <td className="px-2 py-3 text-right bg-amber-100/60 dark:bg-amber-950/40">
                        {formatVariance(yearlyGrandTotal.qtyVariance, false)}
                      </td>
                      <td className="px-2 py-3 text-right bg-amber-100/60 dark:bg-amber-950/40">
                        {formatVariance(yearlyGrandTotal.fobVariance, true)}
                      </td>
                      <td className="px-2 py-3 text-right bg-amber-100/60 dark:bg-amber-950/40 font-bold">
                        {formatPercent(yearlyGrandTotal.achievePercent)}
                      </td>
                    </>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: HOD-Wise Performance Summary (Yearly-2027 Worksheet Architecture) */}
      {activeTab === "hodSummary" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm p-4 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>HOD-Wise Strategic Performance Matrix (Year {selectedYear})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Derived automatically from assigned Buyers. Each HOD's monthly targets represent the sum of their assigned buyers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th rowSpan={2} className="px-3.5 py-2 font-bold min-w-[120px] border-r border-slate-200 dark:border-slate-700">
                    Month
                  </th>
                  {availableHODs.map((hod) => (
                    <th
                      key={hod}
                      colSpan={7}
                      className="px-3 py-2 text-center font-bold border-r-2 border-slate-300 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-750"
                    >
                      {hod}
                    </th>
                  ))}
                </tr>
                <tr className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-850">
                  {availableHODs.map((hod) => (
                    <React.Fragment key={`sub-${hod}`}>
                      <th className="px-2 py-1 text-right font-semibold min-w-[80px]">Target Qty</th>
                      <th className="px-2 py-1 text-right font-semibold min-w-[90px]">Target FOB</th>
                      <th className="px-2 py-1 text-right font-semibold min-w-[80px]">Achieve Qty</th>
                      <th className="px-2 py-1 text-right font-semibold min-w-[90px]">Achieve FOB</th>
                      <th className="px-2 py-1 text-right font-semibold min-w-[75px]">Ex/Less Qty</th>
                      <th className="px-2 py-1 text-right font-semibold min-w-[80px]">Ex/Less FOB</th>
                      <th className="px-2 py-1 text-right font-semibold min-w-[65px] border-r-2 border-slate-300 dark:border-slate-700">
                        Achieve %
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-[11px]">
                {MONTH_KEYS.map((m) => (
                  <tr key={m.key} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/60 transition">
                    <td className="px-3.5 py-2 font-sans font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800">
                      {m.label}
                    </td>
                    {availableHODs.map((hod) => {
                      const data = hodMonthlyData[hod]?.[m.key] || {
                        targetQty: 0,
                        targetFob: 0,
                        achieveQty: 0,
                        achieveFob: 0,
                        qtyVariance: 0,
                        fobVariance: 0,
                        achievePercent: 0,
                      };

                      return (
                        <React.Fragment key={`hod-cell-${hod}-${m.key}`}>
                          <td className="px-2 py-2 text-right text-slate-600 dark:text-slate-400">
                            {formatQty(data.targetQty)}
                          </td>
                          <td className="px-2 py-2 text-right text-slate-600 dark:text-slate-400">
                            {formatFob(data.targetFob)}
                          </td>
                          <td className="px-2 py-2 text-right text-slate-900 dark:text-slate-100 font-medium">
                            {formatQty(data.achieveQty)}
                          </td>
                          <td className="px-2 py-2 text-right text-slate-900 dark:text-slate-100 font-medium">
                            {formatFob(data.achieveFob)}
                          </td>
                          <td className="px-2 py-2 text-right">
                            {formatVariance(data.qtyVariance, false)}
                          </td>
                          <td className="px-2 py-2 text-right">
                            {formatVariance(data.fobVariance, true)}
                          </td>
                          <td className="px-2 py-2 text-right border-r-2 border-slate-300 dark:border-slate-700">
                            {formatPercent(data.achievePercent)}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              {/* Yearly Subtotals per HOD */}
              <tfoot className="bg-slate-100 dark:bg-slate-850 font-mono text-[11px] font-bold border-t-2 border-slate-300 dark:border-slate-700">
                <tr>
                  <td className="px-3.5 py-3 font-sans uppercase tracking-wider text-xs border-r border-slate-200 dark:border-slate-700">
                    Yearly Subtotal:
                  </td>
                  {availableHODs.map((hod) => {
                    const hodBuyers = plan.buyers.filter((b) => b.hod === hod);
                    let sumTargetQty = 0;
                    let sumTargetFob = 0;
                    let sumAchieveQty = 0;
                    let sumAchieveFob = 0;

                    MONTH_KEYS.forEach((m) => {
                      const d = hodMonthlyData[hod]?.[m.key];
                      if (d) {
                        sumTargetQty += d.targetQty;
                        sumTargetFob += d.targetFob;
                        sumAchieveQty += d.achieveQty;
                        sumAchieveFob += d.achieveFob;
                      }
                    });

                    const qVar = sumAchieveQty - sumTargetQty;
                    const fVar = sumAchieveFob - sumTargetFob;
                    const pct = sumTargetFob > 0 ? (sumAchieveFob / sumTargetFob) * 100 : null;

                    return (
                      <React.Fragment key={`hod-foot-${hod}`}>
                        <td className="px-2 py-3 text-right">{formatQty(sumTargetQty)}</td>
                        <td className="px-2 py-3 text-right">{formatFob(sumTargetFob)}</td>
                        <td className="px-2 py-3 text-right text-teal-800 dark:text-teal-300">
                          {formatQty(sumAchieveQty)}
                        </td>
                        <td className="px-2 py-3 text-right text-teal-800 dark:text-teal-300">
                          {formatFob(sumAchieveFob)}
                        </td>
                        <td className="px-2 py-3 text-right">{formatVariance(qVar, false)}</td>
                        <td className="px-2 py-3 text-right">{formatVariance(fVar, true)}</td>
                        <td className="px-2 py-3 text-right border-r-2 border-slate-300 dark:border-slate-700 font-bold">
                          {formatPercent(pct)}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Yearly Total Grand Summary Card (7 Fields per Business Specification) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              <span>Annual Marketing Performance Summary — Calendar Year {selectedYear}</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Consolidated 12-month performance across {filteredBuyers.length} buyers with recurring monthly baselines.
            </p>
          </div>
          <div className="text-xs font-mono text-teal-300 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            Calculation Basis: {calculationBasis === "extra" ? "Target FOB with 15% Extra" : "Base Target FOB"}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          {/* Field: Total Target Qty */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-300 block font-medium">Total Target Qty</span>
            <span className="text-base font-bold font-mono text-white mt-1 block">
              {yearlyGrandTotal.totalTargetQty.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Monthly × 12</span>
          </div>

          {/* Field: Total Target Value $ */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-300 block font-medium">Total Target FOB $</span>
            <span className="text-base font-bold font-mono text-white mt-1 block">
              ${yearlyGrandTotal.totalTargetFob.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Base Target</span>
          </div>

          {/* Field: Total Achieve Qty */}
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
            <span className="text-[11px] text-teal-300 block font-medium">Total Achieve Qty</span>
            <span className="text-base font-bold font-mono text-teal-200 mt-1 block">
              {yearlyGrandTotal.totalAchieveQty.toLocaleString()}
            </span>
            <span className="text-[10px] text-teal-400/80 block mt-0.5">12 Months Actual</span>
          </div>

          {/* Field: Total Achieve Value $ FOB */}
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
            <span className="text-[11px] text-teal-300 block font-medium">Total Achieve FOB $</span>
            <span className="text-base font-bold font-mono text-teal-200 mt-1 block">
              ${yearlyGrandTotal.totalAchieveFob.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] text-teal-400/80 block mt-0.5">12 Months Actual</span>
          </div>

          {/* Field: Excess / Less (Qty) */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-300 block font-medium">Excess / Less (Qty)</span>
            <span
              className={`text-base font-bold font-mono mt-1 block ${
                yearlyGrandTotal.qtyVariance >= 0 ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {yearlyGrandTotal.qtyVariance >= 0 ? "+" : ""}
              {yearlyGrandTotal.qtyVariance.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Quantity Variance</span>
          </div>

          {/* Field: Excess / Less (FOB) */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-300 block font-medium">Excess / Less (FOB)</span>
            <span
              className={`text-base font-bold font-mono mt-1 block ${
                yearlyGrandTotal.fobVariance >= 0 ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {yearlyGrandTotal.fobVariance >= 0 ? "+$" : "-$"}
              {Math.abs(yearlyGrandTotal.fobVariance).toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              vs {calculationBasis === "extra" ? "15% Extra Target" : "Base Target"}
            </span>
          </div>

          {/* Field: Achieve % Value $ FOB */}
          <div className="p-3 rounded-xl bg-white/10 border border-teal-400/40">
            <span className="text-[11px] text-teal-200 block font-medium">Overall Achieve %</span>
            <span className="text-lg font-bold font-mono text-teal-300 mt-1 block">
              {yearlyGrandTotal.achievePercent.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-300 block mt-0.5">FOB Achievement Rate</span>
          </div>
        </div>
      </div>

      {/* Edit Monthly Actual Achievement Dialog */}
      {editingActuals && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit className="w-4 h-4 text-teal-600" />
                  <span>Update Actual Achievement</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {editingActuals.buyerName} — {editingActuals.monthLabel} {selectedYear}
                </p>
              </div>
              <button
                onClick={() => setEditingActuals(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Actual Achieved Quantity (Pcs)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 300000"
                  value={editingActuals.qty}
                  onChange={(e) => setEditingActuals({ ...editingActuals, qty: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Actual Achieved Value $ (FOB)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-mono">$</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1000000"
                    value={editingActuals.fob}
                    onChange={(e) => setEditingActuals({ ...editingActuals, fob: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 text-[11px]">
                <p>
                  Saves directly into the live marketing performance dataset. All variances and percentages will be recalculated instantly.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingActuals(null)}
                className="px-4 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveActuals}
                className="px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Actuals</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import {
  MMRepository,
  MMCostSavingRow,
} from "../lib/marketing-merchandising-data";
import {
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  DollarSign,
  Percent,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Scissors,
  Package,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mm-cost-saving-analysis")({
  head: () => ({
    meta: [
      { title: "Individual Item-wise Cost Saving Analysis — CriptonHRIS" },
      {
        name: "description",
        content: "Traceable item-level cost saving analytics connecting Main Order, Pre-Costing, BOM, and Bookings with multi-level rollup hierarchies.",
      },
    ],
  }),
  component: MMCostSavingAnalysisPage,
});

function MMCostSavingAnalysisPage() {
  const [rows, setRows] = useState<MMCostSavingRow[]>([]);
  const [policy, setPolicy] = useState(MMRepository.getPolicy());
  const [rollupLevel, setRollupLevel] = useState<"item" | "fabric" | "accessories" | "style" | "order">("item");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterExceptionOnly, setFilterExceptionOnly] = useState(false);

  useEffect(() => {
    setRows(MMRepository.generateCostSavingAnalysis());
    setPolicy(MMRepository.getPolicy());
  }, []);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchCat = filterCategory === "All" || r.category === filterCategory;
      const matchSearch =
        searchTerm === "" ||
        r.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.styleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.preCostItemId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchExc = !filterExceptionOnly || r.isOverBudget || r.isTargetException;
      return matchCat && matchSearch && matchExc;
    });
  }, [rows, filterCategory, searchTerm, filterExceptionOnly]);

  // Overall Portfolio Rollup
  const portfolioSummary = useMemo(() => {
    const totalPreCost = rows.reduce((acc, r) => acc + r.preCostAmount, 0);
    const totalBooked = rows.reduce((acc, r) => acc + r.bookedAmount, 0);
    const totalSaving = totalPreCost - totalBooked;
    const savingPct = totalPreCost > 0 ? (totalSaving / totalPreCost) * 100 : 0;
    const totalRateVariance = rows.reduce((acc, r) => acc + r.rateVariance * r.bookedQty, 0);
    const totalQtyVariance = rows.reduce((acc, r) => acc + r.qtyVariance * r.preCostRate, 0);
    const overruns = rows.filter((r) => r.isOverBudget).length;
    const targetMisses = rows.filter((r) => r.isTargetException).length;
    return { totalPreCost, totalBooked, totalSaving, savingPct, totalRateVariance, totalQtyVariance, overruns, targetMisses };
  }, [rows]);

  // Grouped Rollup Aggregations (Style, Order, Fabric, Accessories)
  const groupedRollups = useMemo(() => {
    const map: Record<
      string,
      {
        key: string;
        label: string;
        itemsCount: number;
        preCostAmount: number;
        bookedAmount: number;
        savingAmount: number;
        savingPct: number;
        overrunsCount: number;
      }
    > = {};

    filteredRows.forEach((r) => {
      let groupKey = r.orderNo;
      let label = `Main Order: ${r.orderNo} (${r.buyerName})`;

      if (rollupLevel === "style") {
        groupKey = r.styleNo;
        label = `Style: ${r.styleNo}`;
      } else if (rollupLevel === "fabric") {
        if (r.category !== "Fabric") return;
        groupKey = r.itemDescription;
        label = `Fabric Quality: ${r.itemDescription}`;
      } else if (rollupLevel === "accessories") {
        if (r.category !== "Accessories") return;
        groupKey = r.itemDescription;
        label = `Accessories Item: ${r.itemDescription}`;
      }

      if (!map[groupKey]) {
        map[groupKey] = {
          key: groupKey,
          label,
          itemsCount: 0,
          preCostAmount: 0,
          bookedAmount: 0,
          savingAmount: 0,
          savingPct: 0,
          overrunsCount: 0,
        };
      }

      map[groupKey].itemsCount += 1;
      map[groupKey].preCostAmount += r.preCostAmount;
      map[groupKey].bookedAmount += r.bookedAmount;
      map[groupKey].savingAmount += r.initialBookingSaving;
      if (r.isOverBudget) map[groupKey].overrunsCount += 1;
    });

    Object.values(map).forEach((g) => {
      g.savingPct = g.preCostAmount > 0 ? (g.savingAmount / g.preCostAmount) * 100 : 0;
    });

    return Object.values(map);
  }, [filteredRows, rollupLevel]);

  const handleExportCsv = () => {
    const headers = [
      "Order No",
      "Style No",
      "PO No",
      "Pre-Cost ID",
      "Pre-Cost Item ID",
      "BOM Item ID",
      "Booking No",
      "Category",
      "Item Description",
      "Specification",
      "UoM",
      "Pre-Cost Qty",
      "Pre-Cost Rate ($)",
      "Pre-Cost Amount ($)",
      "Booked Qty",
      "Booked Rate ($)",
      "Booked Amount ($)",
      "Qty Variance",
      "Rate Variance ($)",
      "Cost Variance ($)",
      "Initial Booking Saving ($)",
      "Saving %",
      "Budget Status",
    ];

    const csvRows = filteredRows.map((r) => [
      `"${r.orderNo}"`,
      `"${r.styleNo}"`,
      `"${r.poNumber}"`,
      `"${r.preCostId} v${r.preCostVersion}"`,
      `"${r.preCostItemId}"`,
      `"${r.bomItemId}"`,
      `"${r.bookingNo}"`,
      `"${r.category}"`,
      `"${r.itemDescription.replace(/"/g, '""')}"`,
      `"${r.specification.replace(/"/g, '""')}"`,
      `"${r.uom}"`,
      r.preCostQty,
      r.preCostRate.toFixed(4),
      r.preCostAmount.toFixed(2),
      r.bookedQty,
      r.bookedRate.toFixed(4),
      r.bookedAmount.toFixed(2),
      r.qtyVariance,
      r.rateVariance.toFixed(4),
      r.costVariance.toFixed(2),
      r.initialBookingSaving.toFixed(2),
      r.savingPercentage.toFixed(2),
      r.isOverBudget ? "Overrun" : "Within Budget",
    ]);

    const csvContent = [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cost_saving_analysis_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported Cost Saving Analysis to CSV.");
  };

  return (
    <MarketingMerchandisingLayout
      activePath="/mm-cost-saving-analysis"
      breadcrumbs={[{ label: "Item Cost Saving Analysis" }]}
      title="Individual Item-wise Cost Saving Analysis"
      subtitle="Complete traceability from Pre-Costing baseline to BOM and Booking with multi-tier rollup hierarchies"
      actions={
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
          <span>Export Excel / CSV</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Math & Rule Clarity Banner */}
        <div className="p-3.5 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>Verified Formula:</strong> Initial Booking Saving = Comparable Pre-Cost Amount − Comparable Booked
              Amount. Negative savings are strictly reported as <em>Cost Overruns</em>. Safe division handles missing
              baselines. Rate vs. Quantity variances are separately distinguished.
            </span>
          </div>
          <span className="font-mono text-[11px] font-bold text-teal-700 dark:text-teal-400 shrink-0">
            Performance Target: {policy.savingTargetPercentage}%
          </span>
        </div>

        {/* ── PORTFOLIO CONSOLIDATED ROLLUP METRICS ──────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Pre-Cost Baseline</span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
              ${portfolioSummary.totalPreCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-500">{rows.length} Traceable Costing Lines</span>
          </div>

          <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Booked Commitments</span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
              ${portfolioSummary.totalBooked.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-teal-600 font-semibold">Fabric + Trims + Accessories</span>
          </div>

          <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Initial Booking Saving</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-emerald-600 font-mono">
                +${portfolioSummary.totalSaving.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <span className="px-1.5 py-0.2 rounded font-bold text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {portfolioSummary.savingPct.toFixed(2)}%
              </span>
            </div>
            <span className="text-[11px] text-slate-500">Benchmark Target: {policy.savingTargetPercentage}%</span>
          </div>

          <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Variance Breakdown</span>
            <div className="text-xs font-mono space-y-0.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Rate Variance:</span>
                <span className="font-bold text-emerald-600">-${Math.abs(portfolioSummary.totalRateVariance).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Qty Variance:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">${portfolioSummary.totalQtyVariance.toFixed(2)}</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {portfolioSummary.overruns} Overrun, {portfolioSummary.targetMisses} Target Misses
            </span>
          </div>
        </div>

        {/* ── TOOLBAR: ROLLUP LEVEL SELECTOR & FILTERS ───────────────────────── */}
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Report Level:</span>
            <button
              onClick={() => setRollupLevel("item")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                rollupLevel === "item" ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              1. Individual Item-wise
            </button>
            <button
              onClick={() => setRollupLevel("fabric")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                rollupLevel === "fabric" ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              2. Fabric-wise
            </button>
            <button
              onClick={() => setRollupLevel("accessories")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                rollupLevel === "accessories"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              3. Accessories-wise
            </button>
            <button
              onClick={() => setRollupLevel("style")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                rollupLevel === "style" ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              4. Style-wise
            </button>
            <button
              onClick={() => setRollupLevel("order")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                rollupLevel === "order" ? "bg-teal-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              5. Main Order-wise
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Filter items, style, order..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 w-48"
            />
            <label className="flex items-center gap-1 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={filterExceptionOnly}
                onChange={(e) => setFilterExceptionOnly(e.target.checked)}
                className="rounded text-teal-600"
              />
              <span>Exceptions</span>
            </label>
          </div>
        </div>

        {/* ── CONDITIONAL VIEW: GROUPED ROLLUP SUMMARY TABLE ─────────────────── */}
        {rollupLevel !== "item" && (
          <div className="rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Aggregated Summary View ({rollupLevel.toUpperCase()})
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Rollup Group</th>
                  <th className="py-2.5 px-3">Lines</th>
                  <th className="py-2.5 px-3">Pre-Cost Baseline ($)</th>
                  <th className="py-2.5 px-3">Total Booked ($)</th>
                  <th className="py-2.5 px-3">Initial Saving ($)</th>
                  <th className="py-2.5 px-3">Saving %</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {groupedRollups.map((g) => (
                  <tr key={g.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{g.label}</td>
                    <td className="py-2.5 px-3 font-mono">{g.itemsCount}</td>
                    <td className="py-2.5 px-3 font-mono font-medium">${g.preCostAmount.toFixed(2)}</td>
                    <td className="py-2.5 px-3 font-mono font-bold">${g.bookedAmount.toFixed(2)}</td>
                    <td
                      className={`py-2.5 px-3 font-mono font-bold ${
                        g.savingAmount >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {g.savingAmount >= 0 ? `+$${g.savingAmount.toFixed(2)}` : `-$${Math.abs(g.savingAmount).toFixed(2)}`}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold">{g.savingPct.toFixed(2)}%</td>
                    <td className="py-2.5 px-3">
                      {g.savingPct >= policy.savingTargetPercentage ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Target Achieved
                        </span>
                      ) : g.savingAmount >= 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Below Target
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          Cost Overrun
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── INDIVIDUAL ITEM-LEVEL DETAIL TABLE ──────────────────────────────── */}
        <div className="rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>Granular Item-Level Traceability Records ({filteredRows.length})</span>
            <span className="text-[10px] font-normal text-slate-400">
              PreCost ID → BOM Item ID → Booking Item ID
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-400 border-b">
                <tr>
                  <th className="py-2.5 px-2.5">Order / Style</th>
                  <th className="py-2.5 px-2.5">Pre-Cost Item ID</th>
                  <th className="py-2.5 px-2.5">BOM ID</th>
                  <th className="py-2.5 px-2.5">Booking No</th>
                  <th className="py-2.5 px-2.5">Item Description</th>
                  <th className="py-2.5 px-2.5">UoM</th>
                  <th className="py-2.5 px-2.5">Pre-Cost Rate</th>
                  <th className="py-2.5 px-2.5">Booked Rate</th>
                  <th className="py-2.5 px-2.5">Booked Qty</th>
                  <th className="py-2.5 px-2.5">Booked Amount ($)</th>
                  <th className="py-2.5 px-2.5">Pre-Cost Baseline ($)</th>
                  <th className="py-2.5 px-2.5">Initial Saving ($)</th>
                  <th className="py-2.5 px-2.5">Saving %</th>
                  <th className="py-2.5 px-2.5">Variance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {filteredRows.map((r) => (
                  <tr key={r.rowId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-2.5 font-sans">
                      <span className="font-bold text-slate-900 dark:text-white block">{r.orderNo}</span>
                      <span className="text-[10px] text-slate-400">{r.styleNo}</span>
                    </td>
                    <td className="py-2.5 px-2.5 font-bold text-teal-600 dark:text-teal-400">{r.preCostItemId}</td>
                    <td className="py-2.5 px-2.5 text-slate-500">{r.bomItemId}</td>
                    <td className="py-2.5 px-2.5 text-teal-700 dark:text-teal-300 font-bold">{r.bookingNo}</td>
                    <td className="py-2.5 px-2.5 font-sans font-semibold text-slate-800 dark:text-slate-200">
                      {r.itemDescription}
                    </td>
                    <td className="py-2.5 px-2.5 text-center font-bold font-sans">{r.uom}</td>
                    <td className="py-2.5 px-2.5 text-slate-500">${r.preCostRate.toFixed(4)}</td>
                    <td className="py-2.5 px-2.5 font-bold text-slate-900 dark:text-white">
                      ${r.bookedRate.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-2.5">{r.bookedQty.toLocaleString()}</td>
                    <td className="py-2.5 px-2.5 font-bold">${r.bookedAmount.toFixed(2)}</td>
                    <td className="py-2.5 px-2.5 text-slate-500">${r.preCostAmount.toFixed(2)}</td>
                    <td
                      className={`py-2.5 px-2.5 font-bold ${
                        r.initialBookingSaving >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {r.initialBookingSaving >= 0
                        ? `+$${r.initialBookingSaving.toFixed(2)}`
                        : `-$${Math.abs(r.initialBookingSaving).toFixed(2)}`}
                    </td>
                    <td className="py-2.5 px-2.5 font-bold">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          r.savingPercentage >= policy.savingTargetPercentage
                            ? "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                            : r.savingPercentage >= 0
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {r.savingPercentage.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 font-sans">
                      {r.isOverBudget && (
                        <span className="text-[10px] font-bold text-rose-600 block">⚠ Overrun</span>
                      )}
                      {r.isTargetException && !r.isOverBudget && (
                        <span className="text-[10px] font-bold text-amber-600 block">Target Miss</span>
                      )}
                      {!r.isOverBudget && !r.isTargetException && (
                        <span className="text-[10px] font-bold text-emerald-600 block">✓ On Target</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MarketingMerchandisingLayout>
  );
}

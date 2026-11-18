import React, { useRef } from "react";
import {
  Printer,
  ArrowLeft,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Layers,
  FileText,
  DollarSign,
  Package,
  Calendar,
  User,
  ShieldCheck,
  Edit,
  ImageIcon,
} from "lucide-react";
import {
  PreCostingRecord,
  KnitFabricCostItemRow,
  PreCostingItemRow,
  KnitOtherCostRow,
  getStoredAttachmentsForRecord,
} from "./PreCostingKnitManager";
import { MMRepository } from "../../lib/marketing-merchandising-data";

interface PreCostingKnitReportProps {
  record: PreCostingRecord | null;
  onBack: () => void;
  onEdit?: (record: PreCostingRecord) => void;
}

export function PreCostingKnitReport({ record, onBack, onEdit }: PreCostingKnitReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  if (!record) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto my-12 shadow-xs">
        <FileText className="size-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <p className="font-bold text-sm text-slate-800 dark:text-slate-200">No Pre Costing record selected for report</p>
        <p className="text-xs text-slate-400 mt-1">Please select a record from the register to generate the formal pre costing report.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 cursor-pointer"
        >
          Back to Pre Costing Register
        </button>
      </div>
    );
  }

  // ── Calculation Utilities & Normalization ───────────────────────
  const poRows = Array.isArray(record.poRows) && record.poRows.length > 0 ? record.poRows : [];
  const totalOrderQtyPcs = poRows.reduce((s, p) => s + (Number(p.poQuantity) || 0), 0) || 20000;
  const totalOrderQtyDz = Number((totalOrderQtyPcs / 12).toFixed(2));
  const totalOrderValue =
    poRows.reduce(
      (s, p) => s + (Number(p.value) || (Number(p.poQuantity) || 0) * (Number(p.rate) || 0)),
      0
    ) || 85000;
  const averageFobRate = totalOrderQtyPcs > 0 ? totalOrderValue / totalOrderQtyPcs : 0;
  const averageFobRateDz = averageFobRate * 12;

  // Fabrics
  const fabricItems: KnitFabricCostItemRow[] = Array.isArray(record.knitFabricItems)
    ? record.knitFabricItems
    : [];
  const totalFabricCost = fabricItems.reduce((s, f) => s + (Number(f.totalAmount) || 0), 0);
  const totalYarnCost = fabricItems.reduce(
    (s, f) => s + (Number(f.yarnCost ?? f.totalYarnCost) || 0),
    0
  );
  const totalKnittingCost = fabricItems.reduce((s, f) => s + (Number(f.knittingCost) || 0), 0);
  const totalDyeingCost = fabricItems.reduce((s, f) => s + (Number(f.dyeingCost) || 0), 0);
  const totalFinishingCost = 0; // Standard knit composite includes finishing in dyeing rate

  // Accessories Normalization & Extraction
  const rawAccessories: PreCostingItemRow[] =
    Array.isArray(record.accessoriesItems) && record.accessoriesItems.length > 0
      ? record.accessoriesItems
      : Array.isArray(record.items)
      ? record.items.filter(
          (it) =>
            it.head === "Sewing Trims" ||
            it.head === "Finishing Trims" ||
            it.head === "Accessories" ||
            it.head === "Trims" ||
            it.head?.toLowerCase().includes("trim") ||
            it.head?.toLowerCase().includes("access")
        )
      : [];

  const accessoriesItems = rawAccessories;
  const totalAccessoriesCost = accessoriesItems.reduce((s, a) => s + (Number(a.amount) || 0), 0);

  // Accurate Accessories Categorization (Finishing vs Sewing)
  const isFinishingAccessory = (item: PreCostingItemRow): boolean => {
    const head = (item.head || "").trim().toLowerCase();
    const cat = ((item as any).category || "").trim().toLowerCase();
    const desc = (item.description || "").toLowerCase();
    const itemName = (item.item || "").toLowerCase();
    const fullText = `${head} ${itemName} ${desc}`;

    // 1. Explicit Head check (Form dropdown: "Finishing Trims" vs "Sewing Trims")
    if (head.includes("finish")) return true;
    if (head.includes("sew")) return false;

    // 2. Explicit Category check (if defined on object)
    if (cat.includes("finish")) return true;
    if (cat.includes("sew")) return false;

    // 3. Description prefix check (Form master auto-fill: "Finishing Trims - ...")
    if (desc.startsWith("finishing") || desc.includes("finishing trim") || desc.includes("finishing access")) return true;
    if (desc.startsWith("sewing") || desc.includes("sewing trim") || desc.includes("sewing access")) return false;

    // 4. Master library lookup
    try {
      const masterList = MMRepository.getAccessoriesMaster();
      const foundInMaster = masterList.find(
        (m) =>
          m.itemName.toLowerCase() === itemName ||
          (item.codeNo && m.itemCode.toLowerCase() === item.codeNo.toLowerCase())
      );
      if (foundInMaster) {
        if (foundInMaster.category === "Finishing Trims") return true;
        if (foundInMaster.category === "Sewing Trims") return false;
      }
    } catch {
      // ignore
    }

    // 5. Keyword analysis:
    // Check sewing triggers first to prevent "poly" in "poly core sewing thread" from triggering finishing!
    const isSewingKeyword =
      fullText.includes("sewing thread") ||
      fullText.includes("spun poly") ||
      fullText.includes("core spun") ||
      fullText.includes("thread") ||
      fullText.includes("button") ||
      fullText.includes("zipper") ||
      fullText.includes("interlining") ||
      fullText.includes("elastic") ||
      fullText.includes("twill tape") ||
      fullText.includes("drawcord") ||
      fullText.includes("eyelet") ||
      fullText.includes("rivet") ||
      fullText.includes("velcro");

    if (isSewingKeyword) return false;

    // Finishing packaging & labeling triggers
    const isFinishingKeyword =
      fullText.includes("poly") ||
      fullText.includes("carton") ||
      fullText.includes("hang tag") ||
      fullText.includes("hangtag") ||
      fullText.includes("price") ||
      fullText.includes("barcode") ||
      fullText.includes("tissue") ||
      fullText.includes("sticker") ||
      fullText.includes("hanger") ||
      fullText.includes("label") ||
      fullText.includes("tagless") ||
      fullText.includes("silica") ||
      fullText.includes("desiccant") ||
      fullText.includes("gum tape") ||
      fullText.includes("scotch tape") ||
      fullText.includes("collar stay") ||
      fullText.includes("butterfly") ||
      fullText.includes("backboard") ||
      fullText.includes("blister");

    if (isFinishingKeyword) return true;

    // Default fallback: if not identified as finishing, treat as sewing
    return false;
  };

  const finishingAcc = accessoriesItems.filter((a) => isFinishingAccessory(a));
  const sewingAcc = accessoriesItems.filter((a) => !isFinishingAccessory(a));
  const finishingAccCost = finishingAcc.reduce((s, a) => s + (Number(a.amount) || 0), 0);
  const sewingAccCost = sewingAcc.reduce((s, a) => s + (Number(a.amount) || 0), 0);

  // Others
  const otherCostItems: KnitOtherCostRow[] = Array.isArray(record.otherCostItems)
    ? record.otherCostItems
    : [];
  const totalOthersCost = otherCostItems.reduce((s, o) => s + (Number(o.amount) || 0), 0);

  // Embellishments
  const embellishmentItems: any[] = Array.isArray((record as any).embellishmentItems)
    ? (record as any).embellishmentItems
    : [];
  const totalEmbellishmentCost = embellishmentItems.reduce((s, e) => s + (Number(e.amount) || 0), 0);

  // Grand Totals (Reconciled with Entry Form)
  const grandTotalCost = totalFabricCost + totalAccessoriesCost + totalEmbellishmentCost + totalOthersCost;
  const costPerPc = totalOrderQtyPcs > 0 ? grandTotalCost / totalOrderQtyPcs : 0;
  const costPerDz = costPerPc * 12;
  const profitOrLoss = totalOrderValue - grandTotalCost;
  const profitOrLossPct = totalOrderValue > 0 ? (profitOrLoss / totalOrderValue) * 100 : 0;
  const isProfitable = profitOrLoss >= 0;

  // Process Losses for Header
  const firstFabric = fabricItems[0] || {};
  const plKnitting = firstFabric.knittingProcessLossPct ?? 3;
  const plDyeing = firstFabric.dyeingProcessLossPct ?? 4;
  const plGmt = firstFabric.rmgProcessLossPct ?? 4;
  const smv = record.smv ?? 4.25;
  const cpm = record.cpm ?? 0.065;
  const efficiencyVal =
    record.efficiencyPct !== undefined && record.efficiencyPct !== null
      ? Number(record.efficiencyPct)
      : 65;
  const eff = efficiencyVal / 100;
  const cmPerPc = Number(((smv * cpm) / (eff || 0.65)).toFixed(4));
  const cmPerDz =
    (record as any).cmDz !== undefined && (record as any).cmDz !== null && (record as any).cmDz !== ""
      ? Number((record as any).cmDz)
      : Number((cmPerPc * 12).toFixed(2));

  // Consumption Unit
  const consumptionUnit = record.consumptionUnit || "DZ";

  // Cost Breakdown / Cost Sharing (DZ-Based)
  const cmTotalValue = totalOrderQtyDz > 0 ? Number((cmPerDz * totalOrderQtyDz).toFixed(2)) : 0;
  const costSharingItemsRaw = [
    {
      name: "Fabrication & Yarn",
      rateDz: totalOrderQtyDz > 0 ? totalFabricCost / totalOrderQtyDz : 0,
      value: totalFabricCost,
      color: "bg-indigo-500",
    },
    {
      name: "Trims & Accessories",
      rateDz: totalOrderQtyDz > 0 ? totalAccessoriesCost / totalOrderQtyDz : 0,
      value: totalAccessoriesCost,
      color: "bg-teal-500",
    },
    {
      name: "Embellishment (Print/Embroidery/Wash)",
      rateDz: totalOrderQtyDz > 0 ? totalEmbellishmentCost / totalOrderQtyDz : 0,
      value: totalEmbellishmentCost,
      color: "bg-purple-500",
    },
    {
      name: "Others Cost",
      rateDz: totalOrderQtyDz > 0 ? totalOthersCost / totalOrderQtyDz : 0,
      value: totalOthersCost,
      color: "bg-amber-500",
    },
    {
      name: "CM (DZ)",
      rateDz: cmPerDz,
      value: cmTotalValue,
      color: "bg-indigo-600",
    },
  ];

  const costSharingTotalValue = costSharingItemsRaw.reduce((sum, it) => sum + it.value, 0);
  const costSharingTotalRateDz = totalOrderQtyDz > 0 ? costSharingTotalValue / totalOrderQtyDz : 0;

  const costSharingHeads = costSharingItemsRaw.map((item) => {
    const sharePct = costSharingTotalValue > 0 ? (item.value / costSharingTotalValue) * 100 : 0;
    return {
      particulars: item.name,
      rateDz: item.rateDz,
      sharePct,
      value: item.value,
      color: item.color,
    };
  });

  // Style Image resolution
  const attachments =
    record.attachments && record.attachments.length > 0 && record.attachments.some((a) => Boolean(a.dataUrl))
      ? record.attachments
      : getStoredAttachmentsForRecord(record.id, record.preCostId);

  const styleImage = attachments.find(
    (a) =>
      a.storageType === "image" ||
      (a.dataUrl && (a.dataUrl.startsWith("data:image/") || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(a.fileName)))
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ── Top Floating Action Toolbar (Hidden on Print) ─────────── */}
      <div className="print:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700/80 cursor-pointer transition-colors shadow-xs"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Register</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black text-slate-900 dark:text-white">
              {record.preCostId}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 font-semibold font-mono">
              #{record.preCostNo}
            </span>
            <span
              className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                record.status === "Approved"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : record.status === "Pending Approval"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                  : record.status === "Rejected"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              v{record.version} — {record.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && record.status === "Draft" && (
            <button
              type="button"
              onClick={() => onEdit(record)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-xs hover:bg-amber-100 cursor-pointer shadow-xs transition"
            >
              <Edit className="size-3.5" />
              <span>Edit Costing</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-sm transition"
          >
            <Printer className="size-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* ── Formal Pre-Cost Sheet Document ────────────────────────── */}
      <div
        ref={reportRef}
        className="bg-white text-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none space-y-6"
      >
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b-2 border-slate-800 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-slate-950">
              Pre-Cost Sheet Report
            </h1>
          </div>

          <div className="text-right shrink-0 space-y-1">
            <span className="inline-block px-3 py-1 rounded bg-slate-900 text-white text-xs font-black uppercase tracking-widest">
              Pre-Cost Sheet Report (Knit)
            </span>
            <div className="text-xs text-slate-600">
              Generated: <strong className="font-mono">{new Date().toISOString().substring(0, 10)}</strong>
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Consumption Unit: <strong className="text-indigo-700 font-bold">{consumptionUnit}</strong>
            </div>
          </div>
        </div>

        {/* ── Two-Column Main Layout: Detailed Tables (Left) + Summary Panels (Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ════════════════════════════════════════════════════════════
              LEFT COLUMN (col-span-8): Detailed Tables & Breakdown
             ════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-6">
            {/* A. Header – Style & Order Information */}
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-white">
              <div className="bg-slate-100/90 px-3.5 py-1.5 border-b border-slate-300 flex items-center justify-between">
                <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-800">
                  Style & Order Information
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  Job ID: {record.preCostId} • PreCost No: {record.preCostNo}
                </span>
              </div>

              <div className="p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Buyer</span>
                  <span className="font-black text-slate-900 text-sm block">{record.buyer}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Job ID</span>
                  <span className="font-mono font-black text-indigo-700 block">{record.preCostId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Style No</span>
                  <span className="font-black text-slate-900 block">{record.style}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{record.styleDescription}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">GMT Item</span>
                  <span className="font-bold text-slate-900 block">{record.gmtItem || "T-Shirt"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Category</span>
                  <span className="font-bold text-slate-900 block">{record.category || "Men"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Order Confirm Date</span>
                  <span className="font-bold text-slate-800 font-mono block">{record.preCostDate}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Season</span>
                  <span className="font-bold text-slate-800 block">{record.season}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Revision No.</span>
                  <span className="font-mono font-black text-slate-900 block">v{record.version} ({record.status})</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">SMV</span>
                  <span className="font-mono font-bold text-slate-800 block">{smv} min</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Efficiency (%)</span>
                  <span className="font-mono font-bold text-slate-800 block">{efficiencyVal}%</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">CM / Dz</span>
                  <span className="font-mono font-black text-indigo-700 block">${cmPerDz.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">PL-Knitting</span>
                  <span className="font-mono font-bold text-slate-800 block">{plKnitting}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">PL-Dyeing</span>
                  <span className="font-mono font-bold text-slate-800 block">{plDyeing}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">PL-GMT</span>
                  <span className="font-mono font-bold text-slate-800 block">{plGmt}%</span>
                </div>
                <div className="col-span-2 sm:col-span-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Reason for Revision</span>
                  <span className="text-[11px] text-slate-700 italic block truncate" title={record.amendmentReason || "Initial Pre-Costing Creation"}>
                    {record.amendmentReason || "Initial Pre-Costing Creation"}
                  </span>
                </div>
              </div>
            </div>

            {/* B. PO-wise Order Summary */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  PO-wise Order Summary
                </h3>
                <span className="text-[10px] font-mono text-slate-500">
                  {poRows.length} Purchase Order(s)
                </span>
              </div>

              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 border-b border-slate-300 text-[9.5px] uppercase font-black text-slate-600">
                    <tr>
                      <th className="py-2 px-3 w-10 text-center">SL</th>
                      <th className="py-2 px-3">PO Number</th>
                      <th className="py-2 px-3 text-right">Order Qty (Pcs)</th>
                      <th className="py-2 px-3 text-right">FOB ($/Pc)</th>
                      <th className="py-2 px-3 text-right">Total Value ($)</th>
                      <th className="py-2 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {poRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-3 px-3 text-center text-slate-400">
                          No PO lines entered. Using consolidated order quantity.
                        </td>
                      </tr>
                    ) : (
                      poRows.map((po, idx) => (
                        <tr key={po.id || idx} className="hover:bg-slate-50">
                          <td className="py-1.5 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-1.5 px-3 font-mono font-bold text-slate-900">{po.poNumber}</td>
                          <td className="py-1.5 px-3 text-right font-mono font-bold">
                            {(Number(po.poQuantity) || 0).toLocaleString()} pcs
                          </td>
                          <td className="py-1.5 px-3 text-right font-mono text-slate-700">
                            ${(Number(po.rate) || 0).toFixed(4)}
                          </td>
                          <td className="py-1.5 px-3 text-right font-mono font-black text-slate-900">
                            ${(Number(po.value) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-1.5 px-3 text-[11px] text-slate-500">{po.remarks || "—"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100/90 font-black border-t-2 border-slate-300 text-slate-900 text-xs">
                      <td colSpan={2} className="py-2 px-3 text-right uppercase text-[10px] tracking-wider">
                        Total Order Summary:
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-indigo-700">
                        {totalOrderQtyPcs.toLocaleString()} pcs
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-[10px] text-slate-600">
                        Avg: ${averageFobRate.toFixed(4)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-indigo-700 text-sm">
                        ${totalOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* C. Fabrication & Process Cost by Fabric */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Fabrication & Process Cost by Fabric
                </h3>
                <span className="text-[10px] font-mono text-slate-500">
                  {fabricItems.length} Fabric Head(s)
                </span>
              </div>

              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 border-b border-slate-300 text-[9.5px] uppercase font-black text-slate-600">
                    <tr>
                      <th className="py-2 px-2.5 w-24">Fabric Ref</th>
                      <th className="py-2 px-3">Fabric Description</th>
                      <th className="py-2 px-2.5 text-right w-24">Qty (Kg)</th>
                      <th className="py-2 px-2.5 text-right w-20">Knit ($)</th>
                      <th className="py-2 px-2.5 text-right w-20">Dye ($)</th>
                      <th className="py-2 px-2.5 text-right w-20">Fin ($)</th>
                      <th className="py-2 px-3 text-right w-24">Total ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {fabricItems.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-3 px-3 text-center text-slate-400">
                          No fabric costing items found.
                        </td>
                      </tr>
                    ) : (
                      fabricItems.map((f, idx) => {
                        const totalProcessCost =
                          (Number(f.knittingCost) || 0) + (Number(f.dyeingCost) || 0) + totalFinishingCost;
                        return (
                          <tr key={f.id || idx} className="hover:bg-slate-50">
                            <td className="py-2 px-2.5 font-bold text-slate-900 font-mono text-[11px]">
                              {f.head || `FAB-0${idx + 1}`}
                            </td>
                            <td className="py-2 px-3">
                              <span className="font-bold text-slate-900 block">{f.item}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Shade: {f.colorShade} • Method: {f.dyeingMethod}
                              </span>
                            </td>
                            <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-800">
                              {(Number(f.requiredYarnKg) || Number(f.requiredGreigeQty) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-2 px-2.5 text-right font-mono text-slate-700">
                              ${(Number(f.knittingCost) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-2 px-2.5 text-right font-mono text-slate-700">
                              ${(Number(f.dyeingCost) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-2 px-2.5 text-right font-mono text-slate-400">
                              $0.00
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-black text-indigo-700">
                              ${totalProcessCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100/90 font-black border-t-2 border-slate-300 text-slate-900 text-xs">
                      <td colSpan={2} className="py-2 px-3 text-right uppercase text-[10px] tracking-wider">
                        Fabric Process Totals:
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-900">
                        {fabricItems.reduce((s, f) => s + (Number(f.requiredYarnKg) || 0), 0).toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-800">
                        ${totalKnittingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-800">
                        ${totalDyeingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-500">
                        $0.00
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-indigo-700 text-sm">
                        ${(totalKnittingCost + totalDyeingCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* D. Detailed Cost Sheet (Category-wise) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Detailed Cost Sheet (Category-Wise)
                </h3>
                <span className="text-[10px] font-mono text-slate-500">
                  Unit: {consumptionUnit}
                </span>
              </div>

              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 border-b border-slate-300 text-[9.5px] uppercase font-black text-slate-600">
                    <tr>
                      <th className="py-2 px-3 w-40">Category</th>
                      <th className="py-2 px-3">Item Description</th>
                      <th className="py-2 px-2 text-right w-24">Consumption</th>
                      <th className="py-2 px-2 text-right w-24">Quantity</th>
                      <th className="py-2 px-2 text-right w-24">Price ($)</th>
                      <th className="py-2 px-3 text-right w-28">Total (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {/* 1. Category: Yarn */}
                    <tr className="bg-slate-50/90 font-black text-slate-800 text-[11px] border-t border-slate-300">
                      <td colSpan={6} className="py-1.5 px-3 uppercase text-indigo-800 tracking-wider">
                        1. Yarn Details
                      </td>
                    </tr>
                    {fabricItems.flatMap((f, fIdx) =>
                      (f.yarnDetails || []).map((y, yIdx) => {
                        const consVal =
                          totalOrderQtyDz > 0
                            ? Number((y.finalQtyKg / totalOrderQtyDz).toFixed(4))
                            : 0;
                        return (
                          <tr key={`yd-${fIdx}-${yIdx}`} className="hover:bg-slate-50 text-[11.5px]">
                            <td className="py-1.5 px-3 text-slate-500 font-mono text-[10px]">
                              Yarn — {f.head}
                            </td>
                            <td className="py-1.5 px-3">
                              <span className="font-bold text-slate-900 block">
                                {y.yarnItem || `${y.yarnCount} ${y.yarnComposition}`}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                Grade: {y.grade} • Ratio: {y.ratioPct}% • Vendor: {y.brand}
                              </span>
                            </td>
                            <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                              {consVal} kg/{consumptionUnit.toLowerCase()}
                            </td>
                            <td className="py-1.5 px-2 text-right font-mono font-semibold text-slate-800">
                              {(Number(y.finalQtyKg) || 0).toLocaleString()} kg
                            </td>
                            <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                              ${(Number(y.ratePerKg) || 0).toFixed(2)}/kg
                            </td>
                            <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">
                              ${(Number(y.yarnCost) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      })
                    )}
                    <tr className="bg-indigo-50/50 font-bold text-indigo-900 text-xs">
                      <td colSpan={5} className="py-1.5 px-3 text-right uppercase text-[10px]">
                        Sub Total — Yarn:
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-black text-indigo-900">
                        ${totalYarnCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>

                    {/* 2. Category: Knitting Process */}
                    <tr className="bg-slate-50/90 font-black text-slate-800 text-[11px] border-t border-slate-300">
                      <td colSpan={6} className="py-1.5 px-3 uppercase text-indigo-800 tracking-wider">
                        2. Knitting Process
                      </td>
                    </tr>
                    {fabricItems.map((f, idx) => (
                      <tr key={`knit-${idx}`} className="hover:bg-slate-50 text-[11.5px]">
                        <td className="py-1.5 px-3 text-slate-500 font-mono text-[10px]">
                          Knitting — {f.head}
                        </td>
                        <td className="py-1.5 px-3 font-semibold text-slate-900">
                          {f.item} Knitting (Loss: {f.knittingProcessLossPct}%)
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                          {f.consumptionKgDz} kg/{consumptionUnit.toLowerCase()}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono font-semibold text-slate-800">
                          {(Number(f.requiredYarnKg) || 0).toLocaleString()} kg
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                          ${(Number(f.knittingRate) || 0).toFixed(2)}/kg
                        </td>
                        <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">
                          ${(Number(f.knittingCost) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-indigo-50/50 font-bold text-indigo-900 text-xs">
                      <td colSpan={5} className="py-1.5 px-3 text-right uppercase text-[10px]">
                        Sub Total — Knitting Process:
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-black text-indigo-900">
                        ${totalKnittingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>

                    {/* 3. Category: Dyeing Process */}
                    <tr className="bg-slate-50/90 font-black text-slate-800 text-[11px] border-t border-slate-300">
                      <td colSpan={6} className="py-1.5 px-3 uppercase text-indigo-800 tracking-wider">
                        3. Dyeing Process
                      </td>
                    </tr>
                    {fabricItems.map((f, idx) => (
                      <tr key={`dye-${idx}`} className="hover:bg-slate-50 text-[11.5px]">
                        <td className="py-1.5 px-3 text-slate-500 font-mono text-[10px]">
                          Dyeing — {f.head}
                        </td>
                        <td className="py-1.5 px-3">
                          <span className="font-semibold text-slate-900 block">
                            {f.item} Dyeing
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Shade: {f.colorShade} • Method: {f.dyeingMethod} • Loss: {f.dyeingProcessLossPct}%
                          </span>
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                          {f.consumptionKgDz} kg/{consumptionUnit.toLowerCase()}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono font-semibold text-slate-800">
                          {(Number(f.requiredGreigeQty) || 0).toLocaleString()} kg
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                          ${(Number(f.dyeingRate) || 0).toFixed(2)}/kg
                        </td>
                        <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">
                          ${(Number(f.dyeingCost) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-indigo-50/50 font-bold text-indigo-900 text-xs">
                      <td colSpan={5} className="py-1.5 px-3 text-right uppercase text-[10px]">
                        Sub Total — Dyeing Process:
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-black text-indigo-900">
                        ${totalDyeingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>

                    {/* 4. Category: Sewing Accessories */}
                    <tr className="bg-slate-50/90 font-black text-slate-800 text-[11px] border-t border-slate-300">
                      <td colSpan={6} className="py-1.5 px-3 uppercase text-indigo-800 tracking-wider">
                        4. Sewing Accessories
                      </td>
                    </tr>
                    {sewingAcc.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-1.5 px-3 text-slate-400 italic text-center">
                          No sewing accessories entered.
                        </td>
                      </tr>
                    ) : (
                      sewingAcc.map((item, idx) => (
                        <tr key={`sew-${idx}`} className="hover:bg-slate-50 text-[11.5px]">
                          <td className="py-1.5 px-3 text-slate-500 font-mono text-[10px]">
                            {item.head}
                          </td>
                          <td className="py-1.5 px-3">
                            <span className="font-semibold text-slate-900 inline-flex items-center gap-1.5">
                              <span>{item.item}</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[9.5px] font-mono font-bold text-slate-600">
                                {item.unit || "Pcs"}
                              </span>
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {item.description || item.supplier} • {item.nStatus}
                            </span>
                          </td>
                          <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                            {item.consumption}
                          </td>
                          <td className="py-1.5 px-2 text-right font-mono font-semibold text-slate-800">
                            {(Number(item.finalQty) || 0).toLocaleString()} {item.unit || "pcs"}
                          </td>
                          <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                            ${(Number(item.rate) || 0).toFixed(3)}
                          </td>
                          <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">
                            ${(Number(item.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                    <tr className="bg-indigo-50/50 font-bold text-indigo-900 text-xs">
                      <td colSpan={5} className="py-1.5 px-3 text-right uppercase text-[10px]">
                        Sub Total — Sewing Accessories:
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-black text-indigo-900">
                        ${sewingAccCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>

                    {/* 5. Category: Finishing Accessories */}
                    <tr className="bg-slate-50/90 font-black text-slate-800 text-[11px] border-t border-slate-300">
                      <td colSpan={6} className="py-1.5 px-3 uppercase text-indigo-800 tracking-wider">
                        5. Finishing Accessories
                      </td>
                    </tr>
                    {finishingAcc.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-1.5 px-3 text-slate-400 italic text-center">
                          No finishing accessories entered.
                        </td>
                      </tr>
                    ) : (
                      finishingAcc.map((item, idx) => (
                        <tr key={`fin-${idx}`} className="hover:bg-slate-50 text-[11.5px]">
                          <td className="py-1.5 px-3 text-slate-500 font-mono text-[10px]">
                            {item.head}
                          </td>
                          <td className="py-1.5 px-3">
                            <span className="font-semibold text-slate-900 inline-flex items-center gap-1.5">
                              <span>{item.item}</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[9.5px] font-mono font-bold text-slate-600">
                                {item.unit || "Pcs"}
                              </span>
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {item.description || item.supplier} • {item.nStatus}
                            </span>
                          </td>
                          <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                            {item.consumption}
                          </td>
                          <td className="py-1.5 px-2 text-right font-mono font-semibold text-slate-800">
                            {(Number(item.finalQty) || 0).toLocaleString()} {item.unit || "pcs"}
                          </td>
                          <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                            ${(Number(item.rate) || 0).toFixed(3)}
                          </td>
                          <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">
                            ${(Number(item.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                    <tr className="bg-indigo-50/50 font-bold text-indigo-900 text-xs">
                      <td colSpan={5} className="py-1.5 px-3 text-right uppercase text-[10px]">
                        Sub Total — Finishing Accessories:
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-black text-indigo-900">
                        ${finishingAccCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>

                    {/* 6. Category: Embellishment Cost */}
                    <tr className="bg-slate-50/90 font-black text-slate-800 text-[11px] border-t border-slate-300">
                      <td colSpan={6} className="py-1.5 px-3 uppercase text-indigo-800 tracking-wider">
                        6. Embellishment (Print, Embroidery & Wash)
                      </td>
                    </tr>
                    {embellishmentItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-1.5 px-3 text-slate-400 italic text-center">
                          No embellishment items entered.
                        </td>
                      </tr>
                    ) : (
                      embellishmentItems.map((e, idx) => (
                        <tr key={`emb-${idx}`} className="hover:bg-slate-50 text-[11.5px]">
                          <td className="py-1.5 px-3 text-slate-500 font-mono text-[10px]">
                            {e.costHead || "Embellishment"}
                          </td>
                          <td className="py-1.5 px-3 font-semibold text-slate-900">
                            {e.description || e.costHead}
                            <span className="text-[10px] text-slate-500 block">
                              Source: {e.source || "In-house"}
                            </span>
                          </td>
                          <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                            {(Number(e.qtyInDz) || 0).toLocaleString()} dz
                          </td>
                          <td className="py-1.5 px-2 text-right font-mono font-semibold text-slate-800">
                            {(Number(e.gmtQty) || 0).toLocaleString()} pcs
                          </td>
                          <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                            ${(Number(e.unitRateDz) || 0).toFixed(3)}/dz
                          </td>
                          <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">
                            ${(Number(e.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                    <tr className="bg-indigo-50/50 font-bold text-indigo-900 text-xs">
                      <td colSpan={5} className="py-1.5 px-3 text-right uppercase text-[10px]">
                        Sub Total — Embellishments:
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-black text-indigo-900">
                        ${totalEmbellishmentCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>

                    {/* 7. Category: Others Cost */}
                    <tr className="bg-slate-50/90 font-black text-slate-800 text-[11px] border-t border-slate-300">
                      <td colSpan={6} className="py-1.5 px-3 uppercase text-indigo-800 tracking-wider">
                        7. Others Cost
                      </td>
                    </tr>
                    {otherCostItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-1.5 px-3 text-slate-400 italic text-center">
                          No others cost heads entered.
                        </td>
                      </tr>
                    ) : (
                      otherCostItems.map((o, idx) => {
                        const isPct = o.costHead === "Commercial Cost" || o.costHead === "Commission";
                        return (
                          <tr key={`oth-${idx}`} className="hover:bg-slate-50 text-[11.5px]">
                            <td className="py-1.5 px-3 text-slate-500 font-mono text-[10px]">
                              {o.costHead || o.head || "Others"}
                            </td>
                            <td className="py-1.5 px-3 font-semibold text-slate-900">
                              {o.description}
                            </td>
                            <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                              {isPct ? "—" : `${(o.qtyInDz ?? Number((totalOrderQtyPcs / 12).toFixed(2))).toLocaleString()} dz`}
                            </td>
                            <td className="py-1.5 px-2 text-right font-mono font-semibold text-slate-800">
                              {isPct ? "—" : `${(o.gmtQty ?? totalOrderQtyPcs).toLocaleString()} pcs`}
                            </td>
                            <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                              {isPct
                                ? `${o.costPercent ?? o.rateOrPct ?? 0}%`
                                : `$${(Number(o.unitRateDz) || 0).toFixed(3)}/dz`}
                            </td>
                            <td className="py-1.5 px-3 text-right font-mono font-bold text-slate-900">
                              ${(Number(o.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      })
                    )}
                    <tr className="bg-indigo-50/50 font-bold text-indigo-900 text-xs">
                      <td colSpan={5} className="py-1.5 px-3 text-right uppercase text-[10px]">
                        Sub Total — Others Cost:
                      </td>
                      <td className="py-1.5 px-3 text-right font-mono font-black text-indigo-900">
                        ${totalOthersCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-900 font-black text-white text-xs border-t-2 border-slate-900">
                      <td colSpan={5} className="py-3 px-3 text-right uppercase tracking-wider text-amber-300">
                        Grand Total Cost (Fabric + Trims + Commercial):
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-amber-300 text-sm">
                        ${grandTotalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* I. Approval History Timeline */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Approval Workflow History
              </h3>

              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 border-b border-slate-300 text-[9.5px] uppercase font-black text-slate-600">
                    <tr>
                      <th className="py-2 px-3 w-12 text-center">Step</th>
                      <th className="py-2 px-3">Role / Stage</th>
                      <th className="py-2 px-3">User Name</th>
                      <th className="py-2 px-3">Designation</th>
                      <th className="py-2 px-3 text-center">Status</th>
                      <th className="py-2 px-3 text-right">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {/* Step 1: Prepared */}
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-400">1</td>
                      <td className="py-2 px-3 font-bold text-slate-900">Preparation & Costing</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        {(() => {
                          const c = (record.createdBy || record.merchandiser || "").trim();
                          if (!c || c.toLowerCase().includes("shapno") || c.toLowerCase().includes("tanvir")) {
                            return "Rashidul Islam";
                          }
                          return c;
                        })()}
                      </td>
                      <td className="py-2 px-3 text-slate-500">Merchandiser</td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Completed
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">
                        {record.createdDate || record.preCostDate}
                      </td>
                    </tr>

                    {/* Step 2: Checked */}
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-400">2</td>
                      <td className="py-2 px-3 font-bold text-slate-900">Costing Verification</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        Md. Rashidul Islam
                      </td>
                      <td className="py-2 px-3 text-slate-500">Sr. Merchandiser / Costing</td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            record.status === "Approved" || record.status === "Pending Approval"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {record.status === "Approved" || record.status === "Pending Approval"
                            ? "Verified"
                            : "Pending"}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">
                        {record.status === "Draft" ? "—" : record.preCostDate}
                      </td>
                    </tr>

                    {/* Step 3: Authorized */}
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-400">3</td>
                      <td className="py-2 px-3 font-bold text-slate-900">Final Authorization</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        {record.approvedBy || (record.status === "Approved" ? "GM Marketing & Merchandising" : "Pending Authorization")}
                      </td>
                      <td className="py-2 px-3 text-slate-500">Head of Merchandising</td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                            record.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : record.status === "Pending Approval"
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : record.status === "Rejected"
                              ? "bg-rose-100 text-rose-800 border-rose-300"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">
                        {record.approvalDate || (record.status === "Approved" ? record.preCostDate : "—")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
              RIGHT COLUMN (col-span-4): Summary Panels & Indicators
             ════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 space-y-5">
            {/* Style Image Card */}
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
              <div className="bg-slate-100 px-3.5 py-1.5 border-b border-slate-300 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="size-3.5 text-indigo-600" />
                  Style Image
                </span>
                <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">
                  {record.style}
                </span>
              </div>
              <div className="p-3 flex items-center justify-center bg-slate-50/60 min-h-[140px] max-h-[220px] overflow-hidden">
                {styleImage?.dataUrl ? (
                  <img
                    src={styleImage.dataUrl}
                    alt={styleImage.title || record.style || "Style Image"}
                    className="max-h-[200px] w-auto max-w-full object-contain rounded-lg border border-slate-200 shadow-2xs"
                  />
                ) : (
                  <div className="text-center py-5 px-3">
                    <ImageIcon className="size-8 text-slate-300 mx-auto mb-1" />
                    <p className="text-[11px] font-semibold text-slate-600">No Style Image Uploaded</p>
                    <p className="text-[9.5px] text-slate-400 mt-0.5">
                      Upload style sketches or photos under Style & Pre Costing Images in Pre Costing Entry.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* E. Right-side Order & Cost Summary Card */}
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50/60 shadow-xs">
              <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider">
                  Order & Cost Summary
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${
                    isProfitable ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                  }`}
                >
                  {isProfitable ? "Profitable" : "Deficit"}
                </span>
              </div>

              <div className="p-4 space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-600">Total Order Qty</span>
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {totalOrderQtyPcs.toLocaleString()} pcs
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-600">Order Value (FOB)</span>
                  <span className="font-mono font-black text-indigo-700 text-sm">
                    ${totalOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-600">Total Cost</span>
                  <span className="font-mono font-black text-slate-900 text-sm">
                    ${grandTotalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-600">Cost per Pc</span>
                  <span className="font-mono font-black text-slate-900">
                    ${costPerPc.toFixed(4)} / pc
                  </span>
                </div>

                <div
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    isProfitable
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-rose-50 border-rose-300 text-rose-900"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block">
                      {isProfitable ? "Profit Margin" : "Loss Margin"}
                    </span>
                    <span className="text-base font-mono font-black block">
                      ${Math.abs(profitOrLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider block">
                      Percentage
                    </span>
                    <span className="text-lg font-mono font-black flex items-center gap-1 justify-end">
                      {isProfitable ? (
                        <TrendingUp className="size-4 text-emerald-600" />
                      ) : (
                        <TrendingDown className="size-4 text-rose-600" />
                      )}
                      {profitOrLossPct.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* F. Cost Breakdown / Cost Sharing (DZ-Based) */}
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
              <div className="bg-slate-100/90 px-3.5 py-2 border-b border-slate-300 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">
                  Cost Breakdown / Cost Sharing (DZ-Based)
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 font-mono">
                  DZ Basis
                </span>
              </div>

              <div className="p-3">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[9.5px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="py-1.5 px-2">Particulars</th>
                      <th className="py-1.5 px-2 text-right">Rate/Dz</th>
                      <th className="py-1.5 px-2 text-right">Share (%)</th>
                      <th className="py-1.5 px-2 text-right">Value ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11.5px]">
                    {costSharingHeads.map((head, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-1.5 px-2 font-semibold text-slate-800">
                          {head.particulars}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono font-bold text-slate-900">
                          ${head.rateDz.toFixed(2)}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono font-bold text-indigo-700">
                          {head.sharePct.toFixed(1)}%
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono text-slate-700">
                          ${head.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-black border-t-2 border-slate-300 text-xs">
                      <td className="py-2 px-2 uppercase text-[10px]">Grand Total:</td>
                      <td className="py-2 px-2 text-right font-mono text-indigo-700">
                        ${costSharingTotalRateDz.toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-right font-mono text-indigo-700">
                        100.0%
                      </td>
                      <td className="py-2 px-2 text-right font-mono text-indigo-700">
                        ${costSharingTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* G. Key Takeaways Panel */}
            <div className="border border-indigo-200 bg-indigo-50/40 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-indigo-900">
                <CheckCircle2 className="size-4 text-indigo-600" />
                <h4 className="text-xs font-black uppercase tracking-wider">
                  Key Takeaways
                </h4>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>
                    <strong>Profitability Position:</strong> Order yields a{" "}
                    <strong className={isProfitable ? "text-emerald-700" : "text-rose-700"}>
                      {profitOrLossPct.toFixed(2)}%
                    </strong>{" "}
                    margin (<strong>${profitOrLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>) on target FOB of{" "}
                    <strong>${averageFobRate.toFixed(4)}/pc</strong> (${averageFobRateDz.toFixed(2)}/dz).
                  </span>
                </li>

                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>
                    <strong>Unit Economics:</strong> Production cost per garment is{" "}
                    <strong>${costPerPc.toFixed(4)}/pc</strong> (${costPerDz.toFixed(2)}/dz) with CM/Dz evaluated at <strong>${cmPerDz.toFixed(2)}</strong>.
                  </span>
                </li>

                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>
                    <strong>Primary Cost Driver:</strong> Fabric & Yarn constitutes{" "}
                    <strong>{((totalFabricCost / (grandTotalCost || 1)) * 100).toFixed(1)}%</strong> of total cost (${totalFabricCost.toLocaleString()}).
                  </span>
                </li>

                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>
                    <strong>Trims & Accessories:</strong> Accessories share accounts for{" "}
                    <strong>{((totalAccessoriesCost / (grandTotalCost || 1)) * 100).toFixed(1)}%</strong> (${totalAccessoriesCost.toLocaleString()}).
                  </span>
                </li>

                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>
                    <strong>Manufacturing Process Losses:</strong> Factored {plKnitting}% Knitting, {plDyeing}% Dyeing, and {plGmt}% RMG cutting loss.
                  </span>
                </li>
              </ul>
            </div>

            {/* Formal Signatures Box */}
            <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-4 text-center text-xs">
              <div className="border-t border-slate-400 pt-1">
                <p className="font-bold text-slate-800">
                  {(() => {
                    const m = (record.merchandiser || "").trim();
                    if (!m || m.toLowerCase().includes("shapno") || m.toLowerCase().includes("tanvir")) {
                      return "Rashidul Islam";
                    }
                    return m;
                  })()}
                </p>
                <p className="text-[10px] text-slate-500">Merchandiser</p>
              </div>
              <div className="border-t border-slate-400 pt-1">
                <p className="font-bold text-slate-800">
                  {record.approvedBy || (record.status === "Approved" ? "GM Merchandising" : "Authorized Signature")}
                </p>
                <p className="text-[10px] text-slate-500">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreCostingKnitReport;

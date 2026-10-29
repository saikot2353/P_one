import React, { useEffect } from "react";
import { Printer, X, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import pakizaLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";
import { MMCadItemRow, MMFabricConsumptionAttachment } from "../../lib/marketing-merchandising-data";

export interface FabricConsumptionPreviewData {
  requestNo: string;
  requestDate: string;
  buyer: string;
  styleOrder: string;
  efficiency?: string;
  sizeRange?: string;
  fabrication?: string;
  season?: string;
  merchandiser: string;
  requestRemarks?: string;
  submittedDate?: string;
  cadAssignedTo?: string;
  cadResponseDate?: string;
  cadSubmittedBy?: string;
  status: string;
  cadResponseStatus: string;
  notes?: string;
  comments?: string;
  attachments?: MMFabricConsumptionAttachment[];
  rows: MMCadItemRow[];
  totals: {
    totalFinishKg: number;
    totalWaste10Kg: number;
    wash10Pct: number;
  };
}

interface FabricConsumptionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FabricConsumptionPreviewData;
}

export default function FabricConsumptionPreviewModal({
  isOpen,
  onClose,
  data,
}: FabricConsumptionPreviewModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const autoCount = data.rows.filter((r) => r.calculationMode === "Auto").length;
  const manualCount = data.rows.filter((r) => r.calculationMode === "Manual").length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto">
      {/* Print-specific style overrides */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #fabric-consumption-report-modal,
          #fabric-consumption-report-modal * {
            visibility: visible;
          }
          #fabric-consumption-report-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-full-width {
            width: 100% !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
        }
      `}</style>

      {/* Modal Dialog Card */}
      <div
        id="fabric-consumption-report-modal"
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden print:max-h-none print:border-none print:shadow-none print:rounded-none"
      >
        {/* Top Control Bar (Screen Only) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-600 text-white">
              <FileText className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Fabric Consumption (CAD) — Preview Report
              </h3>
              <p className="text-[11px] text-slate-500">
                Official CAD fabric calculation summary & request dossier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Printer className="size-3.5" />
              <span>Print Report</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              title="Close Preview (Esc)"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Content Container */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 print:p-6 print:overflow-visible text-slate-800 dark:text-slate-200">
          {/* ── Document Header ── */}
          <div className="border-b-2 border-slate-900 dark:border-slate-300 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={pakizaLogo}
                  alt="Pakiza Logo"
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-950 dark:text-white uppercase">
                    Pakiza Knit Composite Ltd.
                  </h1>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Marketing & Merchandising Division — CAD Department
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Shilmuri, Madhabdi, Narsingdi, Bangladesh | Web: www.pakizaknit.com
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-[11px] font-black tracking-wider uppercase text-slate-900 dark:text-white">
                  CAD FABRIC CONSUMPTION REPORT
                </span>
                <div className="mt-1 text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
                  {data.requestNo}
                </div>
                <div className="text-[11px] text-slate-500">
                  Date: <span className="font-semibold text-slate-700 dark:text-slate-300">{data.requestDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Request Header Information ── */}
          <div className="rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-50/50 dark:bg-slate-800/30">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-slate-300 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Request Header Information
              </span>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Status: <strong className="text-teal-700 dark:text-teal-400 font-bold">{data.status}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-4 p-4 text-xs">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Request No</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{data.requestNo}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Request Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{data.requestDate}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Buyer</span>
                <span className="font-bold text-slate-900 dark:text-white">{data.buyer}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Style</span>
                <span className="font-bold text-slate-900 dark:text-white">{data.styleOrder}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Marker Efficiency</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-400 font-mono">
                  {data.efficiency ? `${data.efficiency}%` : "—"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Size Range</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{data.sizeRange || "—"}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Fabrication</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{data.fabrication || "—"}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Season</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{data.season || "—"}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Merchandiser</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{data.merchandiser}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">CAD Assigned To</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{data.cadAssignedTo || "—"}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">CAD Response Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{data.cadResponseDate || "Pending"}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">CAD Response Status</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{data.cadResponseStatus}</span>
              </div>
            </div>
          </div>

          {/* ── CAD Fabric Consumption Details Table ── */}
          {/* Note: Columns "Law", "Consumption", and "Cuttable finish" are strictly EXCLUDED as required */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                CAD Fabric Consumption Details
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                {data.rows.length} Body Part {data.rows.length === 1 ? "Row" : "Rows"} | {autoCount} Auto, {manualCount} Manual
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700 print:overflow-visible">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-300 dark:border-slate-700 text-left whitespace-nowrap">
                    <th className="py-2 px-2.5 text-center w-8">SL</th>
                    <th className="py-2 px-2.5 min-w-[160px]">Name of Body Parts</th>
                    <th className="py-2 px-2 text-right">Marker Length</th>
                    <th className="py-2 px-2 text-right">DIA Finish</th>
                    <th className="py-2 px-2 text-right">DIA Cut</th>
                    <th className="py-2 px-2 text-right">Marker QTY</th>
                    <th className="py-2 px-2 text-right">Fabric GSM</th>
                    <th className="py-2 px-2 text-center">Calculation</th>
                    <th className="py-2 px-2.5 text-right font-black text-emerald-800 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20">
                      Finish/KG Consumption
                    </th>
                    <th className="py-2 px-2.5 text-right font-black text-teal-800 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20">
                      Waste+10%/KG
                    </th>
                    <th className="py-2 px-2 text-center">DIA make</th>
                    <th className="py-2 px-2.5 text-right font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20">
                      WASH 10%
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {data.rows.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-8 text-center text-slate-400 italic">
                        No body part calculation rows entered yet.
                      </td>
                    </tr>
                  ) : (
                    data.rows.map((row, idx) => (
                      <tr
                        key={row.id || idx}
                        className={
                          row.calculationMode === "Manual"
                            ? "bg-amber-50/30 dark:bg-amber-950/10"
                            : "hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                        }
                      >
                        <td className="py-1.5 px-2 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-1.5 px-2.5 font-bold text-slate-900 dark:text-slate-100">
                          {row.bodyPart || "—"}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono">
                          {row.markerLength !== undefined && row.markerLength !== null
                            ? Number(row.markerLength).toFixed(2)
                            : "—"}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono">
                          {row.diaFinish !== undefined && row.diaFinish !== null
                            ? Number(row.diaFinish).toFixed(2)
                            : "—"}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono">
                          {row.diaCut !== undefined && row.diaCut !== null
                            ? Number(row.diaCut).toFixed(2)
                            : "—"}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono font-semibold">
                          {row.markerQty !== undefined && row.markerQty !== null
                            ? Number(row.markerQty)
                            : "—"}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono">
                          {row.fabricGsm !== undefined && row.fabricGsm !== null
                            ? Number(row.fabricGsm)
                            : "—"}
                        </td>
                        <td className="py-1.5 px-2 text-center">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              row.calculationMode === "Manual"
                                ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                                : "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                            }`}
                          >
                            {row.calculationMode || "Auto"}
                          </span>
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10">
                          {row.finishKgConsumption !== undefined && row.finishKgConsumption !== null
                            ? Number(row.finishKgConsumption).toFixed(3)
                            : "—"}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-bold text-teal-800 dark:text-teal-400 bg-teal-50/30 dark:bg-teal-950/10">
                          {row.waste10Consumption !== undefined && row.waste10Consumption !== null
                            ? Number(row.waste10Consumption).toFixed(3)
                            : "—"}
                        </td>
                        <td className="py-1.5 px-2 text-center font-bold uppercase text-slate-700 dark:text-slate-300">
                          {row.diaMake || "—"}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-mono font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/10">
                          {idx === 0 ? data.totals.wash10Pct.toFixed(3) : ""}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                <tfoot>
                  <tr className="bg-slate-200/90 dark:bg-slate-800 font-black text-slate-900 dark:text-white border-t-2 border-slate-400 dark:border-slate-600">
                    <td colSpan={7} className="py-2.5 px-3 text-right uppercase tracking-wider text-[11px]">
                      Finish Total:
                    </td>
                    <td className="py-2.5 px-2 text-center text-[10px] text-slate-600 dark:text-slate-400">
                      {autoCount} Auto / {manualCount} Man
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/60">
                      {data.totals.totalFinishKg.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono text-xs text-teal-800 dark:text-teal-300 bg-teal-100/60 dark:bg-teal-950/60">
                      {data.totals.totalWaste10Kg.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-2 text-center text-[10px] uppercase text-slate-500">
                      WASH 10%:
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono text-xs text-indigo-800 dark:text-indigo-300 font-black bg-indigo-100/60 dark:bg-indigo-950/60">
                      {data.totals.wash10Pct.toFixed(3)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ── Consumption Summary Highlights ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30">
              <span className="block text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                Total Finish Fabric
              </span>
              <span className="text-sm font-black font-mono text-emerald-900 dark:text-emerald-200">
                {data.totals.totalFinishKg.toFixed(3)} Kg
              </span>
            </div>
            <div className="p-3 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30">
              <span className="block text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400">
                Total Waste (+10%)
              </span>
              <span className="text-sm font-black font-mono text-teal-900 dark:text-teal-200">
                {data.totals.totalWaste10Kg.toFixed(3)} Kg
              </span>
            </div>
            <div className="p-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30">
              <span className="block text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400">
                WASH 10% (Total Waste)
              </span>
              <span className="text-sm font-black font-mono text-indigo-900 dark:text-indigo-200">
                {data.totals.wash10Pct.toFixed(3)} Kg
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
              <span className="block text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">
                Marker Efficiency
              </span>
              <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
                {data.efficiency ? `${data.efficiency}%` : "N/A"}
              </span>
            </div>
          </div>

          {/* ── Remarks & Notes ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-500">Merchant Request Remarks</span>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                {data.requestRemarks || "No special merchant remarks provided."}
              </p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-500">CAD Cutting Instructions & Comments</span>
              <p className="text-slate-700 dark:text-slate-300 font-bold uppercase">
                {data.comments || "ONE BODY ONE WAY CUTTING."}
              </p>
              {data.notes && data.notes !== ".." && (
                <p className="text-[11px] text-slate-500">Note: {data.notes}</p>
              )}
            </div>
          </div>

          {/* ── Attachments Summary (if any) ── */}
          {data.attachments && data.attachments.length > 0 && (
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/20 text-xs">
              <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                Attached References ({data.attachments.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {data.attachments.map((att) => (
                  <span
                    key={att.id}
                    className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300"
                  >
                    📎 {att.fileName} ({att.fileSize})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Authorized Signatures Block ── */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-xs">
            <div className="space-y-1">
              <div className="border-t border-slate-400 dark:border-slate-600 pt-2 font-bold text-slate-900 dark:text-white">
                {data.merchandiser}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Prepared By (Merchandiser)
              </div>
            </div>
            <div className="space-y-1">
              <div className="border-t border-slate-400 dark:border-slate-600 pt-2 font-bold text-slate-900 dark:text-white">
                {data.cadSubmittedBy || data.cadAssignedTo || "CAD In-Charge"}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Calculated By (CAD)
              </div>
            </div>
            <div className="space-y-1">
              <div className="border-t border-slate-400 dark:border-slate-600 pt-2 font-bold text-slate-900 dark:text-white">
                Technical Manager
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Verified By (Marker QA)
              </div>
            </div>
            <div className="space-y-1">
              <div className="border-t border-slate-400 dark:border-slate-600 pt-2 font-bold text-slate-900 dark:text-white">
                Head of Merchandising
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Approved By (HOD)
              </div>
            </div>
          </div>

          {/* Document Footer (Print Only / Reference) */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex items-center justify-between text-[9px] text-slate-400">
            <span>Pakiza HRIS/ERP — Merchandising CAD Consumption System</span>
            <span>Generated: {new Date().toLocaleString()} | Confidential</span>
          </div>
        </div>
      </div>
    </div>
  );
}

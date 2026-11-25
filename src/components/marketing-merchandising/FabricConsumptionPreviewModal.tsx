import React, { useEffect } from "react";
import { Printer, X, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import pakizaLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";
import { MMCadItemRow, MMFabricConsumptionAttachment } from "../../lib/marketing-merchandising-data";

export interface FabricConsumptionPreviewData {
  requestNo: string;
  requestDate: string;
  jobId?: string;
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
  gmtImage?: { id: string; name: string; dataUrl: string; size?: string } | string;
  cadImages?: Array<{ id: string; name: string; dataUrl: string; size?: string }>;
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
        @page {
          size: landscape;
          margin: 10mm;
        }
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
        className="relative w-full max-w-6xl xl:max-w-[1360px] 2xl:max-w-[1440px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[96vh] overflow-hidden print:max-h-none print:border-none print:shadow-none print:rounded-none"
      >
        {/* Top Control Bar (Screen Only) */}
        <div className="no-print flex items-center justify-between px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 shrink-0">
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
              className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Printer className="size-3.5" />
              <span>Print Report</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              title="Close Preview (Esc)"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 print:p-4 print:space-y-2 text-slate-800 dark:text-slate-200">
          {/* ── Document Header ── */}
          <div className="border-b-2 border-slate-900 dark:border-slate-300 pb-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={pakizaLogo}
                  alt="Pakiza Logo"
                  className="h-9 w-auto object-contain"
                />
                <div>
                  <h1 className="text-lg font-black tracking-tight text-slate-950 dark:text-white uppercase leading-tight">
                    Pakiza Knit Composite Ltd.
                  </h1>
                  <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Marketing & Merchandising Division — CAD Department
                  </p>
                  <p className="text-[9.5px] text-slate-500">
                    Shilmuri, Madhabdi, Narsingdi, Bangladesh | Web: www.pakizaknit.com
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 pt-1.5 sm:pt-0 border-slate-200">
                <span className="inline-block px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[10px] font-black tracking-wider uppercase text-slate-900 dark:text-white">
                  CAD FABRIC CONSUMPTION REPORT
                </span>
                <div className="mt-0.5 text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
                  {data.requestNo}
                </div>
                <div className="text-[10px] text-slate-500">
                  Date: <span className="font-semibold text-slate-700 dark:text-slate-300">{data.requestDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Request Header Information: Single Horizontal Row ── */}
          <div className="rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-50/70 dark:bg-slate-800/40">
            <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-300 dark:divide-slate-700 text-center">
              {/* 1. Style Name */}
              <div className="p-1.5">
                <span className="block text-[9px] uppercase font-black tracking-wider text-slate-500 mb-0.5">
                  Style Name
                </span>
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate block">
                  {data.styleOrder || "—"}
                </span>
              </div>

              {/* 2. Buyer */}
              <div className="p-1.5">
                <span className="block text-[9px] uppercase font-black tracking-wider text-slate-500 mb-0.5">
                  Buyer
                </span>
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate block">
                  {data.buyer || "—"}
                </span>
              </div>

              {/* 3. Efficiency */}
              <div className="p-1.5">
                <span className="block text-[9px] uppercase font-black tracking-wider text-slate-500 mb-0.5">
                  Efficiency
                </span>
                <span className="font-black text-xs text-indigo-700 dark:text-indigo-400 font-mono block">
                  {data.efficiency ? `${data.efficiency.replace("%", "")}%` : "—"}
                </span>
              </div>

              {/* 4. Size Range */}
              <div className="p-1.5">
                <span className="block text-[9px] uppercase font-black tracking-wider text-slate-500 mb-0.5">
                  Size Range
                </span>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                  {data.sizeRange || "—"}
                </span>
              </div>

              {/* 5. Fabrication */}
              <div className="p-1.5 col-span-2 sm:col-span-1">
                <span className="block text-[9px] uppercase font-black tracking-wider text-slate-500 mb-0.5">
                  Fabrication *
                </span>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block truncate" title={data.fabrication}>
                  {data.fabrication || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* ── CAD Fabric Consumption Details Table ── */}
          {/* Note: Columns "Law", "Consumption", and "Cuttable finish" are strictly EXCLUDED as required */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white">
                CAD Fabric Consumption Details
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">
                {data.rows.length} Body Part {data.rows.length === 1 ? "Row" : "Rows"} | {autoCount} Auto, {manualCount} Manual
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700 print:overflow-visible">
              <table className="w-full text-[10.5px] border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-300 dark:border-slate-700 text-left whitespace-nowrap text-[10px]">
                    <th className="py-1.5 px-2 text-center w-8">SL</th>
                    <th className="py-1.5 px-2 min-w-[130px]">Name of Body Parts</th>
                    <th className="py-1.5 px-2 text-right">Marker Length</th>
                    <th className="py-1.5 px-2 text-right">DIA Finish</th>
                    <th className="py-1.5 px-2 text-right">DIA Cut</th>
                    <th className="py-1.5 px-2 text-right">Marker QTY</th>
                    <th className="py-1.5 px-2 text-right">Fabric GSM</th>
                    <th className="py-1.5 px-2 text-right font-black text-emerald-800 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20">
                      Finish/KG Consumption
                    </th>
                    <th className="py-1.5 px-2 text-right font-black text-teal-800 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20">
                      Waste+10%/KG
                    </th>
                    <th className="py-1.5 px-2 text-center">DIA make</th>
                    <th className="py-1.5 px-2 text-center font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20">
                      WASH 10%
                    </th>
                    <th className="py-1.5 px-2 text-center font-bold text-sky-800 dark:text-sky-300 bg-sky-50/50 dark:bg-sky-950/20">
                      Finish Yads/Meter
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {data.rows.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-6 text-center text-slate-400 italic">
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
                        <td className="py-1 px-2 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-1 px-2 font-bold text-slate-900 dark:text-slate-100">
                          {row.bodyPart || "—"}
                        </td>
                        <td className="py-1 px-2 text-right font-mono">
                          {row.markerLength !== undefined && row.markerLength !== null
                            ? Number(row.markerLength).toFixed(2)
                            : "—"}
                        </td>
                        <td className="py-1 px-2 text-right font-mono">
                          {row.diaFinish !== undefined && row.diaFinish !== null
                            ? Number(row.diaFinish).toFixed(2)
                            : "—"}
                        </td>
                        <td className="py-1 px-2 text-right font-mono">
                          {row.diaCut !== undefined && row.diaCut !== null
                            ? Number(row.diaCut).toFixed(2)
                            : "—"}
                        </td>
                        <td className="py-1 px-2 text-right font-mono font-semibold">
                          {row.markerQty !== undefined && row.markerQty !== null
                            ? Number(row.markerQty)
                            : "—"}
                        </td>
                        <td className="py-1 px-2 text-right font-mono">
                          {row.fabricGsm !== undefined && row.fabricGsm !== null
                            ? Number(row.fabricGsm)
                            : "—"}
                        </td>
                        <td className="py-1 px-2 text-right font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10">
                          {row.finishKgConsumption !== undefined && row.finishKgConsumption !== null
                            ? Number(row.finishKgConsumption).toFixed(3)
                            : "—"}
                        </td>
                        <td className="py-1 px-2 text-right font-mono font-bold text-teal-800 dark:text-teal-400 bg-teal-50/30 dark:bg-teal-950/10">
                          {row.waste10Consumption !== undefined && row.waste10Consumption !== null
                            ? Number(row.waste10Consumption).toFixed(3)
                            : "—"}
                        </td>
                        <td className="py-1 px-2 text-center font-bold uppercase text-slate-700 dark:text-slate-300">
                          {row.diaMake || "—"}
                        </td>
                        <td className="py-1 px-2 text-center font-mono font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/10">
                          {row.wash10 !== undefined && row.wash10 !== null && row.wash10 !== ""
                            ? row.wash10
                            : (row.wash10Pct !== undefined && row.wash10Pct !== null && row.wash10Pct !== ""
                              ? row.wash10Pct
                              : "—")}
                        </td>
                        <td className="py-1 px-2 text-center font-mono font-semibold text-slate-800 dark:text-slate-200 bg-sky-50/20 dark:bg-sky-950/10">
                          {row.finishYardsMeter !== undefined && row.finishYardsMeter !== null && row.finishYardsMeter !== ""
                            ? row.finishYardsMeter
                            : (row.finishYdsMeter || "—")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                <tfoot>
                  <tr className="bg-slate-200/90 dark:bg-slate-800 font-black text-slate-900 dark:text-white border-t-2 border-slate-400 dark:border-slate-600 text-[10px]">
                    <td colSpan={7} className="py-1.5 px-2 text-right uppercase tracking-wider">
                      Finish Total:
                    </td>
                    <td className="py-1.5 px-2 text-right font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/60">
                      {data.totals.totalFinishKg.toFixed(3)}
                    </td>
                    <td className="py-1.5 px-2 text-right font-mono text-teal-800 dark:text-teal-300 bg-teal-100/60 dark:bg-teal-950/60">
                      {data.totals.totalWaste10Kg.toFixed(3)}
                    </td>
                    <td colSpan={3} className="py-1.5 px-2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ── Remarks & Notes ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[10.5px]">
            <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 space-y-0.5">
              <span className="text-[9px] font-black uppercase text-slate-500">Merchant Request Remarks</span>
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {data.requestRemarks || "No special merchant remarks provided."}
              </p>
            </div>
            <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 space-y-0.5">
              <span className="text-[9px] font-black uppercase text-slate-500">CAD Cutting Instructions & Comments</span>
              <p className="text-slate-700 dark:text-slate-300 font-bold uppercase leading-relaxed">
                {data.comments || "ONE BODY ONE WAY CUTTING."}
              </p>
            </div>
          </div>

          {/* ── Attachments Summary (if any) ── */}
          {data.attachments && data.attachments.length > 0 && (
            <div className="p-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/20 text-[10px]">
              <span className="text-[9px] font-black uppercase text-slate-500 block mb-1">
                Attached References ({data.attachments.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.attachments.map((att) => (
                  <span
                    key={att.id}
                    className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[9.5px] text-slate-700 dark:text-slate-300"
                  >
                    📎 {att.fileName} ({att.fileSize})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── CAD Attachments Gallery: CAD Marker (Left 70%) & GMT Reference (Right 30%) ── */}
          {(data.gmtImage || (data.cadImages && data.cadImages.length > 0)) && (
            <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-2.5 space-y-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white block border-b border-slate-200 dark:border-slate-700 pb-1">
                CAD Attachments & Visual Layouts
              </span>

              <div className="grid grid-cols-1 md:grid-cols-10 gap-2.5 items-stretch">
                {/* 1. CAD Marker Section — LEFT (70% width = 7/10 cols) */}
                <div className="md:col-span-7 flex flex-col border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 bg-white dark:bg-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1 mb-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                      CAD Marker Layout{data.cadImages && data.cadImages.length > 1 ? "s" : ""} {data.cadImages && data.cadImages.length > 0 ? `(${data.cadImages.length})` : ""}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">Up to 3 marker views</span>
                  </div>

                  {data.cadImages && data.cadImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 flex-1 items-stretch">
                      {data.cadImages.map((img, idx) => (
                        <div
                          key={img.id || idx}
                          className="border border-slate-200 dark:border-slate-700 rounded-md p-1.5 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700 dark:text-indigo-400 mb-1">
                            <span>CAD Marker #{idx + 1}</span>
                            {img.size && (
                              <span className="text-[9px] text-slate-400 font-normal">{img.size}</span>
                            )}
                          </div>
                          <div className="w-full h-24 sm:h-28 bg-white dark:bg-slate-900 rounded overflow-hidden flex items-center justify-center p-1 border border-slate-200/80 dark:border-slate-700">
                            <img
                              src={img.dataUrl}
                              alt={img.name || `CAD Marker ${idx + 1}`}
                              className="w-full h-full object-contain rounded"
                            />
                          </div>
                          <span className="text-[9.5px] text-slate-600 dark:text-slate-400 font-medium mt-1 truncate block text-center" title={img.name}>
                            {img.name || `Marker Layout ${idx + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-xs text-slate-400 italic py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded">
                      No CAD marker images attached.
                    </div>
                  )}
                </div>

                {/* 2. GMT Reference Image Section — RIGHT (30% width = 3/10 cols) */}
                <div className="md:col-span-3 flex flex-col border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 bg-white dark:bg-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1 mb-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      GMT Reference Image
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">Garment Sample</span>
                  </div>

                  {data.gmtImage ? (
                    <div className="border border-slate-200 dark:border-slate-700 rounded-md p-1.5 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between flex-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-teal-700 dark:text-teal-400 mb-1">
                        <span>Front / Style View</span>
                        {typeof data.gmtImage === "object" && data.gmtImage.size && (
                          <span className="text-[9px] text-slate-400 font-normal">{data.gmtImage.size}</span>
                        )}
                      </div>
                      <div className="w-full h-24 sm:h-28 bg-white dark:bg-slate-900 rounded overflow-hidden flex items-center justify-center p-1 border border-slate-200/80 dark:border-slate-700">
                        <img
                          src={typeof data.gmtImage === "string" ? data.gmtImage : data.gmtImage.dataUrl}
                          alt="GMT Reference"
                          className="w-full h-full object-contain rounded"
                        />
                      </div>
                      <span className="text-[9.5px] text-slate-600 dark:text-slate-400 font-medium mt-1 truncate block text-center" title={typeof data.gmtImage === "string" ? "GMT Image" : data.gmtImage.name}>
                        {typeof data.gmtImage === "string" ? "GMT Image" : data.gmtImage.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-xs text-slate-400 italic py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded">
                      No GMT reference image attached.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Authorized Signatures Block ── */}
          <div className="pt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-[10px]">
            <div className="space-y-0.5">
              <div className="border-t border-slate-400 dark:border-slate-600 pt-1 font-bold text-slate-900 dark:text-white">
                {data.merchandiser}
              </div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                Prepared By (Merchandiser)
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="border-t border-slate-400 dark:border-slate-600 pt-1 font-bold text-slate-900 dark:text-white">
                {data.cadSubmittedBy || data.cadAssignedTo || "CAD In-Charge"}
              </div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                Calculated By (CAD)
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="border-t border-slate-400 dark:border-slate-600 pt-1 font-bold text-slate-900 dark:text-white">
                Technical Manager
              </div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                Verified By (Marker QA)
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="border-t border-slate-400 dark:border-slate-600 pt-1 font-bold text-slate-900 dark:text-white">
                Head of Merchandising
              </div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
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

// src/components/reports/StandardPreviewReportModal.tsx
// Standardized official Pakiza preview reports for all transaction forms

import React from "react";
import { Printer, X, FileText, CheckCircle2 } from "lucide-react";
import pakizaLogo from "@/components/Pakiza-Software-bgless-e1692258364537.webp";

export type ReportType =
  | "mrr"
  | "direct-mrr"
  | "supplier-return"
  | "opening-stock"
  | "purchase-requisition"
  | "monthly-budget-requisition"
  | "supplier-bill";

export interface StandardReportData {
  reportType?: ReportType | string;
  title?: string;
  reportTitle?: string;
  documentNumber?: string;
  documentNo?: string;
  reportNumber?: string;
  documentDate?: string;
  reportDate?: string;
  statusBadge?: string;
  revision?: string;
  companyName?: string;
  companyAddress?: string;
  department?: string;
  status?: string;
  metadata?: Array<{ label: string; value: string | React.ReactNode; highlight?: boolean }>;
  metaFields?: Array<{ label: string; value: string | React.ReactNode; highlight?: boolean }>;
  tableHeaders?: string[];
  tableRows?: Array<Array<string | number | React.ReactNode>>;
  items?: Array<any>;
  financials?: Array<{ label: string; value: string | number; isTotal?: boolean; highlight?: boolean }>;
  summaryCards?: Array<{ label: string; value: string | number; isBold?: boolean; isHighlight?: boolean }>;
  notes?: string | string[];
  remarks?: string;
  signatures?: Array<{ role?: string; name?: string; designation?: string; title?: string; date?: string }>;
}

interface StandardPreviewReportModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  data?: StandardReportData | null;
  reportData?: StandardReportData | null;
}

export function StandardPreviewReportModal({
  isOpen,
  open,
  onClose,
  onOpenChange,
  data,
  reportData,
}: StandardPreviewReportModalProps) {
  const visible = isOpen ?? open ?? false;
  const activeData = data || reportData || null;
  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

  if (!visible || !activeData) return null;

  const docTitle = activeData.title || activeData.reportTitle || "TRANSACTION REPORT";
  const docNo = activeData.documentNumber || activeData.documentNo || activeData.reportNumber || "DOC-PREVIEW";
  const docDate = activeData.documentDate || activeData.reportDate || new Date().toISOString().slice(0, 10);
  const metadataList = activeData.metadata || activeData.metaFields || [];

  // Generate table headers & rows if items are provided directly
  let headers = activeData.tableHeaders || [];
  let rows = activeData.tableRows || [];

  if (rows.length === 0 && activeData.items && activeData.items.length > 0) {
    headers = [
      "SL",
      "Item Description & Spec",
      "Brand / Origin",
      "UOM",
      "Quantity",
      "Unit Price",
      "Total Amount",
      "Remarks / Tracking",
    ];
    rows = activeData.items.map((it, idx) => [
      it.sl || idx + 1,
      React.createElement(
        "div",
        null,
        React.createElement("div", { className: "font-bold text-slate-900" }, it.itemName),
        React.createElement("div", { className: "text-[9.5px] text-slate-500 font-mono" }, it.itemCode || it.specification)
      ),
      it.brandOrigin || `${it.brand || "Standard"} / ${it.origin || "Local"}`,
      it.uom || "PCS",
      it.quantity || it.currentBillQty || it.openingQuantity || it.currentReturnQty || it.orderedQty || 0,
      `৳ ${(it.unitPrice || it.unitCost || 0).toLocaleString()}`,
      `৳ ${(it.totalAmount || it.lineAmount || it.totalValue || it.lineTotal || 0).toLocaleString()}`,
      it.remarks || it.batchNumber || it.location || "Verified",
    ]);
  }

  // Summary cards fallback from financials
  const summaryList = activeData.summaryCards || (activeData.financials ? activeData.financials.map(f => ({
    label: f.label,
    value: f.value,
    isBold: f.isTotal,
    isHighlight: f.isTotal || f.highlight,
  })) : []);

  const noteText = activeData.notes || activeData.remarks;

  const defaultSignatures = activeData.signatures || [
    { role: "Prepared By", name: "Store Officer / Executive", designation: "Inventory & Logistics" },
    { role: "Checked By", name: "Quality Inspector", designation: "QA / Audit" },
    { role: "Verified By", name: "Store Manager", designation: "Central Store Operations" },
    { role: "Approved By", name: "Head of Procurement / GM", designation: "Operations & Supply Chain" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[92vh] overflow-hidden text-slate-900">
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-3.5 sm:px-6 border-b border-border flex justify-between items-center bg-slate-100 dark:bg-slate-900 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="size-4.5 text-blue-600" />
            <span className="text-xs font-bold text-foreground">
              Official Preview Report — {docTitle} ({docNo})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Printer className="size-3.5" /> Print / Save PDF
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              <X className="size-4.5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white text-slate-900 text-xs font-sans space-y-6 print:p-0 print:overflow-visible">
          {/* Official Pakiza Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={pakizaLogo}
                  alt="Pakiza Logo"
                  className="h-12 w-auto object-contain"
                />
              </div>

              <div className="text-center flex-1">
                <h1 className="text-lg font-black tracking-wide uppercase text-slate-950">
                  {activeData.companyName || "PAKIZA KNIT COMPOSITE LTD."}
                </h1>
                <p className="text-[11px] text-slate-600 font-medium">
                  {activeData.companyAddress || "Khan ABC Tradeplex, House #37, Road #2, Dhanmondi, Dhaka-1205"}
                </p>
                <div className="mt-1">
                  <span className="inline-block px-4 py-0.5 bg-slate-900 text-white font-mono font-black text-xs uppercase tracking-widest rounded-xs shadow-xs">
                    {docTitle}
                  </span>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-600 space-y-0.5 shrink-0 border border-slate-300 rounded p-2 bg-slate-50 min-w-[170px]">
                <div>
                  <span className="font-bold text-slate-800">Doc No: </span>
                  <span className="font-mono font-bold text-blue-700">{docNo}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800">Date: </span>
                  <span>{docDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Key-Value Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border border-slate-300 rounded-lg p-3 bg-slate-50/70 text-[11px]">
            {metadataList.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider block">
                  {item.label}
                </span>
                <span className="font-semibold text-slate-900 font-sans break-words">
                  {item.value || "—"}
                </span>
              </div>
            ))}
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto rounded border border-slate-300">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider border-b border-slate-300">
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      className={`py-2 px-2.5 border-r border-slate-200 last:border-r-0 ${
                        header.toLowerCase().includes("qty") ||
                        header.toLowerCase().includes("price") ||
                        header.toLowerCase().includes("cost") ||
                        header.toLowerCase().includes("total") ||
                        header.toLowerCase().includes("amount") ||
                        header.toLowerCase().includes("value") ||
                        header.toLowerCase().includes("vat")
                          ? "text-right"
                          : header.toLowerCase() === "sl" || header.toLowerCase() === "uom"
                          ? "text-center"
                          : "text-left"
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 1 ? "bg-slate-50/50" : "bg-white"}>
                    {row.map((cell, cIdx) => {
                      const headerName = headers[cIdx]?.toLowerCase() || "";
                      const isNumeric =
                        headerName.includes("qty") ||
                        headerName.includes("price") ||
                        headerName.includes("cost") ||
                        headerName.includes("total") ||
                        headerName.includes("amount") ||
                        headerName.includes("value") ||
                        headerName.includes("vat");
                      const isCentered = headerName === "sl" || headerName === "uom";

                      return (
                        <td
                          key={cIdx}
                          className={`py-2 px-2.5 border-r border-slate-200 last:border-r-0 ${
                            isNumeric
                              ? "text-right font-mono font-medium"
                              : isCentered
                              ? "text-center font-medium"
                              : "text-left"
                          }`}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={Math.max(1, headers.length)} className="py-6 text-center text-slate-400">
                      No records to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial / Summary Cards */}
          {summaryList && summaryList.length > 0 && (
            <div className="flex justify-end">
              <div className="w-full sm:w-80 border border-slate-300 rounded-lg p-3 bg-slate-50/80 space-y-1.5 text-xs">
                {summaryList.map((card, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center ${
                      card.isHighlight
                        ? "border-t border-slate-300 pt-1.5 font-black text-slate-900 text-sm"
                        : "text-slate-700"
                    } ${card.isBold ? "font-bold text-slate-900" : ""}`}
                  >
                    <span>{card.label}</span>
                    <span className="font-mono">{card.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes / Remarks */}
          {noteText && (
            <div className="border border-slate-200 rounded p-2.5 text-[11px] bg-slate-50/40">
              <strong className="text-slate-800">Remarks / Instructions: </strong>
              <span className="text-slate-600">{noteText}</span>
            </div>
          )}

          {/* Official 4-Tier Signatures Block */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-[10px]">
            {defaultSignatures.map((sig, idx) => (
              <div key={idx} className="space-y-1">
                <div className="border-t border-slate-800 pt-1.5 font-bold uppercase tracking-wider text-slate-900">
                  {sig.role}
                </div>
                {sig.name && <div className="text-slate-700 font-semibold">{sig.name}</div>}
                {sig.designation && <div className="text-slate-500">{sig.designation}</div>}
              </div>
            ))}
          </div>

          {/* Print Footer Notice */}
          <div className="border-t border-slate-200 pt-3 text-[9px] text-slate-400 flex justify-between items-center">
            <span>Generated from CRIPTON ERP • Pakiza Enterprise Solutions</span>
            <span>Printed on: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

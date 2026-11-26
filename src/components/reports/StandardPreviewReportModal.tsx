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
  | "comparative-statement"
  | "purchase-order"
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
  hideLogo?: boolean;
  hideDocHeaderInfo?: boolean;
  hideCompanyHeader?: boolean;
  orientation?: "portrait" | "landscape";
  remarksLabel?: string;
  metadata?: Array<{ label: string; value: string | React.ReactNode; highlight?: boolean; colSpan?: number; className?: string }>;
  metaFields?: Array<{ label: string; value: string | React.ReactNode; highlight?: boolean; colSpan?: number; className?: string }>;
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
  const rawMetadataList = activeData.metadata || activeData.metaFields || [];
  let metadataList =
    activeData.reportType === "supplier-bill"
      ? rawMetadataList.filter((m) => !m.label.toLowerCase().includes("payment due date"))
      : rawMetadataList;

  const isMonthlyBudget = activeData.reportType === "monthly-budget-requisition";
  const isMaterialRequisition =
    docTitle === "MATERIAL REQUISITION NOTE" ||
    docTitle === "MATERIAL REQUISITION APPROVAL NOTE" ||
    activeData.reportType === "material-requisition";

  const isStoreIssueSlip =
    docTitle === "STORE MATERIAL ISSUE SLIP" ||
    docTitle === "STORE DIRECT MATERIAL ISSUE SLIP" ||
    docTitle.toLowerCase().includes("material issue slip") ||
    activeData.reportType === "store-issue";

  const isMRRReport =
    activeData.reportType === "mrr" ||
    docTitle === "MATERIAL RECEIVE REPORT (MRR)" ||
    docTitle === "WORK ORDER SERVICE RECEIVE REPORT (MRR)" ||
    docTitle.toLowerCase().includes("material receive report");

  const isSupplierReturn =
    activeData.reportType === "supplier-return" ||
    docTitle === "Material Issue — Supplier Return" ||
    docTitle.toLowerCase().includes("supplier return");

  const isTransferRequisition =
    activeData.reportType === "transfer-requisition" ||
    docTitle === "STOCK TRANSFER REQUISITION DOSSIER" ||
    docTitle.toLowerCase().includes("stock transfer requisition");

  const isICGRNReport =
    activeData.reportType === "ic-grn" ||
    docTitle === "INTER-COMPANY GOODS RECEIPT NOTE (IC-GRN)" ||
    docTitle.toLowerCase().includes("inter-company goods receipt note") ||
    docTitle.toLowerCase().includes("ic-grn");

  const isLandscape = activeData.orientation === "landscape" || isStoreIssueSlip;

  if (
    isMaterialRequisition &&
    !metadataList.some((m) => m.label.toLowerCase().includes("requisition no"))
  ) {
    const reqDateIdx = metadataList.findIndex((m) =>
      m.label.toLowerCase().includes("requisition date")
    );
    const insertIdx = reqDateIdx !== -1 ? reqDateIdx : 0;
    metadataList = [
      ...metadataList.slice(0, insertIdx),
      { label: "Requisition No", value: docNo, highlight: true },
      ...metadataList.slice(insertIdx),
    ];
  }

  if (isStoreIssueSlip) {
    const hasIssueNo = metadataList.some((m) => m.label.toLowerCase() === "issue no");
    const hasIssueDate = metadataList.some((m) => m.label.toLowerCase() === "issue date");

    if (!hasIssueNo || !hasIssueDate) {
      const issueTypeIdx = metadataList.findIndex((m) =>
        m.label.toLowerCase().includes("issue type")
      );
      const insertIdx = issueTypeIdx !== -1 ? issueTypeIdx : 0;
      const fieldsToAdd = [];
      if (!hasIssueNo) fieldsToAdd.push({ label: "Issue No", value: docNo, highlight: true });
      if (!hasIssueDate) fieldsToAdd.push({ label: "Issue Date", value: docDate });

      metadataList = [
        ...metadataList.slice(0, insertIdx),
        ...fieldsToAdd,
        ...metadataList.slice(insertIdx),
      ];
    }
  }

  const isInventoryReport =
    (typeof window !== "undefined" && window.location.pathname.includes("/inv-")) ||
    (typeof activeData.reportType === "string" && (
      activeData.reportType.startsWith("inv") ||
      activeData.reportType.startsWith("loan") ||
      activeData.reportType.startsWith("stock") ||
      activeData.reportType.startsWith("transfer") ||
      activeData.reportType === "direct-mrr" ||
      activeData.reportType === "supplier-return" ||
      activeData.reportType === "opening-stock"
    )) ||
    activeData.department?.toLowerCase().includes("inventory") ||
    activeData.department?.toLowerCase().includes("materials") ||
    activeData.department?.toLowerCase().includes("store");

  const shouldHideLogo =
    activeData.hideLogo ||
    isInventoryReport ||
    activeData.reportType === "purchase-requisition" ||
    activeData.reportType === "monthly-budget-requisition" ||
    activeData.reportType === "purchase-order" ||
    activeData.reportType === "comparative-statement" ||
    activeData.reportType === "mrr" ||
    docTitle === "STORE MATERIAL ISSUE SLIP" ||
    docTitle === "STORE DIRECT MATERIAL ISSUE SLIP" ||
    docTitle === "MATERIAL RECEIVE REPORT (MRR)";
  const shouldHideDocHeaderInfo =
    activeData.hideDocHeaderInfo ||
    isMonthlyBudget ||
    isMaterialRequisition ||
    isStoreIssueSlip ||
    isMRRReport ||
    isSupplierReturn ||
    isTransferRequisition ||
    isICGRNReport ||
    activeData.reportType === "purchase-requisition" ||
    activeData.reportType === "supplier-bill";

  // Generate table headers & rows if items are provided directly
  let headers = activeData.tableHeaders || [];
  let rows = activeData.tableRows || [];

  if (rows.length === 0 && activeData.items && activeData.items.length > 0) {
    if (isMonthlyBudget) {
      headers = [
        "SL",
        "Item Description & Spec",
        "Brand / Origin",
        "UOM",
        "Quantity",
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
        (it.quantity ?? it.requestedQuantity ?? it.requiredQuantity ?? it.estimatedQuantity ?? 0).toLocaleString(),
        it.remarks || it.batchNumber || it.location || "Verified",
      ]);
    } else if (activeData.reportType === "supplier-bill") {
      headers = [
        "SL",
        "Item Description & Spec",
        "Brand / Origin",
        "UOM",
        "Billed Qty",
        "Unit Price",
        "Discount",
        "VAT",
        "TAX",
        "Total Amount",
        "Remarks",
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
        it.currentBillQty ?? it.quantity ?? 0,
        `৳ ${(it.unitPrice || 0).toLocaleString()}`,
        `৳ ${(it.discount || 0).toLocaleString()}`,
        `৳ ${(it.vatAmount || 0).toLocaleString()}`,
        `৳ ${(it.taxAmount || 0).toLocaleString()}`,
        `৳ ${(it.lineAmount || it.totalAmount || 0).toLocaleString()}`,
        it.remarks || "MRR Verified",
      ]);
    } else {
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
        it.quantity ?? it.requestedQuantity ?? it.requiredQuantity ?? it.currentBillQty ?? it.openingQuantity ?? it.currentReturnQty ?? it.orderedQty ?? 0,
        `৳ ${(it.unitPrice || it.unitCost || 0).toLocaleString()}`,
        `৳ ${(it.totalAmount || it.lineAmount || it.totalValue || it.lineTotal || 0).toLocaleString()}`,
        it.remarks || it.batchNumber || it.location || "Verified",
      ]);
    }
  }

  // Summary cards fallback from financials
  let summaryList = activeData.summaryCards || (activeData.financials ? activeData.financials.map(f => ({
    label: f.label,
    value: f.value,
    isBold: f.isTotal,
    isHighlight: f.isTotal || f.highlight,
  })) : []);

  if (isMonthlyBudget) {
    // Remove Total Line Items and Estimated Budget Value from monthly budget preview
    summaryList = summaryList.filter(
      (s) =>
        !s.label.toLowerCase().includes("total line items") &&
        !s.label.toLowerCase().includes("estimated budget value") &&
        !s.label.toLowerCase().includes("total estimated qty")
    );
  }

  if (isMRRReport) {
    summaryList = summaryList
      .filter(
        (s) =>
          !s.label.toLowerCase().includes("foc") &&
          !s.label.toLowerCase().includes("total physical received") &&
          !s.label.toLowerCase().includes("payable value")
      )
      .map((s) => {
        if (s.label.toLowerCase().includes("regular received qty")) {
          return { ...s, label: "Received Qty" };
        }
        return s;
      });
  }

  // If supplier-bill, ensure Total Amount card reflects sum of line totals
  if (activeData.reportType === "supplier-bill") {
    let lineTotalSum = 0;
    if (activeData.items && activeData.items.length > 0) {
      lineTotalSum = activeData.items.reduce(
        (sum, it) => sum + (Number(it.lineAmount ?? it.totalAmount) || 0),
        0
      );
    } else if (rows && rows.length > 0) {
      const totalColIdx = headers.findIndex((h) => {
        const l = h.toLowerCase();
        return l.includes("total amount") || l.includes("line total");
      });
      if (totalColIdx !== -1) {
        lineTotalSum = rows.reduce((sum, row) => {
          const cell = row[totalColIdx];
          if (typeof cell === "number") return sum + cell;
          if (typeof cell === "string") {
            const cleaned = cell.replace(/[^0-9.-]+/g, "");
            return sum + (Number(cleaned) || 0);
          }
          return sum;
        }, 0);
      }
    }

    if (lineTotalSum > 0) {
      summaryList = summaryList.map((card) => {
        if (
          card.label.toLowerCase().includes("net bill amount") ||
          card.label.toLowerCase().includes("total amount") ||
          card.label.toLowerCase().includes("net approved amount")
        ) {
          return {
            ...card,
            label: "Total Amount",
            value: `৳ ${lineTotalSum.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
            isBold: true,
            isHighlight: true,
          };
        }
        return card;
      });
      if (!summaryList.some((c) => c.label === "Total Amount")) {
        summaryList.push({
          label: "Total Amount",
          value: `৳ ${lineTotalSum.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
          isBold: true,
          isHighlight: true,
        });
      }
    }
  }

  const noteText = activeData.notes || activeData.remarks;

  const defaultSignatures = activeData.signatures || [
    { role: "Prepared By", name: "Store Officer / Executive", designation: "Inventory & Logistics" },
    { role: "Checked By", name: "Quality Inspector", designation: "QA / Audit" },
    { role: "Verified By", name: "Store Manager", designation: "Central Store Operations" },
    { role: "Approved By", name: "Head of Procurement / GM", designation: "Operations & Supply Chain" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <style>{`@media print { @page { size: ${isLandscape ? "landscape" : "portrait"}; } }`}</style>
      <div className={`bg-white dark:bg-card border border-border rounded-2xl shadow-2xl w-full ${isLandscape ? "max-w-6xl" : "max-w-5xl"} flex flex-col max-h-[92vh] overflow-hidden text-slate-900`}>
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
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {!shouldHideLogo && (
                <div className="flex items-center gap-3">
                  <img
                    src={pakizaLogo}
                    alt="Pakiza Logo"
                    className="h-12 w-auto object-contain"
                  />
                </div>
              )}

              <div className={`text-center flex-1 ${shouldHideLogo ? "sm:text-left" : ""}`}>
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

              {!shouldHideDocHeaderInfo && (
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
              )}
            </div>
          </div>

          {/* Metadata Key-Value Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border border-slate-300 rounded-lg p-3 bg-slate-50/70 text-[11px]">
            {metadataList.map((item, idx) => {
              const spanClass =
                item.colSpan === 2
                  ? "col-span-2 sm:col-span-2"
                  : item.colSpan === 3
                  ? "col-span-2 sm:col-span-3"
                  : item.colSpan === 4
                  ? "col-span-2 sm:col-span-4"
                  : "";
              return (
                <div key={idx} className={`space-y-0.5 ${spanClass} ${item.className || ""}`}>
                  <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    {item.label}
                  </span>
                  <span className="font-semibold text-slate-900 font-sans break-words">
                    {item.value || "—"}
                  </span>
                </div>
              );
            })}
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
                        header.toLowerCase().includes("discount") ||
                        header.toLowerCase().includes("tax") ||
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
                        headerName.includes("discount") ||
                        headerName.includes("tax") ||
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
          {noteText &&
            activeData.reportType !== "purchase-requisition" &&
            !metadataList.some(
              (m) =>
                m.label.toLowerCase().includes("purpose") ||
                m.label.toLowerCase().includes("justification")
            ) && (
              <div className="border border-slate-200 rounded p-2.5 text-[11px] bg-slate-50/40">
                <strong className="text-slate-800">
                  {activeData.remarksLabel || "Remarks / Instructions"}:{" "}
                </strong>
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

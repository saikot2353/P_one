import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  User,
  LayoutGrid,
  Check,
  FileCheck,
  FileText,
  Printer,
  Hourglass,
  RotateCcw,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import {
  MaterialRequisition,
  MRStatus,
} from "@/lib/inventory-requisition-issue-data";

export interface MaterialRequisitionViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requisition: MaterialRequisition | null;
  onPrint?: (requisition: MaterialRequisition) => void;
  isApprovalMode?: boolean;
  onApprove?: (requisition: MaterialRequisition) => void;
  onReject?: (requisition: MaterialRequisition) => void;
  onReturn?: (requisition: MaterialRequisition) => void;
}

export function MaterialRequisitionViewModal({
  open,
  onOpenChange,
  requisition,
  onPrint,
  isApprovalMode,
  onApprove,
  onReject,
  onReturn,
}: MaterialRequisitionViewModalProps) {
  if (!requisition) return null;

  const req = requisition;

  // Extract initials for the square avatar box (e.g. "Md. Anik Islam" -> "AI")
  const getInitials = (name?: string) => {
    if (!name) return "MR";
    const clean = name.replace(/\([^)]*\)/g, "").trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "MR";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Status Badge Styling
  const getStatusBadge = (status: MRStatus) => {
    switch (status) {
      case "Submitted":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Partially Issued":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "Fully Issued":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Rejected":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "Returned for Correction":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Cancelled":
        return "bg-slate-100 text-slate-600 border-slate-300";
      case "Draft":
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-rose-50 text-rose-700 border-rose-200 font-bold";
      case "Urgent":
        return "bg-amber-50 text-amber-700 border-amber-200 font-bold";
      case "High":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Format Dates
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    if (dateStr.includes("-")) {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    return dateStr;
  };

  const formattedReqDate = formatDate(req.requisitionDate);
  const formattedReqdDate = formatDate(req.requiredDate);

  // Totals calculations
  const totalRequested =
    req.requestedQuantity ||
    req.items?.reduce((sum, it) => sum + (Number(it.requestedQuantity) || 0), 0) ||
    0;
  const totalIssued =
    req.issuedQuantity ||
    req.items?.reduce((sum, it) => sum + (Number(it.issuedQuantity) || 0), 0) ||
    0;
  const totalRemaining =
    req.remainingQuantity !== undefined
      ? req.remainingQuantity
      : Math.max(0, totalRequested - totalIssued);

  // Build Approval Workflow Cards from real approval history or standard workflow
  const isApproved =
    req.status === "Approved" ||
    req.status === "Partially Issued" ||
    req.status === "Fully Issued";

  const approvalCards =
    req.approvalHistory && req.approvalHistory.length > 0
      ? req.approvalHistory.map((hist) => {
          const isAppr = hist.action === "Approved";
          const isRej = hist.action === "Rejected";
          return {
            role: `STEP ${hist.level}: ${hist.action.toUpperCase()} BY ${hist.designation.toUpperCase()}`,
            name: hist.approver,
            title: hist.designation,
            department: req.department || "Operations",
            status: hist.action.toUpperCase(),
            isApproved: isAppr,
            isRejected: isRej,
            date: hist.dateTime.split(" ")[0] || formattedReqDate,
            time: hist.dateTime.split(" ")[1] || "—",
            remarks: hist.remarks,
          };
        })
      : [
          {
            role: "APPROVED BY STORE & INVENTORY",
            name: isApproved ? "Rafiqul Islam" : "Pending Assignment",
            title: "Store Manager",
            department: req.warehouseStore || "Central Warehouse Store",
            status: isApproved ? "APPROVED" : req.status === "Submitted" ? "PENDING" : req.status.toUpperCase(),
            isApproved,
            isRejected: req.status === "Rejected",
            date: req.approvedDate ? formatDate(req.approvedDate.split(" ")[0]) : formattedReqDate,
            time: req.approvedDate?.split(" ")[1] || (isApproved ? "02:40 PM" : "N/A"),
            remarks: req.remarks || (isApproved ? "Approved for warehouse issue dispatch" : undefined),
          },
        ];

  // Comment notes collection from actual requisition fields
  const commentsList: { author: string; role: string; date: string; note: string }[] = [];
  if (req.remarks) {
    commentsList.push({
      author: req.requestedBy,
      role: req.requesterDesignation || "Requester",
      date: formattedReqDate,
      note: req.remarks,
    });
  }
  if (req.rejectionReason) {
    commentsList.push({
      author: "Store Authority",
      role: "Reviewer",
      date: formattedReqDate,
      note: `Rejection Note: ${req.rejectionReason}`,
    });
  }
  if (req.returnReason) {
    commentsList.push({
      author: "Store Approver",
      role: "Store In-Charge",
      date: formattedReqDate,
      note: `Return for Correction: ${req.returnReason}`,
    });
  }
  if (req.approvalHistory) {
    req.approvalHistory.forEach((h) => {
      if (h.remarks && h.remarks !== req.remarks) {
        commentsList.push({
          author: h.approver,
          role: h.designation,
          date: h.dateTime,
          note: h.remarks,
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1450px] w-[96vw] p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden gap-0 max-h-[92vh] flex flex-col [&>button]:hidden text-slate-700 dark:text-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-[#fbfcfd] dark:bg-slate-950/40 flex items-center justify-between shrink-0">
          {/* Left Title with Sparkle Icon Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-950 dark:bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs border border-slate-800 dark:border-slate-700">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Material Requisition
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                  {req.mrNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Metadata */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>APPLICATION DATE</span>
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block font-mono mt-0.5">
                {formattedReqDate}
              </span>
              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>
                  {req.submittedDate
                    ? `Submitted ${req.submittedDate.includes(" ") ? req.submittedDate.split(" ").slice(1).join(" ") : req.submittedDate}`
                    : `Required: ${formattedReqdDate}`}
                </span>
              </div>
            </div>

            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all shrink-0 cursor-pointer shadow-3xs"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
          {/* 1. EMPLOYEE & REQUISITION DETAILS CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-3xs">
                <User className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                EMPLOYEE DETAILS
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Square Avatar Badge with Initials */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-xs">
                {getInitials(req.requestedBy)}
              </div>

              {/* 2-Column Info Grid with Only the 5 Specified Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2.5 text-xs">
                {/* Column 1 */}
                <div className="space-y-2">
                  <div className="flex items-baseline">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-36 shrink-0">
                      Requisition Date:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100 font-semibold font-mono">
                      {formattedReqDate}
                    </span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-36 shrink-0">
                      Department:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100 font-semibold">
                      {req.department}
                    </span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-36 shrink-0">
                      Requested By:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100 font-bold">
                      {req.requestedBy}
                    </span>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-2">
                  <div className="flex items-baseline">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-36 shrink-0">
                      Required Date:
                    </span>
                    <span className="text-slate-800 dark:text-slate-100 font-semibold font-mono">
                      {formattedReqdDate}
                    </span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-slate-400 dark:text-slate-500 font-normal w-36 shrink-0">
                      Priority:
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(
                        req.priority
                      )}`}
                    >
                      {req.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PURPOSE CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                <LayoutGrid className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                PURPOSE
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium pl-1 leading-relaxed">
              {req.purpose || req.remarks || "General Inventory Material Requisition"}
            </p>
          </div>

          {/* 3. REQUISITION ITEMS TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    <th className="py-2.5 px-3 w-10 text-center"></th>
                    <th className="py-2.5 px-3 w-12 text-center">SL</th>
                    <th className="py-2.5 px-3.5">ITEM DESCRIPTION</th>
                    <th className="py-2.5 px-3.5">SPECIFICATION</th>
                    <th className="py-2.5 px-3.5">BRAND / ORIGIN</th>
                    <th className="py-2.5 px-3 text-center w-16">UOM</th>
                    <th className="py-2.5 px-3.5 text-right">REQ QTY</th>
                    <th className="py-2.5 px-3.5 text-right">STOCK</th>
                    <th className="py-2.5 px-3.5 text-right text-indigo-700 dark:text-indigo-400">ISSUED</th>
                    <th className="py-2.5 px-3.5 text-right text-amber-700 dark:text-amber-400">BALANCE</th>
                    <th className="py-2.5 px-3.5 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
                  {req.items && req.items.length > 0 ? (
                    req.items.map((item, idx) => {
                      const reqQty = Number(item.requestedQuantity) || 0;
                      const issQty = Number(item.issuedQuantity) || 0;
                      const balQty =
                        item.remainingQuantity !== undefined
                          ? Number(item.remainingQuantity)
                          : Math.max(0, reqQty - issQty);
                      const isComplete = issQty >= reqQty && reqQty > 0;
                      const isPartial = issQty > 0 && issQty < reqQty;

                      return (
                        <tr
                          key={item.id || idx}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors whitespace-nowrap"
                        >
                          {/* Checkbox circle matching image design */}
                          <td className="py-3 px-3 text-center">
                            <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-3xs">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          </td>

                          {/* SL */}
                          <td className="py-3 px-3 text-center font-mono font-medium text-slate-400">
                            {item.sl || idx + 1}
                          </td>

                          {/* Item Description & Code */}
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-slate-800 dark:text-slate-100">
                              {item.itemName}
                            </div>
                            <div className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                              {item.itemCode}
                            </div>
                          </td>

                          {/* Specification */}
                          <td
                            className="py-3 px-3.5 text-slate-600 dark:text-slate-400 max-w-[220px] truncate"
                            title={item.specification}
                          >
                            {item.specification || "—"}
                          </td>

                          {/* Brand / Origin */}
                          <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400">
                            {item.brand || item.origin
                              ? `${item.brand || "—"} / ${item.origin || "—"}`
                              : "—"}
                          </td>

                          {/* UOM */}
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                            {item.uom}
                          </td>

                          {/* Requested Qty */}
                          <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                            {reqQty.toLocaleString()}
                          </td>

                          {/* Available Stock */}
                          <td className="py-3 px-3.5 text-right font-mono text-slate-600 dark:text-slate-400">
                            {(item.availableStock ?? 0).toLocaleString()}
                          </td>

                          {/* Issued Qty */}
                          <td className="py-3 px-3.5 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {issQty.toLocaleString()}
                          </td>

                          {/* Balance / Remaining Qty */}
                          <td className="py-3 px-3.5 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                            {balQty.toLocaleString()}
                          </td>

                          {/* Status Pill matching the image styling */}
                          <td className="py-3 px-3.5 text-center">
                            {isComplete ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800">
                                Fully Issued
                              </span>
                            ) : isPartial ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800">
                                Partially Issued
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
                                Pending Issue
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={11} className="py-6 text-center text-slate-400">
                        No requisition items found in this requisition.
                      </td>
                    </tr>
                  )}
                </tbody>

                {/* Table Summary Footer */}
                {req.items && req.items.length > 0 && (
                  <tfoot className="bg-slate-50/75 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 text-[11px] font-bold">
                    <tr>
                      <td colSpan={6} className="py-2.5 px-3.5 text-right text-slate-600 dark:text-slate-400">
                        Total Summary ({req.items.length} items):
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono text-slate-900 dark:text-slate-100">
                        {totalRequested.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono text-slate-400">
                        —
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono text-indigo-700 dark:text-indigo-400">
                        {totalIssued.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono text-amber-700 dark:text-amber-400">
                        {totalRemaining.toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* 4. APPROVAL WORKFLOW & SIGNATURES */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 pb-1.5">
              <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                <FileCheck className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Approval Workflow &amp; Signatures
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {approvalCards.map((sig, idx) => {
                const isApprovedSig = sig.isApproved;
                const isRejectedSig = sig.isRejected;

                return (
                  <div
                    key={idx}
                    className={`border rounded-xl p-4 relative flex flex-col justify-between border-l-4 ${
                      isApprovedSig
                        ? "border-emerald-200/90 dark:border-emerald-800/70 bg-emerald-50/40 dark:bg-emerald-950/15 border-l-emerald-500"
                        : isRejectedSig
                        ? "border-rose-200/90 dark:border-rose-800/70 bg-rose-50/40 dark:bg-rose-950/15 border-l-rose-500"
                        : "border-amber-200/90 dark:border-amber-800/70 bg-amber-50/40 dark:bg-amber-950/15 border-l-amber-500"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          {sig.role}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${
                            isApprovedSig
                              ? "text-emerald-700 dark:text-emerald-400"
                              : isRejectedSig
                              ? "text-rose-700 dark:text-rose-400"
                              : "text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {isApprovedSig ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3]" />
                              APPROVED
                            </>
                          ) : isRejectedSig ? (
                            <>
                              <X className="w-3 h-3 stroke-[3]" />
                              REJECTED
                            </>
                          ) : (
                            <>
                              <Hourglass className="w-3 h-3" />
                              PENDING
                            </>
                          )}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                        {sig.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {sig.title}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        {sig.department}
                      </div>
                      {sig.remarks && (
                        <p className="text-[11px] italic text-slate-600 dark:text-slate-300 mt-1.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-800">
                          &ldquo;{sig.remarks}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      <span>{sig.date}</span>
                      <span>{sig.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. COMMENTS & APPROVAL NOTES */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-1.5">
              <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                <FileText className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Comments &amp; Approval Notes
              </span>
            </div>

            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              COMMENT HISTORY &amp; NOTES
            </div>

            {commentsList.length > 0 ? (
              <div className="space-y-2.5 pt-1">
                {commentsList.map((c, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200/70 dark:border-slate-800 text-xs"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {c.author} &bull;{" "}
                        <span className="font-normal text-slate-500">{c.role}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {c.date}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {c.note}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                No comments or approval notes yet.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-[#fbfcfd] dark:bg-slate-950/40 flex items-center justify-between shrink-0">
          <div>
            {onPrint && (
              <button
                type="button"
                onClick={() => onPrint(req)}
                className="h-8.5 px-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                Print Requisition Note
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {isApprovalMode && (
              <>
                {onReturn && (
                  <button
                    type="button"
                    onClick={() => onReturn(req)}
                    className="h-8.5 px-3.5 bg-orange-50 hover:bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 dark:hover:bg-orange-900/50 border border-orange-200 dark:border-orange-800 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    Return for Correction
                  </button>
                )}

                {onReject && (
                  <button
                    type="button"
                    onClick={() => onReject(req)}
                    className="h-8.5 px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    Reject
                  </button>
                )}

                {onApprove && (
                  <button
                    type="button"
                    onClick={() => onApprove(req)}
                    className="h-8.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    Approval Request
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-8.5 px-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


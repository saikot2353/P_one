import React, { useState } from "react";
import {
  X,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  AlertTriangle,
  FileCheck,
  Tag,
  Hash,
  GitBranch,
  Paperclip,
} from "lucide-react";
import {
  MMProductionFileRecord,
  ProductionFileAttachmentCategory,
  PRODUCTION_FILE_ATTACHMENT_CATEGORIES,
  ProductionFileAttachment,
  MMRepository,
} from "../../lib/marketing-merchandising-data";
import { ProductionFileAttachmentControl } from "./ProductionFileAttachmentControl";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MMProductionFileRecord | null;
  onEdit?: (record: MMProductionFileRecord) => void;
  onAmend?: (record: MMProductionFileRecord) => void;
}

export function ProductionFileDetailModal({
  isOpen,
  onClose,
  record,
  onEdit,
  onAmend,
}: DetailModalProps) {
  if (!isOpen || !record) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
      case "Submitted":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800";
      case "Rejected":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header - NO FOLDER ICON */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Production File Details
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {record.versionType === "Amendment" ? `Amendment v${record.version}` : `Version ${record.version || 1}`}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                  record.status
                )}`}
              >
                {record.status === "Submitted" ? "Submitted (Pending Approval)" : record.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Source: <span className="font-semibold text-slate-700 dark:text-slate-300">{record.sourceType}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Rejection Alert if rejected */}
          {record.status === "Rejected" && record.rejectionReason && (
            <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300">
                  Returned for Correction by Approver
                </h4>
                <p className="text-xs text-rose-700 dark:text-rose-400 mt-1 font-medium">
                  {record.rejectionReason}
                </p>
                <p className="text-[11px] text-rose-600 dark:text-rose-500 mt-2">
                  Reviewed by {record.rejectedBy || "Approver"} on {record.rejectedDate || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* Source & Job Information (Pre Costing No and Style Description REMOVED per spec) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Source & Job Information
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Source Type</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{record.sourceType}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Job No.</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{record.jobNo || "—"}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Buyer</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{record.buyerName || "—"}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Style</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{record.styleNo}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Season</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{record.season || "—"}</span>
              </div>
            </div>
          </div>

          {/* PO Details */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Purchase Order (PO) Details
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {record.poItems.length} PO row(s)
              </span>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-2 w-16 text-center">SL</th>
                    <th className="px-4 py-2">PO Number</th>
                    <th className="px-4 py-2 text-right">PO QTY (Pcs)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {record.poItems.length > 0 ? (
                    record.poItems.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="px-4 py-2 text-center text-slate-500">{idx + 1}</td>
                        <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">{item.po}</td>
                        <td className="px-4 py-2 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                          {item.poQty.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-xs text-slate-500">
                        No PO details recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-slate-100/90 dark:bg-slate-800 font-bold border-t border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                  <tr>
                    <td colSpan={2} className="px-4 py-2 text-right uppercase tracking-wider text-[10px]">
                      Total PO QTY:
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-xs text-teal-700 dark:text-teal-400">
                      {record.totalPoQty.toLocaleString()} pcs
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Production Document Attachments (4-Column Grid, No 1-7 prefix, No (7 Categories)) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Production Document Attachments
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRODUCTION_FILE_ATTACHMENT_CATEGORIES.map((category) => (
                <ProductionFileAttachmentControl
                  key={category}
                  category={category}
                  attachments={record.attachments}
                  isReadOnly={true}
                  jobNo={record.jobNo}
                  styleNo={record.styleNo}
                  currentVersion={record.version || 1}
                />
              ))}
            </div>
          </div>

          {/* Metadata & Approvals */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Created By</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{record.createdBy}</span>
              <span className="text-[11px] text-slate-400 block">{record.createdDate}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Submitted By</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{record.submittedBy || "—"}</span>
              <span className="text-[11px] text-slate-400 block">{record.submittedDate || "Not submitted"}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Approval Decision</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {record.approvedBy
                  ? `Approved by ${record.approvedBy}`
                  : record.rejectedBy
                  ? `Rejected by ${record.rejectedBy}`
                  : "Pending"}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {record.approvedDate || record.rejectedDate || "Awaiting decision"}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Notes / Remarks</span>
              <span className="text-slate-700 dark:text-slate-300 text-[11px] line-clamp-2">
                {record.notes || record.approvalComments || "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {record.attachments.length} document(s) attached
          </div>
          <div className="flex items-center gap-2">
            {record.status === "Approved" && onAmend && (
              <button
                onClick={() => {
                  onClose();
                  onAmend(record);
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition shadow-sm flex items-center gap-1.5"
              >
                <GitBranch className="w-3.5 h-3.5" />
                Amend Production File
              </button>
            )}
            {(record.status === "Draft" || record.status === "Rejected") && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(record);
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition shadow-sm"
              >
                {record.status === "Draft" ? "Resume Editing Draft" : "Correct & Resubmit"}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AttachmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MMProductionFileRecord | null;
}

export function ProductionFileAttachmentsModal({ isOpen, onClose, record }: AttachmentsModalProps) {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header - NO FOLDER ICON */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Production File Attachments
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Job: {record.jobNo} | Style: {record.styleNo} | Version {record.version || 1}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-column grid for the 7 categories (NO 1-7 prefix) */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRODUCTION_FILE_ATTACHMENT_CATEGORIES.map((category) => (
              <ProductionFileAttachmentControl
                key={category}
                category={category}
                attachments={record.attachments}
                isReadOnly={true}
                jobNo={record.jobNo}
                styleNo={record.styleNo}
                currentVersion={record.version || 1}
              />
            ))}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MMProductionFileRecord | null;
}

export function ProductionFileVersionHistoryModal({
  isOpen,
  onClose,
  record,
}: VersionHistoryModalProps) {
  if (!isOpen || !record) return null;

  // Retrieve complete version history
  const versions = MMRepository.getVersionHistory(record.parentFileId || record.fileRefNo || record.id);

  const getStatusBadge = (status: string, isCurrent: boolean) => {
    if (isCurrent && status === "Approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3" /> Current Approved
        </span>
      );
    }
    if (status === "Submitted") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <Clock className="w-3 h-3" /> Pending Review
        </span>
      );
    }
    if (status === "Rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
          <XCircle className="w-3 h-3" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
        Historical Approved
      </span>
    );
  };

  const handleDownloadAttachment = (att: ProductionFileAttachment) => {
    const content = `CriptonHRIS Historical Attachment: ${att.fileName} (v${att.version || 1})\nCategory: ${att.category}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = att.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div>
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Production File Version History
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Job: {record.jobNo} | Style: {record.styleNo} | Total Versions: {versions.length}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Version List */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[70vh]">
          {versions.length > 0 ? (
            versions.map((v: MMProductionFileRecord) => (
              <div
                key={v.id}
                className={`p-4 rounded-xl border text-xs transition ${
                  v.isCurrentActive && v.status === "Approved"
                    ? "bg-teal-50/40 dark:bg-teal-950/20 border-teal-300 dark:border-teal-800 shadow-sm"
                    : v.status === "Submitted"
                    ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800"
                    : "bg-slate-50/60 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      Version {v.version} ({v.versionType})
                    </span>
                    {getStatusBadge(v.status, v.isCurrentActive)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Created: <span className="font-mono">{v.createdDate}</span> by {v.createdBy}
                  </div>
                </div>

                {/* Amendment Reason */}
                {v.amendmentReason && (
                  <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs mb-3">
                    <strong>Amendment Reason:</strong> {v.amendmentReason}
                  </div>
                )}

                {/* Rejection Reason */}
                {v.rejectionReason && (
                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs mb-3">
                    <strong>Rejection Reason:</strong> {v.rejectionReason} (by {v.rejectedBy} on {v.rejectedDate})
                  </div>
                )}

                {/* Decision Info */}
                {v.approvedBy && (
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mb-2">
                    Approved by <strong>{v.approvedBy}</strong> on {v.approvedDate}{" "}
                    {v.approvalComments && `— "${v.approvalComments}"`}
                  </div>
                )}

                {/* Version's Specific Attachments */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">
                    Attached Documents in Version {v.version} ({v.attachments.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {v.attachments.map((att: ProductionFileAttachment) => (
                      <div
                        key={att.id}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                            {att.category}
                          </span>
                          <span className="text-slate-500 truncate block text-[10px]">
                            {att.fileName} ({att.fileSize})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDownloadAttachment(att)}
                          className="p-1 rounded text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950 shrink-0"
                          title="Download file"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">No version history records found.</p>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

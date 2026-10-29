import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  AlertTriangle,
  Search,
  UserCheck,
  X,
  RefreshCw,
  GitBranch,
  Paperclip,
} from "lucide-react";
import {
  MMRepository,
  MMProductionFileRecord,
  PRODUCTION_FILE_ATTACHMENT_CATEGORIES,
} from "../../lib/marketing-merchandising-data";
import { ProductionFileAttachmentControl } from "./ProductionFileAttachmentControl";

export function ProductionFileApprovalView() {
  const navigate = useNavigate();

  // All files loaded from repository
  const [allFiles, setAllFiles] = useState<MMProductionFileRecord[]>([]);

  // Tab: "pending" | "approved" | "rejected" | "all"
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Review Modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeReviewRecord, setActiveReviewRecord] = useState<MMProductionFileRecord | null>(null);

  // Decision Dialog states
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");
  const [decisionProcessing, setDecisionProcessing] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Current logged in approver name
  const currentApprover = useMemo(() => {
    try {
      const saved = localStorage.getItem("cripton_current_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.name || "Rafiqul Islam (Production GM)";
      }
    } catch {
      // fallback
    }
    return "Rafiqul Islam (Production GM)";
  }, []);

  const loadFiles = () => {
    const list = MMRepository.getProductionFiles();
    setAllFiles(list);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // Filtered lists for tabs
  const pendingQueue = useMemo(() => {
    // ONLY Submitted records (strictly NO Drafts)
    return allFiles.filter((f) => f.status === "Submitted");
  }, [allFiles]);

  const approvedList = useMemo(() => {
    return allFiles.filter((f) => f.status === "Approved");
  }, [allFiles]);

  const rejectedList = useMemo(() => {
    return allFiles.filter((f) => f.status === "Rejected");
  }, [allFiles]);

  // Tab displayed records
  const displayedRecords = useMemo(() => {
    let list: MMProductionFileRecord[] = [];
    if (activeTab === "pending") list = pendingQueue;
    else if (activeTab === "approved") list = approvedList;
    else if (activeTab === "rejected") list = rejectedList;
    else list = allFiles.filter((f) => f.status !== "Draft");

    if (!searchTerm.trim()) return list;
    const q = searchTerm.toLowerCase();
    return list.filter(
      (f) =>
        f.jobNo.toLowerCase().includes(q) ||
        f.styleNo.toLowerCase().includes(q) ||
        (f.buyerName && f.buyerName.toLowerCase().includes(q)) ||
        (f.submittedBy && f.submittedBy.toLowerCase().includes(q))
    );
  }, [activeTab, pendingQueue, approvedList, rejectedList, allFiles, searchTerm]);

  // Handle Approve Decision
  const handleConfirmApprove = () => {
    if (!activeReviewRecord) return;
    setDecisionProcessing(true);

    setTimeout(() => {
      const isAmd = activeReviewRecord.versionType === "Amendment";
      const success = MMRepository.approveProductionFile(
        activeReviewRecord.id,
        currentApprover,
        approvalComment.trim() || undefined
      );

      setDecisionProcessing(false);
      setShowApproveDialog(false);
      setReviewModalOpen(false);

      if (success) {
        setToast({
          type: "success",
          message: isAmd
            ? `Production File Amendment (Version ${activeReviewRecord.version}) Approved! New version is now current approved.`
            : `Production File for ${activeReviewRecord.jobNo} Approved successfully!`,
        });
        loadFiles();
      }
    }, 400);
  };

  // Handle Reject Decision
  const handleConfirmReject = () => {
    if (!activeReviewRecord) return;
    if (!rejectionReason.trim()) {
      setRejectionError("Please provide a mandatory reason for rejecting this production file.");
      return;
    }
    setRejectionError("");
    setDecisionProcessing(true);

    setTimeout(() => {
      const isAmd = activeReviewRecord.versionType === "Amendment";
      const success = MMRepository.rejectProductionFile(
        activeReviewRecord.id,
        currentApprover,
        rejectionReason.trim()
      );

      setDecisionProcessing(false);
      setShowRejectDialog(false);
      setReviewModalOpen(false);

      if (success) {
        setToast({
          type: "info",
          message: isAmd
            ? `Amendment (Version ${activeReviewRecord.version}) Rejected. Previous approved version remains current active.`
            : `Production File Rejected and returned for correction. Rejection details logged to history.`,
        });
        loadFiles();
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Header - NO FOLDER ICON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Marketing & Merchandising</span>
            <span>/</span>
            <span>Production File Management</span>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">Production File Approval</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Production File Approval Queue</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              {pendingQueue.length} Pending Review
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadFiles}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Refresh Queue"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate({ to: "/mm-production-file-register" })}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            View Full Register
          </button>
        </div>
      </div>

      {/* Global Toast */}
      {toast && (
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
            toast.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
              : "bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Queue Tabs & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg w-full sm:w-auto overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 ${
                activeTab === "pending"
                  ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Pending Queue</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                {pendingQueue.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("approved")}
              className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 ${
                activeTab === "approved"
                  ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Approved</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                {approvedList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 ${
                activeTab === "rejected"
                  ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Rejected</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold">
                {rejectedList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 ${
                activeTab === "all"
                  ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <span>All Processed</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search queue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Queue Table (Columns "Production File Ref", "Pre Costing No", and "PO Summary" REMOVED per spec) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-3.5 py-3">Job No.</th>
                <th className="px-3.5 py-3">Style</th>
                <th className="px-3.5 py-3 text-right">Total PO QTY</th>
                <th className="px-3.5 py-3">Submitted By</th>
                <th className="px-3.5 py-3">Submission Date</th>
                <th className="px-3.5 py-3 text-center">Status</th>
                <th className="px-3.5 py-3 text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {displayedRecords.length > 0 ? (
                displayedRecords.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-850/60 transition"
                  >
                    <td className="px-3.5 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span>{item.jobNo || "—"}</span>
                        {item.versionType === "Amendment" && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300">
                            Amendment v{item.version}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3.5 py-3">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                        {item.styleNo}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[140px]">
                        {item.buyerName || ""}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                      {item.totalPoQty.toLocaleString()}
                    </td>
                    <td className="px-3.5 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {item.submittedBy || "—"}
                    </td>
                    <td className="px-3.5 py-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {item.submittedDate || "—"}
                    </td>
                    <td className="px-3.5 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          item.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                            : item.status === "Rejected"
                            ? "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                            : "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                        }`}
                      >
                        {item.status === "Submitted" ? "Pending Approval" : item.status}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-center">
                      <button
                        onClick={() => {
                          setActiveReviewRecord(item);
                          setApprovalComment("");
                          setRejectionReason("");
                          setRejectionError("");
                          setReviewModalOpen(true);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition w-full ${
                          item.status === "Submitted"
                            ? "bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{item.status === "Submitted" ? "Review & Decide" : "View Review"}</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                    <p className="text-xs font-medium">
                      {activeTab === "pending"
                        ? "Pending queue is currently clear! No production files awaiting approval."
                        : "No records found under this tab."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review and Decide Modal (NO A, B, C, D, E prefixes, NO Selected Source Ref, NO Style Description, 4-column grid for attachments) */}
      {reviewModalOpen && activeReviewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Production File Approval Review
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    {activeReviewRecord.versionType === "Amendment"
                      ? `Amendment Version ${activeReviewRecord.version}`
                      : `Version ${activeReviewRecord.version || 1}`}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Approver: <strong className="text-slate-700 dark:text-slate-300">{currentApprover}</strong> |
                  Status: {activeReviewRecord.status}
                </p>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Amendment Reason Banner if reviewing an amendment */}
              {activeReviewRecord.versionType === "Amendment" && activeReviewRecord.amendmentReason && (
                <div className="p-3.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-start gap-3">
                  <GitBranch className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-teal-900 dark:text-teal-200 block">
                      Proposed Amendment Reason:
                    </span>
                    <p className="text-teal-800 dark:text-teal-300 mt-0.5 font-medium">
                      {activeReviewRecord.amendmentReason}
                    </p>
                  </div>
                </div>
              )}

              {/* Prior Rejection Alert if record has rejection history */}
              {activeReviewRecord.rejectionReason && (
                <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-rose-800 dark:text-rose-300 block">
                      Prior Rejection Reason on Record:
                    </span>
                    <p className="text-rose-700 dark:text-rose-400 mt-0.5">{activeReviewRecord.rejectionReason}</p>
                  </div>
                </div>
              )}

              {/* Source and Job Information (NO alphabetical prefix, NO Selected Source Ref, NO Style Description) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Source and Job Information
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Source Type</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeReviewRecord.sourceType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Job No.</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeReviewRecord.jobNo || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Style</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeReviewRecord.styleNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Buyer</span>
                    <span className="text-slate-700 dark:text-slate-300">{activeReviewRecord.buyerName || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Season</span>
                    <span className="text-slate-700 dark:text-slate-300">{activeReviewRecord.season || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Purchase Order (PO) Details (NO alphabetical prefix) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Purchase Order (PO) Details
                </h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-2 w-16 text-center">SL</th>
                        <th className="px-4 py-2">PO (Purchase Order)</th>
                        <th className="px-4 py-2 text-right">PO QTY (Pcs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {activeReviewRecord.poItems.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="px-4 py-2 text-center text-slate-500">{idx + 1}</td>
                          <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">{item.po}</td>
                          <td className="px-4 py-2 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                            {item.poQty.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100/90 dark:bg-slate-800 font-bold border-t border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                      <tr>
                        <td colSpan={2} className="px-4 py-2 text-right uppercase tracking-wider text-[10px]">
                          Total PO QTY:
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-xs text-teal-700 dark:text-teal-400">
                          {activeReviewRecord.totalPoQty.toLocaleString()} pcs
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Attachments Verification (4-Column Grid, NO (All 7 Categories) in title, NO serial 1-7 prefix) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Attachments Verification
                  </h4>
                  <span className="text-xs text-teal-700 dark:text-teal-400 font-semibold">
                    {activeReviewRecord.attachments.length} Total Files Attached
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {PRODUCTION_FILE_ATTACHMENT_CATEGORIES.map((category) => (
                    <ProductionFileAttachmentControl
                      key={category}
                      category={category}
                      attachments={activeReviewRecord.attachments}
                      isReadOnly={true}
                      isAmendmentMode={activeReviewRecord.versionType === "Amendment"}
                      jobNo={activeReviewRecord.jobNo}
                      styleNo={activeReviewRecord.styleNo}
                      currentVersion={activeReviewRecord.version || 1}
                    />
                  ))}
                </div>
              </div>

              {/* Submission Information & Audit Log (NO alphabetical prefix) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Submission Information & Audit Log
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Created By</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{activeReviewRecord.createdBy}</span>
                    <span className="text-[11px] text-slate-400 block">{activeReviewRecord.createdDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Submitted By</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {activeReviewRecord.submittedBy || "—"}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      {activeReviewRecord.submittedDate || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Current Status</span>
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      {activeReviewRecord.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Merchandiser Remarks</span>
                    <span className="text-slate-700 dark:text-slate-300 italic text-[11px]">
                      {activeReviewRecord.notes || "None"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Approval Decision (NO alphabetical prefix) */}
              {activeReviewRecord.status === "Submitted" ? (
                <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/20 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300">
                        Approval Decision
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Verify all document categories and quantities above before approving or rejecting.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowRejectDialog(true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition shadow-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject / Return for Correction
                      </button>
                      <button
                        onClick={() => setShowApproveDialog(true)}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {activeReviewRecord.versionType === "Amendment"
                          ? `Approve Amendment v${activeReviewRecord.version}`
                          : "Approve Production File"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">Record Decision: </span>
                    <strong className="text-slate-900 dark:text-slate-100">
                      {activeReviewRecord.status === "Approved"
                        ? `Approved by ${activeReviewRecord.approvedBy} on ${activeReviewRecord.approvedDate}`
                        : `Rejected by ${activeReviewRecord.rejectedBy} on ${activeReviewRecord.rejectedDate}`}
                    </strong>
                  </div>
                  <span className="text-xs text-slate-400 italic">No further decision required</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 flex justify-end">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: Approve */}
      {showApproveDialog && activeReviewRecord && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {activeReviewRecord.versionType === "Amendment"
                    ? `Approve Amendment Version ${activeReviewRecord.version}`
                    : "Approve Production File"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Job: {activeReviewRecord.jobNo} — {activeReviewRecord.styleNo}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {activeReviewRecord.versionType === "Amendment"
                ? `Approving will make Version ${activeReviewRecord.version} the current active approved version. The previous approved version will be preserved in historical records.`
                : `Approving will update the record status to Approved, remove it from the pending approval queue, and record your approval in the register.`}
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Approval Comments (Optional)
              </label>
              <textarea
                rows={2}
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder="e.g. Approved for bulk fabric cutting and marker release..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowApproveDialog(false)}
                disabled={decisionProcessing}
                className="px-4 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                disabled={decisionProcessing}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
              >
                {decisionProcessing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: Reject */}
      {showRejectDialog && activeReviewRecord && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <XCircle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {activeReviewRecord.versionType === "Amendment"
                    ? `Reject Amendment Version ${activeReviewRecord.version}`
                    : "Reject Production File"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Job: {activeReviewRecord.jobNo} — {activeReviewRecord.styleNo}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {activeReviewRecord.versionType === "Amendment"
                ? `Rejecting will keep the previously approved version as current active. The rejected amendment will be recorded in historical audit logs.`
                : `Rejecting will return this production file to the merchandiser for correction.`}
            </p>

            <div>
              <label className="block text-xs font-semibold text-rose-700 dark:text-rose-300 mb-1">
                Mandatory Rejection Reason / Instructions <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  setRejectionError("");
                }}
                placeholder="Specify which attachments or details require correction..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              {rejectionError && <p className="text-[11px] text-rose-600 mt-1">{rejectionError}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectDialog(false)}
                disabled={decisionProcessing}
                className="px-4 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={decisionProcessing}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition"
              >
                {decisionProcessing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

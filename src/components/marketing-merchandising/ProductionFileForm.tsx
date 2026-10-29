import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Save,
  Send,
  RefreshCw,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Search,
  Check,
  ChevronDown,
  X,
  Layers,
  GitBranch,
} from "lucide-react";
import {
  MMRepository,
  MMProductionFileRecord,
  ProductionFileSourceType,
  ProductionFilePOItem,
  ProductionFileAttachment,
  ProductionFileAttachmentCategory,
  PRODUCTION_FILE_ATTACHMENT_CATEGORIES,
} from "../../lib/marketing-merchandising-data";
import { ProductionFileAttachmentControl } from "./ProductionFileAttachmentControl";

interface ProductionFileFormProps {
  initialRecordId?: string;
  isEditMode?: boolean;
  isAmendmentMode?: boolean;
}

export function ProductionFileForm({
  initialRecordId,
  isEditMode = false,
  isAmendmentMode = false,
}: ProductionFileFormProps) {
  const navigate = useNavigate();

  // Source options from MM repository
  const [sources, setSources] = useState<{
    confirmOrders: Array<{
      id: string;
      jobNo: string;
      orderNo: string;
      styleNo: string;
      buyerName: string;
      season: string;
      preCostId?: string;
      totalQty: number;
      poItems: ProductionFilePOItem[];
    }>;
    preCostings: Array<{
      id: string;
      preCostNo: string;
      jobNo: string;
      styleNo: string;
      buyerName: string;
      season: string;
      totalQty: number;
      poItems: ProductionFilePOItem[];
    }>;
  }>({ confirmOrders: [], preCostings: [] });

  // Existing record being edited if any
  const [existingRecord, setExistingRecord] = useState<MMProductionFileRecord | null>(null);

  // Form State
  const [fileRefNo, setFileRefNo] = useState("");
  const [version, setVersion] = useState(1);
  const [versionType, setVersionType] = useState<"Original" | "Amendment">("Original");
  const [amendmentReason, setAmendmentReason] = useState("");
  const [activeSourceType, setActiveSourceType] = useState<ProductionFileSourceType | null>(null);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedPreCostNo, setSelectedPreCostNo] = useState("");

  // Source-derived fields (Strictly Read-Only from active source)
  const [jobNo, setJobNo] = useState("");
  const [preCostNo, setPreCostNo] = useState("");
  const [styleNo, setStyleNo] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [season, setSeason] = useState("");
  const [styleDescription, setStyleDescription] = useState("");

  // PO Details
  const [poItems, setPoItems] = useState<ProductionFilePOItem[]>([]);

  // Attachments (organized across the 7 categories)
  const [attachments, setAttachments] = useState<ProductionFileAttachment[]>([]);

  // Optional notes / remarks
  const [notes, setNotes] = useState("");

  // Confirmation dialog state for switching source
  const [pendingSourceSwitch, setPendingSourceSwitch] = useState<{
    type: ProductionFileSourceType;
    value: string;
  } | null>(null);
  const [showConfirmSwitchModal, setShowConfirmSwitchModal] = useState(false);

  // Search dropdown popovers
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const [jobDropdownOpen, setJobDropdownOpen] = useState(false);
  const [pcSearchTerm, setPcSearchTerm] = useState("");
  const [pcDropdownOpen, setPcDropdownOpen] = useState(false);

  // Feedback states
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(
    null
  );

  // Current logged in user helper
  const currentUser = useMemo(() => {
    try {
      const saved = localStorage.getItem("cripton_current_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.name || "Tanvir Ahmed (Merchandiser)";
      }
    } catch {
      // fallback
    }
    return "Tanvir Ahmed (Merchandiser)";
  }, []);

  // Total PO QTY calculated automatically as sum
  const totalPoQty = useMemo(() => {
    return poItems.reduce((acc, curr) => acc + (Number(curr.poQty) || 0), 0);
  }, [poItems]);

  // Load source data & record on mount
  useEffect(() => {
    const opts = MMRepository.getSourceOptionsForProductionFile();
    setSources(opts);

    if (initialRecordId) {
      const rec = MMRepository.getProductionFileById(initialRecordId);
      if (rec) {
        setExistingRecord(rec);
        setFileRefNo(rec.fileRefNo);
        setVersion(rec.version || 1);
        setVersionType(rec.versionType || "Original");
        setAmendmentReason(rec.amendmentReason || "");
        setActiveSourceType(rec.sourceType);
        if (rec.sourceType === "Confirm Order Entry") {
          setSelectedJobId(rec.jobNo);
        } else {
          setSelectedPreCostNo(rec.preCostNo || rec.sourceReference);
        }
        setJobNo(rec.jobNo);
        setPreCostNo(rec.preCostNo || "");
        setStyleNo(rec.styleNo);
        setBuyerName(rec.buyerName || "");
        setSeason(rec.season || "");
        setStyleDescription(rec.styleDescription || "");
        setPoItems(rec.poItems || []);
        setAttachments(rec.attachments || []);
        setNotes(rec.notes || "");
        return;
      }
    }

    // New record: generate reference number
    const list = MMRepository.getProductionFiles();
    const nextNum = list.length + 1;
    setFileRefNo(`PF-2026-${String(nextNum).padStart(4, "0")}`);
  }, [initialRecordId]);

  // Filtered dropdown lists
  const filteredConfirmOrders = useMemo(() => {
    if (!jobSearchTerm.trim()) return sources.confirmOrders;
    const q = jobSearchTerm.toLowerCase();
    return sources.confirmOrders.filter(
      (o) =>
        o.jobNo.toLowerCase().includes(q) ||
        o.styleNo.toLowerCase().includes(q) ||
        o.buyerName.toLowerCase().includes(q)
    );
  }, [sources.confirmOrders, jobSearchTerm]);

  const filteredPreCostings = useMemo(() => {
    if (!pcSearchTerm.trim()) return sources.preCostings;
    const q = pcSearchTerm.toLowerCase();
    return sources.preCostings.filter(
      (pc) =>
        pc.preCostNo.toLowerCase().includes(q) ||
        pc.styleNo.toLowerCase().includes(q) ||
        pc.buyerName.toLowerCase().includes(q) ||
        pc.jobNo.toLowerCase().includes(q)
    );
  }, [sources.preCostings, pcSearchTerm]);

  // Apply source selection logic (Latest selection wins, replaces previous data)
  const applySource = (type: ProductionFileSourceType, identifier: string) => {
    if (type === "Confirm Order Entry") {
      const match = sources.confirmOrders.find((o) => o.jobNo === identifier || o.id === identifier);
      if (match) {
        setActiveSourceType("Confirm Order Entry");
        setSelectedJobId(match.jobNo);
        setSelectedPreCostNo(""); // Clear previous source selection
        setJobNo(match.jobNo);
        setPreCostNo(match.preCostId || "");
        setStyleNo(match.styleNo);
        setBuyerName(match.buyerName);
        setSeason(match.season);
        setStyleDescription(`Loaded from Confirm Order Entry — ${match.orderNo}`);
        setPoItems(match.poItems.map((p) => ({ ...p })));
        setJobDropdownOpen(false);
      }
    } else {
      const match = sources.preCostings.find(
        (pc) => pc.preCostNo === identifier || pc.id === identifier
      );
      if (match) {
        setActiveSourceType("Pre Costing");
        setSelectedPreCostNo(match.preCostNo);
        setSelectedJobId(""); // Clear previous source selection
        setJobNo(match.jobNo || "");
        setPreCostNo(match.preCostNo);
        setStyleNo(match.styleNo);
        setBuyerName(match.buyerName);
        setSeason(match.season);
        setStyleDescription(`Loaded from Pre Costing — ${match.preCostNo}`);
        setPoItems(match.poItems.map((p) => ({ ...p })));
        setPcDropdownOpen(false);
      }
    }
  };

  // Handler when user selects a Job ID
  const handleSelectJob = (jobVal: string) => {
    if (isAmendmentMode) return; // Protected during amendment
    if (activeSourceType && activeSourceType !== "Confirm Order Entry" && (poItems.length > 0 || attachments.length > 0)) {
      setPendingSourceSwitch({ type: "Confirm Order Entry", value: jobVal });
      setShowConfirmSwitchModal(true);
      return;
    }
    applySource("Confirm Order Entry", jobVal);
  };

  // Handler when user selects a Pre Costing No
  const handleSelectPreCost = (pcVal: string) => {
    if (isAmendmentMode) return; // Protected during amendment
    if (activeSourceType && activeSourceType !== "Pre Costing" && (poItems.length > 0 || attachments.length > 0)) {
      setPendingSourceSwitch({ type: "Pre Costing", value: pcVal });
      setShowConfirmSwitchModal(true);
      return;
    }
    applySource("Pre Costing", pcVal);
  };

  // Confirm source switch
  const confirmSourceSwitch = () => {
    if (pendingSourceSwitch) {
      applySource(pendingSourceSwitch.type, pendingSourceSwitch.value);
      setPendingSourceSwitch(null);
    }
    setShowConfirmSwitchModal(false);
  };

  // Add attachment handler
  const handleAddAttachment = (newAtt: ProductionFileAttachment) => {
    setAttachments((prev) => [...prev, newAtt]);
    setNotification({
      type: "success",
      message: `Attachment uploaded successfully under ${newAtt.category}.`,
    });
  };

  // Remove attachment handler
  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Form Save as Draft
  const handleSaveAsDraft = () => {
    if (!activeSourceType) {
      setNotification({
        type: "error",
        message: "Please select a source (Job ID or Pre Costing No.) before saving draft.",
      });
      return;
    }

    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const recordId = existingRecord?.id || `pf-rec-${Date.now()}`;
    const sourceRef = activeSourceType === "Confirm Order Entry" ? selectedJobId : selectedPreCostNo;

    const draftRecord: MMProductionFileRecord = {
      id: recordId,
      fileRefNo: fileRefNo || `PF-2026-${Date.now().toString().slice(-4)}`,
      version,
      versionType,
      isCurrentActive: false,
      parentFileId: existingRecord?.parentFileId || fileRefNo,
      previousVersionId: existingRecord?.previousVersionId,
      amendmentReason: amendmentReason || existingRecord?.amendmentReason,
      sourceType: activeSourceType,
      sourceRecordId: activeSourceType === "Confirm Order Entry" ? selectedJobId : selectedPreCostNo,
      sourceReference: sourceRef,
      jobNo,
      preCostNo: preCostNo || undefined,
      styleNo,
      styleDescription,
      buyerName,
      season,
      poItems,
      totalPoQty,
      attachments,
      status: "Draft",
      notes,
      createdBy: existingRecord?.createdBy || currentUser,
      createdDate: existingRecord?.createdDate || now,
      lastUpdatedBy: currentUser,
      lastUpdatedDate: now,
      history: [
        ...(existingRecord?.history || []),
        {
          id: "pfh-" + Date.now(),
          timestamp: now,
          action: "Draft Saved",
          userName: currentUser,
          userRole: "Merchandiser",
          comments: isAmendmentMode
            ? `Production file amendment draft saved (Version ${version}).`
            : "Production file draft saved.",
        },
      ],
    };

    MMRepository.saveProductionFile(draftRecord);
    setNotification({
      type: "success",
      message: `Draft saved successfully (${draftRecord.fileRefNo}). You can resume editing anytime from the Register.`,
    });

    setTimeout(() => {
      navigate({ to: "/mm-production-file-register" });
    }, 1200);
  };

  // Form Submit for Approval
  const handleSubmit = () => {
    if (!activeSourceType) {
      setNotification({
        type: "error",
        message: "Source selection is required. Please select a Job ID or Pre Costing No.",
      });
      return;
    }

    if (!jobNo || !styleNo) {
      setNotification({
        type: "error",
        message: "Job No. and Style No. must be available from the selected source.",
      });
      return;
    }

    if (attachments.length === 0) {
      setNotification({
        type: "error",
        message: "Please attach at least one production document before submitting.",
      });
      return;
    }

    setSubmitting(true);
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const recordId = existingRecord?.id || `pf-rec-${Date.now()}`;
    const sourceRef = activeSourceType === "Confirm Order Entry" ? selectedJobId : selectedPreCostNo;

    const submittedRecord: MMProductionFileRecord = {
      id: recordId,
      fileRefNo: fileRefNo || `PF-2026-${Date.now().toString().slice(-4)}`,
      version,
      versionType,
      isCurrentActive: false,
      parentFileId: existingRecord?.parentFileId || fileRefNo,
      previousVersionId: existingRecord?.previousVersionId,
      amendmentReason: amendmentReason || existingRecord?.amendmentReason,
      sourceType: activeSourceType,
      sourceRecordId: activeSourceType === "Confirm Order Entry" ? selectedJobId : selectedPreCostNo,
      sourceReference: sourceRef,
      jobNo,
      preCostNo: preCostNo || undefined,
      styleNo,
      styleDescription,
      buyerName,
      season,
      poItems,
      totalPoQty,
      attachments,
      status: "Submitted",
      notes,
      createdBy: existingRecord?.createdBy || currentUser,
      createdDate: existingRecord?.createdDate || now,
      submittedBy: currentUser,
      submittedDate: now,
      lastUpdatedBy: currentUser,
      lastUpdatedDate: now,
      rejectedBy: undefined,
      rejectedDate: undefined,
      rejectionReason: undefined,
      history: [
        ...(existingRecord?.history || []),
        {
          id: "pfh-" + Date.now(),
          timestamp: now,
          action: isAmendmentMode
            ? "Submitted"
            : existingRecord?.status === "Rejected"
            ? "Resubmitted"
            : "Submitted",
          userName: currentUser,
          userRole: "Merchandiser",
          comments: isAmendmentMode
            ? `Amendment Version ${version} submitted for Production Approval.`
            : existingRecord?.status === "Rejected"
            ? "Resubmitted with corrections."
            : "Submitted for Production Approval.",
        },
      ],
    };

    MMRepository.saveProductionFile(submittedRecord);

    setTimeout(() => {
      setSubmitting(false);
      setNotification({
        type: "success",
        message: isAmendmentMode
          ? `Production File Amendment (v${version}) submitted successfully! Awaiting review in Approval queue.`
          : `Production File submitted successfully! Now awaiting approval in the Production File Approval queue.`,
      });
      setTimeout(() => {
        navigate({ to: "/mm-production-file-register" });
      }, 1500);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb & Actions Bar (NO FOLDER ICONS) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Marketing & Merchandising</span>
            <span>/</span>
            <span>Production File Management</span>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {isAmendmentMode
                ? `Production File Amendment (v${version})`
                : existingRecord
                ? `Edit Production File`
                : "New Production File"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              {isAmendmentMode ? (
                <>
                  <GitBranch className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span>Production File Amendment</span>
                </>
              ) : (
                <span>Production File Entry</span>
              )}
            </h1>

            {/* Version Badge */}
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {versionType === "Amendment" ? `Amendment v${version}` : `Version ${version}`}
            </span>

            {existingRecord?.status && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  existingRecord.status === "Rejected"
                    ? "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                    : "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                }`}
              >
                Status: {existingRecord.status}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate({ to: "/mm-production-file-register" })}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Register
          </button>
          <button
            onClick={handleSaveAsDraft}
            disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-sm"
          >
            <Save className="w-4 h-4 text-slate-500" />
            Save as Draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-sm"
          >
            {submitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isAmendmentMode
              ? `Submit Amendment v${version}`
              : existingRecord?.status === "Rejected"
              ? "Resubmit for Approval"
              : "Submit for Approval"}
          </button>
        </div>
      </div>

      {/* Amendment Notice Banner */}
      {isAmendmentMode && (
        <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 shadow-sm flex items-start gap-3">
          <GitBranch className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-teal-900 dark:text-teal-200">
              Production File Amendment Mode (Version {version})
            </h4>
            <p className="text-xs text-teal-800 dark:text-teal-300 mt-1">
              Job, Style, and PO information are locked and preserved from the approved original record. You may update,
              replace, or add document attachments below. Newly added files will appear beneath existing files.
            </p>
            {amendmentReason && (
              <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-1 font-semibold">
                Reason: {amendmentReason}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Rejection Alert if editing a rejected file */}
      {existingRecord?.status === "Rejected" && existingRecord.rejectionReason && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 shadow-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
              Revision Required — Reason for Rejection
            </h4>
            <p className="text-xs text-rose-800 dark:text-rose-300 mt-1 font-medium">
              "{existingRecord.rejectionReason}"
            </p>
            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-2">
              Rejected by {existingRecord.rejectedBy || "Approver"} on {existingRecord.rejectedDate || "N/A"}. Please
              update the attachments or data as requested and click <strong>Resubmit for Approval</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Global Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
              : notification.type === "error"
              ? "bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
              : "bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {notification.type === "error" && <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ROW 1: Side by Side: Copy From (Source Selection) and Job and Style Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Copy From (Source Selection) - No A/B/C prefix */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Copy From (Source Selection)
              </h3>
              {activeSourceType && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800">
                  Active: {activeSourceType}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dropdown 1: Job ID / Job Number */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Job No.
                </label>
                <div className="relative">
                  <button
                    type="button"
                    disabled={isAmendmentMode}
                    onClick={() => {
                      if (isAmendmentMode) return;
                      setJobDropdownOpen(!jobDropdownOpen);
                      setPcDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs rounded-lg border flex items-center justify-between transition ${
                      isAmendmentMode
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-600 cursor-not-allowed border-slate-300 dark:border-slate-700"
                        : activeSourceType === "Confirm Order Entry"
                        ? "border-teal-500 bg-teal-50/30 dark:bg-teal-950/20 text-slate-900 dark:text-slate-100 ring-2 ring-teal-500/20"
                        : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <span className="truncate">
                      {selectedJobId ? selectedJobId : "-- Select Job No. --"}
                    </span>
                    {!isAmendmentMode && <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />}
                  </button>

                  {jobDropdownOpen && !isAmendmentMode && (
                    <div className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search Job No, Style, Buyer..."
                            value={jobSearchTerm}
                            onChange={(e) => setJobSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                        {filteredConfirmOrders.length > 0 ? (
                          filteredConfirmOrders.map((o) => (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => handleSelectJob(o.jobNo)}
                              className={`w-full px-3 py-2 text-left hover:bg-teal-50 dark:hover:bg-slate-800 flex items-center justify-between ${
                                selectedJobId === o.jobNo ? "bg-teal-50/80 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300" : ""
                              }`}
                            >
                              <div>
                                <div className="font-semibold text-slate-900 dark:text-slate-100">{o.jobNo}</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {o.styleNo} | {o.buyerName} | {o.poItems.length} POs
                                </div>
                              </div>
                              {selectedJobId === o.jobNo && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-4 text-center text-xs text-slate-400">
                            No matching jobs found.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dropdown 2: Pre Costing No. */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pre Costing No.
                </label>
                <div className="relative">
                  <button
                    type="button"
                    disabled={isAmendmentMode}
                    onClick={() => {
                      if (isAmendmentMode) return;
                      setPcDropdownOpen(!pcDropdownOpen);
                      setJobDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs rounded-lg border flex items-center justify-between transition ${
                      isAmendmentMode
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-600 cursor-not-allowed border-slate-300 dark:border-slate-700"
                        : activeSourceType === "Pre Costing"
                        ? "border-teal-500 bg-teal-50/30 dark:bg-teal-950/20 text-slate-900 dark:text-slate-100 ring-2 ring-teal-500/20"
                        : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <span className="truncate">
                      {selectedPreCostNo ? selectedPreCostNo : "-- Select Pre Costing No. --"}
                    </span>
                    {!isAmendmentMode && <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />}
                  </button>

                  {pcDropdownOpen && !isAmendmentMode && (
                    <div className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search Pre Costing No, Style..."
                            value={pcSearchTerm}
                            onChange={(e) => setPcSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                        {filteredPreCostings.length > 0 ? (
                          filteredPreCostings.map((pc) => (
                            <button
                              key={pc.id}
                              type="button"
                              onClick={() => handleSelectPreCost(pc.preCostNo)}
                              className={`w-full px-3 py-2 text-left hover:bg-teal-50 dark:hover:bg-slate-800 flex items-center justify-between ${
                                selectedPreCostNo === pc.preCostNo
                              ? "bg-teal-50/80 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300"
                              : ""
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{pc.preCostNo}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {pc.styleNo} | {pc.buyerName} | {pc.poItems.length} POs
                            </div>
                          </div>
                          {selectedPreCostNo === pc.preCostNo && (
                            <Check className="w-4 h-4 text-teal-600 shrink-0" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-xs text-slate-400">
                        No matching Pre Costing records found.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
        </div>

        {/* Job and Style Information - No A/B/C prefix, removed description text */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
            Job and Style Information
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Job No.
              </label>
              <input
                type="text"
                readOnly
                value={jobNo || "—"}
                className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Style
              </label>
              <input
                type="text"
                readOnly
                value={styleNo || "—"}
                className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Buyer
              </label>
              <input
                type="text"
                readOnly
                value={buyerName || "—"}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Season
              </label>
              <input
                type="text"
                readOnly
                value={season || "—"}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Side by Side: PO Details and Production Document Attachments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* PO Details (Left Column: 5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">PO Details</h3>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {poItems.length} PO row(s)
            </span>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-3 py-2 w-12 text-center">SL</th>
                  <th className="px-3 py-2">PO (Purchase Order)</th>
                  <th className="px-3 py-2 text-right">PO QTY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {poItems.length > 0 ? (
                  poItems.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/60">
                      <td className="px-3 py-2 text-center text-slate-500">{idx + 1}</td>
                      <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{item.po}</td>
                      <td className="px-3 py-2 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                        {item.poQty.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-slate-400 italic text-xs">
                      {activeSourceType
                        ? "No PO records under this source."
                        : "Select a Job No. or Pre Costing No. to load POs."}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-100/90 dark:bg-slate-800 font-bold border-t border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                <tr>
                  <td colSpan={2} className="px-3 py-2 text-right uppercase tracking-wider text-[10px]">
                    Total PO QTY:
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-xs text-teal-700 dark:text-teal-400">
                    {totalPoQty.toLocaleString()} pcs
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Production Document Attachments (Right Column: 7 cols) - 4 Columns Grid Per Row */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Production Document Attachments
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Manage documents using the standard PI Entry attachment control.
              </p>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {attachments.length} Total Attached
            </span>
          </div>

          {/* 4-column grid per row (NO serial number prefixes 1-7) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {PRODUCTION_FILE_ATTACHMENT_CATEGORIES.map((category) => (
              <ProductionFileAttachmentControl
                key={category}
                category={category}
                attachments={attachments}
                onAddAttachment={handleAddAttachment}
                onRemoveAttachment={handleRemoveAttachment}
                isReadOnly={false}
                isAmendmentMode={isAmendmentMode}
                jobNo={jobNo}
                styleNo={styleNo}
                currentUser={currentUser}
                currentVersion={version}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Remarks & Notes */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          General Production File Notes / Remarks
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter production instructions, quality check remarks, or special packaging notes..."
          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {activeSourceType ? (
            <span>
              Source: <strong>{activeSourceType}</strong> | Job: {jobNo || "None"} | Total QTY:{" "}
              <strong className="text-teal-600 dark:text-teal-400">{totalPoQty.toLocaleString()} pcs</strong>
            </span>
          ) : (
            <span className="italic text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Please select a source above to activate form actions.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAsDraft}
            disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Save className="w-4 h-4" />
            Save as Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-md"
          >
            {submitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isAmendmentMode
              ? `Submit Amendment v${version}`
              : existingRecord?.status === "Rejected"
              ? "Resubmit for Approval"
              : "Submit Production File"}
          </button>
        </div>
      </div>

      {/* Confirm Switch Source Modal */}
      {showConfirmSwitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Confirm Source Switch
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Switching active source to <strong>{pendingSourceSwitch?.type}</strong> (
              {pendingSourceSwitch?.value}) will replace all current Job, Style, and PO details with the newly selected
              source data.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPendingSourceSwitch(null);
                  setShowConfirmSwitchModal(false);
                }}
                className="px-4 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSourceSwitch}
                className="px-4 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
              >
                Proceed with Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

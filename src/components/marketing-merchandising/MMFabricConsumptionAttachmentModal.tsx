import React, { useState, useRef, useMemo } from "react";
import {
  Paperclip,
  X,
  File as FileIcon,
  Info,
  AlertTriangle,
  Upload,
  Trash2,
  Download,
  CheckCircle2,
  Tag,
  RefreshCw,
  Layers,
  History,
} from "lucide-react";
import { toast } from "sonner";
import { MMFabricConsumptionAttachment } from "../../lib/marketing-merchandising-data";

export interface MMFabricConsumptionAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestNo: string;
  buyerName: string;
  styleName: string;
  attachments: MMFabricConsumptionAttachment[];
  onAddAttachment: (newRecord: MMFabricConsumptionAttachment) => void;
  onDeleteAttachment: (id: string) => void;
  currentUser: string;
  currentRole?: "Merchant" | "CAD";
  readOnly?: boolean;
  currentVersion?: number;
  onReplaceAttachment?: (oldId: string, newRecord: MMFabricConsumptionAttachment) => void;
}

export const MMFabricConsumptionAttachmentModal: React.FC<
  MMFabricConsumptionAttachmentModalProps
> = ({
  isOpen,
  onClose,
  requestNo,
  buyerName,
  styleName,
  attachments,
  onAddAttachment,
  onDeleteAttachment,
  currentUser,
  currentRole = "Merchant",
  readOnly = false,
  currentVersion = 1,
  onReplaceAttachment,
}) => {
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadNote, setUploadNote] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [versionFilter, setVersionFilter] = useState<string>("ALL");
  const [replacingAttachment, setReplacingAttachment] = useState<MMFabricConsumptionAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const availableVersions = useMemo(() => {
    const setV = new Set<number>();
    attachments.forEach((a) => {
      setV.add(a.version || 1);
    });
    if (currentVersion) setV.add(currentVersion);
    return Array.from(setV).sort((a, b) => a - b);
  }, [attachments, currentVersion]);

  const displayedAttachments = useMemo(() => {
    if (versionFilter === "ACTIVE") {
      return attachments.filter((a) => !a.isReplaced);
    }
    if (versionFilter !== "ALL") {
      const v = Number(versionFilter);
      return attachments.filter((a) => (a.version || 1) === v);
    }
    return attachments;
  }, [attachments, versionFilter]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(
        `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of 5 MB.`
      );
      setSelectedUploadFile(null);
      e.target.value = "";
      return;
    }

    setSelectedUploadFile(file);
    if (!uploadTitle.trim()) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      setUploadTitle(nameWithoutExt);
    }
  };

  const handleUpload = () => {
    setUploadError(null);
    if (!selectedUploadFile) {
      setUploadError("Please choose a file to upload.");
      return;
    }
    if (!uploadTitle.trim()) {
      setUploadError("Attachment Title is required.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newRecord: MMFabricConsumptionAttachment = {
        id: `att-cad-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        requestId: requestNo || "FCAD-DRAFT",
        fileName: selectedUploadFile.name,
        title: uploadTitle.trim(),
        documentType: currentRole === "CAD" ? "CAD Response Document" : "Merchant Specification",
        note: uploadNote.trim(),
        fileSize:
          selectedUploadFile.size < 1024 * 1024
            ? `${(selectedUploadFile.size / 1024).toFixed(1)} KB`
            : `${(selectedUploadFile.size / (1024 * 1024)).toFixed(2)} MB`,
        fileSizeBytes: selectedUploadFile.size,
        uploadedBy: currentUser,
        uploadedRole: currentRole,
        uploadTime: new Date().toISOString().replace("T", " ").substring(0, 16),
        storageType: "file",
        dataUrl: dataUrl,
        version: currentVersion || 1,
        amendmentReason: replacingAttachment
          ? `Revised version replacing Rev ${replacingAttachment.version || 1} "${replacingAttachment.title}"`
          : undefined,
      };

      if (replacingAttachment && onReplaceAttachment) {
        onReplaceAttachment(replacingAttachment.id, newRecord);
        toast.success(`Document "${newRecord.title}" updated for Revision ${currentVersion}. Previous version preserved.`);
        setReplacingAttachment(null);
      } else {
        onAddAttachment(newRecord);
        toast.success(`Attachment "${newRecord.title}" (Rev ${currentVersion}) uploaded successfully.`);
      }

      setSelectedUploadFile(null);
      setUploadTitle("");
      setUploadNote("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    reader.onerror = () => {
      setUploadError("Failed to read the selected file. Please try again.");
    };

    reader.readAsDataURL(selectedUploadFile);
  };

  const startReplacing = (att: MMFabricConsumptionAttachment) => {
    setReplacingAttachment(att);
    setUploadTitle(att.title);
    setUploadNote(`Revised for Rev ${currentVersion}. Previous file: ${att.fileName}`);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSelectedUploadFile(null);
    setUploadError(null);
  };

  const cancelReplacing = () => {
    setReplacingAttachment(null);
    setUploadTitle("");
    setUploadNote("");
    setSelectedUploadFile(null);
  };

  const handleDownload = (att: MMFabricConsumptionAttachment) => {
    try {
      if (att.dataUrl && att.dataUrl.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = att.dataUrl;
        link.download = att.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Downloading ${att.fileName}...`);
        return;
      }

      // Fallback for seed mock attachments
      const fallbackContent = `=====================================================
CRIPTON HRIS — FABRIC CONSUMPTION (CAD) DOCUMENT ATTACHMENT
=====================================================
Request No    : ${requestNo || "N/A"}
Buyer         : ${buyerName || "N/A"}
Style         : ${styleName || "N/A"}
Document Title: ${att.title}
Version       : Revision ${att.version || 1}${att.isReplaced ? " (Superceded)" : " (Current)"}
File Name     : ${att.fileName}
File Size     : ${att.fileSize}
Uploaded By   : ${att.uploadedBy} (${att.uploadedRole || "User"})
Upload Time   : ${att.uploadTime}
Notes         : ${att.note || "None"}
=====================================================
This document was preserved in CriptonHRIS Fabric Consumption Document Storage.`;

      const blob = new Blob([fallbackContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = att.fileName.endsWith(".txt") ? att.fileName : `${att.fileName}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded document ${att.fileName}`);
    } catch (err) {
      toast.error("Failed to download attachment.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Paperclip className="size-4 text-teal-600" />
              <span>Document Storage & Version History — Fabric Consumption (CAD)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>Request: <strong className="font-mono text-teal-700 dark:text-teal-400">{requestNo || "Draft"}</strong></span>
              <span>•</span>
              <span>Buyer: <strong className="text-slate-700 dark:text-slate-300">{buyerName || "N/A"}</strong></span>
              <span>•</span>
              <span>Style: <strong className="text-slate-700 dark:text-slate-300">{styleName || "N/A"}</strong></span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-[10px] border border-indigo-200 dark:border-indigo-800">
                Current Working: Rev {currentVersion}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Storage Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold flex items-center gap-2 shadow-xs">
                <FileIcon className="size-4" />
                <span>File Storage</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-white/20 rounded-full font-mono">
                  {attachments.length} total
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Active Uploader: <strong>{currentUser}</strong> ({currentRole})
              </span>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="size-3.5 text-teal-600" />
              <span>
                Maximum File Size: <strong>5 MB</strong> • All document versions permanently archived
              </span>
            </div>
          </div>

          {/* Upload Error Banner */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="p-0.5 text-rose-500 hover:text-rose-700 cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}

          {/* Upload Form Box */}
          {!readOnly && (
            <div className={`p-4 rounded-xl border space-y-3 transition-all ${
              replacingAttachment
                ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
                : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40"
            }`}>
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  {replacingAttachment ? (
                    <>
                      <RefreshCw className="size-3.5 text-amber-600" />
                      <span className="text-amber-800 dark:text-amber-300 font-bold">
                        Replace / Update Document for Rev {currentVersion}
                      </span>
                      <span className="text-xs text-slate-500">
                        (Previous Rev {replacingAttachment.version || 1} will remain archived in history)
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="size-3.5 text-teal-600" />
                      <span>
                        Upload New Document / Spec for <strong className="text-teal-700 dark:text-teal-400">Revision {currentVersion}</strong> ({currentRole === "CAD" ? "CAD Team" : "Merchant"})
                      </span>
                    </>
                  )}
                </div>

                {replacingAttachment && (
                  <button
                    type="button"
                    onClick={cancelReplacing}
                    className="text-xs text-slate-500 hover:text-rose-600 font-bold cursor-pointer"
                  >
                    Cancel Replacement
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                {/* File input */}
                <div className="md:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Choose Document or Image <span className="text-rose-500">*</span>
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.txt,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fcad-file-upload-input"
                  />
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="fcad-file-upload-input"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <Upload className="size-3.5 text-teal-600" />
                      <span>Choose File</span>
                    </label>
                    <span
                      className="text-[11px] text-slate-500 truncate max-w-[160px]"
                      title={selectedUploadFile ? selectedUploadFile.name : "No file chosen"}
                    >
                      {selectedUploadFile ? selectedUploadFile.name : "No file chosen"}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div className="md:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Attachment Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Measurement Specs / Marker Nesting"
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Note */}
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Remarks / Revision Note
                  </label>
                  <input
                    type="text"
                    value={uploadNote}
                    onChange={(e) => setUploadNote(e.target.value)}
                    placeholder="Optional remarks..."
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Upload Button */}
                <div className="md:col-span-1">
                  <button
                    type="button"
                    onClick={handleUpload}
                    className={`w-full h-8 px-3 rounded-lg text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1 transition-all ${
                      replacingAttachment
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "bg-teal-600 hover:bg-teal-700"
                    }`}
                  >
                    {replacingAttachment ? (
                      <>
                        <RefreshCw className="size-3.5" />
                        <span>Save</span>
                      </>
                    ) : (
                      <>
                        <Upload className="size-3.5" />
                        <span>Upload</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Attachments List Table with Version Filter */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-2">
                <Layers className="size-4 text-teal-600" />
                <span>Document History & Version Library ({displayedAttachments.length})</span>
              </h4>

              {/* Version Filter Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium">Filter Version:</span>
                <button
                  type="button"
                  onClick={() => setVersionFilter("ALL")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    versionFilter === "ALL"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  All Versions ({attachments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setVersionFilter("ACTIVE")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    versionFilter === "ACTIVE"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
                  }`}
                >
                  Active Only ({attachments.filter((a) => !a.isReplaced).length})
                </button>
                {availableVersions.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVersionFilter(String(v))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      versionFilter === String(v)
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300"
                    }`}
                  >
                    Rev {v} ({attachments.filter((a) => (a.version || 1) === v).length})
                  </button>
                ))}
              </div>
            </div>

            {displayedAttachments.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400">
                <FileIcon className="size-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-600 dark:text-slate-400">
                  No documents found for the selected version filter ({versionFilter}).
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Switch to "All Versions" to view documents attached across other revisions.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2.5 px-3 text-center w-10">SL</th>
                      <th className="py-2.5 px-3">Title & File Name</th>
                      <th className="py-2.5 px-3 text-center w-24">Version</th>
                      <th className="py-2.5 px-3">Uploaded By / Role</th>
                      <th className="py-2.5 px-3">File Size</th>
                      <th className="py-2.5 px-3">Date & Time</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {displayedAttachments.map((att, idx) => (
                      <tr
                        key={att.id}
                        className={`transition-colors ${
                          att.isReplaced
                            ? "bg-slate-50/40 dark:bg-slate-900/40 opacity-75 hover:opacity-100"
                            : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <FileIcon className="size-3.5 text-teal-600 shrink-0" />
                            <span>{att.title}</span>
                            {att.isReplaced && (
                              <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200">
                                Superceded
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                            <span>{att.fileName}</span>
                            {att.note && (
                              <>
                                <span>•</span>
                                <span className="italic text-slate-400">{att.note}</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Version Badge */}
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                            att.isReplaced
                              ? "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400"
                              : "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800"
                          }`}>
                            <History className="size-2.5" />
                            Rev {att.version || 1}
                          </span>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {att.uploadedBy}
                          </div>
                          <span
                            className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                              att.uploadedRole === "CAD"
                                ? "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400"
                                : "bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400"
                            }`}
                          >
                            {att.uploadedRole || "Merchant"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                          {att.fileSize}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                          {att.uploadTime}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDownload(att)}
                              className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold text-[11px] border border-teal-200 dark:border-teal-800 flex items-center gap-1 cursor-pointer transition-colors"
                              title="Download document (Historical copy preserved)"
                            >
                              <Download className="size-3" />
                              <span>Download</span>
                            </button>

                            {!readOnly && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startReplacing(att)}
                                  className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-800 flex items-center gap-1 cursor-pointer transition-colors"
                                  title="Upload revised file to replace this document for current revision"
                                >
                                  <RefreshCw className="size-3" />
                                  <span>Replace</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Delete document "${att.title}"?`)) {
                                      onDeleteAttachment(att.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                                  title="Delete document"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            <span>Document versioning active: All revisions and replaced attachments remain permanently preserved</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MMFabricConsumptionAttachmentModal;

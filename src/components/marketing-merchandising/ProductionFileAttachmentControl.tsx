import React, { useState, useRef } from "react";
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
} from "lucide-react";
import {
  ProductionFileAttachment,
  ProductionFileAttachmentCategory,
} from "../../lib/marketing-merchandising-data";

interface ProductionFileAttachmentControlProps {
  category: ProductionFileAttachmentCategory;
  categoryTitle?: string;
  attachments: ProductionFileAttachment[];
  onAddAttachment?: (newAttachment: ProductionFileAttachment) => void;
  onRemoveAttachment?: (attachmentId: string) => void;
  isReadOnly?: boolean;
  isAmendmentMode?: boolean;
  jobNo?: string;
  styleNo?: string;
  currentUser?: string;
  currentVersion?: number;
}

export function ProductionFileAttachmentControl({
  category,
  categoryTitle,
  attachments,
  onAddAttachment,
  onRemoveAttachment,
  isReadOnly = false,
  isAmendmentMode = false,
  jobNo,
  styleNo,
  currentUser = "Tanvir Ahmed (Merchandiser)",
  currentVersion = 1,
}: ProductionFileAttachmentControlProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadNote, setUploadNote] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Attachments belonging to this category
  const categoryAttachments = attachments.filter((a) => a.category === category);

  // Historical vs new attachments for amendment display
  const baseAttachments = categoryAttachments.filter((a) => !a.isNewInAmendment);
  const newAmendmentAttachments = categoryAttachments.filter((a) => a.isNewInAmendment);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(
        `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of 25 MB.`
      );
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    if (!uploadTitle.trim()) {
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadError("Please choose a file to upload.");
      return;
    }
    if (!uploadTitle.trim()) {
      setUploadError("Attachment Title is required.");
      return;
    }

    const ext = selectedFile.name.split(".").pop()?.toLowerCase() || "file";
    const sizeStr =
      selectedFile.size > 1024 * 1024
        ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(selectedFile.size / 1024)} KB`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    const newRecord: ProductionFileAttachment = {
      id: "att-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      category,
      fileName: selectedFile.name,
      fileSize: sizeStr,
      fileType: ext,
      uploadDate: now,
      title: uploadTitle.trim(),
      note: uploadNote.trim() || undefined,
      uploadedBy: currentUser,
      version: currentVersion,
      isNewInAmendment: isAmendmentMode,
    };

    if (onAddAttachment) {
      onAddAttachment(newRecord);
    }

    // Reset fields
    setSelectedFile(null);
    setUploadTitle("");
    setUploadNote("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = (att: ProductionFileAttachment) => {
    const content = `CriptonHRIS Production File Attachment: ${att.fileName}\nCategory: ${att.category}\nJob: ${jobNo || "N/A"}\nStyle: ${styleNo || "N/A"}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = att.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const displayName = categoryTitle || category;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition">
      {/* Category Header */}
      <div className="mb-3">
        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
          {displayName}
        </h4>
      </div>

      {/* PI Entry Attachment Button (reused exact style & component) */}
      <div className="mt-auto flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all shadow-sm w-full justify-center"
        >
          <Paperclip className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>Attachment ({categoryAttachments.length})</span>
        </button>
      </div>

      {/* PI Entry Document Storage Modal (reused exact style & layout) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-teal-600" />
                  <span>Document Storage — {displayName}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Job: <span className="font-mono font-bold text-teal-700 dark:text-teal-400">{jobNo || "N/A"}</span> | Style:{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{styleNo || "N/A"}</span>
                  {isAmendmentMode && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-semibold text-[10px]">
                      Amendment Version {currentVersion}
                    </span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setUploadError(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Tab Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-teal-600/30">
                    <FileIcon className="w-4 h-4" />
                    <span>File Storage</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-mono">
                      {categoryAttachments.length}
                    </span>
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-teal-600" />
                  <span>Maximum File Size: <strong>25 MB</strong></span>
                </div>
              </div>

              {/* Upload Error Banner */}
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                  <button type="button" onClick={() => setUploadError(null)} className="p-0.5 text-rose-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* File Upload Form (PI Entry Style) - Hidden if strictly read-only */}
              {!isReadOnly && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    {/* File Selection Control */}
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
                        id={`file-upload-input-${category.replace(/\s+/g, "-")}`}
                      />
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor={`file-upload-input-${category.replace(/\s+/g, "-")}`}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5 text-teal-600" />
                          <span>Choose File</span>
                        </label>
                        <span
                          className="text-[11px] text-slate-500 truncate max-w-[140px]"
                          title={selectedFile ? selectedFile.name : "No file chosen"}
                        >
                          {selectedFile ? selectedFile.name : "No file chosen"}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="md:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder={`e.g. ${displayName}`}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                      />
                    </div>

                    {/* Note */}
                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Note
                      </label>
                      <input
                        type="text"
                        value={uploadNote}
                        onChange={(e) => setUploadNote(e.target.value)}
                        placeholder="Optional remarks"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                      />
                    </div>

                    {/* Upload Button */}
                    <div className="md:col-span-1">
                      <button
                        type="button"
                        onClick={handleUpload}
                        className="w-full px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1 transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Attachment Table (PI Entry 7-column layout) */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
                      {!isReadOnly && <th className="py-2.5 px-3 text-center w-12">Remove</th>}
                      <th className="py-2.5 px-3 min-w-[160px]">Title</th>
                      <th className="py-2.5 px-3 min-w-[180px]">Note</th>
                      <th className="py-2.5 px-3 min-w-[110px]">Version</th>
                      <th className="py-2.5 px-3 min-w-[120px]">Uploaded By</th>
                      <th className="py-2.5 px-3 min-w-[110px]">Upload Time</th>
                      <th className="py-2.5 px-3 min-w-[80px] text-right">File Size</th>
                      <th className="py-2.5 px-3 min-w-[100px] text-center">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {categoryAttachments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={isReadOnly ? 7 : 8}
                          className="py-8 text-center text-slate-400 text-xs"
                        >
                          No documents stored for {displayName}.
                        </td>
                      </tr>
                    ) : (
                      categoryAttachments.map((att) => {
                        const canDelete =
                          !isReadOnly &&
                          (!isAmendmentMode || att.isNewInAmendment);

                        return (
                          <tr
                            key={att.id}
                            className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                              att.isNewInAmendment ? "bg-teal-50/30 dark:bg-teal-950/20" : ""
                            }`}
                          >
                            {/* Remove Action */}
                            {!isReadOnly && (
                              <td className="py-2.5 px-3 text-center">
                                {canDelete ? (
                                  <button
                                    type="button"
                                    onClick={() => onRemoveAttachment && onRemoveAttachment(att.id)}
                                    title="Remove attachment"
                                    className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <span
                                    title="Historical approved file cannot be removed during amendment"
                                    className="text-slate-300 text-[10px] italic"
                                  >
                                    Locked
                                  </span>
                                )}
                              </td>
                            )}

                            {/* Title & Filename */}
                            <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                              {att.title || att.fileName}
                              <span className="block text-[10px] font-mono text-slate-400 font-normal">
                                {att.fileName}
                              </span>
                            </td>

                            {/* Note */}
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 max-w-xs whitespace-normal break-words leading-relaxed">
                              {att.note || "—"}
                            </td>

                            {/* Version Label */}
                            <td className="py-2.5 px-3">
                              {att.isNewInAmendment ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                                  New in v{att.version || currentVersion}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                  Approved v{att.version || 1}
                                </span>
                              )}
                            </td>

                            {/* Uploaded By */}
                            <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                              {att.uploadedBy || currentUser}
                            </td>

                            {/* Upload Time */}
                            <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                              {att.uploadDate}
                            </td>

                            {/* File Size */}
                            <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                              {att.fileSize}
                            </td>

                            {/* Download Action */}
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleDownload(att)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 transition"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

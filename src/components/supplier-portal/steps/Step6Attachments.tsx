import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  Download,
  Eye,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  HardDrive,
  ExternalLink,
} from "lucide-react";
import {
  SupplierInvitationRecord,
  PortalAttachment,
  AttachmentCategory,
} from "@/lib/supplier-portal/types";
import { formatBytes } from "@/lib/supplier-portal/storage";

interface Props {
  invitation: SupplierInvitationRecord;
  onUpdateAttachments: (attachments: PortalAttachment[]) => void;
  onNext: () => void;
  onPrev: () => void;
  isReadOnly: boolean;
}

const CATEGORIES: AttachmentCategory[] = [
  "Official Quotation (PDF)",
  "Technical Specification",
  "Product Catalogue",
  "Company Profile",
  "Warranty Certificate",
  "Other Supporting Documents",
];

export const Step6Attachments: React.FC<Props> = ({
  invitation,
  onUpdateAttachments,
  onNext,
  onPrev,
  isReadOnly,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<AttachmentCategory>(
    "Official Quotation (PDF)"
  );
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState<PortalAttachment | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const attachments = invitation.currentQuotation.attachments || [];

  // Calculate total size of uploaded attachments
  const totalBytes = attachments.reduce((sum, att) => sum + (att.fileSize || 0), 0);
  const hasOfficialQuotation = attachments.some(
    (att) => att.category === "Official Quotation (PDF)"
  );

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0 || isReadOnly) return;
    setUploadError(null);

    const newAttachments: PortalAttachment[] = [];

    Array.from(files).forEach((file) => {
      // Max 2.5MB per file to protect browser localStorage quota
      if (file.size > 2.5 * 1024 * 1024) {
        setUploadError(
          `"${file.name}" exceeds the 2.5MB browser demo limit. Please upload a smaller PDF or document.`
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newAttachment: PortalAttachment = {
          id: "att_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
          category: selectedCategory,
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          fileSize: file.size,
          fileSizeFormatted: formatBytes(file.size),
          uploadedAt: new Date().toISOString(),
          dataUrl,
        };

        const updated = [...attachments, newAttachment];
        onUpdateAttachments(updated);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string) => {
    if (isReadOnly) return;
    const updated = attachments.filter((att) => att.id !== id);
    onUpdateAttachments(updated);
  };

  const handleDownload = (attachment: PortalAttachment) => {
    if (!attachment.dataUrl) {
      alert("This is a demo placeholder file without raw binary contents.");
      return;
    }
    const a = document.createElement("a");
    a.href = attachment.dataUrl;
    a.download = attachment.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Add demo sample attachment shortcut
  const handleAddDemoQuotation = () => {
    if (isReadOnly) return;
    const sampleAttachment: PortalAttachment = {
      id: "att_sample_" + Date.now(),
      category: "Official Quotation (PDF)",
      fileName: `${invitation.supplierMaster.supplierName.replace(/\s+/g, "_")}_Official_Quotation.pdf`,
      fileType: "application/pdf",
      fileSize: 425984,
      fileSizeFormatted: "416 KB",
      uploadedAt: new Date().toISOString(),
      dataUrl: "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXr...", // Mock data
    };
    onUpdateAttachments([...attachments, sampleAttachment]);
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                Step 6
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Supporting Attachments & Official Documents
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Upload your signed formal quotation letter, technical data sheets,
              catalogues, and certificates in PDF, DOCX, or PNG formats.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-right">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-end gap-1">
                <HardDrive className="w-3 h-3 text-slate-500" />
                Attached Files
              </div>
              <div className="text-sm font-bold text-slate-800">
                {attachments.length} {attachments.length === 1 ? "file" : "files"} ({formatBytes(totalBytes)})
              </div>
            </div>
          </div>
        </div>

        {/* Requirements banner */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
              hasOfficialQuotation
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
          >
            {hasOfficialQuotation ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-semibold">
                {hasOfficialQuotation
                  ? "Official Quotation (PDF) Attached"
                  : "Official Quotation (PDF) Recommended"}
              </span>
              <p className="mt-0.5 text-slate-600">
                Pakiza Procurement strongly recommends attaching an official, signed
                company letterhead quotation matching this online submission.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-600 flex items-start gap-2.5">
            <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Supported Formats</span>
              <p className="mt-0.5">
                PDF, DOCX, XLSX, JPG, PNG (Max 2.5MB per file for browser sandbox
                storage).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Zone (Only when not read-only) */}
      {!isReadOnly && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">
            Upload New Document
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Document Category *
              </label>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value as AttachmentCategory)
                }
                className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Selected Classification
              </label>
              <div className="text-xs text-slate-500 py-2 bg-slate-50 px-3 rounded-lg border border-slate-200">
                Uploading file as:{" "}
                <span className="font-semibold text-blue-700">
                  {selectedCategory}
                </span>
              </div>
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50/50"
                : "border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Click to browse or drag and drop files here
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PDF, DOCX, XLSX, JPG, PNG up to 2.5MB
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddDemoQuotation();
                }}
                className="text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                + Insert Sample Signed PDF
              </button>
            </div>
          </div>

          {uploadError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Documents List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Attached Documents ({attachments.length})
            </h3>
          </div>
          {isReadOnly && (
            <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
              Read-Only
            </span>
          )}
        </div>

        {attachments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No attachments uploaded yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Upload your official signed quotation document and technical brochures above to support your tender submission.
            </p>
            {!isReadOnly && (
              <button
                type="button"
                onClick={handleAddDemoQuotation}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
              >
                + Add Demo Official PDF
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800 truncate">
                        {att.fileName}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {att.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                      <span>Size: {att.fileSizeFormatted}</span>
                      <span>•</span>
                      <span>
                        Uploaded:{" "}
                        {new Date(att.uploadedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {att.dataUrl && (
                    <button
                      type="button"
                      onClick={() => setPreviewFile(att)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Preview Document Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDownload(att)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleDelete(att.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Remove File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Preview */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900">Document Information</h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  File Name
                </span>
                <p className="font-medium text-slate-800">{previewFile.fileName}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">
                    Category
                  </span>
                  <p className="font-medium text-slate-800">{previewFile.category}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">
                    Size
                  </span>
                  <p className="font-medium text-slate-800">
                    {previewFile.fileSizeFormatted}
                  </p>
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  Upload Timestamp
                </span>
                <p className="font-medium text-slate-800">
                  {new Date(previewFile.uploadedAt).toLocaleString()}
                </p>
              </div>

              {previewFile.fileType.startsWith("image/") && previewFile.dataUrl && (
                <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <img
                    src={previewFile.dataUrl}
                    alt={previewFile.fileName}
                    className="max-h-56 mx-auto rounded object-contain"
                  />
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDownload(previewFile)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#172554] text-xs font-bold transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Previous: Commercial Terms
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4169E1] hover:bg-[#2347B5] active:bg-[#1E3FA8] text-white text-xs font-bold shadow-md shadow-[#4169E1]/20 transition-all hover:scale-[1.01] cursor-pointer"
        >
          Proceed to Review & Submit
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};


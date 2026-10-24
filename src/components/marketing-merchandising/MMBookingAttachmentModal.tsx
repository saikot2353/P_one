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
} from "lucide-react";
import { toast } from "sonner";

export interface MMAttachmentRecord {
  id: string;
  bookingId: string;
  fileName: string;
  title: string;
  documentType?: string;
  note?: string;
  fileSize: string;
  fileSizeBytes?: number;
  uploadedBy: string;
  uploadTime: string;
  storageType?: "file" | "image";
  dataUrl?: string;
}

interface MMBookingAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingNo: string;
  supplierName: string;
  bookingTypeLabel?: string; // e.g. "Accessories Booking" or "Fabric Booking"
  attachments: MMAttachmentRecord[];
  onAddAttachment: (newRecord: MMAttachmentRecord) => void;
  onDeleteAttachment: (id: string) => void;
  currentUser?: string;
}

export const MMBookingAttachmentModal: React.FC<MMBookingAttachmentModalProps> = ({
  isOpen,
  onClose,
  bookingNo,
  supplierName,
  bookingTypeLabel = "Accessories Booking",
  attachments,
  onAddAttachment,
  onDeleteAttachment,
  currentUser = "Md. Tanvir Ahmed (Merchandiser)",
}) => {
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadNote, setUploadNote] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 3 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(
        `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of 3 MB.`
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
      setUploadError("Please select a file to upload.");
      return;
    }
    if (!uploadTitle.trim()) {
      setUploadError("Attachment Title is required.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newRecord: MMAttachmentRecord = {
        id: `att-${Date.now()}`,
        bookingId: bookingNo || "booking-default",
        fileName: selectedUploadFile.name,
        title: uploadTitle.trim(),
        documentType: `${bookingTypeLabel} Document`,
        note: uploadNote.trim(),
        fileSize:
          selectedUploadFile.size < 1024 * 1024
            ? `${(selectedUploadFile.size / 1024).toFixed(1)} KB`
            : `${(selectedUploadFile.size / (1024 * 1024)).toFixed(2)} MB`,
        fileSizeBytes: selectedUploadFile.size,
        uploadedBy: currentUser,
        uploadTime: new Date().toISOString().replace("T", " ").substring(0, 16),
        storageType: "file",
        dataUrl: dataUrl,
      };

      onAddAttachment(newRecord);
      setSelectedUploadFile(null);
      setUploadTitle("");
      setUploadNote("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success(`Document "${newRecord.title}" uploaded successfully.`);
    };

    reader.onerror = () => {
      setUploadError("Failed to read file for upload.");
    };

    reader.readAsDataURL(selectedUploadFile);
  };

  const handleDownloadAttachment = (att: MMAttachmentRecord) => {
    try {
      if (!att) {
        toast.error("Attachment record not found.");
        return;
      }
      const link = document.createElement("a");
      let objectUrlToRevoke: string | null = null;
      if (att.dataUrl && (att.dataUrl.startsWith("data:") || att.dataUrl.startsWith("blob:"))) {
        link.href = att.dataUrl;
      } else {
        const textContent = `${bookingTypeLabel} Attached Document\nFilename: ${att.fileName}\nTitle: ${att.title}\nUploaded By: ${att.uploadedBy}\nUpload Time: ${att.uploadTime}\nFile Size: ${att.fileSize}\nNote: ${att.note || "N/A"}`;
        const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
        objectUrlToRevoke = URL.createObjectURL(blob);
        link.href = objectUrlToRevoke;
      }
      link.download = att.fileName || `${att.title.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (objectUrlToRevoke) {
        setTimeout(() => URL.revokeObjectURL(objectUrlToRevoke!), 1000);
      }
      toast.success(`Downloading ${att.fileName || att.title}`);
    } catch (e) {
      console.error("Download failed:", e);
      toast.error("Failed to download file. The file content is unavailable.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-teal-600" />
              <span>Document Storage — {bookingTypeLabel} Attachments</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Booking No:{" "}
              <span className="font-mono font-bold text-teal-700 dark:text-teal-400">
                {bookingNo || "Draft Booking"}
              </span>{" "}
              | Supplier:{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {supplierName || "N/A"}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              setUploadError(null);
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* File Storage Badge Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-teal-600/30">
                <FileIcon className="w-4 h-4" />
                <span>File Storage</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full font-mono">
                  {attachments.length}
                </span>
              </span>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-teal-600" />
              <span>
                Maximum File Size: <strong>3 MB</strong>
              </span>
            </div>
          </div>

          {/* Upload Error Banner */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="p-0.5 text-rose-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* File Selection and Upload Form */}
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
                  id="mm-attachment-file-upload-input"
                />
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="mm-attachment-file-upload-input"
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-teal-600" />
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
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder={`e.g. Signed ${bookingTypeLabel} Copy`}
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

          {/* Attachment Table (7 columns: Remove, Title, Note, Uploaded By, Upload Time, File Size, Download) */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3 text-center w-12">Remove</th>
                  <th className="py-2.5 px-3 min-w-[160px]">Title</th>
                  <th className="py-2.5 px-3 min-w-[220px] max-w-sm">Note</th>
                  <th className="py-2.5 px-3 min-w-[130px]">Uploaded By</th>
                  <th className="py-2.5 px-3 min-w-[130px]">Upload Time</th>
                  <th className="py-2.5 px-3 min-w-[90px] text-right">File Size</th>
                  <th className="py-2.5 px-3 min-w-[110px] text-center">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attachments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                      No documents stored for this {bookingTypeLabel}.
                    </td>
                  </tr>
                ) : (
                  attachments.map((att) => (
                    <tr
                      key={att.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* 1. Remove */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onDeleteAttachment(att.id)}
                          title="Remove attachment"
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                      {/* 2. Title */}
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                        {att.title}
                        <span className="block text-[10px] font-mono text-slate-400 font-normal">
                          {att.fileName}
                        </span>
                      </td>

                      {/* 3. Note (Text wrapped onto multiple lines) */}
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 max-w-sm whitespace-normal break-words leading-relaxed">
                        {att.note || "—"}
                      </td>

                      {/* 4. Uploaded By */}
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                        {att.uploadedBy}
                      </td>

                      {/* 5. Upload Time */}
                      <td className="py-2.5 px-3 font-mono text-slate-500">{att.uploadTime}</td>

                      {/* 6. File Size */}
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                        {att.fileSize}
                      </td>

                      {/* 7. Download */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDownloadAttachment(att)}
                          title={`Download ${att.fileName || att.title}`}
                          className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 font-semibold text-[11px] inline-flex items-center gap-1 shadow-sm transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Total persistent attachments for this {bookingTypeLabel}:{" "}
            <strong>{attachments.length}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

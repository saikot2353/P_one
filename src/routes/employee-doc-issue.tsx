import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { toast } from "sonner";
import {
  Flag,
  FileText,
  CheckCircle2,
  UploadCloud,
  Search,
  AlertCircle,
  X,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  FolderOpen,
  Filter,
  ArrowLeft,
} from "lucide-react";
import {
  getVerificationEmployees,
  reuploadEmployeeDocument,
  type VerificationEmployee,
  type UploadedDocument,
} from "@/lib/docVerificationStore";

export const Route = createFileRoute("/employee-doc-issue")({
  head: () => ({
    meta: [
      { title: "Employee Doc Issue — CRIPTON HRIS" },
      { name: "description", content: "Manage and re-upload documents with flagged issues." },
    ],
  }),
  component: EmployeeDocIssuePage,
});

// ── Re-Upload Document Modal ──────────────────────────────────────────────────
function ReuploadModal({
  isOpen,
  onClose,
  onSubmit,
  empName,
  docTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, note: string) => void;
  empName: string;
  docTitle: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Re-Upload Document</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Uploading <span className="font-semibold text-slate-700 dark:text-slate-300">{docTitle}</span> for <span className="font-bold text-slate-900 dark:text-slate-100">{empName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Revised Document
            </label>
            <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-950/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all cursor-pointer group">
              <UploadCloud className="size-8 text-slate-400 group-hover:text-blue-500 transition-colors mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {file ? file.name : "Click or drag file to upload"}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "PDF, PNG, JPG (Max 5MB)"}
              </p>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Remarks / User Note <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Explain the changes or provide extra context for HR..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-medium resize-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!file) {
                  toast.error("Please select a file to re-upload.");
                  return;
                }
                onSubmit(file, note);
              }}
              className="flex-1 px-4 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <UploadCloud className="size-3.5" /> Submit Re-upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Document Viewer Modal ──────────────────────────────────────────────────────
function DocumentViewModal({
  isOpen,
  onClose,
  doc,
  emp,
}: {
  isOpen: boolean;
  onClose: () => void;
  doc: UploadedDocument | null;
  emp: VerificationEmployee | null;
}) {
  if (!isOpen || !doc || !emp) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl h-[82vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <FileText className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{doc.title}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Employee: <span className="font-semibold text-slate-700 dark:text-slate-300">{emp.name}</span> ({emp.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 bg-slate-950 flex items-center justify-center p-8 overflow-auto relative">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-slate-900 font-sans space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">{doc.title}</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.reuploadedFile || doc.file}</p>
              </div>
              <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[9px] font-black uppercase">
                {doc.type}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Employee Name:</span>
                <span className="font-bold text-slate-800">{emp.name}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">NID / Reg No:</span>
                <span className="font-mono font-bold text-slate-800">{emp.nid}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">Document Status:</span>
                <span className="font-bold text-orange-600 uppercase">{doc.status}</span>
              </div>
            </div>

            {doc.issueDescription && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-orange-800 block text-[10px] uppercase tracking-wider">Flagged Issue Description</span>
                <p className="text-orange-700 leading-snug">{doc.issueDescription}</p>
              </div>
            )}

            {doc.reuploadNote && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-blue-800 block text-[10px] uppercase tracking-wider">User Re-upload Note</span>
                <p className="text-blue-700 leading-snug">{doc.reuploadNote}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────────
function EmployeeDocIssuePage() {
  const [employees, setEmployees] = useState<VerificationEmployee[]>(() => getVerificationEmployees());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Flagged" | "Re-uploaded">("All");

  const [reuploadTarget, setReuploadTarget] = useState<{ empId: string; empName: string; docId: string; docTitle: string } | null>(null);
  const [viewDocState, setViewDocState] = useState<{ doc: UploadedDocument; emp: VerificationEmployee } | null>(null);

  useEffect(() => {
    const handleStoreUpdate = () => {
      setEmployees(getVerificationEmployees());
    };
    window.addEventListener("employee-doc-store-updated", handleStoreUpdate);
    return () => window.removeEventListener("employee-doc-store-updated", handleStoreUpdate);
  }, []);

  const issues = useMemo(() => {
    const list: Array<{ emp: VerificationEmployee; doc: UploadedDocument }> = [];
    employees.forEach((emp) => {
      emp.documents.forEach((doc) => {
        if (doc.status === "Flagged" || doc.status === "Re-uploaded") {
          list.push({ emp, doc });
        }
      });
    });

    return list.filter(({ emp, doc }) => {
      if (statusFilter !== "All" && doc.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          emp.name.toLowerCase().includes(q) ||
          emp.id.toLowerCase().includes(q) ||
          emp.title.toLowerCase().includes(q) ||
          doc.title.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [employees, searchQuery, statusFilter]);



  const handleReuploadSubmit = (file: File, note: string) => {
    if (!reuploadTarget) return;

    reuploadEmployeeDocument(reuploadTarget.empId, reuploadTarget.docId, {
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      fileType: file.name.endsWith(".pdf") ? "PDF" : "IMAGE",
      note,
    });

    toast.success(`Revised "${reuploadTarget.docTitle}" uploaded successfully!`, {
      description: "HR Compliance team notified for re-verification.",
    });

    setEmployees(getVerificationEmployees());
    setReuploadTarget(null);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Header & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <Link to="/personnel-list" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Personnel Info
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-800 dark:text-slate-200">Employee Doc Issue</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                <div className="p-2 bg-orange-100 dark:bg-orange-950/40 rounded-xl">
                  <Flag className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                Employee Doc Issue & Re-Upload
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Review documents flagged by HR verification and process revised re-uploads.
              </p>
            </div>

            <Link
              to="/employee-doc-verification"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold shadow-xs transition-all shrink-0"
            >
              <ArrowLeft className="size-4 text-blue-600" />
              Back to Doc Verification
            </Link>
          </div>



          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search employee name, ID, or title…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 font-semibold transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex items-center w-full sm:w-auto">
                <Filter className="absolute left-3 size-3.5 text-slate-400 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "All" | "Flagged" | "Re-uploaded")}
                  className="w-full sm:w-auto pl-9 pr-8 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all appearance-none cursor-pointer"
                >
                  <option value="All">All Issues</option>
                  <option value="Flagged">Pending</option>
                  <option value="Re-uploaded">Action Taken</option>
                </select>
                <ChevronDown className="absolute right-2.5 size-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                    <th className="px-5 py-3.5 w-16 text-center">SL</th>
                    <th className="px-5 py-3.5">Employee</th>
                    <th className="px-5 py-3.5">Document Details</th>
                    <th className="px-5 py-3.5 min-w-[280px]">Issue Feedback & History</th>
                    <th className="px-5 py-3.5 w-36 text-center">Status</th>
                    <th className="px-5 py-3.5 w-36 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {issues.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <CheckCircle2 className="size-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No document issues found</p>
                        <p className="text-xs text-slate-400 mt-1">All employee documents are clear or match your search criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    issues.map(({ emp, doc }, idx) => (
                      <tr key={`${emp.id}-${doc.id}-${idx}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        {/* SL */}
                        <td className="px-5 py-4 text-center font-bold text-xs text-slate-500">
                          {idx + 1}
                        </td>

                        {/* Employee */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-xs shrink-0">
                              {emp.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white text-xs">{emp.name}</p>
                              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                                {emp.id} · <span className="font-sans text-slate-500">{emp.title}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Document Details */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setViewDocState({ doc, emp })}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                          >
                            <FileText className="size-4 shrink-0" />
                            <span>Document</span>
                          </button>
                        </td>

                        {/* Issue Feedback & History */}
                        <td className="px-5 py-4">
                          <div className="space-y-1 text-xs">
                            {doc.issueDescription ? (
                              <p className="text-slate-700 dark:text-slate-300 leading-snug font-medium">
                                <strong className="text-orange-600 dark:text-orange-400 font-bold">HR Feedback: </strong>
                                {doc.issueDescription}
                              </p>
                            ) : (
                              <p className="text-slate-400 italic">No feedback provided</p>
                            )}

                            {doc.status === "Re-uploaded" && (
                              <div className="pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                <span className="font-bold text-blue-600 dark:text-blue-400">User Note: </span>
                                {doc.reuploadNote || "Revised document re-uploaded by employee."}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 text-center whitespace-nowrap">
                          {doc.status === "Flagged" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/50 uppercase tracking-wide">
                              <AlertCircle className="size-3" /> Action Required
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50 uppercase tracking-wide">
                              <RefreshCw className="size-3 animate-spin" /> Pending HR Review
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          {doc.status === "Flagged" ? (
                            <button
                              onClick={() =>
                                setReuploadTarget({
                                  empId: emp.id,
                                  empName: emp.name,
                                  docId: doc.id,
                                  docTitle: doc.title,
                                })
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all"
                            >
                              <UploadCloud className="size-3.5" /> Re-upload
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 dark:text-slate-500 px-3 py-1.5">
                              <CheckCircle2 className="size-3.5 text-emerald-500" /> Submitted
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Re-Upload Modal */}
      <ReuploadModal
        isOpen={!!reuploadTarget}
        onClose={() => setReuploadTarget(null)}
        onSubmit={handleReuploadSubmit}
        empName={reuploadTarget?.empName || ""}
        docTitle={reuploadTarget?.docTitle || ""}
      />

      {/* Document View Modal */}
      <DocumentViewModal
        isOpen={!!viewDocState}
        onClose={() => setViewDocState(null)}
        doc={viewDocState?.doc || null}
        emp={viewDocState?.emp || null}
      />
    </div>
  );
}

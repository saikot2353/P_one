import { useState, useMemo, useRef, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { toast } from "sonner";
import {
  Search, Check, X, FileText, FileImage, ShieldCheck,
  Download, Printer, ChevronRight, CheckCircle2, FolderOpen,
  Info, XCircle, UserCheck, ScanEye, ArrowLeft, AlertCircle,
  Clock, CheckCheck, Users, Filter, Flag, RotateCcw, RefreshCw,
  Building2, MapPin, ChevronDown, ExternalLink,
} from "lucide-react";
import {
  type VerificationEmployee,
  type UploadedDocument,
  type OCRFields,
  type HRDocIssueNotification,
  getVerificationEmployees,
  saveVerificationEmployees,
  updateDocumentStatus,
  pushHRNotification,
  getHRNotifications,
  getDocIssueSummary,
} from "@/lib/docVerificationStore";

export { getHRNotifications, type HRDocIssueNotification };

export const Route = createFileRoute("/employee-doc-verification")({
  head: () => ({
    meta: [
      { title: "Employee Doc Verification — CRIPTON HRIS" },
      { name: "description", content: "Verify uploaded employee credentials and supporting documents individually." },
    ],
  }),
  component: EmployeeDocVerificationPage,
});

// ── Searchable Multi-Select Dropdown ─────────────────────────────────────────
function MultiSelectDropdown({
  label, icon, options, selected, onChange,
}: {
  label: string;
  icon: React.ReactNode;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()));
  const allSelected = selected.length === 0;
  const labelText = allSelected
    ? `All ${label}s`
    : selected.length === 1
    ? selected[0]
    : `${selected.length} ${label}s`;

  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`h-9 inline-flex items-center gap-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
          selected.length > 0
            ? "border-blue-400 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600"
        }`}
      >
        <span className="text-slate-400 dark:text-slate-500">{icon}</span>
        <span className="max-w-[110px] truncate">{labelText}</span>
        {selected.length > 0 && (
          <span
            onClick={(e) => { e.stopPropagation(); onChange([]); }}
            className="ml-0.5 size-4 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 flex items-center justify-center hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <X className="size-2.5" />
          </span>
        )}
        <ChevronDown className={`size-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 size-3 text-slate-400" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}…`}
                className="w-full pl-7 pr-3 py-1.5 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-medium"
              />
            </div>
          </div>
          {/* Options */}
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-center py-4 text-[11px] text-slate-400">No results</p>
            ) : (
              filtered.map((opt) => {
                const checked = selected.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggle(opt)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-medium text-left transition-colors ${
                      checked
                        ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <span
                      className={`size-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                        checked
                          ? "bg-blue-600 border-blue-600"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950"
                      }`}
                    >
                      {checked && <Check className="size-2.5 text-white" />}
                    </span>
                    <span className="truncate">{opt}</span>
                  </button>
                );
              })
            )}
          </div>
          {/* Footer */}
          {selected.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800 p-2">
              <button
                onClick={() => onChange([])}
                className="w-full text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors text-center"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function getOverallStatus(emp: VerificationEmployee) {
  if (emp.documents.some((d) => d.status === "Flagged")) return "issues" as const;
  if (emp.documents.some((d) => d.status === "Re-uploaded")) return "reuploaded" as const;
  if (emp.documents.some((d) => d.status === "Pending")) return "pending" as const;
  return "verified" as const;
}

function StatusPill({ status }: { status: "Pending" | "Verified" | "Flagged" | "Re-uploaded" }) {
  if (status === "Verified")
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40 uppercase tracking-wide"><CheckCircle2 className="size-2.5" /> Verified</span>;
  if (status === "Flagged")
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/40 uppercase tracking-wide"><Flag className="size-2.5" /> Issue Flagged</span>;
  if (status === "Re-uploaded")
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40 uppercase tracking-wide"><RefreshCw className="size-2.5 text-blue-600 animate-spin" /> Re-uploaded</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40 uppercase tracking-wide"><Clock className="size-2.5" /> Pending</span>;
}

function MarkAsIssueDialog({ docTitle, empName, onConfirm, onCancel }: { docTitle: string; empName: string; onConfirm: (desc: string) => void; onCancel: () => void }) {
  const [desc, setDesc] = useState("");
  const presets = [
    "Document appears to be fake or tampered with.",
    "Key information doesn't match the employee profile.",
    "Document is expired or out of validity period.",
    "Missing required stamps, signatures, or seals.",
    "Suspected forgery — requires manual HR review.",
  ];
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 mx-4 space-y-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-orange-100 dark:bg-orange-950/40 rounded-xl shrink-0"><Flag className="size-5 text-orange-600 dark:text-orange-400" /></div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Mark as Issue</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">Flagging: <span className="font-bold text-slate-700 dark:text-slate-300">{docTitle}</span> for <span className="font-bold text-orange-600 dark:text-orange-400">{empName}</span></p>
          </div>
        </div>
        {/* HR alert */}
        <div className="flex items-start gap-2.5 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-900/40">
          <AlertCircle className="size-3.5 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
          <p className="text-[10px] text-orange-700 dark:text-orange-400 font-medium leading-relaxed">A notification will be sent to the <span className="font-black">HR Department</span> immediately after flagging this document.</p>
        </div>
        {/* Quick presets */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select an issue type</p>
          <div className="space-y-1.5">
            {presets.map((r) => (
              <button key={r} onClick={() => setDesc(r)} className={`w-full text-left text-[11px] px-3 py-2 rounded-xl border transition-all font-medium leading-snug ${desc === r ? "border-orange-400 bg-orange-50 text-orange-800 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-700" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>{r}</button>
            ))}
          </div>
        </div>
        {/* Custom description */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Or describe the issue</label>
          <textarea rows={3} placeholder="Describe the specific issue found..." value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 font-medium resize-none transition-all" />
        </div>
        {/* Actions */}
        <div className="flex gap-2.5">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
          <button
            onClick={() => { if (!desc.trim()) { toast.error("Please describe the issue."); return; } onConfirm(desc.trim()); }}
            className="flex-1 px-4 py-2.5 text-xs font-black bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
          ><Flag className="size-3.5" /> Flag & Notify HR</button>
        </div>
      </div>
    </div>
  );
}



function DocScanPreview({ doc, emp }: { doc: UploadedDocument; emp: VerificationEmployee }) {
  if (doc.title.includes("NID") || doc.title.includes("Nominee ID")) {
    return (
      <div className="w-[340px] rounded-2xl bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-900 border border-emerald-600/30 shadow-2xl p-5 text-white font-mono relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-orange-600 flex items-center justify-center text-[6px] font-black">BD</div>
            <div><p className="text-[6px] font-bold text-emerald-200 leading-none">People's Republic of Bangladesh</p><p className="text-[8px] font-black text-amber-300 mt-0.5">জাতীয় পরিচয় পত্র</p></div>
          </div>
          <div className="size-6 bg-amber-400/90 rounded text-slate-900 flex items-center justify-center font-black text-[6px]">CHIP</div>
        </div>
        <div className="flex gap-3">
          <div className="w-16 h-20 bg-slate-800/60 rounded-lg border border-white/10 flex items-center justify-center text-[10px] text-slate-400 shrink-0">📷</div>
          <div className="flex-1 space-y-2 text-[8px] text-slate-100">
            <div><span className="text-emerald-300 block text-[6px] font-semibold">Name</span><span className="font-bold text-[9px] uppercase tracking-wide">{emp.name}</span></div>
            <div><span className="text-emerald-300 block text-[6px] font-semibold">Father's Name</span><span className="font-semibold">{emp.fatherName}</span></div>
            <div className="flex gap-3">
              <div><span className="text-emerald-300 block text-[6px] font-semibold">DOB</span><span className="font-mono font-bold">{emp.dob}</span></div>
              <div><span className="text-emerald-300 block text-[6px] font-semibold">Blood</span><span className="text-rose-300 font-bold">{emp.blood}</span></div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-3 mt-3 flex justify-between items-end">
          <div><span className="text-emerald-300 block text-[6px] font-semibold">NID NO</span><span className="font-mono text-amber-300 font-black text-[10px] tracking-widest">{emp.nid}</span></div>
          <span className="text-[6px] text-slate-400 italic">Signature</span>
        </div>
      </div>
    );
  }
  if (doc.title.includes("Academic") || doc.title.includes("Transcript")) {
    return (
      <div className="w-[300px] h-[400px] rounded-xl bg-[#fffef5] border border-amber-200/60 shadow-2xl p-5 flex flex-col justify-between text-slate-800 font-serif relative">
        <div className="absolute inset-2 border border-dashed border-amber-700/15 rounded-lg pointer-events-none" />
        <div className="text-center space-y-2">
          <div className="size-9 mx-auto rounded-full border-2 border-amber-700/40 bg-amber-50 flex items-center justify-center font-black text-[9px] text-amber-900">{(doc.ocrFields["Institute"] || "DU").slice(0, 3).toUpperCase()}</div>
          <h3 className="text-[11px] font-black text-amber-900 tracking-wide uppercase">{doc.ocrFields["Institute"] || "University"}</h3>
          <p className="text-[7px] uppercase font-sans font-bold tracking-widest text-slate-400">Office of the Controller of Examinations</p>
        </div>
        <div className="text-center space-y-1.5 my-3">
          <p className="text-[8px] italic text-slate-400">This is to certify that</p>
          <h4 className="text-[13px] font-black text-slate-900 uppercase underline decoration-amber-600/30 decoration-wavy underline-offset-4">{emp.name}</h4>
          <p className="text-[8px] italic text-slate-400">has been conferred the degree of</p>
          <h5 className="text-[11px] font-black text-amber-900 uppercase">{doc.ocrFields["Degree"] || "Bachelor of Science"}</h5>
        </div>
        <div className="bg-amber-50/60 border border-amber-200/40 rounded-lg p-2.5 font-sans text-[8.5px] space-y-1.5">
          <span className="block font-bold text-[7px] text-amber-900 uppercase tracking-wider">OCR Extracted Data</span>
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div>CGPA: <span className="font-bold text-slate-900">{doc.ocrFields["GPA / CGPA"] || "—"}</span></div>
            <div>Year: <span className="font-bold text-slate-900">{doc.ocrFields["Passing Year"] || "—"}</span></div>
          </div>
        </div>
        <div className="flex justify-between items-end border-t border-slate-200/60 pt-3 font-sans text-[7px]">
          <span className="text-slate-400">Date: <span className="font-mono font-bold text-slate-600">12/03/2023</span></span>
          <div className="text-center"><span className="italic block text-slate-500">R. Rahman</span><span className="text-[6px] uppercase tracking-widest text-slate-400">Controller of Examinations</span></div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-[300px] rounded-xl bg-white border border-slate-200 shadow-2xl p-5 text-slate-800 font-sans space-y-4">
      <div className="flex justify-between items-start border-b border-slate-100 pb-3">
        <div><h4 className="text-[10px] font-black text-slate-900 tracking-wider uppercase">{doc.title}</h4><span className="text-[8px] text-slate-400 font-mono">Ref: {doc.id.toUpperCase()}</span></div>
        <span className="px-2 py-0.5 bg-blue-600 rounded text-white text-[7px] font-extrabold uppercase">SECURE SCAN</span>
      </div>
      <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">To Whom It May Concern</p>
      <p className="text-[9.5px] font-serif leading-relaxed text-slate-600">Document submitted by <strong className="font-black text-slate-900 font-sans">{emp.name}</strong> is extracted for verification processing.</p>
      <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-1.5">
        <span className="block text-[7px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">Extracted Metadata</span>
        {Object.entries(doc.ocrFields).map(([k, v]) => (
          <div key={k} className="flex justify-between text-[9px]">
            <span className="text-slate-400 font-medium">{k}:</span>
            <span className="font-bold text-slate-800">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmployeeDocVerificationPage() {
  const [employees, setEmployees] = useState<VerificationEmployee[]>(() => getVerificationEmployees());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState<string[]>([]);
  const [areaFilter, setAreaFilter] = useState<string[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingDocId, setViewingDocId] = useState<string | null>(null);
  const [issueTarget, setIssueTarget] = useState<{ docId: string; docTitle: string } | null>(null);

  useEffect(() => {
    const handleStoreUpdate = () => {
      setEmployees(getVerificationEmployees());
    };
    window.addEventListener("employee-doc-store-updated", handleStoreUpdate);
    return () => window.removeEventListener("employee-doc-store-updated", handleStoreUpdate);
  }, []);

  const allCompanies = useMemo(() => [...new Set(employees.map((e) => e.company))].sort(), [employees]);
  const allAreas = useMemo(() => [...new Set(employees.map((e) => e.area))].sort(), [employees]);

  const activeEmployee = useMemo(() => employees.find((e) => e.id === selectedEmpId) || null, [employees, selectedEmpId]);
  const activeDocument = useMemo(() => {
    if (!activeEmployee || !viewingDocId) return null;
    return activeEmployee.documents.find((d) => d.id === viewingDocId) || null;
  }, [activeEmployee, viewingDocId]);

  const globalStats = useMemo(() => {
    let pending = 0, verified = 0, flagged = 0, reuploaded = 0, total = 0;
    employees.forEach((e) => e.documents.forEach((d) => {
      total++;
      if (d.status === "Pending") pending++;
      else if (d.status === "Flagged") flagged++;
      else if (d.status === "Re-uploaded") { reuploaded++; pending++; }
      else verified++;
    }));
    return { pending, verified, flagged, reuploaded, total };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchQuery.toLowerCase();
      const matchText = emp.name.toLowerCase().includes(q) || emp.id.includes(q) || emp.title.toLowerCase().includes(q) || emp.dept.toLowerCase().includes(q);
      if (!matchText) return false;
      if (statusFilter !== "All") {
        const st = getOverallStatus(emp);
        if (statusFilter === "Pending" && st !== "pending" && st !== "reuploaded") return false;
        if (statusFilter === "Issues" && st !== "issues") return false;
        if (statusFilter === "Reuploaded" && st !== "reuploaded") return false;
        if (statusFilter === "Verified" && st !== "verified") return false;
      }
      if (companyFilter.length > 0 && !companyFilter.includes(emp.company)) return false;
      if (areaFilter.length > 0 && !areaFilter.includes(emp.area)) return false;
      return true;
    });
  }, [employees, searchQuery, statusFilter, companyFilter, areaFilter]);

  const updateDocStatus = (empId: string, docId: string, status: "Verified" | "Flagged" | "Pending" | "Re-uploaded", issueDescription?: string) => {
    updateDocumentStatus(empId, docId, status, issueDescription);
    setEmployees(getVerificationEmployees());
  };

  const handleVerify = (docId: string, empId: string, docTitle: string) => {
    updateDocStatus(empId, docId, "Verified");
    toast.success(`"${docTitle}" verified successfully.`);
  };

  const handleMarkAsIssueConfirm = (desc: string) => {
    if (!issueTarget || !activeEmployee) return;
    updateDocumentStatus(activeEmployee.id, issueTarget.docId, "Flagged", desc);
    pushHRNotification({
      employeeId: activeEmployee.id,
      employeeName: activeEmployee.name,
      employeeTitle: activeEmployee.title,
      docId: issueTarget.docId,
      docTitle: issueTarget.docTitle,
      issueDescription: desc,
    });
    setEmployees(getVerificationEmployees());
    toast.warning(`Issue flagged for "${issueTarget.docTitle}" — Sent to Employee Doc Issue page!`, {
      icon: "🚩",
      description: "Document routed to Personnel Info > Employee Doc Issue for revised re-upload.",
    });
    setIssueTarget(null);
  };

  const handleReVerify = (docId: string, empId: string, docTitle: string) => {
    updateDocStatus(empId, docId, "Pending", undefined);
    toast.info(`"${docTitle}" reset to Pending for re-verification.`, { icon: "🔄" });
  };

  const handleVerifyAll = (empId: string) => {
    const current = getVerificationEmployees();
    let count = 0;
    const next = current.map((emp) => {
      if (emp.id !== empId) return emp;
      return {
        ...emp,
        documents: emp.documents.map((doc) => {
          if (doc.status === "Pending" || doc.status === "Re-uploaded") {
            count++;
            return { ...doc, status: "Verified" as const, issueDescription: undefined };
          }
          return doc;
        }),
      };
    });
    saveVerificationEmployees(next);
    setEmployees(next);
    if (count > 0) toast.success(`${count} document${count > 1 ? "s" : ""} verified.`);
    else toast.info("No pending documents to verify.");
  };

  const handleCompleteVerification = (empId: string, name: string) => {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) return;
    const unverified = emp.documents.filter((d) => d.status !== "Verified");
    if (unverified.length > 0) {
      const p = unverified.filter((d) => d.status === "Pending").length;
      const r = unverified.filter((d) => d.status === "Re-uploaded").length;
      const f = unverified.filter((d) => d.status === "Flagged").length;
      const parts: string[] = [];
      if (p > 0) parts.push(`${p} pending`);
      if (r > 0) parts.push(`${r} re-uploaded`);
      if (f > 0) parts.push(`${f} flagged`);
      toast.error(`Cannot finalize: ${parts.join(" and ")} doc${p + r + f > 1 ? "s" : ""} remaining.`);
      return;
    }
    toast.success(`${name}'s documents fully verified and approved!`);
    setIsModalOpen(false);
  };

  const openModal = (empId: string) => { setSelectedEmpId(empId); setViewingDocId(null); setIssueTarget(null); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setViewingDocId(null); setIssueTarget(null); };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="px-6 pt-6 pb-0 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                    <div className="p-2 bg-blue-100 dark:bg-blue-950/40 rounded-xl"><ShieldCheck className="size-5 text-blue-600 dark:text-blue-400" /></div>
                    Employee Doc Verification
                  </h1>
                  <Link
                    to="/employee-doc-issue"
                    className="h-8 inline-flex items-center gap-1.5 px-3 rounded-xl border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 text-[11px] font-bold hover:bg-orange-100 dark:hover:bg-orange-950/40 transition-all shadow-xs"
                  >
                    <Flag className="size-3 text-orange-600 dark:text-orange-400" />
                    <span>Employee Doc Issues</span>
                    {globalStats.flagged > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-100">
                        {globalStats.flagged}
                      </span>
                    )}
                  </Link>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 ml-11">Review, verify, or flag credential documents submitted by employees</p>
              </div>
              <div className="flex items-stretch gap-2.5 ml-11 md:ml-0">
                {[
                  { label: "Total", value: globalStats.total, icon: <FolderOpen className="size-3" />, cls: "text-slate-500" },
                  { label: "Pending", value: globalStats.pending, icon: <Clock className="size-3" />, cls: "text-amber-600 dark:text-amber-400" },
                  { label: "Flagged", value: globalStats.flagged, icon: <Flag className="size-3" />, cls: "text-orange-600 dark:text-orange-400" },
                  { label: "Verified", value: globalStats.verified, icon: <CheckCheck className="size-3" />, cls: "text-emerald-600 dark:text-emerald-400" },
                ].map(({ label, value, icon, cls }) => (
                  <div key={label} className="min-w-[68px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-center shadow-xs">
                    <div className={`flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-wider mb-1 ${cls}`}>{icon} {label}</div>
                    <div className={`text-xl font-black ${cls}`}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input type="text" placeholder="Search by name, ID, designation…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 font-semibold transition-all" />
              </div>
              {/* Filters row */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Filter className="size-3.5 text-slate-400 shrink-0" />
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                    <option value="All">All Statuses</option>
                    <option value="Pending">Has Pending Docs</option>
                    <option value="Issues">Has Issues</option>
                    <option value="Verified">Fully Verified</option>
                  </select>
                </div>
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 shrink-0" />
                <MultiSelectDropdown
                  label="Company"
                  icon={<Building2 className="size-3.5" />}
                  options={allCompanies}
                  selected={companyFilter}
                  onChange={setCompanyFilter}
                />
                <MultiSelectDropdown
                  label="Area"
                  icon={<MapPin className="size-3.5" />}
                  options={allAreas}
                  selected={areaFilter}
                  onChange={setAreaFilter}
                />
                {(companyFilter.length > 0 || areaFilter.length > 0) && (
                  <button
                    onClick={() => { setCompanyFilter([]); setAreaFilter([]); }}
                    className="h-9 px-2.5 text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors border border-dashed border-slate-200 dark:border-slate-700 rounded-lg hover:border-rose-300"
                  >
                    Reset filters
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium shrink-0 ml-auto">
                <Users className="size-3.5" /> {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="p-6 pt-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
                  <thead>
                    <tr className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/30">
                      <th className="px-4 py-3.5 w-10 text-center">#</th>
                      <th className="px-4 py-3.5">Employee</th>
                      <th className="px-4 py-3.5">Department</th>
                      <th className="px-4 py-3.5 text-center w-44">Document Progress</th>
                      <th className="px-4 py-3.5 text-center w-28">Status</th>
                      <th className="px-4 py-3.5 text-right w-28">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredEmployees.length === 0 ? (
                      <tr><td colSpan={6} className="py-16 text-center"><div className="flex flex-col items-center gap-2 text-slate-400"><Info className="size-8 text-slate-300 dark:text-slate-700" /><p className="font-bold text-sm">No records match current filters</p></div></td></tr>
                    ) : filteredEmployees.map((emp, idx) => {
                      const total = emp.documents.length;
                      const pending = emp.documents.filter((d) => d.status === "Pending").length;
                      const rejected = emp.documents.filter((d) => d.status === "Rejected").length;
                      const verified = emp.documents.filter((d) => d.status === "Verified").length;
                      const overallStatus = getOverallStatus(emp);
                      const pct = total > 0 ? Math.round((verified / total) * 100) : 0;
                      return (
                        <tr key={emp.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-colors cursor-pointer group" onClick={() => openModal(emp.id)}>
                          <td className="px-4 py-4 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">{getInitials(emp.name)}</div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-[12px]">{emp.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{emp.id} · {emp.title}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">{emp.dept}</span>
                            <span className={`ml-2 inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold border ${emp.empStatus === "Permanent" ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40" : "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400"}`}>{emp.empStatus}</span>
                          </td>
                          <td className="px-4 py-4 w-44">
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px] font-bold">
                                <span className="text-slate-400">{verified}/{total} verified</span>
                                <span className={rejected > 0 ? "text-rose-500" : pending > 0 ? "text-amber-500" : "text-emerald-600"}>{pct}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${rejected > 0 ? "bg-rose-400" : pending > 0 ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
                              </div>
                              <div className="flex items-center gap-2 text-[9px] font-semibold">
                                {pending > 0 && <span className="text-amber-600 dark:text-amber-400">{pending} pending</span>}
                                {rejected > 0 && <span className="text-rose-600 dark:text-rose-400">{rejected} rejected</span>}
                                {verified > 0 && <span className="text-emerald-600 dark:text-emerald-400">{verified} ok</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {overallStatus === "issues" ? (
                              <button type="button" onClick={() => openModal(emp.id)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40 uppercase tracking-wide cursor-pointer transition-all"><AlertCircle className="size-2.5" /> Issues</button>
                            ) : overallStatus === "pending" ? (
                              <button type="button" onClick={() => openModal(emp.id)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40 uppercase tracking-wide cursor-pointer transition-all"><Clock className="size-2.5" /> Review</button>
                            ) : (
                              <button type="button" onClick={() => openModal(emp.id)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40 uppercase tracking-wide cursor-pointer transition-all"><CheckCheck className="size-2.5" /> Approved</button>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => openModal(emp.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all shadow-sm cursor-pointer"
                            >
                              Review <ChevronRight className="size-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && activeEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className={`relative z-10 bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col ${viewingDocId ? "w-full max-w-6xl h-[90vh]" : "w-full max-w-6xl max-h-[90vh]"}`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">{getInitials(activeEmployee.name)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-black text-slate-900 dark:text-white">{activeEmployee.name}</h2>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${activeEmployee.empStatus === "Permanent" ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40" : "bg-orange-50 text-orange-700 border-orange-100"}`}>{activeEmployee.empStatus}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{activeEmployee.id} · {activeEmployee.title} · {activeEmployee.dept}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {viewingDocId === null && (
                  <>
                    <button onClick={() => handleVerifyAll(activeEmployee.id)} className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 transition-all"><CheckCircle2 className="size-3.5" /> Verify All Pending</button>
                    <button onClick={() => handleCompleteVerification(activeEmployee.id, activeEmployee.name)} className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"><UserCheck className="size-3.5" /> Complete Verification</button>
                  </>
                )}
                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"><X className="size-4" /></button>
              </div>
            </div>

            {/* Modal Body */}
            {viewingDocId === null ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Basic info */}
                <div className="space-y-2.5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Info className="size-3.5 text-blue-500" /> Reference Basic Info</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
                    {[
                      { label: "NID Number", value: activeEmployee.nid, mono: true },
                      { label: "Date of Birth", value: activeEmployee.dob, mono: true },
                      { label: "Father's Name", value: activeEmployee.fatherName },
                      { label: "Mother's Name", value: activeEmployee.motherName },
                      { label: "Gender & Blood", value: `${activeEmployee.gender} / ${activeEmployee.blood}` },
                      { label: "Village / District", value: activeEmployee.village },
                      { label: "Mobile", value: activeEmployee.phone, mono: true },
                      { label: "Email", value: activeEmployee.email, mono: true },
                    ].map(({ label, value, mono }, i) => (
                      <div key={label} className={`p-3.5 ${i >= 4 ? "border-t border-slate-100 dark:border-slate-800" : ""} ${i % 4 !== 3 ? "border-r border-slate-100 dark:border-slate-800" : ""}`}>
                        <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
                        <span className={`block text-xs font-bold text-slate-800 dark:text-slate-200 truncate ${mono ? "font-mono" : ""}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Documents */}
                <div className="space-y-2.5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><FolderOpen className="size-3.5 text-blue-500" /> Attached Documents · {activeEmployee.documents.length} files</p>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-[9px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/20">
                          <th className="px-4 py-3">Document</th>
                          <th className="px-4 py-3 w-20">Type</th>
                          <th className="px-4 py-3 w-28 text-center">Status</th>
                          <th className="px-4 py-3 w-56 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {activeEmployee.documents.map((doc) => {
                          const isPdf = doc.type === "PDF";
                          return (
                            <tr key={doc.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <div className={`p-2 rounded-lg ${isPdf ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20" : "bg-purple-50 text-purple-600 dark:bg-purple-950/20"}`}>{isPdf ? <FileText className="size-3.5" /> : <FileImage className="size-3.5" />}</div>
                                  <div>
                                    <p className="font-bold text-slate-900 dark:text-white text-[12px]">{doc.title}</p>
                                    <p className="text-[9px] font-mono text-slate-400 mt-0.5">{doc.file} · {doc.size}</p>

                                    {doc.status === "Flagged" && doc.issueDescription && (
                                      <p className="text-[9px] text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-lg px-2 py-1 mt-1.5 font-medium leading-snug flex items-start gap-1"><Flag className="size-2.5 mt-0.5 shrink-0" /> {doc.issueDescription}</p>
                                    )}

                                    {doc.status === "Re-uploaded" && (
                                      <div className="text-[9px] text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-lg px-2.5 py-1.5 mt-1.5 space-y-0.5">
                                        <div className="flex items-center gap-1 font-bold">
                                          <RefreshCw className="size-2.5 text-blue-600" />
                                          <span>Revised File: <strong className="font-mono">{doc.reuploadedFile || doc.file}</strong></span>
                                        </div>
                                        {doc.reuploadNote && (
                                          <p className="text-[8.5px] text-slate-600 dark:text-slate-300 italic font-medium">"{doc.reuploadNote}"</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5"><span className="text-[9px] font-mono text-slate-400 font-semibold">{doc.type}</span></td>
                              <td className="px-4 py-3.5 text-center"><StatusPill status={doc.status} /></td>
                              <td className="px-4 py-3.5">
                                <div className="flex justify-end items-center gap-1.5 flex-wrap">
                                  <button onClick={() => setViewingDocId(doc.id)} className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"><ScanEye className="size-3" /> View Scan</button>
                                  {doc.status === "Flagged" ? (
                                    <button onClick={() => handleReVerify(doc.id, activeEmployee.id, doc.title)} className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold rounded-lg border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-all"><RefreshCw className="size-3" /> Re-verify</button>
                                  ) : (
                                    <>
                                      <button onClick={() => handleVerify(doc.id, activeEmployee.id, doc.title)} disabled={doc.status === "Verified"} className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${doc.status === "Verified" ? "text-slate-300 dark:text-slate-700 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-not-allowed" : "border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/40"}`}><Check className="size-3" /> Verify</button>

                                      <button onClick={() => setIssueTarget({ docId: doc.id, docTitle: doc.title })} disabled={doc.status === "Verified"} className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${doc.status === "Verified" ? "text-slate-300 dark:text-slate-700 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 cursor-not-allowed" : "border-orange-200 dark:border-orange-900/60 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/40"}`}><Flag className="size-3" /> Issue</button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex min-h-0">
                {/* Scan panel */}
                <div className="flex-1 bg-slate-900 flex flex-col min-h-0">
                  <div className="h-11 bg-slate-950/90 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
                    <button onClick={() => setViewingDocId(null)} className="flex items-center gap-1.5 text-slate-300 hover:text-white text-[11px] font-bold bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-all"><ArrowLeft className="size-3.5" /> Back to Documents</button>
                    <span className="font-mono text-[10px] text-slate-500">{activeDocument?.file}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toast.success("Sent to printer")} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all" title="Print"><Printer className="size-3.5" /></button>
                      <button onClick={() => toast.success(`Downloading ${activeDocument?.file}`)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all" title="Download"><Download className="size-3.5" /></button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-slate-950/50">
                    {activeDocument && <DocScanPreview doc={activeDocument} emp={activeEmployee} />}
                  </div>
                </div>
                {/* Match Console */}
                <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col shrink-0">
                  <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Match Console</span>
                      {activeDocument && <StatusPill status={activeDocument.status} />}
                    </div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white leading-snug">{activeDocument?.title}</h3>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-relaxed">Compare OCR results with employee profile data.</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                    {activeDocument && Object.entries(activeDocument.ocrFields).map(([key, ocrVal]) => {
                      let profileVal = "Metadata Verified";
                      let matched = true;
                      if (key === "Document No" || key === "Certificate No") { profileVal = activeEmployee.nid; matched = profileVal.trim().toLowerCase() === ocrVal.trim().toLowerCase(); }
                      else if (key === "Name") { profileVal = activeEmployee.name; matched = profileVal.trim().toLowerCase() === ocrVal.trim().toLowerCase(); }
                      else if (key === "DOB") { profileVal = activeEmployee.dob; matched = profileVal.trim().toLowerCase() === ocrVal.trim().toLowerCase(); }
                      else if (key === "Father Name") { profileVal = activeEmployee.fatherName; matched = profileVal.trim().toLowerCase() === ocrVal.trim().toLowerCase(); }
                      return (
                        <div key={key} className={`p-3 rounded-xl border ${matched ? "border-emerald-100 bg-emerald-50/40 dark:border-emerald-900/30 dark:bg-emerald-950/10" : "border-amber-200 bg-amber-50/40 dark:border-amber-900/30 dark:bg-amber-950/10"}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">{key}</span>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${matched ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"}`}>{matched ? "✓ Match" : "≠ Mismatch"}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div><span className="block text-[8px] text-slate-400 font-semibold mb-0.5">Profile</span><span className="font-bold text-slate-700 dark:text-slate-300 truncate block">{profileVal}</span></div>
                            <div><span className="block text-[8px] text-slate-400 font-semibold mb-0.5">OCR Scan</span><span className="font-bold text-slate-900 dark:text-white truncate block">{ocrVal}</span></div>
                          </div>
                        </div>
                      );
                    })}

                    {activeDocument?.status === "Flagged" && activeDocument.issueDescription && (
                      <div className="p-3 rounded-xl border border-orange-200 bg-orange-50/30 dark:border-orange-900/40 dark:bg-orange-950/10">
                        <span className="text-[8.5px] font-black uppercase text-orange-600 dark:text-orange-400 tracking-widest block mb-1.5 flex items-center gap-1"><Flag className="size-2.5" /> Issue Flagged — HR Notified</span>
                        <p className="text-[10px] text-orange-700 dark:text-orange-400 font-medium leading-relaxed">{activeDocument.issueDescription}</p>
                      </div>
                    )}
                  </div>
                  {activeDocument && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2">
                      {activeDocument.status === "Flagged" ? (
                        <>
                          <button
                            onClick={() => { handleReVerify(activeDocument.id, activeEmployee.id, activeDocument.title); setViewingDocId(null); }}
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black border border-blue-300 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                          ><RefreshCw className="size-3.5" /> Reset for Re-verification</button>
                          <button
                            onClick={() => { handleVerify(activeDocument.id, activeEmployee.id, activeDocument.title); setViewingDocId(null); }}
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 transition-all"
                          ><Check className="size-3.5" /> Verify Anyway</button>
                        </>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => { if (activeDocument) { handleVerify(activeDocument.id, activeEmployee.id, activeDocument.title); setViewingDocId(null); } }} disabled={activeDocument.status === "Verified"} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black border transition-all ${activeDocument.status === "Verified" ? "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-sm"}`}><Check className="size-3.5" /> Verify OK</button>

                          <button onClick={() => activeDocument && setIssueTarget({ docId: activeDocument.id, docTitle: activeDocument.title })} disabled={activeDocument.status === "Verified"} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black border transition-all ${activeDocument.status === "Verified" ? "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed" : "bg-white dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-orange-950/20 border-orange-200 dark:border-orange-900/60 text-orange-600 dark:text-orange-400"}`}><Flag className="size-3.5" /> Issue</button>
                        </div>
                      )}
                      <button onClick={() => setViewingDocId(null)} className="w-full py-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">← Back to document list</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}



      {/* Mark as Issue Dialog */}
      {issueTarget && activeEmployee && (
        <MarkAsIssueDialog
          docTitle={issueTarget.docTitle}
          empName={activeEmployee.name}
          onConfirm={handleMarkAsIssueConfirm}
          onCancel={() => setIssueTarget(null)}
        />
      )}
    </div>
  );
}

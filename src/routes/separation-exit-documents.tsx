import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Printer,
  X,
  User,
  Briefcase,
  Calendar,
  QrCode,
  Building2,
  ChevronDown,
  Download,
  Search,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/separation-exit-documents")({
  head: () => ({
    meta: [
      { title: "Exit Documents Issuance — Separation Module | CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Generate and issue formal employee release letters, clearance forms, experience certificates, NOCs, and final settlement vouchers.",
      },
    ],
  }),
  component: SeparationExitDocumentsPage,
});

export type DocumentType =
  | "RELEASE_LETTER"
  | "CLEARANCE_FORM"
  | "EXPERIENCE_CERTIFICATE"
  | "NOC"
  | "SERVICE_CERTIFICATE"
  | "FINAL_SETTLEMENT_VOUCHER";

export interface ExitDocItem {
  id: string;
  empId: string;
  empName: string;
  department: string;
  designation: string;
  joiningDate: string;
  releaseDate: string;
  reportingBoss: string;
  issueStatus: "Issued" | "Draft Pending";
}

const mockEmployeesForDocs: ExitDocItem[] = [
  {
    id: "DOC-2026-081",
    empId: "2021051280",
    empName: "Farhana Akter",
    department: "Human Resource & Admin",
    designation: "HR Officer",
    joiningDate: "01/06/2021",
    releaseDate: "15/09/2026",
    reportingBoss: "Tariqul Islam (Senior HR Manager)",
    issueStatus: "Issued",
  },
  {
    id: "DOC-2025-57068",
    empId: "2025057068",
    empName: "Riazul Islam",
    department: "Implementation & Business Analysis",
    designation: "Asst. Manager",
    joiningDate: "15/01/2023",
    releaseDate: "15/09/2026",
    reportingBoss: "Mahbubur Rahman (Manager)",
    issueStatus: "Issued",
  },
  {
    id: "DOC-2026-079",
    empId: "2022019943",
    empName: "Sharmin Sultana",
    department: "RMG Operations",
    designation: "Senior Operator",
    joiningDate: "10/01/2022",
    releaseDate: "01/08/2026",
    reportingBoss: "Jalal Uddin (Floor Supv)",
    issueStatus: "Issued",
  },
];

function SeparationExitDocumentsPage() {
  const [employees, setEmployees] = useState<ExitDocItem[]>(mockEmployeesForDocs);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const [openDropdownEmpId, setOpenDropdownEmpId] = useState<string | null>(null);

  const [selectedDocType, setSelectedDocType] = useState<DocumentType>("RELEASE_LETTER");
  const [selectedEmp, setSelectedEmp] = useState<ExitDocItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchTerm.toLowerCase().trim();
      return (
        !q ||
        emp.empId.toLowerCase().includes(q) ||
        emp.empName.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q) ||
        emp.designation.toLowerCase().includes(q)
      );
    });
  }, [employees, searchTerm]);

  const handleSelectDocument = (emp: ExitDocItem, docType: DocumentType) => {
    setSelectedEmp(emp);
    setSelectedDocType(docType);
    setIsPreviewOpen(true);
    setOpenDropdownEmpId(null);
  };

  const handleDownloadPackage = (emp: ExitDocItem) => {
    setToastMsg(`Preparing complete Exit Documents Package (.ZIP) for ${emp.empName}...`);
    setTimeout(() => setToastMsg(""), 4000);
    setOpenDropdownEmpId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans font-['Inter'] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Separation</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Exit Documents Center
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {toastMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-fadeIn text-xs font-semibold">
              <div className="flex items-center gap-2">
                <Download size={18} className="text-emerald-600" />
                {toastMsg}
              </div>
              <button onClick={() => setToastMsg("")} className="font-bold text-emerald-600 hover:underline">
                Dismiss
              </button>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <label className="text-slate-500 font-medium">Search Employee:</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Emp ID, Name, Dept..."
                  className="h-8 pl-8 pr-2.5 w-72 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic">
              Click <strong>Download / Issue Documents ▾</strong> to select and view document
            </div>
          </div>

          {/* Employee Records Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                Separated Employee Records ({filteredEmployees.length})
              </h2>
            </div>

            <div className="overflow-visible pb-24">
              <table className="w-full border-collapse text-left text-xs min-w-[850px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 px-4">Employee Details</th>
                    <th className="py-3 px-4">Department &amp; Title</th>
                    <th className="py-3 px-4">Joining Date</th>
                    <th className="py-3 px-4">Release Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredEmployees.map((emp, index) => {
                    const isDropdownOpen = openDropdownEmpId === emp.id;
                    const isLastRow = index >= filteredEmployees.length - 2; // Smart upward positioning for bottom rows
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{emp.empName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {emp.empId}</div>
                        </td>
                        <td className="py-3.5 px-4">{emp.department} • {emp.designation}</td>
                        <td className="py-3.5 px-4">{emp.joiningDate}</td>
                        <td className="py-3.5 px-4 font-bold text-rose-600">{emp.releaseDate}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-600">{emp.issueStatus}</td>
                        
                        {/* LEFT ALIGNED & NON-CLIPPED DROPDOWN MENU */}
                        <td className="py-3.5 px-4 text-center relative">
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() => setOpenDropdownEmpId(isDropdownOpen ? null : emp.id)}
                              className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-sm inline-flex items-center gap-1.5 transition-all"
                            >
                              <span>Download / Issue Documents</span>
                              <ChevronDown size={14} />
                            </button>

                            {isDropdownOpen && (
                              <div
                                className={`absolute right-0 z-50 w-64 min-w-[240px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-1.5 space-y-0.5 text-left font-sans ${
                                  isLastRow ? "bottom-full mb-1" : "top-full mt-1"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectDocument(emp, "RELEASE_LETTER")}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors block"
                                >
                                  Release Letter
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSelectDocument(emp, "CLEARANCE_FORM")}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors block"
                                >
                                  Clearance Form
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSelectDocument(emp, "EXPERIENCE_CERTIFICATE")}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors block"
                                >
                                  Experience Certificate
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSelectDocument(emp, "NOC")}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors block"
                                >
                                  No Objection Certificate (NOC)
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSelectDocument(emp, "SERVICE_CERTIFICATE")}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors block"
                                >
                                  Service Certificate
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSelectDocument(emp, "FINAL_SETTLEMENT_VOUCHER")}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors block"
                                >
                                  Final Settlement Voucher
                                </button>

                                <div className="border-t border-slate-100 dark:border-slate-700 pt-1 mt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadPackage(emp)}
                                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors block"
                                  >
                                    Full Exit Package (.ZIP)
                                  </button>
                                </div>

                              </div>
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
      </div>

      {/* ULTRA-LUCRATIVE OFFICIAL EXECUTIVE EXIT DOCUMENT PREVIEW MODAL */}
      {isPreviewOpen && selectedEmp && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white font-['Inter']">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full relative">
            
            {/* Top Brand Gradient Accent Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-500" />

            {/* Modal Control Bar */}
            <div className="px-8 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden font-sans">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">
                  Official Exit Document View ({selectedDocType.replace("_", " ")})
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                  VERIFIED DOCUMENT
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handlePrint} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow">
                  <Printer size={15} /> Print Document
                </button>
                <button onClick={() => setIsPreviewOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Document Paper Container */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-6 text-slate-900 bg-white leading-relaxed font-sans">
              
              {/* Header Letterhead */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white font-black text-2xl flex items-center justify-center shadow-md border border-blue-700 font-sans">
                    P
                  </div>
                  <div className="leading-tight font-sans">
                    <div className="font-black text-xl text-slate-900 tracking-tight">
                      PAKIZA <span className="text-blue-600">SOFTWARE</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-slate-500">
                      Excellence | Intelligence | Automation
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-500 font-mono">
                  <div className="font-bold text-slate-800">REF: PKCL/HR/SEP/2026/089</div>
                  <div>Issued Date: {new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* Title Header */}
              <div className="text-center py-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-wide underline underline-offset-8 decoration-blue-500 uppercase">
                  {selectedDocType === "RELEASE_LETTER" && "LETTER OF RELEASE / অবহতি পত্র"}
                  {selectedDocType === "CLEARANCE_FORM" && "EMPLOYEE CLEARANCE FORM / ছাড়পত্র"}
                  {selectedDocType === "EXPERIENCE_CERTIFICATE" && "EXPERIENCE CERTIFICATE / অভিজ্ঞতা সনদপত্র"}
                  {selectedDocType === "NOC" && "NO OBJECTION CERTIFICATE (NOC)"}
                  {selectedDocType === "SERVICE_CERTIFICATE" && "SERVICE CERTIFICATE / সার্ভিস সার্টিফিকেট"}
                  {selectedDocType === "FINAL_SETTLEMENT_VOUCHER" && "FINAL SETTLEMENT STATEMENT"}
                </h1>
              </div>

              {/* Employee Metadata Profile Card */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200/80 shadow-2xs space-y-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  <div className="flex items-center gap-2">
                    <User size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-600">Name of Employee:</span>
                    <span className="font-extrabold text-slate-900 text-sm">{selectedEmp.empName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-600">Employee ID:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border text-xs">{selectedEmp.empId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-600">Department:</span>
                    <span className="font-semibold text-slate-900">{selectedEmp.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-600">Designation:</span>
                    <span className="font-semibold text-slate-900">{selectedEmp.designation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-600">Date of Joining:</span>
                    <span className="font-semibold text-slate-900">{selectedEmp.joiningDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-rose-600 shrink-0" />
                    <span className="font-bold text-slate-600">Date of Leaving Service:</span>
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">{selectedEmp.releaseDate}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Document Content Body */}
              <div className="space-y-4 text-xs text-slate-800 leading-relaxed font-sans">
                <div className="font-bold text-sm text-slate-900 pt-2">TO WHOM IT MAY CONCERN</div>

                {selectedDocType === "RELEASE_LETTER" && (
                  <p className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                    This is to certify that <strong>{selectedEmp.empName}</strong> (Emp ID: <strong>{selectedEmp.empId}</strong>) was employed with Pakiza Software Limited in the department of <strong>{selectedEmp.department}</strong> as a <strong>{selectedEmp.designation}</strong> from <strong>{selectedEmp.joiningDate}</strong> to <strong>{selectedEmp.releaseDate}</strong>. She/He has been officially released from company service effective <strong>{selectedEmp.releaseDate}</strong> upon completion of notice period and full departmental clearances.
                  </p>
                )}

                {selectedDocType === "CLEARANCE_FORM" && (
                  <div className="space-y-4">
                    <p className="text-slate-700 italic bg-slate-50 p-3 rounded border">
                      &ldquo;The undersigned hereby confirms that the above employee has completed his/her handing-taking, and doesn&apos;t have any outstanding balance/dues in office as of under the respective Department.&rdquo;
                    </p>
                    
                    {/* 6 Department Matrix Table */}
                    <div className="border border-slate-900 rounded-lg overflow-hidden text-xs">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-white font-bold text-center tracking-wider uppercase text-[11px]">
                            <th className="py-2.5 px-3 border-r border-slate-700 w-44">Department</th>
                            <th className="py-2.5 px-3 border-r border-slate-700">Remarks</th>
                            <th className="py-2.5 px-3 border-r border-slate-700 w-40">Status</th>
                            <th className="py-2.5 px-3 w-28">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300">
                          <tr>
                            <td className="py-3 px-3 border-r border-slate-300 font-bold text-center bg-slate-50">Accounts</td>
                            <td className="py-3 px-3 border-r border-slate-300">No outstanding financial dues</td>
                            <td className="py-3 px-3 border-r border-slate-300 text-center font-bold text-emerald-700">✓ Cleared</td>
                            <td className="py-3 px-3 text-center">20/08/2026</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 border-r border-slate-300 font-bold text-center bg-slate-50">Administration</td>
                            <td className="py-3 px-3 border-r border-slate-300">ID card &amp; desk assets returned</td>
                            <td className="py-3 px-3 border-r border-slate-300 text-center font-bold text-emerald-700">✓ Cleared</td>
                            <td className="py-3 px-3 text-center">18/08/2026</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 border-r border-slate-300 font-bold text-center bg-slate-50">ICT</td>
                            <td className="py-3 px-3 border-r border-slate-300">Laptop &amp; email access revoked</td>
                            <td className="py-3 px-3 border-r border-slate-300 text-center font-bold text-emerald-700">✓ Cleared</td>
                            <td className="py-3 px-3 text-center">19/08/2026</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 border-r border-slate-300 font-bold text-center bg-slate-50">Immediate Reporting</td>
                            <td className="py-3 px-3 border-r border-slate-300">Project handover verified</td>
                            <td className="py-3 px-3 border-r border-slate-300 text-center font-bold text-emerald-700">✓ Cleared</td>
                            <td className="py-3 px-3 text-center">16/08/2026</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 border-r border-slate-300 font-bold text-center bg-slate-50">HR Department</td>
                            <td className="py-3 px-3 border-r border-slate-300">Exit survey &amp; service book complete</td>
                            <td className="py-3 px-3 border-r border-slate-300 text-center font-bold text-emerald-700">✓ Cleared</td>
                            <td className="py-3 px-3 text-center">21/08/2026</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 border-r border-slate-300 font-bold text-center bg-slate-50">COO</td>
                            <td className="py-3 px-3 border-r border-slate-300">Executive release approved</td>
                            <td className="py-3 px-3 border-r border-slate-300 text-center font-bold text-purple-700">✓ Signed</td>
                            <td className="py-3 px-3 text-center">22/08/2026</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedDocType === "EXPERIENCE_CERTIFICATE" && (
                  <p className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                    This is to certify that <strong>{selectedEmp.empName}</strong> (Emp ID: <strong>{selectedEmp.empId}</strong>) served Pakiza Software Limited from <strong>{selectedEmp.joiningDate}</strong> to <strong>{selectedEmp.releaseDate}</strong> as <strong>{selectedEmp.designation}</strong>. During her/his tenure, she/he performed her/his duties with diligence, professionalism, and high dedication. We wish her/him every success in future endeavors.
                  </p>
                )}

                {selectedDocType === "NOC" && (
                  <p className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                    Pakiza Software Limited has no objection to <strong>{selectedEmp.empName}</strong> (Emp ID: <strong>{selectedEmp.empId}</strong>), former <strong>{selectedEmp.designation}</strong> of <strong>{selectedEmp.department}</strong>, seeking employment elsewhere. All company liabilities and departmental clearances have been fully settled.
                  </p>
                )}

                {selectedDocType === "SERVICE_CERTIFICATE" && (
                  <p className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                    Service Certificate verified for <strong>{selectedEmp.empName}</strong> (Emp ID: <strong>{selectedEmp.empId}</strong>). Period of service: <strong>{selectedEmp.joiningDate}</strong> to <strong>{selectedEmp.releaseDate}</strong>. Final designation: <strong>{selectedEmp.designation}</strong>. Conduct during service: Satisfactory &amp; Exemplary.
                  </p>
                )}

                {selectedDocType === "FINAL_SETTLEMENT_VOUCHER" && (
                  <div className="space-y-3 font-sans">
                    <p>Final settlement breakdown statement for <strong>{selectedEmp.empName}</strong> upon separation on <strong>{selectedEmp.releaseDate}</strong>.</p>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between border-b pb-1"><span>Unpaid Salary Dues:</span><span className="font-bold">৳ 45,000</span></div>
                      <div className="flex justify-between border-b pb-1"><span>Earned Leave (EL) Encashment:</span><span className="font-bold">৳ 18,500</span></div>
                      <div className="flex justify-between border-b pb-1"><span>Gratuity Benefits:</span><span className="font-bold">৳ 62,000</span></div>
                      <div className="flex justify-between border-b pb-1"><span>PF Employee &amp; Employer Contribution:</span><span className="font-bold">৳ 94,000</span></div>
                      <div className="flex justify-between font-extrabold text-sm text-emerald-700 pt-1"><span>Net Payable Settlement:</span><span>৳ 219,500</span></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Signatures & Security QR Verification Section */}
              <div className="pt-8 flex flex-wrap items-end justify-between gap-6 border-t border-slate-200">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Prepared By (HR):</span>
                  <div className="pt-8 border-t border-slate-900 w-48 text-[11px] font-semibold text-slate-600">
                    Manager (HR &amp; Compliance)
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 text-[10px]">
                  <QrCode size={36} className="text-blue-900 shrink-0" />
                  <div>
                    <div className="font-black text-blue-950 uppercase tracking-wider">PAKIZA DIGITAL SEAL</div>
                    <div className="text-slate-500 font-mono">HASH: 7C12-DOC-2026</div>
                    <div className="text-emerald-700 font-extrabold mt-0.5">✓ SYSTEM VERIFIED</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-xs text-slate-900 block">Authorized Signatory:</span>
                  <div className="pt-8 border-t border-slate-900 w-48 ml-auto text-[11px] font-semibold text-slate-600 text-center">
                    Authorized Management
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

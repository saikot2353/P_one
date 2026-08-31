import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  User,
  Building2,
  Briefcase,
  Calendar,
  FileText,
  Search,
  Plus,
  X,
  Printer,
  QrCode,
  CheckCircle2,
  Award,
  ChevronDown,
  Check,
  Scale,
  HeartPulse,
  UserX,
  AlertTriangle,
  Send,
} from "lucide-react";

export const Route = createFileRoute("/separation-company-initiated")({
  head: () => ({
    meta: [
      { title: "Other Separations (Company-Initiated) — Separation Module | CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Manage company & management-initiated separations: Termination with Notice, Retirement, Mutual Separation, Medical Invalidation, Deceased Employee Settlement, and Disciplinary Dismissal.",
      },
    ],
  }),
  component: SeparationCompanyInitiatedPage,
});

export type CompanySeparationCategory =
  | "TERMINATION"
  | "RETIREMENT"
  | "MUTUAL_SEPARATION"
  | "MEDICAL_INVALIDATION"
  | "DECEASED"
  | "DISMISSAL";

export interface CompanySeparationRecord {
  id: string;
  empId: string;
  empName: string;
  department: string;
  designation: string;
  joiningDate: string;
  effectiveDate: string;
  category: CompanySeparationCategory;
  categoryTitleBn: string;
  memoRefNumber: string;
  noticeCompensationNote: string;
  directives: string;
  status: "Initiated" | "Clearance In Progress" | "Final Settled";
}

const sampleCompanyDirectory = [
  { empId: "2019011029", empName: "Zahirul Islam", department: "Textile Spinning & Dyeing", designation: "Senior Supervisor", joiningDate: "10/01/2019", reportingName: "Jahangir Alam (AGM)" },
  { empId: "2015020108", empName: "Abul Kalam Azad", department: "Maintenance & Engineering", designation: "Head Mechanic", joiningDate: "15/03/2015", reportingName: "Rafiqul Islam (Chief Engineer)" },
  { empId: "2021045091", empName: "Kamrul Hasan", department: "Supply Chain & Logistics", designation: "Logistics Exec", joiningDate: "01/04/2021", reportingName: "Sayed Ahmed (Manager)" },
];

const mockCompanySeparations: CompanySeparationRecord[] = [
  {
    id: "SEP-COMP-2026-001",
    empId: "2015020108",
    empName: "Abul Kalam Azad",
    department: "Maintenance & Engineering",
    designation: "Head Mechanic",
    joiningDate: "15/03/2015",
    effectiveDate: "2026-09-30",
    category: "RETIREMENT",
    categoryTitleBn: "Retirement / Superannuation (অবসরগ্রহণ)",
    memoRefNumber: "PKSL/HR/RET/2026/041",
    noticeCompensationNote: "Full Superannuation Gratuity (11 Years Service) + PF Payout",
    directives: "Automatic age retirement upon reaching 60 years age per BLA rules.",
    status: "Clearance In Progress",
  },
  {
    id: "SEP-COMP-2026-002",
    empId: "2019011029",
    empName: "Zahirul Islam",
    department: "Textile Spinning & Dyeing",
    designation: "Senior Supervisor",
    joiningDate: "10/01/2019",
    effectiveDate: "2026-10-15",
    category: "TERMINATION",
    categoryTitleBn: "Termination with Notice (নোটিশসহ অবসান)",
    memoRefNumber: "PKSL/HR/TRM/2026/089",
    noticeCompensationNote: "120 Days Salary in lieu of Notice + 7 Years Gratuity",
    directives: "Business restructuring of spinning line 3. Full statutory compensation applicable.",
    status: "Initiated",
  },
  {
    id: "SEP-COMP-2026-003",
    empId: "2022088190",
    empName: "Monirul Islam",
    department: "Garments Sewing",
    designation: "Line Operator",
    joiningDate: "10/08/2022",
    effectiveDate: "2026-08-10",
    category: "DISMISSAL",
    categoryTitleBn: "Dismissal / Disciplinary (বরখাস্ত)",
    memoRefNumber: "PKSL/HR/DISM/2026/014",
    noticeCompensationNote: "Subject to Inquiry Committee Board Clearance & Statutory Dues",
    directives: "Disciplinary Board Inquiry Ref #INQ-892 for gross misconduct & unauthorized absence.",
    status: "Clearance In Progress",
  },
];

function SeparationCompanyInitiatedPage() {
  const [records, setRecords] = useState<CompanySeparationRecord[]>(mockCompanySeparations);
  const [activeTab, setActiveTab] = useState<"ALL" | CompanySeparationCategory>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDirectoryEmp, setSelectedDirectoryEmp] = useState(sampleCompanyDirectory[0]);
  const [isEmpDropdownOpen, setIsEmpDropdownOpen] = useState(false);
  const [empSearchTerm, setEmpSearchTerm] = useState("");
  
  const [categoryInput, setCategoryInput] = useState<CompanySeparationCategory>("TERMINATION");
  const [effectiveDateInput, setEffectiveDateInput] = useState(new Date().toISOString().slice(0, 10));
  const [memoRefInput, setMemoRefInput] = useState(`PKSL/HR/ORD/2026/${Math.floor(100 + Math.random() * 900)}`);
  const [noticeCompensationInput, setNoticeCompensationInput] = useState("120 Days Salary in lieu of notice + Gratuity + Earned Leave encashment.");
  const [directivesInput, setDirectivesInput] = useState("Company-initiated separation order issued. Proceed to 6-stage clearance & settlement.");

  // Formal Order View Modal State
  const [selectedOrderRecord, setSelectedOrderRecord] = useState<CompanySeparationRecord | null>(null);

  const filteredDirectoryEmployees = useMemo(() => {
    return sampleCompanyDirectory.filter((e) => {
      const q = empSearchTerm.toLowerCase().trim();
      return (
        !q ||
        e.empId.toLowerCase().includes(q) ||
        e.empName.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
      );
    });
  }, [empSearchTerm]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesTab = activeTab === "ALL" || r.category === activeTab;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.empId.toLowerCase().includes(q) ||
        r.empName.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.memoRefNumber.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [records, activeTab, searchTerm]);

  const getCategoryBadge = (cat: CompanySeparationCategory) => {
    switch (cat) {
      case "TERMINATION":
        return <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-extrabold text-[10px] border border-blue-300">Termination with Notice</span>;
      case "RETIREMENT":
        return <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-extrabold text-[10px] border border-purple-300">Retirement / Superannuation</span>;
      case "MUTUAL_SEPARATION":
        return <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-extrabold text-[10px] border border-indigo-300">Mutual Separation</span>;
      case "MEDICAL_INVALIDATION":
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-300">Medical Invalidation</span>;
      case "DECEASED":
        return <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-[10px] border border-slate-400">Deceased Employee</span>;
      case "DISMISSAL":
        return <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-extrabold text-[10px] border border-rose-300">Dismissal / Disciplinary</span>;
    }
  };

  const getCategoryBnTitle = (cat: CompanySeparationCategory) => {
    switch (cat) {
      case "TERMINATION": return "Termination with Notice (নোটিশসহ চাকরি অবসান)";
      case "RETIREMENT": return "Retirement / Superannuation (বয়সসীমা অনুযায়ী অবসর)";
      case "MUTUAL_SEPARATION": return "Mutual Separation (দ্বিপাক্ষিক সমঝোতার ভিত্তিতে অব্যাহতি)";
      case "MEDICAL_INVALIDATION": return "Medical Invalidation (চিকিৎসাজনিত স্থায়ী অক্ষমতা)";
      case "DECEASED": return "Deceased Employee Settlement (মৃত্যুজনিত সার্ভিস সমাপ্তি)";
      case "DISMISSAL": return "Dismissal / Disciplinary (শৃঙ্খলাভঙ্গের কারণে বরখাস্ত)";
    }
  };

  const handleCreateCompanySeparation = () => {
    const newRecord: CompanySeparationRecord = {
      id: `SEP-COMP-2026-${String(records.length + 10).padStart(3, "0")}`,
      empId: selectedDirectoryEmp.empId,
      empName: selectedDirectoryEmp.empName,
      department: selectedDirectoryEmp.department,
      designation: selectedDirectoryEmp.designation,
      joiningDate: selectedDirectoryEmp.joiningDate,
      effectiveDate: effectiveDateInput,
      category: categoryInput,
      categoryTitleBn: getCategoryBnTitle(categoryInput),
      memoRefNumber: memoRefInput,
      noticeCompensationNote: noticeCompensationInput,
      directives: directivesInput,
      status: "Initiated",
    };

    setRecords([newRecord, ...records]);
    setToastMsg(`Company Separation order initiated for ${selectedDirectoryEmp.empName} (${selectedDirectoryEmp.empId}).`);
    setTimeout(() => setToastMsg(""), 5000);
    setIsCreateModalOpen(false);
  };

  const handlePrintOrder = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans font-['Inter'] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />

        {/* Top Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Separation</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Other Separations (Company-Initiated)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="h-9 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-all uppercase tracking-wider"
          >
            <Plus size={16} />
            <span>Initiate Company Separation Order</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {toastMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-fadeIn text-xs font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                {toastMsg}
              </div>
              <button onClick={() => setToastMsg("")} className="font-bold text-emerald-600 hover:underline">
                Dismiss
              </button>
            </div>
          )}

          {/* Category Filter Tabs Header */}
          <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === "ALL"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              All Company Separations ({records.length})
            </button>

            <button
              onClick={() => setActiveTab("TERMINATION")}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "TERMINATION"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800"
              }`}
            >
              <FileText size={14} /> Termination with Notice
            </button>

            <button
              onClick={() => setActiveTab("RETIREMENT")}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "RETIREMENT"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800"
              }`}
            >
              <Award size={14} /> Retirement / Superannuation
            </button>

            <button
              onClick={() => setActiveTab("MUTUAL_SEPARATION")}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "MUTUAL_SEPARATION"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800"
              }`}
            >
              <Scale size={14} /> Mutual Separation
            </button>

            <button
              onClick={() => setActiveTab("MEDICAL_INVALIDATION")}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "MEDICAL_INVALIDATION"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800"
              }`}
            >
              <HeartPulse size={14} /> Medical Invalidation
            </button>

            <button
              onClick={() => setActiveTab("DECEASED")}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "DECEASED"
                  ? "bg-slate-700 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <UserX size={14} /> Deceased Employee
            </button>

            <button
              onClick={() => setActiveTab("DISMISSAL")}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === "DISMISSAL"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-800"
              }`}
            >
              <AlertTriangle size={14} /> Dismissal / Disciplinary
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <label className="text-slate-500 font-medium">Search Records:</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Emp ID, Name, Dept, Order Memo..."
                  className="h-8 pl-8 pr-2.5 w-72 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic">
              Showing {filteredRecords.length} company-initiated separation records
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[950px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 px-4">Employee Details</th>
                    <th className="py-3 px-4">Separation Category</th>
                    <th className="py-3 px-4">Order Memo Ref</th>
                    <th className="py-3 px-4">Effective Date</th>
                    <th className="py-3 px-4">Severance Package / Statutory Entitlement</th>
                    <th className="py-3 px-4 text-center">Actions &amp; Formal Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                        No company separation records found in this category.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{r.empName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {r.empId} • {r.designation}</div>
                          <div className="text-[10px] text-slate-500">{r.department}</div>
                        </td>
                        <td className="py-3.5 px-4">{getCategoryBadge(r.category)}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">{r.memoRefNumber}</td>
                        <td className="py-3.5 px-4 font-bold text-rose-600">{r.effectiveDate}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate" title={r.noticeCompensationNote}>
                          {r.noticeCompensationNote}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderRecord(r)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs inline-flex items-center gap-1.5"
                          >
                            <FileText size={14} /> View Order Notice
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* SPACIOUS WIDER MODAL (max-w-5xl) WITH 3-COLUMN CATEGORY GRID */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-['Inter']">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl flex flex-col overflow-hidden animate-fadeIn my-auto">
            
            {/* Modal Header */}
            <div className="px-8 py-5 bg-gradient-to-r from-slate-100 via-slate-50 to-blue-50/40 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black flex items-center justify-center border border-blue-300 shadow-sm">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                    Initiate Company-Initiated Separation Order
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Issue formal separation order under Bangladesh Labour Law categories
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6 text-xs overflow-y-auto max-h-[80vh]">
              
              {/* SEARCHABLE EMPLOYEE COMBOBOX */}
              <div className="space-y-1.5 relative">
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                  Select Target Employee <span className="text-rose-500">*</span>
                </label>
                
                <div
                  onClick={() => setIsEmpDropdownOpen(!isEmpDropdownOpen)}
                  className="w-full h-11 px-4 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-between cursor-pointer font-bold text-slate-900 dark:text-slate-100 text-sm shadow-2xs hover:border-blue-500 transition-all"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <User size={16} className="text-blue-600 shrink-0" />
                    <span className="truncate">
                      {selectedDirectoryEmp.empName} ({selectedDirectoryEmp.empId}) • {selectedDirectoryEmp.department}
                    </span>
                  </div>
                  <ChevronDown size={18} className="text-slate-400 shrink-0" />
                </div>

                {isEmpDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-40 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl p-2.5 space-y-2 max-h-72 overflow-y-auto">
                    <div className="relative sticky top-0 bg-white dark:bg-slate-800 pt-1 pb-2">
                      <input
                        type="text"
                        value={empSearchTerm}
                        onChange={(e) => setEmpSearchTerm(e.target.value)}
                        placeholder="Search employee by Name, ID, Department..."
                        autoFocus
                        className="w-full h-9 pl-9 pr-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                    </div>

                    <div className="space-y-1">
                      {filteredDirectoryEmployees.map((emp) => {
                        const isSelected = emp.empId === selectedDirectoryEmp.empId;
                        return (
                          <button
                            key={emp.empId}
                            type="button"
                            onClick={() => {
                              setSelectedDirectoryEmp(emp);
                              setIsEmpDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                              isSelected
                                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200"
                                : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            <div>
                              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{emp.empName} ({emp.empId})</div>
                              <div className="text-[11px] opacity-80 mt-0.5">{emp.designation} • {emp.department}</div>
                            </div>
                            {isSelected && <Check size={18} className="text-blue-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 3-COLUMN SEPARATION CATEGORY BUTTONS GRID */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                  Select Separation Category <span className="text-rose-500">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setCategoryInput("TERMINATION")}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      categoryInput === "TERMINATION"
                        ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 ring-2 ring-blue-500/20 text-blue-900 dark:text-blue-100"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-2.5">
                      <FileText size={16} className="text-blue-600 shrink-0" />
                      <span>Termination with Notice</span>
                    </div>
                    {categoryInput === "TERMINATION" && <Check size={16} className="text-blue-600 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategoryInput("RETIREMENT")}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      categoryInput === "RETIREMENT"
                        ? "bg-purple-50 dark:bg-purple-950/60 border-purple-600 ring-2 ring-purple-500/20 text-purple-900 dark:text-purple-100"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-2.5">
                      <Award size={16} className="text-purple-600 shrink-0" />
                      <span>Retirement / Superannuation</span>
                    </div>
                    {categoryInput === "RETIREMENT" && <Check size={16} className="text-purple-600 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategoryInput("MUTUAL_SEPARATION")}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      categoryInput === "MUTUAL_SEPARATION"
                        ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-900 dark:text-indigo-100"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-2.5">
                      <Scale size={16} className="text-indigo-600 shrink-0" />
                      <span>Mutual Separation Scheme</span>
                    </div>
                    {categoryInput === "MUTUAL_SEPARATION" && <Check size={16} className="text-indigo-600 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategoryInput("MEDICAL_INVALIDATION")}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      categoryInput === "MEDICAL_INVALIDATION"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-900 dark:text-emerald-100"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-2.5">
                      <HeartPulse size={16} className="text-emerald-600 shrink-0" />
                      <span>Medical Invalidation</span>
                    </div>
                    {categoryInput === "MEDICAL_INVALIDATION" && <Check size={16} className="text-emerald-600 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategoryInput("DECEASED")}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      categoryInput === "DECEASED"
                        ? "bg-slate-200 dark:bg-slate-700 border-slate-700 ring-2 ring-slate-500/20 text-slate-900 dark:text-slate-100"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-2.5">
                      <UserX size={16} className="text-slate-600 shrink-0" />
                      <span>Deceased Employee Settlement</span>
                    </div>
                    {categoryInput === "DECEASED" && <Check size={16} className="text-slate-700 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategoryInput("DISMISSAL")}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      categoryInput === "DISMISSAL"
                        ? "bg-rose-50 dark:bg-rose-950/60 border-rose-600 ring-2 ring-rose-500/20 text-rose-900 dark:text-rose-100"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-2.5">
                      <AlertTriangle size={16} className="text-rose-600 shrink-0" />
                      <span>Dismissal / Disciplinary</span>
                    </div>
                    {categoryInput === "DISMISSAL" && <Check size={16} className="text-rose-600 shrink-0" />}
                  </button>
                </div>
              </div>

              {/* DATE & REF MEMO ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800 dark:text-slate-200">
                    Effective Release Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={effectiveDateInput}
                    onChange={(e) => setEffectiveDateInput(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-bold text-rose-600 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-800 dark:text-slate-200">
                    Company Order / Memo Reference No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={memoRefInput}
                    onChange={(e) => setMemoRefInput(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 font-mono font-bold text-xs"
                  />
                </div>
              </div>

              {/* SEVERANCE PACKAGE NOTE */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-800 dark:text-slate-200">
                  Notice Compensation &amp; Statutory Severance Note
                </label>
                <input
                  type="text"
                  value={noticeCompensationInput}
                  onChange={(e) => setNoticeCompensationInput(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              {/* SPECIAL DIRECTIVES */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-800 dark:text-slate-200">
                  Management Orders &amp; HR Directives
                </label>
                <textarea
                  rows={3}
                  value={directivesInput}
                  onChange={(e) => setDirectivesInput(e.target.value)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <div className="text-[11px] text-slate-500 font-medium">
                Issues formal separation order &amp; triggers clearance workflow
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCompanySeparation}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all uppercase tracking-wider"
                >
                  <Send size={15} /> Issue Separation Order
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* OFFICIAL FORMAL SEPARATION ORDER / NOTICE PREVIEW MODAL */}
      {selectedOrderRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white font-['Inter']">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full relative">
            
            {/* Top Brand Gradient Accent Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-500" />

            {/* Modal Control Bar */}
            <div className="px-8 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden font-sans">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">
                  Official Company Separation Order Notice
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                  EXECUTED ORDER
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handlePrintOrder} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow">
                  <Printer size={15} /> Print Separation Order
                </button>
                <button onClick={() => setSelectedOrderRecord(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
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
                  <div className="font-bold text-slate-800">REF: {selectedOrderRecord.memoRefNumber}</div>
                  <div>Issued Date: {new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* Title Header */}
              <div className="text-center py-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-wide underline underline-offset-8 decoration-blue-500 uppercase">
                  OFFICIAL ORDER OF SEPARATION
                </h1>
                <div className="text-xs font-bold text-blue-700 mt-1 uppercase tracking-wider">
                  {selectedOrderRecord.categoryTitleBn}
                </div>
              </div>

              {/* Employee Metadata Profile Card */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200/80 shadow-2xs space-y-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  <div className="flex items-center gap-2">
                    <User size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-600">Employee Name:</span>
                    <span className="font-extrabold text-slate-900 text-sm">{selectedOrderRecord.empName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-600">Employee ID:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border text-xs">{selectedOrderRecord.empId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-600">Department:</span>
                    <span className="font-semibold text-slate-900">{selectedOrderRecord.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-600">Designation:</span>
                    <span className="font-semibold text-slate-900">{selectedOrderRecord.designation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-600">Date of Joining:</span>
                    <span className="font-semibold text-slate-900">{selectedOrderRecord.joiningDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-rose-600 shrink-0" />
                    <span className="font-bold text-slate-600">Effective Separation Date:</span>
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">{selectedOrderRecord.effectiveDate}</span>
                  </div>
                </div>
              </div>

              {/* Order Body Paragraph */}
              <div className="space-y-4 text-xs text-slate-800 leading-relaxed font-sans">
                <p className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                  This is an official order notifying that the service of <strong>{selectedOrderRecord.empName}</strong> (Emp ID: <strong>{selectedOrderRecord.empId}</strong>), <strong>{selectedOrderRecord.designation}</strong> of <strong>{selectedOrderRecord.department}</strong>, is hereby separated under the category of <strong>{selectedOrderRecord.categoryTitleBn}</strong> effective from <strong>{selectedOrderRecord.effectiveDate}</strong> according to company policy and Bangladesh Labour Law statutory guidelines.
                </p>

                <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-200 space-y-1">
                  <div className="font-bold text-blue-950 text-xs">Statutory Severance &amp; Compensation Entitlement:</div>
                  <div className="text-slate-800 font-semibold">{selectedOrderRecord.noticeCompensationNote}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 text-xs">Management Directives &amp; Order Remarks:</div>
                  <div className="text-slate-700 italic font-serif">&ldquo;{selectedOrderRecord.directives}&rdquo;</div>
                </div>
              </div>

              {/* Signatures & Security QR Verification Section */}
              <div className="pt-8 flex flex-wrap items-end justify-between gap-6 border-t border-slate-200">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Issued By (HR Management):</span>
                  <div className="pt-8 border-t border-slate-900 w-48 text-[11px] font-semibold text-slate-600">
                    Head of HR &amp; Administration
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 text-[10px]">
                  <QrCode size={36} className="text-blue-900 shrink-0" />
                  <div>
                    <div className="font-black text-blue-950 uppercase tracking-wider">PAKIZA DIGITAL SEAL</div>
                    <div className="text-slate-500 font-mono">HASH: COMP-SEP-2026</div>
                    <div className="text-emerald-700 font-extrabold mt-0.5">✓ SYSTEM VERIFIED</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-xs text-slate-900 block">Approved By (Executive Office):</span>
                  <div className="pt-8 border-t border-slate-900 w-48 ml-auto text-[11px] font-semibold text-slate-600 text-center">
                    Chief Operating Officer / CEO
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

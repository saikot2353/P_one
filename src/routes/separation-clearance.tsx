import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  FileCheck2,
  X,
  Printer,
  FileText,
  User,
  Briefcase,
  Calendar,
  QrCode,
  Award,
  Search,
  RotateCcw,
  UserCheck,
  Crown,
  Plus,
  Send,
  ChevronDown,
  Check,
  Building,
  Info,
  Sliders,
} from "lucide-react";

export const Route = createFileRoute("/separation-clearance")({
  head: () => ({
    meta: [
      { title: "Employee Clearance Matrix & Form — Separation Module | CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Multi-departmental separation clearance dashboard with clearance request creation and lucrative printable Pakiza Software Employee Clearance Form.",
      },
    ],
  }),
  component: SeparationClearancePage,
});

export type ClearanceStatus = "Approved" | "Pending" | "Rejected";

export interface DeptClearanceState {
  status: ClearanceStatus;
  remarks?: string;
  clearedBy?: string;
  clearedDate?: string;
}

export interface EmployeeClearanceRecord {
  id: string;
  empId: string;
  empName: string;
  department: string;
  designation: string;
  joiningDate: string;
  lastWorkingDate: string;
  separationType: string;
  immediateReportingName: string;
  immediateReportingDesignation: string;
  
  accounts: DeptClearanceState;
  administration: DeptClearanceState;
  ict: DeptClearanceState;
  immediateReporting: DeptClearanceState;
  hrDepartment: DeptClearanceState;
  coo: DeptClearanceState;

  overallStatus: "In Progress" | "Fully Cleared" | "Blocked";
}

// Approved Resigned Employees List for Clearance Initiation
const approvedResignedEmployees = [
  {
    empId: "2023014490",
    empName: "Tanjim Hossain",
    department: "Industrial Engineering",
    designation: "IE Executive",
    joiningDate: "10/02/2023",
    noticeDate: "20/08/2026",
    lastWorkingDate: "2026-09-20",
    reportingName: "Alamgir Kabir",
    reportingDesignation: "AGM Production",
    resignationReason: "Better Career Opportunity / Higher Compensation",
  },
  {
    empId: "2024018890",
    empName: "Anwar Hossain",
    department: "Merchandising & Sales",
    designation: "Senior Merchandiser",
    joiningDate: "10/02/2024",
    noticeDate: "18/08/2026",
    lastWorkingDate: "2026-09-18",
    reportingName: "Sayed Ahmed",
    reportingDesignation: "AGM Merchandising",
    resignationReason: "Relocation / Moving to Different City",
  },
  {
    empId: "2023091142",
    empName: "Selina Begum",
    department: "Garments Quality Assurance",
    designation: "QA Inspector",
    joiningDate: "05/09/2023",
    noticeDate: "12/08/2026",
    lastWorkingDate: "2026-09-12",
    reportingName: "Mostafa Kamal",
    reportingDesignation: "Quality Manager",
    resignationReason: "Personal & Family Responsibilities",
  },
];

const initialClearanceRecords: EmployeeClearanceRecord[] = [
  {
    id: "CLR-2025-57068",
    empId: "2025057068",
    empName: "Riazul Islam",
    department: "Implementation & Business Analysis",
    designation: "Asst. Manager",
    joiningDate: "15/01/2023",
    lastWorkingDate: "2026-09-15",
    separationType: "Resignation",
    immediateReportingName: "Mahbubur Rahman",
    immediateReportingDesignation: "Manager (Software & Analysis)",
    accounts: { status: "Approved", remarks: "All loan balances & expense claims reconciled", clearedBy: "Accounts Dept Lead", clearedDate: "20/08/2026" },
    administration: { status: "Approved", remarks: "ID card, locker key & desk assets returned", clearedBy: "Admin Executive", clearedDate: "18/08/2026" },
    ict: { status: "Approved", remarks: "Laptop, email ID & VPN access revoked", clearedBy: "IT Support Admin", clearedDate: "19/08/2026" },
    immediateReporting: { status: "Approved", remarks: "Complete project handover verified", clearedBy: "Mahbubur Rahman", clearedDate: "16/08/2026" },
    hrDepartment: { status: "Approved", remarks: "Exit survey & service records complete", clearedBy: "HR Manager", clearedDate: "21/08/2026" },
    coo: { status: "Pending", remarks: "Awaiting final executive signoff" },
    overallStatus: "In Progress",
  },
  {
    id: "CLR-2026-012",
    empId: "2021051280",
    empName: "Farhana Akter",
    department: "Human Resource & Admin",
    designation: "HR Officer",
    joiningDate: "01/06/2021",
    lastWorkingDate: "2026-09-15",
    separationType: "Resignation",
    immediateReportingName: "Tariqul Islam",
    immediateReportingDesignation: "Senior HR Manager",
    accounts: { status: "Approved", remarks: "No outstanding dues", clearedBy: "Finance Mgr", clearedDate: "20/08/2026" },
    administration: { status: "Approved", remarks: "Returned", clearedBy: "Admin Officer", clearedDate: "18/08/2026" },
    ict: { status: "Approved", remarks: "System revoked", clearedBy: "IT Lead", clearedDate: "19/08/2026" },
    immediateReporting: { status: "Approved", remarks: "Handover complete", clearedBy: "Tariqul Islam", clearedDate: "16/08/2026" },
    hrDepartment: { status: "Approved", remarks: "Survey done", clearedBy: "HR Lead", clearedDate: "21/08/2026" },
    coo: { status: "Approved", remarks: "Final Release Approved", clearedBy: "COO Office", clearedDate: "22/08/2026" },
    overallStatus: "Fully Cleared",
  },
  {
    id: "CLR-2026-013",
    empId: "2020093311",
    empName: "Rokeya Begum",
    department: "Finishing & Packing",
    designation: "Quality Inspector",
    joiningDate: "18/09/2020",
    lastWorkingDate: "2026-09-20",
    separationType: "Resignation",
    immediateReportingName: "Kabir Hossain",
    immediateReportingDesignation: "Floor Supervisor",
    accounts: { status: "Pending" },
    administration: { status: "Pending" },
    ict: { status: "Approved", remarks: "N/A - Factory worker profile", clearedBy: "IT Helpdesk", clearedDate: "21/08/2026" },
    immediateReporting: { status: "Approved", remarks: "Line logs handed over", clearedBy: "Kabir Hossain", clearedDate: "22/08/2026" },
    hrDepartment: { status: "Pending" },
    coo: { status: "Pending" },
    overallStatus: "In Progress",
  },
];

function SeparationClearancePage() {
  const [records, setRecords] = useState<EmployeeClearanceRecord[]>(initialClearanceRecords);
  const [toastMsg, setToastMsg] = useState("");

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // CREATE CLEARANCE REQUEST MODAL STATE
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedResignedEmp, setSelectedResignedEmp] = useState(approvedResignedEmployees[0]);
  const [isEmpDropdownOpen, setIsEmpDropdownOpen] = useState(false);
  const [empSearchTerm, setEmpSearchTerm] = useState("");
  const [directivesInput, setDirectivesInput] = useState("Initiate 6-department clearance verification upon resignation approval.");

  // Action Modal State (Department Clearance Update)
  const [selectedRecord, setSelectedRecord] = useState<EmployeeClearanceRecord | null>(null);
  const [activeDeptKey, setActiveDeptKey] = useState<
    "accounts" | "administration" | "ict" | "immediateReporting" | "hrDepartment" | "coo"
  >("accounts");
  const [actionRemarks, setActionRemarks] = useState("");

  // Official Printable Clearance Form Modal State
  const [printModalRecord, setPrintModalRecord] = useState<EmployeeClearanceRecord | null>(null);

  // Filtered Approved Resigned Employees for Searchable Combobox
  const filteredResignedEmployees = useMemo(() => {
    return approvedResignedEmployees.filter((e) => {
      const q = empSearchTerm.toLowerCase().trim();
      return (
        !q ||
        e.empId.toLowerCase().includes(q) ||
        e.empName.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q)
      );
    });
  }, [empSearchTerm]);

  const departmentOptions = useMemo(() => {
    const depts = new Set(records.map((r) => r.department));
    return ["ALL", ...Array.from(depts)];
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.empId.toLowerCase().includes(q) ||
        r.empName.toLowerCase().includes(q) ||
        r.designation.toLowerCase().includes(q);

      const matchesDept = deptFilter === "ALL" || r.department === deptFilter;
      const matchesStatus = statusFilter === "ALL" || r.overallStatus === statusFilter;

      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && r.lastWorkingDate >= fromDate;
      if (toDate) matchesDate = matchesDate && r.lastWorkingDate <= toDate;

      return matchesSearch && matchesDept && matchesStatus && matchesDate;
    });
  }, [records, searchTerm, deptFilter, statusFilter, fromDate, toDate]);

  const handleCreateClearanceRequest = () => {
    if (!selectedResignedEmp) return;

    const newRecord: EmployeeClearanceRecord = {
      id: `CLR-2026-${String(records.length + 15).padStart(3, "0")}`,
      empId: selectedResignedEmp.empId,
      empName: selectedResignedEmp.empName,
      department: selectedResignedEmp.department,
      designation: selectedResignedEmp.designation,
      joiningDate: selectedResignedEmp.joiningDate,
      lastWorkingDate: selectedResignedEmp.lastWorkingDate,
      separationType: "Resignation",
      immediateReportingName: selectedResignedEmp.reportingName,
      immediateReportingDesignation: selectedResignedEmp.reportingDesignation,
      accounts: { status: "Pending", remarks: directivesInput },
      administration: { status: "Pending", remarks: directivesInput },
      ict: { status: "Pending", remarks: directivesInput },
      immediateReporting: { status: "Pending", remarks: directivesInput },
      hrDepartment: { status: "Pending", remarks: directivesInput },
      coo: { status: "Pending", remarks: directivesInput },
      overallStatus: "In Progress",
    };

    setRecords([newRecord, ...records]);
    setToastMsg(`Clearance Request created for Resigned Employee ${selectedResignedEmp.empName} (${selectedResignedEmp.empId}).`);
    setTimeout(() => setToastMsg(""), 5000);
    setIsCreateModalOpen(false);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDeptFilter("ALL");
    setStatusFilter("ALL");
    setFromDate("");
    setToDate("");
  };

  const getClearanceProgress = (r: EmployeeClearanceRecord) => {
    const stages = [r.accounts, r.administration, r.ict, r.immediateReporting, r.hrDepartment, r.coo];
    const approvedCount = stages.filter((s) => s.status === "Approved").length;
    const percentage = Math.round((approvedCount / 6) * 100);
    return { approvedCount, percentage };
  };

  const handleUpdateDeptClearance = (newStatus: ClearanceStatus) => {
    if (!selectedRecord) return;

    const updatedRecords = records.map((r) => {
      if (r.id === selectedRecord.id) {
        const updatedDeptObj: DeptClearanceState = {
          status: newStatus,
          remarks: actionRemarks || (newStatus === "Approved" ? "Dues & assets cleared" : "Pending requirements"),
          clearedBy: "Current User (Authorized)",
          clearedDate: new Date().toLocaleDateString(),
        };

        const newRec = {
          ...r,
          [activeDeptKey]: updatedDeptObj,
        };

        const allApproved =
          (activeDeptKey === "accounts" ? newStatus : r.accounts.status) === "Approved" &&
          (activeDeptKey === "administration" ? newStatus : r.administration.status) === "Approved" &&
          (activeDeptKey === "ict" ? newStatus : r.ict.status) === "Approved" &&
          (activeDeptKey === "immediateReporting" ? newStatus : r.immediateReporting.status) === "Approved" &&
          (activeDeptKey === "hrDepartment" ? newStatus : r.hrDepartment.status) === "Approved" &&
          (activeDeptKey === "coo" ? newStatus : r.coo.status) === "Approved";

        newRec.overallStatus = allApproved ? "Fully Cleared" : "In Progress";
        return newRec;
      }
      return r;
    });

    setRecords(updatedRecords);
    setToastMsg(`Department Clearance for ${selectedRecord.empName} updated to ${newStatus}.`);
    setTimeout(() => setToastMsg(""), 4000);
    setSelectedRecord(null);
  };

  const handlePrintForm = () => {
    window.print();
  };

  const getDeptBadge = (deptState: DeptClearanceState, label: string) => {
    return (
      <div
        className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border flex flex-col items-center justify-center text-center transition-all ${
          deptState.status === "Approved"
            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200"
            : deptState.status === "Rejected"
            ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200"
            : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200"
        }`}
      >
        <span className="text-[9px] uppercase tracking-wider text-slate-400">{label}</span>
        <span className="font-extrabold flex items-center gap-1 mt-0.5">
          {deptState.status === "Approved" ? (
            <CheckCircle2 size={11} className="text-emerald-600" />
          ) : (
            <Clock size={11} className="text-amber-500" />
          )}
          {deptState.status}
        </span>
      </div>
    );
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
              Clearance Matrix &amp; Form
            </span>
          </div>

          {/* PRIMARY ACTION BUTTONS: CREATE CLEARANCE REQUEST & CONFIGURATION */}
          <div className="flex items-center gap-2">
            <Link
              to="/separation-clearance-configuration"
              className="h-9 px-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sliders size={15} />
              <span>Clearance Configuration</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-all uppercase tracking-wider cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Clearance Request</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
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

          {/* FILTER TOOLBAR */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Search size={15} className="text-blue-600" />
                <span>Search &amp; Filter Separation Clearance Records</span>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1 text-[11px]"
              >
                <RotateCcw size={13} /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              
              {/* Text Search */}
              <div className="space-y-1">
                <label className="block text-slate-500 font-medium">Search Keyword</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Emp ID, Name, Title..."
                  className="w-full h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Department Dropdown Filter */}
              <div className="space-y-1">
                <label className="block text-slate-500 font-medium">Department</label>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 outline-none font-medium text-xs"
                >
                  {departmentOptions.map((d) => (
                    <option key={d} value={d}>
                      {d === "ALL" ? "All Departments" : d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Overall Status Filter */}
              <div className="space-y-1">
                <label className="block text-slate-500 font-medium">Overall Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 outline-none font-medium text-xs"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Fully Cleared">Fully Cleared</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              {/* Date Range: From Date */}
              <div className="space-y-1">
                <label className="block text-slate-500 font-medium">Leaving From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 outline-none text-xs"
                />
              </div>

              {/* Date Range: To Date */}
              <div className="space-y-1">
                <label className="block text-slate-500 font-medium">Leaving To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 outline-none text-xs"
                />
              </div>

            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 px-3">Employee Details</th>
                    <th className="py-3 px-3 text-center">Clearance Progress</th>
                    <th className="py-3 px-3 text-center">Accounts</th>
                    <th className="py-3 px-3 text-center">Admin</th>
                    <th className="py-3 px-3 text-center">ICT</th>
                    <th className="py-3 px-3 text-center">Immediate Boss</th>
                    <th className="py-3 px-3 text-center">HR Dept</th>
                    <th className="py-3 px-3 text-center">COO</th>
                    <th className="py-3 px-3 text-center">Official Form</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                        No clearance records found matching your active filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => {
                      const { approvedCount, percentage } = getClearanceProgress(r);
                      return (
                        <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 dark:text-slate-100">{r.empName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">ID: {r.empId} • {r.designation}</div>
                            <div className="text-[10px] text-slate-500">{r.department} • Leaving: {r.lastWorkingDate}</div>
                          </td>

                          {/* Progress Bar */}
                          <td className="py-3 px-3 text-center w-40">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold">
                                <span>{approvedCount} of 6 Stage</span>
                                <span className="text-blue-600">{percentage}%</span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all ${
                                    percentage === 100 ? "bg-emerald-600" : "bg-blue-600"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* 6 Stage Badges */}
                          <td className="py-2 px-1 text-center cursor-pointer" onClick={() => { setSelectedRecord(r); setActiveDeptKey("accounts"); }}>
                            {getDeptBadge(r.accounts, "Accounts")}
                          </td>
                          <td className="py-2 px-1 text-center cursor-pointer" onClick={() => { setSelectedRecord(r); setActiveDeptKey("administration"); }}>
                            {getDeptBadge(r.administration, "Admin")}
                          </td>
                          <td className="py-2 px-1 text-center cursor-pointer" onClick={() => { setSelectedRecord(r); setActiveDeptKey("ict"); }}>
                            {getDeptBadge(r.ict, "ICT")}
                          </td>
                          <td className="py-2 px-1 text-center cursor-pointer" onClick={() => { setSelectedRecord(r); setActiveDeptKey("immediateReporting"); }}>
                            {getDeptBadge(r.immediateReporting, "Boss")}
                          </td>
                          <td className="py-2 px-1 text-center cursor-pointer" onClick={() => { setSelectedRecord(r); setActiveDeptKey("hrDepartment"); }}>
                            {getDeptBadge(r.hrDepartment, "HR")}
                          </td>
                          <td className="py-2 px-1 text-center cursor-pointer" onClick={() => { setSelectedRecord(r); setActiveDeptKey("coo"); }}>
                            {getDeptBadge(r.coo, "COO")}
                          </td>

                          {/* Official Form Modal Trigger Button */}
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => setPrintModalRecord(r)}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1.5 mx-auto"
                            >
                              <FileText size={13} /> View Form
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

        </div>
      </div>

      {/* LARGE & SPACIOUS (max-w-3xl) CREATE CLEARANCE REQUEST MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-['Inter']">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl flex flex-col overflow-hidden animate-fadeIn my-auto">
            
            {/* Modal Header */}
            <div className="px-8 py-5 bg-gradient-to-r from-slate-100 via-slate-50 to-blue-50/40 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black flex items-center justify-center border border-emerald-300 shadow-sm">
                  <FileCheck2 size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                    Initiate 6-Stage Clearance Request
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Select an approved resigned employee to generate departmental clearance matrix
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

            {/* Modal Body - Roomy & Spacious Layout */}
            <div className="p-8 space-y-6 text-xs overflow-y-auto max-h-[80vh]">
              
              {/* SEARCHABLE RESIGNED EMPLOYEE COMBOBOX */}
              <div className="space-y-1.5 relative">
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                  Select Resigned &amp; Approved Employee <span className="text-rose-500">*</span>
                </label>
                
                <div
                  onClick={() => setIsEmpDropdownOpen(!isEmpDropdownOpen)}
                  className="w-full h-11 px-4 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-between cursor-pointer font-bold text-slate-900 dark:text-slate-100 text-sm shadow-2xs hover:border-blue-500 transition-all"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <User size={16} className="text-blue-600 shrink-0" />
                    <span className="truncate">
                      {selectedResignedEmp.empName} ({selectedResignedEmp.empId}) • {selectedResignedEmp.department}
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
                        placeholder="Search by Employee ID, Name, Department, Title..."
                        autoFocus
                        className="w-full h-9 pl-9 pr-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                    </div>

                    <div className="space-y-1">
                      {filteredResignedEmployees.length === 0 ? (
                        <div className="py-3 text-center text-slate-400 italic">No approved resigned employees found</div>
                      ) : (
                        filteredResignedEmployees.map((emp) => {
                          const isSelected = emp.empId === selectedResignedEmp.empId;
                          return (
                            <button
                              key={emp.empId}
                              type="button"
                              onClick={() => {
                                setSelectedResignedEmp(emp);
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
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* AUTO-POPULATED RESIGNATION DETAILS PROFILE CARD (SPACIOUS 2-COLUMN GRID) */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-800/80 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="font-extrabold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Info size={15} className="text-blue-600" />
                    Approved Resignation Metadata
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-300 shadow-2xs">
                    ✓ RESIGNATION APPROVED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs pt-1">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Employee Name &amp; ID</span>
                    <span className="font-black text-slate-900 dark:text-slate-100 text-sm">{selectedResignedEmp.empName} ({selectedResignedEmp.empId})</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Department &amp; Title</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedResignedEmp.department} • {selectedResignedEmp.designation}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Resignation Notice Date</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedResignedEmp.noticeDate}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Date of Leaving Service</span>
                    <span className="font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 inline-block">{selectedResignedEmp.lastWorkingDate}</span>
                  </div>

                  <div className="col-span-1 sm:col-span-2 space-y-0.5 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Immediate Reporting Boss</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedResignedEmp.reportingName} ({selectedResignedEmp.reportingDesignation})</span>
                  </div>

                  <div className="col-span-1 sm:col-span-2 space-y-0.5">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Stated Resignation Reason</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 italic">&ldquo;{selectedResignedEmp.resignationReason}&rdquo;</span>
                  </div>
                </div>
              </div>

              {/* Clearance Directives */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                  HR Clearance Directives &amp; Department Notes
                </label>
                <textarea
                  rows={4}
                  value={directivesInput}
                  onChange={(e) => setDirectivesInput(e.target.value)}
                  placeholder="Special instructions for Accounts, Admin, ICT, Reporting Boss, HR, and COO clearance officers..."
                  className="w-full p-3.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-blue-500 font-sans shadow-2xs"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <div className="text-[11px] text-slate-500 font-medium">
                Initiates 6-department clearance matrix (Accounts, Admin, ICT, Boss, HR, COO)
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
                  onClick={handleCreateClearanceRequest}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all uppercase tracking-wider"
                >
                  <Send size={15} /> Initiate Clearance Request
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ULTRA-LUCRATIVE OFFICIAL PRINTABLE PAKIZA SOFTWARE "EMPLOYEE CLEARANCE FORM" MODAL */}
      {printModalRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white font-['Inter']">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full relative">
            
            {/* Top Brand Gradient Accent Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-500" />

            {/* Modal Control Toolbar */}
            <div className="px-8 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden font-sans">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">
                  Official Employee Clearance Form
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                  VERIFIED DOCUMENT
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrintForm}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all"
                >
                  <Printer size={15} /> Print Clearance Form
                </button>
                <button
                  type="button"
                  onClick={() => setPrintModalRecord(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Printable Form Container */}
            <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-6 text-slate-900 bg-white leading-relaxed font-sans">
              
              {/* Header Letterhead with Pakiza Software Logo */}
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
                  <div className="font-bold text-slate-800">FORM REF: PKCL/CLR/2026/012</div>
                  <div>Issued Date: {new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* Document Title Banner */}
              <div className="text-center py-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-wide underline underline-offset-8 decoration-blue-500">
                  Employee Clearance Form
                </h1>
              </div>

              {/* Lucrative Employee Info Profile Card */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                  
                  <div className="flex items-center gap-2">
                    <User size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-600">Name of employee:</span>
                    <span className="font-extrabold text-slate-900 text-sm">{printModalRecord.empName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Award size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-600">ID NO:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border text-xs">{printModalRecord.empId}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-600">Department:</span>
                    <span className="font-semibold text-slate-900">{printModalRecord.department}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase size={15} className="text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-600">Designation:</span>
                    <span className="font-semibold text-slate-900">{printModalRecord.designation}</span>
                  </div>

                  <div className="flex items-center gap-2 col-span-1 sm:col-span-2 pt-1 border-t border-slate-200/60">
                    <Calendar size={15} className="text-rose-600 shrink-0" />
                    <span className="font-bold text-slate-600">Date of leaving service:</span>
                    <span className="font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">{printModalRecord.lastWorkingDate}</span>
                  </div>

                  <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                    <UserCheck size={15} className="text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-600">Immediate Reporting Boss:</span>
                    <span className="font-semibold text-slate-900">{printModalRecord.immediateReportingName} ({printModalRecord.immediateReportingDesignation})</span>
                  </div>

                </div>
              </div>

              {/* Formal Confirmation Statement */}
              <div className="text-xs text-slate-700 leading-relaxed italic bg-slate-50/60 p-3.5 rounded-lg border border-slate-200">
                &ldquo;The undersigned hereby confirms that the above employee has completed his/her handing-taking, and doesn&apos;t have any outstanding balance/dues in office as of under the respective Department. (If there are any outstanding balances/dues, please mention them in the remarks column).&rdquo;
              </div>

              {/* Lucrative 6-Department Matrix Table */}
              <div className="border border-slate-900 rounded-lg overflow-hidden shadow-2xs text-xs">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold text-center tracking-wider uppercase text-[11px]">
                      <th className="py-3 px-4 border-r border-slate-700 w-44">Department</th>
                      <th className="py-3 px-4 border-r border-slate-700">Remarks / Clearance Dues Note</th>
                      <th className="py-3 px-4 border-r border-slate-700 w-44">Signature &amp; Status</th>
                      <th className="py-3 px-4 w-28">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    
                    {/* Accounts */}
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 border-r border-slate-300 font-bold text-center bg-slate-50/80">Accounts</td>
                      <td className="py-3.5 px-4 border-r border-slate-300">{printModalRecord.accounts.remarks || "All financial dues reconciled"}</td>
                      <td className="py-3.5 px-4 border-r border-slate-300 text-center">
                        {printModalRecord.accounts.status === "Approved" ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-full border border-emerald-300 shadow-2xs">
                            <CheckCircle2 size={12} className="text-emerald-600" /> Cleared (Accounts)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-full border border-amber-300">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-medium">{printModalRecord.accounts.clearedDate || "-"}</td>
                    </tr>

                    {/* Administration */}
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 border-r border-slate-300 font-bold text-center bg-slate-50/80">Administration</td>
                      <td className="py-3.5 px-4 border-r border-slate-300">{printModalRecord.administration.remarks || "ID card & desk assets returned"}</td>
                      <td className="py-3.5 px-4 border-r border-slate-300 text-center">
                        {printModalRecord.administration.status === "Approved" ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-full border border-emerald-300 shadow-2xs">
                            <CheckCircle2 size={12} className="text-emerald-600" /> Cleared (Admin)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-full border border-amber-300">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-medium">{printModalRecord.administration.clearedDate || "-"}</td>
                    </tr>

                    {/* ICT */}
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 border-r border-slate-300 font-bold text-center bg-slate-50/80">ICT</td>
                      <td className="py-3.5 px-4 border-r border-slate-300">{printModalRecord.ict.remarks || "Hardware & credentials revoked"}</td>
                      <td className="py-3.5 px-4 border-r border-slate-300 text-center">
                        {printModalRecord.ict.status === "Approved" ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-full border border-emerald-300 shadow-2xs">
                            <CheckCircle2 size={12} className="text-emerald-600" /> Cleared (ICT)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-full border border-amber-300">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-medium">{printModalRecord.ict.clearedDate || "-"}</td>
                    </tr>

                    {/* Immediate Reporting */}
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 border-r border-slate-300 font-bold text-center bg-slate-50/80">Immediate Reporting</td>
                      <td className="py-3.5 px-4 border-r border-slate-300">{printModalRecord.immediateReporting.remarks || "Project handover complete"}</td>
                      <td className="py-3.5 px-4 border-r border-slate-300 text-center">
                        {printModalRecord.immediateReporting.status === "Approved" ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-full border border-emerald-300 shadow-2xs">
                            <CheckCircle2 size={12} className="text-emerald-600" /> Cleared (Boss)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-full border border-amber-300">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-medium">{printModalRecord.immediateReporting.clearedDate || "-"}</td>
                    </tr>

                    {/* HR Department */}
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 border-r border-slate-300 font-bold text-center bg-slate-50/80">HR Department</td>
                      <td className="py-3.5 px-4 border-r border-slate-300">{printModalRecord.hrDepartment.remarks || "Exit survey completed"}</td>
                      <td className="py-3.5 px-4 border-r border-slate-300 text-center">
                        {printModalRecord.hrDepartment.status === "Approved" ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded-full border border-emerald-300 shadow-2xs">
                            <CheckCircle2 size={12} className="text-emerald-600" /> Cleared (HR)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-full border border-amber-300">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-medium">{printModalRecord.hrDepartment.clearedDate || "-"}</td>
                    </tr>

                    {/* COO */}
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 border-r border-slate-300 font-bold text-center bg-slate-50/80">COO</td>
                      <td className="py-3.5 px-4 border-r border-slate-300">{printModalRecord.coo.remarks || "Executive release approved"}</td>
                      <td className="py-3.5 px-4 border-r border-slate-300 text-center">
                        {printModalRecord.coo.status === "Approved" ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 font-extrabold text-[10px] rounded-full border border-purple-300 shadow-2xs">
                            <Crown size={12} className="text-purple-600" /> Signed (COO)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-full border border-amber-300">
                            <Clock size={12} /> Pending Signoff
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-medium">{printModalRecord.coo.clearedDate || "-"}</td>
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Employee Undertaking Paragraph */}
              <div className="text-xs text-slate-800 leading-relaxed font-serif pt-1">
                &ldquo;I hereby certify that I have refunded all equipment and cleared all dues towards Pakiza Software Limited. have been settled before the last day of work.&rdquo;
              </div>

              {/* Signatures & Security QR Verification Section */}
              <div className="pt-8 flex flex-wrap items-end justify-between gap-6 border-t border-slate-200">
                <div className="space-y-6">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Certified by:</span>
                    <div className="pt-8 border-t border-slate-900 w-48 text-[11px] font-semibold text-slate-600">
                      Authorized Manager Signature
                    </div>
                  </div>
                </div>

                {/* Digital Security Seal Badge */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 text-[10px]">
                  <QrCode size={36} className="text-blue-900 shrink-0" />
                  <div>
                    <div className="font-black text-blue-950 uppercase tracking-wider">PAKIZA DIGITAL SEAL</div>
                    <div className="text-slate-500 font-mono">HASH: 9F8A-CLR-2026</div>
                    <div className="text-emerald-700 font-extrabold mt-0.5">✓ SYSTEM VERIFIED</div>
                  </div>
                </div>

                <div className="text-right space-y-6">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Employee Name: {printModalRecord.empName}</span>
                    <div className="pt-8 border-t border-slate-900 w-52 ml-auto text-[11px] font-semibold text-slate-600 text-center">
                      Signature &amp; date:
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Clearance Approval Action Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-['Inter']">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <FileCheck2 size={18} className="text-blue-600" />
                Department Clearance Action
              </h3>
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-400 block">Target Employee:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {selectedRecord.empName} ({selectedRecord.empId})
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Select Department Stage:</span>
                <select
                  value={activeDeptKey}
                  onChange={(e) => setActiveDeptKey(e.target.value as any)}
                  className="w-full h-8 px-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 font-bold text-xs"
                >
                  <option value="accounts">Accounts Clearance</option>
                  <option value="administration">Administration Clearance</option>
                  <option value="ict">ICT / IT Clearance</option>
                  <option value="immediateReporting">Immediate Reporting Boss Clearance</option>
                  <option value="hrDepartment">HR Department Clearance</option>
                  <option value="coo">COO / C-Level Executive Clearance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Clearance Remarks / Dues Notes</label>
                <textarea
                  rows={2}
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  placeholder="e.g. Asset returned, accounts reconciled..."
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-3.5 py-1.5 rounded bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateDeptClearance("Approved")}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow"
              >
                Grant Clearance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

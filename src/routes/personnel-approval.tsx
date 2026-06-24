import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Search,
  Printer,
  FileText,
  Eye,
  Table as TableIcon,
  X,
  CheckCircle2,
  Clock,
  CornerUpRight,
  MessageSquare,
  User,
  FileCheck,
  CalendarDays,
  XCircle,
  FolderOpen,
  UserCheck,
  ShieldAlert,
  Briefcase,
  Building,
  Check,
  Award,
  ArrowRightLeft
} from "lucide-react";

export const Route = createFileRoute("/personnel-approval")({
  component: PersonnelApprovalPage,
});

// Candidate for Joining Approval
interface PendingCandidate {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  joiningDate: string;
  grossSalary: number;
  email: string;
  phone: string;
  status: "Pending Approval" | "Draft/Review" | "Approved" | "Rejected";
  approvedEmpId?: string;
  rejectionReason?: string;
}

const initialCandidates: PendingCandidate[] = [
  {
    id: "APP-20261109",
    name: "Tahmid Afsar Shapno",
    jobTitle: "Office Executive",
    department: "Business Innovation",
    joiningDate: "01/08/2023",
    grossSalary: 152000.00,
    email: "tahmid.bd@pakizasoftware.com",
    phone: "01750021154",
    status: "Pending Approval"
  },
  {
    id: "APP-20260481",
    name: "Fahim Faisal",
    jobTitle: "Software Engineer",
    department: "Business Innovation",
    joiningDate: "15/05/2026",
    grossSalary: 85000.00,
    email: "fahim@pakizasoftware.com",
    phone: "01827394852",
    status: "Pending Approval"
  },
  {
    id: "APP-20260273",
    name: "Nusrat Jahan",
    jobTitle: "HR Officer",
    department: "Operations & HR",
    joiningDate: "01/06/2026",
    grossSalary: 45000.00,
    email: "nusrat@pakizasoftware.com",
    phone: "01928374650",
    status: "Draft/Review"
  }
];

// Employee for Status Transition
interface EmployeeStatusRecord {
  empId: string;
  name: string;
  jobTitle: string;
  department: string;
  joiningDate: string;
  defaultHoliday: string;
  bloodGroup: string;
  basic: number;
  gross: number;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  otStatus: string;
  otRate: number;
  workingStatus: "Working" | "Suspended" | "Terminated" | "Resigned" | "On Leave";
  employmentStatus: "Probation" | "Permanent" | "Contractual" | "Temporary";
  confirmationDate?: string;
  perVil: string;
  acStatus: "Active" | "Inactive";
  conversionStatus: "Pending" | "Approved" | "Rejected";
  conversionNotes?: string;
}

const initialEmployees: EmployeeStatusRecord[] = [
  {
    empId: "2023043910",
    name: "Tahmid Afsar Shapno",
    jobTitle: "Asst. Manager",
    department: "Business Innovation",
    joiningDate: "01/08/2023",
    defaultHoliday: "Friday",
    bloodGroup: "AB (+ve)",
    basic: 91200.00,
    gross: 152000.00,
    email: "tahmid.bd@pakizasoftware.com",
    phone: "01750021154",
    gender: "Male",
    dob: "12/07/1999",
    otStatus: "N/A",
    otRate: 0,
    workingStatus: "Working",
    employmentStatus: "Probation",
    perVil: "Bhola",
    acStatus: "Active",
    conversionStatus: "Pending"
  },
  {
    empId: "2024091802",
    name: "Md. Anik Islam",
    jobTitle: "Business Analyst",
    department: "Business Innovation",
    joiningDate: "01/06/2024",
    defaultHoliday: "Friday",
    bloodGroup: "O (+ve)",
    basic: 47400.00,
    gross: 79000.00,
    email: "anik@pakizasoftware.com",
    phone: "01711223344",
    gender: "Male",
    dob: "25/08/1998",
    otStatus: "Active",
    otRate: 150,
    workingStatus: "Working",
    employmentStatus: "Permanent",
    confirmationDate: "01/09/2024",
    perVil: "Dhaka",
    acStatus: "Active",
    conversionStatus: "Approved"
  },
  {
    empId: "2025110293",
    name: "Riazul Islam",
    jobTitle: "HR Officer",
    department: "Operations & HR",
    joiningDate: "01/11/2025",
    defaultHoliday: "Friday",
    bloodGroup: "A (+ve)",
    basic: 27000.00,
    gross: 45000.00,
    email: "riazul@pakizasoftware.com",
    phone: "01899887766",
    gender: "Male",
    dob: "14/02/1996",
    otStatus: "N/A",
    otRate: 0,
    workingStatus: "Working",
    employmentStatus: "Probation",
    perVil: "Barishal",
    acStatus: "Active",
    conversionStatus: "Pending"
  }
];

function PersonnelApprovalPage() {
  const [activeTab, setActiveTab] = useState<"candidates" | "status">("candidates");

  const [candidates, setCandidates] = useState<PendingCandidate[]>(initialCandidates);
  const [employees, setEmployees] = useState<EmployeeStatusRecord[]>(initialEmployees);

  const [selectedCandidateRows, setSelectedCandidateRows] = useState<string[]>([]);
  const [selectedEmployeeRows, setSelectedEmployeeRows] = useState<string[]>([]);

  // Filters
  const [department, setDepartment] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState<string>("Pending");
  const [globalSearch, setGlobalSearch] = useState("");

  const departmentOptions = [
    { value: "All Departments", label: "All Departments" },
    { value: "Business Innovation", label: "Business Innovation" },
    { value: "Operations & HR", label: "Operations & HR" }
  ];

  // Stats
  const totalCount = activeTab === "candidates" ? candidates.length : employees.length;
  const pendingCount = activeTab === "candidates" 
    ? candidates.filter(c => c.status === "Pending Approval").length
    : employees.filter(e => e.conversionStatus === "Pending").length;
  const approvedCount = activeTab === "candidates"
    ? candidates.filter(c => c.status === "Approved").length
    : employees.filter(e => e.conversionStatus === "Approved").length;
  const rejectedCount = activeTab === "candidates"
    ? candidates.filter(c => c.status === "Rejected").length
    : employees.filter(e => e.conversionStatus === "Rejected").length;

  const filteredCandidates = candidates.filter(c => {
    if (statusFilter !== "All") {
      if (statusFilter === "Pending" && c.status !== "Pending Approval") return false;
      if (statusFilter === "Approved" && c.status !== "Approved") return false;
      if (statusFilter === "Rejected" && c.status !== "Rejected") return false;
    }
    if (department !== "All Departments" && c.department !== department) return false;
    if (globalSearch) {
      const q = globalSearch.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.jobTitle.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredEmployees = employees.filter(e => {
    if (statusFilter !== "All") {
      if (statusFilter === "Pending" && e.conversionStatus !== "Pending") return false;
      if (statusFilter === "Approved" && e.conversionStatus !== "Approved") return false;
      if (statusFilter === "Rejected" && e.conversionStatus !== "Rejected") return false;
    }
    if (department !== "All Departments" && e.department !== department) return false;
    if (globalSearch) {
      const q = globalSearch.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.empId.toLowerCase().includes(q) || e.jobTitle.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeTab === "candidates") {
      if (e.target.checked) {
        setSelectedCandidateRows(filteredCandidates.map(c => c.id));
      } else {
        setSelectedCandidateRows([]);
      }
    } else {
      if (e.target.checked) {
        setSelectedEmployeeRows(filteredEmployees.map(e => e.empId));
      } else {
        setSelectedEmployeeRows([]);
      }
    }
  };

  const handleSelectRow = (id: string) => {
    if (activeTab === "candidates") {
      setSelectedCandidateRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    } else {
      setSelectedEmployeeRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    }
  };

  const handleBulkApprove = () => {
    if (activeTab === "candidates") {
      setCandidates(prev => prev.map(c => selectedCandidateRows.includes(c.id) ? { ...c, status: "Approved", approvedEmpId: "20261011" } : c));
      setSelectedCandidateRows([]);
    } else {
      setEmployees(prev => prev.map(e => selectedEmployeeRows.includes(e.empId) ? { ...e, conversionStatus: "Approved", employmentStatus: "Permanent" } : e));
      setSelectedEmployeeRows([]);
    }
  };

  const handleBulkReject = () => {
    if (activeTab === "candidates") {
      setCandidates(prev => prev.map(c => selectedCandidateRows.includes(c.id) ? { ...c, status: "Rejected", rejectionReason: "Bulk Rejected" } : c));
      setSelectedCandidateRows([]);
    } else {
      setEmployees(prev => prev.map(e => selectedEmployeeRows.includes(e.empId) ? { ...e, conversionStatus: "Rejected", conversionNotes: "Bulk Rejected" } : e));
      setSelectedEmployeeRows([]);
    }
  };

  return (
    <div className="h-screen flex bg-[#f1f5f9] dark:bg-[#0b0f19] text-[#334155] dark:text-slate-200 overflow-hidden font-sans antialiased tracking-tight">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 flex flex-col p-4 xl:p-6 gap-3.5 overflow-hidden bg-slate-50/50 dark:bg-slate-950/10">
          {/* Header Block */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <Link to="/" className="hover:text-[#2563eb] transition-colors">Home</Link>
                <ChevronRight className="size-2" />
                <span className="hover:text-[#2563eb] transition-colors">Personnel Info</span>
                <ChevronRight className="size-2" />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">Approval Portal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  Personnel Approvals
                </h1>
              </div>
            </div>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-inner">
              <button
                onClick={() => { setActiveTab("candidates"); setSelectedCandidateRows([]); }}
                className={`px-4 py-1.5 text-[10px] font-bold rounded transition-all uppercase tracking-wider flex items-center gap-1.5 ${activeTab === "candidates"
                  ? "bg-white dark:bg-slate-600 text-[#2563eb] shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                <UserCheck className="size-3.5" />
                New Hires
              </button>
              <button
                onClick={() => { setActiveTab("status"); setSelectedEmployeeRows([]); }}
                className={`px-4 py-1.5 text-[10px] font-bold rounded transition-all uppercase tracking-wider flex items-center gap-1.5 ${activeTab === "status"
                  ? "bg-white dark:bg-slate-600 text-[#2563eb] shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                <ArrowRightLeft className="size-3.5" />
                Status Conversions
              </button>
            </div>
          </div>

          {/* KPI Dashboard Summary Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700">
                <FolderOpen className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Queue</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{totalCount} Requests</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-800">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Approved</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{approvedCount} Requests</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-100 dark:border-amber-800">
                <Clock className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{pendingCount} Requests</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 border border-rose-100 dark:border-rose-800">
                <XCircle className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Rejected</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{rejectedCount} Requests</h3>
              </div>
            </div>
          </div>

          {/* Smart Filters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm shrink-0 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5 gap-y-2.5">
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Department</label>
                <SearchableSelect
                  value={department}
                  onChange={setDepartment}
                  options={departmentOptions}
                  className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-inner">
                {(["All", "Approved", "Pending", "Rejected"] as const).map(filter => {
                  const isActive = statusFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded transition-all uppercase tracking-wider ${isActive
                          ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2 size-3 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={e => setGlobalSearch(e.target.value)}
                  placeholder="Quick Search..."
                  className="h-7.5 pl-8 pr-3 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Action Toolbar & Requisitions List Table Card */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden flex flex-col min-h-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
              <div className="flex items-center gap-1.5">
                <button className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm">
                  <TableIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" /> EXCEL
                </button>
                <button className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm">
                  <Printer className="size-3.5 text-slate-500 dark:text-slate-400" /> PRINT
                </button>
              </div>
            </div>

            {/* Bulk Action Bar - Sticky */}
            {((activeTab === "candidates" && selectedCandidateRows.length > 0) || (activeTab === "status" && selectedEmployeeRows.length > 0)) && (
              <div className="p-3 bg-[#2563eb]/5 border-b border-[#2563eb]/10 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-[#2563eb]/20 text-[#2563eb] hover:bg-[#2563eb]/20">
                    {activeTab === "candidates" ? selectedCandidateRows.length : selectedEmployeeRows.length} Selected
                  </Badge>
                  <span className="text-[11px] font-medium text-slate-500">entries ready for action</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleBulkReject} className="h-7.5 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all">
                    <XCircle className="size-3.5" /> Reject Selected
                  </button>
                  <button onClick={handleBulkApprove} className="h-7.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all">
                    <CheckCircle2 className="size.3.5" /> Approve Selected
                  </button>
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
                  <tr className="bg-slate-50 dark:bg-slate-950">
                    <th className="px-5 py-3 w-10">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]" 
                        onChange={handleSelectAll}
                        checked={activeTab === "candidates" 
                          ? selectedCandidateRows.length === filteredCandidates.length && filteredCandidates.length > 0
                          : selectedEmployeeRows.length === filteredEmployees.length && filteredEmployees.length > 0}
                      />
                    </th>
                    {activeTab === "candidates" ? (
                      <>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">App ID</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Candidate Name</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Department</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Proposed Title</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Joining Date</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Gross Salary</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Status</th>
                      </>
                    ) : (
                      <>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Emp ID</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Employee Name</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Department</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Job Title</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Type</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Confirmation Date</th>
                        <th className="px-5 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Working Status</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {activeTab === "candidates" ? filteredCandidates.map(row => (
                    <tr key={row.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selectedCandidateRows.includes(row.id) ? 'bg-[#2563eb]/5 dark:bg-[#2563eb]/10' : ''}`}>
                      <td className="px-5 py-2">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]" 
                          checked={selectedCandidateRows.includes(row.id)}
                          onChange={() => handleSelectRow(row.id)}
                        />
                      </td>
                      <td className="px-5 py-2 font-mono text-slate-500">{row.id}</td>
                      <td className="px-5 py-2 font-bold text-slate-800 dark:text-slate-100">{row.name}</td>
                      <td className="px-5 py-2 text-slate-500">{row.department}</td>
                      <td className="px-5 py-2 text-slate-600">{row.jobTitle}</td>
                      <td className="px-5 py-2 font-mono text-slate-500">{row.joiningDate}</td>
                      <td className="px-5 py-2 text-right font-bold text-[#2563eb]">{row.grossSalary.toLocaleString()} BDT</td>
                      <td className="px-5 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded-xl text-[8.5px] font-extrabold uppercase border ${row.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : row.status === "Rejected"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  )) : filteredEmployees.map(row => (
                    <tr key={row.empId} className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selectedEmployeeRows.includes(row.empId) ? 'bg-[#2563eb]/5 dark:bg-[#2563eb]/10' : ''}`}>
                      <td className="px-5 py-2">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]" 
                          checked={selectedEmployeeRows.includes(row.empId)}
                          onChange={() => handleSelectRow(row.empId)}
                        />
                      </td>
                      <td className="px-5 py-2 font-mono text-slate-500">{row.empId}</td>
                      <td className="px-5 py-2 font-bold text-slate-800 dark:text-slate-100">{row.name}</td>
                      <td className="px-5 py-2 text-slate-500">{row.department}</td>
                      <td className="px-5 py-2 text-slate-600">{row.jobTitle}</td>
                      <td className="px-5 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded-xl text-[8.5px] font-extrabold uppercase border ${row.employmentStatus === "Permanent"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}>
                          {row.employmentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-2 font-mono text-center text-slate-500">{row.confirmationDate || "—"}</td>
                      <td className="px-5 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded-xl text-[8.5px] font-extrabold uppercase border ${row.workingStatus === "Working"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>
                          {row.workingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {((activeTab === "candidates" && filteredCandidates.length === 0) || (activeTab === "status" && filteredEmployees.length === 0)) && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 dark:text-slate-500 font-bold">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div>Showing 1 to {activeTab === "candidates" ? filteredCandidates.length : filteredEmployees.length} entries</div>
              <div className="flex items-center gap-1.5">
                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-700 transition-colors" disabled>Previous</button>
                <button className="size-5.5 rounded bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-sm text-[9.5px]">1</button>
                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-700 transition-colors" disabled>Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

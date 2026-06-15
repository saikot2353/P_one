import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, Search, FileSpreadsheet, Printer, FileDown, CalendarDays, Info, ShieldCheck, MapPin, Building, Plus
} from "lucide-react";

export const Route = createFileRoute("/leave-list")({
  head: () => ({
    meta: [
      { title: "Leave List Database — CRIPTON" },
      { name: "description", content: "Comprehensive query-based historical database of all corporate employee leave records." },
    ],
  }),
  component: LeaveListPage,
});

interface LeaveRecordRow {
  sl: number;
  empId: string;
  empName: string;
  company: string;
  department: string;
  designation: string;
  type: string;
  startDate: string;
  endDate: string;
  purpose: string;
  totalDays: number;
  status: "Approved" | "Pending" | "Rejected";
}

const mockLeaveRecords: LeaveRecordRow[] = [
  {
    sl: 1,
    empId: "2021032646",
    empName: "Sadiqul Islam",
    company: "Pakiza Software Limited",
    department: "Core Sales",
    designation: "Deputy Manager",
    type: "CL",
    startDate: "30/05/2026",
    endDate: "30/05/2026",
    purpose: "",
    totalDays: 1,
    status: "Approved"
  },
  {
    sl: 2,
    empId: "2021032646",
    empName: "Sadiqul Islam",
    company: "Pakiza Software Limited",
    department: "Core Sales",
    designation: "Deputy Manager",
    type: "CL",
    startDate: "21/05/2026",
    endDate: "21/05/2026",
    purpose: "",
    totalDays: 1,
    status: "Approved"
  },
  {
    sl: 3,
    empId: "2021032646",
    empName: "Sadiqul Islam",
    company: "Pakiza Software Limited",
    department: "Core Sales",
    designation: "Deputy Manager",
    type: "CL",
    startDate: "16/05/2026",
    endDate: "16/05/2026",
    purpose: "",
    totalDays: 1,
    status: "Approved"
  },
  {
    sl: 4,
    empId: "2022035599",
    empName: "Dipon Saha",
    company: "Pakiza Software Limited",
    department: "Core Development (HR)",
    designation: "Manager",
    type: "CL",
    startDate: "06/05/2026",
    endDate: "07/05/2026",
    purpose: "",
    totalDays: 2,
    status: "Approved"
  }
];

function LeaveListPage() {
  // Query States
  const [region, setRegion] = useState("PSL-Operation");
  const [empType, setEmpType] = useState("ALL");
  const [subDept, setSubDept] = useState("ALL");
  const [jobTitle, setJobTitle] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [fromDate, setFromDate] = useState("2026-05-01");
  const [toDate, setToDate] = useState("2026-05-31");
  const [leaveType, setLeaveType] = useState("ALL");
  const [status, setStatus] = useState("Approved");
  const [empIdMulti, setEmpIdMulti] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  // Filter Trigger
  const [appliedFilters, setAppliedFilters] = useState({
    region: "PSL-Operation",
    empType: "ALL",
    subDept: "ALL",
    jobTitle: "ALL",
    unit: "ALL",
    line: "ALL",
    fromDate: "2026-05-01",
    toDate: "2026-05-31",
    leaveType: "ALL",
    status: "Approved",
    empIdMulti: ""
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      region,
      empType,
      subDept,
      jobTitle,
      unit,
      line,
      fromDate,
      toDate,
      leaveType,
      status,
      empIdMulti
    });
  };

  // Filter & Search computation
  const filteredRecords = useMemo(() => {
    return mockLeaveRecords.filter(r => {
      // 1. Status Filter
      if (appliedFilters.status !== "ALL" && r.status !== appliedFilters.status) return false;

      // 2. Leave Type Filter
      if (appliedFilters.leaveType !== "ALL" && r.type !== appliedFilters.leaveType) return false;

      // 3. Comma-separated Multi IDs Lookups
      if (appliedFilters.empIdMulti.trim()) {
        const ids = appliedFilters.empIdMulti.split(",").map(i => i.trim());
        if (!ids.includes(r.empId)) return false;
      }

      // 4. Text Search Box matches Name, Dept, Company, Id, Designation
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.empId.toLowerCase().includes(q) ||
          r.empName.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [appliedFilters, searchQuery]);

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0f172a] text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">

          {/* Breadcrumb and Page Header */}
          <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>Leave Management</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-extrabold">Leave List</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <CalendarDays className="size-6 text-primary animate-pulse" />
                <span>Leave List</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/leave-application"
                className="h-10 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md transition flex items-center gap-2 uppercase tracking-wider"
              >
                <Plus className="size-4 text-white" />
                <span>Apply for Leave</span>
              </Link>
              <div className="text-[10px] font-extrabold uppercase bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 select-none">
                Session Calendar: 2026
              </div>
            </div>
          </div>

          {/* Multi-parameter Query Search Filter Panel */}
          <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-4 text-xs font-bold">

              {/* Region */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                >
                  <option value="PSL-Operation">PSL-Operation</option>
                  <option value="PSL-HeadOffice">PSL-HeadOffice</option>
                </select>
              </div>

              {/* Employee Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Employee Type</label>
                <select
                  value={empType}
                  onChange={(e) => setEmpType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                >
                  <option value="ALL">ALL</option>
                  <option value="Staff">Staff</option>
                  <option value="Worker">Worker</option>
                </select>
              </div>

              {/* Sub Department */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Sub Department</label>
                <select
                  value={subDept}
                  onChange={(e) => setSubDept(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                >
                  <option value="ALL">ALL</option>
                  <option value="Core Sales">Core Sales</option>
                  <option value="Core Development (HR)">Core Development (HR)</option>
                </select>
              </div>

              {/* Job Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Job Title</label>
                <select
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                >
                  <option value="ALL">ALL</option>
                  <option value="Manager">Manager</option>
                  <option value="Deputy Manager">Deputy Manager</option>
                </select>
              </div>

              {/* Unit */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                >
                  <option value="ALL">ALL</option>
                  <option value="Unit 1">Unit 1</option>
                  <option value="Unit 2">Unit 2</option>
                </select>
              </div>

              {/* Line */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Line</label>
                <select
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                >
                  <option value="ALL">ALL</option>
                  <option value="Line 1">Line 1</option>
                  <option value="Line 2">Line 2</option>
                </select>
              </div>

              {/* From Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                />
              </div>

              {/* To Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                />
              </div>

              {/* Leave Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                >
                  <option value="ALL">ALL</option>
                  <option value="CL">Casual Leave (CL)</option>
                  <option value="SL">Sick Leave (SL)</option>
                  <option value="EL">Earned Leave (EL)</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                  <option value="ALL">ALL Statuses</option>
                </select>
              </div>

              {/* Emp ID Multi */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] text-slate-400 uppercase">EmpId (Multi with comma)</label>
                <input
                  type="text"
                  value={empIdMulti}
                  onChange={(e) => setEmpIdMulti(e.target.value)}
                  placeholder="use comma as separator"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition font-mono placeholder:italic"
                />
              </div>

              {/* Search Submit Bar */}
              <div className="md:col-span-3 lg:col-span-4 flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/40">
                <button
                  type="submit"
                  className="h-10 px-10 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-xl shadow-xs transition uppercase tracking-wider"
                >
                  Search
                </button>
              </div>

            </form>
          </div>

          {/* Action Row & Utility Controls */}
          <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              {/* Spreadsheet download utilities */}
              <div className="flex items-center gap-1.5">
                <button className="h-8.5 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-extrabold text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition">
                  <FileSpreadsheet className="size-3.5 text-emerald-500" />
                  <span>EXCEL</span>
                </button>
                <button className="h-8.5 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-extrabold text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition">
                  <Printer className="size-3.5 text-blue-500" />
                  <span>PRINT</span>
                </button>
                <button className="h-8.5 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-extrabold text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition">
                  <FileDown className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Grid Search query box */}
              <div className="relative">
                <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search database..."
                  className="h-8.5 pl-9 pr-3 w-full sm:w-48 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-primary transition"
                />
              </div>

            </div>

            {/* Pink/Rose Grid Data Sheet */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <table className="w-full border-collapse text-[11px] text-left">
                <thead>
                  <tr className="bg-[#ffebee] dark:bg-rose-950/20 text-slate-800 dark:text-rose-200 font-black border-b border-slate-200 dark:border-slate-800/80 whitespace-nowrap select-none">
                    <th className="px-4 py-3 text-center w-12 border-r border-slate-200/50 dark:border-slate-800/30">SL</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Id</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Name</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Company</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Department</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Designation</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">Type</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">Start Date</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">End Date</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Purpose</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center w-16">Total(D)</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRecords.map((row, idx) => {
                    let statusColor = "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400";
                    if (row.status === "Approved") {
                      statusColor = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400";
                    } else if (row.status === "Rejected") {
                      statusColor = "bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400";
                    }

                    return (
                      <tr key={row.sl} className="hover:bg-slate-50/55 dark:hover:bg-slate-900/40 transition duration-75 whitespace-nowrap">
                        <td className="px-4 py-3 text-center font-bold text-slate-400 border-r border-slate-100 dark:border-slate-800/50">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">{row.empId}</td>
                        <td className="px-4 py-3 font-extrabold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/50">{row.empName}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50">{row.company}</td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">{row.department}</td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">{row.designation}</td>
                        <td className="px-4 py-3 text-center font-extrabold text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800/50">{row.type}</td>
                        <td className="px-4 py-3 text-center font-mono text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50">{row.startDate}</td>
                        <td className="px-4 py-3 text-center font-mono text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50">{row.endDate}</td>
                        <td className="px-4 py-3 text-slate-500 max-w-[120px] truncate border-r border-slate-100 dark:border-slate-800/50" title={row.purpose}>
                          {row.purpose || "—"}
                        </td>
                        <td className="px-4 py-3 text-center font-black text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/50">{row.totalDays}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase ${statusColor}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={12} className="px-4 py-16 text-center text-slate-400 font-bold">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Info className="size-6 text-slate-300 animate-bounce" />
                          <span>No leave history records found.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/40">
              <span className="text-[10.5px] font-bold text-slate-400">
                Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries
              </span>

              <div className="flex items-center gap-1.5 select-none text-[10.5px] font-bold">
                <button className="px-3.5 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 cursor-not-allowed">
                  Previous
                </button>
                <button className="size-8 rounded-lg bg-primary text-white flex items-center justify-center font-black">
                  1
                </button>
                <button className="px-3.5 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

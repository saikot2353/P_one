import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, ArrowLeft, Search, FileSpreadsheet, Printer, FileDown, CheckCircle2, XCircle, Info, Check, X
} from "lucide-react";

export const Route = createFileRoute("/leave-approve")({
  head: () => ({
    meta: [
      { title: "Leave Approvals — CRIPTON" },
      { name: "description", content: "Review, search, and bulk approve or reject employee leave applications." },
    ],
  }),
  component: LeaveApprovePage,
});

interface LeaveApplicationRow {
  id: string;
  empId: string;
  empName: string;
  company: string;
  department: string;
  designation: string;
  type: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: "Approved" | "Pending" | "Rejected";
}

const initialRows: LeaveApplicationRow[] = [
  {
    id: "LA-001",
    empId: "2021032646",
    empName: "Sadiqul Islam",
    company: "Pakiza Software Limited",
    department: "Core Sales",
    designation: "Deputy Manager",
    type: "CL",
    startDate: "30/05/2026",
    endDate: "30/05/2026",
    purpose: "",
    status: "Approved"
  },
  {
    id: "LA-002",
    empId: "2021032646",
    empName: "Sadiqul Islam",
    company: "Pakiza Software Limited",
    department: "Core Sales",
    designation: "Deputy Manager",
    type: "CL",
    startDate: "21/05/2026",
    endDate: "21/05/2026",
    purpose: "",
    status: "Approved"
  },
  {
    id: "LA-003",
    empId: "2021032646",
    empName: "Sadiqul Islam",
    company: "Pakiza Software Limited",
    department: "Core Sales",
    designation: "Deputy Manager",
    type: "CL",
    startDate: "16/05/2026",
    endDate: "16/05/2026",
    purpose: "",
    status: "Approved"
  },
  {
    id: "LA-004",
    empId: "2022035599",
    empName: "Dipon Saha",
    company: "Pakiza Software Limited",
    department: "Core Development (HR)",
    designation: "Manager",
    type: "CL",
    startDate: "06/05/2026",
    endDate: "07/05/2026",
    purpose: "",
    status: "Approved"
  }
];

function LeaveApprovePage() {
  // Mock Database
  const [rows, setRows] = useState<LeaveApplicationRow[]>(initialRows);

  // Configuration Panel States
  const [region, setRegion] = useState("PSL-Operation");
  const [empType, setEmpType] = useState("ALL");
  const [subDept, setSubDept] = useState("ALL");
  const [jobTitle, setJobTitle] = useState("ALL");
  const [fromDate, setFromDate] = useState("2026-05-01");
  const [toDate, setToDate] = useState("2026-05-31");
  const [stateFilter, setStateFilter] = useState("Approved");
  const [empIdMulti, setEmpIdMulti] = useState("");

  // Grid Query Search
  const [searchQuery, setSearchQuery] = useState("");

  // Applied Filter States (Only update when clicking SEARCH)
  const [appliedFilters, setAppliedFilters] = useState({
    region: "PSL-Operation",
    empType: "ALL",
    subDept: "ALL",
    jobTitle: "ALL",
    fromDate: "2026-05-01",
    toDate: "2026-05-31",
    stateFilter: "Approved",
    empIdMulti: ""
  });

  // Table Row Checkboxes Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(["LA-001", "LA-002"]));

  // Handle Search Trigger
  const handleSearchTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      region,
      empType,
      subDept,
      jobTitle,
      fromDate,
      toDate,
      stateFilter,
      empIdMulti
    });
  };

  // Filter & Search Logic
  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      // 1. Dropdown State filter
      if (appliedFilters.stateFilter !== "ALL" && r.status !== appliedFilters.stateFilter) return false;
      
      // 2. Emp ID Multi (comma separated list)
      if (appliedFilters.empIdMulti.trim()) {
        const ids = appliedFilters.empIdMulti.split(",").map(i => i.trim());
        if (!ids.includes(r.empId)) return false;
      }

      // 3. Text query search (matches name, department, designation, id)
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
  }, [rows, appliedFilters, searchQuery]);

  // Bulk Actions
  const handleApproveSelected = () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one leave request!");
      return;
    }
    setRows(prev => prev.map(r => selectedIds.has(r.id) ? { ...r, status: "Approved" } : r));
    alert(`Successfully approved ${selectedIds.size} selected leave requests!`);
  };

  const handleRejectSelected = () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one leave request!");
      return;
    }
    setRows(prev => prev.map(r => selectedIds.has(r.id) ? { ...r, status: "Rejected" } : r));
    alert(`Successfully rejected ${selectedIds.size} selected leave requests!`);
  };

  // Toggle Single Selection
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle Select All
  const isAllSelected = filteredRows.length > 0 && filteredRows.every(r => selectedIds.has(r.id));
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredRows.forEach(r => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredRows.forEach(r => next.add(r.id));
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0f172a] text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">

          {/* Title Bar containing the back arrow */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="size-2.5" />
              <span>Human Resource</span>
              <ChevronRight className="size-2.5" />
              <span className="text-primary font-semibold">Leave Approve</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-slate-600 dark:text-slate-400"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Leave Approve
              </h1>
            </div>
          </div>

          {/* Parameters / Configuration Form Panel */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
            <form onSubmit={handleSearchTrigger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4 text-xs font-bold">
              
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

              {/* State (Approved, Pending, Rejected, ALL) */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">State</label>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                  <option value="ALL">ALL Statuses</option>
                </select>
              </div>

              {/* Emp ID Multi */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">EmpId Multi with comma</label>
                <input
                  type="text"
                  value={empIdMulti}
                  onChange={(e) => setEmpIdMulti(e.target.value)}
                  placeholder="e.g. 2021032646, 2022035599"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition font-mono"
                />
              </div>

              {/* Search button aligned on the right */}
              <div className="lg:col-span-4 flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/40">
                <button
                  type="submit"
                  className="h-10 px-10 bg-primary hover:bg-primary-glow text-primary-foreground font-semibold text-xs rounded-xl shadow-xs transition uppercase tracking-wider shadow-sm"
                >
                  Search
                </button>
              </div>

            </form>
          </div>

          {/* Action Row & Utility Controls */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              
              {/* Approve / Reject buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleApproveSelected}
                  className="h-8 pl-2 pr-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.97] text-white font-semibold text-[10px] rounded-lg shadow-xs flex items-center gap-2 transition-all duration-200 uppercase tracking-wider border border-emerald-500/10"
                >
                  <span className="p-0.5 bg-white/20 rounded-md text-white shadow-3xs flex items-center justify-center">
                    <Check className="size-3" />
                  </span>
                  <span>Approve Selected</span>
                </button>
                
                <button
                  onClick={handleRejectSelected}
                  className="h-8 pl-2 pr-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 active:scale-[0.97] text-white font-semibold text-[10px] rounded-lg shadow-xs flex items-center gap-2 transition-all duration-200 uppercase tracking-wider border border-rose-500/10"
                >
                  <span className="p-0.5 bg-white/20 rounded-md text-white shadow-3xs flex items-center justify-center">
                    <X className="size-3" />
                  </span>
                  <span>Reject Selected</span>
                </button>
              </div>

              {/* Spreadsheet download utilities & Grid Search input */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                
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

                <div className="relative">
                  <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search query..."
                    className="h-8.5 pl-9 pr-3 w-full sm:w-48 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-primary transition"
                  />
                </div>

              </div>

            </div>

            {/* Custom styled peach-rose table grid */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <table className="w-full border-collapse text-[11px] text-left">
                <thead>
                  <tr className="bg-[#ffebee] dark:bg-rose-950/20 text-slate-800 dark:text-rose-200 font-black border-b border-slate-200 dark:border-slate-800/80 whitespace-nowrap select-none">
                    <th className="px-4 py-3 text-center w-12 border-r border-slate-200/50 dark:border-slate-800/30">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-primary focus:ring-primary size-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Emp Id</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Emp Name</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Company</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Department</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Designation</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">Type</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">Start Date</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">End Date</th>
                    <th className="px-4 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Purpose</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRows.map((row) => {
                    const isSelected = selectedIds.has(row.id);
                    
                    let statusBadge = "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400";
                    if (row.status === "Approved") {
                      statusBadge = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400";
                    } else if (row.status === "Rejected") {
                      statusBadge = "bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400";
                    }

                    return (
                      <tr key={row.id} className="hover:bg-slate-50/55 dark:hover:bg-slate-900/40 transition duration-75 whitespace-nowrap">
                        <td className="px-4 py-3 text-center border-r border-slate-100 dark:border-slate-800/50">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(row.id)}
                            className="rounded border-slate-300 text-primary focus:ring-primary size-3.5 cursor-pointer"
                          />
                        </td>
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
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase ${statusBadge}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={11} className="px-4 py-16 text-center text-slate-400 font-bold">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Info className="size-6 text-slate-300" />
                          <span>No leave requests found matching parameters.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Custom Pagination indicators */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/40">
              <span className="text-[10.5px] font-bold text-slate-400">
                Showing 1 to {filteredRows.length} of {filteredRows.length} entries
              </span>

              <div className="flex items-center gap-1.5 select-none text-[10.5px] font-bold">
                <button className="px-3.5 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 cursor-not-allowed">
                  Previous
                </button>
                <button className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black">
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

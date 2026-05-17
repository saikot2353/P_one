import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, Search, FileSpreadsheet, Printer, FileDown, CalendarDays, Coins, CheckCircle2, ShieldAlert
} from "lucide-react";

export const Route = createFileRoute("/earn-leave-process")({
  head: () => ({
    meta: [
      { title: "Earn Leave Process — CRIPTON" },
      { name: "description", content: "Accrue, calculate, scale, and process cash compensation for employee earned leaves." },
    ],
  }),
  component: EarnLeaveProcessPage,
});

interface EarnLeaveRecord {
  sl: number;
  empId: string;
  empName: string;
  type: string;
  department: string;
  designation: string;
  joinDate: string;
  gross: number;
  presentDays: number;
  earnedDays: number;
  takenEl: number;
  earnedDaysCf: number;
  cashPay: number;
}

const initialRecords: EarnLeaveRecord[] = [
  {
    sl: 1,
    empId: "2023043910",
    empName: "Tahmid Afsar",
    type: "Office Executive",
    department: "Project Resource & Strategy",
    designation: "Asst. Manager",
    joinDate: "01/08/2023",
    gross: 52000.00,
    presentDays: 79,
    earnedDays: 4.39,
    takenEl: 0,
    earnedDaysCf: 0.00,
    cashPay: 0
  },
  {
    sl: 2,
    empId: "2022035599",
    empName: "Dipon Saha",
    type: "Staff / Full-Time",
    department: "Core Development (HR)",
    designation: "Senior Software Engineer",
    joinDate: "01/01/2022",
    gross: 78000.00,
    presentDays: 85,
    earnedDays: 5.60,
    takenEl: 1,
    earnedDaysCf: 1.50,
    cashPay: 0
  }
];

function EarnLeaveProcessPage() {
  // Database States
  const [records, setRecords] = useState<EarnLeaveRecord[]>(initialRecords);

  // Configuration Panel States
  const [year, setYear] = useState("2026");
  const [currentDate, setCurrentDate] = useState("2026-05-17");
  const [statusFilter, setStatusFilter] = useState("Working");
  const [percentInput, setPercentInput] = useState("100");
  const [empType, setEmpType] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [empIdFilter, setEmpIdFilter] = useState("2023043910");

  const [searchQuery, setSearchQuery] = useState("");

  // Filter Trigger
  const [appliedFilters, setAppliedFilters] = useState({
    year: "2026",
    currentDate: "2026-05-17",
    statusFilter: "Working",
    percentInput: "100",
    empType: "ALL",
    section: "ALL",
    unit: "ALL",
    empIdFilter: "2023043910"
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      year,
      currentDate,
      statusFilter,
      percentInput,
      empType,
      section,
      unit,
      empIdFilter
    });
  };

  // Real-time calculated table rows
  const computedRows = useMemo(() => {
    const scalePercent = parseFloat(appliedFilters.percentInput) || 100;

    return records.filter(r => {
      // 1. Employee ID Filter (matches if specific ID is typed)
      if (appliedFilters.empIdFilter.trim() && r.empId !== appliedFilters.empIdFilter.trim()) {
        return false;
      }

      // 2. Text Search Query Box (matches Name, Department, Designation)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.empId.toLowerCase().includes(q) ||
          r.empName.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q)
        );
      }

      return true;
    }).map((r, index) => {
      // Per Day Amount = Gross / 30 (Rounded to 2 decimal places)
      const perDayAmount = Math.round((r.gross / 30) * 100) / 100;
      
      // Total EL = Earned Days + Earned Days CF - Taken EL
      const totalEl = Math.round((r.earnedDays + r.earnedDaysCf - r.takenEl) * 100) / 100;
      
      // Raw Total Amount = Total EL * Per Day Amount
      const rawTotalAmount = Math.round((totalEl * perDayAmount) * 100) / 100;
      
      // Pay Day = Total EL * (scalePercent / 100)
      const payDay = Math.round((totalEl * (scalePercent / 100)) * 100) / 100;
      
      // Net Pay = Pay Day * Per Day Amount (Rounded to integer as shown in screenshot)
      const netPay = Math.round(payDay * perDayAmount);

      return {
        ...r,
        displaySl: index + 1,
        perDayAmount,
        totalEl,
        totalAmount: rawTotalAmount,
        percent: scalePercent,
        payDay,
        netPay
      };
    });
  }, [records, appliedFilters, searchQuery]);

  // Success Confirmation trigger
  const [processingStatus, setProcessingStatus] = useState("");

  const handleProcessSubmit = () => {
    setProcessingStatus(`Earn Leave Process executed! Calculated ledger processed successfully for ${computedRows.length} employee profiles.`);
    setTimeout(() => {
      setProcessingStatus("");
    }, 6000);
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0f172a] text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">

          {/* Breadcrumb and Header */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>Leave Management</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-extrabold">Earn Leave Process</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Coins className="size-6 text-primary animate-pulse" />
                <span>Earn Leave Process</span>
              </h1>
            </div>
            
            <div className="text-[10px] font-extrabold uppercase bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 select-none">
              Fiscal Cycle: {year}
            </div>
          </div>

          {/* Success Banner */}
          {processingStatus && (
            <div className="bg-emerald-500/10 border-2 border-emerald-500/25 p-4 rounded-xl text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center gap-3 animate-in slide-in-from-top duration-300 shadow-xs">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-500 animate-bounce" />
              <span>{processingStatus}</span>
            </div>
          )}

          {/* Configuration Form Panel */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-4 text-xs font-bold">
              
              {/* Year */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              {/* Current Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Current Date</label>
                <input
                  type="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                >
                  <option value="Working">Working</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>

              {/* Percent(%) */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Percent(%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={percentInput}
                  onChange={(e) => setPercentInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition font-mono"
                />
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

              {/* Section */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                >
                  <option value="ALL">ALL</option>
                  <option value="Finance & Accounts">Finance & Accounts</option>
                  <option value="Project Resource & Strategy">Project Resource & Strategy</option>
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
                  <option value="Head Office">Head Office</option>
                </select>
              </div>

              {/* Emp ID */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
                  <span>EmpID</span>
                  <span className="text-[8px] text-slate-400 font-semibold lowercase italic">(Empty for ALL)</span>
                </label>
                <input
                  type="text"
                  value={empIdFilter}
                  onChange={(e) => setEmpIdFilter(e.target.value)}
                  placeholder="e.g. 2023043910"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition font-mono"
                />
              </div>

              {/* Search Trigger */}
              <div className="md:col-span-3 lg:col-span-4 flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/40">
                <button
                  type="submit"
                  className="h-10 px-10 bg-[#4caf50] hover:bg-[#43a047] text-white font-extrabold text-xs rounded-xl shadow-xs transition uppercase tracking-wider"
                >
                  Search
                </button>
              </div>

            </form>
          </div>

          {/* Action Row & Utility Controls */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              
              {/* Spreadsheet export buttons */}
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
                  placeholder="Search current grid..."
                  className="h-8.5 pl-9 pr-3 w-full sm:w-48 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-primary transition"
                />
              </div>

            </div>

            {/* Custom pink-rose table grid sheet */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <table className="w-full border-collapse text-[10.5px] text-left">
                <thead>
                  <tr className="bg-[#ffebee] dark:bg-rose-950/20 text-slate-800 dark:text-rose-200 font-black border-b border-slate-200 dark:border-slate-800/80 whitespace-nowrap select-none">
                    <th className="px-3 py-3 text-center w-10 border-r border-slate-200/50 dark:border-slate-800/30">#</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Emp ID</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Name</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Type</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Department</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Designation</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">Join Date</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-right">Gross</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">Present Days</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">Earned Day</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">Taken EL</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">Earned Day(CF)</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">Total EL</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-right">Per Day Amount</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-right">Total Amount</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">Percent(%)</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">Pay Day</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-right">Net Pay</th>
                    <th className="px-3 py-3 text-right">Cash Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {computedRows.map((row) => (
                    <tr key={row.empId} className="hover:bg-slate-50/55 dark:hover:bg-slate-900/40 transition duration-75 whitespace-nowrap">
                      <td className="px-3 py-3 text-center border-r border-slate-100 dark:border-slate-800/50">{row.displaySl}</td>
                      <td className="px-3 py-3 font-mono font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">{row.empId}</td>
                      <td className="px-3 py-3 font-extrabold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/50">{row.empName}</td>
                      <td className="px-3 py-3 text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50">{row.type}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">{row.department}</td>
                      <td className="px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">{row.designation}</td>
                      <td className="px-3 py-3 text-center font-mono text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50">{row.joinDate}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800/50">
                        {row.gross.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-slate-850 dark:text-slate-250 border-r border-slate-100 dark:border-slate-800/50">{row.presentDays}</td>
                      <td className="px-3 py-3 text-center font-mono border-r border-slate-100 dark:border-slate-800/50">{row.earnedDays}</td>
                      <td className="px-3 py-3 text-center font-mono border-r border-slate-100 dark:border-slate-800/50">{row.takenEl}</td>
                      <td className="px-3 py-3 text-center font-mono border-r border-slate-100 dark:border-slate-800/50">{row.earnedDaysCf.toFixed(2)}</td>
                      <td className="px-3 py-3 text-center font-mono font-bold text-primary border-r border-slate-100 dark:border-slate-800/50">{row.totalEl}</td>
                      <td className="px-3 py-3 text-right font-mono border-r border-slate-100 dark:border-slate-800/50">{row.perDayAmount.toFixed(2)}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold border-r border-slate-100 dark:border-slate-800/50">{row.totalAmount.toFixed(2)}</td>
                      <td className="px-3 py-3 text-center font-mono font-bold border-r border-slate-100 dark:border-slate-800/50">{row.percent}%</td>
                      <td className="px-3 py-3 text-center font-mono font-bold border-r border-slate-100 dark:border-slate-800/50">{row.payDay}</td>
                      <td className="px-3 py-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 border-r border-slate-100 dark:border-slate-800/50">
                        {row.netPay}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-slate-500">{row.cashPay}</td>
                    </tr>
                  ))}

                  {computedRows.length === 0 && (
                    <tr>
                      <td colSpan={19} className="px-4 py-16 text-center text-slate-400 font-bold">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <ShieldAlert className="size-6 text-slate-300 animate-bounce" />
                          <span>No earned leave ledger matching active Employee ID filter.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls & Entries summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/40">
              <span className="text-[10.5px] font-bold text-slate-400">
                Showing 1 to {computedRows.length} of {computedRows.length} entries
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

            {/* Submit Action footer */}
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800/45 print:hidden">
              <button
                onClick={handleProcessSubmit}
                className="h-10 px-8 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-xs rounded-xl shadow-md transition uppercase tracking-wider"
              >
                Submit Earned Leave Process
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

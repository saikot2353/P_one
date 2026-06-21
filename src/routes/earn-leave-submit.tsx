import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, Search, FileSpreadsheet, Printer, FileDown, CalendarDays, CheckCircle2, ShieldCheck, HelpCircle, Trash2
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/earn-leave-submit")({
  head: () => ({
    meta: [
      { title: "Earn Leave Submit — CRIPTON" },
      { name: "description", content: "Select processed employee earned leave records, configure disbursement details, and submit for clearance." },
    ],
  }),
  component: EarnLeaveSubmitPage,
});

interface EarnLeaveSubmitRow {
  id: string;
  empId: string;
  empName: string;
  department: string;
  designation: string;
  totalDays: number;
  perDayRate: number;
  netPay: number;
  paymentMode: "Bank" | "Cash" | "bKash" | "Rocket";
  bankName: string;
  accountNo: string;
  status: "Draft" | "Submitted" | "Cleared";
}

const initialSubmitRows: EarnLeaveSubmitRow[] = [
  {
    id: "ELS-001",
    empId: "2023043910",
    empName: "Tahmid Afsar",
    department: "Project Resource & Strategy",
    designation: "Asst. Manager",
    totalDays: 4.39,
    perDayRate: 1733.33,
    netPay: 7609,
    paymentMode: "Bank",
    bankName: "Dutch-Bangla Bank PLC",
    accountNo: "125.120.44391",
    status: "Draft"
  },
  {
    id: "ELS-002",
    empId: "2022035599",
    empName: "Dipon Saha",
    department: "Core Development (HR)",
    designation: "Senior Software Engineer",
    totalDays: 5.60,
    perDayRate: 2600.00,
    netPay: 14560,
    paymentMode: "Bank",
    bankName: "Dutch-Bangla Bank PLC",
    accountNo: "125.120.35599",
    status: "Draft"
  },
  {
    id: "ELS-003",
    empId: "2021032646",
    empName: "Sadiqul Islam",
    department: "Core Sales",
    designation: "Deputy Manager",
    totalDays: 3.00,
    perDayRate: 1100.00,
    netPay: 3300,
    paymentMode: "Cash",
    bankName: "",
    accountNo: "",
    status: "Draft"
  }
];

function EarnLeaveSubmitPage() {
  // Database States
  const [rows, setRows] = useState<EarnLeaveSubmitRow[]>(initialSubmitRows);

  // Configuration Panel States
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("May");
  const [empType, setEmpType] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [empIdFilter, setEmpIdFilter] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  // Checkbox row selections
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(["ELS-001", "ELS-002"]));

  // Filter Trigger state
  const [appliedFilters, setAppliedFilters] = useState({
    year: "2026",
    month: "May",
    empType: "ALL",
    section: "ALL",
    unit: "ALL",
    empIdFilter: ""
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      year,
      month,
      empType,
      section,
      unit,
      empIdFilter
    });
  };

  // Filter & Search calculation
  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      // 1. Employee ID Filter
      if (appliedFilters.empIdFilter.trim() && r.empId !== appliedFilters.empIdFilter.trim()) {
        return false;
      }

      // 2. Text Search Query Box (matches Name, Designation, Department)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.empId.toLowerCase().includes(q) ||
          r.empName.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q) ||
          r.bankName.toLowerCase().includes(q) ||
          r.accountNo.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [rows, appliedFilters, searchQuery]);

  // Handle Select All
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

  // Handle Single Toggle Select
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

  // Handle inline edits (Payment Mode, Bank Name, Account No)
  const handleInlineChange = (id: string, field: keyof EarnLeaveSubmitRow, value: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Success Message
  const [successMessage, setSuccessMessage] = useState("");

  const handleBulkSubmit = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one record to submit!");
      return;
    }
    setRows(prev => prev.map(r => selectedIds.has(r.id) ? { ...r, status: "Submitted" } : r));
    toast.success(`Successfully submitted ${selectedIds.size} processed Earn Leave cash-disbursements for clearance!`);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one record to delete.");
      return;
    }
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected records?`)) return;
    setRows(prev => prev.filter(r => !selectedIds.has(r.id)));
    toast.success(`Deleted ${selectedIds.size} records.`);
    setSelectedIds(new Set());
  };

  const handleSingleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    setRows(prev => prev.filter(r => r.id !== id));
    toast.success("Record deleted successfully.");
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

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
                <span className="text-primary font-extrabold">Earn Leave Submit</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="size-6 text-primary animate-pulse" />
                <span>Earn Leave Submit</span>
              </h1>
            </div>

            <div className="text-[10px] font-extrabold uppercase bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 select-none">
              Fiscal Cycle: {year}
            </div>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="bg-emerald-500/10 border-2 border-emerald-500/25 p-4 rounded-xl text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center gap-3 animate-in slide-in-from-top duration-300 shadow-xs">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-500 animate-bounce" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Configuration Filter Panel */}
          <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-4 text-xs font-bold font-sans">

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

              {/* Month */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                >
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
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
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
                  <span>Employee ID Filter</span>
                  <span className="text-[8px] text-slate-400 font-semibold lowercase italic">(Blank for all ready items)</span>
                </label>
                <input
                  type="text"
                  value={empIdFilter}
                  onChange={(e) => setEmpIdFilter(e.target.value)}
                  placeholder="e.g. 2023043910"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition font-mono"
                />
              </div>

              {/* Search button aligned right */}
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
          <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              {/* Submit Selected & Delete Selected actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBulkSubmit}
                  className="h-9 px-6 bg-[#1e88e5] hover:bg-[#1565c0] text-white font-extrabold text-[10.5px] rounded-lg shadow-xs flex items-center gap-1.5 transition uppercase tracking-wider"
                >
                  <ShieldCheck className="size-4" />
                  <span>Submit Selected</span>
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="h-9 px-6 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-650 active:scale-[0.97] text-white font-extrabold text-[10.5px] rounded-lg shadow-xs flex items-center gap-1.5 transition-all duration-200 uppercase tracking-wider border border-slate-500/10"
                >
                  <Trash2 className="size-4" />
                  <span>Delete Selected</span>
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
                    placeholder="Search ready items..."
                    className="h-8.5 pl-9 pr-3 w-full sm:w-48 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-primary transition"
                  />
                </div>

              </div>

            </div>

            {/* Pink-Rose table sheet grid */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <table className="w-full border-collapse text-[10.5px] text-left">
                <thead>
                  <tr className="bg-[#ffebee] dark:bg-rose-950/20 text-slate-800 dark:text-rose-200 font-black border-b border-slate-200 dark:border-slate-800/80 whitespace-nowrap select-none">
                    <th className="px-3 py-3 text-center w-10 border-r border-slate-200/50 dark:border-slate-800/30">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-primary focus:ring-primary size-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Emp ID</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Name</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Department</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">Designation</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">Earned Days</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-right">Per Day Rate</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-right">Net Pay</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center w-28">Payment Mode</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-left w-36">Bank Name</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-left w-36">Account No</th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">Status</th>
                    <th className="px-3 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRows.map((row) => {
                    const isSelected = selectedIds.has(row.id);

                    let statusColor = "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400";
                    if (row.status === "Submitted") {
                      statusColor = "bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400";
                    } else if (row.status === "Cleared") {
                      statusColor = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400";
                    }

                    return (
                      <tr key={row.id} className="hover:bg-slate-50/55 dark:hover:bg-slate-900/40 transition duration-75 whitespace-nowrap">

                        {/* Checkbox */}
                        <td className="px-3 py-3 text-center border-r border-slate-100 dark:border-slate-800/50">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(row.id)}
                            className="rounded border-slate-300 text-primary focus:ring-primary size-3.5 cursor-pointer"
                          />
                        </td>

                        {/* ID & Bio */}
                        <td className="px-3 py-3 font-mono font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">{row.empId}</td>
                        <td className="px-3 py-3 font-extrabold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/50">{row.empName}</td>
                        <td className="px-3 py-3 text-slate-650 dark:text-slate-350 border-r border-slate-100 dark:border-slate-800/50">{row.department}</td>
                        <td className="px-3 py-3 text-slate-650 dark:text-slate-350 border-r border-slate-100 dark:border-slate-800/50">{row.designation}</td>

                        {/* Calculations */}
                        <td className="px-3 py-3 text-center font-mono font-bold border-r border-slate-100 dark:border-slate-800/50">{row.totalDays}</td>
                        <td className="px-3 py-3 text-right font-mono border-r border-slate-100 dark:border-slate-800/50">{row.perDayRate.toFixed(2)}</td>
                        <td className="px-3 py-3 text-right font-mono font-black text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/50">{row.netPay}</td>

                        {/* Inline Editable: Payment Mode */}
                        <td className="px-2.5 py-1.5 border-r border-slate-100 dark:border-slate-800/50">
                          <select
                            value={row.paymentMode}
                            disabled={row.status !== "Draft"}
                            onChange={(e) => handleInlineChange(row.id, "paymentMode", e.target.value as any)}
                            className="w-full h-7 px-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold outline-none focus:border-primary"
                          >
                            <option value="Bank">Bank</option>
                            <option value="Cash">Cash</option>
                            <option value="bKash">bKash</option>
                            <option value="Rocket">Rocket</option>
                          </select>
                        </td>

                        {/* Inline Editable: Bank Name */}
                        <td className="px-2.5 py-1.5 border-r border-slate-100 dark:border-slate-800/50">
                          <input
                            type="text"
                            value={row.bankName}
                            disabled={row.status !== "Draft" || row.paymentMode === "Cash"}
                            onChange={(e) => handleInlineChange(row.id, "bankName", e.target.value)}
                            placeholder="e.g. Bank NamePLC"
                            className="w-full h-7 px-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold outline-none focus:bg-white focus:border-primary disabled:opacity-40"
                          />
                        </td>

                        {/* Inline Editable: Account No */}
                        <td className="px-2.5 py-1.5 border-r border-slate-100 dark:border-slate-800/50">
                          <input
                            type="text"
                            value={row.accountNo}
                            disabled={row.status !== "Draft" || row.paymentMode === "Cash"}
                            onChange={(e) => handleInlineChange(row.id, "accountNo", e.target.value)}
                            placeholder="e.g. Acc Account no"
                            className="w-full h-7 px-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold outline-none focus:bg-white focus:border-primary disabled:opacity-40"
                          />
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3 text-center border-r border-slate-100 dark:border-slate-800/50">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${statusColor}`}>
                            {row.status}
                          </span>
                        </td>

                        {/* Single Actions */}
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => handleSingleDelete(row.id)}
                            className="text-rose-500 hover:text-rose-650 hover:scale-105 transition"
                            title="Delete Record"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}

                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={13} className="px-4 py-16 text-center text-slate-400 font-bold">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <HelpCircle className="size-6 text-slate-300 animate-bounce" />
                          <span>No processed earned leave records ready to submit.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination counts */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/40">
              <span className="text-[10.5px] font-bold text-slate-400">
                Showing 1 to {filteredRows.length} of {filteredRows.length} entries
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

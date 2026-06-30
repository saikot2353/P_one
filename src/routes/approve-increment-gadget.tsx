import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ChevronRight,
  Cpu,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Printer,
  FileDown,
  Search,
  Eye,
  Table as TableIcon,
  FolderOpen,
  Clock,
  Activity,
  Undo2,
} from "lucide-react";

export const Route = createFileRoute("/approve-increment-gadget")({
  head: () => ({
    meta: [{ title: "Approve Increment Gadget — CRIPTON" }],
  }),
  component: ApproveIncrementGadgetPage,
});

interface ApprovalRecord {
  id: string;
  name: string;
  oldEmpType: string;
  newEmpType: string;
  department: string;
  oldDesignation: string;
  newDesignation: string;
  joiningDate: string;
  shift: string;
  status: string;
  oldGrade: string;
  newGrade: string;
  unit: string;
  oldBasic: number;
  newBasic: number;
  basicDiff: number;
  oldGross: number;
  newGross: number;
  grossDiff: number;
  approveStatus: "Pending" | "Approved";
}

const defaultApprovalRecords: ApprovalRecord[] = [
  {
    id: "2024053060",
    name: "Md. Mahfujul Haque",
    oldEmpType: "Office Executive",
    newEmpType: "Office Executive",
    department: "Core Development",
    oldDesignation: "Manager",
    newDesignation: "Manager",
    joiningDate: "10/12/2024",
    shift: "General Shift",
    status: "Working",
    oldGrade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 52800.0,
    newBasic: 52800.0,
    basicDiff: 0.0,
    oldGross: 88000.0,
    newGross: 88000.0,
    grossDiff: 0.0,
    approveStatus: "Pending",
  },
  {
    id: "2024053062",
    name: "Mohammad Mayhedi Hasan",
    oldEmpType: "Office Executive",
    newEmpType: "Office Executive",
    department: "Core Development",
    oldDesignation: "Deputy Manager",
    newDesignation: "Deputy Manager",
    joiningDate: "10/12/2024",
    shift: "General Shift",
    status: "Working",
    oldGrade: "None",
    newGrade: "None",
    unit: "PSL",
    oldBasic: 44400.0,
    newBasic: 44400.0,
    basicDiff: 0.0,
    oldGross: 74000.0,
    newGross: 74000.0,
    grossDiff: 0.0,
    approveStatus: "Pending",
  },
];

function ApproveIncrementGadgetPage() {
  // Top Filters
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("Dec");
  const [approveStatus, setApproveStatus] = useState("Pending");
  const [empType, setEmpType] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [grade, setGrade] = useState("ALL");
  const [status, setStatus] = useState("Working");
  const [empIdInput, setEmpIdInput] = useState("");
  const [joiningYear, setJoiningYear] = useState("2023");
  const [joiningMonth, setJoiningMonth] = useState("Dec");

  // Roster States
  const [records, setRecords] = useState<ApprovalRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Options
  const selectOptions = [{ value: "ALL", label: "ALL" }];

  // Load custom submissions from localStorage, falling back to defaults if empty
  useEffect(() => {
    const saved = localStorage.getItem("custom_increment_queue_records");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          const mapped: ApprovalRecord[] = parsed.map((item: any) => ({
            id: item.empId,
            name: item.empName,
            oldEmpType: "Office Executive",
            newEmpType: "Office Executive",
            department: item.department,
            oldDesignation: item.section, // section was stored as designation in queue list
            newDesignation: item.designation,
            joiningDate: item.joiningDate,
            shift: "General Shift",
            status: "Working",
            oldGrade: "None",
            newGrade: "None",
            unit: "PSL",
            oldBasic: item.prevGross * 0.6,
            newBasic: item.grossAfterInc * 0.6,
            basicDiff: (item.grossAfterInc - item.prevGross) * 0.6,
            oldGross: item.prevGross,
            newGross: item.grossAfterInc,
            grossDiff: item.grossAfterInc - item.prevGross,
            approveStatus: item.hrApproveStatus === "Approved" ? "Approved" : "Pending",
          }));
          setRecords(mapped);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    setRecords(defaultApprovalRecords);
  }, []);

  // Filter roster dynamically
  const filteredRecords = useMemo(() => {
    return records.filter((row) => {
      // ApproveStatus filter
      if (approveStatus !== "ALL" && row.approveStatus !== approveStatus) return false;
      // EmpType filter
      if (empType !== "ALL" && row.oldEmpType !== empType) return false;
      // Status filter
      if (status !== "ALL" && row.status !== status) return false;

      // EmpId comma separator
      if (empIdInput.trim()) {
        const qids = empIdInput.split(",").map((id) => id.trim().toLowerCase());
        if (!qids.some((qid) => row.id.toLowerCase().includes(qid))) return false;
      }

      // Quick query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          row.name.toLowerCase().includes(q) ||
          row.id.includes(q) ||
          row.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, approveStatus, empType, status, empIdInput, searchQuery]);

  // KPI Stats
  const totalCount = records.length;
  const pendingCount = records.filter((r) => r.approveStatus === "Pending").length;
  const approvedCount = records.filter((r) => r.approveStatus === "Approved").length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(new Set(filteredRecords.map((r) => r.id)));
    else setSelectedIds(new Set());
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Actions
  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;

    const updated = records.map((r) => {
      if (selectedIds.has(r.id)) {
        return { ...r, approveStatus: "Approved" as const };
      }
      return r;
    });
    setRecords(updated);

    // Save back to localStorage
    const saved = localStorage.getItem("custom_increment_queue_records");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const nextQueue = parsed.map((item: any) => {
          if (selectedIds.has(item.empId)) {
            return { ...item, hrApproveStatus: "Approved", mdApproveStatus: "Approved" };
          }
          return item;
        });
        localStorage.setItem("custom_increment_queue_records", JSON.stringify(nextQueue));
      } catch (e) {
        console.error(e);
      }
    }

    setSelectedIds(new Set());
    toast.success(`Successfully approved ${selectedIds.size} increment files.`);
  };

  const handleBulkUndo = () => {
    if (selectedIds.size === 0) return;

    const updated = records.map((r) => {
      if (selectedIds.has(r.id)) {
        return { ...r, approveStatus: "Pending" as const };
      }
      return r;
    });
    setRecords(updated);

    // Save back to localStorage
    const saved = localStorage.getItem("custom_increment_queue_records");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const nextQueue = parsed.map((item: any) => {
          if (selectedIds.has(item.empId)) {
            return { ...item, hrApproveStatus: "Pending", mdApproveStatus: "Pending" };
          }
          return item;
        });
        localStorage.setItem("custom_increment_queue_records", JSON.stringify(nextQueue));
      } catch (e) {
        console.error(e);
      }
    }

    setSelectedIds(new Set());
    toast.success(`Successfully rolled back ${selectedIds.size} increment statuses to Pending.`);
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
                <Link to="/" className="hover:text-[#2563eb] transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2" />
                <span className="hover:text-[#2563eb] transition-colors">HR Approvals</span>
                <ChevronRight className="size-2" />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">
                  Increment Approvals
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-[#2563eb]" />
                <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  Approve Increment Gadget
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb] bg-[#2563eb]/5 border border-[#2563eb]/15 px-3 py-1.5 rounded-full select-none">
                Increment Engine
              </span>
            </div>
          </div>

          {/* KPI Dashboard Summary Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700">
                <FolderOpen className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Total Files
                </p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                  {totalCount} Queued
                </h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-800">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Approved
                </p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                  {approvedCount} Authorized
                </h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-100 dark:border-amber-800">
                <Clock className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Pending
                </p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                  {pendingCount} Awaiting
                </h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-100 dark:border-indigo-800">
                <Activity className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Active Cycle
                </p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                  {month} {year}
                </h3>
              </div>
            </div>
          </div>

          {/* Smart Filters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm shrink-0 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-x-3.5 gap-y-2.5">
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Year (Gadget)
                </label>
                <SearchableSelect
                  value={year}
                  onChange={setYear}
                  options={[
                    { value: "2025", label: "2025" },
                    { value: "2026", label: "2026" },
                  ]}
                  className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Month (Gadget)
                </label>
                <SearchableSelect
                  value={month}
                  onChange={setMonth}
                  options={[
                    { value: "Dec", label: "Dec" },
                    { value: "Jan", label: "Jan" },
                  ]}
                  className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Status
                </label>
                <SearchableSelect
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: "Working", label: "Working" },
                    { value: "ALL", label: "ALL" },
                  ]}
                  className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Emp Type
                </label>
                <SearchableSelect
                  value={empType}
                  onChange={setEmpType}
                  options={[
                    { value: "ALL", label: "ALL" },
                    { value: "Office Executive", label: "Office Executive" },
                  ]}
                  className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Section
                </label>
                <SearchableSelect
                  value={section}
                  onChange={setSection}
                  options={selectOptions}
                  className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Unit
                </label>
                <SearchableSelect
                  value={unit}
                  onChange={setUnit}
                  options={selectOptions}
                  className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Designation
                </label>
                <SearchableSelect
                  value={designation}
                  onChange={setDesignation}
                  options={selectOptions}
                  className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-inner">
                {(["ALL", "Pending", "Approved"] as const).map((filter) => {
                  const isActive = approveStatus === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setApproveStatus(filter)}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded transition-all uppercase tracking-wider ${
                        isActive
                          ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={empIdInput}
                  onChange={(e) => setEmpIdInput(e.target.value)}
                  placeholder="EmpId (Comma Sep)"
                  className="h-7.5 px-3 w-40 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none text-slate-800 dark:text-slate-200"
                />
                <div className="relative w-48">
                  <Search className="absolute left-2.5 top-2 size-3 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, id..."
                    className="h-7.5 pl-8 pr-3 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Toolbar & Data Table */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden flex flex-col min-h-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 shrink-0">
              <div className="flex items-center gap-1.5">
                <button className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm">
                  <TableIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" /> EXCEL
                </button>
                <button
                  onClick={() => window.print()}
                  className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm"
                >
                  <Printer className="size-3.5 text-slate-500 dark:text-slate-400" /> PRINT
                </button>
                <button
                  onClick={() => toast.success("Exporting PDF...")}
                  className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm"
                >
                  <FileDown className="size-3.5 text-rose-500" /> PDF
                </button>
                <button className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm ml-2">
                  <Eye className="size-3.5 text-indigo-500" /> VIEW LEDGER
                </button>
              </div>
            </div>

            {/* Bulk Action Bar - Sticky */}
            {selectedIds.size > 0 && (
              <div className="p-3 bg-[#2563eb]/5 border-b border-[#2563eb]/10 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-[#2563eb]/20 text-[#2563eb] hover:bg-[#2563eb]/20"
                  >
                    {selectedIds.size} Selected
                  </Badge>
                  <span className="text-[11px] font-medium text-slate-500">
                    files ready for authorization
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkUndo}
                    className="h-7.5 px-3 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Undo2 className="size-3.5" /> Undo Selected
                  </button>
                  <button
                    onClick={handleBulkApprove}
                    className="h-7.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="size-3.5" /> Approve Selected
                  </button>
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full min-w-[1400px] border-collapse text-left">
                <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
                  <tr className="bg-slate-50 dark:bg-slate-950">
                    <th className="px-4 py-3 w-[50px] text-center border-r border-slate-200 dark:border-slate-800">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                        onChange={handleSelectAll}
                        checked={
                          selectedIds.size === filteredRecords.length && filteredRecords.length > 0
                        }
                      />
                    </th>
                    <th className="px-3 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[60px]">
                      #
                    </th>
                    <th className="px-3 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[100px]">
                      Emp ID
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[180px]">
                      Name
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[120px]">
                      Department
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[140px]">
                      Old Designation
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-[#2563eb] uppercase tracking-widest min-w-[140px]">
                      New Designation
                    </th>
                    <th className="px-3 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[100px]">
                      Joining
                    </th>
                    <th className="px-3 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[90px]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
                      Old Gross
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-[#2563eb] uppercase tracking-widest text-right">
                      New Gross
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
                      Gross Diff
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
                      Approval
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {filteredRecords.map((row, idx) => {
                    const isChecked = selectedIds.has(row.id);
                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isChecked ? "bg-[#2563eb]/5 dark:bg-[#2563eb]/10" : ""}`}
                      >
                        <td className="px-4 py-2 text-center border-r border-slate-200 dark:border-slate-800">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                            checked={isChecked}
                            onChange={() => handleSelectRow(row.id)}
                          />
                        </td>
                        <td className="px-3 py-2 text-center font-mono text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="px-3 py-2 font-mono text-slate-600 dark:text-slate-400">
                          {row.id}
                        </td>
                        <td className="px-4 py-2 font-bold text-slate-800 dark:text-slate-100">
                          {row.name}
                        </td>
                        <td className="px-4 py-2 text-[11px] text-slate-500">{row.department}</td>
                        <td className="px-4 py-2 text-[11px] text-slate-500">
                          {row.oldDesignation}
                        </td>
                        <td className="px-4 py-2 text-[11px] font-extrabold text-[#2563eb]">
                          {row.newDesignation}
                        </td>
                        <td className="px-3 py-2 text-center font-mono text-[10px] text-slate-500">
                          {row.joiningDate}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-slate-500">
                          ৳{row.oldGross.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-[#2563eb]">
                          ৳{row.newGross.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right font-mono font-black text-slate-800 dark:text-slate-200">
                          {row.grossDiff > 0 ? `+৳${row.grossDiff.toFixed(2)}` : "৳0.00"}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-xl text-[8.5px] font-extrabold uppercase border ${
                              row.approveStatus === "Approved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {row.approveStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td
                        colSpan={13}
                        className="py-8 text-center text-slate-400 dark:text-slate-500 font-bold"
                      >
                        No pending increments available for authorization.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div>Showing 1 to {filteredRecords.length} entries</div>
              <div className="flex items-center gap-1.5">
                <button
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-700 transition-colors"
                  disabled
                >
                  Previous
                </button>
                <button className="size-5.5 rounded bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-sm text-[9.5px]">
                  1
                </button>
                <button
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-700 transition-colors"
                  disabled
                >
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

import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Search,
  FileSpreadsheet,
  Printer,
  FileDown,
  ShieldAlert,
  Plus,
  Check,
  X,
  Trash2,
  HelpCircle,
  FileWarning,
  Eye,
  Edit,
  UserRound,
  Calendar,
  AlertTriangle,
  UploadCloud,
  ChevronDown,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/disciplinary-case-files")({
  head: () => ({
    meta: [
      { title: "Case Files Database — CRIPTON" },
      {
        name: "description",
        content:
          "Comprehensive query-based historical database of all corporate disciplinary case files.",
      },
    ],
  }),
  component: CaseFilesPage,
});

interface CaseFileRecord {
  sl: number;
  caseId: string;
  empId: string;
  empIdOff: string;
  empName: string;
  company: string;
  department: string;
  designation: string;
  severity: "Minor" | "Major" | "Critical";
  incidentDate: string;
  title: string;
  status: "Open" | "Investigation" | "Closed" | "Appealed";
}

const initialMockCaseFiles: CaseFileRecord[] = [
  {
    sl: 1,
    caseId: "CF-26001",
    empId: "2047508",
    empIdOff: "47508",
    empName: "Mst. Jahanara Khatun",
    company: "KAC Fashion Wear Ltd",
    department: "Sewing",
    designation: "Asst. Operator",
    severity: "Minor",
    incidentDate: "15/08/2026",
    title: "Unauthorized Absence",
    status: "Open",
  },
  {
    sl: 2,
    caseId: "CF-26002",
    empId: "3302786",
    empIdOff: "C-28786",
    empName: "Md. Shantona Khatun",
    company: "KAC Fashion Wear Ltd",
    department: "Sewing",
    designation: "Asst. Operator",
    severity: "Major",
    incidentDate: "10/08/2026",
    title: "Insubordination",
    status: "Investigation",
  },
  {
    sl: 3,
    caseId: "CF-26003",
    empId: "8020064",
    empIdOff: "WQ-20064",
    empName: "Amina Khatun",
    company: "KAC Fashion Wear Ltd",
    department: "Store",
    designation: "Jr. Needle Man",
    severity: "Critical",
    incidentDate: "05/08/2026",
    title: "Theft of Company Property",
    status: "Closed",
  },
  {
    sl: 4,
    caseId: "CF-26004",
    empId: "1001111",
    empIdOff: "KF1-1111",
    empName: "Md. Yeasin Ali",
    company: "KAC Fashion Wear Ltd",
    department: "Sewing",
    designation: "Supervisor",
    severity: "Minor",
    incidentDate: "01/08/2026",
    title: "Late Attendance (Repeated)",
    status: "Appealed",
  },
  {
    sl: 5,
    caseId: "CF-26005",
    empId: "2400015",
    empIdOff: "400015",
    empName: "Mst. Mukta Khatun",
    company: "KAC Fashion Wear Ltd",
    department: "Sewing",
    designation: "Operator",
    severity: "Major",
    incidentDate: "20/07/2026",
    title: "Violation of Safety Protocols",
    status: "Closed",
  },
];

// Mock Employee Data for Searchable Dropdown
const MOCK_EMPLOYEES = [
  { id: "2023046001R", name: "Rahim Uddin", department: "IT", section: "Software", unit: "Unit 1" },
  { id: "2023046002R", name: "Karim Hassan", department: "HR", section: "Recruitment", unit: "Unit 2" },
  { id: "2023046003R", name: "Abdul Ali", department: "Operations", section: "Production", unit: "Unit 1" },
  { id: "2023046004R", name: "Fatima Begum", department: "Finance", section: "Accounts", unit: "Unit 3" },
  { id: "2023046005R", name: "Jamal Bhuiyan", department: "IT", section: "Hardware", unit: "Unit 1" },
];

function CaseFilesPage() {
  const [records, setRecords] = useState<CaseFileRecord[]>(initialMockCaseFiles);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseFileRecord | null>(null);

  // Update Status Form State
  const [updateCaseData, setUpdateCaseData] = useState({
    status: "",
    remarks: "",
    file: null as string | null,
  });

  // Employee Search Dropdown States
  const [empSearchOpen, setEmpSearchOpen] = useState(false);
  const [empSearchQuery, setEmpSearchQuery] = useState("");

  // Create Form State
  const [newCase, setNewCase] = useState({
    department: "",
    section: "",
    unit: "",
    empId: "",
    title: "",
    incidentDate: "",
    severity: "Minor",
    status: "Open",
    description: "",
  });

  // Query States
  const [region, setRegion] = useState("KAC Fashion- Factory");
  const [empType, setEmpType] = useState("ALL");
  const [subDept, setSubDept] = useState("ALL");
  const [severity, setSeverity] = useState("ALL");
  const [fromDate, setFromDate] = useState("2026-07-01");
  const [toDate, setToDate] = useState("2026-08-31");
  const [status, setStatus] = useState("ALL");
  const [empIdMulti, setEmpIdMulti] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Filter Trigger
  const [appliedFilters, setAppliedFilters] = useState({
    region: "KAC Fashion- Factory",
    empType: "ALL",
    subDept: "ALL",
    severity: "ALL",
    fromDate: "2026-07-01",
    toDate: "2026-08-31",
    status: "ALL",
    empIdMulti: "",
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      region,
      empType,
      subDept,
      severity,
      fromDate,
      toDate,
      status,
      empIdMulti,
    });
  };

  // Filter & Search computation
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // 1. Status Filter
      if (appliedFilters.status !== "ALL" && r.status !== appliedFilters.status) return false;

      // 2. Severity Filter
      if (appliedFilters.severity !== "ALL" && r.severity !== appliedFilters.severity) return false;

      // 3. Comma-separated Multi IDs Lookups
      if (appliedFilters.empIdMulti.trim()) {
        const ids = appliedFilters.empIdMulti.split(",").map((i) => i.trim());
        if (!ids.includes(r.empId) && !ids.includes(r.empIdOff)) return false;
      }

      // 4. Text Search Box matches Name, Dept, Company, Id, Designation, CaseId, Title
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.caseId.toLowerCase().includes(q) ||
          r.empId.toLowerCase().includes(q) ||
          r.empIdOff.toLowerCase().includes(q) ||
          r.empName.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [records, appliedFilters, searchQuery]);

  // Bulk selections logic
  const isAllSelected =
    filteredRecords.length > 0 && filteredRecords.every((r) => selectedIds.has(r.sl));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredRecords.forEach((r) => next.delete(r.sl));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredRecords.forEach((r) => next.add(r.sl));
        return next;
      });
    }
  };

  const toggleSelect = (sl: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sl)) {
        next.delete(sl);
      } else {
        next.add(sl);
      }
      return next;
    });
  };

  // Bulk actions handlers
  const handleCloseSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one record to close.");
      return;
    }
    setRecords((prev) =>
      prev.map((r) => (selectedIds.has(r.sl) ? { ...r, status: "Closed" } : r)),
    );
    toast.success(`Successfully closed ${selectedIds.size} selected case files.`);
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one record to delete.");
      return;
    }
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected case files?`)) return;
    setRecords((prev) => prev.filter((r) => !selectedIds.has(r.sl)));
    toast.success(`Deleted ${selectedIds.size} case files.`);
    setSelectedIds(new Set());
  };

  const handleSingleDelete = (sl: number) => {
    if (!confirm("Are you sure you want to delete this case file?")) return;
    setRecords((prev) => prev.filter((r) => r.sl !== sl));
    toast.success("Case file deleted successfully.");
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(sl);
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
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3" />
                <span>Disciplinary Action</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-extrabold">Case Files</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <FileWarning className="size-6 text-primary animate-pulse" />
                <span>Disciplinary Case Files</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="h-10 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 uppercase tracking-wider"
              >
                <Plus className="size-4 text-white" />
                <span>Create Case File</span>
              </button>
            </div>
          </div>

          {/* Multi-parameter Query Search Filter Panel */}
          <div className="bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
            <form
              onSubmit={handleSearchSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-4 text-xs font-bold"
            >
              {/* Region */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Region / Branch</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                  <option value="KAC Fashion- Factory">KAC Fashion- Factory</option>
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
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition cursor-pointer"
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
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                  <option value="Sewing">Sewing</option>
                  <option value="Store">Store</option>
                  <option value="Core Sales">Core Sales</option>
                  <option value="Core Development (HR)">Core Development (HR)</option>
                </select>
              </div>

              {/* Severity */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                  <option value="Minor">Minor</option>
                  <option value="Major">Major</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* From Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Incident Date From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                />
              </div>

              {/* To Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Incident Date To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Case Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-primary transition cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                  <option value="Open">Open</option>
                  <option value="Investigation">Under Investigation</option>
                  <option value="Appealed">Appealed</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Emp ID Multi */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">
                  EmpId (Multi with comma)
                </label>
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
              {/* Action Board */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCloseSelected}
                  className="h-8 pl-2 pr-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.97] text-white font-semibold text-[10px] rounded-lg shadow-xs flex items-center gap-2 transition-all duration-200 uppercase tracking-wider border border-emerald-500/10"
                >
                  <span className="p-0.5 bg-white/20 rounded-md text-white shadow-3xs flex items-center justify-center">
                    <Check className="size-3" />
                  </span>
                  <span>Close Selected</span>
                </button>

                <button
                  onClick={handleDeleteSelected}
                  className="h-8 pl-2 pr-3.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-650 active:scale-[0.97] text-white font-semibold text-[10px] rounded-lg shadow-xs flex items-center gap-2 transition-all duration-200 uppercase tracking-wider border border-slate-500/10"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete Selected</span>
                </button>
              </div>

              {/* Spreadsheet download utilities & Search query box */}
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
                    placeholder="Search case files..."
                    className="h-8.5 pl-9 pr-3 w-full sm:w-48 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-primary transition"
                  />
                </div>
              </div>
            </div>

            {/* Data Sheet Grid */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <table className="w-full border-collapse text-[10.5px] text-left">
                <thead>
                  <tr className="bg-[#f8fafc] dark:bg-slate-800/20 text-slate-800 dark:text-slate-200 font-black border-b border-slate-200 dark:border-slate-800/80 whitespace-nowrap select-none">
                    <th className="px-3 py-3 text-center w-10 border-r border-slate-200/50 dark:border-slate-800/30">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-350 text-primary focus:ring-primary size-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">
                      Case ID
                    </th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">
                      Emp Id
                    </th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">
                      Emp Name
                    </th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">
                      Department
                    </th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">
                      Incident Date
                    </th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">
                      Severity
                    </th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">
                      Case Title
                    </th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">
                      Status
                    </th>
                    <th className="px-3 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredRecords.map((row) => {
                    const isSelected = selectedIds.has(row.sl);

                    // Severity colors
                    let severityColor = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
                    if (row.severity === "Minor") {
                      severityColor = "bg-sky-100 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400";
                    } else if (row.severity === "Major") {
                      severityColor = "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400";
                    } else if (row.severity === "Critical") {
                      severityColor = "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400";
                    }

                    // Status colors
                    let statusColor = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
                    if (row.status === "Open") {
                      statusColor = "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50";
                    } else if (row.status === "Investigation") {
                      statusColor = "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50";
                    } else if (row.status === "Closed") {
                      statusColor = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50";
                    } else if (row.status === "Appealed") {
                      statusColor = "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50";
                    }

                    return (
                      <tr
                        key={row.sl}
                        className="hover:bg-slate-50/55 dark:hover:bg-slate-900/40 transition duration-75 whitespace-nowrap"
                      >
                        {/* Checkbox */}
                        <td className="px-3 py-3 text-center border-r border-slate-100 dark:border-slate-800/50">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(row.sl)}
                            className="rounded border-slate-350 text-primary focus:ring-primary size-3.5 cursor-pointer"
                          />
                        </td>

                        <td className="px-3 py-3 font-mono font-bold text-primary border-r border-slate-100 dark:border-slate-800/50">
                          <Link to="/" className="hover:underline">
                            {row.caseId}
                          </Link>
                        </td>
                        <td className="px-3 py-3 font-mono font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">
                          <div>{row.empId}</div>
                          <div className="text-[9px] text-slate-400">{row.empIdOff}</div>
                        </td>
                        <td className="px-3 py-3 font-extrabold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800/50">
                          <div>{row.empName}</div>
                          <div className="text-[9px] text-slate-500 font-medium">{row.designation}</div>
                        </td>
                        <td className="px-3 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800/50">
                          <div>{row.department}</div>
                          <div className="text-[9px] text-slate-400">{row.company}</div>
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/50">
                          {row.incidentDate}
                        </td>
                        <td className="px-3 py-3 text-center border-r border-slate-100 dark:border-slate-800/50">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${severityColor}`}
                          >
                            {row.severity}
                          </span>
                        </td>
                        <td
                          className="px-3 py-3 text-slate-700 dark:text-slate-300 font-bold max-w-[180px] truncate border-r border-slate-100 dark:border-slate-800/50"
                          title={row.title}
                        >
                          {row.title}
                        </td>
                        <td className="px-3 py-3 text-center border-r border-slate-100 dark:border-slate-800/50">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${statusColor}`}
                          >
                            {row.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedCase(row);
                                setIsViewOpen(true);
                              }}
                              className="text-slate-400 hover:text-primary hover:scale-110 transition-all"
                              title="View Details"
                            >
                              <Eye className="size-3.5" />
                            </button>
                            <button className="text-slate-400 hover:text-blue-500 hover:scale-110 transition-all" title="Edit Case">
                              <Edit className="size-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCase(row);
                                setUpdateCaseData({ status: row.status, remarks: "", file: null });
                                setIsUpdateOpen(true);
                              }}
                              className="text-slate-400 hover:text-emerald-500 hover:scale-110 transition-all"
                              title="Update Status"
                            >
                              <RefreshCw className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleSingleDelete(row.sl)}
                              className="text-slate-400 hover:text-rose-500 hover:scale-110 transition-all"
                              title="Delete Record"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-16 text-center text-slate-400 font-bold">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <HelpCircle className="size-6 text-slate-300 animate-bounce" />
                          <span>No case files matching the current filters.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/40">
              <span className="text-[10.5px] font-bold text-slate-400">
                Showing {filteredRecords.length > 0 ? 1 : 0} to {filteredRecords.length} of {filteredRecords.length} entries
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

      {/* --- CREATE CASE MODAL --- */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-2xl overflow-hidden flex flex-col border border-slate-200/60 dark:border-slate-700/50 scale-in-center">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-inner">
                  <ShieldAlert className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    File New Disciplinary Case
                  </h2>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Record a new incident and initiate the disciplinary workflow.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="size-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    Department <span className="text-[10px] text-slate-400 normal-case ml-auto">(Optional)</span>
                  </label>
                  <select
                    value={newCase.department}
                    onChange={(e) => setNewCase({ ...newCase, department: e.target.value, empId: "" })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm cursor-pointer"
                  >
                    <option value="">All Departments</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                {/* Section */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    Section <span className="text-[10px] text-slate-400 normal-case ml-auto">(Optional)</span>
                  </label>
                  <select
                    value={newCase.section}
                    onChange={(e) => setNewCase({ ...newCase, section: e.target.value, empId: "" })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm cursor-pointer"
                  >
                    <option value="">All Sections</option>
                    <option value="Software">Software</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Recruitment">Recruitment</option>
                    <option value="Production">Production</option>
                    <option value="Accounts">Accounts</option>
                  </select>
                </div>

                {/* Unit */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    Unit <span className="text-[10px] text-slate-400 normal-case ml-auto">(Optional)</span>
                  </label>
                  <select
                    value={newCase.unit}
                    onChange={(e) => setNewCase({ ...newCase, unit: e.target.value, empId: "" })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm cursor-pointer"
                  >
                    <option value="">All Units</option>
                    <option value="Unit 1">Unit 1</option>
                    <option value="Unit 2">Unit 2</option>
                    <option value="Unit 3">Unit 3</option>
                  </select>
                </div>

                {/* Emp ID Searchable Dropdown */}
                <div className="space-y-1.5 sm:col-span-2 relative">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <UserRound className="size-3.5 text-primary" />
                    Employee ID <span className="text-rose-500">*</span>
                  </label>
                  
                  <div className="relative">
                    <div 
                      onClick={() => setEmpSearchOpen(!empSearchOpen)}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-between hover:bg-white dark:hover:bg-slate-900 transition-colors focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
                    >
                      <span className={`text-sm font-medium ${newCase.empId ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                        {newCase.empId 
                          ? `${newCase.empId} - ${MOCK_EMPLOYEES.find(e => e.id === newCase.empId)?.name || 'Unknown'}` 
                          : "Select an Employee..."}
                      </span>
                      <ChevronDown className={`size-4 text-slate-400 transition-transform duration-200 ${empSearchOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {empSearchOpen && (
                      <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input 
                              type="text" 
                              value={empSearchQuery}
                              onChange={(e) => setEmpSearchQuery(e.target.value)}
                              placeholder="Search by name or ID..."
                              className="w-full h-10 pl-9 pr-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="max-h-56 overflow-y-auto p-1 custom-scrollbar">
                           {MOCK_EMPLOYEES
                            .filter(emp => 
                              (!newCase.department || emp.department === newCase.department) &&
                              (!newCase.section || emp.section === newCase.section) &&
                              (!newCase.unit || emp.unit === newCase.unit) &&
                              (emp.id.toLowerCase().includes(empSearchQuery.toLowerCase()) || 
                               emp.name.toLowerCase().includes(empSearchQuery.toLowerCase()))
                            )
                            .map(emp => (
                             <div 
                               key={emp.id}
                               onClick={() => {
                                 setNewCase({...newCase, empId: emp.id});
                                 setEmpSearchOpen(false);
                                 setEmpSearchQuery("");
                               }}
                               className="px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer flex flex-col gap-0.5 transition-colors"
                             >
                               <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{emp.name}</span>
                               <span className="text-[10.5px] font-semibold text-slate-500">
                                 {emp.id} &bull; {emp.department} &bull; {emp.section} &bull; {emp.unit}
                               </span>
                             </div>
                           ))}
                           {MOCK_EMPLOYEES.filter(emp => 
                              (!newCase.department || emp.department === newCase.department) &&
                              (!newCase.section || emp.section === newCase.section) &&
                              (!newCase.unit || emp.unit === newCase.unit) &&
                              (emp.id.toLowerCase().includes(empSearchQuery.toLowerCase()) || 
                               emp.name.toLowerCase().includes(empSearchQuery.toLowerCase()))
                            ).length === 0 && (
                              <div className="p-4 text-center text-sm text-slate-500 font-medium">
                                No employees found.
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Case Title */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileWarning className="size-3.5 text-amber-500" />
                    Case Title / Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCase.title}
                    onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                    placeholder="e.g. Unauthorized absence for 3 days"
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                  />
                </div>

                {/* Incident Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-blue-500" />
                    Incident Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newCase.incidentDate}
                    onChange={(e) => setNewCase({ ...newCase, incidentDate: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                  />
                </div>

                {/* Severity */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="size-3.5 text-rose-500" />
                    Severity Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newCase.severity}
                    onChange={(e) => setNewCase({ ...newCase, severity: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm cursor-pointer"
                  >
                    <option value="Minor">Minor</option>
                    <option value="Major">Major</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    Description & Incident Details
                  </label>
                  <textarea
                    rows={4}
                    value={newCase.description}
                    onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                    placeholder="Provide detailed description of the incident..."
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm resize-none"
                  />
                </div>

                {/* Upload Evidence Dropzone */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    Attach Evidence (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="size-5 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Click or drag file to upload
                      </p>
                      <p className="text-[11px] font-medium text-slate-400">
                        Support for JPG, PNG, PDF or DOCX (Max 10MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1e293b] flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success("New Disciplinary Case created successfully.");
                  setIsCreateOpen(false);
                  // In a real app, this would append to the list.
                }}
                className="px-6 py-2.5 rounded-xl font-extrabold text-sm text-white bg-primary hover:bg-primary/90 shadow-[0_4px_12px_rgba(var(--primary),0.3)] hover:shadow-[0_6px_16px_rgba(var(--primary),0.4)] transition-all active:scale-[0.98] flex items-center gap-2"
              >
                <Check className="size-4" />
                Submit Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- VIEW CASE DETAILS MODAL --- */}
      {isViewOpen && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col border border-slate-200/60 dark:border-slate-700/50 scale-in-center">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-start justify-between">
              <div className="flex gap-4">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex flex-col items-center justify-center shadow-lg">
                  <FileWarning className="size-6 mb-0.5 text-amber-400" />
                  <span className="text-[8px] font-black tracking-widest uppercase text-slate-400">Case</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                      {selectedCase.caseId}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        selectedCase.status === "Open"
                          ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50"
                          : selectedCase.status === "Investigation"
                          ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50"
                          : selectedCase.status === "Closed"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50"
                          : "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900/50"
                      }`}
                    >
                      {selectedCase.status}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        selectedCase.severity === "Minor"
                          ? "bg-sky-100 text-sky-700"
                          : selectedCase.severity === "Major"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {selectedCase.severity} Severity
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    {selectedCase.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsViewOpen(false)}
                className="size-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors shadow-sm"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Col - Employee Info */}
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                      Defendant Employee
                    </h3>
                    
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="size-20 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white text-2xl font-black mb-3 shadow-md border-2 border-white dark:border-slate-800">
                        {selectedCase.empName.charAt(0)}
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                        {selectedCase.empName}
                      </h4>
                      <p className="text-[11px] font-bold text-primary mb-0.5">
                        {selectedCase.empId} <span className="text-slate-400">({selectedCase.empIdOff})</span>
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500">
                        {selectedCase.designation}
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Company</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{selectedCase.company}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Department</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{selectedCase.department}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Col - Case Details & Timeline */}
                <div className="md:col-span-2 space-y-6">
                  {/* Details Block */}
                  <div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <FileWarning className="size-4 text-primary" />
                      Incident Details
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-5 border border-slate-100 dark:border-slate-800/80">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date of Incident</p>
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                            <Calendar className="size-4 text-blue-500" />
                            {selectedCase.incidentDate}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reported By</p>
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                            <UserRound className="size-4 text-slate-400" />
                            HR Department
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Description</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Evidence Block */}
                  <div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <UploadCloud className="size-4 text-primary" />
                      Attached Evidence
                    </h3>
                    <div className="flex gap-3">
                      <div className="w-32 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                        <FileWarning className="size-5 text-slate-400 mb-1" />
                        <span className="text-[9px] font-bold text-slate-500 uppercase">document.pdf</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1e293b] flex items-center justify-between rounded-b-2xl">
              <button
                className="px-4 py-2 rounded-lg font-bold text-[11px] text-primary hover:bg-primary/10 transition-colors uppercase tracking-wider"
              >
                Print Report
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsViewOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
                <button
                  className="px-6 py-2.5 rounded-xl font-extrabold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)] transition-all active:scale-[0.98] flex items-center gap-2"
                >
                  <Edit className="size-4" />
                  Edit Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- UPDATE STATUS MODAL --- */}
      {isUpdateOpen && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-lg overflow-hidden flex flex-col border border-slate-200/60 dark:border-slate-700/50 scale-in-center">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                  <RefreshCw className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    Update Case Status
                  </h2>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Change status and attach progress remarks for {selectedCase.caseId}.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUpdateOpen(false)}
                className="size-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileWarning className="size-3.5 text-amber-500" />
                  New Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={updateCaseData.status}
                  onChange={(e) => setUpdateCaseData({ ...updateCaseData, status: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm cursor-pointer"
                >
                  <option value="Open">Open</option>
                  <option value="Investigation">Under Investigation</option>
                  <option value="Appealed">Appealed</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Remarks/Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="size-3.5 text-blue-500" />
                  Status Remarks / Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={updateCaseData.remarks}
                  onChange={(e) => setUpdateCaseData({ ...updateCaseData, remarks: e.target.value })}
                  placeholder="Explain why the status is being updated..."
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm resize-none"
                />
              </div>

              {/* Required Upload Evidence Dropzone */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <UploadCloud className="size-3.5 text-purple-500" />
                  Required Supporting Document <span className="text-rose-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
                  <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud className="size-4 text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Upload supporting files
                    </p>
                    <p className="text-[11px] font-medium text-slate-400">
                      PDF, DOCX, PNG (Max 10MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1e293b] flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setIsUpdateOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!updateCaseData.remarks.trim()) {
                    toast.error("Status remarks are required.");
                    return;
                  }
                  
                  // Optimistic update
                  setRecords((prev) =>
                    prev.map((r) =>
                      r.sl === selectedCase.sl
                        ? { ...r, status: updateCaseData.status as any }
                        : r
                    )
                  );
                  
                  toast.success("Case status and remarks updated successfully!");
                  setIsUpdateOpen(false);
                }}
                className="px-6 py-2.5 rounded-xl font-extrabold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-[0_4px_12px_rgba(5,150,105,0.3)] hover:shadow-[0_6px_16px_rgba(5,150,105,0.4)] transition-all active:scale-[0.98] flex items-center gap-2"
              >
                <Check className="size-4" />
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

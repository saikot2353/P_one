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
  Plus,
  Check,
  X,
  Trash2,
  HelpCircle,
  Eye,
  Edit,
  UserRound,
  Calendar,
  UploadCloud,
  ChevronDown,
  RefreshCw,
  MessageSquare,
  AlertOctagon,
  Clock,
  HelpCircle as QuestionIcon,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/disciplinary-showcause-notices")({
  head: () => ({
    meta: [
      { title: "Show Cause Notices — CRIPTON" },
      {
        name: "description",
        content: "Manage and track show cause notices issued to employees.",
      },
    ],
  }),
  component: ShowCauseNoticesPage,
});

interface ShowCauseRecord {
  sl: number;
  noticeId: string;
  empId: string;
  empIdOff: string;
  empName: string;
  company: string;
  department: string;
  designation: string;
  issueDate: string;
  deadlineDate: string;
  reason: string;
  status: "Issued" | "Replied" | "Under Review" | "Closed";
}

const initialMockShowCauseNotices: ShowCauseRecord[] = [
  {
    sl: 1,
    noticeId: "SCN-26001",
    empId: "2047508",
    empIdOff: "47508",
    empName: "Mst. Jahanara Khatun",
    company: "KAC Fashion Wear Ltd",
    department: "Sewing",
    designation: "Asst. Operator",
    issueDate: "16/08/2026",
    deadlineDate: "19/08/2026",
    reason: "Unexplained absence for 3 consecutive days.",
    status: "Issued",
  },
  {
    sl: 2,
    noticeId: "SCN-26002",
    empId: "3302786",
    empIdOff: "C-28786",
    empName: "Md. Shantona Khatun",
    company: "KAC Fashion Wear Ltd",
    department: "Sewing",
    designation: "Asst. Operator",
    issueDate: "12/08/2026",
    deadlineDate: "15/08/2026",
    reason: "Refusal to follow supervisor's instructions.",
    status: "Replied",
  },
  {
    sl: 3,
    noticeId: "SCN-26003",
    empId: "8020064",
    empIdOff: "WQ-20064",
    empName: "Amina Khatun",
    company: "KAC Fashion Wear Ltd",
    department: "Store",
    designation: "Jr. Needle Man",
    issueDate: "05/08/2026",
    deadlineDate: "08/08/2026",
    reason: "Suspicion of company property theft.",
    status: "Under Review",
  },
  {
    sl: 4,
    noticeId: "SCN-26004",
    empId: "1001111",
    empIdOff: "KF1-1111",
    empName: "Md. Yeasin Ali",
    company: "KAC Fashion Wear Ltd",
    department: "Sewing",
    designation: "Supervisor",
    issueDate: "01/08/2026",
    deadlineDate: "04/08/2026",
    reason: "Repeated tardiness without prior approval.",
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

function ShowCauseNoticesPage() {
  const [records, setRecords] = useState<ShowCauseRecord[]>(initialMockShowCauseNotices);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<ShowCauseRecord | null>(null);

  // Update Status Form State
  const [updateNoticeData, setUpdateNoticeData] = useState({
    status: "",
    remarks: "",
    file: null as string | null,
  });

  // Employee Search Dropdown States
  const [empSearchOpen, setEmpSearchOpen] = useState(false);
  const [empSearchQuery, setEmpSearchQuery] = useState("");

  // Create Form State
  const [newNotice, setNewNotice] = useState({
    department: "",
    section: "",
    unit: "",
    empId: "",
    issueDate: "",
    deadlineDate: "",
    reason: "",
  });

  // Query States
  const [region, setRegion] = useState("KAC Fashion- Factory");
  const [empType, setEmpType] = useState("ALL");
  const [subDept, setSubDept] = useState("ALL");
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

      // 2. Comma-separated Multi IDs Lookups
      if (appliedFilters.empIdMulti.trim()) {
        const ids = appliedFilters.empIdMulti.split(",").map((i) => i.trim());
        if (!ids.includes(r.empId) && !ids.includes(r.empIdOff)) return false;
      }

      // 3. Text Search Box
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.noticeId.toLowerCase().includes(q) ||
          r.empId.toLowerCase().includes(q) ||
          r.empIdOff.toLowerCase().includes(q) ||
          r.empName.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q)
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
  const handleAcknowledgeSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one record to mark as Replied.");
      return;
    }
    setRecords((prev) =>
      prev.map((r) => (selectedIds.has(r.sl) ? { ...r, status: "Replied" } : r)),
    );
    toast.success(`Successfully marked ${selectedIds.size} notices as replied.`);
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one record to delete.");
      return;
    }
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected notices?`)) return;
    setRecords((prev) => prev.filter((r) => !selectedIds.has(r.sl)));
    toast.success(`Deleted ${selectedIds.size} notices.`);
    setSelectedIds(new Set());
  };

  const handleSingleDelete = (sl: number) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    setRecords((prev) => prev.filter((r) => r.sl !== sl));
    toast.success("Notice deleted successfully.");
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
                <span className="text-primary font-extrabold">Show Cause Notices</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <AlertOctagon className="size-6 text-indigo-500 animate-pulse" />
                <span>Show Cause Notices</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="h-10 px-5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl shadow-[0_4px_12px_rgba(99,102,241,0.2)] hover:shadow-[0_6px_16px_rgba(99,102,241,0.3)] transition-all flex items-center gap-2 uppercase tracking-wider"
              >
                <Plus className="size-4 text-white" />
                <span>Issue Notice</span>
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
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition cursor-pointer"
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
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition cursor-pointer"
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
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                  <option value="Sewing">Sewing</option>
                  <option value="Store">Store</option>
                  <option value="Core Sales">Core Sales</option>
                  <option value="Core Development (HR)">Core Development (HR)</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Notice Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                  <option value="Issued">Issued</option>
                  <option value="Replied">Replied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* From Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Issue Date From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* To Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Issue Date To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Emp ID Multi */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] text-slate-400 uppercase">
                  EmpId (Multi with comma)
                </label>
                <input
                  type="text"
                  value={empIdMulti}
                  onChange={(e) => setEmpIdMulti(e.target.value)}
                  placeholder="use comma as separator"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-500 transition font-mono placeholder:italic"
                />
              </div>

              {/* Search Submit Bar */}
              <div className="md:col-span-3 lg:col-span-4 flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/40">
                <button
                  type="submit"
                  className="h-10 px-10 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition uppercase tracking-wider"
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
                  onClick={handleAcknowledgeSelected}
                  className="h-8 pl-2 pr-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.97] text-white font-semibold text-[10px] rounded-lg shadow-xs flex items-center gap-2 transition-all duration-200 uppercase tracking-wider border border-emerald-500/10"
                >
                  <span className="p-0.5 bg-white/20 rounded-md text-white shadow-3xs flex items-center justify-center">
                    <Check className="size-3" />
                  </span>
                  <span>Mark Replied</span>
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
                    placeholder="Search notices..."
                    className="h-8.5 pl-9 pr-3 w-full sm:w-48 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 transition"
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
                        className="rounded border-slate-350 text-indigo-500 focus:ring-indigo-500 size-3.5 cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">
                      Notice ID
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
                      Issue Date
                    </th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30 text-center">
                      Deadline
                    </th>
                    <th className="px-3 py-3 border-r border-slate-200/50 dark:border-slate-800/30">
                      Reason
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

                    // Status colors
                    let statusColor = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
                    if (row.status === "Issued") {
                      statusColor = "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50";
                    } else if (row.status === "Replied") {
                      statusColor = "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50";
                    } else if (row.status === "Under Review") {
                      statusColor = "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50";
                    } else if (row.status === "Closed") {
                      statusColor = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50";
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
                            className="rounded border-slate-350 text-indigo-500 focus:ring-indigo-500 size-3.5 cursor-pointer"
                          />
                        </td>

                        <td className="px-3 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400 border-r border-slate-100 dark:border-slate-800/50">
                          <Link to="/" className="hover:underline">
                            {row.noticeId}
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
                          {row.issueDate}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-rose-500 dark:text-rose-400 font-bold border-r border-slate-100 dark:border-slate-800/50">
                          {row.deadlineDate}
                        </td>
                        <td
                          className="px-3 py-3 text-slate-700 dark:text-slate-300 font-bold max-w-[180px] truncate border-r border-slate-100 dark:border-slate-800/50"
                          title={row.reason}
                        >
                          {row.reason}
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
                                setSelectedNotice(row);
                                setIsViewOpen(true);
                              }}
                              className="text-slate-400 hover:text-indigo-500 hover:scale-110 transition-all"
                              title="View Details"
                            >
                              <Eye className="size-3.5" />
                            </button>
                            <button className="text-slate-400 hover:text-blue-500 hover:scale-110 transition-all" title="Edit Notice">
                              <Edit className="size-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedNotice(row);
                                setUpdateNoticeData({ status: row.status, remarks: "", file: null });
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
                          <span>No notices matching the current filters.</span>
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
                <button className="size-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-black">
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

      {/* --- CREATE SHOW CAUSE NOTICE MODAL --- */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-2xl overflow-hidden flex flex-col border border-slate-200/60 dark:border-slate-700/50 scale-in-center">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                  <AlertOctagon className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    Issue Show Cause Notice
                  </h2>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Draft and formally issue a new show cause notice to an employee.
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
                    value={newNotice.department}
                    onChange={(e) => setNewNotice({ ...newNotice, department: e.target.value, empId: "" })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm cursor-pointer"
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
                    value={newNotice.section}
                    onChange={(e) => setNewNotice({ ...newNotice, section: e.target.value, empId: "" })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm cursor-pointer"
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
                    value={newNotice.unit}
                    onChange={(e) => setNewNotice({ ...newNotice, unit: e.target.value, empId: "" })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm cursor-pointer"
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
                    <UserRound className="size-3.5 text-indigo-500" />
                    Employee ID <span className="text-rose-500">*</span>
                  </label>
                  
                  <div className="relative">
                    <div 
                      onClick={() => setEmpSearchOpen(!empSearchOpen)}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-between hover:bg-white dark:hover:bg-slate-900 transition-colors focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10"
                    >
                      <span className={`text-sm font-medium ${newNotice.empId ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                        {newNotice.empId 
                          ? `${newNotice.empId} - ${MOCK_EMPLOYEES.find(e => e.id === newNotice.empId)?.name || 'Unknown'}` 
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
                              className="w-full h-10 pl-9 pr-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="max-h-56 overflow-y-auto p-1 custom-scrollbar">
                           {MOCK_EMPLOYEES
                            .filter(emp => 
                              (!newNotice.department || emp.department === newNotice.department) &&
                              (!newNotice.section || emp.section === newNotice.section) &&
                              (!newNotice.unit || emp.unit === newNotice.unit) &&
                              (emp.id.toLowerCase().includes(empSearchQuery.toLowerCase()) || 
                               emp.name.toLowerCase().includes(empSearchQuery.toLowerCase()))
                            )
                            .map(emp => (
                             <div 
                               key={emp.id}
                               onClick={() => {
                                 setNewNotice({...newNotice, empId: emp.id});
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
                              (!newNotice.department || emp.department === newNotice.department) &&
                              (!newNotice.section || emp.section === newNotice.section) &&
                              (!newNotice.unit || emp.unit === newNotice.unit) &&
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

                {/* Issue Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-blue-500" />
                    Issue Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newNotice.issueDate}
                    onChange={(e) => setNewNotice({ ...newNotice, issueDate: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm"
                  />
                </div>

                {/* Deadline Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="size-3.5 text-rose-500" />
                    Reply Deadline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newNotice.deadlineDate}
                    onChange={(e) => setNewNotice({ ...newNotice, deadlineDate: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm"
                  />
                </div>

                {/* Reason */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    Details / Reason for Show Cause
                  </label>
                  <textarea
                    rows={4}
                    value={newNotice.reason}
                    onChange={(e) => setNewNotice({ ...newNotice, reason: e.target.value })}
                    placeholder="Provide the reason for the show cause notice..."
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm resize-none"
                  />
                </div>

                {/* Upload Evidence Dropzone */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    Attach Evidence (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
                    <div className="size-12 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="size-5 text-indigo-500" />
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
                  toast.success("Show Cause Notice issued successfully.");
                  setIsCreateOpen(false);
                }}
                className="px-6 py-2.5 rounded-xl font-extrabold text-sm text-white bg-indigo-500 hover:bg-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_16px_rgba(99,102,241,0.4)] transition-all active:scale-[0.98] flex items-center gap-2"
              >
                <Check className="size-4" />
                Issue Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- VIEW NOTICE DETAILS MODAL --- */}
      {isViewOpen && selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col border border-slate-200/60 dark:border-slate-700/50 scale-in-center">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-start justify-between">
              <div className="flex gap-4">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex flex-col items-center justify-center shadow-lg">
                  <AlertOctagon className="size-6 mb-0.5 text-indigo-400" />
                  <span className="text-[8px] font-black tracking-widest uppercase text-slate-400">Notice</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                      {selectedNotice.noticeId}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        selectedNotice.status === "Issued"
                          ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50"
                          : selectedNotice.status === "Replied"
                          ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50"
                          : selectedNotice.status === "Under Review"
                          ? "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900/50"
                          : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50"
                      }`}
                    >
                      {selectedNotice.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    {selectedNotice.reason}
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
                      Issued To
                    </h3>
                    
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="size-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-black mb-3 shadow-md border-2 border-white dark:border-slate-800">
                        {selectedNotice.empName.charAt(0)}
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                        {selectedNotice.empName}
                      </h4>
                      <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-500 mb-0.5">
                        {selectedNotice.empId} <span className="text-slate-400">({selectedNotice.empIdOff})</span>
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500">
                        {selectedNotice.designation}
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Company</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{selectedNotice.company}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Department</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{selectedNotice.department}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Col - Notice Details & Attachment */}
                <div className="md:col-span-2 space-y-6">
                  {/* Details Block */}
                  <div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <AlertOctagon className="size-4 text-indigo-500" />
                      Notice Details
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-5 border border-slate-100 dark:border-slate-800/80">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Date</p>
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                            <Calendar className="size-4 text-blue-500" />
                            {selectedNotice.issueDate}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reply Deadline</p>
                          <div className="flex items-center gap-2 text-sm font-bold text-rose-600 dark:text-rose-500">
                            <Clock className="size-4 text-rose-500" />
                            {selectedNotice.deadlineDate}
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Reason</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Attachment Block */}
                  <div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <UploadCloud className="size-4 text-indigo-500" />
                      Digital Copy
                    </h3>
                    <div className="flex gap-3">
                      <div className="w-32 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                        <AlertOctagon className="size-5 text-slate-400 mb-1" />
                        <span className="text-[9px] font-bold text-slate-500 uppercase">Show_Cause.pdf</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1e293b] flex items-center justify-between rounded-b-2xl">
              <button
                className="px-4 py-2 rounded-lg font-bold text-[11px] text-indigo-600 hover:bg-indigo-500/10 transition-colors uppercase tracking-wider"
              >
                Print Notice
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
                  Edit Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- UPDATE STATUS MODAL --- */}
      {isUpdateOpen && selectedNotice && (
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
                    Update Notice Status
                  </h2>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Change status and attach progress remarks for {selectedNotice.noticeId}.
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
                  <QuestionIcon className="size-3.5 text-indigo-500" />
                  New Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={updateNoticeData.status}
                  onChange={(e) => setUpdateNoticeData({ ...updateNoticeData, status: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-sm cursor-pointer"
                >
                  <option value="Issued">Issued</option>
                  <option value="Replied">Replied</option>
                  <option value="Under Review">Under Review</option>
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
                  value={updateNoticeData.remarks}
                  onChange={(e) => setUpdateNoticeData({ ...updateNoticeData, remarks: e.target.value })}
                  placeholder="Explain why the status is being updated (e.g. Received response from employee)..."
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
                  if (!updateNoticeData.remarks.trim()) {
                    toast.error("Status remarks are required.");
                    return;
                  }
                  
                  // Optimistic update
                  setRecords((prev) =>
                    prev.map((r) =>
                      r.sl === selectedNotice.sl
                        ? { ...r, status: updateNoticeData.status as any }
                        : r
                    )
                  );
                  
                  toast.success("Notice status and remarks updated successfully!");
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

import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Search,
  Printer,
  Table as TableIcon,
  X,
  CheckCircle2,
  Clock,
  Fingerprint,
  XCircle,
  FolderOpen,
  Pencil,
} from "lucide-react";

export const Route = createFileRoute("/pending-manual-attendance")({
  component: PendingManualAttendancePage,
});

// Authentic pending requests dataset
const initialPendingList = [
  {
    id: "2016001055",
    name: "Md. Zahidul Islam",
    dept1: "Management",
    dept2: "Management",
    title: "Chief Operating Officer",
    date: "16/05/2026",
    inTime: "09:02:45",
    outDate: "16/05/2026",
    outTime: "17:59:58",
    reason: "",
    systemBy: "Naim Hasan Roky",
    systemDate: "17/05/2026",
    systemInfo: "In Time Request\nOut Time RequestOut Date Changed.(16/05/2026)",
    hodStatus: "Approve",
    hrdStatus: "Pending",
    mdStatus: "Pending",
    hodName: "Rakibul Islam Khan",
  },
  {
    id: "2022035599",
    name: "Dipon Saha",
    dept1: "Core Development (HR)",
    dept2: "Development Team",
    title: "Manager",
    date: "15/05/2026",
    inTime: "09:15:30",
    outDate: "15/05/2026",
    outTime: "18:05:12",
    reason: "Severe Traffic Jam",
    systemBy: "Self Service",
    systemDate: "15/05/2026",
    systemInfo: "Late In Approval Request",
    hodStatus: "Pending",
    hrdStatus: "Pending",
    mdStatus: "Pending",
    hodName: "Zakir Hossain",
  },
  {
    id: "2023043910",
    name: "Tahmid Afsar Shapno",
    dept1: "Business Innovation",
    dept2: "Project Resource & Strategy",
    title: "Asst. Manager",
    date: "14/05/2026",
    inTime: "10:30:00",
    outDate: "14/05/2026",
    outTime: "19:30:00",
    reason: "Audit Visit Support",
    systemBy: "Naim Hasan Roky",
    systemDate: "15/05/2026",
    systemInfo: "In/Out Punch Missing Correction",
    hodStatus: "Approve",
    hrdStatus: "Approve",
    mdStatus: "Pending",
    hodName: "Rakibul Islam Khan",
  },
  {
    id: "2021032646",
    name: "Sadiqul Islam",
    dept1: "Core Sales",
    dept2: "Retail Sales",
    title: "Deputy Manager",
    date: "15/05/2026",
    inTime: "08:55:00",
    outDate: "15/05/2026",
    outTime: "18:30:00",
    reason: "Early morning Client Meeting",
    systemBy: "Self Service",
    systemDate: "15/05/2026",
    systemInfo: "Punch In Correction Request",
    hodStatus: "Pending",
    hrdStatus: "Pending",
    mdStatus: "Pending",
    hodName: "Zakir Hossain",
  },
];

function PendingManualAttendancePage() {
  const [requests, setRequests] = useState(initialPendingList);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filters
  const [startDate, setStartDate] = useState("2026-05-14");
  const [endDate, setEndDate] = useState("2026-05-17");
  const [department, setDepartment] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState<string>("Pending");
  const [globalSearch, setGlobalSearch] = useState("");

  const departmentOptions = [
    { value: "All Departments", label: "All Departments" },
    { value: "Management", label: "Management" },
    { value: "Core Development (HR)", label: "Core Development (HR)" },
    { value: "Business Innovation", label: "Business Innovation" },
    { value: "Core Sales", label: "Core Sales" },
  ];

  // Inline dynamic edit modal states
  const [editingRequest, setEditingRequest] = useState<any | null>(null);
  const [editInTime, setEditInTime] = useState("");
  const [editOutTime, setEditOutTime] = useState("");
  const [editReason, setEditReason] = useState("");

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredRequests.map((r) => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;
    setRequests((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, hodStatus: "Approve" } : r)),
    );
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    if (selectedIds.size === 0) return;
    setRequests((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, hodStatus: "Reject" } : r)),
    );
    setSelectedIds(new Set());
  };

  const handleStartEdit = (req: any) => {
    setEditingRequest(req);
    setEditInTime(req.inTime);
    setEditOutTime(req.outTime);
    setEditReason(req.reason);
  };

  const handleSaveEdit = () => {
    if (!editingRequest) return;
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== editingRequest.id) return r;
        return { ...r, inTime: editInTime, outTime: editOutTime, reason: editReason };
      }),
    );
    setEditingRequest(null);
  };

  // Stats & Filtering
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "All") {
        if (statusFilter === "Pending" && r.hodStatus !== "Pending") return false;
        if (statusFilter === "Approved" && r.hodStatus !== "Approve") return false;
        if (statusFilter === "Rejected" && r.hodStatus !== "Reject") return false;
      }
      if (department !== "All Departments" && r.dept1 !== department) return false;
      if (globalSearch) {
        const q = globalSearch.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) || r.id.includes(q) || r.title.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [requests, statusFilter, department, globalSearch]);

  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.hodStatus === "Pending").length;
  const approvedCount = requests.filter((r) => r.hodStatus === "Approve").length;
  const rejectedCount = requests.filter((r) => r.hodStatus === "Reject").length;

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
                <span className="hover:text-[#2563eb] transition-colors">Human Resource</span>
                <ChevronRight className="size-2" />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">
                  Attendance Approvals
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-[#2563eb]" />
                <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  Manual Attendance Approvals
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb] bg-[#2563eb]/5 border border-[#2563eb]/15 px-3 py-1.5 rounded-full select-none">
                HR Audit Registry
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
                  Total Queue
                </p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                  {totalCount} Requests
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
                  {approvedCount} Requests
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
                  {pendingCount} Requests
                </h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 border border-rose-100 dark:border-rose-800">
                <XCircle className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Rejected
                </p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                  {rejectedCount} Requests
                </h3>
              </div>
            </div>
          </div>

          {/* Smart Filters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm shrink-0 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3.5 gap-y-2.5">
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 text-[11px] font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563eb]"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-8 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 text-[11px] font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563eb]"
                />
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Department
                </label>
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
                {(["All", "Approved", "Pending", "Rejected"] as const).map((filter) => {
                  const isActive = statusFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
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
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2 size-3 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Quick Search ID, Name..."
                  className="h-7.5 pl-8 pr-3 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none text-slate-800 dark:text-slate-200"
                />
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
                <button className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer shadow-sm">
                  <Printer className="size-3.5 text-slate-500 dark:text-slate-400" /> PRINT
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
                    entries ready for action
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkReject}
                    className="h-7.5 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <XCircle className="size-3.5" /> Reject Selected
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
              <table className="w-full min-w-[1200px] border-collapse text-left">
                <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
                  <tr className="bg-slate-50 dark:bg-slate-950">
                    <th className="px-4 py-3 w-[60px] text-center border-r border-slate-200 dark:border-slate-800">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                        onChange={handleSelectAll}
                        checked={
                          selectedIds.size === filteredRequests.length &&
                          filteredRequests.length > 0
                        }
                      />
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[80px]">
                      Action
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[100px]">
                      Emp ID
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[180px]">
                      Employee Name
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[140px]">
                      Department
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[90px]">
                      Date
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[80px]">
                      In Time
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[80px]">
                      Out Time
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[120px]">
                      HOD Status
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[200px]">
                      System Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {filteredRequests.map((row) => (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selectedIds.has(row.id) ? "bg-[#2563eb]/5 dark:bg-[#2563eb]/10" : ""}`}
                    >
                      <td className="px-4 py-2 text-center border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                          checked={selectedIds.has(row.id)}
                          onChange={() => handleSelectRow(row.id)}
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleStartEdit(row)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition cursor-pointer"
                          title="Edit Correction"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                      </td>
                      <td className="px-4 py-2 font-mono text-slate-500">{row.id}</td>
                      <td className="px-4 py-2 font-bold text-slate-800 dark:text-slate-100">
                        {row.name}
                      </td>
                      <td className="px-4 py-2 text-slate-500 text-[10.5px]">
                        <div className="truncate">{row.dept1}</div>
                        <div className="font-normal text-slate-400">{row.title}</div>
                      </td>
                      <td className="px-4 py-2 text-center font-mono text-slate-600">{row.date}</td>
                      <td className="px-4 py-2 text-center font-mono font-bold text-[#2563eb]">
                        {row.inTime}
                      </td>
                      <td className="px-4 py-2 text-center font-mono font-bold text-[#2563eb]">
                        {row.outTime}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-xl text-[8.5px] font-extrabold uppercase border ${
                            row.hodStatus === "Approve"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : row.hodStatus === "Reject"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {row.hodStatus === "Approve" ? "Approved" : row.hodStatus}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-[10px] text-slate-500">
                        <div className="line-clamp-2" title={row.systemInfo}>
                          {row.systemInfo.replace(/\n/g, " ")}
                        </div>
                        {row.reason && <div className="text-slate-400 italic">"{row.reason}"</div>}
                      </td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="py-8 text-center text-slate-400 dark:text-slate-500 font-bold"
                      >
                        No attendance correction requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div>Showing 1 to {filteredRequests.length} entries</div>
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

        {/* Dynamic Inline Edit Modal (Simplified for Design System) */}
        {editingRequest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
                <h2 className="text-sm font-black flex items-center gap-2 uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  <Fingerprint className="size-4.5 text-[#2563eb]" />
                  <span>Manual Correction Form</span>
                </h2>
                <button
                  onClick={() => setEditingRequest(null)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-black">{editingRequest.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {editingRequest.id} — {editingRequest.dept1}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      In Time
                    </label>
                    <input
                      type="time"
                      step="1"
                      value={editInTime}
                      onChange={(e) => setEditInTime(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-mono outline-none focus:border-[#2563eb]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Out Time
                    </label>
                    <input
                      type="time"
                      step="1"
                      value={editOutTime}
                      onChange={(e) => setEditOutTime(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-mono outline-none focus:border-[#2563eb]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Correction Reason
                  </label>
                  <input
                    type="text"
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                    placeholder="Provide reason for correction..."
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-950/50">
                <button
                  onClick={() => setEditingRequest(null)}
                  className="h-8.5 px-4 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="h-8.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition cursor-pointer"
                >
                  Save Adjustments
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

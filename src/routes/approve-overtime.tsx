import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Badge } from "@/components/ui/badge";
import {
  Timer,
  ChevronRight,
  Search,
  Printer,
  CheckCircle2,
  X,
  AlertCircle,
  ShieldCheck,
  Download,
  Eye,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/approve-overtime")({
  head: () => ({
    meta: [
      { title: "Approve Overtime — CRIPTON" },
      { name: "description", content: "Review and approve overtime requests." },
    ],
  }),
  component: ApproveOvertimePage,
});

interface SubmittedOTRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  otDate: string;
  calculatedOt: number;
  reqOt: number;
  reqMot: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
}

function ApproveOvertimePage() {
  const [submittedRecords, setSubmittedRecords] = useState<SubmittedOTRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_submitted_ot");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [viewDetailsRecord, setViewDetailsRecord] = useState<SubmittedOTRecord | null>(null);

  const [budgetPool] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cripton_ot_budget");
      return saved ? parseFloat(saved) : 50000;
    }
    return 50000;
  });

  useEffect(() => {
    localStorage.setItem("cripton_submitted_ot", JSON.stringify(submittedRecords));
  }, [submittedRecords]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const stats = useMemo(() => {
    let totalReqHours = 0;
    let totalApprovedHours = 0;

    submittedRecords.forEach((r) => {
      const hrs = r.reqOt + r.reqMot;
      totalReqHours += hrs;
      if (r.status === "Approved") totalApprovedHours += hrs;
    });

    const approvedCost = totalApprovedHours * 150; // Mock rate of 150/hr
    const remainingBudget = budgetPool - approvedCost;

    return {
      budgetPool,
      totalApprovedHours,
      totalReqHours,
      approvedCost,
      remainingBudget,
      pendingCount: submittedRecords.filter((r) => r.status === "Pending").length,
    };
  }, [submittedRecords, budgetPool]);

  const filteredRecords = useMemo(() => {
    return submittedRecords.filter((r) => {
      if (selectedStatus !== "ALL" && r.status !== selectedStatus) return false;
      if (selectedDept !== "ALL" && r.department !== selectedDept) return false;
      if (dateFrom && r.otDate < dateFrom) return false;
      if (dateTo && r.otDate > dateTo) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.employeeName.toLowerCase().includes(q) ||
          r.employeeId.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [submittedRecords, selectedStatus, selectedDept, searchQuery, dateFrom, dateTo]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(
        new Set(filteredRecords.filter((r) => r.status === "Pending").map((r) => r.id)),
      );
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUpdateStatus = (id: string, newStatus: "Approved" | "Rejected") => {
    if (newStatus === "Rejected") {
      const remarks = window.prompt("Please provide a reason for rejection:");
      if (remarks === null) return; // User cancelled
    }
    setSubmittedRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    toast.success(`Request ${newStatus.toLowerCase()} successfully!`);
  };

  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;

    // Check Budget Warning
    const totalPendingCost = submittedRecords
      .filter((r) => selectedIds.has(r.id))
      .reduce((sum, r) => sum + (r.reqOt + r.reqMot) * 150, 0);
    if (totalPendingCost > stats.remainingBudget) {
      if (
        !confirm(
          `WARNING: Approving these ${selectedIds.size} requests will exceed the corporate OT budget by ৳ ${(totalPendingCost - stats.remainingBudget).toLocaleString()}! Proceed anyway?`,
        )
      ) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to approve ${selectedIds.size} overtime requisitions?`))
        return;
    }

    setSubmittedRecords((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: "Approved" } : r)),
    );
    setSelectedIds(new Set());
    toast.success(`Successfully approved ${selectedIds.size} requests!`);
  };

  const handleBulkReject = () => {
    if (selectedIds.size === 0) return;
    const remarks = window.prompt("Please provide a reason for bulk rejection:");
    if (remarks === null) return;
    setSubmittedRecords((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: "Rejected" } : r)),
    );
    setSelectedIds(new Set());
    toast.success(`Successfully rejected ${selectedIds.size} requests!`);
  };

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert("No records to export.");
      return;
    }
    const headers = [
      "Req ID",
      "Employee Name",
      "Employee ID",
      "Department",
      "OT Date",
      "Requested Hours",
      "Status",
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.employeeName,
      r.employeeId,
      r.department,
      r.otDate,
      r.reqOt + r.reqMot,
      r.status,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `ot_approval_report_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen flex bg-[#f1f5f9] dark:bg-[#0b0f19] text-[#334155] dark:text-slate-200 overflow-hidden font-sans antialiased tracking-tight">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Topbar />

        <div className="flex-1 flex flex-col p-4 xl:p-6 gap-3.5 overflow-hidden bg-slate-50/50 dark:bg-slate-950/10">
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 print:hidden">
            <div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                <Link to="/" className="hover:text-[#2563eb] transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2" />
                <span className="hover:text-[#2563eb] transition-colors">HR Approvals</span>
                <ChevronRight className="size-2" />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">
                  OT Approvals
                </span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-600" />
                <span>Overtime Approval Center</span>
              </h1>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 shrink-0 print:hidden">
            <div className="bg-white dark:bg-slate-900 border border-[#1e88e5]/20 bg-[#1e88e5]/5 rounded-xl p-3 shadow-sm space-y-1">
              <span className="text-[9px] font-black tracking-wider uppercase opacity-75 text-[#1e88e5]">
                Global OT Budget
              </span>
              <div className="text-xl font-black text-[#1e88e5]">
                ৳ {stats.budgetPool.toLocaleString()}
              </div>
              <div className="text-[9px] font-semibold opacity-60 text-[#1e88e5]">
                Total Allocated Corporate Pool
              </div>
            </div>
            <div
              className={`bg-white dark:bg-slate-900 border rounded-xl p-3 shadow-sm space-y-1 ${stats.remainingBudget < 10000 ? "border-rose-500/20 bg-rose-500/5 text-rose-600" : "border-indigo-500/10 bg-indigo-500/5 text-indigo-600"}`}
            >
              <span className="text-[9px] font-black tracking-wider uppercase opacity-75">
                Remaining Balance
              </span>
              <div className="text-xl font-black">৳ {stats.remainingBudget.toLocaleString()}</div>
              <div className="text-[9px] font-semibold opacity-60">Available Budget for new OT</div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-emerald-500/10 bg-emerald-500/5 rounded-xl p-3 shadow-sm space-y-1 text-emerald-600">
              <span className="text-[9px] font-black tracking-wider uppercase opacity-75">
                Approved Liability
              </span>
              <div className="text-xl font-black">৳ {stats.approvedCost.toLocaleString()}</div>
              <div className="text-[9px] font-semibold opacity-60">
                {stats.totalApprovedHours} hours approved
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-amber-500/10 bg-amber-500/5 rounded-xl p-3 shadow-sm space-y-1 text-amber-600">
              <span className="text-[9px] font-black tracking-wider uppercase opacity-75">
                Pending Action
              </span>
              <div className="text-xl font-black">{stats.pendingCount} Requests</div>
              <div className="text-[9px] font-semibold opacity-60">
                Awaiting Management Approval
              </div>
            </div>
          </div>

          {/* Filters Area */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm shrink-0 print:hidden space-y-3">
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-8.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-[#2563eb]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Pending">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="h-8.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-[#2563eb]"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Admin">Admin</option>
                  <option value="Business Innovation">Business Innovation</option>
                  <option value="Business Automation">Business Automation</option>
                </select>

                <div className="relative flex-1 min-w-[200px]">
                  <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ID or Employee Name..."
                    className="w-full h-8.5 pl-8 pr-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-[#2563eb] transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleExportCSV}
                  className="h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition text-emerald-600"
                >
                  <Download className="size-3.5" /> Export
                </button>
                <button
                  onClick={() => window.print()}
                  className="h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition text-[#2563eb]"
                >
                  <Printer className="size-3.5" /> Print
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <label className="text-[9px] font-black text-slate-400 uppercase">
                  Date Range:
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-7.5 px-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] outline-none focus:border-[#2563eb]"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-7.5 px-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] outline-none focus:border-[#2563eb]"
                />
              </div>
              {(dateFrom || dateTo) && (
                <button
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                  }}
                  className="text-[10px] text-rose-500 font-bold hover:underline"
                >
                  Clear Dates
                </button>
              )}
            </div>
          </div>

          {/* Main Table Area */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden flex flex-col min-h-0">
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
                    records ready for action
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkReject}
                    className="h-7.5 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                  >
                    <XCircle className="size-3.5" /> Reject Selected
                  </button>
                  <button
                    onClick={handleBulkApprove}
                    className="h-7.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm"
                  >
                    <CheckCircle2 className="size-3.5" /> Approve Selected
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
                <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
                  <tr className="bg-slate-50 dark:bg-slate-950">
                    {selectedStatus === "Pending" && (
                      <th className="px-4 py-3 w-[50px] text-center border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                          onChange={handleSelectAll}
                          checked={
                            selectedIds.size ===
                              filteredRecords.filter((r) => r.status === "Pending").length &&
                            selectedIds.size > 0
                          }
                        />
                      </th>
                    )}
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-800 w-[100px]">
                      Req ID
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-800">
                      Employee Details
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center border-r border-slate-200 dark:border-slate-800 w-[120px]">
                      OT Date
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center border-r border-slate-200 dark:border-slate-800 w-[150px]">
                      Requested Hours
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center border-r border-slate-200 dark:border-slate-800 w-[120px]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center w-[100px] print:hidden">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 border-b border-slate-100 dark:divide-slate-800 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  {filteredRecords.map((row) => {
                    const isChecked = selectedIds.has(row.id);
                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isChecked ? "bg-[#2563eb]/5 dark:bg-[#2563eb]/10" : ""}`}
                      >
                        {selectedStatus === "Pending" && (
                          <td className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-800">
                            {row.status === "Pending" && (
                              <input
                                type="checkbox"
                                className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]"
                                checked={isChecked}
                                onChange={() => handleSelectOne(row.id)}
                              />
                            )}
                          </td>
                        )}
                        <td className="px-4 py-3 font-mono font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800">
                          {row.id}
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-slate-800 dark:text-slate-100">
                            {row.employeeName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {row.employeeId} • {row.department}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-mono border-r border-slate-200 dark:border-slate-800">
                          {row.otDate}
                        </td>
                        <td className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-800">
                          <div className="font-black text-slate-800 dark:text-slate-100 text-sm">
                            {row.reqOt + row.reqMot} hrs
                          </div>
                          <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                            (OT: {row.reqOt} | MOT: {row.reqMot})
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-800">
                          {row.status === "Pending" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                              <Clock className="size-3" /> Pending
                            </span>
                          )}
                          {row.status === "Approved" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                              <CheckCircle2 className="size-3" /> Approved
                            </span>
                          )}
                          {row.status === "Rejected" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
                              <AlertCircle className="size-3" /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center print:hidden">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewDetailsRecord(row);
                              }}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-[#2563eb] rounded transition"
                              title="View Details"
                            >
                              <Eye className="size-3.5" />
                            </button>
                            {row.status === "Pending" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(row.id, "Approved");
                                  }}
                                  className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-500 rounded transition"
                                  title="Approve"
                                >
                                  <CheckCircle2 className="size-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(row.id, "Rejected");
                                  }}
                                  className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 rounded transition"
                                  title="Reject"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-500 font-medium">
                        No OT requests found matching the current criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0 print:hidden">
              <div>Showing {filteredRecords.length} records</div>
              <div className="flex items-center gap-1.5">
                <button className="text-slate-400 hover:text-slate-600 transition-colors" disabled>
                  Previous
                </button>
                <button className="size-5.5 rounded bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-sm text-[9.5px]">
                  1
                </button>
                <button className="text-slate-400 hover:text-slate-600 transition-colors" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* View Details Modal */}
      {viewDetailsRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <h3 className="font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Timer className="size-4.5 text-emerald-600" />
                Overtime Justification
              </h3>
              <button
                onClick={() => setViewDetailsRecord(null)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded-lg transition"
              >
                <X className="size-4.5" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  Employee
                </label>
                <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {viewDetailsRecord.employeeName}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  {viewDetailsRecord.employeeId} • {viewDetailsRecord.department}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                    OT Date
                  </label>
                  <div className="font-mono text-sm font-bold">{viewDetailsRecord.otDate}</div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                    Total Hours
                  </label>
                  <div className="font-black text-emerald-600 text-sm">
                    {viewDetailsRecord.reqOt + viewDetailsRecord.reqMot} hrs
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Manager's Reason
                </label>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {viewDetailsRecord.reason || "No specific reason provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

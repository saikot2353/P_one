import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Timer, ChevronRight, Search, Printer, CheckCircle2,
  X, AlertCircle, LayoutDashboard, ShieldCheck, Download, Eye
} from "lucide-react";

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

  const [budgetPool, setBudgetPool] = useState<number>(() => {
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

  const stats = useMemo(() => {
    let totalReqHours = 0;
    let totalApprovedHours = 0;
    
    submittedRecords.forEach(r => {
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
      pendingCount: submittedRecords.filter(r => r.status === "Pending").length
    };
  }, [submittedRecords, budgetPool]);

  const filteredRecords = useMemo(() => {
    return submittedRecords.filter(r => {
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

  const handleUpdateStatus = (id: string, newStatus: "Approved" | "Rejected") => {
    if (newStatus === "Rejected") {
      const remarks = window.prompt("Please provide a reason for rejection:");
      if (remarks === null) return; // User cancelled
    }
    setSubmittedRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleBulkApprove = () => {
    const pendingIds = filteredRecords.filter(r => r.status === "Pending").map(r => r.id);
    if (pendingIds.length === 0) {
      alert("No pending records to approve in the current view.");
      return;
    }
    
    // Check Budget Warning
    const totalPendingCost = filteredRecords.filter(r => r.status === "Pending").reduce((sum, r) => sum + (r.reqOt + r.reqMot) * 150, 0);
    if (totalPendingCost > stats.remainingBudget) {
      if (!confirm(`WARNING: Approving these ${pendingIds.length} requests will exceed the corporate OT budget by ৳ ${(totalPendingCost - stats.remainingBudget).toLocaleString()}! Proceed anyway?`)) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to approve ${pendingIds.length} overtime requisitions?`)) return;
    }

    setSubmittedRecords(prev => prev.map(r => pendingIds.includes(r.id) ? { ...r, status: "Approved" } : r));
  };

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert("No records to export.");
      return;
    }
    const headers = ["Req ID", "Employee Name", "Employee ID", "Department", "OT Date", "Requested Hours", "Status"];
    const rows = filteredRecords.map(r => [
      r.id, r.employeeName, r.employeeId, r.department, r.otDate, r.reqOt + r.reqMot, r.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ot_approval_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* Header */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Manage Overtime</span>
                <ChevronRight className="size-2.5" />
                <span className="text-emerald-600 font-semibold">OT Approvals</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <ShieldCheck className="size-5.5 text-emerald-600" />
                <span>Overtime Approval Center</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Review, manage, and approve department overtime requisitions against the corporate budget.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleBulkApprove}
                className="h-9 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition uppercase tracking-wider"
              >
                <CheckCircle2 className="size-4" /> Bulk Approve Filtered
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
            <div className="p-4 rounded-xl border bg-card text-[#1e88e5] bg-[#1e88e5]/5 border-[#1e88e5]/10 shadow-xs space-y-1 transition duration-200">
              <span className="text-[10px] font-black tracking-wider uppercase opacity-75">Global OT Budget</span>
              <div className="text-2xl font-black">৳ {stats.budgetPool.toLocaleString()}</div>
              <div className="text-[10px] opacity-60 font-semibold mt-1">Total Allocated Corporate Pool</div>
            </div>
            <div className={`p-4 rounded-xl border bg-card shadow-xs space-y-1 transition duration-200 ${stats.remainingBudget < 10000 ? 'text-rose-600 bg-rose-500/5 border-rose-500/20' : 'text-indigo-600 bg-indigo-500/5 border-indigo-500/10'}`}>
              <span className="text-[10px] font-black tracking-wider uppercase opacity-75">Remaining Balance</span>
              <div className="text-2xl font-black">৳ {stats.remainingBudget.toLocaleString()}</div>
              <div className="text-[10px] opacity-60 font-semibold mt-1">Available Budget for new OT</div>
            </div>
            <div className="p-4 rounded-xl border bg-card text-emerald-600 bg-emerald-500/5 border-emerald-500/10 shadow-xs space-y-1 transition duration-200">
              <span className="text-[10px] font-black tracking-wider uppercase opacity-75">Approved Liability</span>
              <div className="text-2xl font-black">৳ {stats.approvedCost.toLocaleString()}</div>
              <div className="text-[10px] opacity-60 font-semibold mt-1">{stats.totalApprovedHours} hours approved</div>
            </div>
            <div className="p-4 rounded-xl border bg-card text-amber-600 bg-amber-500/5 border-amber-500/10 shadow-xs space-y-1 transition duration-200">
              <span className="text-[10px] font-black tracking-wider uppercase opacity-75">Pending Action</span>
              <div className="text-2xl font-black">{stats.pendingCount} Requests</div>
              <div className="text-[10px] opacity-60 font-semibold mt-1">Awaiting Management Approval</div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
            <div className="p-5 flex flex-col gap-4 border-b border-border/40 bg-muted/10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="h-9 px-4 rounded-lg bg-background border border-border/60 text-xs font-semibold outline-none focus:border-emerald-500 shadow-sm"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Pending">Pending Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="h-9 px-4 rounded-lg bg-background border border-border/60 text-xs font-semibold outline-none focus:border-emerald-500 shadow-sm"
                  >
                    <option value="ALL">All Departments</option>
                    <option value="Admin">Admin</option>
                    <option value="Business Innovation">Business Innovation</option>
                    <option value="Business Automation">Business Automation</option>
                  </select>

                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="size-4 text-muted-foreground/60 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search ID or Employee Name..."
                      className="w-full h-9 pl-9 pr-4 rounded-lg bg-background border border-border/60 text-xs font-semibold outline-none focus:border-emerald-500 transition shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 print:hidden shrink-0">
                  <button onClick={handleExportCSV} className="h-9 px-4 rounded-lg border border-border/60 bg-background hover:bg-muted font-bold text-xs flex items-center gap-1.5 transition shadow-sm text-emerald-600">
                    <Download className="size-3.5" /> Export CSV
                  </button>
                  <button onClick={() => window.print()} className="h-9 px-4 rounded-lg border border-border/60 bg-background hover:bg-muted font-bold text-xs flex items-center gap-1.5 transition shadow-sm text-blue-600">
                    <Printer className="size-3.5" /> Print
                  </button>
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="flex flex-wrap gap-4 items-center pt-3 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase">OT Date:</label>
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 px-2 rounded-md bg-background border border-border/60 text-xs outline-none focus:border-emerald-500" title="From Date" />
                  <span className="text-muted-foreground">-</span>
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 px-2 rounded-md bg-background border border-border/60 text-xs outline-none focus:border-emerald-500" title="To Date" />
                </div>
                {(dateFrom || dateTo) && (
                  <button onClick={() => { setDateFrom(""); setDateTo(""); }} className="text-[10px] text-rose-500 font-bold hover:underline ml-2">Clear Dates</button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs text-left">
                <thead>
                  <tr className="bg-[#f1f5f9] dark:bg-[#0f172a] text-foreground font-bold border-b border-border/50 select-none whitespace-nowrap text-[11px]">
                    <th className="px-5 py-3 border-r border-border/30">Req ID</th>
                    <th className="px-5 py-3 border-r border-border/30">Employee Details</th>
                    <th className="px-5 py-3 text-center border-r border-border/30">OT Date</th>
                    <th className="px-5 py-3 text-center border-r border-border/30">Requested Hours</th>
                    <th className="px-5 py-3 text-center border-r border-border/30">Status</th>
                    <th className="px-5 py-3 text-center print:hidden">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 font-sans text-xs">
                  {filteredRecords.map((row) => (
                    <tr key={row.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#1e293b]/30 transition duration-75">
                      <td className="px-5 py-3 font-mono font-bold text-foreground/70 border-r border-border/20">{row.id}</td>
                      <td className="px-5 py-3 border-r border-border/20">
                        <div className="font-black text-foreground">{row.employeeName}</div>
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          {row.employeeId} • {row.department}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center font-mono border-r border-border/20">
                        {row.otDate}
                      </td>
                      <td className="px-5 py-3 text-center border-r border-border/20">
                        <div className="font-black text-foreground text-sm">{row.reqOt + row.reqMot} hrs</div>
                        <div className="text-[9px] text-muted-foreground font-mono">
                          (OT: {row.reqOt} | MOT: {row.reqMot})
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center border-r border-border/20">
                        {row.status === "Pending" && (
                          <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-md text-[10px] font-bold border border-amber-500/20">
                            <Clock className="size-3" /> Pending
                          </span>
                        )}
                        {row.status === "Approved" && (
                          <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-md text-[10px] font-bold border border-emerald-500/20">
                            <CheckCircle2 className="size-3" /> Approved
                          </span>
                        )}
                        {row.status === "Rejected" && (
                          <span className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-md text-[10px] font-bold border border-rose-500/20">
                            <AlertCircle className="size-3" /> Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); setViewDetailsRecord(row); }}
                            className="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded transition"
                            title="View Details"
                          >
                            <Eye className="size-4" />
                          </button>
                          {row.status === "Pending" && (
                            <>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(row.id, "Approved"); }}
                                className="p-1.5 hover:bg-emerald-500/10 text-emerald-600 rounded transition"
                                title="Approve"
                              >
                                <CheckCircle2 className="size-4" />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(row.id, "Rejected"); }}
                                className="p-1.5 hover:bg-rose-500/10 text-rose-500 rounded transition"
                                title="Reject"
                              >
                                <X className="size-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground font-medium">
                        No OT requests found matching the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* View Details Modal */}
      {viewDetailsRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border/80 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/30">
              <h3 className="font-black text-foreground flex items-center gap-2">
                <Timer className="size-5 text-emerald-600" />
                Overtime Justification
              </h3>
              <button 
                onClick={() => setViewDetailsRecord(null)}
                className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Employee</label>
                <div className="font-bold text-sm text-foreground">{viewDetailsRecord.employeeName}</div>
                <div className="text-xs text-muted-foreground font-mono">{viewDetailsRecord.employeeId} • {viewDetailsRecord.department}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">OT Date</label>
                  <div className="font-mono text-sm">{viewDetailsRecord.otDate}</div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Total Hours</label>
                  <div className="font-black text-emerald-600 text-sm">{viewDetailsRecord.reqOt + viewDetailsRecord.reqMot} hrs</div>
                </div>
              </div>
              <div className="p-4 bg-muted/40 rounded-lg border border-border/50">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Manager's Reason</label>
                <p className="text-sm text-foreground leading-relaxed">
                  {viewDetailsRecord.reason || "No specific reason provided."}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-border/40 flex justify-end">
              <button 
                onClick={() => setViewDetailsRecord(null)}
                className="h-9 px-4 rounded-lg border border-border/60 hover:bg-muted font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}



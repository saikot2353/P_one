import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ChevronRight, CheckCircle2, XCircle, Search, 
  Printer, FileText, FileSpreadsheet, Eye,
  Banknote, CalendarClock, Download, FolderOpen, Activity
} from "lucide-react";

export const Route = createFileRoute("/approve-advance")({
  head: () => ({
    meta: [
      { title: "Advance Requisition Approvals — CRIPTON" },
      { name: "description", content: "Review and approve employee advance requisitions." },
    ],
  }),
  component: ApproveAdvancePage,
});

interface AdvanceRequest {
  id: string;
  empId: string;
  empName: string;
  designation: string;
  dept: string;
  amount: number;
  reqDate: string;
  type: string;
  remarks: string;
  status: "Pending" | "Approved" | "Rejected";
}

// Dummy Data
const initialPendingData: AdvanceRequest[] = [
  { id: "ADV-1001", empId: "2022041203", empName: "Khairul Bashar Masum", designation: "Asst. Manager", dept: "HR Team", amount: 3500.00, reqDate: "2026-04-10", type: "Salary Advance", remarks: "For personal emergency.", status: "Pending" },
  { id: "ADV-1002", empId: "2023043021", empName: "Easin Mia", designation: "Receptionist", dept: "Admin", amount: 10000.00, reqDate: "2026-04-12", type: "General Advance", remarks: "Medical expense.", status: "Pending" },
  { id: "ADV-1003", empId: "2023046001", empName: "Sohanur Rahman Sohan", designation: "Executive", dept: "Admin", amount: 5000.00, reqDate: "2026-04-15", type: "Salary Advance", remarks: "Advance for festival.", status: "Pending" },
  { id: "ADV-1004", empId: "2019013884", empName: "Javed Mia", designation: "Helper", dept: "Admin", amount: 2000.00, reqDate: "2026-04-01", type: "General Advance", remarks: "House shifting.", status: "Approved" },
];

function ApproveAdvancePage() {
  const [records, setRecords] = useState<AdvanceRequest[]>(initialPendingData);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [selectedType, setSelectedType] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (selectedStatus !== "ALL" && r.status !== selectedStatus) return false;
      if (selectedType !== "ALL" && r.type !== selectedType) return false;
      if (dateFrom && r.reqDate < dateFrom) return false;
      if (dateTo && r.reqDate > dateTo) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.empName.toLowerCase().includes(q) ||
          r.empId.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, selectedStatus, selectedType, searchQuery, dateFrom, dateTo]);

  const stats = useMemo(() => {
    let totalPending = 0;
    let pendingAmount = 0;
    let approvedAmount = 0;

    records.forEach(r => {
      if (r.status === "Pending") {
        totalPending++;
        pendingAmount += r.amount;
      } else if (r.status === "Approved") {
        approvedAmount += r.amount;
      }
    });

    return { totalPending, pendingAmount, approvedAmount, totalRecords: records.length };
  }, [records]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredRecords.filter(r => r.status === "Pending").map(r => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUpdateStatus = (id: string, newStatus: "Approved" | "Rejected") => {
    if (newStatus === "Rejected") {
      const remarks = window.prompt("Please provide a reason for rejection:");
      if (remarks === null) return;
    }
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    toast.success(`Advance request ${newStatus.toLowerCase()} successfully!`);
  };

  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to approve ${selectedIds.size} advance requests?`)) return;
    
    setRecords(prev => prev.map(r => selectedIds.has(r.id) ? { ...r, status: "Approved" } : r));
    setSelectedIds(new Set());
    toast.success(`Successfully approved ${selectedIds.size} requests!`);
  };

  const handleBulkReject = () => {
    if (selectedIds.size === 0) return;
    const remarks = window.prompt("Please provide a reason for bulk rejection:");
    if (remarks === null) return;

    setRecords(prev => prev.map(r => selectedIds.has(r.id) ? { ...r, status: "Rejected" } : r));
    setSelectedIds(new Set());
    toast.success(`Successfully rejected ${selectedIds.size} requests!`);
  };

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert("No records to export.");
      return;
    }
    const headers = ["Req ID", "Employee Name", "Employee ID", "Department", "Type", "Amount", "Req Date", "Status"];
    const rows = filteredRecords.map(r => [
      r.id, r.empName, r.empId, r.dept, r.type, r.amount, r.reqDate, r.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `advance_approvals_${new Date().toISOString().split("T")[0]}.csv`);
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
                <Link to="/" className="hover:text-[#2563eb] transition-colors">Home</Link>
                <ChevronRight className="size-2" />
                <span className="hover:text-[#2563eb] transition-colors">Payroll Approval</span>
                <ChevronRight className="size-2" />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">Advance Requisitions</span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <CalendarClock className="size-5 text-[#2563eb]" />
                <span>Advance Requisition Approvals</span>
              </h1>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 shrink-0 print:hidden">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-100 dark:border-slate-700">
                <FolderOpen className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Requests</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{stats.totalRecords} Records</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-emerald-500/10 bg-emerald-500/5 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-800">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wider">Approved Amount</p>
                <h3 className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">৳ {stats.approvedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-amber-500/10 bg-amber-500/5 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-100 dark:border-amber-800">
                <Activity className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-amber-600/70 dark:text-amber-500/70 uppercase tracking-wider">Pending Liability</p>
                <h3 className="text-sm font-extrabold text-amber-700 dark:text-amber-400 mt-0.5">৳ {stats.pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-[#1e88e5]/20 bg-[#1e88e5]/5 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-[#1e88e5] shrink-0 border border-[#1e88e5]/20">
                <Banknote className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#1e88e5]/70 uppercase tracking-wider">Pending Requisitions</p>
                <h3 className="text-sm font-extrabold text-[#1e88e5] mt-0.5">{stats.totalPending} Awaiting</h3>
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
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="h-8.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold outline-none focus:border-[#2563eb]"
                >
                  <option value="ALL">All Types</option>
                  <option value="Salary Advance">Salary Advance</option>
                  <option value="General Advance">General Advance</option>
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
                <button onClick={handleExportCSV} className="h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition text-emerald-600">
                  <Download className="size-3.5" /> Export
                </button>
                <button onClick={() => window.print()} className="h-8.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition text-[#2563eb]">
                  <Printer className="size-3.5" /> Print
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <label className="text-[9px] font-black text-slate-400 uppercase">Date Range:</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-7.5 px-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] outline-none focus:border-[#2563eb]" />
                <span className="text-slate-400">-</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-7.5 px-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] outline-none focus:border-[#2563eb]" />
              </div>
              {(dateFrom || dateTo) && (
                <button onClick={() => { setDateFrom(""); setDateTo(""); }} className="text-[10px] text-rose-500 font-bold hover:underline">Clear Dates</button>
              )}
            </div>
          </div>

          {/* Main Table Area */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden flex flex-col min-h-0">
            {selectedIds.size > 0 && (
              <div className="p-3 bg-[#2563eb]/5 border-b border-[#2563eb]/10 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-[#2563eb]/20 text-[#2563eb] hover:bg-[#2563eb]/20">
                    {selectedIds.size} Selected
                  </Badge>
                  <span className="text-[11px] font-medium text-slate-500">records ready for action</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleBulkReject} className="h-7.5 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all">
                    <XCircle className="size-3.5" /> Reject Selected
                  </button>
                  <button onClick={handleBulkApprove} className="h-7.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm">
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
                          checked={selectedIds.size === filteredRecords.filter(r => r.status === "Pending").length && selectedIds.size > 0}
                        />
                      </th>
                    )}
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-800 w-[100px]">Req ID</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-800">Employee Details</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center border-r border-slate-200 dark:border-slate-800 w-[120px]">Req Date</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center border-r border-slate-200 dark:border-slate-800 w-[120px]">Type</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right border-r border-slate-200 dark:border-slate-800 w-[120px]">Amount</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center border-r border-slate-200 dark:border-slate-800 w-[120px]">Status</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center w-[100px] print:hidden">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  {filteredRecords.map((row) => {
                    const isChecked = selectedIds.has(row.id);
                    return (
                      <tr key={row.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isChecked ? 'bg-[#2563eb]/5 dark:bg-[#2563eb]/10' : ''}`}>
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
                        <td className="px-4 py-3 font-mono font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800">{row.id}</td>
                        <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-slate-800 dark:text-slate-100">{row.empName}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {row.empId} • {row.dept} ({row.designation})
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-mono border-r border-slate-200 dark:border-slate-800">
                          {row.reqDate}
                        </td>
                        <td className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-800">
                          <Badge variant="outline" className="text-[9px] bg-transparent font-bold">
                            {row.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-rose-600 border-r border-slate-200 dark:border-slate-800">
                          {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-800">
                          {row.status === "Pending" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                              <Activity className="size-3" /> Pending
                            </span>
                          )}
                          {row.status === "Approved" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                              <CheckCircle2 className="size-3" /> Approved
                            </span>
                          )}
                          {row.status === "Rejected" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
                              <XCircle className="size-3" /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center print:hidden">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={(e) => { e.stopPropagation(); alert(`Remarks: ${row.remarks}`); }}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-[#2563eb] rounded transition"
                              title="View Details"
                            >
                              <Eye className="size-3.5" />
                            </button>
                            {row.status === "Pending" && (
                              <>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleUpdateStatus(row.id, "Approved"); }}
                                  className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-500 rounded transition"
                                  title="Approve"
                                >
                                  <CheckCircle2 className="size-3.5" />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleUpdateStatus(row.id, "Rejected"); }}
                                  className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 rounded transition"
                                  title="Reject"
                                >
                                  <XCircle className="size-3.5" />
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
                      <td colSpan={8} className="px-4 py-12 text-center text-slate-500 font-medium">
                        No advance requests found matching the current criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0 print:hidden">
              <div>Showing {filteredRecords.length} records</div>
              <div className="flex items-center gap-1.5">
                <button className="text-slate-400 hover:text-slate-600 transition-colors" disabled>Previous</button>
                <button className="size-5.5 rounded bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-sm text-[9.5px]">1</button>
                <button className="text-slate-400 hover:text-slate-600 transition-colors" disabled>Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

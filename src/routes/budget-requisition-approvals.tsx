import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ChevronRight, ShieldCheck, CheckCircle2, XCircle, Search, FolderOpen, Activity, Undo2, Users
} from "lucide-react";

export const Route = createFileRoute("/budget-requisition-approvals")({
  head: () => ({
    meta: [
      { title: "Requisition Approvals — CRIPTON" },
      { name: "description", content: "Layered approval Kanban for manpower requisitions." },
    ],
  }),
  component: RequisitionApprovalsPage,
});

interface RequisitionRecord {
  id: string;
  title: string;
  dept: string;
  headcount: number;
  salaryBudget: number;
  expectedDate: string;
  justification: string;
  status: "Awaiting HOD" | "Awaiting HR" | "Awaiting MD" | "Approved" | "Rejected";
  submittedBy: string;
  hodComment?: string;
  hrComment?: string;
  mdComment?: string;
}

const initialRequisitions: RequisitionRecord[] = [
  { id: "REQ-2026-002", title: "Asst. Manager (Sales)", dept: "Core Sales", headcount: 3, salaryBudget: 45000, expectedDate: "01/08/2026", justification: "Expansion in North division", status: "Awaiting MD", submittedBy: "Tanver Rahman Shaon" },
  { id: "REQ-2026-003", title: "Database Administrator", dept: "DBA", headcount: 1, salaryBudget: 120000, expectedDate: "10/07/2026", justification: "Backup configuration specialist needed", status: "Awaiting HR", submittedBy: "Md Rahat Hossain" },
  { id: "REQ-2026-004", title: "HR Generalist", dept: "Core Development (HR)", headcount: 1, salaryBudget: 55000, expectedDate: "20/07/2026", justification: "Increasing headcount administration load", status: "Awaiting HOD", submittedBy: "Zakir Hossain" },
  { id: "REQ-2026-005", title: "AI Integration Dev", dept: "Business Innovation", headcount: 2, salaryBudget: 152000, expectedDate: "05/07/2026", justification: "Workspace autocomplete development project", status: "Awaiting HR", submittedBy: "Tahmid Afsar Shapno" },
];

function RequisitionApprovalsPage() {
  const [requisitions, setRequisitions] = useState<RequisitionRecord[]>(initialRequisitions);
  const [activeTab, setActiveTab] = useState<"ALL" | "HOD" | "HR" | "MD">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredRequisitions = useMemo(() => {
    return requisitions.filter(r => {
      if (activeTab === "HOD" && r.status !== "Awaiting HOD") return false;
      if (activeTab === "HR" && r.status !== "Awaiting HR") return false;
      if (activeTab === "MD" && r.status !== "Awaiting MD") return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return r.id.toLowerCase().includes(query) || r.title.toLowerCase().includes(query) || r.dept.toLowerCase().includes(query);
      }
      return true;
    });
  }, [requisitions, searchQuery, activeTab]);

  // KPI Stats
  const totalCount = requisitions.length;
  const awaitingCount = requisitions.filter(r => r.status.startsWith("Awaiting")).length;
  const approvedCount = requisitions.filter(r => r.status === "Approved").length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(new Set(filteredRequisitions.map(r => r.id)));
    else setSelectedIds(new Set());
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkAction = (action: "APPROVE" | "REJECT") => {
    if (selectedIds.size === 0) return;

    setRequisitions(prev => prev.map(r => {
      if (!selectedIds.has(r.id)) return r;

      if (action === "REJECT") {
        return { ...r, status: "Rejected", mdComment: "Rejected in bulk action" };
      }

      let nextStatus: RequisitionRecord["status"] = r.status;
      let update: Partial<RequisitionRecord> = {};

      if (r.status === "Awaiting HOD") {
        nextStatus = "Awaiting HR";
        update.hodComment = "Bulk HOD Approved";
      } else if (r.status === "Awaiting HR") {
        nextStatus = "Awaiting MD";
        update.hrComment = "Bulk HR Verified";
      } else if (r.status === "Awaiting MD") {
        nextStatus = "Approved";
        update.mdComment = "Bulk MD Approved";
      }

      return { ...r, status: nextStatus, ...update };
    }));

    toast.success(`${selectedIds.size} requisition(s) successfully ${action === "APPROVE" ? "pushed to next layer" : "rejected"}.`);
    setSelectedIds(new Set());
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
                <Link to="/" className="hover:text-[#2563eb] transition-colors">Home</Link>
                <ChevronRight className="size-2" />
                <span className="hover:text-[#2563eb] transition-colors">Manpower Budget</span>
                <ChevronRight className="size-2" />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">Requisition Approvals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-[#2563eb]" />
                <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  Layered Requisition Approvals
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb] bg-[#2563eb]/5 border border-[#2563eb]/15 px-3 py-1.5 rounded-full select-none flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" /> Budget Governance
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
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Requisitions</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{totalCount} Queued</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-800">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Approved Budgets</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{approvedCount} Authorized</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 border border-amber-100 dark:border-amber-800">
                <Activity className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending Approvals</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{awaitingCount} Awaiting</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
              <div className="size-8.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-100 dark:border-indigo-800">
                <Users className="size-4" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Requested Headcount</p>
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{requisitions.reduce((acc, r) => acc + r.headcount, 0)} Posts</h3>
              </div>
            </div>
          </div>

          {/* Smart Filters (Tabs & Search) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-sm shrink-0">
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-inner">
                <button
                  onClick={() => setActiveTab("ALL")}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider ${activeTab === "ALL"
                      ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                >
                  All ({requisitions.length})
                </button>
                <button
                  onClick={() => setActiveTab("HOD")}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider ${activeTab === "HOD"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-purple-600/70 hover:text-purple-600"
                    }`}
                >
                  HOD Queue ({requisitions.filter(r => r.status === "Awaiting HOD").length})
                </button>
                <button
                  onClick={() => setActiveTab("HR")}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider ${activeTab === "HR"
                      ? "bg-[#2563eb] text-white shadow-sm"
                      : "text-[#2563eb]/70 hover:text-[#2563eb]"
                    }`}
                >
                  HR Queue ({requisitions.filter(r => r.status === "Awaiting HR").length})
                </button>
                <button
                  onClick={() => setActiveTab("MD")}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider ${activeTab === "MD"
                      ? "bg-rose-600 text-white shadow-sm"
                      : "text-rose-600/70 hover:text-rose-600"
                    }`}
                >
                  MD Queue ({requisitions.filter(r => r.status === "Awaiting MD").length})
                </button>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search title, ID, dept..."
                  className="w-full h-8 pl-9 pr-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold focus:outline-none text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Action Toolbar & Data Table */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg overflow-hidden flex flex-col min-h-0">
            
            {/* Bulk Action Bar - Sticky */}
            {selectedIds.size > 0 && (
              <div className="p-3 bg-[#2563eb]/5 border-b border-[#2563eb]/10 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-[#2563eb]/20 text-[#2563eb] hover:bg-[#2563eb]/20">
                    {selectedIds.size} Selected
                  </Badge>
                  <span className="text-[11px] font-medium text-slate-500">requisitions ready for action</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleBulkAction("REJECT")} className="h-7.5 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer">
                    <XCircle className="size-3.5" /> Bulk Reject
                  </button>
                  <button onClick={() => handleBulkAction("APPROVE")} className="h-7.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer">
                    <CheckCircle2 className="size-3.5" /> Push to Next Layer
                  </button>
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full min-w-[1000px] border-collapse text-left">
                <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
                  <tr className="bg-slate-50 dark:bg-slate-950">
                    <th className="px-4 py-3 w-[50px] text-center border-r border-slate-200 dark:border-slate-800">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]" 
                        onChange={handleSelectAll}
                        checked={selectedIds.size === filteredRequisitions.length && filteredRequisitions.length > 0}
                      />
                    </th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[120px]">Req ID</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest min-w-[200px]">Designation / Title</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[140px]">Department</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[90px]">Opening</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right w-[120px]">Salary Cap</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[160px]">Submitted By</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center w-[140px]">Status Layer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 border-b border-slate-100 dark:divide-slate-800 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {filteredRequisitions.map((r) => {
                    const isChecked = selectedIds.has(r.id);
                    let statusBadge = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
                    if (r.status === "Approved") statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
                    if (r.status === "Rejected") statusBadge = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";

                    return (
                      <tr key={r.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isChecked ? 'bg-[#2563eb]/5 dark:bg-[#2563eb]/10' : ''}`}>
                        <td className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-800">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]" 
                            checked={isChecked}
                            onChange={() => handleSelectRow(r.id)}
                          />
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-[#2563eb]">{r.id}</td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-800 dark:text-slate-100 block">{r.title}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate max-w-[200px]" title={r.justification}>{r.justification}</span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-600 dark:text-slate-400">{r.dept}</td>
                        <td className="px-4 py-3 font-black text-center text-slate-700 dark:text-slate-300">{r.headcount}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-600 dark:text-slate-400">৳{r.salaryBudget.toLocaleString()}</td>
                        <td className="px-4 py-3 text-[11px] font-bold text-slate-600 dark:text-slate-400">{r.submittedBy}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase border ${statusBadge}`}>
                            <span className={`size-1.5 rounded-full ${r.status === "Approved" ? "bg-emerald-500" : r.status === "Rejected" ? "bg-rose-500" : "bg-amber-500"}`} />
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRequisitions.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500 font-bold">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FolderOpen className="size-6 text-slate-300 dark:text-slate-600" />
                          <span>No requisitions found in this queue.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div>Showing 1 to {filteredRequisitions.length} entries</div>
              <div className="flex items-center gap-1.5">
                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-700 transition-colors" disabled>Previous</button>
                <button className="size-5.5 rounded bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-sm text-[9.5px]">1</button>
                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-700 transition-colors" disabled>Next</button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

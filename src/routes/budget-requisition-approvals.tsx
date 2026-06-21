import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Search, Check, X, ChevronRight, ShieldCheck, UserCheck, Play, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

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

  const handleWorkflowTransition = (id: string, action: "APPROVE" | "REJECT", comment: string) => {
    setRequisitions(prev => prev.map(r => {
      if (r.id !== id) return r;

      if (action === "REJECT") {
        return { ...r, status: "Rejected", mdComment: comment };
      }

      let nextStatus: RequisitionRecord["status"] = r.status;
      let update: Partial<RequisitionRecord> = {};

      if (r.status === "Awaiting HOD") {
        nextStatus = "Awaiting HR";
        update.hodComment = comment || "HOD Approved";
      } else if (r.status === "Awaiting HR") {
        nextStatus = "Awaiting MD";
        update.hrComment = comment || "HR Verified";
      } else if (r.status === "Awaiting MD") {
        nextStatus = "Approved";
        update.mdComment = comment || "MD Approved";
      }

      return { ...r, status: nextStatus, ...update };
    }));

    toast.success(`Request ${id} processed successfully!`);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 space-y-5">
          {/* Header */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Manpower Budget</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-extrabold">Requisition Approvals</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 text-primary">
                  <ShieldCheck className="size-5.5 text-primary" />
                </div>
                <span>Layered Requisition Approvals</span>
              </h1>
            </div>
          </div>

          {/* Workflow Queues */}
          <div className="flex items-center gap-2 flex-wrap text-[10px] font-black uppercase tracking-wide select-none border-b border-border/30 pb-3">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3 py-1.5 rounded-lg border transition duration-150 ${activeTab === "ALL" 
                ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-950" 
                : "bg-muted/40 border-border hover:bg-muted text-muted-foreground"}`}
            >
              All Pending ({requisitions.filter(r => r.status.startsWith("Awaiting")).length})
            </button>

            <button
              onClick={() => setActiveTab("HOD")}
              className={`px-3 py-1.5 rounded-lg border transition duration-150 ${activeTab === "HOD" 
                ? "bg-purple-600 border-purple-600 text-white" 
                : "bg-muted/40 border-border hover:bg-purple-500/5 text-purple-600"}`}
            >
              HOD Review Queue ({requisitions.filter(r => r.status === "Awaiting HOD").length})
            </button>

            <button
              onClick={() => setActiveTab("HR")}
              className={`px-3 py-1.5 rounded-lg border transition duration-150 ${activeTab === "HR" 
                ? "bg-blue-600 border-blue-600 text-white" 
                : "bg-muted/40 border-border hover:bg-blue-500/5 text-blue-600"}`}
            >
              HR Verify Queue ({requisitions.filter(r => r.status === "Awaiting HR").length})
            </button>

            <button
              onClick={() => setActiveTab("MD")}
              className={`px-3 py-1.5 rounded-lg border transition duration-150 ${activeTab === "MD" 
                ? "bg-rose-600 border-rose-600 text-white" 
                : "bg-muted/40 border-border hover:bg-rose-500/5 text-rose-500"}`}
            >
              MD Approval Queue ({requisitions.filter(r => r.status === "Awaiting MD").length})
            </button>
          </div>

          {/* Queue Ledger */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                {activeTab === "ALL" ? "Combined Approval Queue" : `${activeTab} Layer Approvals`}
              </span>
              <div className="relative w-full sm:w-72">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search requests..."
                  className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary outline-none text-xs font-bold transition duration-200"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-border/50 rounded-xl max-h-[60vh] shadow-3xs">
              <table className="min-w-[1000px] w-full border-collapse text-[10.5px] text-left">
                <thead>
                  <tr className="bg-[#f8fafc] dark:bg-slate-800/20 text-slate-800 dark:text-slate-250 font-black border-b border-slate-200 dark:border-slate-800/80">
                    <th className="px-4 py-3 font-extrabold w-28">Req ID</th>
                    <th className="px-4 py-3 font-extrabold w-48">Designation / Title</th>
                    <th className="px-4 py-3 font-extrabold w-36">Department</th>
                    <th className="px-4 py-3 font-extrabold text-center w-20">Opening</th>
                    <th className="px-4 py-3 font-extrabold text-right w-28">Salary Cap</th>
                    <th className="px-4 py-3 font-extrabold w-36">Submitted By</th>
                    <th className="px-4 py-3 font-extrabold w-28 text-center">Status Layer</th>
                    <th className="px-4 py-3 font-extrabold text-center w-32">Approve/Reject Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredRequisitions.map((r) => {
                    let statusBadge = "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400";
                    if (r.status === "Approved") statusBadge = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450";
                    if (r.status === "Rejected") statusBadge = "bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-455";

                    return (
                      <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition">
                        <td className="px-4 py-2.5 font-mono font-bold text-primary">{r.id}</td>
                        <td className="px-4 py-2.5">
                          <span className="font-extrabold text-foreground block">{r.title}</span>
                          <span className="text-[9px] text-muted-foreground/80 truncate max-w-[180px] block" title={r.justification}>{r.justification}</span>
                        </td>
                        <td className="px-4 py-2.5 font-bold text-muted-foreground">{r.dept}</td>
                        <td className="px-4 py-2.5 font-black text-center text-slate-700 dark:text-slate-350">{r.headcount}</td>
                        <td className="px-4 py-2.5 font-bold text-right text-muted-foreground">৳{r.salaryBudget.toLocaleString()}</td>
                        <td className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-400">{r.submittedBy}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase ${statusBadge}`}>
                            <span className={["size-1 rounded-full", r.status === "Approved" ? "bg-emerald-500" : r.status === "Rejected" ? "bg-rose-500" : "bg-amber-500"].join(" ")} />
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {r.status.startsWith("Awaiting") ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleWorkflowTransition(r.id, "APPROVE", "Layer cleared")}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] font-black uppercase transition flex items-center gap-0.5"
                                title="Approve / Forward"
                              >
                                <Check className="size-3" /> Push
                              </button>
                              <button
                                onClick={() => handleWorkflowTransition(r.id, "REJECT", "Rejected at current layer")}
                                className="p-1 bg-rose-600 hover:bg-rose-500 text-white rounded transition"
                                title="Reject"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[9px] font-bold text-muted-foreground">Actioned</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRequisitions.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground font-bold">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle className="size-6 text-slate-300 animate-bounce" />
                          <span>No requisitions found in this queue.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

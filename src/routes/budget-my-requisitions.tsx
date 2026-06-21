import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  FileText, Search, Plus, Trash2, ChevronRight, Briefcase, Eye, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/budget-my-requisitions")({
  head: () => ({
    meta: [
      { title: "My Requisitions — CRIPTON" },
      { name: "description", content: "Submit and track your manpower requisitions." },
    ],
  }),
  component: MyRequisitionsPage,
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

const initialMyRequisitions: RequisitionRecord[] = [
  { id: "REQ-2026-001", title: "Senior React Developer", dept: "WEB-Team", headcount: 2, salaryBudget: 95000, expectedDate: "15/07/2026", justification: "Required for Next.js portal rebuild", status: "Approved", submittedBy: "Tahmid Afsar Shapno" },
  { id: "REQ-2026-005", title: "AI Integration Dev", dept: "Business Innovation", headcount: 2, salaryBudget: 152000, expectedDate: "05/07/2026", justification: "Workspace autocomplete development project", status: "Awaiting HR", submittedBy: "Tahmid Afsar Shapno" },
];

function MyRequisitionsPage() {
  const [requisitions, setRequisitions] = useState<RequisitionRecord[]>(initialMyRequisitions);
  const [activeTab, setActiveTab] = useState<"MY_LIST" | "CREATE" | "TRACK">("MY_LIST");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReqId, setSelectedReqId] = useState<string>("REQ-2026-005");

  // Create Form States
  const [formTitle, setFormTitle] = useState("");
  const [formDept, setFormDept] = useState("WEB-Team");
  const [formHeadcount, setFormHeadcount] = useState("1");
  const [formSalary, setFormSalary] = useState("65000");
  const [formDate, setFormDate] = useState("2026-07-01");
  const [formJustification, setFormJustification] = useState("");

  const selectedReq = useMemo(() => {
    return requisitions.find(r => r.id === selectedReqId) || requisitions[0] || null;
  }, [requisitions, selectedReqId]);

  const filteredRequisitions = useMemo(() => {
    if (!searchQuery.trim()) return requisitions;
    const query = searchQuery.toLowerCase();
    return requisitions.filter(r =>
      r.id.toLowerCase().includes(query) ||
      r.title.toLowerCase().includes(query) ||
      r.dept.toLowerCase().includes(query)
    );
  }, [requisitions, searchQuery]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formJustification.trim()) {
      toast.error("Please fill in all mandatory fields!");
      return;
    }

    const head = parseInt(formHeadcount) || 1;
    const sal = parseInt(formSalary) || 0;

    const newReq: RequisitionRecord = {
      id: `REQ-2026-00${requisitions.length + 6}`,
      title: formTitle,
      dept: formDept,
      headcount: head,
      salaryBudget: sal,
      expectedDate: formDate.split("-").reverse().join("/"),
      justification: formJustification,
      status: "Awaiting HOD",
      submittedBy: "Tahmid Afsar Shapno"
    };

    setRequisitions(prev => [newReq, ...prev]);
    toast.success(`Requisition ${newReq.id} submitted for review!`);
    setActiveTab("MY_LIST");

    setFormTitle("");
    setFormJustification("");
  };

  const handleDelete = (id: string) => {
    if (confirm(`Withdraw requisition ${id}?`)) {
      setRequisitions(prev => prev.filter(r => r.id !== id));
      toast.success("Requisition withdrawn successfully.");
    }
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
                <span className="text-primary font-extrabold">My Requisitions</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 text-primary">
                  <Briefcase className="size-5.5 text-primary" />
                </div>
                <span>My Manpower Requisitions</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("CREATE")}
                className="h-10 px-4 bg-primary hover:bg-primary-glow hover:shadow-primary/15 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl shadow-xs transition duration-150 flex items-center gap-1.5 uppercase"
              >
                <Plus className="size-4" />
                <span>Submit New Request</span>
              </button>
            </div>
          </div>

          {/* Workflow Tabs */}
          <div className="flex items-center gap-2 flex-wrap text-[10px] font-black uppercase tracking-wide select-none border-b border-border/30 pb-3">
            <button
              onClick={() => setActiveTab("MY_LIST")}
              className={`px-3 py-1.5 rounded-lg border transition duration-150 ${activeTab === "MY_LIST" 
                ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-950" 
                : "bg-muted/40 border-border hover:bg-muted text-muted-foreground"}`}
            >
              <FileText className="size-3.5 inline-block mr-1.5 -mt-0.5" />
              My Requests List ({requisitions.length})
            </button>
            <button
              onClick={() => setActiveTab("TRACK")}
              className={`px-3 py-1.5 rounded-lg border transition duration-150 ${activeTab === "TRACK" 
                ? "bg-teal-650 border-teal-650 text-white" 
                : "bg-muted/40 border-border hover:bg-teal-500/5 text-teal-650"}`}
            >
              Live Tracker Stepper
            </button>
          </div>

          {/* Tab: MY_LIST */}
          {activeTab === "MY_LIST" && (
            <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                  Requisitions Submitted By Me
                </span>
                <div className="relative w-full sm:w-72">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search my requests..."
                    className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary outline-none text-xs font-bold transition duration-200"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-border/50 rounded-xl shadow-3xs max-h-[50vh]">
                <table className="min-w-[900px] w-full border-collapse text-[10.5px] text-left">
                  <thead>
                    <tr className="bg-[#f8fafc] dark:bg-slate-800/20 text-slate-800 dark:text-slate-250 font-black border-b border-slate-200 dark:border-slate-800/80">
                      <th className="px-4 py-3 font-extrabold">Req ID</th>
                      <th className="px-4 py-3 font-extrabold">Designation / Role</th>
                      <th className="px-4 py-3 font-extrabold">Department</th>
                      <th className="px-4 py-3 font-extrabold text-center">Headcount</th>
                      <th className="px-4 py-3 font-extrabold text-center">Required Date</th>
                      <th className="px-4 py-3 font-extrabold text-center">Current Status</th>
                      <th className="px-4 py-3 font-extrabold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredRequisitions.map((r) => {
                      let statusBadge = "bg-slate-100 text-slate-700 dark:bg-slate-950/20 dark:text-slate-450";
                      if (r.status === "Approved") statusBadge = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450";
                      if (r.status === "Rejected") statusBadge = "bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-455";
                      if (r.status.startsWith("Awaiting")) statusBadge = "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400";

                      return (
                        <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition">
                          <td className="px-4 py-2.5 font-mono font-bold text-primary">{r.id}</td>
                          <td className="px-4 py-2.5 font-extrabold text-foreground">{r.title}</td>
                          <td className="px-4 py-2.5 font-bold text-muted-foreground">{r.dept}</td>
                          <td className="px-4 py-2.5 font-black text-center text-slate-700 dark:text-slate-350">{r.headcount}</td>
                          <td className="px-4 py-2.5 font-semibold text-center text-muted-foreground">{r.expectedDate}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase ${statusBadge}`}>
                              <span className={["size-1 rounded-full", r.status === "Approved" ? "bg-emerald-500" : r.status === "Rejected" ? "bg-rose-500" : "bg-amber-500"].join(" ")} />
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => { setSelectedReqId(r.id); setActiveTab("TRACK"); }}
                                className="p-1.5 rounded border border-border hover:bg-muted text-primary transition"
                                title="Track Workflow"
                              >
                                <Eye className="size-3.5" />
                              </button>
                              {r.status === "Awaiting HOD" && (
                                <button
                                  onClick={() => handleDelete(r.id)}
                                  className="p-1.5 rounded border border-border hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 transition"
                                  title="Withdraw Request"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredRequisitions.length === 0 && (
                      <tr><td colSpan={7} className="px-4 py-16 text-center text-muted-foreground font-bold">No requests found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: CREATE */}
          {activeTab === "CREATE" && (
            <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-xs max-w-2xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="border-b border-border/40 pb-3 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-primary">New Manpower Requisition</span>
              </div>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Designation / Role Title <span className="text-rose-500">*</span></label>
                    <input type="text" required placeholder="e.g. Executive (Accounts)" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full h-9.5 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-semibold outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Department</label>
                    <select value={formDept} onChange={(e) => setFormDept(e.target.value)} className="w-full h-9.5 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none cursor-pointer">
                      <option>WEB-Team</option><option>Core Sales</option><option>Business Innovation</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Headcount</label>
                    <input type="number" value={formHeadcount} onChange={(e) => setFormHeadcount(e.target.value)} className="w-full h-9.5 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Salary Budget (BDT)</label>
                    <input type="number" value={formSalary} onChange={(e) => setFormSalary(e.target.value)} className="w-full h-9.5 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Expected Joining Date</label>
                    <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full h-9.5 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none cursor-pointer" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Justification <span className="text-rose-500">*</span></label>
                  <textarea value={formJustification} onChange={(e) => setFormJustification(e.target.value)} required rows={3} className="w-full p-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-semibold outline-none focus:border-primary" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setActiveTab("MY_LIST")} className="h-9 px-5 bg-card border border-border/50 hover:bg-muted text-muted-foreground font-semibold text-xs rounded-lg transition uppercase tracking-wider">Cancel</button>
                  <button type="submit" className="h-9 px-5 bg-primary hover:bg-primary-glow text-primary-foreground font-semibold text-xs rounded-lg transition uppercase tracking-wider shadow-sm">Submit Request</button>
                </div>
              </form>
            </div>
          )}

          {/* Tab: TRACKER */}
          {activeTab === "TRACK" && selectedReq && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-2">
              <div className="xl:col-span-1 bg-card border border-border p-5 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">Requisition Info</span>
                  <span className="text-[9px] font-mono font-bold text-muted-foreground/60">{selectedReq.id}</span>
                </div>
                <div className="space-y-3.5">
                  <div>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase block">Title</span>
                    <span className="text-sm font-black text-foreground">{selectedReq.title}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div><span className="text-[8.5px] font-bold text-muted-foreground uppercase block">Dept</span><span className="font-extrabold">{selectedReq.dept}</span></div>
                    <div><span className="text-[8.5px] font-bold text-muted-foreground uppercase block">Headcount</span><span className="font-extrabold">{selectedReq.headcount} Openings</span></div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/30 text-[11px] font-semibold text-muted-foreground italic">"{selectedReq.justification}"</div>
                </div>
                <div className="pt-2 border-t border-border/30">
                  <label className="text-[9px] font-black text-muted-foreground uppercase block mb-1">Select Track</label>
                  <select value={selectedReqId} onChange={(e) => setSelectedReqId(e.target.value)} className="w-full h-8.5 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer">
                    {requisitions.map(r => (<option key={r.id} value={r.id}>{r.id}</option>))}
                  </select>
                </div>
              </div>

              <div className="xl:col-span-2 bg-card border border-border p-5 rounded-2xl shadow-xs space-y-5">
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">Approval Workflow Status</span>
                <div className="relative pt-4 pb-4 px-4 flex items-center justify-between">
                  <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
                  <div className="relative z-10 flex flex-col items-center gap-1.5">
                    <div className="size-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">✓</div>
                    <span className="text-[9px] font-black uppercase text-foreground">Submitted</span>
                  </div>
                  {(() => {
                    const isPassed = selectedReq.status !== "Awaiting HOD";
                    const isCurrent = selectedReq.status === "Awaiting HOD";
                    return (
                      <div className="relative z-10 flex flex-col items-center gap-1.5">
                        <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${isPassed ? "bg-emerald-500 text-white" : isCurrent ? "bg-amber-500 text-white animate-pulse" : "bg-slate-100 text-slate-400"}`}>
                          {isPassed ? "✓" : "2"}
                        </div>
                        <span className="text-[9px] font-black uppercase text-foreground">HOD Review</span>
                      </div>
                    );
                  })()}
                  {(() => {
                    const isPassed = selectedReq.status !== "Awaiting HOD" && selectedReq.status !== "Awaiting HR";
                    const isCurrent = selectedReq.status === "Awaiting HR";
                    return (
                      <div className="relative z-10 flex flex-col items-center gap-1.5">
                        <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${isPassed ? "bg-emerald-500 text-white" : isCurrent ? "bg-amber-500 text-white animate-pulse" : "bg-slate-100 text-slate-400"}`}>
                          {isPassed ? "✓" : "3"}
                        </div>
                        <span className="text-[9px] font-black uppercase text-foreground">HR Verify</span>
                      </div>
                    );
                  })()}
                  {(() => {
                    const isPassed = selectedReq.status === "Approved";
                    const isCurrent = selectedReq.status === "Awaiting MD";
                    return (
                      <div className="relative z-10 flex flex-col items-center gap-1.5">
                        <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${isPassed ? "bg-emerald-500 text-white" : isCurrent ? "bg-amber-500 text-white animate-pulse" : "bg-slate-100 text-slate-400"}`}>
                          {isPassed ? "✓" : "4"}
                        </div>
                        <span className="text-[9px] font-black uppercase text-foreground">MD Approve</span>
                      </div>
                    );
                  })()}
                </div>
                <div className="bg-muted/30 border border-border/30 rounded-xl p-5 space-y-3.5">
                  <div className="flex items-center gap-2 border-b border-border/20 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-foreground">Progress Logs</span>
                  </div>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-start gap-3"><div className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" /><div><span className="font-extrabold text-foreground block">Submitted for Approval</span><span className="text-[10px] text-muted-foreground">Action by: {selectedReq.submittedBy}</span></div></div>
                    <div className="flex items-start gap-3"><div className={["size-1.5 rounded-full mt-1.5 shrink-0", selectedReq.status !== "Awaiting HOD" ? "bg-emerald-500" : "bg-slate-300"].join(" ")} /><div><span className="font-extrabold text-foreground block">HOD Evaluation Stage</span><span className="text-[10px] text-muted-foreground">Comment: {selectedReq.hodComment || "Awaiting action"}</span></div></div>
                    <div className="flex items-start gap-3"><div className={["size-1.5 rounded-full mt-1.5 shrink-0", (selectedReq.status !== "Awaiting HOD" && selectedReq.status !== "Awaiting HR") ? "bg-emerald-500" : "bg-slate-300"].join(" ")} /><div><span className="font-extrabold text-foreground block">HR Roster Verification Stage</span><span className="text-[10px] text-muted-foreground">Comment: {selectedReq.hrComment || "Awaiting action"}</span></div></div>
                    <div className="flex items-start gap-3"><div className={["size-1.5 rounded-full mt-1.5 shrink-0", selectedReq.status === "Approved" ? "bg-emerald-500" : "bg-slate-300"].join(" ")} /><div><span className="font-extrabold text-foreground block">MD Final Authorization Stage</span><span className="text-[10px] text-muted-foreground">Comment: {selectedReq.mdComment || "Awaiting action"}</span></div></div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

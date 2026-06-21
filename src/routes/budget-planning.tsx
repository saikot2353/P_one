import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Coins, Search, FileSpreadsheet, Printer, FileDown, Plus,
  ChevronRight, Trash2, Check, X, ShieldCheck, FileText, Database
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/budget-planning")({
  head: () => ({
    meta: [
      { title: "Budget Planning Hub — CRIPTON" },
      { name: "description", content: "Master workspace for Manpower Budget Planning, Setup, and Approvals." },
    ],
  }),
  component: BudgetPlanningPage,
});

interface StagedBudget {
  si: number;
  empType: string;
  section: string;
  designation: string;
  manpower: number;
  budgetAmt: number;
  totalAmt: number;
  dept: string;
  year: string;
}

interface CommittedBudget {
  sl: number;
  id: string;
  year: string;
  empType: string;
  dept: string;
  section: string;
  designation: string;
  manpower: number;
  appxBudgetPerPerson: number;
  totalBudget: number;
  status: "Approved" | "Awaiting Review";
  submittedBy: string;
}

const initialCommittedBudgets: CommittedBudget[] = [
  { sl: 1, id: "BUD-2026-01", year: "2026", empType: "Contractual Staff", dept: "Fashion 1", section: "F-1 Sewing", designation: "Medical Asst.", manpower: 1, appxBudgetPerPerson: 20000, totalBudget: 20000, status: "Approved", submittedBy: "HR Setup" },
  { sl: 2, id: "BUD-2026-02", year: "2026", empType: "Contractual Staff", dept: "Fashion 2", section: "F-2 Sewing", designation: "Asst. Supervisor", manpower: 1, appxBudgetPerPerson: 20000, totalBudget: 20000, status: "Approved", submittedBy: "HR Setup" },
  { sl: 3, id: "BUD-2026-901", year: "2026", empType: "Contractual Worker", dept: "Fashion 1", section: "F-1 Finishing", designation: "Operator", manpower: 15, appxBudgetPerPerson: 14000, totalBudget: 210000, status: "Awaiting Review", submittedBy: "Admin Office" },
];

function BudgetPlanningPage() {
  const [activeTab, setActiveTab] = useState<"ENTRY" | "LIST" | "APPROVALS">("ENTRY");
  const [stagedList, setStagedList] = useState<StagedBudget[]>([]);
  const [committedList, setCommittedList] = useState<CommittedBudget[]>(initialCommittedBudgets);
  const [searchQuery, setSearchQuery] = useState("");

  // Input states for Budget Entry
  const [year, setYear] = useState("2026");
  const [empType, setEmpType] = useState("Contractual Staff");
  const [dept, setDept] = useState("Fashion 1");
  const [section, setSection] = useState("F-1 Sewing");
  const [designation, setDesignation] = useState("Medical Asst.");
  const [manpower, setManpower] = useState("1");
  const [budgetAmt, setBudgetAmt] = useState("20000");

  const totalAmtCalculated = useMemo(() => {
    return (parseFloat(manpower) || 0) * (parseFloat(budgetAmt) || 0);
  }, [manpower, budgetAmt]);

  const handleAddStaged = (e: React.FormEvent) => {
    e.preventDefault();
    const head = parseInt(manpower) || 0;
    const rate = parseFloat(budgetAmt) || 0;
    if (head <= 0 || rate <= 0) return toast.error("Valid Manpower and Budget Amount required!");

    setStagedList(prev => [...prev, {
      si: prev.length + 1, empType, section, designation,
      manpower: head, budgetAmt: rate, totalAmt: head * rate, dept, year
    }]);
    toast.success("Budget parameters staged.");
  };

  const handleRemoveStaged = (si: number) => {
    setStagedList(prev => prev.filter(item => item.si !== si).map((item, idx) => ({ ...item, si: idx + 1 })));
  };

  const handleSubmitStaged = () => {
    if (stagedList.length === 0) return;
    const newItems: CommittedBudget[] = stagedList.map((staged, idx) => ({
      sl: committedList.length + idx + 1,
      id: `BUD-${staged.year}-NEW-${Math.floor(Math.random()*1000)}`,
      year: staged.year,
      empType: staged.empType,
      dept: staged.dept,
      section: staged.section,
      designation: staged.designation,
      manpower: staged.manpower,
      appxBudgetPerPerson: staged.budgetAmt,
      totalBudget: staged.totalAmt,
      status: "Awaiting Review",
      submittedBy: "Current User"
    }));
    setCommittedList(prev => [...prev, ...newItems]);
    setStagedList([]);
    toast.success(`Submitted ${newItems.length} budget proposals for review.`);
  };

  const handleBudgetApprove = (id: string) => {
    setCommittedList(prev => prev.map(b => b.id === id ? { ...b, status: "Approved" } : b));
    toast.success(`Budget proposal ${id} has been fully approved!`);
  };

  const handleBudgetReject = (id: string) => {
    setCommittedList(prev => prev.filter(b => b.id !== id));
    toast.error(`Budget proposal ${id} rejected.`);
  };

  const handleDeleteCommitted = (id: string) => {
    if (confirm(`Remove budget record ${id}?`)) {
      setCommittedList(prev => prev.filter(item => item.id !== id));
      toast.success("Budget record discarded.");
    }
  };

  const listTabItems = committedList.filter(b => b.status === "Approved" || b.status === "Awaiting Review");
  const approvalItems = committedList.filter(b => b.status === "Awaiting Review");

  const filteredItems = useMemo(() => {
    const listToFilter = activeTab === "APPROVALS" ? approvalItems : listTabItems;
    if (!searchQuery.trim()) return listToFilter;
    const query = searchQuery.toLowerCase();
    return listToFilter.filter(item => 
      item.id.toLowerCase().includes(query) || 
      item.dept.toLowerCase().includes(query) || 
      item.designation.toLowerCase().includes(query)
    );
  }, [listTabItems, approvalItems, activeTab, searchQuery]);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />
        <div className="p-4 md:p-6 space-y-4">
          
          {/* Header */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Manpower Budget</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-extrabold">Budget Planning Hub</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 text-primary">
                  <Database className="size-5.5 text-primary" />
                </div>
                <span>Strategic Budget Planning</span>
              </h1>
            </div>
          </div>

          {/* Master Tabs */}
          <div className="flex items-center gap-2 border-b border-border/40 pb-3 flex-wrap text-[10px] font-black uppercase tracking-wider">
            <button
              onClick={() => setActiveTab("ENTRY")}
              className={`px-4 py-2.5 rounded-lg border transition duration-150 flex items-center gap-2 ${activeTab === "ENTRY" 
                ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-950" 
                : "bg-muted/40 border-border hover:bg-muted text-muted-foreground"}`}
            >
              <Plus className="size-3.5" /> Budget Entry Setup
            </button>
            <button
              onClick={() => setActiveTab("LIST")}
              className={`px-4 py-2.5 rounded-lg border transition duration-150 flex items-center gap-2 ${activeTab === "LIST" 
                ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-950" 
                : "bg-muted/40 border-border hover:bg-muted text-muted-foreground"}`}
            >
              <FileText className="size-3.5" /> Approved Budget List
            </button>
            <button
              onClick={() => setActiveTab("APPROVALS")}
              className={`px-4 py-2.5 rounded-lg border transition duration-150 flex items-center gap-2 ${activeTab === "APPROVALS" 
                ? "bg-rose-600 border-rose-600 text-white" 
                : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:border-rose-900"}`}
            >
              <ShieldCheck className="size-3.5" /> Pending Approvals ({approvalItems.length})
            </button>
          </div>

          {/* TAB: ENTRY */}
          {activeTab === "ENTRY" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-in fade-in slide-in-from-bottom-2">
              <form onSubmit={handleAddStaged} className="lg:col-span-5 bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
                <div className="border-b border-border/40 pb-2">
                  <span className="text-[10px] font-black uppercase text-primary tracking-wider">Budget Strategy Form</span>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">Year *</label>
                    <select value={year} onChange={e => setYear(e.target.value)} className="w-full h-8.5 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer">
                      <option>2026</option><option>2027</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">Employee Type *</label>
                    <select value={empType} onChange={e => setEmpType(e.target.value)} className="w-full h-8.5 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none">
                      <option>Contractual Staff</option><option>Contractual Worker</option><option>Regular</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">Department *</label>
                    <select value={dept} onChange={e => setDept(e.target.value)} className="w-full h-8.5 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none">
                      <option>Fashion 1</option><option>Fashion 2</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">Section *</label>
                    <select value={section} onChange={e => setSection(e.target.value)} className="w-full h-8.5 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none">
                      <option>F-1 Sewing</option><option>F-1 Finishing</option>
                    </select>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">Designation *</label>
                    <select value={designation} onChange={e => setDesignation(e.target.value)} className="w-full h-8.5 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none">
                      <option>Medical Asst.</option><option>Operator</option><option>Folding Man</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">Target Headcount *</label>
                    <input type="number" value={manpower} onChange={e => setManpower(e.target.value)} className="w-full h-8.5 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-extrabold uppercase text-amber-500 tracking-wider block">Salary Budget/Head *</label>
                    <input type="number" value={budgetAmt} onChange={e => setBudgetAmt(e.target.value)} className="w-full h-8.5 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none focus:border-amber-500 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[8.5px] font-bold uppercase text-muted-foreground tracking-wider block">Total Allocated Amount (৳)</label>
                    <input type="text" readOnly value={totalAmtCalculated.toLocaleString()} className="w-full h-8 bg-muted text-[11px] font-bold font-mono outline-none px-3 rounded-lg border border-border/30 text-primary/80" />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button type="submit" className="h-8.5 px-5 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-[10px] tracking-wider transition uppercase rounded-lg">STAGE ENTRY</button>
                </div>
              </form>

              <div className="lg:col-span-7 bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="border-b border-border/40 pb-2"><span className="text-[10px] font-black uppercase text-primary tracking-wider">Staged Proposals</span></div>
                  <div className="overflow-x-auto border border-border/50 rounded-xl max-h-[30vh]">
                    <table className="min-w-[650px] w-full border-collapse text-[10px] text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/25 border-b border-border/60">
                        <tr>
                          <th className="px-3 py-2">Dep/Sec/Desig</th>
                          <th className="px-3 py-2 text-center">Heads</th>
                          <th className="px-3 py-2 text-right">Unit Rate</th>
                          <th className="px-3 py-2 text-right">Total Amt</th>
                          <th className="px-3 py-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {stagedList.map(item => (
                          <tr key={item.si} className="hover:bg-muted/40">
                            <td className="px-3 py-2 font-bold">{item.dept} - {item.section} <br/><span className="text-muted-foreground font-semibold">{item.designation}</span></td>
                            <td className="px-3 py-2 text-center font-black">{item.manpower}</td>
                            <td className="px-3 py-2 text-right font-mono">৳{item.budgetAmt.toLocaleString()}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-primary">৳{item.totalAmt.toLocaleString()}</td>
                            <td className="px-3 py-2 text-center">
                              <button onClick={() => handleRemoveStaged(item.si)} className="text-rose-500 hover:text-rose-600"><Trash2 className="size-3.5 m-auto" /></button>
                            </td>
                          </tr>
                        ))}
                        {stagedList.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground/60 font-semibold italic">No strategies staged.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button onClick={handleSubmitStaged} disabled={stagedList.length === 0} className="h-9 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-sm transition uppercase rounded-lg flex items-center gap-1.5"><Check className="size-4" /> SUBMIT FOR APPROVAL</button>
                </div>
              </div>
            </div>
          )}

          {/* TABS: LIST & APPROVALS (Shared Table Layout) */}
          {(activeTab === "LIST" || activeTab === "APPROVALS") && (
            <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-3">
                <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                  {activeTab === "APPROVALS" ? "Pending Approval Queue" : "Approved Budget Master List"}
                </span>
                <div className="relative w-full sm:w-72">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search records..." className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary outline-none text-xs font-bold transition" />
                </div>
              </div>

              <div className="overflow-x-auto border border-border/50 rounded-xl">
                <table className="min-w-[900px] w-full border-collapse text-[10px] text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/10 border-b border-border/60">
                    <tr>
                      <th className="px-4 py-2.5">Budget ID</th>
                      <th className="px-4 py-2.5">Year</th>
                      <th className="px-4 py-2.5">Department / Role</th>
                      <th className="px-3 py-2.5 text-center">Headcount</th>
                      <th className="px-4 py-2.5 text-right">Appx. Cost/Head</th>
                      <th className="px-4 py-2.5 text-right">Total Allocated</th>
                      <th className="px-4 py-2.5 text-center">Status</th>
                      <th className="px-4 py-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-muted/40">
                        <td className="px-4 py-2 font-mono font-bold text-primary">{item.id}</td>
                        <td className="px-4 py-2 font-bold">{item.year}</td>
                        <td className="px-4 py-2">
                          <span className="font-extrabold">{item.dept}</span><br />
                          <span className="text-muted-foreground font-semibold">{item.designation} ({item.section})</span>
                        </td>
                        <td className="px-3 py-2 text-center font-black text-slate-800 dark:text-slate-200">{item.manpower}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-muted-foreground">৳{item.appxBudgetPerPerson.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-mono font-black text-foreground">৳{item.totalBudget.toLocaleString()}</td>
                        <td className="px-4 py-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider ${item.status === "Approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          {activeTab === "APPROVALS" ? (
                            <div className="flex justify-center gap-1.5">
                              <button onClick={() => handleBudgetApprove(item.id)} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] font-black uppercase flex items-center gap-1"><Check className="size-3"/> Approve</button>
                              <button onClick={() => handleBudgetReject(item.id)} className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded"><X className="size-3"/></button>
                            </div>
                          ) : (
                            <button onClick={() => handleDeleteCommitted(item.id)} className="size-6 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded m-auto flex items-center justify-center"><Trash2 className="size-3" /></button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredItems.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-muted-foreground font-semibold">No records found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

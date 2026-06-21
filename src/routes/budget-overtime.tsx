import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Timer, Search, Plus, Trash2, Check,
  ChevronRight, AlertCircle, ShieldAlert,
  Clock, Coins, Settings2
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/budget-overtime")({
  head: () => ({
    meta: [
      { title: "Overtime Limits & Budgets — CRIPTON" },
      { name: "description", content: "Configure overtime hour limits and financial budgets per department." },
    ],
  }),
  component: BudgetOvertimePage,
});

interface OTRecord {
  id: string;
  dept: string;
  section: string;
  designation: string;
  maxOtHoursPerMonth: number;
  monthlyOtBudgetAmt: number;
  status: "Active" | "Warning";
}

const initialOTRecords: OTRecord[] = [
  { id: "OT-001", dept: "Fashion 1", section: "F-1 Sewing", designation: "Operator", maxOtHoursPerMonth: 52, monthlyOtBudgetAmt: 150000, status: "Active" },
  { id: "OT-002", dept: "Fashion 1", section: "F-1 Finishing", designation: "Iron Man", maxOtHoursPerMonth: 60, monthlyOtBudgetAmt: 85000, status: "Warning" },
  { id: "OT-003", dept: "Fashion 2", section: "F-2 Sewing", designation: "Jr. Operator", maxOtHoursPerMonth: 48, monthlyOtBudgetAmt: 90000, status: "Active" },
];

function BudgetOvertimePage() {
  const [records, setRecords] = useState<OTRecord[]>(initialOTRecords);
  const [activeTab, setActiveTab] = useState<"SETUP" | "LIST">("LIST");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [dept, setDept] = useState("Fashion 1");
  const [section, setSection] = useState("F-1 Sewing");
  const [designation, setDesignation] = useState("Operator");
  const [otHours, setOtHours] = useState("52");
  const [otBudget, setOtBudget] = useState("100000");

  const kpis = useMemo(() => {
    return {
      totalConfigs: records.length,
      warnings: records.filter(r => r.status === "Warning").length,
      totalMonthlyBudget: records.reduce((sum, r) => sum + r.monthlyOtBudgetAmt, 0)
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const query = searchQuery.toLowerCase();
    return records.filter(r =>
      r.dept.toLowerCase().includes(query) ||
      r.section.toLowerCase().includes(query) ||
      r.designation.toLowerCase().includes(query)
    );
  }, [records, searchQuery]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseInt(otHours) || 0;
    const amt = parseInt(otBudget) || 0;

    if (hours <= 0 || amt <= 0) {
      toast.error("Please provide valid limits and budgets.");
      return;
    }

    const newRecord: OTRecord = {
      id: `OT-00${records.length + 1}`,
      dept, section, designation,
      maxOtHoursPerMonth: hours,
      monthlyOtBudgetAmt: amt,
      status: "Active"
    };

    setRecords(prev => [newRecord, ...prev]);
    toast.success("Overtime rules configured successfully!");
    setActiveTab("LIST");
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this Overtime configuration?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
      toast.success("Configuration deleted.");
    }
  };

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
                <span className="text-primary font-extrabold">Overtime Control</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 text-primary">
                  <Timer className="size-5.5 text-primary" />
                </div>
                <span>Overtime Limits & Budgets</span>
              </h1>
            </div>
            <div>
              <button
                onClick={() => setActiveTab(activeTab === "LIST" ? "SETUP" : "LIST")}
                className="h-10 px-4 bg-primary hover:bg-primary-glow text-white font-extrabold text-xs rounded-xl shadow-xs transition duration-150 flex items-center gap-1.5 uppercase"
              >
                {activeTab === "LIST" ? <><Plus className="size-4" /> <span>Configure New Limit</span></> : "View Existing Configurations"}
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="bg-card border border-border/80 p-4 rounded-2xl shadow-3xs flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                <Settings2 className="size-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wide block">Active Rule Sets</span>
                <span className="text-base font-black text-foreground">{kpis.totalConfigs} Configs</span>
              </div>
            </div>

            <div className="bg-card border border-border/80 p-4 rounded-2xl shadow-3xs flex items-center gap-3">
              <div className="size-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                <ShieldAlert className="size-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wide block">Budget Infraction Warnings</span>
                <span className="text-base font-black text-rose-600 dark:text-rose-400">{kpis.warnings} Departments</span>
              </div>
            </div>

            <div className="bg-card border border-border/80 p-4 rounded-2xl shadow-3xs flex items-center gap-3">
              <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <Coins className="size-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wide block">Total Projected Monthly OT Budget</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">৳{kpis.totalMonthlyBudget.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {activeTab === "LIST" && (
            <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-3">
                <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                  Overtime Configuration Master List
                </span>
                <div className="relative w-full sm:w-72">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by Department, Designation..." className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary outline-none text-xs font-bold transition" />
                </div>
              </div>

              <div className="overflow-x-auto border border-border/50 rounded-xl">
                <table className="min-w-[900px] w-full border-collapse text-[10.5px] text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/10 border-b border-border/60">
                    <tr>
                      <th className="px-4 py-2.5 w-32">Department</th>
                      <th className="px-4 py-2.5 w-32">Section</th>
                      <th className="px-4 py-2.5 w-40">Designation</th>
                      <th className="px-4 py-2.5 text-center bg-indigo-500/5">OT Hour Limit / Month</th>
                      <th className="px-4 py-2.5 text-right bg-emerald-500/5">OT Budget (BDT)</th>
                      <th className="px-4 py-2.5 text-center">Status</th>
                      <th className="px-4 py-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-medium">
                    {filteredRecords.map(item => (
                      <tr key={item.id} className="hover:bg-muted/40 transition">
                        <td className="px-4 py-2.5 font-extrabold text-foreground">{item.dept}</td>
                        <td className="px-4 py-2.5 font-bold text-muted-foreground">{item.section}</td>
                        <td className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200">{item.designation}</td>
                        <td className="px-4 py-2.5 text-center font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/[0.02]">
                          <div className="flex items-center justify-center gap-1.5"><Clock className="size-3"/> {item.maxOtHoursPerMonth} hrs</div>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/[0.02]">
                          ৳{item.monthlyOtBudgetAmt.toLocaleString()}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {item.status === "Warning" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-rose-500/10 text-rose-600">
                              <AlertCircle className="size-3" /> Warning
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600">
                              <Check className="size-3" /> Active
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <button onClick={() => handleDelete(item.id)} className="size-6.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded m-auto flex items-center justify-center transition"><Trash2 className="size-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                    {filteredRecords.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground font-semibold">No Overtime configurations found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "SETUP" && (
            <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-xs max-w-2xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="border-b border-border/40 pb-3 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-primary">Overtime Parameter Setup Form</span>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Department *</label>
                    <select value={dept} onChange={(e) => setDept(e.target.value)} className="w-full h-9.5 px-3 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer">
                      <option>Fashion 1</option><option>Fashion 2</option><option>Admin</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Section *</label>
                    <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full h-9.5 px-3 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer">
                      <option>F-1 Sewing</option><option>F-1 Finishing</option><option>F-2 Sewing</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wide">Designation / Role Title *</label>
                    <select value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full h-9.5 px-3 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer">
                      <option>Operator</option><option>Iron Man</option><option>Folding Man</option><option>Medical Asst.</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-indigo-500 uppercase tracking-wide">Max OT Hours / Month *</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-indigo-500/60" />
                      <input type="number" value={otHours} onChange={(e) => setOtHours(e.target.value)} className="w-full h-9.5 pl-9 pr-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20 text-xs font-black text-indigo-700 outline-none focus:border-indigo-500" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-wide">Monthly OT Budget (BDT) *</label>
                    <div className="relative">
                      <Coins className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500/60" />
                      <input type="number" value={otBudget} onChange={(e) => setOtBudget(e.target.value)} className="w-full h-9.5 pl-9 pr-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs font-black text-emerald-700 outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setActiveTab("LIST")} className="h-9 px-5 bg-card border border-border/50 hover:bg-muted text-muted-foreground font-bold text-xs rounded-lg transition duration-150 uppercase tracking-wider">Cancel</button>
                  <button type="submit" className="h-9 px-5 bg-primary hover:bg-primary-glow text-primary-foreground font-bold text-xs rounded-lg transition duration-150 uppercase tracking-wider shadow-sm">Save Overtime Config</button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

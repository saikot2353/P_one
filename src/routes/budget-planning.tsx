import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Coins,
  Search,
  FileSpreadsheet,
  Printer,
  FileDown,
  Plus,
  ChevronRight,
  Trash2,
  Check,
  X,
  ShieldCheck,
  FileText,
  Database,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/budget-planning")({
  head: () => ({
    meta: [
      { title: "Budget Planning Hub — CRIPTON" },
      {
        name: "description",
        content: "Master workspace for Manpower Budget Planning, Setup, and Approvals.",
      },
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
  {
    sl: 1,
    id: "BUD-2026-01",
    year: "2026",
    empType: "Contractual Staff",
    dept: "Fashion 1",
    section: "F-1 Sewing",
    designation: "Medical Asst.",
    manpower: 1,
    appxBudgetPerPerson: 20000,
    totalBudget: 20000,
    status: "Approved",
    submittedBy: "HR Setup",
  },
  {
    sl: 2,
    id: "BUD-2026-02",
    year: "2026",
    empType: "Contractual Staff",
    dept: "Fashion 2",
    section: "F-2 Sewing",
    designation: "Asst. Supervisor",
    manpower: 1,
    appxBudgetPerPerson: 20000,
    totalBudget: 20000,
    status: "Approved",
    submittedBy: "HR Setup",
  },
  {
    sl: 3,
    id: "BUD-2026-901",
    year: "2026",
    empType: "Contractual Worker",
    dept: "Fashion 1",
    section: "F-1 Finishing",
    designation: "Operator",
    manpower: 15,
    appxBudgetPerPerson: 14000,
    totalBudget: 210000,
    status: "Awaiting Review",
    submittedBy: "Admin Office",
  },
];

function BudgetPlanningPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stagedList, setStagedList] = useState<StagedBudget[]>([]);
  const [committedList, setCommittedList] = useState<CommittedBudget[]>(initialCommittedBudgets);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");

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

    setStagedList((prev) => [
      ...prev,
      {
        si: prev.length + 1,
        empType,
        section,
        designation,
        manpower: head,
        budgetAmt: rate,
        totalAmt: head * rate,
        dept,
        year,
      },
    ]);
    toast.success("Budget parameters staged.");
  };

  const handleRemoveStaged = (si: number) => {
    setStagedList((prev) =>
      prev.filter((item) => item.si !== si).map((item, idx) => ({ ...item, si: idx + 1 })),
    );
  };

  const handleSubmitStaged = () => {
    if (stagedList.length === 0) return;
    const newItems: CommittedBudget[] = stagedList.map((staged, idx) => ({
      sl: committedList.length + idx + 1,
      id: `BUD-${staged.year}-NEW-${Math.floor(Math.random() * 1000)}`,
      year: staged.year,
      empType: staged.empType,
      dept: staged.dept,
      section: staged.section,
      designation: staged.designation,
      manpower: staged.manpower,
      appxBudgetPerPerson: staged.budgetAmt,
      totalBudget: staged.totalAmt,
      status: "Awaiting Review",
      submittedBy: "Current User",
    }));
    setCommittedList((prev) => [...prev, ...newItems]);
    setStagedList([]);
    setIsModalOpen(false);
    toast.success(`Submitted ${newItems.length} budget proposals for review.`);
  };

  const handleBudgetApprove = (id: string) => {
    setCommittedList((prev) => prev.map((b) => (b.id === id ? { ...b, status: "Approved" } : b)));
    toast.success(`Budget proposal ${id} has been fully approved!`);
  };

  const handleBudgetReject = (id: string) => {
    setCommittedList((prev) => prev.filter((b) => b.id !== id));
    toast.error(`Budget proposal ${id} rejected.`);
  };

  const handleDeleteCommitted = (id: string) => {
    if (confirm(`Remove budget record ${id}?`)) {
      setCommittedList((prev) => prev.filter((item) => item.id !== id));
      toast.success("Budget record discarded.");
    }
  };

  const filteredItems = useMemo(() => {
    let list = committedList;
    if (statusFilter !== "All") {
      list = list.filter((item) => item.status === statusFilter);
    }
    if (yearFilter !== "All") {
      list = list.filter((item) => item.year === yearFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.id.toLowerCase().includes(query) ||
          item.dept.toLowerCase().includes(query) ||
          item.designation.toLowerCase().includes(query),
      );
    }
    return list;
  }, [committedList, statusFilter, yearFilter, searchQuery]);

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
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 font-black text-xs shadow-sm transition uppercase rounded-lg flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="size-4" /> Create Budget
            </button>
          </div>

          {/* COMBINED LIST */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-3">
              <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                Budget Master List
              </span>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search records..."
                    className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary outline-none text-xs font-bold transition"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-8.5 px-3 rounded-lg bg-muted border border-border/40 focus:border-primary outline-none text-xs font-bold cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Awaiting Review">Awaiting Review</option>
                </select>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="h-8.5 px-3 rounded-lg bg-muted border border-border/40 focus:border-primary outline-none text-xs font-bold cursor-pointer"
                >
                  <option value="All">All Years</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
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
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/40">
                      <td className="px-4 py-2 font-mono font-bold text-primary">{item.id}</td>
                      <td className="px-4 py-2 font-bold">{item.year}</td>
                      <td className="px-4 py-2">
                        <span className="font-extrabold">{item.dept}</span>
                        <br />
                        <span className="text-muted-foreground font-semibold">
                          {item.designation} ({item.section})
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center font-black text-slate-800 dark:text-slate-200">
                        {item.manpower}
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-muted-foreground">
                        ৳{item.appxBudgetPerPerson.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-black text-foreground">
                        ৳{item.totalBudget.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider ${item.status === "Approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {item.status === "Awaiting Review" ? (
                          <div className="flex justify-center gap-1.5">
                            <button
                              onClick={() => handleBudgetApprove(item.id)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9px] font-black uppercase flex items-center gap-1"
                            >
                              <Check className="size-3" /> Approve
                            </button>
                            <button
                              onClick={() => handleBudgetReject(item.id)}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded"
                            >
                              <X className="size-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDeleteCommitted(item.id)}
                            className="size-6 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded m-auto flex items-center justify-center"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-8 text-center text-muted-foreground font-semibold"
                      >
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MODAL: BUDGET STRATEGY */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            <div
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative bg-background w-full max-w-6xl max-h-[92vh] rounded-[1.5rem] border border-border/50 shadow-2xl shadow-black/20 overflow-hidden flex flex-col zoom-in-95 animate-in duration-200">
              <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border/40 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                    <Database className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
                      Create Budget Strategy
                    </h2>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                      Stage multiple proposals and submit them together
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 rounded-xl transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto bg-muted/10">
                <form
                  onSubmit={handleAddStaged}
                  className="lg:col-span-5 bg-card border border-border/60 p-6 rounded-2xl shadow-3xs space-y-5 h-fit"
                >
                  <div className="flex items-center gap-2.5 border-b border-border/40 pb-3">
                    <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                      1
                    </div>
                    <span className="text-[11px] font-black uppercase text-foreground tracking-wider">
                      Budget Strategy Form
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">
                        Year *
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/50 text-xs font-bold outline-none cursor-pointer focus:border-primary transition-colors"
                      >
                        <option>2026</option>
                        <option>2027</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">
                        Employee Type *
                      </label>
                      <select
                        value={empType}
                        onChange={(e) => setEmpType(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/50 text-xs font-bold outline-none focus:border-primary transition-colors"
                      >
                        <option>Contractual Staff</option>
                        <option>Contractual Worker</option>
                        <option>Regular</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">
                        Department *
                      </label>
                      <select
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/50 text-xs font-bold outline-none focus:border-primary transition-colors"
                      >
                        <option>Fashion 1</option>
                        <option>Fashion 2</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">
                        Section *
                      </label>
                      <select
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/50 text-xs font-bold outline-none focus:border-primary transition-colors"
                      >
                        <option>F-1 Sewing</option>
                        <option>F-1 Finishing</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">
                        Designation *
                      </label>
                      <select
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/50 text-xs font-bold outline-none focus:border-primary transition-colors"
                      >
                        <option>Medical Asst.</option>
                        <option>Operator</option>
                        <option>Folding Man</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">
                        Target Headcount *
                      </label>
                      <input
                        type="number"
                        value={manpower}
                        onChange={(e) => setManpower(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-muted/50 border border-border/50 text-xs font-bold outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-extrabold uppercase text-amber-500 tracking-wider block">
                        Salary Budget/Head *
                      </label>
                      <input
                        type="number"
                        value={budgetAmt}
                        onChange={(e) => setBudgetAmt(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs font-bold outline-none focus:border-amber-500 text-amber-600 dark:text-amber-400 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2 mt-2">
                      <label className="text-[9.5px] font-bold uppercase text-muted-foreground tracking-wider block">
                        Total Allocated Amount (৳)
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={totalAmtCalculated.toLocaleString()}
                        className="w-full h-10 bg-primary/5 text-xs font-black font-mono outline-none px-4 rounded-xl border border-primary/20 text-primary"
                      />
                    </div>
                  </div>
                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="h-10 px-6 bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-[11px] tracking-wider transition uppercase rounded-xl shadow-sm"
                    >
                      STAGE ENTRY
                    </button>
                  </div>
                </form>

                <div className="lg:col-span-7 flex flex-col space-y-6">
                  <div className="bg-card border border-border/60 p-6 rounded-2xl shadow-3xs flex-1 flex flex-col">
                    <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="size-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-[10px]">
                          2
                        </div>
                        <span className="text-[11px] font-black uppercase text-foreground tracking-wider">
                          Staged Proposals
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                        {stagedList.length} items
                      </span>
                    </div>
                    <div className="overflow-x-auto border border-border/50 rounded-xl flex-1">
                      <table className="min-w-[650px] w-full border-collapse text-[10px] text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/40 border-b border-border/60">
                          <tr>
                            <th className="px-4 py-3 font-extrabold uppercase text-muted-foreground tracking-wider">Dep/Sec/Desig</th>
                            <th className="px-4 py-3 font-extrabold uppercase text-muted-foreground tracking-wider text-center">Heads</th>
                            <th className="px-4 py-3 font-extrabold uppercase text-muted-foreground tracking-wider text-right">Unit Rate</th>
                            <th className="px-4 py-3 font-extrabold uppercase text-muted-foreground tracking-wider text-right">Total Amt</th>
                            <th className="px-4 py-3 font-extrabold uppercase text-muted-foreground tracking-wider text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {stagedList.map((item) => (
                            <tr key={item.si} className="hover:bg-muted/40 transition-colors">
                              <td className="px-4 py-2.5 font-bold">
                                {item.dept} - {item.section} <br />
                                <span className="text-muted-foreground font-semibold">
                                  {item.designation}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-center font-black">{item.manpower}</td>
                              <td className="px-4 py-2.5 text-right font-mono text-muted-foreground font-bold">
                                ৳{item.budgetAmt.toLocaleString()}
                              </td>
                              <td className="px-4 py-2.5 text-right font-mono font-black text-primary">
                                ৳{item.totalAmt.toLocaleString()}
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <button
                                  onClick={() => handleRemoveStaged(item.si)}
                                  className="size-7 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg flex items-center justify-center m-auto transition-colors"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {stagedList.length === 0 && (
                            <tr>
                              <td
                                colSpan={5}
                                className="p-12 text-center text-muted-foreground/50 font-semibold italic flex-col items-center justify-center space-y-2"
                              >
                                <Database className="size-8 mx-auto opacity-20 mb-2" />
                                <div>No strategies staged yet.</div>
                                <div className="text-[9px] uppercase tracking-wider font-bold">Fill the form to start</div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="pt-6 flex justify-end mt-auto">
                      <button
                        onClick={handleSubmitStaged}
                        disabled={stagedList.length === 0}
                        className="h-11 px-8 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs shadow-md shadow-emerald-500/20 transition uppercase rounded-xl flex items-center gap-2"
                      >
                        <Check className="size-4.5" /> SUBMIT FOR APPROVAL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

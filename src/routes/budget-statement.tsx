import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  FileText, Search, FileSpreadsheet, Printer, FileDown, Plus,
  ChevronRight, Coins, RefreshCw, BarChart3, Users, Play, SearchCode
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/budget-statement")({
  head: () => ({
    meta: [
      { title: "Dashboard & Statement — CRIPTON" },
      { name: "description", content: "Compare actual manpower, budgeted positions, requisitions, and salary variances." },
    ],
  }),
  component: BudgetStatementPage,
});

interface StatementRecord {
  sl: number;
  type: string;
  dept: string;
  section: string;
  designation: string;
  manpower: number; // Actual onroll count
  budget: number;   // Budgeted headcount limit
  requested: number; // Requisitions pending/approved
  salary: number;    // Actual current salary
  budgetedSalary: number; // Budgeted salary cap
  requestedSalary: number; // Requisition requested salary
}

const mockStatementData: StatementRecord[] = [
  { sl: 1, type: "Contractual Staff", dept: "Fashion 1", section: "F-1 Sewing", designation: "Medical Asst.", manpower: 1, budget: 0, requested: 0, salary: 20000, budgetedSalary: 0, requestedSalary: 0 },
  { sl: 2, type: "Contractual Staff", dept: "Fashion 2", section: "F-2 Sewing", designation: "Asst. Supervisor", manpower: 1, budget: 0, requested: 0, salary: 20000, budgetedSalary: 0, requestedSalary: 0 },
  { sl: 3, type: "Contractual Staff", dept: "Fashion 2", section: "F-2 Sewing", designation: "Supervisor", manpower: 1, budget: 0, requested: 0, salary: 23000, budgetedSalary: 0, requestedSalary: 0 },
  { sl: 4, type: "Contractual Staff", dept: "Fashion-3", section: "F-3 Sewing", designation: "Supervisor", manpower: 2, budget: 0, requested: 0, salary: 40000, budgetedSalary: 0, requestedSalary: 0 },
  { sl: 5, type: "Contractual Worker", dept: "Fashion 1", section: "F-1 Finishing", designation: "Folding Man", manpower: 3, budget: 0, requested: 0, salary: 43273, budgetedSalary: 0, requestedSalary: 0 },
  { sl: 6, type: "Contractual Worker", dept: "Fashion 1", section: "F-1 Finishing", designation: "Iron Man", manpower: 4, budget: 0, requested: 0, salary: 57319, budgetedSalary: 0, requestedSalary: 0 },
  { sl: 7, type: "Contractual Worker", dept: "Fashion 1", section: "F-1 Finishing", designation: "Jr. Folding Man", manpower: 1, budget: 0, requested: 0, salary: 14549, budgetedSalary: 0, requestedSalary: 0 },
  { sl: 8, type: "Contractual Worker", dept: "Fashion 1", section: "F-1 Sewing", designation: "Jr. Operator", manpower: 1, budget: 0, requested: 0, salary: 14549, budgetedSalary: 0, requestedSalary: 0 },
  { sl: 9, type: "Contractual Worker", dept: "Fashion 1", section: "F-1 Sewing", designation: "Operator", manpower: 25, budget: 0, requested: 0, salary: 360213, budgetedSalary: 0, requestedSalary: 0 },
  { sl: 10, type: "Contractual Worker", dept: "Fashion 2", section: "F-2 Finishing", designation: "Folding Man", manpower: 2, budget: 0, requested: 0, salary: 28800, budgetedSalary: 0, requestedSalary: 0 },
  { sl: 11, type: "Contractual Worker", dept: "Fashion 2", section: "F-2 Finishing", designation: "Iron Man", manpower: 2, budget: 0, requested: 0, salary: 28800, budgetedSalary: 0, requestedSalary: 0 },
  { sl: 12, type: "Contractual Worker", dept: "Fashion 2", section: "F-2 Sewing", designation: "Folding Man", manpower: 1, budget: 0, requested: 0, salary: 14500, budgetedSalary: 0, requestedSalary: 0 },
  { sl: 13, type: "Contractual Worker", dept: "Fashion 2", section: "F-2 Sewing", designation: "Jr. Operator", manpower: 12, budget: 0, requested: 0, salary: 162600, budgetedSalary: 0, requestedSalary: 0 },
];

function BudgetStatementPage() {
  const [data, setData] = useState<StatementRecord[]>(mockStatementData);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters state
  const [filterRegion, setFilterRegion] = useState("KAC Fashion- Factory");
  const [filterEmpType, setFilterEmpType] = useState("ALL");
  const [filterDept, setFilterDept] = useState("All Departments");
  const [filterSection, setFilterSection] = useState("All Sections");
  const [filterDesignation, setFilterDesignation] = useState("ALL");

  const [activeFilters, setActiveFilters] = useState({
    region: "KAC Fashion- Factory",
    empType: "ALL",
    dept: "All Departments",
    section: "All Sections",
    designation: "ALL"
  });

  const handleSearchTrigger = () => {
    setActiveFilters({
      region: filterRegion,
      empType: filterEmpType,
      dept: filterDept,
      section: filterSection,
      designation: filterDesignation
    });
    toast.success("Statement dashboard query executed successfully!");
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // 1. Employee Type Filter
      if (activeFilters.empType !== "ALL" && item.type !== activeFilters.empType) return false;

      // 2. Department Filter
      if (activeFilters.dept !== "All Departments" && item.dept !== activeFilters.dept) return false;

      // 3. Section Filter
      if (activeFilters.section !== "All Sections" && item.section !== activeFilters.section) return false;

      // 4. Designation Filter
      if (activeFilters.designation !== "ALL" && item.designation !== activeFilters.designation) return false;

      // 5. Search text box matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.dept.toLowerCase().includes(query) ||
          item.section.toLowerCase().includes(query) ||
          item.designation.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [data, searchQuery, activeFilters]);

  // Totals calculations
  const totals = useMemo(() => {
    return filteredData.reduce((sum, item) => {
      const shortHeadcount = item.manpower - item.budget - item.requested;
      const shortSalary = item.salary - item.budgetedSalary - item.requestedSalary;

      return {
        manpower: sum.manpower + item.manpower,
        budget: sum.budget + item.budget,
        requested: sum.requested + item.requested,
        shortHeadcount: sum.shortHeadcount + shortHeadcount,
        salary: sum.salary + item.salary,
        budgetedSalary: sum.budgetedSalary + item.budgetedSalary,
        requestedSalary: sum.requestedSalary + item.requestedSalary,
        shortSalary: sum.shortSalary + shortSalary
      };
    }, {
      manpower: 0, budget: 0, requested: 0, shortHeadcount: 0,
      salary: 0, budgetedSalary: 0, requestedSalary: 0, shortSalary: 0
    });
  }, [filteredData]);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 space-y-4">
          
          {/* Breadcrumb and Header */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-2.5" />
                <span className="text-muted-foreground/75">Manpower Budget</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-extrabold">Dashboard & Statement</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 text-primary">
                  <BarChart3 className="size-5.5 text-primary" />
                </div>
                <span>Budget Dashboard & Statement</span>
              </h1>
            </div>
          </div>

          {/* Region and Filters bar (Top Block - matching screenshot 1/3) */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs grid grid-cols-2 md:grid-cols-5 xl:grid-cols-6 gap-3.5 items-end">
            {/* Region */}
            <div className="space-y-1.5">
              <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">Region</label>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="w-full h-8.5 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer"
              >
                <option>KAC Fashion- Factory</option>
                <option>Dhaka Headquarters</option>
              </select>
            </div>

            {/* Employee Type */}
            <div className="space-y-1.5">
              <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">Employee Type</label>
              <select
                value={filterEmpType}
                onChange={(e) => setFilterEmpType(e.target.value)}
                className="w-full h-8.5 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="ALL">ALL</option>
                <option value="Contractual Staff">Contractual Staff</option>
                <option value="Contractual Worker">Contractual Worker</option>
              </select>
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">Department</label>
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="w-full h-8.5 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="All Departments">All Departments</option>
                <option value="Fashion 1">Fashion 1</option>
                <option value="Fashion 2">Fashion 2</option>
                <option value="Fashion-3">Fashion 3</option>
              </select>
            </div>

            {/* Section */}
            <div className="space-y-1.5">
              <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">Section</label>
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="w-full h-8.5 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="All Sections">All Sections</option>
                <option value="F-1 Sewing">F-1 Sewing</option>
                <option value="F-2 Sewing">F-2 Sewing</option>
                <option value="F-3 Sewing">F-3 Sewing</option>
                <option value="F-1 Finishing">F-1 Finishing</option>
                <option value="F-2 Finishing">F-2 Finishing</option>
              </select>
            </div>

            {/* Designation */}
            <div className="space-y-1.5">
              <label className="text-[9.5px] font-extrabold uppercase text-muted-foreground tracking-wider block">Designation</label>
              <select
                value={filterDesignation}
                onChange={(e) => setFilterDesignation(e.target.value)}
                className="w-full h-8.5 px-2.5 rounded-lg bg-muted border border-border/40 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="ALL">ALL</option>
                <option value="Medical Asst.">Medical Asst.</option>
                <option value="Asst. Supervisor">Asst. Supervisor</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Folding Man">Folding Man</option>
                <option value="Iron Man">Iron Man</option>
                <option value="Jr. Operator">Jr. Operator</option>
                <option value="Operator">Operator</option>
              </select>
            </div>

            {/* QSEARCH button */}
            <div>
              <button
                onClick={handleSearchTrigger}
                className="w-full h-8.5 bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/10 active:scale-[0.98] text-white font-extrabold text-[10.5px] tracking-wider rounded-lg shadow-xs transition duration-150 flex items-center justify-center gap-1.5 uppercase cursor-pointer"
              >
                <SearchCode className="size-4" />
                <span>QSEARCH</span>
              </button>
            </div>
          </div>

          {/* Main Statement Ledger Block */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            
            {/* Toolbar row with print buttons and search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toast.success("Manpower statement exported successfully to Excel!")}
                  className="h-8.5 px-3.5 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-500" />
                  <span>EXCEL</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="h-8.5 px-3.5 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition"
                >
                  <Printer className="size-3.5 text-blue-500" />
                  <span>PRINT</span>
                </button>
                <button
                  onClick={() => toast.success("Statement PDF download generated.")}
                  className="h-8.5 px-3.5 rounded-lg border border-border/70 hover:bg-muted font-bold text-xs text-foreground/80 hover:text-foreground flex items-center gap-1.5 transition"
                >
                  <FileDown className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Text Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in grid..."
                  className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-muted border border-border/40 focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/10 outline-none text-xs font-bold transition duration-200"
                />
              </div>
            </div>

            {/* Comparison Data Grid Table */}
            <div className="overflow-x-auto border border-border/50 rounded-xl shadow-3xs max-h-[55vh]">
              <table className="min-w-[1250px] w-full border-collapse text-[10.5px] text-left">
                
                {/* Multi-Tier Table Head */}
                <thead>
                  <tr className="bg-sky-100/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 font-extrabold border-b border-border select-none text-center">
                    <th colSpan={5} className="px-4 py-2 border-r border-border/60">Specification</th>
                    <th colSpan={4} className="px-4 py-2 border-r border-border/60 bg-sky-200/10 dark:bg-sky-950/5">Manpower Roster (Headcount)</th>
                    <th colSpan={4} className="px-4 py-2">Financial Budget Variance (Monthly BDT)</th>
                  </tr>
                  <tr className="bg-slate-100/60 dark:bg-slate-800/20 text-slate-700 dark:text-slate-300 font-bold border-b border-border/80 select-none whitespace-nowrap">
                    <th className="px-3.5 py-2.5 w-12 border-r border-border/40 text-center">SL</th>
                    <th className="px-4 py-2.5 w-32 border-r border-border/40">Employee Type</th>
                    <th className="px-4 py-2.5 w-32 border-r border-border/40">Department</th>
                    <th className="px-4 py-2.5 w-32 border-r border-border/40">Section</th>
                    <th className="px-4 py-2.5 w-36 border-r border-border/60">Designation</th>
                    
                    {/* Manpower headcount sub-headers */}
                    <th className="px-3 py-2.5 text-center w-20 border-r border-border/40 bg-sky-200/5">Onroll</th>
                    <th className="px-3 py-2.5 text-center w-20 border-r border-border/40 bg-sky-200/5">Budget</th>
                    <th className="px-3 py-2.5 text-center w-20 border-r border-border/40 bg-sky-200/5">Requested</th>
                    <th className="px-3.5 py-2.5 text-center w-24 border-r border-border/60 bg-sky-200/10">Short/Excess</th>
                    
                    {/* Financial salary sub-headers */}
                    <th className="px-4 py-2.5 text-right w-28 border-r border-border/40">Onroll Salary</th>
                    <th className="px-4 py-2.5 text-right w-28 border-r border-border/40">Budgeted</th>
                    <th className="px-4 py-2.5 text-right w-28 border-r border-border/40">Requested</th>
                    <th className="px-4 py-2.5 text-right w-32 font-extrabold">Short/Excess</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/60 font-medium">
                  {filteredData.map((item, idx) => {
                    // Headcount diff
                    const headcountShortExcess = item.manpower - item.budget - item.requested;
                    
                    // Salary diff
                    const salaryShortExcess = item.salary - item.budgetedSalary - item.requestedSalary;

                    return (
                      <tr key={item.sl} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition duration-75 whitespace-nowrap">
                        {/* 1-5. Specification */}
                        <td className="px-3.5 py-2 text-center border-r border-border/40 font-bold text-muted-foreground/60">{idx + 1}</td>
                        <td className="px-4 py-2 border-r border-border/40 text-slate-700 dark:text-slate-400">{item.type}</td>
                        <td className="px-4 py-2 border-r border-border/40 text-slate-800 dark:text-slate-350">{item.dept}</td>
                        <td className="px-4 py-2 border-r border-border/40 text-slate-650 dark:text-slate-400 font-semibold">{item.section}</td>
                        <td className="px-4 py-2 border-r border-border/60 font-extrabold text-foreground truncate max-w-[150px]" title={item.designation}>{item.designation}</td>

                        {/* 6-9. Manpower Headcounts */}
                        <td className="px-3 py-2 text-center border-r border-border/40 bg-sky-200/5 font-black text-slate-850 dark:text-slate-200">{item.manpower}</td>
                        <td className="px-3 py-2 text-center border-r border-border/40 bg-sky-200/5 font-extrabold text-slate-500 dark:text-slate-400">{item.budget}</td>
                        <td className="px-3 py-2 text-center border-r border-border/40 bg-sky-200/5 font-bold text-muted-foreground/60">{item.requested}</td>
                        <td className="px-3.5 py-2 text-center border-r border-border/60 bg-sky-200/10 font-black text-orange-600 dark:text-orange-400">
                          {headcountShortExcess > 0 ? (
                            <span className="inline-flex items-center gap-0.5">
                              {headcountShortExcess} <span className="text-[10px] text-amber-500 font-black">+</span>
                            </span>
                          ) : headcountShortExcess < 0 ? (
                            <span className="text-rose-500">{headcountShortExcess}</span>
                          ) : (
                            "0"
                          )}
                        </td>

                        {/* 10-13. Salary Projections */}
                        <td className="px-4 py-2 text-right border-r border-border/40 font-mono font-bold text-slate-800 dark:text-slate-300">৳{item.salary.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right border-r border-border/40 font-mono font-bold text-muted-foreground/60">৳{item.budgetedSalary.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right border-r border-border/40 font-mono font-semibold text-muted-foreground/45">৳{item.requestedSalary.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-mono font-black text-orange-600 dark:text-orange-400 bg-amber-500/[0.02]">
                          {salaryShortExcess > 0 ? (
                            `৳${salaryShortExcess.toLocaleString()}`
                          ) : salaryShortExcess < 0 ? (
                            <span className="text-rose-500">-৳{Math.abs(salaryShortExcess).toLocaleString()}</span>
                          ) : (
                            "৳0"
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={13} className="px-4 py-16 text-center text-muted-foreground font-bold">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle className="size-6 text-slate-300 animate-bounce" />
                          <span>No comparison records match the filter criteria.</span>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Summary Totals Row */}
                  {filteredData.length > 0 && (
                    <tr className="bg-muted/30 font-black border-t border-border select-none">
                      <td colSpan={5} className="px-4 py-3 text-right font-black border-r border-border/60 text-foreground uppercase tracking-wider">Total Sum:</td>
                      <td className="px-3 py-3 text-center border-r border-border/40 bg-sky-200/5 text-foreground">{totals.manpower}</td>
                      <td className="px-3 py-3 text-center border-r border-border/40 bg-sky-200/5 text-slate-600 dark:text-slate-400">{totals.budget}</td>
                      <td className="px-3 py-3 text-center border-r border-border/40 bg-sky-200/5 text-slate-500">{totals.requested}</td>
                      <td className="px-3.5 py-3 text-center border-r border-border/60 bg-sky-200/10 text-orange-600 dark:text-orange-400">{totals.shortHeadcount} +</td>
                      <td className="px-4 py-3 text-right border-r border-border/40 font-mono text-foreground">৳{totals.salary.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right border-r border-border/40 font-mono text-muted-foreground">৳{totals.budgetedSalary.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right border-r border-border/40 font-mono text-muted-foreground/60">৳{totals.requestedSalary.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono text-orange-600 dark:text-orange-400 bg-amber-500/[0.04]">৳{totals.shortSalary.toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-1 select-none flex items-center justify-between text-[9.5px] font-bold text-muted-foreground/75 uppercase tracking-wider">
              <span>Showing {filteredData.length} of {data.length} records</span>
              <span>KAC Fashion Wear Ltd Comparison Ledger</span>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

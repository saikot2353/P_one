import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, FileText, Printer, FileDown, Search, Filter, CalendarRange,
  Building, CheckCircle2, TrendingUp
} from "lucide-react";
import { 
  loadAssessments, loadKpiCycles, loadGradeBands, DEPARTMENT_LIST 
} from "@/lib/kpi-data";

export const Route = createFileRoute("/kpi-report")({
  head: () => ({
    meta: [
      { title: "KPI Reports — CRIPTON" },
      { name: "description", content: "Generate and export comprehensive performance evaluation reports." },
    ],
  }),
  component: KpiReportPage,
});

function KpiReportPage() {
  const [cycles] = useState(() => loadKpiCycles());
  const [assessments] = useState(() => loadAssessments());
  const [bands] = useState(() => loadGradeBands());

  // Filter States
  const [activeCycle, setActiveCycle] = useState(cycles.length > 0 ? cycles[0].id : "");
  const [activeDepartment, setActiveDepartment] = useState("All Departments");
  const [activeGrade, setActiveGrade] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssessments = useMemo(() => {
    return assessments.filter(a => {
      if (a.cycleId !== activeCycle) return false;
      // Reports usually focus on completed/in-progress assessments
      if (a.status === "Pending") return false;
      if (activeDepartment !== "All Departments" && a.department !== activeDepartment) return false;
      if (activeGrade !== "All" && a.gradeResult !== activeGrade) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!a.employeeName.toLowerCase().includes(q) &&
            !a.employeeId.toLowerCase().includes(q) &&
            !a.designation.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [assessments, activeCycle, activeDepartment, activeGrade, searchQuery]);

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
                <span className="text-muted-foreground/75">KPI</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold">Reports</span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <FileText className="size-5.5 text-primary" />
                <span>Performance Evaluation Reports</span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => alert("Excel Export Complete.")} className="h-9 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5">
                <FileDown className="size-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>
              <button onClick={() => window.print()} className="h-9 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5">
                <Printer className="size-3.5 text-primary" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <CalendarRange className="size-3.5 text-primary" /> Cycle
              </label>
              <select
                value={activeCycle}
                onChange={(e) => setActiveCycle(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
              >
                {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Building className="size-3.5 text-emerald-500" /> Department
              </label>
              <select
                value={activeDepartment}
                onChange={(e) => setActiveDepartment(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
              >
                {DEPARTMENT_LIST.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Filter className="size-3.5 text-amber-500" /> Grade Band
              </label>
              <select
                value={activeGrade}
                onChange={(e) => setActiveGrade(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-bold outline-none focus:border-[#1e88e5]"
              >
                <option value="All">All Grades</option>
                {bands.map(b => <option key={b.id} value={b.grade}>{b.grade} ({b.assessment})</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Search className="size-3.5 text-muted-foreground" /> Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, ID or Designation..."
                className="w-full h-9 px-3 rounded-lg bg-muted/40 border border-border/40 text-xs font-semibold outline-none focus:border-[#1e88e5]"
              />
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-card rounded-lg border border-border/80 shadow-xs overflow-hidden">
            {/* Print Header */}
            <div className="hidden print:block p-6 border-b border-border/80 text-center">
              <h2 className="text-xl font-black text-foreground">CRIPTON KPI Report</h2>
              <p className="text-sm font-semibold text-muted-foreground mt-1">
                Cycle: {cycles.find(c => c.id === activeCycle)?.name}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/40 text-[9.5px] uppercase font-black tracking-wider text-muted-foreground/60">
                    <th className="px-4 py-3 text-center w-12">#</th>
                    <th className="px-4 py-3">Employee ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3 text-right">Current Gross</th>
                    <th className="px-4 py-3 text-center">Score</th>
                    <th className="px-4 py-3 text-center">Grade</th>
                    <th className="px-4 py-3 text-right">Increment</th>
                    <th className="px-4 py-3 text-right">New Gross</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-xs font-semibold">
                  {filteredAssessments.map((item, idx) => {
                    const gradeColor = bands.find(b => b.grade === item.gradeResult)?.color || "#94a3b8";
                    return (
                      <tr key={item.id} className="hover:bg-muted/10">
                        <td className="px-4 py-3 text-center text-muted-foreground/50 font-bold">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono text-foreground/80">{item.employeeId}</td>
                        <td className="px-4 py-3 font-bold text-foreground">{item.employeeName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.designation}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.department}</td>
                        <td className="px-4 py-3 text-right font-mono">{item.grossSalary.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center font-black" style={{ color: gradeColor }}>
                          {item.totalWeightedScore > 0 ? `${item.totalWeightedScore}%` : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.gradeResult ? (
                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-black border" style={{ color: gradeColor, borderColor: `${gradeColor}40`, backgroundColor: `${gradeColor}10` }}>
                              {item.gradeResult}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-emerald-600">
                          {item.incAmount > 0 ? `+${item.incAmount.toLocaleString()}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold">
                          {item.newGrossSalary > 0 ? item.newGrossSalary.toLocaleString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase border ${
                            item.status === "Completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                            "bg-[#1e88e5]/10 text-[#1e88e5] border-[#1e88e5]/20"
                          }`}>
                            {item.status === "Completed" ? <CheckCircle2 className="size-2.5" /> : <TrendingUp className="size-2.5" />}
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredAssessments.length === 0 && (
                    <tr>
                      <td colSpan={11} className="text-center py-10 text-xs font-bold text-muted-foreground">
                        No assessment reports found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-border/30 bg-muted/10 text-[11px] font-semibold text-muted-foreground flex justify-between print:hidden">
              <span>Showing {filteredAssessments.length} records</span>
              <span>Generated on {new Date().toLocaleDateString()}</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

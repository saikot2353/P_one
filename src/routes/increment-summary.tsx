import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, Sparkles, Search, FileSpreadsheet, Printer, FileDown
} from "lucide-react";

export const Route = createFileRoute("/increment-summary")({
  head: () => ({
    meta: [{ title: "Increment Summary — CRIPTON" }],
  }),
  component: IncrementSummaryPage,
});

interface SummaryRecord {
  empType: string;
  department: string;
  unit: string;
  line: string;
  personCount: number;
  incrementAmount: number;
  incMonth: string;
  remarks: string;
}

const mockSummaryRecords: SummaryRecord[] = [
  { empType: "Office Executive", department: "Admin", unit: "N/A", line: "N/A", personCount: 1, incrementAmount: 5000, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "Admin", unit: "PSL", line: "N/A", personCount: 1, incrementAmount: 2500, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "APPS Team", unit: "PSL", line: "N/A", personCount: 1, incrementAmount: 10000, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "Business Analysis", unit: "PSL", line: "N/A", personCount: 1, incrementAmount: 2000, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "Core Development (HR)", unit: "PSL", line: "N/A", personCount: 3, incrementAmount: 24000, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "Core Sales", unit: "PSL", line: "N/A", personCount: 5, incrementAmount: 15000, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "DBA", unit: "PSL", line: "N/A", personCount: 1, incrementAmount: 2000, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "ERP Team", unit: "PSL", line: "N/A", personCount: 1, incrementAmount: 3000, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "ERP Team", unit: "PSL", line: "N/A", personCount: 1, incrementAmount: 6000, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "ERP Team", unit: "PSL", line: "N/A", personCount: 2, incrementAmount: 15000, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "General ERP (Com, A/C, Fixed Asset, Vat)", unit: "PSL", line: "N/A", personCount: 3, incrementAmount: 18000, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "HR Team", unit: "PSL", line: "N/A", personCount: 1, incrementAmount: 1000, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "Implementation & Support (HR)", unit: "PSL", line: "N/A", personCount: 3, incrementAmount: 15000, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "Project Resource & Strategy", unit: "PSL", line: "N/A", personCount: 1, incrementAmount: 5000, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "RMG-Production-IE & Planning", unit: "PSL", line: "N/A", personCount: 1, incrementAmount: 5000, incMonth: "Jan,2026", remarks: "null" },
  { empType: "Office Executive", department: "Textile Team", unit: "PSL", line: "N/A", personCount: 1, incrementAmount: 10000, incMonth: "Jan,2026", remarks: "null" }
];

function IncrementSummaryPage() {
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Jan");
  const [company, setCompany] = useState("Pakiza Software Limited");
  const [area, setArea] = useState("PSL-Operation");
  const [empType, setEmpType] = useState("ALL");
  const [department, setDepartment] = useState("All Departments");
  const [section, setSection] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [gender, setGender] = useState("ALL");

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = useMemo(() => {
    return mockSummaryRecords.filter(row => {
      // Dept filter
      if (department !== "All Departments" && row.department !== department) return false;
      // EmpType filter
      if (empType !== "ALL" && row.empType !== empType) return false;

      // Text Query Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return row.department.toLowerCase().includes(q) || row.empType.toLowerCase().includes(q);
      }
      return true;
    });
  }, [department, empType, searchQuery]);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">

          {/* Breadcrumbs */}
          <div className="bg-card rounded-lg border border-border/85 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>Human Resource</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Increment Summary</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Sparkles className="size-5.5 text-primary" />
                <span>Increment Summary Ledger</span>
              </h1>
            </div>
          </div>

          {/* PARAMETRIC FILTERS ROW */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Year</label>
                <select value={year} onChange={e => setYear(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Month</label>
                <select value={month} onChange={e => setMonth(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="Jan">Jan</option>
                  <option value="Dec">Dec</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Company</label>
                <select value={company} onChange={e => setCompany(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="Pakiza Software Limited">Pakiza Software Limited</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Area</label>
                <select value={area} onChange={e => setArea(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="PSL-Operation">PSL-Operation</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Employee Type</label>
                <select value={empType} onChange={e => setEmpType(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                  <option value="Office Executive">Office Executive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-3 border-t border-border/20">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Department</label>
                <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="All Departments">All Departments</option>
                  <option value="Admin">Admin</option>
                  <option value="Core Development (HR)">Core Development (HR)</option>
                  <option value="Core Sales">Core Sales</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Section</label>
                <select value={section} onChange={e => setSection(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Designation</label>
                <select value={designation} onChange={e => setDesignation(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Unit</label>
                <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Line</label>
                <select value={line} onChange={e => setLine(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1 flex items-end justify-between gap-3">
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Gender</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                    <option value="ALL">ALL</option>
                  </select>
                </div>
                <button onClick={() => alert("Search compiled.")} className="h-8 px-4 bg-primary hover:opacity-95 text-primary-foreground font-black text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center justify-center gap-1">
                  <Search className="size-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE SUMMARY GRID */}
          <div className="bg-card rounded-lg border border-border/80 p-5 shadow-xs space-y-4">

            {/* Table Export Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-border/20">
              <div className="flex items-center gap-2">
                <button onClick={() => alert("Excel Export Complete.")} className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="size-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button onClick={() => window.print()} className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5">
                  <Printer className="size-3.5 text-primary" />
                  <span>Print</span>
                </button>
                <button onClick={() => alert("PDF Export Complete.")} className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5">
                  <FileDown className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase whitespace-nowrap">Search:</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Quick Search..."
                  className="h-8.5 w-44 pl-3 pr-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold text-foreground outline-none"
                />
              </div>
            </div>

            {/* Standard Multi-Column Table Layout */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="text-[9.5px] uppercase font-bold tracking-wider text-muted-foreground/60 border-b border-border/30 bg-muted/20">
                    <th className="px-3 py-3 text-center">#</th>
                    <th className="px-4 py-3">Emp Type</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-3 py-3 text-center">Unit</th>
                    <th className="px-3 py-3 text-center">Line</th>
                    <th className="px-3 py-3 text-center">Person</th>
                    <th className="px-4 py-3 text-right text-primary">Increment Amount</th>
                    <th className="px-4 py-3 text-center">Inc Month</th>
                    <th className="px-4 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredRecords.map((row, idx) => {
                    return (
                      <tr key={idx} className="hover:bg-muted/40 transition">
                        <td className="px-3 py-3 text-center font-mono font-bold text-muted-foreground/60">{idx + 1}</td>
                        <td className="px-4 py-3 font-extrabold text-foreground">{row.empType}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{row.department}</td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground">{row.unit}</td>
                        <td className="px-3 py-3 text-center font-mono text-muted-foreground">{row.line}</td>
                        <td className="px-3 py-3 text-center font-bold text-foreground">{row.personCount}</td>
                        <td className="px-4 py-3 text-right font-mono font-black text-primary">৳{row.incrementAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center font-semibold text-muted-foreground">{row.incMonth}</td>
                        <td className="px-4 py-3 text-muted-foreground/50 italic">{row.remarks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Submissions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-border/25">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries
              </span>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight, Sparkles, Search, FileSpreadsheet, Printer, FileDown, Eye, CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/increment-list")({
  head: () => ({
    meta: [{ title: "Increment List — CRIPTON" }],
  }),
  component: IncrementListPage,
});

interface ListRecord {
  id: string;
  name: string;
  department: string;
  section: string;
  descBefore: string;
  descAfter: string;
  prevGross: number;
  currentGross: number;
  incAmount: number;
  month: string;
  arrear: string;
}

const mockListRecords: ListRecord[] = [
  { id: "2024053060", name: "Md. Mahfujul Haque", department: "Core Development", section: "General ERP (Com, A/C, Fixed Asset, Vat)", descBefore: "Manager", descAfter: "Manager", prevGross: 80000.00, currentGross: 88000.00, incAmount: 8000.00, month: "Jan,2026", arrear: "No" },
  { id: "2024053062", name: "Mohammad Mayhedi Hasan", department: "Core Development", section: "General ERP (Com, A/C, Fixed Asset, Vat)", descBefore: "Deputy Manager", descAfter: "Deputy Manager", prevGross: 70000.00, currentGross: 74000.00, incAmount: 4000.00, month: "Jan,2026", arrear: "No" },
  { id: "2025053377", name: "Md. Maruf Hossen", department: "Business Development", section: "Core Sales", descBefore: "Asst. Manager", descAfter: "Asst. Manager", prevGross: 55000.00, currentGross: 58000.00, incAmount: 3000.00, month: "Jan,2026", arrear: "No" },
  { id: "2025053673", name: "Md Jahid Hasan Polok", department: "Core Development", section: "General ERP (Com, A/C, Fixed Asset, Vat)", descBefore: "Sr. Executive", descAfter: "Sr. Executive", prevGross: 40000.00, currentGross: 46000.00, incAmount: 6000.00, month: "Jan,2026", arrear: "No" },
  { id: "2025054315", name: "Md. Shahinur Alahi Khan", department: "Business Development", section: "Core Sales", descBefore: "Asst. Manager", descAfter: "Asst. Manager", prevGross: 50000.00, currentGross: 53000.00, incAmount: 3000.00, month: "Jan,2026", arrear: "No" },
  { id: "2025054548", name: "Md Rahat Hossain", department: "Database Administrator (DBA)", section: "DBA", descBefore: "Asst. Manager", descAfter: "Asst. Manager", prevGross: 65000.00, currentGross: 67000.00, incAmount: 2000.00, month: "Jan,2026", arrear: "No" },
  { id: "2025055045", name: "Md. Mahfuzur Rahman", department: "Business Automation (HR)", section: "Implementation & Support (HR)", descBefore: "Jr. Executive", descAfter: "Jr. Executive", prevGross: 18000.00, currentGross: 22000.00, incAmount: 4000.00, month: "Jan,2026", arrear: "No" },
  { id: "2025055747", name: "Sabbir Hossen Babu", department: "HR, Admin and Compliance", section: "Admin", descBefore: "Office Boy", descAfter: "Office Boy", prevGross: 10000.00, currentGross: 11500.00, incAmount: 1500.00, month: "Jan,2026", arrear: "No" },
  { id: "2025056473", name: "Hasnain", department: "HR, Admin and Compliance", section: "Admin", descBefore: "Cleaner", descAfter: "Cleaner", prevGross: 11000.00, currentGross: 12000.00, incAmount: 1000.00, month: "Jan,2026", arrear: "No" },
  { id: "2025056560", name: "Md. Rafsan Kabir", department: "Core Development", section: "RMG-Production-IE & Planning", descBefore: "Jr. Executive", descAfter: "Jr. Executive", prevGross: 15000.00, currentGross: 20000.00, incAmount: 5000.00, month: "Jan,2026", arrear: "No" }
];

function IncrementListPage() {
  // Top filters state
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Jan");
  const [company, setCompany] = useState("Pakiza Software Limited");
  const [area, setArea] = useState("PSL-Operation");
  const [empType, setEmpType] = useState("ALL");
  const [subDept, setSubDept] = useState("ALL");
  const [jobTitle, setJobTitle] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [gender, setGender] = useState("ALL");
  const [empId, setEmpId] = useState("");
  
  const [records, setRecords] = useState<ListRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load custom submissions from localStorage, falling back to defaults if empty
  useEffect(() => {
    const saved = localStorage.getItem("custom_increment_queue_records");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          const mapped: ListRecord[] = parsed.map((item: any) => ({
            id: item.empId,
            name: item.empName,
            department: item.department,
            section: item.section || "General Group",
            descBefore: item.section, // section was stored as designation in queue list
            descAfter: item.designation,
            prevGross: item.prevGross,
            currentGross: item.grossAfterInc,
            incAmount: item.grossAfterInc - item.prevGross,
            month: item.incMonth || "Jan,2026",
            arrear: "No"
          }));
          // Priority merge custom and mock list
          const filteredMock = mockListRecords.filter(m => !mapped.some(n => n.id === m.id));
          setRecords([...mapped, ...filteredMock]);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    setRecords(mockListRecords);
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(row => {
      // Dept filter
      if (subDept !== "ALL" && row.department !== subDept) return false;
      // EmpType filter
      if (empType !== "ALL" && row.arrear !== empType) return false;
      
      // EmpId comma separator
      if (empId.trim()) {
        const qids = empId.split(",").map(id => id.trim().toLowerCase());
        if (!qids.some(qid => row.id.toLowerCase().includes(qid))) return false;
      }

      // Text query Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return row.name.toLowerCase().includes(q) || row.id.includes(q) || row.department.toLowerCase().includes(q);
      }
      return true;
    });
  }, [records, subDept, empType, empId, searchQuery]);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">

          {/* Breadcrumbs */}
          <div className="bg-card rounded-2xl border border-border/85 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="size-3" />
                <span>Human Resource</span>
                <ChevronRight className="size-3" />
                <span className="text-primary font-black">Increment List</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Sparkles className="size-5.5 text-primary" />
                <span>Increment List Register</span>
              </h1>
            </div>
          </div>

          {/* PARAMETRIC FILTERS ROW */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
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
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-3 border-t border-border/20">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Sub Department</label>
                <select value={subDept} onChange={e => setSubDept(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                  <option value="Core Development">Core Development</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Job Title</label>
                <select value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
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
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold">
                  <option value="ALL">ALL</option>
                </select>
              </div>
              <div className="space-y-1 flex items-end justify-between gap-3">
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase">Employee Id</label>
                  <input 
                    type="text" 
                    value={empId}
                    onChange={e => setEmpId(e.target.value)}
                    placeholder="use comma as separator"
                    className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground outline-none"
                  />
                </div>
                <button onClick={() => alert("Search compiled.")} className="h-8 px-4 bg-primary hover:opacity-95 text-primary-foreground font-black text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center justify-center gap-1">
                  <Search className="size-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE ROSTER DATAGRID */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            
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
                    <th className="px-4 py-3 text-center">View (Inc)</th>
                    <th className="px-4 py-3 text-center">View (Prom)</th>
                    <th className="px-3 py-3">Employee ID</th>
                    <th className="px-4 py-3">Employee Name</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Section</th>
                    <th className="px-4 py-3">Designation(Before Inc.)</th>
                    <th className="px-4 py-3 text-primary">Designation(After Inc.)</th>
                    <th className="px-4 py-3 text-right">Previous Gross</th>
                    <th className="px-4 py-3 text-right text-primary">Current Gross</th>
                    <th className="px-4 py-3 text-right font-bold text-primary">Increment Amount</th>
                    <th className="px-4 py-3 text-center">Month</th>
                    <th className="px-4 py-3 text-center">Arrear</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredRecords.map((row, idx) => {
                    return (
                      <tr key={row.id} className="hover:bg-muted/40 transition">
                        <td className="px-3 py-3 text-center font-mono font-bold text-muted-foreground/60">{idx + 1}</td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => alert(`Viewing Increment dossier PDF for ${row.name}...`)} className="h-6 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded text-[9.5px] font-black uppercase transition inline-flex items-center gap-1">
                            <Eye className="size-3" /> View
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => alert(`Viewing Promotion dossier PDF for ${row.name}...`)} className="h-6 px-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 rounded text-[9.5px] font-black uppercase transition inline-flex items-center gap-1">
                            <Sparkles className="size-3" /> Prom
                          </button>
                        </td>
                        <td className="px-3 py-3 font-mono font-black text-foreground">{row.id}</td>
                        <td className="px-4 py-3 font-extrabold text-foreground">{row.name}</td>
                        <td className="px-4 py-3 text-muted-foreground font-semibold">{row.department}</td>
                        <td className="px-4 py-3 text-muted-foreground/80">{row.section}</td>
                        <td className="px-4 py-3 text-muted-foreground/80 font-bold">{row.descBefore}</td>
                        <td className="px-4 py-3 text-primary font-extrabold">{row.descAfter}</td>
                        <td className="px-4 py-3 text-right font-mono text-muted-foreground">৳{row.prevGross.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-primary">৳{row.currentGross.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-mono font-black text-primary">৳{row.incAmount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center font-semibold text-muted-foreground">{row.month}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted border border-border/40 text-muted-foreground">
                            {row.arrear}
                          </span>
                        </td>
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

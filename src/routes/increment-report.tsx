import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Sparkles,
  Search,
  FileSpreadsheet,
  Printer,
  FileDown,
  Building,
  Eye,
  FileText,
  X,
  TrendingUp,
  Award
} from "lucide-react";

export const Route = createFileRoute("/increment-report")({
  head: () => ({
    meta: [
      { title: "Increment Report — CRIPTON" },
      { name: "description", content: "View and analyze employee salary increments and promotion reports." },
    ],
  }),
  component: IncrementReportPage,
});

interface ReportRecord {
  sl: number;
  empId: string;
  name: string;
  department: string;
  section: string;
  designationBefore: string;
  designationAfter: string;
  prevGross: number;
  currentGross: number;
  incAmount: number;
  month: string;
  arrear: "Yes" | "No";
}

const mockReportData: ReportRecord[] = [
  {
    sl: 1,
    empId: "2024053060",
    name: "Md. Mahfujul Haque",
    department: "Core Development",
    section: "General ERP (Com, A/C, Fixed Asset, Vat)",
    designationBefore: "",
    designationAfter: "Manager",
    prevGross: 80000.0,
    currentGross: 88000,
    incAmount: 8000,
    month: "Jan,2026",
    arrear: "No",
  },
  {
    sl: 2,
    empId: "2024053062",
    name: "Mohammad Mayhedi Hasan",
    department: "Core Development",
    section: "General ERP (Com, A/C, Fixed Asset, Vat)",
    designationBefore: "",
    designationAfter: "Deputy Manager",
    prevGross: 70000.0,
    currentGross: 74000,
    incAmount: 4000,
    month: "Jan,2026",
    arrear: "No",
  },
  {
    sl: 3,
    empId: "2025053377",
    name: "Md. Maruf Hossen",
    department: "Business Development",
    section: "Core Sales",
    designationBefore: "",
    designationAfter: "Asst. Manager",
    prevGross: 55000.0,
    currentGross: 58000,
    incAmount: 3000,
    month: "Jan,2026",
    arrear: "No",
  },
  {
    sl: 4,
    empId: "2025053673",
    name: "Md Jahid Hasan Polok",
    department: "Core Development",
    section: "General ERP (Com, A/C, Fixed Asset, Vat)",
    designationBefore: "",
    designationAfter: "Sr. Executive",
    prevGross: 40000.0,
    currentGross: 46000,
    incAmount: 6000,
    month: "Jan,2026",
    arrear: "No",
  },
  {
    sl: 5,
    empId: "2025054315",
    name: "Md. Shahinur Alahi Khan",
    department: "Business Development",
    section: "Core Sales",
    designationBefore: "",
    designationAfter: "Asst. Manager",
    prevGross: 50000.0,
    currentGross: 53000,
    incAmount: 3000,
    month: "Jan,2026",
    arrear: "No",
  },
  {
    sl: 6,
    empId: "2025054548",
    name: "Md Rahat Hossain",
    department: "Database Administrator (DBA)",
    section: "DBA",
    designationBefore: "",
    designationAfter: "Asst. Manager",
    prevGross: 65000.0,
    currentGross: 67000,
    incAmount: 2000,
    month: "Jan,2026",
    arrear: "No",
  },
  {
    sl: 7,
    empId: "2025055045",
    name: "Md. Mahfuzur Rahman",
    department: "Business Automation (HR)",
    section: "Implementation & Support (HR)",
    designationBefore: "",
    designationAfter: "Jr. Executive",
    prevGross: 18000.0,
    currentGross: 22000,
    incAmount: 4000,
    month: "Jan,2026",
    arrear: "No",
  },
  {
    sl: 8,
    empId: "2025055747",
    name: "Sabbir Hossen Babu",
    department: "HR, Admin and Compliance",
    section: "Admin",
    designationBefore: "",
    designationAfter: "Office Boy",
    prevGross: 10000.0,
    currentGross: 11500,
    incAmount: 1500,
    month: "Jan,2026",
    arrear: "No",
  },
  {
    sl: 9,
    empId: "2025056473",
    name: "Hasnain",
    department: "HR, Admin and Compliance",
    section: "Admin",
    designationBefore: "",
    designationAfter: "Cleaner",
    prevGross: 11000.0,
    currentGross: 12000,
    incAmount: 1000,
    month: "Jan,2026",
    arrear: "No",
  },
  {
    sl: 10,
    empId: "2025056560",
    name: "Md. Rafsan Kabir",
    department: "Core Development",
    section: "RMG-Production-IE & Planning",
    designationBefore: "",
    designationAfter: "Jr. Executive",
    prevGross: 15000.0,
    currentGross: 20000,
    incAmount: 5000,
    month: "Jan,2026",
    arrear: "No",
  }
];

function IncrementReportPage() {
  // Filter states
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
  const [empIdInput, setEmpIdInput] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<ReportRecord[]>(mockReportData);

  // Modal states for View buttons
  const [selectedRecord, setSelectedRecord] = useState<ReportRecord | null>(null);
  const [modalType, setModalType] = useState<"incLetter" | "promLetter" | "scaleBreakdown" | null>(null);

  const filteredRecords = useMemo(() => {
    return records.filter((row) => {
      if (subDept !== "ALL" && row.department !== subDept) return false;

      // Filter by Employee ID separator comma search
      if (empIdInput.trim()) {
        const ids = empIdInput.split(",").map((i) => i.trim().toLowerCase());
        if (!ids.includes(row.empId.toLowerCase())) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          row.name.toLowerCase().includes(q) ||
          row.empId.includes(q) ||
          row.designationAfter.toLowerCase().includes(q) ||
          row.section.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, subDept, empIdInput, searchQuery]);

  const handleOpenModal = (row: ReportRecord, type: "incLetter" | "promLetter" | "scaleBreakdown") => {
    setSelectedRecord(row);
    setModalType(type);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Breadcrumbs */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-3" />
                <span>Evaluation</span>
                <ChevronRight className="size-3" />
                <span className="text-foreground">Increment Report</span>
              </div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Sparkles className="size-5.5 text-primary animate-pulse" />
                <span>Increment Report</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-semibold">View and print consolidated performance increment records</p>
            </div>
          </div>

          {/* PARAMETRIC FILTERS ROW */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold cursor-pointer"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold cursor-pointer"
                >
                  <option value="Jan">Jan</option>
                  <option value="Feb">Feb</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Company Name</label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold cursor-pointer"
                >
                  <option value="Pakiza Software Limited">Pakiza Software Limited</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Area Name</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold cursor-pointer"
                >
                  <option value="PSL-Operation">PSL-Operation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Employee Type</label>
                <select
                  value={empType}
                  onChange={(e) => setEmpType(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Sub Department</label>
                <select
                  value={subDept}
                  onChange={(e) => setSubDept(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                  <option value="Core Development">Core Development</option>
                  <option value="Business Development">Business Development</option>
                  <option value="HR, Admin and Compliance">HR, Admin and Compliance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Job Title</label>
                <select
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Line</label>
                <select
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-muted border border-border/40 text-xs text-foreground font-semibold cursor-pointer"
                >
                  <option value="ALL">ALL</option>
                </select>
              </div>
            </div>

            {/* Bottom Row Filters with search button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-3 border-t border-border/20">
              <div className="flex-1 w-full space-y-1">
                <label className="text-[9px] font-bold text-muted-foreground uppercase block">
                  Employee Id
                </label>
                <input
                  type="text"
                  value={empIdInput}
                  onChange={(e) => setEmpIdInput(e.target.value)}
                  placeholder="use comma as separator"
                  className="w-full h-8 px-3.5 bg-muted border border-border/30 rounded-lg text-xs font-semibold text-foreground focus:border-primary focus:bg-card outline-none transition"
                />
              </div>
              <div className="w-full sm:w-auto pt-4.5">
                <button
                  onClick={() => alert("Search compiled.")}
                  className="w-full sm:w-auto h-8 px-8 bg-primary hover:opacity-95 text-primary-foreground font-black text-[10px] rounded-lg shadow-2xs tracking-wider uppercase flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Search className="size-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* DYNAMIC REPORT DATAGRID CARD */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-xs space-y-4">
            {/* Table Export Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-border/20">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Excel Export Complete.")}
                  className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-3.5 text-primary" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => alert("PDF Export Complete.")}
                  className="h-8.5 px-4 bg-card border border-border/40 hover:bg-muted text-muted-foreground font-extrabold text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Building className="size-3.5 text-rose-500" />
                  <span>PDF</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase whitespace-nowrap">
                  Search:
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Quick Search..."
                  className="h-8.5 w-44 pl-3 pr-3 rounded-lg bg-muted border border-border/40 text-xs font-semibold text-foreground outline-none"
                />
              </div>
            </div>

            {/* Scrollable Data Table Container */}
            <div className="overflow-x-auto border border-border/60 rounded-xl bg-card">
              <table className="min-w-[1700px] w-full border-collapse text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-muted border-b border-border/70 text-muted-foreground/90 font-bold uppercase tracking-wider text-[10px] divide-x divide-border/40">
                    <th className="px-3 py-3.5 text-center font-bold whitespace-nowrap">#</th>
                    <th className="px-4 py-3.5 text-center font-bold whitespace-nowrap">View (Inc)</th>
                    <th className="px-4 py-3.5 text-center font-bold whitespace-nowrap">View (Prom)</th>
                    <th className="px-3 py-3.5 font-mono font-black whitespace-nowrap">Employee ID</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Employee Name</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Department</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Section</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Designation(Before Inc.)</th>
                    <th className="px-4 py-3.5 whitespace-nowrap">Designation(After Inc.)</th>
                    <th className="px-4 py-3.5 text-right whitespace-nowrap">Previous Gross</th>
                    <th className="px-4 py-3.5 text-right whitespace-nowrap">Current Gross</th>
                    <th className="px-4 py-3.5 text-right text-primary whitespace-nowrap">Increment Amount</th>
                    <th className="px-4 py-3.5 text-center whitespace-nowrap">Month</th>
                    <th className="px-3 py-3.5 text-center whitespace-nowrap">Arrear</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-foreground font-semibold divide-x divide-border/30">
                  {filteredRecords.map((row) => (
                    <tr key={row.empId} className="hover:bg-muted/40 transition">
                      <td className="px-3 py-2.5 text-center font-mono font-bold text-muted-foreground/60 whitespace-nowrap">
                        {row.sl}
                      </td>
                      {/* View Increment Columns */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenModal(row, "incLetter")}
                            className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 p-1.5 rounded border border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition size-7 flex items-center justify-center cursor-pointer"
                            title="Print Increment Letter"
                          >
                            <Eye className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenModal(row, "scaleBreakdown")}
                            className="text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-1.5 rounded border border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition size-7 flex items-center justify-center cursor-pointer"
                            title="Scale Breakdown Details"
                          >
                            <FileText className="size-3.5" />
                          </button>
                        </div>
                      </td>
                      {/* View Promotion Columns */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenModal(row, "promLetter")}
                            className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 p-1.5 rounded border border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition size-7 flex items-center justify-center cursor-pointer"
                            title="Print Promotion Letter"
                          >
                            <Eye className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenModal(row, "scaleBreakdown")}
                            className="text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-1.5 rounded border border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition size-7 flex items-center justify-center cursor-pointer"
                            title="Scale Breakdown Details"
                          >
                            <FileText className="size-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-mono font-black text-foreground whitespace-nowrap">
                        {row.empId}
                      </td>
                      <td className="px-4 py-2.5 font-extrabold text-foreground whitespace-nowrap">{row.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground font-semibold whitespace-nowrap">
                        {row.department}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground/80 whitespace-nowrap">{row.section}</td>
                      <td className="px-4 py-2.5 text-muted-foreground font-semibold whitespace-nowrap">
                        {row.designationBefore || "—"}
                      </td>
                      <td className="px-4 py-2.5 text-foreground font-bold whitespace-nowrap">
                        {row.designationAfter}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-foreground whitespace-nowrap">
                        ৳{row.prevGross.toFixed(2)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-foreground whitespace-nowrap">
                        ৳{row.currentGross.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-black text-primary whitespace-nowrap">
                        ৳{row.incAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-center font-mono text-muted-foreground whitespace-nowrap">
                        {row.month}
                      </td>
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.arrear === "Yes" ? "bg-rose-500/10 text-rose-600 border border-rose-500/15" : "bg-slate-500/10 text-slate-600 border border-slate-500/15"}`}
                        >
                          {row.arrear}
                        </span>
                      </td>
                    </tr>
                  ))}
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

        {/* DETAILS DOCK MODAL */}
        {selectedRecord && modalType && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-lg w-full max-w-2xl p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-250">
              <div className="flex items-center justify-between pb-3 border-b border-border/20">
                <h3 className="text-sm font-black text-foreground flex items-center gap-1.5 uppercase">
                  <Sparkles className="size-4.5 text-primary" />
                  <span>
                    {modalType === "incLetter" && "Increment Appraisal Letter Preview"}
                    {modalType === "promLetter" && "Promotion & Increment Appraisal Letter"}
                    {modalType === "scaleBreakdown" && "Appraisal Scale Breakdown Details"}
                  </span>
                </h3>
                <button
                  onClick={() => {
                    setSelectedRecord(null);
                    setModalType(null);
                  }}
                  className="p-1 hover:bg-muted text-muted-foreground rounded cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Modal Content */}
              {modalType === "incLetter" && (
                <div className="border border-border/60 rounded-xl p-6 bg-muted/30 font-serif text-slate-800 dark:text-slate-200 space-y-4 text-xs leading-relaxed max-h-[400px] overflow-y-auto">
                  <div className="text-center border-b border-slate-300 pb-3 space-y-1">
                    <h2 className="text-base font-black tracking-wide text-foreground uppercase">Pakiza Software Limited</h2>
                    <p className="text-[10px] text-muted-foreground font-sans">Corporate HQ, Dhaka, Bangladesh</p>
                  </div>
                  <div className="flex justify-between text-[10px] font-sans font-bold text-muted-foreground">
                    <span>Ref: PSL/HR/INC/{selectedRecord.empId}</span>
                    <span>Date: August 23, 2026</span>
                  </div>
                  <div>
                    <p className="font-bold font-sans">To,</p>
                    <p className="font-extrabold font-sans text-foreground text-sm">{selectedRecord.name}</p>
                    <p className="text-muted-foreground font-sans">{selectedRecord.section}</p>
                  </div>
                  <div>
                    <h3 className="text-center font-bold underline font-sans text-foreground">Subject: Letter of Salary Increment</h3>
                  </div>
                  <p>
                    Dear <span className="font-bold">{selectedRecord.name}</span>,
                  </p>
                  <p>
                    In recognition of your exceptional dedication, diligence, and contribution toward the Core Development and product goals of <strong>Pakiza Software Limited</strong>, we are pleased to inform you that your monthly gross salary has been adjusted.
                  </p>
                  <div className="p-3 bg-card border border-border rounded-lg font-sans space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Previous Gross Salary:</span>
                      <span className="font-bold text-foreground">৳{selectedRecord.prevGross.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-1">
                      <span className="text-primary font-bold">Increment Amount:</span>
                      <span className="font-black text-primary">৳{selectedRecord.incAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-1">
                      <span className="text-foreground font-bold">New Gross Salary:</span>
                      <span className="font-black text-foreground">৳{selectedRecord.currentGross.toLocaleString()}</span>
                    </div>
                  </div>
                  <p>
                    The salary increment will be effective from the month of <strong>{selectedRecord.month}</strong>. We look forward to your continued contribution to the organization.
                  </p>
                  <div className="pt-4 flex justify-between font-sans text-[10px] text-muted-foreground">
                    <div>
                      <p className="border-t border-slate-400 pt-1 w-32 text-center">Prepared By (HR)</p>
                    </div>
                    <div>
                      <p className="border-t border-slate-400 pt-1 w-32 text-center">Authorized Signatory</p>
                    </div>
                  </div>
                </div>
              )}

              {modalType === "promLetter" && (
                <div className="border border-border/60 rounded-xl p-6 bg-muted/30 font-serif text-slate-800 dark:text-slate-200 space-y-4 text-xs leading-relaxed max-h-[400px] overflow-y-auto">
                  <div className="text-center border-b border-slate-300 pb-3 space-y-1">
                    <h2 className="text-base font-black tracking-wide text-foreground uppercase">Pakiza Software Limited</h2>
                    <p className="text-[10px] text-muted-foreground font-sans">Corporate HQ, Dhaka, Bangladesh</p>
                  </div>
                  <div className="flex justify-between text-[10px] font-sans font-bold text-muted-foreground">
                    <span>Ref: PSL/HR/PROM/{selectedRecord.empId}</span>
                    <span>Date: August 23, 2026</span>
                  </div>
                  <div>
                    <p className="font-bold font-sans">To,</p>
                    <p className="font-extrabold font-sans text-foreground text-sm">{selectedRecord.name}</p>
                    <p className="text-muted-foreground font-sans">{selectedRecord.section}</p>
                  </div>
                  <div>
                    <h3 className="text-center font-bold underline font-sans text-foreground">Subject: Letter of Promotion & Salary Revision</h3>
                  </div>
                  <p>
                    Dear <span className="font-bold">{selectedRecord.name}</span>,
                  </p>
                  <p>
                    Following the annual management evaluation, we are proud to inform you that you have been promoted to the rank of <strong>{selectedRecord.designationAfter}</strong> in the {selectedRecord.department} department.
                  </p>
                  <div className="p-3 bg-card border border-border rounded-lg font-sans space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">New Designation:</span>
                      <span className="font-black text-foreground">{selectedRecord.designationAfter}</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-1">
                      <span className="text-muted-foreground">Previous Gross Salary:</span>
                      <span className="font-bold text-foreground">৳{selectedRecord.prevGross.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-1">
                      <span className="text-primary font-bold">Adjustment Increment:</span>
                      <span className="font-black text-primary">৳{selectedRecord.incAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-1">
                      <span className="text-foreground font-bold">Revised Gross Salary:</span>
                      <span className="font-black text-foreground">৳{selectedRecord.currentGross.toLocaleString()}</span>
                    </div>
                  </div>
                  <p>
                    This appraisal will be effective from the month of <strong>{selectedRecord.month}</strong>. We expect you to discharge your new responsibilities with the same enthusiasm and professional standard.
                  </p>
                  <div className="pt-4 flex justify-between font-sans text-[10px] text-muted-foreground">
                    <div>
                      <p className="border-t border-slate-400 pt-1 w-32 text-center">Prepared By (HR)</p>
                    </div>
                    <div>
                      <p className="border-t border-slate-400 pt-1 w-32 text-center">Authorized Signatory</p>
                    </div>
                  </div>
                </div>
              )}

              {modalType === "scaleBreakdown" && (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 bg-muted/50 border border-border/40 rounded-xl space-y-1.5">
                    <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
                      <span>Employee Details</span>
                      <span>ID: {selectedRecord.empId}</span>
                    </div>
                    <p className="text-sm font-extrabold text-foreground">{selectedRecord.name}</p>
                    <p className="font-semibold text-muted-foreground">{selectedRecord.designationAfter} — {selectedRecord.section}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Adjusted Scale Breakdown Metrics</h4>
                    
                    <div className="border border-border/60 rounded-xl overflow-hidden divide-y divide-border/45 bg-card">
                      <div className="flex justify-between p-3">
                        <span className="text-muted-foreground font-semibold">Previous Gross Salary</span>
                        <span className="font-mono font-bold text-foreground">৳{selectedRecord.prevGross.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between p-3">
                        <span className="text-muted-foreground font-semibold">Salary Increment Amount</span>
                        <span className="font-mono font-black text-primary">৳{selectedRecord.incAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/20">
                        <span className="text-foreground font-bold">New Adjusted Gross Salary</span>
                        <span className="font-mono font-black text-foreground">৳{selectedRecord.currentGross.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-3">
                        <span className="text-muted-foreground font-semibold">Adjusted Basic Scale (60% split)</span>
                        <span className="font-mono font-semibold text-foreground">৳{Math.round(selectedRecord.currentGross * 0.6).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-3">
                        <span className="text-muted-foreground font-semibold">Adjusted House Rent Allowance (50% basic)</span>
                        <span className="font-mono font-semibold text-foreground">৳{Math.round(selectedRecord.currentGross * 0.3).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-3">
                        <span className="text-muted-foreground font-semibold">Standard Medical Allowance</span>
                        <span className="font-mono font-semibold text-foreground">৳1,500.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl border border-border/20 text-center font-semibold text-[10px] uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1.5">
                    <Award className="size-4 text-primary" /> Approved and locked in salary structures register
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-border/20">
                <button
                  onClick={() => {
                    setSelectedRecord(null);
                    setModalType(null);
                  }}
                  className="h-8 px-5 bg-muted hover:bg-muted/80 text-foreground font-black text-[10px] rounded-lg transition uppercase tracking-wider cursor-pointer"
                >
                  Close View
                </button>
                <button
                  onClick={() => window.print()}
                  className="h-8 px-5 bg-primary hover:opacity-95 text-primary-foreground font-black text-[10px] rounded-lg shadow-2xs transition uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useMemo } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  FileText,
  ChevronRight,
  Printer,
  FileDown,
  FileSpreadsheet,
  Search,
  RotateCcw,
  Coins,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/monthly-salary-payable")({
  head: () => ({
    meta: [
      { title: "Monthly Salary Payable — CRIPTON HRIS" },
      { name: "description", content: "Monthly Salary Payable Report & Comparative Analysis" },
    ],
  }),
  component: MonthlySalaryPayablePage,
});

interface SalaryPayableRow {
  particulars: string;
  octPerson: number | null;
  octSalary: number | null;
  septPerson: number | null;
  septSalary: number | null;
  diffPerson: number | null;
  diffSalary: number | null;
  otOct: number | null;
  otSept: number | null;
  otDiff: number | null;
  isSubtotal?: boolean;
  isGroupTotal?: boolean;
  isKnitGroupTotal?: boolean;
  isPtvlTotal?: boolean;
  isGrandTotal?: boolean;
  theme?: "default" | "pkcl" | "peach" | "green" | "lawnun" | "knit" | "ptvl" | "grand";
}

const initialRows: SalaryPayableRow[] = [
  // PKCL Group
  { particulars: "PKCL-Foreigner", octPerson: null, octSalary: null, septPerson: null, septSalary: null, diffPerson: null, diffSalary: null, otOct: null, otSept: null, otDiff: null },
  { particulars: "PKCL-Savar-misc", octPerson: 1, octSalary: 1333200, septPerson: 1, septSalary: 1333200, diffPerson: null, diffSalary: null, otOct: null, otSept: null, otDiff: null },
  { particulars: "PKCL-HO+AGM", octPerson: 25, octSalary: 6553000, septPerson: 25, septSalary: 6553000, diffPerson: null, diffSalary: null, otOct: null, otSept: null, otDiff: null },
  { particulars: "PKCL-HO", octPerson: 161, octSalary: 6738278, septPerson: 165, septSalary: 6689252, diffPerson: -4, diffSalary: 49026, otOct: null, otSept: null, otDiff: null },
  { particulars: "PKCL-HO-Misc.", octPerson: 7, octSalary: 1114375, septPerson: 7, septSalary: 1114375, diffPerson: null, diffSalary: null, otOct: null, otSept: null, otDiff: null },
  { particulars: "Total Head Office", octPerson: 194, octSalary: 15738853, septPerson: 198, septSalary: 15689827, diffPerson: -4, diffSalary: 49026, otOct: null, otSept: null, otDiff: null, isSubtotal: true },
  { particulars: "Savar Gross salary", octPerson: 6381, octSalary: 124096283, septPerson: 6606, septSalary: 124692547, diffPerson: -225, diffSalary: -596264, otOct: null, otSept: null, otDiff: null },
  { particulars: "Savar OT", octPerson: null, octSalary: 34411780, septPerson: null, septSalary: 27271110, diffPerson: null, diffSalary: 7140670, otOct: 34411780, otSept: 27271110, otDiff: 7140670 },
  { particulars: "Savar factory total", octPerson: 6381, octSalary: 158508063, septPerson: 6606, septSalary: 151963657, diffPerson: -225, diffSalary: 6544406, otOct: 34411780, otSept: 27271110, otDiff: 7140670, isSubtotal: true },
  { particulars: "Total - PKCL", octPerson: 6575, octSalary: 174246916, septPerson: 6804, septSalary: 167653484, diffPerson: -229, diffSalary: 6593432, otOct: 34411780, otSept: 27271110, otDiff: 7140670, isGroupTotal: true, theme: "pkcl" },

  // PAL Group (peach)
  { particulars: "PAL-Foreigner", octPerson: 1, octSalary: 245000, septPerson: 1, septSalary: 245000, diffPerson: null, diffSalary: null, otOct: null, otSept: null, otDiff: null, theme: "peach" },
  { particulars: "PAL-HO-AGM", octPerson: 2, octSalary: 495000, septPerson: 2, septSalary: 495000, diffPerson: null, diffSalary: null, otOct: null, otSept: null, otDiff: null, theme: "peach" },
  { particulars: "PAL-HO", octPerson: 33, octSalary: 1396880, septPerson: 34, septSalary: 1387071, diffPerson: -1, diffSalary: 9809, otOct: null, otSept: null, otDiff: null, theme: "peach" },
  { particulars: "PAL-Factory(AOP)", octPerson: 366, octSalary: 10200157, septPerson: 370, septSalary: 10130931, diffPerson: -4, diffSalary: 69226, otOct: 2342481, otSept: 2222361, otDiff: 120120, theme: "peach" },
  { particulars: "PAL-Factory(Knit Dyeing)", octPerson: 605, octSalary: 16795008, septPerson: 610, septSalary: 16757955, diffPerson: -5, diffSalary: 37053, otOct: 3943487, otSept: 3868643, otDiff: 74844, theme: "peach" },
  { particulars: "Total PAL", octPerson: 1007, octSalary: 29132045, septPerson: 1017, septSalary: 29015957, diffPerson: -10, diffSalary: 116088, otOct: 6285968, otSept: 6091004, otDiff: 194964, isGroupTotal: true, theme: "peach" },

  // PWFL Group (peach)
  { particulars: "PWFL-HO-AGM", octPerson: 2, octSalary: 865000, septPerson: 2, septSalary: 865000, diffPerson: null, diffSalary: null, otOct: null, otSept: null, otDiff: null, theme: "peach" },
  { particulars: "PWFL-HO", octPerson: 1, octSalary: 60000, septPerson: 1, septSalary: 60000, diffPerson: null, diffSalary: null, otOct: null, otSept: null, otDiff: null, theme: "peach" },
  { particulars: "PWFL", octPerson: 358, octSalary: 10144700, septPerson: 350, septSalary: 9638303, diffPerson: 8, diffSalary: 506397, otOct: 2387779, otSept: 2218374, otDiff: 169405, theme: "peach" },
  { particulars: "PWFL-Washing", octPerson: 49, octSalary: 1125712, septPerson: 51, septSalary: 1169895, diffPerson: null, diffSalary: -44183, otOct: 73479, otSept: 187954, otDiff: -114475, theme: "peach" },
  { particulars: "Total PWFL", octPerson: 410, octSalary: 12195412, septPerson: 404, septSalary: 11733198, diffPerson: 8, diffSalary: 462214, otOct: 2461258, otSept: 2406328, otDiff: 54930, isGroupTotal: true, theme: "peach" },

  // PWG Group (peach)
  { particulars: "Woven Garments-GM", octPerson: 1, octSalary: 554000, septPerson: 1, septSalary: 554000, diffPerson: null, diffSalary: null, otOct: null, otSept: null, otDiff: null, theme: "peach" },
  { particulars: "Woven Garments-", octPerson: 733, octSalary: 15435350, septPerson: 730, septSalary: 16408277, diffPerson: 3, diffSalary: -972927, otOct: 3762465, otSept: 3762465, otDiff: null, theme: "peach" },
  { particulars: "Total PWG", octPerson: 734, octSalary: 15989350, septPerson: 731, septSalary: 16962277, diffPerson: 3, diffSalary: -972927, otOct: 3762465, otSept: 3762465, otDiff: null, isGroupTotal: true, theme: "peach" },

  // Nowapara Group (peach)
  { particulars: "Ansar salary", octPerson: null, octSalary: 0, septPerson: null, septSalary: 0, diffPerson: null, diffSalary: null, otOct: null, otSept: null, otDiff: null, theme: "peach" },
  { particulars: "Bagan bari", octPerson: 20, octSalary: 374726, septPerson: 19, septSalary: 345031, diffPerson: 1, diffSalary: 29695, otOct: null, otSept: null, otDiff: null, theme: "peach" },
  { particulars: "Trepti-PIP", octPerson: 5, octSalary: 109216, septPerson: 5, septSalary: 103008, diffPerson: null, diffSalary: 6208, otOct: null, otSept: null, otDiff: null, theme: "peach" },
  { particulars: "Total Nowapara", octPerson: 2176, octSalary: 57800749, septPerson: 2176, septSalary: 58159471, diffPerson: 2, diffSalary: -358722, otOct: 12509691, otSept: 12259797, otDiff: 249894, isGroupTotal: true, theme: "peach" },

  // PFD Group (green)
  { particulars: "PFD+BD AGM", octPerson: 6, octSalary: 2045000, septPerson: 5, septSalary: 2045000, diffPerson: 1, diffSalary: null, otOct: null, otSept: null, otDiff: null, theme: "green" },
  { particulars: "PFD+ BD staff", octPerson: 69, octSalary: 3957058, septPerson: 63, septSalary: 3508611, diffPerson: 6, diffSalary: 448447, otOct: 0, otSept: 0, otDiff: null, theme: "green" },
  { particulars: "Total PFD", octPerson: 75, octSalary: 6002058, septPerson: 68, septSalary: 5553611, diffPerson: 7, diffSalary: 448447, otOct: null, otSept: null, otDiff: null, isSubtotal: true, theme: "green" },

  // Enorsia Group (green)
  { particulars: "Enorsia- Foreigner", octPerson: 1, octSalary: 270000, septPerson: 1, septSalary: 270000, diffPerson: null, diffSalary: null, otOct: null, otSept: null, otDiff: null, theme: "green" },
  { particulars: "Enorsia-AGM", octPerson: 1, octSalary: 305000, septPerson: 1, septSalary: 305000, diffPerson: null, diffSalary: null, otOct: null, otSept: null, otDiff: null, theme: "green" },
  { particulars: "Enorsia-Staff", octPerson: 35, octSalary: 1917726, septPerson: 38, septSalary: 2162606, diffPerson: -3, diffSalary: -244880, otOct: null, otSept: null, otDiff: null, theme: "green" },
  { particulars: "Total Enorsia", octPerson: 37, octSalary: 2492726, septPerson: 40, septSalary: 2737606, diffPerson: -3, diffSalary: -244880, otOct: null, otSept: null, otDiff: null, isSubtotal: true, theme: "green" },
  { particulars: "Total PFD", octPerson: 112, octSalary: 8494784, septPerson: 108, septSalary: 8291217, diffPerson: 4, diffSalary: 203567, otOct: null, otSept: null, otDiff: null, isGroupTotal: true, theme: "green" },

  // Lawnun & Miscellaneous
  { particulars: "Lawnun -AGM", octPerson: 4, octSalary: 790000, septPerson: 4, septSalary: 790000, diffPerson: null, diffSalary: null, otOct: null, otSept: null, otDiff: null },
  { particulars: "Lawnun -staff", octPerson: 10, octSalary: 413513, septPerson: 10, septSalary: 410046, diffPerson: null, diffSalary: 3467, otOct: null, otSept: null, otDiff: null },
  { particulars: "Total lawnun", octPerson: 14, octSalary: 1203513, septPerson: 14, septSalary: 1200046, diffPerson: null, diffSalary: 3467, otOct: null, otSept: null, otDiff: null, isSubtotal: true },
  { particulars: "PGL", octPerson: null, octSalary: null, septPerson: 6, septSalary: 132149, diffPerson: -6, diffSalary: -132149, otOct: 0, otSept: 0, otDiff: 0 },
  { particulars: "Seeshel Attire", octPerson: 19, octSalary: 453680, septPerson: 21, septSalary: 474181, diffPerson: -2, diffSalary: -20501, otOct: null, otSept: null, otDiff: null },
  { particulars: "Trepti-Savar", octPerson: 7, octSalary: 141007, septPerson: 7, septSalary: 145287, diffPerson: null, diffSalary: -4280, otOct: null, otSept: null, otDiff: null },

  // Total: Knit Group
  { particulars: "Total: Knit Group", octPerson: 8903, octSalary: 242340649, septPerson: 9136, septSalary: 236055835, diffPerson: -231, diffSalary: 6284814, otOct: 46921471, otSept: 39530907, otDiff: 7390564, isKnitGroupTotal: true, theme: "knit" },

  // PTVL / Pakiza Software
  { particulars: "AGM to Above P software", octPerson: 3, octSalary: 483000, septPerson: 2, septSalary: 243000, diffPerson: 1, diffSalary: 240000, otOct: null, otSept: null, otDiff: null },
  { particulars: "PTVL HO(from PKCL HO admin)", octPerson: 3, octSalary: 155633, septPerson: 3, septSalary: 157133, diffPerson: null, diffSalary: -1500, otOct: null, otSept: null, otDiff: null },
  { particulars: "Pakiza software", octPerson: 54, octSalary: 2223433, septPerson: 53, septSalary: 2147919, diffPerson: 1, diffSalary: 75514, otOct: null, otSept: null, otDiff: null, theme: "ptvl" },
  { particulars: "Pakiza software-operation", octPerson: 3, octSalary: 92000, septPerson: 3, septSalary: 92860, diffPerson: null, diffSalary: -860, otOct: null, otSept: null, otDiff: null, theme: "ptvl" },
  { particulars: "PTVL staff", octPerson: 3, octSalary: 180750, septPerson: 3, septSalary: 180750, diffPerson: null, diffSalary: null, otOct: null, otSept: null, otDiff: null },
  { particulars: "Total PTVL", octPerson: 66, octSalary: 3134816, septPerson: 64, septSalary: 2821662, diffPerson: 2, diffSalary: 313154, otOct: null, otSept: null, otDiff: null, isPtvlTotal: true, theme: "ptvl" },

  // Grand Total
  { particulars: "Grand total", octPerson: 8969, octSalary: 245475465, septPerson: 9200, septSalary: 238877497, diffPerson: -229, diffSalary: 6597968, otOct: 46921471, otSept: 39530907, otDiff: 7390564, isGrandTotal: true, theme: "grand" },
];

function formatVal(num: number | null, isCurrency = false): string {
  if (num === null) return "-";
  if (num === 0) return isCurrency ? "0" : "-";
  if (num < 0) {
    const formatted = Math.abs(num).toLocaleString();
    return `(${formatted})`;
  }
  return num.toLocaleString();
}

function MonthlySalaryPayablePage() {
  const [year, setYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("Oct-26");
  const [groupFilter, setGroupFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate previous comparison month dynamically
  const priorMonth = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const parts = selectedMonth.split("-");
    const m = parts[0];
    const y = parts[1] || "26";
    const idx = months.indexOf(m);
    if (idx > 0) {
      return `${months[idx - 1]}-${y}`;
    } else if (idx === 0) {
      const prevYear = parseInt(y, 10) - 1;
      return `Dec-${prevYear}`;
    }
    return "Sept-26";
  }, [selectedMonth]);

  const filteredRows = useMemo(() => {
    return initialRows.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!r.particulars.toLowerCase().includes(q)) return false;
      }
      if (groupFilter !== "ALL") {
        if (groupFilter === "PKCL" && !r.particulars.includes("PKCL") && !r.particulars.includes("Savar")) return false;
        if (groupFilter === "PAL" && !r.particulars.includes("PAL")) return false;
        if (groupFilter === "PWFL" && !r.particulars.includes("PWFL")) return false;
        if (groupFilter === "PWG" && !r.particulars.includes("PWG") && !r.particulars.includes("Woven")) return false;
        if (groupFilter === "PTVL" && !r.particulars.includes("PTVL") && !r.particulars.includes("software")) return false;
      }
      return true;
    });
  }, [searchQuery, groupFilter]);

  const handleExport = (type: "excel" | "print" | "pdf") => {
    toast.info(`Exporting Monthly Salary Payable report as ${type.toUpperCase()}...`);
    if (type === "print") {
      window.print();
    }
  };

  const handleReset = () => {
    setYear("2026");
    setSelectedMonth("Oct-26");
    setGroupFilter("ALL");
    setSearchQuery("");
    toast.success("Filters reset to default.");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto bg-muted/20">
        <Topbar />

        <div className="p-4 md:p-6 lg:p-7 space-y-5 w-full mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground select-none">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link to="/payroll-reports" className="hover:text-foreground transition-colors">
              Payroll Reports
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-semibold">Monthly Salary Payable</span>
          </div>

          {/* Header Title & Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                Pakiza Knit Group
              </div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
                <Coins className="size-6 text-primary" />
                Monthly Salary Payable
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Comparative analysis of salary obligations, headcount changes, and overtime remark ledger.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Period: {selectedMonth}
              </span>
            </div>
          </div>

          {/* Filter Card inspired by monthly-salary-details */}
          <div className="bg-card rounded-2xl border border-border/60 p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              {/* Month */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                >
                  <option value="Oct-26">Oct-26</option>
                  <option value="Sept-26">Sept-26</option>
                  <option value="Aug-26">Aug-26</option>
                  <option value="Jul-26">Jul-26</option>
                  <option value="Jun-26">Jun-26</option>
                  <option value="May-26">May-26</option>
                  <option value="Apr-26">Apr-26</option>
                  <option value="Mar-26">Mar-26</option>
                  <option value="Feb-26">Feb-26</option>
                  <option value="Jan-26">Jan-26</option>
                </select>
              </div>

              {/* Company */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 block">Company</label>
                <select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                >
                  <option value="ALL">All Companies</option>
                  <option value="PKCL">PKCL (Head Office & Savar)</option>
                  <option value="PAL">PAL (Factory & HO)</option>
                  <option value="PWFL">PWFL (Factory & Washing)</option>
                  <option value="PWG">PWG (Woven Garments)</option>
                  <option value="PTVL">PTVL & Software</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1.5 flex flex-col justify-end">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="h-9 px-3 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Reset Filters"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>Reset</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.success("Filtered data successfully updated.")}
                    className="h-9 flex-1 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <Search className="size-3.5 stroke-[2.2]" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Toolbar & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleExport("excel")}
                className="h-8.5 px-3.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <FileSpreadsheet className="size-3.5 text-emerald-600" />
                <span>EXCEL</span>
              </button>
              <button
                type="button"
                onClick={() => handleExport("print")}
                className="h-8.5 px-3.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Printer className="size-3.5 text-blue-600" />
                <span>PRINT</span>
              </button>
              <button
                type="button"
                onClick={() => handleExport("pdf")}
                className="h-8.5 px-3.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <FileDown className="size-3.5 text-rose-600" />
                <span>PDF</span>
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search particulars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8.5 pl-9 pr-3 rounded-lg border border-border/80 bg-background text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none transition placeholder:text-muted-foreground/60 shadow-xs"
              />
            </div>
          </div>

          {/* Main Layout: Full Width Table */}
          <div className="w-full bg-card rounded-2xl border border-border/70 shadow-xs overflow-hidden flex flex-col">
            <div className="p-3.5 bg-muted/40 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  Monthly Salary Payable Ledger ({selectedMonth} vs {priorMonth})
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                Showing {filteredRows.length} particulars
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[11px] text-left">
                <thead>
                  {/* Top Tier Header */}
                  <tr className="bg-muted/90 text-foreground font-bold border-b border-border text-[10px] uppercase tracking-wider text-center select-none">
                    <th
                      rowSpan={2}
                      className="py-2.5 px-3 border-r border-border/60 text-left min-w-[200px]"
                    >
                      Particulars
                    </th>
                    <th colSpan={2} className="py-2 px-3 border-r border-border/60 bg-blue-50/50 dark:bg-blue-950/30">
                      {selectedMonth}
                    </th>
                    <th colSpan={2} className="py-2 px-3 border-r border-border/60 bg-slate-100/50 dark:bg-slate-800/40">
                      {priorMonth}
                    </th>
                    <th colSpan={2} className="py-2 px-3 border-r border-border/60 bg-amber-50/50 dark:bg-amber-950/30">
                      Increase/ (Decrease)
                    </th>
                    <th colSpan={3} className="py-2 px-3 bg-purple-50/50 dark:bg-purple-950/30">
                      Remark (OT)
                    </th>
                  </tr>
                  {/* Sub Tier Header */}
                  <tr className="bg-muted/70 text-muted-foreground font-bold border-b border-border text-[9.5px] uppercase tracking-wider select-none">
                    {/* Selected Month */}
                    <th className="py-2 px-2.5 text-center border-r border-border/50 w-16">Person</th>
                    <th className="py-2 px-3 text-right border-r border-border/60">Salary Amount</th>
                    {/* Prior Month */}
                    <th className="py-2 px-2.5 text-center border-r border-border/50 w-16">Person</th>
                    <th className="py-2 px-3 text-right border-r border-border/60">Salary Amount</th>
                    {/* Increase / (Decrease) */}
                    <th className="py-2 px-2.5 text-center border-r border-border/50 w-16">Person</th>
                    <th className="py-2 px-3 text-right border-r border-border/60">Salary Amount</th>
                    {/* Remark (OT) */}
                    <th className="py-2 px-2.5 text-right border-r border-border/50">{selectedMonth}</th>
                    <th className="py-2 px-2.5 text-right border-r border-border/50">{priorMonth}</th>
                    <th className="py-2 px-2.5 text-right">Increase/ (Decrease)</th>
                  </tr>
                </thead>

                  <tbody className="divide-y divide-border/40 font-medium text-slate-800 dark:text-slate-200">
                    {filteredRows.map((row, idx) => {
                      const isBoldRow =
                        row.isSubtotal ||
                        row.isGroupTotal ||
                        row.isKnitGroupTotal ||
                        row.isPtvlTotal ||
                        row.isGrandTotal;

                      // Theme classes for rows matching the excel spreadsheet
                      let rowBg = "hover:bg-muted/40 transition-colors";
                      if (row.isGrandTotal) {
                        rowBg = "bg-slate-200/90 dark:bg-slate-800 font-black text-slate-900 dark:text-white border-t-2 border-b-2 border-slate-900 dark:border-white";
                      } else if (row.isKnitGroupTotal) {
                        rowBg = "bg-amber-100/80 dark:bg-amber-950/40 font-extrabold text-amber-950 dark:text-amber-200 border-t border-b border-amber-300 dark:border-amber-800";
                      } else if (row.isPtvlTotal) {
                        rowBg = "bg-blue-100/90 dark:bg-blue-950/50 font-extrabold text-blue-950 dark:text-blue-200 border-t border-b border-blue-300 dark:border-blue-800";
                      } else if (row.isGroupTotal) {
                        rowBg = "bg-slate-100 dark:bg-slate-800/80 font-bold border-t border-b border-border/80";
                      } else if (row.isSubtotal) {
                        rowBg = "bg-slate-50 dark:bg-slate-800/40 font-semibold";
                      } else if (row.theme === "peach") {
                        rowBg = "bg-orange-50/40 dark:bg-orange-950/10 hover:bg-orange-50/70 dark:hover:bg-orange-950/20";
                      } else if (row.theme === "green") {
                        rowBg = "bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100/60 dark:hover:bg-slate-800/40";
                      }

                      return (
                        <tr key={idx} className={`${rowBg} whitespace-nowrap`}>
                          {/* Particulars */}
                          <td className={`py-1.5 px-3 border-r border-border/50 ${isBoldRow ? "font-bold" : ""}`}>
                            {row.particulars}
                          </td>

                          {/* Current Month: Person */}
                          <td className="py-1.5 px-2.5 text-center font-mono border-r border-border/40">
                            {formatVal(row.octPerson)}
                          </td>
                          {/* Current Month: Salary Amount */}
                          <td className="py-1.5 px-3 text-right font-mono font-semibold border-r border-border/50">
                            {formatVal(row.octSalary, true)}
                          </td>

                          {/* Compare Month: Person */}
                          <td className="py-1.5 px-2.5 text-center font-mono border-r border-border/40 text-muted-foreground">
                            {formatVal(row.septPerson)}
                          </td>
                          {/* Compare Month: Salary Amount */}
                          <td className="py-1.5 px-3 text-right font-mono border-r border-border/50 text-muted-foreground">
                            {formatVal(row.septSalary, true)}
                          </td>

                          {/* Increase / (Decrease): Person */}
                          <td className="py-1.5 px-2.5 text-center font-mono border-r border-border/40">
                            {formatVal(row.diffPerson)}
                          </td>
                          {/* Increase / (Decrease): Salary Amount */}
                          <td className="py-1.5 px-3 text-right font-mono border-r border-border/50">
                            {formatVal(row.diffSalary, true)}
                          </td>

                          {/* Remark (OT): Current Month */}
                          <td className="py-1.5 px-2.5 text-right font-mono border-r border-border/40">
                            {formatVal(row.otOct, true)}
                          </td>
                          {/* Remark (OT): Compare Month */}
                          <td className="py-1.5 px-2.5 text-right font-mono border-r border-border/40 text-muted-foreground">
                            {formatVal(row.otSept, true)}
                          </td>
                          {/* Remark (OT): Diff */}
                          <td className="py-1.5 px-2.5 text-right font-mono">
                            {formatVal(row.otDiff, true)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}


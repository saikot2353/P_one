import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Activity,
  Calculator,
  Calendar,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plus,
  ArrowLeft,
  Search,
  Download,
  Printer,
  FileSpreadsheet,
  Edit2,
  Trash2,
  Save,
  Info,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-capacity-planning")({
  head: () => ({
    meta: [
      { title: "Capacity Allocation — RMG Merchandising" },
      { name: "description", content: "Monthly SMV capacity allocation, factory line details info, and ledger listings." },
    ],
  }),
  component: MerchandisingCapacityPlanningPage,
});

interface CapacityDetailRow {
  date: string;
  status: "Open" | "Closed";
  linesCount: number;
  machinesCount: number;
  workingHours: number;
  capacityMin: number;
  capacityPcs: number;
}

interface CapacityAllocation {
  id: string;
  companyName: string;
  location: string;
  year: number;
  month: string;
  complexityLevel: "Basic" | "Standard" | "Complex";
  workingDays: number;
  capacityMin: number;
  capacityPcs: number;
  remarks: string;
  // Configuration details
  avgMachinePerLine: number;
  linesCount: number;
  workingHours: number;
  efficiencyPct: number;
  avgSam: number;
  details: CapacityDetailRow[];
}

const MONTHS_LIST = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Helper to get number of days in a month
const getDaysInMonth = (monthName: string, year: number): number => {
  const monthIndex = MONTHS_LIST.indexOf(monthName);
  if (monthIndex === -1) return 31;
  return new Date(year, monthIndex + 1, 0).getDate();
};

// Generate list of dates for a month
const generateDatesForMonth = (monthName: string, year: number): string[] => {
  const days = getDaysInMonth(monthName, year);
  const monthIndex = MONTHS_LIST.indexOf(monthName);
  const formattedMonth = String(monthIndex + 1).padStart(2, "0");
  
  const dates: string[] = [];
  for (let d = 1; d <= days; d++) {
    const formattedDay = String(d).padStart(2, "0");
    dates.push(`${formattedDay}/${formattedMonth}/${year}`);
  }
  return dates;
};

// Initial Seed Data matching the screenshot reference
const INITIAL_ALLOCATIONS: CapacityAllocation[] = [
  {
    id: "alloc-1",
    companyName: "Pakiza Knit Composite Ltd",
    location: "PKCL-Savar",
    year: 2026,
    month: "April",
    complexityLevel: "Basic",
    workingDays: 26,
    capacityMin: 18869760,
    capacityPcs: 3310488,
    remarks: "Standard summer T-shirt line setup",
    avgMachinePerLine: 11,
    linesCount: 11,
    workingHours: 8,
    efficiencyPct: 90,
    avgSam: 5.7,
    details: [],
  },
  {
    id: "alloc-2",
    companyName: "Pakiza Knit Composite Ltd",
    location: "PKCL-Savar",
    year: 2026,
    month: "August",
    complexityLevel: "Basic",
    workingDays: 25,
    capacityMin: 20442240,
    capacityPcs: 3586362,
    remarks: "Polo shirts allocation schedule",
    avgMachinePerLine: 11,
    linesCount: 11,
    workingHours: 8,
    efficiencyPct: 90,
    avgSam: 5.7,
    details: [],
  },
  {
    id: "alloc-3",
    companyName: "Pakiza Knit Composite Ltd",
    location: "PKCL-Savar",
    year: 2026,
    month: "December",
    complexityLevel: "Basic",
    workingDays: 26,
    capacityMin: 19656000,
    capacityPcs: 3448425,
    remarks: "Winter knit fleece runs",
    avgMachinePerLine: 11,
    linesCount: 11,
    workingHours: 8,
    efficiencyPct: 90,
    avgSam: 5.7,
    details: [],
  },
  {
    id: "alloc-4",
    companyName: "Pakiza Knit Composite Ltd",
    location: "PKCL-Savar",
    year: 2026,
    month: "February",
    complexityLevel: "Basic",
    workingDays: 24,
    capacityMin: 18083520,
    capacityPcs: 3172551,
    remarks: "Short production month allocations",
    avgMachinePerLine: 11,
    linesCount: 11,
    workingHours: 8,
    efficiencyPct: 90,
    avgSam: 5.7,
    details: [],
  },
  {
    id: "alloc-5",
    companyName: "Pakiza Knit Composite Ltd",
    location: "PKCL-Savar",
    year: 2026,
    month: "January",
    complexityLevel: "Basic",
    workingDays: 27,
    capacityMin: 20442240,
    capacityPcs: 3586362,
    remarks: "Initial year setup lines",
    avgMachinePerLine: 11,
    linesCount: 11,
    workingHours: 8,
    efficiencyPct: 90,
    avgSam: 5.7,
    details: [],
  },
];

function MerchandisingCapacityPlanningPage() {
  // Screen mode: "list" | "form"
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  
  // Ledger list states
  const [allocations, setAllocations] = useState<CapacityAllocation[]>(INITIAL_ALLOCATIONS);
  const [filterYear, setFilterYear] = useState<number>(2026);
  const [filterMonth, setFilterMonth] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Form Master Info States
  const [formId, setFormId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("Pakiza Knit Composite Ltd");
  const [location, setLocation] = useState("PKCL-Savar");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState("January");
  const [complexityLevel, setComplexityLevel] = useState<"Basic" | "Standard" | "Complex">("Basic");
  const [avgMachinePerLine, setAvgMachinePerLine] = useState(11);
  const [linesCount, setLinesCount] = useState(11);
  const [workingHours, setWorkingHours] = useState(8);
  const [efficiencyPct, setEfficiencyPct] = useState(90);
  const [avgSam, setAvgSam] = useState(90);
  const [remarks, setRemarks] = useState("");
  
  // Form Details Info State
  const [details, setDetails] = useState<CapacityDetailRow[]>([]);

  // Initialize details table when month or year changes in form
  useEffect(() => {
    if (viewMode === "form" && !formId) {
      const dates = generateDatesForMonth(month, year);
      const rows: CapacityDetailRow[] = dates.map(date => {
        // Calculate initial capacity based on default master config
        const totalMins = linesCount * avgMachinePerLine * workingHours * 60 * (efficiencyPct / 100);
        const totalPcs = avgSam > 0 ? Math.round(totalMins / avgSam) : 0;
        return {
          date,
          status: "Open",
          linesCount,
          machinesCount: avgMachinePerLine,
          workingHours,
          capacityMin: Math.round(totalMins),
          capacityPcs: totalPcs
        };
      });
      setDetails(rows);
    }
  }, [month, year, viewMode, formId]);

  // Handle calculation for all rows based on Master parameters
  const handleBulkCapacityCalculation = () => {
    const updated = details.map(row => {
      const mins = row.status === "Open" 
        ? linesCount * avgMachinePerLine * workingHours * 60 * (efficiencyPct / 100)
        : 0;
      const pcs = row.status === "Open" && avgSam > 0 ? Math.round(mins / avgSam) : 0;
      return {
        ...row,
        linesCount: row.status === "Open" ? linesCount : 0,
        machinesCount: row.status === "Open" ? avgMachinePerLine : 0,
        workingHours: row.status === "Open" ? workingHours : 0,
        capacityMin: Math.round(mins),
        capacityPcs: pcs
      };
    });
    setDetails(updated);
    toast.success("Capacity details calculated using Master defaults!");
  };

  // Recalculate specific row capacity inline when values change
  const handleRowChange = (index: number, field: keyof CapacityDetailRow, value: any) => {
    setDetails(prev => prev.map((row, i) => {
      if (i === index) {
        const updatedRow = { ...row, [field]: value };
        
        // If status changes to Closed, clear values
        if (field === "status" && value === "Closed") {
          updatedRow.linesCount = 0;
          updatedRow.machinesCount = 0;
          updatedRow.workingHours = 0;
          updatedRow.capacityMin = 0;
          updatedRow.capacityPcs = 0;
        } else if (field === "status" && value === "Open") {
          updatedRow.linesCount = linesCount;
          updatedRow.machinesCount = avgMachinePerLine;
          updatedRow.workingHours = workingHours;
        }

        // Recalculate capacity
        if (updatedRow.status === "Open") {
          const mins = updatedRow.linesCount * updatedRow.machinesCount * updatedRow.workingHours * 60 * (efficiencyPct / 100);
          const pcs = avgSam > 0 ? Math.round(mins / avgSam) : 0;
          updatedRow.capacityMin = Math.round(mins);
          updatedRow.capacityPcs = pcs;
        }

        return updatedRow;
      }
      return row;
    }));
  };

  // Sum up details for Net Capacity values
  const netCapacitySummary = useMemo(() => {
    let totalMin = 0;
    let totalPcs = 0;
    let openDays = 0;
    
    details.forEach(d => {
      if (d.status === "Open") {
        totalMin += d.capacityMin;
        totalPcs += d.capacityPcs;
        openDays += 1;
      }
    });

    return {
      totalMin,
      totalPcs,
      openDays
    };
  }, [details]);

  // Handle Edit click from list view
  const handleEditAllocation = (alloc: CapacityAllocation) => {
    setFormId(alloc.id);
    setCompanyName(alloc.companyName);
    setLocation(alloc.location);
    setYear(alloc.year);
    setMonth(alloc.month);
    setComplexityLevel(alloc.complexityLevel);
    setAvgMachinePerLine(alloc.avgMachinePerLine);
    setLinesCount(alloc.linesCount);
    setWorkingHours(alloc.workingHours);
    setEfficiencyPct(alloc.efficiencyPct);
    setAvgSam(alloc.avgSam);
    setRemarks(alloc.remarks);
    
    // Load existing details or generate defaults if missing
    if (alloc.details && alloc.details.length > 0) {
      setDetails(alloc.details);
    } else {
      const dates = generateDatesForMonth(alloc.month, alloc.year);
      const rows: CapacityDetailRow[] = dates.map(date => {
        const totalMins = alloc.linesCount * alloc.avgMachinePerLine * alloc.workingHours * 60 * (alloc.efficiencyPct / 100);
        const totalPcs = alloc.avgSam > 0 ? Math.round(totalMins / alloc.avgSam) : 0;
        return {
          date,
          status: "Open",
          linesCount: alloc.linesCount,
          machinesCount: alloc.avgMachinePerLine,
          workingHours: alloc.workingHours,
          capacityMin: Math.round(totalMins),
          capacityPcs: totalPcs
        };
      });
      setDetails(rows);
    }
    setViewMode("form");
  };

  // Delete an allocation record
  const handleDeleteAllocation = (id: string) => {
    if (confirm("Are you sure you want to delete this capacity allocation?")) {
      setAllocations(prev => prev.filter(a => a.id !== id));
      toast.success("Capacity allocation record removed.");
    }
  };

  // Save the Allocation Config
  const handleSaveAllocation = () => {
    const payload: CapacityAllocation = {
      id: formId || `alloc-${Date.now()}`,
      companyName,
      location,
      year,
      month,
      complexityLevel,
      workingDays: netCapacitySummary.openDays,
      capacityMin: netCapacitySummary.totalMin,
      capacityPcs: netCapacitySummary.totalPcs,
      remarks,
      avgMachinePerLine,
      linesCount,
      workingHours,
      efficiencyPct,
      avgSam,
      details
    };

    if (formId) {
      setAllocations(prev => prev.map(a => a.id === formId ? payload : a));
      toast.success("Capacity Allocation updated successfully!");
    } else {
      setAllocations(prev => [payload, ...prev]);
      toast.success("New Capacity Allocation saved successfully!");
    }
    setViewMode("list");
    setFormId(null);
  };

  // Filter & Search allocations in the list view
  const filteredAllocations = useMemo(() => {
    return allocations.filter(alloc => {
      const matchYear = alloc.year === filterYear;
      const matchMonth = filterMonth === "All" || alloc.month === filterMonth;
      
      const s = searchQuery.toLowerCase();
      const matchSearch = searchQuery === "" || 
        alloc.companyName.toLowerCase().includes(s) || 
        alloc.location.toLowerCase().includes(s) || 
        alloc.remarks.toLowerCase().includes(s) ||
        alloc.complexityLevel.toLowerCase().includes(s);

      return matchYear && matchMonth && matchSearch;
    });
  }, [allocations, filterYear, filterMonth, searchQuery]);

  return (
    <MerchandisingLayout
      activePath="capacity"
      breadcrumbs={[{ label: "Capacity" }, { label: "Capacity Allocation" }]}
      title={viewMode === "list" ? "Capacity Allocation Master" : "Capacity Allocation Workspace"}
    >
      <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6 transition-colors duration-200">
        
        {/* VIEW MODE: LIST VIEW */}
        {viewMode === "list" && (
          <div className="space-y-6">
            
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                  <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Activity className="size-4.5" /></span>
                  Capacity Allocation Ledger
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Manage and review monthly factory capacities, complex levels, and production limits</p>
              </div>

              <button
                onClick={() => {
                  setFormId(null);
                  setYear(2026);
                  setMonth("January");
                  setComplexityLevel("Basic");
                  setAvgMachinePerLine(11);
                  setLinesCount(11);
                  setWorkingHours(8);
                  setEfficiencyPct(90);
                  setAvgSam(90);
                  setRemarks("");
                  setDetails([]);
                  setViewMode("form");
                }}
                className="h-9.5 px-4 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 hover:opacity-95 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="size-3.5" /> Add Capacity Allocation
              </button>
            </div>

            {/* Collapsible Search Filters Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-3xs relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-teal-500/15 via-teal-500/40 to-teal-500/15" />
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-900 dark:text-white">
                <Sliders className="size-4 text-teal-500" />
                <span>Search Filters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Year</label>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Month</label>
                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="All">All Months</option>
                    {MONTHS_LIST.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => toast.success("Filtered allocations matching criteria.")}
                  className="h-9 px-5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Search size={14} /> Search
                </button>
              </div>
            </div>

            {/* List Table container */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-3xs overflow-hidden">
              
              {/* Spreadsheet Actions Toolbar */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toast.info("Exporting to Excel (mock)...")}
                    className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-350 hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-900 dark:hover:text-white transition text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="size-3.5 text-emerald-500" /> Excel
                  </button>
                  <button
                    onClick={() => toast.info("Opening print dialog...")}
                    className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-350 hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-900 dark:hover:text-white transition text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="size-3.5 text-blue-500" /> Print
                  </button>
                  <button
                    onClick={() => toast.info("Downloading PDF (mock)...")}
                    className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-350 hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-900 dark:hover:text-white transition text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="size-3.5 text-rose-500" /> PDF
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-[10px] font-black uppercase text-slate-400 shrink-0">Search:</span>
                  <div className="relative w-full sm:w-48">
                    <input
                      type="text"
                      placeholder="Type style description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold select-none">
                      <th className="px-4 py-3 text-center w-12">SL</th>
                      <th className="px-4 py-3 text-center w-20">Actions</th>
                      <th className="px-4 py-3 min-w-[180px]">Company Name</th>
                      <th className="px-4 py-3 min-w-[120px]">Location</th>
                      <th className="px-4 py-3 text-center">Year</th>
                      <th className="px-4 py-3 text-center">Month</th>
                      <th className="px-4 py-3 text-center">Complexity Level</th>
                      <th className="px-4 py-3 text-center">Working Day</th>
                      <th className="px-4 py-3 text-right">Capacity (Min)</th>
                      <th className="px-4 py-3 text-right">Capacity (Pcs)</th>
                      <th className="px-4 py-3 min-w-[200px]">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredAllocations.map((a, idx) => (
                      <tr 
                        key={a.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition duration-150 text-slate-700 dark:text-slate-350 font-bold"
                      >
                        <td className="px-4 py-3 text-center text-slate-400">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleEditAllocation(a)}
                              className="size-6.5 rounded-md bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-600 transition flex items-center justify-center cursor-pointer border border-amber-500/15"
                              title="Edit Capacity"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteAllocation(a.id)}
                              className="size-6.5 rounded-md bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 transition flex items-center justify-center cursor-pointer border border-rose-500/15"
                              title="Delete Allocation"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-900 dark:text-white font-extrabold">{a.companyName}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-450">{a.location}</td>
                        <td className="px-4 py-3 text-center font-mono">{a.year}</td>
                        <td className="px-4 py-3 text-center">{a.month}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            a.complexityLevel === "Complex"
                              ? "bg-rose-500/10 text-rose-500 border border-rose-500/15"
                              : a.complexityLevel === "Standard"
                              ? "bg-blue-500/10 text-blue-500 border border-blue-500/15"
                              : "bg-teal-500/10 text-teal-500 border border-teal-500/15"
                          }`}>
                            {a.complexityLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-slate-900 dark:text-white">{a.workingDays}</td>
                        <td className="px-4 py-3 text-right font-mono text-slate-900 dark:text-white">{a.capacityMin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3 text-right font-mono text-teal-600 dark:text-teal-400">{a.capacityPcs.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3 text-slate-400 font-normal truncate max-w-xs">{a.remarks || "—"}</td>
                      </tr>
                    ))}
                    {filteredAllocations.length === 0 && (
                      <tr>
                        <td colSpan={11} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 font-semibold">
                          No capacity allocation records found matching search filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold select-none">
                <div>Showing 1 to {filteredAllocations.length} of {filteredAllocations.length} entries</div>
                <div className="flex items-center gap-1.5">
                  <button className="px-2.5 py-1 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-55 transition text-[10px] text-slate-400 cursor-not-allowed">Previous</button>
                  <span className="size-6 rounded bg-teal-500 text-white flex items-center justify-center text-[10px] font-extrabold shadow-sm shadow-teal-500/20">1</span>
                  <button className="px-2.5 py-1 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-55 transition text-[10px] text-slate-400 cursor-not-allowed">Next</button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW MODE: EDITING / CREATION WORKSPACE FORM */}
        {viewMode === "form" && (
          <div className="space-y-6">
            
            {/* Header Toolbar */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("list");
                    setFormId(null);
                  }}
                  className="size-8.5 rounded-lg border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-900 dark:hover:text-white transition duration-200 cursor-pointer"
                  title="Back to ledger list"
                >
                  <ArrowLeft size={15} />
                </button>
                <div>
                  <h2 className="text-sm font-black tracking-tight text-slate-950 dark:text-white uppercase tracking-wider">
                    {formId ? "Modify Capacity Configuration" : "Configure New Capacity Allocation"}
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-0.5">Define master variables and adjust day-by-day factory line allocations</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setViewMode("list");
                    setFormId(null);
                  }}
                  className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 hover:text-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAllocation}
                  className="h-9 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-500/10 transition cursor-pointer"
                >
                  <Save className="size-3.5" /> Save Allocation
                </button>
              </div>
            </div>

            {/* Split Form Workspace Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              
              {/* Column Left: Master Info Card */}
              <div className="xl:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-5 shadow-3xs relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[3px] bg-teal-500" />
                
                <div>
                  <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-850">
                    <Info className="size-4 text-teal-500" /> Capacity Allocation Master Info
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value={2026}>2026</option>
                      <option value={2027}>2027</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Month</label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      disabled={!!formId} // Lock month selection on edit to preserve integrity
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none disabled:opacity-60"
                    >
                      {MONTHS_LIST.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Complexity Level</label>
                    <select
                      value={complexityLevel}
                      onChange={(e) => setComplexityLevel(e.target.value as any)}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Standard">Standard</option>
                      <option value="Complex">Complex</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Avg M/c / Line <span className="text-rose-500">*</span></label>
                    <input
                      type="number"
                      value={avgMachinePerLine}
                      onChange={(e) => setAvgMachinePerLine(Number(e.target.value))}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Number of Line <span className="text-rose-500">*</span></label>
                    <input
                      type="number"
                      value={linesCount}
                      onChange={(e) => setLinesCount(Number(e.target.value))}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Working Hour <span className="text-rose-500">*</span></label>
                    <input
                      type="number"
                      value={workingHours}
                      onChange={(e) => setWorkingHours(Number(e.target.value))}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Efficiency % <span className="text-rose-500">*</span></label>
                    <input
                      type="number"
                      value={efficiencyPct}
                      onChange={(e) => setEfficiencyPct(Number(e.target.value))}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Avg SAM <span className="text-rose-500">*</span></label>
                    <input
                      type="number"
                      value={avgSam}
                      onChange={(e) => setAvgSam(Number(e.target.value))}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                </div>

                {/* Calculation Button */}
                <button
                  type="button"
                  onClick={handleBulkCapacityCalculation}
                  className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition duration-150 cursor-pointer"
                >
                  Capacity Calculation
                </button>

                {/* Calculated summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-850 pt-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Net Capacity (Min)</span>
                    <div className="text-lg font-black text-slate-950 dark:text-white mt-0.5">{netCapacitySummary.totalMin.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Net Capacity (Pcs)</span>
                    <div className="text-lg font-black text-slate-950 dark:text-white mt-0.5">{netCapacitySummary.totalPcs.toLocaleString()}</div>
                  </div>
                </div>

                {/* Remarks field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Remarks</label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter special configuration comments..."
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                {/* Save Master Button */}
                <button
                  type="button"
                  onClick={handleSaveAllocation}
                  className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition duration-150 cursor-pointer"
                >
                  Save
                </button>
              </div>

              {/* Column Right: Details Grid Scrollable Table */}
              <div className="xl:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-3xs relative overflow-hidden flex flex-col h-[650px]">
                <div className="absolute top-0 inset-x-0 h-[3px] bg-blue-500" />
                
                <div>
                  <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-850">
                    <Calculator className="size-4 text-blue-500" /> Capacity Allocation Details Info
                  </h3>
                </div>

                {/* Scrollable details list */}
                <div className="flex-1 overflow-y-auto scrollbar-thin border border-slate-100 dark:border-slate-800 rounded-lg">
                  <table className="w-full border-collapse text-left text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-450 border-b border-slate-150 dark:border-slate-800 font-extrabold select-none sticky top-0 z-10">
                        <th className="px-3 py-2.5 text-center w-12 bg-slate-50 dark:bg-slate-950">SL</th>
                        <th className="px-3 py-2.5 min-w-[90px] bg-slate-50 dark:bg-slate-950">Date</th>
                        <th className="px-3 py-2.5 text-center w-24 bg-slate-50 dark:bg-slate-950">Status</th>
                        <th className="px-3 py-2.5 text-center w-20 bg-slate-50 dark:bg-slate-950">No of Line</th>
                        <th className="px-3 py-2.5 text-center w-20 bg-slate-50 dark:bg-slate-950">No of Machin</th>
                        <th className="px-3 py-2.5 text-center w-20 bg-slate-50 dark:bg-slate-950">Working Hour</th>
                        <th className="px-3 py-2.5 text-right w-24 bg-slate-50 dark:bg-slate-950">Capacity (Min)</th>
                        <th className="px-3 py-2.5 text-right w-24 bg-slate-50 dark:bg-slate-950">Capacity (Pcs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {details.map((row, index) => (
                        <tr 
                          key={index} 
                          className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition duration-150 font-bold ${
                            row.status === "Closed" ? "opacity-60 bg-slate-100/30 dark:bg-slate-950/20" : ""
                          }`}
                        >
                          <td className="px-3 py-2.5 text-center text-slate-400 font-normal">{index + 1}</td>
                          <td className="px-3 py-2.5 font-mono text-slate-600 dark:text-slate-350">{row.date}</td>
                          <td className="px-3 py-2">
                            <select
                              value={row.status}
                              onChange={(e) => handleRowChange(index, "status", e.target.value as any)}
                              className="w-full text-[10px] font-black uppercase px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none"
                            >
                              <option value="Open">Open</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={row.linesCount}
                              disabled={row.status === "Closed"}
                              onChange={(e) => handleRowChange(index, "linesCount", Number(e.target.value))}
                              className="w-full text-center text-[10px] font-bold px-1.5 py-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none disabled:opacity-50 disabled:bg-slate-100"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={row.machinesCount}
                              disabled={row.status === "Closed"}
                              onChange={(e) => handleRowChange(index, "machinesCount", Number(e.target.value))}
                              className="w-full text-center text-[10px] font-bold px-1.5 py-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none disabled:opacity-50 disabled:bg-slate-100"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={row.workingHours}
                              disabled={row.status === "Closed"}
                              onChange={(e) => handleRowChange(index, "workingHours", Number(e.target.value))}
                              className="w-full text-center text-[10px] font-bold px-1.5 py-0.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none disabled:opacity-50 disabled:bg-slate-100"
                            />
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono text-slate-800 dark:text-slate-300">
                            {row.capacityMin.toLocaleString()}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono text-teal-600 dark:text-teal-400">
                            {row.capacityPcs.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Legend indicator */}
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold select-none pt-2 border-t border-slate-100 dark:border-slate-850">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-teal-500"></span> Active Days ({netCapacitySummary.openDays} open)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-slate-300 dark:bg-slate-800"></span> Closed Days
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </MerchandisingLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import MerchandisingLayout from "../components/merchandising/MerchandisingLayout";
import {
  Activity,
  Plus,
  Search,
  Download,
  Printer,
  FileSpreadsheet,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-capacity-allocation")({
  head: () => ({
    meta: [
      { title: "Capacity Allocation — RMG Merchandising" },
      { name: "description", content: "Monthly factory line efficiency calculations, machine capacities, and booking ledger." },
    ],
  }),
  component: CapacityAllocationPage,
});

// Capacity Allocation Details
interface CapacityDetailRow {
  date: string;
  status: "Open" | "Close";
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

// Helper to get days
const getDaysInMonth = (monthName: string, year: number): number => {
  const monthIndex = MONTHS_LIST.indexOf(monthName);
  if (monthIndex === -1) return 31;
  return new Date(year, monthIndex + 1, 0).getDate();
};

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

// Initial Capacity Allocations (matching the screenshot values)
const INITIAL_ALLOCATIONS: CapacityAllocation[] = [
  {
    id: "alloc-1",
    companyName: "Pakiza Knit Composite Ltd",
    location: "PKCL-Savar",
    year: 2026,
    month: "April",
    complexityLevel: "Basic",
    workingDays: 24,
    capacityMin: 18869760.00,
    capacityPcs: 3310488.00,
    remarks: "",
    avgMachinePerLine: 32,
    linesCount: 63,
    workingHours: 10,
    efficiencyPct: 65,
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
    workingDays: 26,
    capacityMin: 20442240.00,
    capacityPcs: 3586362.00,
    remarks: "",
    avgMachinePerLine: 32,
    linesCount: 63,
    workingHours: 10,
    efficiencyPct: 65,
    avgSam: 5.7,
    details: [],
  },
];

function CapacityAllocationPage() {
  const [allocations, setAllocations] = useState<CapacityAllocation[]>(INITIAL_ALLOCATIONS);
  const [filterYear, setFilterYear] = useState<number>(2026);
  const [filterMonth, setFilterMonth] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("All");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("Pakiza Knit Composite Ltd");
  const [location, setLocation] = useState("PKCL-Savar");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState("April");
  const [complexityLevel, setComplexityLevel] = useState<"Basic" | "Standard" | "Complex">("Basic");
  const [avgMachinePerLine, setAvgMachinePerLine] = useState(32);
  const [linesCount, setLinesCount] = useState(63);
  const [workingHours, setWorkingHours] = useState(10);
  const [efficiencyPct, setEfficiencyPct] = useState(65);
  const [avgSam, setAvgSam] = useState(5.7);
  const [remarks, setRemarks] = useState("");
  const [details, setDetails] = useState<CapacityDetailRow[]>([]);

  // Reset/populate default details rows when opening form modal for a new allocation
  useEffect(() => {
    if (isModalOpen && !formId) {
      const dates = generateDatesForMonth(month, year);
      const rows: CapacityDetailRow[] = dates.map(date => {
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
  }, [month, year, isModalOpen, formId]);

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
    toast.success("Allocation calculated!");
  };

  const handleRowChange = (index: number, field: keyof CapacityDetailRow, value: any) => {
    setDetails(prev => prev.map((row, i) => {
      if (i === index) {
        const updatedRow = { ...row, [field]: value };
        if (field === "status" && value === "Close") {
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
    return { totalMin, totalPcs, openDays };
  }, [details]);

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
    
    if (alloc.details && alloc.details.length > 0) {
      setDetails(alloc.details);
    } else {
      // Generate default matching rows if details array is empty
      const dates = generateDatesForMonth(alloc.month, alloc.year);
      const rows: CapacityDetailRow[] = dates.map((date, idx) => {
        // Mock some closed days to match screenshot (e.g. Fridays 3, 10, 17, 24)
        const isClosed = idx === 2 || idx === 9 || idx === 13 || idx === 14 || idx === 16; 
        const statusVal = isClosed ? "Close" : "Open";
        const totalMins = isClosed ? 0 : alloc.linesCount * alloc.avgMachinePerLine * alloc.workingHours * 60 * (alloc.efficiencyPct / 100);
        const totalPcs = isClosed ? 0 : (alloc.avgSam > 0 ? Math.round(totalMins / alloc.avgSam) : 0);
        return {
          date,
          status: statusVal as any,
          linesCount: isClosed ? 0 : alloc.linesCount,
          machinesCount: isClosed ? 0 : alloc.avgMachinePerLine,
          workingHours: isClosed ? 0 : alloc.workingHours,
          capacityMin: Math.round(totalMins),
          capacityPcs: totalPcs
        };
      });
      setDetails(rows);
    }
    setIsModalOpen(true);
  };

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
      toast.success("Capacity Allocation updated!");
    } else {
      setAllocations(prev => [payload, ...prev]);
      toast.success("Capacity Allocation saved!");
    }
    setIsModalOpen(false);
    setFormId(null);
  };

  const filteredAllocations = useMemo(() => {
    return allocations.filter(alloc => {
      const matchYear = alloc.year === filterYear;
      const matchMonth = filterMonth === "All" || alloc.month === filterMonth;
      const s = searchQuery.toLowerCase();
      const matchSearch = searchQuery === "All" || searchQuery === "" || 
        alloc.companyName.toLowerCase().includes(s) || 
        alloc.remarks.toLowerCase().includes(s);
      return matchYear && matchMonth && matchSearch;
    });
  }, [allocations, filterYear, filterMonth, searchQuery]);

  return (
    <MerchandisingLayout
      activePath="capacity-allocation"
      breadcrumbs={[{ label: "Capacity" }, { label: "Capacity Allocation" }]}
      title="Capacity Allocation Workspace"
    >
      <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6 transition-colors duration-200">
        
        {/* Top Header & Search Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-3xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-black tracking-tight text-slate-950 dark:text-white uppercase flex items-center gap-2">
                <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Activity className="size-4.5" /></span>
                Capacity Allocation Ledger
              </h2>
            </div>
            <button 
              onClick={() => { 
                setFormId(null); 
                setYear(2026); 
                setMonth("April"); 
                setComplexityLevel("Basic"); 
                setAvgMachinePerLine(32); 
                setLinesCount(63); 
                setWorkingHours(10); 
                setEfficiencyPct(65); 
                setAvgSam(5.7); 
                setRemarks(""); 
                setDetails([]); 
                setIsModalOpen(true); 
              }} 
              className="h-9.5 px-4 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 hover:opacity-95 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="size-3.5" /> Add Capacity Allocation
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">Year</label>
              <select 
                value={filterYear} 
                onChange={(e)=>setFilterYear(Number(e.target.value))} 
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value={2026}>2026</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">Month</label>
              <select 
                value={filterMonth} 
                onChange={(e)=>setFilterMonth(e.target.value)} 
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Months</option>
                {MONTHS_LIST.map(m=>(<option key={m} value={m}>{m}</option>))}
              </select>
            </div>
            <button type="button" onClick={()=>toast.success("Filtered allocations")} className="h-9 px-5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider shadow-sm"><Search size={14} /> Search</button>
          </div>
        </div>

        {/* Data Card containing spreadsheet and toolbar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-3xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center gap-1.5">
              <button onClick={()=>toast.info("Exporting Excel...")} className="h-8 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-350"><FileSpreadsheet className="size-3.5 text-emerald-500" /> EXCEL</button>
              <button onClick={()=>toast.info("Printing...")} className="h-8 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-350"><Printer className="size-3.5 text-blue-550" /> PRINT</button>
              <button onClick={()=>toast.info("PDF...")} className="h-8 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-350"><Download className="size-3.5 text-rose-500" /> PDF</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400">Search:</span>
              <input type="text" placeholder="Search..." value={searchQuery === "All" ? "" : searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="text-xs px-3 py-1.5 bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg w-48 focus:outline-none text-slate-800 dark:text-slate-200" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-955 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-extrabold text-left">
                  <th className="px-4 py-3.5 text-center w-12">SL</th>
                  <th className="px-4 py-3.5 text-center w-10"></th>
                  <th className="px-4 py-3.5">Company Name</th>
                  <th className="px-4 py-3.5">Location</th>
                  <th className="px-4 py-3.5 text-center">Year</th>
                  <th className="px-4 py-3.5 text-center">Month</th>
                  <th className="px-4 py-3.5 text-center">ComplexityLevel</th>
                  <th className="px-4 py-3.5 text-center">Working Day</th>
                  <th className="px-4 py-3.5 text-right">Capacity(Min)</th>
                  <th className="px-4 py-3.5 text-right">Capacity(Pcs)</th>
                  <th className="px-4 py-3.5">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredAllocations.map((a, idx) => (
                  <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-350 font-bold border-b border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 text-center text-slate-400 font-normal">{idx+1}</td>
                    <td className="px-2 py-3 text-center">
                      <button onClick={()=>handleEditAllocation(a)} className="bg-transparent border-0 text-[#F39C12] hover:text-[#D35400] cursor-pointer flex items-center justify-center" title="Edit Allocation"><Edit2 size={13} /></button>
                    </td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-extrabold">{a.companyName}</td>
                    <td className="px-4 py-3">{a.location}</td>
                    <td className="px-4 py-3 text-center font-mono">{a.year}</td>
                    <td className="px-4 py-3 text-center">{a.month}</td>
                    <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-500 border border-teal-500/15 text-[10px]">{a.complexityLevel}</span></td>
                    <td className="px-4 py-3 text-center font-mono">{a.workingDays}</td>
                    <td className="px-4 py-3 text-right font-mono">{a.capacityMin.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-mono text-teal-600 dark:text-teal-400">{a.capacityPcs.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-400 font-normal truncate max-w-xs">{a.remarks || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- CAPACITY ALLOCATION CREATE & EDIT MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-none">
            <div className="bg-[#F8F9F9] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-7xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
              
              {/* Modal Header */}
              <div className="absolute top-0 inset-x-0 h-[3.5px] bg-gradient-to-r from-teal-500 to-emerald-600" />
              <div className="bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase text-slate-950 dark:text-white tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-teal-500" />
                  {formId ? "Edit Capacity Allocation" : "Setup New Capacity Allocation"}
                </h3>
                <button 
                  onClick={() => { setIsModalOpen(false); setFormId(null); }} 
                  className="size-7 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Master Info */}
                <div className="xl:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-xs relative">
                  <h3 className="text-[12px] font-black uppercase text-blue-500 dark:text-blue-400 pb-2 border-b border-slate-100 dark:border-slate-850 flex items-center gap-2">
                    Capacity Allocation Master Info
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400">Year</label>
                      <select value={year} onChange={(e)=>setYear(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"><option value={2026}>2026</option></select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400">Month</label>
                      <select value={month} onChange={(e)=>setMonth(e.target.value)} disabled={!!formId} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none disabled:opacity-60">{MONTHS_LIST.map(m=>(<option key={m} value={m}>{m}</option>))}</select>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400">Comp. Level</label>
                      <select value={complexityLevel} onChange={(e)=>setComplexityLevel(e.target.value as any)} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"><option value="Basic">Basic</option><option value="Standard">Standard</option></select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400">Avg M/c / Line *</label>
                      <input type="number" value={avgMachinePerLine} onChange={(e)=>setAvgMachinePerLine(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400">Numer Of Line *</label>
                      <input type="number" value={linesCount} onChange={(e)=>setLinesCount(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400">Working Hour *</label>
                      <input type="number" value={workingHours} onChange={(e)=>setWorkingHours(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400">Efficiency % *</label>
                      <input type="number" value={efficiencyPct} onChange={(e)=>setEfficiencyPct(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none" />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400">Avg SAM *</label>
                      <input type="number" step="0.1" value={avgSam} onChange={(e)=>setAvgSam(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-850 dark:text-slate-200 focus:outline-none" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="button" 
                      onClick={handleBulkCapacityCalculation} 
                      className="w-full h-9 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-[10px] uppercase rounded-lg cursor-pointer shadow-sm tracking-wider"
                    >
                      CAPACITY CALCULATION
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-850 pt-4">
                    <div className="p-1 bg-transparent"><span className="text-[10px] text-slate-400 font-semibold">Net Capacity (Min)</span><div className="text-sm font-extrabold mt-0.5 text-slate-800 dark:text-white font-mono">{netCapacitySummary.totalMin.toFixed(2)}</div></div>
                    <div className="p-1 bg-transparent"><span className="text-[10px] text-slate-400 font-semibold">Net Capacity (Pcs)</span><div className="text-sm font-extrabold mt-0.5 text-slate-800 dark:text-white font-mono">{netCapacitySummary.totalPcs.toFixed(2)}</div></div>
                  </div>

                  <div className="space-y-1 border-t border-slate-100 dark:border-slate-850 pt-4">
                    <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400">Remarks</label>
                    <textarea rows={1} value={remarks} onChange={(e)=>setRemarks(e.target.value)} className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none" />
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button 
                      onClick={handleSaveAllocation} 
                      className="bg-[#27AE60] hover:bg-[#219653] text-white px-6 py-2 text-xs font-bold rounded-lg shadow-sm cursor-pointer uppercase tracking-wider"
                    >
                      SAVE
                    </button>
                    <button 
                      onClick={() => { setIsModalOpen(false); setFormId(null); }} 
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Right Side: Details Info */}
                <div className="xl:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs flex flex-col h-[650px] relative">
                  <h3 className="text-[12px] font-black uppercase text-slate-950 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-850">
                    Capacity Allocation Details Info
                  </h3>
                  
                  <div className="flex-1 overflow-y-auto scrollbar-thin border border-slate-200 dark:border-slate-800 rounded-lg">
                    <table className="w-full border-collapse text-left text-[11px]">
                      <thead>
                        <tr className="bg-[#FDF2E9] dark:bg-slate-950 text-[#A04000] dark:text-[#E59866] border-b border-[#F5CBA7] dark:border-slate-800 font-extrabold sticky top-0 z-10">
                          <th className="px-3 py-2.5 text-center w-12">SL</th>
                          <th className="px-3 py-2.5">Date</th>
                          <th className="px-3 py-2.5 text-center w-24">Status</th>
                          <th className="px-3 py-2.5 text-center w-20">No of Line</th>
                          <th className="px-3 py-2.5 text-center w-20">No of Machin</th>
                          <th className="px-3 py-2.5 text-center w-20">Working Hour</th>
                          <th className="px-3 py-2.5 text-right w-24">Capacity (Min)</th>
                          <th className="px-3 py-2.5 text-right w-24">Capacity (Pcs)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.map((row, index) => (
                          <tr key={index} className={row.status === "Close" ? "opacity-60 bg-slate-50 dark:bg-slate-900/50" : "hover:bg-slate-50/50 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-100 dark:border-slate-800"}>
                            <td className="px-3 py-2.5 text-center text-slate-400 font-normal">{index + 1}</td>
                            <td className="px-3 py-2.5 font-mono">{row.date}</td>
                            <td className="px-3 py-2">
                              <select 
                                value={row.status} 
                                onChange={(e) => handleRowChange(index, "status", e.target.value as any)} 
                                className="w-full text-[10px] font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-800 dark:text-slate-200"
                              >
                                <option value="Open">Open</option>
                                <option value="Close">Close</option>
                              </select>
                            </td>
                            <td className="px-3 py-2">
                              <input 
                                type="number" 
                                value={row.linesCount.toFixed(2)} 
                                disabled={row.status === "Close"} 
                                onChange={(e) => handleRowChange(index, "linesCount", Number(e.target.value))} 
                                className="w-full text-center text-[10px] font-bold px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md disabled:opacity-50 text-slate-800 dark:text-slate-200" 
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input 
                                type="number" 
                                value={row.machinesCount.toFixed(2)} 
                                disabled={row.status === "Close"} 
                                onChange={(e) => handleRowChange(index, "machinesCount", Number(e.target.value))} 
                                className="w-full text-center text-[10px] font-bold px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md disabled:opacity-50 text-slate-800 dark:text-slate-200" 
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input 
                                type="number" 
                                value={row.workingHours.toFixed(2)} 
                                disabled={row.status === "Close"} 
                                onChange={(e) => handleRowChange(index, "workingHours", Number(e.target.value))} 
                                className="w-full text-center text-[10px] font-bold px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md disabled:opacity-50 text-slate-800 dark:text-slate-200" 
                              />
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono">{row.capacityMin.toFixed(2)}</td>
                            <td className="px-3 py-2.5 text-right font-mono text-teal-600 dark:text-teal-400">{row.capacityPcs.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

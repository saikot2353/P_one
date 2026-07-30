import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
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
  AlertTriangle,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-capacity-distribution")({
  head: () => ({
    meta: [
      { title: "Capacity Distribution — RMG Merchandising" },
      { name: "description", content: "Monthly factory line efficiency calculations, machine capacities, and booking ledger." },
    ],
  }),
  component: CapacityDistributionPage,
});

// Capacity Distribution Details
interface CapacityDistributionRow {
  buyerName: string;
  allocationPct: number;
  allocCapMin: number;
  allocCapPcs: number;
}

interface CapacityDistribution {
  id: string;
  companyName: string;
  location: string;
  year: number;
  month: string;
  totalCapacityMin: number;
  totalCapacityPcs: number;
  details: CapacityDistributionRow[];
}

// Mock references for searching
interface CapacityAllocationMock {
  year: number;
  month: string;
  capacityMin: number;
  capacityPcs: number;
}

interface MonthlyCapacityMock {
  year: number;
  month: string;
  totalCapacity: number;
}

const MONTHS_LIST = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const BUYERS_LIST = [
  "FATFACE", "JMC", "MANGO", "Next Sourcing", "RAGNO SPORTS", "H&M", "ZARA", "Gap", "Levis"
];

// Initial Capacity Allocations (for lookup fallback)
const MOCK_ALLOCATIONS: CapacityAllocationMock[] = [
  {
    year: 2026,
    month: "April",
    capacityMin: 18869760.00,
    capacityPcs: 3310488.00,
  },
  {
    year: 2026,
    month: "August",
    capacityMin: 20442240.00,
    capacityPcs: 3586362.00,
  },
];

// Initial Monthly Capacities (for lookup fallback)
const MOCK_MONTHLY_CAPACITIES: MonthlyCapacityMock[] = [
  {
    year: 2026,
    month: "January",
    totalCapacity: 1069200
  },
  {
    year: 2026,
    month: "February",
    totalCapacity: 950400
  },
];

// Initial Capacity Distributions
const INITIAL_DISTRIBUTIONS: CapacityDistribution[] = [
  {
    id: "dist-1",
    companyName: "Pakiza Knit Composite Ltd",
    location: "PKCL-Savar",
    year: 2026,
    month: "January",
    totalCapacityMin: 20442240.00,
    totalCapacityPcs: 3586362.00,
    details: [
      { buyerName: "FATFACE", allocationPct: 35, allocCapMin: 7154784, allocCapPcs: 1255227 },
      { buyerName: "MANGO", allocationPct: 25, allocCapMin: 5110560, allocCapPcs: 896591 },
      { buyerName: "Next Sourcing", allocationPct: 20, allocCapMin: 4088448, allocCapPcs: 717272 },
      { buyerName: "RAGNO SPORTS", allocationPct: 20, allocCapMin: 4088448, allocCapPcs: 717272 },
    ]
  },
  {
    id: "dist-2",
    companyName: "Pakiza Knit Composite Ltd",
    location: "PKCL-Savar",
    year: 2026,
    month: "April",
    totalCapacityMin: 18869760.00,
    totalCapacityPcs: 3310488.00,
    details: [
      { buyerName: "JMC", allocationPct: 40, allocCapMin: 7547904, allocCapPcs: 1324195 },
      { buyerName: "MANGO", allocationPct: 30, allocCapMin: 5660928, allocCapPcs: 993146 },
      { buyerName: "FATFACE", allocationPct: 30, allocCapMin: 5660928, allocCapPcs: 993146 },
    ]
  }
];

function CapacityDistributionPage() {
  const [distributions, setDistributions] = useState<CapacityDistribution[]>(INITIAL_DISTRIBUTIONS);
  const [filterYearDist, setFilterYearDist] = useState<number>(2026);
  const [filterMonthDist, setFilterMonthDist] = useState<string>("All");
  const [searchQueryDist, setSearchQueryDist] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [distFormId, setDistFormId] = useState<string | null>(null);
  const [distYear, setDistYear] = useState(2026);
  const [distMonth, setDistMonth] = useState("January");
  const [distTotalMin, setDistTotalMin] = useState(20442240);
  const [distTotalPcs, setDistTotalPcs] = useState(3586362);
  const [distDetails, setDistDetails] = useState<CapacityDistributionRow[]>(() =>
    Array.from({ length: 8 }, () => ({ buyerName: "", allocationPct: 0, allocCapMin: 0, allocCapPcs: 0 }))
  );

  // Search capacity database for Year/Month to auto-fill totals
  const handleSearchCapacityForDistribution = () => {
    // Try to find matching allocation first
    const allocMatch = MOCK_ALLOCATIONS.find(a => a.year === distYear && a.month === distMonth);
    if (allocMatch) {
      setDistTotalMin(allocMatch.capacityMin);
      setDistTotalPcs(allocMatch.capacityPcs);
      toast.success(`Loaded capacities from Allocation settings for ${distMonth} ${distYear}!`);
      return;
    }

    // fallback to monthly capacity record
    const monthlyMatch = MOCK_MONTHLY_CAPACITIES.find(m => m.year === distYear && m.month === distMonth);
    if (monthlyMatch) {
      setDistTotalMin(monthlyMatch.totalCapacity * 5.7); // Mock factor
      setDistTotalPcs(monthlyMatch.totalCapacity);
      toast.success(`Loaded capacities from Monthly targets for ${distMonth} ${distYear}!`);
      return;
    }

    toast.warning("No allocation found. You can enter capacity totals manually.");
  };

  // Handle distribution row updates
  const handleDistRowChange = (index: number, field: keyof CapacityDistributionRow, value: any) => {
    setDistDetails(prev => prev.map((row, i) => {
      if (i === index) {
        const updatedRow = { ...row, [field]: value };
        if (field === "buyerName" && value === "") {
          updatedRow.allocationPct = 0;
          updatedRow.allocCapMin = 0;
          updatedRow.allocCapPcs = 0;
        }

        // Recalculate caps from pct
        if (field === "allocationPct") {
          const pct = Number(value);
          updatedRow.allocationPct = pct;
          updatedRow.allocCapMin = Math.round(distTotalMin * (pct / 100));
          updatedRow.allocCapPcs = Math.round(distTotalPcs * (pct / 100));
        }

        return updatedRow;
      }
      return row;
    }));
  };

  // Total allocation percentage check
  const totalAllocatedPct = useMemo(() => {
    return distDetails.reduce((sum, row) => sum + (row.allocationPct || 0), 0);
  }, [distDetails]);

  // Edit capacity distribution from list
  const handleEditDistribution = (dist: CapacityDistribution) => {
    setDistFormId(dist.id);
    setDistYear(dist.year);
    setDistMonth(dist.month);
    setDistTotalMin(dist.totalCapacityMin);
    setDistTotalPcs(dist.totalCapacityPcs);
    
    // Load rows or pad to 8 rows
    const rows = [...dist.details];
    while (rows.length < 8) {
      rows.push({ buyerName: "", allocationPct: 0, allocCapMin: 0, allocCapPcs: 0 });
    }
    setDistDetails(rows);
    setIsModalOpen(true);
  };

  // Save distribution setup
  const handleSaveDistribution = () => {
    if (totalAllocatedPct > 100) {
      toast.error(`Total allocation cannot exceed 100%. Current: ${totalAllocatedPct}%`);
      return;
    }

    const validDetails = distDetails.filter(row => row.buyerName !== "");
    const payload: CapacityDistribution = {
      id: distFormId || `dist-${Date.now()}`,
      companyName: "Pakiza Knit Composite Ltd",
      location: "PKCL-Savar",
      year: distYear,
      month: distMonth,
      totalCapacityMin: distTotalMin,
      totalCapacityPcs: distTotalPcs,
      details: validDetails
    };

    if (distFormId) {
      setDistributions(prev => prev.map(d => d.id === distFormId ? payload : d));
      toast.success("Capacity Distribution configuration updated!");
    } else {
      setDistributions(prev => [payload, ...prev]);
      toast.success("Capacity Distribution setup saved!");
    }
    setIsModalOpen(false);
    setDistFormId(null);
  };

  const filteredDistributions = useMemo(() => {
    return distributions.filter(d => {
      const matchYear = d.year === filterYearDist;
      const matchMonth = filterMonthDist === "All" || d.month === filterMonthDist;
      const s = searchQueryDist.toLowerCase();
      const matchSearch = searchQueryDist === "" || 
        d.month.toLowerCase().includes(s) ||
        d.companyName.toLowerCase().includes(s);
      return matchYear && matchMonth && matchSearch;
    });
  }, [distributions, filterYearDist, filterMonthDist, searchQueryDist]);

  return (
    <MerchandisingLayout
      activePath="capacity-distribution"
      breadcrumbs={[{ label: "Capacity" }, { label: "Capacity Distribution" }]}
      title="Capacity Distribution Workspace"
    >
      <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-955 min-h-full font-sans space-y-6 transition-colors duration-200">
        
        {/* Top Header & Search Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-3xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-black tracking-tight text-slate-955 dark:text-white uppercase flex items-center gap-2">
                <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Activity className="size-4.5" /></span>
                Capacity Distribution Ledger
              </h2>
            </div>
            <button
              onClick={() => {
                setDistFormId(null);
                setDistYear(2026);
                setDistMonth("January");
                setDistTotalMin(20442240);
                setDistTotalPcs(3586362);
                setDistDetails(Array.from({ length: 8 }, () => ({ buyerName: "", allocationPct: 0, allocCapMin: 0, allocCapPcs: 0 })));
                setIsModalOpen(true);
              }}
              className="h-9.5 px-4 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 hover:opacity-95 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="size-3.5" /> Add Distribution
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">Year</label>
              <select
                value={filterYearDist}
                onChange={(e) => setFilterYearDist(Number(e.target.value))}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">Month</label>
              <select
                value={filterMonthDist}
                onChange={(e) => setFilterMonthDist(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Months</option>
                {MONTHS_LIST.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => toast.success("Filtered distributions.")}
              className="h-9 px-5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider shadow-sm"
            >
              <Search size={14} /> Search
            </button>
          </div>
        </div>

        {/* Ledger Table Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-3xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center gap-1.5">
              <button onClick={() => toast.info("Excel...")} className="h-8 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300"><FileSpreadsheet className="size-3.5 text-emerald-500" /> EXCEL</button>
              <button onClick={() => toast.info("Print...")} className="h-8 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300"><Printer className="size-3.5 text-blue-500" /> PRINT</button>
              <button onClick={() => toast.info("PDF...")} className="h-8 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300"><Download className="size-3.5 text-rose-500" /> PDF</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400">Search:</span>
              <input type="text" placeholder="Search..." value={searchQueryDist} onChange={(e)=>setSearchQueryDist(e.target.value)} className="text-xs px-3 py-1.5 bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg w-48 focus:outline-none text-slate-800 dark:text-slate-200" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-955 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-extrabold text-left">
                  <th className="px-4 py-3.5 text-center w-12">SL</th>
                  <th className="px-4 py-3.5 text-center w-10"></th>
                  <th className="px-4 py-3">Company Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 text-center">Year</th>
                  <th className="px-4 py-3 text-center">Month</th>
                  <th className="px-4 py-3 text-right">Total Capacity (Min)</th>
                  <th className="px-4 py-3 text-right">Total Capacity (Pcs)</th>
                </tr>
              </thead>
              <tbody>
                {filteredDistributions.map((d, idx) => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-350 font-bold border-b border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3.5 text-center text-slate-400 font-normal">{idx+1}</td>
                    <td className="px-2 py-3 text-center">
                      <button onClick={()=>handleEditDistribution(d)} className="bg-transparent border-0 text-[#F39C12] hover:text-[#D35400] cursor-pointer flex items-center justify-center" title="Edit Distribution"><Edit2 size={13} /></button>
                    </td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-extrabold">{d.companyName}</td>
                    <td className="px-4 py-3">{d.location}</td>
                    <td className="px-4 py-3 text-center font-mono">{d.year}</td>
                    <td className="px-4 py-3 text-center text-slate-900 dark:text-white">{d.month}</td>
                    <td className="px-4 py-3 text-right font-mono">{d.totalCapacityMin.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-mono text-teal-600 dark:text-teal-400">{d.totalCapacityPcs.toFixed(2)}</td>
                  </tr>
                ))}
                {filteredDistributions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-slate-450 dark:text-slate-400 font-bold">No data available in table</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- CAPACITY DISTRIBUTION CREATE & EDIT MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-none">
            <div className="bg-[#F8F9F9] dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-7xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
              
              {/* Modal Header */}
              <div className="absolute top-0 inset-x-0 h-[3.5px] bg-gradient-to-r from-teal-500 to-emerald-600" />
              <div className="bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase text-slate-950 dark:text-white tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-teal-500" />
                  {distFormId ? "Edit Capacity Distribution" : "Setup Capacity Distribution"}
                </h3>
                <button 
                  onClick={() => { setIsModalOpen(false); setDistFormId(null); }} 
                  className="size-7 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Master Info */}
                <div className="xl:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs relative">
                  <h3 className="text-[12px] font-black uppercase text-blue-500 dark:text-blue-400 pb-2 border-b border-slate-100 dark:border-slate-850 flex items-center gap-2">
                    Capacity Distribution Master Info
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Year *</label>
                        <select value={distYear} onChange={(e)=>setDistYear(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"><option value={2026}>2026</option></select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Month *</label>
                        <select value={distMonth} onChange={(e)=>setDistMonth(e.target.value)} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none">{MONTHS_LIST.map(m=>(<option key={m} value={m}>{m}</option>))}</select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Total Capacity (Min) *</label>
                      <input type="number" value={distTotalMin} onChange={(e)=>setDistTotalMin(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Total Capacity (Pcs) *</label>
                      <input type="number" value={distTotalPcs} onChange={(e)=>setDistTotalPcs(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none" />
                    </div>

                    <button onClick={handleSearchCapacityForDistribution} className="w-full h-9 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-[10px] rounded-lg uppercase tracking-wider cursor-pointer shadow-sm">
                      SEARCH CAPACITY
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex gap-2">
                    <button 
                      onClick={handleSaveDistribution} 
                      className="bg-[#27AE60] hover:bg-[#219653] text-white px-6 py-2 text-xs font-bold rounded-lg shadow-sm cursor-pointer uppercase tracking-wider shadow-emerald-500/20"
                    >
                      SAVE
                    </button>
                    <button 
                      onClick={() => { setIsModalOpen(false); setDistFormId(null); }} 
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Right Side: Details Info */}
                <div className="xl:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs flex flex-col h-[650px] relative">
                  <h3 className="text-[12px] font-black uppercase text-slate-950 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-850">
                    Capacity Distribution Details Info
                  </h3>
                  
                  {/* Actions & search toolbar */}
                  <div className="flex justify-between items-center pb-1">
                    <div className="flex items-center gap-1.5">
                      <button onClick={()=>toast.info("Excel...")} className="h-7.5 px-3 rounded border dark:border-slate-800 text-[10px] font-bold flex items-center gap-1 bg-white dark:bg-slate-950 hover:bg-slate-55 text-slate-700 dark:text-slate-300"><FileSpreadsheet className="size-3 text-emerald-500" /> Excel</button>
                      <button onClick={()=>toast.info("Print...")} className="h-7.5 px-3 rounded border dark:border-slate-800 text-[10px] font-bold flex items-center gap-1 bg-white dark:bg-slate-950 hover:bg-slate-55 text-slate-700 dark:text-slate-300"><Printer className="size-3 text-blue-500" /> Print</button>
                      <button onClick={()=>toast.info("PDF...")} className="h-7.5 px-3 rounded border dark:border-slate-800 text-[10px] font-bold flex items-center gap-1 bg-white dark:bg-slate-955 hover:bg-slate-55 text-slate-700 dark:text-slate-300"><Download className="size-3 text-rose-500" /> PDF</button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase text-slate-400 font-bold">Search:</span>
                      <input type="text" placeholder="Search..." className="text-[10px] px-2.5 py-1 border dark:border-slate-850 bg-white dark:bg-slate-955 rounded-lg w-36 focus:outline-none" />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto scrollbar-thin border border-slate-200 dark:border-slate-800 rounded-lg">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FDF2E9] dark:bg-slate-950 border-b border-[#F5CBA7] dark:border-slate-800 text-[#A04000] dark:text-[#E59866] font-extrabold text-left sticky top-0"><th className="px-3 py-2 w-12 text-center bg-[#FDF2E9] dark:bg-slate-950">SL</th><th className="px-3 py-2 min-w-[200px] bg-[#FDF2E9] dark:bg-slate-950">Buyer</th><th className="px-3 py-2 text-center w-36 bg-[#FDF2E9] dark:bg-slate-950">Allocation (%)</th><th className="px-3 py-2 text-right w-44 bg-[#FDF2E9] dark:bg-slate-950">Alloc. Cap (Min)</th><th className="px-3 py-2 text-right w-44 bg-[#FDF2E9] dark:bg-slate-950">Alloc. Cap (Pcs)</th></tr>
                      </thead>
                      <tbody>
                        {distDetails.map((row, index) => (
                          <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-100 dark:border-slate-800">
                            <td className="px-3 py-2.5 text-center text-slate-400 font-normal">{index + 1}</td>
                            <td className="px-3 py-2">
                              <select
                                value={row.buyerName}
                                onChange={(e) => handleDistRowChange(index, "buyerName", e.target.value)}
                                className="w-full text-xs font-bold px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none text-slate-850 dark:text-slate-200"
                              >
                                <option value="">Select...</option>
                                {BUYERS_LIST.map(b => (
                                  <option key={b} value={b}>{b}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                value={row.allocationPct || ""}
                                placeholder="0"
                                disabled={row.buyerName === ""}
                                onChange={(e) => handleDistRowChange(index, "allocationPct", Number(e.target.value))}
                                className="w-full text-center text-xs font-bold px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none disabled:opacity-50 text-slate-850 dark:text-slate-200"
                              />
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono text-slate-500">
                              {row.allocCapMin.toFixed(2)}
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono text-teal-600 dark:text-teal-400">
                              {row.allocCapPcs.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Bar */}
                  <div className="flex justify-between items-center pt-3 border-t dark:border-slate-800 font-black text-xs">
                    <div className="flex items-center gap-1.5">
                      <span>Total Allocation:</span>
                      <span className={`px-2 py-0.5 rounded ${totalAllocatedPct === 100 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>{totalAllocatedPct}% / 100%</span>
                    </div>
                    {totalAllocatedPct > 100 && (
                      <div className="text-rose-500 text-[10px] flex items-center gap-1"><AlertTriangle size={12} /> Allocation sum exceeds 100%! Please adjust.</div>
                    )}
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

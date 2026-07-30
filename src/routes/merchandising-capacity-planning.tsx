import { Route as createFileRouteRoute } from "@tanstack/react-router";
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
  Layers,
  Percent,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-capacity-planning")({
  head: () => ({
    meta: [
      { title: "Capacity Allocation & Distribution — RMG Merchandising" },
      { name: "description", content: "Monthly factory line efficiency calculations, machine capacities, and booking ledger." },
    ],
  }),
  component: MerchandisingCapacityPlanningPage,
});

// --- TYPE DEFINITIONS ---

// Capacity Allocation Details
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
  avgMachinePerLine: number;
  linesCount: number;
  workingHours: number;
  efficiencyPct: number;
  avgSam: number;
  details: CapacityDetailRow[];
}

// Monthly Capacity Record
interface MonthlyCapacityRecord {
  id: string;
  status: "Approved" | "Pending";
  year: number;
  month: string;
  machine: number;
  whour: number;
  wmin: number; 
  smv: number; 
  totalLines: number;
  capacityPct: number; 
  oneDayCapacity: number; 
  wday: number; 
  totalCapacity: number; 
}

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

// --- CONSTANTS ---
const MONTHS_LIST = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const BUYERS_LIST = [
  "FATFACE", "JMC", "MANGO", "Next Sourcing", "RAGNO SPORTS", "H&M", "ZARA", "Gap", "Levis"
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

// --- SEED DATA ---

// Initial Capacity Allocations
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
];

// Initial Monthly Capacities
const INITIAL_MONTHLY_CAPACITY: MonthlyCapacityRecord[] = [
  {
    id: "mc-1",
    status: "Approved",
    year: 2024,
    month: "October",
    machine: 385,
    whour: 8,
    wmin: 480,
    smv: 3.5,
    totalLines: 35,
    capacityPct: 75,
    oneDayCapacity: 39600,
    wday: 26,
    totalCapacity: 1029600
  },
  {
    id: "mc-2",
    status: "Approved",
    year: 2024,
    month: "November",
    machine: 385,
    whour: 8,
    wmin: 480,
    smv: 3.8,
    totalLines: 35,
    capacityPct: 72,
    oneDayCapacity: 34989,
    wday: 25,
    totalCapacity: 874725
  },
  {
    id: "mc-3",
    status: "Pending",
    year: 2024,
    month: "December",
    machine: 410,
    whour: 8,
    wmin: 480,
    smv: 4.0,
    totalLines: 38,
    capacityPct: 70,
    oneDayCapacity: 34440,
    wday: 26,
    totalCapacity: 895440
  },
  {
    id: "mc-4",
    status: "Approved",
    year: 2026,
    month: "January",
    machine: 385,
    whour: 8,
    wmin: 480,
    smv: 3.5,
    totalLines: 35,
    capacityPct: 75,
    oneDayCapacity: 39600,
    wday: 27,
    totalCapacity: 1069200
  },
  {
    id: "mc-5",
    status: "Approved",
    year: 2026,
    month: "February",
    machine: 385,
    whour: 8,
    wmin: 480,
    smv: 3.5,
    totalLines: 35,
    capacityPct: 75,
    oneDayCapacity: 39600,
    wday: 24,
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
    totalCapacityMin: 20442240,
    totalCapacityPcs: 3586362,
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
    totalCapacityMin: 18869760,
    totalCapacityPcs: 3310488,
    details: [
      { buyerName: "JMC", allocationPct: 40, allocCapMin: 7547904, allocCapPcs: 1324195 },
      { buyerName: "MANGO", allocationPct: 30, allocCapMin: 5660928, allocCapPcs: 993146 },
      { buyerName: "FATFACE", allocationPct: 30, allocCapMin: 5660928, allocCapPcs: 993146 },
    ]
  }
];

function MerchandisingCapacityPlanningPage() {
  // Query param Tab switcher
  const searchTab = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("tab") : null;
  const [activeTab, setActiveTab] = useState<"monthly" | "allocation" | "distribution" | "sales">("monthly");
  
  useEffect(() => {
    if (searchTab === "monthly" || searchTab === "allocation" || searchTab === "distribution" || searchTab === "sales") {
      setActiveTab(searchTab);
    }
  }, [searchTab]);

  // --- TAB 1: MONTHLY CAPACITY STATE ---
  const [monthlyCapacities, setMonthlyCapacities] = useState<MonthlyCapacityRecord[]>(INITIAL_MONTHLY_CAPACITY);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterYearMonthly, setFilterYearMonthly] = useState<number>(2026);
  const [filterMonthMonthly, setFilterMonthMonthly] = useState<string>("All");
  const [searchQueryMonthly, setSearchQueryMonthly] = useState<string>("");

  const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);
  const [editMonthlyId, setEditMonthlyId] = useState<string | null>(null);
  const [monthlyStatus, setMonthlyStatus] = useState<"Approved" | "Pending">("Approved");
  const [monthlyYear, setMonthlyYear] = useState(2026);
  const [monthlyMonth, setMonthlyMonth] = useState("January");
  const [monthlyMachine, setMonthlyMachine] = useState(385);
  const [monthlyWHour, setMonthlyWHour] = useState(8);
  const [monthlySMV, setMonthlySMV] = useState(3.5);
  const [monthlyTotalLines, setMonthlyTotalLines] = useState(35);
  const [monthlyCapacityPct, setMonthlyCapacityPct] = useState(75);
  const [monthlyWDay, setMonthlyWDay] = useState(26);

  const computedMonthlyValues = useMemo(() => {
    const wmin = monthlyWHour * 60;
    const oneDay = monthlySMV > 0 
      ? Math.round((monthlyMachine * wmin * (monthlyCapacityPct / 100)) / monthlySMV)
      : 0;
    const total = oneDay * monthlyWDay;
    return { wmin, oneDay, total };
  }, [monthlyMachine, monthlyWHour, monthlyCapacityPct, monthlySMV, monthlyWDay]);

  const handleSaveMonthlyCapacity = () => {
    const payload: MonthlyCapacityRecord = {
      id: editMonthlyId || `mc-${Date.now()}`,
      status: monthlyStatus,
      year: monthlyYear,
      month: monthlyMonth,
      machine: monthlyMachine,
      whour: monthlyWHour,
      wmin: computedMonthlyValues.wmin,
      smv: monthlySMV,
      totalLines: monthlyTotalLines,
      capacityPct: monthlyCapacityPct,
      oneDayCapacity: computedMonthlyValues.oneDay,
      wday: monthlyWDay,
      totalCapacity: computedMonthlyValues.total
    };

    if (editMonthlyId) {
      setMonthlyCapacities(prev => prev.map(m => m.id === editMonthlyId ? payload : m));
      toast.success("Monthly Capacity configuration updated!");
    } else {
      setMonthlyCapacities(prev => [payload, ...prev]);
      toast.success("New Monthly Capacity allocation added!");
    }
    setIsMonthlyModalOpen(false);
    setEditMonthlyId(null);
  };

  const handleEditMonthlyCapacity = (rec: MonthlyCapacityRecord) => {
    setEditMonthlyId(rec.id);
    setMonthlyStatus(rec.status);
    setMonthlyYear(rec.year);
    setMonthlyMonth(rec.month);
    setMonthlyMachine(rec.machine);
    setMonthlyWHour(rec.whour);
    setMonthlySMV(rec.smv);
    setMonthlyTotalLines(rec.totalLines);
    setMonthlyCapacityPct(rec.capacityPct);
    setMonthlyWDay(rec.wday);
    setIsMonthlyModalOpen(true);
  };

  const handleDeleteMonthlyCapacity = (id: string) => {
    if (confirm("Delete this monthly capacity record?")) {
      setMonthlyCapacities(prev => prev.filter(m => m.id !== id));
      toast.success("Record deleted.");
    }
  };

  const filteredMonthlyCapacities = useMemo(() => {
    return monthlyCapacities.filter(rec => {
      const matchStatus = filterStatus === "All" || rec.status === filterStatus;
      const matchYear = rec.year === filterYearMonthly;
      const matchMonth = filterMonthMonthly === "All" || rec.month === filterMonthMonthly;
      const s = searchQueryMonthly.toLowerCase();
      const matchSearch = searchQueryMonthly === "" ||
        rec.month.toLowerCase().includes(s) ||
        rec.status.toLowerCase().includes(s);
      return matchStatus && matchYear && matchMonth && matchSearch;
    });
  }, [monthlyCapacities, filterStatus, filterYearMonthly, filterMonthMonthly, searchQueryMonthly]);


  // --- TAB 2: CAPACITY ALLOCATION STATES ---
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [allocations, setAllocations] = useState<CapacityAllocation[]>(INITIAL_ALLOCATIONS);
  const [filterYear, setFilterYear] = useState<number>(2026);
  const [filterMonth, setFilterMonth] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
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
  const [details, setDetails] = useState<CapacityDetailRow[]>([]);

  useEffect(() => {
    if (viewMode === "form" && !formId) {
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
  }, [month, year, viewMode, formId]);

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
    setDetails(alloc.details && alloc.details.length > 0 ? alloc.details : []);
    setViewMode("form");
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
    setViewMode("list");
    setFormId(null);
  };

  const filteredAllocations = useMemo(() => {
    return allocations.filter(alloc => {
      const matchYear = alloc.year === filterYear;
      const matchMonth = filterMonth === "All" || alloc.month === filterMonth;
      const s = searchQuery.toLowerCase();
      const matchSearch = searchQuery === "" || 
        alloc.companyName.toLowerCase().includes(s) || 
        alloc.remarks.toLowerCase().includes(s);
      return matchYear && matchMonth && matchSearch;
    });
  }, [allocations, filterYear, filterMonth, searchQuery]);


  // --- TAB 3: CAPACITY DISTRIBUTION STATES ---
  const [distViewMode, setDistViewMode] = useState<"list" | "form">("list");
  const [distributions, setDistributions] = useState<CapacityDistribution[]>(INITIAL_DISTRIBUTIONS);
  const [filterYearDist, setFilterYearDist] = useState<number>(2026);
  const [filterMonthDist, setFilterMonthDist] = useState<string>("All");
  const [searchQueryDist, setSearchQueryDist] = useState<string>("");

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
    const allocMatch = allocations.find(a => a.year === distYear && a.month === distMonth);
    if (allocMatch) {
      setDistTotalMin(allocMatch.capacityMin);
      setDistTotalPcs(allocMatch.capacityPcs);
      toast.success(`Loaded capacities from Allocation settings for ${distMonth} ${distYear}!`);
      return;
    }

    // fallback to monthly capacity record
    const monthlyMatch = monthlyCapacities.find(m => m.year === distYear && m.month === distMonth);
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
    setDistViewMode("form");
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
    setDistViewMode("list");
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
      activePath="capacity"
      breadcrumbs={[{ label: "Capacity" }, { label: activeTab === "distribution" ? "Capacity Distribution" : activeTab === "monthly" ? "Monthly Capacity" : "Capacity Allocation" }]}
      title={activeTab === "distribution" ? "Capacity Distribution Workspace" : activeTab === "monthly" ? "Monthly Capacity Planning" : "Capacity Allocation Workspace"}
    >
      <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6 transition-colors duration-200">
        
        {/* --- TAB VIEW 1: MONTHLY CAPACITY --- */}
        {activeTab === "monthly" && (
          <div className="space-y-6">
            
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                  <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Activity className="size-4.5" /></span>
                  Monthly Capacity Allocation
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Month-wise production line capacities, working hours, and target SMV outputs</p>
              </div>

              <button
                onClick={() => {
                  setEditMonthlyId(null);
                  setMonthlyStatus("Approved");
                  setMonthlyYear(2026);
                  setMonthlyMonth("January");
                  setMonthlyMachine(385);
                  setMonthlyWHour(8);
                  setMonthlySMV(3.5);
                  setMonthlyTotalLines(35);
                  setMonthlyCapacityPct(75);
                  setMonthlyWDay(26);
                  setIsMonthlyModalOpen(true);
                }}
                className="h-9.5 px-4 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 hover:opacity-95 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="size-3.5" /> Add Capacity
              </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-3xs relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-teal-500/15 via-teal-500/40 to-teal-500/15" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-450">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="All">All Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-455">Year</label>
                  <select
                    value={filterYearMonthly}
                    onChange={(e) => setFilterYearMonthly(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value={2024}>2024</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-455">Month</label>
                  <select
                    value={filterMonthMonthly}
                    onChange={(e) => setFilterMonthMonthly(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="All">All Months</option>
                    {MONTHS_LIST.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => toast.success("Ledger records filtered successfully.")}
                  className="h-9 px-5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider shadow-sm"
                >
                  <Search size={14} /> Search
                </button>
              </div>
            </div>

            {/* List Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-3xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => toast.info("Export Excel...")} className="h-8 px-3 rounded-lg border border-slate-200 bg-white dark:bg-slate-950 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer"><FileSpreadsheet className="size-3.5 text-emerald-500" /> Excel</button>
                  <button onClick={() => toast.info("Printing...")} className="h-8 px-3 rounded-lg border border-slate-200 bg-white dark:bg-slate-950 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer"><Printer className="size-3.5 text-blue-500" /> Print</button>
                  <button onClick={() => toast.info("Export PDF...")} className="h-8 px-3 rounded-lg border border-slate-200 bg-white dark:bg-slate-950 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer"><Download className="size-3.5 text-rose-500" /> PDF</button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-400">Search:</span>
                  <input type="text" placeholder="Filter..." value={searchQueryMonthly} onChange={(e) => setSearchQueryMonthly(e.target.value)} className="text-xs px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 rounded-lg text-slate-800 focus:outline-none" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 text-slate-500 font-extrabold text-left">
                      <th className="px-3 py-3 w-24 text-center">Status</th>
                      <th className="px-3 py-3 w-12 text-center">SL</th>
                      <th className="px-3 py-3 text-center">Year</th>
                      <th className="px-3 py-3 text-center">Month</th>
                      <th className="px-3 py-3 text-right">Machine</th>
                      <th className="px-3 py-3 text-center">WHour</th>
                      <th className="px-3 py-3 text-right">WMin</th>
                      <th className="px-3 py-3 text-right">SMV</th>
                      <th className="px-3 py-3 text-center">Total (Lines)</th>
                      <th className="px-3 py-3 text-right">Capacity (%)</th>
                      <th className="px-3 py-3 text-right">OneDay Capacity</th>
                      <th className="px-3 py-3 text-center">WDay</th>
                      <th className="px-3 py-3 text-right">Total Capacity</th>
                      <th className="px-3 py-3 text-center w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMonthlyCapacities.map((rec, idx) => (
                      <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-350 font-bold border-b border-slate-100 dark:border-slate-800">
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${rec.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/15" : "bg-amber-500/10 text-amber-600 border border-amber-500/15"}`}>{rec.status}</span>
                        </td>
                        <td className="px-3 py-3 text-center text-slate-400 font-normal">{idx+1}</td>
                        <td className="px-3 py-3 text-center font-mono">{rec.year}</td>
                        <td className="px-3 py-3 text-center text-slate-900 dark:text-white">{rec.month}</td>
                        <td className="px-3 py-3 text-right font-mono">{rec.machine}</td>
                        <td className="px-3 py-3 text-center font-mono">{rec.whour}</td>
                        <td className="px-3 py-3 text-right font-mono text-slate-400">{rec.wmin}</td>
                        <td className="px-3 py-3 text-right font-mono text-slate-500">{rec.smv.toFixed(1)}</td>
                        <td className="px-3 py-3 text-center font-mono">{rec.totalLines}</td>
                        <td className="px-3 py-3 text-right font-mono text-blue-500">{rec.capacityPct}%</td>
                        <td className="px-3 py-3 text-right font-mono text-slate-900 dark:text-white">{rec.oneDayCapacity.toLocaleString()}</td>
                        <td className="px-3 py-3 text-center font-mono text-slate-900 dark:text-white">{rec.wday}</td>
                        <td className="px-3 py-3 text-right font-mono text-teal-600 dark:text-teal-400">{rec.totalCapacity.toLocaleString()} Pcs</td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => handleEditMonthlyCapacity(rec)} className="size-6 rounded bg-amber-500/10 border border-amber-500/15 text-amber-600 flex items-center justify-center hover:bg-amber-55 cursor-pointer"><Edit2 size={11} /></button>
                            <button onClick={() => handleDeleteMonthlyCapacity(rec.id)} className="size-6 rounded bg-rose-500/10 border border-rose-500/15 text-rose-600 flex items-center justify-center hover:bg-rose-55 cursor-pointer"><Trash2 size={11} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Monthly Capacity */}
            {isMonthlyModalOpen && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 inset-x-0 h-[3.5px] bg-gradient-to-r from-teal-500 to-emerald-600" />
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-black uppercase text-slate-950 dark:text-white">{editMonthlyId ? "Edit Monthly Capacity Setup" : "Setup New Monthly Capacity"}</h3>
                  </div>
                  <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Status</label><select value={monthlyStatus} onChange={(e)=>setMonthlyStatus(e.target.value as any)} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg text-slate-800"><option value="Approved">Approved</option><option value="Pending">Pending</option></select></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Year</label><select value={monthlyYear} onChange={(e)=>setMonthlyYear(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg text-slate-800"><option value={2024}>2024</option><option value={2026}>2026</option></select></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Month</label><select value={monthlyMonth} onChange={(e)=>setMonthlyMonth(e.target.value)} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg text-slate-800">{MONTHS_LIST.map(m=>(<option key={m} value={m}>{m}</option>))}</select></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Total Machines</label><input type="number" value={monthlyMachine} onChange={(e)=>setMonthlyMachine(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg text-slate-800" /></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Working Hours</label><input type="number" value={monthlyWHour} onChange={(e)=>setMonthlyWHour(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg text-slate-800" /></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Average SMV</label><input type="number" step="0.1" value={monthlySMV} onChange={(e)=>setMonthlySMV(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg text-slate-800" /></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Total Lines</label><input type="number" value={monthlyTotalLines} onChange={(e)=>setMonthlyTotalLines(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg text-slate-800" /></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Target Capacity (%)</label><input type="number" value={monthlyCapacityPct} onChange={(e)=>setMonthlyCapacityPct(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg text-slate-800" /></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">WDay</label><input type="number" value={monthlyWDay} onChange={(e)=>setMonthlyWDay(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg text-slate-800" /></div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                    <button onClick={()=>setIsMonthlyModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800">Close</button>
                    <button onClick={handleSaveMonthlyCapacity} className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition duration-150 cursor-pointer">Save Configuration</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* --- TAB VIEW 2: CAPACITY ALLOCATION --- */}
        {activeTab === "allocation" && (
          <div className="space-y-6">
            {viewMode === "list" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div>
                    <h2 className="text-lg font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2"><span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Activity className="size-4.5" /></span>Capacity Allocation Ledger</h2>
                  </div>
                  <button onClick={() => { setFormId(null); setYear(2026); setMonth("January"); setComplexityLevel("Basic"); setAvgMachinePerLine(11); setLinesCount(11); setWorkingHours(8); setEfficiencyPct(90); setAvgSam(90); setRemarks(""); setDetails([]); setViewMode("form"); }} className="h-9.5 px-4 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 hover:opacity-95 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"><Plus className="size-3.5" /> Add Capacity Allocation</button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 p-4 space-y-4 shadow-3xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-slate-400">Year</label><select value={filterYear} onChange={(e)=>setFilterYear(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"><option value={2026}>2026</option></select></div>
                    <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-slate-400">Month</label><select value={filterMonth} onChange={(e)=>setFilterMonth(e.target.value)} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"><option value="All">All Months</option>{MONTHS_LIST.map(m=>(<option key={m} value={m}>{m}</option>))}</select></div>
                    <button type="button" onClick={()=>toast.success("Filtered allocations")} className="h-9 px-5 bg-teal-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"><Search size={14} /> Search</button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 shadow-3xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-1.5">
                      <button onClick={()=>toast.info("Exporting Excel...")} className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"><FileSpreadsheet className="size-3.5 text-emerald-500" /> Excel</button>
                      <button onClick={()=>toast.info("Printing...")} className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"><Printer className="size-3.5 text-blue-500" /> Print</button>
                      <button onClick={()=>toast.info("PDF...")} className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"><Download className="size-3.5 text-rose-500" /> PDF</button>
                    </div>
                    <input type="text" placeholder="Search..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg w-48 focus:outline-none" />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-extrabold text-left">
                          <th className="px-4 py-3 text-center w-12">SL</th>
                          <th className="px-4 py-3 text-center w-20">Actions</th>
                          <th className="px-4 py-3">Company Name</th>
                          <th className="px-4 py-3">Location</th>
                          <th className="px-4 py-3 text-center">Year</th>
                          <th className="px-4 py-3 text-center">Month</th>
                          <th className="px-4 py-3 text-center">Complexity Level</th>
                          <th className="px-4 py-3 text-center">Working Day</th>
                          <th className="px-4 py-3 text-right">Capacity (Min)</th>
                          <th className="px-4 py-3 text-right">Capacity (Pcs)</th>
                          <th className="px-4 py-3">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAllocations.map((a, idx) => (
                          <tr key={a.id} className="hover:bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                            <td className="px-4 py-3 text-center text-slate-400">{idx+1}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-1">
                                <button onClick={()=>handleEditAllocation(a)} className="size-6 rounded bg-amber-500/10 text-amber-600 border border-amber-500/15 flex items-center justify-center cursor-pointer"><Edit2 size={12} /></button>
                                <button onClick={()=>{ if(confirm("Delete allocation?")) { setAllocations(prev=>prev.filter(item=>item.id!==a.id)); } }} className="size-6 rounded bg-rose-500/10 text-rose-500 border border-rose-500/15 flex items-center justify-center cursor-pointer"><Trash2 size={12} /></button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-900 font-extrabold">{a.companyName}</td>
                            <td className="px-4 py-3">{a.location}</td>
                            <td className="px-4 py-3 text-center font-mono">{a.year}</td>
                            <td className="px-4 py-3 text-center">{a.month}</td>
                            <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-500 border border-teal-500/15">{a.complexityLevel}</span></td>
                            <td className="px-4 py-3 text-center font-mono">{a.workingDays}</td>
                            <td className="px-4 py-3 text-right font-mono">{a.capacityMin.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-mono text-teal-600">{a.capacityPcs.toLocaleString()}</td>
                            <td className="px-4 py-3 text-slate-400 font-normal truncate max-w-xs">{a.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {viewMode === "form" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={()=>{ setViewMode("list"); setFormId(null); }} className="size-8.5 rounded-lg border border-slate-250 bg-slate-50 text-slate-650 flex items-center justify-center hover:bg-slate-100 cursor-pointer"><ArrowLeft size={15} /></button>
                    <div><h2 className="text-sm font-black text-slate-950 dark:text-white uppercase">Configure Capacity Allocation</h2></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>{ setViewMode("list"); setFormId(null); }} className="h-9 px-4 border rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-55">Cancel</button>
                    <button onClick={handleSaveAllocation} className="h-9 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">Save Allocation</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  <div className="xl:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 p-5 space-y-5 shadow-3xs relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-teal-500" />
                    <h3 className="text-xs font-black uppercase text-slate-950 dark:text-white pb-3 border-b flex items-center gap-2"><Info className="size-4 text-teal-500" /> Capacity Allocation Master Info</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Year</label><select value={year} onChange={(e)=>setYear(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"><option value={2026}>2026</option></select></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Month</label><select value={month} onChange={(e)=>setMonth(e.target.value)} disabled={!!formId} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-60">{MONTHS_LIST.map(m=>(<option key={m} value={m}>{m}</option>))}</select></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Complexity Level</label><select value={complexityLevel} onChange={(e)=>setComplexityLevel(e.target.value as any)} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"><option value="Basic">Basic</option><option value="Standard">Standard</option></select></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Avg M/c / Line</label><input type="number" value={avgMachinePerLine} onChange={(e)=>setAvgMachinePerLine(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" /></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Number of Line</label><input type="number" value={linesCount} onChange={(e)=>setLinesCount(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" /></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Working Hour</label><input type="number" value={workingHours} onChange={(e)=>setWorkingHours(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" /></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Efficiency %</label><input type="number" value={efficiencyPct} onChange={(e)=>setEfficiencyPct(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" /></div>
                      <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Avg SAM</label><input type="number" value={avgSam} onChange={(e)=>setAvgSam(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg" /></div>
                    </div>
                    <button type="button" onClick={handleBulkCapacityCalculation} className="w-full h-10 bg-blue-500 text-white font-extrabold text-xs uppercase rounded-xl cursor-pointer">Capacity Calculation</button>
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl"><span className="text-[9px] font-black uppercase text-slate-400">Net Capacity (Min)</span><div className="text-lg font-black mt-0.5">{netCapacitySummary.totalMin.toLocaleString()}</div></div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl"><span className="text-[9px] font-black uppercase text-slate-400">Net Capacity (Pcs)</span><div className="text-lg font-black mt-0.5">{netCapacitySummary.totalPcs.toLocaleString()}</div></div>
                    </div>
                    <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600 font-semibold">Remarks</label><textarea rows={2} value={remarks} onChange={(e)=>setRemarks(e.target.value)} className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-lg" /></div>
                  </div>

                  <div className="xl:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 p-5 space-y-4 shadow-3xs flex flex-col h-[650px] relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-blue-500" />
                    <h3 className="text-xs font-black uppercase text-slate-950 dark:text-white pb-3 border-b flex items-center gap-2"><Calculator className="size-4 text-blue-500" /> Capacity Allocation Details</h3>
                    <div className="flex-1 overflow-y-auto scrollbar-thin border rounded-lg">
                      <table className="w-full border-collapse text-left text-[11px]">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 border-b font-extrabold sticky top-0 z-10"><th className="px-3 py-2.5 text-center w-12 bg-slate-50">SL</th><th className="px-3 py-2.5 bg-slate-50">Date</th><th className="px-3 py-2.5 text-center w-24 bg-slate-50">Status</th><th className="px-3 py-2.5 text-center w-20 bg-slate-50">No of Line</th><th className="px-3 py-2.5 text-center w-20 bg-slate-50">No of Machin</th><th className="px-3 py-2.5 text-center w-20 bg-slate-50">Working Hour</th><th className="px-3 py-2.5 text-right w-24 bg-slate-50">Capacity (Min)</th><th className="px-3 py-2.5 text-right w-24 bg-slate-50">Capacity (Pcs)</th></tr>
                        </thead>
                        <tbody>
                          {details.map((row, index) => (
                            <tr key={index} className={row.status === "Closed" ? "opacity-60 bg-slate-50" : ""}>
                              <td className="px-3 py-2.5 text-center text-slate-400">{index + 1}</td>
                              <td className="px-3 py-2.5 font-mono">{row.date}</td>
                              <td className="px-3 py-2"><select value={row.status} onChange={(e) => handleRowChange(index, "status", e.target.value as any)} className="w-full text-[10px] font-bold px-2 py-1 bg-white border rounded-md"><option value="Open">Open</option><option value="Closed">Closed</option></select></td>
                              <td className="px-3 py-2"><input type="number" value={row.linesCount} disabled={row.status === "Closed"} onChange={(e) => handleRowChange(index, "linesCount", Number(e.target.value))} className="w-full text-center text-[10px] font-bold px-1.5 py-0.5 bg-white border rounded-md disabled:opacity-50" /></td>
                              <td className="px-3 py-2"><input type="number" value={row.machinesCount} disabled={row.status === "Closed"} onChange={(e) => handleRowChange(index, "machinesCount", Number(e.target.value))} className="w-full text-center text-[10px] font-bold px-1.5 py-0.5 bg-white border rounded-md disabled:opacity-50" /></td>
                              <td className="px-3 py-2"><input type="number" value={row.workingHours} disabled={row.status === "Closed"} onChange={(e) => handleRowChange(index, "workingHours", Number(e.target.value))} className="w-full text-center text-[10px] font-bold px-1.5 py-0.5 bg-white border rounded-md disabled:opacity-50" /></td>
                              <td className="px-3 py-2.5 text-right font-mono">{row.capacityMin.toLocaleString()}</td>
                              <td className="px-3 py-2.5 text-right font-mono text-teal-600">{row.capacityPcs.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB VIEW 3: CAPACITY DISTRIBUTION --- */}
        {activeTab === "distribution" && (
          <div className="space-y-6">
            
            {/* VIEW MODE: LIST VIEW */}
            {distViewMode === "list" && (
              <div className="space-y-6">
                
                {/* Header Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div>
                    <h2 className="text-lg font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                      <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Activity className="size-4.5" /></span>
                      Capacity Distribution Ledger
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Define line-wise capacity sharing ratios and distribute quantities among active Buyer accounts</p>
                  </div>

                  <button
                    onClick={() => {
                      setDistFormId(null);
                      setDistYear(2026);
                      setDistMonth("January");
                      setDistTotalMin(20442240);
                      setDistTotalPcs(3586362);
                      setDistDetails(Array.from({ length: 8 }, () => ({ buyerName: "", allocationPct: 0, allocCapMin: 0, allocCapPcs: 0 })));
                      setDistViewMode("form");
                    }}
                    className="h-9.5 px-4 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 hover:opacity-95 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer animate-none"
                  >
                    <Plus className="size-3.5" /> Add Distribution
                  </button>
                </div>

                {/* Filters Row */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-3xs relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-teal-500/15 via-teal-500/40 to-teal-500/15" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-450">Year</label>
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
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-455">Month</label>
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
                      className="h-9 px-5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                    >
                      <Search size={14} /> Search
                    </button>
                  </div>
                </div>

                {/* Ledger Data Grid */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-3xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => toast.info("Excel...")} className="h-8 px-3 rounded-lg border border-slate-200 bg-white dark:bg-slate-950 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer"><FileSpreadsheet className="size-3.5 text-emerald-500" /> Excel</button>
                      <button onClick={() => toast.info("Print...")} className="h-8 px-3 rounded-lg border border-slate-200 bg-white dark:bg-slate-950 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer"><Printer className="size-3.5 text-blue-500" /> Print</button>
                      <button onClick={() => toast.info("PDF...")} className="h-8 px-3 rounded-lg border border-slate-200 bg-white dark:bg-slate-950 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer"><Download className="size-3.5 text-rose-500" /> PDF</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-slate-400">Search:</span>
                      <input type="text" placeholder="Type month..." value={searchQueryDist} onChange={(e)=>setSearchQueryDist(e.target.value)} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg w-48 focus:outline-none" />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 text-slate-500 font-extrabold text-left">
                          <th className="px-4 py-3.5 text-center w-12">SL</th>
                          <th className="px-4 py-3.5 text-center w-20">Actions</th>
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
                            <td className="px-4 py-3.5">
                              <div className="flex items-center justify-center gap-1">
                                <button onClick={()=>handleEditDistribution(d)} className="size-6 rounded bg-amber-500/10 border border-amber-500/15 text-amber-600 flex items-center justify-center cursor-pointer hover:bg-amber-55"><Edit2 size={11} /></button>
                                <button onClick={()=>{ if(confirm("Delete distribution?")) { setDistributions(prev=>prev.filter(item=>item.id!==d.id)); } }} className="size-6 rounded bg-rose-500/10 border border-rose-500/15 text-rose-600 flex items-center justify-center cursor-pointer hover:bg-rose-55"><Trash2 size={11} /></button>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-slate-900 dark:text-white font-extrabold">{d.companyName}</td>
                            <td className="px-4 py-3.5">{d.location}</td>
                            <td className="px-4 py-3.5 text-center font-mono">{d.year}</td>
                            <td className="px-4 py-3.5 text-center text-slate-900 dark:text-white">{d.month}</td>
                            <td className="px-4 py-3.5 text-right font-mono">{d.totalCapacityMin.toLocaleString()}</td>
                            <td className="px-4 py-3.5 text-right font-mono text-teal-600 dark:text-teal-400">{d.totalCapacityPcs.toLocaleString()} Pcs</td>
                          </tr>
                        ))}
                        {filteredDistributions.length === 0 && (
                          <tr><td colSpan={8} className="px-4 py-6 text-center text-slate-400">No capacity distributions defined.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* VIEW MODE: DISTRIBUTION WORKSPACE */}
            {distViewMode === "form" && (
              <div className="space-y-6 animate-none">
                
                {/* Master Info Panel */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-850 pb-2 flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase text-slate-950 dark:text-white">Capacity Distribution Master Info</h3>
                    <div className="flex gap-2">
                      <button onClick={()=>setDistViewMode("list")} className="px-3.5 py-1.5 rounded-lg border text-xs font-bold text-slate-600 hover:bg-slate-50">Back to List</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500">Year *</label>
                      <select value={distYear} onChange={(e)=>setDistYear(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border rounded-lg"><option value={2026}>2026</option></select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500">Month *</label>
                      <select value={distMonth} onChange={(e)=>setDistMonth(e.target.value)} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border rounded-lg">{MONTHS_LIST.map(m=>(<option key={m} value={m}>{m}</option>))}</select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500">Total Capacity (Min) *</label>
                      <input type="number" value={distTotalMin} onChange={(e)=>setDistTotalMin(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border rounded-lg" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500">Total Capacity (Pcs) *</label>
                      <input type="number" value={distTotalPcs} onChange={(e)=>setDistTotalPcs(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border rounded-lg" />
                    </div>
                    <button onClick={handleSearchCapacityForDistribution} className="h-9 px-5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs rounded-lg uppercase tracking-wider">Search</button>
                  </div>
                </div>

                {/* Details Allocation Form Grid */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-[3px] bg-amber-500" />
                  
                  <div className="border-b border-slate-100 dark:border-slate-850 pb-2 flex justify-between items-center bg-slate-50/20 px-3 -mx-5 -mt-5">
                    <h3 className="text-xs font-black uppercase text-slate-950 dark:text-white py-3">Capacity Distribution Details Info</h3>
                    <div className="flex gap-2">
                      <button onClick={handleSaveDistribution} className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold uppercase shadow-sm">Submit</button>
                    </div>
                  </div>

                  {/* Actions & search toolbar */}
                  <div className="flex justify-between items-center pb-2">
                    <div className="flex items-center gap-1.5">
                      <button onClick={()=>toast.info("Excel...")} className="h-7 px-2.5 rounded border text-[10px] font-bold flex items-center gap-1 bg-white hover:bg-slate-55"><FileSpreadsheet className="size-3 text-emerald-500" /> Excel</button>
                      <button onClick={()=>toast.info("Print...")} className="h-7 px-2.5 rounded border text-[10px] font-bold flex items-center gap-1 bg-white hover:bg-slate-55"><Printer className="size-3 text-blue-500" /> Print</button>
                      <button onClick={()=>toast.info("PDF...")} className="h-7 px-2.5 rounded border text-[10px] font-bold flex items-center gap-1 bg-white hover:bg-slate-55"><Download className="size-3 text-rose-500" /> PDF</button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase text-slate-400 font-bold">Search:</span>
                      <input type="text" placeholder="Search..." className="text-[10px] px-2 py-1 border rounded w-36 focus:outline-none" />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 text-slate-500 font-extrabold text-left sticky top-0"><th className="px-3 py-2 w-12 text-center">SL</th><th className="px-3 py-2 min-w-[200px]">Buyer</th><th className="px-3 py-2 text-center w-36">Allocation (%)</th><th className="px-3 py-2 text-right w-44">Alloc. Cap (Min)</th><th className="px-3 py-2 text-right w-44">Alloc. Cap (Pcs)</th></tr>
                      </thead>
                      <tbody>
                        {distDetails.map((row, index) => (
                          <tr key={index} className="hover:bg-slate-50 text-slate-700 font-bold border-b border-slate-100 dark:border-slate-850">
                            <td className="px-3 py-2.5 text-center text-slate-400">{index + 1}</td>
                            <td className="px-3 py-2">
                              <select
                                value={row.buyerName}
                                onChange={(e) => handleDistRowChange(index, "buyerName", e.target.value)}
                                className="w-full text-xs font-bold px-2 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none"
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
                                className="w-full text-center text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded-md focus:outline-none disabled:opacity-50"
                              />
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono text-slate-500">
                              {row.allocCapMin.toLocaleString()}
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono text-teal-600">
                              {row.allocCapPcs.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Bar */}
                  <div className="flex justify-between items-center pt-3 border-t font-black text-xs">
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
            )}

          </div>
        )}

        {/* --- TAB VIEW 4: SALES TARGET ENTRY (PLACEHOLDER) --- */}
        {activeTab === "sales" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4 shadow-3xs">
            <div className="size-14 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center mx-auto">
              <Percent size={24} />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Sales Target Entry</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure merchant-wise and buyer-wise sales target values and margins. (Backend integration required)</p>
            </div>

            {/* High-fidelity mock entries */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden max-w-xl mx-auto text-left text-xs font-semibold">
              <div className="bg-slate-50 dark:bg-slate-950 p-3 font-extrabold border-b border-slate-100 dark:border-slate-850 flex justify-between">
                <span>Monthly Target Ledger</span>
                <span className="text-[10px] text-blue-500">2026 Target: $12.5M</span>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { merchant: "Tariqul Islam (Sr. Merchant)", buyer: "Zara", target: "$4,500,000", status: "Achieved (102%)" },
                  { merchant: "Asif Zaman (Merchant)", buyer: "H&M", target: "$5,200,000", status: "On Track (88%)" },
                  { merchant: "Rubel Ahmed (Assoc. Merchant)", buyer: "Target", target: "$2,800,000", status: "On Track (91%)" },
                ].map((d, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 text-slate-700 dark:text-slate-350">
                    <div>
                      <div className="font-extrabold text-slate-950 dark:text-white">{d.merchant}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Primary Account: {d.buyer}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-blue-500 font-extrabold">{d.target}</div>
                      <div className={`text-[10px] font-black mt-0.5 uppercase ${d.status.includes("Achieved") ? "text-emerald-500" : "text-amber-500"}`}>{d.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </MerchandisingLayout>
  );
}

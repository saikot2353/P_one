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
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-monthly-capacity")({
  head: () => ({
    meta: [
      { title: "Monthly Capacity Planning — RMG Merchandising" },
      { name: "description", content: "Monthly factory line efficiency calculations, machine capacities, and booking ledger." },
    ],
  }),
  component: MonthlyCapacityPage,
});

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

const MONTHS_LIST = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
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

function MonthlyCapacityPage() {
  const [monthlyCapacities, setMonthlyCapacities] = useState<MonthlyCapacityRecord[]>(INITIAL_MONTHLY_CAPACITY);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterYearMonthly, setFilterYearMonthly] = useState<number>(2026);
  const [filterMonthMonthly, setFilterMonthMonthly] = useState<string>("All");
  const [searchQueryMonthly, setSearchQueryMonthly] = useState<string>("All");

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
      const matchSearch = searchQueryMonthly === "All" || searchQueryMonthly === "" ||
        rec.month.toLowerCase().includes(s) ||
        rec.status.toLowerCase().includes(s);
      return matchStatus && matchYear && matchMonth && matchSearch;
    });
  }, [monthlyCapacities, filterStatus, filterYearMonthly, filterMonthMonthly, searchQueryMonthly]);

  return (
    <MerchandisingLayout
      activePath="monthly-capacity"
      breadcrumbs={[{ label: "Capacity" }, { label: "Monthly Capacity" }]}
      title="Monthly Capacity Planning"
    >
      <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6 transition-colors duration-200">
        
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
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-455">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
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
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
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
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
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
              <input type="text" placeholder="Filter..." value={searchQueryMonthly === "All" ? "" : searchQueryMonthly} onChange={(e) => setSearchQueryMonthly(e.target.value)} className="text-xs px-3 py-1.5 bg-white dark:bg-slate-955 border border-slate-200 rounded-lg text-slate-800 focus:outline-none animate-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-955 border-b border-slate-200 text-slate-500 font-extrabold text-left">
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
                    <td className="px-3 py-3 text-right font-mono text-slate-450">{rec.wmin}</td>
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
                  <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Status</label><select value={monthlyStatus} onChange={(e)=>setMonthlyStatus(e.target.value as any)} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 rounded-lg text-slate-800"><option value="Approved">Approved</option><option value="Pending">Pending</option></select></div>
                  <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Year</label><select value={monthlyYear} onChange={(e)=>setMonthlyYear(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 rounded-lg text-slate-800"><option value={2024}>2024</option><option value={2026}>2026</option></select></div>
                  <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Month</label><select value={monthlyMonth} onChange={(e)=>setMonthlyMonth(e.target.value)} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 rounded-lg text-slate-800">{MONTHS_LIST.map(m=>(<option key={m} value={m}>{m}</option>))}</select></div>
                  <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Total Machines</label><input type="number" value={monthlyMachine} onChange={(e)=>setMonthlyMachine(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 rounded-lg text-slate-800" /></div>
                  <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Working Hours</label><input type="number" value={monthlyWHour} onChange={(e)=>setMonthlyWHour(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 rounded-lg text-slate-800" /></div>
                  <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Average SMV</label><input type="number" step="0.1" value={monthlySMV} onChange={(e)=>setMonthlySMV(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 rounded-lg text-slate-800" /></div>
                  <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Total Lines</label><input type="number" value={monthlyTotalLines} onChange={(e)=>setMonthlyTotalLines(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 rounded-lg text-slate-800" /></div>
                  <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">Target Capacity (%)</label><input type="number" value={monthlyCapacityPct} onChange={(e)=>setMonthlyCapacityPct(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 rounded-lg text-slate-800" /></div>
                  <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-600">WDay</label><input type="number" value={monthlyWDay} onChange={(e)=>setMonthlyWDay(Number(e.target.value))} className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-955 border border-slate-200 rounded-lg text-slate-800" /></div>
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
    </MerchandisingLayout>
  );
}

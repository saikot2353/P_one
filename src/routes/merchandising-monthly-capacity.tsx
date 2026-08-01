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
  Save,
  X,
  ChevronDown,
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
  capacitySource: string;
  year: number;
  month: string;
  smv: number;
  week: string;
  day: number;
  whour: number;
  efficiency: number;
  operator: number;
  absenteeism: number;
  totalAbsent: number;
  totalOperator: number;
  availableMinute: number;
  capacityInMinute: number;
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
    capacitySource: "PKCL",
    year: 2026,
    month: "August",
    smv: 7.5,
    week: "1st Week",
    day: 26,
    whour: 8,
    efficiency: 75,
    operator: 100,
    absenteeism: 5,
    totalAbsent: 5,
    totalOperator: 95,
    availableMinute: 1185600, // 95 * 8 * 60 * 26
    capacityInMinute: 889200
  },
  {
    id: "mc-2",
    status: "Approved",
    capacitySource: "PKCL",
    year: 2026,
    month: "September",
    smv: 7.0,
    week: "2nd Week",
    day: 25,
    whour: 8,
    efficiency: 70,
    operator: 120,
    absenteeism: 6,
    totalAbsent: 7,
    totalOperator: 113,
    availableMinute: 1356000,
    capacityInMinute: 949200
  }
];

function MonthlyCapacityPage() {
  const [monthlyCapacities, setMonthlyCapacities] = useState<MonthlyCapacityRecord[]>(INITIAL_MONTHLY_CAPACITY);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterYearMonthly, setFilterYearMonthly] = useState<number>(2026);
  const [filterMonthMonthly, setFilterMonthMonthly] = useState<string>("All");
  const [searchQueryMonthly, setSearchQueryMonthly] = useState<string>("");

  const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);
  const [editMonthlyId, setEditMonthlyId] = useState<string | null>(null);
  const [monthlyStatus, setMonthlyStatus] = useState<"Approved" | "Pending">("Approved");

  // Monthly capacity form state parameters
  const [monthlyCapacitySource, setMonthlyCapacitySource] = useState("PKCL");
  const [monthlyYear, setMonthlyYear] = useState(2026);
  const [monthlyMonth, setMonthlyMonth] = useState("August");
  const [monthlySMV, setMonthlySMV] = useState(7.5);
  const [monthlyWeek, setMonthlyWeek] = useState("1st Week");
  const [monthlyDay, setMonthlyDay] = useState(26);
  const [monthlyWHour, setMonthlyWHour] = useState(8);
  const [monthlyEfficiency, setMonthlyEfficiency] = useState(75);
  const [monthlyOperator, setMonthlyOperator] = useState(100);
  const [monthlyAbsenteeism, setMonthlyAbsenteeism] = useState(5);

  // Dynamic calculations based on state inputs
  const calculatedValues = useMemo(() => {
    const totalAbsent = Math.round((monthlyOperator * monthlyAbsenteeism) / 100);
    const totalOperator = monthlyOperator - totalAbsent;
    const availableMinute = totalOperator * monthlyWHour * 60 * monthlyDay;
    const capacityInMinute = Math.round((availableMinute * monthlyEfficiency) / 100);
    return { totalAbsent, totalOperator, availableMinute, capacityInMinute };
  }, [monthlyOperator, monthlyAbsenteeism, monthlyWHour, monthlyDay, monthlyEfficiency]);

  const handleSaveMonthlyCapacity = () => {
    const payload: MonthlyCapacityRecord = {
      id: editMonthlyId || `mc-${Date.now()}`,
      status: monthlyStatus,
      capacitySource: monthlyCapacitySource,
      year: monthlyYear,
      month: monthlyMonth,
      smv: monthlySMV,
      week: monthlyWeek,
      day: monthlyDay,
      whour: monthlyWHour,
      efficiency: monthlyEfficiency,
      operator: monthlyOperator,
      absenteeism: monthlyAbsenteeism,
      totalAbsent: calculatedValues.totalAbsent,
      totalOperator: calculatedValues.totalOperator,
      availableMinute: calculatedValues.availableMinute,
      capacityInMinute: calculatedValues.capacityInMinute
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
    setMonthlyCapacitySource(rec.capacitySource);
    setMonthlyYear(rec.year);
    setMonthlyMonth(rec.month);
    setMonthlySMV(rec.smv);
    setMonthlyWeek(rec.week);
    setMonthlyDay(rec.day);
    setMonthlyWHour(rec.whour);
    setMonthlyEfficiency(rec.efficiency);
    setMonthlyOperator(rec.operator);
    setMonthlyAbsenteeism(rec.absenteeism);
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
        rec.status.toLowerCase().includes(s) ||
        rec.capacitySource.toLowerCase().includes(s) ||
        rec.week.toLowerCase().includes(s);
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
              setMonthlyCapacitySource("PKCL");
              setMonthlyYear(2026);
              setMonthlyMonth("August");
              setMonthlySMV(7.5);
              setMonthlyWeek("1st Week");
              setMonthlyDay(26);
              setMonthlyWHour(8);
              setMonthlyEfficiency(75);
              setMonthlyOperator(100);
              setMonthlyAbsenteeism(5);
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
              <button onClick={() => toast.info("Export PDF...")} className="h-8 px-3 rounded-lg border border-slate-200 bg-white dark:bg-slate-955 hover:bg-slate-55 text-xs font-bold flex items-center gap-1.5 cursor-pointer"><Download className="size-3.5 text-rose-500" /> PDF</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400">Search:</span>
              <input type="text" placeholder="Filter..." value={searchQueryMonthly} onChange={(e) => setSearchQueryMonthly(e.target.value)} className="text-xs px-3 py-1.5 bg-white dark:bg-slate-955 border border-slate-200 rounded-lg text-slate-800 focus:outline-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-[#bde0fe] dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-bold border-b border-blue-200 dark:border-slate-700">
                  <th className="px-3 py-2.5 text-center w-20">Status</th>
                  <th className="px-3 py-2.5 text-center w-12">SL</th>
                  <th className="px-3 py-2.5">Source</th>
                  <th className="px-3 py-2.5 text-center">Year</th>
                  <th className="px-3 py-2.5 text-center">Month</th>
                  <th className="px-3 py-2.5 text-center">Week</th>
                  <th className="px-3 py-2.5 text-center">Day</th>
                  <th className="px-3 py-2.5 text-center">W/HR</th>
                  <th className="px-3 py-2.5 text-center">Efficiency</th>
                  <th className="px-3 py-2.5 text-center">Operator</th>
                  <th className="px-3 py-2.5 text-center">Absenteeism</th>
                  <th className="px-3 py-2.5 text-center">Total Absent</th>
                  <th className="px-3 py-2.5 text-center">Total Operator</th>
                  <th className="px-3 py-2.5 text-right">Available Min</th>
                  <th className="px-3 py-2.5 text-right">Capacity Min</th>
                  <th className="px-3 py-2.5 text-right">AVG SMV</th>
                  <th className="px-3 py-2.5 text-center w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMonthlyCapacities.map((rec, idx) => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-350 font-bold border-b border-slate-100 dark:border-slate-800 text-center">
                    <td className="px-3 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${rec.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/15" : "bg-amber-500/10 text-amber-600 border border-amber-500/15"}`}>{rec.status}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center text-slate-400 font-normal">{idx+1}</td>
                    <td className="px-3 py-2.5 text-left text-slate-900 dark:text-white">{rec.capacitySource}</td>
                    <td className="px-3 py-2.5 font-mono">{rec.year}</td>
                    <td className="px-3 py-2.5 text-slate-900 dark:text-white">{rec.month}</td>
                    <td className="px-3 py-2.5 text-slate-900 dark:text-white">{rec.week}</td>
                    <td className="px-3 py-2.5 font-mono">{rec.day}</td>
                    <td className="px-3 py-2.5 font-mono">{rec.whour}</td>
                    <td className="px-3 py-2.5 font-mono text-blue-500">{rec.efficiency}%</td>
                    <td className="px-3 py-2.5 font-mono">{rec.operator}</td>
                    <td className="px-3 py-2.5 font-mono text-amber-600">{rec.absenteeism}%</td>
                    <td className="px-3 py-2.5 font-mono text-rose-500">{rec.totalAbsent}</td>
                    <td className="px-3 py-2.5 font-mono text-emerald-600">{rec.totalOperator}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-600 dark:text-slate-400">{rec.availableMinute.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-teal-600 dark:text-teal-400">{rec.capacityInMinute.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-indigo-500">{rec.smv.toFixed(1)}</td>
                    <td className="px-3 py-2.5 text-center">
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
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-7xl shadow-2xl overflow-hidden rounded-2xl animate-in zoom-in duration-200 border-l-4 border-l-blue-500 flex flex-col p-6">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4">
                <span className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider">
                  {editMonthlyId ? "Edit Monthly Capacity Setup" : "Setup New Monthly Capacity"}
                </span>
                <button onClick={() => setIsMonthlyModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6">
                
                {/* Row 1: Capacity Source, Year, Month, AVG SMV */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Capacity Source</label>
                    <div className="relative">
                      <select
                        value={monthlyCapacitySource}
                        onChange={(e) => setMonthlyCapacitySource(e.target.value)}
                        className="w-full text-xs font-bold py-2 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors appearance-none pr-8 cursor-pointer"
                      >
                        <option value="PKCL">PKCL</option>
                        <option value="Factory A">Factory A</option>
                        <option value="Factory B">Factory B</option>
                      </select>
                      <ChevronDown className="absolute right-1.5 top-2 size-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Year</label>
                    <div className="relative">
                      <select
                        value={monthlyYear}
                        onChange={(e) => setMonthlyYear(Number(e.target.value))}
                        className="w-full text-xs font-bold py-2 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors appearance-none pr-8 cursor-pointer"
                      >
                        <option value={2026}>2026</option>
                        <option value={2027}>2027</option>
                      </select>
                      <ChevronDown className="absolute right-1.5 top-2 size-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Month</label>
                    <div className="relative">
                      <select
                        value={monthlyMonth}
                        onChange={(e) => setMonthlyMonth(e.target.value)}
                        className="w-full text-xs font-bold py-2 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors appearance-none pr-8 cursor-pointer"
                      >
                        {MONTHS_LIST.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-1.5 top-2 size-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">AVG SMV <span className="text-rose-500">*</span></label>
                    <input
                      type="number"
                      step="0.1"
                      value={monthlySMV}
                      onChange={(e) => setMonthlySMV(Number(e.target.value))}
                      className="w-full text-xs py-2 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors font-bold"
                    />
                  </div>
                </div>

                {/* Row 2: Week, Day, W/HR, Efficiency(%), Operator, Absenteeism(%) */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Week</label>
                    <div className="relative">
                      <select
                        value={monthlyWeek}
                        onChange={(e) => setMonthlyWeek(e.target.value)}
                        className="w-full text-xs font-bold py-2 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors appearance-none pr-8 cursor-pointer"
                      >
                        <option value="1st Week">1st Week</option>
                        <option value="2nd Week">2nd Week</option>
                        <option value="3rd Week">3rd Week</option>
                        <option value="4th Week">4th Week</option>
                        <option value="5th Week">5th Week</option>
                      </select>
                      <ChevronDown className="absolute right-1.5 top-2 size-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Day</label>
                    <input
                      type="number"
                      value={monthlyDay}
                      onChange={(e) => setMonthlyDay(Number(e.target.value))}
                      className="w-full text-xs py-2 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">W/HR</label>
                    <input
                      type="number"
                      value={monthlyWHour}
                      onChange={(e) => setMonthlyWHour(Number(e.target.value))}
                      className="w-full text-xs py-2 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Efficiency(%)</label>
                    <input
                      type="number"
                      value={monthlyEfficiency}
                      onChange={(e) => setMonthlyEfficiency(Number(e.target.value))}
                      className="w-full text-xs py-2 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Operator</label>
                    <input
                      type="number"
                      value={monthlyOperator}
                      onChange={(e) => setMonthlyOperator(Number(e.target.value))}
                      className="w-full text-xs py-2 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Absenteeism(%)</label>
                    <input
                      type="number"
                      value={monthlyAbsenteeism}
                      onChange={(e) => setMonthlyAbsenteeism(Number(e.target.value))}
                      className="w-full text-xs py-2 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors font-bold"
                    />
                  </div>
                </div>

                {/* Row 3: Total Absent, Total Operator*, Available Minute*, Capacity In Minute*, SAVE button */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Total Absent</label>
                    <input
                      type="number"
                      readOnly
                      value={calculatedValues.totalAbsent}
                      className="w-full text-xs px-3 py-2 bg-[#f8f9fa] dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700 text-slate-750 font-bold focus:outline-none rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Total Operator <span className="text-rose-500">*</span></label>
                    <input
                      type="number"
                      readOnly
                      value={calculatedValues.totalOperator}
                      className="w-full text-xs px-3 py-2 bg-[#f8f9fa] dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700 text-slate-750 font-bold focus:outline-none rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Available Minute <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      readOnly
                      value={calculatedValues.availableMinute.toLocaleString()}
                      className="w-full text-xs px-3 py-2 bg-[#f8f9fa] dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700 text-slate-750 font-bold focus:outline-none rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Capacity In Minute <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      readOnly
                      value={calculatedValues.capacityInMinute.toLocaleString()}
                      className="w-full text-xs px-3 py-2 bg-[#f8f9fa] dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700 text-slate-750 font-bold focus:outline-none rounded-xs"
                    />
                  </div>
                  <div className="flex justify-end pb-0.5">
                    <button
                      onClick={handleSaveMonthlyCapacity}
                      className="h-9 px-6 bg-[#70b23b] hover:bg-[#609a32] text-white font-extrabold text-xs uppercase flex items-center justify-center gap-2 rounded-lg shadow-md transition-all cursor-pointer tracking-wider"
                    >
                      <Save size={14} /> SAVE
                    </button>
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

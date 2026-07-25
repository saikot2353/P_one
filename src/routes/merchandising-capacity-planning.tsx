import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/merchandising-capacity-planning")({
  head: () => ({
    meta: [
      { title: "Capacity Planning & Booking — RMG Merchandising" },
      { name: "description", content: "Factory line efficiency calculator, monthly SMV capacity planning, and booking approvals." },
    ],
  }),
  component: MerchandisingCapacityPlanningPage,
});

interface MonthlyCapacityRow {
  month: string;
  year: number;
  availableDays: number;
  capacityPcs: number;
  bookedPcs: number;
  status: "Under Booked" | "Optimal" | "Over Booked";
  approvalStatus: "Approved" | "Pending Review";
}

const initialMonthlyData: MonthlyCapacityRow[] = [
  { month: "July", year: 2026, availableDays: 26, capacityPcs: 180000, bookedPcs: 172000, status: "Optimal", approvalStatus: "Approved" },
  { month: "August", year: 2026, availableDays: 25, capacityPcs: 175000, bookedPcs: 194000, status: "Over Booked", approvalStatus: "Pending Review" },
  { month: "September", year: 2026, availableDays: 26, capacityPcs: 180000, bookedPcs: 110000, status: "Under Booked", approvalStatus: "Approved" },
  { month: "October", year: 2026, availableDays: 27, capacityPcs: 188000, bookedPcs: 95000, status: "Under Booked", approvalStatus: "Approved" },
];

function MerchandisingCapacityPlanningPage() {
  // Calculator Parameters State
  const [linesCount, setLinesCount] = useState(12);
  const [machinesPerLine, setMachinesPerLine] = useState(35);
  const [workingDays, setWorkingDays] = useState(26);
  const [hoursPerDay, setHoursPerDay] = useState(10);
  const [targetEfficiency, setTargetEfficiency] = useState(70); // %
  const [avgSmv, setAvgSmv] = useState(12.5); // SMV minutes

  // Ledger state
  const [monthlyData, setMonthlyData] = useState<MonthlyCapacityRow[]>(initialMonthlyData);

  // Auto-calculated capacity outputs
  const calcResults = useMemo(() => {
    // Total Man/Machine Hours = Lines * Machines * Days * Hours
    const totalManHours = linesCount * machinesPerLine * workingDays * hoursPerDay;
    // Total Available SMV Minutes = Total Hours * 60 * (Efficiency / 100)
    const availableMinutes = totalManHours * 60 * (targetEfficiency / 100);
    // Total Garment Capacity (Pcs) = Available Minutes / Avg SMV
    const capacityPcs = avgSmv > 0 ? Math.round(availableMinutes / avgSmv) : 0;

    return {
      totalManHours,
      availableMinutes: Math.round(availableMinutes),
      capacityPcs,
    };
  }, [linesCount, machinesPerLine, workingDays, hoursPerDay, targetEfficiency, avgSmv]);

  const handleApproveMonth = (monthStr: string) => {
    setMonthlyData(prev => prev.map(m => m.month === monthStr ? { ...m, approvalStatus: "Approved" } : m));
    toast.success(`Capacity booking for ${monthStr} approved by Director`);
  };

  return (
    <MerchandisingLayout
      activePath="capacity"
      breadcrumbs={[{ label: "Capacity Planning" }, { label: "Factory Line SMV Ledger" }]}
      title="Factory Capacity & Booking Controller"
    >
      <div className="p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full font-sans space-y-6">
        
        {/* Banner */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-teal-500/10 text-teal-500 rounded-lg"><Activity className="size-5" /></span>
              SMV Capacity Engine
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time factory line efficiency modeling, SMV minute allocation, and month-by-month order booking limits</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <ShieldCheck size={14} /> Factory Capacity Live
            </span>
          </div>
        </div>

        {/* SECTION 1: CAPACITY CALCULATOR */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Calculator className="size-4 text-teal-500" /> Interactive Line Efficiency & SMV Calculator
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold">PSKC Composite Factory Unit</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Lines Count</label>
              <input
                type="number"
                value={linesCount}
                onChange={(e) => setLinesCount(Number(e.target.value))}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Machines / Line</label>
              <input
                type="number"
                value={machinesPerLine}
                onChange={(e) => setMachinesPerLine(Number(e.target.value))}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Working Days / Mo</label>
              <input
                type="number"
                value={workingDays}
                onChange={(e) => setWorkingDays(Number(e.target.value))}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Hours / Day</label>
              <input
                type="number"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Line Efficiency %</label>
              <input
                type="number"
                value={targetEfficiency}
                onChange={(e) => setTargetEfficiency(Number(e.target.value))}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Avg Garment SMV</label>
              <input
                type="number"
                step="0.1"
                value={avgSmv}
                onChange={(e) => setAvgSmv(Number(e.target.value))}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/30 focus:outline-none"
              />
            </div>
          </div>

          {/* Outputs Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Man/Machine Hours</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{calcResults.totalManHours.toLocaleString()} Hrs</div>
            </div>
            <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <span className="text-[10px] font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider">Available SMV Minutes</span>
              <div className="text-xl font-black text-teal-600 dark:text-teal-400 mt-1">{calcResults.availableMinutes.toLocaleString()} Mins</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Monthly Production Capacity</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{calcResults.capacityPcs.toLocaleString()} Garments Pcs</div>
            </div>
          </div>
        </div>

        {/* SECTION 2: MONTHLY BOOKING VS CAPACITY LEDGER */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Month-by-Month Order Booking Balance
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Comparing confirmed booked orders against factory limits</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {monthlyData.map((m) => {
              const pct = Math.min(120, Math.round((m.bookedPcs / m.capacityPcs) * 100));
              const isOver = m.bookedPcs > m.capacityPcs;
              return (
                <div key={m.month} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-900 dark:text-white">{m.month} {m.year}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        isOver
                          ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                          : pct >= 90
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                      }`}>
                        {m.status} ({pct}%)
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Booked: <span className="font-mono text-slate-900 dark:text-white font-extrabold">{m.bookedPcs.toLocaleString()}</span> / <span className="font-mono text-slate-500">{m.capacityPcs.toLocaleString()} Pcs</span>
                      </span>

                      {m.approvalStatus === "Approved" ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-extrabold uppercase flex items-center gap-1">
                          <CheckCircle2 size={12} /> Approved
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveMonth(m.month)}
                          className="px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition cursor-pointer"
                        >
                          Approve Capacity
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isOver ? "bg-rose-500" : pct >= 90 ? "bg-emerald-500" : "bg-teal-500"
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  {isOver && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-500 mt-1">
                      <AlertTriangle size={13} />
                      <span>Warning: Monthly booking exceeds factory capacity by {(m.bookedPcs - m.capacityPcs).toLocaleString()} pcs. Overtime or sub-contracting required!</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </MerchandisingLayout>
  );
}

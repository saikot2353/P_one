import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  Lock,
  Unlock,
  ShieldCheck,
  Building2,
  Calendar,
  Users,
  Coins,
  CheckCircle2,
  AlertTriangle,
  X,
  Printer,
  QrCode,
  FileText,
  Search,
  KeyRound,
  FileCheck,
  ShieldAlert,
  ArrowUpRight,
  Send,
} from "lucide-react";

export const Route = createFileRoute("/payroll-period-lock")({
  head: () => ({
    meta: [
      { title: "Payroll Period Lock & Approval — Payroll Module | CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Manage, lock, freeze, and unlock processed payroll periods with audit trail logging and managerial approval.",
      },
    ],
  }),
  component: PayrollPeriodLockPage,
});

export interface PayrollPeriodRecord {
  id: string;
  year: string;
  month: string;
  processType: "Monthly Salary" | "Advance Salary" | "Yearly Bonus";
  company: string;
  headcount: number;
  grossAmount: number;
  netPayout: number;
  isLocked: boolean;
  lockedAt?: string;
  lockedBy?: string;
  lockNotes?: string;
  unlockReason?: string;
}

const mockPeriodRecords: PayrollPeriodRecord[] = [
  {
    id: "LOCK-2026-JUL-01",
    year: "2026",
    month: "Jul",
    processType: "Monthly Salary",
    company: "Pakiza Software Limited",
    headcount: 1250,
    grossAmount: 38500000,
    netPayout: 36200000,
    isLocked: true,
    lockedAt: "2026-08-05 04:30 PM",
    lockedBy: "Jahangir Alam (Head of HR)",
    lockNotes: "Monthly salary distribution verified by audit board and locked for dbbl bank disbursemnt.",
  },
  {
    id: "LOCK-2026-JUN-01",
    year: "2026",
    month: "Jun",
    processType: "Monthly Salary",
    company: "Pakiza Software Limited",
    headcount: 1240,
    grossAmount: 38100000,
    netPayout: 35900000,
    isLocked: true,
    lockedAt: "2026-07-04 11:15 AM",
    lockedBy: "Tahmid Afsar (Asst. Manager)",
    lockNotes: "Full payroll execution finalized. Locked against revisions.",
  },
  {
    id: "LOCK-2026-AUG-01",
    year: "2026",
    month: "Aug",
    processType: "Monthly Salary",
    company: "Pakiza Software Limited",
    headcount: 1262,
    grossAmount: 39100000,
    netPayout: 36800000,
    isLocked: false,
    lockNotes: "Draft calculations generated. Pending final HR locking.",
  },
  {
    id: "LOCK-2026-AUG-ADV",
    year: "2026",
    month: "Aug",
    processType: "Advance Salary",
    company: "Pakiza Software Limited",
    headcount: 310,
    grossAmount: 4500000,
    netPayout: 4500000,
    isLocked: true,
    lockedAt: "2026-08-20 02:10 PM",
    lockedBy: "Sayed Ahmed (Payroll Admin)",
    lockNotes: "Mid-month advance salary locked and paid out.",
  },
  {
    id: "LOCK-2026-EID-BONUS",
    year: "2026",
    month: "Jun",
    processType: "Yearly Bonus",
    company: "Pakiza Software Limited",
    headcount: 1240,
    grossAmount: 19200000,
    netPayout: 19200000,
    isLocked: true,
    lockedAt: "2026-06-12 10:00 AM",
    lockedBy: "Jahangir Alam (Head of HR)",
    lockNotes: "Festival bonus distribution finalized and locked.",
  },
];

function PayrollPeriodLockPage() {
  const [periods, setPeriods] = useState<PayrollPeriodRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("payroll_period_lock_records_v1");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return mockPeriodRecords;
  });

  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedProcessType, setSelectedProcessType] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Lock Modal State
  const [lockTarget, setLockTarget] = useState<PayrollPeriodRecord | null>(null);
  const [lockNotesInput, setLockNotesInput] = useState("Payroll generated and finalized for payment distribution.");

  // Unlock Modal State
  const [unlockTarget, setUnlockTarget] = useState<PayrollPeriodRecord | null>(null);
  const [unlockReasonInput, setUnlockReasonInput] = useState("");

  // Audit Report View Modal State
  const [auditTarget, setAuditTarget] = useState<PayrollPeriodRecord | null>(null);

  const savePeriodsState = (updated: PayrollPeriodRecord[]) => {
    setPeriods(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("payroll_period_lock_records_v1", JSON.stringify(updated));
    }
  };

  const filteredPeriods = useMemo(() => {
    return periods.filter((p) => {
      const matchYear = selectedYear === "ALL" || p.year === selectedYear;
      const matchType = selectedProcessType === "ALL" || p.processType === selectedProcessType;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.month.toLowerCase().includes(q) ||
        p.processType.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);

      return matchYear && matchType && matchSearch;
    });
  }, [periods, selectedYear, selectedProcessType, searchTerm]);

  const stats = useMemo(() => {
    let total = periods.length;
    let locked = periods.filter((p) => p.isLocked).length;
    let open = total - locked;
    let frozenNetPayout = periods.filter((p) => p.isLocked).reduce((sum, p) => sum + p.netPayout, 0);
    return { total, locked, open, frozenNetPayout };
  }, [periods]);

  const handleConfirmLock = () => {
    if (!lockTarget) return;
    const nowStr = new Date().toLocaleString();
    const updated = periods.map((p) => {
      if (p.id === lockTarget.id) {
        return {
          ...p,
          isLocked: true,
          lockedAt: nowStr,
          lockedBy: "Current Logged Admin (HR Manager)",
          lockNotes: lockNotesInput,
        };
      }
      return p;
    });

    savePeriodsState(updated);
    setToastMsg(`Payroll period ${lockTarget.month} ${lockTarget.year} (${lockTarget.processType}) has been locked & frozen.`);
    setTimeout(() => setToastMsg(""), 5000);
    setLockTarget(null);
  };

  const handleConfirmUnlock = () => {
    if (!unlockTarget) return;
    if (!unlockReasonInput.trim()) {
      alert("Please provide an unlock justification reason.");
      return;
    }
    const updated = periods.map((p) => {
      if (p.id === unlockTarget.id) {
        return {
          ...p,
          isLocked: false,
          unlockReason: unlockReasonInput,
        };
      }
      return p;
    });

    savePeriodsState(updated);
    setToastMsg(`Payroll period ${unlockTarget.month} ${unlockTarget.year} unlocked for adjustments.`);
    setTimeout(() => setToastMsg(""), 5000);
    setUnlockTarget(null);
    setUnlockReasonInput("");
  };

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans font-['Inter'] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Topbar />

        {/* Top Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Payroll</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-500">Salary Process</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Payroll Period Lock &amp; Approval
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
            <ShieldCheck size={16} />
            <span>Audit Stacking Active: {stats.locked} Periods Locked</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {toastMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-fadeIn text-xs font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                {toastMsg}
              </div>
              <button onClick={() => setToastMsg("")} className="font-bold text-emerald-600 hover:underline">
                Dismiss
              </button>
            </div>
          )}

          {/* PERIOD LOCK SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Payroll Periods</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 block">{stats.total}</span>
              </div>
              <div className="size-10 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 flex items-center justify-center font-medium border border-blue-100 dark:border-blue-900">
                <Calendar size={20} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">Locked &amp; Frozen</span>
                <span className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1 block">{stats.locked}</span>
              </div>
              <div className="size-10 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 flex items-center justify-center font-medium border border-rose-100 dark:border-rose-900">
                <Lock size={20} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Open / Unlocked</span>
                <span className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1 block">{stats.open}</span>
              </div>
              <div className="size-10 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300 flex items-center justify-center font-medium border border-amber-100 dark:border-amber-900">
                <Unlock size={20} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Total Net Frozen</span>
                <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1 block">৳ {(stats.frozenNetPayout / 1000000).toFixed(2)}M</span>
              </div>
              <div className="size-10 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center font-medium border border-emerald-100 dark:border-emerald-900">
                <Coins size={20} />
              </div>
            </div>
          </div>

          {/* FILTERS TOOLBAR */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-slate-500 font-medium">Year:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 font-medium text-xs outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-slate-500 font-medium">Process Type:</label>
                <select
                  value={selectedProcessType}
                  onChange={(e) => setSelectedProcessType(e.target.value)}
                  className="h-8 px-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 font-medium text-xs outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="ALL">All Types</option>
                  <option value="Monthly Salary">Monthly Salary</option>
                  <option value="Advance Salary">Advance Salary</option>
                  <option value="Yearly Bonus">Yearly Bonus</option>
                </select>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search month, type, ID..."
                  className="h-8 pl-8 pr-2.5 w-60 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-xs outline-none focus:border-blue-500 transition-colors"
                />
                <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              Showing {filteredPeriods.length} payroll periods
            </div>
          </div>

          {/* PAYROLL PERIOD RECORDS TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200/80 dark:border-slate-700">
                    <th className="py-3 px-4">Period &amp; Process Type</th>
                    <th className="py-3 px-4">Headcount</th>
                    <th className="py-3 px-4 text-right">Gross Salary (৳)</th>
                    <th className="py-3 px-4 text-right">Net Payable Payout (৳)</th>
                    <th className="py-3 px-4 text-center">Lock Status</th>
                    <th className="py-3 px-4">Locked Date &amp; Author</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPeriods.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                        No payroll period records found matching the filter.
                      </td>
                    </tr>
                  ) : (
                    filteredPeriods.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                            {p.month} {p.year}
                          </div>
                          <div className="text-[11px] font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                            {p.processType}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {p.id}</div>
                        </td>

                        <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                          <span className="inline-flex items-center gap-1.5">
                            <Users size={13} className="text-slate-400" />
                            {p.headcount.toLocaleString()} Staff
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right font-medium text-slate-800 dark:text-slate-200">
                          ৳ {p.grossAmount.toLocaleString()}
                        </td>

                        <td className="py-3 px-4 text-right font-semibold text-emerald-700 dark:text-emerald-400 text-xs">
                          ৳ {p.netPayout.toLocaleString()}
                        </td>

                        <td className="py-3 px-4 text-center">
                          {p.isLocked ? (
                            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-semibold text-[11px] border border-rose-200 dark:border-rose-900 inline-flex items-center gap-1">
                              <Lock size={12} /> Locked &amp; Frozen
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 font-semibold text-[11px] border border-amber-200 dark:border-amber-900 inline-flex items-center gap-1">
                              <Unlock size={12} /> Open / Unlocked
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {p.isLocked ? (
                            <div>
                              <div className="font-medium text-slate-800 dark:text-slate-200 text-[11px]">{p.lockedBy}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{p.lockedAt}</div>
                              {p.lockNotes && (
                                <div className="text-[10px] text-slate-500 italic mt-0.5 truncate max-w-xs" title={p.lockNotes}>
                                  &ldquo;{p.lockNotes}&rdquo;
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Not locked yet</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {p.isLocked ? (
                              <button
                                type="button"
                                onClick={() => setUnlockTarget(p)}
                                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 dark:text-amber-300 font-medium text-xs border border-amber-200 dark:border-amber-800 inline-flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Unlock size={13} /> Unlock
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setLockTarget(p)}
                                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-2xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Lock size={13} /> Lock Period
                              </button>
                            )}

                            {/* CERTIFICATE BUTTON - ALWAYS VISIBLE, DISABLED WHEN UNLOCKED */}
                            <button
                              type="button"
                              onClick={() => {
                                if (p.isLocked) setAuditTarget(p);
                              }}
                              disabled={!p.isLocked}
                              title={p.isLocked ? "View Frozen Audit Certificate" : "Certificate available once period is locked"}
                              className={`px-3 py-1.5 rounded-lg font-medium text-xs border inline-flex items-center gap-1.5 transition-colors ${
                                p.isLocked
                                  ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 cursor-pointer"
                                  : "bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 border-slate-200/50 dark:border-slate-800/50 opacity-60 cursor-not-allowed"
                              }`}
                            >
                              <FileText size={13} /> Certificate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* LOCK CONFIRMATION MODAL */}
      {lockTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg flex flex-col overflow-hidden animate-fadeIn my-auto">
            <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-rose-600 text-white font-black flex items-center justify-center shadow-md">
                  <Lock size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Lock Payroll Period ({lockTarget.month} {lockTarget.year})
                  </h3>
                  <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                    {lockTarget.processType} • Headcount: {lockTarget.headcount.toLocaleString()} Staff
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLockTarget(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs">
                  <AlertTriangle size={15} className="text-amber-600" />
                  Security Freeze Notice:
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Locking this payroll period will freeze all basic rates, attendance days, net payable amounts (৳ {lockTarget.netPayout.toLocaleString()}), and deductions. Inline adjustments and batch recalculations will be disabled.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Lock Justification / Audit Notes
                </label>
                <textarea
                  rows={3}
                  value={lockNotesInput}
                  onChange={(e) => setLockNotesInput(e.target.value)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-rose-500 font-sans"
                  placeholder="Enter lock notes (e.g. Approved by Head of Finance & HR)..."
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 font-medium">Logged in HR audit trail</span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setLockTarget(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLock}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all uppercase tracking-wider"
                >
                  <Lock size={15} /> Lock Payroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UNLOCK AUTHORIZATION MODAL */}
      {unlockTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg flex flex-col overflow-hidden animate-fadeIn my-auto">
            <div className="p-6 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-amber-600 text-white font-black flex items-center justify-center shadow-md">
                  <Unlock size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Unlock Payroll Period ({unlockTarget.month} {unlockTarget.year})
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                    {unlockTarget.processType} • Net Frozen: ৳ {unlockTarget.netPayout.toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setUnlockTarget(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 text-blue-900 dark:text-blue-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs">
                  <ShieldCheck size={15} className="text-blue-600" />
                  Managerial Override:
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Unlocking will re-enable inline edits, salary adjustments, and batch recalculation for {unlockTarget.month} {unlockTarget.year}.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Unlock Justification / Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={unlockReasonInput}
                  onChange={(e) => setUnlockReasonInput(e.target.value)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                  placeholder="Provide detailed unlock reason (e.g. Arrear adjustment required for 3 employees)..."
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 font-medium">Unlock reason recorded for compliance</span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setUnlockTarget(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUnlock}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all uppercase tracking-wider"
                >
                  <Unlock size={15} /> Confirm &amp; Unlock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE FROZEN AUDIT REPORT MODAL */}
      {auditTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white font-['Inter']">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full relative">
            <div className="h-2 w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-rose-600" />

            <div className="px-8 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden font-sans">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">
                  Frozen Payroll Audit Certificate ({auditTarget.month} {auditTarget.year})
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold border border-rose-300">
                  FROZEN PERIOD
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handlePrintAudit} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow">
                  <Printer size={15} /> Print Certificate
                </button>
                <button onClick={() => setAuditTarget(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-6 text-slate-900 bg-white leading-relaxed font-sans">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white font-black text-2xl flex items-center justify-center shadow-md border border-blue-700 font-sans">
                    P
                  </div>
                  <div className="leading-tight font-sans">
                    <div className="font-black text-xl text-slate-900 tracking-tight">
                      PAKIZA <span className="text-blue-600">SOFTWARE</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-slate-500">
                      Excellence | Intelligence | Automation
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-500 font-mono">
                  <div className="font-bold text-slate-800">REF: {auditTarget.id}</div>
                  <div>Audit Timestamp: {auditTarget.lockedAt || new Date().toLocaleString()}</div>
                </div>
              </div>

              <div className="text-center py-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-wide underline underline-offset-8 decoration-rose-500 uppercase">
                  PAYROLL PERIOD LOCK CERTIFICATE
                </h1>
                <div className="text-xs font-bold text-rose-700 mt-1 uppercase tracking-wider">
                  {auditTarget.month} {auditTarget.year} • {auditTarget.processType}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-rose-50/50 border border-rose-200 text-xs grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">Total Staff Headcount:</span>
                  <span className="font-extrabold text-slate-900 text-sm">{auditTarget.headcount.toLocaleString()} Employees</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">Total Gross Payroll:</span>
                  <span className="font-bold text-slate-900 text-sm">৳ {auditTarget.grossAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">Net Frozen Payout:</span>
                  <span className="font-black text-emerald-700 text-base">৳ {auditTarget.netPayout.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold">Locked By:</span>
                  <span className="font-bold text-slate-900">{auditTarget.lockedBy || "HR Management"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[10px] font-bold">Lock Audit Notes:</span>
                  <span className="font-medium text-slate-800 italic">&ldquo;{auditTarget.lockNotes}&rdquo;</span>
                </div>
              </div>

              <div className="pt-8 flex flex-wrap items-end justify-between gap-6 border-t border-slate-200">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Verified By (Payroll Admin):</span>
                  <div className="pt-8 border-t border-slate-900 w-48 text-[11px] font-semibold text-slate-600">
                    Payroll &amp; Benefits Manager
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 text-[10px]">
                  <QrCode size={36} className="text-rose-900 shrink-0" />
                  <div>
                    <div className="font-black text-rose-950 uppercase tracking-wider">PAKIZA AUDIT LOCK SEAL</div>
                    <div className="text-slate-500 font-mono">HASH: PAYROLL-LOCK-2026</div>
                    <div className="text-emerald-700 font-extrabold mt-0.5">✓ SYSTEM FROZEN</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-xs text-slate-900 block">Approved By (Executive Board):</span>
                  <div className="pt-8 border-t border-slate-900 w-48 ml-auto text-[11px] font-semibold text-slate-600 text-center">
                    Chief Financial Officer / Head of HR
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

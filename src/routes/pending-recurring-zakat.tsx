import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  HeartHandshake,
  ChevronRight,
  Search,
  CheckCircle2,
  Repeat,
  Banknote,
  ShoppingBag,
  RotateCcw,
  ArrowRight,
  Send,
  Filter,
} from "lucide-react";
import {
  INITIAL_ZAKAT_DATA,
  ZakatRecord,
  RecurringZakatSchedule,
  INITIAL_RECURRING_SCHEDULES,
  CADENCE_CONFIG,
} from "@/routes/zakat-list";

export const Route = createFileRoute("/pending-recurring-zakat")({
  head: () => ({
    meta: [
      { title: "Pending Recurring Zakat — CRIPTON" },
      {
        name: "description",
        content:
          "Month-wise pending recurring Zakat installments queue with selection and one-click disbursement to Zakat Executive Report.",
      },
    ],
  }),
  component: PendingRecurringZakatPage,
});

interface PendingRecurringRow {
  rowKey: string; // e.g. "REC-ZK-2026-01__2026-11"
  scheduleId: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  dueYear: string; // YYYY
  dueMonth: string; // MM (01..12)
  dueMonthLabel: string; // e.g. "Nov 2026"
  installmentNumber: number;
  installmentTotal: number;
  beneficiaryName: string;
  beneficiaryPhone?: string;
  beneficiaryAddress?: string;
  employeeId?: string;
  employeeName?: string;
  employeeDept?: string;
  employeeDesignation?: string;
  disbursementChannel: RecurringZakatSchedule["disbursementChannel"];
  disbursementMode: RecurringZakatSchedule["disbursementMode"];
  purposeCategory: RecurringZakatSchedule["purposeCategory"];
  otherPurposeDetails?: string;
  purposeDescription: string;
  asnafCategory: RecurringZakatSchedule["asnafCategory"];
  cadence: NonNullable<RecurringZakatSchedule["cadence"]>;
  disbursementMethod?: RecurringZakatSchedule["disbursementMethod"];
  paymentDetails?: string;
  assetDetails?: RecurringZakatSchedule["assetDetails"];
  company: string;
  area: string;
  amount: number;
  isDisbursed: boolean;
  schedule: RecurringZakatSchedule;
}

const COMPANY_OPTIONS = [
  "Pakiza Knit Composite Ltd.",
  "Pakiza Software Limited",
  "Pakiza Spinning Mills Ltd.",
];

const AREA_FILTER_OPTIONS = [
  "Dhaka North / Gazipur",
  "Ashulia / Savar",
  "Mymensingh / Bhaluka",
  "Chattogram EPZ",
  "Narayanganj Zone",
];

function resolveScheduleCompanyAndArea(sched: RecurringZakatSchedule): { company: string; area: string } {
  const addr = (sched.beneficiaryAddress || "").toLowerCase();
  const dept = (sched.employeeDept || "").toLowerCase();

  const company = dept.includes("business") || dept.includes("software")
    ? "Pakiza Software Limited"
    : dept.includes("quality") || dept.includes("spinning")
    ? "Pakiza Spinning Mills Ltd."
    : "Pakiza Knit Composite Ltd.";

  const area = addr.includes("bhaluka") || addr.includes("valuka") || addr.includes("mymensingh")
    ? "Mymensingh / Bhaluka"
    : addr.includes("savar") || addr.includes("ashulia")
    ? "Ashulia / Savar"
    : addr.includes("chattogram")
    ? "Chattogram EPZ"
    : addr.includes("narayanganj")
    ? "Narayanganj Zone"
    : "Dhaka North / Gazipur";

  return { company, area };
}

const MONTH_OPTIONS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const MONTH_SHORT_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function addMonthsToDate(dateStr: string, monthsToAdd: number, fixedDay?: number): string {
  const parts = dateStr.split("-").map(Number);
  const year = parts[0] || 2026;
  const monthIdx = (parts[1] || 1) - 1;
  const day = fixedDay || parts[2] || 1;
  const target = new Date(year, monthIdx + monthsToAdd, 1);
  const maxDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  const clampedDay = Math.min(day, maxDay);
  const mm = String(target.getMonth() + 1).padStart(2, "0");
  const dd = String(clampedDay).padStart(2, "0");
  return `${target.getFullYear()}-${mm}-${dd}`;
}

function buildPendingInstallments(
  schedules: RecurringZakatSchedule[],
  records: ZakatRecord[]
): PendingRecurringRow[] {
  const rows: PendingRecurringRow[] = [];

  schedules.forEach((sched) => {
    if (sched.status === "Paused") {
      return;
    }

    const cadence = sched.cadence || "Monthly";
    const stepMonths = CADENCE_CONFIG[cadence]?.monthsPerPeriod || 1;
    const totalPlannedMonths = sched.totalPlannedMonths || 12;
    const totalInstallments = Math.max(1, Math.round(totalPlannedMonths / stepMonths));

    // Collect already disbursed YYYY-MM keys for this schedule
    const disbursedMonths = new Set<string>();
    records.forEach((r) => {
      if (r.recurringScheduleId === sched.id && r.assignedDate) {
        disbursedMonths.add(r.assignedDate.slice(0, 7));
      }
    });

    const anchorDate = sched.startDate || sched.nextDueDate || "2026-10-01";
    const generatedCount = sched.installmentsGenerated || 0;
    const maxSlots = Math.min(totalInstallments, 12);

    for (let i = 0; i < maxSlots; i++) {
      const dueDate =
        i === 0 ? anchorDate : addMonthsToDate(anchorDate, i * stepMonths, sched.disbursementDayOfMonth);
      const dueYm = dueDate.slice(0, 7);
      const isDisbursed =
        disbursedMonths.has(dueYm) ||
        Boolean(sched.isUpfrontFullYearPaid) ||
        sched.status === "Completed" ||
        i < generatedCount;

      const [dueYear, dueMonth] = dueYm.split("-");
      const monthNum = parseInt(dueMonth, 10);
      const monthShort = MONTH_SHORT_NAMES[(monthNum - 1 + 12) % 12] || dueMonth;
      const { company, area } = resolveScheduleCompanyAndArea(sched);

      rows.push({
        rowKey: `${sched.id}__${dueYm}`,
        scheduleId: sched.id,
        title: sched.title,
        dueDate,
        dueYear,
        dueMonth,
        dueMonthLabel: `${monthShort} ${dueYear}`,
        installmentNumber: i + 1,
        installmentTotal: totalInstallments,
        beneficiaryName: sched.beneficiaryName,
        beneficiaryPhone: sched.beneficiaryPhone,
        beneficiaryAddress: sched.beneficiaryAddress,
        employeeId: sched.employeeId,
        employeeName: sched.employeeName,
        employeeDept: sched.employeeDept,
        employeeDesignation: sched.employeeDesignation,
        disbursementChannel: sched.disbursementChannel,
        disbursementMode: sched.disbursementMode,
        purposeCategory: sched.purposeCategory,
        otherPurposeDetails: sched.otherPurposeDetails,
        purposeDescription: sched.purposeDescription,
        asnafCategory: sched.asnafCategory,
        cadence,
        disbursementMethod: sched.disbursementMethod,
        paymentDetails: sched.paymentDetails,
        assetDetails: sched.assetDetails,
        company,
        area,
        amount: sched.monthlyAmount,
        isDisbursed,
        schedule: sched,
      });
    }
  });

  return rows.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

function PendingRecurringZakatPage() {
  const [records, setRecords] = useState<ZakatRecord[]>([]);
  const [schedules, setSchedules] = useState<RecurringZakatSchedule[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCompany, setFilterCompany] = useState<string>("ALL");
  const [filterArea, setFilterArea] = useState<string>("ALL");
  const [filterYear, setFilterYear] = useState<string>("2026");
  const [filterMonth, setFilterMonth] = useState<string>("11");
  const [filterStatus, setFilterStatus] = useState<"NOT_DISBURSED" | "DISBURSED" | "ALL">("NOT_DISBURSED");

  // Selection & feedback
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [disburseSuccess, setDisburseSuccess] = useState<{
    count: number;
    amount: number;
  } | null>(null);

  useEffect(() => {
    const rawRecs =
      localStorage.getItem("cripton_zakat_records") ||
      localStorage.getItem("zakat_distribution_records");
    if (rawRecs) {
      try {
        setRecords(JSON.parse(rawRecs));
      } catch {
        setRecords(INITIAL_ZAKAT_DATA || []);
      }
    } else {
      setRecords(INITIAL_ZAKAT_DATA || []);
    }

    const rawSched =
      localStorage.getItem("cripton_zakat_recurring_schedules") ||
      localStorage.getItem("zakat_recurring_schedules");
    if (rawSched) {
      try {
        setSchedules(JSON.parse(rawSched));
      } catch {
        setSchedules(INITIAL_RECURRING_SCHEDULES || []);
      }
    } else {
      setSchedules(INITIAL_RECURRING_SCHEDULES || []);
    }
  }, []);

  const allPendingRows = useMemo(
    () => buildPendingInstallments(schedules, records),
    [schedules, records]
  );

  const filteredRows = useMemo(() => {
    return allPendingRows.filter((row) => {
      if (filterCompany !== "ALL" && row.company !== filterCompany) return false;
      if (filterArea !== "ALL" && row.area !== filterArea) return false;
      if (filterYear !== "ALL" && row.dueYear !== filterYear) return false;
      if (row.dueMonth !== filterMonth) return false;
      if (filterStatus === "NOT_DISBURSED" && row.isDisbursed) return false;
      if (filterStatus === "DISBURSED" && !row.isDisbursed) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = [
          row.scheduleId,
          row.title,
          row.beneficiaryName,
          row.employeeName,
          row.employeeId,
          row.purposeCategory,
          row.company,
          row.area,
          row.dueMonthLabel,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [allPendingRows, filterCompany, filterArea, filterYear, filterMonth, filterStatus, searchQuery]);

  const selectableRows = useMemo(
    () => filteredRows.filter((r) => !r.isDisbursed),
    [filteredRows]
  );

  const selectedRows = useMemo(
    () => selectableRows.filter((r) => selectedKeys.includes(r.rowKey)),
    [selectableRows, selectedKeys]
  );

  const selectedTotalAmount = useMemo(
    () => selectedRows.reduce((sum, r) => sum + r.amount, 0),
    [selectedRows]
  );

  const allVisibleSelected =
    selectableRows.length > 0 && selectableRows.every((r) => selectedKeys.includes(r.rowKey));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      const visibleSet = new Set(selectableRows.map((r) => r.rowKey));
      setSelectedKeys((prev) => prev.filter((k) => !visibleSet.has(k)));
    } else {
      const next = new Set(selectedKeys);
      selectableRows.forEach((r) => next.add(r.rowKey));
      setSelectedKeys(Array.from(next));
    }
  };

  const toggleRow = (rowKey: string) => {
    setSelectedKeys((prev) =>
      prev.includes(rowKey) ? prev.filter((k) => k !== rowKey) : [...prev, rowKey]
    );
  };

  const handleDisburseSelected = (rowsToDisburse: PendingRecurringRow[]) => {
    if (rowsToDisburse.length === 0) return;

    const nowStamp = Date.now();
    const newZakatRecords: ZakatRecord[] = rowsToDisburse.map((row, idx) => ({
      id: `ZK-${row.dueYear}-${String(records.length + idx + 101)}-${String(nowStamp).slice(-3)}`,
      budgetYear: parseInt(row.dueYear, 10) || 2026,
      assignedDate: row.dueDate,
      distributionDeadline: addMonthsToDate(row.dueDate, 0, Math.min(28, (row.schedule.disbursementDayOfMonth || 1) + 7)),
      amount: row.amount,
      disbursementChannel: row.disbursementChannel,
      disbursementMode: row.disbursementMode,
      purposeCategory: row.purposeCategory,
      otherPurposeDetails: row.otherPurposeDetails,
      purposeSpecificDescription: row.purposeDescription,
      assetDetails: row.assetDetails,
      isRecurring: true,
      recurringScheduleId: row.scheduleId,
      cadence: row.cadence,
      installmentNumber: row.installmentNumber,
      installmentTotal: row.installmentTotal,
      employeeId: row.employeeId,
      employeeName: row.employeeName,
      employeeDept: row.employeeDept,
      employeeDesignation: row.employeeDesignation,
      beneficiaryName: row.beneficiaryName,
      beneficiaryPhone: row.beneficiaryPhone,
      beneficiaryAddress: row.beneficiaryAddress,
      asnafCategory: row.asnafCategory,
      justificationDetails: `${row.title} (${row.dueMonthLabel}) — Disbursed from Pending Recurring Zakat.`,
      agencyStatus: "Distributed",
    }));

    const updatedRecords = [...newZakatRecords, ...records];
    setRecords(updatedRecords);
    localStorage.setItem("cripton_zakat_records", JSON.stringify(updatedRecords));
    localStorage.setItem("zakat_distribution_records", JSON.stringify(updatedRecords));

    // Update recurring schedules counters & nextDueDate
    const disbursedBySchedule = new Map<string, PendingRecurringRow[]>();
    rowsToDisburse.forEach((r) => {
      const list = disbursedBySchedule.get(r.scheduleId) || [];
      list.push(r);
      disbursedBySchedule.set(r.scheduleId, list);
    });

    const updatedSchedules = schedules.map((sched) => {
      const hits = disbursedBySchedule.get(sched.id);
      if (!hits || hits.length === 0) return sched;

      const sortedHits = [...hits].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
      const latestDue = sortedHits[sortedHits.length - 1].dueDate;
      const stepMonths = CADENCE_CONFIG[sched.cadence || "Monthly"]?.monthsPerPeriod || 1;
      const addedAmount = hits.reduce((s, h) => s + h.amount, 0);
      const nextCount = (sched.installmentsGenerated || 0) + hits.length;
      const totalInstallments = Math.max(
        1,
        Math.round((sched.totalPlannedMonths || 12) / stepMonths)
      );

      return {
        ...sched,
        installmentsGenerated: nextCount,
        totalAmountDisbursed: (sched.totalAmountDisbursed || 0) + addedAmount,
        lastGeneratedDate: latestDue,
        nextDueDate: addMonthsToDate(latestDue, stepMonths, sched.disbursementDayOfMonth),
        status: nextCount >= totalInstallments ? ("Completed" as const) : sched.status,
      };
    });

    setSchedules(updatedSchedules);
    localStorage.setItem("cripton_zakat_recurring_schedules", JSON.stringify(updatedSchedules));
    localStorage.setItem("zakat_recurring_schedules", JSON.stringify(updatedSchedules));

    const disbursedKeys = new Set(rowsToDisburse.map((r) => r.rowKey));
    setSelectedKeys((prev) => prev.filter((k) => !disbursedKeys.has(k)));
    setDisburseSuccess({
      count: rowsToDisburse.length,
      amount: rowsToDisburse.reduce((s, r) => s + r.amount, 0),
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterCompany("ALL");
    setFilterArea("ALL");
    setFilterYear("2026");
    setFilterMonth("11");
    setFilterStatus("NOT_DISBURSED");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-5">
          {/* Header & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                <span>Welfare &amp; Support</span>
                <ChevronRight className="size-3.5" />
                <span className="text-emerald-600 font-bold">Pending Recurring Zakat</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                <span className="size-9 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center border border-emerald-600/20">
                  <Repeat className="size-5" />
                </span>
                Pending Recurring Zakat
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Filter pending recurring Zakat installments month-wise, select rows, and disburse directly to the Zakat Executive Report.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                to="/zakat-executive-report"
                className="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs"
              >
                <HeartHandshake className="size-3.5 text-emerald-600" />
                Zakat Executive Report
                <ArrowRight className="size-3.5" />
              </Link>
              <button
                type="button"
                disabled={selectedRows.length === 0}
                onClick={() => handleDisburseSelected(selectedRows)}
                className={`h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                  selectedRows.length > 0
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Send className="size-3.5" />
                Disburse Selected ({selectedRows.length})
                {selectedRows.length > 0 && ` • ৳${selectedTotalAmount.toLocaleString()}`}
              </button>
            </div>
          </div>

          {/* Disbursement Confirmation Banner */}
          {disburseSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-200">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>
                  Successfully disbursed {disburseSuccess.count} recurring Zakat installment
                  {disburseSuccess.count > 1 ? "s" : ""} (৳{disburseSuccess.amount.toLocaleString()}).
                  Records have been posted to Zakat Executive Report.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/zakat-executive-report"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  View Report <ArrowRight className="size-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setDisburseSuccess(null)}
                  className="px-2.5 py-1.5 rounded-lg border border-emerald-300 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Filters Bar: Search, Company, Area, Year, Month */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 mb-2.5">
              <Filter className="size-3.5 text-emerald-600" />
              <span>Filter Pending Recurring Zakat</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
              <div className="lg:col-span-2 relative">
                <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search beneficiary, schedule ID, agent..."
                  className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Companies</option>
                {COMPANY_OPTIONS.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>

              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Areas</option>
                {AREA_FILTER_OPTIONS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Years</option>
                <option value="2026">Year: 2026</option>
                <option value="2027">Year: 2027</option>
                <option value="2025">Year: 2025</option>
              </select>

              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="h-9 px-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 text-xs font-bold text-emerald-800 dark:text-emerald-200 outline-none focus:border-emerald-500"
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as "NOT_DISBURSED" | "DISBURSED" | "ALL")}
                  className="flex-1 h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold outline-none focus:border-emerald-500"
                >
                  <option value="NOT_DISBURSED">Not Disbursed</option>
                  <option value="DISBURSED">Disbursed</option>
                  <option value="ALL">All Status</option>
                </select>
                <button
                  type="button"
                  onClick={resetFilters}
                  title="Reset Filters"
                  className="h-9 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Simple Pending Recurring Zakat Table */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-50/70 dark:bg-slate-950/40">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                <span>Pending Recurring Zakat List</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                  {filteredRows.length} Pending
                </span>
              </div>
              {selectedRows.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleDisburseSelected(selectedRows)}
                  className="h-8 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="size-3.5" />
                  Disburse {selectedRows.length} Selected (৳{selectedTotalAmount.toLocaleString()})
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAll}
                        aria-label="Select all pending recurring zakat"
                        className="size-4 rounded border-slate-300 accent-emerald-600 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-3">Schedule &amp; Title</th>
                    <th className="py-3 px-3">Due Month</th>
                    <th className="py-3 px-3">Beneficiary &amp; Agent</th>
                    <th className="py-3 px-3">Channel &amp; Mode</th>
                    <th className="py-3 px-3">Cadence</th>
                    <th className="py-3 px-3 text-right">Amount</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-500">
                        <CheckCircle2 className="size-8 text-emerald-500/40 mx-auto mb-2" />
                        <p className="font-bold text-slate-700 dark:text-slate-300">
                          No pending recurring Zakat found for the selected filters.
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Try changing the Month filter or resetting filters above.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => {
                      const isChecked = selectedKeys.includes(row.rowKey);
                      return (
                        <tr
                          key={row.rowKey}
                          onClick={() => {
                            if (!row.isDisbursed) toggleRow(row.rowKey);
                          }}
                          className={`transition-colors ${
                            row.isDisbursed
                              ? "bg-emerald-50/20 dark:bg-emerald-950/10"
                              : isChecked
                              ? "bg-emerald-50/60 dark:bg-emerald-950/25 cursor-pointer"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                          }`}
                        >
                          <td
                            className="py-3 px-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              disabled={row.isDisbursed}
                              checked={!row.isDisbursed && isChecked}
                              onChange={() => toggleRow(row.rowKey)}
                              aria-label={`Select ${row.title} (${row.dueMonthLabel})`}
                              className="size-4 rounded border-slate-300 accent-emerald-600 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {row.scheduleId}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400">
                                #{row.installmentNumber}/{row.installmentTotal}
                              </span>
                            </div>
                            <div className="font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                              {row.title}
                            </div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              {row.dueMonthLabel}
                            </div>
                            <div className="text-[10.5px] font-mono text-slate-400">
                              Due: {row.dueDate}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {row.beneficiaryName}
                            </div>
                            <div className="text-[10.5px] text-slate-500">
                              {row.employeeName
                                ? `Via: ${row.employeeName} (${row.employeeDept || "Staff"})`
                                : row.beneficiaryPhone || "Direct"}
                            </div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="font-semibold text-slate-700 dark:text-slate-300">
                              {row.disbursementChannel}
                            </div>
                            <div className="inline-flex items-center gap-1 text-[10.5px] text-slate-500 mt-0.5">
                              {row.disbursementMode === "Asset Purchased" ? (
                                <ShoppingBag className="size-3 text-purple-500" />
                              ) : (
                                <Banknote className="size-3 text-emerald-500" />
                              )}
                              <span>{row.disbursementMode}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold text-[10.5px]">
                              {row.cadence}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                              ৳{row.amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            {row.isDisbursed ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold text-[10.5px]">
                                Disbursed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold text-[10.5px]">
                                Not Disbursed
                              </span>
                            )}
                          </td>
                          <td
                            className="py-3 px-4 text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {row.isDisbursed ? (
                              <span className="text-[11px] font-bold text-emerald-600 inline-flex items-center gap-1">
                                <CheckCircle2 className="size-3.5" /> Disbursed
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleDisburseSelected([row])}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Disburse
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Coins,
  ChevronRight,
  Search,
  Printer,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  Check,
  X,
  Users,
  Building2,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { submitFestivalAllowanceBatch } from "@/lib/festivalAllowanceStore";

export const Route = createFileRoute("/festival-allowance")({
  head: () => ({
    meta: [
      { title: "Festival Allowance — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Manage employee festival allowance calculations, holiday duty parameters, and payment disbursements.",
      },
    ],
  }),
  component: FestivalAllowancePage,
});

export interface FestivalAllowanceRow {
  id: string;
  sl: number;
  empId: string;
  name: string;
  type: string;
  department: string;
  section: string;
  designation: string;
  gross: number;
  basic: number;
  totalDay: number;
  perDayRate: number;
  payableAmt: number;
  otHour: number;
  rate: number;
  otAmount: number;
  lunchBill: number;
  netPay: number;
  status: "Saved" | "Pending" | "Approved";
}

const STORAGE_KEY = "hris_festival_allowance_records_v1";

// 9 exact entries from reference screenshot
const INITIAL_RECORDS: FestivalAllowanceRow[] = [
  {
    id: "fa-1",
    sl: 1,
    empId: "2023046676",
    name: "Abdul Motaleb",
    type: "Office Executive",
    department: "Admin",
    section: "Admin",
    designation: "Sr. Manager",
    gross: 77500,
    basic: 46500,
    totalDay: 1,
    perDayRate: 3500,
    payableAmt: 3500,
    otHour: 0.0,
    rate: 0,
    otAmount: 0,
    lunchBill: 0,
    netPay: 3500,
    status: "Saved",
  },
  {
    id: "fa-2",
    sl: 2,
    empId: "2017009679",
    name: "Md. Ehsan Uddin",
    type: "Office Executive",
    department: "Civil Engineering",
    section: "Civil Engineering",
    designation: "Deputy Manager",
    gross: 68600,
    basic: 41160,
    totalDay: 1,
    perDayRate: 3000,
    payableAmt: 3000,
    otHour: 0.0,
    rate: 0,
    otAmount: 0,
    lunchBill: 0,
    netPay: 3000,
    status: "Saved",
  },
  {
    id: "fa-3",
    sl: 3,
    empId: "2024051919",
    name: "Md. Jasim Uddin",
    type: "Office Executive",
    department: "Internal Audit",
    section: "Internal Audit",
    designation: "Asst. Officer",
    gross: 23800,
    basic: 14280,
    totalDay: 1,
    perDayRate: 2000,
    payableAmt: 2000,
    otHour: 0.0,
    rate: 0,
    otAmount: 0,
    lunchBill: 0,
    netPay: 2000,
    status: "Saved",
  },
  {
    id: "fa-4",
    sl: 4,
    empId: "2024047891",
    name: "Md. Biplob Hossain",
    type: "Worker",
    department: "Admin and Compliance",
    section: "Office Admin",
    designation: "Driver",
    gross: 24700,
    basic: 14833,
    totalDay: 1,
    perDayRate: 1483,
    payableAmt: 1483,
    otHour: 0.0,
    rate: 0,
    otAmount: 0,
    lunchBill: 0,
    netPay: 1483,
    status: "Saved",
  },
  {
    id: "fa-5",
    sl: 5,
    empId: "2022037540",
    name: "Md. Altaf Hossen",
    type: "Worker",
    department: "Admin and Compliance",
    section: "Office Admin",
    designation: "Driver",
    gross: 22400,
    basic: 13300,
    totalDay: 1,
    perDayRate: 1330,
    payableAmt: 1330,
    otHour: 0.0,
    rate: 0,
    otAmount: 0,
    lunchBill: 0,
    netPay: 1330,
    status: "Saved",
  },
  {
    id: "fa-6",
    sl: 6,
    empId: "2023046608",
    name: "Md. Ruhul Amin",
    type: "Office Executive",
    department: "Internal Audit",
    section: "Internal Audit",
    designation: "Asst. Officer",
    gross: 28300,
    basic: 16980,
    totalDay: 1,
    perDayRate: 2000,
    payableAmt: 2000,
    otHour: 0.0,
    rate: 0,
    otAmount: 0,
    lunchBill: 0,
    netPay: 2000,
    status: "Saved",
  },
  {
    id: "fa-7",
    sl: 7,
    empId: "2023046846",
    name: "Md. Mahmudul Hassan",
    type: "Office Executive",
    department: "Internal Audit",
    section: "Internal Audit",
    designation: "Asst. Officer",
    gross: 30300,
    basic: 18180,
    totalDay: 1,
    perDayRate: 2000,
    payableAmt: 2000,
    otHour: 0.0,
    rate: 0,
    otAmount: 0,
    lunchBill: 0,
    netPay: 2000,
    status: "Saved",
  },
  {
    id: "fa-8",
    sl: 8,
    empId: "2023046582",
    name: "Ali Mohammad",
    type: "Office Executive",
    department: "Internal Audit",
    section: "Internal Audit",
    designation: "Asst. Officer",
    gross: 27300,
    basic: 16380,
    totalDay: 1,
    perDayRate: 2000,
    payableAmt: 2000,
    otHour: 0.0,
    rate: 0,
    otAmount: 0,
    lunchBill: 0,
    netPay: 2000,
    status: "Saved",
  },
  {
    id: "fa-9",
    sl: 9,
    empId: "2024048662",
    name: "Kawsar Islam",
    type: "Worker",
    department: "Admin and Compliance",
    section: "Office Admin",
    designation: "Driver",
    gross: 21200,
    basic: 12500,
    totalDay: 1,
    perDayRate: 1250,
    payableAmt: 1250,
    otHour: 0.0,
    rate: 0,
    otAmount: 0,
    lunchBill: 0,
    netPay: 1250,
    status: "Saved",
  },
];

const BASED_ON_OPTIONS = ["Month Wise", "Date Wise"];
const YEARS = ["2026", "2025", "2024", "2023"];
const MONTHS = ["Aug", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Sep", "Oct", "Nov", "Dec"];
const PROCESS_FOR_OPTIONS = ["Festival Holiday", "General Holiday", "Special Duty", "All"];
const EMPLOYEE_TYPES = ["ALL", "Office Executive", "Worker", "Office Staff", "Production Executive", "Management"];
const SECTIONS = ["ALL", "Admin", "Civil Engineering", "Internal Audit", "Office Admin", "Maintenance"];
const UNITS = ["ALL", "Unit-01", "Unit-02", "Unit-03", "N/A"];

export function FestivalAllowancePage() {
  const [records, setRecords] = useState<FestivalAllowanceRow[]>(INITIAL_RECORDS);

  // Load from localStorage on client and sync live with HR Check updates
  useEffect(() => {
    if (typeof window !== "undefined") {
      const load = () => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setRecords(parsed);
            }
          }
        } catch (err) {
          console.error("Failed to load records from localStorage", err);
        }
      };

      load();
      window.addEventListener("festival_allowances_changed", load);
      return () => {
        window.removeEventListener("festival_allowances_changed", load);
      };
    }
  }, []);

  const persistRecords = (newList: FestivalAllowanceRow[]) => {
    setRecords(newList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      } catch (err) {
        console.error("Failed to save records to localStorage", err);
      }
    }
  };

  // Filter Form State (Matching Image)
  const [basedOn, setBasedOn] = useState("Month Wise");
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-31");
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Aug");
  const [processFor, setProcessFor] = useState("Festival Holiday");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [empIdInput, setEmpIdInput] = useState("");

  // Applied Filter
  const [appliedFilters, setAppliedFilters] = useState({
    empType: "ALL",
    section: "ALL",
    empIds: "",
  });

  const handleSearch = () => {
    setAppliedFilters({
      empType: employeeType,
      section: section,
      empIds: empIdInput.trim(),
    });
    setCurrentPage(1);
    const periodLabel =
      basedOn === "Date Wise" ? `${startDate} to ${endDate}` : `${month} ${year}`;
    toast.info("Search filter applied", {
      description: `Viewing Festival Allowance records for ${periodLabel}.`,
    });
  };

  // Row Selection (Checkboxes)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Table Search Filter
  const [tableSearch, setTableSearch] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Employee Type filter
      if (appliedFilters.empType !== "ALL" && r.type !== appliedFilters.empType) {
        return false;
      }

      // Section filter
      if (appliedFilters.section !== "ALL" && r.section !== appliedFilters.section) {
        return false;
      }

      // EmpId comma separated filter
      if (appliedFilters.empIds) {
        const ids = appliedFilters.empIds
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
        if (ids.length > 0 && !ids.some((id) => r.empId.toLowerCase().includes(id))) {
          return false;
        }
      }

      // Live table search
      if (tableSearch.trim()) {
        const query = tableSearch.toLowerCase();
        const matches =
          r.empId.toLowerCase().includes(query) ||
          r.name.toLowerCase().includes(query) ||
          r.department.toLowerCase().includes(query) ||
          r.section.toLowerCase().includes(query) ||
          r.designation.toLowerCase().includes(query) ||
          r.type.toLowerCase().includes(query) ||
          r.status.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [records, appliedFilters, tableSearch]);

  // Paginated records
  const totalEntries = filteredRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Select all handlers
  const isAllSelected =
    paginatedRecords.length > 0 &&
    paginatedRecords.every((r) => selectedIds.has(r.id));

  const handleToggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (isAllSelected) {
      paginatedRecords.forEach((r) => next.delete(r.id));
    } else {
      paginatedRecords.forEach((r) => next.add(r.id));
    }
    setSelectedIds(next);
  };

  const handleToggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Row OT change
  const handleOtHourChange = (id: string, val: string) => {
    const parsed = parseFloat(val) || 0;
    const updated = records.map((r) => {
      if (r.id === id) {
        const newOtAmt = parsed * (r.rate || 0);
        const newNetPay = r.payableAmt + newOtAmt + r.lunchBill;
        return {
          ...r,
          otHour: parsed,
          otAmount: newOtAmt,
          netPay: newNetPay,
        };
      }
      return r;
    });
    persistRecords(updated);
  };

  // Submit Handler
  const handleSubmit = () => {
    const targetRecords =
      selectedIds.size > 0
        ? records.filter((r) => selectedIds.has(r.id))
        : filteredRecords;

    if (targetRecords.length === 0) {
      toast.warning("No records to submit.");
      return;
    }

    const totalPayable = targetRecords.reduce(
      (sum, r) => sum + (r.netPay || r.payableAmt || 0),
      0
    );
    const departmentName = targetRecords[0]?.department || "Admin & Compliance";

    const periodLabel =
      basedOn === "Date Wise" ? `${startDate} to ${endDate}` : `${month} ${year}`;

    const batch = submitFestivalAllowanceBatch({
      basedOn,
      year: basedOn === "Date Wise" ? startDate.slice(0, 4) : year,
      month: basedOn === "Date Wise" ? `${startDate} to ${endDate}` : month,
      processFor,
      submittedBy: "Current User (Admin)",
      department: departmentName,
      employeeCount: targetRecords.length,
      totalPayable,
      remarks: `Festival allowance submission for ${targetRecords.length} employee(s) (${periodLabel}).`,
      items: targetRecords.map((r, i) => ({
        id: `fae-${Date.now()}-${i}`,
        sl: i + 1,
        empId: r.empId,
        name: r.name,
        type: r.type,
        department: r.department,
        section: r.section,
        designation: r.designation,
        gross: r.gross,
        basic: r.basic,
        totalDay: r.totalDay,
        perDayRate: r.perDayRate,
        payableAmt: r.payableAmt,
        otHour: r.otHour,
        rate: r.rate,
        otAmount: r.otAmount,
        lunchBill: r.lunchBill,
        netPay: r.netPay,
        status: "Pending",
      })),
    });

    // Mark selected records as Pending in local table
    const targetIdSet = new Set(targetRecords.map((r) => r.id));
    const updated = records.map((r) =>
      targetIdSet.has(r.id) ? { ...r, status: "Pending" as const } : r
    );
    persistRecords(updated);
    setSelectedIds(new Set());

    toast.success(`Festival Allowance Submitted (${batch.id})!`, {
      description: `Sent ${targetRecords.length} record(s) to Festival Allowance Approval for review.`,
    });
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      toast.warning("No data to export.");
      return;
    }

    const headers = [
      "#",
      "Emp ID",
      "Name",
      "Type",
      "Department",
      "Section",
      "Designation",
      "Gross",
      "Basic",
      "Total Day",
      "Per Day Rate",
      "Payable Amt",
      "OT Hour",
      "Rate",
      "OT Amount",
      "Lunch Bill",
      "Net Pay",
      "Status",
    ];

    const rows = filteredRecords.map((r, idx) => [
      idx + 1,
      r.empId,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.type}"`,
      `"${r.department}"`,
      `"${r.section}"`,
      `"${r.designation}"`,
      r.gross,
      r.basic,
      r.totalDay,
      r.perDayRate,
      r.payableAmt,
      r.otHour.toFixed(2),
      r.rate,
      r.otAmount,
      r.lunchBill,
      r.netPay,
      r.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileSuffix =
      basedOn === "Date Wise" ? `${startDate}_to_${endDate}` : `${year}_${month}`;
    link.setAttribute("download", `festival_allowance_${fileSuffix}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Excel CSV downloaded successfully!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans antialiased">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 md:p-6 xl:p-8 space-y-6">
          {/* --------------------------------------------------------------------------- */}
          {/* Header Banner matching lunch requisition page design layout                 */}
          {/* --------------------------------------------------------------------------- */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <Link to="/manage-overtime" className="hover:text-primary transition-colors">
                  Manage Overtime
                </Link>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-semibold uppercase">
                  Festival Allowance
                </span>
              </div>
              <h1 className="text-xl font-black text-foreground flex items-center gap-2">
                <Coins className="size-6 text-primary" />
                <span>Festival Allowance</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Review and process festival holiday duties, employee day rates, and net allowance payable.
              </p>
            </div>

            {/* Quick Navigation Hub */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to="/festival-allowance-check-hr"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold transition"
              >
                <ShieldCheck className="size-3.5 text-primary" />
                <span>Check (HR)</span>
              </Link>
              <Link
                to="/festival-allowance-approval"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold transition"
              >
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>Approval Hub</span>
              </Link>
              <Link
                to="/festival-allowance-payment-sheet"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold transition"
              >
                <FileSpreadsheet className="size-3.5 text-blue-600" />
                <span>Payment Sheet</span>
              </Link>
            </div>
          </div>

          {/* --------------------------------------------------------------------------- */}
          {/* Top Filter Panel (Matching image form fields with standard ERP field styling)*/}
          {/* --------------------------------------------------------------------------- */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4 print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Based On */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Based On
                </label>
                <div className="relative">
                  <select
                    value={basedOn}
                    onChange={(e) => setBasedOn(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs appearance-none cursor-pointer transition"
                  >
                    {BASED_ON_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-card text-foreground">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="size-3.5 text-muted-foreground absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Year & Month OR Start Date & End Date depending on Based On */}
              {basedOn === "Date Wise" ? (
                <>
                  {/* Start Date */}
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs transition"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs transition"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Year */}
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                      Year
                    </label>
                    <div className="relative">
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full h-9 px-3 pr-8 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs appearance-none cursor-pointer transition"
                      >
                        {YEARS.map((y) => (
                          <option key={y} value={y} className="bg-card text-foreground">
                            {y}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="size-3.5 text-muted-foreground absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Month */}
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                      Month
                    </label>
                    <div className="relative">
                      <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="w-full h-9 px-3 pr-8 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs appearance-none cursor-pointer transition"
                      >
                        {MONTHS.map((m) => (
                          <option key={m} value={m} className="bg-card text-foreground">
                            {m}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="size-3.5 text-muted-foreground absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}

              {/* Process For */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Process For
                </label>
                <div className="relative">
                  <select
                    value={processFor}
                    onChange={(e) => setProcessFor(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs appearance-none cursor-pointer transition"
                  >
                    {PROCESS_FOR_OPTIONS.map((p) => (
                      <option key={p} value={p} className="bg-card text-foreground">
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="size-3.5 text-muted-foreground absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Employee Type */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Employee Type
                </label>
                <div className="relative">
                  <select
                    value={employeeType}
                    onChange={(e) => setEmployeeType(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs appearance-none cursor-pointer transition"
                  >
                    {EMPLOYEE_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-card text-foreground">
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="size-3.5 text-muted-foreground absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Section */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Section
                </label>
                <div className="relative">
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs appearance-none cursor-pointer transition"
                  >
                    {SECTIONS.map((s) => (
                      <option key={s} value={s} className="bg-card text-foreground">
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="size-3.5 text-muted-foreground absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Unit */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  Unit
                </label>
                <div className="relative">
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground outline-none focus:border-primary shadow-2xs appearance-none cursor-pointer transition"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u} className="bg-card text-foreground">
                        {u}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="size-3.5 text-muted-foreground absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* EmpId */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground mb-1 block">
                  EmpId
                </label>
                <input
                  type="text"
                  value={empIdInput}
                  onChange={(e) => setEmpIdInput(e.target.value)}
                  placeholder="Input Comma As Separator"
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border/70 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary shadow-2xs transition"
                />
              </div>
            </div>

            {/* SEARCH Button */}
            <div className="pt-1 flex items-center justify-start">
              <button
                type="button"
                onClick={handleSearch}
                className="h-9 px-6 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs uppercase tracking-wider rounded shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <Search className="size-3.5" />
                <span>SEARCH</span>
              </button>
            </div>
          </div>

          {/* --------------------------------------------------------------------------- */}
          {/* Main Table Card & Toolbar                                                   */}
          {/* --------------------------------------------------------------------------- */}
          <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
            {/* Toolbar: EXCEL, PRINT, PDF on Left | Search on Right */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 print:hidden">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3.5 py-1.5 rounded border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5 text-emerald-600" />
                  <span>EXCEL</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                  <Printer className="size-3.5 text-blue-600" />
                  <span>PRINT</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                  <FileText className="size-3.5 text-rose-600" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Right Side: Search */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground font-medium">Search:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => {
                      setTableSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search table..."
                    className="w-48 sm:w-60 h-8 px-2.5 rounded border border-border bg-background text-xs text-foreground focus:outline-none focus:border-primary transition"
                  />
                  {tableSearch && (
                    <button
                      type="button"
                      onClick={() => setTableSearch("")}
                      className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Table with Light Sky Blue Header matching screenshot */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#e1f0fa] dark:bg-sky-950/40 text-[#2c3e50] dark:text-sky-200 border-b border-sky-200 dark:border-sky-900 font-bold whitespace-nowrap">
                    {/* Checkbox Column */}
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleSelectAll}
                        className="rounded border-border text-primary focus:ring-primary size-4 cursor-pointer"
                        title="Select All"
                      />
                    </th>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Emp ID</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Section</th>
                    <th className="py-2.5 px-3">Designation</th>
                    <th className="py-2.5 px-3 text-right">Gross</th>
                    <th className="py-2.5 px-3 text-right">Basic</th>
                    <th className="py-2.5 px-3 text-center">Total Day</th>
                    <th className="py-2.5 px-3 text-right">Per Day Rate</th>
                    <th className="py-2.5 px-3 text-right">Payable Amt</th>
                    <th className="py-2.5 px-3 text-center w-20">OT Hour</th>
                    <th className="py-2.5 px-3 text-center">Rate</th>
                    <th className="py-2.5 px-3 text-center">OT Amount</th>
                    <th className="py-2.5 px-3 text-center">Lunch Bill</th>
                    <th className="py-2.5 px-3 text-right">Net Pay</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/40 text-foreground">
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={19} className="py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="size-8 text-muted-foreground/40" />
                          <p className="text-sm font-medium">No festival allowance records found.</p>
                          <p className="text-xs text-muted-foreground/70">
                            Try adjusting your filter parameters or search box.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((r, index) => {
                      const isSelected = selectedIds.has(r.id);
                      return (
                        <tr
                          key={r.id}
                          className={`hover:bg-muted/40 transition-colors ${
                            isSelected ? "bg-primary/5" : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-2 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectRow(r.id)}
                              className="rounded border-border text-primary focus:ring-primary size-4 cursor-pointer"
                            />
                          </td>

                          {/* # (SL) */}
                          <td className="py-2 px-3 text-muted-foreground font-medium">
                            {(currentPage - 1) * pageSize + index + 1}
                          </td>

                          {/* Emp ID */}
                          <td className="py-2 px-3 font-semibold text-foreground whitespace-nowrap">
                            {r.empId}
                          </td>

                          {/* Name */}
                          <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                            {r.name}
                          </td>

                          {/* Type */}
                          <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                            {r.type}
                          </td>

                          {/* Department */}
                          <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                            {r.department}
                          </td>

                          {/* Section */}
                          <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                            {r.section}
                          </td>

                          {/* Designation */}
                          <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">
                            {r.designation}
                          </td>

                          {/* Gross */}
                          <td className="py-2 px-3 text-right font-medium">
                            {r.gross.toLocaleString()}
                          </td>

                          {/* Basic */}
                          <td className="py-2 px-3 text-right text-muted-foreground">
                            {r.basic.toLocaleString()}
                          </td>

                          {/* Total Day */}
                          <td className="py-2 px-3 text-center font-bold">
                            {r.totalDay}
                          </td>

                          {/* Per Day Rate */}
                          <td className="py-2 px-3 text-right font-medium">
                            {r.perDayRate.toLocaleString()}
                          </td>

                          {/* Payable Amt */}
                          <td className="py-2 px-3 text-right font-bold text-foreground">
                            {r.payableAmt.toLocaleString()}
                          </td>

                          {/* OT Hour (Editable input box) */}
                          <td className="py-1 px-3 text-center">
                            <input
                              type="number"
                              step="0.01"
                              value={r.otHour.toFixed(2)}
                              onChange={(e) => handleOtHourChange(r.id, e.target.value)}
                              className="w-16 h-7 text-center rounded border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary shadow-2xs"
                            />
                          </td>

                          {/* Rate */}
                          <td className="py-2 px-3 text-center text-muted-foreground">
                            {r.rate}
                          </td>

                          {/* OT Amount */}
                          <td className="py-2 px-3 text-center text-muted-foreground">
                            {r.otAmount}
                          </td>

                          {/* Lunch Bill */}
                          <td className="py-2 px-3 text-center text-muted-foreground">
                            {r.lunchBill}
                          </td>

                          {/* Net Pay */}
                          <td className="py-2 px-3 text-right font-black text-foreground whitespace-nowrap">
                            {r.netPay.toLocaleString()}
                          </td>

                          {/* Status */}
                          <td className="py-2 px-3 text-center whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Counter (Matching Screenshot) */}
            <div className="p-4 border-t border-border/40 flex items-center justify-between">
              <div className="text-xs text-muted-foreground font-medium">
                Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries
              </div>
            </div>

            {/* Bottom Submit Action Bar (Green SUBMIT button matching screenshot) */}
            <div className="p-4 bg-muted/20 border-t border-border/40 flex items-center justify-between">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold text-xs uppercase tracking-wider rounded shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <Check className="size-4 font-bold" />
                <span>SUBMIT</span>
              </button>

              <span className="text-xs text-muted-foreground">
                {selectedIds.size > 0
                  ? `${selectedIds.size} record(s) selected for submission`
                  : "All current filtered entries will be submitted"}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

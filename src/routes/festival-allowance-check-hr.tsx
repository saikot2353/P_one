import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Printer,
  FileText,
  RotateCcw,
  Users,
  Coins,
  Banknote,
  DollarSign,
  ChevronRight,
  Calendar,
  Building,
  CheckSquare,
  Square,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export const Route = createFileRoute("/festival-allowance-check-hr")({
  head: () => ({
    meta: [
      { title: "Festival Allowance Check (HR) — CRIPTON HRIS" },
      {
        name: "description",
        content:
          "Festival Allowance Checking, Verification, and Approval for Human Resources Department.",
      },
    ],
  }),
  component: FestivalAllowanceCheckHrPage,
});

export interface FestivalPayCheckRow {
  id: string;
  sl: number;
  empId: string;
  name: string;
  type: string;
  department: string;
  section: string;
  designation: string;
  basic: number;
  gross: number;
  totalDay: number;
  perDayRate: number;
  payableAmt: number;
  otHour: number;
  rate: number;
  otAmount: number;
  lunchBill: number;
  netPay: number;
  bankName: string;
  unit: string;
  systemOffice: "System" | "Office";
  year: string;
  month: string;
  status: "Pending" | "Approved" | "Reject";
}

const STORAGE_KEY = "hris_festival_allowance_check_hr_records_v1";

const INITIAL_RECORDS: FestivalPayCheckRow[] = [
  {
    id: "fpc-1",
    sl: 1,
    empId: "2025053380",
    name: "Miraz Uddin",
    type: "Office Executive",
    department: "Business Development",
    section: "Core Sales",
    designation: "Jr. Executive",
    basic: 14400.0,
    gross: 24000.0,
    totalDay: 1,
    perDayRate: 2000.0,
    payableAmt: 2000.0,
    otHour: 0.0,
    rate: 0.0,
    otAmount: 0.0,
    lunchBill: 0.0,
    netPay: 2000.0,
    bankName: "Dutch-Bangla Bank Ltd.",
    unit: "Unit-01",
    systemOffice: "Office",
    year: "2026",
    month: "Oct",
    status: "Pending",
  },
  {
    id: "fpc-2",
    sl: 2,
    empId: "2025054315",
    name: "Md. Shahinur Alahi Khan",
    type: "Office Executive",
    department: "Business Development",
    section: "Core Sales",
    designation: "Asst. Manager",
    basic: 31800.0,
    gross: 53000.0,
    totalDay: 1,
    perDayRate: 3000.0,
    payableAmt: 3000.0,
    otHour: 0.0,
    rate: 0.0,
    otAmount: 0.0,
    lunchBill: 0.0,
    netPay: 3000.0,
    bankName: "Dutch-Bangla Bank Ltd.",
    unit: "Unit-01",
    systemOffice: "Office",
    year: "2026",
    month: "Oct",
    status: "Pending",
  },
  {
    id: "fpc-3",
    sl: 3,
    empId: "2026058686",
    name: "Md. Abdur Rahaman",
    type: "Office Executive",
    department: "Business Innovation",
    section: "Business Innovation",
    designation: "Executive",
    basic: 30000.0,
    gross: 50000.0,
    totalDay: 1,
    perDayRate: 2500.0,
    payableAmt: 2500.0,
    otHour: 0.0,
    rate: 0.0,
    otAmount: 0.0,
    lunchBill: 0.0,
    netPay: 2500.0,
    bankName: "Rocket-Dutch-Bangla Bank Ltd.",
    unit: "Unit-02",
    systemOffice: "System",
    year: "2026",
    month: "Oct",
    status: "Pending",
  },
  {
    id: "fpc-4",
    sl: 4,
    empId: "2025054707",
    name: "Allama Bakhtiyar Nafis",
    type: "Office Executive",
    department: "Business Innovation",
    section: "WEB-Team",
    designation: "Jr. Executive",
    basic: 15000.0,
    gross: 25000.0,
    totalDay: 1,
    perDayRate: 2000.0,
    payableAmt: 2000.0,
    otHour: 0.0,
    rate: 0.0,
    otAmount: 0.0,
    lunchBill: 0.0,
    netPay: 2000.0,
    bankName: "Dutch-Bangla Bank Ltd.",
    unit: "Unit-02",
    systemOffice: "Office",
    year: "2026",
    month: "Oct",
    status: "Pending",
  },
  {
    id: "fpc-5",
    sl: 5,
    empId: "2023045146",
    name: "Asif Hossain",
    type: "Worker",
    department: "HR, Admin and Compliance",
    section: "Admin",
    designation: "Driver",
    basic: 12500.0,
    gross: 21200.0,
    totalDay: 1,
    perDayRate: 1250.0,
    payableAmt: 1250.0,
    otHour: 0.0,
    rate: 0.0,
    otAmount: 0.0,
    lunchBill: 0.0,
    netPay: 1250.0,
    bankName: "Rocket-Dutch-Bangla Bank Ltd.",
    unit: "Unit-01",
    systemOffice: "Office",
    year: "2026",
    month: "Oct",
    status: "Approved",
  },
  {
    id: "fpc-6",
    sl: 6,
    empId: "2023046544",
    name: "Mazharul Haque",
    type: "Office Executive",
    department: "Implementation & Business Analysis",
    section: "ERP Team",
    designation: "Deputy Manager",
    basic: 40800.0,
    gross: 68000.0,
    totalDay: 1,
    perDayRate: 3000.0,
    payableAmt: 3000.0,
    otHour: 0.0,
    rate: 0.0,
    otAmount: 0.0,
    lunchBill: 0.0,
    netPay: 3000.0,
    bankName: "Dutch-Bangla Bank Ltd.",
    unit: "Unit-03",
    systemOffice: "System",
    year: "2026",
    month: "Oct",
    status: "Pending",
  },
];

const YEARS = [
  "2026",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
];

const MONTHS = [
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

const STATUS_OPTIONS = ["ALL", "Pending", "Approved", "Reject"];
const BANK_OPTIONS = [
  "ALL",
  "Dutch-Bangla Bank Ltd.",
  "Rocket-Dutch-Bangla Bank Ltd.",
];
const EMPLOYEE_TYPES = ["ALL", "Office Executive", "Worker", "Staff"];
const SECTIONS = [
  "ALL",
  "Core Sales",
  "Business Innovation",
  "WEB-Team",
  "Admin",
  "ERP Team",
];
const UNITS = ["ALL", "Unit-01", "Unit-02", "Unit-03", "Head Office"];

export function FestivalAllowanceCheckHrPage() {
  const [records, setRecords] = useState<FestivalPayCheckRow[]>(INITIAL_RECORDS);

  // Filters state
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("Oct");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedBank, setSelectedBank] = useState("ALL");
  const [selectedEmpType, setSelectedEmpType] = useState("ALL");
  const [selectedSection, setSelectedSection] = useState("ALL");
  const [selectedUnit, setSelectedUnit] = useState("ALL");
  const [searchEmpId, setSearchEmpId] = useState("");
  const [selectedSystemOffice, setSelectedSystemOffice] = useState<"ALL" | "System" | "Office">("ALL");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickFilter, setQuickFilter] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRecords(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to load records from localStorage", e);
      }
    }
  }, []);

  // Save helper
  const updateRecordsState = (updated: FestivalPayCheckRow[]) => {
    setRecords(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedYear !== "ALL" && r.year !== selectedYear) return false;
      if (selectedMonth !== "ALL" && r.month !== selectedMonth) return false;
      if (selectedStatus !== "ALL" && r.status !== selectedStatus) return false;
      if (selectedBank !== "ALL" && r.bankName !== selectedBank) return false;
      if (selectedEmpType !== "ALL" && r.type !== selectedEmpType) return false;
      if (selectedSection !== "ALL" && r.section !== selectedSection) return false;
      if (selectedUnit !== "ALL" && r.unit !== selectedUnit) return false;
      if (
        selectedSystemOffice !== "ALL" &&
        r.systemOffice !== selectedSystemOffice
      )
        return false;
      if (
        searchEmpId.trim() &&
        !r.empId.toLowerCase().includes(searchEmpId.trim().toLowerCase())
      )
        return false;
      if (quickFilter.trim()) {
        const q = quickFilter.trim().toLowerCase();
        const matches =
          r.empId.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.section.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [
    records,
    selectedYear,
    selectedMonth,
    selectedStatus,
    selectedBank,
    selectedEmpType,
    selectedSection,
    selectedUnit,
    selectedSystemOffice,
    searchEmpId,
    quickFilter,
  ]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalCount = filteredRecords.length;
    const totalGross = filteredRecords.reduce((sum, r) => sum + r.gross, 0);
    const totalPayable = filteredRecords.reduce((sum, r) => sum + r.payableAmt, 0);
    const totalNetPay = filteredRecords.reduce((sum, r) => sum + r.netPay, 0);
    const totalDays = filteredRecords.reduce((sum, r) => sum + r.totalDay, 0);
    const approvedCount = filteredRecords.filter((r) => r.status === "Approved").length;
    const pendingCount = filteredRecords.filter((r) => r.status === "Pending").length;
    return {
      totalCount,
      totalGross,
      totalPayable,
      totalNetPay,
      totalDays,
      approvedCount,
      pendingCount,
    };
  }, [filteredRecords]);

  // Reset filters
  const handleResetFilters = () => {
    setSelectedYear("2026");
    setSelectedMonth("Oct");
    setSelectedStatus("ALL");
    setSelectedBank("ALL");
    setSelectedEmpType("ALL");
    setSelectedSection("ALL");
    setSelectedUnit("ALL");
    setSearchEmpId("");
    setSelectedSystemOffice("ALL");
    setQuickFilter("");
    toast.info("Filters reset to default.");
  };

  // Toggle select all
  const handleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map((r) => r.id));
    }
  };

  // Toggle single item
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Single status change
  const handleStatusChange = (id: string, newStatus: "Approved" | "Reject") => {
    const updated = records.map((r) =>
      r.id === id ? { ...r, status: newStatus } : r
    );
    updateRecordsState(updated);
    toast.success(
      `Festival Allowance ${newStatus.toLowerCase()} for ${records.find((r) => r.id === id)?.name}`
    );
  };

  // Bulk status change
  const handleBulkStatusChange = (newStatus: "Approved" | "Reject") => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one employee from the list.");
      return;
    }
    const updated = records.map((r) =>
      selectedIds.includes(r.id) ? { ...r, status: newStatus } : r
    );
    updateRecordsState(updated);
    toast.success(
      `Successfully marked ${selectedIds.length} employee(s) as ${newStatus}.`
    );
    setSelectedIds([]);
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const dataToExport = filteredRecords.map((r) => ({
        "#": r.sl,
        "Emp ID": r.empId,
        Name: r.name,
        Type: r.type,
        Department: r.department,
        Section: r.section,
        Designation: r.designation,
        Basic: r.basic.toFixed(2),
        Gross: r.gross.toFixed(2),
        "Total Day": r.totalDay,
        "Per Day Rate": r.perDayRate.toFixed(6),
        "Payable Amt": r.payableAmt.toFixed(2),
        "OT Hour": r.otHour.toFixed(2),
        Rate: r.rate.toFixed(6),
        "OT Amount": r.otAmount.toFixed(2),
        "Lunch Bill": r.lunchBill.toFixed(2),
        "Net Pay": r.netPay.toFixed(2),
        Status: r.status,
        "Bank Name": r.bankName,
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "FestivalAllowanceCheck");
      XLSX.writeFile(
        wb,
        `Festival_Allowance_Check_HR_${selectedYear}_${selectedMonth}.xlsx`
      );
      toast.success("Excel sheet exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel file.");
    }
  };

  // Print table
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        <Topbar />

        <div className="p-4 sm:p-6 lg:p-8 space-y-5 w-full">
          {/* Header & Breadcrumbs */}
          <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="size-2.5" />
                <span>Manage Allowance</span>
                <ChevronRight className="size-2.5" />
                <span className="text-primary font-black">
                  Fastival allowance Check (HR)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Coins className="size-6 text-primary" />
                <span>Fastival allowance Check (HR)</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Verify, audit, and approve monthly festival allowance disbursements and duty rates.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleExportExcel}
                className="px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Export as Excel file"
              >
                <FileSpreadsheet className="size-4" />
                <span>Excel</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Print Festival Allowance Table"
              >
                <Printer className="size-4 text-muted-foreground" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Download or Print as PDF"
              >
                <FileText className="size-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Filter Bar (Exact Match to Prompt) */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Search &amp; Filter Parameters
                </h2>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>Reset Filters</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5 text-xs">
              {/* Year */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary transition"
                >
                  <option value="ALL">ALL Years</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary transition"
                >
                  <option value="ALL">ALL Months</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary transition"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1 truncate">
                  Bank Name
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary transition"
                >
                  {BANK_OPTIONS.map((bk) => (
                    <option key={bk} value={bk}>
                      {bk}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee Type */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1 truncate">
                  Employee Type
                </label>
                <select
                  value={selectedEmpType}
                  onChange={(e) => setSelectedEmpType(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary transition"
                >
                  {EMPLOYEE_TYPES.map((et) => (
                    <option key={et} value={et}>
                      {et}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Section
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary transition"
                >
                  {SECTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Unit
                </label>
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary transition"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* EmpId */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  EmpId
                </label>
                <input
                  type="text"
                  value={searchEmpId}
                  onChange={(e) => setSearchEmpId(e.target.value)}
                  placeholder="e.g. 2025053380"
                  className="w-full h-9 px-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary transition"
                />
              </div>

              {/* System / Office */}
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  System / Office Source
                </label>
                <div className="flex items-center gap-2 h-9">
                  <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                    <input
                      type="radio"
                      name="systemOffice"
                      checked={selectedSystemOffice === "ALL"}
                      onChange={() => setSelectedSystemOffice("ALL")}
                      className="accent-primary"
                    />
                    <span>All</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer ml-2">
                    <input
                      type="radio"
                      name="systemOffice"
                      checked={selectedSystemOffice === "System"}
                      onChange={() => setSelectedSystemOffice("System")}
                      className="accent-primary"
                    />
                    <span>System</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer ml-2">
                    <input
                      type="radio"
                      name="systemOffice"
                      checked={selectedSystemOffice === "Office"}
                      onChange={() => setSelectedSystemOffice("Office")}
                      className="accent-primary"
                    />
                    <span>Office</span>
                  </label>
                </div>
              </div>

              {/* Search Button */}
              <div className="col-span-1 sm:col-span-2 flex items-end">
                <button
                  type="button"
                  onClick={() => toast.success(`Search completed. Showing ${filteredRecords.length} entries.`)}
                  className="w-full h-9 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  <Search className="size-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table Container & Bulk Actions */}
          <div className="bg-card border border-border/80 rounded-2xl shadow-2xs overflow-hidden space-y-0">
            {/* Table Header Bar */}
            <div className="p-4 border-b border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={quickFilter}
                  onChange={(e) => setQuickFilter(e.target.value)}
                  placeholder="Quick search employee, dept, designation..."
                  className="w-64 sm:w-80 h-8.5 px-3 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary transition"
                />
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-2">
                {selectedIds.length > 0 && (
                  <span className="text-xs font-semibold text-muted-foreground mr-1">
                    {selectedIds.length} selected
                  </span>
                )}
                <button
                  type="button"
                  disabled={selectedIds.length === 0}
                  onClick={() => handleBulkStatusChange("Approved")}
                  className="h-8.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Approve Selected</span>
                </button>
                <button
                  type="button"
                  disabled={selectedIds.length === 0}
                  onClick={() => handleBulkStatusChange("Reject")}
                  className="h-8.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <XCircle className="size-3.5" />
                  <span>Reject Selected</span>
                </button>
              </div>
            </div>

            {/* Main Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/75 border-b border-border text-[11px] font-black uppercase text-foreground/90 tracking-wider select-none">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-foreground hover:text-primary transition cursor-pointer"
                        title={
                          selectedIds.length === filteredRecords.length
                            ? "Deselect All"
                            : "Select All"
                        }
                      >
                        {selectedIds.length === filteredRecords.length &&
                        filteredRecords.length > 0 ? (
                          <CheckSquare className="size-4 text-primary" />
                        ) : (
                          <Square className="size-4 text-muted-foreground" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-2 w-10 text-center">#</th>
                    <th className="py-3 px-3 min-w-[100px]">Emp ID</th>
                    <th className="py-3 px-3 min-w-[160px]">Name</th>
                    <th className="py-3 px-3 min-w-[120px]">Type</th>
                    <th className="py-3 px-3 min-w-[160px]">Department</th>
                    <th className="py-3 px-3 min-w-[130px]">Section</th>
                    <th className="py-3 px-3 min-w-[130px]">Designation</th>
                    <th className="py-3 px-3 text-right min-w-[90px]">Basic</th>
                    <th className="py-3 px-3 text-right min-w-[90px]">Gross</th>
                    <th className="py-3 px-2 text-center min-w-[70px]">Total Day</th>
                    <th className="py-3 px-3 text-right min-w-[110px]">Per Day Rate</th>
                    <th className="py-3 px-3 text-right min-w-[100px]">Payable Amt</th>
                    <th className="py-3 px-2 text-right min-w-[75px]">OT Hour</th>
                    <th className="py-3 px-3 text-right min-w-[95px]">Rate</th>
                    <th className="py-3 px-2 text-right min-w-[80px]">OT Amount</th>
                    <th className="py-3 px-2 text-right min-w-[80px]">Lunch Bill</th>
                    <th className="py-3 px-3 text-right min-w-[100px] text-primary">Net Pay</th>
                    <th className="py-3 px-3 text-center min-w-[90px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={19} className="py-12 text-center text-muted-foreground">
                        <Users className="size-8 mx-auto mb-2 opacity-40" />
                        <p className="font-semibold text-xs">No festival allowance records found</p>
                        <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                          Try adjusting search filters or parameters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((row) => {
                      const isSelected = selectedIds.includes(row.id);
                      return (
                        <tr
                          key={row.id}
                          className={`hover:bg-muted/30 transition-colors ${
                            isSelected ? "bg-primary/5" : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-3 px-3 text-center align-middle">
                            <button
                              type="button"
                              onClick={() => handleToggleSelect(row.id)}
                              className="text-foreground hover:text-primary transition cursor-pointer"
                            >
                              {isSelected ? (
                                <CheckSquare className="size-4 text-primary" />
                              ) : (
                                <Square className="size-4 text-muted-foreground" />
                              )}
                            </button>
                          </td>

                          {/* SL */}
                          <td className="py-3 px-2 text-center font-mono font-bold text-muted-foreground align-middle">
                            {row.sl}
                          </td>

                          {/* Emp ID */}
                          <td className="py-3 px-3 font-mono font-bold text-primary align-middle whitespace-nowrap">
                            {row.empId}
                          </td>

                          {/* Name */}
                          <td className="py-3 px-3 font-bold text-foreground align-middle whitespace-nowrap">
                            {row.name}
                          </td>

                          {/* Type */}
                          <td className="py-3 px-3 align-middle whitespace-nowrap">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                row.type === "Worker"
                                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                                  : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                              }`}
                            >
                              {row.type}
                            </span>
                          </td>

                          {/* Department */}
                          <td className="py-3 px-3 text-muted-foreground align-middle whitespace-nowrap">
                            {row.department}
                          </td>

                          {/* Section */}
                          <td className="py-3 px-3 text-foreground font-medium align-middle whitespace-nowrap">
                            {row.section}
                          </td>

                          {/* Designation */}
                          <td className="py-3 px-3 text-muted-foreground align-middle whitespace-nowrap">
                            {row.designation}
                          </td>

                          {/* Basic */}
                          <td className="py-3 px-3 text-right font-mono font-medium align-middle">
                            {row.basic.toFixed(2)}
                          </td>

                          {/* Gross */}
                          <td className="py-3 px-3 text-right font-mono font-medium text-foreground align-middle">
                            {row.gross.toFixed(2)}
                          </td>

                          {/* Total Day */}
                          <td className="py-3 px-2 text-center font-mono font-bold align-middle">
                            {row.totalDay}
                          </td>

                          {/* Per Day Rate */}
                          <td className="py-3 px-3 text-right font-mono text-muted-foreground align-middle">
                            {row.perDayRate.toFixed(6)}
                          </td>

                          {/* Payable Amt */}
                          <td className="py-3 px-3 text-right font-mono font-bold text-foreground align-middle">
                            {row.payableAmt.toFixed(2)}
                          </td>

                          {/* OT Hour */}
                          <td className="py-3 px-2 text-right font-mono text-muted-foreground align-middle">
                            {row.otHour.toFixed(2)}
                          </td>

                          {/* Rate */}
                          <td className="py-3 px-3 text-right font-mono text-muted-foreground align-middle">
                            {row.rate.toFixed(6)}
                          </td>

                          {/* OT Amount */}
                          <td className="py-3 px-2 text-right font-mono text-muted-foreground align-middle">
                            {row.otAmount.toFixed(2)}
                          </td>

                          {/* Lunch Bill */}
                          <td className="py-3 px-2 text-right font-mono text-muted-foreground align-middle">
                            {row.lunchBill.toFixed(2)}
                          </td>

                          {/* Net Pay */}
                          <td className="py-3 px-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs align-middle">
                            {row.netPay.toFixed(2)}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3 text-center align-middle whitespace-nowrap">
                            {row.status === "Approved" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                <CheckCircle2 className="size-3" />
                                Approved
                              </span>
                            ) : row.status === "Reject" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
                                <XCircle className="size-3" />
                                Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                <Clock className="size-3" />
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

                {/* Table Footer Summary Row */}
                {filteredRecords.length > 0 && (
                  <tfoot className="bg-muted/70 border-t-2 border-border font-bold text-xs text-foreground">
                    <tr>
                      <td colSpan={8} className="py-3 px-4 text-right uppercase tracking-wider text-[11px] font-black">
                        Total Summary:
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        {filteredRecords
                          .reduce((s, r) => s + r.basic, 0)
                          .toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        {filteredRecords
                          .reduce((s, r) => s + r.gross, 0)
                          .toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-center font-mono">
                        {stats.totalDays}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-muted-foreground">
                        —
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-foreground font-bold">
                        {stats.totalPayable.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-muted-foreground">
                        {filteredRecords
                          .reduce((s, r) => s + r.otHour, 0)
                          .toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-muted-foreground">
                        —
                      </td>
                      <td className="py-3 px-2 text-right font-mono">
                        {filteredRecords
                          .reduce((s, r) => s + r.otAmount, 0)
                          .toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right font-mono">
                        {filteredRecords
                          .reduce((s, r) => s + r.lunchBill, 0)
                          .toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                        {stats.totalNetPay.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination / Entries info */}
            <div className="p-3.5 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground bg-muted/15">
              <span>
                Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="px-2.5 py-1 rounded border border-border bg-card text-muted-foreground opacity-50 cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-2.5 py-1 rounded bg-primary text-primary-foreground font-bold text-xs">
                  1
                </span>
                <button
                  type="button"
                  disabled
                  className="px-2.5 py-1 rounded border border-border bg-card text-muted-foreground opacity-50 cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

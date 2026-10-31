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
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  type FestivalPayCheckRow,
  getFestivalAllowanceCheckRecords,
  updateFestivalCheckRecordStatus,
  bulkUpdateFestivalCheckRecordStatus,
} from "@/lib/festivalAllowanceStore";

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

const YEARS = [
  "ALL",
  "2026",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
];

const MONTHS = [
  "ALL",
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
const EMPLOYEE_TYPES = ["ALL", "Office Executive", "Worker", "Staff", "Office Staff", "Management"];

export function FestivalAllowanceCheckHrPage() {
  const [records, setRecords] = useState<FestivalPayCheckRow[]>(() =>
    getFestivalAllowanceCheckRecords()
  );

  const loadData = () => {
    setRecords(getFestivalAllowanceCheckRecords());
  };

  useEffect(() => {
    loadData();
    const handleChanged = () => {
      loadData();
    };
    window.addEventListener("festival_allowances_changed", handleChanged);
    return () => {
      window.removeEventListener("festival_allowances_changed", handleChanged);
    };
  }, []);

  // Filters state
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [selectedBank, setSelectedBank] = useState("ALL");
  const [selectedEmpType, setSelectedEmpType] = useState("ALL");
  const [selectedSection, setSelectedSection] = useState("ALL");
  const [selectedUnit, setSelectedUnit] = useState("ALL");
  const [searchEmpId, setSearchEmpId] = useState("");
  const [selectedSystemOffice, setSelectedSystemOffice] = useState<"ALL" | "System" | "Office">("ALL");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickFilter, setQuickFilter] = useState("");

  // Dynamic filter options based on available records
  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.department) set.add(r.department);
    });
    return ["ALL", ...Array.from(set).sort()];
  }, [records]);

  const sectionOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.section) set.add(r.section);
    });
    return ["ALL", ...Array.from(set).sort()];
  }, [records]);

  const unitOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.unit) set.add(r.unit);
    });
    return ["ALL", ...Array.from(set).sort()];
  }, [records]);

  const bankOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.bankName) set.add(r.bankName);
    });
    return ["ALL", ...Array.from(set).sort()];
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedYear !== "ALL" && r.year !== selectedYear) return false;
      if (selectedMonth !== "ALL" && r.month !== selectedMonth) return false;
      if (selectedStatus !== "ALL" && r.status !== selectedStatus) return false;
      if (selectedDepartment !== "ALL" && r.department !== selectedDepartment) return false;
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
    selectedDepartment,
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
    setSelectedYear("ALL");
    setSelectedMonth("ALL");
    setSelectedStatus("ALL");
    setSelectedDepartment("ALL");
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
    updateFestivalCheckRecordStatus(id, newStatus);
    loadData();
    const item = records.find((r) => r.id === id);
    toast.success(
      `Festival Allowance ${newStatus.toLowerCase()} for ${item?.name || "employee"}`
    );
  };

  // Bulk status change
  const handleBulkStatusChange = (newStatus: "Approved" | "Reject") => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one employee from the list.");
      return;
    }
    const count = bulkUpdateFestivalCheckRecordStatus(selectedIds, newStatus);
    loadData();
    toast.success(
      `Successfully marked ${count} employee(s) as ${newStatus}.`
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
        "Per Day Rate": r.perDayRate.toFixed(2),
        "Payable Amt": r.payableAmt.toFixed(2),
        "OT Hour": r.otHour.toFixed(2),
        Rate: r.rate.toFixed(2),
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
                  Festival Allowance Check (HR)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Coins className="size-6 text-primary" />
                <span>Festival Allowance Check (HR)</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Verify, audit, and approve monthly festival allowance disbursements and duty rates for HR.
              </p>
            </div>

            {/* Quick Actions & Navigation */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to="/festival-allowance"
                className="px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Go to Festival Allowance Entry"
              >
                <Coins className="size-3.5" />
                <span>Allowance Entry</span>
              </Link>
              <Link
                to="/festival-allowance-approval"
                className="px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-500/20 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Go to Approval Hub"
              >
                <CheckCircle2 className="size-3.5" />
                <span>Approval Hub</span>
              </Link>
              <Link
                to="/festival-allowance-payment-sheet"
                className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Go to Payment Sheet"
              >
                <Banknote className="size-3.5" />
                <span>Payment Sheet</span>
              </Link>
              <button
                type="button"
                onClick={handleExportExcel}
                className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Export as Excel file"
              >
                <FileSpreadsheet className="size-3.5" />
                <span>Excel</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                title="Print Festival Allowance Table"
              >
                <Printer className="size-3.5 text-muted-foreground" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5 text-xs">
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
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-xl border border-border bg-background text-foreground text-xs outline-none focus:border-primary transition"
                >
                  {departmentOptions.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
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
                  {sectionOptions.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
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
                  {bankOptions.map((bk) => (
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
                  {unitOptions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* EmpId */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  EmpId Search
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
              <div>
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
                  <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer ml-1">
                    <input
                      type="radio"
                      name="systemOffice"
                      checked={selectedSystemOffice === "System"}
                      onChange={() => setSelectedSystemOffice("System")}
                      className="accent-primary"
                    />
                    <span>System</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer ml-1">
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
            </div>
          </div>

          {/* Aggregate Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                Total Employees
              </span>
              <div className="text-xl font-black text-foreground">
                {stats.totalCount}
              </div>
            </div>
            <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                Total Duty Days
              </span>
              <div className="text-xl font-black text-foreground">
                {stats.totalDays}
              </div>
            </div>
            <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                Total Gross
              </span>
              <div className="text-xl font-black text-foreground font-mono">
                {stats.totalGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                Total Payable
              </span>
              <div className="text-xl font-black text-foreground font-mono">
                {stats.totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block mb-1">
                Total Net Pay
              </span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {stats.totalNetPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                Approval Status
              </span>
              <div className="text-sm font-bold text-foreground flex items-center gap-2 mt-1">
                <span className="text-emerald-600 font-bold">{stats.approvedCount} Appr.</span>
                <span>/</span>
                <span className="text-amber-600 font-bold">{stats.pendingCount} Pend.</span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-card border border-border/80 rounded-2xl shadow-2xs overflow-hidden">
            {/* Table Action Bar */}
            <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  Showing {filteredRecords.length} record(s)
                </span>
                {selectedIds.length > 0 && (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                    {selectedIds.length} selected
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="size-3.5 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={quickFilter}
                    onChange={(e) => setQuickFilter(e.target.value)}
                    placeholder="Quick search table..."
                    className="h-8.5 pl-8 pr-3 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary transition w-48 sm:w-56"
                  />
                </div>

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
                    <th className="py-3 px-3 min-w-[110px]">Type</th>
                    <th className="py-3 px-3 min-w-[150px]">Department</th>
                    <th className="py-3 px-3 min-w-[120px]">Section</th>
                    <th className="py-3 px-3 min-w-[120px]">Designation</th>
                    <th className="py-3 px-3 text-right min-w-[90px]">Basic</th>
                    <th className="py-3 px-3 text-right min-w-[90px]">Gross</th>
                    <th className="py-3 px-2 text-center min-w-[70px]">Total Day</th>
                    <th className="py-3 px-3 text-right min-w-[100px]">Per Day Rate</th>
                    <th className="py-3 px-3 text-right min-w-[100px]">Payable Amt</th>
                    <th className="py-3 px-2 text-right min-w-[75px]">OT Hour</th>
                    <th className="py-3 px-3 text-right min-w-[85px]">Rate</th>
                    <th className="py-3 px-2 text-right min-w-[80px]">OT Amount</th>
                    <th className="py-3 px-2 text-right min-w-[80px]">Lunch Bill</th>
                    <th className="py-3 px-3 text-right min-w-[100px] text-primary">Net Pay</th>
                    <th className="py-3 px-3 text-center min-w-[90px]">Status</th>
                    <th className="py-3 px-3 text-center min-w-[90px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={20} className="py-12 text-center text-muted-foreground">
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
                            {row.perDayRate.toFixed(2)}
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
                            {row.rate.toFixed(2)}
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

                          {/* Action Buttons */}
                          <td className="py-3 px-3 text-center align-middle whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(row.id, "Approved")}
                                disabled={row.status === "Approved"}
                                className="p-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-emerald-600 border border-emerald-500/20 transition cursor-pointer"
                                title="Approve this employee"
                              >
                                <Check className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(row.id, "Reject")}
                                disabled={row.status === "Reject"}
                                className="p-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-rose-600 border border-rose-500/20 transition cursor-pointer"
                                title="Reject this employee"
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
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
                      <td colSpan={2}></td>
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

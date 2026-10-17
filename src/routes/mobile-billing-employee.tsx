import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  ChevronRight,
  Smartphone,
  RotateCcw,
  SlidersHorizontal,
  Building2,
  Calendar,
  Layers,
  Download,
  Filter,
  Users,
  AlertTriangle,
  CheckCircle2,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import { MultiSelect } from "@/components/ui/multi-select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  MobileBillRecord,
  BILLING_YEARS,
  BILLING_MONTHS,
  COMPANIES_LIST,
  LOCATIONS_LIST,
  DEPARTMENTS_LIST,
  loadMobileBillingRecords,
} from "./-mobile-billing-data";

export const Route = createFileRoute("/mobile-billing-employee")({
  head: () => ({
    meta: [
      { title: "Employee Wise Mobile Billing Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "Detailed employee-level mobile billing statement, limits, GP bills and excess payroll deductions.",
      },
    ],
  }),
  component: EmployeeWiseBillingPage,
});

export function EmployeeWiseBillingPage() {
  const [allRecords, setAllRecords] = useState<MobileBillRecord[]>([]);

  // Searchable single-select filters
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<string>("October");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL"); // ALL, WITHIN, EXCEEDED

  // Searchable multi-select filters
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Sorting
  const [sortField, setSortField] = useState<keyof MobileBillRecord>("empId");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Options for searchable selects
  const yearOptions = useMemo(
    () => BILLING_YEARS.map((y) => ({ value: String(y), label: String(y) })),
    []
  );

  const monthOptions = useMemo(
    () => BILLING_MONTHS.map((m) => ({ value: m, label: m })),
    []
  );

  const locationOptions = useMemo(
    () => [
      { value: "ALL", label: "All Locations" },
      ...LOCATIONS_LIST.map((loc) => ({ value: loc, label: loc })),
    ],
    []
  );

  const statusOptions = useMemo(
    () => [
      { value: "ALL", label: "All Statuses" },
      { value: "WITHIN", label: "Within Limit" },
      { value: "EXCEEDED", label: "Limit Exceeded" },
    ],
    []
  );

  const companyOptions = useMemo(
    () => COMPANIES_LIST.map((c) => ({ value: c.code, label: c.code })),
    []
  );

  const departmentOptions = useMemo(
    () => DEPARTMENTS_LIST.map((d) => ({ value: d, label: d })),
    []
  );

  // Load from local storage
  useEffect(() => {
    const loaded = loadMobileBillingRecords();
    setAllRecords(loaded);
  }, []);

  // Format currency helpers
  const fmt = (val: number) => {
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Billing cycle text
  const billingMonthText = useMemo(() => {
    const monthIdx = BILLING_MONTHS.indexOf(selectedMonth);
    const prevMonthIdx = monthIdx === 0 ? 11 : monthIdx - 1;
    const prevYear = monthIdx === 0 ? selectedYear - 1 : selectedYear;
    return `${BILLING_MONTHS[prevMonthIdx]}-${prevYear}`;
  }, [selectedMonth, selectedYear]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return allRecords.filter((r) => {
      // Year & Month filter
      const matchesYear = r.year === selectedYear;
      const matchesMonth =
        r.month === selectedMonth || r.billCycle === `${selectedMonth}-${selectedYear}`;
      if (!matchesYear || !matchesMonth) return false;

      // Company multi-select filter
      if (selectedCompanies.length > 0) {
        const matches = selectedCompanies.some(
          (c) => r.companyCode === c || r.companyCode.includes(c)
        );
        if (!matches) return false;
      }

      // Department multi-select filter
      if (selectedDepartments.length > 0) {
        if (!selectedDepartments.includes(r.department)) {
          return false;
        }
      }

      // Location filter
      if (selectedLocation !== "ALL" && r.location !== selectedLocation) {
        return false;
      }

      // Status filter
      if (statusFilter === "EXCEEDED" && r.actualBill <= r.limit) {
        return false;
      }
      if (statusFilter === "WITHIN" && r.actualBill > r.limit) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          r.empId.toLowerCase().includes(q) ||
          r.empName.toLowerCase().includes(q) ||
          r.simNo.toLowerCase().includes(q) ||
          (r.cardNo && r.cardNo.toLowerCase().includes(q)) ||
          r.department.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [
    allRecords,
    selectedYear,
    selectedMonth,
    selectedCompanies,
    selectedDepartments,
    selectedLocation,
    statusFilter,
    searchQuery,
  ]);

  // Sorted records
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let aVal = a[sortField] ?? "";
      let bVal = b[sortField] ?? "";
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return sortAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredRecords, sortField, sortAsc]);

  // Paginated records
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;

  // Summaries
  const summaries = useMemo(() => {
    let totalLimit = 0;
    let totalBill = 0;
    let totalDeduction = 0;
    let totalPayment = 0;
    let exceededCount = 0;

    filteredRecords.forEach((r) => {
      totalLimit += r.limit;
      totalBill += r.actualBill;
      totalDeduction += r.deduction;
      totalPayment += r.totalPayment;
      if (r.actualBill > r.limit) exceededCount++;
    });

    return {
      count: filteredRecords.length,
      totalLimit,
      totalBill,
      totalDeduction,
      totalPayment,
      exceededCount,
    };
  }, [filteredRecords]);

  const handleSort = (field: keyof MobileBillRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleResetFilters = () => {
    setSelectedYear(2026);
    setSelectedMonth("October");
    setSelectedCompanies([]);
    setSelectedDepartments([]);
    setSelectedLocation("ALL");
    setStatusFilter("ALL");
    setSearchQuery("");
    setCurrentPage(1);
    toast.info("Filters reset to default.");
  };

  const handleExportCSV = () => {
    const headers = [
      "SL",
      "Emp ID",
      "Employee Name",
      "Card No",
      "Company",
      "Location",
      "Department",
      "Designation",
      "Mobile No",
      "Operator",
      "Approved Limit",
      "GP Bill",
      "Excess Deduction",
      "Company Payment",
      "Status",
    ];

    const rows = sortedRecords.map((r, idx) => [
      (idx + 1).toString(),
      r.empId,
      r.empName,
      r.cardNo || "",
      r.companyCode,
      r.location,
      r.department,
      r.designation,
      r.simNo,
      r.operator,
      r.limit.toFixed(2),
      r.actualBill.toFixed(2),
      r.deduction.toFixed(2),
      r.totalPayment.toFixed(2),
      r.actualBill > r.limit ? "Exceeded Limit" : "Normal",
    ]);

    const csvContent = [
      `"PAKIZA KNIT GROUP"`,
      `"Employee Wise Mobile Billing Statement - ${selectedMonth} ${selectedYear}"`,
      `"Billing Month: ${billingMonthText}"`,
      "",
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${(c || "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Employee_Wise_Mobile_Billing_${selectedMonth}_${selectedYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Employee billing exported to CSV!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans print:bg-white print:h-auto print:overflow-visible">
      <div className="print:hidden">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible print:block">
        <div className="print:hidden">
          <Topbar />
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-[1700px] mx-auto w-full print:p-0 print:m-0 print:max-w-none print:overflow-visible">
          {/* Breadcrumb Navigation - hidden on print */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium print:hidden">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="hover:text-primary transition-colors">Mobile Billing</span>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Employee Wise Billing
            </span>
          </div>

          {/* Header Card - hidden on print */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-xl text-purple-600 dark:text-purple-400">
                <Users className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Employee Wise Mobile Billing</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold">
                    Staff Statement
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Detailed individual breakdown of SIM limits, GP bills, and payroll excess recoveries.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="size-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <Printer className="size-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>

          {/* Filter Bar with Searchable Dropdowns & Multi-Select Company/Department */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 print:hidden">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Filter className="size-3.5 text-blue-600" />
                <span>Filters (Searchable & Multi-Select)</span>
                {(selectedCompanies.length > 0 || selectedDepartments.length > 0) && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 font-semibold">
                    {selectedCompanies.length > 0 && `${selectedCompanies.length} companies`}
                    {selectedCompanies.length > 0 && selectedDepartments.length > 0 && ", "}
                    {selectedDepartments.length > 0 && `${selectedDepartments.length} depts`}
                  </span>
                )}
              </div>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>Reset Filters</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3.5 items-end">
              {/* Year */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Year
                </label>
                <SearchableSelect
                  options={yearOptions}
                  value={String(selectedYear)}
                  onChange={(val) => {
                    setSelectedYear(Number(val));
                    setCurrentPage(1);
                  }}
                  placeholder="Year..."
                  className="h-10 text-xs font-semibold"
                />
              </div>

              {/* Month */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Month
                </label>
                <SearchableSelect
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={(val) => {
                    setSelectedMonth(val);
                    setCurrentPage(1);
                  }}
                  placeholder="Month..."
                  className="h-10 text-xs font-semibold"
                />
              </div>

              {/* Company (Multi-Select) */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Company (Multi-Select)
                </label>
                <MultiSelect
                  options={companyOptions}
                  selected={selectedCompanies}
                  onChange={(val) => {
                    setSelectedCompanies(val);
                    setCurrentPage(1);
                  }}
                  placeholder="All Companies..."
                  className="min-h-10 text-xs"
                />
              </div>

              {/* Department (Multi-Select) */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Department (Multi-Select)
                </label>
                <MultiSelect
                  options={departmentOptions}
                  selected={selectedDepartments}
                  onChange={(val) => {
                    setSelectedDepartments(val);
                    setCurrentPage(1);
                  }}
                  placeholder="All Departments..."
                  className="min-h-10 text-xs"
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <SearchableSelect
                  options={locationOptions}
                  value={selectedLocation}
                  onChange={(val) => {
                    setSelectedLocation(val);
                    setCurrentPage(1);
                  }}
                  placeholder="Location..."
                  className="h-10 text-xs"
                />
              </div>

              {/* Status */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Limit Status
                </label>
                <SearchableSelect
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(val) => {
                    setStatusFilter(val);
                    setCurrentPage(1);
                  }}
                  placeholder="Status..."
                  className="h-10 text-xs"
                />
              </div>

              {/* Search */}
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Search Staff
                </label>
                <div className="relative">
                  <Search className="size-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Name, ID, SIM, card no..."
                    className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 h-10 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PRINT & PREVIEW SHEET */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden print:border-none print:shadow-none">
            {/* Header visible on Print */}
            <div className="hidden print:block text-center pb-6 border-b border-slate-300 mb-4 pt-4">
              <h2 className="text-base font-black uppercase text-slate-900">PAKIZA KNIT GROUP</h2>
              <p className="text-xs text-slate-600">House No: 97, Road No: 11/A, Dhanmondi R/A, Dhaka-1209.</p>
              <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                Employee Wise Mobile Bill Statement — {selectedMonth}-{selectedYear}
              </h3>
              <p className="text-xs text-slate-700">Billing Month: {billingMonthText}</p>
            </div>

            {/* Table controls */}
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap bg-slate-50/50 dark:bg-slate-800/30 print:hidden">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Displaying {paginatedRecords.length} of {sortedRecords.length} staff records
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold"
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#d9e1f2] dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-300 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">SL</th>
                    <th
                      onClick={() => handleSort("empId")}
                      className="py-2.5 px-3 cursor-pointer select-none hover:text-blue-700"
                    >
                      <div className="flex items-center gap-1">
                        <span>Emp ID</span>
                        <ArrowUpDown className="size-3 text-slate-500" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("empName")}
                      className="py-2.5 px-3 cursor-pointer select-none hover:text-blue-700"
                    >
                      <div className="flex items-center gap-1">
                        <span>Employee Name</span>
                        <ArrowUpDown className="size-3 text-slate-500" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3">Card No</th>
                    <th className="py-2.5 px-3">Mobile No</th>
                    <th
                      onClick={() => handleSort("companyCode")}
                      className="py-2.5 px-3 cursor-pointer select-none hover:text-blue-700"
                    >
                      <div className="flex items-center gap-1">
                        <span>Company</span>
                        <ArrowUpDown className="size-3 text-slate-500" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3">Location</th>
                    <th
                      onClick={() => handleSort("department")}
                      className="py-2.5 px-3 cursor-pointer select-none hover:text-blue-700"
                    >
                      <div className="flex items-center gap-1">
                        <span>Department</span>
                        <ArrowUpDown className="size-3 text-slate-500" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-right">Limit (৳)</th>
                    <th className="py-2.5 px-3 text-right">GP Bill (৳)</th>
                    <th className="py-2.5 px-3 text-right">Deduction (৳)</th>
                    <th className="py-2.5 px-3 text-right">Payable (৳)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="py-12 text-center text-slate-400">
                        No employee records found matching the active filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((r, idx) => {
                      const isExcess = r.actualBill > r.limit;
                      const globalIdx = (currentPage - 1) * pageSize + idx + 1;

                      return (
                        <tr
                          key={r.id}
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                            isExcess ? "bg-amber-50/30 dark:bg-amber-950/10" : ""
                          }`}
                        >
                          <td className="py-2.5 px-3 font-medium text-slate-500">{globalIdx}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                            {r.empId}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {r.empName}
                            </div>
                            <div className="text-[10px] text-slate-400">{r.designation}</div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                            {r.cardNo || "—"}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-blue-600 dark:text-blue-400">
                            {r.simNo}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                            {r.companyCode}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                            {r.location}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                            {r.department}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold">
                            {fmt(r.limit)}
                          </td>
                          <td
                            className={`py-2.5 px-3 text-right font-mono font-bold ${
                              isExcess ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"
                            }`}
                          >
                            {fmt(r.actualBill)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono">
                            {r.deduction > 0 ? (
                              <span className="text-amber-600 dark:text-amber-400 font-bold">
                                {fmt(r.deduction)}
                              </span>
                            ) : (
                              <span className="text-slate-400">0.00</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {fmt(r.totalPayment)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {isExcess ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                <AlertTriangle className="size-3" />
                                <span>Limit Exceeded</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                <CheckCircle2 className="size-3" />
                                <span>Normal</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

                {/* Subtotals footer */}
                <tfoot className="bg-[#d9e1f2] dark:bg-slate-800 font-black text-slate-900 dark:text-slate-100 border-t-2 border-slate-400">
                  <tr>
                    <td colSpan={8} className="py-2.5 px-3 text-right uppercase tracking-wider">
                      Report Total ({filteredRecords.length} Staff):
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      ৳ {fmt(summaries.totalLimit)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      ৳ {fmt(summaries.totalBill)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-amber-700 dark:text-amber-300">
                      ৳ {fmt(summaries.totalDeduction)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700 dark:text-emerald-300">
                      ৳ {fmt(summaries.totalPayment)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Pagination Controls - hidden on print */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap print:hidden bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-xs text-slate-500">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                  let pNum = idx + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pNum = currentPage - 2 + idx;
                    if (pNum > totalPages) pNum = totalPages - 4 + idx;
                  }
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`size-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pNum
                          ? "bg-blue-600 text-white shadow-xs"
                          : "border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Print Signature Footer */}
            <div className="hidden print:grid grid-cols-4 gap-6 pt-16 mt-12 text-center text-xs text-slate-700">
              <div className="border-t border-slate-400 pt-1 font-semibold">Prepared By</div>
              <div className="border-t border-slate-400 pt-1 font-semibold">Verified By (HR)</div>
              <div className="border-t border-slate-400 pt-1 font-semibold">Accounts Checked</div>
              <div className="border-t border-slate-400 pt-1 font-semibold">Approved By (GM/Director)</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

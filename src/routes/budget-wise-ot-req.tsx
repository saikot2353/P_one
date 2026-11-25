import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Badge } from "@/components/ui/badge";
import {
  Timer,
  ChevronRight,
  Printer,
  Download,
  Filter,
  RefreshCw,
  Building2,
  Calendar,
  Layers,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/budget-wise-ot-req")({
  head: () => ({
    meta: [
      { title: "Budget wise OT Req — CRIPTON HRIS" },
      {
        name: "description",
        content: "Department and section wise overtime budget allocation vs actual OT requested and variance analysis.",
      },
    ],
  }),
  component: BudgetWiseOtReqPage,
});

export interface BudgetWiseOTRecord {
  id: string;
  year: string;
  month: string;
  department: string;
  section: string;
  otBudgetHours: number;
  otBudgetAmount: number;
  otRequestedHours: number;
  otRequestedAmount: number;
  differenceHours: number;
  differenceAmount: number;
  status: "Within Budget" | "Exceeded" | "Balanced";
}

const DEPARTMENTS_DATA: { [dept: string]: string[] } = {
  Sewing: [
    "Sewing Line-01",
    "Sewing Line-02",
    "Sewing Line-03",
    "Sewing Line-04",
    "Sewing Sample Section",
    "Sewing Alteration Unit",
  ],
  Cutting: [
    "Auto Cutting Unit",
    "Manual Cutting Line",
    "Spreading & Bundling",
    "Pattern & Marker",
  ],
  Finishing: [
    "Iron & Pressing Line",
    "Packing & Cartoning",
    "Metal Detection Unit",
    "Poly Packing Section",
  ],
  "Quality Assurance": [
    "Inline QA (Sewing)",
    "Final Audit Inspection",
    "Fabric Testing Lab",
    "Finishing QA",
  ],
  Maintenance: [
    "Mechanical Repair & Workshop",
    "Electrical & Generator Substation",
    "Boiler & Compressor Room",
  ],
  "Material Control (MCD)": [
    "Accessories Store (MCD)",
    "Fabric Godown / Store",
    "General Utility Store",
  ],
  "Human Resources": [
    "HR, Admin and Compliance",
    "Timekeeping & Attendance",
    "Security & Safety Wing",
  ],
  "Accounts & Finance": [
    "Accounts & Commercial",
    "Payroll Verification",
    "Audit & Accounts",
  ],
  "I.C.T.": [
    "Software & Core Development",
    "Network & Hardware Support",
    "Business Automation (HR)",
  ],
  "Industrial Engineering (I.E.)": [
    "Work Study & SMV Analysis",
    "Method Improvement",
    "Line Balancing",
  ],
};

const MONTHS_LIST = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Helper to generate comprehensive initial dataset
function generateInitialRecords(): BudgetWiseOTRecord[] {
  const records: BudgetWiseOTRecord[] = [];
  let recordId = 1;

  const years = ["2026", "2025"];
  const months = ["November", "October", "September", "August", "July", "June"];

  years.forEach((yr) => {
    months.forEach((mo) => {
      Object.entries(DEPARTMENTS_DATA).forEach(([dept, sections]) => {
        sections.forEach((sec, sIdx) => {
          // Baseline hour variations per department
          let baseBudget = 120;
          if (dept === "Sewing") baseBudget = 260 + (sIdx % 3) * 40;
          else if (dept === "Cutting") baseBudget = 160 + (sIdx % 2) * 30;
          else if (dept === "Finishing") baseBudget = 190 + (sIdx % 2) * 35;
          else if (dept === "Quality Assurance") baseBudget = 90 + (sIdx % 2) * 20;
          else if (dept === "Maintenance") baseBudget = 110 + (sIdx % 2) * 25;
          else if (dept === "Material Control (MCD)") baseBudget = 80;
          else baseBudget = 60 + (sIdx % 2) * 15;

          // Rate per hour approx BDT 140 - 180
          const rate = 150;
          const otBudgetHours = baseBudget;
          const otBudgetAmount = otBudgetHours * rate;

          // Simulate actual requested: some within budget, some near, some exceeded
          let varianceFactor = 0.85; // Default within budget
          if ((sIdx + mo.length) % 5 === 0) {
            // Exceeded by 10% to 25%
            varianceFactor = 1.15 + ((sIdx * 3) % 15) / 100;
          } else if ((sIdx + mo.length) % 7 === 0) {
            // Balanced
            varianceFactor = 1.0;
          } else {
            // Within budget by 5% to 25%
            varianceFactor = 0.75 + ((sIdx * 4) % 20) / 100;
          }

          const otRequestedHours = Math.round(otBudgetHours * varianceFactor * 10) / 10;
          const otRequestedAmount = Math.round(otRequestedHours * rate);

          const differenceHours = Math.round((otBudgetHours - otRequestedHours) * 10) / 10;
          const differenceAmount = otBudgetAmount - otRequestedAmount;

          let status: "Within Budget" | "Exceeded" | "Balanced" = "Within Budget";
          if (differenceHours < 0) status = "Exceeded";
          else if (differenceHours === 0) status = "Balanced";

          records.push({
            id: `BW-OT-${String(recordId++).padStart(4, "0")}`,
            year: yr,
            month: mo,
            department: dept,
            section: sec,
            otBudgetHours,
            otBudgetAmount,
            otRequestedHours,
            otRequestedAmount,
            differenceHours,
            differenceAmount,
            status,
          });
        });
      });
    });
  });

  return records;
}

const INITIAL_RECORDS = generateInitialRecords();

function BudgetWiseOtReqPage() {
  const [records] = useState<BudgetWiseOTRecord[]>(INITIAL_RECORDS);

  // Filters State
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedMonth, setSelectedMonth] = useState<string>("November");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedSection, setSelectedSection] = useState<string>("All");

  // Table pagination and sorting
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [sortField, setSortField] = useState<keyof BudgetWiseOTRecord>("department");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Dynamic available sections based on selected department
  const availableSections = useMemo(() => {
    if (selectedDepartment === "All") {
      const allSecs: string[] = [];
      Object.values(DEPARTMENTS_DATA).forEach((secList) => {
        allSecs.push(...secList);
      });
      return Array.from(new Set(allSecs));
    }
    return DEPARTMENTS_DATA[selectedDepartment] || [];
  }, [selectedDepartment]);

  // Reset filters
  const handleResetFilters = () => {
    setSelectedYear("2026");
    setSelectedMonth("November");
    setSelectedDepartment("All");
    setSelectedSection("All");
    setCurrentPage(1);
    toast.info("Filters reset to default.");
  };

  // Filtered & Sorted Records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      if (selectedYear !== "All" && rec.year !== selectedYear) return false;
      if (selectedMonth !== "All" && rec.month !== selectedMonth) return false;
      if (selectedDepartment !== "All" && rec.department !== selectedDepartment) return false;
      if (selectedSection !== "All" && rec.section !== selectedSection) return false;
      return true;
    });
  }, [records, selectedYear, selectedMonth, selectedDepartment, selectedSection]);

  // Sorting
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredRecords, sortField, sortOrder]);

  // Pagination Slice
  const totalItems = sortedRecords.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  // Totals calculations for the filtered set
  const summaryTotals = useMemo(() => {
    let totalBudgetHours = 0;
    let totalBudgetAmount = 0;
    let totalRequestedHours = 0;
    let totalRequestedAmount = 0;
    let exceededCount = 0;
    let withinCount = 0;

    filteredRecords.forEach((r) => {
      totalBudgetHours += r.otBudgetHours;
      totalBudgetAmount += r.otBudgetAmount;
      totalRequestedHours += r.otRequestedHours;
      totalRequestedAmount += r.otRequestedAmount;
      if (r.status === "Exceeded") exceededCount++;
      else withinCount++;
    });

    const netDifferenceHours = Math.round((totalBudgetHours - totalRequestedHours) * 10) / 10;
    const netDifferenceAmount = totalBudgetAmount - totalRequestedAmount;

    return {
      totalBudgetHours: Math.round(totalBudgetHours * 10) / 10,
      totalBudgetAmount,
      totalRequestedHours: Math.round(totalRequestedHours * 10) / 10,
      totalRequestedAmount,
      netDifferenceHours,
      netDifferenceAmount,
      exceededCount,
      withinCount,
    };
  }, [filteredRecords]);

  // Sort toggle handler
  const handleSort = (field: keyof BudgetWiseOTRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "SL",
      "Year",
      "Month",
      "Department",
      "Section",
      "OT Budget (Amount BDT)",
      "OT Requested (Amount BDT)",
      "Difference (Amount BDT)",
      "Status",
    ];

    const rows = filteredRecords.map((r, i) => [
      i + 1,
      r.year,
      r.month,
      `"${r.department}"`,
      `"${r.section}"`,
      r.otBudgetAmount,
      r.otRequestedAmount,
      r.differenceAmount,
      r.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `budget_wise_ot_req_${selectedYear}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Budget wise OT Requisition data exported successfully.");
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full">
          {/* Breadcrumb & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <ChevronRight className="size-3.5" />
                <span className="text-slate-600 dark:text-slate-300">Manage Overtime</span>
                <ChevronRight className="size-3.5" />
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  Budget wise OT Req
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 rounded-xl">
                  <Timer className="size-5" />
                </span>
                Budget wise OT Req
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Department and section-wise Overtime Budget allocation vs actual Overtime Requested &amp; variance tracking.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="size-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
              >
                <Printer className="size-3.5 text-slate-500" />
                <span>Print Report</span>
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm cursor-pointer"
              >
                <RefreshCw className="size-3.5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* FILTER SECTION */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                <SlidersHorizontal className="size-4 text-blue-600 dark:text-blue-400" />
                <span>Filter Criteria</span>
              </div>
              {(selectedYear !== "All" ||
                selectedMonth !== "All" ||
                selectedDepartment !== "All" ||
                selectedSection !== "All") && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
                >
                  <X className="size-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Year Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="All">All Years</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>

              {/* Month Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="All">All Months</option>
                  {MONTHS_LIST.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setSelectedSection("All");
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  {Object.keys(DEPARTMENTS_DATA).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Section
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => {
                    setSelectedSection(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="All">All Sections</option>
                  {availableSections.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Budget vs Requisition Comparison</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-mono">
                  {totalItems} entries
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span>Show</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>rows</span>
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 select-none">
                    <th className="py-3 px-4 w-12 text-center">SL</th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleSort("year")}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Year</span>
                        <ArrowUpDown className="size-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleSort("month")}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Month</span>
                        <ArrowUpDown className="size-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleSort("department")}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Department</span>
                        <ArrowUpDown className="size-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleSort("section")}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Section</span>
                        <ArrowUpDown className="size-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleSort("otBudgetAmount")}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>OT Budget</span>
                        <ArrowUpDown className="size-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleSort("otRequestedAmount")}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>OT Requested</span>
                        <ArrowUpDown className="size-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-right cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleSort("differenceAmount")}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Difference</span>
                        <ArrowUpDown className="size-3 text-slate-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Filter className="size-8 text-slate-300 dark:text-slate-600" />
                          <p className="font-semibold text-slate-600 dark:text-slate-300 text-sm">
                            No records found
                          </p>
                          <p className="text-xs text-slate-400">
                            Try adjusting your filters or search keywords.
                          </p>
                          <button
                            type="button"
                            onClick={handleResetFilters}
                            className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                          >
                            Reset all filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((item, idx) => {
                      const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                      const isExceeded = item.status === "Exceeded";
                      const isWithin = item.status === "Within Budget";

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          {/* SL */}
                          <td className="py-3 px-4 text-center font-mono text-slate-400 dark:text-slate-500">
                            {rowNumber}
                          </td>

                          {/* Year */}
                          <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                            {item.year}
                          </td>

                          {/* Month */}
                          <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold">
                              <Calendar className="size-3 text-slate-500" />
                              {item.month}
                            </span>
                          </td>

                          {/* Department */}
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {item.department}
                            </span>
                          </td>

                          {/* Section */}
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {item.section}
                            </span>
                          </td>

                          {/* OT Budget Amount */}
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                            ৳{item.otBudgetAmount.toLocaleString()}
                          </td>

                          {/* OT Requested Amount */}
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                            ৳{item.otRequestedAmount.toLocaleString()}
                          </td>

                          {/* Difference Amount */}
                          <td className="py-3 px-4 text-right">
                            <Badge
                              variant={
                                isExceeded
                                  ? "destructive"
                                  : isWithin
                                    ? "default"
                                    : "secondary"
                              }
                              className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md ${
                                isWithin
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                  : isExceeded
                                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              }`}
                            >
                              {isWithin ? (
                                <span>+৳{item.differenceAmount.toLocaleString()}</span>
                              ) : isExceeded ? (
                                <span>-৳{Math.abs(item.differenceAmount).toLocaleString()}</span>
                              ) : (
                                <span>৳0</span>
                              )}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

                {/* Table Footer Summary Row */}
                {paginatedRecords.length > 0 && (
                  <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100">
                    <tr>
                      <td colSpan={5} className="py-3.5 px-4 text-right uppercase tracking-wider text-[11px]">
                        Total Filtered Summary ({totalItems} Sections):
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ৳{summaryTotals.totalBudgetAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ৳{summaryTotals.totalRequestedAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold">
                        <span
                          className={
                            summaryTotals.netDifferenceAmount >= 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }
                        >
                          {summaryTotals.netDifferenceAmount >= 0 ? "+" : ""}৳
                          {summaryTotals.netDifferenceAmount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div>
                  Showing{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {Math.min(currentPage * pageSize, totalItems)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {totalItems}
                  </span>{" "}
                  sections
                </div>

                <div className="flex items-center gap-1.5 self-center">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                      let pageNum = i + 1;
                      if (totalPages > 5 && currentPage > 3) {
                        pageNum = currentPage - 2 + i;
                        if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                      }

                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`size-7 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white shadow-2xs"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <ChevronRightIcon className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

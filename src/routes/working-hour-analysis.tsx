import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  ChevronRight,
  Clock,
  RefreshCw,
  SlidersHorizontal,
  Eye,
  BarChart2,
  Calendar,
  AlertTriangle,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/working-hour-analysis")({
  head: () => ({
    meta: [
      { title: "Working Hour Analysis — CRIPTON HRIS" },
      {
        name: "description",
        content: "Detailed employee weekly and daily highest working hour analysis report including overtime.",
      },
    ],
  }),
  component: WorkingHourAnalysisPage,
});

export interface WorkingHourRecord {
  sl: number;
  name: string;
  workId: string;
  empTypeName: string;
  department: string;
  section: string;
  designation: string;
  unit: string;
  shift: string;
  line: string;
  week01: number;
  dailyHighest01: number;
  week02: number;
  dailyHighest02: number;
  week03: number;
  dailyHighest03: number;
  week04: number;
  dailyHighest04: number;
  week05: number;
  dailyHighest05: number;
  avg: number;
  weeklyHighestIncOT: number;
  year: string;
  month: string;
}

const INITIAL_WORKING_HOURS: WorkingHourRecord[] = [
  {
    sl: 1,
    name: "Md. Sazzad Hasan",
    workId: "2022033502",
    empTypeName: "Office Staff",
    department: "Knitting",
    section: "Knitting Production",
    designation: "Asst. Supervisor",
    unit: "N/A",
    shift: "General Shift",
    line: "N/A",
    week01: 24.0,
    dailyHighest01: 8.0,
    week02: 48.0,
    dailyHighest02: 8.0,
    week03: 48.0,
    dailyHighest03: 8.0,
    week04: 48.0,
    dailyHighest04: 8.0,
    week05: 32.0,
    dailyHighest05: 8.0,
    avg: 40.0,
    weeklyHighestIncOT: 48.0,
    year: "2026",
    month: "Sep",
  },
  {
    sl: 2,
    name: "Md. Shaduad Jaman",
    workId: "2022034516",
    empTypeName: "Office Staff",
    department: "Knitting",
    section: "Knitting Production",
    designation: "Asst. Supervisor",
    unit: "N/A",
    shift: "General Shift",
    line: "N/A",
    week01: 24.0,
    dailyHighest01: 8.0,
    week02: 48.0,
    dailyHighest02: 8.0,
    week03: 48.0,
    dailyHighest03: 8.0,
    week04: 48.0,
    dailyHighest04: 8.0,
    week05: 32.0,
    dailyHighest05: 8.0,
    avg: 40.0,
    weeklyHighestIncOT: 48.0,
    year: "2026",
    month: "Sep",
  },
  {
    sl: 3,
    name: "Md. Foysal Raihan",
    workId: "2022035518",
    empTypeName: "Production Executive",
    department: "Knitting",
    section: "Knitting Production",
    designation: "Production Officer",
    unit: "N/A",
    shift: "General Shift",
    line: "N/A",
    week01: 24.0,
    dailyHighest01: 8.0,
    week02: 48.0,
    dailyHighest02: 8.0,
    week03: 48.0,
    dailyHighest03: 8.0,
    week04: 48.0,
    dailyHighest04: 8.0,
    week05: 32.0,
    dailyHighest05: 8.0,
    avg: 40.0,
    weeklyHighestIncOT: 48.0,
    year: "2026",
    month: "Sep",
  },
  {
    sl: 4,
    name: "Md. Rubel Mia",
    workId: "2022036232",
    empTypeName: "Worker",
    department: "Knitting",
    section: "Knitting Production",
    designation: "Operator (Knitting)",
    unit: "N/A",
    shift: "Day",
    line: "N/A",
    week01: 39.0,
    dailyHighest01: 11.0,
    week02: 80.0,
    dailyHighest02: 17.0,
    week03: 65.0,
    dailyHighest03: 13.0,
    week04: 78.0,
    dailyHighest04: 16.0,
    week05: 45.0,
    dailyHighest05: 12.0,
    avg: 61.4,
    weeklyHighestIncOT: 80.0,
    year: "2026",
    month: "Sep",
  },
  {
    sl: 5,
    name: "Md. Mahfuz Khan",
    workId: "2022038146",
    empTypeName: "Worker",
    department: "Knitting",
    section: "Knitting Production",
    designation: "Operator (Knitting)",
    unit: "N/A",
    shift: "Day",
    line: "N/A",
    week01: 44.0,
    dailyHighest01: 11.0,
    week02: 71.0,
    dailyHighest02: 11.0,
    week03: 62.0,
    dailyHighest03: 11.0,
    week04: 70.0,
    dailyHighest04: 11.0,
    week05: 40.0,
    dailyHighest05: 10.0,
    avg: 57.4,
    weeklyHighestIncOT: 71.0,
    year: "2026",
    month: "Sep",
  },
  {
    sl: 6,
    name: "Md. Sazzad Hossain",
    workId: "2022040139",
    empTypeName: "Production Executive",
    department: "Knitting",
    section: "Knitting Production",
    designation: "Production Officer",
    unit: "N/A",
    shift: "General Shift",
    line: "N/A",
    week01: 24.0,
    dailyHighest01: 8.0,
    week02: 48.0,
    dailyHighest02: 8.0,
    week03: 48.0,
    dailyHighest03: 8.0,
    week04: 48.0,
    dailyHighest04: 8.0,
    week05: 32.0,
    dailyHighest05: 8.0,
    avg: 40.0,
    weeklyHighestIncOT: 48.0,
    year: "2026",
    month: "Sep",
  },
  {
    sl: 7,
    name: "Md. Alal Mia",
    workId: "2022040665",
    empTypeName: "Worker",
    department: "Knitting",
    section: "Knitting Production",
    designation: "Operator (Knitting)",
    unit: "N/A",
    shift: "Day",
    line: "N/A",
    week01: 47.0,
    dailyHighest01: 17.0,
    week02: 72.0,
    dailyHighest02: 11.0,
    week03: 68.0,
    dailyHighest03: 12.0,
    week04: 75.0,
    dailyHighest04: 14.0,
    week05: 50.0,
    dailyHighest05: 12.0,
    avg: 62.4,
    weeklyHighestIncOT: 75.0,
    year: "2026",
    month: "Sep",
  },
  {
    sl: 8,
    name: "Shuvo Ranjan Das",
    workId: "2023042415",
    empTypeName: "Worker",
    department: "Knitting",
    section: "Knitting Production",
    designation: "Operator (Knitting)",
    unit: "N/A",
    shift: "General Shift",
    line: "N/A",
    week01: 28.0,
    dailyHighest01: 17.0,
    week02: 72.0,
    dailyHighest02: 11.0,
    week03: 65.0,
    dailyHighest03: 12.0,
    week04: 69.0,
    dailyHighest04: 13.0,
    week05: 42.0,
    dailyHighest05: 10.0,
    avg: 55.2,
    weeklyHighestIncOT: 72.0,
    year: "2026",
    month: "Sep",
  },
  {
    sl: 9,
    name: "Md. Zakaria Akash",
    workId: "2023042616",
    empTypeName: "Worker",
    department: "Knitting",
    section: "Knitting Production",
    designation: "Helper",
    unit: "N/A",
    shift: "Day",
    line: "N/A",
    week01: 0.0,
    dailyHighest01: 0.0,
    week02: 83.0,
    dailyHighest02: 17.0,
    week03: 71.0,
    dailyHighest03: 15.0,
    week04: 79.0,
    dailyHighest04: 16.0,
    week05: 52.0,
    dailyHighest05: 14.0,
    avg: 57.0,
    weeklyHighestIncOT: 83.0,
    year: "2026",
    month: "Sep",
  },
  {
    sl: 10,
    name: "Md. Mehedi Hasan",
    workId: "2023044152",
    empTypeName: "Worker",
    department: "Knitting",
    section: "Knitting Production",
    designation: "Helper",
    unit: "N/A",
    shift: "Day",
    line: "N/A",
    week01: 38.0,
    dailyHighest01: 12.0,
    week02: 90.0,
    dailyHighest02: 18.0,
    week03: 70.0,
    dailyHighest03: 14.0,
    week04: 82.0,
    dailyHighest04: 17.0,
    week05: 60.0,
    dailyHighest05: 15.0,
    avg: 68.0,
    weeklyHighestIncOT: 90.0,
    year: "2026",
    month: "Sep",
  },
  {
    sl: 11,
    name: "Tania Khatun",
    workId: "2025057364",
    empTypeName: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator (Sewing)",
    unit: "Unit-01",
    shift: "General Shift",
    line: "Line-02",
    week01: 32.0,
    dailyHighest01: 9.0,
    week02: 56.0,
    dailyHighest02: 10.0,
    week03: 54.0,
    dailyHighest03: 9.5,
    week04: 58.0,
    dailyHighest04: 10.0,
    week05: 38.0,
    dailyHighest05: 9.0,
    avg: 47.6,
    weeklyHighestIncOT: 58.0,
    year: "2026",
    month: "Sep",
  },
  {
    sl: 12,
    name: "Most. Jharna Begom",
    workId: "2025057367",
    empTypeName: "Worker",
    department: "RMG Operations",
    section: "Sewing",
    designation: "Jr. Operator (Sewing)",
    unit: "Unit-01",
    shift: "General Shift",
    line: "Line-03",
    week01: 30.0,
    dailyHighest01: 8.5,
    week02: 52.0,
    dailyHighest02: 9.0,
    week03: 50.0,
    dailyHighest03: 9.0,
    week04: 55.0,
    dailyHighest04: 10.0,
    week05: 35.0,
    dailyHighest05: 8.5,
    avg: 44.4,
    weeklyHighestIncOT: 55.0,
    year: "2026",
    month: "Sep",
  },
];

function WorkingHourAnalysisPage() {
  // Filter States matching the reference image
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Sep");
  const [option, setOption] = useState("FULL");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [department, setDepartment] = useState("Knitting");
  const [section, setSection] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [shift, setShift] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [employeeId, setEmployeeId] = useState("");

  // Applied Filter Trigger State
  const [appliedFilters, setAppliedFilters] = useState({
    year: "2026",
    month: "Sep",
    option: "FULL",
    employeeType: "ALL",
    department: "Knitting",
    section: "ALL",
    designation: "ALL",
    unit: "ALL",
    shift: "ALL",
    line: "ALL",
    employeeId: "",
  });

  const [tableSearch, setTableSearch] = useState("");
  const [sortField, setSortField] = useState<keyof WorkingHourRecord>("sl");
  const [sortAsc, setSortAsc] = useState(true);
  const [isReportPdfModalOpen, setIsReportPdfModalOpen] = useState(false);

  // Trigger search
  const handleSearch = () => {
    setAppliedFilters({
      year,
      month,
      option,
      employeeType,
      department,
      section,
      designation,
      unit,
      shift,
      line,
      employeeId,
    });
    toast.success("Filtering Working Hour Analysis report...");
  };

  // Reset filters
  const handleReset = () => {
    setYear("2026");
    setMonth("Sep");
    setOption("FULL");
    setEmployeeType("ALL");
    setDepartment("ALL");
    setSection("ALL");
    setDesignation("ALL");
    setUnit("ALL");
    setShift("ALL");
    setLine("ALL");
    setEmployeeId("");
    setTableSearch("");
    setAppliedFilters({
      year: "2026",
      month: "Sep",
      option: "FULL",
      employeeType: "ALL",
      department: "ALL",
      section: "ALL",
      designation: "ALL",
      unit: "ALL",
      shift: "ALL",
      line: "ALL",
      employeeId: "",
    });
    toast.info("Filter criteria reset to default.");
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return INITIAL_WORKING_HOURS.filter((item) => {
      if (appliedFilters.year !== "ALL" && item.year !== appliedFilters.year) return false;
      if (appliedFilters.month !== "ALL" && item.month !== appliedFilters.month) return false;

      // Option filter (e.g. Above 60 Hours limit analysis)
      if (appliedFilters.option === "Above 60 Hours" && item.weeklyHighestIncOT < 60) {
        return false;
      }

      // Employee Type
      if (
        appliedFilters.employeeType !== "ALL" &&
        item.empTypeName.toLowerCase() !== appliedFilters.employeeType.toLowerCase()
      ) {
        return false;
      }

      // Department
      if (appliedFilters.department !== "ALL" && item.department !== appliedFilters.department) {
        return false;
      }

      // Section
      if (appliedFilters.section !== "ALL" && item.section !== appliedFilters.section) {
        return false;
      }

      // Designation
      if (
        appliedFilters.designation !== "ALL" &&
        item.designation !== appliedFilters.designation
      ) {
        return false;
      }

      // Unit
      if (appliedFilters.unit !== "ALL" && item.unit !== appliedFilters.unit) {
        return false;
      }

      // Shift
      if (appliedFilters.shift !== "ALL" && item.shift !== appliedFilters.shift) {
        return false;
      }

      // Line
      if (appliedFilters.line !== "ALL" && item.line !== appliedFilters.line) {
        return false;
      }

      // Employee Id (supports comma separated IDs as noted in placeholder)
      if (appliedFilters.employeeId.trim()) {
        const ids = appliedFilters.employeeId
          .split(",")
          .map((id) => id.trim().toLowerCase())
          .filter(Boolean);
        if (ids.length > 0 && !ids.some((id) => item.workId.toLowerCase().includes(id))) {
          return false;
        }
      }

      // Instant Table search
      if (tableSearch.trim()) {
        const query = tableSearch.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(query) ||
          item.workId.toLowerCase().includes(query) ||
          item.empTypeName.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.section.toLowerCase().includes(query) ||
          item.designation.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [appliedFilters, tableSearch]);

  // Sorting
  const sortedData = useMemo(() => {
    const list = [...filteredData];
    list.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
    return list;
  }, [filteredData, sortField, sortAsc]);

  const handleSort = (field: keyof WorkingHourRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // CSV Export
  const handleExportExcel = () => {
    const headers = [
      "SL",
      "Name",
      "Work ID No",
      "Employee Type Name",
      "Department",
      "Section",
      "Designation",
      "Unit",
      "Shift",
      "Line",
      "Week 01",
      "Daily Highest Week in 01",
      "Week 02",
      "Daily Highest Week in 02",
      "Week 03",
      "Daily Highest Week in 03",
      "Week 04",
      "Daily Highest Week in 04",
      "Week 05",
      "Daily Highest Week in 05",
      "AVG",
      "Weekly Highest Working Hours Including OT",
    ];

    const rows = sortedData.map((r, i) => [
      (i + 1).toString(),
      r.name,
      r.workId,
      r.empTypeName,
      r.department,
      r.section,
      r.designation,
      r.unit,
      r.shift,
      r.line,
      r.week01.toFixed(2),
      r.dailyHighest01.toFixed(2),
      r.week02.toFixed(2),
      r.dailyHighest02.toFixed(2),
      r.week03.toFixed(2),
      r.dailyHighest03.toFixed(2),
      r.week04.toFixed(2),
      r.dailyHighest04.toFixed(2),
      r.week05.toFixed(2),
      r.dailyHighest05.toFixed(2),
      r.avg.toFixed(2),
      r.weeklyHighestIncOT.toFixed(2),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Working_Hour_Analysis_${appliedFilters.year}_${appliedFilters.month}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel report exported successfully!");
  };

  const handlePrint = () => {
    toast.info("Opening browser print dialog...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // PDF Columns Definition
  const pdfColumns: ColumnDef<WorkingHourRecord>[] = [
    { header: "SL", accessor: (_, idx) => idx + 1, align: "center", width: "35px" },
    { header: "Name", accessor: (r) => r.name, width: "120px" },
    { header: "Work ID No", accessor: (r) => r.workId, align: "center", width: "85px" },
    { header: "Type", accessor: (r) => r.empTypeName, width: "80px" },
    { header: "Department", accessor: (r) => r.department, width: "80px" },
    { header: "Designation", accessor: (r) => r.designation, width: "100px" },
    { header: "Shift", accessor: (r) => r.shift, align: "center", width: "70px" },
    { header: "W01", accessor: (r) => r.week01.toFixed(1), align: "right" },
    { header: "Max01", accessor: (r) => r.dailyHighest01.toFixed(1), align: "right" },
    { header: "W02", accessor: (r) => r.week02.toFixed(1), align: "right" },
    { header: "Max02", accessor: (r) => r.dailyHighest02.toFixed(1), align: "right" },
    { header: "W03", accessor: (r) => r.week03.toFixed(1), align: "right" },
    { header: "Max03", accessor: (r) => r.dailyHighest03.toFixed(1), align: "right" },
    { header: "W04", accessor: (r) => r.week04.toFixed(1), align: "right" },
    { header: "Max04", accessor: (r) => r.dailyHighest04.toFixed(1), align: "right" },
    { header: "W05", accessor: (r) => r.week05.toFixed(1), align: "right" },
    { header: "Max05", accessor: (r) => r.dailyHighest05.toFixed(1), align: "right" },
    { header: "AVG", accessor: (r) => r.avg.toFixed(1), align: "right" },
    { header: "Max Inc OT", accessor: (r) => r.weeklyHighestIncOT.toFixed(1), align: "right" },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-[1700px] mx-auto w-full print:p-0">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium print:hidden">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <Link to="/hr-reports" className="hover:text-primary transition-colors">
              HR Reports
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Working Hour Analysis
            </span>
          </div>

          {/* Page Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <BarChart2 className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Working Hour Analysis Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Monitor weekly working hour trends, daily maximum spikes, and overtime limits compliance.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className="size-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          {/* SEARCH & FILTER CRITERIA PANEL (MATCHING REFERENCE IMAGE) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 print:hidden">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SlidersHorizontal className="size-4" />
              <span>Search & Filter Criteria</span>
            </div>

            {/* Form Fields: Structured 3 Rows exactly as shown in user image */}
            <div className="space-y-4 text-xs">
              {/* Row 1: Year, Month, Option, Employee Type, Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Year */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>

                {/* 2. Month */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Month
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Sep">Sep</option>
                    <option value="Oct">Oct</option>
                    <option value="Nov">Nov</option>
                    <option value="Dec">Dec</option>
                    <option value="Jan">Jan</option>
                    <option value="Feb">Feb</option>
                    <option value="Mar">Mar</option>
                    <option value="Apr">Apr</option>
                    <option value="May">May</option>
                    <option value="Jun">Jun</option>
                    <option value="Jul">Jul</option>
                    <option value="Aug">Aug</option>
                  </select>
                </div>

                {/* 3. Option */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Option
                  </label>
                  <select
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="FULL">FULL</option>
                    <option value="Above 60 Hours">Above 60 Hours</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                {/* 4. Employee Type */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Employee Type
                  </label>
                  <select
                    value={employeeType}
                    onChange={(e) => setEmployeeType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="Worker">Worker</option>
                    <option value="Office Staff">Office Staff</option>
                    <option value="Production Executive">Production Executive</option>
                  </select>
                </div>

                {/* 5. Department */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Knitting">Knitting</option>
                    <option value="RMG Operations">RMG Operations</option>
                    <option value="Finishing">Finishing</option>
                    <option value="Sewing">Sewing</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                    <option value="ALL">ALL</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Section, Designation, Unit, Shift, Line */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 6. Section */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="Knitting Production">Knitting Production</option>
                    <option value="Sewing">Sewing</option>
                    <option value="Finishing">Finishing</option>
                  </select>
                </div>

                {/* 7. Designation */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Designation
                  </label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="Asst. Supervisor">Asst. Supervisor</option>
                    <option value="Production Officer">Production Officer</option>
                    <option value="Operator (Knitting)">Operator (Knitting)</option>
                    <option value="Helper">Helper</option>
                    <option value="Jr. Operator (Sewing)">Jr. Operator (Sewing)</option>
                  </select>
                </div>

                {/* 8. Unit */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="N/A">N/A</option>
                    <option value="Unit-01">Unit-01</option>
                    <option value="Unit-02">Unit-02</option>
                    <option value="Unit-03">Unit-03</option>
                  </select>
                </div>

                {/* 9. Shift */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Shift
                  </label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="General Shift">General Shift</option>
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                  </select>
                </div>

                {/* 10. Line */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Line
                  </label>
                  <select
                    value={line}
                    onChange={(e) => setLine(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="N/A">N/A</option>
                    <option value="Line-01">Line-01</option>
                    <option value="Line-02">Line-02</option>
                    <option value="Line-03">Line-03</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Employee Id, SEARCH button */}
              <div className="flex flex-col sm:flex-row items-end gap-3 max-w-lg">
                <div className="space-y-1 flex-1 w-full">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Employee Id
                  </label>
                  <input
                    type="text"
                    placeholder="use comma as separator..."
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400 placeholder:text-xs"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95 uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Search className="size-4" />
                  <span>SEARCH</span>
                </button>
              </div>
            </div>
          </div>

          {/* ACTION TOOLBAR & RESULTS TABLE CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Toolbar Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              {/* Quick Export Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <FileSpreadsheet className="size-4" />
                  <span>EXCEL</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <Printer className="size-4" />
                  <span>PRINT</span>
                </button>

                <button
                  onClick={() => setIsReportPdfModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-800/80 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <FileText className="size-4" />
                  <span>PDF</span>
                </button>
              </div>

              {/* Instant Search Box */}
              <div className="flex items-center gap-2 w-full sm:w-72">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Search:
                </span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search in table..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* High-Fidelity Data Table: 22 Exact Columns */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-[11px] text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                    <th
                      onClick={() => handleSort("sl")}
                      className="p-2.5 w-10 text-center cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      SL
                    </th>
                    <th
                      onClick={() => handleSort("name")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Name
                    </th>
                    <th
                      onClick={() => handleSort("workId")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Work ID No
                    </th>
                    <th
                      onClick={() => handleSort("empTypeName")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Employee Type Name
                    </th>
                    <th
                      onClick={() => handleSort("department")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Department
                    </th>
                    <th
                      onClick={() => handleSort("section")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Section
                    </th>
                    <th
                      onClick={() => handleSort("designation")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Designation
                    </th>
                    <th
                      onClick={() => handleSort("unit")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Unit
                    </th>
                    <th
                      onClick={() => handleSort("shift")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Shift
                    </th>
                    <th
                      onClick={() => handleSort("line")}
                      className="p-2.5 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Line
                    </th>
                    <th
                      onClick={() => handleSort("week01")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Week 01
                    </th>
                    <th
                      onClick={() => handleSort("dailyHighest01")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Daily Highest Week in 01
                    </th>
                    <th
                      onClick={() => handleSort("week02")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Week 02
                    </th>
                    <th
                      onClick={() => handleSort("dailyHighest02")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Daily Highest Week in 02
                    </th>
                    <th
                      onClick={() => handleSort("week03")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Week 03
                    </th>
                    <th
                      onClick={() => handleSort("dailyHighest03")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Daily Highest Week in 03
                    </th>
                    <th
                      onClick={() => handleSort("week04")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Week 04
                    </th>
                    <th
                      onClick={() => handleSort("dailyHighest04")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Daily Highest Week in 04
                    </th>
                    <th
                      onClick={() => handleSort("week05")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Week 05
                    </th>
                    <th
                      onClick={() => handleSort("dailyHighest05")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Daily Highest Week in 05
                    </th>
                    <th
                      onClick={() => handleSort("avg")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      AVG
                    </th>
                    <th
                      onClick={() => handleSort("weeklyHighestIncOT")}
                      className="p-2.5 text-right cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition"
                    >
                      Weekly Highest Working Hours Including OT
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {sortedData.length > 0 ? (
                    sortedData.map((row, idx) => (
                      <tr
                        key={row.workId + "-" + idx}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* SL */}
                        <td className="p-2.5 text-center font-bold text-slate-500">
                          {idx + 1}
                        </td>

                        {/* Name */}
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                          {row.name}
                        </td>

                        {/* Work ID No */}
                        <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.workId}
                        </td>

                        {/* Employee Type Name */}
                        <td className="p-2.5 text-slate-700 dark:text-slate-300 font-semibold">
                          {row.empTypeName}
                        </td>

                        {/* Department */}
                        <td className="p-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                          {row.department}
                        </td>

                        {/* Section */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.section}
                        </td>

                        {/* Designation */}
                        <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">
                          {row.designation}
                        </td>

                        {/* Unit */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.unit}
                        </td>

                        {/* Shift */}
                        <td className="p-2.5 text-slate-700 dark:text-slate-300 font-semibold">
                          {row.shift}
                        </td>

                        {/* Line */}
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">
                          {row.line}
                        </td>

                        {/* Week 01 */}
                        <td className="p-2.5 text-right font-mono text-slate-800 dark:text-slate-200">
                          {row.week01.toFixed(2)}
                        </td>

                        {/* Daily Highest Week in 01 */}
                        <td className="p-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {row.dailyHighest01.toFixed(2)}
                        </td>

                        {/* Week 02 */}
                        <td
                          className={`p-2.5 text-right font-mono font-bold ${
                            row.week02 > 60
                              ? "text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {row.week02.toFixed(2)}
                        </td>

                        {/* Daily Highest Week in 02 */}
                        <td className="p-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {row.dailyHighest02.toFixed(2)}
                        </td>

                        {/* Week 03 */}
                        <td
                          className={`p-2.5 text-right font-mono font-bold ${
                            row.week03 > 60
                              ? "text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {row.week03.toFixed(2)}
                        </td>

                        {/* Daily Highest Week in 03 */}
                        <td className="p-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {row.dailyHighest03.toFixed(2)}
                        </td>

                        {/* Week 04 */}
                        <td
                          className={`p-2.5 text-right font-mono font-bold ${
                            row.week04 > 60
                              ? "text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {row.week04.toFixed(2)}
                        </td>

                        {/* Daily Highest Week in 04 */}
                        <td className="p-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {row.dailyHighest04.toFixed(2)}
                        </td>

                        {/* Week 05 */}
                        <td className="p-2.5 text-right font-mono text-slate-800 dark:text-slate-200">
                          {row.week05.toFixed(2)}
                        </td>

                        {/* Daily Highest Week in 05 */}
                        <td className="p-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {row.dailyHighest05.toFixed(2)}
                        </td>

                        {/* AVG */}
                        <td className="p-2.5 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.avg.toFixed(2)}
                        </td>

                        {/* Weekly Highest Working Hours Including OT */}
                        <td
                          className={`p-2.5 text-right font-mono font-black ${
                            row.weeklyHighestIncOT > 60
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {row.weeklyHighestIncOT.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={22} className="p-10 text-center text-slate-500 dark:text-slate-400 font-medium text-xs">
                        No working hour data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {sortedData.length > 0 ? (
                  <>Showing 1 to {sortedData.length} of {sortedData.length} entries</>
                ) : (
                  <>Showing 0 to 0 of 0 entries</>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* PDF Export Modal */}
      <HRReportPdfModal
        isOpen={isReportPdfModalOpen}
        onClose={() => setIsReportPdfModalOpen(false)}
        reportTitle={`Working Hour Analysis Report — ${appliedFilters.month} ${appliedFilters.year}`}
        companyName="Pakiza Knit Composite Ltd"
        dateRange={`Department: ${appliedFilters.department} | Option: ${appliedFilters.option}`}
        columns={pdfColumns}
        data={sortedData}
      />
    </div>
  );
}

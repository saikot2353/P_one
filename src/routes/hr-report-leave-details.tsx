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
  RefreshCw,
  SlidersHorizontal,
  X,
  Eye,
  Download,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/hr-report-leave-details")({
  head: () => ({
    meta: [
      { title: "Leave Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "View detailed employee leave logs, duration, leave types, and approval status.",
      },
    ],
  }),
  component: LeaveReportDetailsPage,
});

export interface LeaveReportItem {
  id: string;
  empIdOffc: string;
  name: string;
  department: string;
  section: string;
  designation: string;
  unit: string;
  line: string;
  startDate: string;
  endDate: string;
  leaveCount: number;
  leaveType: string;
  leaveStatus: "Approved" | "Pending" | "Rejected";
  type: string;
}

const INITIAL_DATA: LeaveReportItem[] = [
  {
    id: "2023043446",
    empIdOffc: "N/A",
    name: "Md. Imran Sharif",
    department: "Human Resources",
    section: "Human Resources",
    designation: "Sr. Officer",
    unit: "N/A",
    line: "N/A",
    startDate: "26/09/2026",
    endDate: "27/09/2026",
    leaveCount: 2,
    leaveType: "CL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2018011914",
    empIdOffc: "2018011914",
    name: "Shamim Ahmed",
    department: "Human Resources",
    section: "Human Resources",
    designation: "Assistant Manager",
    unit: "N/A",
    line: "N/A",
    startDate: "23/09/2026",
    endDate: "24/09/2026",
    leaveCount: 2,
    leaveType: "CL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2015004955",
    empIdOffc: "2015004955",
    name: "Md. Monirul Islam",
    department: "Maintenance",
    section: "Maintenance Utility & Textile",
    designation: "Deputy Manager",
    unit: "N/A",
    line: "N/A",
    startDate: "22/09/2026",
    endDate: "24/09/2026",
    leaveCount: 3,
    leaveType: "CL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2016003533",
    empIdOffc: "2016003533",
    name: "Md. Aminur Rahman",
    department: "Admin and Compliance",
    section: "Security",
    designation: "Officer",
    unit: "N/A",
    line: "N/A",
    startDate: "21/09/2026",
    endDate: "21/09/2026",
    leaveCount: 1,
    leaveType: "CL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2025057416",
    empIdOffc: "N/A",
    name: "Nipa Das",
    department: "Admin and Compliance",
    section: "Welfare",
    designation: "Welfare Officer",
    unit: "N/A",
    line: "N/A",
    startDate: "20/09/2026",
    endDate: "20/09/2026",
    leaveCount: 1,
    leaveType: "SL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2025056561",
    empIdOffc: "N/A",
    name: "Arman Hossain Juwel",
    department: "Admin and Compliance",
    section: "Admin and Compliance",
    designation: "Officer",
    unit: "N/A",
    line: "N/A",
    startDate: "20/09/2026",
    endDate: "21/09/2026",
    leaveCount: 2,
    leaveType: "SL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2022032904",
    empIdOffc: "N/A",
    name: "Md. Shamim Reza",
    department: "Human Resources",
    section: "Human Resources",
    designation: "Sr. Officer",
    unit: "N/A",
    line: "N/A",
    startDate: "20/09/2026",
    endDate: "23/09/2026",
    leaveCount: 4,
    leaveType: "CL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2024052917",
    empIdOffc: "N/A",
    name: "Md. Sofiul Alam",
    department: "Marketing and Merchandising",
    section: "Marketing & Merchandising",
    designation: "Merchandiser",
    unit: "Unit-05",
    line: "N/A",
    startDate: "20/09/2026",
    endDate: "20/09/2026",
    leaveCount: 1,
    leaveType: "CL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2018012820",
    empIdOffc: "2018012820",
    name: "Md.Abdullah Al Mamun",
    department: "Marketing and Merchandising",
    section: "Marketing & Merchandising",
    designation: "Deputy Manager",
    unit: "Unit-03",
    line: "N/A",
    startDate: "20/09/2026",
    endDate: "20/09/2026",
    leaveCount: 1,
    leaveType: "CL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2017008576",
    empIdOffc: "2017008576",
    name: "Md. Shariful Islam",
    department: "Maintenance",
    section: "Maintenance Utility & Textile",
    designation: "Sr. Manager (EMS & Energy)",
    unit: "Unit-01",
    line: "N/A",
    startDate: "19/09/2026",
    endDate: "20/09/2026",
    leaveCount: 2,
    leaveType: "CL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2024052679",
    empIdOffc: "N/A",
    name: "Md. Sagar Howlader",
    department: "Human Resources",
    section: "Human Resources",
    designation: "Officer",
    unit: "N/A",
    line: "N/A",
    startDate: "17/09/2026",
    endDate: "17/09/2026",
    leaveCount: 1,
    leaveType: "CL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2016004632",
    empIdOffc: "2016004632",
    name: "Md. Kamruzzaman",
    department: "Admin and Compliance",
    section: "General Store (MCD)",
    designation: "Officer",
    unit: "N/A",
    line: "N/A",
    startDate: "17/09/2026",
    endDate: "17/09/2026",
    leaveCount: 1,
    leaveType: "CL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2016003493",
    empIdOffc: "2016003493",
    name: "Md. Mahatab Uddin Buiyan",
    department: "Admin and Compliance",
    section: "Admin and Compliance",
    designation: "Deputy Manager",
    unit: "N/A",
    line: "N/A",
    startDate: "17/09/2026",
    endDate: "17/09/2026",
    leaveCount: 1,
    leaveType: "CL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2025054850",
    empIdOffc: "N/A",
    name: "Md. Rifat Hasan",
    department: "Merchandising Supply Chain",
    section: "Merchandising Supply Chain",
    designation: "Officer",
    unit: "N/A",
    line: "N/A",
    startDate: "17/09/2026",
    endDate: "17/09/2026",
    leaveCount: 1,
    leaveType: "CL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2016003779",
    empIdOffc: "2016003779",
    name: "Sree Juntu Kumar",
    department: "Maintenance",
    section: "Maintenance Utility & Textile",
    designation: "Sr. Officer",
    unit: "N/A",
    line: "N/A",
    startDate: "16/09/2026",
    endDate: "16/09/2026",
    leaveCount: 1,
    leaveType: "SL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2025057578",
    empIdOffc: "N/A",
    name: "Abdul Mukit",
    department: "Merchandising Supply Chain",
    section: "Merchandising Supply Chain",
    designation: "Officer",
    unit: "N/A",
    line: "N/A",
    startDate: "16/09/2026",
    endDate: "16/09/2026",
    leaveCount: 1,
    leaveType: "SL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2016001089",
    empIdOffc: "2016001089",
    name: "Md. Rokonuzzaman",
    department: "Marketing and Merchandising",
    section: "Marketing & Merchandising",
    designation: "Manager",
    unit: "Unit-06",
    line: "N/A",
    startDate: "16/09/2026",
    endDate: "16/09/2026",
    leaveCount: 1,
    leaveType: "CL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
  {
    id: "2016003589",
    empIdOffc: "2016003589",
    name: "Md. Gulzar Hossain",
    department: "Maintenance (RMG)",
    section: "Maintenance RMG",
    designation: "Manager",
    unit: "N/A",
    line: "N/A",
    startDate: "15/09/2026",
    endDate: "17/09/2026",
    leaveCount: 3,
    leaveType: "CL",
    leaveStatus: "Approved",
    type: "Office Executive",
  },
];

const TYPES = ["Office Executive", "Production Staff", "Management", "Worker", "ALL"];
const DEPARTMENTS = [
  "ALL",
  "Human Resources",
  "Maintenance",
  "Admin and Compliance",
  "Marketing and Merchandising",
  "Merchandising Supply Chain",
  "Maintenance (RMG)",
];
const SECTIONS = [
  "ALL",
  "Human Resources",
  "Maintenance Utility & Textile",
  "Security",
  "Welfare",
  "Admin and Compliance",
  "Marketing & Merchandising",
  "General Store (MCD)",
  "Merchandising Supply Chain",
  "Maintenance RMG",
];
const UNITS = ["ALL", "N/A", "Unit-01", "Unit-02", "Unit-03", "Unit-05", "Unit-06"];
const LINES = ["ALL", "N/A", "01", "02", "05", "10"];
const DESIGNATIONS = [
  "ALL",
  "Officer",
  "Sr. Officer",
  "Merchandiser",
  "Welfare Officer",
  "Assistant Manager",
  "Deputy Manager",
  "Manager",
  "Sr. Manager (EMS & Energy)",
];
const REPORT_TYPES = ["Employee wise Summary", "Details Log", "Date Wise Summary"];

export function LeaveReportDetailsPage() {
  // Filter States
  const [dateFrom, setDateFrom] = useState("2026-09-01");
  const [dateTo, setDateTo] = useState("2026-09-30");
  const [type, setType] = useState("Office Executive");
  const [department, setDepartment] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [reportType, setReportType] = useState("Employee wise Summary");
  const [employeeIdCsv, setEmployeeIdCsv] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");
  const [tableSearch, setTableSearch] = useState("");

  // Modal State
  const [selectedRecord, setSelectedRecord] = useState<LeaveReportItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Active Applied Filters
  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: "2026-09-01",
    dateTo: "2026-09-30",
    type: "Office Executive",
    department: "ALL",
    section: "ALL",
    unit: "ALL",
    line: "ALL",
    designation: "ALL",
    reportType: "Employee wise Summary",
    employeeIdCsv: "",
    idType: "System" as "System" | "Office",
  });

  const handleSearch = () => {
    setAppliedFilters({
      dateFrom,
      dateTo,
      type,
      department,
      section,
      unit,
      line,
      designation,
      reportType,
      employeeIdCsv,
      idType,
    });
    toast.success("Generating Leave Report...");
  };

  const handleReset = () => {
    setDateFrom("2026-09-01");
    setDateTo("2026-09-30");
    setType("Office Executive");
    setDepartment("ALL");
    setSection("ALL");
    setUnit("ALL");
    setLine("ALL");
    setDesignation("ALL");
    setReportType("Employee wise Summary");
    setEmployeeIdCsv("");
    setIdType("System");
    setTableSearch("");
    setAppliedFilters({
      dateFrom: "2026-09-01",
      dateTo: "2026-09-30",
      type: "Office Executive",
      department: "ALL",
      section: "ALL",
      unit: "ALL",
      line: "ALL",
      designation: "ALL",
      reportType: "Employee wise Summary",
      employeeIdCsv: "",
      idType: "System",
    });
    toast.info("Leave Report filters reset.");
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return INITIAL_DATA.filter((item) => {
      if (appliedFilters.type !== "ALL" && item.type !== appliedFilters.type) return false;
      if (appliedFilters.department !== "ALL" && item.department !== appliedFilters.department)
        return false;
      if (appliedFilters.section !== "ALL" && item.section !== appliedFilters.section) return false;
      if (appliedFilters.unit !== "ALL" && item.unit !== appliedFilters.unit) return false;
      if (appliedFilters.line !== "ALL" && item.line !== appliedFilters.line) return false;
      if (appliedFilters.designation !== "ALL" && item.designation !== appliedFilters.designation)
        return false;

      if (appliedFilters.employeeIdCsv.trim()) {
        const idList = appliedFilters.employeeIdCsv
          .split(",")
          .map((id) => id.trim().toLowerCase())
          .filter(Boolean);
        const itemId = appliedFilters.idType === "System" ? item.id : item.empIdOffc;
        if (!idList.some((id) => itemId.toLowerCase().includes(id))) return false;
      }

      if (tableSearch.trim()) {
        const query = tableSearch.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchId = item.id.includes(query) || item.empIdOffc.includes(query);
        const matchDept = item.department.toLowerCase().includes(query);
        const matchDesig = item.designation.toLowerCase().includes(query);
        if (!matchName && !matchId && !matchDept && !matchDesig) return false;
      }

      return true;
    });
  }, [appliedFilters, tableSearch]);

  const handleExportExcel = () => {
    const headers = [
      "ID",
      "Emp Id (off.)",
      "Name",
      "Department",
      "Section",
      "Designation",
      "Unit",
      "Line",
      "Start Date",
      "End Date",
      "Leave Count",
      "Leave Type",
      "Leave Status",
    ];

    const rows = filteredData.map((r) => [
      r.id,
      r.empIdOffc,
      r.name,
      r.department,
      r.section,
      r.designation,
      r.unit,
      r.line,
      r.startDate,
      r.endDate,
      r.leaveCount.toString(),
      r.leaveType,
      r.leaveStatus,
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
    link.setAttribute("download", `Leave_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Leave Report exported to Excel!");
  };

  const handlePrint = () => {
    toast.info("Opening browser print dialog...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-[1700px] mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <Link to="/hr-reports" className="hover:text-primary transition-colors">
              HR Reports
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Leave Report</span>
          </div>

          {/* Page Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <CalendarDays className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Leave Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Generate detailed employee leave logs, start/end dates, duration, leave type, and approval status.
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

          {/* Search & Filter Panel Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SlidersHorizontal className="size-4" />
              <span>Search & Filter Criteria</span>
            </div>

            {/* Filter Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 text-xs">
              {/* 1. Date From */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Date From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* 2. Date To */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Date To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* 3. Type */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Department */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Section */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Unit */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* 7. Line */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Line
                </label>
                <select
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {LINES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* 8. Designation */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Designation
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {DESIGNATIONS.map((ds) => (
                    <option key={ds} value={ds}>
                      {ds}
                    </option>
                  ))}
                </select>
              </div>

              {/* 9. Report Type */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {REPORT_TYPES.map((rt) => (
                    <option key={rt} value={rt}>
                      {rt}
                    </option>
                  ))}
                </select>
              </div>

              {/* 10. Employee Id (Comma Separator) */}
              <div className="space-y-1 col-span-1 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Employee Id (Comma Separator)
                  </label>
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="idType"
                        checked={idType === "System"}
                        onChange={() => setIdType("System")}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>System</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="idType"
                        checked={idType === "Office"}
                        onChange={() => setIdType("Office")}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Office</span>
                    </label>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 2023043446, 2018011914"
                  value={employeeIdCsv}
                  onChange={(e) => setEmployeeIdCsv(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Search Trigger Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
              >
                <Search className="size-4" />
                <span>SEARCH REPORT</span>
              </button>
            </div>
          </div>

          {/* Action Toolbar & Results Table Card */}
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
                  onClick={() => {
                    setSelectedRecord(filteredData[0] || null);
                    setIsPreviewOpen(true);
                  }}
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

            {/* Data Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-xs text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Emp Id (off.)</th>
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Department</th>
                    <th className="p-2.5">Section</th>
                    <th className="p-2.5">Designation</th>
                    <th className="p-2.5">Unit</th>
                    <th className="p-2.5">Line</th>
                    <th className="p-2.5">Start Date</th>
                    <th className="p-2.5">End Date</th>
                    <th className="p-2.5 text-center">Leave Count</th>
                    <th className="p-2.5 text-center">Leave Type</th>
                    <th className="p-2.5">Leave Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.id}
                        </td>
                        <td className="p-2.5 font-mono text-slate-700 dark:text-slate-300">
                          {row.empIdOffc}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                          {row.name}
                        </td>
                        <td className="p-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                          {row.department}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.section}</td>
                        <td className="p-2.5 text-slate-700 dark:text-slate-300">
                          {row.designation}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.unit}</td>
                        <td className="p-2.5 text-slate-500">{row.line}</td>
                        <td className="p-2.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {row.startDate}
                        </td>
                        <td className="p-2.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {row.endDate}
                        </td>
                        <td className="p-2.5 text-center font-mono font-black text-slate-900 dark:text-white">
                          {row.leaveCount}
                        </td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-black ${
                              row.leaveType === "CL"
                                ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                : row.leaveType === "SL"
                                ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                                : "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                            }`}
                          >
                            {row.leaveType}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                            {row.leaveStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={13} className="p-8 text-center text-slate-400 dark:text-slate-500">
                        No leave records found matching the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing 1 to {filteredData.length} of {filteredData.length} entries
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedRecord(filteredData[0] || null);
                    setIsPreviewOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Eye className="size-3.5" />
                  <span>VIEW (PDF)</span>
                </button>

                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-600 hover:bg-lime-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>EXPORT (EXCEL)</span>
                </button>

                <div className="flex items-center gap-1 text-xs">
                  <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">
                    Previous
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold">
                    1
                  </button>
                  <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Report Preview Modal */}
      {isPreviewOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 relative shadow-2xl space-y-4">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="size-4" />
            </button>

            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 text-center">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
                LEAVE APPLICATION SLIP
              </h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                Pakiza Software Limited
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                <span className="text-slate-500">Employee Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedRecord.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Department
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedRecord.department}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Designation
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedRecord.designation}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40">
                  <span className="block text-[10px] uppercase font-bold text-indigo-600">
                    Leave Type & Days
                  </span>
                  <span className="text-sm font-black text-indigo-700 dark:text-indigo-300">
                    {selectedRecord.leaveType} ({selectedRecord.leaveCount} Days)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40">
                  <span className="block text-[10px] uppercase font-bold text-emerald-600">
                    Duration
                  </span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    {selectedRecord.startDate} to {selectedRecord.endDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  toast.success("Downloading Leave Slip...");
                  setIsPreviewOpen(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Download className="size-4" />
                <span>DOWNLOAD PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  ChevronRight,
  FileSpreadsheet,
  Printer,
  FileText,
  Search,
  RotateCcw,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Building2,
  Users,
  FileDown,
  Eye,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/hr-report-monthly-attendance")({
  head: () => ({
    meta: [
      { title: "Monthly Attendance Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "View, analyze, and export monthly employee attendance logs, day-by-day matrix, and absenteeism summaries.",
      },
    ],
  }),
  component: MonthlyAttendanceReportPage,
});

export interface MonthlyAttendanceRecord {
  sl: number;
  empId: string;
  empIdOffc: string;
  name: string;
  department: string;
  section: string;
  designation: string;
  unit: string;
  line: string;
  employeeType: string;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
  holidayDays: number;
  otHours: number;
  payableDays: number;
  attendancePct: number;
  // Day by day logs (1..30)
  dailyStatus: Record<number, "P" | "A" | "L" | "CL" | "SL" | "EL" | "H" | "W">;
}

const SAMPLE_MONTHLY_DATA: MonthlyAttendanceRecord[] = [
  {
    sl: 1,
    empId: "2026061937",
    empIdOffc: "2026061937",
    name: "Md. Jahidul Islam",
    department: "Implementation & Business Analysis",
    section: "Accounts & Finance",
    designation: "Executive",
    unit: "Unit-01",
    line: "N/A",
    employeeType: "Office Executive",
    workingDays: 26,
    presentDays: 23,
    absentDays: 1,
    lateDays: 2,
    leaveDays: 2,
    holidayDays: 4,
    otHours: 14.5,
    payableDays: 29,
    attendancePct: 95.8,
    dailyStatus: {
      1: "P", 2: "P", 3: "P", 4: "P", 5: "W", 6: "P", 7: "P", 8: "L", 9: "P", 10: "P",
      11: "W", 12: "P", 13: "P", 14: "CL", 15: "CL", 16: "P", 17: "P", 18: "W", 19: "A", 20: "P",
      21: "L", 22: "P", 23: "P", 24: "P", 25: "W", 26: "P", 27: "P", 28: "P", 29: "P", 30: "H",
    },
  },
  {
    sl: 2,
    empId: "2025054609",
    empIdOffc: "2025054609",
    name: "Md Mahir Shahriyar",
    department: "Business Innovation",
    section: "Human Resources",
    designation: "Jr. Executive",
    unit: "Unit-01",
    line: "N/A",
    employeeType: "Office Executive",
    workingDays: 26,
    presentDays: 21,
    absentDays: 3,
    lateDays: 4,
    leaveDays: 2,
    holidayDays: 4,
    otHours: 8.0,
    payableDays: 27,
    attendancePct: 87.5,
    dailyStatus: {
      1: "P", 2: "L", 3: "A", 4: "P", 5: "W", 6: "P", 7: "P", 8: "P", 9: "L", 10: "A",
      11: "W", 12: "P", 13: "P", 14: "P", 15: "SL", 16: "SL", 17: "P", 18: "W", 19: "P", 20: "L",
      21: "A", 22: "P", 23: "P", 24: "L", 25: "W", 26: "P", 27: "P", 28: "P", 29: "P", 30: "H",
    },
  },
  {
    sl: 3,
    empId: "2026090102",
    empIdOffc: "2026090102",
    name: "Nusrat Jahan",
    department: "Software Development",
    section: "ICT",
    designation: "Sr. Executive",
    unit: "Unit-02",
    line: "N/A",
    employeeType: "Office Executive",
    workingDays: 26,
    presentDays: 24,
    absentDays: 0,
    lateDays: 1,
    leaveDays: 2,
    holidayDays: 4,
    otHours: 22.0,
    payableDays: 30,
    attendancePct: 100.0,
    dailyStatus: {
      1: "P", 2: "P", 3: "P", 4: "P", 5: "W", 6: "P", 7: "P", 8: "P", 9: "P", 10: "P",
      11: "W", 12: "P", 13: "CL", 14: "CL", 15: "P", 16: "P", 17: "P", 18: "W", 19: "P", 20: "P",
      21: "P", 22: "L", 23: "P", 24: "P", 25: "W", 26: "P", 27: "P", 28: "P", 29: "P", 30: "H",
    },
  },
  {
    sl: 4,
    empId: "2026090511",
    empIdOffc: "2026090511",
    name: "Tanvir Ahmed",
    department: "Accounts & Finance",
    section: "Accounts",
    designation: "Officer",
    unit: "Unit-01",
    line: "N/A",
    employeeType: "Office Staff",
    workingDays: 26,
    presentDays: 20,
    absentDays: 5,
    lateDays: 3,
    leaveDays: 1,
    holidayDays: 4,
    otHours: 5.5,
    payableDays: 25,
    attendancePct: 80.8,
    dailyStatus: {
      1: "A", 2: "A", 3: "P", 4: "P", 5: "W", 6: "A", 7: "P", 8: "L", 9: "P", 10: "P",
      11: "W", 12: "P", 13: "P", 14: "A", 15: "A", 16: "P", 17: "P", 18: "W", 19: "P", 20: "L",
      21: "P", 22: "CL", 23: "P", 24: "L", 25: "W", 26: "P", 27: "P", 28: "P", 29: "P", 30: "H",
    },
  },
  {
    sl: 5,
    empId: "2026091244",
    empIdOffc: "2026091244",
    name: "Mst. Farhana Akter",
    department: "Human Resources",
    section: "Human Resources",
    designation: "Assistant Manager",
    unit: "Unit-03",
    line: "N/A",
    employeeType: "Management",
    workingDays: 26,
    presentDays: 25,
    absentDays: 0,
    lateDays: 0,
    leaveDays: 1,
    holidayDays: 4,
    otHours: 18.0,
    payableDays: 30,
    attendancePct: 100.0,
    dailyStatus: {
      1: "P", 2: "P", 3: "P", 4: "P", 5: "W", 6: "P", 7: "P", 8: "P", 9: "P", 10: "P",
      11: "W", 12: "P", 13: "P", 14: "P", 15: "P", 16: "P", 17: "CL", 18: "W", 19: "P", 20: "P",
      21: "P", 22: "P", 23: "P", 24: "P", 25: "W", 26: "P", 27: "P", 28: "P", 29: "P", 30: "H",
    },
  },
  {
    sl: 6,
    empId: "2026091889",
    empIdOffc: "2026091889",
    name: "Sk. Ariful Islam",
    department: "IT Infrastructure",
    section: "ICT",
    designation: "System Administrator",
    unit: "Unit-01",
    line: "N/A",
    employeeType: "Office Executive",
    workingDays: 26,
    presentDays: 18,
    absentDays: 6,
    lateDays: 5,
    leaveDays: 2,
    holidayDays: 4,
    otHours: 12.0,
    payableDays: 24,
    attendancePct: 73.0,
    dailyStatus: {
      1: "A", 2: "A", 3: "L", 4: "P", 5: "W", 6: "A", 7: "L", 8: "P", 9: "A", 10: "L",
      11: "W", 12: "P", 13: "CL", 14: "CL", 15: "P", 16: "A", 17: "L", 18: "W", 19: "A", 20: "L",
      21: "P", 22: "P", 23: "P", 24: "P", 25: "W", 26: "P", 27: "P", 28: "P", 29: "P", 30: "H",
    },
  },
  {
    sl: 7,
    empId: "2026081015",
    empIdOffc: "2026081015",
    name: "Kazi Anamul Haq",
    department: "Supply Chain",
    section: "Procurement and Supply Chain",
    designation: "Logistics Executive",
    unit: "Unit-04",
    line: "01",
    employeeType: "Production Executive",
    workingDays: 26,
    presentDays: 22,
    absentDays: 2,
    lateDays: 1,
    leaveDays: 2,
    holidayDays: 4,
    otHours: 35.0,
    payableDays: 28,
    attendancePct: 91.6,
    dailyStatus: {
      1: "P", 2: "P", 3: "P", 4: "P", 5: "W", 6: "P", 7: "P", 8: "P", 9: "A", 10: "P",
      11: "W", 12: "P", 13: "P", 14: "P", 15: "P", 16: "CL", 17: "CL", 18: "W", 19: "A", 20: "L",
      21: "P", 22: "P", 23: "P", 24: "P", 25: "W", 26: "P", 27: "P", 28: "P", 29: "P", 30: "H",
    },
  },
  {
    sl: 8,
    empId: "2026072230",
    empIdOffc: "2026072230",
    name: "Farzana Rahman",
    department: "Quality Assurance",
    section: "Cutting Quality",
    designation: "Jr. Officer",
    unit: "Unit-02",
    line: "02",
    employeeType: "Production Staff",
    workingDays: 26,
    presentDays: 26,
    absentDays: 0,
    lateDays: 0,
    leaveDays: 0,
    holidayDays: 4,
    otHours: 42.0,
    payableDays: 30,
    attendancePct: 100.0,
    dailyStatus: {
      1: "P", 2: "P", 3: "P", 4: "P", 5: "W", 6: "P", 7: "P", 8: "P", 9: "P", 10: "P",
      11: "W", 12: "P", 13: "P", 14: "P", 15: "P", 16: "P", 17: "P", 18: "W", 19: "P", 20: "P",
      21: "P", 22: "P", 23: "P", 24: "P", 25: "W", 26: "P", 27: "P", 28: "P", 29: "P", 30: "H",
    },
  },
];

const MONTHS = [
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

const YEARS = ["2026", "2025", "2024", "2023", "2022"];

const EMPLOYEE_TYPES = [
  "ALL",
  "Office Executive",
  "Office Staff",
  "Production Staff",
  "Pcs Rate Worker",
  "Production Executive",
  "Worker",
  "Management",
  "Intern",
];

const DEPARTMENTS = [
  "All Departments",
  "Accounts & Finance",
  "Admin & Compliance",
  "Business Innovation",
  "Human Resources",
  "ICT",
  "Implementation & Business Analysis",
  "IT Infrastructure",
  "Marketing & Merchandising",
  "Quality Assurance",
  "Software Development",
  "Supply Chain",
];

const UNITS = ["ALL", "Unit-01", "Unit-02", "Unit-03", "Unit-04", "N/A"];

function MonthlyAttendanceReportPage() {
  const [selectedMonth, setSelectedMonth] = useState("September");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [department, setDepartment] = useState("All Departments");
  const [unit, setUnit] = useState("ALL");
  const [searchEmpId, setSearchEmpId] = useState("");
  const [activeTab, setActiveTab] = useState<"summary" | "grid" | "deptSummary">("summary");

  const filteredData = useMemo(() => {
    return SAMPLE_MONTHLY_DATA.filter((item) => {
      if (employeeType !== "ALL" && item.employeeType !== employeeType) return false;
      if (department !== "All Departments" && item.department !== department) return false;
      if (unit !== "ALL" && item.unit !== unit) return false;
      if (searchEmpId.trim()) {
        const query = searchEmpId.trim().toLowerCase();
        const matchesId = item.empId.toLowerCase().includes(query) || item.empIdOffc.toLowerCase().includes(query);
        const matchesName = item.name.toLowerCase().includes(query);
        if (!matchesId && !matchesName) return false;
      }
      return true;
    });
  }, [employeeType, department, unit, searchEmpId]);

  // Aggregate stats
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        acc.present += item.presentDays;
        acc.absent += item.absentDays;
        acc.late += item.lateDays;
        acc.leave += item.leaveDays;
        acc.ot += item.otHours;
        acc.payable += item.payableDays;
        return acc;
      },
      { present: 0, absent: 0, late: 0, leave: 0, ot: 0, payable: 0 }
    );
  }, [filteredData]);

  const handleReset = () => {
    setSelectedMonth("September");
    setSelectedYear("2026");
    setEmployeeType("ALL");
    setDepartment("All Departments");
    setUnit("ALL");
    setSearchEmpId("");
    toast.info("Filters reset to default.");
  };

  const handleExportExcel = () => {
    const headers = [
      "SL",
      "Emp ID",
      "Emp ID (Offc)",
      "Name",
      "Department",
      "Section",
      "Designation",
      "Unit",
      "Type",
      "Working Days",
      "Present",
      "Absent",
      "Late",
      "Leave",
      "Holiday",
      "OT Hours",
      "Payable Days",
      "Attendance %",
    ];

    const rows = filteredData.map((r, i) => [
      (i + 1).toString(),
      r.empId,
      r.empIdOffc,
      r.name,
      r.department,
      r.section,
      r.designation,
      r.unit,
      r.employeeType,
      r.workingDays.toString(),
      r.presentDays.toString(),
      r.absentDays.toString(),
      r.lateDays.toString(),
      r.leaveDays.toString(),
      r.holidayDays.toString(),
      r.otHours.toFixed(1),
      r.payableDays.toString(),
      `${r.attendancePct.toFixed(1)}%`,
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
    link.setAttribute("href", url);
    link.setAttribute("download", `Monthly_Attendance_Report_${selectedMonth}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel CSV export generated successfully!");
  };

  const handlePrint = () => {
    window.print();
  };

  const daysArray = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar />

        <main className="p-4 md:p-6 space-y-5 max-w-[1600px] w-full mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span>HR</span>
            <ChevronRight className="size-3 text-slate-400" />
            <Link to="/hr-reports" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              HR Reports
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Monthly Attendance Report
            </span>
          </div>

          {/* Top Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                <CalendarDays className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Monthly Attendance Details Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Consolidated monthly attendance summary, day-by-day status matrix, OT hours, and payable day metrics.
                </p>
              </div>
            </div>

            {/* Export & Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="size-4" />
                <span>Excel</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Printer className="size-4" />
                <span>Print</span>
              </button>
              <button
                onClick={() => toast.success("PDF report generated!")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <FileText className="size-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Records</span>
                <Users className="size-4 text-indigo-500" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {filteredData.length}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Total Present</span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {totals.present} <span className="text-xs font-normal text-slate-400">days</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Total Absent</span>
                <XCircle className="size-4 text-rose-500" />
              </div>
              <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                {totals.absent} <span className="text-xs font-normal text-slate-400">days</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Total Late</span>
                <Clock className="size-4 text-amber-500" />
              </div>
              <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                {totals.late} <span className="text-xs font-normal text-slate-400">times</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Total OT</span>
                <BarChart3 className="size-4 text-indigo-500" />
              </div>
              <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                {totals.ot.toFixed(1)} <span className="text-xs font-normal text-slate-400">hrs</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Payable Days</span>
                <Calendar className="size-4 text-purple-500" />
              </div>
              <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                {totals.payable} <span className="text-xs font-normal text-slate-400">days</span>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Search className="size-4" />
              <span>Search & Filter Parameters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs">
              {/* Month */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee Type */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Employee Type</label>
                <select
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {EMPLOYEE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
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

              {/* Unit */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Unit</label>
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

              {/* Employee ID / Name */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Search Emp ID / Name</label>
                <input
                  type="text"
                  value={searchEmpId}
                  onChange={(e) => setSearchEmpId(e.target.value)}
                  placeholder="e.g. 2026061937"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Filter Action Buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Filtered: <span className="font-bold text-slate-900 dark:text-white">{filteredData.length}</span> employees
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset Filters</span>
                </button>
                <button
                  onClick={() => toast.success(`Applied filters for ${selectedMonth} ${selectedYear}`)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Search className="size-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* View Options Tabs & Content Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            {/* View Selector Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "summary"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Monthly Summary View
                </button>
                <button
                  onClick={() => setActiveTab("grid")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "grid"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Day-by-Day Grid Matrix (1-30)
                </button>
                <button
                  onClick={() => setActiveTab("deptSummary")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "deptSummary"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Department Summary Breakdown
                </button>
              </div>

              <div className="text-xs font-semibold text-slate-500">
                Period: <span className="text-slate-900 dark:text-white font-bold">{selectedMonth} {selectedYear}</span>
              </div>
            </div>

            {/* TAB 1: Monthly Summary View */}
            {activeTab === "summary" && (
              <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                    <tr>
                      <th className="p-3 text-center">SL</th>
                      <th className="p-3">Emp ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Designation</th>
                      <th className="p-3">Unit</th>
                      <th className="p-3 text-center">Work Days</th>
                      <th className="p-3 text-center text-emerald-600 dark:text-emerald-400">Present (P)</th>
                      <th className="p-3 text-center text-rose-600 dark:text-rose-400">Absent (A)</th>
                      <th className="p-3 text-center text-amber-600 dark:text-amber-400">Late (L)</th>
                      <th className="p-3 text-center text-purple-600 dark:text-purple-400">Leave</th>
                      <th className="p-3 text-center text-blue-600 dark:text-blue-400">Holiday</th>
                      <th className="p-3 text-center">OT (Hrs)</th>
                      <th className="p-3 text-center">Payable Days</th>
                      <th className="p-3 text-center">Attn %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredData.length > 0 ? (
                      filteredData.map((row, idx) => {
                        const hasHighAbsence = row.absentDays > 2;
                        return (
                          <tr
                            key={row.empId}
                            className={`transition-colors ${
                              hasHighAbsence
                                ? "bg-rose-50/70 dark:bg-rose-950/30 hover:bg-rose-100/70 dark:hover:bg-rose-900/40"
                                : "hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                            }`}
                          >
                            <td className={`p-3 text-center font-bold ${hasHighAbsence ? "text-rose-700 dark:text-rose-400" : "text-slate-500"}`}>
                              {idx + 1}
                            </td>
                            <td className={`p-3 font-mono font-bold ${hasHighAbsence ? "text-rose-700 dark:text-rose-400" : "text-indigo-600 dark:text-indigo-400"}`}>
                              {row.empId}
                            </td>
                            <td className={`p-3 font-bold ${hasHighAbsence ? "text-rose-700 dark:text-rose-300" : "text-slate-900 dark:text-white"}`}>
                              {row.name}
                            </td>
                            <td className={`p-3 font-medium ${hasHighAbsence ? "text-rose-700 dark:text-rose-300" : "text-slate-700 dark:text-slate-300"}`}>
                              {row.department}
                            </td>
                            <td className={`p-3 ${hasHighAbsence ? "text-rose-700 dark:text-rose-300" : "text-slate-600 dark:text-slate-400"}`}>
                              {row.designation}
                            </td>
                            <td className={`p-3 ${hasHighAbsence ? "text-rose-700 dark:text-rose-300" : "text-slate-600 dark:text-slate-400"}`}>
                              {row.unit}
                            </td>
                            <td className="p-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                              {row.workingDays}
                            </td>
                            <td className="p-3 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20">
                              {row.presentDays}
                            </td>
                            <td className={`p-3 text-center font-bold ${row.absentDays > 0 ? "text-rose-600 dark:text-rose-400 font-extrabold bg-rose-100/60 dark:bg-rose-950/40" : "text-slate-400"}`}>
                              {row.absentDays}
                            </td>
                            <td className={`p-3 text-center font-bold ${row.lateDays > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-400"}`}>
                              {row.lateDays}
                            </td>
                            <td className="p-3 text-center font-bold text-purple-600 dark:text-purple-400">
                              {row.leaveDays}
                            </td>
                            <td className="p-3 text-center font-medium text-blue-600 dark:text-blue-400">
                              {row.holidayDays}
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                              {row.otHours.toFixed(1)}
                            </td>
                            <td className="p-3 text-center font-extrabold text-indigo-600 dark:text-indigo-400">
                              {row.payableDays}
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  row.attendancePct >= 95
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                    : row.attendancePct >= 85
                                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                                    : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                }`}
                              >
                                {row.attendancePct.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={15} className="p-8 text-center text-slate-400 dark:text-slate-500">
                          No attendance data found for the selected parameters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: Day-by-Day Grid Matrix View */}
            {activeTab === "grid" && (
              <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                    <tr>
                      <th className="p-2 text-center sticky left-0 bg-slate-50 dark:bg-slate-800 z-10">SL</th>
                      <th className="p-2 sticky left-8 bg-slate-50 dark:bg-slate-800 z-10">Emp ID</th>
                      <th className="p-2 sticky left-28 bg-slate-50 dark:bg-slate-800 z-10 min-w-[140px]">Name</th>
                      {daysArray.map((day) => (
                        <th key={day} className="p-1.5 text-center min-w-[28px]">
                          {day}
                        </th>
                      ))}
                      <th className="p-2 text-center bg-slate-100 dark:bg-slate-800">P</th>
                      <th className="p-2 text-center bg-rose-100 dark:bg-rose-950 text-rose-700">A</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredData.map((row, idx) => (
                      <tr key={row.empId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2 text-center font-bold text-slate-500 sticky left-0 bg-white dark:bg-slate-900 z-10">
                          {idx + 1}
                        </td>
                        <td className="p-2 font-mono font-bold text-indigo-600 dark:text-indigo-400 sticky left-8 bg-white dark:bg-slate-900 z-10">
                          {row.empId}
                        </td>
                        <td className="p-2 font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px] sticky left-28 bg-white dark:bg-slate-900 z-10">
                          {row.name}
                        </td>
                        {daysArray.map((day) => {
                          const status = row.dailyStatus[day] || "P";
                          return (
                            <td key={day} className="p-1 text-center font-black text-[10px]">
                              <span
                                className={`inline-block w-6 py-0.5 rounded text-center ${
                                  status === "P"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                    : status === "A"
                                    ? "bg-rose-600 text-white font-extrabold shadow-xs"
                                    : status === "L"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                    : status === "W"
                                    ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                    : status === "H"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                }`}
                              >
                                {status}
                              </span>
                            </td>
                          );
                        })}
                        <td className="p-2 text-center font-extrabold text-emerald-600 bg-slate-50 dark:bg-slate-800">
                          {row.presentDays}
                        </td>
                        <td className="p-2 text-center font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-950/40">
                          {row.absentDays}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: Department Summary Breakdown */}
            {activeTab === "deptSummary" && (
              <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Department Name</th>
                      <th className="p-3 text-center">Total Employees</th>
                      <th className="p-3 text-center text-emerald-600">Total Present Days</th>
                      <th className="p-3 text-center text-rose-600">Total Absent Days</th>
                      <th className="p-3 text-center text-amber-600">Total Late Instances</th>
                      <th className="p-3 text-center text-indigo-600">Total OT Hours</th>
                      <th className="p-3 text-center">Avg Attendance %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                    {Array.from(new Set(filteredData.map((d) => d.department))).map((dept) => {
                      const deptRecords = filteredData.filter((d) => d.department === dept);
                      const totalEmp = deptRecords.length;
                      const totalP = deptRecords.reduce((acc, c) => acc + c.presentDays, 0);
                      const totalA = deptRecords.reduce((acc, c) => acc + c.absentDays, 0);
                      const totalL = deptRecords.reduce((acc, c) => acc + c.lateDays, 0);
                      const totalOT = deptRecords.reduce((acc, c) => acc + c.otHours, 0);
                      const avgPct =
                        deptRecords.reduce((acc, c) => acc + c.attendancePct, 0) / totalEmp;

                      return (
                        <tr key={dept} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 className="size-4 text-indigo-500" />
                            <span>{dept}</span>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300">
                            {totalEmp}
                          </td>
                          <td className="p-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                            {totalP}
                          </td>
                          <td className="p-3 text-center font-bold text-rose-600 dark:text-rose-400">
                            {totalA}
                          </td>
                          <td className="p-3 text-center font-bold text-amber-600 dark:text-amber-400">
                            {totalL}
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {totalOT.toFixed(1)} hrs
                          </td>
                          <td className="p-3 text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                              {avgPct.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Summary Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing 1 to {filteredData.length} of {filteredData.length} entries
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
                <button
                  onClick={() => toast.success("Downloading Monthly PDF Summary...")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer"
                >
                  <FileDown className="size-3.5" />
                  <span>EXPORT ALL (PDF)</span>
                </button>
                <div className="flex items-center gap-1 text-xs">
                  <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">
                    Previous
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold">
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
    </div>
  );
}

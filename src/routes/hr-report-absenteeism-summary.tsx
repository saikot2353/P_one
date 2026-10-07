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
  UserX,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  Building2,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/hr-report-absenteeism-summary")({
  head: () => ({
    meta: [
      { title: "Absenteeism Summary Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "View, analyze, and export employee absenteeism summary reports, working day breakdown, and attendance metrics.",
      },
    ],
  }),
  component: AbsenteeismSummaryReportPage,
});

export interface AbsenteeismRecord {
  sl: number;
  year: string;
  empId: string;
  empIdOffc?: string;
  empName: string;
  department: string;
  section: string;
  designation: string;
  workingDay: number;
  present: number;
  absent: number;
  holiday: number;
  leave: number;
  employeeType: string;
  unit: string;
  line: string;
  status: string;
}

const SAMPLE_ABSENTEEISM_DATA: AbsenteeismRecord[] = [
  { sl: 1, year: "2026", empId: "2014001070", empIdOffc: "2014001070", empName: "Kholil Ullah Roman", department: "Merchandising Supply Chain", section: "Merchandising Supply Chain", designation: "Manager", workingDay: 46, present: 44, absent: 0, holiday: 11, leave: 2, employeeType: "Management", unit: "Unit-01", line: "N/A", status: "Working" },
  { sl: 2, year: "2026", empId: "2014001235", empIdOffc: "2014001235", empName: "Md. Jahid Hasan", department: "RMG Operations", section: "Cutting", designation: "Deputy Manager", workingDay: 48, present: 47, absent: 1, holiday: 9, leave: 0, employeeType: "Office Executive", unit: "Unit-01", line: "N/A", status: "Working" },
  { sl: 3, year: "2026", empId: "2014001239", empIdOffc: "2014001239", empName: "Md. Nazrul Islam", department: "Planning Sourcing", section: "Cutting 1", designation: "Sr. Supervisor", workingDay: 48, present: 45, absent: 1, holiday: 9, leave: 2, employeeType: "Production Executive", unit: "Unit-01", line: "01", status: "Working" },
  { sl: 4, year: "2026", empId: "2014001253", empIdOffc: "2014001253", empName: "Jahangir Alam", department: "RMG Operations", section: "Cutting", designation: "Operator (Spr. Machine)", workingDay: 48, present: 48, absent: 0, holiday: 9, leave: 0, employeeType: "Worker", unit: "Unit-01", line: "02", status: "Working" },
  { sl: 5, year: "2026", empId: "2014001406", empIdOffc: "2014001406", empName: "Saiful Islam", department: "RMG Operations", section: "Cutting", designation: "Supervisor", workingDay: 48, present: 46, absent: 0, holiday: 9, leave: 2, employeeType: "Production Staff", unit: "Unit-01", line: "01", status: "Working" },
  { sl: 6, year: "2026", empId: "2014001411", empIdOffc: "2014001411", empName: "Maidul Islam", department: "RMG Operations", section: "Cutting", designation: "Cutter", workingDay: 48, present: 47, absent: 1, holiday: 9, leave: 0, employeeType: "Worker", unit: "Unit-01", line: "03", status: "Working" },
  { sl: 7, year: "2026", empId: "2014001415", empIdOffc: "2014001415", empName: "Moniruzzaman", department: "RMG Operations", section: "Cutting", designation: "Supervisor", workingDay: 48, present: 44, absent: 0, holiday: 9, leave: 4, employeeType: "Production Staff", unit: "Unit-01", line: "01", status: "Working" },
  { sl: 8, year: "2026", empId: "2014001418", empIdOffc: "2014001418", empName: "Robiul Islam", department: "RMG Operations", section: "Cutting", designation: "Supervisor", workingDay: 48, present: 48, absent: 0, holiday: 9, leave: 0, employeeType: "Production Staff", unit: "Unit-01", line: "02", status: "Working" },
  { sl: 9, year: "2026", empId: "2014001432", empIdOffc: "2014001432", empName: "Monir Hossen", department: "RMG Operations", section: "Cutting", designation: "Cutter", workingDay: 48, present: 45, absent: 3, holiday: 9, leave: 0, employeeType: "Worker", unit: "Unit-01", line: "03", status: "Working" },
  { sl: 10, year: "2026", empId: "2014001434", empIdOffc: "2014001434", empName: "Roman Miah", department: "RMG Operations", section: "Cutting", designation: "Cutter Man", workingDay: 48, present: 48, absent: 0, holiday: 9, leave: 0, employeeType: "Worker", unit: "Unit-01", line: "03", status: "Working" },
  { sl: 11, year: "2026", empId: "2014003530", empIdOffc: "2014003530", empName: "Md. Selim Reza Habib", department: "Knitting", section: "Knitting Production", designation: "Officer (Delivery)", workingDay: 52, present: 46, absent: 0, holiday: 5, leave: 6, employeeType: "Office Staff", unit: "Unit-02", line: "N/A", status: "Working" },
  { sl: 12, year: "2026", empId: "2014004718", empIdOffc: "2014004718", empName: "Sajib Bawali", department: "Industrial Engineering (I.E.)", section: "Industrial Engineering (I.E.)", designation: "Deputy Manager", workingDay: 48, present: 45, absent: 1, holiday: 9, leave: 2, employeeType: "Management", unit: "Unit-01", line: "N/A", status: "Working" },
  { sl: 13, year: "2026", empId: "2014005235", empIdOffc: "2014005235", empName: "Shefali Perveen", department: "Admin and Compliance", section: "Welfare", designation: "Deputy Manager", workingDay: 48, present: 46, absent: 1, holiday: 9, leave: 1, employeeType: "Office Executive", unit: "Unit-01", line: "N/A", status: "Working" },
];

const YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"];

const MONTHS = [
  { val: "01", label: "01 — January" },
  { val: "02", label: "02 — February" },
  { val: "03", label: "03 — March" },
  { val: "04", label: "04 — April" },
  { val: "05", label: "05 — May" },
  { val: "06", label: "06 — June" },
  { val: "07", label: "07 — July" },
  { val: "08", label: "08 — August" },
  { val: "09", label: "09 — September" },
  { val: "10", label: "10 — October" },
  { val: "11", label: "11 — November" },
  { val: "12", label: "12 — December" },
];

const EMPLOYEE_TYPES = [
  "ALL",
  "Management",
  "Office Executive",
  "Production Executive",
  "Office Staff",
  "Production Staff",
  "Worker",
  "Pcs Rate Worker",
  "Intern",
];

const SECTIONS = [
  "ALL",
  "Accessories Store (MCD)",
  "Accessories Store 1",
  "Accounts",
  "Accounts & Finance",
  "Admin and Compliance",
  "Cutting",
  "Cutting 1",
  "Cutting Quality",
  "Dyeing Finishing",
  "Dyeing Lab",
  "Dyeing Production",
  "Finishing",
  "Human Resources",
  "ICT",
  "Industrial Engineering (I.E.)",
  "Knitting Production",
  "Maintenance",
  "Merchandising Supply Chain",
  "Planning Sourcing",
  "RMG Operations",
  "Sample",
  "Security",
  "Sewing",
  "Welfare",
  "Yarn Store (MCD)",
];

const UNITS = ["ALL", "N/A", "Unit-01", "Unit-02", "Unit-03", "Unit-04", "Unit-05", "Unit-06", "Unit-07", "Unit-08", "Unit-10"];

const LINES = ["ALL", "N/A", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];

function AbsenteeismSummaryReportPage() {
  const [empIdInput, setEmpIdInput] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [startMonth, setStartMonth] = useState("08");
  const [endMonth, setEndMonth] = useState("09");
  const [status, setStatus] = useState("Working");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [tableSearch, setTableSearch] = useState("");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const pdfColumns: ColumnDef<AbsenteeismRecord>[] = [
    { header: "SL", accessor: (_, idx) => idx + 1, align: "center", width: "40px" },
    { header: "ID", accessor: (r) => r.empId, align: "center" },
    { header: "Name", accessor: (r) => r.empName },
    { header: "Employee Type", accessor: (r) => r.employeeType },
    { header: "Department", accessor: (r) => r.department },
    { header: "Designation", accessor: (r) => r.designation },
    { header: "Working Days", accessor: (r) => r.workingDay, align: "center" },
    { header: "Present", accessor: (r) => r.present, align: "center" },
    { header: "Absent", accessor: (r) => r.absent, align: "center" },
    { header: "Leave", accessor: (r) => r.leave, align: "center" },
    { header: "Holiday", accessor: (r) => r.holiday, align: "center" },
  ];

  const filteredData = useMemo(() => {
    return SAMPLE_ABSENTEEISM_DATA.filter((item) => {
      if (selectedYear && item.year !== selectedYear) return false;
      if (employeeType !== "ALL" && item.employeeType !== employeeType) return false;
      if (section !== "ALL" && item.section !== section) return false;
      if (unit !== "ALL" && item.unit !== unit) return false;
      if (line !== "ALL" && item.line !== line) return false;
      if (status !== "ALL" && item.status !== status) return false;

      if (empIdInput.trim()) {
        const ids = empIdInput.split(",").map((s) => s.trim().toLowerCase());
        const targetId = (idType === "Office" && item.empIdOffc ? item.empIdOffc : item.empId).toLowerCase();
        if (!ids.some((id) => targetId.includes(id))) return false;
      }

      if (tableSearch.trim()) {
        const query = tableSearch.trim().toLowerCase();
        const matchName = item.empName.toLowerCase().includes(query);
        const matchDept = item.department.toLowerCase().includes(query);
        const matchSec = item.section.toLowerCase().includes(query);
        const matchDesig = item.designation.toLowerCase().includes(query);
        const matchId = item.empId.toLowerCase().includes(query);
        if (!matchName && !matchDept && !matchSec && !matchDesig && !matchId) return false;
      }

      return true;
    });
  }, [selectedYear, employeeType, section, unit, line, status, empIdInput, idType, tableSearch]);

  // Aggregate stats
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => {
        acc.workingDay += curr.workingDay;
        acc.present += curr.present;
        acc.absent += curr.absent;
        acc.holiday += curr.holiday;
        acc.leave += curr.leave;
        return acc;
      },
      { workingDay: 0, present: 0, absent: 0, holiday: 0, leave: 0 }
    );
  }, [filteredData]);

  const handleReset = () => {
    setEmpIdInput("");
    setIdType("System");
    setSelectedYear("2026");
    setStartMonth("08");
    setEndMonth("09");
    setStatus("Working");
    setEmployeeType("ALL");
    setSection("ALL");
    setDesignation("ALL");
    setUnit("ALL");
    setLine("ALL");
    setTableSearch("");
    toast.info("Filters reset to default.");
  };

  const handleExportExcel = () => {
    const headers = [
      "Sl",
      "Year",
      "EmpId",
      "Employee Name",
      "Department",
      "Section",
      "Designation",
      "Working Day",
      "Present",
      "Absent",
      "Holiday",
      "Leave",
    ];

    const rows = filteredData.map((r, i) => [
      (i + 1).toString(),
      r.year,
      r.empId,
      r.empName,
      r.department,
      r.section,
      r.designation,
      r.workingDay.toString(),
      r.present.toString(),
      r.absent.toString(),
      r.holiday.toString(),
      r.leave.toString(),
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
    link.setAttribute("download", `Absenteeism_Summary_Report_${selectedYear}_Months_${startMonth}-${endMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel CSV export downloaded successfully!");
  };

  const handlePrint = () => {
    window.print();
  };

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
              Absenteeism Summary Report
            </span>
          </div>

          {/* Top Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                <UserX className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Absenteeism & Attendance Summary Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Analyze employee working days, attendance compliance, total unexcused absences, holidays, and leave metrics.
                </p>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="size-4" />
                <span>EXCEL</span>
              </button>
              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Printer className="size-4" />
                <span>PRINT</span>
              </button>
              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <FileText className="size-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Employees</span>
                <Users className="size-4 text-indigo-500" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {filteredData.length}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Working Days</span>
                <Calendar className="size-4 text-indigo-500" />
              </div>
              <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                {totals.workingDay} <span className="text-xs font-normal text-slate-400">days</span>
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

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Total Leave</span>
                <Building2 className="size-4 text-purple-500" />
              </div>
              <div className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                {totals.leave} <span className="text-xs font-normal text-slate-400">days</span>
              </div>
            </div>
          </div>

          {/* Form Filter Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
                <Search className="size-4" />
                <span>Absenteeism Filter Criteria</span>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset All</span>
              </button>
            </div>

            {/* Row 1: Employee ID, ID Type Radio, Year, Start Month, End Month */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 text-xs">
              {/* Employee ID */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Employee Id <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={empIdInput}
                  onChange={(e) => setEmpIdInput(e.target.value)}
                  placeholder="Use Comma as Separator"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              {/* System / Office Radio */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  ID Type
                </label>
                <div className="flex items-center gap-4 mt-2 font-semibold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="idType"
                      checked={idType === "System"}
                      onChange={() => setIdType("System")}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    <span>System</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="idType"
                      checked={idType === "Office"}
                      onChange={() => setIdType("Office")}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    <span>Office</span>
                  </label>
                </div>
              </div>

              {/* Year */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Year <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Month */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Start Month <span className="text-rose-500">*</span>
                </label>
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  {MONTHS.map((m) => (
                    <option key={m.val} value={m.val}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* End Month */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  End Month <span className="text-rose-500">*</span>
                </label>
                <select
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  {MONTHS.map((m) => (
                    <option key={m.val} value={m.val}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Status Tag, Employee Type, Section, Designation, Unit, Line */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs">
              {/* Status */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Status
                </label>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                  <span className="bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1">
                    Working <span className="cursor-pointer font-extrabold hover:text-rose-600">×</span>
                  </span>
                </div>
              </div>

              {/* Employee Type */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Employee Type
                </label>
                <select
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  {EMPLOYEE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 uppercase"
                >
                  {SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Designation */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Designation
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="Manager">Manager</option>
                  <option value="Deputy Manager">Deputy Manager</option>
                  <option value="Sr. Supervisor">Sr. Supervisor</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Cutter">Cutter</option>
                  <option value="Cutter Man">Cutter Man</option>
                  <option value="Officer (Delivery)">Officer (Delivery)</option>
                </select>
              </div>

              {/* Unit */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Line
                </label>
                <select
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  {LINES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Blue SEARCH Button */}
            <div className="pt-2 flex justify-start">
              <button
                onClick={() => toast.success(`Search generated for ${selectedYear} (${startMonth} to ${endMonth})`)}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
              >
                <Search className="size-3.5" />
                <span>SEARCH</span>
              </button>
            </div>
          </div>

          {/* Data Table Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Table Search & Export Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Showing absenteeism summary records for:
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-extrabold uppercase">
                  {selectedYear} ({startMonth} - {endMonth})
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Search:</span>
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Search Name, ID, Section..."
                  className="w-full sm:w-64 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            {/* Table with Light Blue Header */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-[#bde0fe] dark:bg-sky-950 text-slate-800 dark:text-sky-200 uppercase tracking-wider font-bold border-b border-sky-300 dark:border-sky-800">
                  <tr>
                    <th className="p-3 text-center">Sl</th>
                    <th className="p-3 text-center">Year</th>
                    <th className="p-3">EmpId</th>
                    <th className="p-3">Employee Name</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Section</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3 text-center">Working Day</th>
                    <th className="p-3 text-center text-emerald-700 dark:text-emerald-400">Present</th>
                    <th className="p-3 text-center text-rose-700 dark:text-rose-400">Absent</th>
                    <th className="p-3 text-center text-blue-700 dark:text-blue-400">Holiday</th>
                    <th className="p-3 text-center text-purple-700 dark:text-purple-400">Leave</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                  {filteredData.length > 0 ? (
                    filteredData.map((row, idx) => {
                      const hasAbsence = row.absent > 0;
                      return (
                        <tr
                          key={row.empId}
                          className={`transition-colors ${
                            hasAbsence
                              ? "bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/60 dark:hover:bg-rose-900/30"
                              : "hover:bg-slate-50/90 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <td className={`p-3 text-center font-bold ${hasAbsence ? "text-rose-700 dark:text-rose-400" : "text-slate-500"}`}>
                            {idx + 1}
                          </td>
                          <td className="p-3 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                            {row.year}
                          </td>
                          <td className={`p-3 font-mono font-bold ${hasAbsence ? "text-rose-700 dark:text-rose-400" : "text-sky-600 dark:text-sky-400"}`}>
                            {row.empId}
                          </td>
                          <td className={`p-3 font-bold ${hasAbsence ? "text-rose-700 dark:text-rose-300" : "text-slate-900 dark:text-white"}`}>
                            {row.empName}
                          </td>
                          <td className="p-3 text-slate-700 dark:text-slate-300">
                            {row.department}
                          </td>
                          <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">
                            {row.section}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">
                            {row.designation}
                          </td>
                          <td className="p-3 text-center font-extrabold text-slate-800 dark:text-slate-200">
                            {row.workingDay}
                          </td>
                          <td className="p-3 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20">
                            {row.present}
                          </td>
                          <td className={`p-3 text-center font-bold ${hasAbsence ? "text-rose-600 dark:text-rose-400 font-extrabold bg-rose-100/70 dark:bg-rose-950/50" : "text-slate-400"}`}>
                            {row.absent}
                          </td>
                          <td className="p-3 text-center font-semibold text-blue-600 dark:text-blue-400">
                            {row.holiday}
                          </td>
                          <td className="p-3 text-center font-bold text-purple-600 dark:text-purple-400">
                            {row.leave}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={12} className="p-8 text-center text-slate-400 dark:text-slate-500">
                        No absenteeism records found matching filter parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Footer Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Showing 1 to {filteredData.length} of {filteredData.length} entries
                </span>
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs uppercase tracking-wider"
                >
                  <FileDown className="size-3.5" />
                  <span>VIEW(PDF)</span>
                </button>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold">
                <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1 rounded-lg bg-sky-600 text-white font-bold">
                  1
                </button>
                <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Official PDF / Print View Modal */}
      <HRReportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        reportTitle="Absenteeism Summary Report"
        companyName="Pakiza Knit Composite Ltd"
        dateRange={`Year: ${selectedYear} (${startMonth}/${selectedYear} - ${endMonth}/${selectedYear})`}
        columns={pdfColumns}
        data={filteredData}
      />
    </div>
  );
}

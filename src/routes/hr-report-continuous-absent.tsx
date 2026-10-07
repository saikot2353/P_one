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
  AlertTriangle,
  Calendar,
  Users,
  Building2,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/hr-report-continuous-absent")({
  head: () => ({
    meta: [
      { title: "Continuous Absent Report — CRIPTON HRIS" },
      {
        name: "description",
        content: "Track employees absent continuously for multiple consecutive working days.",
      },
    ],
  }),
  component: ContinuousAbsentReportPage,
});

export interface ContinuousAbsentRecord {
  sl: number;
  id: string;
  idOffc: string;
  name: string;
  empType: string;
  designation: string;
  department: string;
  section: string;
  line: string;
  grade: string;
  gender: "Male" | "Female";
  shift: string;
  joinDate: string;
  lastPresent: string;
  taDays: number;
  unit: string;
}

const SAMPLE_CONTINUOUS_ABSENT_DATA: ContinuousAbsentRecord[] = [
  { sl: 1, id: "2022041555", idOffc: "2022041555", name: "Md. Rubel", empType: "Worker", designation: "Jr. Lay Man", department: "RMG Operations", section: "Cutting", line: "N/A", grade: "A3", gender: "Male", shift: "General Shift", joinDate: "06/12/2022", lastPresent: "24/09/2026", taDays: 2, unit: "Unit-01" },
  { sl: 2, id: "2020021820", idOffc: "2020021820", name: "Md. Robiul Islam", empType: "Worker", designation: "Scissor Man", department: "RMG Operations", section: "Cutting", line: "N/A", grade: "A2", gender: "Male", shift: "General Shift", joinDate: "02/12/2020", lastPresent: "24/09/2026", taDays: 2, unit: "Unit-01" },
  { sl: 3, id: "2019016016", idOffc: "2019016016", name: "Md. Nasir Uddin", empType: "Office Staff", designation: "Cutter Man", department: "RMG Operations", section: "Cutting", line: "N/A", grade: "None", gender: "Male", shift: "General Shift", joinDate: "02/10/2019", lastPresent: "24/09/2026", taDays: 2, unit: "Unit-01" },
  { sl: 4, id: "2021031853", idOffc: "2021031853", name: "Md. Abu Sama", empType: "Production Executive", designation: "Asst. Officer", department: "Quality Assurance Department", section: "Cutting Quality", line: "N/A", grade: "None", gender: "Male", shift: "General Shift", joinDate: "02/12/2021", lastPresent: "22/09/2026", taDays: 4, unit: "Unit-01" },
  { sl: 5, id: "2023046297", idOffc: "2023046297", name: "Md Sohan Babu", empType: "Worker", designation: "Helper", department: "RMG Operations", section: "Printing", line: "N/A", grade: "A4", gender: "Male", shift: "General Shift", joinDate: "04/11/2023", lastPresent: "24/09/2026", taDays: 2, unit: "Unit-02" },
  { sl: 6, id: "2023045620", idOffc: "2023045620", name: "Md. Mizanur Rahman Minu", empType: "Office Staff", designation: "Cutter Man", department: "RMG Operations", section: "Cutting", line: "N/A", grade: "None", gender: "Male", shift: "General Shift", joinDate: "12/10/2023", lastPresent: "24/09/2026", taDays: 2, unit: "Unit-01" },
  { sl: 7, id: "2022036175", idOffc: "2022036175", name: "Nayan Das", empType: "Worker", designation: "Jr. Receive Man", department: "RMG Operations", section: "Cutting", line: "N/A", grade: "A3", gender: "Male", shift: "General Shift", joinDate: "14/05/2022", lastPresent: "24/09/2026", taDays: 2, unit: "Unit-01" },
  { sl: 8, id: "2021022881", idOffc: "2021022881", name: "Mst. Shahanaz Begum", empType: "Worker", designation: "Cleaner", department: "Admin and Compliance", section: "House Keeping", line: "N/A", grade: "B4", gender: "Female", shift: "General Shift", joinDate: "14/01/2021", lastPresent: "24/09/2026", taDays: 2, unit: "Unit-01" },
  { sl: 9, id: "2024052768", idOffc: "2024052768", name: "Kherot Chandra Roy", empType: "Office Staff", designation: "Sample Man", department: "Sample & CAD", section: "Sample", line: "N/A", grade: "None", gender: "Male", shift: "General Shift", joinDate: "11/11/2024", lastPresent: "24/09/2026", taDays: 2, unit: "Unit-03" },
  { sl: 10, id: "2024050095", idOffc: "2024050095", name: "Md Hosen Nazir", empType: "Worker", designation: "Helper", department: "RMG Operations", section: "Cutting", line: "N/A", grade: "A4", gender: "Male", shift: "General Shift", joinDate: "08/07/2024", lastPresent: "24/09/2026", taDays: 2, unit: "Unit-01" },
  { sl: 11, id: "2021028942", idOffc: "2021028942", name: "Md. Munsur Rahman", empType: "Worker", designation: "Jr. Bundle Man", department: "RMG Operations", section: "Cutting", line: "N/A", grade: "A3", gender: "Male", shift: "General Shift", joinDate: "04/10/2021", lastPresent: "24/09/2026", taDays: 2, unit: "Unit-01" },
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

const DEPARTMENTS = [
  "ALL",
  "Accessories Store (MCD)",
  "Accounts & Finance",
  "Admin and Compliance",
  "Cutting",
  "Dyeing Finishing",
  "House Keeping",
  "Human Resources",
  "Knitting Production",
  "Quality Assurance Department",
  "RMG Operations",
  "Sample & CAD",
];

const UNITS = ["ALL", "N/A", "Unit-01", "Unit-02", "Unit-03", "Unit-04", "Unit-05", "Unit-06", "Unit-07", "Unit-08", "Unit-10"];

const LINES = ["ALL", "N/A", "0", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];

function ContinuousAbsentReportPage() {
  const [fromDate, setFromDate] = useState("2026-09-26");
  const [company, setCompany] = useState("Pakiza Knit Composite Ltd");
  const [areaName, setAreaName] = useState("PKCL-Savar");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [department, setDepartment] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [minDays, setMinDays] = useState("2");
  const [searchEmpId, setSearchEmpId] = useState("");
  const [tableSearch, setTableSearch] = useState("");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const pdfColumns: ColumnDef<ContinuousAbsentRecord>[] = [
    { header: "SL", accessor: (_, idx) => idx + 1, align: "center", width: "40px" },
    { header: "ID", accessor: (r) => r.id, align: "center" },
    { header: "Name", accessor: (r) => r.name },
    { header: "Employee Type", accessor: (r) => r.empType },
    { header: "Department", accessor: (r) => r.department },
    { header: "Designation", accessor: (r) => r.designation },
    { header: "Unit", accessor: (r) => r.unit, align: "center" },
    { header: "Line", accessor: (r) => r.line, align: "center" },
    { header: "Grade", accessor: (r) => r.grade, align: "center" },
    { header: "J. Date", accessor: (r) => r.joinDate, align: "center" },
    { header: "Last Day", accessor: (r) => r.lastPresent, align: "center" },
    { header: "Days", accessor: (r) => r.taDays, align: "center" },
  ];

  const filteredData = useMemo(() => {
    return SAMPLE_CONTINUOUS_ABSENT_DATA.filter((item) => {
      if (employeeType !== "ALL" && item.empType !== employeeType) return false;
      if (department !== "ALL" && item.department !== department) return false;
      if (designation !== "ALL" && item.designation !== designation) return false;
      if (unit !== "ALL" && item.unit !== unit) return false;
      if (line !== "ALL" && item.line !== line) return false;
      if (minDays && item.taDays < parseInt(minDays, 10)) return false;

      if (searchEmpId.trim()) {
        const ids = searchEmpId.split(",").map((s) => s.trim().toLowerCase());
        const match = ids.some((id) => item.id.toLowerCase().includes(id) || item.idOffc.toLowerCase().includes(id));
        if (!match) return false;
      }

      if (tableSearch.trim()) {
        const query = tableSearch.trim().toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDept = item.department.toLowerCase().includes(query);
        const matchSec = item.section.toLowerCase().includes(query);
        const matchDesig = item.designation.toLowerCase().includes(query);
        if (!matchName && !matchDept && !matchSec && !matchDesig) return false;
      }

      return true;
    });
  }, [employeeType, department, designation, unit, line, minDays, searchEmpId, tableSearch]);

  // Aggregate stats
  const highRiskCount = useMemo(() => {
    return filteredData.filter((d) => d.taDays >= 4).length;
  }, [filteredData]);

  const handleReset = () => {
    setFromDate("2026-09-26");
    setEmployeeType("ALL");
    setDepartment("ALL");
    setDesignation("ALL");
    setUnit("ALL");
    setLine("ALL");
    setMinDays("2");
    setSearchEmpId("");
    setTableSearch("");
    toast.info("Filters reset to default.");
  };

  const handleExportExcel = () => {
    const headers = [
      "SL",
      "ID",
      "ID(Off.)",
      "Name",
      "EmpType",
      "Designation",
      "Department",
      "Section",
      "Line",
      "Grade",
      "Gender",
      "Shift",
      "Join Date",
      "Last Present",
      "T/A(Days)",
    ];

    const rows = filteredData.map((r, i) => [
      (i + 1).toString(),
      r.id,
      r.idOffc,
      r.name,
      r.empType,
      r.designation,
      r.department,
      r.section,
      r.line,
      r.grade,
      r.gender,
      r.shift,
      r.joinDate,
      r.lastPresent,
      r.taDays.toString(),
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
    link.setAttribute("download", `Continuous_Absent_Report_${fromDate}.csv`);
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
              Continuous Absent Report
            </span>
          </div>

          {/* Top Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                <AlertTriangle className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Continuous Absenteeism Log Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track employees absent continuously for multiple consecutive days, last present dates, and total unexcused absence duration.
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Continuous Absentees</span>
                <UserX className="size-4 text-rose-500" />
              </div>
              <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                {filteredData.length} <span className="text-xs font-normal text-slate-400">staff</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">High Risk (≥ 4 Days)</span>
                <AlertTriangle className="size-4 text-amber-500" />
              </div>
              <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                {highRiskCount} <span className="text-xs font-normal text-slate-400">staff</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Report Date</span>
                <Calendar className="size-4 text-indigo-500" />
              </div>
              <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-1.5">
                {fromDate}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Company & Region</span>
                <Building2 className="size-4 text-purple-500" />
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">
                {company}
              </div>
            </div>
          </div>

          {/* Form Filter Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                <Search className="size-4" />
                <span>Continuous Absent Search Parameters</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-rose-300 dark:border-rose-800">
                  Option: Continuous Absent
                </span>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer ml-2"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Row 1: From Date, Company, Area Name, Type, Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 text-xs">
              {/* From Date */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              {/* Company */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Company
                </label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="Pakiza Knit Composite Ltd">Pakiza Knit Composite Ltd</option>
                  <option value="Pakiza Software Ltd">Pakiza Software Ltd</option>
                </select>
              </div>

              {/* Area Name */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Area Name
                </label>
                <select
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="PKCL-Savar">PKCL-Savar</option>
                  <option value="PSL-Operation">PSL-Operation</option>
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Type
                </label>
                <select
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
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
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Job Title, Unit, Line, Days, Employee Id */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 text-xs">
              {/* Job Title / Designation */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Job Title
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="Jr. Lay Man">Jr. Lay Man</option>
                  <option value="Scissor Man">Scissor Man</option>
                  <option value="Cutter Man">Cutter Man</option>
                  <option value="Asst. Officer">Asst. Officer</option>
                  <option value="Helper">Helper</option>
                  <option value="Jr. Receive Man">Jr. Receive Man</option>
                  <option value="Cleaner">Cleaner</option>
                  <option value="Sample Man">Sample Man</option>
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  {LINES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Days */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Min Absent Days
                </label>
                <input
                  type="number"
                  value={minDays}
                  onChange={(e) => setMinDays(e.target.value)}
                  placeholder="e.g. 2"
                  min={1}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              {/* Employee Id */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Employee Id
                </label>
                <input
                  type="text"
                  value={searchEmpId}
                  onChange={(e) => setSearchEmpId(e.target.value)}
                  placeholder="Comma separated IDs"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
            </div>

            {/* Green SEARCH Button */}
            <div className="pt-2 flex justify-start">
              <button
                onClick={() => toast.success(`Search generated for continuous absent (>= ${minDays} days)`)}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
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
                  Continuous Absent Records:
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-extrabold uppercase">
                  {filteredData.length} Employees Found
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Search:</span>
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter table rows..."
                  className="w-full sm:w-64 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
            </div>

            {/* Continuous Absent Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-[#2c3e50] text-white uppercase tracking-wider font-bold border-b border-slate-700">
                  <tr>
                    <th className="p-3 text-center">SL</th>
                    <th className="p-3">ID</th>
                    <th className="p-3">ID(Off.)</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">EmpType</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Section</th>
                    <th className="p-3 text-center">Line</th>
                    <th className="p-3 text-center">Grade</th>
                    <th className="p-3 text-center">Gender</th>
                    <th className="p-3">Shift</th>
                    <th className="p-3 text-center">Join Date</th>
                    <th className="p-3 text-center">Last Present</th>
                    <th className="p-3 text-center bg-rose-900 text-rose-100 font-black">T/A(Days)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                  {filteredData.length > 0 ? (
                    filteredData.map((row, idx) => (
                      <tr
                        key={row.id}
                        className="bg-rose-50/60 dark:bg-rose-950/20 hover:bg-rose-100/70 dark:hover:bg-rose-900/30 transition-colors"
                      >
                        <td className="p-3 text-center font-bold text-rose-700 dark:text-rose-400">
                          {idx + 1}
                        </td>
                        <td className="p-3 font-mono font-bold text-rose-700 dark:text-rose-400">
                          {row.id}
                        </td>
                        <td className="p-3 font-mono font-bold text-rose-700 dark:text-rose-400">
                          {row.idOffc}
                        </td>
                        <td className="p-3 font-bold text-rose-900 dark:text-rose-100">
                          {row.name}
                        </td>
                        <td className="p-3 text-rose-800 dark:text-rose-300">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.empType === "Worker"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                            }`}
                          >
                            {row.empType}
                          </span>
                        </td>
                        <td className="p-3 text-rose-800 dark:text-rose-300">
                          {row.designation}
                        </td>
                        <td className="p-3 text-rose-800 dark:text-rose-300 font-semibold">
                          {row.department}
                        </td>
                        <td className="p-3 text-rose-800 dark:text-rose-300">
                          {row.section}
                        </td>
                        <td className="p-3 text-center text-slate-500">
                          {row.line}
                        </td>
                        <td className="p-3 text-center text-slate-600 dark:text-slate-400 font-mono">
                          {row.grade}
                        </td>
                        <td className="p-3 text-center text-slate-600 dark:text-slate-400">
                          {row.gender}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          {row.shift}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-600 dark:text-slate-400">
                          {row.joinDate}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                          {row.lastPresent}
                        </td>
                        <td className="p-3 text-center font-mono">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-xs">
                            {row.taDays}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={15} className="p-8 text-center text-slate-400 dark:text-slate-500">
                        No continuous absent records found matching criteria.
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
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-lime-600 hover:bg-lime-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs uppercase tracking-wider"
                >
                  <FileDown className="size-3.5" />
                  <span>VIEW(PDF)</span>
                </button>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold">
                <button className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1 rounded-lg bg-lime-600 text-white font-bold">
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
        reportTitle="Continous Absent Report"
        companyName={company}
        dateRange={`${fromDate} - ${fromDate}`}
        columns={pdfColumns}
        data={filteredData}
      />
    </div>
  );
}

const fs = require('fs');

const fileContent = `import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { HRReportPdfModal, ColumnDef } from "@/components/hr-reports/HRReportPdfModal";

export const Route = createFileRoute("/hr-report-continuous-absent")({
  head: () => ({
    meta: [
      { title: "Continous Absent — CRIPTON HRIS" },
      {
        name: "description",
        content: "Generate and export continuous absent details for employees.",
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
  gender: string;
  shift: string;
  joinDate: string;
  lastPresent: string;
  taDays: string;
  company: string;
  areaName: string;
  unit: string;
}

const INITIAL_DATA: ContinuousAbsentRecord[] = [
  {
    sl: 1,
    id: "2026061937",
    idOffc: "2026061937",
    name: "Md. Jahidul Islam",
    empType: "Permanent",
    designation: "Executive",
    department: "Implementation & Business Analysis",
    section: "HR Team",
    line: "N/A",
    grade: "Grade B",
    gender: "Male",
    shift: "PSL-EX",
    joinDate: "01/01/2026",
    lastPresent: "28/09/2026",
    taDays: "3",
    company: "Pakiza Software Limited",
    areaName: "PSL-Operation",
    unit: "PSL",
  },
  {
    sl: 2,
    id: "2025054609",
    idOffc: "2025054609",
    name: "Md Mahir Shahriyar",
    empType: "Permanent",
    designation: "Jr. Executive",
    department: "Business Innovation",
    section: "Project Resource & Strategy",
    line: "N/A",
    grade: "Grade C",
    gender: "Male",
    shift: "PSL-EX",
    joinDate: "15/05/2025",
    lastPresent: "27/09/2026",
    taDays: "4",
    company: "Pakiza Software Limited",
    areaName: "PSL-Operation",
    unit: "PSL",
  },
  {
    sl: 3,
    id: "2026090511",
    idOffc: "2026090511",
    name: "Tanvir Ahmed",
    empType: "Probationary",
    designation: "Officer",
    department: "Accounts & Finance",
    section: "Payroll Audit",
    line: "Line 1",
    grade: "Grade D",
    gender: "Male",
    shift: "PKG-Gen",
    joinDate: "10/09/2026",
    lastPresent: "29/09/2026",
    taDays: "2",
    company: "Pakiza Knit Group",
    areaName: "PKG-Operation",
    unit: "PKG",
  }
];

function ContinuousAbsentReportPage() {
  const [data, setData] = useState<ContinuousAbsentRecord[]>(INITIAL_DATA);
  
  // Form States corresponding to the screenshot
  const [fromDate, setFromDate] = useState("2026-10-01");
  const [company, setCompany] = useState("ALL");
  const [areaName, setAreaName] = useState("ALL");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [department, setDepartment] = useState("ALL");
  
  const [jobTitle, setJobTitle] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [days, setDays] = useState("2");
  const [employeeId, setEmployeeId] = useState("");
  
  const [option, setOption] = useState("Continous Absent");
  
  const [tableSearch, setTableSearch] = useState("");

  // Filtered State
  const [filteredData, setFilteredData] = useState<ContinuousAbsentRecord[]>(INITIAL_DATA);
  
  // PDF Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});

  const handleReset = () => {
    setFromDate("2026-10-01");
    setCompany("ALL");
    setAreaName("ALL");
    setEmployeeType("ALL");
    setDepartment("ALL");
    setJobTitle("ALL");
    setUnit("ALL");
    setLine("ALL");
    setDays("2");
    setEmployeeId("");
    setOption("Continous Absent");
    
    setTableSearch("");
    setFilteredData(data);
    toast.success("Filters reset successfully!");
  };

  const handleSearch = () => {
    const currentFilters = {
      fromDate,
      company,
      areaName,
      employeeType,
      department,
      jobTitle,
      unit,
      line,
      days,
      employeeId,
      option,
    };
    
    const filtered = data.filter((item) => {
      if (company !== "ALL" && item.company !== company) return false;
      if (areaName !== "ALL" && item.areaName !== areaName) return false;
      if (employeeType !== "ALL" && item.empType !== employeeType) return false;
      if (department !== "ALL" && item.department !== department) return false;
      if (jobTitle !== "ALL" && item.designation !== jobTitle) return false;
      if (unit !== "ALL" && item.unit !== unit) return false;
      if (line !== "ALL" && item.line !== line) return false;

      // Ensure TA days filter applies
      const itemDays = parseInt(item.taDays, 10);
      const filterDays = parseInt(days, 10);
      if (!isNaN(filterDays) && itemDays < filterDays) return false;

      if (employeeId.trim() !== "") {
        const ids = employeeId.split(",").map(id => id.trim());
        // For simplicity, checking either ID or ID(Off.)
        if (!ids.includes(item.id) && !ids.includes(item.idOffc)) return false;
      }

      return true;
    });

    setFilteredData(filtered);
    setAppliedFilters(currentFilters);
    
    if (filtered.length === 0) {
      toast.error("No records found matching the criteria");
    } else {
      toast.success("Found " + filtered.length + " records");
    }
  };

  const handleExportExcel = () => {
    toast.success("Excel report exported successfully!");
  };

  const handlePrint = () => {
    toast.info("Opening browser print dialog...");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // PDF Export definitions
  const pdfColumns: ColumnDef<ContinuousAbsentRecord>[] = [
    { header: "SL", accessor: (_, idx) => idx + 1, align: "center", width: "40px" },
    { header: "ID", accessor: (r) => r.id, align: "center" },
    { header: "ID(Off.)", accessor: (r) => r.idOffc, align: "center" },
    { header: "Name", accessor: (r) => r.name },
    { header: "EmpType", accessor: (r) => r.empType },
    { header: "Designation", accessor: (r) => r.designation },
    { header: "Department", accessor: (r) => r.department },
    { header: "Section", accessor: (r) => r.section },
    { header: "Line", accessor: (r) => r.line, align: "center" },
    { header: "Grade", accessor: (r) => r.grade, align: "center" },
    { header: "Gender", accessor: (r) => r.gender, align: "center" },
    { header: "Shift", accessor: (r) => r.shift, align: "center" },
    { header: "Join Date", accessor: (r) => r.joinDate, align: "center" },
    { header: "Last Present", accessor: (r) => r.lastPresent, align: "center" },
    { header: "T/A(Days)", accessor: (r) => r.taDays, align: "center" },
  ];

  const handlePdfExport = () => {
    if (filteredData.length === 0) {
      toast.error("No data available to export.");
      return;
    }
    if (Object.keys(appliedFilters).length === 0) {
      toast.error("Please perform a search first before exporting.");
      return;
    }
    setIsPdfModalOpen(true);
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
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              Continous Absent
            </span>
          </div>

          {/* Page Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
                <Clock className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Continous Absent Report
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Generate and export continuous absentee records and durations for all employees.
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

          {/* Comprehensive Search & Filter Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
              <SlidersHorizontal className="size-4" />
              <span>Search & Filter Criteria</span>
            </div>

            {/* Filter Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              
              {/* Row 1 */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Company
                </label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="Pakiza Knit Composite Ltd">Pakiza Knit Composite Ltd</option>
                  <option value="Pakiza Software Limited">Pakiza Software Limited</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Area Name
                </label>
                <select
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="PKCL-Savar">PKCL-Savar</option>
                  <option value="PSL-Operation">PSL-Operation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Type
                </label>
                <select
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Probationary">Probationary</option>
                  <option value="Contractual">Contractual</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="Implementation & Business Analysis">Implementation & Business Analysis</option>
                  <option value="Business Innovation">Business Innovation</option>
                  <option value="Accounts & Finance">Accounts & Finance</option>
                </select>
              </div>

              {/* Row 2 */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Job Title
                </label>
                <select
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="ALL">ALL</option>
                  <option value="Executive">Executive</option>
                  <option value="Jr. Executive">Jr. Executive</option>
                  <option value="Officer">Officer</option>
                </select>
              </div>

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
                  <option value="PSL">PSL</option>
                  <option value="PKG">PKG</option>
                </select>
              </div>

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
                  <option value="Line 1">Line 1</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Days
                </label>
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Employee Id <span className="text-[10px] font-normal text-slate-500">(use comma as separator)</span>
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. 2026061937"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              
              {/* Row 3 Option */}
              <div className="space-y-1 col-span-1 sm:col-span-2 lg:col-span-5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Option:
                </label>
                <label className="flex items-center gap-2 cursor-pointer w-max">
                  <input
                    type="radio"
                    name="option"
                    value="Continous Absent"
                    checked={option === "Continous Absent"}
                    onChange={() => setOption("Continous Absent")}
                    className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">Continous Absent</span>
                </label>
              </div>

            </div>

            {/* Search Trigger Button */}
            <div className="pt-2 flex justify-end border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95 mt-4"
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
                  onClick={handlePdfExport}
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
              <table className="w-full text-[11px] text-left border-collapse min-w-[1500px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2.5 w-12 text-center">SL</th>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">ID(Off.)</th>
                    <th className="p-2.5 min-w-[160px]">Name</th>
                    <th className="p-2.5">EmpType</th>
                    <th className="p-2.5">Designation</th>
                    <th className="p-2.5">Department</th>
                    <th className="p-2.5">Section</th>
                    <th className="p-2.5 text-center">Line</th>
                    <th className="p-2.5 text-center">Grade</th>
                    <th className="p-2.5 text-center">Gender</th>
                    <th className="p-2.5 text-center">Shift</th>
                    <th className="p-2.5 text-center">Join Date</th>
                    <th className="p-2.5 text-center">Last Present</th>
                    <th className="p-2.5 text-center">T/A(Days)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredData.length > 0 ? (
                    filteredData.map((row, idx) => (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {row.id}
                        </td>
                        <td className="p-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {row.idOffc}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                          {row.name}
                        </td>
                        <td className="p-2.5 text-slate-800 dark:text-slate-200">{row.empType}</td>
                        <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">
                          {row.designation}
                        </td>
                        <td className="p-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                          {row.department}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300">{row.section}</td>
                        <td className="p-2.5 text-slate-500 text-center">{row.line}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300 text-center">{row.grade}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300 text-center">{row.gender}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-300 text-center">{row.shift}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-400 text-center">{row.joinDate}</td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-400 text-center">{row.lastPresent}</td>
                        <td className="p-2.5 font-bold text-rose-600 dark:text-rose-400 text-center text-sm">
                          {row.taDays}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={15} className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/30">
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="h-8"></div>
        </main>
      </div>

      {/* Reusable PDF Modal */}
      <HRReportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        title="Continous Absent Report"
        subtitle="Employees missing attendance for multiple consecutive days"
        data={filteredData}
        columns={pdfColumns}
        filters={appliedFilters}
        layout="landscape"
      />
    </div>
  );
}

export default ContinuousAbsentReportPage;
`;

fs.writeFileSync('src/routes/hr-report-continuous-absent.tsx', fileContent, 'utf-8');
console.log("Successfully created hr-report-continuous-absent.tsx");

// Now update Sidebar.tsx
let sidebarContent = fs.readFileSync('src/components/dashboard/Sidebar.tsx', 'utf-8');
sidebarContent = sidebarContent.replace(/\r\n/g, '\n');
const sidebarTarget = '      { label: "Without In Out Attendance", to: "/hr-report-without-in-out-attendance" },';
const sidebarReplacement = sidebarTarget + '\n      { label: "Continous Absent", to: "/hr-report-continuous-absent" },';
if (sidebarContent.includes(sidebarTarget)) {
  fs.writeFileSync('src/components/dashboard/Sidebar.tsx', sidebarContent.replace(sidebarTarget, sidebarReplacement), 'utf-8');
  console.log("Updated Sidebar.tsx");
}

// Now update hr-reports.tsx
let hrReportsContent = fs.readFileSync('src/routes/hr-reports.tsx', 'utf-8');
hrReportsContent = hrReportsContent.replace(/\r\n/g, '\n');
const hrReportsTarget = '        {\n          title: "Without In Out Attendance",\n          icon: Clock,\n          desc: "Generate and export attendance report for employees missing proper in/out punches.",\n          to: "/hr-report-without-in-out-attendance",\n        },';
const hrReportsReplacement = hrReportsTarget + '\n        {\n          title: "Continous Absent",\n          icon: Clock,\n          desc: "Generate and export continuous absentee records and durations for all employees.",\n          to: "/hr-report-continuous-absent",\n        },';
if (hrReportsContent.includes(hrReportsTarget)) {
  fs.writeFileSync('src/routes/hr-reports.tsx', hrReportsContent.replace(hrReportsTarget, hrReportsReplacement), 'utf-8');
  console.log("Updated hr-reports.tsx");
}

// Update -changes-data.ts
let changesDataContent = fs.readFileSync('src/routes/-changes-data.ts', 'utf-8');
changesDataContent = changesDataContent.replace(/\r\n/g, '\n');
const newRecord = '  {\n    "id": "538",\n    "date": "' + new Date().toISOString().slice(0, 16) + '",\n    "type": "New Feature",\n    "module": "HR Reports (Continous Absent)",\n    "link": "/hr-report-continuous-absent",\n    "descriptionEn": "Implemented a new Continous Absent report page in the HR Reports section, enabling tracking of consecutive absentee streaks across all employees.",\n    "descriptionBn": "এইচআর রিপোর্টস সেকশনে নতুন Continous Absent রিপোর্ট পেজ যুক্ত করা হয়েছে, যার মাধ্যমে একটানা অনুপস্থিত কর্মীদের তালিকা এবং দিন সংখ্যা দেখা যাবে।"\n  },\n';
const changesDataTarget = 'export const DEFAULT_CHANGE_RECORDS: ChangeRecord[] = [\n';
if (changesDataContent.includes(changesDataTarget)) {
  fs.writeFileSync('src/routes/-changes-data.ts', changesDataContent.replace(changesDataTarget, changesDataTarget + newRecord), 'utf-8');
  console.log("Updated -changes-data.ts");
}

// Update changes.tsx
let changesContent = fs.readFileSync('src/routes/changes.tsx', 'utf-8');
changesContent = changesContent.replace(/system_changes_v552/g, 'system_changes_v553');
fs.writeFileSync('src/routes/changes.tsx', changesContent, 'utf-8');
console.log("Updated changes.tsx");

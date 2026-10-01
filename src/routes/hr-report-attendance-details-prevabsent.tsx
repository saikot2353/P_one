import { createFileRoute, Link } from "@tanstack/react-router";
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

export const Route = createFileRoute("/hr-report-attendance-details-prevabsent")({
  head: () => ({
    meta: [
      { title: "Attendance Details PrevAbsent — CRIPTON HRIS" },
      {
        name: "description",
        content: "Generate and export attendance details for previously absent employees.",
      },
    ],
  }),
  component: AttendanceDetailsPrevAbsentReportPage,
});

export interface PrevAbsentRecord {
  sl: number;
  empId: string;
  name: string;
  department: string;
  section: string;
  designation: string;
  unit: string;
  line: string;
  date: string;
  inTime: string;
  outDate: string;
  outTime: string;
  status: string;
  employeeType: string;
  shift: string;
  currentShift: string;
  jobNature: string;
  empIdOffc: string; // for the radio office filter
}

const INITIAL_DATA: PrevAbsentRecord[] = [
  {
    sl: 1,
    empId: "2026061937",
    empIdOffc: "2026061937",
    name: "Md. Jahidul Islam",
    department: "Implementation & Business Analysis",
    section: "HR Team",
    designation: "Executive",
    unit: "PSL",
    line: "N/A",
    date: "01/10/2026",
    inTime: "09:05 AM",
    outDate: "01/10/2026",
    outTime: "06:15 PM",
    status: "Present",
    employeeType: "Permanent",
    shift: "PSL-EX",
    currentShift: "PSL-EX",
    jobNature: "Permanent",
  },
  {
    sl: 2,
    empId: "2025054609",
    empIdOffc: "2025054609",
    name: "Md Mahir Shahriyar",
    department: "Business Innovation",
    section: "Project Resource & Strategy",
    designation: "Jr. Executive",
    unit: "PSL",
    line: "N/A",
    date: "01/10/2026",
    inTime: "09:20 AM",
    outDate: "01/10/2026",
    outTime: "07:00 PM",
    status: "Late",
    employeeType: "Permanent",
    shift: "PSL-EX",
    currentShift: "PSL-EX",
    jobNature: "Permanent",
  },
  {
    sl: 3,
    empId: "2026090511",
    empIdOffc: "2026090511",
    name: "Tanvir Ahmed",
    department: "Accounts & Finance",
    section: "Payroll Audit",
    designation: "Officer",
    unit: "PKG",
    line: "Line 1",
    date: "01/10/2026",
    inTime: "--:--",
    outDate: "--/--/----",
    outTime: "--:--",
    status: "Absent",
    employeeType: "Probationary",
    shift: "PKG-Gen",
    currentShift: "PKG-Gen",
    jobNature: "Probationary",
  }
];

function AttendanceDetailsPrevAbsentReportPage() {
  const [data, setData] = useState<PrevAbsentRecord[]>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Form States corresponding to the screenshot
  const [date, setDate] = useState("2026-10-01");
  const [employeeType, setEmployeeType] = useState("ALL");
  const [department, setDepartment] = useState("ALL");
  const [section, setSection] = useState("ALL");
  const [designation, setDesignation] = useState("ALL");
  const [unit, setUnit] = useState("ALL");
  const [line, setLine] = useState("ALL");
  const [shift, setShift] = useState("ALL");
  const [currentShift, setCurrentShift] = useState("ALL");
  const [jobNature, setJobNature] = useState("ALL");
  
  const [employeeId, setEmployeeId] = useState("");
  const [idType, setIdType] = useState<"System" | "Office">("System");

  // Filtered State
  const [filteredData, setFilteredData] = useState<PrevAbsentRecord[]>(INITIAL_DATA);
  
  // PDF Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});

  const handleSearch = () => {
    setIsLoading(true);

    setTimeout(() => {
      const currentFilters = {
        date,
        employeeType,
        department,
        section,
        designation,
        unit,
        line,
        shift,
        currentShift,
        jobNature,
        employeeId,
        idType,
      };
      
      const filtered = data.filter((item) => {
        if (employeeType !== "ALL" && item.employeeType !== employeeType) return false;
        if (department !== "ALL" && item.department !== department) return false;
        if (section !== "ALL" && item.section !== section) return false;
        if (designation !== "ALL" && item.designation !== designation) return false;
        if (unit !== "ALL" && item.unit !== unit) return false;
        if (line !== "ALL" && item.line !== line) return false;
        if (shift !== "ALL" && item.shift !== shift) return false;
        if (currentShift !== "ALL" && item.currentShift !== currentShift) return false;
        if (jobNature !== "ALL" && item.jobNature !== jobNature) return false;

        if (employeeId.trim() !== "") {
          const ids = employeeId.split(",").map(id => id.trim());
          if (idType === "System") {
            if (!ids.includes(item.empId)) return false;
          } else {
            if (!ids.includes(item.empIdOffc)) return false;
          }
        }

        return true;
      });

      setFilteredData(filtered);
      setAppliedFilters(currentFilters);
      setIsLoading(false);
      
      if (filtered.length === 0) {
        toast.error("No records found matching the criteria", {
          position: "top-center",
        });
      } else {
        toast.success(`Found ${filtered.length} records`, {
          position: "top-center",
        });
      }
    }, 600);
  };

  // PDF Export definitions
  const pdfColumns: ColumnDef<PrevAbsentRecord>[] = [
    { header: "SL", accessor: (_, idx) => idx + 1, align: "center", width: "40px" },
    { header: "Emp ID", accessor: (r) => r.empId, align: "center" },
    { header: "Name", accessor: (r) => r.name },
    { header: "Department", accessor: (r) => r.department },
    { header: "Section", accessor: (r) => r.section },
    { header: "Designation", accessor: (r) => r.designation },
    { header: "Unit", accessor: (r) => r.unit, align: "center" },
    { header: "Line", accessor: (r) => r.line, align: "center" },
    { header: "Date", accessor: (r) => r.date, align: "center" },
    { header: "In Time", accessor: (r) => r.inTime, align: "center" },
    { header: "Out Date", accessor: (r) => r.outDate, align: "center" },
    { header: "Out Time", accessor: (r) => r.outTime, align: "center" },
    { header: "Status", accessor: (r) => r.status, align: "center" },
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
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900/50 font-inter overflow-hidden selection:bg-indigo-500/30">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 flex flex-col min-w-0 h-full relative transition-all duration-300">
        <Topbar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          title="Attendance Details PrevAbsent" 
        />

        <div className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium">
                  <Link
                    to="/hr-reports"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
                  >
                    <FileSpreadsheet className="size-4" />
                    HR Reports
                  </Link>
                  <ChevronRight className="size-3" />
                  <span className="text-slate-800 dark:text-slate-200">Attendance Details PrevAbsent</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                  <Clock className="size-8 text-sky-500" />
                  Attendance Details PrevAbsent
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-2xl">
                  Review previously absent employees and view their in/out time details.
                </p>
              </div>
            </div>

            {/* Comprehensive Search & Filter Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
                <SlidersHorizontal className="size-4" />
                <span>Search & Filter Criteria</span>
              </div>

              {/* Filter Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 text-xs">
                
                {/* 1. Date */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* 2. Employee Type */}
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
                    <option value="Permanent">Permanent</option>
                    <option value="Probationary">Probationary</option>
                    <option value="Contractual">Contractual</option>
                  </select>
                </div>

                {/* 3. Department */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">All Departments</option>
                    <option value="Implementation & Business Analysis">Implementation & Business Analysis</option>
                    <option value="Business Innovation">Business Innovation</option>
                    <option value="Accounts & Finance">Accounts & Finance</option>
                  </select>
                </div>

                {/* 4. Section */}
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
                    <option value="HR Team">HR Team</option>
                    <option value="Project Resource & Strategy">Project Resource & Strategy</option>
                    <option value="Payroll Audit">Payroll Audit</option>
                  </select>
                </div>

                {/* 5. Designation */}
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
                    <option value="Executive">Executive</option>
                    <option value="Jr. Executive">Jr. Executive</option>
                    <option value="Officer">Officer</option>
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
                    <option value="ALL">ALL</option>
                    <option value="PSL">PSL</option>
                    <option value="PKG">PKG</option>
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
                    <option value="ALL">ALL</option>
                    <option value="N/A">N/A</option>
                    <option value="Line 1">Line 1</option>
                  </select>
                </div>

                {/* 8. Shift */}
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
                    <option value="PSL-EX">PSL-EX</option>
                    <option value="PKG-Gen">PKG-Gen</option>
                  </select>
                </div>
                
                {/* 9. Current Shift */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Current Shift
                  </label>
                  <select
                    value={currentShift}
                    onChange={(e) => setCurrentShift(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="PSL-EX">PSL-EX</option>
                    <option value="PKG-Gen">PKG-Gen</option>
                  </select>
                </div>

                {/* 10. Job Nature */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Job Nature
                  </label>
                  <select
                    value={jobNature}
                    onChange={(e) => setJobNature(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="ALL">ALL</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Probationary">Probationary</option>
                  </select>
                </div>

                {/* 11. Employee Id + Radio (Spans 2 columns) */}
                <div className="space-y-1 col-span-1 sm:col-span-2 xl:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                      Employee Id <span className="text-[10px] font-normal text-slate-500">(use comma as separator)</span>
                    </label>
                    <div className="flex items-center gap-3 text-[11px] font-bold">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="idType"
                          value="System"
                          checked={idType === "System"}
                          onChange={() => setIdType("System")}
                          className="accent-indigo-600"
                        />
                        <span className="text-slate-700 dark:text-slate-300">System</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="idType"
                          value="Office"
                          checked={idType === "Office"}
                          onChange={() => setIdType("Office")}
                          className="accent-indigo-600"
                        />
                        <span className="text-slate-700 dark:text-slate-300">Office</span>
                      </label>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="e.g. 2026061937, 2025054609"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-start gap-3">
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-xl shadow-xs transition-all disabled:opacity-70"
                >
                  {isLoading ? (
                    <RefreshCw className="size-4 animate-spin" />
                  ) : (
                    <Search className="size-4" />
                  )}
                  SEARCH
                </button>
              </div>
            </div>

            {/* Export Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-xs"
                >
                  <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
                  EXCEL
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-xs"
                >
                  <Printer className="size-4 text-slate-600 dark:text-slate-400" />
                  PRINT
                </button>
                <button
                  onClick={handlePdfExport}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-xs"
                >
                  <FileText className="size-4 text-rose-600 dark:text-rose-400" />
                  PDF
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Search:</span>
                <input
                  type="text"
                  placeholder="Filter results..."
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-[#b4d4f4] text-slate-700 border-b border-slate-300">
                    <tr>
                      <th className="px-4 py-3 font-bold border-r border-slate-300/50 w-12 text-center">
                        SL
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-300/50">
                        Emp ID
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-300/50 min-w-[180px]">
                        Name
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-300/50">
                        Department
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-300/50">
                        Section
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-300/50">
                        Designation
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-300/50 text-center">
                        Unit
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-300/50 text-center">
                        Line
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-300/50 text-center">
                        Date
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-300/50 text-center">
                        In Time
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-300/50 text-center">
                        Out Date
                      </th>
                      <th className="px-4 py-3 font-bold border-r border-slate-300/50 text-center">
                        Out Time
                      </th>
                      <th className="px-4 py-3 font-bold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <tr
                          key={item.empId}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                          <td className="px-4 py-2.5 font-medium text-slate-500 dark:text-slate-400 text-center border-r border-slate-100 dark:border-slate-800">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                            {item.empId}
                          </td>
                          <td className="px-4 py-2.5 border-r border-slate-100 dark:border-slate-800">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {item.name}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                            {item.department}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                            {item.section}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                            {item.designation}
                          </td>
                          <td className="px-4 py-2.5 font-bold text-indigo-600 dark:text-indigo-400 text-center border-r border-slate-100 dark:border-slate-800">
                            {item.unit}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-400 text-center border-r border-slate-100 dark:border-slate-800">
                            {item.line}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-400 text-center border-r border-slate-100 dark:border-slate-800">
                            {item.date}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-emerald-600 dark:text-emerald-400 text-center border-r border-slate-100 dark:border-slate-800">
                            {item.inTime}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-400 text-center border-r border-slate-100 dark:border-slate-800">
                            {item.outDate}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-amber-600 dark:text-amber-400 text-center border-r border-slate-100 dark:border-slate-800">
                            {item.outTime}
                          </td>
                          <td className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-200">
                            <span className={\`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider \${
                              item.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                              item.status === 'Absent' ? 'bg-rose-100 text-rose-700' :
                              'bg-amber-100 text-amber-700'
                            }\`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={13}
                          className="px-4 py-12 text-center text-slate-500 dark:text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/30"
                        >
                          No data available in table
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="h-8"></div>
          </div>
        </div>
      </main>

      {/* Reusable PDF Modal */}
      <HRReportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        title="Attendance Details PrevAbsent"
        subtitle="Report of previously absent employee attendance"
        data={filteredData}
        columns={pdfColumns}
        filters={appliedFilters}
        layout="landscape"
      />
    </div>
  );
}

export default AttendanceDetailsPrevAbsentReportPage;
